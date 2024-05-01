/* eslint-disable no-prototype-builtins */
import _, { isArray } from 'lodash'
import constants, { ApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import {
  validateSchema,
  isObjectEmpty,
  checkContext,
  checkItemTag,
  checkBppIdOrBapId,
  areGSTNumbersMatching,
  isTagsValid,
  areGSTNumbersDifferent,
  compareObjects,
  sumQuoteBreakUp,
  payment_status,
  compareQuoteObjects,
} from '../..'
import { getValue, setValue } from '../../../shared/dao'

export const checkConfirm = (data: any, msgIdSet: any) => {
  const cnfrmObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.CONFIRM]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
    const parentItemIdSet: any = getValue(`parentItemIdSet`)
    const select_customIdArray: any = getValue(`select_customIdArray`)
    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.CONFIRM, data)

    const contextRes: any = checkContext(context, constants.CONFIRM)

    const checkBap = checkBppIdOrBapId(context.bap_id)
    const checkBpp = checkBppIdOrBapId(context.bpp_id)

    if (checkBap) Object.assign(cnfrmObj, { bap_id: 'context/bap_id should not be a url' })
    if (checkBpp) Object.assign(cnfrmObj, { bpp_id: 'context/bpp_id should not be a url' })
    if (schemaValidation !== 'error') {
      Object.assign(cnfrmObj, schemaValidation)
    }
    if (!_.isEqual(data.context.domain.split(':')[1], getValue(`domain`))) {
      cnfrmObj[`Domain[${data.context.action}]`] = `Domain should be same in each action`
    }

    try {
      logger.info(`Adding Message Id /${constants.CONFIRM}`)
      if (msgIdSet.has(context.message_id)) {
        cnfrmObj[`${ApiSequence.CONFIRM}_msgId`] = `Message id should not be same with previous calls`
      }
      msgIdSet.add(context.message_id)
      setValue(`${ApiSequence.CONFIRM}_msgId`, data.context.message_id)
    } catch (error: any) {
      logger.error(`!!Error while checking message id for /${constants.CONFIRM}, ${error.stack}`)
    }

    if (!contextRes?.valid) {
      Object.assign(cnfrmObj, contextRes.ERRORS)
    }

    setValue(`${ApiSequence.CONFIRM}`, data)

    try {
      logger.info(`Comparing city of /${constants.SEARCH} and /${constants.CONFIRM}`)
      if (!_.isEqual(searchContext.city, context.city)) {
        cnfrmObj.city = `City code mismatch in /${constants.SEARCH} and /${constants.CONFIRM}`
      }
    } catch (error: any) {
      logger.error(`!!Error while comparing city in /${constants.SEARCH} and /${constants.CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing timestamp of /${constants.ON_INIT} and /${constants.CONFIRM}`)
      if (_.gte(getValue('tmpstmp'), context.timestamp)) {
        cnfrmObj.tmpstmp = `Timestamp for /${constants.ON_INIT} api cannot be greater than or equal to /${constants.CONFIRM} api`
      }

      setValue('tmpstmp', context.timestamp)
      setValue('cnfrmTmpstmp', context.timestamp)
    } catch (error: any) {
      logger.error(
        `!!Error while comparing timestamp for /${constants.ON_INIT} and /${constants.CONFIRM} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.SELECT} and /${constants.CONFIRM}`)
      if (!_.isEqual(getValue('txnId'), context.transaction_id)) {
        cnfrmObj.txnId = `Transaction Id should be same from /${constants.SELECT} onwards`
      }
    } catch (error: any) {
      logger.info(
        `!!Error while comparing transaction ids for /${constants.SELECT} and /${constants.CONFIRM} api, ${error.stack}`,
      )
    }

    const confirm = message.order

    const cnfrmOrdrId = confirm.id
    setValue('cnfrmOrdrId', cnfrmOrdrId)

    try {
      logger.info(`Checking order state in /${constants.CONFIRM}`)
      if (confirm.state != 'Created') {
        cnfrmObj.state = `Default order state should be used in /${constants.CONFIRM}`
      }
    } catch (error: any) {
      logger.error(`!!Error while checking order state in /${constants.CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Checking provider id and location in /${constants.CONFIRM}`)
      if (confirm.provider.id != getValue('providerId')) {
        cnfrmObj.prvdrId = `Provider Id mismatches in /${constants.ON_SEARCH} and /${constants.CONFIRM}`
      }

      if (confirm.provider.locations[0].id != getValue('providerLoc')) {
        cnfrmObj.prvdrLoc = `provider.locations[0].id mismatches in /${constants.ON_SEARCH} and /${constants.CONFIRM}`
      }
    } catch (error: any) {
      logger.error(`!!Error while checking provider id and location in /${constants.CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing item Ids and fulfillment ids in /${constants.ON_SELECT} and /${constants.CONFIRM}`)
      const itemFlfllmnts: any = getValue('itemFlfllmnts')
      const itemsIdList: any = getValue('itemsIdList')
      let i = 0
      const len = confirm.items.length
      let itemsCountChange = false
      while (i < len) {
        const itemId = confirm.items[i].id
        const item = confirm.items[i]
        if (checkItemTag(item, select_customIdArray)) {
          const itemkey = `item${i}tags.parent_id`
          cnfrmObj[itemkey] =
            `items[${i}].tags.parent_id mismatches for Item ${itemId} in /${constants.SELECT} and /${constants.CONFIRM}`
        }
        if (parentItemIdSet && item.parent_item_id && !parentItemIdSet.includes(item.parent_item_id)) {
          const itemkey = `item_PrntItmId${i}`
          cnfrmObj[itemkey] =
            `items[${i}].parent_item_id mismatches for Item ${itemId} in /${constants.ON_SEARCH} and /${constants.CONFIRM}`
        }
        if (itemId in itemFlfllmnts) {
          if (confirm.items[i].fulfillment_id != itemFlfllmnts[itemId]) {
            const itemkey = `item_FFErr${i}`
            cnfrmObj[itemkey] =
              `items[${i}].fulfillment_id mismatches for Item ${itemId} in /${constants.ON_SELECT} and /${constants.CONFIRM}`
          }
        } else {
          const itemkey = `item_FFErr${i}`
          cnfrmObj[itemkey] = `Item Id ${itemId} does not exist in /${constants.ON_SELECT}`
        }

        if (itemId in itemsIdList) {
          if (confirm.items[i].quantity.count != itemsIdList[itemId]) {
            itemsIdList[itemId] = confirm.items[i].quantity.count //changing the item quantity as per the order confirmation
            itemsCountChange = true
            cnfrmObj.countErr = `Warning: items[${i}].quantity.count for item ${itemId} mismatches with the items quantity selected in /${constants.SELECT}`
          }
        }

        i++
      }

      if (itemsCountChange) {
        setValue('itemsIdList', itemsIdList)
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing Item and Fulfillment Id in /${constants.ON_SELECT} and /${constants.CONFIRM}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Checking for number of digits in tax number in message.order.tags[0].list`)
      if (message.order.tags && isArray(message.order.tags)) {
        const list = message.order.tags[0]?.list

        list.map((item: any) => {
          if (item.code == 'tax_number') {
            if (item.value.length !== 15) {
              const key = `message.order.tags[0].list`
              cnfrmObj[key] = `Number of digits in tax number in  message.order.tags[0].list should be 15`
            }
          }
        })
      }
    } catch (error: any) {
      logger.error(`Error while checking for the number of digits in tax_number, ${error.stack}`)
    }

    try {
      logger.info(`Comparing billing object in /${constants.INIT} and /${constants.CONFIRM}`)
      const billing = getValue('billing')

      const billingErrors = compareObjects(billing, confirm.billing)

      if (billingErrors) {
        let i = 0
        const len = billingErrors.length
        while (i < len) {
          const key = `billingErr${i}`
          cnfrmObj[key] = `${billingErrors[i]} when compared with init billing object`
          i++
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while comparing billing object in /${constants.INIT} and /${constants.CONFIRM}`)
    }

    try {
      logger.info(`Checking fulfillments objects in /${constants.CONFIRM}`)
      const itemFlfllmnts: any = getValue('itemFlfllmnts')
      let i = 0
      const len = confirm.fulfillments.length
      while (i < len) {
        //Comparing fulfillment Ids
        if (confirm.fulfillments[i].id) {
          const id = confirm.fulfillments[i].id
          if (!Object.values(itemFlfllmnts).includes(id)) {
            const key = `ffID ${id}`
            //MM->Mismatch
            cnfrmObj[key] = `fulfillment id ${id} does not exist in /${constants.ON_SELECT}`
          }
        } else {
          cnfrmObj.ffId = `fulfillments[${i}].id is missing in /${constants.CONFIRM}`
        }

        const ffId = confirm.fulfillments[i].id || ""
        if (getValue(`${ffId}_tracking`)) {
          if ((confirm.fulfillments[i].tracking === false || confirm.fulfillments[i].tracking === true)) {
            if (getValue(`${ffId}_tracking`) != confirm.fulfillments[i].tracking) {
              logger.info(`Fulfillment Tracking mismatch with the ${constants.ON_SELECT} call`)
              cnfrmObj["ffTracking"] = `Fulfillment Tracking mismatch with the ${constants.ON_SELECT} call`
            }
          }
          else {
            logger.info(`Tracking must be present for fulfillment ID: ${ffId}`)
            cnfrmObj["ffTracking"] = `Tracking must be present for fulfillment ID: ${ffId} in boolean form`
          }
        }
        if (!confirm.fulfillments[i].end || !confirm.fulfillments[i].end.person) {
          cnfrmObj.ffprsn = `fulfillments[${i}].end.person object is missing`
        }

        if (!_.isEqual(confirm.fulfillments[i].end.location.gps, getValue('buyerGps'))) {
          cnfrmObj.gpsErr = `fulfillments[${i}].end.location gps is not matching with gps in /select`
        }

        if (!_.isEqual(confirm.fulfillments[i].end.location.address.area_code, getValue('buyerAddr'))) {
          cnfrmObj.gpsErr = `fulfillments[${i}].end.location.address.area_code is not matching with area_code in /select`
        }

        i++
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments object in /${constants.CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Checking payment object in /${constants.CONFIRM}`)

      if (parseFloat(confirm.payment.params.amount) != parseFloat(confirm.quote.price.value)) {
        cnfrmObj.confirmedAmount = "Quoted price (/confirm) doesn't match with the amount in payment.params"
      }

      if (!_.isEqual(confirm.payment['@ondc/org/settlement_details'][0], getValue('sttlmntdtls'))) {
        cnfrmObj.sttlmntdtls = `payment settlement_details mismatch in /${constants.ON_INIT} & /${constants.CONFIRM}`
      }

      if (!confirm.hasOwnProperty('created_at') || !confirm.hasOwnProperty('updated_at')) {
        cnfrmObj.ordertmpstmp = `order created and updated timestamps are mandatory in /${constants.CONFIRM}`
      } else {
        if (!_.isEqual(confirm.created_at, getValue('tmpstmp'))) {
          cnfrmObj.orderCrtd = `order.created_at timestamp should match context.timestamp`
        }

        if (!_.isEqual(confirm.created_at, confirm.updated_at)) {
          cnfrmObj.ordrupdtd = `order.updated_at timestamp should match order.created_at timestamp`
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking payment object in /${constants.CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`storing payment object in /${constants.CONFIRM}`)
      setValue('cnfrmpymnt', confirm.payment)
    } catch (error: any) {
      logger.error(`!!Error while storing payment object in /${constants.CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing Quote object for /${constants.ON_SELECT} and /${constants.CONFIRM}`)
      const on_select_quote: any = getValue('quoteObj')
      const quoteErrors = compareQuoteObjects(on_select_quote, confirm.quote, constants.ON_SELECT, constants.CONFIRM)
      const hasItemWithQuantity = _.some(confirm.quote.breakup, item => _.has(item, 'item.quantity'));
      if (hasItemWithQuantity) {
        const key = `quantErr`
        cnfrmObj[key] = `Extra attribute Quantity provided in quote object i.e not supposed to be provided after on_select so invalid quote object`
      }
      else if (quoteErrors) {
        let i = 0
        const len = quoteErrors.length
        while (i < len) {
          const key = `quoteErr${i}`
          cnfrmObj[key] = `${quoteErrors[i]}`
          i++
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while Comparing Quote object for /${constants.ON_SELECT} and /${constants.CONFIRM}`)
    }

    try {
      logger.info(`Checking quote breakup prices for /${constants.CONFIRM}`)
      if (!sumQuoteBreakUp(confirm.quote)) {
        const key = `invldPrices`
        cnfrmObj[key] = `item quote breakup prices for ${constants.CONFIRM} should be equal to the total price.`
        logger.error(`item quote breakup prices for ${constants.CONFIRM} should be equal to the total price`)
      }
    } catch (error: any) {
      logger.error(`!!Error while Comparing Quote object for /${constants.CONFIRM}`)
    }

    try {
      logger.info(`Checking Buyer App finder fee amount in /${constants.CONFIRM}`)
      const buyerFF: any = getValue(`${ApiSequence.SEARCH}_buyerFF`)
      if (
        !confirm.payment['@ondc/org/buyer_app_finder_fee_amount'] ||
        parseFloat(confirm.payment['@ondc/org/buyer_app_finder_fee_amount']) != buyerFF
      ) {
        cnfrmObj.bapFinderFee = `Buyer App Finder fee can't change`
        logger.info(
          `Buyer app finder fee ${confirm.payment['@ondc/org/buyer_app_finder_fee_amount']} can't change in /${constants.CONFIRM}`,
        )
      }
    } catch (error: any) {
      logger.error(`!!Error while Checking Buyer App finder fee amount in /${constants.CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info('storing order created and updated timestamps')
      if (confirm.created_at) setValue('ordrCrtd', confirm.created_at)

      if (confirm.updated_at) setValue('ordrUpdtd', confirm.updated_at)
    } catch (error: any) {
      logger.error(`!!Error while storing order created and updated timestamps in /${constants.CONFIRM}`)
    }

    try {
      logger.info(`Comparing order price value in /${constants.ON_SELECT} and /${constants.CONFIRM}`)
      const onSelectPrice: any = getValue('onSelectPrice')
      const confirmQuotePrice = parseFloat(confirm.quote.price.value)

      if (onSelectPrice != confirmQuotePrice) {
        logger.info(
          `order quote price in /${constants.CONFIRM} is not equal to the quoted price in /${constants.ON_SELECT}`,
        )
        cnfrmObj.quoteErr = `Quoted Price in /${constants.CONFIRM} INR ${confirmQuotePrice} does not match with the quoted price in /${constants.ON_SELECT} INR ${onSelectPrice}`
      }

      setValue('quotePrice', confirmQuotePrice)
    } catch (error: any) {
      logger.error(`!!Error while comparing order price value in /${constants.ON_SELECT} and /${constants.CONFIRM}`)
    }

    try {
      logger.info(`Comparing tags in /${constants.ON_INIT} and /${constants.CONFIRM}`)
      const on_init_tags: any[] | any = getValue('on_init_tags')
      if (confirm.tags) {
        const isValid = areGSTNumbersMatching(on_init_tags, confirm.tags, 'bpp_terms')
        if (isValid === false) {
          cnfrmObj.confirmTags = `Tags should have same and valid gst_number as passed in /${constants.ON_INIT}`
        }

        const isValidBap = isTagsValid(confirm.tags, 'bap_terms')
        if (isValidBap === false) {
          cnfrmObj.bapGstTags = `Tags/bap_terms should have valid gst number and fields in /${constants.CONFIRM}`
        }

        const areGstDiff = areGSTNumbersDifferent(confirm.tags)
        if (areGstDiff === true) {
          cnfrmObj.sameGstNumber = `Tags/bap_terms and Tags/bpp_terms should have different gst number in /${constants.CONFIRM}`
        }

        setValue('confirm_tags', confirm.tags)
      }
    } catch (error: any) {
      logger.error(`!!Error while Comparing tags in /${constants.ON_INIT} and /${constants.CONFIRM} ${error.stack}`)
    }

    try {
      logger.info(`Checking if transaction_id is present in message.order.payment`)
      const payment = confirm.payment
      const status = payment_status(payment)
      if (!status) {
        cnfrmObj['message/order/transaction_id'] = `Transaction_id missing in message/order/payment`
      }
    } catch (err: any) {
      logger.error(`Error while checking transaction is in message.order.payment`)
    }

    return cnfrmObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.CONFIRM} API`, err)
  }
}
