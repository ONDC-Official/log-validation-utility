// import _ from 'lodash'
import constants, { mobilitySequence, ON_DEMAND_VEHICLE } from '../../constants'
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

export const checkOnInit = (data: any, msgIdSet: any, version: any) => {
  try {
    const errorObj: any = {}
    if (!data || isObjectEmpty(data)) {
      return { [mobilitySequence.ON_INIT]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('TRV', constants.ON_INIT, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.INIT, constants.ON_INIT)
    setValue(`${mobilitySequence.ON_INIT}_message`, message)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const on_init = message.order
    const itemIDS: any = getValue(`itemIds`)
    const locationIds = getValue(`locationIds`)
    const storedFull: any = getValue(`${mobilitySequence.ON_SELECT}_storedFulfillments`)
    const fulfillmentIdsSet = new Set()

    try {
      logger.info(`Checking provider Id in /${constants.ON_SEARCH} and /${constants.ON_INIT}`)
      if (!on_init.provider || on_init.provider.id != getValue('providerId')) {
        errorObj.prvdrId = `Provider Id mismatches in /${constants.INIT} and /${constants.ON_INIT}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing provider Id in /${constants.ON_SEARCH} and /${constants.ON_INIT}, ${error.stack}`,
      )
    }

    //fulfillments
    try {
      logger.info(`Validating fulfillments object for /${constants.ON_INIT}`)
      on_init.fulfillments.forEach((fulfillment: any, index: number) => {
        const fulfillmentKey = `fulfillments[${index}]`
        fulfillmentIdsSet.add(fulfillment.id)
        if (!fulfillment?.id) {
          errorObj[fulfillmentKey] = `id is missing in fulfillments[${index}]`
        } else if (!storedFull.includes(fulfillment.id)) {
          errorObj[
            `${fulfillmentKey}.id`
          ] = `/message/order/fulfillments/id in fulfillments: ${fulfillment.id} should be one of the /fulfillments/id mapped in previous call`
        }

        if (!ON_DEMAND_VEHICLE.includes(fulfillment.vehicle.category)) {
          errorObj[`${fulfillmentKey}.vehicleCategory`] = `Vehicle category should be one of ${ON_DEMAND_VEHICLE}`
        }

        if (fulfillment.type !== 'DELIVERY') {
          errorObj[
            `${fulfillmentKey}.type`
          ] = `Fulfillment type must be DELIVERY at index ${index} in /${constants.ON_INIT}`
        }

        if (Object.prototype.hasOwnProperty.call(fulfillment, 'agent')) {
          errorObj[`fulfillments${index}_agent`] = `/message/order/agent is not part of /${constants.ON_INIT} call`
        }

        //customer checks
        const customerErrors = validateEntity(fulfillment.customer, 'customer', constants.ON_INIT, index)
        Object.assign(errorObj, customerErrors)

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
      logger.error(`!!Error occcurred while checking fulfillments info in /${constants.ON_INIT},  ${error.message}`)
      return { error: error.message }
    }

    //items checks
    try {
      logger.info(`Validating items object for /${constants.ON_INIT}`)
      if (!on_init?.items) errorObj.items = `items is missing in /${constants.ON_INIT}`
      else {
        on_init.items.forEach((item: any, index: number) => {
          const itemKey = `items[${index}]`

          if (!item?.id) {
            errorObj[`${itemKey}.id`] = `id is missing in [${itemKey}]`
          } else if (!itemIDS.includes(item.id)) {
            errorObj[
              `${itemKey}.id`
            ] = `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in /${constants.ON_INIT}`
          }

          //price check
          if (!item?.price?.value) errorObj[`${itemKey}.price`] = `value is missing at item.index ${index} `

          //fulfillment_ids, location_ids & payment_ids checks
          const refIdsErrors = validateItemRefIds(
            item,
            constants.ON_INIT,
            index,
            fulfillmentIdsSet,
            new Set(locationIds),
            new Set(),
          )
          Object.assign(errorObj, refIdsErrors)

          //descriptor.code
          if (!item?.descriptor?.code)
            errorObj[`${itemKey}.code`] = `descriptor.code is missing at index: ${index} in /${constants.ON_INIT}`
          else if (item.descriptor.code !== 'RIDE') {
            errorObj[`${itemKey}.type`] = `descriptor.code must be RIDE at item.index ${index} in /${constants.ON_INIT}`
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
      logger.error(`!!Error occcurred while checking items info in /${constants.ON_INIT},  ${error.message}`)
      return { error: error.message }
    }

    try {
      logger.info(`Checking cancellation terms in /${constants.ON_INIT}`)
      const cancellationErrors = validateCancellationTerms(on_init.cancellation_terms, constants.ON_INIT)
      Object.assign(errorObj, cancellationErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation_terms in /${constants.ON_INIT}, ${error.stack}`)
    }

    // check payments
    try {
      logger.info(`Checking payments in /${constants.ON_INIT}`)
      const payments = on_init?.payments
      const paymentErrors = validatePaymentObject(payments, constants.ON_INIT)
      Object.assign(errorObj, paymentErrors)
    } catch (error: any) {
      logger.error(`!!Errors while checking payments in /${constants.ON_INIT}, ${error.stack}`)
    }

    try {
      logger.info(`Checking quote details in /${constants.ON_INIT}`)
      const quoteErrors = validateQuote(on_init?.quote, constants.ON_INIT)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking Quote in /${constants.ON_INIT},  ${error.message}`)
      return { error: error.message }
    }

    if (version === '2.0.1') {
      const additionalAttributes: any = attributeConfig.on_init
      validatePayloadAgainstSchema(additionalAttributes, data, errorObj, '', '')
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_INIT} API`, err)
    return { error: err.message }
  }
}
