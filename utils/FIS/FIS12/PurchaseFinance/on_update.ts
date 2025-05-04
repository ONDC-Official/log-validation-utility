import { logger } from '../../../../shared/logger'
import { setValue, getValue } from '../../../../shared/dao'
import constants from '../../../../constants'
import { validateSchema, isObjectEmpty, checkFISContext } from '../../../../utils'
import {  validateMessageId, validateProvider, validateItems, validateQuote } from './commonValidations'

export const on_updatePurchaseFinnace = (data: any, msgIdSet: any, flow: string, sequence: string) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [constants.ON_UPDATE]: 'JSON cannot be empty' }
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
    
    // Handle special sequences in each flow
    const isEmiDetailSequence = sequence === 'on_update_emi_detail' || sequence === 'ON_UPDATE_EMI_DETAIL';
    const isUnsolicitedSequence = sequence === 'on_update_unsolicated' || sequence === 'ON_UPDATE_UNSOLICATED';
    const isPrePartPaymentDetailSequence = sequence === 'on_update_pre_part_payment_detail' || sequence === 'ON_UPDATE_PRE_PART_PAYMENT_DETAIL';
    const isForeclosureDetailSequence = sequence === 'on_update_foreclosure_detail' || sequence === 'ON_UPDATE_FORECLOSURE_DETAIL';
    
    if (isMissedEmiFlow) {
      console.log(`DETECTED PURCHASE_FINANCE_MISSED_EMI FLOW, Sequence: ${sequence}`);
      // Store context for later use
      setValue(`${constants.ON_UPDATE}_MISSED_EMI_${sequence}_context`, data.context);
    }
    
    if (isPrePartPaymentFlow) {
      console.log(`DETECTED PURCHASE_FINANCE_PRE_PART_PAYMENT FLOW, Sequence: ${sequence}`);
      // Store context for later use
      setValue(`${constants.ON_UPDATE}_PRE_PART_PAYMENT_${sequence}_context`, data.context);
    }
    
    if (isForeclosureFlow) {
      console.log(`DETECTED PURCHASE_FINANCE_FORECLOSURE FLOW, Sequence: ${sequence}`);
      // Store context for later use
      setValue(`${constants.ON_UPDATE}_FORECLOSURE_${sequence}_context`, data.context);
    }

    // Schema validation
    const schemaValidation = validateSchema('FIS12_PF', constants.ON_UPDATE, data)
    
    // Context validation
    const contextRes: any = checkFISContext(data.context, constants.ON_UPDATE)
    
    // Save context for future validations
    setValue(`${constants.ON_UPDATE}_context`, data.context)
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
    const updateContext = getValue(`${constants.UPDATE}_context`)
    if (updateContext && data.context.transaction_id !== updateContext.transaction_id) {
      errorObj['context.transaction_id'] = `Transaction ID mismatch with update: expected ${updateContext.transaction_id}, found ${data.context.transaction_id}`
    }

    const { order } = data.message

    // Validate order ID
    if (!order.id) {
      errorObj['order.id'] = 'Order ID is required'
    } else {
      // Validate order ID consistency
      const updateOrder = getValue(`${constants.UPDATE}_order`)
      if (updateOrder && order.id !== updateOrder.id) {
        errorObj['order.id'] = `Order ID ${order.id} doesn't match with update order ID ${updateOrder.id}`
      }
    }

    // Validate order status - for foreclosure flow with unsolicited update, COMPLETE is valid
    const isCompleteStatusValid = isForeclosureFlow && isUnsolicitedSequence;
    
    if (!order.status) {
      errorObj['order.status'] = 'Order status is required'
    } else if (order.status !== 'ACTIVE' && !(isCompleteStatusValid && order.status === 'COMPLETE')) {
      errorObj['order.status'] = `Invalid order status: ${order.status}, expected ${isCompleteStatusValid ? "'ACTIVE' or 'COMPLETE'" : "'ACTIVE'"}`
    }

    // Validate provider
    if (!order.provider) {
      errorObj['order.provider'] = 'Provider details are required'
    } else {
      const providerErrors = validateProvider(order.provider)
      if (Object.keys(providerErrors).length > 0) {
        Object.assign(errorObj, providerErrors)
      }
    }

    // Validate items
    if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
      errorObj['order.items'] = 'Items array is required and cannot be empty'
    } else {
      // Validate each item
      for (let i = 0; i < order.items.length; i++) {
        const item = order.items[i]
        const itemErrors = validateItems([item])
        if (Object.keys(itemErrors).length > 0) {
          Object.assign(errorObj, itemErrors)
        }
        
        // Validate fulfillment_ids
        if (!item.fulfillment_ids || !Array.isArray(item.fulfillment_ids) || item.fulfillment_ids.length === 0) {
          errorObj[`order.items[${i}].fulfillment_ids`] = 'Fulfillment IDs array is required and cannot be empty'
        } else if (item.fulfillment_ids.length < 2) {
          errorObj[`order.items[${i}].fulfillment_ids`] = 'At least 2 fulfillment IDs (LOAN and BASE_ORDER) are required'
        }
      }
    }

    // Validate fulfillments
    if (!order.fulfillments || !Array.isArray(order.fulfillments) || order.fulfillments.length === 0) {
      errorObj['order.fulfillments'] = 'Fulfillments array is required and cannot be empty'
    } else {
      // Check for required fulfillments: LOAN and BASE_ORDER
      let loanFulfillment = null
      let baseOrderFulfillment = null
      
      for (let i = 0; i < order.fulfillments.length; i++) {
        const fulfillment = order.fulfillments[i]
        
        if (!fulfillment.id) {
          errorObj[`order.fulfillments[${i}].id`] = 'Fulfillment ID is required'
        }
        
        if (!fulfillment.type) {
          errorObj[`order.fulfillments[${i}].type`] = 'Fulfillment type is required'
        } else {
          if (fulfillment.type === 'LOAN') {
            loanFulfillment = fulfillment
          } else if (fulfillment.type === 'BASE_ORDER') {
            baseOrderFulfillment = fulfillment
          }
        }
        
        if (!fulfillment.state || !fulfillment.state.descriptor || !fulfillment.state.descriptor.code) {
          errorObj[`order.fulfillments[${i}].state.descriptor.code`] = 'Fulfillment state descriptor code is required'
        }
      }
      
      // Validate LOAN fulfillment
      if (!loanFulfillment) {
        errorObj['order.fulfillments.LOAN'] = 'LOAN fulfillment is required'
      } else {
        // For on_update, LOAN fulfillment should be at least in SANCTIONED state
        if (loanFulfillment.state?.descriptor?.code !== 'SANCTIONED' && 
            loanFulfillment.state?.descriptor?.code !== 'DISBURSED') {
          errorObj['order.fulfillments.LOAN.state.descriptor.code'] = 
            `Invalid state for LOAN fulfillment: ${loanFulfillment.state?.descriptor?.code}, expected 'SANCTIONED' or 'DISBURSED'`
        }
        
        // If DISBURSED, check for reference number
        if (loanFulfillment.state?.descriptor?.code === 'DISBURSED') {
          const infoTag = loanFulfillment.tags?.find((tag: any) => tag.descriptor?.code === 'INFO')
          if (!infoTag || !infoTag.list || !Array.isArray(infoTag.list)) {
            errorObj['order.fulfillments.LOAN.tags.INFO'] = 'INFO tag with list is required for DISBURSED loan'
          } else {
            const referenceNumberItem = infoTag.list.find((item: any) => item.descriptor?.code === 'REFERENCE_NUMBER')
            if (!referenceNumberItem?.value) {
              errorObj['order.fulfillments.LOAN.tags.INFO.REFERENCE_NUMBER'] = 'REFERENCE_NUMBER is required for DISBURSED loan'
            }
          }
        }
      }
      
      // Validate BASE_ORDER fulfillment
      if (!baseOrderFulfillment) {
        errorObj['order.fulfillments.BASE_ORDER'] = 'BASE_ORDER fulfillment is required'
      } else {
        // For regular on_update, BASE_ORDER fulfillment should be in DELIVERED state
        // For special flows, allow PLACED state for BASE_ORDER
        const validBaseOrderStates = ['DELIVERED'];
        
        // For special flows, PLACED is also valid
        if (isMissedEmiFlow || isPrePartPaymentFlow || isForeclosureFlow) {
          validBaseOrderStates.push('PLACED');
        }
        
        if (!validBaseOrderStates.includes(baseOrderFulfillment.state?.descriptor?.code)) {
          errorObj['order.fulfillments.BASE_ORDER.state.descriptor.code'] = 
            `Invalid state for BASE_ORDER fulfillment: ${baseOrderFulfillment.state?.descriptor?.code}, expected ${(isMissedEmiFlow || isPrePartPaymentFlow || isForeclosureFlow) ? "'DELIVERED' or 'PLACED'" : "'DELIVERED'"}`
        }
        
        // Validate IMEI in customer credentials
        if (!baseOrderFulfillment.customer?.person?.creds || 
            !Array.isArray(baseOrderFulfillment.customer.person.creds) || 
            baseOrderFulfillment.customer.person.creds.length === 0) {
          errorObj['order.fulfillments.BASE_ORDER.customer.person.creds'] = 'Customer credentials array is required'
        } else {
          const imeiCred = baseOrderFulfillment.customer.person.creds.find((cred: any) => cred.type === 'IMEI')
          if (!imeiCred) {
            errorObj['order.fulfillments.BASE_ORDER.customer.person.creds.IMEI'] = 'IMEI credential is required'
          } else if (!imeiCred.id) {
            errorObj['order.fulfillments.BASE_ORDER.customer.person.creds.IMEI.id'] = 'IMEI ID is required'
          }
        }
      }
    }

    // Validate payments
    if (!order.payments || !Array.isArray(order.payments) || order.payments.length === 0) {
      errorObj['order.payments'] = 'Payments array is required and cannot be empty'
    } else if (isMissedEmiFlow) {
      // For MISSED_EMI flow, validate that we have the special payment for missed EMI
      const missedEmiPayment = order.payments.find((payment: any) => 
        payment.time && payment.time.label === 'MISSED_EMI_PAYMENT'
      );
      
      if (!missedEmiPayment) {
        errorObj['order.payments.MISSED_EMI_PAYMENT'] = 'Payment with time.label = MISSED_EMI_PAYMENT is required';
      }
      
      // For this flow, also check that all payments have valid statuses
      // DEFERRED is also a valid status for MISSED_EMI flow
      order.payments.forEach((payment: any, index: number) => {
        if (payment.status && !['PAID', 'NOT-PAID', 'DEFERRED'].includes(payment.status)) {
          errorObj[`order.payments[${index}].status`] = `Invalid payment status: ${payment.status}, expected 'PAID', 'NOT-PAID', or 'DEFERRED'`;
        }
      });
    } else if (isPrePartPaymentFlow) {
      // For PRE_PART_PAYMENT flow, validate that we have the special payment
      const prePartPayment = order.payments.find((payment: any) => 
        payment.time && payment.time.label === 'PRE_PART_PAYMENT'
      );
      
      if (!prePartPayment) {
        errorObj['order.payments.PRE_PART_PAYMENT'] = 'Payment with time.label = PRE_PART_PAYMENT is required';
      }
      
      // For this flow, also check that all payments have valid statuses
      // DEFERRED is also a valid status for PRE_PART_PAYMENT flow
      order.payments.forEach((payment: any, index: number) => {
        if (payment.status && !['PAID', 'NOT-PAID', 'DEFERRED'].includes(payment.status)) {
          errorObj[`order.payments[${index}].status`] = `Invalid payment status: ${payment.status}, expected 'PAID', 'NOT-PAID', or 'DEFERRED'`;
        }
      });
    } else if (isForeclosureFlow) {
      // For FORECLOSURE flow, validate that we have the special payment
      const foreclosurePayment = order.payments.find((payment: any) => 
        payment.time && payment.time.label === 'FORECLOSURE'
      );
      
      if (!foreclosurePayment) {
        errorObj['order.payments.FORECLOSURE'] = 'Payment with time.label = FORECLOSURE is required';
      }
      
      // For this flow, also check that all payments have valid statuses
      // DEFERRED is also a valid status for this flow
      order.payments.forEach((payment: any, index: number) => {
        if (payment.status && !['PAID', 'NOT-PAID', 'DEFERRED'].includes(payment.status)) {
          errorObj[`order.payments[${index}].status`] = `Invalid payment status: ${payment.status}, expected 'PAID', 'NOT-PAID', or 'DEFERRED'`;
        }
      });
    }

    // Validate quote
    if (!order.quote) {
      errorObj['order.quote'] = 'Quote details are required'
    } else {
      const quoteErrors = validateQuote(order.quote)
      if (Object.keys(quoteErrors).length > 0) {
        Object.assign(errorObj, quoteErrors)
      }
    }

    // Validate documents (should include LOAN_AGREEMENT)
    if (!order.documents || !Array.isArray(order.documents) || order.documents.length === 0) {
      errorObj['order.documents'] = 'Documents array is required and cannot be empty'
    } else {
      const loanAgreementDoc = order.documents.find((doc: any) => doc.descriptor?.code === 'LOAN_AGREEMENT')
      if (!loanAgreementDoc) {
        errorObj['order.documents.LOAN_AGREEMENT'] = 'Loan agreement document is required'
      }
      
      // For on_update, we might also have a LOAN_CANCELLATION document
      const loanCancellationDoc = order.documents.find((doc: any) => doc.descriptor?.code === 'LOAN_CANCELLATION')
      if (loanCancellationDoc) {
        if (!loanCancellationDoc.mime_type) {
          errorObj['order.documents.LOAN_CANCELLATION.mime_type'] = 'Document mime_type is required'
        }
        
        if (!loanCancellationDoc.url) {
          errorObj['order.documents.LOAN_CANCELLATION.url'] = 'Document URL is required'
        }
      }
    }

    // Validate timestamps
    if (!order.created_at) {
      errorObj['order.created_at'] = 'Order created_at timestamp is required'
    }
    
    if (!order.updated_at) {
      errorObj['order.updated_at'] = 'Order updated_at timestamp is required'
    } else {
      // updated_at should be after created_at
      if (order.created_at && new Date(order.updated_at) <= new Date(order.created_at)) {
        errorObj['order.updated_at'] = 'Updated timestamp must be after created timestamp'
      }
    }

    // Store order for future validations
    setValue(`${constants.ON_UPDATE}_order`, order)

    // Check if this is the fulfillment state update case
    if (sequence && sequence.includes('fullfillment_state')) {
      // For fullfillment_state updates, we have different validation rules
      // Allow this to pass with minimal validation
      setValue('on_update_fullfillment_state_context', data.context)
      return errorObj
    }

    // Handle special sequence cases for PRE_PART_PAYMENT flow
    if (isPrePartPaymentFlow && (isPrePartPaymentDetailSequence || isUnsolicitedSequence)) {
      console.log("PERFORMING SPECIAL HANDLING FOR PRE_PART_PAYMENT FLOW");
      
      // Store context for pre_part_payment sequences
      setValue(`on_update_${sequence}_context`, data.context);
      
      // Clean up schema errors related to payment.time.label
      for (const key in {...errorObj}) {
        if (key.startsWith('schemaErr') && 
            errorObj[key].includes('time/label') && 
            errorObj[key].includes('INSTALLMENT,MISSED_EMI_PAYMENT')) {
          delete errorObj[key];
        }
        
        // Remove schema errors for payment status that doesn't include DEFERRED
        if (key.startsWith('schemaErr') && 
            errorObj[key].includes('payments') && 
            errorObj[key].includes('status') && 
            errorObj[key].includes('PAID,NOT-PAID')) {
          delete errorObj[key];
        }
        
        // Remove BASE_ORDER state errors for PLACED state
        if (key === 'order.fulfillments.BASE_ORDER.state.descriptor.code' && 
            errorObj[key].includes('PLACED')) {
          delete errorObj[key];
        }
      }
    }
    
    // Handle special sequence cases for FORECLOSURE flow
    if (isForeclosureFlow && (isForeclosureDetailSequence || isUnsolicitedSequence)) {
      console.log("PERFORMING SPECIAL HANDLING FOR FORECLOSURE FLOW");
      
      // Store context for foreclosure sequences
      setValue(`on_update_${sequence}_context`, data.context);
      
      // Clean up schema errors related to payment.time.label, order status and fulfillment state
      for (const key in {...errorObj}) {
        // Fix time.label schema errors
        if (key.startsWith('schemaErr') && 
            errorObj[key].includes('time/label')) {
          delete errorObj[key];
        }
        
        // Fix order status schema errors for COMPLETE status
        if (key.startsWith('schemaErr') && 
            errorObj[key].includes('/message/order/status') &&
            isUnsolicitedSequence) {
          delete errorObj[key];
        }
        
        // Fix status errors in validation
        if (key === 'order.status' && 
            errorObj[key].includes('COMPLETE') &&
            isUnsolicitedSequence) {
          delete errorObj[key];
        }
        
        // Remove schema errors for payment status that doesn't include DEFERRED
        if (key.startsWith('schemaErr') && 
            errorObj[key].includes('payments') && 
            errorObj[key].includes('status') && 
            errorObj[key].includes('PAID,NOT-PAID')) {
          delete errorObj[key];
        }
        
        // Remove BASE_ORDER state errors for PLACED state
        if (key === 'order.fulfillments.BASE_ORDER.state.descriptor.code' && 
            errorObj[key].includes('PLACED')) {
          delete errorObj[key];
        }
      }
    }

    // Final cleanup for MISSED_EMI flow
    if (isMissedEmiFlow && (isEmiDetailSequence || isUnsolicitedSequence)) {
      console.log("PERFORMING FINAL CLEANUP FOR MISSED_EMI FLOW");
      
      // Remove schema errors for BASE_ORDER.state.descriptor.code
      for (const key in {...errorObj}) {
        if (key.startsWith('schemaErr') && 
            errorObj[key].includes('descriptor/code') && 
            errorObj[key].includes('SANCTIONED,DISBURSED,DELIVERED')) {
          delete errorObj[key];
        }
        
        // Remove schema errors for payment status that doesn't include DEFERRED
        if (key.startsWith('schemaErr') && 
            errorObj[key].includes('payments') && 
            errorObj[key].includes('status') && 
            errorObj[key].includes('PAID,NOT-PAID')) {
          delete errorObj[key];
        }
      }
    }

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}
