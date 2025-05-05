import { getValue, setValue } from '../../../../shared/dao'

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

export const validateLoanInfo = (tags: any[]) => {
  const errorObj: any = {}
  
  if (!tags || !Array.isArray(tags)) {
    errorObj['tags'] = 'Tags array is required'
    return errorObj
  }

  const infoTag = tags.find((tag: any) => tag.descriptor?.code === 'INFO')
  if (!infoTag || !infoTag.list) {
    errorObj['tags.INFO'] = 'INFO tag with list is required'
    return errorObj
  }

  const requiredFields = [
    'WORKING_CAPITAL_LIMIT',
    'INTEREST_RATE',
    'PROCESSING_FEE',
    'TERM',
    'REPAYMENT_FREQUENCY',
    'RATE_ANNUALISED_PENAL_CHARGES'
  ]

  for (const field of requiredFields) {
    const fieldTag = infoTag.list.find((item: any) => item.descriptor?.code === field)
    if (!fieldTag?.value) {
      errorObj[`tags.INFO.${field}`] = `${field} value is required`
    }
  }

  return errorObj
}

export const validateChecklists = (tags: any[]) => {
  const errorObj: any = {}
  
  if (!tags || !Array.isArray(tags)) {
    errorObj['tags'] = 'Tags array is required'
    return errorObj
  }

  const checklistsTag = tags.find((tag: any) => tag.descriptor?.code === 'CHECKLISTS')
  if (!checklistsTag || !checklistsTag.list) {
    errorObj['tags.CHECKLISTS'] = 'CHECKLISTS tag with list is required'
    return errorObj
  }

  const requiredChecklists = [
    'INDIVIDUAL_KYC',
    'BUSINESS_KYC',
    'PERSONAL_DISCUSSION',
    'PHYSICAL_VERIFICATION',
    'ENACH',
    'PROCESSING_FEE',
    'ESIGN'
  ]

  for (const checklist of requiredChecklists) {
    const checklistTag = checklistsTag.list.find((item: any) => item.descriptor?.code === checklist)
    if (!checklistTag?.value) {
      errorObj[`tags.CHECKLISTS.${checklist}`] = `${checklist} status is required`
    }
  }

  return errorObj
}

export const validateQuote = (quote: any) => {
  const errorObj: any = {}
  
  if (!quote) {
    errorObj['quote'] = 'Quote details are required'
    return errorObj
  }

  if (!quote.id) {
    errorObj['quote.id'] = 'Quote ID is required'
  }

  if (!quote.price?.value) {
    errorObj['quote.price.value'] = 'Quote price value is required'
  }

  if (!quote.price?.currency) {
    errorObj['quote.price.currency'] = 'Quote price currency is required'
  }

  if (!quote.breakup || !Array.isArray(quote.breakup) || quote.breakup.length === 0) {
    errorObj['quote.breakup'] = 'Quote breakup array is required and cannot be empty'
  }

  return errorObj
}

export const validateXInput = (xinput: any) => {
  const errorObj: any = {}
  
  if (!xinput) {
    errorObj['xinput'] = 'XInput details are required'
    return errorObj
  }

  if (!xinput.head?.descriptor?.name) {
    errorObj['xinput.head.descriptor.name'] = 'XInput head descriptor name is required'
  }

  if (!xinput.form?.id) {
    errorObj['xinput.form.id'] = 'XInput form ID is required'
  }

  if (!xinput.form?.url) {
    errorObj['xinput.form.url'] = 'XInput form URL is required'
  }

  return errorObj
}

export const validateFormResponse = (formResponse: any) => {
  const errorObj: any = {}
  
  if (!formResponse) {
    errorObj['form_response'] = 'Form response details are required'
    return errorObj
  }

  if (!formResponse.status) {
    errorObj['form_response.status'] = 'Form response status is required'
  }

  if (!formResponse.submission_id) {
    errorObj['form_response.submission_id'] = 'Form response submission ID is required'
  }

  return errorObj
}

