/* eslint-disable no-prototype-builtins */
// import _ from 'lodash'
import constants, { mobilitySequence } from '../../constants'
import { logger } from '../../shared/logger'
import { validateSchema, isObjectEmpty, checkIdAndUri, checkBppIdOrBapId, timeDiff as timeDifference } from '../'
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

export const checkOnCancel = (data: any, msgIdSet: any, flow: string) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [mobilitySequence.ON_CANCEL]: 'Json cannot be empty' }
    }

    const { message, context } = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /catalog or /message/catalog is missing or empty' }
    }

    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.MOB_ONCANCEL, data)
    setValue(`${mobilitySequence.ON_CANCEL}_message`, message)
    if (flow == 'RIDER_CANCEL') {
      const cancelContext: any = getValue(`${mobilitySequence.CANCEL}_context`)
      performChecks(errorObj, cancelContext, context, flow)
    } else {
      const contextRes: any = validateContext(context, msgIdSet, constants.MOB_CANCEL, constants.MOB_ONCANCEL)
      if (!contextRes?.valid) {
        Object.assign(errorObj, contextRes.ERRORS)
      }
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
    const orderId: any = getValue(`orderId`)

    if (!('id' in onCancel)) {
      errorObj['order'] = `id should be sent in /${constants.MOB_ONCANCEL}`
    } else if (orderId) {
      if (!_.isEqual(onCancel.id, orderId)) {
        errorObj['order'] = `id should be the same as sent in /${constants.MOB_CANCEL}`
      }
    }

    try {
      logger.info(`Validating provider object for /${constants.MOB_ONCANCEL}`)
      if (!onCancel?.provider) {
        errorObj['provider'] = `provider should be sent in /${constants.MOB_CANCEL}`
      } else {
        const providerId: any = getValue(`providerId`)
        if (!('id' in onCancel?.provider)) {
          errorObj['provider'] = `id should be sent in /${constants.MOB_ONCANCEL}`
        } else if (providerId) {
          if (!_.isEqual(onCancel?.provider?.id, providerId)) {
            errorObj['provider'] = `id should be the same as sent in /${constants.MOB_CANCEL}`
          }
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while validating provider for /${constants.MOB_ONCANCEL}, ${error.stack}`)
    }

    try {
      logger.info(`Validating fulfillments object for /${constants.MOB_ONCANCEL}`)

      if (!onCancel?.fulfillments || onCancel.fulfillments.length === 0) {
        errorObj['fulfillments'] = `fulfillments array must be present in /${constants.MOB_ONCANCEL}`
      } else {
        onCancel.fulfillments.forEach((fulfillment: any, i: number) => {
          const fulfillmentId = fulfillment.id

          // Check if fulfillment ID is unique
          if (fulfillmentIdsSet.has(fulfillmentId)) {
            errorObj[
              `fulfillmentId_${i}`
            ] = `Duplicate fulfillment ID '${fulfillmentId}' at index ${i} in /${constants.MOB_ONCANCEL}`
          } else {
            fulfillmentIdsSet.add(fulfillmentId)
          }

          if (fulfillment.type !== 'DELIVERY') {
            errorObj[
              `fulfillmentType_${i}`
            ] = `Fulfillment type must be DELIVERY at index ${i} in /${constants.MOB_ONCANCEL}`
          }

          const stateCode = fulfillment.state?.descriptor?.code
          if (onCancel.status === 'CANCELLED' && stateCode !== 'RIDE_CANCELLED') {
            errorObj[
              `fulfillmentStateCode_${i}`
            ] = `Fulfillment state code must be RIDE_CANCELLED at index ${i} in /${constants.MOB_ONCANCEL}`
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
      logger.error(`!!Error while validating fulfillments for /${constants.MOB_ONCANCEL}, ${error.stack}`)
      return { error: error.message }
    }

    try {
      const payment = onCancel?.payments
      logger.info(`Validating payments object for /${constants.MOB_ONCANCEL}`)

      if (!payment || payment?.length === 0) {
        errorObj['payments'] = `payments array must be sent in /${constants.MOB_ONCANCEL}`
      } else {
        payment.forEach((payment: any, index: number) => {
          const paymentId = payment.id

          if (paymentIdsSet.has(paymentId)) {
            errorObj[
              `paymentId_${index}`
            ] = `Duplicate payment ID '${paymentId}' at index ${index} in /${constants.MOB_ONCANCEL}`
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
              ] = `${tagGroup} tag group is missing at index ${index} in /${constants.MOB_ONCANCEL}`
            }
          })
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while validating payments for /${constants.MOB_ONCANCEL}, ${error.stack}`)
      return { error: error.message }
    }

    try {
      logger.info(`Validating items object for /${constants.MOB_ONCANCEL}`)
      const onCancel: any = message.order
      const itemsId = new Set()

      if (!onCancel?.items || onCancel.items.length === 0) {
        errorObj['items'] = 'items array must be present in /${constants.MOB_ONCANCEL}'
      } else {
        onCancel.items.forEach((item: any, index: number) => {
          const itemId = item.id

          if (!itemId) {
            errorObj[`itemId_${index}`] = `Item ID is missing at index ${index} in /${constants.MOB_ONCANCEL}`
          } else if (itemsId.has(itemId)) {
            errorObj[
              `itemId_${index}`
            ] = `Duplicate Item ID '${itemId}' at index ${index} in /${constants.MOB_ONCANCEL}`
          } else {
            itemsId.add(itemId)
          }

          if (!item.descriptor || !item.descriptor.code) {
            errorObj[
              `descriptorCode_${index}`
            ] = `Descriptor code is missing at index ${index} in /${constants.MOB_ONCANCEL}`
          }

          if (!item.price || !item.price.currency || !item.price.value) {
            errorObj[`price_${index}`] = `Price details are incomplete at index ${index} in /${constants.MOB_ONCANCEL}`
          }

          item.payment_ids.forEach((paymentId: string) => {
            if (!paymentIdsSet.has(paymentId)) {
              errorObj[
                `invalidPaymentId_${index}`
              ] = `Payment ID '${paymentId}' at index ${index} in /${constants.MOB_ONCANCEL} is not valid`
            }
          })

          item.fulfillment_ids.forEach((fulfillmentId: string) => {
            if (!fulfillmentIdsSet.has(fulfillmentId)) {
              errorObj[
                `invalidFulfillmentId_${index}`
              ] = `Fulfillment ID '${fulfillmentId}' at index ${index} in /${constants.MOB_ONCANCEL} is not valid`
            }
          })

          // Validate tags
          const requiredTagGroups = ['FARE_POLICY', 'INFO']
          const tags = item.tags || []

          requiredTagGroups.forEach((tagGroup) => {
            const tagGroupFound = tags.some((tag: any) => tag.descriptor?.code === tagGroup)

            if (!tagGroupFound) {
              errorObj[
                `tagGroup_${tagGroup}_${index}`
              ] = `${tagGroup} tag group is missing at index ${index} in /${constants.MOB_ONCANCEL}`
            }
          })
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while validating items for /${constants.MOB_ONCANCEL}, ${error.stack}`)
      return { error: error.message }
    }

    try {
      logger.info(`Checking quote details in /${constants.MOB_ONCANCEL}`)
      const quote = onCancel.quote
      const quoteBreakup = quote.breakup
      const requiredBreakupItems = ['BASE_FARE', 'DISTANCE_FARE', 'CURRENT_FARE_CHARGE']

      if (onCancel.status == 'SOFT_CANCEL') {
        requiredBreakupItems.push('CANCELLATION_CHARGES')
      }

      const missingBreakupItems = requiredBreakupItems.filter(
        (item) => !quoteBreakup.find((breakupItem: any) => breakupItem.type === item),
      )

      if (missingBreakupItems.length > 0) {
        errorObj.missingBreakupItems = `Quote breakup is missing the following items: ${missingBreakupItems.join(', ')}`
      }

      const totalBreakupValue = quoteBreakup.reduce((total: any, item: any) => total + parseFloat(item.value), 0)
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
      logger.error(`!!Error while checking quote details in /${constants.MOB_ONCANCEL}`, error.stack)
    }

    try {
      const cancellationTerms = onCancel?.cancellation_terms

      if (!cancellationTerms || cancellationTerms?.length === 0) {
        errorObj['cancellation_terms'] = `cancellation_terms array must be present in /${constants.MOB_ONCANCEL}`
      } else {
        cancellationTerms.forEach((term: any, index: number) => {
          Object.assign(errorObj, validateCancellationTerm(term, index))
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while validating cancellation_terms for /${constants.MOB_ONCANCEL}, ${error.stack}`)
      return { error: error.message }
    }

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.MOB_ONCANCEL} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}

const validateCustomer = (errorObj: any, customer: any, i: number) => {
  if (!customer || !customer.person || !customer.contact || !customer.person.name || !customer.contact.phone) {
    errorObj[
      `fulfillment_${i}_customer`
    ] = `Customer details are incomplete at index ${i} in /${constants.MOB_ONCANCEL}`
  }
}

const validateAgent = (errorObj: any, agent: any, i: number) => {
  if (!agent || !agent.person || !agent.contact || !agent.person.name || !agent.contact.phone) {
    errorObj[`fulfillment_${i}_agent`] = `Agent details are incomplete at index ${i} in /${constants.MOB_ONCANCEL}`
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
    ] = `Invalid or missing vehicle category at index ${i} in /${constants.MOB_ONCANCEL}`
  }

  if (!vehicle.make || !vehicle.model || !vehicle.registration) {
    errorObj[
      `fulfillment_${i}_vehicle_details`
    ] = `Vehicle details are incomplete at index ${i} in /${constants.MOB_ONCANCEL}`
  }
}

const compareCity = (errorObj: any, cancelContext: any, context: any) => {
  try {
    logger.info(`Comparing city of /${constants.MOB_CANCEL} and /${constants.MOB_ONCANCEL}`)
    if (!_.isEqual(cancelContext.location.city, context.location.city)) {
      errorObj.city = `City code mismatch in /${constants.MOB_CANCEL} and /${constants.MOB_ONCANCEL}`
    }
  } catch (error: any) {
    logger.info(`Error while comparing city in /${constants.MOB_CANCEL} and /${constants.MOB_ONCANCEL}, ${error.stack}`)
  }
}

const compareTimestamp = (errorObj: any, context: any) => {
  try {
    logger.info(`Comparing timestamp of /${constants.MOB_CANCEL} and /${constants.MOB_ONCANCEL}`)
    const tmpstmp = getValue('tmpstmp')
    if (_.gte(tmpstmp, context.timestamp)) {
      errorObj.tmpstmp = `Timestamp for /${constants.MOB_CANCEL} api cannot be greater than or equal to /${constants.MOB_ONCANCEL} api`
    } else {
      const timeDiff = timeDifference(context.timestamp, tmpstmp)
      logger.info(timeDiff)
      if (timeDiff > 5000) {
        errorObj.tmpstmp = `context/timestamp difference between /${constants.MOB_ONCANCEL} and /${constants.MOB_CANCEL} should be smaller than 5 sec`
      }
    }

    setValue('tmpstmp', context.timestamp)
  } catch (error: any) {
    logger.info(
      `Error while comparing timestamp for /${constants.MOB_CANCEL} and /${constants.MOB_ONCANCEL} api, ${error.stack}`,
    )
  }
}

const compareCountry = (errorObj: any, cancelContext: any, context: any) => {
  try {
    logger.info(`Comparing country of /${constants.MOB_CANCEL} and /${constants.MOB_ONCANCEL}`)
    if (!_.isEqual(cancelContext.location.country, context.location.country)) {
      errorObj.country = `Country code mismatch in /${constants.MOB_CANCEL} and /${constants.MOB_ONCANCEL}`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing country in /${constants.MOB_CANCEL} and /${constants.MOB_ONCANCEL}, ${error.stack}`,
    )
  }
}

const compareTransactionIds = (errorObj: any, context: any) => {
  try {
    logger.info(`Comparing transaction Ids of /${constants.MOB_CANCEL} and /${constants.MOB_ONCANCEL}`)
    if (!_.isEqual(getValue('txnId'), context.transaction_id)) {
      errorObj.txnId = `Transaction Id throughout user journey should be same`
    }
  } catch (error: any) {
    logger.error(
      `!!Error while comparing transaction ids for /${constants.MOB_CANCEL} and /${constants.MOB_ONCANCEL} api, ${error.stack}`,
    )
  }
}

const compareMessageIds = (errorObj: any, cancelContext: any, context: any) => {
  try {
    logger.info(`Comparing Message Ids of /${constants.MOB_CANCEL} and /${constants.MOB_ONCANCEL}`)
    if (!_.isEqual(cancelContext.message_id, context.message_id)) {
      errorObj.message_id = `Message Id for /${constants.MOB_CANCEL} and /${constants.MOB_ONCANCEL} api should be same`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing message ids for /${constants.MOB_CANCEL} and /${constants.MOB_ONCANCEL} api, ${error.stack}`,
    )
  }
}

const performChecks = (errorObj: any, cancelContext: any, context: any, flow: any) => {
  const checksToSkipForFlows = ['DRIVER_CANCEL']

  if (!checksToSkipForFlows.includes(flow)) {
    compareCity(errorObj, cancelContext, context)
    compareCountry(errorObj, cancelContext, context)
    compareTimestamp(errorObj, context)
    compareTransactionIds(errorObj, context)
    compareMessageIds(errorObj, cancelContext, context)

    try {
      logger.info(`Comparing BAP and BPP in /${constants.MOB_ONCANCEL}`)

      const bppValidationResult = checkIdAndUri(context?.bpp_id, context?.bpp_uri, 'bpp')
      const bapValidationResult = checkIdAndUri(context?.bap_id, context?.bap_uri, 'bap')

      if (bppValidationResult !== null) {
        errorObj.bpp = bppValidationResult
      }

      if (bapValidationResult !== null) {
        errorObj.bap = bapValidationResult

        if (!errorObj.bpp && !errorObj.bap) {
          const prevContext: any = getValue(`${mobilitySequence.SEARCH}_context`)

          if (!_.isEqual(prevContext.bpp_id, context.bpp_id)) {
            errorObj.bppIdContextMismatch = `BPP Id mismatch in /${constants.MOB_CANCEL} and /${constants.MOB_ONCANCEL}`
          }

          if (!_.isEqual(prevContext.bpp_uri, context.bpp_uri)) {
            errorObj.bppUriContextMismatch = `BPP URL mismatch in /${constants.MOB_CANCEL} and /${constants.MOB_ONCANCEL}`
          }

          if (!_.isEqual(prevContext.bap_id, context.bap_id)) {
            errorObj.bapIdContextMismatch = `BAP Id mismatch in /${constants.MOB_CANCEL} and /${constants.MOB_ONCANCEL}`
          }

          if (!_.isEqual(prevContext.bap_uri, context.bap_uri)) {
            errorObj.bapUriContextMismatch = `BAP URL mismatch in /${constants.MOB_CANCEL} and /${constants.MOB_ONCANCEL}`
          }
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while comparing BAP and BPP Ids in /${constants.MOB_ONCANCEL}, ${error.stack}`)
    }

    const checkBap = checkBppIdOrBapId(context.bap_id)
    const checkBpp = checkBppIdOrBapId(context.bpp_id)

    if (checkBap) Object.assign(errorObj, { bap_id: 'context/bap_id should not be a url' })
    if (checkBpp) Object.assign(errorObj, { bpp_id: 'context/bpp_id should not be a url' })
  } else {
    if (!context.location || !context.location.city || !context.location.country) {
      errorObj['location'] = 'context/location/city and context/location/country are mandatory'
    }
  }
}
