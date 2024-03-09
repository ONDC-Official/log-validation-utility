/* eslint-disable no-prototype-builtins */
// import _ from 'lodash'
import constants, { mobilitySequence, ON_DEMAND_VEHICLE, MOB_FULL_STATE as VALID_FULL_STATE } from '../../constants'
import { logger } from '../../shared/logger'
import { validateSchema, isObjectEmpty } from '../'
import { getValue, setValue } from '../../shared/dao'
import {
  validateContext,
  validateQuote,
  validateStops,
  validateCancellationTerms,
  validateEntity,
  validateItemRefIds,
  validatePayloadAgainstSchema,
  validatePaymentObject,
} from './mobilityChecks'
import { validateItemsTags, validateRouteInfoTags } from './tags'
import attributeConfig from './config/config2.0.1.json'

export const checkOnConfirm = (data: any, msgIdSet: any, version: any) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [mobilitySequence.ON_CONFIRM]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.ON_CONFIRM, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.CONFIRM, constants.ON_CONFIRM)
    setValue(`${mobilitySequence.ON_CONFIRM}_message`, message)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const on_confirm = message.order
    const itemIDS: any = getValue('ItmIDS')
    const itemIdArray: any[] = []
    const fulfillmentIdsSet = new Set()
    const storedFull: any = getValue(`${mobilitySequence.ON_SELECT}_storedFulfillments`)

    let newItemIDSValue: any[]

    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      on_confirm.items.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
    }

    setValue('ItmIDS', newItemIDSValue)

    try {
      logger.info(`Checking id in message object  /${constants.ON_CONFIRM}`)
      if (!on_confirm.id) {
        errorObj.id = `Id in message object must be present/${constants.ON_CONFIRM}`
      } else {
        setValue('orderId', on_confirm?.id)
      }
    } catch (error: any) {
      logger.error(`!!Error while checking id in message object  /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing provider object in /${constants.CONFIRM} and /${constants.ON_CONFIRM}`)
      if (on_confirm.provider.id != getValue('providerId')) {
        errorObj.prvdrId = `Provider Id mismatches in /${constants.CONFIRM} and /${constants.ON_CONFIRM}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while checking provider object in /${constants.CONFIRM} and /${constants.ON_CONFIRM}, ${error.stack}`,
      )
    }

    // fulfillment checks
    try {
      logger.info(`Validating fulfillments object for /${constants.ON_CONFIRM}`)
      on_confirm.fulfillments.forEach((fulfillment: any, index: number) => {
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
          ] = `Fulfillment type must be DELIVERY at index ${index} in /${constants.ON_CONFIRM}`
        }

        //customer checks
        const customerErrors = validateEntity(fulfillment.customer, 'customer', constants.ON_CONFIRM, index)
        Object.assign(errorObj, customerErrors)

        //agent checks
        const agentErrors = validateEntity(fulfillment.agent, 'customer', constants.ON_CONFIRM, index)
        Object.assign(errorObj, agentErrors)

        // Check stops for START and END, or time range with valid timestamp and GPS
        const otp = true
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
      logger.error(`!!Error occcurred while checking fulfillments info in /${constants.ON_CONFIRM},  ${error.message}`)
      return { error: error.message }
    }

    //items checks
    try {
      logger.info(`Validating items object for /${constants.ON_CONFIRM}`)
      if (!on_confirm?.items) errorObj.items = `items is missing in /${constants.ON_CONFIRM}`
      else {
        on_confirm.items.forEach((item: any, index: number) => {
          const itemKey = `items[${index}]`
          if (!newItemIDSValue.includes(item.id)) {
            errorObj[
              `${itemKey}.id`
            ] = `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in /${constants.ON_CONFIRM}`
          }

          //price check
          if (!item?.price) errorObj[`${itemKey}.price`] = `price is missing at item.index ${index} `

          //fulfillment_ids, location_ids & payment_ids checks
          const refIdsErrors = validateItemRefIds(
            item,
            constants.ON_CONFIRM,
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
            ] = `descriptor.code must be RIDE at item.index ${index} in /${constants.ON_CONFIRM}`
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
      logger.error(`!!Error occcurred while checking items info in /${constants.ON_CONFIRM},  ${error.message}`)
      return { error: error.message }
    }

    // check payments
    try {
      logger.info(`Checking payments in /${constants.ON_CONFIRM}`)
      const payments = on_confirm?.payments
      const paymentErrors = validatePaymentObject(payments, constants.ON_CONFIRM)
      Object.assign(errorObj, paymentErrors)
    } catch (error: any) {
      logger.error(`!!Errors while checking payments in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    //quote check
    try {
      logger.info(`Checking quote details in /${constants.ON_CONFIRM}`)
      const quoteErrors = validateQuote(on_confirm?.quote, constants.ON_CONFIRM)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking Quote in /${constants.ON_CONFIRM},  ${error.message}`)
      return { error: error.message }
    }

    //cancellation_terms check
    try {
      logger.info(`Checking cancellation terms in /${constants.ON_CONFIRM}`)
      const cancellationErrors = validateCancellationTerms(on_confirm.cancellation_terms, constants.ON_CONFIRM)
      Object.assign(errorObj, cancellationErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation_terms in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    //status check
    try {
      logger.info(`Checking status in message object  /${constants.ON_CONFIRM}`)
      if (!message.order.status || !['COMPLETE', 'ACTIVE'].includes(message.order.status)) {
        errorObj.status =
          'Invalid or missing"` status in the message.order object. It must be one of: COMPLETE or ACTIVE'
      }
    } catch (error: any) {
      logger.error(`!!Error while checking status in message.order object  /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    if (version === '2.0.1') {
      const additionalAttributes: any = attributeConfig.on_confirm
      validatePayloadAgainstSchema(additionalAttributes, data, errorObj, '', '')
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_CONFIRM} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}
