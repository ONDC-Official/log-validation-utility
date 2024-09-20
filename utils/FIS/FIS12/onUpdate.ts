/* eslint-disable no-prototype-builtins */
import constants, { FisApiSequence, fisFlows } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty } from '../../'
import { getValue, setValue } from '../../../shared/dao'
import {
  validateCancellationTerms,
  validateContext,
  validateDescriptor,
  validateDocuments,
  validateFulfillments,
  // validatePayments,
  validateProvider,
  validateQuote,
} from './fisChecks'
import { validateLoanInfoTags, validateProviderTags, validatePaymentTags } from './tags'
import _ from 'lodash'

const validStatus = ['PAID', 'NOT-PAID']
export const checkOnUpdate = (data: any, msgIdSet: any, flow: string, action: string) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [FisApiSequence.ON_UPDATE]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('FIS', constants.ON_UPDATE, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.UPDATE, constants.ON_UPDATE)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const on_update = message.order
    const version = getValue('version')

    //check order.id
    try {
      logger.info(`Checking id in message object  /${constants.ON_UPDATE}`)
      if (!on_update?.id) {
        errorObj.id = `Id in message object must be present/${constants.ON_UPDATE}`
      } else {
        setValue('orderId', on_update?.id)
      }
    } catch (error: any) {
      logger.error(`!!Error while checking id in message object  /${constants.ON_UPDATE}, ${error.stack}`)
    }

    //provider checks
    try {
      logger.info(`Checking provider details in /${constants.ON_UPDATE}`)
      const providerErrors = validateProvider(on_update?.provider, constants.ON_UPDATE)
      Object.assign(errorObj, providerErrors)

      // Validate tags
      const tagsValidation = validateProviderTags(on_update?.provider?.tags)
      if (!tagsValidation.isValid) {
        Object.assign(providerErrors, { tags: tagsValidation.errors })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking provider details in /${constants.ON_UPDATE}`, error.stack)
    }

    //checks items
    try {
      logger.info(`Comparing item in /${constants.ON_UPDATE}`)

      if (_.isEmpty(on_update?.items)) {
        errorObj['items'] = 'items array is missing or empty in message.order'
      } else {
        const selectedItemId = getValue('selectedItemId')
        on_update.items.forEach((item: any, index: number) => {
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

          // Validate descriptor
          const descriptorError = validateDescriptor(
            item?.descriptor,
            constants.ON_UPDATE,
            `items[${index}].descriptor`,
            false,
          )
          if (descriptorError) Object.assign(errorObj, descriptorError)

          // Validate Item tags
          const tagsValidation = validateLoanInfoTags(item?.tags, flow)
          if (!tagsValidation.isValid) {
            Object.assign(errorObj, { tags: tagsValidation.errors })
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking items object in /${constants.ON_UPDATE}, ${error.stack}`)
    }

    //fulfillments checks
    try {
      logger.info(`Checking fulfillments objects in /${constants.ON_UPDATE}`)
      let i = 0
      const len = on_update.fulfillments.length
      while (i < len) {
        const fulfillment = on_update.fulfillments[i]
        const fulfillmentErrors = validateFulfillments(fulfillment, i, on_update.documents)
        if (
          flow == fisFlows.LOAN_FORECLOSURE &&
          action == FisApiSequence.ON_UPDATE_UNSOLICATED &&
          fulfillment?.state?.descriptor?.code &&
          fulfillment.state.descriptor.code !== 'COMPLETED'
        ) {
          errorObj.fulfillmentState = `Fulfillment[${i}] state descriptor code should be 'COMPLETED'`
        }

        if (fulfillmentErrors) {
          Object.assign(errorObj, fulfillmentErrors)
        }

        i++
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments object in /${constants.ON_UPDATE}, ${error.stack}`)
    }

    //quote checks
    try {
      logger.info(`Checking quote object in /${constants.ON_UPDATE}`)
      const quoteErrors = validateQuote(on_update, constants?.ON_UPDATE)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking quote object in /${constants.ON_UPDATE}`, error.stack)
    }

    try {
      logger.info(`Checking payments details in /${constants.ON_UPDATE}`)

      const payments = on_update.payments

      const totalPaymentsAmount = payments
        .filter((payment: any) => payment.params && payment.params.amount)
        .reduce((total: any, payment: any) => total + parseFloat(payment.params.amount), 0)
      const quotePriceValue = parseFloat(on_update.quote.price.value)

      if (totalPaymentsAmount !== quotePriceValue) {
        errorObj.paymentsAmountMismatch = `Total payments amount (${totalPaymentsAmount}) does not match with quote.price.value (${quotePriceValue})`
      }

      let unPaidInstallments = 0
      let defferedInstallments = 0
      let delayedInstallments = 0
      let labelObjCount = 0
      let additionalObjCount = 0
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
        { code: 'DELAY_INTEREST', type: 'amount' },
        { code: 'SETTLEMENT_AMOUNT', type: 'amount' },
        { code: 'SETTLEMENT_TYPE', type: 'enum', value: ['upi', 'neft', 'rtgs'] },
        {
          code: 'OFFLINE_CONTRACT',
          type: 'boolean',
        },
      ]

      console.log('labelObjCount', labelObjCount)
      console.log('additionalObjCount', additionalObjCount)

      payments?.map((payment: any, i: number) => {
        // if (i == 0 && flow != fisFlows?.PERSONAL && payment?.time?.label) {
        //   if (payment?.time?.label != flow) {
        //     errorObj['label'] = `label should be present & it's value should be ${
        //       fisFlows[flow as keyof typeof fisFlows]
        //     }`
        //   }

        //   if (action == FisApiSequence.ON_UPDATE_UNSOLICATED) {
        //     if (payment?.status !== 'PAID') {
        //       errorObj.invalidPaymentStatus = `payment status should be PAID at index ${i}`
        //     }

        //     if (payment?.url) {
        //       errorObj['payment.url'] = `payment.url should not be present at index ${i}`
        //     }
        //   } else {
        //     if (!payment?.url) {
        //       errorObj['payment.url'] = `payment.url should be present at index ${i}`
        //     }
        //   }

        //   return
        // }

        // check status
        if (payment?.status && validStatus?.includes(payment?.status)) {
          errorObj.invalidPaymentStatus = `Invalid payment status (${payment.status}) at index ${i}`
        }

        if (payment?.time?.label) {
          labelObjCount++

          if (payment?.time && payment?.time?.range) {
            const { start, end } = payment.time.range
            const startTime = new Date(start).getTime()
            const endTime = new Date(end).getTime()
  
            if (isNaN(startTime) || isNaN(endTime) || startTime > endTime) {
              errorObj.invalidTimeRange = `Invalid time range for payment at index ${i}`
            }
  
            if (i > 0) {
              const prevEndTime = new Date(payments[i - 1].time?.range?.end).getTime()
              if (startTime <= prevEndTime) {
                errorObj.timeRangeOrderError = `Time range order error for payment at index ${i}`
              }
            }
          } else {
            errorObj.missingTimeRange = `Missing time range for payment at index ${i}`
          }

          if (payment?.time?.label == 'INSTALLMENT') {
            if (flow === fisFlows.LOAN_FORECLOSURE && payment?.status) {
              if (payment?.status == 'NOT-PAID') unPaidInstallments++
              if (action == FisApiSequence.ON_UPDATE_UNSOLICATED && payment?.status == 'DEFERRED')
                defferedInstallments++
            }

            if (flow === fisFlows.MISSED_EMI_PAYMENT && payment?.status) {
              if (action == FisApiSequence.ON_UPDATE_UNSOLICATED && payment?.status == 'DEFERRED')
                defferedInstallments++
              if (action == FisApiSequence.ON_UPDATE && payment?.status == 'DELAYED') delayedInstallments++
            }
            // solicated : count of NOT-PAID
            // UNCOLICATED : count of DEFFERED
            // count of NOT-PAID == count of DEFFERED
          } else if (payment?.time?.label == flow) {
            if (action == FisApiSequence.ON_UPDATE_UNSOLICATED) {
              if (payment?.status !== 'PAID') {
                errorObj.invalidPaymentStatus = `payment status should be PAID at index ${i}`
              }

              if (payment?.url) {
                errorObj['payment.url'] = `payment.url should not be present at index ${i}`
              }
            } else {
              if (!payment?.url) {
                errorObj['payment.url'] = `payment.url should be present at index ${i}`
              }
            }
          } else {
            console.log('fisFlows[flow as keyof typeof fisFlows]',flow as keyof typeof fisFlows, fisFlows,  fisFlows[flow as keyof typeof fisFlows])
            errorObj['label'] = `label should be present & it's value should be ${
              fisFlows[flow as keyof typeof fisFlows]
            }`
          }
          return
        } else {
          additionalObjCount++
          // check collected_by
          if (!payment?.collected_by) {
            errorObj[`payemnts[${i}]_collected_by`] = `payments.collected_by must be present in ${action}`
          } else {
            const collectedBy = getValue(`collected_by`)
            if (collectedBy && collectedBy != payment?.collected_by)
              errorObj[`payemnts[${i}]_collected_by`] =
                `payments.collected_by value sent in ${action} should be same as sent in past call: ${collectedBy}`
          }

          // check type
          const validTypes = ['ON-ORDER', 'ON-FULFILLMENT', 'POST-FULFILLMENT']
          if (!payment?.type || !validTypes.includes(payment.type)) {
            errorObj[`payments[${i}]_type`] =
              `payments.type must be present in ${action} & its value must be one of: ${validTypes.join(', ')}`
          }

          // Validate payment tags
          const tagsValidation = validatePaymentTags(payment?.tags, terms)
          if (!tagsValidation.isValid) {
            Object.assign(errorObj, { tags: tagsValidation.errors })
          }
        }

        // if (payment.url) {
        //   if (!isValidUrl(payment.url)) {
        //     errorObj['invalidPaymentUrl'] = `Invalid payment url (${payment.url}) at index ${i}`
        //   } else {
        //     const updateValue = getValue(`updatePayment`)
        //     if (payment?.params?.amount !== updateValue)
        //       errorObj['invalidPaymentAmount'] =
        //         `Invalid payment amount (${payment.url}) at index ${i}, should be the same as sent in update call`
        //   }
        // }
      })

      if (flow == fisFlows.LOAN_FORECLOSURE) {
        if (action == FisApiSequence.ON_UPDATE) {
          setValue('unPaidInstallments', unPaidInstallments)
        } else {
          const pastUnPaidCount: any = getValue('unPaidInstallments')
          if (pastUnPaidCount && pastUnPaidCount != defferedInstallments)
            errorObj.deffered = `No. of DEFERRED status object should be the same as no. of NOT-PAID status object from previous call`
        }
      }

      if (flow == fisFlows.MISSED_EMI_PAYMENT) {
        if (action == FisApiSequence.ON_UPDATE) {
          setValue('delayedInstallments', delayedInstallments)
        } else {
          const delayedCount: any = getValue('delayedInstallments')
          if (delayedCount && delayedCount != defferedInstallments)
            errorObj.deffered = `No. of DEFERRED status object should be the same as no. of DELAYED status object from previous call`
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking payments details in /${constants.ON_UPDATE}`, error.stack)
    }

    //checks cancellation_terms
    try {
      logger.info(`Checking cancellation terms in /${constants.ON_UPDATE}`)
      const cancellationErrors = validateCancellationTerms(on_update?.cancellation_terms, constants.ON_UPDATE)
      Object.assign(errorObj, cancellationErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation_terms in /${constants.ON_UPDATE}, ${error.stack}`)
    }

    //check documents
    try {
      logger.info(`Checking documents in /${constants.ON_UPDATE}`)
      const requiredDocumentCodes = ['LOAN_AGREEMENT', 'LOAN_CANCELLATION']
      const cancellationErrors = validateDocuments(on_update?.documents, constants.ON_UPDATE, requiredDocumentCodes)
      Object.assign(errorObj, cancellationErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking documents in /${constants.ON_UPDATE}, ${error.stack}`)
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_UPDATE} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}
