import constants, { TRV14ApiSequence } from '../../../constants'
import { getValue, setValue } from '../../../shared/dao'
import { logger } from '../../../shared/logger'
import { isObjectEmpty, validateSchema } from '../../../utils'
import {  compareonItems, compareQuote, compareReplacementTerms, validateQuote } from './TRV14checks'

// @ts-ignore
export const checkOnSelect2 = (data: any, msgIdSet: any, version: any) => {
  const rsfObj: any = {}
  const errorObj: any = {}

  const { message, context }: any = data


  if (!data || isObjectEmpty(data)) {
    return { [TRV14ApiSequence.ON_SELECT_2]: 'JSON cannot be empty' }
  }

  const replacement_terms=getValue('replacementterms')
  const Xinput= getValue(`onSelect1xinput`)
  const quote = getValue(`onselect1quote`)


  try {
    logger.info(`Validating Schema for ${TRV14ApiSequence.ON_SELECT_2} API`)
    const vs = validateSchema('trv14', TRV14ApiSequence.ON_SELECT_2, data)

    if (vs != 'error') {
      Object.assign(rsfObj, vs)
    }
    const onSelect = message.order
    const ItemMap= getValue(`items`)
    const prvdrId = getValue(`prvdrId`)
    const fulfillmentids = getValue(`select2fulfillmentids`)
    const items = getValue(`onSelect1Items`)

    if(onSelect.provider.id !== prvdrId){
      errorObj.prvdrId = `prvdrid mismatches in select and on_select`
    }

    //checking id and their quantity
    onSelect.items.forEach((itm:any)=>{
      if(itm.parent_item_id){
        if(ItemMap.has(itm.id)){
          if(itm.quantity.selected.count !==  ItemMap.get(itm.id)){
             errorObj.item.id=`${itm.id} selected quantity mismatches on select and on_select`
          }
        }
        else{
          errorObj.item.id=`${itm.id} doesnot exist in select`
        }
      }
    })

    //checking fulfillments id
    onSelect.fulfillments.forEach((itm: any)=>{
      if(!fulfillmentids.includes(itm.id)){
        errorObj.fulfmentId = `fulfillment id mismatched on select and on_select`
      }
      if(itm.agent.organization.contact.phone === '' ){
        errorObj.contact.phone = ` phone cant be empty string`
      }
      if(itm.agent.organization.contact.email === '' ){
        errorObj.contact.email = ` email cant be empty string`
      }
    })

    //quote checking
    try {
      logger.info(`Checking quote details in /${constants.ON_SELECT}`)
      const quoteErrors = validateQuote(onSelect.quote,constants.ON_SELECT)  
       Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking Quote in /${constants.ON_SELECT},  ${error.message}`)
      return { error: error.message }
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

    // comparinf quote breakup
    try {
      const quoteError = compareQuote(onSelect.quote,quote)
      Object.assign(rsfObj,quoteError)
    } catch (error) {
      logger.error(error)
    }

    // compareItems
    try {
      const ItemsError = compareonItems(onSelect.items,items)
      Object.assign(rsfObj,ItemsError)
    } catch (error) {
      logger.error(error)
    }

    // validating Xinput
    try {
      onSelect.items.forEach((itm: any) => {
        if (itm.xinput && itm.xinput.form?.id) {
          const xinputFormId = itm.xinput.form.id;
    
          const exists = items.some((existingItem: any) =>
            existingItem.xinput?.form?.id === Xinput.form.id
          );
    
          if (exists) {
            console.log(`Form with ID ${xinputFormId} already exists in items`);
          } else {
            console.log(`New form detected: ${xinputFormId}`);
          }
        }
      });
    } catch (error) {
      logger.error(error);
    }

    //checking diff in replacement terms
    const diff = compareReplacementTerms(onSelect.replacement_terms,replacement_terms)
    Object.assign(rsfObj,diff)

    setValue("onSelectquote",onSelect.quote)
    setValue("onSelect2items",onSelect.items)
    setValue("onSelect2fulfillment",onSelect.fulfillments)
    setValue('onSelect1_context', context)
    setValue('onSelect1_message', message)
    Object.assign(rsfObj, errorObj)
    return rsfObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${TRV14ApiSequence.ON_SELECT_2} API!`)
    } else {
      console.log('Error occurred while checking /API:', err)
      logger.error(`!!Some error occurred while checking /${TRV14ApiSequence.ON_SELECT_2} API`, err)
    }
  }
}
