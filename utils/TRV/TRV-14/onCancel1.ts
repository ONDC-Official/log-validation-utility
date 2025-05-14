import { logger } from '../../../shared/logger'
import { TRV14ApiSequence } from '../../../constants'
import { isObjectEmpty, validateSchema } from '../..'
import { getValue, setValue } from '../../../shared/dao'
import { compareFulfillments, compareItems, comparePayments, compareProviders, compareReplacementTerms, validateTagsStructure } from './TRV14checks'

// @ts-ignore
export const checkOnCancel1 = (data: any, msgIdSet: any, version: any) => {
  const rsfObj: any = {}

  const { message, context }: any = data

  if (!data || isObjectEmpty(data)) {
    return { [TRV14ApiSequence.CANCEL]: 'JSON cannot be empty' }
  }

  try {
    logger.info(`Validating Schema for ${TRV14ApiSequence.CANCEL} API`)
    const vs = validateSchema('trv14', TRV14ApiSequence.CANCEL, data)

    if (vs != 'error') {
      Object.assign(rsfObj, vs)
    }

    const onCancel = message.order
    const payment = getValue(`onStatuspayments`)
    const replacement = getValue(`onStatusreplacement`)
    const fulfillment = getValue(`onStatusfulfillments`)
    const provider = getValue(`onStatusprovider`)
    const items=  getValue(`onStatusItems`)
    const Map = getValue(`myMap`)
    // const quote = getValue(`onStatusquote`)

    //comparing provider
    try {
      const providerError = compareProviders(onCancel.provider,provider)
      Object.assign(rsfObj,providerError)
    } catch (error) {
      logger.error(error)
    }

    //comparingitems
    try {
      const itemError = compareItems(onCancel.items,items)
      Object.assign(rsfObj,itemError)
    } catch (error) {
      logger.error(error)
    }

    // comparingfullfillments
    try{
      const fulfillmentError = compareFulfillments(onCancel.fulfillments,fulfillment)
      Object.assign(rsfObj,fulfillmentError)
    }catch(error){
      logger.error(error)
    }

    //comparing replacementterms
    try {
      const replacementError = compareReplacementTerms(onCancel.replacement_terms,replacement)
      Object.assign(rsfObj,replacementError)
    } catch (error) {
      logger.error(error)
    }

    //compare payment
    try {
      const paymentError = comparePayments(onCancel.payments,payment)
      Object.assign(rsfObj,paymentError)
    } catch (error) {
      logger.error(error)
    }

    //comparing Tags
    try{
      const tagsError= validateTagsStructure(onCancel.tags)
      Object.assign(rsfObj,tagsError)
    }catch(error){
      logger.error(error)
    }

    //checking quote
    const errorObj: {
      [itemId: string]: {
        errors: string[],
        title: string,
        price?: string,
        actual?: any,
        expected?: any
      }
    } = {};
    
    try {
      onCancel.quote.breakup.forEach((itm: any) => {
        const item = itm.item;
        const itemId = item?.id ?? "unknown";
        const errors: string[] = [];
    
        const expected = item?.id ? Map.get(item.id) : undefined;
    
        if (!item?.id) {
          errors.push("Missing item ID");
        }
    
        if (!expected) {
          errors.push("Item ID not found in original items");
        } else {
          const itemQuantity = item.quantity?.selected?.count ?? 0;
          const expectedQuantity = expected.quantity?.selected?.count ?? 0;
          if (itemQuantity !== expectedQuantity) {
            errors.push(`Quantity mismatch: expected ${expectedQuantity}, got ${itemQuantity}`);
          }
    
          // Add-on check
          const hasAddOn = Array.isArray(item.add_ons) && item.add_ons.length > 0;
          const expectedAddOn = expected.add_ons?.[0];
    
          if (hasAddOn && expectedAddOn) {
            const addon = item.add_ons[0];
            const addonQuantity = addon.quantity?.selected?.count ?? 0;
            const expectedAddonQuantity = expectedAddOn.quantity?.selected?.count ?? 0;
    
            if (addon.id !== expectedAddOn.id) {
              errors.push(`Add-on ID mismatch: expected ${expectedAddOn.id}, got ${addon.id}`);
            }
    
            if (addonQuantity !== expectedAddonQuantity) {
              errors.push(`Add-on quantity mismatch: expected ${expectedAddonQuantity}, got ${addonQuantity}`);
            }
          } else if (hasAddOn !== !!expectedAddOn) {
            errors.push("Add-on presence mismatch");
          }
        }
    
        // REFUND price check
        const priceValue = parseFloat(itm.price?.value ?? "0");
        if (itm.title === "REFUND" && priceValue >= 0) {
          errors.push(`Expected negative price for REFUND, got ${priceValue}`);
        }
    
        if (errors.length > 0) {
          errorObj[itemId] = {
            errors,
            title: itm.title,
            price: itm.price?.value,
            actual: item,
            expected
          };
        }
      });
    } catch (error) {
      logger.error("Error during validation:", error);
    }
    
    if (Object.keys(errorObj).length > 0) {
      Object.assign(rsfObj,errorObj)
    }
    

    setValue(`onCancel1items`,onCancel.items)
    setValue(`onCancel1provider`,onCancel.provider)
    setValue(`onCancel1fulfillment`,onCancel.fulfillments)
    setValue(`onCancel1payments`,onCancel.payments)
    setValue(`onCancel1quote`,onCancel.quote)
    setValue(`onCancel1replacementterms`,onCancel.replacement_terms)
    setValue(`onCancel1tags`,onCancel.tags)
    
    setValue(`context`,context)
    return rsfObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${TRV14ApiSequence.CANCEL} API!`)
    } else {
      console.log('Error occurred while checking /API:', err)
      logger.error(`!!Some error occurred while checking /${TRV14ApiSequence.CANCEL} API`, err)
    }
  }
}
