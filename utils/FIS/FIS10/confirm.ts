/* eslint-disable no-prototype-builtins */
import constants from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty } from '../../'
import { getValue, setValue } from '../../../shared/dao'
import {
  validateBapFulfillments,
  validateBapItems,
  validateBapOffers,
  validateBillingObject,
  validateContext,
  validatePaymentObject,
  validateQuote,
} from './fisChecks'
import _ from 'lodash'
// import { validatePaymentTags } from './tags'

export const checkConfirm = (data: any, msgIdSet: any) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [constants.CONFIRM]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('FIS10', constants.CONFIRM, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.ON_INIT, constants.CONFIRM)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const confirm = message.order

    // check provider
    try {
      logger.info(`Validating provider object for /${constants.CONFIRM}`)
      const selectedProviderId = getValue('selectedProviderId')
      const providerId = confirm?.provider?.id

      if (!providerId) {
        errorObj.prvdrId = `provider.id is missing in /${constants.CONFIRM}`
      } else if (selectedProviderId && !_.isEqual(selectedProviderId, providerId)) {
        errorObj.prvdrId = `provider.id: ${providerId} in /${constants.CONFIRM} does'nt matches with the selected id ${selectedProviderId}`
        setValue('selectedProviderId', providerId)
      }
    } catch (error: any) {
      logger.error(`!!Error while checking provider object for /${constants.CONFIRM}, ${error.stack}`)
    }

    //check fulfillments
    try {
      logger.info(`Checking fulfillments in /${constants.CONFIRM}`)
      const fulfillmentErrors = validateBapFulfillments(confirm?.fulfillments, constants.CONFIRM)
      Object.assign(errorObj, fulfillmentErrors)
    } catch (error: any) {
      logger.error(`!!Errors while checking fulfillments in /${constants.CONFIRM}, ${error.stack}`)
    }

    //check items
    try {
      logger.info(`Checking items in /${constants.CONFIRM}`)
      const itemsErrors = validateBapItems(confirm?.items, constants.CONFIRM, true)
      Object.assign(errorObj, itemsErrors)
    } catch (error: any) {
      logger.error(`!!Errors while checking items in /${constants.CONFIRM}, ${error.stack}`)
    }

    //check offers
    try {
      logger.info(`Checking offers in /${constants.CONFIRM}`)
      const offersErrors = validateBapOffers(confirm?.offers, constants.CONFIRM)
      Object.assign(errorObj, offersErrors)
    } catch (error: any) {
      logger.error(`!!Errors while checking items in /${constants.CONFIRM}, ${error.stack}`)
    }

    // check payments
    try {
      logger.info(`Checking payments in /${constants.CONFIRM}`)
      const payments = confirm?.payments
      const validDescriptorCodes = ['BUYER_FINDER_FEES', 'SETTLEMENT_TERMS']
      const paymentErrors = validatePaymentObject(payments, constants.CONFIRM, validDescriptorCodes, false)
      Object.assign(errorObj, paymentErrors)
    } catch (error: any) {
      logger.error(`!!Errors while checking payments in /${constants.CONFIRM}, ${error.stack}`)
    }

    //check billing
    try {
      logger.info(`Checking billing in /${constants.CONFIRM}`)
      const billingErrors = validateBillingObject(confirm?.billing, constants.CONFIRM)
      Object.assign(errorObj, billingErrors)
    } catch (error: any) {
      logger.error(`!!Errors while checking billing in /${constants.CONFIRM}, ${error.stack}`)
    }

    //check quote
    try {
      logger.info(`Checking quote details in /${constants.CONFIRM}`)
      const quoteErrors = validateQuote(confirm?.quote)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking quote details in /${constants.CONFIRM}`, error.stack)
    }

    //order checks
    if (!confirm?.created_at) errorObj.created_at = `created_at is missing in /${constants.CONFIRM}`
    if (!confirm?.updated_at) errorObj.updated_at = `updated_at is missing in /${constants.CONFIRM}`
    if (!confirm?.status) errorObj.status = `status is missing in /${constants.CONFIRM}`
    else if (confirm?.status !== 'CREATED')
      errorObj.status = `status value must be in a standard enum format 'CREATED' in /${constants.CONFIRM}`

    if (!confirm?.id) errorObj.id = `order.id is missing in /${constants.CONFIRM}`
    else setValue('orderId', confirm?.id)

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.CONFIRM} API`, err)
    return { error: err.message }
  }
}
