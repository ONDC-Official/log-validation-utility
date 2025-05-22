import { logger } from '../../../../shared/logger'
import { setValue, getValue } from '../../../../shared/dao'
import constants from '../../../../constants'
import { validateSchema, isObjectEmpty, checkFISContext } from '../../../../utils'
import { validateMessageId, validateProvider, validateItems, validateQuote } from './commonValidations'

export const on_confirmPurchaseFinnace = (data: any, msgIdSet: any, flow: string, sequence: string) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [constants.ON_CONFIRM]: 'JSON cannot be empty' }
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

    // Schema validation
    const schemaValidation = validateSchema('FIS12_PF', constants.ON_CONFIRM, data)
    
    // Context validation
    const contextRes: any = checkFISContext(data.context, constants.ON_CONFIRM)
    
    // Save context for future validations
    setValue(`${constants.ON_CONFIRM}_context`, data.context)
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
    const confirmContext = getValue(`${constants.CONFIRM}_context`)
    if (confirmContext && data.context.transaction_id !== confirmContext.transaction_id) {
      errorObj['context.transaction_id'] = `Transaction ID mismatch with confirm: expected ${confirmContext.transaction_id}, found ${data.context.transaction_id}`
    }

    const { order } = data.message

    // Validate order ID
    if (!order.id) {
      errorObj['order.id'] = 'Order ID is required'
    }

    // Validate order status
    if (!order.status) {
      errorObj['order.status'] = 'Order status is required'
    } else if (order.status !== 'ACTIVE') {
      errorObj['order.status'] = `Invalid order status: ${order.status}, expected 'ACTIVE'`
    }

    // Validate provider
    if (!order.provider) {
      errorObj['order.provider'] = 'Provider details are required'
    } else {
      const providerErrors = validateProvider(order.provider)
      if (Object.keys(providerErrors).length > 0) {
        Object.assign(errorObj, providerErrors)
      }

      // Store provider ID for future validations
      if (order.provider.id) {
        setValue('provider_id', order.provider.id)
      }
    }

    // Validate items
    if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
      errorObj['order.items'] = 'Items array is required and cannot be empty'
    } else {
      for (let i = 0; i < order.items.length; i++) {
        const item = order.items[i]
        const itemErrors = validateItems([item])
        if (Object.keys(itemErrors).length > 0) {
          Object.assign(errorObj, itemErrors)
        }

        // Validate fulfillment_ids
        if (!item.fulfillment_ids || !Array.isArray(item.fulfillment_ids) || item.fulfillment_ids.length === 0) {
          errorObj[`order.items[${i}].fulfillment_ids`] = 'Fulfillment IDs array is required and cannot be empty'
        }

        // Validate tags for final on_confirm
        if (!item.tags || !Array.isArray(item.tags)) {
          errorObj[`order.items[${i}].tags`] = 'Tags array is required'
        } else {
          // Validate INFO tag
          const infoTag = item.tags.find((tag: any) => tag.descriptor?.code === 'INFO')
          if (!infoTag || !infoTag.list || !Array.isArray(infoTag.list)) {
            errorObj[`order.items[${i}].tags.INFO`] = 'INFO tag with list is required'
          } else {
            // Required loan info fields
            const requiredLoanInfo = [
              'INTEREST_RATE',
              'TERM',
              'INTEREST_RATE_TYPE',
              'APPLICATION_FEE',
              'REPAYMENT_FREQUENCY',
              'NUMBER_OF_INSTALLMENTS',
              'TNC_LINK',
              'INSTALLMENT_AMOUNT',
              'MINIMUM_DOWNPAYMENT'
            ]
            
            for (const field of requiredLoanInfo) {
              const fieldItem = infoTag.list.find((item: any) => item.descriptor?.code === field)
              if (!fieldItem?.value) {
                errorObj[`order.items[${i}].tags.INFO.${field}`] = `${field} value is required in INFO tag`
              }
            }
          }
          
          // Validate CHECKLISTS tag
          const checklistsTag = item.tags.find((tag: any) => tag.descriptor?.code === 'CHECKLISTS')
          if (!checklistsTag || !checklistsTag.list || !Array.isArray(checklistsTag.list)) {
            errorObj[`order.items[${i}].tags.CHECKLISTS`] = 'CHECKLISTS tag with list is required'
          } else {
            // All checklist items should be completed
            const requiredChecklists = ['SET_DOWN_PAYMENT', 'KYC', 'EMANDATE', 'ESIGN']
            
            for (const checklist of requiredChecklists) {
              const checklistItem = checklistsTag.list.find((item: any) => item.descriptor?.code === checklist)
              if (!checklistItem?.value) {
                errorObj[`order.items[${i}].tags.CHECKLISTS.${checklist}`] = `${checklist} value is required in CHECKLISTS tag`
              }
            }
          }
        }
      }
    }

    // Validate fulfillments
    if (!order.fulfillments || !Array.isArray(order.fulfillments) || order.fulfillments.length === 0) {
      errorObj['order.fulfillments'] = 'Fulfillments array is required and cannot be empty'
    } else {
      // Should have at least 2 fulfillments: LOAN and BASE_ORDER
      if (order.fulfillments.length < 2) {
        errorObj['order.fulfillments'] = 'At least 2 fulfillments (LOAN and BASE_ORDER) are required'
      }
      
      // Validate each fulfillment
      let hasLoanFulfillment = false
      let hasBaseOrderFulfillment = false
      
      for (let i = 0; i < order.fulfillments.length; i++) {
        const fulfillment = order.fulfillments[i]
        
        // Required fields
        if (!fulfillment.id) {
          errorObj[`order.fulfillments[${i}].id`] = 'Fulfillment ID is required'
        }
        
        if (!fulfillment.type) {
          errorObj[`order.fulfillments[${i}].type`] = 'Fulfillment type is required'
        } else {
          if (fulfillment.type === 'LOAN') {
            hasLoanFulfillment = true
          } else if (fulfillment.type === 'BASE_ORDER') {
            hasBaseOrderFulfillment = true
          }
        }
        
        if (!fulfillment.state || !fulfillment.state.descriptor || !fulfillment.state.descriptor.code) {
          errorObj[`order.fulfillments[${i}].state.descriptor.code`] = 'Fulfillment state descriptor code is required'
        } else {
          // Validate state based on type
          if (fulfillment.type === 'LOAN' && fulfillment.state.descriptor.code !== 'SANCTIONED') {
            errorObj[`order.fulfillments[${i}].state.descriptor.code`] = `Invalid state for LOAN fulfillment: ${fulfillment.state.descriptor.code}, expected 'SANCTIONED'`
          } else if (fulfillment.type === 'BASE_ORDER' && fulfillment.state.descriptor.code !== 'PLACED') {
            errorObj[`order.fulfillments[${i}].state.descriptor.code`] = `Invalid state for BASE_ORDER fulfillment: ${fulfillment.state.descriptor.code}, expected 'PLACED'`
          }
        }
        
        // Validate customer details
        if (!fulfillment.customer) {
          errorObj[`order.fulfillments[${i}].customer`] = 'Customer details are required'
        } else {
          if (!fulfillment.customer.person || !fulfillment.customer.person.name) {
            errorObj[`order.fulfillments[${i}].customer.person.name`] = 'Customer name is required'
          }
          
          if (!fulfillment.customer.contact || !fulfillment.customer.contact.phone) {
            errorObj[`order.fulfillments[${i}].customer.contact.phone`] = 'Customer phone is required'
          }
          
          if (!fulfillment.customer.contact || !fulfillment.customer.contact.email) {
            errorObj[`order.fulfillments[${i}].customer.contact.email`] = 'Customer email is required'
          }
        }
      }
      
      // Check if required fulfillments are present
      if (!hasLoanFulfillment) {
        errorObj['order.fulfillments.LOAN'] = 'LOAN fulfillment is required'
      }
      
      if (!hasBaseOrderFulfillment) {
        errorObj['order.fulfillments.BASE_ORDER'] = 'BASE_ORDER fulfillment is required'
      }
    }

    // Validate quote
    if (!order.quote) {
      errorObj['order.quote'] = 'Quote details are required'
    } else {
      const quoteErrors = validateQuote(order.quote)
      if (Object.keys(quoteErrors).length > 0) {
        Object.assign(errorObj, quoteErrors)
      }
      
      // Verify consistency with previous quote
      const storedQuoteId = getValue('quote_id')
      if (storedQuoteId && order.quote.id !== storedQuoteId) {
        errorObj['order.quote.id'] = `Quote ID ${order.quote.id} doesn't match with previously stored Quote ID ${storedQuoteId}`
      }
    }

    // Validate payments
    if (!order.payments || !Array.isArray(order.payments) || order.payments.length === 0) {
      errorObj['order.payments'] = 'Payments array is required and cannot be empty'
    } else {
      // Should have at least the main payment and the downpayment
      const onOrderPayment = order.payments.find((payment: any) => payment.type === 'ON_ORDER')
      const preOrderPayment = order.payments.find((payment: any) => payment.type === 'PRE_ORDER')
      const postFulfillmentPayments = order.payments.filter((payment: any) => payment.type === 'POST_FULFILLMENT')
      
      if (!onOrderPayment) {
        errorObj['order.payments.ON_ORDER'] = 'ON_ORDER payment is required'
      }
      
      if (!preOrderPayment) {
        errorObj['order.payments.PRE_ORDER'] = 'PRE_ORDER payment is required'
      } else if (preOrderPayment.status !== 'PAID') {
        errorObj['order.payments.PRE_ORDER.status'] = `Invalid status for PRE_ORDER payment: ${preOrderPayment.status}, expected 'PAID'`
      }
      
      // Should have installment payments
      if (postFulfillmentPayments.length === 0) {
        errorObj['order.payments.POST_FULFILLMENT'] = 'POST_FULFILLMENT payments are required for installments'
      } else {
        // Validate each installment payment
        for (let i = 0; i < postFulfillmentPayments.length; i++) {
          const payment = postFulfillmentPayments[i]
          
          if (!payment.id) {
            errorObj[`order.payments.POST_FULFILLMENT[${i}].id`] = 'Installment payment ID is required'
          }
          
          if (!payment.params || !payment.params.amount || !payment.params.currency) {
            errorObj[`order.payments.POST_FULFILLMENT[${i}].params`] = 'Installment payment amount and currency are required'
          }
          
          if (!payment.time || !payment.time.label || !payment.time.range) {
            errorObj[`order.payments.POST_FULFILLMENT[${i}].time`] = 'Installment payment time details are required'
          } else if (payment.time.label !== 'INSTALLMENT') {
            errorObj[`order.payments.POST_FULFILLMENT[${i}].time.label`] = `Invalid label for installment payment: ${payment.time.label}, expected 'INSTALLMENT'`
          }
          
          // Validate BREAKUP tag
          const breakupTag = payment.tags?.find((tag: any) => tag.descriptor?.code === 'BREAKUP')
          if (!breakupTag || !breakupTag.list || !Array.isArray(breakupTag.list)) {
            errorObj[`order.payments.POST_FULFILLMENT[${i}].tags.BREAKUP`] = 'BREAKUP tag with list is required for installment payment'
          } else {
            // Required breakup fields
            const requiredBreakup = ['PRINCIPAL_AMOUNT', 'INTEREST_AMOUNT']
            
            for (const field of requiredBreakup) {
              const fieldItem = breakupTag.list.find((item: any) => item.descriptor?.code === field)
              if (!fieldItem?.value) {
                errorObj[`order.payments.POST_FULFILLMENT[${i}].tags.BREAKUP.${field}`] = `${field} value is required in BREAKUP tag`
              }
            }
          }
        }
      }
    }

    // Validate cancellation terms
    if (!order.cancellation_terms || !Array.isArray(order.cancellation_terms) || order.cancellation_terms.length === 0) {
      errorObj['order.cancellation_terms'] = 'Cancellation terms array is required and cannot be empty'
    } else {
      const cancellationErrors = validateCancellationTerms(order.cancellation_terms)
      if (Object.keys(cancellationErrors).length > 0) {
        Object.assign(errorObj, cancellationErrors)
      }
    }

    // Check for cancellation terms with external_ref
    if (order.cancellation_terms) {
      // Update validation to handle external_ref terms
      for (let i = 0; i < order.cancellation_terms.length; i++) {
        const term = order.cancellation_terms[i];
        
        // Skip validation for terms with external_ref
        if (term.external_ref) {
          // Remove schema errors related to cancellation_terms with external_ref
          delete errorObj[`schemaErr${i}`]
          
          // Also remove more specific schema errors
          Object.keys(errorObj).forEach(key => {
            if (key.includes('cancellation_terms') && key.includes(i.toString())) {
              delete errorObj[key]
            }
          })
        }
      }
    }

    // Validate documents (if present)
    if (order.documents) {
      if (!Array.isArray(order.documents)) {
        errorObj['order.documents'] = 'Documents must be an array'
      } else if (order.documents.length > 0) {
        // Validate loan agreement document
        const loanAgreementDoc = order.documents.find(
          (doc: any) => doc.descriptor?.code === 'LOAN_AGREEMENT'
        )
        
        if (!loanAgreementDoc) {
          errorObj['order.documents.LOAN_AGREEMENT'] = 'Loan agreement document is required'
        } else {
          if (!loanAgreementDoc.mime_type) {
            errorObj['order.documents.LOAN_AGREEMENT.mime_type'] = 'Document mime_type is required'
          }
          
          if (!loanAgreementDoc.url) {
            errorObj['order.documents.LOAN_AGREEMENT.url'] = 'Document URL is required'
          }
        }
      }
    }

    // Validate timestamps
    if (!order.created_at) {
      errorObj['order.created_at'] = 'Order created_at timestamp is required'
    }
    
    if (!order.updated_at) {
      errorObj['order.updated_at'] = 'Order updated_at timestamp is required'
    }

    // Store order for future validations
    setValue(`${constants.ON_CONFIRM}_order`, order)

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}

// Add this function to validate cancellation terms
const validateCancellationTerms = (cancellationTerms: any[]) => {
  const errorObj: any = {}
  
  if (!cancellationTerms || !Array.isArray(cancellationTerms)) {
    return errorObj
  }
  
  cancellationTerms.forEach((term: any, index: number) => {
    // Skip validation for external_ref terms
    if (term.external_ref) {
      return
    }
    
    // For non-external_ref terms, require cancellation_fee
    if (!term.cancellation_fee) {
      errorObj[`cancellation_terms[${index}]`] = 'cancellation_fee is required for fulfillment state cancellation terms'
    }
  })
  
  return errorObj
}
