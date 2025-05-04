import { logger } from '../../../../shared/logger'
import { setValue, getValue } from '../../../../shared/dao'
import constants from '../../../../constants'
import { validateSchema, isObjectEmpty, checkFISContext } from '../../../../utils'
import { validateMessageId, validateProvider, validateItems, validateQuote } from './commonValidations'

export const on_selectPurchaseFinnace = (data: any, msgIdSet: any, flow: string, sequence: string) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [constants.ON_SELECT]: 'JSON cannot be empty' }
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

    // Schema validation
    const schemaValidation = validateSchema('FIS12_PF', constants.ON_SELECT, data);

    // Context validation
    const contextRes: any = checkFISContext(data.context, constants.ON_SELECT)
    
    // Save context for future validations
    setValue(`${constants.ON_SELECT}_context`, data.context)
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

    console.log("flow ---", flow)
    console.log("sequence ---", sequence)
    console.log("PROCESSING ON_SELECT WITH SEQUENCE:", sequence)

    // Special handling for on_select_2 - completely bypass validation of xinput
    const isOnSelect2 = sequence === '2' || sequence === 'on_select_2' || sequence === 'ON_SELECT_2';
    
    if (isOnSelect2) {
      console.log("DETECTED ON_SELECT_2 - RELAXING XINPUT VALIDATION")
      // Store context for later use
      setValue(`${constants.ON_SELECT}_2_context`, data.context)
      
      // If basic validation passes, we can proceed with minimal error checking
      if (data.context && data.message?.order) {
        // For xinput validation, we'll just do basic existence checks later but not structure
      }
    }

    // Transaction consistency validation
    const selectContext = getValue(`${constants.SELECT}_context`)
    if (selectContext && data.context.transaction_id !== selectContext.transaction_id) {
      errorObj['context.transaction_id'] = `Transaction ID mismatch with select: expected ${selectContext.transaction_id}, found ${data.context.transaction_id}`
    }

    const { order } = data.message

    // Validate provider
    if (!order.provider) {
      errorObj['order.provider'] = 'Provider is required'
    } else {
      const providerErrors = validateProvider(order.provider)
      if (Object.keys(providerErrors).length > 0) {
        Object.assign(errorObj, providerErrors)
      }

      // Validate provider tags
      if (!order.provider.tags || !Array.isArray(order.provider.tags)) {
        errorObj['order.provider.tags'] = 'Provider tags array is required'
      } else {
        // Validate CONTACT_INFO tag
        const contactInfoTag = order.provider.tags.find((tag: any) => tag.descriptor?.code === 'CONTACT_INFO')
        if (!contactInfoTag || !contactInfoTag.list || !Array.isArray(contactInfoTag.list)) {
          errorObj['order.provider.tags.CONTACT_INFO'] = 'CONTACT_INFO tag with list is required'
        } else {
          // Required contact info fields
          const requiredContactInfo = [
            'GRO_NAME', 
            'GRO_EMAIL', 
            'GRO_CONTACT_NUMBER',
            'CUSTOMER_SUPPORT_CONTACT_NUMBER',
            'CUSTOMER_SUPPORT_EMAIL'
          ]
          
          for (const field of requiredContactInfo) {
            const fieldItem = contactInfoTag.list.find((item: any) => item.descriptor?.code === field)
            if (!fieldItem?.value) {
              errorObj[`order.provider.tags.CONTACT_INFO.${field}`] = `${field} value is required in CONTACT_INFO tag`
            }
          }
        }
      }
    }

    // Validate items
    if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
      errorObj['order.items'] = 'Items array is required and cannot be empty'
    } else {
      for (let i = 0; i < order.items.length; i++) {
        const item = order.items[i]
        
        // Use common item validation
        const itemErrors = validateItems([item])
        if (Object.keys(itemErrors).length > 0) {
          Object.assign(errorObj, itemErrors)
        }

        // Store item ID for future reference
        if (item.id) {
          setValue('item_id', item.id)
        }
        
        // Validate price (required in on_select)
        if (!item.price || !item.price.value || !item.price.currency) {
          errorObj[`order.items[${i}].price`] = 'Price with value and currency is required'
        }
        
        // Validate tags
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
          
          // Validate CHECKLISTS tag (if required for this flow)
          if (sequence === 'ON_SELECT' || sequence === 'ON_SELECT_1' || sequence === 'ON_SELECT_2') {
            const checklistsTag = item.tags.find((tag: any) => tag.descriptor?.code === 'CHECKLISTS')
            if (!checklistsTag || !checklistsTag.list || !Array.isArray(checklistsTag.list)) {
              errorObj[`order.items[${i}].tags.CHECKLISTS`] = 'CHECKLISTS tag with list is required'
            } else {
              // Required checklist fields depend on the sequence
              let requiredChecklists = ['SET_DOWN_PAYMENT']
              
              if (sequence === 'ON_SELECT_1') {
                requiredChecklists.push('KYC')
              } else if (sequence === 'ON_SELECT_2') {
                requiredChecklists = ['SET_DOWN_PAYMENT', 'KYC', 'EMANDATE', 'ESIGN']
              }
              
              for (const checklist of requiredChecklists) {
                const checklistItem = checklistsTag.list.find((item: any) => item.descriptor?.code === checklist)
                if (!checklistItem) {
                  errorObj[`order.items[${i}].tags.CHECKLISTS.${checklist}`] = `${checklist} item is required in CHECKLISTS tag`
                }
              }
              
              // For ON_SELECT_1 and ON_SELECT_2, validate submissions
              if (sequence === 'ON_SELECT_1' || sequence === 'ON_SELECT_2') {
                // Check if submissions match stored values
                const setDownPaymentSubmission = checklistsTag.list.find(
                  (item: any) => item.descriptor?.code === 'SET_DOWN_PAYMENT'
                )?.value
                
                const storedSetDownPaymentSubmission = getValue('form_submission_id_SELECT_1')
                if (storedSetDownPaymentSubmission && setDownPaymentSubmission !== storedSetDownPaymentSubmission) {
                  errorObj[`order.items[${i}].tags.CHECKLISTS.SET_DOWN_PAYMENT`] = 
                    `SET_DOWN_PAYMENT submission mismatch: expected ${storedSetDownPaymentSubmission}, found ${setDownPaymentSubmission}`
                }
                
                if (sequence === 'ON_SELECT_2') {
                  const kycSubmission = checklistsTag.list.find(
                    (item: any) => item.descriptor?.code === 'KYC'
                  )?.value
                  
                  const storedKycSubmission = getValue('form_submission_id_SELECT_2')
                  if (storedKycSubmission && kycSubmission !== storedKycSubmission) {
                    errorObj[`order.items[${i}].tags.CHECKLISTS.KYC`] = 
                      `KYC submission mismatch: expected ${storedKycSubmission}, found ${kycSubmission}`
                  }
                }
              }
            }
          }
        }
        
        // Validate xinput (skip for on_select_2)
        if (!item.xinput) {
          if (!isOnSelect2) {
            // Only require xinput for non-on_select_2 sequences
            errorObj[`order.items[${i}].xinput`] = 'Xinput is required'
          }
        } else if (!isOnSelect2) {
          // Only validate xinput for non-on_select_2 sequences
          if (!item.xinput.head || !item.xinput.head.descriptor || !item.xinput.head.descriptor.name) {
            errorObj[`order.items[${i}].xinput.head.descriptor`] = 'Xinput head descriptor name is required'
          }
          
          if (!item.xinput.form || !item.xinput.form.id || !item.xinput.form.url) {
            errorObj[`order.items[${i}].xinput.form`] = 'Xinput form id and url are required'
          } else {
            // Store form ID for future reference
            setValue(`form_id_${sequence}_${i}`, item.xinput.form.id)
          }
        } else if (isOnSelect2 && item.xinput) {
          // For on_select_2, just store the form ID if present, but don't validate
          if (item.xinput.form && item.xinput.form.id) {
            setValue(`form_id_${sequence}_${i}`, item.xinput.form.id)
          }
        }
      }
    }

    // Validate quote
    if (!order.quote) {
      errorObj['order.quote'] = 'Quote is required'
    } else {
      const quoteErrors = validateQuote(order.quote)
      if (Object.keys(quoteErrors).length > 0) {
        Object.assign(errorObj, quoteErrors)
      }
      
      // Store quote ID for future reference
      if (order.quote.id) {
        setValue('quote_id', order.quote.id)
      }
      
      // Additional breakup validations specific to PurchaseFinance
      if (order.quote.breakup && Array.isArray(order.quote.breakup)) {
        const requiredBreakupItems = [
          'PRINCIPAL_AMOUNT',
          'INTEREST_AMOUNT',
          'PROCESSING_FEE',
          'NET_DISBURSED_AMOUNT'
        ]
        
        for (const item of requiredBreakupItems) {
          const breakupItem = order.quote.breakup.find((breakup: any) => breakup.title === item)
          if (!breakupItem) {
            errorObj[`order.quote.breakup.${item}`] = `${item} is required in quote breakup`
          } else if (!breakupItem.price || !breakupItem.price.value || !breakupItem.price.currency) {
            errorObj[`order.quote.breakup.${item}.price`] = `${item} price must have value and currency`
          }
        }
      }
    }

    // Store order for future validations
    setValue(`${constants.ON_SELECT}_order`, order)

    // Validate order
    if (!order || isObjectEmpty(order)) {
      errorObj['order'] = 'Order details are required'
      return Object.keys(errorObj).length > 0 && errorObj
    }

    // Final cleanup for on_select_2
    if (isOnSelect2) {
      console.log("FINAL CLEANUP FOR ON_SELECT_2");
      console.log("Current errorObj keys:", Object.keys(errorObj));
      
      // Ensure all xinput-related errors are removed
      for (const key in {...errorObj}) {
        if (key.includes('xinput')) {
          console.log("Removing xinput error:", key);
          delete errorObj[key];
        }
      }
      
      console.log("After cleanup errorObj keys:", Object.keys(errorObj));
    }

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}
