import { logger } from '../../../../shared/logger'
import { setValue} from '../../../../shared/dao'
import constants from '../../../../constants'
import { validateSchema, isObjectEmpty, checkFISContext } from '../../../../utils'
import { 
  validateTransactionConsistency,
  validateProvider,
  validateQuote,
  validateItems,
  validateFulfillments,
  validateTransactionIdConsistency,
  validateMessageIdPair
} from './commonValidations'

export const checkon_updateWCL = (data: any, msgIdSet: any, flow: string, sequence: string) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [constants.ON_UPDATE]: 'JSON cannot be empty' }
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

    // Check context validity
    const contextRes: any = checkFISContext(data.context, constants.ON_UPDATE)
    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }
    
    setValue(`${constants.ON_UPDATE}_context`, data.context)
    setValue(`${constants.ON_UPDATE}_order`, data.message.order)
    msgIdSet.add(data.context.message_id)

    const order = data.message.order

    // Handle different flows with appropriate schema validation
    if (flow === "WCL_DRAWDOWN_FORECLOSURE" || 
        flow === "WCL_PRE_PART_PAYMENT" || 
        sequence === "on_update_pre_part_payment" || 
        sequence === "on_update_payment_status" ||
        sequence === "on_update_foreclosure_detail") {
      
    
      if (!order.id) {
        errorObj['order.id'] = 'Order ID is required'
      }
      
      if (!order.status) {
        errorObj['order.status'] = 'Order status is required'
      }
      
      if (!order.provider?.id) {
        errorObj['provider.id'] = 'Provider ID is required'
      }
      
      if (!order.quote?.price?.value) {
        errorObj['quote.price.value'] = 'Quote price value is required'
      }
      
      // Validate items array
      if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
        errorObj['items'] = 'Items array is required and cannot be empty'
      } else {
        // Validate each item has required fields
        for (let i = 0; i < order.items.length; i++) {
          const item = order.items[i];
          if (!item.id) {
            errorObj[`items[${i}].id`] = 'Item ID is required'
          }
          if (!item.descriptor?.code || !item.descriptor?.name) {
            errorObj[`items[${i}].descriptor`] = 'Item descriptor with code and name is required'
          }
          if (!item.price?.value || !item.price?.currency) {
            errorObj[`items[${i}].price`] = 'Item price with value and currency is required'
          }
        }
      }
      
      // Validate payments array
      if (!order.payments || !Array.isArray(order.payments) || order.payments.length === 0) {
        errorObj['payments'] = 'Payments array is required and cannot be empty'
      } else {
        // Validate each payment has required fields
        for (let i = 0; i < order.payments.length; i++) {
          const payment = order.payments[i];
          if (!payment.id) {
            errorObj[`payments[${i}].id`] = 'Payment ID is required'
          }
          if (!payment.params?.amount || !payment.params?.currency) {
            errorObj[`payments[${i}].params`] = 'Payment params with amount and currency are required'
          }
          if (!payment.status) {
            errorObj[`payments[${i}].status`] = 'Payment status is required'
          }
          if (!payment.type) {
            errorObj[`payments[${i}].type`] = 'Payment type is required'
          }
          
        }
      }
      
      // For foreclosure flow, check for a payment with FORECLOSURE label
      if (flow === "WCL_DRAWDOWN_FORECLOSURE" || sequence === "on_update_foreclosure_detail") {
        let hasForeclosurePayment = false;
        for (const payment of order.payments) {
          if (payment.time?.label === 'FORECLOSURE') {
            hasForeclosurePayment = true;
            break;
          }
        }
        
        if (!hasForeclosurePayment && sequence === "on_update_foreclosure_detail" ) {
          errorObj['foreclosure_payment'] = 'At least one payment with time.label=FORECLOSURE is required for foreclosure flow'
        }
      }
      
    } else if (sequence === "on_update_base_transaction") {
   
      if (!order.id) {
        errorObj['order.id'] = 'Order ID is required'
      }
      
      if (!order.status) {
        errorObj['order.status'] = 'Order status is required'
      }
      
      if (!order.provider?.id) {
        errorObj['provider.id'] = 'Provider ID is required'
      }
      
      if (!order.quote?.price?.value) {
        errorObj['quote.price.value'] = 'Quote price value is required'
      }
      
    
      if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
        errorObj['items'] = 'Items array is required and cannot be empty'
      } else {
        
        for (let i = 0; i < order.items.length; i++) {
          if (!order.items[i].id) {
            errorObj[`items[${i}].id`] = 'Item ID is required'
          }
        }
      }
      
    
      if (!order.payments || !Array.isArray(order.payments) || order.payments.length === 0) {
        errorObj['payments'] = 'At least one payment is required for base transaction'
      } else {
        
        let validPaymentFound = false;
        for (const payment of order.payments) {
          if (payment.id && payment.status && payment.params?.amount) {
            validPaymentFound = true;
            break;
          }
        }
        
        if (!validPaymentFound) {
          errorObj['payment_details'] = 'At least one payment must include id, status, and amount'
        }
      }
      
    } else if (flow === "WCL_CREDIT_LINE_CANCELLATION") {
      const schemaValidation = validateSchema('FIS_WCL', constants.ON_UPDATE_FLOW, data)
      if (schemaValidation !== 'error') {
        Object.assign(errorObj, schemaValidation)
      }
      
      if (!order.id) {
        errorObj['order.id'] = 'Order ID is required'
      }
      
      // Validate status is CANCELLED
      if (order.status !== 'CANCELLED') {
        errorObj['order.status'] = `Expected status CANCELLED for cancellation flow, found ${order.status}`
      }
      
      // Basic provider validation - checking ID
      if (!order.provider) {
        errorObj['provider'] = 'Provider details are required'
      } else if (!order.provider.id) {
        errorObj['provider.id'] = 'Provider ID is required'
      }
      
      // Basic quote validation - only checking essential fields
      if (!order.quote) {
        errorObj['quote'] = 'Quote details are required'
      } else {
        if (!order.quote.id) {
          errorObj['quote.id'] = 'Quote ID is required'
        }
        if (!order.quote.price?.value) {
          errorObj['quote.price.value'] = 'Quote price value is required'
        }
      }
      
      // Validate timestamps
      if (order.created_at && order.updated_at) {
        const createdDate = new Date(order.created_at).getTime()
        const updatedDate = new Date(order.updated_at).getTime()
        
        if (createdDate > updatedDate) {
          errorObj['order.timestamps'] = 'updated_at timestamp must be after created_at timestamp'
        }
      } else {
        errorObj['order.timestamps.missing'] = 'Both created_at and updated_at timestamps are required'
      }
      
    } 
    else if(flow === "WCL_MISSED_EMI_PAYMENT"){

      const schemaValidation = validateSchema('FIS_WCL', constants.ON_UPDATE_FORECLOSURE, data)
      if (schemaValidation !== 'error') {
        Object.assign(errorObj, schemaValidation)
      }

    }
    else {
     
      const schemaValidation = validateSchema('FIS_WCL', constants.ON_UPDATE, data)
      if (schemaValidation !== 'error') {
        Object.assign(errorObj, schemaValidation)
      }
      
      // Apply common validations for non-cancellation flows
      const transactionErrors = validateTransactionConsistency(data.context)
      Object.assign(errorObj, transactionErrors)
      
      const providerErrors = validateProvider(order.provider)
      Object.assign(errorObj, providerErrors)
      
      const quoteErrors = validateQuote(order.quote)
      Object.assign(errorObj, quoteErrors)
      
      const itemsErrors = validateItems(order.items)
      Object.assign(errorObj, itemsErrors)
      
      const fulfillmentsErrors = validateFulfillments(order.fulfillments)
      Object.assign(errorObj, fulfillmentsErrors)
      
      // Specific validation for loan status updates
      if (!order.loan_status) {
        errorObj['missing_loan_status'] = 'loan_status is required for loan status updates'
      } else {
        const validLoanStatuses = ['DISBURSED', 'ACTIVE', 'CLOSED', 'DEFAULTED']
        if (!validLoanStatuses.includes(order.loan_status)) {
          errorObj['invalid_loan_status'] = `loan_status must be one of: ${validLoanStatuses.join(', ')}`
        }
        
        setValue('last_loan_status', order.loan_status)
        
        // Additional validations based on loan status
        if (order.loan_status === 'DISBURSED') {
          if (!order.disbursement_details) {
            errorObj['missing_disbursement_details'] = 'disbursement_details are required when loan_status is DISBURSED'
          }
        } else if (order.loan_status === 'CLOSED') {
          if (!order.closure_details) {
            errorObj['missing_closure_details'] = 'closure_details are required when loan_status is CLOSED'
          }
        }
      }
    }

    // Add transaction ID consistency check
    const transactionIdConsistency = validateTransactionIdConsistency(data.context)
    Object.assign(errorObj, transactionIdConsistency)
    
    // Add message ID pair validation - this is an on_action call
    const messageIdPair = validateMessageIdPair(data.context, constants.ON_UPDATE, true)
    Object.assign(errorObj, messageIdPair)

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}