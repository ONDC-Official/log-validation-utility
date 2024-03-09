/* eslint-disable no-prototype-builtins */
// import _ from 'lodash'
import constants, { ON_DEMAND_VEHICLE, MOB_FULL_STATE as VALID_FULL_STATE, mobilitySequence } from '../../constants'
import { logger } from '../../shared/logger'
import { validateSchema, isObjectEmpty } from '../'
import { getValue, setValue } from '../../shared/dao'
import {
  validateCancellationTerms,
  validateContext,
  validateEntity,
  validateItemRefIds,
  validateStops,
  validatePayloadAgainstSchema,
} from './mobilityChecks'
import { validateRouteInfoTags, validateItemsTags } from './tags'
import _ from 'lodash'
import attributeConfig from './config/config2.0.1.json'

export const checkOnCancel = (data: any, msgIdSet: any, sequence: string, version: any) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [mobilitySequence.ON_CANCEL]: 'JSON cannot be empty' }
    }

    const { message, context } = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /catalog or /message/catalog is missing or empty' }
    }

    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.ON_CANCEL, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.CANCEL, constants.ON_CANCEL)
    setValue(`${mobilitySequence.ON_CANCEL}_message`, message)

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    const onCancel: any = message.order
    const fulfillmentIdsSet = new Set()
    const paymentIdsSet = new Set()
    const storedFull: any = getValue(`${mobilitySequence.ON_SELECT}_storedFulfillments`)
    const itemIDS: any = getValue('ItmIDS')
    const itemIdArray: any[] = []

    let newItemIDSValue: any[]

    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      onCancel.items.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
    }

    setValue('ItmIDS', newItemIDSValue)

    if (!('id' in onCancel)) {
      errorObj['order'] = `id should be sent in /${constants.ON_CANCEL}`
    }

    try {
      logger.info(`Validating status for /${constants.ON_CANCEL}`)
      const status = onCancel?.status
      if (!status) {
        errorObj['status'] = `status should be sent in /${constants.CANCEL}`
      } else if (sequence === 'on_cancel') {
        if (status !== 'CANCELLED') {
          errorObj['status'] = `status should be CANCELLED in /${constants.ON_CANCEL}`
        }
      } else if (sequence === 'soft_on_cancel') {
        if (status !== 'SOFT_CANCEL') {
          errorObj['status'] = `status should be SOFT_CANCEL in /${constants.ON_CANCEL}`
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while validating provider for /${constants.ON_CANCEL}, ${error.stack}`)
    }

    try {
      logger.info(`Validating provider object for /${constants.ON_CANCEL}`)
      if (!onCancel?.provider) {
        errorObj['provider'] = `provider should be sent in /${constants.CANCEL}`
      } else {
        const providerId: any = getValue(`providerId`)
        if (!('id' in onCancel?.provider)) {
          errorObj['provider'] = `id should be sent in /${constants.ON_CANCEL}`
        } else if (providerId) {
          if (!_.isEqual(onCancel?.provider?.id, providerId)) {
            errorObj['provider'] = `id should be the same as sent in /${constants.CANCEL}`
          }
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while validating provider for /${constants.ON_CANCEL}, ${error.stack}`)
    }

    // fullfilment checks
    try {
      logger.info(`Validating fulfillments object for /${constants.ON_CANCEL}`)
      onCancel.fulfillments.forEach((fulfillment: any, index: number) => {
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

        const stateCode = fulfillment.state?.descriptor?.code
        if (sequence === 'on_cancel' && stateCode !== 'RIDE_CANCELLED') {
          errorObj[
            `fulfillmentStateCode_${index}`
          ] = `Fulfillment state code must be RIDE_CANCELLED at index ${index} in /${constants.ON_CANCEL}`
        } else {
          if (!VALID_FULL_STATE.includes(fulfillment?.state?.descriptor?.code)) {
            errorObj[`${fulfillmentKey}.state`] = `Invalid or missing descriptor.code for fulfillment ${index}`
          }
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
          ] = `Fulfillment type must be DELIVERY at index ${index} in /${constants.ON_CANCEL}`
        }

        //customer checks
        const customerErrors = validateEntity(fulfillment.customer, 'customer', constants.ON_CANCEL, index)
        Object.assign(errorObj, customerErrors)

        //agent checks
        const agentErrors = validateEntity(fulfillment.agent, 'customer', constants.ON_CANCEL, index)
        Object.assign(errorObj, agentErrors)

        // Check stops for START and END, or time range with valid timestamp and GPS
        const otp = true
        const cancel = true
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
      logger.error(`!!Error occcurred while checking fulfillments info in /${constants.ON_CANCEL},  ${error.message}`)
      return { error: error.message }
    }

    //items checks
    try {
      logger.info(`Validating items object for /${constants.ON_CANCEL}`)
      if (!onCancel?.items) errorObj.items = `items is missing in /${constants.ON_CANCEL}`
      else {
        onCancel.items.forEach((item: any, index: number) => {
          const itemKey = `items[${index}]`
          if (!newItemIDSValue.includes(item.id)) {
            errorObj[
              `${itemKey}.id`
            ] = `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in /${constants.ON_CANCEL}`
          }

          //price check
          if (!item?.price) errorObj[`${itemKey}.price`] = `price is missing at item.index ${index} `

          //fulfillment_ids, location_ids & payment_ids checks
          const refIdsErrors = validateItemRefIds(
            item,
            constants.ON_CANCEL,
            index,
            fulfillmentIdsSet,
            new Set(),
            paymentIdsSet,
          )
          Object.assign(errorObj, refIdsErrors)

          //descriptor.code
          if (item.descriptor.code !== 'RIDE') {
            errorObj[
              `${itemKey}.type`
            ] = `descriptor.code must be RIDE at item.index ${index} in /${constants.ON_CANCEL}`
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
      logger.error(`!!Error occcurred while checking items info in /${constants.ON_CANCEL},  ${error.message}`)
      return { error: error.message }
    }

    try {
      const payment = onCancel?.payments
      logger.info(`Validating payments object for /${constants.ON_CANCEL}`)

      if (!payment || payment?.length === 0) {
        errorObj['payments'] = `payments array must be sent in /${constants.ON_CANCEL}`
      } else {
        payment.forEach((payment: any, index: number) => {
          const paymentId = payment.id

          if (paymentIdsSet.has(paymentId)) {
            errorObj[
              `paymentId_${index}`
            ] = `Duplicate payment ID '${paymentId}' at index ${index} in /${constants.ON_CANCEL}`
          } else {
            paymentIdsSet.add(paymentId)
          }

          const requiredFields = ['collected_by', 'status', 'type']

          requiredFields.forEach((field) => {
            if (!(field in payment)) {
              errorObj[`${field}_${index}`] = `${field} is missing in payments at index ${index}`
            }
          })

          const params = payment.params
          if (!params) {
            errorObj[`params_${index}`] = `params object is missing in payments at index ${index}`
          } else {
            const paramsFields = ['bank_code', 'bank_account_number', 'virtual_payment_address']
            paramsFields.forEach((field) => {
              if (!(field in params)) {
                errorObj[`${field}_${index}`] = `${field} is missing in params for payments at index ${index}`
              }
            })
          }

          // Validate tags
          const requiredTagGroups = ['SETTLEMENT_TERMS', 'BUYER_FINDER_FEES']
          const tags = payment.tags || []

          requiredTagGroups.forEach((tagGroup) => {
            const tagGroupFound = tags.some((tag: any) => tag.descriptor?.code === tagGroup)

            if (!tagGroupFound) {
              errorObj[
                `${tagGroup}_${index}`
              ] = `${tagGroup} tag group is missing at index ${index} in /${constants.ON_CANCEL}`
            }
          })
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while validating payments for /${constants.ON_CANCEL}, ${error.stack}`)
      return { error: error.message }
    }

    try {
      logger.info(`Checking quote details in /${constants.ON_CANCEL}`)
      const quote = onCancel.quote
      const quoteBreakup = quote.breakup
      const requiredBreakupItems = ['BASE_FARE', 'DISTANCE_FARE', 'CURRENT_FARE_CHARGE']

      if (sequence == 'soft_on_cancel') {
        requiredBreakupItems.push('CANCELLATION_CHARGES')
      }

      const missingBreakupItems = requiredBreakupItems.filter(
        (item) => !quoteBreakup.find((breakupItem: any) => breakupItem.title.toUpperCase() === item),
      )

      if (missingBreakupItems.length > 0) {
        errorObj.missingBreakupItems = `Quote breakup is missing the following items: ${missingBreakupItems.join(', ')}`
      }

      const totalBreakupValue = quoteBreakup.reduce((total: any, item: any) => total + parseFloat(item.price.value), 0)
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
      logger.error(`!!Error while checking quote details in /${constants.ON_CANCEL}`, error.stack)
    }

    try {
      logger.info(`Checking cancellation terms in /${constants.ON_CANCEL}`)
      const cancellationErrors = validateCancellationTerms(onCancel.cancellation_terms, constants.ON_CANCEL)
      Object.assign(errorObj, cancellationErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation_terms in /${constants.ON_CANCEL}, ${error.stack}`)
    }

    if (version === '2.0.1') {
      const additionalAttributes: any = attributeConfig.on_cancel
      validatePayloadAgainstSchema(additionalAttributes, data, errorObj, '', '')
    }

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_CANCEL} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}
