import { logger } from '../../../shared/logger'
import { TRV14ApiSequence } from '../../../constants'
import { isObjectEmpty, validateSchema } from '../../../utils'
import { getValue, setValue } from '../../../shared/dao'
import { comparePayments ,compareReplacementTerms , validateTagsStructure ,compareFulfillments, compareProviders, compareQuote, validateQuote, compareonItems } from './TRV14checks'
// @ts-ignore
export const checkOnConfirm = (data: any, msgIdSet: any, version: any, Flag: any) => {
  const rsfObj: any = {}

  const { context,message }: any = data

  if (!data || isObjectEmpty(data)) {
    return { [TRV14ApiSequence.ON_CONFIRM]: 'JSON cannot be empty' }
  }
  if(!Flag){
    try {
      logger.info(`Validating Schema for ${TRV14ApiSequence.ON_CONFIRM} API`)
      const vs = validateSchema('trv14', TRV14ApiSequence.ON_CONFIRM, data)
  
      if (vs != 'error') {
        Object.assign(rsfObj, vs)
      }
  
      const onConfirm = message.order

      const confirmpayment = getValue(`confirmpayment`)
      const replacementTerms = getValue(`replacementterms`)
      const fulfillment = getValue(`onInitfulfilments`)
      const provider = getValue(`onInitProvider`)
      const items =  getValue(`onInitItems`)
      const quote = getValue(`onInitquote`)
  
      //comparing items
      try{
        const itemerror = compareonItems(onConfirm.items,items)
        Object.assign(rsfObj,itemerror)
      }catch(error){
        logger.error(error)
      }
      

      try {
        onConfirm.items.forEach((itm:any)=>{
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
  
      //checking replacement terms
      try{
        const differror = compareReplacementTerms(onConfirm.replacement_terms,replacementTerms)
        Object.assign(rsfObj,differror)
      }catch(error ){
        logger.error(error)
      }
  
      //checking payments
      try {
       const paymentError = comparePayments(onConfirm.payments,confirmpayment)
       Object.assign(rsfObj,paymentError)
      } catch (error) {
        logger.error(error)
      }
  
      //checking tags
      try {
      const tagsError = validateTagsStructure(onConfirm.tags)
      Object.assign(rsfObj,tagsError)   
      } catch (error) {
        logger.error(error)
      }
  
      try {
        if(!onConfirm.created_at){
          rsfObj.created_at = `created at is missing`
        }
        if(!onConfirm.updated_at){
          rsfObj.updated_at = `updated at is missing`
        }
        if(onConfirm.created_at !== context.timestamp){
          rsfObj.created_at = `created should match with timestamp`
        }
        if(onConfirm.updated_at !== context.timestamp){
          rsfObj.updated_at = `updated should match with timestamp`
        }
      } catch (error) {
        logger.error(error)
      }

      //comparing fulfillments
      try {
        const fulfillmentError = compareFulfillments(onConfirm.fulfillments,fulfillment)
        Object.assign(rsfObj,fulfillmentError)
      } catch (error) {
        logger.error(error)
      }
  
      //compareprovider
      try {
       const providerError = compareProviders(onConfirm.provider,provider)
       Object.assign(rsfObj,providerError)
      } catch (error) {
        logger.error(error)
      }
  
      //validating quote
    try {

      const quoteErr = validateQuote(onConfirm.quote,'on_confirm')
       Object.assign(rsfObj,quoteErr)
       let totalsum = 0
 
      // ✅ Ensure rsfObj.quote is initialized
      if (!rsfObj.quote || typeof rsfObj.quote !== 'object') {
        rsfObj.quote = {}
      }
 
      onConfirm.quote.breakup.forEach((itm: any) => {
        const expectedValue = Number(itm.item.price.value) * Number(itm.item.quantity.selected.count)
        const actualValue = Number(itm.price.value)
 
        if (actualValue !== expectedValue) {
          rsfObj.quote[`${itm.item.id}`] = `${itm.item.id} ${expectedValue} value is not correct `
        } else {
          totalsum += expectedValue
        }
      })
 
      if (totalsum !== Number(onConfirm.quote.price.value)) {
        // ✅ Overwrite quote only if it's an object
        rsfObj.quote[`price`] = `quote breakup summation is not correct`
      }

      const quoteCompareError = compareQuote(onConfirm.quote,quote)
      Object.assign(rsfObj,quoteCompareError)
     } catch (error) {
       logger.error(error)
     }
      setValue(`onConfirmOrder`,message.order)
      setValue('onConfirmItems',onConfirm.items)
      setValue(`onConfirmfulfillments`,onConfirm.fulfillments)
      setValue('onConfirmprovider',onConfirm.provider)
      setValue('onConfirmpayments',onConfirm.payments)
      setValue('onConfirmquote',onConfirm.quote)
      setValue('onConfirmreplacement',onConfirm.replacement_terms)
  
      return rsfObj
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        logger.info(`!!File not found for /${TRV14ApiSequence.ON_CONFIRM} API!`)
      } else {
        console.log('Error occurred while checking /API:', err)
        logger.error(`!!Some error occurred while checking /${TRV14ApiSequence.ON_CONFIRM} API`, err)
      }
    }
  }
  else{
    try {
      logger.info(`Validating Schema for ${TRV14ApiSequence.ON_CONFIRM} API`)
      const vs = validateSchema('trv14', TRV14ApiSequence.ON_CONFIRM, data)
  
      if (vs != 'error') {
        Object.assign(rsfObj, vs)
      }
  
      const onConfirm = message.order
      
      try {
        onConfirm.items.forEach((itm:any)=>{
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
      
  
  
    //validating quote
    try {

     const quoteErr = validateQuote(onConfirm.quote,'on_confirm')
      Object.assign(rsfObj,quoteErr)
      let totalsum = 0

     // ✅ Ensure rsfObj.quote is initialized
     if (!rsfObj.quote || typeof rsfObj.quote !== 'object') {
       rsfObj.quote = {}
     }

     onConfirm.quote.breakup.forEach((itm: any) => {
       const expectedValue = Number(itm.item.price.value) * Number(itm.item.quantity.selected.count)
       const actualValue = Number(itm.price.value)

       if (actualValue !== expectedValue) {
         rsfObj.quote[`${itm.item.id}`] = `${itm.id} ${expectedValue} value is not correct `
       } else {
         totalsum += expectedValue
       }
     })

     if (totalsum !== Number(onConfirm.quote.price.value)) {
       // ✅ Overwrite quote only if it's an object
       rsfObj.quote[`price`] = `final value of quote is not correct`
     }
    } catch (error) {
      logger.error(error)
    }
     
  
    try {
      if(!onConfirm.created_at){
        rsfObj.created_at = `created at is missing`
      }
      if(!onConfirm.updated_at){
        rsfObj.updated_at = `updated at is missing`
      }
      if(onConfirm.created_at !== context.timestamp){
        rsfObj.created_at = `created should match with timestamp`
      }
      if(onConfirm.updated_at !== context.timestamp){
        rsfObj.updated_at = `updated should match with timestamp`
      }
    } catch (error) {
      logger.error(error)
    }
    
  
     //validating tags
     try{
      const tagsError = validateTagsStructure(onConfirm.tags)
      Object.assign(rsfObj,tagsError)
     }catch(error){
      logger.error(error)
     }
      setValue(`onConfirmOrder`,message.order)
      setValue('onConfirmItems',onConfirm.items)
      setValue(`onConfirmfulfillments`,onConfirm.fulfillments)
      setValue('onConfirmprovider',onConfirm.provider)
      setValue('onConfirmpayments',onConfirm.payments)
      setValue('onConfirmquote',onConfirm.quote)
      setValue('onConfirmreplacement',onConfirm.replacement_terms)

      return rsfObj
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        logger.info(`!!File not found for /${TRV14ApiSequence.ON_CONFIRM} API!`)
      } else {
        console.log('Error occurred while checking /API:', err)
        logger.error(`!!Some error occurred while checking /${TRV14ApiSequence.ON_CONFIRM} API`, err)
      }
    }
  }

}
