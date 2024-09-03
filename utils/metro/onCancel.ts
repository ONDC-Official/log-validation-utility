// /* eslint-disable no-prototype-builtins */
// // import _ from 'lodash'
// import constants, { mobilitySequence } from '../../constants'
// import { logger } from '../../shared/logger'
// import { validateSchema, isObjectEmpty } from '..'
// import { getValue, setValue } from '../../shared/dao'
// import { validateContext, validateStops } from './mobilityChecks'
// import { validateRouteInfoTags, validateCancellationTerm } from './tags'
// import _ from 'lodash'

// export const checkOnCancel = (data: any, msgIdSet: any, sequence: string) => {
//   const errorObj: any = {}
//   try {
//     if (!data || isObjectEmpty(data)) {
//       return { [mobilitySequence.ON_CANCEL]: 'JSON cannot be empty' }
//     }

//     const { message, context } = data
//     if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
//       return { missingFields: '/context, /message, /catalog or /message/catalog is missing or empty' }
//     }

//     const schemaValidation = validateSchema('TRV', constants.ON_CANCEL, data)
//     const contextRes: any = validateContext(context, msgIdSet, constants.CANCEL, constants.ON_CANCEL)
//     setValue(`${mobilitySequence.ON_CANCEL}_message`, message)

//     if (!contextRes?.valid) {
//       Object.assign(errorObj, contextRes.ERRORS)
//     }

//     if (schemaValidation !== 'error') {
//       Object.assign(errorObj, schemaValidation)
//     }

//     const onCancel: any = message.order
//     const fulfillmentIdsSet = new Set()
//     const paymentIdsSet = new Set()

//     if (!('id' in onCancel)) {
//       errorObj['order'] = `id should be sent in /${constants.ON_CANCEL}`
//     }

//     try {
//       logger.info(`Validating status for /${constants.ON_CANCEL}`)
//       const status = onCancel?.status
//       if (!status) {
//         errorObj['status'] = `status should be sent in /${constants.CANCEL}`
//       } else if (sequence === 'on_cancel') {
//         if (status !== 'CANCELLED') {
//           errorObj['status'] = `status should be CANCELLED in /${constants.ON_CANCEL}`
//         }
//       } else if (sequence === 'soft_on_cancel') {
//         if (status !== 'SOFT_CANCEL') {
//           errorObj['status'] = `status should be SOFT_CANCEL in /${constants.ON_CANCEL}`
//         }
//       }
//     } catch (error: any) {
//       logger.error(`!!Error while validating provider for /${constants.ON_CANCEL}, ${error.stack}`)
//     }

//     try {
//       logger.info(`Validating provider object for /${constants.ON_CANCEL}`)
//       if (!onCancel?.provider) {
//         errorObj['provider'] = `provider should be sent in /${constants.CANCEL}`
//       } else {
//         const providerId: any = getValue(`providerId`)
//         if (!('id' in onCancel?.provider)) {
//           errorObj['provider'] = `id should be sent in /${constants.ON_CANCEL}`
//         } else if (providerId) {
//           if (!_.isEqual(onCancel?.provider?.id, providerId)) {
//             errorObj['provider'] = `id should be the same as sent in /${constants.CANCEL}`
//           }
//         }
//       }
//     } catch (error: any) {
//       logger.error(`!!Error while validating provider for /${constants.ON_CANCEL}, ${error.stack}`)
//     }

//     try {
//       logger.info(`Validating fulfillments object for /${constants.ON_CANCEL}`)

//       if (!onCancel?.fulfillments || onCancel.fulfillments.length === 0) {
//         errorObj['fulfillments'] = `fulfillments array must be present in /${constants.ON_CANCEL}`
//       } else {
//         onCancel.fulfillments.forEach((fulfillment: any, i: number) => {
//           const fulfillmentId = fulfillment.id

