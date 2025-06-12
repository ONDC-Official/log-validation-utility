import { logger } from '../../../shared/logger'
import { TRV14ApiSequence } from '../../../constants'
import { isObjectEmpty, validateSchema } from '../../../utils'
import { getValue } from '../../../shared/dao'
import { compareOnFulfillments, compareonItems, comparePayments, compareProviders, compareReplacementTerms, compareTags, validateTagsStructure } from './TRV14checks'

// @ts-ignore
export const checkOnUpdate = (data: any, msgIdSet: any, version: any) => {
  const rsfObj: any = {}

  const { message,  }: any = data

  if (!data || isObjectEmpty(data)) {
    return { [TRV14ApiSequence.ON_UPDATE]: 'JSON cannot be empty' }
  }

  try {
    logger.info(`Validating Schema for ${TRV14ApiSequence.ON_UPDATE} API`)
    const vs = validateSchema('trv14', TRV14ApiSequence.ON_UPDATE, data)

    if (vs != 'error') {
      Object.assign(rsfObj, vs)
    }

    const onUpdate = message.order
    const items = getValue('onCancel2items')
      const quote =  getValue('onCancel2quote')
      const payments =  getValue(`onCancel2payments`)
      const fulfillments = getValue(`onCancel2fulfillment`)
      const tags =   getValue(`onCancel2tags`)
      const provider =  getValue(`onCancel2provider`)
      const replacement_terms = getValue(`onCancel2replacementterms`)  
      const updateitem = getValue(`itemonUpdate`)

// compare items
try {
  const itemsError = compareonItems(onUpdate.items,items) 
  Object.assign(rsfObj,itemsError)
} catch (error) {
  logger.error(error)
}

//compare provider
try {
  const providerError = compareProviders(onUpdate.provider,provider)
  Object.assign(rsfObj,providerError)
} catch (error) {
  logger.error(error)
}

//compare fulfillments
try {
  const fulfillmentsError = compareOnFulfillments(onUpdate.fulfillments,fulfillments)
  Object.assign(rsfObj,fulfillmentsError)
} catch (error) {
  logger.error(error)
}

 //compare replacementterms
 try {
  const replacement_termsError = compareReplacementTerms(onUpdate.replacement_terms,replacement_terms)
  Object.assign(rsfObj,replacement_termsError)
} catch (error) {
  logger.error(error)
}

//validating tags
try {
  const validatetags =  validateTagsStructure(onUpdate.tags)
  Object.assign(rsfObj,validatetags)
} catch (error) {
  logger.error(error)
}

//compare payments
try {
  const paymentError =  comparePayments(onUpdate.payments,payments)
  Object.assign(rsfObj,paymentError)
} catch (error) {
  logger.error(error)
}

//compare quote
try {
  const quoteError =  comparePayments(onUpdate.quote,quote)
  Object.assign(rsfObj,quoteError)
} catch (error) {
  logger.error(error)
}

 //compare replacementterms
 try {
  const TagsError = compareTags(onUpdate.tags,tags)
  Object.assign(rsfObj,TagsError)
} catch (error) {
  logger.error(error)
}

  //checking item in quote that exist on update
  try {
    onUpdate.quote.breakup((itm:any)=>{
      if(itm.title === 'REFUND'){
        if(itm.item.id !== updateitem.id){
          rsfObj.updateitemid = `item ${itm.item.id} id mismatches `
        }
      }
    })
  } catch (error) {
    logger.error(error)
  }

    return rsfObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${TRV14ApiSequence.ON_UPDATE} API!`)
    } else {
      console.log('Error occurred while checking /API:', err)
      logger.error(`!!Some error occurred while checking /${TRV14ApiSequence.ON_UPDATE} API`, err)
    }
  }
}
