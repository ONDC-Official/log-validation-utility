import { logger } from '../../shared/logger'
import { setValue } from '../../shared/dao'
import constants, { metroSequence } from '../../constants'
import { validateSchema, isObjectEmpty, checkMetroContext } from '..'
import { validatePaymentTags } from './tags'

export const search = (data: any, msgIdSet: any, secondSearch: boolean) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return secondSearch
        ? (errorObj[metroSequence.SEARCH2] =  'Json cannot be empty' )
        : (errorObj[metroSequence.SEARCH1] = 'Json cannot be empty' )
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
    const contextRes: any = checkMetroContext(data.context, constants.SEARCH)
    setValue(`${metroSequence.SEARCH1}_context`, data.context)
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

    if (data.message.intent?.fulfillment) {
      if (!data.message.intent?.fulfillment?.vehicle) {
        errorObj['vehicle'] = {
          fulfillment: {
            vehicle: 'Fulfillment vehicle is missing or empty',
          },
        }
      } else {
        if (data.message.intent?.fulfillment?.vehicle?.category !== 'METRO') {
          errorObj['vehicle'] = 'Vehicle category should be "METRO" in Fulfillment'
        }
      }
      // Stops & Gps check
      if (secondSearch) {
        const stops = data.message.intent?.fulfillment?.stops
        if (!stops || stops.length === 0) {
          errorObj['stops'] = 'Fulfillment stops are missing or empty'
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

          if(!startStop)
            errorObj['stops'] = 'Fulfillments stops must contain type: START.'

          if(startStop && !startStop.location?.descriptor?.code){
              errorObj['stops.descriptor.code'] = 'Start object "Descriptor Code" is missing.'  
          }

          if(!endStop)
            errorObj['stops'] = 'Fulfillments stops must contain types: END.'

          if(endStop && !endStop.location?.descriptor?.code){
              errorObj['stops.descriptor.code'] = 'End object "Descriptor Code" is missing.'
          }
        }
      }
    } else {
      errorObj['fulfillments'] = 'Fulfillments field is missing inside the object fulfillment.'
    }

    try {
      logger.info(`Validating payments object for /${constants.SEARCH}`)
      const payment = data?.message?.intent?.payment
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