//           // Check if fulfillment ID is unique
//           if (fulfillmentIdsSet.has(fulfillmentId)) {
//             errorObj[
//               `fulfillmentId_${i}`
//             ] = `Duplicate fulfillment ID '${fulfillmentId}' at index ${i} in /${constants.ON_CANCEL}`
//           } else {
//             fulfillmentIdsSet.add(fulfillmentId)
//           }

//           if (fulfillment.type !== 'DELIVERY') {
//             errorObj[
//               `fulfillmentType_${i}`
//             ] = `Fulfillment type must be DELIVERY at index ${i} in /${constants.ON_CANCEL}`
//           }

//           const stateCode = fulfillment.state?.descriptor?.code
//           if (sequence === 'on_cancel' && stateCode !== 'RIDE_CANCELLED') {
//             errorObj[
//               `fulfillmentStateCode_${i}`
//             ] = `Fulfillment state code must be RIDE_CANCELLED at index ${i} in /${constants.ON_CANCEL}`
//           } else {
//             const validStateCodes = [
//               'RIDE_CANCELLED',
//               'RIDE_ENDED',
//               'RIDE_STARTED',
//               'RIDE_ASSIGNED',
//               'RIDE_ENROUTE_PICKUP',
//               'RIDE_ARRIVED_PICKUP',
//             ]

//             if (!validStateCodes.includes(stateCode)) {
//               errorObj[
//                 `fulfillmentStateCode_${i}`
//               ] = `Invalid fulfillment state code at index ${i} in /${constants.ON_CANCEL}`
//             }
//           }

//           validateCustomer(errorObj, fulfillment.customer, i)
//           validateAgent(errorObj, fulfillment.agent, i)
//           validateVehicle(errorObj, fulfillment.vehicle, i)

//           if (fulfillment.tags) {
//             // Validate route info tags
//             const tagsValidation = validateRouteInfoTags(fulfillment.tags)
//             if (!tagsValidation.isValid) {
//               Object.assign(errorObj, { tags: tagsValidation.errors })
//             }
//           }

//           // Check stops for START and END, or time range with valid timestamp and GPS
//           const otp = true
//           const cancel = true
//           validateStops(fulfillment?.stops, i, otp, cancel)
//         })
//       }
//     } catch (error: any) {
//       logger.error(`!!Error while validating fulfillments for /${constants.ON_CANCEL}, ${error.stack}`)
//       return { error: error.message }
//     }

//     try {
//       const payment = onCancel?.payments
//       logger.info(`Validating payments object for /${constants.ON_CANCEL}`)

//       if (!payment || payment?.length === 0) {
//         errorObj['payments'] = `payments array must be sent in /${constants.ON_CANCEL}`
//       } else {
//         payment.forEach((payment: any, index: number) => {
//           const paymentId = payment.id

//           if (paymentIdsSet.has(paymentId)) {
//             errorObj[
//               `paymentId_${index}`
//             ] = `Duplicate payment ID '${paymentId}' at index ${index} in /${constants.ON_CANCEL}`
//           } else {
//             paymentIdsSet.add(paymentId)
//           }

//           const requiredFields = ['collected_by', 'status', 'type']

//           requiredFields.forEach((field) => {
//             if (!(field in payment)) {
//               errorObj[`${field}_${index}`] = `${field} is missing in payments at index ${index}`
//             }
//           })

//           const params = payment.params
//           if (!params) {
//             errorObj[`params_${index}`] = `params object is missing in payments at index ${index}`
//           } else {
//             const paramsFields = ['bank_code', 'bank_account_number', 'virtual_payment_address']
//             paramsFields.forEach((field) => {
//               if (!(field in params)) {
//                 errorObj[`${field}_${index}`] = `${field} is missing in params for payments at index ${index}`
//               }
//             })
//           }

//           // Validate tags
//           const requiredTagGroups = ['SETTLEMENT_DETAILS', 'SETTLEMENT_TERMS', 'BUYER_FINDER_FEES']
//           const tags = payment.tags || []

