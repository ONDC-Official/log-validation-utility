import { logger } from '../../../../shared/logger'
import { setValue, getValue } from '../../../../shared/dao'
import constants from '../../../../constants'
import { validateSchema, isObjectEmpty, checkFISContext } from '../../../../utils'

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
    
    setValue(`${constants.ON_CANCEL}_context`, data.context)
    setValue(`${constants.ON_CANCEL}_order`, data.message.order)
    msgIdSet.add(data.context.message_id)

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    // Validate order details
    const order = data.message.order
    
    // Basic order validation for cancellation flow
    if (!order.id) {
      errorObj['order.id'] = 'Order ID is required in cancellation response'
    }
    
    if (!order.status) {
      errorObj['order.status'] = 'Order status is required in cancellation response'
    }
    
    // Validate provider - only check for id and descriptor, not locations
    if (!order.provider) {
      errorObj['provider'] = 'Provider details are required'
    } else if (!order.provider.id) {
      errorObj['provider.id'] = 'Provider ID is required'
    }
    
    // Validate transaction consistency
    const previousContext = getValue(`${constants.CANCEL}_context`)
    if (previousContext && previousContext.transaction_id !== data.context.transaction_id) {
      errorObj['context.transaction_id'] = `Transaction ID mismatch: expected ${previousContext.transaction_id}, found ${data.context.transaction_id}`
    }
    
    // Validate order ID matches the one in cancel request
    const cancelledOrderId = getValue('cancelled_order_id')
    if (cancelledOrderId && order.id !== cancelledOrderId) {
      errorObj['order.id.mismatch'] = `Order ID in on_cancel (${order.id}) does not match the ID in cancel request (${cancelledOrderId})`
    }

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}
