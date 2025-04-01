import _, { isEmpty, isEqual } from 'lodash'
import { logger } from '../../shared/logger'
import { getValue, setValue } from '../../shared/dao'
import { checkSixDigitGpsPrecision, checkIdAndUri, checkMobilityContext, timestampCheck } from '../../utils'
import { validateItemsTags, validateLocationTag, validatePaymentTags, validateRouteInfoTags } from './tags'
import { ON_DEMAND_VEHICLE, MOB_FULL_STATE as VALID_FULL_STATE } from '../../constants'

export const validateContext = (context: any, msgIdSet: any, pastCall: any, curentCall: any) => {
  const errorObj: any = {}

  const contextRes: any = checkMobilityContext(context, curentCall)

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  const prevContext: any = getValue(`${pastCall}_context`)
  setValue(`${curentCall}_context`, context)
  msgIdSet.add(context.message_id)

  if (!context.location || !context.location.city || !context.location.country) {
    errorObj['location'] = 'context/location/city and context/location/country are required'
  }

  try {
    logger.info(`Comparing BAP and BPP in /${curentCall}`)

    const bppValidationResult = checkIdAndUri(context?.bpp_id, context?.bpp_uri, 'bpp')
    const bapValidationResult = checkIdAndUri(context?.bap_id, context?.bap_uri, 'bap')

    if (bppValidationResult !== null) {
      errorObj.bpp = bppValidationResult
    }

    if (bapValidationResult !== null) {
      errorObj.bap = bapValidationResult
    }

    if (prevContext) {
      if (pastCall !== 'search') {
        if (!_.isEqual(prevContext.bpp_id, context.bpp_id)) {
          errorObj.bppIdContextMismatch = `BPP Id mismatch in /${pastCall} and /${curentCall}`
        }

        if (!_.isEqual(prevContext.bpp_uri, context.bpp_uri)) {
          errorObj.bppUriContextMismatch = `BPP URL mismatch in /${pastCall} and /${curentCall}`
        }
      }

      if (!_.isEqual(prevContext.bap_id, context.bap_id)) {
        errorObj.bapIdContextMismatch = `BAP Id mismatch in /${pastCall} and /${curentCall}`
      }

      if (!_.isEqual(prevContext.bap_uri, context.bap_uri)) {
        errorObj.bapUriContextMismatch = `BAP URL mismatch in /${pastCall} and /${curentCall}`
      }
    }
  } catch (error: any) {
    logger.error(`!!Error while comparing BAP and BPP Ids in /${curentCall}, ${error.stack}`)
  }

  if (prevContext) {
    try {
      logger.info(`Comparing city of /${pastCall} and /${curentCall}`)
      if (!_.isEqual(prevContext.location.city, context.location.city)) {
        errorObj.city = `City code mismatch in /${pastCall} and /${curentCall}`
      }
    } catch (error: any) {
      logger.error(`!!Error while comparing city in /${pastCall} and /${curentCall}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing country of /${pastCall} and /${curentCall}`)
      if (!_.isEqual(prevContext.location.country, context.location.country)) {
        errorObj.country = `Country code mismatch in /${pastCall} and /${curentCall}`
      }
    } catch (error: any) {
      logger.error(`!!Error while comparing country in /${pastCall} and /${curentCall}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing transaction Ids of /${pastCall} and /${curentCall}`)
      if (!_.isEqual(prevContext.transaction_id, context.transaction_id)) {
        errorObj.transaction_id = `Transaction Id for /${pastCall} and /${curentCall} api should be same`
      }
    } catch (error: any) {
      logger.info(`Error while comparing transaction ids for /${pastCall} and /${curentCall} api, ${error.stack}`)
    }

    try {
      logger.info(`Comparing Message Ids of /${pastCall} and /${curentCall}`)
      if (curentCall.startsWith('on_') && curentCall.includes(pastCall)) {
        logger.info(`Comparing Message Ids of /${pastCall} and /${curentCall}`)
        if (!_.isEqual(prevContext.message_id, context.message_id)) {
          errorObj.message_id = `message_id for /${pastCall} and /${curentCall} api should be same`
        }
      } else {
        logger.info(`Checking if Message Ids are different for /${pastCall} and /${curentCall}`)
        if (_.isEqual(prevContext.message_id, context.message_id)) {
          errorObj.message_id = `message_id for /${pastCall} and /${curentCall} api should be different`
        }
      }
    } catch (error: any) {
      logger.info(`Error while comparing message ids for /${pastCall} and /${curentCall} api, ${error.stack}`)
    }

    try {
      logger.info(`Comparing timestamp of /${pastCall} and /${curentCall}`)
      const tmpstmp = prevContext.timestamp
      if (_.gte(tmpstmp, context.timestamp)) {
        errorObj.tmpstmp = `Timestamp for /${pastCall} api cannot be greater than or equal to /${curentCall} api`
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.error(`!!Error while comparing timestamp for /${pastCall} and /${curentCall}, ${error.stack}`)
    }
  }

  if (_.isEmpty(errorObj)) {
    const result = { valid: true, SUCCESS: 'Context Valid' }
    return result
  } else {
    const result = { valid: false, ERRORS: errorObj }
    return result
  }
}

export const validateStops = (stops: any, index: number, otp: boolean, cancel: boolean) => {
  const errorObj: any = {}
  if (!stops) {
    errorObj[`stops_${index}`] = `stops is missing at fulfillment[${index}]`
    return { valid: false, errors: errorObj }
  }

  const hasStartStop = stops.some((stop: any) => stop.type === 'START')
  const hasEndStop = stops.some((stop: any) => stop.type === 'END')

  if (!hasStartStop) {
    errorObj[`fulfillment[${index}]start`] = `Fulfillment ${index} in  must contain START stop`
  }

  if (!cancel && !hasEndStop) {
    errorObj[`fulfillment[${index}]end`] = `Fulfillment ${index} in  must contain END stops `
  }

  stops.forEach((stop: any, l: number) => {
    if (!stop?.type) errorObj[`fulfillment[${l}].stop.type`] = `type is missing at Fulfillment[${index}].stops[${l}]`
    else if (stop?.type != 'START' && stop?.type != 'END')
      errorObj[`fulfillment[${l}].stop.type`] = `Invalid type, should be one of START or END at Fulfillment ${index}`

    if (otp && stop?.type == 'START') {
      if (stop?.authorization) {
        const authorization = stop.authorization
        if (authorization.type !== 'OTP') {
          errorObj[`fulfillment[${index}]stop_${l}_authorization_type`] = 'Authorization type must be OTP'
        }

        if (typeof authorization.token !== 'number') {
          errorObj[`fulfillment[${index}]stop_${l}_authorization_token`] = 'Authorization token must be a number'
        }
      }
    }
    // Check if timestamp in the time range is valid only if time.range.start is present
    const hasTimeRangeStart = stop.time?.range?.start
    if (hasTimeRangeStart) {
      const timestampCheckResult = timestampCheck(stop.time?.range?.start || '')
      if (timestampCheckResult && timestampCheckResult.err) {
        errorObj[`fulfillment[${index}]stop_${l}_timestamp`] =
          `Invalid timestamp for stop ${l} in fulfillment ${index} in : ${timestampCheckResult.err}`
      }
    }

    // Check if GPS coordinates are valid
    if (stop.location?.gps && !checkSixDigitGpsPrecision(stop.location.gps)) {
      errorObj[`fulfillment[${index}]stop_${l}_gpsPrecision`] =
        'GPS coordinates must be specified with precision of six decimal places'
    }
  })

  if (_.isEmpty(errorObj)) {
    return { valid: true }
  } else {
    return { valid: false, errors: errorObj }
  }
}

export const validateQuote = (quote: any, action: string) => {
  const errorObj: any = {}
  try {
    logger.info(`Checking quote details in /${action}`)
    if (!quote?.price?.value) errorObj.price.value = `price.value is missing in quote`
    if (!quote?.price?.currency) errorObj.price.currency = `price.currency is missing in quote`
    if (!quote?.ttl) errorObj.ttl = `ttl is missing in quote`

    const quoteBreakup = quote?.breakup
    if (!quoteBreakup) {
      errorObj.quoteBreakup = `Quote.breakup is missing`
    } else {
      const validBreakupItems = ['BASE_FARE', 'DISTANCE_FARE']

      if (action == 'soft_on_cancel') {
        validBreakupItems.push('CANCELLATION_CHARGES')
      }

      const requiredBreakupItems = validBreakupItems.filter((item) =>
        quoteBreakup.some((breakupItem: any) => breakupItem.title.toUpperCase() === item),
      )

      const missingBreakupItems = validBreakupItems.filter((item) => !requiredBreakupItems.includes(item))

      if (missingBreakupItems.length > 0) {
        errorObj.missingBreakupItems = `Quote breakup is missing the following items: ${missingBreakupItems.join(', ')}`
      }

      const additionalBreakupItems = quoteBreakup.filter(
        (breakupItem: any) => !validBreakupItems.includes(breakupItem.title.toUpperCase()),
      )

      if (additionalBreakupItems.length > 0) {
        const additionalItemsList = additionalBreakupItems.map((item: any) => item.title).join(', ')
        errorObj.additionalBreakupItems = `Quote breakup contains additional invalid items: ${additionalItemsList}`
      }

      const totalBreakupValue = quoteBreakup.reduce((total: any, item: any) => {
        const itemValue = parseFloat(item.price.value)
        return isNaN(itemValue) ? total : total + itemValue
        return total
      }, 0)

      const priceValue = parseFloat(quote.price.value)

      if (isNaN(totalBreakupValue)) {
        errorObj.breakupTotalMismatch = 'Invalid values in quote breakup'
      } else if (totalBreakupValue !== priceValue) {
        errorObj.breakupTotalMismatch = `Total of quote breakup (${totalBreakupValue}) does not match with price.value (${priceValue})`
      }

      const currencies = quoteBreakup.map((item: any) => item.currency)
      if (new Set(currencies).size !== 1) {
        errorObj.multipleCurrencies = 'Currency must be the same for all items in the quote breakup'
      }
    }
  } catch (error: any) {
    logger.error(`!!Error while checking quote details in /${action}`, error.stack)
  }

  return errorObj
}

export const validateCancellationTerms = (cancellationTerms: any, action: string) => {
  const errorObj: any = {}
  try {
    logger.info(`Checking cancellation terms in /${action}`)
    if (!cancellationTerms) {
      errorObj.cancellationTerms = `cancellation_terms are required in /${action}`
    } else if (cancellationTerms && cancellationTerms.length > 0) {
      const validCodes = ['RIDE_ASSIGNED', 'RIDE_ENROUTE_PICKUP', 'RIDE_ARRIVED_PICKUP', 'RIDE_STARTED']

      for (let i = 0; i < cancellationTerms.length; i++) {
        const cancellationTerm = cancellationTerms[i]
        if (!cancellationTerm?.fulfillment_state?.descriptor?.code) {
          errorObj[`cancellationTerms[${i}]`] = `descriptor.code is missing for cancellation term ${i}`
        } else if (!validCodes.includes(cancellationTerm.fulfillment_state.descriptor.code)) {
          errorObj[`cancellationTerms[${i}].descriptor.code`] =
            `Invalid descriptor.code for cancellation term ${i}. It must be one of: ${validCodes.join(', ')}`
        }

        if (
          !cancellationTerm.cancellation_fee ||
          !(
            (cancellationTerm.cancellation_fee.percentage && !cancellationTerm.cancellation_fee.amount) ||
            (!cancellationTerm.cancellation_fee.percentage && cancellationTerm.cancellation_fee.amount)
          )
        ) {
          errorObj.cancellationFee = `Either percentage or amount.currency & amount.value should be present, but not both, for Cancellation Term[${i}] when fulfillment_state is present`
        }
      }
    } else {
      errorObj.cancellationTerms = `cancellation_terms should be an array in /${action}`
    }
  } catch (error: any) {
    logger.error(`!!Error while checking cancellation_terms in /${action}, ${error.stack}`)
  }

  return errorObj
}

export const validateEntity = (entity: any, entityType: string, action: string, index: number) => {
  const errorObj: any = {}
  try {
    if (!entity) {
      errorObj[`${entityType}s${index}`] = `${entityType} is missing for fulfillments[${index}]`
    } else {
      if (!entity?.person?.name) {
        errorObj[`${entityType}s${index}_person`] = `/${action}/fulfillments/${entityType}: must have person.name`
      } else {
        if (entity.person.name.trim() === '') {
          errorObj[`${entityType}s${index}_person_name`] = `Empty name is not allowed for ${entityType} ${index}`
        } else {
          const name = getValue(`${entityType}_name`)
          if (name) {
            if (!isEqual(name, entity?.person?.name.trim())) {
              errorObj[`${entityType}s${index}_person_name`] =
                `Name is not similar to what was sent in the previous call, at ${entityType}${index}`
            }
          }

          setValue(`${entityType}_name`, entity.person.name.trim())
        }
      }

      if (!entity?.contact?.phone) {
        errorObj[`${entityType}s${index}_contact`] = `/${action}/fulfillments/${entityType}: must have contact.phone`
      } else {
        const phoneRegex = /^[0-9]{10}$/
        const isValidPhone = phoneRegex.test(entity?.contact?.phone)
        if (!isValidPhone) {
          errorObj[`${entityType}s${index}_contact_phone`] = `Invalid phone format for ${entityType} ${index}`
        } else {
          const phone = getValue(`${entityType}_phone`)
          if (phone) {
            if (!isEqual(phone, entity?.contact?.phone.trim())) {
              errorObj[`${entityType}s${index}_contact_phone`] =
                `Phone is not similar to what was sent in the previous call, at ${entityType}${index}`
            }
          }

          setValue(`${entityType}_phone`, entity.contact.phone.trim())
        }
      }
    }
  } catch (error: any) {
    logger.error(
      `!!Error while checking ${entityType} detail at fulfillments[${index}] array in /${action}`,
      error.stack,
    )
  }

  return errorObj
}

export const validateItemRefIds = (
  item: any,
  action: string,
  index: number,
  fulfillmentIdsSet: any,
  locationIdsSet: any,
  paymentIdsSet: any,
): any => {
  const errorObj: any = {}

  if (!item?.fulfillment_ids) {
    errorObj[`fulfillment_ids`] = `fulfillment_ids is missing at item.${index}`
  } else {
    item.fulfillment_ids?.forEach((fulfillmentId: string) => {
      if (!_.isEmpty(fulfillmentIdsSet) && !fulfillmentIdsSet.has(fulfillmentId)) {
        errorObj[`invalidFulfillmentId_${index}`] =
          `fulfillment_ids should be one of the id passed in fulfillment array, '${fulfillmentId}' at index ${index} in /${action} is not valid`
      }
    })
  }

  item?.location_ids?.forEach((locationId: string) => {
    if (!_.isEmpty(locationIdsSet) && !locationIdsSet.has(locationId)) {
      errorObj[`invalidLocationId_${index}`] =
        `location_ids should be one of the id passed in location array, '${locationId}' at index ${index} in /${action} is not valid`
    }
  })

  item?.payment_ids?.forEach((paymentId: string) => {
    if (!_.isEmpty(paymentIdsSet) && !paymentIdsSet.has(paymentId)) {
      errorObj[`invalidPaymentId_${index}`] =
        `payment_ids should be one of the id passed in payments array, '${paymentId}' at index ${index} in /${action} is not valid`
    }
  })

  return errorObj
}

export const validatePaymentObject = (payments: any, action: string): any => {
  try {
    const errorObj: any = {}
    if (isEmpty(payments)) {
      errorObj.payments = `payments array is missing or is empty`
    } else {
      const allowedStatusValues = ['NOT-PAID', 'PAID']
      const requiredParams = ['bank_code', 'bank_account_number', 'virtual_payment_address']
      payments?.forEach((arr: any, i: number) => {
        const terms = [
          { code: 'SETTLEMENT_WINDOW', type: 'time', value: '/^PTd+[MH]$/' },
          {
            code: 'SETTLEMENT_BASIS',
            type: 'enum',
            value: ['INVOICE_RECEIPT', 'Delivery'],
          },
          { code: 'MANDATORY_ARBITRATION', type: 'boolean' },
          { code: 'STATIC_TERMS', type: 'url' },
          { code: 'COURT_JURISDICTION', type: 'string' },
          { code: 'DELAY_INTEREST', type: 'amount' },
          {
            code: 'SETTLEMENT_TYPE',
            type: 'enum',
            value: ['upi', 'neft', 'rtgs'],
          },
          { code: 'SETTLEMENT_AMOUNT', type: 'amount' },
        ]

        if (!action.includes('init')) {
          if (!arr?.id) errorObj[`payemnts[${i}]_id`] = `payments.id must be present in ${action}`
          else setValue(`paymentId`, arr?.id)
        }

        if (!arr?.collected_by)
          errorObj[`payemnts[${i}]_collected_by`] = `payments.collected_by must be present in ${action}`
        else {
          const collectedBy = getValue(`collected_by`)
          if (collectedBy && collectedBy != arr?.collected_by)
            errorObj[`payemnts[${i}]_collected_by`] =
              `payments.collected_by value sent in ${action} should be same as sent in past call: ${collectedBy}`
        }

        // check status
        if (!arr?.status) errorObj.paymentStatus = `payment.status is missing for index:${i} in payments`
        else if (!arr?.status || !allowedStatusValues.includes(arr?.status)) {
          errorObj.paymentStatus = `invalid status at index:${i} in payments, should be either of ${allowedStatusValues}`
        }

        // check type
        const validTypes = ['PRE-ORDER', 'ON-FULFILLMENT', 'POST-FULFILLMENT']
        if (!arr?.type || !validTypes.includes(arr.type)) {
          errorObj[`payments[${i}]_type`] =
            `payments.params.type must be present in ${action} & its value must be one of: ${validTypes.join(', ')}`
        }

        // check params
        const params = arr?.params
        if (!params) errorObj.params = `payment.params is missing for index:${i} in payments`
        else {
          const missingParams = requiredParams.filter((param) => !Object.prototype.hasOwnProperty.call(params, param))
          if (missingParams.length > 0) {
            errorObj.missingParams = `Required params ${missingParams.join(', ')} are missing in payments`
          }
        }

        // Validate payment tags
        const tagsValidation = validatePaymentTags(arr?.tags, terms)
        if (!tagsValidation.isValid) {
          Object.assign(errorObj, { tags: tagsValidation.errors })
        }
      })
    }

    return errorObj
  } catch (error) {
    logger.error(`!!Some error occurred while checking payment object /${action} API`, error)
  }
}

export const validatePayloadAgainstSchema = (
  schema: any,
  payload: any,
  errorObj: any,
  key: string,
  path: string,
): boolean => {
  if (schema.required) {
    if (!payload) {
      errorObj[`${key}`] = `${key} is missing`
      return false
    } else {
      if (schema?.type) {
        validateConfigAttributes(schema, payload, errorObj)
      }

      return true
    }
  }

  if (Array.isArray(schema)) {
    if (!Array.isArray(payload)) {
      errorObj.path = 'Expected array'
      return false
    } else {
      for (let i = 0; i < payload.length; i++) {
        validatePayloadAgainstSchema(schema[0], payload[i], errorObj, key, path + `[${i}]`)
      }
    }
  } else {
    // Recursive case: if the schema node is an object, traverse through its keys
    // if (typeof schema === 'object' && schema !== null) {
    for (const key in schema) {
      console.log('key', key)
      if (!(key in payload)) {
        errorObj[`${key}`] = `${key} is missing`
        continue
      }
      // Recursive call for each key
      const isValid = validatePayloadAgainstSchema(schema[key], payload[key], errorObj, key, path + key + '.')
      if (!isValid) {
        return false // If any validation fails, return false
      }
    }
    // }
  }

  return true
}

export const validateConfigAttributes = (schema: any, payload: any, errorObj: any) => {
  try {
    switch (schema.type) {
      case 'tag': {
        switch (schema.name) {
          case 'LOCATION': {
            const tagsValidation = validateLocationTag(payload)
            if (!tagsValidation.isValid) {
              Object.assign(errorObj, { location_tag: tagsValidation.errors })
            }

            break
          }

          default:
            break
        }

        break
      }

      default:
        break
    }
  } catch (error) {
    logger.error(error)
  }
}

export const validateProviderId = (selectedProviderId: string, pastCall: string, currentCall: string) => {
  try {
    const errorObj: any = {}
    const prvrdID: any = getValue('providerId')
    if (!selectedProviderId) {
      errorObj.prvdrId = `provider.id is missing`
    } else if (!prvrdID) {
      logger.info(`Skipping Provider Id check due to insufficient data`)
      setValue('providerId', selectedProviderId)
    } else if (!_.isEqual(prvrdID, selectedProviderId)) {
      errorObj.prvdrId = `Provider Id for /${pastCall} and /${currentCall} api should be same`
    } else {
      setValue('providerId', selectedProviderId)
    }
    return errorObj
  } catch (error: any) {
    logger.info(`Error while comparing provider id for /${pastCall} and /${currentCall} api, ${error.stack}`)
  }
}

export const validateVehicle = (vehicle: any, checkInfo: boolean) => {
  const errorObj: any = {}
  if (!vehicle) {
    errorObj.vehicle = 'vehicle is missing in fulfillments'
    return errorObj
  }

  const allowedKeys = ['category']
  if (!vehicle?.category) errorObj.category = 'category is missing in vehicle'
  else if (!ON_DEMAND_VEHICLE.includes(vehicle.category)) {
    errorObj.vehicleCategory = `Vehicle.category should be one of ${ON_DEMAND_VEHICLE}`
  }
  if (checkInfo) {
    allowedKeys.push(...['make', 'model', 'registration'])
    if (!vehicle?.make) errorObj.make = 'make is missing in vehicle'
    if (!vehicle?.model) errorObj.model = 'model is missing in vehicle'
    if (!vehicle?.registration) errorObj.registration = 'registration is missing in vehicle'
    else if (vehicle?.registration && !/^[A-Z]{2}-\d{2}-[A-Z]{2}-\d{4}$/.test(vehicle.registration)) {
      errorObj.registration = 'registration must follow the format XX-00-XX-0000'
    }
  }

  const extraKeys = Object.keys(vehicle).filter((key) => !allowedKeys.includes(key) && key !== 'variant')
  if (extraKeys.length > 0) {
    errorObj.extraKeys = `Vehicle object has extra keys: ${extraKeys.join(', ')}`
  }

  return errorObj
}

export const validateItems = (items: any, action: string, fulfillmentIdsSet: any) => {
  try {
    const errorObj: any = {}
    logger.info(`Validating items object for /${action}`)
    if (!items) errorObj.items = `items is missing in /${action}`
    else {
      const itemIDS: any = getValue(`itemIds`)
      items.forEach((item: any, index: number) => {
        const itemKey = `items[${index}]`

        if (!item?.id) {
          errorObj[`${itemKey}.id`] = `id is missing in [${itemKey}]`
        } else if (!itemIDS.includes(item.id)) {
          errorObj[`${itemKey}.id`] =
            `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in past call`

          itemIDS.add(item.id)
        }

        //price check
        if (!item?.price?.value) errorObj[`${itemKey}.price`] = `value is missing at item.index ${index} `
        if (!item?.price?.currency)
          errorObj[`${itemKey}.price.currency`] = `currency is missing at item.index ${index} `

        //fulfillment_ids, location_ids & payment_ids checks
        const refIdsErrors = validateItemRefIds(item, action, index, fulfillmentIdsSet, new Set(), new Set())
        Object.assign(errorObj, refIdsErrors)

        //descriptor.code
        if (!item?.descriptor?.code)
          errorObj[`${itemKey}.type`] = `descriptor.code is missing at item.index ${index} in /${action}`
        else if (item.descriptor.code !== 'RIDE') {
          errorObj[`${itemKey}.type`] = `descriptor.code must be RIDE at item.index ${index} in /${action}`
        }

        // FARE_POLICY & INFO checks
        if (item.tags) {
          const tagsValidation = validateItemsTags(item.tags)
          if (!tagsValidation.isValid) {
            Object.assign(errorObj, { tags: tagsValidation.errors })
          }
        }
      })

      console.log(
        'compareSets(getValue(`itemIds`), itemIDS',
        getValue(`itemIds`),
        [],
        compareArrays(getValue(`itemIds`), itemIDS),
      )
    }

    return errorObj
  } catch (error: any) {
    logger.error(`!!Error occcurred while checking items info in /${action},  ${error.message}`)
    return { error: error.message }
  }
}

export const compareArrays = (arr1: any, arr2: any) => {
  if (arr1.length !== arr2.length) {
    return false
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false
    }
  }

  return true
}

