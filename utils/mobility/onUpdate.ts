/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { mobilitySequence } from '../../constants'
import { logger } from '../../shared/logger'
import { validateSchema, isObjectEmpty, checkMobilityContext, timeDiff as timeDifference, checkBppIdOrBapId } from '../'
import { getValue, setValue } from '../../shared/dao'

const cancellationTermsState = new Map()
export const checkOnUpdate = (data: any) => {
  const onUpdateObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [mobilitySequence.ON_UPDATE]: 'Json cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const searchContext: any = getValue(`${mobilitySequence.SEARCH}_context`)
    // const parentItemIdSet: any = getValue(`parentItemIdSet`)

    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.MOB_ONUPDATE, data)

    const contextRes: any = checkMobilityContext(context, constants.MOB_ONUPDATE)

    if (!context.bap_id) {
      onUpdateObj['bap_id'] = 'context/bap_id is required'
    } else {
      const checkBap = checkBppIdOrBapId(context.bap_id)
      if (checkBap) Object.assign(onUpdateObj, { bap_id: 'context/bap_id should not be a url' })
    }

    if (!context.bpp_id) {
      onUpdateObj['bpp_id'] = 'context/bpp_id is required'
    } else {
      const checkBpp = checkBppIdOrBapId(context.bpp_id)
      console.log('checkBppcheckBppcheckBppcheckBppcheckBppcheckBpp', checkBpp)
      if (checkBpp) Object.assign(onUpdateObj, { bpp_id: 'context/bpp_id should not be a url' })
    }

    if (schemaValidation !== 'error') {
      Object.assign(onUpdateObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(onUpdateObj, contextRes.ERRORS)
    }

    setValue(`${mobilitySequence.ON_UPDATE}`, data)

    try {
      logger.info(`Comparing city of /${constants.MOB_SEARCH} and /${constants.MOB_ONUPDATE}`)
      if (!_.isEqual(searchContext.location.city, context.location.city)) {
        onUpdateObj.city = `City code mismatch in /${constants.MOB_SEARCH} and /${constants.MOB_ONUPDATE}`
      }
    } catch (error: any) {
      logger.info(
        `Error while comparing city in /${constants.MOB_SEARCH} and /${constants.MOB_ONUPDATE}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing country of /${constants.MOB_SEARCH} and /${constants.MOB_ONUPDATE}`)
      if (!_.isEqual(searchContext.location.country, context.location.country)) {
        onUpdateObj.country = `Country code mismatch in /${constants.MOB_SEARCH} and /${constants.MOB_ONUPDATE}`
      }
    } catch (error: any) {
      logger.info(
        `Error while comparing country in /${constants.MOB_SEARCH} and /${constants.MOB_ONUPDATE}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing timestamp of /${constants.MOB_UPDATE} and /${constants.MOB_ONUPDATE}`)
      const tmpstmp = getValue('tmpstmp')
      if (_.gte(tmpstmp, context.timestamp)) {
        onUpdateObj.tmpstmp = `Timestamp for /${constants.MOB_UPDATE} api cannot be greater than or equal to /${constants.MOB_ONUPDATE} api`
      } else {
        const timeDiff = timeDifference(context.timestamp, tmpstmp)
        logger.info(timeDiff)
        if (timeDiff > 5000) {
          onUpdateObj.tmpstmp = `context/timestamp difference between /${constants.MOB_ONUPDATE} and /${constants.MOB_UPDATE} should be smaller than 5 sec`
        }
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.info(
        `Error while comparing timestamp for /${constants.MOB_UPDATE} and /${constants.MOB_ONUPDATE} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.MOB_CONFIRM} and /${constants.MOB_ONUPDATE}`)
      if (!_.isEqual(getValue('txnId'), context.transaction_id)) {
        onUpdateObj.txnId = `Transaction Id should be same from /${constants.MOB_CONFIRM} onwards`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing transaction ids for /${constants.MOB_CONFIRM} and /${constants.MOB_ONUPDATE} api, ${error.stack}`,
      )
    }

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
      console.log('test')
    }

    setValue('ItmIDS', newItemIDSValue)

    try {
      logger.info(`Checking fulfillments objects in /${constants.MOB_ONUPDATE}`)
      const fulfillments = on_update.fulfillments

      if (fulfillments && fulfillments.length > 0) {
        const fulfillment = fulfillments[0]

        if (
          !fulfillment.customer &&
          !fulfillment.customer.person &&
          !fulfillment.customer.person.name &&
          !fulfillment.customer.contact &&
          !fulfillment.customer.contact.phone &&
          !fulfillment.agent &&
          !fulfillment.agent.person &&
          !fulfillment.agent.person.name &&
          !fulfillment.agent.contact &&
          !fulfillment.agent.contact.phone
        ) {
          onUpdateObj.missingFulfillmentCustomerDetails = 'Fulfillment customer or agent details are incomplete'
        }
      } else {
        onUpdateObj.missingFulfillmentDetails = 'Fulfillment details are missing'
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments object in /${constants.MOB_ONUPDATE}, ${error.stack}`)
    }

    try {
      logger.info(`Checking quote details in /${constants.MOB_ONUPDATE}`)

      const quote = on_update.quote
      const quoteBreakup = quote.breakup

      const requiredBreakupItems = ['BASE_FARE', 'DISTANCE_FARE']
      const missingBreakupItems = requiredBreakupItems.filter(
        (item) => !quoteBreakup.find((breakupItem: any) => breakupItem.title === item),
      )

      if (missingBreakupItems.length > 0) {
        onUpdateObj.missingBreakupItems = `Quote breakup is missing the following items: ${missingBreakupItems.join(
          ', ',
        )}`
      }

      const totalBreakupValue = quoteBreakup.reduce((total: any, item: any) => total + parseFloat(item.value), 0)
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
      logger.error(`!!Error while checking quote details in /${constants.MOB_ONUPDATE}`, error.stack)
    }

    try {
      logger.info(`Checking payments details in /${constants.MOB_ONUPDATE}`)

      const payments = on_update.payments

      for (let i = 0; i < payments.length; i++) {
        const payment = payments[i]

        if (payment.status !== 'PAID' && payment.status !== 'NOT-PAID') {
          onUpdateObj.invalidPaymentStatus = `Invalid payment status (${payment.status}) at index ${i}`
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
          onUpdateObj.paymentStatus = `Invalid value for status. It should be either NOT_PAID or PAID.`
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking payments details in /${constants.MOB_ONUPDATE}`, error.stack)
    }

    try {
      logger.info(`Checking provider id /${constants.MOB_ONUPDATE}`)
      if (on_update.provider.id != getValue('providerId')) {
        onUpdateObj.prvdrId = `Provider Id mismatches in /${constants.MOB_ONSEARCH} and /${constants.MOB_ONUPDATE}`
      }
    } catch (error: any) {
      logger.error(`!!Error while checking provider id /${constants.MOB_ONUPDATE}, ${error.stack}`)
    }

    try {
      logger.info(`Checking cancellation terms in /${constants.MOB_ONUPDATE}`)
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
              isNaN(parseFloat(cancellationTerm.cancellation_fee.percentage)))
          ) {
            onUpdateObj.cancellationFee = `Cancellation fee is required for Cancellation Term[${i}] when fulfillment_state is present`
          }

          const descriptorCode = cancellationTerm.fulfillment_state.descriptor.code
          const storedPercentage = cancellationTermsState.get(descriptorCode)

          if (storedPercentage === undefined || storedPercentage !== cancellationTerm.cancellation_fee.percentage) {
            onUpdateObj.cancellationFee = `Cancellation terms percentage for ${descriptorCode} has changed`
          }
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation terms in /${constants.MOB_ONUPDATE}, ${error.stack}`)
    }

    return onUpdateObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.MOB_ONUPDATE} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}
