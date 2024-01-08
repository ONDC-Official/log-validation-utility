/* eslint-disable no-prototype-builtins */
// import _ from 'lodash'
import constants, { mobilitySequence } from '../../constants'
import { logger } from '../../shared/logger'
import { validateSchema, isObjectEmpty } from '../'
import { getValue, setValue } from '../../shared/dao'
import { validateContext, validateStops } from './mobilityChecks'
import { validateRouteInfoTags, validateCancellationTerm } from './tags'
import _ from 'lodash'

// const VALID_VEHICLE_CATEGORIES = ['AUTO_RICKSHAW', 'CAB', 'METRO', 'BUS', 'AIRLINE']
// const VALID_FULL_STATE = [
//   'RIDE_CANCELLED',
//   'RIDE_ENDED',
//   'RIDE_STARTED',
//   'RIDE_ASSIGNED',
//   'RIDE_ENROUTE_PICKUP',
//   'RIDE_ARRIVED_PICKUP',
// ]

export const checkOnCancel = (data: any, msgIdSet: any, sequence: string) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [mobilitySequence.ON_CANCEL]: 'Json cannot be empty' }
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
    //   const prvdrsId = new Set()
    //   const prvdrLocId = new Set()
    //   const itemsId = new Set()
    //   const storedLocations = new Set()
    //   const storedFulfillments = new Set()
    const fulfillmentIdsSet = new Set()
    const paymentIdsSet = new Set()
    // const orderId: any = getValue(`orderId`)

    if (!('id' in onCancel)) {
      errorObj['order'] = `id should be sent in /${constants.ON_CANCEL}`
      // } else if (orderId) {
      //   if (!_.isEqual(onCancel.id, orderId)) {
      //     errorObj['order'] = `id should be the same as sent in /${constants.CANCEL}`
      //   }
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

    try {
      logger.info(`Validating fulfillments object for /${constants.ON_CANCEL}`)

      if (!onCancel?.fulfillments || onCancel.fulfillments.length === 0) {
        errorObj['fulfillments'] = `fulfillments array must be present in /${constants.ON_CANCEL}`
      } else {
        onCancel.fulfillments.forEach((fulfillment: any, i: number) => {
          const fulfillmentId = fulfillment.id

          // Check if fulfillment ID is unique
          if (fulfillmentIdsSet.has(fulfillmentId)) {
            errorObj[
              `fulfillmentId_${i}`
            ] = `Duplicate fulfillment ID '${fulfillmentId}' at index ${i} in /${constants.ON_CANCEL}`
          } else {
            fulfillmentIdsSet.add(fulfillmentId)
          }

          if (fulfillment.type !== 'DELIVERY') {
            errorObj[
              `fulfillmentType_${i}`
            ] = `Fulfillment type must be DELIVERY at index ${i} in /${constants.ON_CANCEL}`
          }

          const stateCode = fulfillment.state?.descriptor?.code
          if (sequence === 'on_cancel' && stateCode !== 'RIDE_CANCELLED') {
            errorObj[
              `fulfillmentStateCode_${i}`
            ] = `Fulfillment state code must be RIDE_CANCELLED at index ${i} in /${constants.ON_CANCEL}`
          } else {
            const validStateCodes = [
              'RIDE_CANCELLED',
              'RIDE_ENDED',
              'RIDE_STARTED',
              'RIDE_ASSIGNED',
              'RIDE_ENROUTE_PICKUP',
              'RIDE_ARRIVED_PICKUP',
            ]

            if (!validStateCodes.includes(stateCode)) {
              errorObj[
                `fulfillmentStateCode_${i}`
              ] = `Invalid fulfillment state code at index ${i} in /${constants.ON_CANCEL}`
            }
          }

          validateCustomer(errorObj, fulfillment.customer, i)
          validateAgent(errorObj, fulfillment.agent, i)
          validateVehicle(errorObj, fulfillment.vehicle, i)

          // Validate route info tags
          const tagsValidation = validateRouteInfoTags(fulfillment.tags)
          if (!tagsValidation.isValid) {
            Object.assign(errorObj, { tags: tagsValidation.errors })
          }

          // Check stops for START and END, or time range with valid timestamp and GPS
          const otp = true
          const cancel = true
          validateStops(fulfillment?.stops, i, otp, cancel)
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while validating fulfillments for /${constants.ON_CANCEL}, ${error.stack}`)
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
          const requiredTagGroups = ['SETTLEMENT_DETAILS', 'SETTLEMENT_TERMS', 'BUYER_FINDER_FEES']
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
      logger.info(`Validating items object for /${constants.ON_CANCEL}`)
      const onCancel: any = message.order
      const itemsId = new Set()

      if (!onCancel?.items || onCancel.items.length === 0) {
        errorObj['items'] = 'items array must be present in /${constants.ON_CANCEL}'
      } else {
        onCancel.items.forEach((item: any, index: number) => {
          const itemId = item.id

          if (!itemId) {
            errorObj[`itemId_${index}`] = `Item ID is missing at index ${index} in /${constants.ON_CANCEL}`
          } else if (itemsId.has(itemId)) {
            errorObj[`itemId_${index}`] = `Duplicate Item ID '${itemId}' at index ${index} in /${constants.ON_CANCEL}`
          } else {
            itemsId.add(itemId)
          }

          if (!item.descriptor || !item.descriptor.code) {
            errorObj[
              `descriptorCode_${index}`
            ] = `Descriptor code is missing at index ${index} in /${constants.ON_CANCEL}`
          }

          if (!item.price || !item.price.currency || !item.price.value) {
            errorObj[`price_${index}`] = `Price details are incomplete at index ${index} in /${constants.ON_CANCEL}`
          }

          if (!item?.payment_ids) {
            errorObj[`payment_ids`] = `payment_ids should be present at index ${index} in /${constants.ON_CANCEL}`
          } else {
            item.payment_ids.forEach((paymentId: string) => {
              if (!paymentIdsSet.has(paymentId)) {
                errorObj[
                  `invalidPaymentId_${index}`
                ] = `Payment ID '${paymentId}' at index ${index} in /${constants.ON_CANCEL} is not valid`
              }
            })
          }

          if (!item?.fulfillment_ids) {
            errorObj[
              `fulfillment_ids`
            ] = `fulfillment_ids should be present at index ${index} in /${constants.ON_CANCEL}`
          } else {
            item.fulfillment_ids.forEach((fulfillmentId: string) => {
              if (!fulfillmentIdsSet.has(fulfillmentId)) {
                errorObj[
                  `invalidFulfillmentId_${index}`
                ] = `Fulfillment ID '${fulfillmentId}' at index ${index} in /${constants.ON_CANCEL} is not valid`
              }
            })
          }

          // Validate tags
          const requiredTagGroups = ['FARE_POLICY', 'INFO']
          const tags = item.tags || []

          requiredTagGroups.forEach((tagGroup) => {
            const tagGroupFound = tags.some((tag: any) => tag.descriptor?.code === tagGroup)

            if (!tagGroupFound) {
              errorObj[
                `tagGroup_${tagGroup}_${index}`
              ] = `${tagGroup} tag group is missing at index ${index} in /${constants.ON_CANCEL}`
            }
          })
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while validating items for /${constants.ON_CANCEL}, ${error.stack}`)
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
      const cancellationTerms = onCancel?.cancellation_terms

      if (!cancellationTerms || cancellationTerms?.length === 0) {
        errorObj['cancellation_terms'] = `cancellation_terms array must be present in /${constants.ON_CANCEL}`
      } else {
        cancellationTerms.forEach((term: any, index: number) => {
          Object.assign(errorObj, validateCancellationTerm(term, index))
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while validating cancellation_terms for /${constants.ON_CANCEL}, ${error.stack}`)
      return { error: error.message }
    }

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_CANCEL} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}

const validateCustomer = (errorObj: any, customer: any, i: number) => {
  if (!customer || !customer.person || !customer.contact || !customer.person.name || !customer.contact.phone) {
    errorObj[`fulfillment_${i}_customer`] = `Customer details are incomplete at index ${i} in /${constants.ON_CANCEL}`
  }
}

const validateAgent = (errorObj: any, agent: any, i: number) => {
  if (!agent || !agent.person || !agent.contact || !agent.person.name || !agent.contact.phone) {
    errorObj[`fulfillment_${i}_agent`] = `Agent details are incomplete at index ${i} in /${constants.ON_CANCEL}`
  }
}

const validateVehicle = (errorObj: any, vehicle: any, i: number) => {
  if (
    !vehicle ||
    !vehicle.category ||
    !['METRO', 'AUTO_RICKSHAW', 'CAB', 'BUS', 'AIRLINE'].includes(vehicle.category)
  ) {
    errorObj[
      `fulfillment_${i}_vehicle_category`
    ] = `Invalid or missing vehicle category at index ${i} in /${constants.ON_CANCEL}`
  }

  if (!vehicle.make || !vehicle.model || !vehicle.registration) {
    errorObj[
      `fulfillment_${i}_vehicle_details`
    ] = `Vehicle details are incomplete at index ${i} in /${constants.ON_CANCEL}`
  }
}
