import { logger } from '../../../../shared/logger'
import { setValue, getValue } from '../../../../shared/dao'
import constants from '../../../../constants'
import { validateSchema, isObjectEmpty, checkFISContext } from '../../../../utils'
import { validateMessageId } from './commonValidations'

export const checkupdatePurchaseFinance = (data: any, msgIdSet: any, flow: string, sequence: string) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [constants.UPDATE]: 'JSON cannot be empty' }
    }

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

    console.log("flow ---", flow)
    console.log("sequence ---", sequence)

    // Special handling for different flows
    const isMissedEmiFlow = flow === 'PURCHASE_FINANCE_MISSED_EMI';
    const isPrePartPaymentFlow = flow === 'PURCHASE_FINANCE_PRE_PART_PAYMENT';
    const isForeclosureFlow = flow === 'PURCHASE_FINANCE_FORECLOSURE';
    
    if (isMissedEmiFlow) {
      console.log("DETECTED PURCHASE_FINANCE_MISSED_EMI FLOW");
      // Store context for later use
      setValue(`${constants.UPDATE}_MISSED_EMI_context`, data.context);
    }
    
    if (isPrePartPaymentFlow) {
      console.log("DETECTED PURCHASE_FINANCE_PRE_PART_PAYMENT FLOW");
      // Store context for later use
      setValue(`${constants.UPDATE}_PRE_PART_PAYMENT_context`, data.context);
    }
    
    if (isForeclosureFlow) {
      console.log("DETECTED PURCHASE_FINANCE_FORECLOSURE FLOW");
      // Store context for later use
      setValue(`${constants.UPDATE}_FORECLOSURE_context`, data.context);
    }

    // Schema validation
    const schemaValidation = validateSchema('FIS12_PF', constants.UPDATE, data)
    
    // Context validation
    const contextRes: any = checkFISContext(data.context, constants.UPDATE)
    
    // Save context for future validations
    setValue(`${constants.UPDATE}_context`, data.context)
    msgIdSet.add(data.context.message_id)

    // Message ID validation
    const messageIdErrors = validateMessageId(data.context, msgIdSet)
    if (Object.keys(messageIdErrors).length > 0) {
      Object.assign(errorObj, messageIdErrors)
    }

    // Add context validation errors
    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    // Add schema validation errors
    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    // Transaction consistency validation
    const onConfirmContext = getValue(`${constants.ON_CONFIRM}_context`)
    if (onConfirmContext && data.context.transaction_id !== onConfirmContext.transaction_id) {
      errorObj['context.transaction_id'] = `Transaction ID mismatch with on_confirm: expected ${onConfirmContext.transaction_id}, found ${data.context.transaction_id}`
    }

    const { order, update_target } = data.message

    // Validate update_target
    if (!update_target) {
      errorObj['message.update_target'] = 'Update target is required'
    } else if (update_target !== 'fulfillments' && 
              !(isMissedEmiFlow && update_target === 'payments') && 
              !(isPrePartPaymentFlow && update_target === 'payments') &&
              !(isForeclosureFlow && update_target === 'payments')) {
      // For special flows, 'payments' is also a valid update_target
      const validFlows = [isMissedEmiFlow, isPrePartPaymentFlow, isForeclosureFlow].some(Boolean);
      errorObj['message.update_target'] = `Invalid update target: ${update_target}, expected ${validFlows ? "'fulfillments' or 'payments'" : "'fulfillments'"}`
    }

    // Validate order ID
    if (!order.id) {
      errorObj['order.id'] = 'Order ID is required'
    } else {
      // Validate order ID consistency
      const onConfirmOrder = getValue(`${constants.ON_CONFIRM}_order`)
      if (onConfirmOrder && order.id !== onConfirmOrder.id) {
        errorObj['order.id'] = `Order ID ${order.id} doesn't match with on_confirm order ID ${onConfirmOrder.id}`
      }
    }

    // Skip fulfillment validation if updating payments for special flows
    if ((update_target === 'payments' && (isMissedEmiFlow || isPrePartPaymentFlow || isForeclosureFlow))) {
      // For payment updates in special flows, no need to validate fulfillments
      
      // Validate payments for appropriate flow
      if (order.payments) {
        // Clean up any schema errors related to time.label
        if (isPrePartPaymentFlow || isForeclosureFlow) {
          for (const key in {...errorObj}) {
            if (key.startsWith('schemaErr') && 
                errorObj[key].includes('time/label')) {
              delete errorObj[key];
            }
          }
          
          // Clear fulfillments-related errors
          delete errorObj['order.fulfillments'];
        }
      }
    } else {
      // Standard validation for fulfillments update
      if (!order.fulfillments || !Array.isArray(order.fulfillments) || order.fulfillments.length === 0) {
        errorObj['order.fulfillments'] = 'Fulfillments array is required and cannot be empty'
      } else {
        // For PurchaseFinance update, typically updating the BASE_ORDER fulfillment
        const fulfillment = order.fulfillments[0]
        
        if (!fulfillment.id) {
          errorObj['order.fulfillments[0].id'] = 'Fulfillment ID is required'
        }
        
        if (!fulfillment.state || !fulfillment.state.descriptor || !fulfillment.state.descriptor.code) {
          errorObj['order.fulfillments[0].state.descriptor.code'] = 'Fulfillment state descriptor code is required'
        } else if (fulfillment.state.descriptor.code !== 'DELIVERED') {
          errorObj['order.fulfillments[0].state.descriptor.code'] = `Invalid state for update: ${fulfillment.state.descriptor.code}, expected 'DELIVERED'`
        }
        
        // Validate that customer details contain the necessary information
        if (fulfillment.customer) {
          if (!fulfillment.customer.person) {
            errorObj['order.fulfillments[0].customer.person'] = 'Customer person details are required'
          } else {
            // For PURCHASE_FINANCE, IMEI is needed for delivered product
            if (!fulfillment.customer.person.creds || !Array.isArray(fulfillment.customer.person.creds) || fulfillment.customer.person.creds.length === 0) {
              errorObj['order.fulfillments[0].customer.person.creds'] = 'Customer credentials array is required'
            } else {
              const imeiCred = fulfillment.customer.person.creds.find((cred: any) => cred.type === 'IMEI')
              if (!imeiCred) {
                errorObj['order.fulfillments[0].customer.person.creds.IMEI'] = 'IMEI credential is required'
              } else if (!imeiCred.id) {
                errorObj['order.fulfillments[0].customer.person.creds.IMEI.id'] = 'IMEI ID is required'
              }
            }
          }
        } else {
          errorObj['order.fulfillments[0].customer'] = 'Customer details are required'
        }
      }
    }

    // Store update information for future validations
    setValue(`${constants.UPDATE}_order`, order)

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}