export const validateCreditLineAssignment = (tags: any[]) => {
  const errorObj: any = {}
  
  if (!tags || !Array.isArray(tags)) {
    errorObj['tags'] = 'Tags array is required'
    return errorObj
  }

  const assignmentTag = tags.find((tag: any) => tag.descriptor?.code === 'CREDIT_LINE_ASSIGNMENT')
  if (!assignmentTag || !assignmentTag.list) {
    errorObj['tags.CREDIT_LINE_ASSIGNMENT'] = 'CREDIT_LINE_ASSIGNMENT tag with list is required'
    return errorObj
  }

  const requiredFields = [
    'ASSIGNMENT_STATUS',
    'ASSIGNMENT_DATE',
    'CREDIT_LINE_AMOUNT',
    'AVAILABLE_CREDIT',
    'UTILIZED_CREDIT',
    'INTEREST_RATE',
    'REPAYMENT_TERM'
  ]

  for (const field of requiredFields) {
    const fieldTag = assignmentTag.list.find((item: any) => item.descriptor?.code === field)
    if (!fieldTag?.value) {
      errorObj[`tags.CREDIT_LINE_ASSIGNMENT.${field}`] = `${field} value is required`
    }
  }

  return errorObj
}

export const validateRepaymentSchedule = (tags: any[]) => {
  const errorObj: any = {}
  
  if (!tags || !Array.isArray(tags)) {
    errorObj['tags'] = 'Tags array is required'
    return errorObj
  }

  const scheduleTag = tags.find((tag: any) => tag.descriptor?.code === 'REPAYMENT_SCHEDULE')
  if (!scheduleTag || !scheduleTag.list) {
    errorObj['tags.REPAYMENT_SCHEDULE'] = 'REPAYMENT_SCHEDULE tag with list is required'
    return errorObj
  }

  const requiredFields = [
    'TOTAL_AMOUNT',
    'NUMBER_OF_INSTALLMENTS',
    'INSTALLMENT_AMOUNT',
    'FIRST_INSTALLMENT_DATE',
    'LAST_INSTALLMENT_DATE'
  ]

  for (const field of requiredFields) {
    const fieldTag = scheduleTag.list.find((item: any) => item.descriptor?.code === field)
    if (!fieldTag?.value) {
      errorObj[`tags.REPAYMENT_SCHEDULE.${field}`] = `${field} value is required`
    }
  }

  return errorObj
} 

export const validateCancellationDetails = (message: any) => {
  const errorObj: any = {}
  
  if (!message.cancellation_reason_id) {
    errorObj['cancellation_reason_id'] = 'Cancellation reason ID is required'
  }
  
  if (!message.descriptor?.short_desc) {
    errorObj['descriptor.short_desc'] = 'Cancellation description is required'
  }
  
  if (!message.order_id) {
    errorObj['order_id'] = 'Order ID is required for cancellation'
  }
  
  return errorObj
}

export const validateCancellationResponse = (order: any) => {
  const errorObj: any = {}
  
  if (!order.id) {
    errorObj['order.id'] = 'Order ID is required in cancellation response'
  }
  
  if (!order.status) {
    errorObj['order.status'] = 'Order status is required in cancellation response'
  } else {
    // For cancellation flow, status should be either ACTIVE (before cancellation) or CANCELLED (after cancellation)
    const validStatuses = ['ACTIVE', 'CANCELLED']
    if (!validStatuses.includes(order.status)) {
      errorObj['order.status'] = `Order status must be one of: ${validStatuses.join(', ')}`
    }
  }
  
  return errorObj
}

export const validateOrderConsistency = (currentOrder: any, previousAction: string) => {
  const errorObj: any = {}
  
  // Get previously stored order details
  const previousOrder = getValue(`${previousAction}_order`)
  if (!previousOrder) {
    return errorObj // Skip consistency check if no previous order data
  }
  
  // Check order ID consistency
  if (previousOrder.id !== currentOrder.id) {
    errorObj['order.id.consistency'] = `Order ID mismatch: expected ${previousOrder.id}, found ${currentOrder.id}`
  }
  
  // Check provider ID consistency
  if (previousOrder.provider?.id !== currentOrder.provider?.id) {
    errorObj['provider.id.consistency'] = `Provider ID mismatch: expected ${previousOrder.provider?.id}, found ${currentOrder.provider?.id}`
  }
  
  return errorObj
}

export const validateTransactionConsistency = (context: any) => {
  const errorObj: any = {}
  
  // Get previously stored transaction ID
  const previousContext = getValue('first_context')
  if (!previousContext) {
    setValue('first_context', context) // Store first context for future validations
    return errorObj
  }
  
  // Check transaction ID consistency across the flow
  if (previousContext.transaction_id !== context.transaction_id) {
    errorObj['context.transaction_id.consistency'] = `Transaction ID mismatch: expected ${previousContext.transaction_id}, found ${context.transaction_id}`
  }
  
  return errorObj
}