/* eslint-disable no-prototype-builtins */
import constants, { FisApiSequence, fisFlows } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty, isValidUrl } from '../../'
import { getValue, setValue } from '../../../shared/dao'
import { validateContext, validateFulfillments } from './fisChecks'

const cancellationTermsState = new Map()

export const checkOnUpdate = (data: any, msgIdSet: any, flow: string) => {
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
          const loanInfoTag = item.tags.find((tag: any) => tag.descriptor.code === 'LOAN-INFO')
          if (!loanInfoTag) {
            onUpdateObj[`loanInfoTagSubtagsMissing`] = `The LOAN_INFO tag group for Item ${item.id}: was not found`
          }
        }

        if (item?.descriptor?.code !== fisFlows[flow as keyof typeof fisFlows])
          onUpdateObj[`item[${index}].code`] = `Descriptor code: ${
            item?.descriptor?.code
          } in item[${index}] must be the same as ${fisFlows[flow as keyof typeof fisFlows]}`

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

      for (let i = 1; i < payments.length; i++) {
        const payment = payments[i]

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

        if (payment.time && payment.time.range) {
          const { start, end } = payment.time.range
          const startTime = new Date(start).getTime()
          const endTime = new Date(end).getTime()

          if (isNaN(startTime) || isNaN(endTime) || startTime > endTime) {
            onUpdateObj.invalidTimeRange = `Invalid time range for payment at index ${i}`
          }

          if (i > 0) {
            const prevEndTime = new Date(payments[i - 1].time.range.end).getTime()
            if (startTime <= prevEndTime) {
              onUpdateObj.timeRangeOrderError = `Time range order error for payment at index ${i}`
            }
          }
        } else {
          onUpdateObj.missingTimeRange = `Missing time range for payment at index ${i}`
        }
      }

      const buyerFinderFeesTag = payments[0].tags.find((tag: any) => tag.descriptor.code === 'BUYER_FINDER_FEES')
      const settlementTermsTag = payments[0].tags.find((tag: any) => tag.descriptor.code === 'SETTLEMENT_TERMS')

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
        const allowedStatusValues = ['NOT_PAID', 'PAID']

        const collectedBy = getValue(`collected_by`)
        if (collectedBy && collectedBy !== payments[0].collected_by) {
          onUpdateObj.collectedBy = `Collected_By didn't matched with what was send in previous call.`
        } else {
          if (!allowedCollectedByValues.includes(payments[0].collected_by)) {
            onUpdateObj.collectedBy = `Invalid value for collected_by. It should be either BPP or BAP.`
          }

          setValue(`collected_by`, payments[0].collected_by)
        }

        if (!allowedStatusValues.includes(payments[0].status)) {
          onUpdateObj.paymentStatus = `Invalid value for status. It should be either of NOT_PAID or PAID.`
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking payments details in /${constants.ON_UPDATE}`, error.stack)
    }

    try {
      logger.info(`Checking cancellation terms in /${constants.ON_UPDATE}`)
      const cancellationTerms = on_update.cancellation_terms

      if (cancellationTerms && cancellationTerms.length > 0) {
        for (let i = 0; i < cancellationTerms.length; i++) {
          const cancellationTerm = cancellationTerms[i]

          if (
            cancellationTerm.fulfillment_state &&
            cancellationTerm.fulfillment_state.descriptor &&
            cancellationTerm.fulfillment_state.descriptor.code &&
            (!cancellationTerm.cancellation_fee ||
              !cancellationTerm.cancellation_fee.percentage ||
              isNaN(parseFloat(cancellationTerm.cancellation_fee.percentage)) ||
              parseFloat(cancellationTerm.cancellation_fee.percentage) <= 0 ||
              !Number.isInteger(parseFloat(cancellationTerm.cancellation_fee.percentage)))
          ) {
            onUpdateObj.cancellationFee = `Cancellation fee is required and must be bounded by 0 and 100 for Cancellation Term[${i}]`
          }

          const descriptorCode = cancellationTerm.fulfillment_state.descriptor.code
          const storedPercentage = cancellationTermsState.get(descriptorCode)

          if (storedPercentage !== undefined && storedPercentage !== cancellationTerm.cancellation_fee.percentage) {
            onUpdateObj.cancellationFee = `Cancellation terms percentage for ${descriptorCode} has changed`
          }
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation terms in /${constants.ON_UPDATE}, ${error.stack}`)
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
