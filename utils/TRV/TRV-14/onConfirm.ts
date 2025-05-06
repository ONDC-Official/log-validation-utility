import { logger } from '../../../shared/logger'
import { TRV14ApiSequence } from '../../../constants'
import { isObjectEmpty, validateSchema } from '../../../utils'
import { getValue, setValue } from '../../../shared/dao'
import { comparePayments ,compareReplacementTerms , validateTagsStructure ,compareFulfillments, compareProviders, compareQuote, validateQuote, compareonItems } from './TRV14checks'
// @ts-ignore
export const checkOnConfirm = (data: any, msgIdSet: any, version: any, Flag: any) => {
  const rsfObj: any = {}

  const { message }: any = data

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
  
      //compare quote
      try {
        const quoteError = compareQuote(onConfirm.quote,quote)
        Object.assign(rsfObj,quoteError)
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
      
  
      
  
  
    //validating quote
    try {
      const quoteError =  validateQuote(onConfirm.quote,"on_confirm")
      Object.assign(rsfObj,quoteError)
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
