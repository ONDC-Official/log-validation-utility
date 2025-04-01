/* eslint-disable no-prototype-builtins */
// import _ from 'lodash'
import constants, { mobilitySequence } from '../../constants'
import { logger } from '../../shared/logger'
import { validateSchema, isObjectEmpty } from '../'
import { getValue, setValue } from '../../shared/dao'
import {
  validateCancellationTerms,
  validateContext,
  validateQuote,
  validatePayloadAgainstSchema,
  validatePaymentObject,
  validateItems,
  validateProviderId,
  validateFulfillments,
} from './mobilityChecks'
import attributeConfig from './config/config2.0.1.json'

export const checkOnStatus = (data: any, msgIdSet: any, version: any) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [mobilitySequence.ON_STATUS]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('TRV', constants.ON_STATUS, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.STATUS, constants.ON_STATUS)
    setValue(`${mobilitySequence.ON_STATUS}`, data)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const on_status = message.order
    const fulfillmentIdsSet = new Set()

    //provider id check
    try {
      logger.info(`Checking provider id in /${constants.ON_STATUS}`)
      const providerError = validateProviderId(on_status?.provider?.id, constants.STATUS, constants.ON_STATUS)
      Object.assign(errorObj, providerError)
    } catch (error: any) {
      logger.error(`!!Error while checking provider id in /${constants.ON_STATUS}, ${error.stack}`)
    }

    //fulfillments checks
    const flow = getValue('flow')
    let stateCode: string = 'RIDE_ENDED'
    if (flow == 'DRIVER_POST_CONFIRM') {
      stateCode = 'RIDE_CONFIRMED'
    }
    const fulfillmentError = validateFulfillments(
      on_status?.fulfillments,
      fulfillmentIdsSet,
      constants.ON_STATUS,
      false,
      true,
      stateCode,
    )
    Object.assign(errorObj, fulfillmentError)

    //items checks
    const itemErrors = validateItems(on_status?.items, constants.ON_STATUS, fulfillmentIdsSet)
    Object.assign(errorObj, itemErrors)

    // check payments
    try {
      logger.info(`Checking payments in /${constants.ON_STATUS}`)
      const payments = on_status?.payments
      const paymentErrors = validatePaymentObject(payments, constants.ON_STATUS)
      Object.assign(errorObj, paymentErrors)
    } catch (error: any) {
      logger.error(`!!Errors while checking payments in /${constants.ON_STATUS}, ${error.stack}`)
    }

    //quote checks
    try {
      logger.info(`Checking quote details in /${constants.ON_STATUS}`)
      const quoteErrors = validateQuote(on_status?.quote, constants.ON_STATUS)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking Quote in /${constants.ON_STATUS},  ${error.message}`)
      return { error: error.message }
    }

    //cancellation_terms checks
    try {
      logger.info(`Checking cancellation terms in /${constants.ON_STATUS}`)
      const cancellationErrors = validateCancellationTerms(on_status.cancellation_terms, constants.ON_STATUS)
      Object.assign(errorObj, cancellationErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation_terms in /${constants.ON_STATUS}, ${error.stack}`)
    }

    if (version === '2.0.1') {
      const additionalAttributes: any = attributeConfig.on_status
      validatePayloadAgainstSchema(additionalAttributes, data, errorObj, '', '')
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_STATUS} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}