//           requiredTagGroups.forEach((tagGroup) => {
//             const tagGroupFound = tags.some((tag: any) => tag.descriptor?.code === tagGroup)

//             if (!tagGroupFound) {
//               errorObj[
//                 `${tagGroup}_${index}`
//               ] = `${tagGroup} tag group is missing at index ${index} in /${constants.ON_CANCEL}`
//             }
//           })
//         })
//       }
//     } catch (error: any) {
//       logger.error(`!!Error while validating payments for /${constants.ON_CANCEL}, ${error.stack}`)
//       return { error: error.message }
//     }

//     try {
//       logger.info(`Validating items object for /${constants.ON_CANCEL}`)
//       const onCancel: any = message.order
//       const itemsId = new Set()

//       if (!onCancel?.items || onCancel.items.length === 0) {
//         errorObj['items'] = 'items array must be present in /${constants.ON_CANCEL}'
//       } else {
//         onCancel.items.forEach((item: any, index: number) => {
//           const itemId = item.id

//           if (!itemId) {
//             errorObj[`itemId_${index}`] = `Item ID is missing at index ${index} in /${constants.ON_CANCEL}`
//           } else if (itemsId.has(itemId)) {
//             errorObj[`itemId_${index}`] = `Duplicate Item ID '${itemId}' at index ${index} in /${constants.ON_CANCEL}`
//           } else {
//             itemsId.add(itemId)
//           }

//           if (!item.descriptor || !item.descriptor.code) {
//             errorObj[
//               `descriptorCode_${index}`
//             ] = `Descriptor code is missing at index ${index} in /${constants.ON_CANCEL}`
//           }

//           if (!item.price || !item.price.currency || !item.price.value) {
//             errorObj[`price_${index}`] = `Price details are incomplete at index ${index} in /${constants.ON_CANCEL}`
//           }

//           if (!item?.payment_ids) {
//             errorObj[`payment_ids`] = `payment_ids should be present at index ${index} in /${constants.ON_CANCEL}`
//           } else {
//             item.payment_ids.forEach((paymentId: string) => {
//               if (!paymentIdsSet.has(paymentId)) {
//                 errorObj[
//                   `invalidPaymentId_${index}`
//                 ] = `Payment ID '${paymentId}' at index ${index} in /${constants.ON_CANCEL} is not valid`
//               }
//             })
//           }

//           if (!item?.fulfillment_ids) {
//             errorObj[
//               `fulfillment_ids`
//             ] = `fulfillment_ids should be present at index ${index} in /${constants.ON_CANCEL}`
//           } else {
//             item.fulfillment_ids.forEach((fulfillmentId: string) => {
//               if (!_.isEmpty(fulfillmentIdsSet) && !fulfillmentIdsSet.has(fulfillmentId)) {
//                 errorObj[
//                   `invalidFulfillmentId_${index}`
//                 ] = `Fulfillment ID '${fulfillmentId}' at index ${index} in /${constants.ON_CANCEL} is not valid`
//               }
//             })
//           }

//           // Validate tags
//           const requiredTagGroups = ['FARE_POLICY', 'INFO']
//           const tags = item.tags || []

//           requiredTagGroups.forEach((tagGroup) => {
//             const tagGroupFound = tags.some((tag: any) => tag.descriptor?.code === tagGroup)

//             if (!tagGroupFound) {
//               errorObj[
//                 `tagGroup_${tagGroup}_${index}`
//               ] = `${tagGroup} tag group is missing at index ${index} in /${constants.ON_CANCEL}`
//             }
//           })
//         })
//       }
//     } catch (error: any) {
//       logger.error(`!!Error while validating items for /${constants.ON_CANCEL}, ${error.stack}`)
//       return { error: error.message }
//     }

//     try {
//       logger.info(`Checking quote details in /${constants.ON_CANCEL}`)
//       const quote = onCancel.quote
//       const quoteBreakup = quote.breakup
//       const requiredBreakupItems = ['BASE_FARE', 'DISTANCE_FARE', 'CURRENT_FARE_CHARGE']

