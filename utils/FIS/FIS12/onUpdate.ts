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
  validatePaymentsObject,
  // validatePayments,
  validateProvider,
  validateQuote,
} from './fisChecks'
import { validateLoanInfoTags, validateContactAndLspTags } from './tags'
import _, { isEmpty } from 'lodash'

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

    const schemaValidation = validateSchema('FIS12', constants.ON_UPDATE, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.UPDATE, action)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const on_update = message.order
    const version = getValue('version')
    const flowType = getValue('flow_type')

    //check order.id
    try {
      logger.info(`Checking id in message object  /${constants.ON_UPDATE}`)
      if (!on_update?.id) {
        errorObj.id = `Id in message object must be present/${constants.ON_UPDATE}`
      } else {
        const orderId = getValue('orderId')
        if (orderId != on_update?.id)
          errorObj.id = `order.id:${on_update?.id} mismatches with order id:${orderId} sent in ${constants.ON_CONFIRM}`
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
      logger.info(`Checking tags construct for provider`)
      const tagsValidation = validateContactAndLspTags(on_update?.provider?.tags)
      if (!tagsValidation.isValid) {
        Object.assign(errorObj, { providerTags: tagsValidation.errors })
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
              if (parentItemId && !parentItemId?.includes(item?.parent_item_id)) {
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
            [],
          )
          if (descriptorError) Object.assign(errorObj, descriptorError)

          // Validate Item tags
          // const tagsValidation: any = {}
          // if (LoanType == 'INVOICE_BASED_LOAN') {
          //   tagsValidation = validateLoanTags(item?.tags, constants.ON_CONFIRM)
          // } else {
          const tagsValidation: any = validateLoanInfoTags(item?.tags, flowType)
          // }
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
        let fulfillmentCode = 'DISBURSED'
        if (flow == fisFlows.FORECLOSURE_PERSONAL && action == FisApiSequence.ON_UPDATE_UNSOLICATED) {
          fulfillmentCode = 'COMPLETED'
        }

        const fulfillmentErrors = validateFulfillments(fulfillment, i, on_update.documents, fulfillmentCode)
        if (fulfillmentErrors) {
          errorObj[`fulfillment${i}`] = fulfillmentErrors
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

      let label = ''
      if (flow === fisFlows.FORECLOSURE_PERSONAL) {
        label = 'FORECLOSURE'
      } else if (flow === fisFlows.PRE_PART_PERSONAL) {
        label = 'PRE_PART_PAYMENT'
      } else if (flow === fisFlows.MISSED_EMI_PERSONAL) {
        label = 'MISSED_EMI_PAYMENT'
      }

      const paymentWithTags = payments.find((payment: any) => !!payment.tags)
      const newPaymentObj = payments.find((payment: any) => payment?.time?.label == label)
      // const labelPayments = payments.filter((payment: any) => !!payment.label)

      console.log('newPaymentObj-----', newPaymentObj)
      const paymentError = validatePaymentsObject([paymentWithTags], constants.ON_UPDATE)
      if (paymentError) {
        errorObj.payments = paymentError
      }

      if (flow != fisFlows.PERSONAL || flow != fisFlows.INVOICE) {
        const key = `payment_${label}`
        if (isEmpty(newPaymentObj)) {
          errorObj[key] = `payment object with label ${label} is missing`
        } else {
          if (!action.includes('unsolicated'))
            if (!newPaymentObj?.url) errorObj[`${key}.url`] = `url is missing for payment object with label ${label}`
            else if (newPaymentObj?.url)
              errorObj[`${key}.url`] =
                `url shouldn't be present for payment object with label ${label} for ${FisApiSequence.ON_UPDATE_UNSOLICATED}`
          // if (!newPaymentObj?.id) errorObj[`${key}.id`] = `id is missing for payment object with label ${label}`
          // if (!newPaymentObj?.status)
          //   errorObj[`${key}.status`] = `status is missing for payment object with label ${label}`
        }
      }

      console.log('errorObj', errorObj)

      // labelPayments?.map((payment: any, index: ) => {
      //   const key = `payment_${label}`
      //   if (payment?.time?.label !== 'INSTALLMENT' || payment?.time?.label != label) {
      //   }
      //   if (!newPaymentObj?.id) errorObj[`${key}.id`] = `id is missing for payment object with label ${label}`
      // })

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

      for (let i = 0; i < payments.length; i++) {
        const payment = payments[i]
        const key = `payment_${i}`

        if (!isEmpty(payment?.tags)) continue

        if (payment?.time && payment?.time?.label == 'INSTALLMENT') {
          if (payment?.time?.range) {
            const { start, end } = payment.time.range
            const startTime = new Date(start).getTime()
            const endTime = new Date(end).getTime()

            if (isNaN(startTime) || isNaN(endTime) || startTime > endTime) {
              errorObj[`${key}.invalidTimeRange`] = `Invalid time range for payments[${i}]`
            }

            if (i > 0) {
              const prevEndTime = new Date(payments[i - 1].time?.range?.end).getTime()
              if (startTime <= prevEndTime) {
                errorObj[`${key}.timeRangeOrderError`] = `Time range order error for payments[${i}]`
              }
            }
          } else {
            errorObj[`${key}.missingTimeRange`] = `Missing time.range for payments[${i}]`
          }
        }

        if (!payment?.id) errorObj[`${key}.id`] = `id is missing for payments[${i}]`
        if (!payment?.type) errorObj[`${key}.type`] = `type is missing for payments[${i}]`
        if (!payment?.params?.amount) errorObj[`${key}.params.amount`] = `params.amount is missing for payments[${i}]`
        if (!payment?.params?.currency)
          errorObj[`${key}.params.currency`] = `params.currency is missing for payments[${i}]`

        if (!payment?.time?.label) errorObj[`${key}.time.label`] = `time.label is missing for payments[${i}]`
        else if (payment?.time?.label !== 'INSTALLMENT' && i != 0)
          errorObj[`${key}.time.label`] = `time.label should be 'INSTALLMENT' at payments[${i}]`

        if (i == 0 && (flow != fisFlows?.PERSONAL || flow != fisFlows?.INVOICE) && payment?.time?.label == label) {
          if (action == FisApiSequence.ON_UPDATE_UNSOLICATED) {
            if (payment?.status !== 'PAID') {
              errorObj[`${key}.invalidPaymentStatus`] = `payment status should be PAID at index ${i}`
            }

            if (payment?.url) {
              errorObj[`${key}.url`] = `payment.url should not be present at index ${i}`
            }
          } else {
            if (!payment?.url) {
              errorObj[`${key}.url`] = `payment.url should be present at index ${i}`
            }
          }

          continue
        }

        if (flow === fisFlows.FORECLOSURE_PERSONAL && payment?.status) {
          if (payment?.status == 'NOT-PAID') unPaidInstallments++
          if (action == FisApiSequence.ON_UPDATE_UNSOLICATED && payment?.status == 'DEFERRED') defferedInstallments++
        }

        if (flow === fisFlows.MISSED_EMI_PERSONAL && payment?.status) {
          if (action == FisApiSequence.ON_UPDATE_UNSOLICATED && payment?.status == 'DEFERRED') defferedInstallments++
          if (action == FisApiSequence.ON_UPDATE && payment?.status == 'DELAYED') delayedInstallments++
        }

        // !personal -> solicated : count of NOT-PAID
        // !personal -> UNCOLICATED : count of DEFFERED
        // count of NOT-PAID == count of DEFFERED

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

        if (!payment.status) {
          errorObj[`${key}.invalidPaymentStatus`] = `missing payment.status at index ${i}`
        }
      }

      if (flow == fisFlows.FORECLOSURE_PERSONAL) {
        if (action == FisApiSequence.ON_UPDATE) {
          setValue('unPaidInstallments', unPaidInstallments)
        } else {
          const pastUnPaidCount: any = getValue('unPaidInstallments')
          if (pastUnPaidCount && pastUnPaidCount != defferedInstallments)
            errorObj.deffered = `No. of DEFERRED status object should be the same as no. of NOT-PAID status object from previous call`
        }
      }

      if (flow == fisFlows.MISSED_EMI_PERSONAL) {
        if (action == FisApiSequence.ON_UPDATE) {
          setValue('delayedInstallments', delayedInstallments)
        } else {
          const delayedCount: any = getValue('delayedInstallments')
          if (delayedCount && delayedCount != defferedInstallments)
            errorObj.deffered = `No. of DEFERRED status object should be the same as no. of DELAYED status object from previous call`
        }
      }

      if (action != FisApiSequence.ON_UPDATE_UNSOLICATED) {
        const buyerFinderFeesTag = payments[0].tags?.find((tag: any) => tag.descriptor.code === 'BUYER_FINDER_FEES')
        const settlementTermsTag = payments[0].tags?.find((tag: any) => tag.descriptor.code === 'SETTLEMENT_TERMS')

        if (!buyerFinderFeesTag) {
          errorObj.buyerFinderFees = `BUYER_FINDER_FEES tag is missing in payments`
        }

        if (!settlementTermsTag) {
          errorObj.settlementTerms = `SETTLEMENT_TERMS tag is missing in payments`
        }

        if (!payments[0].collected_by) {
          errorObj.payments = `collected_by  is missing in payments`
        } else {
          const allowedCollectedByValues = ['BPP', 'BAP']
          const allowedStatusValues = ['NOT-PAID', 'PAID']

          const collectedBy = getValue(`collected_by`)
          if (collectedBy && collectedBy !== payments[0].collected_by) {
            errorObj.collectedBy = `Collected_By didn't match with what was sent in previous call.`
          } else {
            if (!allowedCollectedByValues.includes(payments[0].collected_by)) {
              errorObj.collectedBy = `Invalid value for collected_by. It should be either BPP or BAP.`
            }

            setValue(`collected_by`, payments[0].collected_by)
          }

          if (!allowedStatusValues.includes(payments[0].status)) {
            errorObj.paymentStatus = `Invalid value for status. It should be either of NOT-PAID or PAID.`
          }
        }
      }
    } catch (error: any) {
      console.log('error', error)
      logger.error(`!!Error while checking payments details in /${constants.ON_UPDATE}`, error)
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
