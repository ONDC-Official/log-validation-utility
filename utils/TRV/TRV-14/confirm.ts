import { logger } from '../../../shared/logger'
import { TRV14ApiSequence } from '../../../constants'
import { isObjectEmpty, validateSchema } from '../../../utils'
import { getValue, setValue } from '../../../shared/dao'
import { compareFulfillments, validateTagsStructure } from './TRV14checks'

// @ts-ignore
export const checkConfirm = (data: any, msgIdSet: any, version: any) => {
  const rsfObj: any = {}

  const { message, context }: any = data

  if (!data || isObjectEmpty(data)) {
    return { [TRV14ApiSequence.INIT]: 'JSON cannot be empty' }
  }

  try {
    logger.info(`Validating Schema for ${TRV14ApiSequence.CONFIRM} API`)
    const vs = validateSchema('trv14', TRV14ApiSequence.CONFIRM, data)

    if (vs != 'error') {
      Object.assign(rsfObj, vs)
    }

      //checking providerid
      const confirm =message.order
      const init_Context = getValue('init_context')
      const payments = getValue(`initpayments`)
      const prvdrid =  getValue(`oninitprvdrid`)
      const itemMap = getValue(`items`)
      const fulfillments = getValue(`initfullfilments`)

      if(confirm.provider.id !== prvdrid ){
       rsfObj.prvdrid = `provider id mismatches in init and on_select`
      }

      //checking messageId
      try {
        if(context.message_id === init_Context.message_id){
          rsfObj.msgId = `confirm and init message id cant be the same`
        }
      } catch (error) {
        logger.error(error)
      }

      //confirm items
      confirm.items.forEach((itm:any) => {
        
        if(!itm.parent_item_id){
          rsfObj[`${itm.id}`]=`item with id:${itm.id} missing parent_item_id`
        }
  
        if(itm.parent_item_id === ''){
          rsfObj[`${itm.id}`]=`item with id:${itm.id} can't have empty parent_item_id`
        }

       if(!itemMap.has(itm.id) ){
         rsfObj[itm.id] = `${itm.id} was not in select call  `
       }
       if(itm.quantity.selected.count !== itemMap.get(itm.id) ){
         rsfObj[itm.id] = `${itm.id} quantity changed from previous call  `
       }
      })

      // confirm fulfillments
      try {
        const fulfillmentError =  compareFulfillments(confirm.fulfillments,fulfillments)
        Object.assign(rsfObj,fulfillmentError)
      } catch (error) {
        logger.error(error)
      }


      //confirm  payment
        try {
          confirm.payments.forEach((itm:any)=>{
            if(itm.id !== payments[0].id){
              rsfObj.payment.id = `payment id mismatches with init call`
            }else if(itm.collected_by!== payments[0].collected_by){
              rsfObj.payment.collected_by = `payment collected_by mismatches with init call`
            }
            else if(itm.type !== payments[0].type){
              rsfObj.payment.type = `payment type mismatches with init call`
            }
          })
          setValue(`confirmpayment`,confirm.payments)
        } catch (error) {
          logger.error(error)
        }

      //validating tags
      try {
        const tagsError = validateTagsStructure(confirm.tags)
        Object.assign(rsfObj,tagsError)
      } catch (error) {
        logger.error(error)
      }

    setValue('confirm_context', context)
    setValue('confirm_message', message)

    return rsfObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${TRV14ApiSequence.CONFIRM} API!`)
    } else {
      console.log('Error occurred while checking /API:', err)
      logger.error(`!!Some error occurred while checking /${TRV14ApiSequence.CONFIRM} API`, err)
    }
  }
}
