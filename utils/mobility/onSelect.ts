import { logger } from '../../shared/logger'
import constants, { mobilitySequence } from '../../constants'
import { validateSchema, isObjectEmpty } from '../'
import _ from 'lodash'
import { getValue, setValue } from '../../shared/dao'
import { validateContext, validateQuote, validateStops } from './mobilityChecks'
import { validateRouteInfoTags } from './tags'

const VALID_DESCRIPTOR_CODES = ['RIDE', 'SJT', 'SESJT', 'RUT', 'PASS', 'SEAT', 'NON STOP', 'CONNECT']
const VALID_VEHICLE_CATEGORIES = ['AUTO_RICKSHAW', 'CAB', 'METRO', 'BUS', 'AIRLINE']
export const checkOnSelect = (data: any, msgIdSet: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [mobilitySequence.ON_SELECT]: 'Json cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema(context.domain.split(':')[1], constants.ON_SELECT, data)
  const contextRes: any = validateContext(context, msgIdSet, constants.SELECT, constants.ON_SELECT)
  setValue(`${mobilitySequence.ON_SELECT}_message`, message)
  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  // const searchContext: any = getValue(`${mobilitySequence.SEARCH}_context`)
  const select: any = getValue(`${mobilitySequence.SELECT}`)

  try {
    const onSelect = message.order
    const itemIDS: any = getValue(`${mobilitySequence.ON_SEARCH}_itemsId`)
    const itemIdArray: any[] = []
    const storedFull: any = getValue(`${mobilitySequence.ON_SEARCH}_storedFulfillments`)
    const fulfillmentIdsSet = new Set()
    const itemIdsSet = new Set()

    try {
      logger.info(`Comparing Provider Id of /${constants.SELECT} and /${constants.ON_SELECT}`)
      const prvrdID: any = getValue('providerId')
      const selectedProviderId = onSelect.provider.id

      if (!prvrdID) {
        logger.info(`Skipping Provider Id check due to insufficient data`)
        setValue('providerId', selectedProviderId)
      } else if (!_.isEqual(prvrdID, onSelect.provider.id)) {
        errorObj.prvdrId = `Provider Id for /${constants.SELECT} and /${constants.ON_SELECT} api should be same`
      } else {
        setValue('providerId', selectedProviderId)
      }
    } catch (error: any) {
      logger.info(
        `Error while comparing provider id for /${constants.SELECT} and /${constants.ON_SELECT} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Validating fulfillments object for /${constants.ON_SELECT}`)
      onSelect.fulfillments.forEach((fulfillment: any, index: number) => {
        const fulfillmentKey = `fulfillments[${index}]`

        if (storedFull && !storedFull.includes(fulfillment.id)) {
          errorObj[
            `${fulfillmentKey}.id`
          ] = `/message/order/fulfillments/id in fulfillments: ${fulfillment.id} should be one of the /fulfillments/id mapped in previous call`
        } else {
          fulfillmentIdsSet.add(fulfillment.id)
        }

        if (!VALID_VEHICLE_CATEGORIES.includes(fulfillment.vehicle.category)) {
          errorObj[
            `${fulfillmentKey}.vehicleCategory`
          ] = `Vehicle category should be one of ${VALID_VEHICLE_CATEGORIES}`
        }

        if (!fulfillment.type) {
          errorObj[`${fulfillmentKey}.type`] = `Fulfillment type is missing`
        } else if (fulfillment.type !== 'DELIVERY') {
          errorObj[
            `${fulfillmentKey}.type`
          ] = `Fulfillment type must be DELIVERY at index ${index} in /${constants.ON_SELECT}`
        }

        // Check stops for START and END, or time range with valid timestamp and GPS
        const otp = false
        const cancel = false
        validateStops(fulfillment?.stops, index, otp, cancel)

        // Validate route info tags
        const tagsValidation = validateRouteInfoTags(fulfillment.tags)
        if (!tagsValidation.isValid) {
          Object.assign(errorObj, { tags: tagsValidation.errors })
        }
      })
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking fulfillments info in /${constants.ON_SELECT},  ${error.message}`)
      return { error: error.message }
    }

    logger.info(`Mapping Item Ids /${constants.ON_SEARCH} and /${constants.ON_SELECT}`)
    let newItemIDSValue: any[]

    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      select.message.order.items.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
    }

    try {
      onSelect.items.forEach((item: any, index: number) => {
        if (!newItemIDSValue.includes(item.id)) {
          const key = `item[${index}].item_id`
          errorObj[key] = `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in select`
        } else {
          itemIdsSet.add(item.id)
        }

        if (!item.descriptor || !item.descriptor.code) {
          const key = `item${index}_descriptor`
          errorObj[key] = `Descriptor is missing in items[${index}]`
        } else {
          if (!VALID_DESCRIPTOR_CODES.includes(item.descriptor.code)) {
            const key = `item${index}_descriptor`
            errorObj[
              key
            ] = `descriptor.code should be one of ${VALID_DESCRIPTOR_CODES} instead of ${item.descriptor.code}`
          }
        }

        const price = item.price
        if (!price || !price.currency || !price.value) {
          const key = `item${index}_price`
          errorObj[key] = `Price is missing or incomplete in /items[${index}]`
        }

        if (!item?.fulfillment_ids || item?.fulfillment_ids?.length === 0) {
          errorObj[`invalidFulfillmentId_${index}`] = `fulfillment_ids should be present`
        } else {
          item.fulfillment_ids.forEach((fulfillmentId: string) => {
            if (!fulfillmentIdsSet.has(fulfillmentId)) {
              errorObj[
                `invalidFulfillmentId_${index}`
              ] = `Fulfillment ID '${fulfillmentId}' at index ${index} in /${constants.ON_SELECT} is not valid`
            }
          })
        }

        if (item?.payment_ids) {
          errorObj[`payment_ids_${index}`] = `payment_ids are not part of /${constants.ON_SELECT}`
        }

        // Validate item tags
        const tagsValidation = validateRouteInfoTags(item.tags)
        if (!tagsValidation.isValid) {
          Object.assign(errorObj, { tags: tagsValidation.errors })
        }
      })
      setValue(`itemIds`, Array.from(newItemIDSValue))
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking items info in /${constants.ON_SELECT},  ${error.message}`)
      return { error: error.message }
    }

    try {
      logger.info(`Checking quote details in /${constants.ON_SELECT}`)
      const quoteErrors = validateQuote(onSelect?.quote, constants.ON_SELECT)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking Quote in /${constants.ON_SELECT},  ${error.message}`)
      return { error: error.message }
    }

    if (onSelect?.payments) {
      errorObj[`payments`] = `payments  is not part of /${constants.ON_SELECT}`
    }

    if (onSelect?.cancellation_terms) {
      errorObj[`cancellation_terms`] = `cancellation_terms  is not part of /${constants.ON_SELECT}`
    }

    setValue(`${mobilitySequence.ON_SELECT}`, data)
    setValue(`${mobilitySequence.ON_SELECT}_storedFulfillments`, Array.from(storedFull))
  } catch (error: any) {
    logger.error(`!!Error occcurred while checking order info in /${constants.ON_SELECT},  ${error.message}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
