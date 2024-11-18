/* eslint-disable no-prototype-builtins */
import constants, { FisApiSequence, fisFlows } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty, isValidUrl, isValidEmail, isValidPhoneNumber } from '../../'
import { getValue, setValue } from '../../../shared/dao'
import { validateCancellationTerms, validateContext, validateProvider, validateQuote } from './fisChecks'

export const checkOnStatus = (data: any, msgIdSet: any, flow: string) => {
  const onStatusObj: any = {}
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
      Object.assign(onStatusObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(onStatusObj, contextRes.ERRORS)
    }

    setValue(`${FisApiSequence.ON_STATUS}`, data)

    const on_status = message.order
    const itemIDS: any = getValue('ItmIDS')
    const itemIdArray: any[] = []

    let newItemIDSValue: any[]

    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      on_status.items.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
    }

    setValue('ItmIDS', newItemIDSValue)

    //provider checks
    try {
      logger.info(`Checking provider details in /${constants.ON_STATUS}`)
      const providerErrors = validateProvider(on_status?.provider, constants.ON_STATUS)
      Object.assign(onStatusObj, providerErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking provider details in /${constants.ON_STATUS}`, error.stack)
    }

    //check fulfillments
    try {
      logger.info(`checking fulfillments array in /${constants.ON_STATUS}`)
      const fulfillments = on_status.fulfillments
      if (!fulfillments) {
        onStatusObj.fulfillments = `fulfillments should be present & non empty in /${constants.ON_STATUS}`
      } else {
        fulfillments?.map((fulfillment: any, i: number) => {
          if (!fulfillment?.person?.name || typeof fulfillment?.person?.name !== 'string')
            onStatusObj.name = `person.name should be present with valid value in fulfillment${i} at /${constants.ON_STATUS}`

          if (!fulfillment?.contact?.email || !isValidEmail(fulfillment?.contact?.email))
            onStatusObj.email = `contact.email should be present with valid email in fulfillment${i} at /${constants.ON_STATUS}`

          if (!fulfillment?.contact?.phone || !isValidPhoneNumber(fulfillment?.contact?.phone))
            onStatusObj.phone = `contact.phone should be present with valid number in fulfillment${i} at /${constants.ON_STATUS}`

          if (fulfillment?.state?.descriptor?.code != 'FORM_PROCESSED')
            onStatusObj[`fulfillments.state`] =
              `code should be 'FORM_PROCESSED' in fulfillment${i} at /${constants.ON_STATUS}`
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments array in /${constants.ON_STATUS}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing item in and /${constants.ON_UPDATE}`)

      on_status.items.forEach((item: any, index: number) => {
        if (!newItemIDSValue.includes(item.id)) {
          const key = `item[${index}].item_id`
          onStatusObj[key] =
            `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in previous call`
        }

        if (
          item.xinput &&
          (!item.xinput.form_response || !item.xinput.form_response.status || !item.xinput.form_response.submission_id)
        ) {
          onStatusObj.xinput = `xinput or xinput.form_response is missing in /${constants.ON_STATUS}`
        }

        if (item.tags) {
          const loanInfoTag = item.tags.find((tag: any) => tag.descriptor.code === 'LOAN_INFO')
          if (!loanInfoTag) {
            onStatusObj[`loanInfoTagSubtagsMissing`] = `The LOAN_INFO tag group for Item ${item.id}: was not found`
          }
        }

        if (item?.descriptor?.code !== fisFlows[flow as keyof typeof fisFlows])
          onStatusObj[`item[${index}].code`] = `Descriptor code: ${
            item?.descriptor?.code
          } in item[${index}] must be the same as ${fisFlows[flow as keyof typeof fisFlows]}`

        if (on_status.quote.price.value !== item?.price?.value) {
          onStatusObj[`item${index}_price`] = `Price mismatch for item: ${item.id}`
        }
      })
    } catch (error: any) {
      logger.error(`!!Error while comparing Item in /${constants.ON_UPDATE}, ${error.stack}`)
    }

    //check quote
    try {
      logger.info(`Checking quote details in /${constants.ON_UPDATE}`)
      const quoteErrors = validateQuote(on_status?.quote)
      Object.assign(onStatusObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking quote details in /${constants.ON_UPDATE}`, error.stack)
    }

    try {
      logger.info(`Checking payments details in /${constants.ON_STATUS}`)

      const payments = on_status.payments

      const totalPaymentsAmount = payments
        .filter((payment: any) => payment.params && payment.params.amount)
        .reduce((total: any, payment: any) => total + parseFloat(payment.params.amount), 0)
      const quotePriceValue = parseFloat(on_status.quote.price.value)

      if (totalPaymentsAmount !== quotePriceValue) {
        onStatusObj.paymentsAmountMismatch = `Total payments amount (${totalPaymentsAmount}) does not match with quote.price.value (${quotePriceValue})`
      }

      for (let i = 1; i < payments.length; i++) {
        const payment = payments[i]

        if (payment.url) {
          if (!isValidUrl(payment.url)) {
            onStatusObj['invalidPaymentUrl'] = `Invalid payment url (${payment.url}) at index ${i}`
          } else {
            const updateValue = getValue(`updatePayment`)
            if (payment?.params?.amount !== updateValue)
              onStatusObj['invalidPaymentAmount'] =
                `Invalid payment amount (${payment.url}) at index ${i}, should be the same as sent in update call`
          }
        }

        if (payment.status !== 'PAID' && payment.status !== 'NOT-PAID') {
          onStatusObj.invalidPaymentStatus = `Invalid payment status (${payment.status}) at index ${i}`
        }

        if (payment.time && payment.time.range) {
          const { start, end } = payment.time.range
          const startTime = new Date(start).getTime()
          const endTime = new Date(end).getTime()

          if (isNaN(startTime) || isNaN(endTime) || startTime > endTime) {
            onStatusObj.invalidTimeRange = `Invalid time range for payment at index ${i}`
          }

          if (i > 0) {
            const prevEndTime = new Date(payments[i - 1].time.range.end).getTime()
            if (startTime <= prevEndTime) {
              onStatusObj.timeRangeOrderError = `Time range order error for payment at index ${i}`
            }
          }
        } else {
          onStatusObj.missingTimeRange = `Missing time range for payment at index ${i}`
        }
      }

      const buyerFinderFeesTag = payments[0].tags.find((tag: any) => tag.descriptor.code === 'BUYER_FINDER_FEES')
      const settlementTermsTag = payments[0].tags.find((tag: any) => tag.descriptor.code === 'SETTLEMENT_TERMS')

      if (!buyerFinderFeesTag) {
        onStatusObj.buyerFinderFees = `BUYER_FINDER_FEES tag is missing in payments`
      }

      if (!settlementTermsTag) {
        onStatusObj.settlementTerms = `SETTLEMENT_TERMS tag is missing in payments`
      }

      if (!payments[0].collected_by) {
        onStatusObj.payments = `collected_by  is missing in payments`
      } else {
        const allowedCollectedByValues = ['BPP', 'BAP']
        const allowedStatusValues = ['NOT-PAID', 'PAID']

        const collectedBy = getValue(`collected_by`)
        if (collectedBy && collectedBy !== payments[0].collected_by) {
          onStatusObj.collectedBy = `Collected_By didn't match with what was sent in previous call.`
        } else {
          if (!allowedCollectedByValues.includes(payments[0].collected_by)) {
            onStatusObj.collectedBy = `Invalid value for collected_by. It should be either BPP or BAP.`
          }

          setValue(`collected_by`, payments[0].collected_by)
        }

        if (!allowedStatusValues.includes(payments[0].status)) {
          onStatusObj.paymentStatus = `Invalid value for status. It should be either of NOT-PAID or PAID.`
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking payments details in /${constants.ON_STATUS}`, error.stack)
    }

    try {
      logger.info(`Checking cancellation terms in /${constants.ON_STATUS}`)
      const cancellationErrors = validateCancellationTerms(on_status?.cancellation_terms)
      Object.assign(onStatusObj, cancellationErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation_terms in /${constants.ON_STATUS}, ${error.stack}`)
    }

    try {
      logger.info(`Checking documents in /${constants.ON_STATUS}`)
      const documents = on_status.documents

      if (!documents || !Array.isArray(documents) || documents.length === 0) {
        onStatusObj.documents = 'Documents array is missing or empty in order'
      } else {
        documents.forEach((document, index) => {
          const documentKey = `documents[${index}]`

          if (!document.descriptor || !document.descriptor.code) {
            onStatusObj[`${documentKey}.code`] = 'Document descriptor is missing or empty'
          }

          if (!document.descriptor || !document.descriptor.name) {
            onStatusObj[`${documentKey}.name`] = 'Document descriptor name is missing or empty'
          }

          if (!document.descriptor || !document.descriptor.short_desc) {
            onStatusObj[`${documentKey}.short_desc`] = 'Document descriptor short_desc is missing or empty'
          }

          if (!document.descriptor || !document.descriptor.long_desc) {
            onStatusObj[`${documentKey}.long_desc`] = 'Document descriptor long_desc is missing or empty'
          }

          if (!document.mime_type) {
            onStatusObj[`${documentKey}.mime_type`] = 'Document mime_type is missing or empty'
          } else {
            const allowedMimeTypes = ['application/pdf']
            if (!allowedMimeTypes.includes(document.mime_type)) {
              onStatusObj[`${documentKey}.mime_type`] = `Invalid mime_type: ${document.mime_type}`
            }
          }

          if (!document.url) {
            onStatusObj[`${documentKey}.url`] = 'Document URL is missing or empty'
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking documents in /${constants.ON_STATUS}, ${error.stack}`)
    }

    //check claim health status
    try {
      logger.info(`Checking claim health insurance status in /${constants.ON_STATUS}`)
      const claimHealthStatus = message.order.fulfillments[1].state.descriptor.code
      if (claimHealthStatus !== 'CLAIM_PROCESSING' || claimHealthStatus !== 'CLAIM_PROCESSED') {
        onStatusObj.claimHealthStatus = `Claim health insurance status should be CLAIM_PROCESSING or CLAIM_PROCESSED in /${constants.ON_STATUS}`
      }
    } catch (error: any) {
      logger.error(`!!Error while checking claim health insurance status in /${constants.ON_STATUS}`, error.stack)
    }

    return onStatusObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_STATUS} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}
