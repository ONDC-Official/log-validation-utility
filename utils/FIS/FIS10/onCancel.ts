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

export const checkOnCancel = (data: any, msgIdSet: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [constants.ON_CANCEL]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema('FIS', constants.ON_CANCEL, data)
  const contextRes: any = validateContext(context, msgIdSet, constants.CANCEL, constants.ON_CANCEL)
  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  const onCancel: any = message.order

  //check Provider
  try {
    logger.info(`Comparing Provider object for /${constants.CANCEL} and /${constants.ON_CANCEL}`)
    const providerId = onCancel?.provider?.id
    if (!providerId) errorObj.prvdrId = `provider.id is missing in /${constants.ON_CANCEL}`
    else {
      const selectedProviderId: any = getValue(`providerId`)
      if (selectedProviderId && !_.isEqual(selectedProviderId, providerId)) {
        errorObj.prvdrId = `Provider Id ${providerId} in /${constants.ON_CANCEL} does not exist in /${constants.CANCEL}`
      }
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing provider id for /${constants.ON_CANCEL} and /${constants.CANCEL} api, ${error.stack}`,
    )
  }

  //check fulfillments
  try {
    logger.info(`Checking fulfillments in /${constants.ON_CANCEL}`)
    const fulfillmentErrors = validateBppFulfillments(onCancel?.fulfillments, constants.ON_CANCEL, true)
    Object.assign(errorObj, fulfillmentErrors)
  } catch (error: any) {
    logger.error(`!!Errors while checking fulfillments in /${constants.ON_CANCEL}, ${error.stack}`)
  }

  //check items
  try {
    logger.info(`Checking items in /${constants.ON_CANCEL}`)
    const itemsErrors = validateBapItems(onCancel?.items, constants.ON_CANCEL, true)
    Object.assign(errorObj, itemsErrors)
  } catch (error: any) {
    logger.error(`!!Errors while checking items in /${constants.ON_CANCEL}, ${error.stack}`)
  }

  //check offers
  try {
    logger.info(`Checking offers in /${constants.ON_CANCEL}`)
    const offersErrors = validateBapOffers(onCancel?.offers, constants.ON_CANCEL)
    Object.assign(errorObj, offersErrors)
  } catch (error: any) {
    logger.error(`!!Errors while checking items in /${constants.ON_CANCEL}, ${error.stack}`)
  }

  // check payments
  try {
    logger.info(`Checking payments in /${constants.ON_CANCEL}`)
    const payments = onCancel?.payments
    const validDescriptorCodes = ['BUYER_FINDER_FEES', 'SETTLEMENT_TERMS']
    const paymentErrors = validatePaymentObject(payments, constants.ON_CANCEL, validDescriptorCodes, true)
    Object.assign(errorObj, paymentErrors)
  } catch (error: any) {
    logger.error(`!!Errors while checking payments in /${constants.ON_CANCEL}, ${error.stack}`)
  }

  //check billing
  try {
    logger.info(`Checking billing in /${constants.ON_CANCEL}`)
    const billingErrors = validateBillingObject(onCancel?.billing, constants.ON_CANCEL)
    Object.assign(errorObj, billingErrors)
  } catch (error: any) {
    logger.error(`!!Errors while checking billing in /${constants.ON_CANCEL}, ${error.stack}`)
  }

  //check quote
  try {
    logger.info(`Checking quote details in /${constants.ON_CANCEL}`)
    const quoteErrors = validateQuote(onCancel?.quote)
    Object.assign(errorObj, quoteErrors)
  } catch (error: any) {
    logger.error(`!!Error while checking quote details in /${constants.ON_CANCEL}`, error.stack)
  }

  //order checks
  if (!onCancel?.created_at) errorObj.created_at = `created_at is missing in /${constants.ON_CANCEL}`
  if (!onCancel?.updated_at) errorObj.updated_at = `updated_at is missing in /${constants.ON_CANCEL}`
  if (!onCancel?.status) errorObj.status = `status is missing in /${constants.ON_CANCEL}`
  else if (onCancel?.status !== 'CANCELLED')
    errorObj.status = `status value must be in a standard enum format 'CANCELLED' in /${constants.ON_CANCEL}`

  if (!onCancel?.id) errorObj.id = `order.id is missing in /${constants.ON_CANCEL}`
  else {
    setValue('orderId', onCancel?.id)
  }

  //check cancellation
  if (!onCancel?.cancellation) errorObj.cancellation = `cancellation is missing in /${constants.ON_CANCEL}`
  else {
    const cancelledBy = onCancel?.cancellation?.cancelled_by
    if (!cancelledBy) errorObj.cancelled_by = `cancelled_by is missing in order.cancellation at /${constants.ON_CANCEL}`

    const reasonId = onCancel?.cancellation?.reason?.id
    if (!reasonId) errorObj['reason.id'] = `reason.id is missing in order.cancellation at /${constants.ON_CANCEL}`
    else if (reasonId == '001' && cancelledBy != context?.bpp_id)
      errorObj['cancelled_by'] = `cancelled_by value should be bpp_id in order.cancellation at /${constants.ON_CANCEL}`
    else if (reasonId == '002' && cancelledBy != context?.bap_id)
      errorObj['cancelled_by'] = `cancelled_by value should be bap_id in order.cancellation at /${constants.ON_CANCEL}`
    else
      errorObj[
        'reason.id'
      ] = `Invalid reason.id, should be either of '001' or '002' in order.cancellation at /${constants.ON_CANCEL}`
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
