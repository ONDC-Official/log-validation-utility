import { logger } from '../../../shared/logger'
import { setValue } from '../../../shared/dao'
import constants, { mobilitySequence } from '../../../constants'
import { validateSchema, isObjectEmpty, checkMobilityContext } from '../../../utils'
// import { validatePaymentTags } from './../tags'
import { validateDescriptor, validateStops } from './TRV13Checks'
import { validateTermsAndFeesTags } from './tags'

// interface AdditionalAttributes {
//   [key: string]: boolean
// }

export const search = (data: any, msgIdSet: any, version: any, sequence: string) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      errorObj[mobilitySequence.SEARCH] = 'JSON cannot be empty'
      return
    }

    console.log('version', version)

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

    const schemaValidation = validateSchema('TRV', constants.SEARCH, data)
    const contextRes: any = checkMobilityContext(data.context, constants.SEARCH)
    setValue(`${mobilitySequence.SEARCH}_context`, data.context)
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

    try {
      logger.info(`Validating fulfillments object for /${constants.SEARCH}`)
      if (!search?.fulfillment) {
        errorObj['fulfillment'] = `fulfillment is missing in ${mobilitySequence.SEARCH}`
      } else {
        // Check stops for START and END, or time range with valid timestamp and GPS
        const otp = false
        const cancel = false
        const stopsError = validateStops(search?.fulfillment?.stops, 0, otp, cancel)
        if (!stopsError?.valid) Object.assign(errorObj, stopsError.errors)
      }
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking fulfillments info in /${constants.SEARCH},  ${error.message}`)
      return { error: error.message }
    }

    // validate payments
    // try {
    //   logger.info(`Validating payments in /${constants.SEARCH}`)
    //   const payment = search?.payment
    //   const collectedBy = payment?.collected_by
    //   const allowedCollectedByValues = ['BPP', 'BAP']
    //   const terms: any = [
    //     { code: 'STATIC_TERMS', type: 'url' },
    //     { code: 'DELAY_INTEREST', type: 'amount' },
    //   ]

    //   if (!collectedBy) {
    //     errorObj[`collected_by`] = `payment.collected_by must be present in /${constants.SEARCH}`
    //   } else if (!allowedCollectedByValues.includes(collectedBy)) {
    //     errorObj['collected_by'] = `Invalid value for collected_by, should be either of ${allowedCollectedByValues}`
    //   } else {
    //     setValue(`collected_by`, collectedBy)
    //   }

    //   // Validate payment tags
    //   const tagsValidation = validatePaymentTags(payment.tags, terms)
    //   if (!tagsValidation.isValid) {
    //     Object.assign(errorObj, { tags: tagsValidation.errors })
    //   }
    // } catch (error: any) {
    //   logger.error(`!!Error occcurred while validating payments in //${constants.SEARCH},  ${error.message}`)
    // }

    // if (version === '2.0.1') {
    //   const additionalAttributes: any = attributeConfig.search
    //   validatePayloadAgainstSchema(additionalAttributes, data, errorObj, '', '')
    // }

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}
