/* eslint-disable no-prototype-builtins */
import constants, { FisApiSequence, fisFlows } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty, isValidUrl } from '../../'
import { getValue, setValue } from '../../../shared/dao'
import { validateCancellationTerms, validateContext, validateFulfillments } from './fisChecks'

export const checkOnUpdate = (data: any, msgIdSet: any, flow: string, action: string) => {
  const onUpdateObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [FisApiSequence.ON_UPDATE]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.ON_UPDATE, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.UPDATE, constants.ON_UPDATE)

    if (schemaValidation !== 'error') {
      Object.assign(onUpdateObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(onUpdateObj, contextRes.ERRORS)
    }

    setValue(`${FisApiSequence.ON_UPDATE}`, data)
    const on_update = message.order
    const itemIDS: any = getValue('ItmIDS')
    const itemIdArray: any[] = []

    let newItemIDSValue: any[]

    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      on_update.items.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
    }

    setValue('ItmIDS', newItemIDSValue)

    try {
      logger.info(`Checking provider id /${constants.ON_UPDATE}`)
      if (on_update.provider.id != getValue('providerId')) {
        onUpdateObj.prvdrId = `Provider Id mismatches in /${constants.ON_SEARCH} and /${constants.ON_UPDATE}`
      }

      logger.info(`Checking tags in /${constants.ON_UPDATE}`)
      const providerTags = on_update.provider.tags

      if (!providerTags || !Array.isArray(providerTags) || providerTags.length === 0) {
        onUpdateObj.tags = 'Tags array is missing or empty in provider'
      }
    } catch (error: any) {
      logger.error(`!!Error while checking provider id /${constants.ON_UPDATE}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing item in and /${constants.ON_UPDATE}`)

      on_update.items.forEach((item: any, index: number) => {
        if (!newItemIDSValue.includes(item.id)) {
          const key = `item[${index}].item_id`
          onUpdateObj[
            key
          ] = `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in previous call`
        }

        if (item.tags) {
          const loanInfoTag = item.tags.find((tag: any) => tag.descriptor.code === 'LOAN_INFO')
          if (!loanInfoTag) {
            onUpdateObj[`loanInfoTagSubtagsMissing`] = `The LOAN_INFO tag group for Item ${item.id}: was not found`
          }
        }

        if (item?.descriptor?.code !== fisFlows.PERSONAL)
          onUpdateObj[
            `item[${index}].code`
          ] = `Descriptor code: ${item?.descriptor?.code} in item[${index}] must be the same as ${flow}`

        if (on_update.quote.price.value !== item?.price?.value) {
          onUpdateObj[`item${index}_price`] = `Price mismatch for item: ${item.id}`
        }
      })
    } catch (error: any) {
      logger.error(`!!Error while comparing Item in /${constants.ON_UPDATE}, ${error.stack}`)
    }

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
          onUpdateObj.fulfillmentState = `Fulfillment[${i}] state descriptor code should be 'COMPLETED'`
        }

        if (fulfillmentErrors) {
          Object.assign(onUpdateObj, fulfillmentErrors)
        }

        i++
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments object in /${constants.ON_UPDATE}, ${error.stack}`)
    }

    try {
      logger.info(`Checking quote details in /${constants.ON_UPDATE}`)

      const quote = on_update.quote
      const quoteBreakup = quote.breakup

      const requiredBreakupItems = [
        'PRINCIPAL',
        'INTEREST',
        'NET_DISBURSED_AMOUNT',
        'OTHER_UPFRONT_CHARGES',
        'INSURANCE_CHARGES',
        'OTHER_CHARGES',
        'PROCESSING_FEE',
      ]
      const missingBreakupItems = requiredBreakupItems.filter(
        (item) => !quoteBreakup.find((breakupItem: any) => breakupItem.title.toUpperCase() === item),
      )

      if (missingBreakupItems.length > 0) {
        onUpdateObj.missingBreakupItems = `Quote breakup is missing the following items: ${missingBreakupItems.join(
          ', ',
        )}`
      }

      const totalBreakupValue = quoteBreakup.reduce(
        (total: any, item: any) =>
          total + (item.title.toUpperCase() != 'NET_DISBURSED_AMOUNT' ? parseFloat(item.price.value) : 0),
        0,
      )
      const priceValue = parseFloat(quote.price.value)

      if (totalBreakupValue !== priceValue) {
        onUpdateObj.breakupTotalMismatch = `Total of quote breakup (${totalBreakupValue}) does not match with price.value (${priceValue})`
      }

      const currencies = quoteBreakup.map((item: any) => item.currency)
      if (new Set(currencies).size !== 1) {
        onUpdateObj.multipleCurrencies = 'Currency must be the same for all items in the quote breakup'
      }

      if (!quote.ttl) {
        onUpdateObj.missingTTL = 'TTL is required in the quote'
      }
    } catch (error: any) {
      logger.error(`!!Error while checking quote details in /${constants.ON_UPDATE}`, error.stack)
    }

    try {
      logger.info(`Checking payments details in /${constants.ON_UPDATE}`)

      const payments = on_update.payments

      const totalPaymentsAmount = payments
        .filter((payment: any) => payment.params && payment.params.amount)
        .reduce((total: any, payment: any) => total + parseFloat(payment.params.amount), 0)
      const quotePriceValue = parseFloat(on_update.quote.price.value)

      if (totalPaymentsAmount !== quotePriceValue) {
        onUpdateObj.paymentsAmountMismatch = `Total payments amount (${totalPaymentsAmount}) does not match with quote.price.value (${quotePriceValue})`
      }

      let unPaidInstallments = 0
      let defferedInstallments = 0
      let delayedInstallments = 0

      for (let i = 0; i < payments.length; i++) {
        const payment = payments[i]

        if (i == 0 && flow != fisFlows?.PERSONAL && payment?.time?.label) {
          if (payment?.time?.label != flow) {
            onUpdateObj['label'] = `label should be present & it's value should be ${flow}`
          }

          if (action == FisApiSequence.ON_UPDATE_UNSOLICATED) {
            if (payment?.status !== 'PAID') {
              onUpdateObj.invalidPaymentStatus = `payment status should be PAID at index ${i}`
            }

            if (payment?.url) {
              onUpdateObj['payment.url'] = `payment.url should not be present at index ${i}`
            }
          } else {
            if (!payment?.url) {
              onUpdateObj['payment.url'] = `payment.url should be present at index ${i}`
            }
          }

          continue
        }

        if (flow === fisFlows.LOAN_FORECLOSURE && payment?.status) {
          if (payment?.status == 'NOT-PAID') unPaidInstallments++
          if (action == FisApiSequence.ON_UPDATE_UNSOLICATED && payment?.status == 'DEFERRED') defferedInstallments++
        }

        if (flow === fisFlows.MISSED_EMI_PAYMENT && payment?.status) {
          if (action == FisApiSequence.ON_UPDATE_UNSOLICATED && payment?.status == 'DEFERRED') defferedInstallments++
          if (action == FisApiSequence.ON_UPDATE && payment?.status == 'DELAYED') delayedInstallments++
        }

        // !personal -> solicated : count of NOT-PAID
        // !personal -> UNCOLICATED : count of DEFFERED
        // count of NOT-PAID == count of DEFFERED

        if (payment.url) {
          if (!isValidUrl(payment.url)) {
            onUpdateObj['invalidPaymentUrl'] = `Invalid payment url (${payment.url}) at index ${i}`
          } else {
            const updateValue = getValue(`updatePayment`)
            if (payment?.params?.amount !== updateValue)
              onUpdateObj[
                'invalidPaymentAmount'
              ] = `Invalid payment amount (${payment.url}) at index ${i}, should be the same as sent in update call`
          }
        }

        if (payment.status !== 'PAID' && payment.status !== 'NOT-PAID') {
          onUpdateObj.invalidPaymentStatus = `Invalid payment status (${payment.status}) at index ${i}`
        }

        if (payment?.time && payment?.time?.range) {
          const { start, end } = payment.time.range
          const startTime = new Date(start).getTime()
          const endTime = new Date(end).getTime()

          if (isNaN(startTime) || isNaN(endTime) || startTime > endTime) {
            onUpdateObj.invalidTimeRange = `Invalid time range for payment at index ${i}`
          }

          if (i > 0) {
            const prevEndTime = new Date(payments[i - 1].time?.range?.end).getTime()
            if (startTime <= prevEndTime) {
              onUpdateObj.timeRangeOrderError = `Time range order error for payment at index ${i}`
            }
          }
        } else {
          onUpdateObj.missingTimeRange = `Missing time range for payment at index ${i}`
        }
      }

      if (flow == fisFlows.LOAN_FORECLOSURE) {
        if (action == FisApiSequence.ON_UPDATE) {
          setValue('unPaidInstallments', unPaidInstallments)
        } else {
          const pastUnPaidCount: any = getValue('unPaidInstallments')
          if (pastUnPaidCount && pastUnPaidCount != defferedInstallments)
            onUpdateObj.deffered = `No. of DEFERRED status object should be the same as no. of NOT-PAID status object from previous call`
        }
      }

      if (flow == fisFlows.MISSED_EMI_PAYMENT) {
        if (action == FisApiSequence.ON_UPDATE) {
          setValue('delayedInstallments', delayedInstallments)
        } else {
          const delayedCount: any = getValue('delayedInstallments')
          if (delayedCount && delayedCount != defferedInstallments)
            onUpdateObj.deffered = `No. of DEFERRED status object should be the same as no. of DELAYED status object from previous call`
        }
      }

      if (action != FisApiSequence.ON_UPDATE_UNSOLICATED) {
        const buyerFinderFeesTag = payments[0].tags?.find((tag: any) => tag.descriptor.code === 'BUYER_FINDER_FEES')
        const settlementTermsTag = payments[0].tags?.find((tag: any) => tag.descriptor.code === 'SETTLEMENT_TERMS')

        if (!buyerFinderFeesTag) {
          onUpdateObj.buyerFinderFees = `BUYER_FINDER_FEES tag is missing in payments`
        }

        if (!settlementTermsTag) {
          onUpdateObj.settlementTerms = `SETTLEMENT_TERMS tag is missing in payments`
        }

        if (!payments[0].collected_by) {
          onUpdateObj.payments = `collected_by  is missing in payments`
        } else {
          const allowedCollectedByValues = ['BPP', 'BAP']
          const allowedStatusValues = ['NOT-PAID', 'PAID']

          const collectedBy = getValue(`collected_by`)
          if (collectedBy && collectedBy !== payments[0].collected_by) {
            onUpdateObj.collectedBy = `Collected_By didn't match with what was sent in previous call.`
          } else {
            if (!allowedCollectedByValues.includes(payments[0].collected_by)) {
              onUpdateObj.collectedBy = `Invalid value for collected_by. It should be either BPP or BAP.`
            }

            setValue(`collected_by`, payments[0].collected_by)
          }

          if (!allowedStatusValues.includes(payments[0].status)) {
            onUpdateObj.paymentStatus = `Invalid value for status. It should be either of NOT-PAID or PAID.`
          }
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking payments details in /${action} : `, error.stack)
    }

    try {
      logger.info(`Checking cancellation terms in /${constants.ON_UPDATE}`)
      const cancellationErrors = validateCancellationTerms(on_update?.cancellation_terms, constants.ON_UPDATE)
      Object.assign(onUpdateObj, cancellationErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation_terms in /${constants.ON_UPDATE}, ${error.stack}`)
    }

    try {
      logger.info(`Checking documents in /${constants.ON_UPDATE}`)
      const documents = on_update.documents

      if (!documents || !Array.isArray(documents) || documents.length === 0) {
        onUpdateObj.documents = 'Documents array is missing or empty in order'
      } else {
        documents.forEach((document, index) => {
          const documentKey = `documents[${index}]`

          if (!document.descriptor || !document.descriptor.code) {
            onUpdateObj[`${documentKey}.code`] = 'Document descriptor is missing or empty'
          }

          if (!document.descriptor || !document.descriptor.name) {
            onUpdateObj[`${documentKey}.name`] = 'Document descriptor name is missing or empty'
          }

          if (!document.descriptor || !document.descriptor.short_desc) {
            onUpdateObj[`${documentKey}.short_desc`] = 'Document descriptor short_desc is missing or empty'
          }

          if (!document.descriptor || !document.descriptor.long_desc) {
            onUpdateObj[`${documentKey}.long_desc`] = 'Document descriptor long_desc is missing or empty'
          }

          if (!document.mime_type) {
            onUpdateObj[`${documentKey}.mime_type`] = 'Document mime_type is missing or empty'
          } else {
            const allowedMimeTypes = ['application/pdf']
            if (!allowedMimeTypes.includes(document.mime_type)) {
              onUpdateObj[`${documentKey}.mime_type`] = `Invalid mime_type: ${document.mime_type}`
            }
          }

          if (!document.url) {
            onUpdateObj[`${documentKey}.url`] = 'Document URL is missing or empty'
          } else {
            if (!isValidUrl(document.url)) onUpdateObj[`${documentKey}.url`] = 'URL must be valid'
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking documents in /${constants.ON_UPDATE}, ${error.stack}`)
    }

    return onUpdateObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_UPDATE} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}
