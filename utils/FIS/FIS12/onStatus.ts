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
  validateQuote,
  validateXInputSubmission,
} from './fisChecks'
import { validateLoanInfoTags, validateLoanTags, validatePaymentTags } from './tags'
import _, { isEmpty } from 'lodash'

export const checkOnStatus = (data: any, msgIdSet: any, sequence: string, flow: string) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [FisApiSequence.ON_STATUS]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('FIS', constants.ON_STATUS, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.STATUS, constants.ON_STATUS)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    setValue(`${FisApiSequence.ON_STATUS}`, data)

    const on_status = message.order
    const version: any = getValue('version')
    // const LoanType: any = getValue('LoanType')
    const flowType = getValue('flow_type')

    try {
      logger.info(`Checking provider id /${constants.ON_STATUS}`)
      if (on_status.provider.id != getValue('providerId')) {
        errorObj.prvdrId = `Provider Id mismatches in /${constants.ON_SEARCH} and /${constants.ON_STATUS}`
      }

      logger.info(`Checking tags in /${constants.ON_STATUS}`)
      const providerTags = on_status.provider.tags

      if (!providerTags || !Array.isArray(providerTags) || providerTags.length === 0) {
        errorObj.tags = 'Tags array is missing or empty in provider'
      }
    } catch (error: any) {
      logger.error(`!!Error while checking provider id /${constants.ON_STATUS}, ${error.stack}`)
    }

    //checks items
    try {
      logger.info(`Comparing item in /${constants.ON_STATUS}`)
      if (_.isEmpty(on_status?.items)) {
        errorObj['items'] = 'items array is missing or empty in message.order'
      } else {
        const selectedItemId = getValue('selectedItemId')
        on_status.items.forEach((item: any, index: number) => {
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
            constants.ON_STATUS,
            `items[${index}].descriptor`,
            false,
            [],
          )
          if (descriptorError) Object.assign(errorObj, descriptorError)

          // Validate xinput
          if (sequence != FisApiSequence.ON_STATUS) {
            const xinput = item?.xinput
            const xinputValidationErrors = validateXInputSubmission(xinput, index, sequence)
            if (xinputValidationErrors) Object.assign(errorObj, xinputValidationErrors)
          }

          // Validate Item tags
          // let tagsValidation: any = {}
          // if (LoanType == 'INVOICE_BASED_LOAN') {
          //   tagsValidation = validateLoanTags(item?.tags, constants.ON_STATUS)
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
      logger.error(`!!Error while checking items object in /${constants.ON_STATUS}, ${error.stack}`)
    }

    //quote checks
    try {
      logger.info(`Checking quote object in /${constants.ON_STATUS}`)
      const quoteErrors = validateQuote(on_status, constants?.ON_STATUS)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking quote object in /${constants.ON_STATUS}`, error.stack)
    }

    if (sequence != FisApiSequence.ON_STATUS_EKYC) {
      // check fulfillments
      try {
        logger.info(`Checking fulfillments objects in /${constants.ON_STATUS}`)
        let i = 0
        const len = on_status.fulfillments.length
        let fulfillmentCode = 'INITIATED'
        if (sequence == FisApiSequence.ON_STATUS_ESIGN) fulfillmentCode = 'CONSENT_REQUIRED'
        while (i < len) {
          const fulfillment = on_status.fulfillments[i]
          const fulfillmentErrors = validateFulfillments(fulfillment, i, on_status.documents, fulfillmentCode)
          if (fulfillmentErrors) {
            errorObj[`fulfillment${i}`] = fulfillmentErrors
          }

          i++
        }
      } catch (error: any) {
        logger.error(`!!Error while checking fulfillments object in /${constants.ON_STATUS}, ${error.stack}`)
      }

      // check payments
      try {
        logger.info(`Checking payments in /${constants.ON_STATUS}`)
        const payments = on_status?.payments

        if (sequence === FisApiSequence.ON_STATUS_ESIGN || sequence == FisApiSequence.ON_STATUS) {
          const paymentError = validatePaymentsObject(payments, constants.ON_STATUS)
          if (paymentError) Object.assign(errorObj, paymentError)
        } else {
          if (isEmpty(payments)) {
            errorObj.payments = `payments array is missing or is empty`
          } else {
            const allowedStatusValues = ['NOT-PAID', 'PAID']
            payments?.forEach((arr: any, i: number) => {
              const terms = [
                { code: 'SETTLEMENT_WINDOW', type: 'time', value: '/^PTd+[MH]$/' },
                {
                  code: 'SETTLEMENT_BASIS',
                  type: 'enum',
                  value: ['INVOICE_RECEIPT', 'Delivery'],
                },
                { code: 'MANDATORY_ARBITRATION', type: 'boolean' },
                { code: 'STATIC_TERMS', type: 'url' },
                { code: 'COURT_JURISDICTION', type: 'string' },
                { code: 'SETTLEMENT_AMOUNT', type: 'amount' },
                {
                  code: 'OFFLINE_CONTRACT',
                  type: 'boolean',
                },
              ]

              if (!arr?.collected_by) {
                errorObj[`payemnts[${i}]_collected_by`] =
                  `payments.collected_by must be present in ${constants.ON_STATUS}`
              } else {
                const collectedBy = getValue(`collected_by`)
                if (collectedBy && collectedBy != arr?.collected_by)
                  errorObj[`payemnts[${i}]_collected_by`] =
                    `payments.collected_by value sent in ${constants.ON_STATUS} should be same as sent in past call: ${collectedBy}`
              }

              // check status
              if (!arr?.status) errorObj.paymentStatus = `payment.status is missing for index:${i} in payments`
              else if (!arr?.status || !allowedStatusValues.includes(arr?.status)) {
                errorObj.paymentStatus = `invalid status at index:${i} in payments, should be either of ${allowedStatusValues}`
              }

              // check type
              const validTypes = ['ON_ORDER', 'ON_FULFILLMENT', 'POST_FULFILLMENT']
              if (!arr?.type || !validTypes.includes(arr.type)) {
                errorObj[`payments[${i}]_type`] = `payments.type must be present in ${
                  constants.ON_STATUS
                } & its value must be one of: ${validTypes.join(', ')}`
              }

              // Validate payment tags
              const tagsValidation = validatePaymentTags(arr?.tags, terms)
              if (!tagsValidation.isValid) {
                Object.assign(errorObj, { tags: tagsValidation.errors })
              }
            })
          }
        }
      } catch (error: any) {
        logger.error(`!!Errors while checking payments in /${constants.ON_STATUS}, ${error.stack}`)
      }

      // check cancellation_terms
      try {
        logger.info(`Checking cancellation terms in /${constants.ON_STATUS}`)
        const cancellationErrors = validateCancellationTerms(on_status?.cancellation_terms, constants.ON_STATUS)
        Object.assign(errorObj, cancellationErrors)
      } catch (error: any) {
        logger.error(`!!Error while checking cancellation_terms in /${constants.ON_STATUS}, ${error.stack}`)
      }

      //check order.id
      if (sequence != FisApiSequence.ON_STATUS_ENACH) {
        try {
          logger.info(`Checking id in message object  /${constants.ON_STATUS}`)
          if (!on_status?.id) {
            errorObj.id = `Id in message object must be present/${constants.ON_STATUS}`
          } else {
            const orderId = getValue('orderId')
            if (orderId != on_status?.id)
              errorObj.id = `order.id:${on_status?.id} mismatches with order id:${orderId} sent in ${constants.ON_CONFIRM}`
          }
        } catch (error: any) {
          logger.error(`!!Error while checking id in message object  /${constants.ON_STATUS}, ${error.stack}`)
        }

        //check documents
        try {
          logger.info(`Checking documents in /${constants.ON_STATUS}`)
          const requiredDocumentCodes = ['LOAN_AGREEMENT', 'LOAN_CANCELLATION']
          const cancellationErrors = validateDocuments(on_status?.documents, constants.ON_STATUS, requiredDocumentCodes)
          Object.assign(errorObj, cancellationErrors)
        } catch (error: any) {
          logger.error(`!!Error while checking documents in /${constants.ON_STATUS}, ${error.stack}`)
        }
      }
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_STATUS} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}
