import { logger } from '../../../../shared/logger'
import constants from '../../../../constants'
import { validateSchema, isObjectEmpty, checkFISContext } from '../../../../utils'
import { validateTransactionIdConsistency, validateMessageIdPair } from './commonValidations'

export const checkinitWCL = (data: any, msgIdSet: any, flow: string, sequence: string) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [constants.INIT]: 'JSON cannot be empty' }
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

    const schemaValidation = validateSchema('FIS_WCL', constants.INIT, data)
    const contextRes: any = checkFISContext(data.context, constants.INIT)
    
    // Add transaction ID consistency check
    const transactionIdConsistency = validateTransactionIdConsistency(data.context)
    Object.assign(errorObj, transactionIdConsistency)
    
    // Add message ID pair validation
    const messageIdPair = validateMessageIdPair(data.context, constants.INIT, false)
    Object.assign(errorObj, messageIdPair)
    
    // Save message ID to check for uniqueness
    msgIdSet.add(data.context.message_id)

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    const { context, message } = data
    const order = message.order

    // Validate context
    if (context.domain !== 'ONDC:FIS12') {
      errorObj['context.domain'] = 'Domain must be ONDC:FIS12'
    }

    if (context.action !== 'init') {
      errorObj['context.action'] = 'Action must be init'
    }

    // Validate order
    if (!order.provider) {
      errorObj['order.provider'] = 'Provider details are required'
    } else {
      if (!order.provider.id) {
        errorObj['order.provider.id'] = 'Provider ID is required'
      }
      if (!order.provider.locations?.[0]?.id) {
        errorObj['order.provider.locations'] = 'Provider location ID is required'
      }
    }

    // Validate items
    if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
      errorObj['order.items'] = 'Items array is required and cannot be empty'
    } else {
      const item = order.items[0]
      if (!item.id) {
        errorObj['order.items.id'] = 'Item ID is required'
      }
      if (!item.quantity?.count) {
        errorObj['order.items.quantity'] = 'Item quantity count is required'
      }
    }

    // Validate fulfillments
    if (!order.fulfillments || !Array.isArray(order.fulfillments) || order.fulfillments.length === 0) {
      errorObj['order.fulfillments'] = 'Fulfillments array is required and cannot be empty'
    } else {
      const fulfillment = order.fulfillments[0]
      if (!fulfillment.id) {
        errorObj['order.fulfillments.id'] = 'Fulfillment ID is required'
      }
      if (!fulfillment.type) {
        errorObj['order.fulfillments.type'] = 'Fulfillment type is required'
      }
      if (!fulfillment.customer?.person?.name) {
        errorObj['order.fulfillments.customer.person'] = 'Customer name is required'
      }
      if (!fulfillment.customer?.contact?.phone) {
        errorObj['order.fulfillments.customer.contact'] = 'Customer phone is required'
      }
    }

    // Validate payment
    if (!order.payment) {
      errorObj['order.payment'] = 'Payment details are required'
    } else {
      if (!order.payment.type) {
        errorObj['order.payment.type'] = 'Payment type is required'
      }
      if (!order.payment.collected_by) {
        errorObj['order.payment.collected_by'] = 'Payment collected_by is required'
      }
    }

    // Validate tags
    if (!order.tags || !Array.isArray(order.tags)) {
      errorObj['order.tags'] = 'Order tags array is required'
    } else {
      const loanDetailsTag = order.tags.find((tag: any) => tag.descriptor?.code === 'LOAN_DETAILS')
      if (!loanDetailsTag || !loanDetailsTag.list) {
        errorObj['order.tags.LOAN_DETAILS'] = 'LOAN_DETAILS tag with list is required'
      }

      const loanAmountTag = loanDetailsTag?.list?.find((item: any) => item.descriptor?.code === 'LOAN_AMOUNT')
      if (!loanAmountTag?.value) {
        errorObj['order.tags.LOAN_AMOUNT'] = 'LOAN_AMOUNT value is required'
      }

      const loanTenureTag = loanDetailsTag?.list?.find((item: any) => item.descriptor?.code === 'LOAN_TENURE')
      if (!loanTenureTag?.value) {
        errorObj['order.tags.LOAN_TENURE'] = 'LOAN_TENURE value is required'
      }
    }

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(`Error in checkInitWCL: ${error.message}`)
    return { error: error.message }
  }
}
