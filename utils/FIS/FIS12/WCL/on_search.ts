import { logger } from '../../../../shared/logger'
import { setValue } from '../../../../shared/dao'
import constants from '../../../../constants'
import { validateSchema, isObjectEmpty, checkFISContext } from '../../../../utils'
import { validateTransactionIdConsistency, validateMessageIdPair } from './commonValidations'

export const checkon_searchWCL = (data: any, msgIdSet: any, flow: string, sequence: string) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [constants.ON_SEARCH]: 'JSON cannot be empty' }
    }

    console.log("flow ---", flow)
    console.log("sequence ---", sequence)

    if (
      !data.message ||
      !data.context ||
      !data.message.catalog ||
      isObjectEmpty(data.message) ||
      isObjectEmpty(data.message.catalog)
    ) {
      errorObj['missingFields'] = '/context, /message, /catalog or /message/catalog is missing or empty'
      return Object.keys(errorObj).length > 0 && errorObj
    }

    const schemaValidation = validateSchema('FIS_WCL', constants.ON_SEARCH, data)
    const contextRes: any = checkFISContext(data.context, constants.ON_SEARCH)
    
    // Add transaction ID consistency check
    const transactionIdConsistency = validateTransactionIdConsistency(data.context)
    Object.assign(errorObj, transactionIdConsistency)
    
    // Add message ID pair validation - this is an on_action call
    const messageIdPair = validateMessageIdPair(data.context, constants.ON_SEARCH, true)
    Object.assign(errorObj, messageIdPair)
    
    setValue(`${constants.ON_SEARCH}_context`, data.context)
    msgIdSet.add(data.context.message_id)

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    const {message } = data
    const catalog = message.catalog

    // Validate catalog descriptor
    if (!catalog.descriptor?.name) {
      errorObj['catalog.descriptor'] = 'Catalog descriptor name is required'
    }

    // Validate providers
    if (!catalog.providers || !Array.isArray(catalog.providers) || catalog.providers.length === 0) {
      errorObj['catalog.providers'] = 'Providers array is required and cannot be empty'
    } else {
      const provider = catalog.providers[0]

      // Validate provider descriptor
      if (!provider.descriptor?.name) {
        errorObj['provider.descriptor'] = 'Provider descriptor name is required'
      }

      // Validate provider categories
      if (!provider.categories || !Array.isArray(provider.categories) || provider.categories.length === 0) {
        errorObj['provider.categories'] = 'Provider categories array is required and cannot be empty'
      } else {
        const category = provider.categories[0]
        if (category.descriptor?.code !== 'WORKING_CAPITAL_LOAN') {
          errorObj['provider.categories.code'] = 'Category code must be WORKING_CAPITAL_LOAN'
        }
      }

      // Validate items
      if (!provider.items || !Array.isArray(provider.items) || provider.items.length === 0) {
        errorObj['provider.items'] = 'Items array is required and cannot be empty'
      } else {
        const item = provider.items[0]

        // Validate item descriptor
        if (!item.descriptor?.name || !item.descriptor?.code) {
          errorObj['item.descriptor'] = 'Item descriptor name and code are required'
        }

        // Validate item category_ids
        if (!item.category_ids || !Array.isArray(item.category_ids) || item.category_ids.length === 0) {
          errorObj['item.category_ids'] = 'Item category_ids array is required and cannot be empty'
        }

        // Validate xinput
        if (!item.xinput) {
          errorObj['item.xinput'] = 'Xinput is required'
        } else {
          const { head, form } = item.xinput

          // Validate xinput head
          if (!head?.descriptor?.name || !head?.index || !head?.headings) {
            errorObj['item.xinput.head'] = 'Xinput head descriptor, index, and headings are required'
          }

          // Validate xinput form
          if (!form?.id || !form?.mime_type || !form?.url) {
            errorObj['item.xinput.form'] = 'Xinput form id, mime_type, and url are required'
          }
        }
      }

      // Validate tags
      if (!provider.tags || !Array.isArray(provider.tags)) {
        errorObj['provider.tags'] = 'Provider tags array is required'
      } else {
        const bppTermsTag = provider.tags.find((tag: any) => tag.descriptor?.code === 'BPP_TERMS')
        if (!bppTermsTag || !bppTermsTag.list) {
          errorObj['provider.tags.BPP_TERMS'] = 'BPP_TERMS tag with list is required'
        }
      }
    }

    // Store provider ID for future validations
    if (catalog.providers?.[0]?.id) {
      setValue('provider_id', catalog.providers[0].id)
    }

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}
