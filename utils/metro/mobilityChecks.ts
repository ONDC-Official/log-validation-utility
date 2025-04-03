import { logger } from '../../shared/logger'
import { getValue, setValue } from '../../shared/dao'
import { checkGpsPrecision, checkIdAndUri, checkMobilityContext, timestampCheck } from '../../utils'
import _, { isNil } from 'lodash'

export const validateContext = (
  context: any,
  msgIdSet: any,
  pastCall: any,
  curentCall: any,
  toCheck?: boolean,
  searchType?: boolean,
) => {
  const errorObj: any = {}

  const contextRes: any = checkMobilityContext(context, curentCall)
  

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  const prevContext: any = getValue(`${pastCall}_context`)
  setValue(`${curentCall}_context`, context)
  msgIdSet.add(context.message_id)

  if (!context.location) {
    errorObj['location'] = 'context/location object is missing.'
  }

  if (!context.location.city) errorObj['city'] = 'context/location/city is required'
  if (context?.location.city && !context.location.city.code) errorObj['city'] = 'context/location/city/code is required'

  if (!context.location.country) errorObj['country'] = 'context/location/country is required'
  if (context?.location.country && !context.location.country.code)
    errorObj['country'] = 'context/location/country/code is required'

  try {
    logger.info(`Comparing BAP and BPP in /${curentCall}`)

    let bppValidationResult
    if (toCheck || isNil(toCheck)) bppValidationResult = checkIdAndUri(context?.bpp_id, context?.bpp_uri, 'bpp')

    const bapValidationResult = checkIdAndUri(context?.bap_id, context?.bap_uri, 'bap')

    if (bppValidationResult !== null) {
      errorObj.bpp = bppValidationResult
    }

    if (bapValidationResult !== null) {
      errorObj.bap = bapValidationResult
    }

    if (prevContext) {
      if (context?.action !== 'search' || (context?.action === 'search' && searchType)) {
        if (!context?.bpp_id) {
          errorObj.bppId = 'context/bpp_id is missing'
        } else if (prevContext.bpp_id && !_.isEqual(prevContext.bpp_id, context.bpp_id)) {
          errorObj.bppIdContextMismatch = `BPP Id mismatch in /${pastCall} and /${curentCall}`
        }

        if (!context?.bpp_uri) {
          errorObj.bppUri = 'context/bpp_uri is missing'
        } else if (prevContext.bpp_uri && !_.isEqual(prevContext.bpp_uri, context.bpp_uri)) {
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

  const hasStartStop = stops.some((stop: any) => stop.type === 'START')
  const hasEndStop = stops.some((stop: any) => stop.type === 'END')

  if (!hasStartStop) {
    errorObj[`fulfillment_${index}_stops`] =
      `Fulfillment ${index} in  must contain both START stops or a valid time range start`
  }

  if (!cancel && !hasEndStop) {
    errorObj[`fulfillment_${index}_stops`] =
      `Fulfillment ${index} in  must contain both END stops or a valid time range start`
  }

  stops.forEach((stop: any, l: number) => {
    // Check if timestamp in the time range is valid only if time.range.start is present
    const hasTimeRangeStart = stop.time?.range?.start
    if (hasTimeRangeStart) {
      const timestampCheckResult = timestampCheck(stop.time?.range?.start || '')
      if (timestampCheckResult && timestampCheckResult.err) {
        errorObj[`fulfillment_${index}_stop_${l}_timestamp`] =
          `Invalid timestamp for stop ${l} in fulfillment ${index} in : ${timestampCheckResult.err}`
      }
    }

    // Check if GPS coordinates are valid
    if (stop.location?.gps && !checkGpsPrecision(stop.location.gps)) {
      errorObj[`fulfillment_${index}_stop_${l}_gpsPrecision`] =
        'GPS coordinates must be specifieddddd with at least six decimal places of precision'
    }
  })

  if (otp) {
    stops.forEach((stop: any, l: number) => {
      if (stop.authorization) {
        const authorization = stop.authorization
        if (authorization.type !== 'OTP') {
          errorObj[`fulfillment_${index}_stop_${l}_authorization_type`] =
            'Authorization type must be OTP when otp is true'
        }

        if (typeof authorization.token !== 'number') {
          errorObj[`fulfillment_${index}_stop_${l}_authorization_token`] =
            'Authorization token must be a number when otp is true'
        }
      }
    })
  }

  if (_.isEmpty(errorObj)) {
    const result = { valid: true, SUCCESS: 'Context Valid' }
    return result
  } else {
    const result = { valid: false, ERRORS: errorObj }
    return result
  }
}

export const validatePaymentParams = (
  params: any,
  storedValue: any,
  storedKey: string,
  errorObj: any,
  i: number,
  action: string,
) => {
  if (!params[storedKey]) {
    errorObj[`payments[${i}]_${storedKey}`] = `payments.params.${storedKey} must be present in ${action}`
  } else {
    if (storedValue && !_.isEqual(storedValue, params[storedKey])) {
      errorObj[`payments[${i}]_${storedKey}`] =
        `payments.params.${storedKey} must match with the value sent in past calls, ${action}`
    } else {
      setValue(storedKey, params[storedKey])
    }
  }
}

export const validateQuote = (quote: any, action: string) => {
  const errorObj: any = {}
  try {
    logger.info(`Checking quote details in /${action}`)
    const quoteBreakup = quote.breakup
    const validBreakupItems = ['BASE_FARE', 'DISTANCE_FARE']

    const requiredBreakupItems = validBreakupItems.filter((item) =>
      quoteBreakup.some((breakupItem: any) => breakupItem.title.toUpperCase() === item),
    )

    const missingBreakupItems = validBreakupItems.filter((item) => !requiredBreakupItems.includes(item))

    if (missingBreakupItems.length > 0) {
      errorObj.missingBreakupItems = `Quote breakup is missing the following items: ${missingBreakupItems.join(', ')}`
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
      for (let i = 0; i < cancellationTerms.length; i++) {
        const cancellationTerm = cancellationTerms[i]

        if (
          cancellationTerm.fulfillment_state &&
          cancellationTerm.fulfillment_state.descriptor &&
          cancellationTerm.fulfillment_state.descriptor.code &&
          (!cancellationTerm.cancellation_fee ||
            !(
              (cancellationTerm.cancellation_fee.percentage && !cancellationTerm.cancellation_fee.amount) ||
              (!cancellationTerm.cancellation_fee.percentage && cancellationTerm.cancellation_fee.amount)
            ))
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
