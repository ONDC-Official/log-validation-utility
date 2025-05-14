import { logger } from '../../../../shared/logger'
import { setValue, getValue } from '../../../../shared/dao'
import constants from '../../../../constants'
import { validateSchema, isObjectEmpty, checkFISContext } from '../../../../utils'
import {  validateMessageId } from './commonValidations'

export const checkselectPurchaseFinance = (data: any, msgIdSet: any, flow: string, sequence: string) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [constants.SELECT]: 'JSON cannot be empty' }
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
    // Schema validation
    const schemaValidation = validateSchema('FIS12_PF', constants.SELECT, data);

    // Context validation
    const contextRes: any = checkFISContext(data.context, constants.SELECT)
    
    // Save context for future validations
    setValue(`${constants.SELECT}_context`, data.context)
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
    const previousTransaction = getValue(`${constants.SEARCH}_context`)?.transaction_id || getValue(`${constants.ON_SEARCH}_context`)?.transaction_id
    if (previousTransaction && data.context.transaction_id !== previousTransaction) {
      errorObj['context.transaction_id'] = `Transaction ID mismatch: expected ${previousTransaction}, found ${data.context.transaction_id}`
    }

    const { order } = data.message

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
      for (let i = 0; i < order.items.length; i++) {
        const item = order.items[i]
        if (!item.id) {
          errorObj[`order.items[${i}].id`] = 'Item ID is required'
        } else {
          // Validate item consistency
          const storedItemId = getValue('item_id')
          if (storedItemId && item.id !== storedItemId) {
            errorObj[`order.items[${i}].id`] = `Item ID ${item.id} doesn't match with stored item ID ${storedItemId}`
          }
        }

        // For sequences after SELECT, validate xinput form_response
        if (sequence === 'SELECT_1' || sequence === 'SELECT_2' || sequence === 'SELECT_3') {
          if (!item.xinput) {
            errorObj[`order.items[${i}].xinput`] = 'Xinput is required for this sequence'
          } else {
            if (!item.xinput.form || !item.xinput.form.id) {
              errorObj[`order.items[${i}].xinput.form.id`] = 'Form ID is required'
            } else {
              // Check form ID consistency with the one received in on_select
              const onSelectFormId = getValue(`form_id_ON_SELECT_${i-1}`) // Assuming previous sequence
              if (onSelectFormId && item.xinput.form.id !== onSelectFormId) {
                errorObj[`order.items[${i}].xinput.form.id`] = `Form ID mismatch: expected ${onSelectFormId}, found ${item.xinput.form.id}`
              }
            }
            
            if (!item.xinput.form_response) {
              errorObj[`order.items[${i}].xinput.form_response`] = 'Form response is required'
            } else {
              if (!item.xinput.form_response.status) {
                errorObj[`order.items[${i}].xinput.form_response.status`] = 'Form response status is required'
              }
              
              if (!item.xinput.form_response.submission_id) {
                errorObj[`order.items[${i}].xinput.form_response.submission_id`] = 'Form response submission_id is required'
              } else {
                // Store submission ID for future validations
                setValue(`${sequence}_submission_id`, item.xinput.form_response.submission_id)
              }
            }
          }
        }
      }
    }

    // Store order for future validations
    setValue(`${constants.SELECT}_order`, order)

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}
