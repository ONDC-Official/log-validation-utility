import { logger } from '../../shared/logger'
import { setValue } from '../../shared/dao'
import constants, { metroSequence } from '../../constants'
import { validateSchema, isObjectEmpty, checkMetroContext, checkGpsPrecision } from '../../utils'
import { validatePaymentTags } from './tags'

export const search = (data: any, msgIdSet: any) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      errorObj[metroSequence.SEARCH] = 'Json cannot be empty'
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

    const schemaValidation = validateSchema(data.context.domain.split(':')[1], constants.MET_SEARCH, data)
    const contextRes: any = checkMetroContext(data.context, constants.MET_SEARCH)
    setValue(`${metroSequence.SEARCH}_context`, data.context)
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

    // Stops & Gps check
    const stops = data.message.intent?.fulfillment?.stops
    if (!stops || stops.length === 0) {
      errorObj['stops'] = {
        fulfillment: {
          stops: 'Fulfillment stops are missing or empty',
        },
      }
    } else {
      const stopTypes = stops.map((stop: any) => stop.type)
      const invalidStopTypes = stopTypes.filter((type: string) => type !== 'START' && type !== 'END')

      if (invalidStopTypes.length > 0) {
        errorObj['stops'] = {
          fulfillments: {
            stops: `Invalid stop types found: ${invalidStopTypes.join(
              ', ',
            )}. Fulfillments stops must contain only 'START' and 'END' types.`,
          },
        }
      }

      const startStop = stops.find((stop: any) => stop.type === 'START')
      const endStop = stops.find((stop: any) => stop.type === 'END')

      if (!startStop || !endStop) {
        errorObj['stops'] = {
          fulfillments: {
            stops: 'Fulfillments stops must contain both types: START and END',
          },
        }
      } else {
        const startGps = startStop?.location?.gps
        if (!startGps) {
          errorObj['fulfillmentsLocationStart'] = 'fulfillments/start/location should have a required property gps'
        } else if (checkGpsPrecision(startGps)) {
          errorObj['gpsPrecisionStart'] =
            'fulfillments/start/location/gps coordinates must be specified with at least six decimal places of precision.'
        }

        const endGps = endStop?.location?.gps
        if (!endGps) {
          errorObj['fulfillmentsLocationEnd'] = 'fulfillments/end/location should have a required property gps'
        } else if (checkGpsPrecision(endGps)) {
          errorObj['gpsPrecisionEnd'] =
            'fulfillments/end/location/gps coordinates must be specified with at least six decimal places of precision.'
        }
      }
    }

    try {
      logger.info(`Validating payments object for /${constants.MET_SEARCH}`)
      const payment = data.message.intent?.payment
      const collectedBy = payment?.collected_by

      if (!collectedBy) {
        errorObj[`collected_by`] = `collected_by must be present in payment object`
      } else if (collectedBy !== 'BPP' && collectedBy !== 'BAP') {
        errorObj[
          'collected_by'
        ] = `payment.collected_by can only be either 'BPP' or 'BAP' in ${metroSequence.SEARCH}`
      } else {
        setValue(`collected_by`, collectedBy)
      }

      // Validate payment tags
      const tagsValidation = validatePaymentTags(payment.tags)
      console.log('tagsValidation', tagsValidation)
      if (!tagsValidation.isValid) {
        Object.assign(errorObj, { tags: tagsValidation.errors })
      }
    } catch (error: any) {
      logger.error(`!!Error occcurred while validating payments in /${constants.MET_SEARCH},  ${error.message}`)
    }

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}
