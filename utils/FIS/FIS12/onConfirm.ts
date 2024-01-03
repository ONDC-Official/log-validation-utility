/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { FisApiSequence } from '../../../constants'
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

export const checkOnConfirm = (data: any, flow: any) => {
  const onCnfrmObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [FisApiSequence.ON_CONFIRM]: 'Json cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const searchContext: any = getValue(`${FisApiSequence.SEARCH}_context`)
    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.FIS_ONCONFIRM, data)
    const contextRes: any = checkFISContext(context, constants.FIS_ONCONFIRM)

    if (schemaValidation !== 'error') {
      Object.assign(onCnfrmObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(onCnfrmObj, contextRes.ERRORS)
    }

    //Flow based checks for on_confirm
    performChecks(onCnfrmObj, searchContext, context, flow)

    setValue(`${FisApiSequence.ON_CONFIRM}`, data)

    const on_confirm = message.order
    const itemIDS: any = getValue('ItmIDS')
    const itemIdArray: any[] = []

    let newItemIDSValue: any[]

    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      on_confirm.items.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
    }

    setValue('ItmIDS', newItemIDSValue)

    try {
      logger.info(`Checking id in message object  /${constants.FIS_ONCONFIRM}`)
      if (!on_confirm.id) {
        onCnfrmObj.id = `Id in message object must be present/${constants.FIS_ONCONFIRM}`
      } else {
        setValue('orderId', on_confirm?.id)
      }
    } catch (error: any) {
      logger.error(`!!Error while checking id in message object  /${constants.FIS_ONCONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Checking provider id /${constants.FIS_ONCONFIRM}`)

      if (['PRE_INVOICE', 'PRE_PERSONAL'].includes(flow)) {
        const on_confirmProviderId = on_confirm.provider.id
        setValue('providerId', on_confirmProviderId)
      } else {
        if (on_confirm.provider.id !== getValue('providerId')) {
          onCnfrmObj.prvdrId = `Provider Id mismatches in /${constants.FIS_ONSEARCH} and /${constants.FIS_ONCONFIRM}`
        }
      }

      logger.info(`Checking tags in /${constants.FIS_ONCONFIRM}`)
      const providerTags = on_confirm.provider.tags

      if (!providerTags || !Array.isArray(providerTags) || providerTags.length === 0) {
        onCnfrmObj.tags = 'Tags array is missing or empty in provider'
      }
    } catch (error: any) {
      logger.error(`!!Error while checking provider id /${constants.FIS_ONCONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing item in /${constants.FIS_ONCONFIRM}`)

      on_confirm.items.forEach((item: any, index: number) => {
        if (!newItemIDSValue.includes(item.id)) {
          const key = `item[${index}].item_id`
          onCnfrmObj[
            key
          ] = `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in previous call`
        }

        if (on_confirm.quote.price.value !== item?.price?.value) {
          onCnfrmObj[`item${index}_price`] = `Price mismatch for item: ${item.id}`
        }

        if (item.tags) {
          const loanInfoTag = item.tags.find((tag: any) => tag.descriptor.code === 'LOAN-INFO')
          if (!loanInfoTag) {
            onCnfrmObj[`loanInfoTagSubtagsMissing`] = `The LOAN_INFO tag group for Item ${item.id}: was not found`
          }
        }
      })
    } catch (error: any) {
      logger.error(
        `!!Error while comparing Item in /${constants.RET_ONSELECT} and /${constants.FIS_ONCONFIRM}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Checking fulfillments objects in /${constants.FIS_ONCONFIRM}`)
      let i = 0
      const len = on_confirm.fulfillments.length
      while (i < len) {
        const fulfillment = on_confirm.fulfillments[i]
        const fulfillmentErrors = validateFulfillments(fulfillment, i, on_confirm.documents)
        if (fulfillmentErrors) {
          Object.assign(onCnfrmObj, fulfillmentErrors)
        }

        i++
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments object in /${constants.FIS_ONCONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Checking quote details in /${constants.FIS_ONCONFIRM}`)

      const quote = on_confirm.quote
      const quoteBreakup = quote.breakup

      const requiredBreakupItems = ['Principal', 'Interest', 'Processing Fee']
      const missingBreakupItems = requiredBreakupItems.filter(
        (item) => !quoteBreakup.find((breakupItem: any) => breakupItem.type === item),
      )

      if (missingBreakupItems.length > 0) {
        onCnfrmObj.missingBreakupItems = `Quote breakup is missing the following items: ${missingBreakupItems.join(
          ', ',
        )}`
      }

      const totalBreakupValue = quoteBreakup.reduce((total: any, item: any) => total + parseFloat(item.value), 0)
      const priceValue = parseFloat(quote.price.value)

      if (totalBreakupValue !== priceValue) {
        onCnfrmObj.breakupTotalMismatch = `Total of quote breakup (${totalBreakupValue}) does not match with price.value (${priceValue})`
      }

      const currencies = quoteBreakup.map((item: any) => item.currency)
      if (new Set(currencies).size !== 1) {
        onCnfrmObj.multipleCurrencies = 'Currency must be the same for all items in the quote breakup'
      }

      if (!quote.ttl) {
        onCnfrmObj.missingTTL = 'TTL is required in the quote'
      }
    } catch (error: any) {
      logger.error(`!!Error while checking quote details in /${constants.FIS_ONCONFIRM}`, error.stack)
    }

    try {
      logger.info(`Checking payments details in /${constants.FIS_ONCONFIRM}`)

      const payments = on_confirm.payments

      const totalPaymentsAmount = payments
        .filter((payment: any) => payment.params && payment.params.amount)
        .reduce((total: any, payment: any) => total + parseFloat(payment.params.amount), 0)
      const quotePriceValue = parseFloat(on_confirm.quote.price.value)

      if (totalPaymentsAmount !== quotePriceValue) {
        onCnfrmObj.paymentsAmountMismatch = `Total payments amount (${totalPaymentsAmount}) does not match with quote.price.value (${quotePriceValue})`
      }

      for (let i = 0; i < payments.length; i++) {
        const payment = payments[i]

        if (payment.status !== 'PAID' && payment.status !== 'NOT-PAID') {
          onCnfrmObj.invalidPaymentStatus = `Invalid payment status (${payment.status}) at index ${i}`
        }

        if (payment.time && payment.time.range) {
          const { start, end } = payment.time.range
          const startTime = new Date(start).getTime()
          const endTime = new Date(end).getTime()

          if (isNaN(startTime) || isNaN(endTime) || startTime > endTime) {
            onCnfrmObj.invalidTimeRange = `Invalid time range for payment at index ${i}`
          }

          if (i > 0) {
            const prevEndTime = new Date(payments[i - 1].time.range.end).getTime()
            if (startTime <= prevEndTime) {
              onCnfrmObj.timeRangeOrderError = `Time range order error for payment at index ${i}`
            }
          }
        } else {
          onCnfrmObj.missingTimeRange = `Missing time range for payment at index ${i}`
        }
      }

      const buyerFinderFeesTag = payments[0].tags.find((tag: any) => tag.descriptor.code === 'BUYER_FINDER_FEES')
      const settlementTermsTag = payments[0].tags.find((tag: any) => tag.descriptor.code === 'SETTLEMENT_TERMS')

      if (!buyerFinderFeesTag) {
        onCnfrmObj.buyerFinderFees = `BUYER_FINDER_FEES tag is missing in payments`
      }

      if (!settlementTermsTag) {
        onCnfrmObj.settlementTerms = `SETTLEMENT_TERMS tag is missing in payments`
      }

      if (!payments[0].collected_by) {
        onCnfrmObj.payments = `collected_by  is missing in payments`
      } else {
        const allowedCollectedByValues = ['BPP', 'BAP']
        const allowedStatusValues = ['NOT_PAID', 'PAID']

        const collectedBy = getValue(`collected_by`)
        if (collectedBy && collectedBy !== payments[0].collected_by) {
          onCnfrmObj.collectedBy = `Collected_By didn't matched with what was send in previous call.`
        } else {
          if (!allowedCollectedByValues.includes(payments[0].collected_by)) {
            onCnfrmObj.collectedBy = `Invalid value for collected_by. It should be either BPP or BAP.`
          }

          setValue(`collected_by`, payments[0].collected_by)
        }

        if (!allowedStatusValues.includes(payments[0].status)) {
          onCnfrmObj.paymentStatus = `Invalid value for status. It should be either NOT_PAID or PAID.`
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking payments details in /${constants.FIS_ONCONFIRM}`, error.stack)
    }

    try {
      logger.info(`Checking cancellation terms in /${constants.FIS_ONCONFIRM}`)
      const cancellationTerms = on_confirm.cancellation_terms

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
            onCnfrmObj.cancellationFee = `Cancellation fee is required and must be a positive integer for Cancellation Term[${i}]`
          }

          const descriptorCode = cancellationTerm.fulfillment_state.descriptor.code
          const storedPercentage = cancellationTermsState.get(descriptorCode)

          if (storedPercentage === undefined || storedPercentage !== cancellationTerm.cancellation_fee.percentage) {
            onCnfrmObj.cancellationFee = `Cancellation terms percentage for ${descriptorCode} has changed`
          }
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation terms in /${constants.FIS_ONCONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Checking documents in /${constants.FIS_ONCONFIRM}`)
      const documents = on_confirm.documents

      if (!documents || !Array.isArray(documents) || documents.length === 0) {
        onCnfrmObj.documents = 'Documents array is missing or empty in order'
      } else {
        documents.forEach((document, index) => {
          const documentKey = `documents[${index}]`

          if (!document.descriptor || !document.descriptor.code) {
            onCnfrmObj[`${documentKey}.code`] = 'Document descriptor is missing or empty'
          }

          if (!document.descriptor || !document.descriptor.name) {
            onCnfrmObj[`${documentKey}.name`] = 'Document descriptor name is missing or empty'
          }

          if (!document.descriptor || !document.descriptor.short_desc) {
            onCnfrmObj[`${documentKey}.short_desc`] = 'Document descriptor short_desc is missing or empty'
          }

          if (!document.descriptor || !document.descriptor.long_desc) {
            onCnfrmObj[`${documentKey}.long_desc`] = 'Document descriptor long_desc is missing or empty'
          }

          if (!document.mime_type) {
            onCnfrmObj[`${documentKey}.mime_type`] = 'Document mime_type is missing or empty'
          } else {
            const allowedMimeTypes = ['application/pdf']
            if (!allowedMimeTypes.includes(document.mime_type)) {
              onCnfrmObj[`${documentKey}.mime_type`] = `Invalid mime_type: ${document.mime_type}`
            }
          }

          if (!document.url) {
            onCnfrmObj[`${documentKey}.url`] = 'Document URL is missing or empty'
          } else {
            if (!isValidUrl(document.url)) onCnfrmObj[`${documentKey}.url`] = 'URL must be valid'
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking documents in /${constants.FIS_ONCONFIRM}, ${error.stack}`)
    }

    return onCnfrmObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.FIS_ONCONFIRM} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}

const compareCity = (onCnfrmObj: any, searchContext: any, context: any) => {
  try {
    logger.info(`Comparing city of /${constants.FIS_SEARCH} and /${constants.FIS_ONCONFIRM}`)
    if (!_.isEqual(searchContext.location.city, context.location.city)) {
      onCnfrmObj.city = `City code mismatch in /${constants.FIS_SEARCH} and /${constants.FIS_ONCONFIRM}`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing city in /${constants.FIS_SEARCH} and /${constants.FIS_ONCONFIRM}, ${error.stack}`,
    )
  }
}

const compareTimestamp = (onCnfrmObj: any, context: any) => {
  try {
    logger.info(`Comparing timestamp of /${constants.FIS_CONFIRM} and /${constants.FIS_ONCONFIRM}`)
    const tmpstmp = getValue('tmpstmp')
    if (_.gte(tmpstmp, context.timestamp)) {
      onCnfrmObj.tmpstmp = `Timestamp for /${constants.FIS_CONFIRM} api cannot be greater than or equal to /${constants.FIS_ONCONFIRM} api`
    } else {
      const timeDiff = timeDifference(context.timestamp, tmpstmp)
      logger.info(timeDiff)
      if (timeDiff > 5000) {
        onCnfrmObj.tmpstmp = `context/timestamp difference between /${constants.FIS_ONCONFIRM} and /${constants.FIS_CONFIRM} should be smaller than 5 sec`
      }
    }

    setValue('tmpstmp', context.timestamp)
  } catch (error: any) {
    logger.info(
      `Error while comparing timestamp for /${constants.FIS_CONFIRM} and /${constants.FIS_ONCONFIRM} api, ${error.stack}`,
    )
  }
}

const compareCountry = (onCnfrmObj: any, searchContext: any, context: any) => {
  try {
    logger.info(`Comparing country of /${constants.FIS_SEARCH} and /${constants.FIS_ONCONFIRM}`)
    if (!_.isEqual(searchContext.location.country, context.location.country)) {
      onCnfrmObj.country = `Country code mismatch in /${constants.FIS_SEARCH} and /${constants.FIS_ONCONFIRM}`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing country in /${constants.FIS_SEARCH} and /${constants.FIS_ONCONFIRM}, ${error.stack}`,
    )
  }
}

const compareTransactionIds = (onCnfrmObj: any, context: any) => {
  try {
    logger.info(`Comparing transaction Ids of /${constants.FIS_SELECT} and /${constants.FIS_ONCONFIRM}`)
    if (!_.isEqual(getValue('txnId'), context.transaction_id)) {
      onCnfrmObj.txnId = `Transaction Id should be same throughout the flow`
    }
  } catch (error: any) {
    logger.error(
      `!!Error while comparing transaction ids for /${constants.FIS_SELECT} and /${constants.FIS_ONCONFIRM} api, ${error.stack}`,
    )
  }
}

const performChecks = (onCnfrmObj: any, searchContext: any, context: any, flow: any) => {
  const checksToSkipForFlows = ['PRE_INVOICE', 'PRE_PERSONAL']

  if (!checksToSkipForFlows.includes(flow)) {
    compareCity(onCnfrmObj, searchContext, context)
    compareCountry(onCnfrmObj, searchContext, context)
    compareTimestamp(onCnfrmObj, context)
    compareTransactionIds(onCnfrmObj, context)

    const checkBap = checkBppIdOrBapId(context.bap_id)
    const checkBpp = checkBppIdOrBapId(context.bpp_id)

    if (checkBap) Object.assign(onCnfrmObj, { bap_id: 'context/bap_id should not be a url' })
    if (checkBpp) Object.assign(onCnfrmObj, { bpp_id: 'context/bpp_id should not be a url' })
  }
}
