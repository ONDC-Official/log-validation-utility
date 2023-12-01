/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { FisApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty, checkFISContext, timeDiff as timeDifference, checkBppIdOrBapId } from '../../'
import { validateFulfillments, validateXInput } from './fisChecks'
import { getValue, setValue } from '../../../shared/dao'

const cancellationTermsState = new Map()

export const checkOnInit = (data: any, msgIdSet: any) => {
  try {
    const onInitObj: any = {}
    if (!data || isObjectEmpty(data)) {
      return { [FisApiSequence.ON_INIT]: 'Json cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.FIS_ONINIT, data)
    const searchContext: any = getValue(`${FisApiSequence.SEARCH}_context`)
    const contextRes: any = checkFISContext(context, constants.FIS_ONINIT)
    // const parentItemIdSet: any = getValue(`parentItemIdSet`)

    const checkBap = checkBppIdOrBapId(context.bap_id)
    const checkBpp = checkBppIdOrBapId(context.bpp_id)

    if (checkBap) Object.assign(onInitObj, { bap_id: 'context/bap_id should not be a url' })
    if (checkBpp) Object.assign(onInitObj, { bpp_id: 'context/bpp_id should not be a url' })
    if (schemaValidation !== 'error') {
      Object.assign(onInitObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(onInitObj, contextRes.ERRORS)
    }

    setValue(`${FisApiSequence.ON_INIT}`, data)
    msgIdSet.add(context.message_id)

    logger.info(`Checking context for /${constants.FIS_ONINIT} API`) //checking context
    try {
      const res: any = checkFISContext(context, constants.FIS_ONINIT)
      if (!res.valid) {
        Object.assign(onInitObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.FIS_ONINIT} context, ${error.stack}`)
    }

    try {
      logger.info(`Comparing city of ${constants.FIS_SEARCH} & ${constants.FIS_ONINIT}`)
      if (!_.isEqual(searchContext.location.city, context.location.city)) {
        onInitObj.city = `City code mismatch in ${constants.FIS_SEARCH} & ${constants.FIS_ONINIT}`
      }
    } catch (error: any) {
      logger.info(`Error while comparing city in ${constants.FIS_SEARCH} & ${constants.FIS_ONINIT}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing country of ${constants.FIS_SEARCH} & ${constants.FIS_ONINIT}`)
      if (!_.isEqual(searchContext.location.country, context.location.country)) {
        onInitObj.Country = `country code mismatch in ${constants.FIS_SEARCH} & ${constants.FIS_ONINIT}`
      }
    } catch (error: any) {
      logger.info(`Error while comparing country in ${constants.FIS_SEARCH} & ${constants.FIS_ONINIT}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing timestamp of ${constants.FIS_INIT} & ${constants.FIS_ONINIT}`)
      const tmpstmp = getValue('tmpstmp')
      if (_.gte(tmpstmp, context.timestamp)) {
        onInitObj.tmpstmp = `Timestamp for ${constants.FIS_INIT} api cannot be greater than or equal to ${constants.FIS_ONINIT} api`
      } else {
        const timeDiff = timeDifference(context.timestamp, tmpstmp)
        logger.info(timeDiff)
        if (timeDiff > 5000) {
          onInitObj.tmpstmp = `context/timestamp difference between /${constants.FIS_ONINIT} and /${constants.FIS_INIT} should be smaller than 5 sec`
        }
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.error(
        `!!Error while comparing timestamp for /${constants.FIS_INIT} and /${constants.FIS_ONINIT} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.FIS_SELECT} & /${constants.FIS_ONINIT}`)
      if (!_.isEqual(getValue('txnId'), context.transaction_id)) {
        onInitObj.txnId = `Transaction Id should be same from /${constants.FIS_SELECT} onwards`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing transaction ids for /${constants.FIS_SELECT} & /${constants.FIS_ONINIT} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing Message Ids of /${constants.FIS_INIT} and /${constants.FIS_ONINIT}`)
      if (!_.isEqual(getValue('msgId'), context.message_id)) {
        onInitObj.msgId = `Message Ids for /${constants.FIS_INIT} and /${constants.FIS_ONINIT} api should be same`
      }

      msgIdSet.add(context.message_id)
    } catch (error: any) {
      logger.error(`!!Error while checking message id for /${constants.FIS_INIT}, ${error.stack}`)
    }

    const on_init = message.order
    const itemIDS: any = getValue('ItmIDS')
    const itemIdArray: any[] = []

    let newItemIDSValue: any[]

    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      on_init.items.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
      console.log('test')
    }

    setValue('ItmIDS', newItemIDSValue)

    try {
      logger.info(`Checking provider Id in /${constants.FIS_ONSEARCH} and /${constants.FIS_ONINIT}`)
      if (!on_init.provider || on_init.provider.id != getValue('providerId')) {
        onInitObj.prvdrId = `Provider Id mismatches in /${constants.FIS_ONSEARCH} and /${constants.FIS_ONINIT}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing provider Id in /${constants.FIS_ONSEARCH} and /${constants.FIS_ONINIT}, ${error.stack}`,
      )
    }

    let initQuotePrice = 0
    let initBreakupPrice = 0
    // setValue("onInitQuote", quote);
    logger.info(`Calculating Net /${constants.FIS_ONINIT} Price breakup`)
    on_init.quote.breakup.forEach((element: { price: { value: string } }) => {
      initBreakupPrice += parseFloat(element.price.value)
    })
    logger.info(`/${constants.FIS_ONINIT} Price Breakup: ${initBreakupPrice}`)

    initQuotePrice = parseFloat(on_init.quote.price.value)

    logger.info(`/${constants.FIS_ONINIT} Quoted Price: ${initQuotePrice}`)

    logger.info(`Comparing /${constants.FIS_ONINIT} Quoted Price and Net Price Breakup`)
    if (initQuotePrice != initBreakupPrice) {
      logger.info(`Quoted Price in /${constants.FIS_ONINIT} is not equal to the Net Breakup Price`)
      onInitObj.onInitPriceErr = `Quoted Price ${initQuotePrice} does not match with Net Breakup Price ${initBreakupPrice} in /${constants.FIS_ONINIT}`
    }

    try {
      logger.info(`Comparing item in and /${constants.FIS_ONINIT}`)

      on_init.items.forEach((item: any, index: number) => {
        console.log(
          '==================================================================================================================',
          item?.xinput,
        )
        if (!newItemIDSValue.includes(item.id)) {
          const key = `item[${index}].item_id`
          onInitObj[
            key
          ] = `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in previous call`
        }

        if (initQuotePrice !== item?.price?.value) {
          onInitObj[`item${index}_price`] = `Price mismatch for item: ${item.id}`
        }

        const xinputValidationErrors = validateXInput(item?.xinput, 0, index, constants.FIS_ONINIT)
        if (xinputValidationErrors) {
          Object.assign(onInitObj, xinputValidationErrors)
        }

        if (item.tags) {
          const loanInfoTag = item.tags.find((tag: any) => tag.descriptor.code === 'LOAN-INFO')
          if (loanInfoTag) {
            const subtagsRequired = ['INTEREST_RATE', 'TERM', 'INTEREST_RATE_TYPE']
            const missingSubtags = subtagsRequired.filter((subtag) => {
              return !loanInfoTag.list.some((subtagItem: any) => subtagItem.descriptor.code === subtag)
            })

            if (missingSubtags.length > 0) {
              onInitObj[
                `loanInfoTagSubtagsMissing${index}`
              ] = `The following subtags are missing in LOAN_INFO for Item ${item.id}: ${missingSubtags.join(', ')}`
            }
          } else {
            onInitObj[`loanInfoTagSubtagsMissing`] = `The LOAN_INFO tag group for Item ${item.id}: was not found`
          }
        }
      })
    } catch (error: any) {
      logger.error(
        `!!Error while comparing Item and Fulfillment Id in /${constants.FIS_ONSELECT} and /${constants.FIS_ONINIT}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Checking cancellation terms in /${constants.FIS_ONINIT}`)
      const cancellationTerms = on_init.cancellation_terms

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
            onInitObj.cancellationFee = `Cancellation fee is required for Cancellation Term[${i}] when fulfillment_state is present`
          }

          const descriptorCode = cancellationTerm.fulfillment_state.descriptor.code
          const storedPercentage = cancellationTermsState.get(descriptorCode)

          if (storedPercentage === undefined) {
            cancellationTermsState.set(descriptorCode, cancellationTerm.cancellation_fee.percentage)
          } else if (storedPercentage !== cancellationTerm.cancellation_fee.percentage) {
            onInitObj.cancellationFee = `Cancellation terms percentage for ${descriptorCode} has changed`
          }
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation terms in /${constants.FIS_ONINIT}, ${error.stack}`)
    }

    try {
      logger.info(`Checking fulfillments objects in /${constants.FIS_ONINIT}`)
      let i = 0
      const len = on_init.fulfillments.length
      while (i < len) {
        const fulfillment = on_init.fulfillments[i]
        const fulfillmentErrors = validateFulfillments(fulfillment, i)
        if (fulfillmentErrors) {
          Object.assign(onInitObj, fulfillmentErrors)
        }

        i++
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments object in /${constants.FIS_ONINIT}, ${error.stack}`)
    }

    // logger.info(`Comparing /${constants.FIS_ONINIT} Quoted Price and /${constants.FIS_ONSELECT} Quoted Price`)
    // const onSelectPrice: any = getValue('onSelectPrice')
    // if (onSelectPrice != initQuotePrice) {
    //   logger.info(
    //     `Quoted Price in /${constants.FIS_ONINIT} is not equal to the quoted price in /${constants.FIS_ONSELECT}`,
    //   )
    //   onInitObj.onInitPriceErr2 = `Quoted Price in /${constants.FIS_ONINIT} INR ${initQuotePrice} does not match with the quoted price in /${constants.FIS_ONSELECT} INR ${onSelectPrice}`
    // }

    logger.info(`Checking Payment Object for  /${constants.FIS_ONINIT}`)
    if (!on_init.payments) {
      onInitObj.pymntOnInitObj = `Payment Object can't be null in /${constants.FIS_ONINIT}`
    } else {
      const buyerFinderFeesTag = on_init.payments[0].tags.find(
        (tag: any) => tag.descriptor.code === 'BUYER_FINDER_FEES',
      )
      const settlementTermsTag = on_init.payments[0].tags.find((tag: any) => tag.descriptor.code === 'SETTLEMENT_TERMS')

      if (!buyerFinderFeesTag) {
        onInitObj.buyerFinderFees = `BUYER_FINDER_FEES tag is missing in payments`
      }

      if (!settlementTermsTag) {
        onInitObj.settlementTerms = `SETTLEMENT_TERMS tag is missing in payments`
      }

      try {
        logger.info(`Checking Payment Object for  /${constants.FIS_ONINIT}`)
        if (!on_init.payments[0].collected_by || !on_init.payments[0].status) {
          onInitObj.payments = `collected_by or status is missing in payments`
        } else {
          const allowedCollectedByValues = ['BPP', 'BAP']
          const allowedStatusValues = ['NOT_PAID', 'PAID']

          const collectedBy = getValue(`collected_by`)
          if (collectedBy && collectedBy !== on_init.payments[0].collected_by) {
            onInitObj.collectedBy = `Collected_By didn't matched with what was send in previous call.`
          } else {
            if (!allowedCollectedByValues.includes(on_init.payments[0].collected_by)) {
              onInitObj.collectedBy = `Invalid value for collected_by. It should be either BPP or BAP.`
            }

            setValue(`collected_by`, on_init.payments[0].collected_by)
          }

          if (!allowedStatusValues.includes(on_init.payments[0].status)) {
            onInitObj.paymentStatus = `Invalid value for status. It should be either NOT_PAID or PAID.`
          }
        }
      } catch (error: any) {
        logger.error(`!!Error while checking Payment Object in /${constants.FIS_ONINIT}, ${error.stack}`)
      }
    }

    // try {
    //   logger.info(`Checking Quote Object in /${constants.FIS_ONSELECT} and /${constants.FIS_ONINIT}`)
    //   const on_select_quote = getValue('quoteObj')
    //   if (!_.isEqual(on_select_quote, on_init.quote)) {
    //     onInitObj.quoteErr = `Discrepancies between the quote object in /${constants.FIS_ONSELECT} and /${constants.FIS_ONINIT}`
    //   }
    // } catch (error: any) {
    //   logger.error(`!!Error while checking quote object in /${constants.FIS_ONSELECT} and /${constants.FIS_ONINIT}`)
    // }

    return onInitObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.FIS_ONINIT} API`, err)
    return { error: err.message }
  }
}
