/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { mobilitySequence, ON_DEMAND_VEHICLE, MOB_FULL_STATE as VALID_FULL_STATE } from '../../constants'
import { logger } from '../../shared/logger'
import { validateSchema, isObjectEmpty, checkMobilityContext, timeDiff as timeDifference, checkBppIdOrBapId } from '../'
import { getValue, setValue } from '../../shared/dao'
import {
  validateCancellationTerms,
  validateEntity,
  validateItemRefIds,
  validateQuote,
  validateStops,
  validatePayloadAgainstSchema,
} from './mobilityChecks'
import { validateItemsTags, validateRouteInfoTags } from './tags'
import attributeConfig from './config/config2.0.1.json'

export const checkOnUpdate = (data: any, version: any) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [mobilitySequence.ON_UPDATE]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const searchContext: any = getValue(`${mobilitySequence.SEARCH}_context`)
    // const parentItemIdSet: any = getValue(`parentItemIdSet`)

    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.ON_UPDATE, data)

    const contextRes: any = checkMobilityContext(context, constants.ON_UPDATE)

    if (!context.bap_id) {
      errorObj['bap_id'] = 'context/bap_id is required'
    } else {
      const checkBap = checkBppIdOrBapId(context.bap_id)
      if (checkBap) Object.assign(errorObj, { bap_id: 'context/bap_id should not be a url' })
    }

    if (!context.bpp_id) {
      errorObj['bpp_id'] = 'context/bpp_id is required'
    } else {
      const checkBpp = checkBppIdOrBapId(context.bpp_id)
      if (checkBpp) Object.assign(errorObj, { bpp_id: 'context/bpp_id should not be a url' })
    }

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    setValue(`${mobilitySequence.ON_UPDATE}`, data)

    try {
      logger.info(`Comparing city of /${constants.SEARCH} and /${constants.ON_UPDATE}`)
      if (!_.isEqual(searchContext.location.city, context.location.city)) {
        errorObj.city = `City code mismatch in /${constants.SEARCH} and /${constants.ON_UPDATE}`
      }
    } catch (error: any) {
      logger.info(`Error while comparing city in /${constants.SEARCH} and /${constants.ON_UPDATE}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing country of /${constants.SEARCH} and /${constants.ON_UPDATE}`)
      if (!_.isEqual(searchContext.location.country, context.location.country)) {
        errorObj.country = `Country code mismatch in /${constants.SEARCH} and /${constants.ON_UPDATE}`
      }
    } catch (error: any) {
      logger.info(`Error while comparing country in /${constants.SEARCH} and /${constants.ON_UPDATE}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing timestamp of /${constants.UPDATE} and /${constants.ON_UPDATE}`)
      const tmpstmp = getValue('tmpstmp')
      if (_.gte(tmpstmp, context.timestamp)) {
        errorObj.tmpstmp = `Timestamp for /${constants.UPDATE} api cannot be greater than or equal to /${constants.ON_UPDATE} api`
      } else {
        const timeDiff = timeDifference(context.timestamp, tmpstmp)
        logger.info(timeDiff)
        if (timeDiff > 5000) {
          errorObj.tmpstmp = `context/timestamp difference between /${constants.ON_UPDATE} and /${constants.UPDATE} should be smaller than 5 sec`
        }
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.info(
        `Error while comparing timestamp for /${constants.UPDATE} and /${constants.ON_UPDATE} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.CONFIRM} and /${constants.ON_UPDATE}`)
      if (!_.isEqual(getValue('txnId'), context.transaction_id)) {
        errorObj.txnId = `Transaction Id should be same from /${constants.CONFIRM} onwards`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing transaction ids for /${constants.CONFIRM} and /${constants.ON_UPDATE} api, ${error.stack}`,
      )
    }

    const on_update = message.order
    const itemIDS: any = getValue('ItmIDS')
    const itemIdArray: any[] = []
    const storedFull: any = getValue(`${mobilitySequence.ON_SELECT}_storedFulfillments`)
    const fulfillmentIdsSet = new Set()

    let newItemIDSValue: any[]

    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      on_update.items.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
    }

    setValue('ItmIDS', newItemIDSValue)

    //fulfillment checks
    try {
      logger.info(`Validating fulfillments object for /${constants.ON_UPDATE}`)
      on_update.fulfillments.forEach((fulfillment: any, index: number) => {
        const fulfillmentKey = `fulfillments[${index}]`

        if (!fulfillment?.id) {
          errorObj[fulfillmentKey] = `id is missing in fulfillments[${index}]`
        } else if (!storedFull.includes(fulfillment.id)) {
          errorObj[`${fulfillmentKey}.id`] =
            `/message/order/fulfillments/id in fulfillments: ${fulfillment.id} should be one of the /fulfillments/id mapped in previous call`
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

        if (fulfillment?.type !== 'DELIVERY') {
          errorObj[`${fulfillmentKey}.type`] =
            `Fulfillment type must be DELIVERY at index ${index} in /${constants.ON_UPDATE}`
        }

        //customer checks
        const customerErrors = validateEntity(fulfillment.customer, 'customer', constants.ON_UPDATE, index)
        Object.assign(errorObj, customerErrors)

        //agent checks
        const agentErrors = validateEntity(fulfillment.agent, 'agent', constants.ON_UPDATE, index)
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
      logger.error(`!!Error occcurred while checking fulfillments info in /${constants.ON_UPDATE},  ${error.message}`)
      return { error: error.message }
    }

    //items checks
    try {
      logger.info(`Validating items object for /${constants.ON_UPDATE}`)
      if (!on_update?.items) errorObj.items = `items is missing in /${constants.ON_UPDATE}`
      else {
        on_update.items.forEach((item: any, index: number) => {
          const itemKey = `items[${index}]`
          if (!newItemIDSValue.includes(item.id)) {
            errorObj[`${itemKey}.id`] =
              `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in /${constants.ON_UPDATE}`
          }

          //price check
          if (!item?.price) errorObj[`${itemKey}.price`] = `price is missing at item.index ${index} `

          //fulfillment_ids, location_ids & payment_ids checks
          const refIdsErrors = validateItemRefIds(
            item,
            constants.ON_UPDATE,
            index,
            fulfillmentIdsSet,
            new Set(),
            new Set(),
          )
          Object.assign(errorObj, refIdsErrors)

          //descriptor.code
          if (item.descriptor.code !== 'RIDE') {
            errorObj[`${itemKey}.type`] =
              `descriptor.code must be RIDE at item.index ${index} in /${constants.ON_UPDATE}`
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
      logger.error(`!!Error occcurred while checking items info in /${constants.ON_UPDATE},  ${error.message}`)
      return { error: error.message }
    }

    try {
      logger.info(`Checking quote details in /${constants.ON_UPDATE}`)

      const quote = on_update.quote
      const quoteBreakup = quote.breakup

      const requiredBreakupItems = ['BASE_FARE', 'DISTANCE_FARE']
      const missingBreakupItems = requiredBreakupItems.filter(
        (item) => !quoteBreakup.find((breakupItem: any) => breakupItem.title.toUpperCase() === item),
      )

      if (missingBreakupItems.length > 0) {
        errorObj.missingBreakupItems = `Quote breakup is missing the following items: ${missingBreakupItems.join(', ')}`
      }

      const totalBreakupValue = quoteBreakup.reduce(
        (total: any, item: any) =>
          total + (item.title.toUpperCase() != 'NET_DISBURSED_AMOUNT' ? parseFloat(item.price.value) : 0),
        0,
      )
      const priceValue = parseFloat(quote.price.value)

      if (totalBreakupValue !== priceValue) {
        errorObj.breakupTotalMismatch = `Total of quote breakup (${totalBreakupValue}) does not match with price.value (${priceValue})`
      }

      const currencies = quoteBreakup.map((item: any) => item.currency)
      if (new Set(currencies).size !== 1) {
        errorObj.multipleCurrencies = 'Currency must be the same for all items in the quote breakup'
      }

      if (!quote.ttl) {
        errorObj.missingTTL = 'TTL is required in the quote'
      }
    } catch (error: any) {
      logger.error(`!!Error while checking quote details in /${constants.ON_UPDATE}`, error.stack)
    }

    try {
      logger.info(`Checking payments details in /${constants.ON_UPDATE}`)

      const payments = on_update.payments

      for (let i = 1; i < payments.length; i++) {
        const payment = payments[i]

        if (payment.status !== 'PAID' && payment.status !== 'NOT-PAID') {
          errorObj.invalidPaymentStatus = `Invalid payment status (${payment.status}) at index ${i}`
        }
      }

      const buyerFinderFeesTag = payments[0].tags.find((tag: any) => tag.descriptor.code === 'BUYER_FINDER_FEES')
      const settlementTermsTag = payments[0].tags.find((tag: any) => tag.descriptor.code === 'SETTLEMENT_TERMS')

      if (!buyerFinderFeesTag) {
        errorObj.buyerFinderFees = `BUYER_FINDER_FEES tag is missing in payments`
      }

      if (!settlementTermsTag) {
        errorObj.settlementTerms = `SETTLEMENT_TERMS tag is missing in payments`
      }

      if (!payments[0].collected_by) {
        errorObj.payments = `collected_by  is missing in payments`
      } else {
        const allowedCollectedByValues = ['BPP', 'BAP']
        const allowedStatusValues = ['NOT-PAID', 'PAID']

        const collectedBy = getValue(`collected_by`)
        if (collectedBy && collectedBy !== payments[0].collected_by) {
          errorObj.collectedBy = `Collected_By didn't match with what was sent in previous call.`
        } else {
          if (!allowedCollectedByValues.includes(payments[0].collected_by)) {
            errorObj.collectedBy = `Invalid value for collected_by. It should be either BPP or BAP.`
          }

          setValue(`collected_by`, payments[0].collected_by)
        }

        if (!allowedStatusValues.includes(payments[0].status)) {
          errorObj.paymentStatus = `Invalid value for status. It should be either of NOT-PAID or PAID.`
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking payments details in /${constants.ON_UPDATE}`, error.stack)
    }

    try {
      logger.info(`Checking provider id /${constants.ON_UPDATE}`)
      if (on_update.provider.id != getValue('providerId')) {
        errorObj.prvdrId = `Provider Id mismatches in /${constants.ON_CONFIRM} and /${constants.ON_UPDATE}`
      }
    } catch (error: any) {
      logger.error(`!!Error while checking provider id /${constants.ON_UPDATE}, ${error.stack}`)
    }

    //cancellation_terms checks
    try {
      logger.info(`Checking cancellation terms in /${constants.ON_UPDATE}`)
      const cancellationErrors = validateCancellationTerms(on_update.cancellation_terms, constants.ON_UPDATE)
      Object.assign(errorObj, cancellationErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation_terms in /${constants.ON_UPDATE}, ${error.stack}`)
    }

    //quote checks
    try {
      logger.info(`Checking quote details in /${constants.ON_UPDATE}`)
      const quoteErrors = validateQuote(on_update?.quote, constants.ON_UPDATE)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking Quote in /${constants.ON_UPDATE},  ${error.message}`)
      return { error: error.message }
    }

    if (version === '2.0.1') {
      const additionalAttributes: any = attributeConfig.on_update
      validatePayloadAgainstSchema(additionalAttributes, data, errorObj, '', '')
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_UPDATE} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}
