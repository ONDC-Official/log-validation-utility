import { logger } from '../../../shared/logger'
import { getValue, setValue } from '../../../shared/dao'
import constants, { airlinesSequence } from '../../../constants'
import { validateSchema, isObjectEmpty } from '../../'
import { validateContext } from '../../metro/metroChecks'

export const checkSelect = (data: any, msgIdSet: any, secondSelect: boolean) => {
  if (!data || isObjectEmpty(data)) {
    return secondSelect
      ? { [airlinesSequence.SELECT2]: 'Json cannot be empty' }
      : { [airlinesSequence.SELECT1]: 'Json cannot be empty' }
  }
  const errorObj: any = {}
  let selectItemId: string[] = []

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema(
    'TRV12',
    secondSelect ? airlinesSequence?.SELECT2 : airlinesSequence?.SELECT1,
    data,
  )
  const contextRes: any = validateContext(
    context,
    msgIdSet,
    secondSelect ? airlinesSequence.SELECT1 : constants.ON_SEARCH,
    secondSelect ? airlinesSequence.SELECT2 : airlinesSequence.SELECT1,
  )
  setValue(`${airlinesSequence.SELECT1}_message`, message)

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  try {
    const storedItemIDS: any = getValue(`${airlinesSequence.ON_SEARCH}_itemsId`) || []
    const select = message.order
    const onSearch: any = getValue(`${airlinesSequence.ON_SEARCH}_message`)

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
      logger.info(`Comparing Items object for /${constants.ON_SEARCH} and /${constants.SELECT}`)

      select?.items?.forEach((item: any, index: number) => {
        if (item?.id && storedItemIDS && !storedItemIDS.includes(item.id)) {
          const key = `item[${index}].item_id`
          errorObj[key] =
            `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in previous call`
        } else {
          selectItemId.push(item.id)
          setValue('itemId', item.id)
          setValue(`qunatity_count`, item?.quantity?.count || 0)
        }

        if (item?.parent_item_id && !selectItemId?.includes(item?.parent_item_id)) {
          errorObj[`item[${index}].parent_item_id`] = `parent_item_id should be linked with item_id`
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

        if (fulfillment?.vehicle) {
          if (fulfillment?.vehicle?.category !== 'AIRLINE') {
            fulfillmentErrors[`fulfillment_${index}.vehicle.category`] =
              `${fulfillmentKey}/vehicle/category should be AIRLINE in index ${index}`
          }
        }

        if ('stops' in fulfillment && Array.isArray(fulfillment?.stops)) {
          fulfillment.stops.forEach((stop: any, stopIndex: number) => {
            const stopKey = `${fulfillmentKey}.stops[${stopIndex}]`

            if (!stop.id) {
              fulfillmentErrors[`${stopKey}.id`] = `${stopKey}/id is required`
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