//       if (sequence == 'soft_on_cancel') {
//         requiredBreakupItems.push('CANCELLATION_CHARGES')
//       }

//       const missingBreakupItems = requiredBreakupItems.filter(
//         (item) => !quoteBreakup.find((breakupItem: any) => breakupItem.title.toUpperCase() === item),
//       )

//       if (missingBreakupItems.length > 0) {
//         errorObj.missingBreakupItems = `Quote breakup is missing the following items: ${missingBreakupItems.join(', ')}`
//       }

//       const totalBreakupValue = quoteBreakup.reduce((total: any, item: any) => total + parseFloat(item.price.value), 0)
//       const priceValue = parseFloat(quote.price.value)

//       if (totalBreakupValue !== priceValue) {
//         errorObj.breakupTotalMismatch = `Total of quote breakup (${totalBreakupValue}) does not match with price.value (${priceValue})`
//       }

//       const currencies = quoteBreakup.map((item: any) => item.currency)
//       if (new Set(currencies).size !== 1) {
//         errorObj.multipleCurrencies = 'Currency must be the same for all items in the quote breakup'
//       }

//       if (!quote.ttl) {
//         errorObj.missingTTL = 'TTL is required in the quote'
//       }
//     } catch (error: any) {
//       logger.error(`!!Error while checking quote details in /${constants.ON_CANCEL}`, error.stack)
//     }

//     try {
//       const cancellationTerms = onCancel?.cancellation_terms

//       if (!cancellationTerms || cancellationTerms?.length === 0) {
//         errorObj['cancellation_terms'] = `cancellation_terms array must be present in /${constants.ON_CANCEL}`
//       } else {
//         cancellationTerms.forEach((term: any, index: number) => {
//           Object.assign(errorObj, validateCancellationTerm(term, index))
//         })
//       }
//     } catch (error: any) {
//       logger.error(`!!Error while validating cancellation_terms for /${constants.ON_CANCEL}, ${error.stack}`)
//       return { error: error.message }
//     }

//     return Object.keys(errorObj).length > 0 && errorObj
//   } catch (err: any) {
//     logger.error(`!!Some error occurred while checking /${constants.ON_CANCEL} API`, JSON.stringify(err.stack))
//     return { error: err.message }
//   }
// }

// const validateCustomer = (errorObj: any, customer: any, i: number) => {
//   if (!customer || !customer.person || !customer.contact || !customer.person.name || !customer.contact.phone) {
//     errorObj[`fulfillment_${i}_customer`] = `Customer details are incomplete at index ${i} in /${constants.ON_CANCEL}`
//   }
// }

// const validateAgent = (errorObj: any, agent: any, i: number) => {
//   if (!agent || !agent.person || !agent.contact || !agent.person.name || !agent.contact.phone) {
//     errorObj[`fulfillment_${i}_agent`] = `Agent details are incomplete at index ${i} in /${constants.ON_CANCEL}`
//   }
// }

// const validateVehicle = (errorObj: any, vehicle: any, i: number) => {
//   if (
//     !vehicle ||
//     !vehicle.category ||
//     !['METRO', 'AUTO_RICKSHAW', 'CAB', 'BUS', 'AIRLINE'].includes(vehicle.category)
//   ) {
//     errorObj[
//       `fulfillment_${i}_vehicle_category`
//     ] = `Invalid or missing vehicle category at index ${i} in /${constants.ON_CANCEL}`
//   }

//   if (!vehicle.make || !vehicle.model || !vehicle.registration) {
//     errorObj[
//       `fulfillment_${i}_vehicle_details`
//     ] = `Vehicle details are incomplete at index ${i} in /${constants.ON_CANCEL}`
//   }
// }

