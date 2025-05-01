/* eslint-disable no-case-declarations */
/* eslint-disable no-prototype-builtins */
import { logger } from '../../../shared/logger'
import { getValue } from '../../../shared/dao'
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

export const checkOnInit = (data: any, msgIdSet: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [constants.ON_INIT]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema('FIS10', constants.ON_INIT, data)
  const contextRes: any = validateContext(context, msgIdSet, constants.INIT, constants.ON_INIT)
  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  const onInit: any = message.order

  //check Provider
  try {
    logger.info(`Comparing Provider object for /${constants.INIT} and /${constants.ON_INIT}`)
    const providerId = onInit?.provider?.id
    if (!providerId) errorObj.prvdrId = `provider.id is missing in /${constants.ON_INIT}`
    else {
      const selectedProviderId: any = getValue(`providerId`)
      if (selectedProviderId && !_.isEqual(selectedProviderId, providerId)) {
        errorObj.prvdrId = `Provider Id ${providerId} in /${constants.ON_INIT} does not exist in /${constants.INIT}`
      }
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing provider id for /${constants.ON_INIT} and /${constants.INIT} api, ${error.stack}`,
    )
  }

  //check fulfillments
  try {
    logger.info(`Checking fulfillments in /${constants.ON_INIT}`)
    const fulfillmentErrors = validateBppFulfillments(onInit?.fulfillments, constants.ON_INIT, false)
    Object.assign(errorObj, fulfillmentErrors)
  } catch (error: any) {
    logger.error(`!!Errors while checking fulfillments in /${constants.ON_INIT}, ${error.stack}`)
  }

  //check items
  try {
    logger.info(`Checking items in /${constants.ON_INIT}`)
    const itemsErrors = validateBapItems(onInit?.items, constants.ON_INIT, true)
    Object.assign(errorObj, itemsErrors)
  } catch (error: any) {
    logger.error(`!!Errors while checking items in /${constants.ON_INIT}, ${error.stack}`)
  }

  //check offers
  try {
    logger.info(`Checking offers in /${constants.ON_INIT}`)
    const offersErrors = validateBapOffers(onInit?.offers, constants.ON_INIT)
    Object.assign(errorObj, offersErrors)
  } catch (error: any) {
    logger.error(`!!Errors while checking items in /${constants.ON_INIT}, ${error.stack}`)
  }

  // check payments
  try {
    logger.info(`Checking payments in /${constants.ON_INIT}`)
    const payments = onInit?.payments
    const validDescriptorCodes = ['BUYER_FINDER_FEES']
    const paymentErrors = validatePaymentObject(payments, constants.ON_INIT, validDescriptorCodes, false)
    Object.assign(errorObj, paymentErrors)
  } catch (error: any) {
    logger.error(`!!Errors while checking payments in /${constants.ON_INIT}, ${error.stack}`)
  }

  //check billing
  try {
    logger.info(`Checking billing in /${constants.ON_INIT}`)
    const billingErrors = validateBillingObject(onInit?.billing, constants.ON_INIT)
    Object.assign(errorObj, billingErrors)
  } catch (error: any) {
    logger.error(`!!Errors while checking billing in /${constants.ON_INIT}, ${error.stack}`)
  }

  //check quote
  try {
    logger.info(`Checking quote details in /${constants.ON_INIT}`)
    const quoteErrors = validateQuote(onInit?.quote)
    Object.assign(errorObj, quoteErrors)
  } catch (error: any) {
    logger.error(`!!Error while checking quote details in /${constants.ON_INIT}`, error.stack)
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