export const validateFulfillments = (
  fulfillments: any,
  fulfillmentIdsSet: any,
  action: string,
  checkAgent: boolean,
  checkState: boolean,
  validCode: string,
) => {
  //fulfillments
  try {
    logger.info(`Validating fulfillments object for /${action}`)
    const errorObj: any = {}
    if (isEmpty(fulfillments)) {
      return errorObj
    }
    const storedFull: any = getValue(`on_select_storedFulfillments`)
    fulfillments.forEach((fulfillment: any, index: number) => {
      const fulfillmentKey = `fulfillments[${index}]`
      fulfillmentIdsSet.add(fulfillment.id)
      if (!fulfillment?.id) {
        errorObj[fulfillmentKey] = `id is missing in fulfillments[${index}]`
      } else if (!storedFull.includes(fulfillment.id)) {
        errorObj[`${fulfillmentKey}.id`] =
          `/message/order/fulfillments/id in fulfillments: ${fulfillment.id} should be one of the /fulfillments/id mapped in previous call`
      }

      // fulfilment state
      if (checkState) {
        const code = fulfillment?.state?.descriptor?.code
        if (!code) errorObj[`${fulfillmentKey}.state`] = `descriptor.code is missing for fulfillment ${index}`
        else {
          const flow = getValue('flow')
          if (!VALID_FULL_STATE.includes(code))
            errorObj[`${fulfillmentKey}.state`] =
              `invalid code, should be one of ${VALID_FULL_STATE} for fulfillment.state ${index}`
          else if (validCode != code)
            errorObj[`${fulfillmentKey}.state`] =
              `invalid code, should be ${validCode} for flow ${flow} at fulfillment.state ${index}`
        }
      }

      const vehcileError = validateVehicle(fulfillment?.vehicle, checkAgent)
      errorObj[`fulfillment.${index}`] = vehcileError

      if (!fulfillment?.type) {
        errorObj[`${fulfillmentKey}.type`] = `type is missing in fulfillment[${index}]`
      } else if (fulfillment.type !== 'DELIVERY') {
        errorObj[`${fulfillmentKey}.type`] = `Fulfillment type must be DELIVERY at index ${index} in /${action}`
      }

      //customer checks
      const customerErrors = validateEntity(fulfillment.customer, 'customer', action, index)
      Object.assign(errorObj, customerErrors)

      //agent checks
      if (checkAgent) {
        const agentErrors = validateEntity(fulfillment.agent, 'agent', action, index)
        Object.assign(errorObj, agentErrors)
      } else {
        if (Object.prototype.hasOwnProperty.call(fulfillment, 'agent')) {
          errorObj[`fulfillments${index}_agent`] = `/message/order/agent is not part of /${action} call`
        }
      }

      // Check stops for START and END, or time range with valid timestamp and GPS
      const cancel = false
      const stopsError = validateStops(fulfillment?.stops, index, checkAgent, cancel)
      if (!stopsError?.valid) Object.assign(errorObj, stopsError.errors)

      if (fulfillment.tags) {
        // Validate route info tags
        const tagsValidation = validateRouteInfoTags(fulfillment.tags)
        if (!tagsValidation.isValid) {
          Object.assign(errorObj, { tags: tagsValidation.errors })
        }
      }
    })
    return errorObj
  } catch (error: any) {
    logger.error(`!!Error occcurred while checking fulfillments info in /${action},  ${error.message}`)
    return { error: error.message }
  }
}
