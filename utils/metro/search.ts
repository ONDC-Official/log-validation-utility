import { logger } from '../../shared/logger'
import { setValue } from '../../shared/dao'
import { validateContext } from './mobilityChecks'
import constants, { metroSequence } from '../../constants'
import { validateSchema, isObjectEmpty } from '..'
import { validatePaymentTags } from './tags'

export const search = (data: any, msgIdSet: any, secondSearch: boolean) => {
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
    const contextRes: any = validateContext(context, msgIdSet, constants.ON_SEARCH, constants.SEARCH, false)
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
        if (fulfillment?.vehicle?.category !== 'METRO') {
          errorObj['vehicle'] = 'vehicle.category should be "METRO" in Fulfillment'
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
      if (!payment?.collected_by)
        errorObj['collected_by'] =
          `payment.collected_by must be present in ${secondSearch ? metroSequence?.SEARCH2 : metroSequence.SEARCH1}`

      const tagsValidation = validatePaymentTags(payment?.tags)
      if (!tagsValidation?.isValid) {
        Object.assign(errorObj, { tags: tagsValidation?.errors })
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
