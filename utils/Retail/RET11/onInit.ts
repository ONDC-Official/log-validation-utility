/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { ApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import {
  validateSchema,
  isObjectEmpty,
  checkContext,
  timeDiff as timeDifference,
  isObjectEqual,
  checkItemTag,
} from '../../../utils'
import { getValue, setValue } from '../../../shared/dao'

export const checkOnInit = (data: any, msgIdSet: any) => {
  try {
    const onInitObj: any = {}
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.ON_INIT]: 'Json cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('RET11', constants.RET_ONINIT, data)
    const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
    const contextRes: any = checkContext(context, constants.RET_ONINIT)
    const parentItemIdSet: any = getValue(`parentItemIdSet`)
    const select_customIdArray: any = getValue(`select_customIdArray`)
    if (schemaValidation !== 'error') {
      Object.assign(onInitObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(onInitObj, contextRes.ERRORS)
    }

    setValue(`${ApiSequence.ON_INIT}`, data)
    msgIdSet.add(context.message_id)

    logger.info(`Checking context for /${constants.RET_ONINIT} API`) //checking context
    try {
      const res: any = checkContext(context, constants.RET_ONINIT)
      if (!res.valid) {
        Object.assign(onInitObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.RET_ONINIT} context, ${error.stack}`)
    }

    try {
      logger.info(`Comparing city of ${constants.RET_SEARCH} & ${constants.RET_ONINIT}`)
      if (!_.isEqual(searchContext.city, context.city)) {
        onInitObj.city = `City code mismatch in ${constants.RET_SEARCH} & ${constants.RET_ONINIT}`
      }
    } catch (error: any) {
      logger.info(`Error while comparing city in ${constants.RET_SEARCH} & ${constants.RET_ONINIT}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing timestamp of ${constants.RET_INIT} & ${constants.RET_ONINIT}`)
      const tmpstmp = getValue('tmpstmp')
      if (_.gte(tmpstmp, context.timestamp)) {
        onInitObj.tmpstmp = `Timestamp for ${constants.RET_INIT} api cannot be greater than or equal to ${constants.RET_ONINIT} api`
      } else {
        const timeDiff = timeDifference(context.timestamp, tmpstmp)
        logger.info(timeDiff)
        if (timeDiff > 5000) {
          onInitObj.tmpstmp = `context/timestamp difference between /${constants.RET_ONINIT} and /${constants.RET_INIT} should be smaller than 5 sec`
        }
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.error(
        `!!Error while comparing timestamp for /${constants.RET_INIT} and /${constants.RET_ONINIT} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.RET_SELECT} & /${constants.RET_ONINIT}`)
      if (!_.isEqual(getValue('txnId'), context.transaction_id)) {
        onInitObj.txnId = `Transaction Id should be same from /${constants.RET_SELECT} onwards`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing transaction ids for /${constants.RET_SELECT} & /${constants.RET_ONINIT} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing Message Ids of /${constants.RET_INIT} and /${constants.RET_ONINIT}`)
      if (!_.isEqual(getValue('msgId'), context.message_id)) {
        onInitObj.msgId = `Message Ids for /${constants.RET_INIT} and /${constants.RET_ONINIT} api should be same`
      }

      msgIdSet.add(context.message_id)
    } catch (error: any) {
      logger.error(`!!Error while checking message id for /${constants.RET_INIT}, ${error.stack}`)
    }

    const on_init = message.order

    try {
      logger.info(
        `Checking provider Id and provider_location Id in /${constants.RET_ONSEARCH} and /${constants.RET_ONINIT}`,
      )
      if (!on_init.provider || on_init.provider.id != getValue('providerId')) {
        onInitObj.prvdrId = `Provider Id mismatches in /${constants.RET_ONSEARCH} and /${constants.RET_ONINIT}`
      }

      if (
        on_init.hasOwnProperty('provider_location') &&
        (!on_init.provider_location.id || on_init.provider_location.id != getValue('providerLoc'))
      ) {
        onInitObj.prvdrLoc = `provider_location.id mismatches in /${constants.RET_ONSEARCH} and /${constants.RET_ONINIT}`
      } else if (!on_init.hasOwnProperty('provider_location')) {
        onInitObj.prvdrloc = `provider_location object is missing in /${constants.RET_ONINIT}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing provider Id and location Id in /${constants.RET_ONSEARCH} and /${constants.RET_ONINIT}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing item Ids and fulfillment Ids in /${constants.RET_ONSELECT} and /${constants.RET_ONINIT}`)
      const itemFlfllmnts: any = getValue('itemFlfllmnts')
      const itemsIdList: any = getValue('itemsIdList')
      let i = 0
      const len: any = on_init.items.length
      while (i < len) {
        const itemId: any = on_init.items[i].id
        const item = on_init.items[i]

        if (checkItemTag(item, select_customIdArray)) {
          const itemkey = `item${i}tags.parent_id`
          onInitObj[
            itemkey
          ] = `items[${i}].tags.parent_id mismatches for Item ${itemId} in /${constants.RET_SELECT} and /${constants.RET_INIT}`
        }

        if (!parentItemIdSet.includes(item.parent_item_id)) {
          const itemkey = `item_PrntItmId${i}`
          onInitObj[
            itemkey
          ] = `items[${i}].parent_item_id mismatches for Item ${itemId} in /${constants.RET_ONSELECT} and /${constants.RET_ONINIT}`
        }

        if (itemId in itemFlfllmnts) {
          if (on_init.items[i].fulfillment_id != itemFlfllmnts[itemId]) {
            const itemkey = `item_FFErr${i}`
            onInitObj[
              itemkey
            ] = `items[${i}].fulfillment_id mismatches for Item ${itemId} in /${constants.RET_ONSELECT} and /${constants.RET_ONINIT}`
          }
        } else {
          const itemkey = `item_FFErr${i}`
          onInitObj[itemkey] = `Item Id ${itemId} does not exist in /on_select`
        }

        if (itemId in itemsIdList) {
          if (on_init.items[i].quantity.count != itemsIdList[itemId]) {
            onInitObj.cntErr = `Warning: items[${i}].quantity.count for item ${itemId} mismatches with the items quantity selected in /${constants.RET_SELECT}`
          }
        }

        i++
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing Item and Fulfillment Id in /${constants.RET_ONSELECT} and /${constants.RET_ONINIT}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing billing object in /${constants.RET_INIT} and /${constants.RET_ONINIT}`)
      const billing = getValue('billing')

      if (isObjectEqual(billing, billing).length > 0) {
        const billingMismatch = isObjectEqual(billing, billing)
        onInitObj.bill = `${billingMismatch.join(', ')} mismatches in /billing in /${constants.RET_INIT} and /${
          constants.RET_ONINIT
        }`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing billing object in /${constants.RET_INIT} and /${constants.RET_ONINIT}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Checking fulfillments objects in /${constants.RET_ONINIT}`)
      const itemFlfllmnts: any = getValue('itemFlfllmnts')
      let i = 0
      const len = on_init.fulfillments.length
      while (i < len) {
        //Comparing fulfillment Ids

        if (on_init.fulfillments[i].id) {
          const id = on_init.fulfillments[i].id
          if (!Object.values(itemFlfllmnts).includes(id)) {
            const key = `ffID${id}`
            //MM->Mismatch
            onInitObj[key] = `fulfillment id ${id} does not exist in /${constants.RET_ONSELECT}`
          }
        } else {
          onInitObj.ffId = `fulfillments[].id is missing in /${constants.RET_ONINIT}`
        }

        if (!_.isEqual(on_init.fulfillments[i].end.location.gps, getValue('buyerGps'))) {
          const gpskey = `gpsKey${i}`
          onInitObj[
            gpskey
          ] = `gps coordinates in fulfillments[${i}].end.location mismatch in /${constants.RET_SELECT} & /${constants.RET_ONINIT}`
        }

        if (!_.isEqual(on_init.fulfillments[i].end.location.address.area_code, getValue('buyerAddr'))) {
          const addrkey = `addrKey${i}`
          onInitObj[
            addrkey
          ] = `address.area_code in fulfillments[${i}].end.location mismatch in /${constants.RET_SELECT} & /${constants.RET_ONINIT}`
        }

        i++
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments object in /${constants.RET_ONINIT}, ${error.stack}`)
    }

    let initQuotePrice = 0
    let initBreakupPrice = 0
    // setValue("onInitQuote", quote);
    logger.info(`Calculating Net /${constants.RET_ONINIT} Price breakup`)
    on_init.quote.breakup.forEach((element: { price: { value: string } }) => {
      initBreakupPrice += parseFloat(element.price.value)
    })
    logger.info(`/${constants.RET_ONINIT} Price Breakup: ${initBreakupPrice}`)

    initQuotePrice = parseFloat(on_init.quote.price.value)

    logger.info(`/${constants.RET_ONINIT} Quoted Price: ${initQuotePrice}`)

    logger.info(`Comparing /${constants.RET_ONINIT} Quoted Price and Net Price Breakup`)
    if (initQuotePrice != initBreakupPrice) {
      logger.info(`Quoted Price in /${constants.RET_ONINIT} is not equal to the Net Breakup Price`)
      onInitObj.onInitPriceErr = `Quoted Price ${initQuotePrice} does not match with Net Breakup Price ${initBreakupPrice} in /${constants.RET_ONINIT}`
    }

    logger.info(`Comparing /${constants.RET_ONINIT} Quoted Price and /${constants.RET_ONSELECT} Quoted Price`)
    const onSelectPrice: any = getValue('onSelectPrice')
    if (onSelectPrice != initQuotePrice) {
      logger.info(
        `Quoted Price in /${constants.RET_ONINIT} is not equal to the quoted price in /${constants.RET_ONSELECT}`,
      )
      onInitObj.onInitPriceErr2 = `Quoted Price in /${constants.RET_ONINIT} INR ${initQuotePrice} does not match with the quoted price in /${constants.RET_ONSELECT} INR ${onSelectPrice}`
    }

    logger.info(`Checking Payment Object for  /${constants.RET_ONINIT}`)
    if (!on_init.payment) {
      onInitObj.pymntOnInitObj = `Payment Object can't be null in /${constants.RET_ONINIT}`
    }

    try {
      logger.info(`Checking Buyer App finder fee amount in /${constants.RET_ONINIT}`)
      const buyerFF: any = getValue(`${ApiSequence.SEARCH}_buyerFF`)
      // if (payment["@ondc/org/buyer_app_finder_fee_amount"])
      if (
        !on_init.payment['@ondc/org/buyer_app_finder_fee_amount'] ||
        parseFloat(on_init.payment['@ondc/org/buyer_app_finder_fee_amount']) != buyerFF
      ) {
        onInitObj.buyerFF = `Buyer app finder fee can't change in /${constants.RET_ONINIT}`
        // logger.info(`Buyer app finder fee amount can't change in /on_init`);
      }
    } catch (error: any) {
      logger.error(`!!Error while checking buyer app finder fee in /${constants.RET_ONINIT}, ${error.stack}`)
    }

    try {
      logger.info(`Checking Quote Object in /${constants.RET_ONSELECT} and /${constants.RET_ONINIT}`)
      const on_select_quote = getValue('quoteObj')
      if (!_.isEqual(on_select_quote, on_init.quote)) {
        onInitObj.quoteErr = `Discrepancies between the quote object in /${constants.RET_ONSELECT} and /${constants.RET_ONINIT}`
      }
    } catch (error: any) {
      logger.error(`!!Error while checking quote object in /${constants.RET_ONSELECT} and /${constants.RET_ONINIT}`)
    }

    try {
      logger.info(`checking payment object in /${constants.RET_ONINIT}`)
      if (on_init.payment['@ondc/org/settlement_details'][0]['settlement_counterparty'] != 'seller-app') {
        onInitObj.sttlmntcntrparty = `settlement_counterparty is expected to be 'seller-app' in @ondc/org/settlement_details`
      }
    } catch (error: any) {
      logger.error(`!!Error while checking payment object in /${constants.RET_ONINIT}`)
    }

    try {
      logger.info(`storing payment settlement details in /${constants.RET_ONINIT}`)
      if (on_init.payment.hasOwnProperty('@ondc/org/settlement_details'))
        setValue('sttlmntdtls', on_init.payment['@ondc/org/settlement_details'][0])
      else {
        onInitObj.pymntSttlmntObj = `payment settlement_details missing in /${constants.RET_ONINIT}`
      }
    } catch (error: any) {
      logger.error(`!!Error while storing payment settlement details in /${constants.RET_ONINIT}`)
    }

    return onInitObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.RET_ONINIT} API`, err)
  }
}
