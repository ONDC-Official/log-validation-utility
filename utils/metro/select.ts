import { logger } from '../../shared/logger'
import { getValue, setValue } from '../../shared/dao'
import constants, { metroSequence } from '../../constants'
import { validateSchema, isObjectEmpty, checkGpsPrecision } from '..'
import { validateContext } from './metroChecks'

export const checkSelect = (data: any, msgIdSet: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [metroSequence.SELECT]: 'Json cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema('TRV', constants.SELECT, data)
  const contextRes: any = validateContext(context, msgIdSet, constants.ON_SEARCH, constants.SELECT)
  setValue(`${metroSequence.SELECT}_message`, message)
  const errorObj: any = {}

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
        setValue('providerId', selectedProviderId)
      }
    } catch (error: any) {
      logger.info(
        `Error while comparing provider ids for /${constants.ON_SEARCH} and /${constants.SELECT} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing Items object for /${constants.ON_SEARCH} and /${constants.SELECT}`)

      select.items.forEach((item: any, index: number) => {
        if (storedItemIDS && !storedItemIDS.includes(item.id)) {
          const key = `item[${index}].item_id`
          errorObj[
            key
          ] = `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in previous call`
        } else {
          setValue('itemId', item.id)
        }
      })
    } catch (error: any) {
      logger.error(
        `!!Error while Comparing and Mapping Items in /${constants.ON_SEARCH} and /${constants.SELECT}, ${error.stack}`,
      )
    }

    if ('fulfillments' in message.order && Array.isArray(message.order.fulfillments)) {
      const fulfillmentErrors: any = {}

      message.order.fulfillments.forEach((fulfillment: any, index: number) => {
        const fulfillmentKey = `fulfillments[${index}]`

        if (!fulfillment.id) {
          fulfillmentErrors[`${fulfillmentKey}.id`] = `${fulfillmentKey}/id is required`
        }

        if (fulfillment.type && fulfillment.type !== 'DELIVERY') {
          fulfillmentErrors[`${fulfillmentKey}.type`] = `Fulfillment type should be 'DELIVERY' in provoider}`
        }

        if ('stops' in fulfillment && Array.isArray(fulfillment.stops)) {
          fulfillment.stops.forEach((stop: any, stopIndex: number) => {
            const stopKey = `${fulfillmentKey}.stops[${stopIndex}]`

            if (!stop.type) {
              fulfillmentErrors[`${stopKey}.type`] = `${stopKey}/type is required`
            }

            if (checkGpsPrecision(stop?.location.gps)) {
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
