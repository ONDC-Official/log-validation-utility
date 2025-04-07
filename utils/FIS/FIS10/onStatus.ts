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

export const checkOnStatus = (data: any, msgIdSet: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [constants.ON_STATUS]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema('FIS10', constants.ON_STATUS, data)
  const contextRes: any = validateContext(context, msgIdSet, constants.STATUS, constants.ON_STATUS)
  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  const onStatus: any = message.order

  //check Provider
  try {
    logger.info(`Comparing Provider object for /${constants.STATUS} and /${constants.ON_STATUS}`)
    const providerId = onStatus?.provider?.id
    if (!providerId) errorObj.prvdrId = `provider.id is missing in /${constants.ON_STATUS}`
    else {
      const selectedProviderId: any = getValue(`providerId`)
      if (selectedProviderId && !_.isEqual(selectedProviderId, providerId)) {
        errorObj.prvdrId = `Provider Id ${providerId} in /${constants.ON_STATUS} does not exist in /${constants.STATUS}`
      }
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing provider id for /${constants.ON_STATUS} and /${constants.STATUS} api, ${error.stack}`,
    )
  }

  //check fulfillments
  try {
    logger.info(`Checking fulfillments in /${constants.ON_STATUS}`)
    const fulfillmentErrors = validateBppFulfillments(onStatus?.fulfillments, constants.ON_STATUS, true)
    Object.assign(errorObj, fulfillmentErrors)
  } catch (error: any) {
    logger.error(`!!Errors while checking fulfillments in /${constants.ON_STATUS}, ${error.stack}`)
  }

  //check items
  try {
    logger.info(`Checking items in /${constants.ON_STATUS}`)
    const itemsErrors = validateBapItems(onStatus?.items, constants.ON_STATUS, true)
    Object.assign(errorObj, itemsErrors)
  } catch (error: any) {
    logger.error(`!!Errors while checking items in /${constants.ON_STATUS}, ${error.stack}`)
  }

  //check offers
  try {
    logger.info(`Checking offers in /${constants.ON_STATUS}`)
    const offersErrors = validateBapOffers(onStatus?.offers, constants.ON_STATUS)
    Object.assign(errorObj, offersErrors)
  } catch (error: any) {
    logger.error(`!!Errors while checking items in /${constants.ON_STATUS}, ${error.stack}`)
  }

  // check payments
  try {
    logger.info(`Checking payments in /${constants.ON_STATUS}`)
    const payments = onStatus?.payments
    const validDescriptorCodes = ['BUYER_FINDER_FEES', 'SETTLEMENT_TERMS']
    const paymentErrors = validatePaymentObject(payments, constants.ON_STATUS, validDescriptorCodes, true)
    Object.assign(errorObj, paymentErrors)
  } catch (error: any) {
    logger.error(`!!Errors while checking payments in /${constants.ON_STATUS}, ${error.stack}`)
  }

  //check billing
  try {
    logger.info(`Checking billing in /${constants.ON_STATUS}`)
    const billingErrors = validateBillingObject(onStatus?.billing, constants.ON_STATUS)
    Object.assign(errorObj, billingErrors)
  } catch (error: any) {
    logger.error(`!!Errors while checking billing in /${constants.ON_STATUS}, ${error.stack}`)
  }

  //check quote
  try {
    logger.info(`Checking quote details in /${constants.ON_STATUS}`)
    const quoteErrors = validateQuote(onStatus?.quote)
    Object.assign(errorObj, quoteErrors)
  } catch (error: any) {
    logger.error(`!!Error while checking quote details in /${constants.ON_STATUS}`, error.stack)
  }

  //order checks
  const validStates = ['CREATED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
  if (!onStatus?.created_at) errorObj.created_at = `created_at is missing in /${constants.ON_STATUS}`
  if (!onStatus?.updated_at) errorObj.updated_at = `updated_at is missing in /${constants.ON_STATUS}`
  if (!onStatus?.status) errorObj.status = `status is missing in /${constants.ON_STATUS}`
  else if (!validStates?.includes(onStatus?.status))
    errorObj.status = `status value must be one of ${validStates.join(', ')} in /${constants.ON_STATUS}`

  if (!onStatus?.id) errorObj.id = `order.id is missing in /${constants.ON_STATUS}`
  else {
    setValue('orderId', onStatus?.id)
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
