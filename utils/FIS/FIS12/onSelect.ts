/* eslint-disable no-prototype-builtins */
import { getValue } from '../../../shared/dao'
import constants from '../../../constants'
import { validateSchema, isObjectEmpty } from '../..'
import _ from 'lodash'
import { logger } from '../../../shared/logger'
import {
  validateContext,
  validateDescriptor,
  validateProvider,
  validateQuote,
  validateXInput,
  validateXInputSubmission,
} from './fisChecks'
import { validateItemsTags, validateLoanInfoTags, validateLoanTags, validateProviderTags } from './tags'

export const checkOnSelect = (data: any, msgIdSet: any, sequence: string) => {
  if (!data || isObjectEmpty(data)) {
    return { [constants.ON_SELECT]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema('FIS', constants.ON_SELECT, data)
  const contextRes: any = validateContext(context, msgIdSet, constants.SELECT, constants.ON_SELECT)

  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  try {
    const onSelect = message.order
    const version = getValue('version')
    const flow = getValue('LoanType')
    const flow_type = getValue('flow_type')

    //provider checks
    try {
      logger.info(`Checking provider details in /${constants.ON_SELECT}`)
      const providerErrors = validateProvider(onSelect?.provider, constants.ON_SELECT)
      Object.assign(errorObj, providerErrors)

      // Validate tags
      const tagsValidation = validateProviderTags(onSelect?.provider?.tags)
      if (!tagsValidation.isValid) {
        Object.assign(providerErrors, { tags: tagsValidation.errors })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking provider details in /${constants.ON_SELECT}`, error.stack)
    }

    //checks items
    try {
      logger.info(`Comparing item in /${constants.ON_SELECT}`)

      if (_.isEmpty(onSelect?.items)) {
        errorObj['items'] = 'items array is missing or empty in message.order'
      } else {
        const selectedItemId = getValue('selectedItemId')
        onSelect.items.forEach((item: any, index: number) => {
          if (selectedItemId && !selectedItemId.includes(item.id)) {
            const key = `item[${index}].item_id`
            errorObj[key] =
              `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in previous call`
          }

          // Validate parent_item_id
          if (version == '2.1.0') {
            if (!item?.parent_item_id) errorObj.parent_item_id = `parent_item_id not found in providers[${index}]`
            else {
              const parentItemId: any = getValue('parentItemId')
              if (parentItemId && !parentItemId.has(item?.parent_item_id)) {
                errorObj.parent_item_id = `parent_item_id: ${item.parent_item_id} doesn't match with parent_item_id's from past call in providers[${index}]`
              }
            }
          }

          console.log("flow type ", flow_type)
          if ((version != '2.0.0' || sequence != 'on_select_1') && !(flow_type === 'PERSONAL_LOAN')) {
            // price check
            const price = item?.price
            if (!price) {
              errorObj['price'] = `price is missing at items[${index}]`
            } else {
              if (!price?.currency) errorObj['currency'] = `currency is missing at items[${index}].price`
              if (!price?.value) errorObj['value'] = `value is missing at items[${index}].price`
            }
          }
          // Validate descriptor
          const descriptorError = validateDescriptor(
            item?.descriptor,
            constants.ON_SELECT,
            `items[${index}].descriptor`,
            false,
            [],
          )
          if (descriptorError) Object.assign(errorObj, descriptorError)
                  // Validate xinput
                  const xinput = item?.xinput
                  let currIndex = parseInt(sequence.replace('on_select_', ''))
                  if (version == '2.0.0') currIndex = currIndex - 2 || 0
                  else currIndex = currIndex - 1 || 0
                  const xinputValidationErrors =
                    (version == '2.0.0' && sequence == 'on_select_1' && flow_type !== 'PERSONAL_LOAN')
                      ? validateXInputSubmission(xinput, index, sequence)
                      : (flow_type === 'PERSONAL_LOAN' && sequence == 'on_select_1')
                        ? null // Skip validation for PERSONAL_LOAN with on_select_1
                        : validateXInput(xinput, index, constants.ON_SELECT, currIndex)
                  if (xinputValidationErrors) {
                    Object.assign(errorObj, xinputValidationErrors)
                  }
          // Validate Item tags
          let tagsValidation: any = {}
          if (sequence == 'on_search_3') {
            tagsValidation = validateLoanTags(item?.tags, sequence)
          } else if (version == '2.0.0' && sequence == 'on_select_1') {
            tagsValidation = validateItemsTags(item?.tags)
          } else {
            tagsValidation = validateLoanInfoTags(item?.tags, flow)
          }
          if (!tagsValidation.isValid) {
            Object.assign(errorObj, { tags: tagsValidation.errors })
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking items object in /${constants.ON_SELECT}, ${error.stack}`)
    }

    //quote checks
    if (!(version == '2.0.0' && sequence == 'on_select_1')) {
      try {
        logger.info(`Checking quote object in /${constants.ON_SELECT}`)
        const quoteErrors = validateQuote(onSelect, constants?.SELECT)
        Object.assign(errorObj, quoteErrors)
      } catch (error: any) {
        logger.error(`!!Error while checking quote object in /${constants.ON_SELECT}`, error.stack)
      }
    }
  } catch (error: any) {
    logger.error(`!!Error occcurred while checking message in /${constants.ON_SELECT},  ${error.message}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
