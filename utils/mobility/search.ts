import { logger } from '../../shared/logger'
import { setValue } from '../../shared/dao'
import constants, { mobilitySequence } from '../../constants'
import { validateSchema, isObjectEmpty, checkMobilityContext } from '../../utils'
import { validatePaymentTags } from './tags'
import attributeConfig from './config/config2.0.1.json'
import { validatePayloadAgainstSchema, validateStops } from './mobilityChecks'

// interface AdditionalAttributes {
//   [key: string]: boolean
// }

export const search = (data: any, msgIdSet: any, version: any) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      errorObj[mobilitySequence.SEARCH] = 'JSON cannot be empty'
      return
    }

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

    const schemaValidation = validateSchema(data.context.domain.split(':')[1], constants.SEARCH, data)
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
    try {
      logger.info(`Validating payments in /${constants.SEARCH}`)
      const payment = search?.payment
      const collectedBy = payment?.collected_by
      const allowedCollectedByValues = ['BPP', 'BAP']
      const terms: any = [
        { code: 'STATIC_TERMS', type: 'url' },
        { code: 'DELAY_INTEREST', type: 'amount' },
      ]

      if (!collectedBy) {
        errorObj[`collected_by`] = `payment.collected_by must be present in /${constants.SEARCH}`
      } else if (!allowedCollectedByValues.includes(collectedBy)) {
        errorObj['collected_by'] = `Invalid value for collected_by, should be either of ${allowedCollectedByValues}`
      } else {
        setValue(`collected_by`, collectedBy)
      }

      // Validate payment tags
      const tagsValidation = validatePaymentTags(payment.tags, terms)
      if (!tagsValidation.isValid) {
        Object.assign(errorObj, { tags: tagsValidation.errors })
      }
    } catch (error: any) {
      logger.error(`!!Error occcurred while validating payments in //${constants.SEARCH},  ${error.message}`)
    }

    if (version === '2.0.1') {
      const additionalAttributes: any = attributeConfig.search
      validatePayloadAgainstSchema(additionalAttributes, data, errorObj, '', '')
    }

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}
