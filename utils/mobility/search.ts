import { logger } from '../../shared/logger'
import { setValue } from '../../shared/dao'
import constants, { mobilitySequence } from '../../constants'
import { validateSchema, isObjectEmpty, checkMobilityContext } from '../../utils'

export const search = (data: any, msgIdSet: any) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      errorObj[mobilitySequence.SEARCH] = 'Json cannot be empty'
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

    msgIdSet.add(data.context.message_id)

    const schemaValidation = validateSchema(data.context.domain.split(':')[1], constants.MOB_SEARCH, data)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    const contextRes: any = checkMobilityContext(data.context, constants.MOB_SEARCH)
    setValue(`${mobilitySequence.SEARCH}_context`, data.context)
    msgIdSet.add(data.context.message_id)

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const stops = data.message.intent?.fulfillment?.stops
    if (!stops || stops.length === 0) {
      errorObj['stops'] = {
        fulfillment: {
          stops: 'Fulfillment stops are missing or empty',
        },
      }
    } else {
      const startStop = stops.find((stop: any) => stop.type === 'START')
      console.log('startStop', startStop)
      if (!startStop) {
        errorObj['stops'] = {
          fulfillment: {
            stops: 'Fulfillment stops must contain a type named START',
          },
        }
      } else {
        const startTimestamp = new Date(startStop.time.timestamp).getTime()
        if (isNaN(startTimestamp) || startTimestamp <= Date.now()) {
          errorObj['START'] = {
            fulfillment: {
              stops: 'Invalid timestamp for START stop',
            },
          }
        }
      }
    }

    if (!data.message.intent?.payment?.tags?.some((tag: any) => tag.descriptor.code === 'BUYER_FINDER_FEES')) {
      errorObj['BUYER_FINDER_FEES'] = {
        tags: `BUYER_FINDER_FEES tag must be present in payment inside ${mobilitySequence.SEARCH}`,
      }
    }

    if (!data.message.intent?.payment?.tags?.some((tag: any) => tag.descriptor.code === 'SETTLEMENT_TERMS')) {
      errorObj['SETTLEMENT_TERMS'] = {
        tags: `SETTLEMENT_TERMS tag must be present in payment inside ${mobilitySequence.SEARCH}`,
      }
    }

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}
