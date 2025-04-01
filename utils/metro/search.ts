import { logger } from '../../shared/logger'
import { setValue } from '../../shared/dao'
import { validateContext } from './mobilityChecks'
import constants, { metroSequence } from '../../constants'
import { validateSchema, isObjectEmpty } from '..'
import { validatePaymentTags } from './tags'
import { validateDomain } from './validate/helper'
import { METRODOMAIN } from './validate/functions/constant'

export const search = (data: any, msgIdSet: any, secondSearch: boolean, flow: { flow: string; flowSet: string }) => {
  const errorObj: any = {}
  const { context, message } = data
  try {
    if (!data || isObjectEmpty(data)) {
      return 'Json cannot be empty'
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

    const schemaValidation = validateSchema('TRV', constants.SEARCH, data)
    const validateDomainName = validateDomain(context?.domain || 'ONDC:TRV11')
    if (!validateDomainName)
      errorObj['domain'] =
        `context.domain should be ${METRODOMAIN.METRO} instead of ${context?.domain} in ${secondSearch ? metroSequence.SEARCH2 : metroSequence.SEARCH1}`

    const contextRes: any = validateContext(
      context,
      msgIdSet,
      constants.ON_SEARCH,
      constants.SEARCH,
      false,
      secondSearch,
    )
    setValue(`${metroSequence.SEARCH1}_message`, message)
    msgIdSet.add(data.context.message_id)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const fulfillment = data.message.intent?.fulfillment
    if (fulfillment) {
      if (!fulfillment?.vehicle || !fulfillment?.vehicle?.category) {
        errorObj['vehicle'] = {
          fulfillment: {
            vehicle: 'Fulfillment vehicle.category is missing or empty',
          },
        }
      } else {
        if (fulfillment?.vehicle?.category !== (String(flow?.flow).toUpperCase() !== 'METRO' ? 'BUS' : 'METRO')) {
          errorObj['vehicle'] =
            `vehicle.category should be ${String(flow?.flow).toUpperCase() !== 'METRO' ? 'BUS' : 'METRO'} in Fulfillment`
        }
      }
      // Stops & Gps check
      if (secondSearch) {
        const stops = fulfillment?.stops
        if (!stops || stops.length === 0) {
          errorObj['stops'] = 'Fulfillment stops are missing or empty'
        } else {
          const stopTypes = stops.map((stop: any, index: number) => {
            if (!stop?.location?.descriptor?.code)
              errorObj[`stops[${index}]descriptor.code`] = `descriptor.code is missing at stops[${index}]`
            return stop.type
          })
          const invalidStopTypes = stopTypes.filter((type: string) => type !== 'START' && type !== 'END')

          if (invalidStopTypes.length > 0) {
            errorObj['stops.invalid'] = {
              fulfillments: {
                stops: `Invalid stop types found: ${invalidStopTypes.join(
                  ', ',
                )}. Fulfillments stops must contain only 'START' and 'END' types.`,
              },
            }
          }

          const startStop = stops.find((stop: any) => stop.type === 'START')
          const endStop = stops.find((stop: any) => stop.type === 'END')

          if (!startStop) errorObj['stops.start'] = 'Fulfillments stops must contain type: START.'

          if (startStop && !startStop.location?.descriptor?.code) {
            errorObj['stops.start.descriptor.code'] = 'Start object "Descriptor Code" is missing.'
          }

          if (!endStop) errorObj['stops.end'] = 'Fulfillments stops must contain types: END.'

          if (endStop && !endStop.location?.descriptor?.code) {
            errorObj['stops.end.descriptor.code'] = 'End object "Descriptor Code" is missing.'
          }
        }
      }
    } else {
      errorObj['fulfillments'] = 'fulfillment object is missing.'
    }

    try {
      logger.info(`Validating payments object for /${constants.SEARCH}`)
      const payment = data?.message?.intent?.payment

      if (!payment) {
        errorObj['payment'] = 'payment object is missing.'
      } else {
        // Validate `collected_by`
        if (!payment.collected_by) {
          errorObj['collected_by'] = `payment.collected_by must be present in ${
            secondSearch ? metroSequence?.SEARCH2 : metroSequence.SEARCH1
          }`
        }

        // Validate `tags`
        if (!payment.tags) {
          errorObj['payment.tags'] = `payment.tags is missing in ${
            secondSearch ? metroSequence?.SEARCH2 : metroSequence.SEARCH1
          }`
        } else {
          // Validate tags using external function
          const tagsValidation = validatePaymentTags(payment.tags, secondSearch ? 'search2' : constants.SEARCH)
          if (!tagsValidation?.isValid) {
            errorObj.tags = tagsValidation.errors
          }
        }
      }
    } catch (error: any) {
      logger.error(`!!Error occcurred while validating payments in /${constants.SEARCH},  ${error.message}`)
    }

    return Object.keys(errorObj)?.length > 0 && errorObj
  } catch (error: any) {
    logger.error(error?.message)
    return { error: error?.message }
  }
}
