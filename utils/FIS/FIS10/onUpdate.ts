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

export const checkOnUpdate = (data: any, msgIdSet: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [constants.ON_UPDATE]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema('FIS10', constants.ON_UPDATE, data)
  const contextRes: any = validateContext(context, msgIdSet, constants.UPDATE, constants.ON_UPDATE)
  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  const onUpdate: any = message.order

  //check Provider
  try {
    logger.info(`Comparing Provider object for /${constants.UPDATE} and /${constants.ON_UPDATE}`)
    const providerId = onUpdate?.provider?.id
    if (!providerId) errorObj.prvdrId = `provider.id is missing in /${constants.ON_UPDATE}`
    else {
      const selectedProviderId: any = getValue(`providerId`)
      if (selectedProviderId && !_.isEqual(selectedProviderId, providerId)) {
        errorObj.prvdrId = `Provider Id ${providerId} in /${constants.ON_UPDATE} does not exist in /${constants.UPDATE}`
      }
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing provider id for /${constants.ON_UPDATE} and /${constants.UPDATE} api, ${error.stack}`,
    )
  }

  //check fulfillments
  try {
    logger.info(`Checking fulfillments in /${constants.ON_UPDATE}`)
    const fulfillmentErrors = validateBppFulfillments(onUpdate?.fulfillments, constants.ON_UPDATE, true)
    Object.assign(errorObj, fulfillmentErrors)
  } catch (error: any) {
    logger.error(`!!Errors while checking fulfillments in /${constants.ON_UPDATE}, ${error.stack}`)
  }

  //check items
  try {
    logger.info(`Checking items in /${constants.ON_UPDATE}`)
    const itemsErrors = validateBapItems(onUpdate?.items, constants.ON_UPDATE, true)
    Object.assign(errorObj, itemsErrors)
  } catch (error: any) {
    logger.error(`!!Errors while checking items in /${constants.ON_UPDATE}, ${error.stack}`)
  }

  //check offers
  try {
    logger.info(`Checking offers in /${constants.ON_UPDATE}`)
    const offersErrors = validateBapOffers(onUpdate?.offers, constants.ON_UPDATE)
    Object.assign(errorObj, offersErrors)
  } catch (error: any) {
    logger.error(`!!Errors while checking items in /${constants.ON_UPDATE}, ${error.stack}`)
  }

  // check payments
  try {
    logger.info(`Checking payments in /${constants.ON_UPDATE}`)
    const payments = onUpdate?.payments
    const validDescriptorCodes = ['BUYER_FINDER_FEES', 'SETTLEMENT_TERMS']
    const paymentErrors = validatePaymentObject(payments, constants.ON_UPDATE, validDescriptorCodes, true)
    Object.assign(errorObj, paymentErrors)
  } catch (error: any) {
    logger.error(`!!Errors while checking payments in /${constants.ON_UPDATE}, ${error.stack}`)
  }

  //check billing
  try {
    logger.info(`Checking billing in /${constants.ON_UPDATE}`)
    const billingErrors = validateBillingObject(onUpdate?.billing, constants.ON_UPDATE)
    Object.assign(errorObj, billingErrors)
  } catch (error: any) {
    logger.error(`!!Errors while checking billing in /${constants.ON_UPDATE}, ${error.stack}`)
  }

  //check quote
  try {
    logger.info(`Checking quote details in /${constants.ON_UPDATE}`)
    const quoteErrors = validateQuote(onUpdate?.quote)
    Object.assign(errorObj, quoteErrors)
  } catch (error: any) {
    logger.error(`!!Error while checking quote details in /${constants.ON_UPDATE}`, error.stack)
  }

  //order checks
  const validStates = ['CREATED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
  if (!onUpdate?.created_at) errorObj.created_at = `created_at is missing in /${constants.ON_UPDATE}`
  if (!onUpdate?.updated_at) errorObj.updated_at = `updated_at is missing in /${constants.ON_UPDATE}`
  if (!onUpdate?.status) errorObj.status = `status is missing in /${constants.ON_UPDATE}`
  else if (!validStates?.includes(onUpdate?.status))
    errorObj.status = `status value must be one of ${validStates.join(', ')} in /${constants.ON_UPDATE}`

  if (!onUpdate?.id) errorObj.id = `order.id is missing in /${constants.ON_UPDATE}`
  else {
    setValue('orderId', onUpdate?.id)
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
