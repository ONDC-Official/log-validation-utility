/* eslint-disable no-prototype-builtins */
import constants, { FisApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty } from '../../'
import { getValue, setValue } from '../../../shared/dao'
import {
  validateCancellationTerms,
  validateContext,
  validateDescriptor,
  validateDocuments,
  validateFulfillments,
  validatePaymentsObject,
  validateProvider,
  validateQuote,
} from './fisChecks'
import { validateLoanInfoTags, validateContactAndLspTags } from './tags'
import _ from 'lodash'

export const checkOnConfirm = (data: any, msgIdSet: any) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [FisApiSequence.ON_CONFIRM]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('FIS', constants.ON_CONFIRM, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.CONFIRM, constants.ON_CONFIRM)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    setValue(`${FisApiSequence.ON_CONFIRM}`, data)

    const on_confirm = message.order
    const version: any = getValue('version')
    // const LoanType: any = getValue('LoanType')
    const flowType = getValue('flow_type')

    //check order.id
    try {
      logger.info(`Checking id in message object  /${constants.ON_CONFIRM}`)
      if (!on_confirm?.id) {
        errorObj.id = `Id in message object must be present/${constants.ON_CONFIRM}`
      } else {
        setValue('orderId', on_confirm?.id)
      }
    } catch (error: any) {
      logger.error(`!!Error while checking id in message object  /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    //provider checks
    try {
      logger.info(`Checking provider details in /${constants.ON_CONFIRM}`)
      const providerErrors = validateProvider(on_confirm?.provider, constants.ON_CONFIRM)
      Object.assign(errorObj, providerErrors)

      // Validate tags
      logger.info(`Checking tags construct for provider`)
      const tagsValidation = validateContactAndLspTags(on_confirm?.provider?.tags)
      if (!tagsValidation.isValid) {
        Object.assign(errorObj, { providerTags: tagsValidation.errors })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking provider details in /${constants.ON_CONFIRM}`, error.stack)
    }

    //checks items
    try {
      logger.info(`Comparing item in /${constants.ON_CONFIRM}`)

      if (_.isEmpty(on_confirm?.items)) {
        errorObj['items'] = 'items array is missing or empty in message.order'
      } else {
        const selectedItemId = getValue('selectedItemId')
        on_confirm.items.forEach((item: any, index: number) => {
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
              if (parentItemId && !parentItemId?.includes(item?.parent_item_id)) {
                errorObj.parent_item_id = `parent_item_id: ${item.parent_item_id} doesn't match with parent_item_id's from past call in providers[${index}]`
              }
            }
          }

          // Validate descriptor
          const descriptorError = validateDescriptor(
            item?.descriptor,
            constants.ON_CONFIRM,
            `items[${index}].descriptor`,
            false,
            [],
          )
          if (descriptorError) Object.assign(errorObj, descriptorError)

          // Validate Item tags
          // let tagsValidation: any = {}
          // if (LoanType == 'INVOICE_BASED_LOAN') {
          //   tagsValidation = validateLoanTags(item?.tags, constants.ON_CONFIRM)
          // } else {
          //   tagsValidation = validateLoanInfoTags(item?.tags, flow)
          // }
          const tagsValidation: any = validateLoanInfoTags(item?.tags, flowType)
          if (!tagsValidation.isValid) {
            Object.assign(errorObj, { tags: tagsValidation.errors })
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking items object in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    //fulfillments checks
    try {
      logger.info(`Checking fulfillments objects in /${constants.ON_CONFIRM}`)
      let i = 0
      const len = on_confirm.fulfillments.length
      while (i < len) {
        const fulfillment = on_confirm.fulfillments[i]
        const fulfillmentErrors = validateFulfillments(fulfillment, i, on_confirm.documents)
        if (fulfillmentErrors) {
          errorObj[`fulfillment${i}`] = fulfillmentErrors
        }

        i++
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments object in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    //quote checks
    try {
      logger.info(`Checking quote object in /${constants.ON_CONFIRM}`)
      const quoteErrors = validateQuote(on_confirm, constants?.ON_CONFIRM)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking quote object in /${constants.ON_CONFIRM}`, error.stack)
    }

    try {
      logger.info(`Checking payment object in /${constants.ON_CONFIRM}`)
      const paymentError = validatePaymentsObject(on_confirm?.payments, constants.ON_CONFIRM)
      if (paymentError) Object.assign(errorObj, paymentError)
    } catch (error: any) {
      logger.error(`!!Error while checking payment object in /${constants.ON_CONFIRM}`, error.stack)
    }

    //checks cancellation_terms
    try {
      logger.info(`Checking cancellation terms in /${constants.ON_CONFIRM}`)
      const cancellationErrors = validateCancellationTerms(on_confirm?.cancellation_terms, constants.ON_CONFIRM)
      Object.assign(errorObj, cancellationErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation_terms in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    //check documents
    try {
      logger.info(`Checking documents in /${constants.ON_CONFIRM}`)
      const requiredDocumentCodes = ['LOAN_AGREEMENT']
      const cancellationErrors = validateDocuments(on_confirm?.documents, constants.ON_CONFIRM, requiredDocumentCodes)
      Object.assign(errorObj, cancellationErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking documents in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_CONFIRM} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}
