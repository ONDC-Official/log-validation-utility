import { TRV14ApiSequence } from '../../../constants'
import { getValue, setValue } from '../../../shared/dao'
import { logger } from '../../../shared/logger'
import { isObjectEmpty, validateSchema } from '../../../utils'
import { compareFulfillments, compareItems } from './TRV14checks'

// @ts-ignore
export const checkSelect2 = (data: any, msgIdSet: any) => {
  const rsfObj: any = {}
  const fulfillmentIdsSet = new Set()
  const ItemMap = new Map();

  const { message, context }: any = data

  if (!data || isObjectEmpty(data)) {
    return { [TRV14ApiSequence.SELECT_2]: 'JSON cannot be empty' }
  }

  try {
    logger.info(`Validating Schema for ${TRV14ApiSequence.SELECT_2} API`)
    const vs = validateSchema('trv14', TRV14ApiSequence.SELECT_2, data)

    if (vs != 'error') {
      Object.assign(rsfObj, vs)
    }

    const select = message.order
    const Xinputmap = getValue(`xinputmap`)

    const items = getValue(`select1items`)
    const fulfillments = getValue(`select1fulfillments`)
    const prvdrid = getValue(`select1prvdrid`)
    //checking provider       
      try {
        if(select.provider.id === prvdrid){
          rsfObj.prvdrId = `prvdrId mismatch in select2 `
        }
      } catch (error) {
        logger.error(error)
      }
      setValue('select2prvdrId',select.provider.id)
      
      //checking items
      try {
        select.items.forEach((itm: any )=>{
          ItemMap.set(itm.id,itm.quantity.selected.count)
        })
        setValue(`select2items`,ItemMap)
      } catch (error) {
        
      }

      // comparing items
      try {
        const ItemsError= compareItems(select.items,items)
        Object.assign(rsfObj,ItemsError)
      } catch (error) {
        logger.error(error)
      }

      //compare fulfillment
      try {
        const ItemsError= compareFulfillments(select.fulfillments,fulfillments)
        Object.assign(rsfObj,ItemsError)
      } catch (error) {
        logger.error(error)
      }

      // checking xinput
      try {
        select.items.forEach((itm:any)=>{
        const xinput = itm.xinput
          if(Xinputmap.has(itm.id)){
           const Xinput = Xinputmap.get(itm.id)
           if(xinput.form.id !== Xinput.form.id){
            rsfObj[xinput.id] =  ` the xinput form dont't match`
           }
          }
        })
      } catch (error) {
        logger.error(error)
      }

      //fulfillment
      select.fulfillments.forEach((itm: any)=>{
        fulfillmentIdsSet.add(itm.id)
      })
      setValue(`select2fulfillmentids`,fulfillmentIdsSet)

    setValue('select2fulfillment',select.fulfillments)
    setValue('select2provider',select.provider)
    setValue('select2items',select.items)
    setValue('select2_context', context)
    setValue('select2_message', message)

    return rsfObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${TRV14ApiSequence.SELECT_2} API!`)
    } else {
      console.log('Error occurred while checking /API:', err)
      logger.error(`!!Some error occurred while checking /${TRV14ApiSequence.SELECT_2} API`, err)
    }
  }
}
