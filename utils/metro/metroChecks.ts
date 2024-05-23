import { logger } from '../../shared/logger'
import { getValue, setValue } from '../../shared/dao'
import { checkGpsPrecision, checkIdAndUri, checkMetroContext, timeDiff } from '..'
import _, { isNil } from 'lodash'

interface Stop {
  type: string;
  instructions: {
      name: string;
  };
  location: {
      descriptor: {
          name: string;
          code: string;
      };
      gps: string;
  };
  id: string;
  parent_stop_id: string;
}

export const validateContext = (context: any, msgIdSet: any, pastCall: any, curentCall: any) => {
  const errorObj: any = {}

  const contextRes: any = checkMetroContext(context, curentCall)

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
          errorObj.bppUriContextMismatch = `BPP URI mismatch in /${pastCall} and /${curentCall}`
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
      if (curentCall.startsWith('on_')) {
        logger.info(`Comparing Message Ids of /${pastCall} and /${curentCall}`)
        if (!_.isEqual(prevContext.message_id, context.message_id)) {
          errorObj.message_id = `Message Id for /${pastCall} and /${curentCall} api should be same`
        }
      } else {
        logger.info(`Checking if Message Ids are different for /${pastCall} and /${curentCall}`)
        if (_.isEqual(prevContext.message_id, context.message_id)) {
          errorObj.message_id = `Message Id for /${pastCall} and /${curentCall} api should be different`
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
      } else {
        const timeDifference = timeDiff(context.timestamp, tmpstmp)
        logger.info(timeDifference)
        if (tmpstmp > context.timestamp) {
          errorObj.tmpstmp = `context/timestamp Of ${context?.action} should be greater than ${prevContext?.action}`
        }
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
    errorObj[`Stops`] = `Fulfillment ${index} must contain Stops`
    return errorObj
  }

  const hasStartStop = stops.some((stop: Stop) => stop?.type === 'START')
  const hasEndStop = stops.some((stop: Stop) => stop?.type === 'END')
  //INTERMEDITAE & TRANSIT stips existence check
  // END, INTERMEDITAE & TRANSIT parent_stop_id
  if (!hasStartStop) {
    errorObj[`fulfillment_${index}_stops`] =
      `Fulfillment ${index} in  must contain both START stops or a valid time range start`
  }

  if (!cancel && !hasEndStop) {
    errorObj[`fulfillment_${index}_stops`] =
      `Fulfillment ${index} in  must contain both END stops or a valid time range start`
  }

  const checkIntermediateStopExistense = stops && stops?.find((stop: Stop) => stop?.type === 'INTERMEDIATE_STOP')
  const checkTransitStopExistense = stops && stops?.find((stop: Stop) => stop?.type === 'TRANSIT_STOP')

  if (isNil(checkIntermediateStopExistense))
    errorObj[`fulfillment_INTERMEDIATE_STOP`] = 'INTERMEDIATE_STOP is Missing in Stops Array'

  if (isNil(checkTransitStopExistense)) errorObj[`fulfillment_TRANSIT_STOP`] = 'TRANSIT_STOP is Missing in Stops Array'

  stops &&
    stops.forEach((stop: Stop, l: number) => {
      if (!stop.hasOwnProperty('parent_stop_id')) {
        errorObj[`Fullfillment_ParentStops_${l}`] = `${stop?.type} has missing Parent stop id in ${l} index.`
      }
      // Check if timestamp in the time range is valid only if time.range.start is present

      //instructuions

      // Check if GPS coordinates are valid
      if (stop?.location?.gps && checkGpsPrecision(stop?.location?.gps)) {
        errorObj[`fulfillment_${index}_stop_${l}_gpsPrecision`] =
          'GPS coordinates must be specified with at least six decimal places of precision'
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
    const validBreakupItems = ['BASE_FARE']

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

export const validateDescriptor = (
  descriptor: any,
  action: string,
  path: string,
  checkCode: boolean,
  codes: string[],
): any => {
  try {
    const errorObj: any = {}
    if (!descriptor) {
      errorObj.descriptor = `descriptor is missing at ${path}.`
    } else {
      if (checkCode) {
        if (!descriptor?.code.trim()) {
          errorObj.code = `descriptor.code is missing at ${path}.`
        } else if (descriptor.code?.trim() !== descriptor.code?.trim()?.toUpperCase()) {
          errorObj.code = `descriptor.code must be in uppercase at ${path}., ${descriptor.code}`
        } else if (codes && !codes?.includes(descriptor?.code))
          errorObj.code = `descriptor.code should be one of ${codes}`
      }

      if (descriptor?.images) {
        descriptor.images.forEach((image: any, index: number) => {
          const { url, size_type } = image
          if (!isValidUrl(url)) {
            errorObj[`image_url_[${index}]`] = `Invalid URL for image in descriptor at ${path}.`
          }

          const validSizes = ['xs', 'md', 'sm', 'lg']
          if (!validSizes.includes(size_type)) {
            errorObj[`image_size_[${index}]`] = `Invalid image size in descriptor, should be one of: ${validSizes.join(
              ', ',
            )} at ${path}.`
          }
        })
      }

      //validate name only if checkCode is false or name is present
      if (!checkCode || descriptor?.name) {
        if (!descriptor?.name?.trim()) {
          errorObj.name = `descriptor.name is missing or empty ${path}.`
        }
      }

      if (descriptor?.short_desc) {
        if (!descriptor.short_desc.trim()) {
          errorObj.short_desc = `descriptor.short_desc is empty at ${path}.`
        }
      }

      if (descriptor?.long_desc) {
        if (!descriptor.long_desc.trim()) {
          errorObj.long_desc = `descriptor.long_desc is empty at ${path}.`
        }
      }
    }

    return errorObj
  } catch (error: any) {
    logger.info(`Error while validating descriptor for /${action} at ${path}, ${error.stack}`)
  }
}

export const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}
