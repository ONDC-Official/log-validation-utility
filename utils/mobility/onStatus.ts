/* eslint-disable no-prototype-builtins */
// import _ from 'lodash'
import constants, { mobilitySequence, MOB_FULL_STATE as VALID_FULL_STATE, ON_DEMAND_VEHICLE } from '../../constants'
import { logger } from '../../shared/logger'
import { validateSchema, isObjectEmpty } from '../'
import { getValue, setValue } from '../../shared/dao'
import {
  validateCancellationTerms,
  validateContext,
  validateEntity,
  validateItemRefIds,
  validateQuote,
  validateStops,
  validatePayloadAgainstSchema,
  validatePaymentObject,
} from './mobilityChecks'
import { validateItemsTags, validateRouteInfoTags } from './tags'
import attributeConfig from './config/config2.0.1.json'

export const checkOnStatus = (data: any, msgIdSet: any, version: any) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [mobilitySequence.ON_STATUS]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.ON_STATUS, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.STATUS, constants.ON_STATUS)
    setValue(`${mobilitySequence.ON_STATUS}`, data)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const on_status = message.order
    const itemIDS: any = getValue('ItmIDS')
    const itemIdArray: any[] = []
    const fulfillmentIdsSet = new Set()
    const storedFull: any = getValue(`${mobilitySequence.ON_SELECT}_storedFulfillments`)

    let newItemIDSValue: any[]

    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      on_status.items.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
    }

    setValue('ItmIDS', newItemIDSValue)

    try {
      logger.info(`Comparing provider object in /${constants.STATUS} and /${constants.ON_STATUS}`)
      if (on_status?.provider?.id != getValue('providerId')) {
        errorObj.prvdrId = `Provider Id mismatches in /${constants.STATUS} and /${constants.ON_STATUS}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while checking provider object in /${constants.STATUS} and /${constants.ON_STATUS}, ${error.stack}`,
      )
    }

    //fulfillment checks
    try {
      logger.info(`Validating fulfillments object for /${constants.ON_STATUS}`)
      on_status.fulfillments.forEach((fulfillment: any, index: number) => {
        const fulfillmentKey = `fulfillments[${index}]`

        if (!fulfillment?.id) {
          errorObj[fulfillmentKey] = `id is missing in fulfillments[${index}]`
        } else if (!storedFull.includes(fulfillment.id)) {
          errorObj[
            `${fulfillmentKey}.id`
          ] = `/message/order/fulfillments/id in fulfillments: ${fulfillment.id} should be one of the /fulfillments/id mapped in previous call`
        } else {
          fulfillmentIdsSet.add(fulfillment.id)
        }

        if (!VALID_FULL_STATE.includes(fulfillment?.state?.descriptor?.code)) {
          errorObj[`${fulfillmentKey}.state`] = `Invalid or missing descriptor.code for fulfillment ${index}`
        }

        const vehicle = fulfillment.vehicle

        if (!ON_DEMAND_VEHICLE.includes(vehicle.category)) {
          errorObj[`${fulfillmentKey}.vehicleCategory`] = `Vehicle category should be one of ${ON_DEMAND_VEHICLE}`
        }

        if (!vehicle?.registration || !vehicle?.model || !vehicle?.make) {
          errorObj[`${fulfillmentKey}.details`] = `Vehicle object is incomplete for fulfillment ${index}`
        }

        if (fulfillment.type !== 'DELIVERY') {
          errorObj[
            `${fulfillmentKey}.type`
          ] = `Fulfillment type must be DELIVERY at index ${index} in /${constants.ON_STATUS}`
        }

        //customer checks
        const customerErrors = validateEntity(fulfillment.customer, 'customer', constants.ON_STATUS, index)
        Object.assign(errorObj, customerErrors)

        //agent checks
        const agentErrors = validateEntity(fulfillment.agent, 'customer', constants.ON_STATUS, index)
        Object.assign(errorObj, agentErrors)

        // Check stops for START and END, or time range with valid timestamp and GPS
        const otp = false
        const cancel = false
        const stopsError = validateStops(fulfillment?.stops, index, otp, cancel)
        if (!stopsError?.valid) Object.assign(errorObj, stopsError)

        if (fulfillment.tags) {
          // Validate route info tags
          const tagsValidation = validateRouteInfoTags(fulfillment.tags)
          if (!tagsValidation.isValid) {
            Object.assign(errorObj, { tags: tagsValidation.errors })
          }
        }
      })
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking fulfillments info in /${constants.ON_STATUS},  ${error.message}`)
      return { error: error.message }
    }

    //items checks
    try {
      logger.info(`Validating items object for /${constants.ON_STATUS}`)
      if (!on_status?.items) errorObj.items = `items is missing in /${constants.ON_STATUS}`
      else {
        on_status.items.forEach((item: any, index: number) => {
          const itemKey = `items[${index}]`
          if (!newItemIDSValue.includes(item.id)) {
            errorObj[
              `${itemKey}.id`
            ] = `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in /${constants.ON_STATUS}`
          }

          //price check
          if (!item?.price) errorObj[`${itemKey}.price`] = `price is missing at item.index ${index} `

          //fulfillment_ids, location_ids & payment_ids checks
          const refIdsErrors = validateItemRefIds(
            item,
            constants.ON_STATUS,
            index,
            fulfillmentIdsSet,
            new Set(),
            new Set(),
          )
          Object.assign(errorObj, refIdsErrors)

          //descriptor.code
          if (item.descriptor.code !== 'RIDE') {
            errorObj[
              `${itemKey}.type`
            ] = `descriptor.code must be RIDE at item.index ${index} in /${constants.ON_STATUS}`
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
      logger.error(`!!Error occcurred while checking items info in /${constants.ON_STATUS},  ${error.message}`)
      return { error: error.message }
    }

    // check payments
    try {
      logger.info(`Checking payments in /${constants.ON_STATUS}`)
      const payments = on_status?.payments
      const paymentErrors = validatePaymentObject(payments, constants.ON_STATUS)
      Object.assign(errorObj, paymentErrors)
    } catch (error: any) {
      logger.error(`!!Errors while checking payments in /${constants.ON_STATUS}, ${error.stack}`)
    }

    //quote checks
    try {
      logger.info(`Checking quote details in /${constants.ON_STATUS}`)
      const quoteErrors = validateQuote(on_status?.quote, constants.ON_STATUS)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking Quote in /${constants.ON_STATUS},  ${error.message}`)
      return { error: error.message }
    }

    //cancellation_terms checks
    try {
      logger.info(`Checking cancellation terms in /${constants.ON_STATUS}`)
      const cancellationErrors = validateCancellationTerms(on_status.cancellation_terms, constants.ON_STATUS)
      Object.assign(errorObj, cancellationErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation_terms in /${constants.ON_STATUS}, ${error.stack}`)
    }

    if (version === '2.0.1') {
      const additionalAttributes: any = attributeConfig.on_status
      validatePayloadAgainstSchema(additionalAttributes, data, errorObj, '', '')
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_STATUS} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}
