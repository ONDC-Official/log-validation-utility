import { logger } from '../../../../shared/logger'
import { setValue, getValue } from '../../../../shared/dao'
import constants from '../../../../constants'
import { validateSchema, isObjectEmpty, checkFISContext } from '../../../../utils'
import { validateContext, validateMessageId, validateOrderConsistency } from './commonValidations'

export const confirmPurchaseFinnace = (data: any, msgIdSet: any, flow: string, sequence: string) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [constants.CONFIRM]: 'JSON cannot be empty' }
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
    const schemaValidation = validateSchema('FIS12_PF', constants.CONFIRM, data)
    
    // Context validation
    const contextRes: any = checkFISContext(data.context, constants.CONFIRM)
    
    // Save context for future validations
    setValue(`${constants.CONFIRM}_context`, data.context)
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
    const contextValidation = validateContext(data.context, constants.CONFIRM)
    if (Object.keys(contextValidation).length > 0) {
      Object.assign(errorObj, contextValidation)
    }

    const { order } = data.message

    // Order consistency validation with init
    const initOrder = getValue(`${constants.INIT}_order`)
    if (initOrder) {
      const orderConsistencyErrors = validateOrderConsistency(order, constants.INIT)
      if (Object.keys(orderConsistencyErrors).length > 0) {
        Object.assign(errorObj, orderConsistencyErrors)
      }
    }

    // Validate provider
    if (!order.provider || !order.provider.id) {
      errorObj['order.provider.id'] = 'Provider ID is required'
    } else {
      // Validate provider consistency
      const storedProviderId = getValue('provider_id')
      if (storedProviderId && order.provider.id !== storedProviderId) {
        errorObj['order.provider.id'] = `Provider ID ${order.provider.id} doesn't match with stored provider ID ${storedProviderId}`
      }
    }

    // Validate items
    if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
      errorObj['order.items'] = 'Items array is required and cannot be empty'
    } else {
      const item = order.items[0]
      if (!item.id) {
        errorObj['order.items.id'] = 'Item ID is required'
      } else {
        // Validate item consistency
        const storedItemId = getValue('item_id')
        if (storedItemId && item.id !== storedItemId) {
          errorObj['order.items.id'] = `Item ID ${item.id} doesn't match with stored item ID ${storedItemId}`
        }
      }
    }

    // Validate payments
    if (!order.payments || !Array.isArray(order.payments) || order.payments.length === 0) {
      errorObj['order.payments'] = 'Payments array is required and cannot be empty'
    } else {
      // Validate each payment
      order.payments.forEach((payment:any, index:any) => {
        if (!payment.id) {
          errorObj[`order.payments[${index}].id`] = 'Payment ID is required'
        }
        
        if (!payment.type) {
          errorObj[`order.payments[${index}].type`] = 'Payment type is required'
        }
        
        if (!payment.collected_by) {
          errorObj[`order.payments[${index}].collected_by`] = 'Payment collected_by is required'
        }
        
        if (!payment.status) {
          errorObj[`order.payments[${index}].status`] = 'Payment status is required'
        }
        
        // Validate payment-specific fields
        if (payment.type === 'PRE_ORDER') {
          if (payment.status !== 'PAID') {
            errorObj[`order.payments[${index}].status`] = 'PRE_ORDER payment status must be PAID for confirm'
          }
          
          if (!payment.params?.transaction_id) {
            errorObj[`order.payments[${index}].params.transaction_id`] = 'Transaction ID is required for PAID payment'
          }
        }
        
        // Validate payment tags
        if (payment.tags && Array.isArray(payment.tags)) {
          // Check for BPP_TERMS and BAP_TERMS tags
          const bppTermsTag = payment.tags.find((tag: any) => tag.descriptor?.code === 'BPP_TERMS')
          const bapTermsTag = payment.tags.find((tag: any) => tag.descriptor?.code === 'BAP_TERMS')
          
          if (bppTermsTag && bppTermsTag.list) {
            const requiredBppTerms = [
              'BUYER_FINDER_FEES_TYPE',
              'BUYER_FINDER_FEES_PERCENTAGE',
              'SETTLEMENT_WINDOW',
              'SETTLEMENT_BASIS',
              'MANDATORY_ARBITRATION',
              'COURT_JURISDICTION',
              'STATIC_TERMS',
              'SETTLEMENT_AMOUNT',
              'OFFLINE_CONTRACT'
            ]
            
            for (const term of requiredBppTerms) {
              const termItem = bppTermsTag.list.find((item: any) => item.descriptor?.code === term)
              if (!termItem?.value) {
                errorObj[`order.payments[${index}].tags.BPP_TERMS.${term}`] = `${term} value is required in BPP_TERMS tag`
              }
            }
          }
          
          if (bapTermsTag && bapTermsTag.list) {
            const requiredBapTerms = [
              'BUYER_FINDER_FEES_TYPE',
              'BUYER_FINDER_FEES_PERCENTAGE',
              'SETTLEMENT_AMOUNT',
              'SETTLEMENT_TYPE',
              'DELAY_INTEREST',
              'STATIC_TERMS',
              'OFFLINE_CONTRACT'
            ]
            
            for (const term of requiredBapTerms) {
              const termItem = bapTermsTag.list.find((item: any) => item.descriptor?.code === term)
              if (!termItem?.value) {
                errorObj[`order.payments[${index}].tags.BAP_TERMS.${term}`] = `${term} value is required in BAP_TERMS tag`
              }
            }
          }
        }
      })
    }

    // Store order for future validations
    setValue(`${constants.CONFIRM}_order`, order)

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}
