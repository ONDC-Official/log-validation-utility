import { logger } from '../../../shared/logger'
import { setValue } from '../../../shared/dao'
import { validateContext } from '../../metro/mobilityChecks'
import constants, { airlinesSequence } from '../../../constants'
import { validateSchema, isObjectEmpty } from '../../'
import { validatePaymentTags } from './functions/validateTags'
import { validateFulfillmentStops } from './functions/helper'

export const search = (data: any, msgIdSet: any, flow: { flow: string; flowSet: string }) => {
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
    console.log('Flow.Flow: ', flow.flow)

    const schemaValidation = validateSchema(flow?.flow === 'AIRLINE' ? 'TRV12' : 'TRV12BUS', constants.SEARCH, data)

    const contextRes: any = validateContext(context, msgIdSet, constants.ON_SEARCH, constants.SEARCH, false)
    setValue(`${airlinesSequence.SEARCH}_message`, message)
    msgIdSet.add(data.context.message_id)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    try {
      logger.info(`Validating fulfillment stops for /${constants.SEARCH}`)
      const stops = data?.message?.intent?.fulfillment?.stops

      if (stops) {
        const stopsError = validateFulfillmentStops(stops)
        if (stopsError) {
          Object.assign(errorObj, stopsError)
        }
      }
    } catch (error: any) {
      logger.error(`!!Error occurred while validating fulfillment stops in /${constants.SEARCH}, ${error.message}`)
    }

    try {
      logger.info(`Validating payments object for /${constants.SEARCH}`)
      const payment = data?.message?.intent?.payment

      if (payment?.tags) {
        const paymentTagsError = validatePaymentTags(payment?.tags)
        if (paymentTagsError) {
          Object.assign(errorObj, paymentTagsError)
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
