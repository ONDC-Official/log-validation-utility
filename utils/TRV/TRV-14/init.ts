import { logger } from '../../../shared/logger'
import { TRV14ApiSequence } from '../../../constants'
import { isObjectEmpty, validateSchema } from '../../../utils'
import { getValue, setValue } from '../../../shared/dao'
import { compareFulfillments, compareItems, validateTagsStructure } from './TRV14checks'

// @ts-ignore
export const checkInit = (data: any, msgIdSet: any, version: any) => {
  const rsfObj: any = {}
 const itemMap =  getValue('items')
  const { message, context }: any = data

  if (!data || isObjectEmpty(data)) {
    return { [TRV14ApiSequence.INIT]: 'JSON cannot be empty' }
  }

  try {
    logger.info(`Validating Schema for ${TRV14ApiSequence.INIT} API`)
    const vs = validateSchema('trv14', TRV14ApiSequence.INIT, data)

    if (vs != 'error') {
      Object.assign(rsfObj, vs)
    }

 

    //checking providerid
     const init =message.order
     const prvdrid =  getValue(`select2prvdrId`)
     const fulfillment = getValue(`select2fulfillment`)
     const items = getValue(`select2items`)
     const select2Context = getValue('select2_context')


     if(prvdrid && init.provider.id !== prvdrid ){
      rsfObj.prvdrid = `provider id mismatches in init and on_select`
     }

    //comparing message_id
    try {
      if(context.message_id === select2Context.message_id){
        rsfObj.msgId = `init and select2 message id cant be the same`
      }
    } catch (error) {
      logger.error(error)
    }

     //init items
     try {
     init.items.forEach((itm:any) => {
      if(!itm.parent_item_id){
        rsfObj[`${itm.id}`]=`item with id:${itm.id} missing parent_item_id`
      }

      if(itm.parent_item_id === ''){
        rsfObj[`${itm.id}`]=`item with id:${itm.id} can't have empty parent_item_id`
      }

      if(!itemMap.has(itm.id) ){
        rsfObj.itm = `${itm.id} was not in select call  `
      }
      if(itm.quantity.selected.count !== itemMap.get(itm.id) ){
        rsfObj.itm = `${itm.id} quantity is changed from previous call's selected quantity  `
      }
     })
     } catch (error) {
      logger.error(error)
     }


     //compareItems
     try {
      const ItemsError = compareItems(init.items,items)
      Object.assign(rsfObj,ItemsError)
     } catch (error) {
      logger.error(error)
     }

     //compare fulfillments
     try {
      const fulfillmentError = compareFulfillments(init.fulfillments,fulfillment)
      Object.assign(rsfObj,fulfillmentError)
     } catch (error) {
      logger.error(error)
     }

     //init tags
     try {
      const tagsError =  validateTagsStructure(init.tags)
      Object.assign(rsfObj,tagsError)
     } catch (error) {
      logger.error(error)
     }


    setValue('initpayments',init.payments) 
    setValue('initfullfilments',init.fulfillments)
    setValue('initprvdrId',init.provider.id)
    setValue('init_context', context)
    setValue('init_message', message)

    return rsfObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${TRV14ApiSequence.INIT} API!`)
    } else {
      console.log('Error occurred while checking /API:', err)
      logger.error(`!!Some error occurred while checking /${TRV14ApiSequence.INIT} API`, err)
    }
  }
}
