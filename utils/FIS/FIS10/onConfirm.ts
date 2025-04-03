/* eslint-disable no-case-declarations */
/* eslint-disable no-prototype-builtins */
import { logger } from '../../../shared/logger'
import { getValue, setValue } from '../../../shared/dao'
import constants from '../../../constants'
import { validateSchema, isObjectEmpty } from '../../'
import {
  validateBapItems,
  validateBapOffers,
  validateBillingObject,
  validateBppFulfillments,
  validateContext,
  validatePaymentObject,
  validateQuote,
} from './fisChecks'
// import { validateItemsTags } from './tags'
import _ from 'lodash'

export const checkOnConfirm = (data: any, msgIdSet: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [constants.ON_CONFIRM]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema('FIS10', constants.ON_CONFIRM, data)
  const contextRes: any = validateContext(context, msgIdSet, constants.CONFIRM, constants.ON_CONFIRM)
  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  const onConfirm: any = message.order

  //check Provider
  try {
    logger.info(`Comparing Provider object for /${constants.CONFIRM} and /${constants.ON_CONFIRM}`)
    const providerId = onConfirm?.provider?.id
    if (!providerId) errorObj.prvdrId = `provider.id is missing in /${constants.ON_CONFIRM}`
    else {
      const selectedProviderId: any = getValue(`providerId`)
      if (selectedProviderId && !_.isEqual(selectedProviderId, providerId)) {
        errorObj.prvdrId = `Provider Id ${providerId} in /${constants.ON_CONFIRM} does not exist in /${constants.CONFIRM}`
      }
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing provider id for /${constants.ON_CONFIRM} and /${constants.CONFIRM} api, ${error.stack}`,
    )
  }

  //check fulfillments
  try {
    logger.info(`Checking fulfillments in /${constants.ON_CONFIRM}`)
    const fulfillmentErrors = validateBppFulfillments(onConfirm?.fulfillments, constants.ON_CONFIRM, true)
    Object.assign(errorObj, fulfillmentErrors)
  } catch (error: any) {
    logger.error(`!!Errors while checking fulfillments in /${constants.ON_CONFIRM}, ${error.stack}`)
  }

  //check items
  try {
    logger.info(`Checking items in /${constants.ON_CONFIRM}`)
    const itemsErrors = validateBapItems(onConfirm?.items, constants.ON_CONFIRM, true)
    Object.assign(errorObj, itemsErrors)
  } catch (error: any) {
    logger.error(`!!Errors while checking items in /${constants.ON_CONFIRM}, ${error.stack}`)
  }

  //check offers
  try {
    logger.info(`Checking offers in /${constants.ON_CONFIRM}`)
    const offersErrors = validateBapOffers(onConfirm?.offers, constants.ON_CONFIRM)
    Object.assign(errorObj, offersErrors)
  } catch (error: any) {
    logger.error(`!!Errors while checking items in /${constants.ON_CONFIRM}, ${error.stack}`)
  }

  // check payments
  try {
    logger.info(`Checking payments in /${constants.ON_CONFIRM}`)
    const payments = onConfirm?.payments
    const validDescriptorCodes = ['BUYER_FINDER_FEES', 'SETTLEMENT_TERMS']
    const paymentErrors = validatePaymentObject(payments, constants.ON_CONFIRM, validDescriptorCodes, true)
    Object.assign(errorObj, paymentErrors)
  } catch (error: any) {
    logger.error(`!!Errors while checking payments in /${constants.ON_CONFIRM}, ${error.stack}`)
  }

  //check billing
  try {
    logger.info(`Checking billing in /${constants.ON_CONFIRM}`)
    const billingErrors = validateBillingObject(onConfirm?.billing, constants.ON_CONFIRM)
    Object.assign(errorObj, billingErrors)
  } catch (error: any) {
    logger.error(`!!Errors while checking billing in /${constants.ON_CONFIRM}, ${error.stack}`)
  }

  //check quote
  try {
    logger.info(`Checking quote details in /${constants.ON_CONFIRM}`)
    const quoteErrors = validateQuote(onConfirm?.quote)
    Object.assign(errorObj, quoteErrors)
  } catch (error: any) {
    logger.error(`!!Error while checking quote details in /${constants.ON_CONFIRM}`, error.stack)
  }

  //order checks
  const validStates = ['CREATED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
  if (!onConfirm?.created_at) errorObj.created_at = `created_at is missing in /${constants.ON_CONFIRM}`
  if (!onConfirm?.updated_at) errorObj.updated_at = `updated_at is missing in /${constants.ON_CONFIRM}`
  if (!onConfirm?.status) errorObj.status = `status is missing in /${constants.ON_CONFIRM}`
  else if (!validStates?.includes(onConfirm?.status))
    errorObj.status = `status value must be one of ${validStates.join(', ')} in /${constants.ON_CONFIRM}`

  if (!onConfirm?.id) errorObj.id = `order.id is missing in /${constants.ON_CONFIRM}`
  else {
    setValue('orderId', onConfirm?.id)
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
