import { validateQuote, validateXInput } from './TRV14checks'
import constants, { TRV14ApiSequence } from '../../../constants'
import { getValue, setValue } from '../../../shared/dao'
import { logger } from '../../../shared/logger'
import { isObjectEmpty, validateSchema } from '../../../utils'

// @ts-ignore
export const checkOnSelect1 = (data: any, msgIdSet: any, version: any) => {
  const rsfObj: any = {}
  const errorObj: any = {}
  const { message, context }: any = data

  if (!data || isObjectEmpty(data)) {
    return { [TRV14ApiSequence.ON_SELECT_1]: 'JSON cannot be empty' }
  }

  try {
    logger.info(`Validating Schema for ${TRV14ApiSequence.ON_SELECT_1} API`)
    const vs = validateSchema('trv14', TRV14ApiSequence.ON_SELECT_1, data)

    if (vs != 'error') {
      Object.assign(rsfObj, vs)
    }
    const onSelect = message.order
    const ItemMap = getValue(`items`)
    const prvdrId = getValue(`prvdrId`)
    const fulfillmentids = getValue(`fulfillmentids`)
    const itemAddOn = getValue(`addOnItems`)
    const Xinputmap = new Map()

    try {
      if (onSelect.provider.id !== prvdrId) {
        errorObj.prvdrId = `prvdrid mismatches in select and on_select`
      }
    } catch (error) {
      logger.error(error)
    }

    try {
      onSelect.items.forEach((itm:any)=>{
        if(itm.descriptor.code === 'ABSTRACT'){
          if(itm.price){
            rsfObj[`${itm.id}_price`] = `itm price should not be there` 
          }
          if(itm.quantity){
            rsfObj[`${itm.id}_quantity`] = `itm quantity should not be there` 
          }
        
         if(itm.parent_item_id === ''){
          rsfObj.parent_item_id = ` parent_item_id can't be empty string `
        }
          
        if(!itm.tags){
          rsfObj.parentitmtags = `parent item tags is missing`
        }
        else{
          itm.tags.forEach((itm: any)=>{
            const tags= ["INCLUSIONS","EXCLUSIONS"]
            if(!tags.includes(itm.descriptor.code)){
              rsfObj.tagsdescriptorcode =  `parent tags descriptior code is not valid`
            }
            let list =itm.list
            list.forEach((itm :any)=>{
              if(itm.value === '' ){
                rsfObj.list[`${itm}`] = `itm value can be empty string`
              }
            })
          })
        }
        }
        if(itm.descriptor.code === 'ENTRY_PASS'){
          if(itm.parent_item_id === ''){
            rsfObj[`${itm.id}`] = `${itm.id} can't have empty string parent_item_id`
          }
          if(!itm.parent_item_id){
            rsfObj[`${itm.id}`] = `${itm.id} should have parent_item_id`
          }
        }    
      })
    } catch (error) {
      logger.error(error)
    }

    onSelect.items.forEach((itm: any) => {
      if (itm.parent_item_id) {
        if (ItemMap.has(itm.id)) {
          if (itm.quantity.selected.count !== ItemMap.get(itm.id)) {
            rsfObj.item[itm.id] = `${itm.id} selected quantity mismatches on select and on_select`
          }
        } else {
          rsfObj.item[itm.id] = `${itm.id} does not exist in select`
        }
      }
    })

    //checking fulfillments id
    try {
      onSelect.fulfillments.forEach((itm: any) => {
        if (!fulfillmentids.includes(itm.id)) {
          errorObj.fulfmentId = `fulfillment id mismatched on select and on_select`
        }
        if(itm.agent.organization.contact.phone === '' ){
          errorObj.contact.phone = ` phone cant be empty string`
        }
        if(itm.agent.organization.contact.email === '' ){
          errorObj.contact.email = ` email cant be empty string`
        }
      })
    } catch (error) {
      logger.error(error)
    }


    //quote checking
    try {
      logger.info(`Checking quote details in /${constants.ON_SELECT}`)
      const quoteErrors = validateQuote(onSelect.quote, constants.ON_SELECT)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking Quote in /${constants.ON_SELECT},  ${error.message}`)
      return { error: error.message }
    }

    //checking quote
    try {
      onSelect.quote.breakup.forEach((itm: any) => {
        const allowed = ['BASE_FARE', 'ADD_ONS']

        // Ensure rsfObj.item is initialized
        if (!rsfObj.item) {
          rsfObj.item = {}
        }

        if (itm.title === 'ADD_ONS') {
          if (!itemAddOn.has(itm.item.id)) {
            rsfObj.item[itm.item.id] = `${itm.item.id} does not have addons property in items`
          }
        }

        if (itm.item && allowed.includes(itm.item.title)) {
          if (!ItemMap.has(itm.item.id)) {
            rsfObj.item[itm.item.id] = `${itm.item.id} does not exist in select`
          } else if (itm.item.quantity.selected.count !== ItemMap.get(itm.item.id)) {
            rsfObj.item[itm.item.id] = `${itm.item.id} selected quantity mismatches`
          }
        }
      })
    } catch (error) {
      logger.error(error)
    }

    //validating xinput
    try {
      onSelect.items.forEach((itm: any) => {
        const validateXinput = validateXInput(itm?.xinput)
        if (Xinputmap.get(itm.id)) {
          rsfObj.itm.id = `${itm.id} has been already in items`
        } else {
          Xinputmap.set(itm.id, itm.xinput)
        }
        Object.assign(rsfObj, validateXinput)
      })
    } catch (error) {
      logger.error(error)
    }

    setValue('onSelect1_context', context)
    setValue('onSelect1_message', message)
    setValue('agent', onSelect.fulfillments[0]?.agent)
    setValue('replacementterms', onSelect.replacement_terms)
    setValue('onselect1quote', onSelect.quote)
    setValue('onSelect1Items', onSelect.items)
    setValue('xinputmap', Xinputmap)
    Object.assign(rsfObj, errorObj)
    return rsfObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${TRV14ApiSequence.ON_SELECT_1} API!`)
    } else {
      console.log('Error occurred while checking /API:', err)
      logger.error(`!!Some error occurred while checking /${TRV14ApiSequence.ON_SELECT_1} API`, err)
    }
  }
}
