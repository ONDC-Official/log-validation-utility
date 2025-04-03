import { logger } from '../../../shared/logger'
import { getValue, setValue } from '../../../shared/dao'
import constants, { metroSequence } from '../../../constants'
import { validateSchema, isObjectEmpty, checkGpsPrecision } from '../../'
import { validateContext } from '../../metro/metroChecks'

export const checkSelect = (data: any, msgIdSet: any, flow?: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [metroSequence.SELECT]: 'Json cannot be empty' }
  }
  const errorObj: any = {}

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }
  const schemaValidation = validateSchema(flow?.flow === 'Airlines' ? 'TRV12' : 'TRV12BUS', constants.SELECT, data)
  const contextRes: any = validateContext(context, msgIdSet, constants.ON_SEARCH, constants.SELECT)
  setValue(`${metroSequence.SELECT}_message`, message)

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  try {
    const storedItemIDS: any = getValue(`${metroSequence.ON_SEARCH1}_itemsId`)
    const select = message.order
    const onSearch: any = getValue(`${metroSequence.ON_SEARCH1}_message`)

    try {
      logger.info(`Comparing Provider object for /${constants.ON_SEARCH} and /${constants.SELECT}`)
      const providerIDs = onSearch?.message?.catalog['providers']?.map((provider: { id: any }) => provider?.id)
      const selectedProviderId = select.provider.id

      if (!providerIDs || providerIDs.length === 0) {
        logger.info(`Skipping Provider Ids check due to insufficient data`)
      } else if (!providerIDs.includes(selectedProviderId)) {
        errorObj.prvdrId = `Provider Id ${selectedProviderId} in /${constants.SELECT} does not exist in /${constants.ON_SEARCH}`
      } else {
        setValue('providerId', [selectedProviderId])
      }
    } catch (error: any) {
      logger.info(
        `Error while comparing provider ids for /${constants.ON_SEARCH} and /${constants.SELECT} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing Items object for /${constants.ON_SEARCH} and /${constants.SELECT}`);
    
      const parentItems: Record<string, number> = {}; 
      const childItems: Record<string, number> = {}; 
      select?.items?.forEach((item: any, index: number) => {
        const itemId = item.id;
        const parentItemId = item.parent_item_id;
        const itemCount = item?.quantity?.selected?.count || 0;
    
        if (itemId) {
          parentItems[itemId] = itemCount;
        } else if (parentItemId) {
          if (itemCount !== 1){
            errorObj[`item[${parentItemId}].quantity_count`] =
            `Parent item ${parentItemId} should have total selected count of 1`;
          }
          childItems[parentItemId] = (childItems[parentItemId] || 0) + 1;
        }
    
        if (storedItemIDS && !storedItemIDS.includes(itemId)) {
          errorObj[`item[${index}].item_id`] =
            `/message/order/items/id in item: ${itemId} should be one of the /item/id mapped in previous call`;
        }
      });
    
      Object.keys(childItems).forEach((parentId) => {
        if (parentItems[parentId] !== childItems[parentId]) {
          errorObj[`item[${parentId}].quantity_count`] =
            `Parent item ${parentId} has total count ${parentItems[parentId]}, but child items sum up to ${childItems[parentId]}`;
        }
      });
      console.log('Parent Items: ',parentItems)
      console.log('Child Items: ',childItems)
    
    } catch (error: any) {
      logger.error(
        `!!Error while Comparing and Mapping Items in /${constants.ON_SEARCH} and /${constants.SELECT}, ${error.stack}`,
      );
    }
    

    if ('fulfillments' in message.order && Array.isArray(message.order.fulfillments)) {
      const fulfillmentErrors: any = {}
      
      let childFulfilmentCount = 0;

      message.order.fulfillments.forEach((fulfillment: any, index: number) => {
        const fulfillmentKey = `fulfillments[${index}]`

        if (!fulfillment.id) {
          fulfillmentErrors[`${fulfillmentKey}.id`] = `${fulfillmentKey}/id is required`
        }

        if (fulfillment.type && fulfillment.type !== 'DELIVERY') {
          fulfillmentErrors[`${fulfillmentKey}.type`] = `Fulfillment type should be 'DELIVERY' in provider}`
        }
        // to be cross checked against DB count
        if(!fulfillment.stops){
          childFulfilmentCount++;
        }

        if(childFulfilmentCount){
          console.log(childFulfilmentCount)
        }
        if ('stops' in fulfillment && Array.isArray(fulfillment.stops)) {
          fulfillment.stops.forEach((stop: any, stopIndex: number) => {
            
            const stopKey = `${fulfillmentKey}.stops[${stopIndex}]`           

            if (!stop.type) {
              fulfillmentErrors[`${stopKey}.type`] = `${stopKey}/type is required`
            }

            if (stop?.location?.gps && checkGpsPrecision(stop?.location.gps)) {
              fulfillmentErrors[`${stopKey}.gps`] =
                'gps must be specified with at least six decimal places of precision.'
            }
          })
        }

        if (Object.keys(fulfillmentErrors).length > 0) {
          Object.assign(errorObj, fulfillmentErrors)
        }
      })
    }
  } catch (error: any) {
    logger.error(`!!Error occcurred while validating message object in /${constants.SELECT},  ${error.message}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
