/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { FisApiSequence, fisFlows } from '../../../constants'
import { logger } from '../../../shared/logger'
import {
  validateSchema,
  isObjectEmpty,
  checkFISContext,
  timeDiff as timeDifference,
  checkBppIdOrBapId,
  isValidUrl,
} from '../../'
import { getValue, setValue } from '../../../shared/dao'
import { validateFulfillments } from './fisChecks'

const cancellationTermsState = new Map()

export const checkOnStatus = (data: any, flow: string) => {
  const onStatusObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [FisApiSequence.ON_STATUS]: 'Json cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const searchContext: any = getValue(`${FisApiSequence.SEARCH}_context`)
    // const parentItemIdSet: any = getValue(`parentItemIdSet`)

    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.FIS_ONSTATUS, data)

    const contextRes: any = checkFISContext(context, constants.FIS_ONSTATUS)

    const checkBap = checkBppIdOrBapId(context.bap_id)
    const checkBpp = checkBppIdOrBapId(context.bpp_id)

    if (checkBap) Object.assign(onStatusObj, { bap_id: 'context/bap_id should not be a url' })
    if (checkBpp) Object.assign(onStatusObj, { bpp_id: 'context/bpp_id should not be a url' })

    if (schemaValidation !== 'error') {
      Object.assign(onStatusObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(onStatusObj, contextRes.ERRORS)
    }

    setValue(`${FisApiSequence.ON_STATUS}`, data)

    try {
      logger.info(`Comparing city of /${constants.FIS_UPDATE} and /${constants.FIS_ONSTATUS}`)
      if (!_.isEqual(searchContext.location.city, context.location.city)) {
        onStatusObj.city = `City code mismatch in /${constants.FIS_UPDATE} and /${constants.FIS_ONSTATUS}`
      }
    } catch (error: any) {
      logger.info(
        `Error while comparing city in /${constants.FIS_UPDATE} and /${constants.FIS_ONSTATUS}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing country of /${constants.FIS_UPDATE} and /${constants.FIS_ONSTATUS}`)
      if (!_.isEqual(searchContext.location.country, context.location.country)) {
        onStatusObj.country = `Country code mismatch in /${constants.FIS_UPDATE} and /${constants.FIS_ONSTATUS}`
      }
    } catch (error: any) {
      logger.info(
        `Error while comparing country in /${constants.FIS_UPDATE} and /${constants.FIS_ONSTATUS}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing timestamp of /${constants.FIS_STATUS} and /${constants.FIS_ONSTATUS}`)
      const tmpstmp = getValue('tmpstmp')
      if (_.gte(tmpstmp, context.timestamp)) {
        onStatusObj.tmpstmp = `Timestamp for /${constants.FIS_STATUS} api cannot be greater than or equal to /${constants.FIS_ONSTATUS} api`
      } else {
        const timeDiff = timeDifference(context.timestamp, tmpstmp)
        logger.info(timeDiff)
        if (timeDiff > 5000) {
          onStatusObj.tmpstmp = `context/timestamp difference between /${constants.FIS_ONSTATUS} and /${constants.FIS_STATUS} should be smaller than 5 sec`
        }
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.info(
        `Error while comparing timestamp for /${constants.FIS_STATUS} and /${constants.FIS_ONSTATUS} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.FIS_SELECT} and /${constants.FIS_ONSTATUS}`)
      if (!_.isEqual(getValue('txnId'), context.transaction_id)) {
        onStatusObj.txnId = `Transaction Id should be same from /${constants.FIS_SELECT} onwards`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing transaction ids for /${constants.FIS_SELECT} and /${constants.FIS_ONSTATUS} api, ${error.stack}`,
      )
    }

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

    try {
      logger.info(`Checking provider id /${constants.FIS_ONSTATUS}`)
      if (on_status.provider.id != getValue('providerId')) {
        onStatusObj.prvdrId = `Provider Id mismatches in /${constants.FIS_ONSEARCH} and /${constants.FIS_ONSTATUS}`
      }

      logger.info(`Checking tags in /${constants.FIS_ONSTATUS}`)
      const providerTags = on_status.provider.tags

      if (!providerTags || !Array.isArray(providerTags) || providerTags.length === 0) {
        onStatusObj.tags = 'Tags array is missing or empty in provider'
      }
    } catch (error: any) {
      logger.error(`!!Error while checking provider id /${constants.FIS_ONSTATUS}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing item in and /${constants.FIS_ONUPDATE}`)

      on_status.items.forEach((item: any, index: number) => {
        if (!newItemIDSValue.includes(item.id)) {
          const key = `item[${index}].item_id`
          onStatusObj[
            key
          ] = `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in previous call`
        }

        if (
          item.xinput &&
          (!item.xinput.form_response || !item.xinput.form_response.status || !item.xinput.form_response.submission_id)
        ) {
          onStatusObj.xinput = `xinput or xinput.form_response is missing in /${constants.FIS_ONSTATUS}`
        }

        if (item.tags) {
          const loanInfoTag = item.tags.find((tag: any) => tag.descriptor.code === 'LOAN-INFO')
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
      logger.error(`!!Error while comparing Item in /${constants.FIS_ONUPDATE}, ${error.stack}`)
    }

    try {
      logger.info(`Checking fulfillments objects in /${constants.FIS_ONSTATUS}`)
      let i = 0
      const len = on_status.fulfillments.length
      while (i < len) {
        const fulfillment = on_status.fulfillments[i]
        const fulfillmentErrors = validateFulfillments(fulfillment, i, on_status.documents)
        if (fulfillmentErrors) {
          Object.assign(onStatusObj, fulfillmentErrors)
        }

        i++
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments object in /${constants.FIS_ONSTATUS}, ${error.stack}`)
    }

    try {
      logger.info(`Checking quote details in /${constants.FIS_ONSTATUS}`)

      const quote = on_status.quote
      const quoteBreakup = quote.breakup

      const requiredBreakupItems = ['Principal', 'Interest', 'Processing Fee']
      const missingBreakupItems = requiredBreakupItems.filter(
        (item) => !quoteBreakup.find((breakupItem: any) => breakupItem.type === item),
      )

      if (missingBreakupItems.length > 0) {
        onStatusObj.missingBreakupItems = `Quote breakup is missing the following items: ${missingBreakupItems.join(
          ', ',
        )}`
      }

      const totalBreakupValue = quoteBreakup.reduce((total: any, item: any) => total + parseFloat(item.value), 0)
      const priceValue = parseFloat(quote.price.value)

      if (totalBreakupValue !== priceValue) {
        onStatusObj.breakupTotalMismatch = `Total of quote breakup (${totalBreakupValue}) does not match with price.value (${priceValue})`
      }

      const currencies = quoteBreakup.map((item: any) => item.currency)
      if (new Set(currencies).size !== 1) {
        onStatusObj.multipleCurrencies = 'Currency must be the same for all items in the quote breakup'
      }

      if (!quote.ttl) {
        onStatusObj.missingTTL = 'TTL is required in the quote'
      }
    } catch (error: any) {
      logger.error(`!!Error while checking quote details in /${constants.FIS_ONSTATUS}`, error.stack)
    }

    try {
      logger.info(`Checking payments details in /${constants.FIS_ONSTATUS}`)

      const payments = on_status.payments

      const totalPaymentsAmount = payments
        .filter((payment: any) => payment.params && payment.params.amount)
        .reduce((total: any, payment: any) => total + parseFloat(payment.params.amount), 0)
      const quotePriceValue = parseFloat(on_status.quote.price.value)

      if (totalPaymentsAmount !== quotePriceValue) {
        onStatusObj.paymentsAmountMismatch = `Total payments amount (${totalPaymentsAmount}) does not match with quote.price.value (${quotePriceValue})`
      }

      for (let i = 0; i < payments.length; i++) {
        const payment = payments[i]

        if (payment.url) {
          if (!isValidUrl(payment.url)) {
            onStatusObj['invalidPaymentUrl'] = `Invalid payment url (${payment.url}) at index ${i}`
          } else {
            const updateValue = getValue(`updatePayment`)
            if (payment?.params?.amount !== updateValue)
              onStatusObj[
                'invalidPaymentAmount'
              ] = `Invalid payment amount (${payment.url}) at index ${i}, should be the same as sent in update call`
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
        const allowedStatusValues = ['NOT_PAID', 'PAID']

        const collectedBy = getValue(`collected_by`)
        if (collectedBy && collectedBy !== payments[0].collected_by) {
          onStatusObj.collectedBy = `Collected_By didn't matched with what was send in previous call.`
        } else {
          if (!allowedCollectedByValues.includes(payments[0].collected_by)) {
            onStatusObj.collectedBy = `Invalid value for collected_by. It should be either BPP or BAP.`
          }

          setValue(`collected_by`, payments[0].collected_by)
        }

        if (!allowedStatusValues.includes(payments[0].status)) {
          onStatusObj.paymentStatus = `Invalid value for status. It should be either NOT_PAID or PAID.`
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking payments details in /${constants.FIS_ONSTATUS}`, error.stack)
    }

    try {
      logger.info(`Checking cancellation terms in /${constants.FIS_ONSTATUS}`)
      const cancellationTerms = on_status.cancellation_terms

      if (cancellationTerms && cancellationTerms.length > 0) {
        for (let i = 0; i < cancellationTerms.length; i++) {
          const cancellationTerm = cancellationTerms[i]

          if (
            cancellationTerm.fulfillment_state &&
            cancellationTerm.fulfillment_state.descriptor &&
            cancellationTerm.fulfillment_state.descriptor.code &&
            (!cancellationTerm.cancellation_fee ||
              !cancellationTerm.cancellation_fee.percentage ||
              isNaN(parseFloat(cancellationTerm.cancellation_fee.percentage)))
          ) {
            onStatusObj.cancellationFee = `Cancellation fee is required for Cancellation Term[${i}] when fulfillment_state is present`
          }

          const descriptorCode = cancellationTerm.fulfillment_state.descriptor.code
          const storedPercentage = cancellationTermsState.get(descriptorCode)

          if (storedPercentage === undefined || storedPercentage !== cancellationTerm.cancellation_fee.percentage) {
            onStatusObj.cancellationFee = `Cancellation terms percentage for ${descriptorCode} has changed`
          }
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation terms in /${constants.FIS_ONSTATUS}, ${error.stack}`)
    }

    try {
      logger.info(`Checking documents in /${constants.FIS_ONSTATUS}`)
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
          } else {
            if (!isValidUrl(document.url)) onStatusObj[`${documentKey}.url`] = 'URL must be valid'
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking documents in /${constants.FIS_ONSTATUS}, ${error.stack}`)
    }

    return onStatusObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.FIS_ONSTATUS} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}
