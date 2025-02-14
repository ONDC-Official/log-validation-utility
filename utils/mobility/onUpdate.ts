/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { mobilitySequence } from '../../constants'
import { logger } from '../../shared/logger'
import { validateSchema, isObjectEmpty } from '../'
import { getValue } from '../../shared/dao'
import {
  validateCancellationTerms,
  validateQuote,
  validatePayloadAgainstSchema,
  validateContext,
  validateItems,
  validateProviderId,
  validatePaymentObject,
  validateFulfillments,
} from './mobilityChecks'
import attributeConfig from './config/config2.0.1.json'

export const checkOnUpdate = (data: any, msgIdSet: any, version: any) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [mobilitySequence.ON_UPDATE]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('TRV', constants.ON_UPDATE, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.UPDATE, constants.ON_UPDATE)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const on_update = message.order
    const fulfillmentIdsSet = new Set()

    //provider id check
    try {
      logger.info(`Checking provider id in /${constants.ON_UPDATE}`)
      const providerError = validateProviderId(on_update?.provider?.id, constants.UPDATE, constants.ON_UPDATE)
      Object.assign(errorObj, providerError)
    } catch (error: any) {
      logger.error(`!!Error while checking provider id in /${constants.ON_UPDATE}, ${error.stack}`)
    }

    //fulfillments checks
    const flow = getValue('flow')
    let stateCode: string = 'RIDE_ENDED'
    if (flow == 'DRIVER_POST_CONFIRM') {
      stateCode = 'RIDE_ASSIGNED'
    }
    
    const fulfillmentError = validateFulfillments(
      on_update?.fulfillments,
      fulfillmentIdsSet,
      constants.ON_UPDATE,
      false,
      true,
      stateCode,
    )
    Object.assign(errorObj, fulfillmentError)

    //items checks
    const itemErrors = validateItems(on_update?.items, constants.ON_UPDATE, fulfillmentIdsSet)
    Object.assign(errorObj, itemErrors)

    // check payments
    try {
      logger.info(`Checking payments in /${constants.ON_UPDATE}`)
      const payments = on_update?.payments
      const paymentErrors = validatePaymentObject(payments, constants.ON_UPDATE)
      Object.assign(errorObj, paymentErrors)
    } catch (error: any) {
      logger.error(`!!Errors while checking payments in /${constants.ON_UPDATE}, ${error.stack}`)
    }

    //cancellation_terms checks
    try {
      logger.info(`Checking cancellation terms in /${constants.ON_UPDATE}`)
      const cancellationErrors = validateCancellationTerms(on_update.cancellation_terms, constants.ON_UPDATE)
      Object.assign(errorObj, cancellationErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation_terms in /${constants.ON_UPDATE}, ${error.stack}`)
    }

    //quote check
    try {
      logger.info(`Checking quote details in /${constants.ON_UPDATE}`)
      const quoteErrors = validateQuote(on_update?.quote, constants.ON_UPDATE)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking Quote in /${constants.ON_UPDATE},  ${error.message}`)
      return { error: error.message }
    }

    if (version === '2.0.1') {
      const additionalAttributes: any = attributeConfig.on_update
      validatePayloadAgainstSchema(additionalAttributes, data, errorObj, '', '')
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_UPDATE} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}
