/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { ApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import {
  validateSchema,
  isObjectEmpty,
  checkContext,
  isObjectEqual,
  checkItemTag,
  checkBppIdOrBapId,
  areGSTNumbersMatching,
  isTagsValid,
  areGSTNumbersDifferent,
} from '../../../utils'
import { getValue, setValue } from '../../../shared/dao'

export const checkConfirm = (data: any) => {
  const cnfrmObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.CONFIRM]: 'Json cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
    const select: any = getValue(`${ApiSequence.SELECT}`)
    const parentItemIdSet: any = getValue(`parentItemIdSet`)
    const select_customIdArray: any = getValue(`select_customIdArray`)
    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.RET_CONFIRM, data)

    const contextRes: any = checkContext(context, constants.RET_CONFIRM)

    const checkBap = checkBppIdOrBapId(context.bap_id)
    const checkBpp = checkBppIdOrBapId(context.bpp_id)

    if (checkBap) Object.assign(cnfrmObj, { bap_id: 'context/bap_id should not be a url' })
    if (checkBpp) Object.assign(cnfrmObj, { bpp_id: 'context/bpp_id should not be a url' })
    if (schemaValidation !== 'error') {
      Object.assign(cnfrmObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(cnfrmObj, contextRes.ERRORS)
    }

    setValue(`${ApiSequence.CONFIRM}`, data)

    try {
      logger.info(`Comparing city of /${constants.RET_SEARCH} and /${constants.RET_CONFIRM}`)
      if (!_.isEqual(searchContext.city, context.city)) {
        cnfrmObj.city = `City code mismatch in /${constants.RET_SEARCH} and /${constants.RET_CONFIRM}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing city in /${constants.RET_SEARCH} and /${constants.RET_CONFIRM}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing timestamp of /${constants.RET_ONINIT} and /${constants.RET_CONFIRM}`)
      if (_.gte(getValue('tmpstmp'), context.timestamp)) {
        cnfrmObj.tmpstmp = `Timestamp for /${constants.RET_ONINIT} api cannot be greater than or equal to /${constants.RET_CONFIRM} api`
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.error(
        `!!Error while comparing timestamp for /${constants.RET_ONINIT} and /${constants.RET_CONFIRM} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.RET_SELECT} and /${constants.RET_CONFIRM}`)
      if (!_.isEqual(select.context.transaction_id, context.transaction_id)) {
        cnfrmObj.txnId = `Transaction Id should be same from /${constants.RET_SELECT} onwards`
      }
    } catch (error: any) {
      logger.info(
        `!!Error while comparing transaction ids for /${constants.RET_SELECT} and /${constants.RET_CONFIRM} api, ${error.stack}`,
      )
    }

    const confirm = message.order

    const cnfrmOrdrId = confirm.id
    setValue('cnfrmOrdrId', cnfrmOrdrId)

    try {
      logger.info(`Checking order state in /${constants.RET_CONFIRM}`)
      if (confirm.state != 'Created') {
        cnfrmObj.state = `Default order state should be used in /${constants.RET_CONFIRM}`
      }
    } catch (error: any) {
      logger.error(`!!Error while checking order state in /${constants.RET_CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Checking provider id and location in /${constants.RET_CONFIRM}`)
      if (confirm.provider.id != getValue('providerId')) {
        cnfrmObj.prvdrId = `Provider Id mismatches in /${constants.RET_ONSEARCH} and /${constants.RET_CONFIRM}`
      }

      if (confirm.provider.locations[0].id != getValue('providerLoc')) {
        cnfrmObj.prvdrLoc = `provider.locations[0].id mismatches in /${constants.RET_ONSEARCH} and /${constants.RET_CONFIRM}`
      }
    } catch (error: any) {
      logger.error(`!!Error while checking provider id and location in /${constants.RET_CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing item Ids and fulfillment ids in /${constants.RET_ONSELECT} and /${constants.RET_CONFIRM}`)
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
          cnfrmObj[
            itemkey
          ] = `items[${i}].tags.parent_id mismatches for Item ${itemId} in /${constants.RET_SELECT} and /${constants.RET_CONFIRM}`
        }

        if (!parentItemIdSet.includes(item.parent_item_id)) {
          const itemkey = `item_PrntItmId${i}`
          cnfrmObj[
            itemkey
          ] = `items[${i}].parent_item_id mismatches for Item ${itemId} in /${constants.RET_ONSELECT} and /${constants.RET_CONFIRM}`
        }

        if (itemId in itemFlfllmnts) {
          if (confirm.items[i].fulfillment_id != itemFlfllmnts[itemId]) {
            const itemkey = `item_FFErr${i}`
            cnfrmObj[
              itemkey
            ] = `items[${i}].fulfillment_id mismatches for Item ${itemId} in /${constants.RET_ONSELECT} and /${constants.RET_CONFIRM}`
          }
        } else {
          const itemkey = `item_FFErr${i}`
          cnfrmObj[itemkey] = `Item Id ${itemId} does not exist in /${constants.RET_ONSELECT}`
        }

        if (itemId in itemsIdList) {
          if (confirm.items[i].quantity.count != itemsIdList[itemId]) {
            itemsIdList[itemId] = confirm.items[i].quantity.count //changing the item quantity as per the order confirmation
            itemsCountChange = true
            cnfrmObj.cntErr = `Warning: items[${i}].quantity.count for item ${itemId} mismatches with the items quantity selected in /${constants.RET_SELECT}`
          }
        }

        i++
      }

      if (itemsCountChange) {
        setValue('itemsIdList', itemsIdList)
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing Item and Fulfillment Id in /${constants.RET_ONSELECT} and /${constants.RET_CONFIRM}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing billing object in /${constants.RET_INIT} and /${constants.RET_CONFIRM}`)
      const billing = getValue('billing')
      if (isObjectEqual(billing, confirm.billing).length > 0) {
        const billingMismatch = isObjectEqual(billing, confirm.billing)
        cnfrmObj.bill = `${billingMismatch.join(', ')} mismatches in /billing in /${constants.RET_INIT} and /${
          constants.RET_CONFIRM
        }`
      }

      setValue('billing', confirm.billing)
    } catch (error: any) {
      logger.error(`!!Error while comparing billing object in /${constants.RET_INIT} and /${constants.RET_CONFIRM}`)
    }

    try {
      logger.info(`Checking fulfillments objects in /${constants.RET_CONFIRM}`)
      const itemFlfllmnts: any = getValue('itemFlfllmnts')
      let i = 0
      const len = confirm.fulfillments.length
      while (i < len) {
        //Comparing fulfillment Ids
        if (confirm.fulfillments[i].id) {
          const id = confirm.fulfillments[i].id
          if (!Object.values(itemFlfllmnts).includes(id)) {
            const key = `ffID${id}`
            //MM->Mismatch
            cnfrmObj[key] = `fulfillment id ${id} does not exist in /${constants.RET_ONSELECT}`
          }
        } else {
          cnfrmObj.ffId = `fulfillments[${i}].id is missing in /${constants.RET_CONFIRM}`
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
      logger.error(`!!Error while checking fulfillments object in /${constants.RET_CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Checking payment object in /${constants.RET_CONFIRM}`)

      if (parseFloat(confirm.payment.params.amount) != parseFloat(confirm.quote.price.value)) {
        cnfrmObj.confirmedAmount = "Quoted price (/confirm) doesn't match with the amount in payment.params"
      }

      if (!_.isEqual(confirm.payment['@ondc/org/settlement_details'][0], getValue('sttlmntdtls'))) {
        cnfrmObj.sttlmntdtls = `payment settlement_details mismatch in /${constants.RET_ONINIT} & /${constants.RET_CONFIRM}`
      }

      if (!confirm.hasOwnProperty('created_at') || !confirm.hasOwnProperty('updated_at')) {
        cnfrmObj.ordertmpstmp = `order created and updated timestamps are mandatory in /${constants.RET_CONFIRM}`
      } else {
        if (!_.isEqual(confirm.created_at, getValue('tmpstmp'))) {
          cnfrmObj.orderCrtd = `order.created_at timestamp should match context.timestamp`
        }

        if (!_.isEqual(confirm.created_at, confirm.updated_at)) {
          cnfrmObj.ordrupdtd = `order.updated_at timestamp should match order.created_at timestamp`
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking payment object in /${constants.RET_CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`storing payment object in /${constants.RET_CONFIRM}`)
      setValue('cnfrmpymnt', confirm.payment)
    } catch (error: any) {
      logger.error(`!!Error while storing payment object in /${constants.RET_CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing Quote object for /${constants.RET_ONSELECT} and /${constants.RET_CONFIRM}`)
      if (!_.isEqual(getValue('quoteObj'), confirm.quote)) {
        cnfrmObj.quoteObj = `Discrepancies between the quote object in /${constants.RET_ONSELECT} and /${constants.RET_CONFIRM}`
      }
    } catch (error: any) {
      logger.error(`!!Error while Comparing Quote object for /${constants.RET_ONSELECT} and /${constants.RET_CONFIRM}`)
    }

    try {
      logger.info(`Checking Buyer App finder fee amount in /${constants.RET_CONFIRM}`)
      const buyerFF: any = getValue(`${ApiSequence.SEARCH}_buyerFF`)
      if (
        !confirm.payment['@ondc/org/buyer_app_finder_fee_amount'] ||
        parseFloat(confirm.payment['@ondc/org/buyer_app_finder_fee_amount']) != buyerFF
      ) {
        cnfrmObj.bapFinderFee = `Buyer App Finder fee can't change`
        logger.info(
          `Buyer app finder fee ${confirm.payment['@ondc/org/buyer_app_finder_fee_amount']} can't change in /${constants.RET_CONFIRM}`,
        )
      }
    } catch (error: any) {
      logger.error(`!!Error while Checking Buyer App finder fee amount in /${constants.RET_CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info('storing order created and updated timestamps')
      if (confirm.created_at) setValue('ordrCrtd', confirm.created_at)

      if (confirm.updated_at) setValue('ordrUpdtd', confirm.updated_at)
    } catch (error: any) {
      logger.error(`!!Error while storing order created and updated timestamps in /${constants.RET_CONFIRM}`)
    }

    try {
      logger.info(`Comparing order price value in /${constants.RET_ONSELECT} and /${constants.RET_CONFIRM}`)
      const onSelectPrice: any = getValue('onSelectPrice')
      const confirmQuotePrice = parseFloat(confirm.quote.price.value)

      if (onSelectPrice != confirmQuotePrice) {
        logger.info(
          `order quote price in /${constants.RET_CONFIRM} is not equal to the quoted price in /${constants.RET_ONSELECT}`,
        )
        cnfrmObj.quoteErr = `Quoted Price in /${constants.RET_CONFIRM} INR ${confirmQuotePrice} does not match with the quoted price in /${constants.RET_ONSELECT} INR ${onSelectPrice}`
      }

      setValue('quotePrice', confirmQuotePrice)
    } catch (error: any) {
      logger.error(
        `!!Error while comparing order price value in /${constants.RET_ONSELECT} and /${constants.RET_CONFIRM}`,
      )
    }

    try {
      logger.info(`Comparing tags in /${constants.RET_ONINIT} and /${constants.RET_CONFIRM}`)
      const on_init_tags: any[] | any = getValue('on_init_tags')
      if (confirm.tags) {
        const isValid = areGSTNumbersMatching(on_init_tags, confirm.tags, 'bpp_terms')
        if (isValid === false) {
          cnfrmObj.confirmTags = `Tags should have same and valid gst_number as passed in /${constants.RET_ONINIT}`
        }

        const isValidBap = isTagsValid(confirm.tags, 'bap_terms')
        if (isValidBap === false) {
          cnfrmObj.bapGstTags = `Tags/bap_terms should have valid gst number and fields in /${constants.RET_CONFIRM}`
        }

        const areGstDiff = areGSTNumbersDifferent(confirm.tags)
        if (areGstDiff === true) {
          cnfrmObj.sameGstNumber = `Tags/bap_terms and Tags/bpp_terms should have different gst number in /${constants.RET_CONFIRM}`
        }

        setValue('confirm_tags', confirm.tags)
      }
    } catch (error: any) {
      logger.error(
        `!!Error while Comparing tags in /${constants.RET_ONINIT} and /${constants.RET_CONFIRM} ${error.stack}`,
      )
    }

    return cnfrmObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.RET_CONFIRM} API`, err)
  }
}
