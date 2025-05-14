import { logger } from '../../../shared/logger'
import { TRV14ApiSequence } from '../../../constants'
import { isObjectEmpty, validateSchema } from '../../../utils'
import { getValue, setValue } from '../../../shared/dao'
import { compareFulfillments, compareItems, comparePayments, compareProviders, compareQuote, compareReplacementTerms, validateTagsStructure } from './TRV14checks'

// @ts-ignore
export const checkOnStatus = (data: any, msgIdSet: any, version: any) => {
  const rsfObj: any = {}

  const { message }: any = data

  if (!data || isObjectEmpty(data)) {
    return { [TRV14ApiSequence.ON_STATUS]: 'JSON cannot be empty' }
  }

  try {
    logger.info(`Validating Schema for ${TRV14ApiSequence.ON_STATUS} API`)
    const vs = validateSchema('trv14', TRV14ApiSequence.ON_STATUS, data)

    if (vs != 'error') {
      Object.assign(rsfObj, vs)
    }

    const onStatus = message.order
    const onConfirm = getValue(`onConfirmOrder`)
    const payment = getValue(`onConfirmpayments`)
    const replacementTerms = getValue(`onConfirmreplacement`)
    const fulfillment = getValue(`onConfirmfulfillments`)
    const provider = getValue(`onConfirmprovider`)
    const items =  getValue(`onConfirmItems`)
    const quote = getValue(`onConfirmquote`)
    const myMap =  new Map()
    //checking id and status
    try {
      if(onStatus.id !== onConfirm.id){
        rsfObj.id = `id mismatches in onConfirm and on_status`
      }
    } catch (error) {
      logger.error(error)
    }

    //comparing items
    try{
      const itemerror = compareItems(onStatus.items,items)
      Object.assign(rsfObj,itemerror)
    }catch(error){
      logger.error(error)
    }


    //checking replacement terms
    try{
      const differror = compareReplacementTerms(onStatus.replacement_terms,replacementTerms)
      Object.assign(rsfObj,differror)
    }catch(error ){
      logger.error(error)
    }

    //checking payments
    try {
     const paymentError = comparePayments(onStatus.payments,payment)
     Object.assign(rsfObj,paymentError)
    } catch (error) {
      logger.error(error)
    }

    //checking tags
    try {
    const tagsError = validateTagsStructure(onStatus.tags)
    Object.assign(rsfObj,tagsError)   
    } catch (error) {
      logger.error(error)
    }

    //comparing fulfillments
    try {
      const fulfillmentError = compareFulfillments(onStatus.fulfillments,fulfillment)
      Object.assign(rsfObj,fulfillmentError)
    } catch (error) {
      logger.error(error)
    }

    //compareprovider
    try {
     const providerError = compareProviders(onStatus.provider,provider)
     Object.assign(rsfObj,providerError)
    } catch (error) {
      logger.error(error)
    }

    //compare quote
    try {
      const quoteError = compareQuote(onStatus.quote,quote)
      Object.assign(rsfObj,quoteError)
    } catch (error) {
      logger.error(error)
    }

    try {
      onStatus.quote.breakup.forEach((itm: any) => {
        const itemId = itm.item?.id; 
        if (!itemId) {
          rsfObj.itm = `id is missing`
        };
    
        const addOn = itm.item.add_ons?.[0]; 
        myMap.set(itemId, {
          id: itemId,
          price: itm.item.price,
          quantity: itm.item.quantity,
          add_ons: addOn
            ? {
                id: addOn.id,
                quantity: addOn.quantity
              }
            : null
        });
      });
    } catch (error) {
      logger.error(error);
    }
    

    setValue(`onStatuspayments`,onStatus.payments)
    setValue(`onStatusreplacement`,onStatus.replacement_terms)
    setValue(`onStatusfulfillments`,onStatus.fulfillments)
    setValue(`onStatusprovider`,onStatus.provider)
    setValue(`onStatusItems`,onStatus.Items)
    setValue(`onStatusquote`,onStatus.quote)
    setValue(`mapbreakup`,myMap)


    return rsfObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${TRV14ApiSequence.ON_STATUS} API!`)
    } else {
      console.log('Error occurred while checking /API:', err)
      logger.error(`!!Some error occurred while checking /${TRV14ApiSequence.ON_STATUS} API`, err)
    }
  }
}
