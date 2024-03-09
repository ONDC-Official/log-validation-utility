import { logger } from '../../shared/logger'
import constants, { mobilitySequence, ON_DEMAND_VEHICLE } from '../../constants'
import { validateSchema, isObjectEmpty } from '../'
import _ from 'lodash'
import { getValue, setValue } from '../../shared/dao'
import {
  validateContext,
  validateItemRefIds,
  validateQuote,
  validateStops,
  validatePayloadAgainstSchema,
} from './mobilityChecks'
import { validateItemsTags, validateRouteInfoTags } from './tags'
import attributeConfig from './config/config2.0.1.json'

export const checkOnSelect = (data: any, msgIdSet: any, version: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [mobilitySequence.ON_SELECT]: 'JSON cannot be empty' }
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

  try {
    const onSelect = message.order
    const itemIDS: any = getValue(`itemIds`)
    const locationIds = getValue(`locationIds`)
    const storedFull: any = getValue(`${mobilitySequence.ON_SEARCH}_storedFulfillments`)
    const fulfillmentIdsSet = new Set()

    //check provider
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

    //check fulfillments
    try {
      logger.info(`Validating fulfillments object for /${constants.ON_SELECT}`)
      onSelect.fulfillments.forEach((fulfillment: any, index: number) => {
        const fulfillmentKey = `fulfillments[${index}]`

        if (!fulfillment?.id) {
          errorObj[fulfillmentKey] = `id is missing in fulfillments[${index}]`
        } else if (storedFull && !storedFull.includes(fulfillment.id)) {
          errorObj[
            `${fulfillmentKey}.id`
          ] = `/message/order/fulfillments/id in fulfillments: ${fulfillment.id} should be one of the /fulfillments/id mapped in previous call`
        } else {
          fulfillmentIdsSet.add(fulfillment.id)
        }

        if (!ON_DEMAND_VEHICLE.includes(fulfillment.vehicle.category)) {
          errorObj[`${fulfillmentKey}.vehicleCategory`] = `Vehicle category should be one of ${ON_DEMAND_VEHICLE}`
        }

        if (!fulfillment.type) {
          errorObj[`${fulfillmentKey}.type`] = `Fulfillment type is missing`
        } else if (fulfillment?.type !== 'DELIVERY') {
          errorObj[
            `${fulfillmentKey}.type`
          ] = `Fulfillment type must be DELIVERY at index ${index} in /${constants.ON_SELECT}`
        }

        // Check stops for START and END, or time range with valid timestamp and GPS
        const otp = false
        const cancel = false
        const stopsError = validateStops(fulfillment?.stops, index, otp, cancel)
        if (!stopsError?.valid) Object.assign(errorObj, stopsError.errors)

        if (fulfillment.tags) {
          // Validate route info tags
          const tagsValidation = validateRouteInfoTags(fulfillment.tags)
          if (!tagsValidation.isValid) {
            Object.assign(errorObj, { tags: tagsValidation.errors })
          }
        }
      })
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking fulfillments info in /${constants.ON_SELECT},  ${error.message}`)
      return { error: error.message }
    }

    //check items
    try {
      logger.info(`Validating items object for /${constants.ON_SELECT}`)
      if (!onSelect?.items) errorObj.items = `items is missing in /${constants.ON_SELECT}`
      else {
        onSelect.items.forEach((item: any, index: number) => {
          const itemKey = `items[${index}]`
          //id checks
          if (!item?.id) {
            errorObj[`${itemKey}.id`] = `id is missing in [${itemKey}]`
          } else if (!itemIDS.includes(item.id)) {
            errorObj[
              `${itemKey}.id`
            ] = `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in /${constants.ON_SELECT}`
          }

          //price check
          if (!item?.price?.value) errorObj[`${itemKey}.price`] = `value is missing at item.index ${index} `

          //fulfillment_ids, location_ids & payment_ids checks
          const refIdsErrors = validateItemRefIds(
            item,
            constants.ON_SELECT,
            index,
            fulfillmentIdsSet,
            new Set(locationIds),
            new Set(),
          )
          Object.assign(errorObj, refIdsErrors)

          //descriptor.code
          if (!item?.descriptor?.code)
            errorObj[`${itemKey}.code`] = `descriptor.code is missing at index: ${index} in /${constants.ON_SELECT}`
          else if (item.descriptor.code !== 'RIDE') {
            errorObj[
              `${itemKey}.type`
            ] = `descriptor.code must be RIDE at item.index ${index} in /${constants.ON_SELECT}`
          }

          // FARE_POLICY & INFO checks
          if (item.tags) {
            const tagsValidation = validateItemsTags(item.tags)
            if (!tagsValidation.isValid) {
              Object.assign(errorObj, { tags: tagsValidation.errors })
            }
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking items info in /${constants.ON_SELECT},  ${error.message}`)
      return { error: error.message }
    }

    //quote checks
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

    if (version === '2.0.1') {
      const additionalAttributes: any = attributeConfig.on_select
      validatePayloadAgainstSchema(additionalAttributes, data, errorObj, '', '')
    }

    setValue(`${mobilitySequence.ON_SELECT}`, data)
    setValue(`${mobilitySequence.ON_SELECT}_storedFulfillments`, Array.from(storedFull))
  } catch (error: any) {
    logger.error(`!!Error occcurred while checking order info in /${constants.ON_SELECT},  ${error.message}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
