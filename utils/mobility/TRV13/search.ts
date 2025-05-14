import { logger } from '../../../shared/logger'
import { setValue, getValue } from '../../../shared/dao'
import constants, { mobilitySequence, TRV13ApiSequence, TRV13Flows } from '../../../constants'
import { validateSchema, isObjectEmpty, checkMobilityContext } from '../../../utils'
// import { validatePaymentTags } from './../tags'
import { validateDescriptor } from './TRV13Checks'
import { validateTermsAndFeesTags } from './tags'

// interface AdditionalAttributes {
//   [key: string]: boolean
// }

export const search = (data: any, msgIdSet: any, version: any, sequence: string) => {
  const errorObj: any = {}
  try {
    // Helper function to get the appropriate error key based on sequence
    const getErrorKey = () => {
      switch(sequence) {
        case TRV13ApiSequence.SEARCH:
          return TRV13ApiSequence.SEARCH;
        case TRV13ApiSequence.SEARCH_INC:
          return TRV13ApiSequence.SEARCH_INC;
        case TRV13ApiSequence.SEARCH_TIME:
          return TRV13ApiSequence.SEARCH_TIME;
        default:
          return mobilitySequence.SEARCH;
      }
    };

    if (!data || isObjectEmpty(data)) {
      const errorKey = getErrorKey();
      errorObj[errorKey] = 'JSON cannot be empty'
      return errorObj;
    }

    console.log('version', version)

    // Flow-specific validation for search_time
    const flow = getValue('flow')

    if (
      !data.message ||
      !data.context ||
      !data.message.intent ||
      isObjectEmpty(data.message) ||
      isObjectEmpty(data.message.intent)
    ) {
      errorObj['missingFields'] = '/context, /message, /intent or /message/intent is missing or empty'
      return Object.keys(errorObj).length > 0 && errorObj
    }

    const schemaValidation = validateSchema('TRV13', constants.SEARCH, data)
    const contextRes: any = checkMobilityContext(data.context, constants.SEARCH)
    setValue(`${getErrorKey()}_context`, data.context)
    msgIdSet.add(data.context.message_id)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const context = data?.context
    if (!context?.location?.city?.code) {
      errorObj.city = `City code must be present context`
    }

    if (context?.location?.country?.code !== 'IND') {
      errorObj.city = `Country code must be IND`
    }

    // Validate TTL for search_time
    if (sequence === TRV13ApiSequence.SEARCH_TIME) {
      if (!context?.ttl) {
        errorObj.ttl = 'TTL is required for search_time'
      } else if (!context.ttl.startsWith('P')) {
        errorObj.ttl = 'TTL must be in ISO 8601 duration format (e.g., P7D)'
      }
    }

    const search = data.message.intent

    // validate category
    if (!search?.category) errorObj.category = `category is missing at message.intent`
    else {
      // check category.descriptor
      try {
        logger.info(`Validating Descriptor for intent.category`)
        const descriptor = search?.category?.descriptor
        // send true as last argument in case if descriptor?.code validation is needed
        const descriptorError = validateDescriptor(descriptor, constants.ON_SEARCH, `intent.category`, true, ['HOTEL'])
        if (descriptorError) Object.assign(errorObj, descriptorError)
      } catch (error: any) {
        logger.info(`Error while validating intent.category for /${constants.ON_SEARCH}, ${error.stack}`)
      }

      // check category.time
      if (sequence.includes('_time')) {
        try {
          logger.info(`Validating Descriptor for intent.category`)
          const time = search?.category?.time
          if (!time) errorObj.time = `time is missing at intent.category`
          else {
            // Check label
            if (!time?.label || time?.label !== 'AVAILABLE')
              errorObj['time.label'] = `label is missing or should be equal to 'AVAILABLE' at intent.category`

            // Check time-range
            const hasTimeRangeStart = time?.range?.start
            const hasTimeRangeEnd = time?.range?.end
            if (!hasTimeRangeStart) errorObj['range.start'] = `range.start is missing at intent.category.time`
            if (!hasTimeRangeEnd) errorObj['range.end'] = `range.end is missing at intent.category.time`

            // Additional validations for FLOW2 only
            if (flow === TRV13Flows.FLOW2) {
              // Validate TTL for FLOW2
              if (!context?.ttl) {
                errorObj.ttl = 'TTL is required for FLOW2 search_time'
              } else if (!context.ttl.startsWith('P')) {
                errorObj.ttl = 'TTL must be in ISO 8601 duration format (e.g., P7D)'
              }

              // Validate time range format for FLOW2
              if (hasTimeRangeStart && !isValidISODate(time.range.start)) {
                errorObj['range.start'] = `range.start must be a valid ISO date string`
              }
              if (hasTimeRangeEnd && !isValidISODate(time.range.end)) {
                errorObj['range.end'] = `range.end must be a valid ISO date string`
              }

              // Validate time range order for FLOW2
              if (hasTimeRangeStart && hasTimeRangeEnd && new Date(time.range.start) >= new Date(time.range.end)) {
                errorObj['range'] = `range.start must be before range.end`
              }
            }
          }
        } catch (error: any) {
          logger.info(`Error while validating intent.category for /${constants.ON_SEARCH}, ${error.stack}`)
        }
      }
    }

    // check tags
    try {
      logger.info(`Validating tags`)
      const tags = search?.tags
      const tagsValidation = validateTermsAndFeesTags(tags, sequence)
      if (tagsValidation.length > 0) {
        errorObj[`tags`] = { ...tagsValidation }
      }
    } catch (error: any) {
      logger.info(`Error while validating tags for /${constants.ON_SEARCH}, ${error.stack}`)
    }

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    const errorKey = sequence || mobilitySequence.SEARCH;
    return { [errorKey]: error.message }
  }
}

// Helper function to validate ISO date string
function isValidISODate(dateString: string): boolean {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
}
