import { logger } from '../../../shared/logger'
import { TRV14ApiSequence } from '../../../constants'
import { isObjectEmpty, validateSchema } from '../..'
import { getValue, setValue } from '../../../shared/dao'
import { compareOnFulfillments, compareonItems, comparePayments, compareProviders, compareReplacementTerms, compareTags, validateTagsStructure } from './TRV14checks'

// @ts-ignore
export const checkOnCancel2 = (data: any, msgIdSet: any, version: any) => {
  const rsfObj: any = {}

  const { message, context }: any = data

  if (!data || isObjectEmpty(data)) {
    return { [TRV14ApiSequence.ON_CANCEL]: 'JSON cannot be empty' }
  }

  try {
    
      const Cancel=message.order

      const items = getValue('onCancel1items')
      const quote =  getValue('onCancel1quote')
      const payments =  getValue(`onCancel1payments`)
      const fulfillments = getValue(`onCancel1fulfillment`)
      const tags =   getValue(`onCancel1tags`)
      const provider =  getValue(`onCancel1provider`)
      const replacement_terms = getValue(`onCancel1replacementterms`)  

    logger.info(`Validating Schema for ${TRV14ApiSequence.ON_CANCEL} API`)
    const vs = validateSchema('trv14', TRV14ApiSequence.ON_CANCEL_2, data)

    if (vs != 'error') {
      Object.assign(rsfObj, vs)
    }

    //checking cancellation
    try {
      if(!Cancel.cancellation){
        rsfObj.cancellation = ` cancellation object is missing`
      }
      else if(!Cancel.cancelled_by){
        rsfObj.cancellation.cancelby = `cancellation.cancelby object is missing`
      }
    } catch (error) {
      logger.error(error)
    }

    // compare items
    try {
      const itemsError = compareonItems(Cancel.items,items) 
      Object.assign(rsfObj,itemsError)
    } catch (error) {
      logger.error(error)
    }

    //compare provider
    try {
      const providerError = compareProviders(Cancel.provider,provider)
      Object.assign(rsfObj,providerError)
    } catch (error) {
      logger.error(error)
    }

    //compare fulfillments
    try {
      const fulfillmentsError = compareOnFulfillments(Cancel.fulfillments,fulfillments)
      Object.assign(rsfObj,fulfillmentsError)
    } catch (error) {
      logger.error(error)
    }

     //compare replacementterms
     try {
      const replacement_termsError = compareReplacementTerms(Cancel.replacement_terms,replacement_terms)
      Object.assign(rsfObj,replacement_termsError)
    } catch (error) {
      logger.error(error)
    }

    //validating tags
    try {
      const validatetags =  validateTagsStructure(Cancel.tags)
      Object.assign(rsfObj,validatetags)
    } catch (error) {
      logger.error(error)
    }

    //compare payments
    try {
      const paymentError =  comparePayments(Cancel.payments,payments)
      Object.assign(rsfObj,paymentError)
    } catch (error) {
      logger.error(error)
    }

    //compare quote
    try {
      const quoteError =  comparePayments(Cancel.quote,quote)
      Object.assign(rsfObj,quoteError)
    } catch (error) {
      logger.error(error)
    }

     //compare replacementterms
     try {
      const TagsError = compareTags(Cancel.tags,tags)
      Object.assign(rsfObj,TagsError)
    } catch (error) {
      logger.error(error)
    }

    setValue(`onCancel2items`,Cancel.items)
    setValue(`onCancel2provider`,Cancel.provider)
    setValue(`onCancel2fulfillment`,Cancel.fulfillments)
    setValue(`onCancel2payments`,Cancel.payments)
    setValue(`onCancel2quote`,Cancel.quote)
    setValue(`onCancel2replacementterms`,Cancel.replacement_terms)
    setValue(`onCancel2tags`,Cancel.tags)
    setValue('onCancel_context', context)
    setValue('onCancel_message', message)

    return rsfObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${TRV14ApiSequence.ON_CANCEL} API!`)
    } else {
      console.log('Error occurred while checking /API:', err)
      logger.error(`!!Some error occurred while checking /${TRV14ApiSequence.ON_CANCEL} API`, err)
    }
  }
}
