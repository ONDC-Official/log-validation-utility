import { getValue } from '../../../../shared/dao'

export const validateContext = (context: any, action: string) => {
  const errorObj: any = {}
  
  if (context.domain !== 'ONDC:FIS12') {
    errorObj['context.domain'] = 'Domain must be ONDC:FIS12'
  }

  if (context.action !== action) {
    errorObj['context.action'] = `Action must be ${action}`
  }

  // Validate transaction_id against previous context
  const storedContext = getValue(`${action}_context`)
  if (storedContext && storedContext.transaction_id !== context.transaction_id) {
    errorObj['context.transaction_id'] = `Transaction ID mismatch: expected ${storedContext.transaction_id}, found ${context.transaction_id}`
  }

  return errorObj
}

export const validateProvider = (provider: any) => {
  const errorObj: any = {}
  
  if (!provider) {
    errorObj['provider'] = 'Provider details are required'
    return errorObj
  }

  if (!provider.id) {
    errorObj['provider.id'] = 'Provider ID is required'
  }

  if (!provider.locations?.[0]?.id) {
    errorObj['provider.locations'] = 'Provider location ID is required'
  }

  return errorObj
}

export const validateItems = (items: any[]) => {
  const errorObj: any = {}
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    errorObj['items'] = 'Items array is required and cannot be empty'
    return errorObj
  }

  const item = items[0]
  if (!item.id) {
    errorObj['items.id'] = 'Item ID is required'
  }
  if (!item.quantity?.count) {
    errorObj['items.quantity'] = 'Item quantity count is required'
  }

  return errorObj
}

export const validateFulfillments = (fulfillments: any[]) => {
  const errorObj: any = {}
  
  if (!fulfillments || !Array.isArray(fulfillments) || fulfillments.length === 0) {
    errorObj['fulfillments'] = 'Fulfillments array is required and cannot be empty'
    return errorObj
  }

  const fulfillment = fulfillments[0]
  if (!fulfillment.id) {
    errorObj['fulfillments.id'] = 'Fulfillment ID is required'
  }
  if (!fulfillment.type) {
    errorObj['fulfillments.type'] = 'Fulfillment type is required'
  }
  if (!fulfillment.customer?.person?.name) {
    errorObj['fulfillments.customer.person'] = 'Customer name is required'
  }
  if (!fulfillment.customer?.contact?.phone) {
    errorObj['fulfillments.customer.contact'] = 'Customer phone is required'
  }

  return errorObj
}

export const validatePayment = (payment: any) => {
  const errorObj: any = {}
  
  if (!payment) {
    errorObj['payment'] = 'Payment details are required'
    return errorObj
  }

  if (!payment.type) {
    errorObj['payment.type'] = 'Payment type is required'
  }
  if (!payment.collected_by) {
    errorObj['payment.collected_by'] = 'Payment collected_by is required'
  }

  return errorObj
}

export const validateLoanTags = (tags: any[]) => {
  const errorObj: any = {}
  
  if (!tags || !Array.isArray(tags)) {
    errorObj['tags'] = 'Tags array is required'
    return errorObj
  }

  const loanDetailsTag = tags.find((tag: any) => tag.descriptor?.code === 'LOAN_DETAILS')
  if (!loanDetailsTag || !loanDetailsTag.list) {
    errorObj['tags.LOAN_DETAILS'] = 'LOAN_DETAILS tag with list is required'
    return errorObj
  }

  const loanAmountTag = loanDetailsTag.list.find((item: any) => item.descriptor?.code === 'LOAN_AMOUNT')
  if (!loanAmountTag?.value) {
    errorObj['tags.LOAN_AMOUNT'] = 'LOAN_AMOUNT value is required'
  }

  const loanTenureTag = loanDetailsTag.list.find((item: any) => item.descriptor?.code === 'LOAN_TENURE')
  if (!loanTenureTag?.value) {
    errorObj['tags.LOAN_TENURE'] = 'LOAN_TENURE value is required'
  }

  return errorObj
}

export const validateMessageId = (context: any, msgIdSet: Set<string>) => {
  const errorObj: any = {}
  
  if (msgIdSet.has(context.message_id)) {
    errorObj['context.message_id'] = 'Message ID must be unique'
  }

  return errorObj
} 