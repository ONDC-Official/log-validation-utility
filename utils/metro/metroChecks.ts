import { logger } from '../../shared/logger'
import { getValue, setValue } from '../../shared/dao'
import { checkGpsPrecision, checkIdAndUri, checkMetroContext, timeDiff } from '..'
import _ from 'lodash'
import { AUTHORIZATION_TYPE, AUTHORIZATION_STATUS } from './enum'

interface Stop {
  type: string
  authorization?: {
    type: string
    token: string
    valid_to: string
    status: string
  }
  instructions: {
    name: string
  }
  location: {
    descriptor: {
      name: string
      code: string
    }
    gps: string
  }
  id: string
  parent_stop_id: string
}

export const validateContext = (context: any, msgIdSet: any, pastCall: any, curentCall: any, _searchType?: boolean) => {
  const errorObj: any = {}

  const contextRes: any = checkMetroContext(context, curentCall)

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

    const bppValidationResult = checkIdAndUri(context?.bpp_id, context?.bpp_uri, 'bpp')
    const bapValidationResult = checkIdAndUri(context?.bap_id, context?.bap_uri, 'bap')

    if (bppValidationResult !== null) {
      errorObj.bpp = bppValidationResult
    }

    if (bapValidationResult !== null) {
      errorObj.bap = bapValidationResult
    }

    if (prevContext) {
      if (!['search', 'on_search', 'select', 'on_select', 'init'].includes(context?.action)) {
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
      if (
        !pastCall.includes('search') &&
        !pastCall.includes('select') &&
        curentCall !== 'init' &&
        !_.isEqual(prevContext.transaction_id, context.transaction_id)
      ) {
        errorObj.transaction_id = `Transaction ID for /${pastCall} and /${curentCall} API should be the same`
      }
    } catch (error: any) {
      logger.info(`Error while comparing transaction ids for /${pastCall} and /${curentCall} api, ${error.stack}`)
    }

    try {
      logger.info(`Comparing Message Ids of /${pastCall} and /${curentCall}`)
      if (curentCall.startsWith('on_') || curentCall === 'soft_on_cancel' || curentCall === 'confirm_on_cancel') {
        logger.info(`Comparing Message Ids of /${pastCall} and /${curentCall}`)
        if (!_.isEqual(prevContext.message_id, context.message_id)) {
          errorObj.message_id = `Message Id for /${pastCall} and /${curentCall} api should be same.`
        }
      } else {
        logger.info(`Checking if Message Ids are different for /${pastCall} and /${curentCall}`)
        if (
          pastCall === 'on_confirm' &&
          curentCall === 'soft_cancel' &&
          _.isEqual(prevContext.message_id, context.message_id)
        ) {
          errorObj.message_id = `Message Id for /${pastCall} and /${curentCall} api should be different.`
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

export const validateStops = (stops: any, index: number, otp: boolean, _cancel: boolean, action: string) => {
  const errorObj: any = {}
  const errors: { [key: string]: any } = {}
  let startType = 0
  let endType = 0
  let intermediateType = 0
  let transitStop = 0
  console.log('tramsitStop', transitStop)
  const stopsIds = new Set()

  if (!stops || !stops.length) {
    errorObj[`fulfimment[${index}].stops`] = `stops are missing or empty at fulfillment[${index}]`
    return errorObj
  }

  stops?.map((stop: Stop, index: number) => {
    //check type & parent_stop_id
    if (!stop?.type) errorObj[`stops[${index}].type`] = `type is missing at stop[${index}]`
    else {
      if (stop.type == 'START') {
        startType++
        if (otp) {
          const authorization = stop?.authorization
          if (authorization) {
            if (!authorization?.type) errorObj[`stops_${index}_authorization_type`] = `authorization.type is missing`
            else if (!AUTHORIZATION_TYPE?.includes(authorization?.type)) {
              errorObj[`stops_${index}_authorization_type`] = `authorization.type must be one of ${AUTHORIZATION_TYPE}`
            }

            if (!authorization?.token) errorObj[`stops_${index}_authorization_token`] = `authorization.token is missing`
            if (!authorization?.valid_to)
              errorObj[`stops_${index}_authorization_valid_to`] = `authorization.valid_to is missing`
            if (!authorization?.status)
              errorObj[`stops_${index}_authorization_status`] = `authorization.status is missing`
            else if (!AUTHORIZATION_STATUS?.includes(authorization?.status)) {
              errorObj[`stops_${index}_authorization_status`] =
                `authorization.status must be one of ${AUTHORIZATION_STATUS}`
            }
          }
        }
      } else {
        if (stop.type == 'END') endType++
        else if (stop.type == 'INTERMEDIATE_STOP') intermediateType++
        else if (stop.type == 'TRANSIT_STOP') transitStop++
        else errorObj[`stops[${index}].type`] = `invalid type: ${stop.type} at stop[${index}]`
      }
    }

    //check location
    const location = stop?.location
    if (!location) errorObj[`stops[${index}].location`] = `location is missing at stop[${index}]`
    else {
      //check location descriptor
      const descriptorError = validateDescriptor(
        location?.descriptor,
        action,
        `stops[${index}].location.desscriptor`,
        false,
        [],
      )
      if (descriptorError) Object.assign(errorObj, descriptorError)

      // Check if GPS coordinates
      if (!location?.gps) errorObj[`stops[${index}].location.gps`] = `gps is missing at stop[${index}].location`
      else if (checkGpsPrecision(stop?.location?.gps) !== 1) {
        const gpsPrecision = checkGpsPrecision(stop?.location?.gps) as { [key: string]: string | number }
        errorObj[`stops_${index}.gps`] =
          `GPS coordinates must be precise upto six decimal places only in ${Number(gpsPrecision.latPrecision) !== 6 ? 'latitude' : 'longitude'}.`
      }
    }

    // check stops.id
    const key = `stops[${index}].id`
    if (!stop?.id) {
      errorObj[key] = `id is missing at stop[${index}]`
    } else if (stopsIds.has(stop?.id)) {
      errorObj[key] = `duplicate stop.id: ${stop.id} at stop[${index}]`
    } else {
      stopsIds.add(stop.id)
    }
  })

  if (startType == 0)
    errorObj[`fulfimment[${index}].stops.START`] = `'START' stop type is missing at fulfillment[${index}].stops`

  if (endType == 0)
    errorObj[`fulfimment[${index}].stops.END`] = `'END' stop type is missing at fulfillment[${index}].stops`

  console.log(intermediateType)
  // if (intermediateType == 0)
  //   errorObj[`fulfimment[${index}].stops.INTERMEDIATE`] =
  //     `'INTERMEDIATE_STOP' stop type is missing at fulfillment[${index}].stops`

  errors[`Fulfillment ${index}`] = errorObj
  return errors
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
    let totalBreakupValue = 0
    if (!quote?.breakup) errorObj.breakup = `quote.breakup is missing`
    else {
      const quoteBreakup = quote.breakup
      const validBreakupItems = ['BASE_FARE']

      const requiredBreakupItems = validBreakupItems.filter((item) =>
        quoteBreakup.some((breakupItem: any) => breakupItem.title.toUpperCase() === item),
      )

      const missingBreakupItems = validBreakupItems.filter((item) => !requiredBreakupItems.includes(item))

      if (missingBreakupItems.length > 0) {
        errorObj.missingBreakupItems = `Quote breakup is missing the following items: ${missingBreakupItems.join(', ')}`
      }

      totalBreakupValue = quoteBreakup.reduce((total: any, item: any) => {
        const itemValue = parseFloat(item.price.value)
        return isNaN(itemValue) ? total : total + itemValue
        return total
      }, 0)

      const currencies = quoteBreakup.map((item: any) => item.currency)
      if (new Set(currencies).size !== 1) {
        errorObj.multipleCurrencies = 'Currency must be the same for all items in the quote breakup'
      }
    }

    if (!quote?.price?.value) errorObj.price = `price.value is missing in quote`
    else {
      const priceValue = parseFloat(quote?.price?.value)
      if (isNaN(totalBreakupValue)) {
        errorObj.breakupTotalMismatch = 'Invalid values in quote breakup'
      } else if (totalBreakupValue !== priceValue) {
        errorObj.breakupTotalMismatch = `Total of quote breakup (${totalBreakupValue}) does not match with price.value (${priceValue})`
      }
    }
  } catch (error: any) {
    logger.error(`!!Error while checking quote details in /${action}`, error.stack)
  }

  return errorObj
}

export const validateCancellationTerms = (cancellationTerms: any, action: string) => {
  //handle object containing external_ref also
  const errorObj: any = {}
  try {
    logger.info(`Checking cancellation terms in /${action}`)
    if (!cancellationTerms) {
      errorObj.cancellationTerms = `cancellation_terms are required in /${action}`
    } else if (cancellationTerms && cancellationTerms.length > 0) {
      for (let i = 0; i < cancellationTerms.length; i++) {
        const cancellationTerm = cancellationTerms[i]

        if (cancellationTerm.hasOwnProperty('external_ref')) {
          if (Object.keys(cancellationTerm?.external_ref).length < 1)
            errorObj.externalRef = `external_ref has in missing property minetype and url in /${action} at cancellation_terms[${i}]`
          else if (!cancellationTerm?.external_ref?.mimetype)
            errorObj['externalRef.mimeType'] = `mimetype is required in /${action} at cancellation_terms[${i}]`
          else if (!cancellationTerm?.external_ref?.url)
            errorObj['externalRef.url'] = `url is required in /${action} at cancellation_terms[${i}]`
        } else {
          errorObj.cancellationTerm = `cancellation_term should have external_ref in /${action} at cancellation_terms[${i}]`
        }

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
        if (!descriptor?.code) {
          errorObj.code = `descriptor.code is missing at ${path}.`
        } else if (descriptor.code?.trim() !== descriptor.code?.trim()?.toUpperCase()) {
          errorObj.code = `descriptor.code must be in uppercase at ${path}., ${descriptor.code}`
        } else if (descriptor?.code && !codes?.includes(descriptor?.code))
          errorObj.code = `descriptor.code should be one of ${codes}`
      }

      if (descriptor?.images) {
        descriptor?.images.forEach((image: any, index: number) => {
          const { url, size_type } = image
          if (!isValidUrl(url)) {
            errorObj[`image_url_[${index}]`] = `Invalid URL for image in descriptor at ${path}.`
          }

          const validSizes = ['xs', 'md', 'sm', 'lg']
          if (size_type && !validSizes.includes(size_type)) {
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

export function validateItemDescriptor(item: any, index: number, VALID_DESCRIPTOR_CODES: string[]) {
  const errorObj: any = {}
  try {
    if (item?.descriptor) {
      const { name, code } = item?.descriptor

      if (!code && !name) {
        errorObj[`item${index}descriptor`] = `descriptor.code and descriptor.name are missing in item[${index}]`
      } else if (!code) {
        errorObj[`item${index}descriptor_code`] = `descriptor.code is missing in item[${index}]`
      } else if (!VALID_DESCRIPTOR_CODES.includes(code)) {
        const key = `item_${index}_descriptor`
        errorObj[key] = `descriptor.code should be one of ${VALID_DESCRIPTOR_CODES} instead of ${code}`
      }
    } else errorObj[`item_${index}_descriptor`] = `Descriptor is missing in items[${index}]`
  } catch (error: any) {
    logger.info(`Error while validating item descriptor, ${error.stack}`)
  }

  return errorObj
}

export function validateCodeString(str: string) {
  const regex = /^[A-Z_]+$/
  return regex.test(str)
}
