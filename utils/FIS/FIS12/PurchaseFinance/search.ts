import { logger } from '../../../../shared/logger'
import { setValue, getValue } from '../../../../shared/dao'
import constants from '../../../../constants'
import { isObjectEmpty, checkFISContext, validateSchema } from '../../../../utils'
import { validateMessageId } from './commonValidations'

export const searchPurchaseFinance = (data: any, msgIdSet: any, flow: string, sequence: string) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [constants.SEARCH]: 'JSON cannot be empty' }
    }

    console.log("flow ---", flow)
    console.log("sequence ---", sequence)

    if (
      !data.message ||
      !data.context ||
      !data.message.intent ||
      isObjectEmpty(data.message) ||
      isObjectEmpty(data.message.intent)
    ) {
      errorObj['missingFields'] = '/context, /message, /intent or /message/intent is missing or empty'
      return Object.keys(errorObj).length > 0 && errorObj
    }

    // Schema validation using Ajv
    const schemaValidation = validateSchema('FIS12_PF', constants.SEARCH, data);

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation);
    }
    // Context validation
    const contextRes: any = checkFISContext(data.context, constants.SEARCH)
    
    // Save context for future validations
    setValue(`${constants.SEARCH}_context`, data.context)
    msgIdSet.add(data.context.message_id)

    // Add message ID validation
    const messageIdErrors = validateMessageId(data.context, msgIdSet)
    if (Object.keys(messageIdErrors).length > 0) {
      Object.assign(errorObj, messageIdErrors)
    }

    // Add context validation errors
    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    // Validate the intent data
    const { intent } = data.message

    // Check for required fields based on the sequence
    if (sequence === 'SEARCH') {
      // Initial search validation
      if (!intent.category || !intent.category.descriptor || intent.category.descriptor.code !== 'PURCHASE_FINANCE') {
        errorObj['intent.category.descriptor.code'] = 'Category code must be PURCHASE_FINANCE'
      }

      if (!intent.payment || !intent.payment.collected_by) {
        errorObj['intent.payment.collected_by'] = 'Payment collected_by is required'
      }

      // Validate BAP_TERMS tag
      if (!intent.payment.tags || !Array.isArray(intent.payment.tags)) {
        errorObj['intent.payment.tags'] = 'Payment tags array is required'
      } else {
        const bapTermsTag = intent.payment.tags.find((tag: any) => tag.descriptor?.code === 'BAP_TERMS')
        if (!bapTermsTag || !bapTermsTag.list) {
          errorObj['intent.payment.tags.BAP_TERMS'] = 'BAP_TERMS tag with list is required'
        } else {
          const requiredTerms = [
            'BUYER_FINDER_FEES_TYPE',
            'BUYER_FINDER_FEES_PERCENTAGE',
            'DELAY_INTEREST',
            'STATIC_TERMS',
            'OFFLINE_CONTRACT'
          ]
          
          for (const term of requiredTerms) {
            const termItem = bapTermsTag.list.find((item: any) => item.descriptor?.code === term)
            if (!termItem?.value) {
              errorObj[`intent.payment.tags.BAP_TERMS.${term}`] = `${term} value is required in BAP_TERMS tag`
            }
          }
        }
      }
    } else if (sequence === 'SEARCH_1' || sequence === 'SEARCH_2' || sequence === 'SEARCH_3') {
      // Subsequent search validations (form responses)
      
      // Check for provider consistency
      if (intent.provider) {
        const storedProviderId = getValue('provider_id')
        if (storedProviderId && intent.provider.id !== storedProviderId) {
          errorObj['intent.provider.id'] = `Provider ID ${intent.provider.id} doesn't match with previously stored provider ID ${storedProviderId}`
        }
        
        // Store provider ID if first time seeing it
        if (intent.provider.id && !storedProviderId) {
          setValue('provider_id', intent.provider.id)
        }
        
        // Validate items
        if (!intent.provider.items || !Array.isArray(intent.provider.items) || intent.provider.items.length === 0) {
          errorObj['intent.provider.items'] = 'Items array is required and cannot be empty'
        } else {
          const item = intent.provider.items[0]
          
          // Check item ID consistency
          const storedItemId = getValue('item_id')
          if (storedItemId && item.id !== storedItemId) {
            errorObj['intent.provider.items.id'] = `Item ID ${item.id} doesn't match with previously stored item ID ${storedItemId}`
          }
          
          // Store item ID if first time seeing it
          if (item.id && !storedItemId) {
            setValue('item_id', item.id)
          }
          
          // Validate xinput and form_response
          if (!item.xinput) {
            errorObj['intent.provider.items.xinput'] = 'Item xinput is required'
          } else {
            if (!item.xinput.form || !item.xinput.form.id) {
              errorObj['intent.provider.items.xinput.form.id'] = 'Form ID is required'
            }
            
            if (sequence !== 'SEARCH_1') {
              // For SEARCH_2 and SEARCH_3, form_response is required
              if (!item.xinput.form_response) {
                errorObj['intent.provider.items.xinput.form_response'] = 'Form response is required'
              } else {
                if (!item.xinput.form_response.status) {
                  errorObj['intent.provider.items.xinput.form_response.status'] = 'Form response status is required'
                }
                
                if (!item.xinput.form_response.submission_id) {
                  errorObj['intent.provider.items.xinput.form_response.submission_id'] = 'Form response submission_id is required'
                }
              }
            }
            
            // Save form ID for future reference
            if (item.xinput.form.id) {
              setValue(`form_id_${sequence}`, item.xinput.form.id)
            }
            
            // Save submission ID for future reference
            if (item.xinput.form_response?.submission_id) {
              setValue(`form_submission_id_${sequence}`, item.xinput.form_response.submission_id)
            }
          }
        }
      } else {
        errorObj['intent.provider'] = 'Provider details are required for this sequence'
      }
    }

    // Validate transaction consistency across sequences
    const previousContext = getValue(`${constants.SEARCH}_context`)
    if (previousContext && sequence !== 'SEARCH') {
      if (data.context.transaction_id !== previousContext.transaction_id) {
        errorObj['context.transaction_id'] = `Transaction ID mismatch: expected ${previousContext.transaction_id}, found ${data.context.transaction_id}`
      }
    }

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}
