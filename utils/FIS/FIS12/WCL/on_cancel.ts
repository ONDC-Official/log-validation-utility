import { logger } from '../../../../shared/logger'
import {  getValue } from '../../../../shared/dao'
import constants from '../../../../constants'
import { validateSchema, isObjectEmpty, checkFISContext } from '../../../../utils'
import { validateTransactionIdConsistency, validateMessageIdPair } from './commonValidations'

export const checkon_cancelWCL = (data: any, msgIdSet: any, flow: string, sequence: string) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [constants.ON_CANCEL]: 'JSON cannot be empty' }
    }

    console.log("flow ---", flow)
    console.log("sequence ---", sequence)

    if (
      !data.message ||
      !data.context ||
      !data.message.order ||
      isObjectEmpty(data.message) ||
      isObjectEmpty(data.message.order)
    ) {
      errorObj['missingFields'] = '/context, /message, /order or /message/order is missing or empty'
      return Object.keys(errorObj).length > 0 && errorObj
    }

    const schemaValidation = validateSchema('FIS_WCL', constants.ON_CANCEL, data)
    const contextRes: any = checkFISContext(data.context, constants.ON_CANCEL)
    
    // Add transaction ID consistency check
    const transactionIdConsistency = validateTransactionIdConsistency(data.context)
    Object.assign(errorObj, transactionIdConsistency)
    
    // Add message ID pair validation - this is an on_action call
    const messageIdPair = validateMessageIdPair(data.context, constants.ON_CANCEL, true)
    Object.assign(errorObj, messageIdPair)
    
    // Save message ID to check for uniqueness
    msgIdSet.add(data.context.message_id)

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    // Validate order status
    const { order } = data.message
    if (order.status !== 'CANCELLED') {
      errorObj['order.status'] = 'Order status must be CANCELLED in on_cancel response'
    }

    // Validate order ID consistency with cancel request
    const cancelledOrderId = getValue('cancelled_order_id')
    if (cancelledOrderId && cancelledOrderId !== order.id) {
      errorObj['order.id.consistency'] = `Order ID mismatch: expected ${cancelledOrderId}, found ${order.id}`
    }

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}
