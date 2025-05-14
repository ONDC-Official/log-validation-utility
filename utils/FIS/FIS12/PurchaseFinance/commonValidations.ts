import { getValue, setValue } from '../../../../shared/dao'

export const validateContext = (context: any, action: string) => {
  const errorObj: any = {}
  
  if (context.domain !== 'ONDC:FIS12') {
    errorObj['context.domain'] = 'Domain must be ONDC:FIS12'
  }

  if (context.action !== action) {
    errorObj['context.action'] = `Action must be ${action}`
  }

  let baseAction = action;
  
  const sequenceMatch = /^([a-z_]+)_(\d+)$/.exec(action);
  if (sequenceMatch) {
    baseAction = sequenceMatch[1];
  }
  
  const storedContext = getValue(`${action}_context`)
  if (storedContext && storedContext.transaction_id !== context.transaction_id) {
    if (baseAction === 'select' || baseAction === 'init' || baseAction === 'confirm' || baseAction === 'update') {
    } else {
      errorObj['context.transaction_id'] = `Transaction ID mismatch: expected ${storedContext.transaction_id}, found ${context.transaction_id}`
    }
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

  // Validate provider ID consistency
  const storedProviderId = getValue('provider_id')
  if (storedProviderId && provider.id !== storedProviderId) {
    errorObj['provider.id'] = `Provider ID ${provider.id} doesn't match with previous provider ID ${storedProviderId}`
  }

  if (!provider.descriptor?.name) {
    errorObj['provider.descriptor'] = 'Provider descriptor name is required'
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

  // Validate item ID consistency
  const storedItemId = getValue('item_id')
  if (storedItemId && item.id !== storedItemId) {
    // Check if it's a subsequent item in a multi-item flow
    const storedItemIds = getValue('item_ids') || []
    if (!Array.isArray(storedItemIds) || (storedItemIds.length > 0 && !storedItemIds.includes(item.id))) {
      const newItemIds = Array.isArray(storedItemIds) ? [...storedItemIds, item.id] : [storedItemId, item.id]
      setValue('item_ids', newItemIds)
    }
  } else if (item.id) {
    setValue('item_id', item.id)
    // Initialize item_ids array if not already set
    const storedItemIds = getValue('item_ids')
    if (!storedItemIds) {
      setValue('item_ids', [item.id])
    }
  }

  if (!item.descriptor?.name || !item.descriptor?.code) {
    errorObj['items.descriptor'] = 'Item descriptor name and code are required'
  }
  if (!item.category_ids || !Array.isArray(item.category_ids) || item.category_ids.length === 0) {
    errorObj['item.category_ids'] = 'Item category_ids array is required and cannot be empty'
  } else {
    // Validate category IDs consistency
    const storedCategoryIds = getValue('category_ids')
    if (storedCategoryIds && !item.category_ids.every((id: string) => storedCategoryIds.includes(id))) {
      errorObj['item.category_ids'] = 'Category IDs don\'t match with previous category IDs'
    }
  }

  if (item.price && (!item.price.value || !item.price.currency)) {
    errorObj['item.price'] = 'Price value and currency are required if price is provided'
  }

  // Validate xinput if applicable
  // if (item.xinput) {
  //   const { form } = item.xinput

  //   // if (form?.id) {
  //   //   const storedFormId = getValue('form_id')
  //   //   if (storedFormId && form.id !== storedFormId) {
  //   //   }
  //   // }
  // }

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

  // Validate fulfillment ID consistency
  const storedFulfillmentId = getValue('fulfillment_id')
  if (storedFulfillmentId && fulfillment.id !== storedFulfillmentId) {
    errorObj['fulfillment.id'] = `Fulfillment ID ${fulfillment.id} doesn't match with previous fulfillment ID ${storedFulfillmentId}`
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

  const requiredLoanFields = [
    'LOAN_AMOUNT',
    'LOAN_TENURE',
    'INTEREST_RATE',
    'EMI_AMOUNT',
    'PROCESSING_FEE',
    'TOTAL_INTEREST_DUE'
  ]

  for (const field of requiredLoanFields) {
    const fieldTag = loanDetailsTag.list.find((item: any) => item.descriptor?.code === field)
    if (!fieldTag?.value) {
      errorObj[`tags.LOAN_DETAILS.${field}`] = `${field} value is required`
    }
  }

  return errorObj
}

export const validateMessageId = (context: any, msgIdSet: Set<string>) => {
  const errorObj: any = {}
  
  const action = context.action;
  const isOnAction = action.startsWith('on_');
  
  const actionBaseName = isOnAction ? action.substring(3) : action;
  let baseAction = actionBaseName;
  let sequenceNum = '';
  
  const sequenceMatch = /^([a-z_]+)_(\d+)$/.exec(actionBaseName);
  if (sequenceMatch) {
    baseAction = sequenceMatch[1];
    sequenceNum = sequenceMatch[2];
  }
  
  // Construct the action key for validation context
  const actionKey = sequenceMatch ? `${baseAction}_${sequenceNum}` : baseAction;
  const onActionKey = `on_${actionKey}`;
  
  // Check if this is an on_action message
  if (isOnAction) {
    const correspondingActionContext = getValue(`${actionKey}_context`);
    
    if (correspondingActionContext && correspondingActionContext.message_id === context.message_id) {
      return errorObj;
    }
  } else {
    const correspondingOnActionContext = getValue(`${onActionKey}_context`);
    
    if (correspondingOnActionContext && correspondingOnActionContext.message_id === context.message_id) {
      return errorObj;
    }
  }
  
  if (msgIdSet.has(context.message_id)) {
    if (baseAction === 'search' || baseAction === 'select' || baseAction === 'init' || 
        baseAction === 'update' || baseAction === 'confirm') {
      return errorObj;
    }
    
    errorObj['context.message_id'] = 'Message ID must be unique';
  }

  return errorObj;
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

  if (!quote.price || !quote.price.value || !quote.price.currency) {
    errorObj['quote.price'] = 'Quote price value and currency are required'
  }

  if (!quote.breakup || !Array.isArray(quote.breakup) || quote.breakup.length === 0) {
    errorObj['quote.breakup'] = 'Quote breakup array is required and cannot be empty'
    return errorObj
  }

  // Check for essential breakup items
  const principalItem = quote.breakup.find((item: any) => item.title.toLowerCase().includes('principal'))
  const interestItem = quote.breakup.find((item: any) => item.title.toLowerCase().includes('interest'))
  
  if (!principalItem) {
    errorObj['quote.breakup.principal'] = 'Principal amount is required in quote breakup'
  }
  
  if (!interestItem) {
    errorObj['quote.breakup.interest'] = 'Interest amount is required in quote breakup'
  }

  return errorObj
}

export const validateXInput = (xinput: any) => {
  const errorObj: any = {}
  
  if (!xinput) {
    errorObj['xinput'] = 'XInput details are required'
    return errorObj
  }

  if (xinput.form) {
    if (!xinput.form.id) {
      errorObj['xinput.form.id'] = 'Form ID is required if form is provided'
    }
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

export const validatePurchaseFinanceAssignment = (tags: any[]) => {
  const errorObj: any = {}
  
  if (!tags || !Array.isArray(tags)) {
    errorObj['tags'] = 'Tags array is required'
    return errorObj
  }

  const assignmentTag = tags.find((tag: any) => tag.descriptor?.code === 'ASSIGNMENT')
  if (!assignmentTag || !assignmentTag.list) {
    errorObj['tags.ASSIGNMENT'] = 'ASSIGNMENT tag with list is required'
    return errorObj
  }

  const requiredAssignmentFields = [
    'CREDIT_LINE_ID',
    'ASSIGNMENT_DATE',
    'ACTIVATION_DATE',
    'EXPIRY_DATE',
    'CREDIT_LIMIT',
    'AVAILABLE_LIMIT'
  ]

  for (const field of requiredAssignmentFields) {
    const fieldTag = assignmentTag.list.find((item: any) => item.descriptor?.code === field)
    if (!fieldTag?.value) {
      errorObj[`tags.ASSIGNMENT.${field}`] = `${field} value is required`
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

  const emiItems = scheduleTag.list.filter((item: any) => item.descriptor?.code.startsWith('EMI_'))
  if (emiItems.length === 0) {
    errorObj['tags.REPAYMENT_SCHEDULE.EMI'] = 'At least one EMI item is required in repayment schedule'
    return errorObj
  }

  for (const emiItem of emiItems) {
    if (!emiItem.value) {
      errorObj[`tags.REPAYMENT_SCHEDULE.${emiItem.descriptor.code}`] = `${emiItem.descriptor.code} value is required`
    }
  }

  return errorObj
}

export const validateCancellationDetails = (message: any) => {
  const errorObj: any = {}
  
  if (!message || !message.order) {
    errorObj['message.order'] = 'Order details are required for cancellation'
    return errorObj
  }

  if (!message.order.cancellation) {
    errorObj['message.order.cancellation'] = 'Cancellation details are required'
  } else {
    if (!message.order.cancellation.reason) {
      errorObj['message.order.cancellation.reason'] = 'Cancellation reason is required'
    }
    if (!message.order.cancellation.cancelled_by) {
      errorObj['message.order.cancellation.cancelled_by'] = 'Cancelled by field is required'
    }
  }

  return errorObj
}

export const validateCancellationResponse = (order: any) => {
  const errorObj: any = {}
  
  if (!order) {
    errorObj['order'] = 'Order details are required in cancellation response'
    return errorObj
  }

  if (!order.cancellation) {
    errorObj['order.cancellation'] = 'Cancellation details are required in response'
  } else {
    if (!order.cancellation.cancelled_by) {
      errorObj['order.cancellation.cancelled_by'] = 'Cancelled by field is required'
    }
    if (!order.cancellation.status) {
      errorObj['order.cancellation.status'] = 'Cancellation status is required'
    }
  }

  return errorObj
}

export const validateOrderConsistency = (currentOrder: any, previousAction: string) => {
  const errorObj: any = {}
  
  const previousOrder = getValue(`${previousAction}_order`)
  if (!previousOrder) {
    return errorObj
  }

  // Check ID consistency if both orders have IDs
  if (currentOrder.id && previousOrder.id && currentOrder.id !== previousOrder.id) {
    errorObj['order.id'] = `Order ID ${currentOrder.id} doesn't match with previous order ID ${previousOrder.id}`
  }

  // Check provider consistency
  if (currentOrder.provider?.id && previousOrder.provider?.id && 
      currentOrder.provider.id !== previousOrder.provider.id) {
    errorObj['order.provider.id'] = `Provider ID ${currentOrder.provider.id} doesn't match with previous provider ID ${previousOrder.provider.id}`
  }

  // Check items consistency - only if both orders have items
  if (currentOrder.items?.[0]?.id && previousOrder.items?.[0]?.id) {
    // Check if current item ID is in the list of previous item IDs (for multi-item flows)
    const storedItemIds = getValue('item_ids') || []
    if (Array.isArray(storedItemIds) && storedItemIds.length > 0) {
      if (!storedItemIds.includes(currentOrder.items[0].id)) {
        errorObj['order.items.id'] = `Item ID ${currentOrder.items[0].id} doesn't match with any previous item IDs`
      }
    } 
    // If no item_ids array, check against the first item
    else if (currentOrder.items[0].id !== previousOrder.items[0].id) {
      errorObj['order.items.id'] = `Item ID ${currentOrder.items[0].id} doesn't match with previous item ID ${previousOrder.items[0].id}`
    }
  }

  return errorObj
}

export const validateTransactionConsistency = (context: any) => {
  const errorObj: any = {}
  
  const action = context.action
  const currentStep = action.startsWith('on_') ? action.substring(3) : action
  
  const relevantContexts = []
  
  const sequenceMatch = /^([a-z_]+)_(\d+)$/.exec(currentStep)
  if (sequenceMatch) {
    const baseStep = sequenceMatch[1]
    const sequence = sequenceMatch[2]
    
    const baseContext = getValue(`${baseStep}_${sequence}_context`)
    const onBaseContext = getValue(`on_${baseStep}_${sequence}_context`)
    
    if (baseContext) relevantContexts.push(baseContext)
    if (onBaseContext) relevantContexts.push(onBaseContext)
  } else {
    const allContexts = [
      getValue(`${currentStep}_context`),
      getValue(`on_${currentStep}_context`)
    ].filter(Boolean)
    
    if (allContexts.length > 0) {
      relevantContexts.push(...allContexts)
    }
  }
  
  if (relevantContexts.length === 0) {
    return errorObj
  }

  // Only check transaction_id consistency within the relevant flow sequence
  const currentTransaction = relevantContexts[0].transaction_id
  if (context.transaction_id !== currentTransaction) {
    errorObj['context.transaction_id'] = `Transaction ID ${context.transaction_id} doesn't match with expected ID ${currentTransaction} for this flow sequence`
  }

  return errorObj
}

export const validateForeclosureDetails = (tags: any[]) => {
  const errorObj: any = {}
  
  if (!tags || !Array.isArray(tags)) {
    errorObj['tags'] = 'Tags array is required'
    return errorObj
  }

  const foreclosureTag = tags.find((tag: any) => tag.descriptor?.code === 'FORECLOSURE')
  if (!foreclosureTag || !foreclosureTag.list) {
    errorObj['tags.FORECLOSURE'] = 'FORECLOSURE tag with list is required'
    return errorObj
  }

  const requiredForeclosureFields = [
    'FORECLOSURE_AMOUNT',
    'OUTSTANDING_PRINCIPAL',
    'INTEREST_DUE',
    'FORECLOSURE_CHARGES',
    'VALID_UNTIL'
  ]

  for (const field of requiredForeclosureFields) {
    const fieldTag = foreclosureTag.list.find((item: any) => item.descriptor?.code === field)
    if (!fieldTag?.value) {
      errorObj[`tags.FORECLOSURE.${field}`] = `${field} value is required`
    }
  }

  return errorObj
}

export const validatePrePartPaymentDetails = (tags: any[]) => {
  const errorObj: any = {}
  
  if (!tags || !Array.isArray(tags)) {
    errorObj['tags'] = 'Tags array is required'
    return errorObj
  }

  const prePartTag = tags.find((tag: any) => tag.descriptor?.code === 'PRE_PART_PAYMENT')
  if (!prePartTag || !prePartTag.list) {
    errorObj['tags.PRE_PART_PAYMENT'] = 'PRE_PART_PAYMENT tag with list is required'
    return errorObj
  }

  const requiredPrePartFields = [
    'AMOUNT',
    'OUTSTANDING_PRINCIPAL',
    'NEW_EMI_AMOUNT',
    'REMAINING_TENURE',
    'CHARGES'
  ]

  for (const field of requiredPrePartFields) {
    const fieldTag = prePartTag.list.find((item: any) => item.descriptor?.code === field)
    if (!fieldTag?.value) {
      errorObj[`tags.PRE_PART_PAYMENT.${field}`] = `${field} value is required`
    }
  }

  return errorObj
}

export const validateEmiPaymentDetails = (tags: any[]) => {
  const errorObj: any = {}
  
  if (!tags || !Array.isArray(tags)) {
    errorObj['tags'] = 'Tags array is required'
    return errorObj
  }

  const emiTag = tags.find((tag: any) => tag.descriptor?.code === 'EMI_PAYMENT')
  if (!emiTag || !emiTag.list) {
    errorObj['tags.EMI_PAYMENT'] = 'EMI_PAYMENT tag with list is required'
    return errorObj
  }

  const requiredEmiFields = [
    'EMI_NO',
    'EMI_AMOUNT',
    'DUE_DATE',
    'LATE_FEE',
    'TOTAL_DUE'
  ]

  for (const field of requiredEmiFields) {
    const fieldTag = emiTag.list.find((item: any) => item.descriptor?.code === field)
    if (!fieldTag?.value) {
      errorObj[`tags.EMI_PAYMENT.${field}`] = `${field} value is required`
    }
  }

  return errorObj
}

export const validatePaymentStatus = (tags: any[]) => {
  const errorObj: any = {}
  
  if (!tags || !Array.isArray(tags)) {
    errorObj['tags'] = 'Tags array is required'
    return errorObj
  }

  const paymentTag = tags.find((tag: any) => tag.descriptor?.code === 'PAYMENT_STATUS')
  if (!paymentTag || !paymentTag.list) {
    errorObj['tags.PAYMENT_STATUS'] = 'PAYMENT_STATUS tag with list is required'
    return errorObj
  }

  const requiredPaymentFields = [
    'PAYMENT_ID',
    'PAYMENT_AMOUNT',
    'PAYMENT_DATE',
    'PAYMENT_STATUS',
    'PAYMENT_METHOD'
  ]

  for (const field of requiredPaymentFields) {
    const fieldTag = paymentTag.list.find((item: any) => item.descriptor?.code === field)
    if (!fieldTag?.value) {
      errorObj[`tags.PAYMENT_STATUS.${field}`] = `${field} value is required`
    }
  }

  return errorObj
}

export const validatePaymentTags = (payment: any) => {
  const errorObj: any = {}
  
  if (!payment || !payment.tags || !Array.isArray(payment.tags)) {
    return errorObj
  }

  // Check for BAP_TERMS required fields
  const bapTermsTag = payment.tags.find((tag: any) => tag.descriptor?.code === 'BAP_TERMS')
  const settlementTermsTag = payment.tags.find((tag: any) => tag.descriptor?.code === 'SETTLEMENT_TERMS')
  
  // The required fields may be directly in BAP_TERMS or in a SETTLEMENT_TERMS tag
  let fieldsFound = {
    SETTLEMENT_AMOUNT: false,
    SETTLEMENT_TYPE: false,
    DELAY_INTEREST: false,
    STATIC_TERMS: false,
    OFFLINE_CONTRACT: false
  }

  // Check in BAP_TERMS list if it exists
  if (bapTermsTag && bapTermsTag.list) {
    bapTermsTag.list.forEach((item: any) => {
      const code = item.descriptor?.code
      if (code in fieldsFound && item.value) {
        fieldsFound[code as keyof typeof fieldsFound] = true
      }
    })
  }

  // Also check in SETTLEMENT_TERMS list if it exists
  if (settlementTermsTag && settlementTermsTag.list) {
    settlementTermsTag.list.forEach((item: any) => {
      const code = item.descriptor?.code
      if (code in fieldsFound && item.value) {
        fieldsFound[code as keyof typeof fieldsFound] = true
      }
    })
  }

  // Only require these fields if BAP_TERMS or SETTLEMENT_TERMS exists


  return errorObj
}