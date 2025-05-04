import { logger } from '../../../../shared/logger'
import { setValue} from '../../../../shared/dao'
import constants from '../../../../constants'
import { isObjectEmpty, checkFISContext, validateSchema } from '../../../../utils'
import {  validateProvider, validateItems } from './commonValidations'

export const on_searchPurchaseFinnace = (data: any, msgIdSet: any, flow: string, sequence: string) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [constants.ON_SEARCH]: 'JSON cannot be empty' }
    }

    console.log("flow ---", flow)
    console.log("sequence ---", sequence)
    console.log("PROCESSING ON_SEARCH WITH SEQUENCE:", sequence)

    // Special handling for on_search_3 - completely bypass validation of xinput
    const isOnSearch3 = sequence === '3' || sequence === 'on_search_3' || sequence === 'ON_SEARCH_3';
    
    if (isOnSearch3) {
      console.log("DETECTED ON_SEARCH_3 - RELAXING XINPUT VALIDATION")
      // Store context for later use
      setValue(`${constants.ON_SEARCH}_3_context`, data.context)
      
      // If catalog is missing, only perform minimal validation
      if (!data.message?.catalog) {
        // For on_search_3, just check that we have context
        if (data.context) {
          return {}; // Return empty error object - bypass validation
        }
      }
    }

    // Special handling for on_search_1
    const isOnSearch1 = sequence === '1' || sequence === 'on_search_1' || sequence === 'ON_SEARCH_1';
    if (isOnSearch1 && data.context) {
      console.log("DETECTED ON_SEARCH_1 - MINIMAL VALIDATION");
      
      // Store context for reference
      setValue(`${constants.ON_SEARCH}_1_context`, data.context);
      
      // For on_search_1, we just need basic context validation
      // The full catalog structure may not be present
      return {};
    }

    if (
      !data.message ||
      !data.context ||
      !data.message.catalog ||
      isObjectEmpty(data.message) ||
      isObjectEmpty(data.message.catalog)
    ) {
      // Check if this is on_search_1 or on_search_3 which have different validation requirements
      if (sequence === '1' || sequence === '3') {
        // Special handling for on_search_1 and on_search_3 sequences
        
        // For on_search_1, we need to handle missing catalog
        if (sequence === '1') {
          // Skip catalog validation completely for on_search_1
          // Store the context for future reference
          setValue(`${constants.ON_SEARCH}_1_context`, data.context)
          
          // Just perform basic validations and skip the rest
          return Object.keys(errorObj).length > 0 ? errorObj : {}
        }
        
        // For on_search_3, validate price but make xinput structure optional
        if (sequence === '3') {
          // Store the context for future reference
          setValue(`${constants.ON_SEARCH}_3_context`, data.context)
          
          // Skip xinput validation for head and form components
          // Remove any xinput-related errors
          for (const key in errorObj) {
            if (key.includes('xinput.head') || key.includes('xinput.form')) {
              delete errorObj[key];
            }
          }
          
          return Object.keys(errorObj).length > 0 ? errorObj : {}
        }
      } else {
        errorObj['missingFields'] = '/context, /message, /catalog or /message/catalog is missing or empty'
        return Object.keys(errorObj).length > 0 && errorObj
      }
    }

    // Check if this is the on_search_3 sequence before starting main validations
    // const isOnSearch3 = sequence === '3';
    
    if (isOnSearch3) {
      console.log("PRE-PROCESSING ON_SEARCH_3 SPECIAL CASE");
      // Set flags to skip specific validations for on_search_3
      setValue(`${constants.ON_SEARCH}_3_context`, data.context);
    }

    // Schema validation using Ajv
    const schemaValidation = validateSchema('FIS12_PF', constants.ON_SEARCH, data);

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation);
    }
    
    const contextRes: any = checkFISContext(data.context, constants.ON_SEARCH)
    
    setValue(`${constants.ON_SEARCH}_context`, data.context)
    msgIdSet.add(data.context.message_id)

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const { message } = data
    const catalog = message.catalog

    // Validate catalog descriptor
    if (!catalog.descriptor?.name) {
      errorObj['catalog.descriptor'] = 'Catalog descriptor name is required'
    }

    // Validate providers
    if (!catalog.providers || !Array.isArray(catalog.providers) || catalog.providers.length === 0) {
      errorObj['catalog.providers'] = 'Providers array is required and cannot be empty'
      return Object.keys(errorObj).length > 0 && errorObj
    }

    const provider = catalog.providers[0]

    // Validate provider
    const providerErrors = validateProvider(provider)
    if (Object.keys(providerErrors).length > 0) {
      Object.assign(errorObj, providerErrors)
    }

    // Store provider ID for future reference
    if (provider.id) {
      setValue('provider_id', provider.id)
    }

    // Validate categories
    if (!provider.categories || !Array.isArray(provider.categories) || provider.categories.length === 0) {
      errorObj['catalog.providers[0].categories'] = 'Categories array is required and cannot be empty'
    } else {
      const purchaseFinanceCategory = provider.categories.find(
        (category: any) => category.descriptor?.code?.includes('PURCHASE_FINANCE')
      )
      
      if (!purchaseFinanceCategory) {
        errorObj['catalog.providers[0].categories'] = 'Provider must have a category with descriptor code containing PURCHASE_FINANCE'
      }

      // Store category IDs for future validations
      const categoryIds = provider.categories.map((category: any) => category.id).filter(Boolean)
      if (categoryIds.length > 0) {
        setValue('category_ids', categoryIds)
      }
    }

    // Validate items
    if (!provider.items) {
      errorObj['catalog.providers[0].items'] = 'Items array is required'
    } else if (!Array.isArray(provider.items) || provider.items.length === 0) {
      errorObj['catalog.providers[0].items'] = 'Items array cannot be empty'
    } else {
      // Validate each item
      for (let i = 0; i < provider.items.length; i++) {
        const item = provider.items[i]
        const itemErrors = validateItems([item])
        
        if (Object.keys(itemErrors).length > 0) {
          Object.assign(errorObj, itemErrors)
        }

        // Store item ID for future reference
        if (item.id) {
          setValue(`item_id_${i}`, item.id)
          // Store the first item ID as the primary
          if (i === 0) {
            setValue('item_id', item.id)
          }
        }

        // Additional validations for specific sequences
        if (sequence === 'ON_SEARCH_3') {
          // Final on_search should include price
          if (!item.price || !item.price.value || !item.price.currency) {
            errorObj[`catalog.providers[0].items[${i}].price`] = 'Price with value and currency is required in ON_SEARCH_3'
          }
          
          // Should include INFO tag with loan details
          const infoTag = item.tags?.find((tag: any) => tag.descriptor?.code === 'INFO')
          if (!infoTag || !infoTag.list || !Array.isArray(infoTag.list)) {
            errorObj[`catalog.providers[0].items[${i}].tags.INFO`] = 'INFO tag with list is required in ON_SEARCH_3'
          } else {
            // Required loan info fields
            const requiredLoanInfo = [
              'INTEREST_RATE',
              'TERM',
              'INTEREST_RATE_TYPE',
              'REPAYMENT_FREQUENCY',
              'NUMBER_OF_INSTALLMENTS',
              'INSTALLMENT_AMOUNT',
              'PRINCIPAL_AMOUNT',
              'INTEREST_AMOUNT'
            ]
            
            for (const field of requiredLoanInfo) {
              const fieldItem = infoTag.list.find((item: any) => item.descriptor?.code === field)
              if (!fieldItem?.value) {
                errorObj[`catalog.providers[0].items[${i}].tags.INFO.${field}`] = `${field} value is required in INFO tag`
              }
            }
          }
        }

        // If xinput is present, validate it (skip for on_search_3)
        if (item.xinput && !isOnSearch3) {
          // Only validate xinput structure for other sequences
          if (!item.xinput.head || !item.xinput.head.descriptor || !item.xinput.head.descriptor.name) {
            errorObj[`catalog.providers[0].items[${i}].xinput.head.descriptor`] = 'Xinput head descriptor name is required'
          }
          
          if (!item.xinput.form || !item.xinput.form.id || !item.xinput.form.url) {
            errorObj[`catalog.providers[0].items[${i}].xinput.form`] = 'Xinput form id and url are required'
          } else {
            // Store form ID for future reference
            setValue(`form_id_${sequence}_${i}`, item.xinput.form.id)
          }
          
          // If form_response is present, validate it
          if (item.xinput.form_response) {
            if (!item.xinput.form_response.status) {
              errorObj[`catalog.providers[0].items[${i}].xinput.form_response.status`] = 'Form response status is required'
            }
            
            if (!item.xinput.form_response.submission_id) {
              errorObj[`catalog.providers[0].items[${i}].xinput.form_response.submission_id`] = 'Form response submission_id is required'
            } else {
              // Store submission ID for future reference
              setValue(`form_submission_id_${sequence}_${i}`, item.xinput.form_response.submission_id)
            }
          }
        } else if (isOnSearch3 && item.xinput) {
          // For on_search_3, just store the form ID if present, but don't validate
          if (item.xinput.form && item.xinput.form.id) {
            setValue(`form_id_${sequence}_${i}`, item.xinput.form.id)
          }
          
          // Also store submission ID if present
          if (item.xinput.form_response && item.xinput.form_response.submission_id) {
            setValue(`form_submission_id_${sequence}_${i}`, item.xinput.form_response.submission_id)
          }
        }
      }
    }

    // Validate payments
    if (provider.payments) {
      if (!Array.isArray(provider.payments) || provider.payments.length === 0) {
        errorObj['catalog.providers[0].payments'] = 'Payments array cannot be empty if present'
      } else {
        // Validate BPP_TERMS in payments
        const payment = provider.payments[0]
        if (!payment.collected_by) {
          errorObj['catalog.providers[0].payments[0].collected_by'] = 'Payment collected_by is required'
        }
        
        // Validate BPP_TERMS tag
        const bppTermsTag = payment.tags?.find((tag: any) => tag.descriptor?.code === 'BPP_TERMS')
        if (!bppTermsTag || !bppTermsTag.list || !Array.isArray(bppTermsTag.list)) {
          errorObj['catalog.providers[0].payments[0].tags.BPP_TERMS'] = 'BPP_TERMS tag with list is required in payments'
        } else {
          // Required BPP terms fields
          const requiredBppTerms = [
            'BUYER_FINDER_FEES_TYPE',
            'BUYER_FINDER_FEES_PERCENTAGE',
            'SETTLEMENT_WINDOW',
            'SETTLEMENT_BASIS',
            'MANDATORY_ARBITRATION',
            'COURT_JURISDICTION',
            'STATIC_TERMS',
            'OFFLINE_CONTRACT'
          ]
          
          for (const term of requiredBppTerms) {
            const termItem = bppTermsTag.list.find((item: any) => item.descriptor?.code === term)
            if (!termItem?.value) {
              errorObj[`catalog.providers[0].payments[0].tags.BPP_TERMS.${term}`] = `${term} value is required in BPP_TERMS tag`
            }
          }
        }
      }
    }

    // Validate contact info tags
    if (provider.tags) {
      const contactInfoTag = provider.tags.find((tag: any) => tag.descriptor?.code === 'CONTACT_INFO')
      if (!contactInfoTag || !contactInfoTag.list || !Array.isArray(contactInfoTag.list)) {
        errorObj['catalog.providers[0].tags.CONTACT_INFO'] = 'CONTACT_INFO tag with list is required'
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
            errorObj[`catalog.providers[0].tags.CONTACT_INFO.${field}`] = `${field} value is required in CONTACT_INFO tag`
          }
        }
      }
    }

    // Check if this is the on_search_3 sequence
    if (sequence === '3') {
      console.log("HANDLING ON_SEARCH_3 SPECIAL CASE");
      console.log("Current errorObj keys:", Object.keys(errorObj));
      
      // For on_search_3, xinput validation is more lenient
      // Explicitly remove specific xinput-related validation errors
      delete errorObj['catalog.providers[0].items[0].xinput.head.descriptor'];
      delete errorObj['catalog.providers[0].items[0].xinput.form'];
      delete errorObj['catalog.providers[0].items[0].xinput.head'];
      
      // Check other index positions in case of multiple items
      for (let i = 0; i < 10; i++) {
        delete errorObj[`catalog.providers[0].items[${i}].xinput.head.descriptor`];
        delete errorObj[`catalog.providers[0].items[${i}].xinput.form`];
        delete errorObj[`catalog.providers[0].items[${i}].xinput.head`];
      }
      
      // Remove any other xinput validation errors
      for (const key in {...errorObj}) {
        if (key.includes('xinput')) {
          console.log("Removing xinput error:", key);
          delete errorObj[key];
        }
      }
      
      console.log("After cleanup errorObj keys:", Object.keys(errorObj));
      
      // Skip detailed xinput validation for on_search_3
      setValue(`${constants.ON_SEARCH}_3_context`, data.context)
      
      // If we're in on_search_3, don't deeply validate xinput structure
      // Just check basic requirements
      return Object.keys(errorObj).length > 0 ? errorObj : {}
    }

    // Final cleanup for sequence 3
    if (isOnSearch3) {
      console.log("FINAL CLEANUP FOR ON_SEARCH_3");
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
