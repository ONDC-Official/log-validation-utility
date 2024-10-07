/* eslint-disable no-prototype-builtins */
// import _ from 'lodash'
import constants, { mobilitySequence } from '../../constants'
import { logger } from '../../shared/logger'
import { validateSchema, isObjectEmpty } from '../'
import { getValue, setValue } from '../../shared/dao'
import {
  validateContext,
  validateQuote,
  validateCancellationTerms,
  validatePayloadAgainstSchema,
  validatePaymentObject,
  validateProviderId,
  validateItems,
  validateFulfillments,
} from './mobilityChecks'
import attributeConfig from './config/config2.0.1.json'
import _ from 'lodash'

export const checkOnConfirm = (data: any, msgIdSet: any, version: any) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [mobilitySequence.ON_CONFIRM]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.ON_CONFIRM, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.CONFIRM, constants.ON_CONFIRM)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const on_confirm = message.order
    const fulfillmentIdsSet = new Set()

    try {
      logger.info(`Checking id in message object  /${constants.ON_CONFIRM}`)
      if (!on_confirm?.id) {
        errorObj.id = `message.id is missing in /${constants.ON_CONFIRM}`
      } else {
        setValue('orderId', on_confirm?.id)
      }
    } catch (error: any) {
      logger.error(`!!Error while checking id in message object  /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    //provider id check
    try {
      logger.info(`Checking provider id in /${constants.ON_CONFIRM}`)
      const providerError = validateProviderId(on_confirm?.provider?.id, constants.CONFIRM, constants.ON_CONFIRM)
      Object.assign(errorObj, providerError)
    } catch (error: any) {
      logger.error(`!!Error while checking provider id in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    //fulfillments checks
    const flow = getValue('flow')
    let stateCode: string = 'RIDE_ASSIGNED'
    if (flow == 'DRIVER_POST_CONFIRM') {
      stateCode = 'RIDE_CONFIRMED'
    }
    const fulfillmentError = validateFulfillments(
      on_confirm?.fulfillments,
      fulfillmentIdsSet,
      constants.ON_CONFIRM,
      false,
      true,
      stateCode,
    )
    Object.assign(errorObj, fulfillmentError)

    //items checks
    const itemErrors = validateItems(on_confirm?.items, constants.ON_CONFIRM, fulfillmentIdsSet)
    Object.assign(errorObj, itemErrors)

    // check payments
    try {
      logger.info(`Checking payments in /${constants.ON_CONFIRM}`)
      const payments = on_confirm?.payments
      const paymentErrors = validatePaymentObject(payments, constants.ON_CONFIRM)
      Object.assign(errorObj, paymentErrors)
    } catch (error: any) {
      logger.error(`!!Errors while checking payments in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    //quote check
    try {
      logger.info(`Checking quote details in /${constants.ON_CONFIRM}`)
      const quoteErrors = validateQuote(on_confirm?.quote, constants.ON_CONFIRM)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking Quote in /${constants.ON_CONFIRM},  ${error.message}`)
      return { error: error.message }
    }

    //cancellation_terms check
    try {
      logger.info(`Checking cancellation terms in /${constants.ON_CONFIRM}`)
      const cancellationErrors = validateCancellationTerms(on_confirm.cancellation_terms, constants.ON_CONFIRM)
      Object.assign(errorObj, cancellationErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation_terms in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    //status check
    try {
      logger.info(`Checking status in message object  /${constants.ON_CONFIRM}`)
      if (!message.order.status || !['COMPLETE', 'ACTIVE'].includes(message.order.status)) {
        errorObj.status =
          'Invalid or missing"` status in the message.order object. It must be one of: COMPLETE or ACTIVE'
      }
    } catch (error: any) {
      logger.error(`!!Error while checking status in message.order object  /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    if (version === '2.0.1') {
      const additionalAttributes: any = attributeConfig.on_confirm
      validatePayloadAgainstSchema(additionalAttributes, data, errorObj, '', '')
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_CONFIRM} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}
