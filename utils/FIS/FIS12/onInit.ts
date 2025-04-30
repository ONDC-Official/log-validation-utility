/* eslint-disable no-prototype-builtins */
import _, { isEmpty } from 'lodash'
import constants, { FisApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty } from '../../'
import {
  validateCancellationTerms,
  validateContext,
  validateDescriptor,
  validateFulfillments,
  validateXInput,
  validateProvider,
  validateQuote,
  validatePaymentsObject,
} from './fisChecks'
import { getValue, setValue } from '../../../shared/dao'
import { validateLoanInfoTags, validatePaymentTags, validateContactAndLspTags } from './tags'

export const checkOnInit = (data: any, msgIdSet: any, sequence: string) => {
  try {
    const errorObj: any = {}
    if (!data || isObjectEmpty(data)) {
      return { [constants.ON_INIT]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('FIS', constants.ON_INIT, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.INIT, constants.ON_INIT)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    setValue(`${constants.ON_INIT}`, data)

    const on_init = message.order
    const version: any = getValue('version')
    // const LoanType: any = getValue('LoanType')
    const flowType = getValue('flow_type')

    //provider checks
    try {
      logger.info(`Checking provider details in /${constants.ON_INIT}`)
      const providerErrors = validateProvider(on_init?.provider, constants.ON_INIT)
      Object.assign(errorObj, providerErrors)

      // Validate tags
      logger.info(`Checking tags construct for provider`)
      const tagsValidation = validateContactAndLspTags(on_init?.provider?.tags)
      if (!tagsValidation.isValid) {
        Object.assign(errorObj, { providerTags: tagsValidation.errors })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking provider details in /${constants.ON_INIT}`, error.stack)
    }

    //checks items
    try {
      logger.info(`Comparing item in /${constants.ON_INIT}`)

      if (_.isEmpty(on_init?.items)) {
        errorObj['items'] = 'items array is missing or empty in message.order'
      } else {
        const selectedItemId = getValue('selectedItemId')
        on_init.items.forEach((item: any, index: number) => {
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
            constants.ON_INIT,
            `items[${index}].descriptor`,
            false,
            [],
          )
          if (descriptorError) Object.assign(errorObj, descriptorError)

          // Validate xinput
          const xinput = item?.xinput
          const currIndex = parseInt(sequence.replace('on_init_', ''))
          const xinputValidationErrors = validateXInput(xinput, index, constants.ON_INIT, currIndex ? currIndex - 1 : 0)
          if (xinputValidationErrors) {
            Object.assign(errorObj, xinputValidationErrors)
          }

          // Validate Item tags
          // let tagsValidation: any = {}
          // if (LoanType == 'INVOICE_BASED_LOAN') {
          //   tagsValidation = validateLoanTags(item?.tags, sequence)
          // } else {
          //   tagsValidation = validateLoanInfoTags(item?.tags, LoanType)
          // }
          const tagsValidation: any = validateLoanInfoTags(item?.tags, flowType)
          if (!tagsValidation.isValid) {
            Object.assign(errorObj, { tags: tagsValidation.errors })
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking items object in /${constants.ON_INIT}, ${error.stack}`)
    }

    //checks cancellation_terms
    try {
      logger.info(`Checking cancellation terms in /${constants.ON_INIT}`)
      const cancellationErrors = validateCancellationTerms(on_init?.cancellation_terms, constants.ON_INIT)
      Object.assign(errorObj, cancellationErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation_terms in /${constants.ON_INIT}, ${error.stack}`)
    }

    //fulfillments checks
    try {
      logger.info(`Checking fulfillments objects in /${constants.ON_INIT}`)
      let i = 0
      const len = on_init.fulfillments.length
      while (i < len) {
        const fulfillment = on_init.fulfillments[i]
        const fulfillmentErrors = validateFulfillments(fulfillment, i)
        if (fulfillmentErrors) {
          errorObj[`fulfillment${i}`] = fulfillmentErrors
        }

        i++
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments object in /${constants.ON_INIT}, ${error.stack}`)
    }

    // check payments
    try {
      logger.info(`Checking payments in /${constants.ON_INIT}`)
      const payments = on_init?.payments

      if (sequence === FisApiSequence.ON_INIT_3 && version == '2.0.0') {
        const paymentError = validatePaymentsObject(payments, constants.ON_INIT)
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
              // { code: 'DELAY_INTEREST', type: 'amount' },
              { code: 'SETTLEMENT_AMOUNT', type: 'amount' },
              // { code: 'SETTLEMENT_TYPE', type: 'enum', value: ['upi', 'neft', 'rtgs'] },
              {
                code: 'OFFLINE_CONTRACT',
                type: 'boolean',
              },
            ]

            if (!arr?.collected_by) {
              errorObj[`payemnts[${i}]_collected_by`] = `payments.collected_by must be present in ${constants.ON_INIT}`
            } else {
              const collectedBy = getValue(`collected_by`)
              if (collectedBy && collectedBy != arr?.collected_by)
                errorObj[`payemnts[${i}]_collected_by`] =
                  `payments.collected_by value sent in ${constants.ON_INIT} should be same as sent in past call: ${collectedBy}`
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
                constants.ON_INIT
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
      logger.error(`!!Errors while checking payments in /${constants.ON_INIT}, ${error.stack}`)
    }

    //quote checks
    try {
      logger.info(`Checking quote object in /${constants.ON_INIT}`)
      const quoteErrors = validateQuote(on_init, constants?.ON_INIT)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking quote object in /${constants.ON_INIT}`, error.stack)
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_INIT} API`, err)
    return { error: err.message }
  }
}