//***************************************************************************************************** */
/* eslint-disable no-prototype-builtins */
// import _ from 'lodash'
import constants, { metroSequence } from '../../constants'
import { logger } from '../../shared/logger'
import { validateSchema, isObjectEmpty } from '..'
import { getValue, setValue } from '../../shared/dao'
import {
  validateContext,
  validatePaymentParams,
  validateQuote,
  validateStops,
  validateCancellationTerms,
} from './metroChecks'
import { validatePaymentTags, validateRouteInfoTags } from './tags'

const VALID_VEHICLE_CATEGORIES = ['AUTO_RICKSHAW', 'CAB', 'METRO', 'BUS', 'AIRLINE']
const VALID_DESCRIPTOR_CODES = ['RIDE', 'SJT', 'SESJT', 'RUT', 'PASS', 'SEAT', 'NON STOP', 'CONNECT']

export const checkOnCancelPayload = (
  data: any,
  msgIdSet: any,
  flow: { flow: string; flowSet: string },
  cancelType: boolean,
) => {
  const errorObj: any = {}
  const payment = getValue('paymentId')
  try {
    if (!data || isObjectEmpty(data)) {
      return { [constants.ON_CANCEL]: 'Json cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('TRV', constants.ON_CANCEL, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.ON_CONFIRM, constants.ON_CANCEL)
    setValue(`${constants.ON_CANCEL}_message`, message)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const on_cancel = message.order
    const itemIDS: any = getValue('ItmIDS')
    const itemIdArray: any[] = []
    const fulfillmentIdsSet = new Set()
    const storedFull: any = getValue(`${metroSequence.ON_CONFIRM}_storedFulfillments`)
    // const getFulfillmentId = getValue('StoredFulfillmentId') || []

    let newItemIDSValue: any[]

    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      on_cancel.items.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
    }

    setValue('ItmIDS', newItemIDSValue)

    try {
      logger.info(`Checking id in message object  /${constants.ON_CANCEL}`)
      if (!on_cancel.id) {
        errorObj.id = `Order ID must be present/${constants.ON_CANCEL}`
      } else {
        setValue('orderId', on_cancel?.id)
      }
    } catch (error: any) {
      logger.error(`!!Error while checking id in message object  /${constants.ON_CANCEL}, ${error.stack}`)
    }

    if (!on_cancel?.status) errorObj.status = `status should be sent in /${constants.CONFIRM}`
    else if (on_cancel?.status != (cancelType ? 'CANCELLED' : 'SOFT_CANCEL'))
      errorObj['descriptor_code'] =
        `descriptor code should be ${cancelType ? 'CANCELLED' : 'SOFT_CANCEL'} in /${constants.ON_CANCEL}`

    try {
      logger.info(`Comparing provider object in /${constants.CONFIRM} and /${constants.ON_CANCEL}`)
      if (on_cancel.provider.id != getValue('providerId')) {
        errorObj.prvdrId = `Provider Id mismatches in /${constants.CONFIRM} and /${constants.ON_CANCEL}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while checking provider object in /${constants.CONFIRM} and /${constants.ON_CANCEL}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Validating fulfillments object for /${constants.ON_CANCEL}`)
      on_cancel.fulfillments.forEach((fulfillment: any, index: number) => {
        const fulfillmentKey = `fulfillments[${index}]`

        if (!storedFull.includes(fulfillment?.id)) {
          errorObj[`${fulfillmentKey}.id`] =
            `/message/order/fulfillments/id in fulfillments: ${fulfillment.id} should be one of the /fulfillments/id mapped in ${constants.ON_INIT}`
        } else {
          fulfillmentIdsSet.add(fulfillment?.id)
        }

        if (!fulfillment?.vehicle) {
          errorObj['Vehicle'] = 'Vehicle Object Is Missing'
        } else {
          if (!VALID_VEHICLE_CATEGORIES.includes(fulfillment.vehicle.category)) {
            errorObj[`${fulfillmentKey}.vehicleCategory`] =
              `Vehicle category should be one of ${VALID_VEHICLE_CATEGORIES}`
          }
        }

        if (fulfillment.type !== 'TRIP') {
          errorObj[`${fulfillmentKey}.type`] =
            `Fulfillment type must be DELIVERY at index ${index} in /${constants.ON_CANCEL}`
        }

        // Check stops for START and END, or time range with valid timestamp and GPS
        const getStopsError = validateStops(fulfillment?.stops, index, false, false, constants.ON_CANCEL)
        const errorValue = Object.values(getStopsError)[0] || []
        if (Object.keys(getStopsError).length > 0 && Object.keys(errorValue)?.length)
          Object.assign(errorObj, getStopsError)

        if (fulfillment.tags) {
          // Validate route info tags
          if (String(flow.flow.toUpperCase()).includes('INTRACITY')) {
            const tagsValidation = validateRouteInfoTags(fulfillment.tags)
            if (!tagsValidation.isValid) {
              Object.assign(errorObj, { tags: tagsValidation.errors })
            }
          }
        }
      })
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking fulfillments info in /${constants.ON_CANCEL},  ${error.message}`)
      return { error: error.message }
    }

    try {
      on_cancel.items &&
        on_cancel.items.forEach((item: any, index: number) => {
          if (!newItemIDSValue.includes(item.id)) {
            const key = `item[${index}].item_id`
            errorObj[key] =
              `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in /${constants.ON_CANCEL}`
          }

          if (!item.descriptor || !item.descriptor.code) {
            const key = `item${index}_descriptor`
            errorObj[key] = `Descriptor is missing in items[${index}]`
          } else {
            if (!VALID_DESCRIPTOR_CODES.includes(item.descriptor.code)) {
              const key = `item${index}_descriptor`
              errorObj[key] =
                `descriptor.code should be one of ${VALID_DESCRIPTOR_CODES} instead of ${item.descriptor.code}`
            }
          }

          const price = item.price
          if (!price || !price.currency || !price.value) {
            const key = `item${index}_price`
            errorObj[key] = `Price is incomplete in /items[${index}]`
          }

          item.fulfillment_ids &&
            item.fulfillment_ids.forEach((fulfillmentId: string) => {
              if (!fulfillmentIdsSet.has(fulfillmentId)) {
                errorObj[`invalidFulfillmentId_${index}`] =
                  `Fulfillment ID should be one of the fulfillment id  '${fulfillmentId}' at index ${index} in /${constants.ON_CANCEL} is not valid`
              }
            })
        })
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking items info in /${constants.ON_CANCEL},  ${error.message}`)
      return { error: error.message }
    }

    try {
      logger.info(`Checking payments in /${constants.ON_CANCEL}`)
      on_cancel?.payments?.forEach((arr: any, i: number) => {
        if (!arr?.collected_by) {
          errorObj[`payemnts[${i}]_collected_by`] = `payments.collected_by must be present in ${constants.ON_SEARCH}`
        } else {
          const srchCollectBy = getValue(`collected_by`)
          if (srchCollectBy != arr?.collected_by)
            errorObj[`payemnts[${i}]_collected_by`] =
              `payments.collected_by value sent in ${constants.ON_SEARCH} should be ${srchCollectBy} as sent in ${constants.ON_CANCEL}`
        }

        if (!arr.id) errorObj[`payments[${i}]_id`] = `payments.id must be present in ${constants.ON_CANCEL}`

        if (arr?.id && arr?.id !== payment)
          errorObj[`payments[${i}]_id`] = `payments.id valueshould be ${payment} as sent in ${constants.CONFIRM}`

        const validTypes = ['PRE-ORDER', 'ON-FULFILLMENT', 'POST-FULFILLMENT']
        if (!arr?.type || !validTypes.includes(arr.type)) {
          errorObj[`payments[${i}]_type`] = `payments.params.type must be present in ${
            constants.ON_CANCEL
          } & its value must be one of: ${validTypes.join(', ')}`
        }

        const validStatus = ['NOT-PAID', 'PAID']
        if (!arr?.status || !validStatus.includes(arr.status)) {
          errorObj[`payments[${i}]_status`] = `payments.status must be present in ${
            constants.ON_CANCEL
          } & its value must be one of: ${validStatus.join(', ')}`
        }

        const params = arr.params
        const bankCode: string | null = getValue('bank_code')
        const bankAccountNumber: string | null = getValue('bank_account_number')
        const virtualPaymentAddress: string | null = getValue('virtual_payment_address')

        //---------------------------PAYMENT PARAMS-----------------------------
        if (!params) {
          errorObj[`payments[${i}]_params`] = `payments.params must be present in ${constants.CONFIRM}`
        }
        // Validate bank_code
        validatePaymentParams(params, bankCode, 'bank_code', errorObj, i, constants.ON_CANCEL)

        // Validate bank_account_number
        validatePaymentParams(params, bankAccountNumber, 'bank_account_number', errorObj, i, constants.ON_CANCEL)

        // Validate virtual_payment_address
        validatePaymentParams(
          params,
          virtualPaymentAddress,
          'virtual_payment_address',
          errorObj,
          i,
          constants.ON_CANCEL,
        )

        if (arr.time) {
          if (!arr.label || arr.label !== 'INSTALLMENT') {
            errorObj.time.label = `If time is present in payment, the corresponding label should be INSTALLMENT.`
          }
        }

        // Validate payment tags
        const tagsValidation = validatePaymentTags(arr.tags, constants?.ON_CANCEL)
        if (!tagsValidation.isValid) {
          Object.assign(errorObj, { tags: tagsValidation.errors })
        }
      })
    } catch (error: any) {
      logger.error(`!!Errors while checking payments in /${constants.ON_CANCEL}, ${error.stack}`)
    }

    try {
      logger.info(`Checking quote details in /${constants.ON_CANCEL}`)
      const quoteErrors = validateQuote(on_cancel?.quote, constants.ON_CANCEL)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking Quote in /${constants.ON_CANCEL},  ${error.message}`)
      return { error: error.message }
    }

    try {
      logger.info(`Checking cancellation terms in /${constants.ON_CANCEL}`)
      const cancellationErrors = validateCancellationTerms(on_cancel.cancellation_terms, constants.ON_CANCEL)
      Object.assign(errorObj, cancellationErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation_terms in /${constants.ON_CANCEL}, ${error.stack}`)
    }

    try {
      const { cancellation } = on_cancel || {}

      if (!cancellation) {
        errorObj.cancellation = `cancellation is missing in /${constants.ON_CANCEL}`
      } else {
        const { cancelled_by, time } = cancellation

        if (!cancelled_by) {
          errorObj.cancelled_by = `cancelled_by is missing in /${constants.ON_CANCEL}`
        } else if (cancelled_by !== 'BAP' || cancelled_by !== 'BPP') {
          errorObj.cancelled_by = `cancelled_by must be BAP or BPP in /${constants.ON_CANCEL}`
        }

        if (!time) {
          errorObj.time = `time is missing in /${constants.ON_CANCEL}`
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation in /${constants.ON_CANCEL}, ${error.stack}`)
    }

    // if (!on_confirm?.created_at) errorObj.created_at = `created_at is missing in /${constants.ON_CANCEL}`
    // else if (on_confirm?.created_at !== context?.timestamp)
    //   errorObj.created_at = `created_at must match with context.timestamp in /${constants.ON_CANCEL}`

    // if (!on_confirm?.updated_at) errorObj.updated_at = `updated_at is missing in /${constants.ON_CANCEL}`
    // else if (on_confirm?.updated_at !== context?.timestamp)
    //   errorObj.updated_at = `updated_at must match with context.timestamp in /${constants.ON_CANCEL}`

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_CANCEL} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}
