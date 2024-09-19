import { getValue, setValue } from 'shared/dao'
import { logger } from 'shared/logger'
import { checkIdAndUri, checkFISContext } from '../../'
import _, { isEmpty } from 'lodash'
import constants from '../../../constants'

export const validateContext = (context: any, msgIdSet: any, pastCall: any, curentCall: any) => {
  const errorObj: any = {}

  const contextRes: any = checkFISContext(context, curentCall)

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
        errorObj.tmpstmp = `Timestamp for /${curentCall} api should be greater than timestamp of /${pastCall} api`
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
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

export const isValidPhoneNumber = (value: string): boolean => {
  const phoneRegex = /^(\d{10}|\d{11})$/
  if (value.startsWith('0')) {
    value = value.substring(1)
  }

  const val = value?.replace(/[^\d]/g, '')
  return phoneRegex.test(val)
}

export const validateProvider = (provider: any, action: string) => {
  try {
    const providerErrors: any = {}
    if (!provider) {
      providerErrors.provider = 'Provider details are missing or invalid.'
      return providerErrors
    }

    if (!provider?.id) providerErrors.prvdrId = `provider.id is missing`
    else {
      logger.info(`Comparing provider id of /${action} & past call`)
      const prvrdID: any = getValue('providerId')
      if (!_.isEqual(prvrdID, provider?.id)) {
        providerErrors.prvdrId = `provider.id for /${action} & past call api should be same`
        setValue('providerId', provider?.id)
      }
    }

    // send true as last argument in case if code validation is needed
    const descriptorError = validateDescriptor(provider?.descriptor, action, `provider.descriptor`, false)
    if (descriptorError) Object.assign(providerErrors, descriptorError)
    return providerErrors
  } catch (error: any) {
    logger.info(`Error while checking provider object in /${action} api, ${error.stack}`)
  }
}

export const validateDescriptor = (descriptor: any, action: string, path: string, checkCode: boolean): any => {
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
        }
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

export const checkItems = (order: any) => {
  const errorObj: any = {}
  try {
    logger.info(`Validating items array in /${constants.INIT}`)
    const items = order?.items
    if (!items) {
      errorObj.items = `items is missing at /${constants.INIT}`
    } else {
      items?.map((item: any, i: number) => {
        if (!item?.id) {
          errorObj[`items[${i}].id`] = `items[${i}].id is missing in /${constants.INIT}`
        }
        if (!item?.quantity) {
          errorObj[`items[${i}].quantity`] = `items[${i}].quantity is missing in /${constants.INIT}`
        }
        if (!item?.price) {
          errorObj[`items[${i}].fulfillment_ids`] = `items[${i}].fulfillment_ids is missing in /${constants.INIT}`
        }
      })
    }
    return errorObj
  } catch (error: any) {
    logger.error(`!!Error while checking items array in /${constants.INIT}, ${error.stack}`)
  }
}
