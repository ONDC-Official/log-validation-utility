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
  compareCoordinates,
  checkItemTag,
  checkBppIdOrBapId,
} from '../../../utils'
import { getValue, setValue } from '../../../shared/dao'

export const checkOnConfirm = (data: any) => {
  const onCnfrmObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.ON_CONFIRM]: 'Json cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
    const parentItemIdSet: any = getValue(`parentItemIdSet`)
    const select_customIdArray: any = getValue(`select_customIdArray`)

    const schemaValidation = validateSchema('RET11', constants.RET_ONCONFIRM, data)

    const contextRes: any = checkContext(context, constants.RET_ONCONFIRM)

    const checkBap = checkBppIdOrBapId(context.bap_id)
    const checkBpp = checkBppIdOrBapId(context.bpp_id)

    if (checkBap) Object.assign(onCnfrmObj, { bap_id: 'context/bap_id should not be a url' })
    if (checkBpp) Object.assign(onCnfrmObj, { bpp_id: 'context/bpp_id should not be a url' })

    if (schemaValidation !== 'error') {
      Object.assign(onCnfrmObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(onCnfrmObj, contextRes.ERRORS)
    }

    setValue(`${ApiSequence.ON_CONFIRM}`, data)

    try {
      logger.info(`Comparing city of /${constants.RET_SEARCH} and /${constants.RET_ONCONFIRM}`)
      if (!_.isEqual(searchContext.city, context.city)) {
        onCnfrmObj.city = `City code mismatch in /${constants.RET_SEARCH} and /${constants.RET_ONCONFIRM}`
      }
    } catch (error: any) {
      logger.info(
        `Error while comparing city in /${constants.RET_SEARCH} and /${constants.RET_ONCONFIRM}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing timestamp of /${constants.RET_CONFIRM} and /${constants.RET_ONCONFIRM}`)
      const tmpstmp = getValue('tmpstmp')
      if (_.gte(tmpstmp, context.timestamp)) {
        onCnfrmObj.tmpstmp = `Timestamp for /${constants.RET_CONFIRM} api cannot be greater than or equal to /${constants.RET_ONCONFIRM} api`
      } else {
        const timeDiff = timeDifference(context.timestamp, tmpstmp)
        logger.info(timeDiff)
        if (timeDiff > 5000) {
          onCnfrmObj.tmpstmp = `context/timestamp difference between /${constants.RET_ONCONFIRM} and /${constants.RET_CONFIRM} should be smaller than 5 sec`
        }
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.info(
        `Error while comparing timestamp for /${constants.RET_CONFIRM} and /${constants.RET_ONCONFIRM} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.RET_SELECT} and /${constants.RET_ONCONFIRM}`)
      if (!_.isEqual(getValue('txnId'), context.transaction_id)) {
        onCnfrmObj.txnId = `Transaction Id should be same from /${constants.RET_SELECT} onwards`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing transaction ids for /${constants.RET_SELECT} and /${constants.RET_ONCONFIRM} api, ${error.stack}`,
      )
    }

    const on_confirm = message.order

    try {
      logger.info(`Comparing order ids in /${constants.RET_CONFIRM} and /${constants.RET_ONCONFIRM}`)
      if (getValue('cnfrmOrdrId') != on_confirm.id) {
        onCnfrmObj.orderID = `Order Id mismatches in /${constants.RET_CONFIRM} and /${constants.RET_ONCONFIRM}`
      }
    } catch (error: any) {
      logger.error(`!!Error while trying to fetch order ids in /${constants.RET_ONCONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`checking created_at and updated_at timestamp in /${constants.RET_ONCONFIRM}`)
      const cnfrmOrdrCrtd = getValue('ordrCrtd')
      const cnfrmOrdrUpdtd = getValue('ordrUpdtd')
      if (on_confirm.state === 'Created' || on_confirm.state === 'Accepted') {
        if (cnfrmOrdrCrtd && (!on_confirm.created_at || on_confirm.created_at != cnfrmOrdrCrtd)) {
          onCnfrmObj.crtdtmstmp = `order.created_at timestamp mismatches in /${constants.RET_CONFIRM} and /${constants.RET_ONCONFIRM}`
        }

        if (
          cnfrmOrdrUpdtd &&
          (!on_confirm.updated_at ||
            _.gte(cnfrmOrdrUpdtd, on_confirm.updated_at) ||
            on_confirm.updated_at != getValue('tmpstmp'))
        ) {
          onCnfrmObj.updtdtmstmp = `order.updated_at timestamp should be updated as per the context.timestamp (since default fulfillment state is added)`
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking order timestamps in /${constants.RET_ONCONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Checking provider id and location in /${constants.RET_ONCONFIRM}`)
      if (on_confirm.provider.id != getValue('providerId')) {
        onCnfrmObj.prvdrId = `Provider Id mismatches in /${constants.RET_ONSEARCH} and /${constants.RET_ONCONFIRM}`
      }

      if (on_confirm.provider.locations[0].id != getValue('providerLoc')) {
        onCnfrmObj.prvdrLoc = `provider.locations[0].id mismatches in /${constants.RET_ONSEARCH} and /${constants.RET_ONCONFIRM}`
      }
    } catch (error: any) {
      logger.error(`!!Error while checking provider id and location in /${constants.RET_ONCONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(
        `Comparing item Ids and fulfillment ids in /${constants.RET_ONSELECT} and /${constants.RET_ONCONFIRM}`,
      )
      const itemFlfllmnts: any = getValue('itemFlfllmnts')
      const itemsIdList: any = getValue('itemsIdList')
      let i = 0
      const len = on_confirm.items.length

      while (i < len) {
        const itemId = on_confirm.items[i].id
        const item = on_confirm.items[i]

        if (checkItemTag(item, select_customIdArray)) {
          const itemkey = `item${i}tags.parent_id`
          onCnfrmObj[
            itemkey
          ] = `items[${i}].tags.parent_id mismatches for Item ${itemId} in /${constants.RET_SELECT} and /${constants.RET_INIT}`
        }

        if (!parentItemIdSet.includes(item.parent_item_id)) {
          const itemkey = `item_PrntItmId${i}`
          onCnfrmObj[
            itemkey
          ] = `items[${i}].parent_item_id mismatches for Item ${itemId} in /${constants.RET_ONSELECT} and /${constants.RET_ONINIT}`
        }

        if (itemId in itemFlfllmnts) {
          if (on_confirm.items[i].fulfillment_id != itemFlfllmnts[itemId]) {
            const itemkey = `item_FFErr${i}`
            onCnfrmObj[
              itemkey
            ] = `items[${i}].fulfillment_id mismatches for Item ${itemId} in /${constants.RET_ONSELECT} and /${constants.RET_ONCONFIRM}`
          }
        } else {
          const itemkey = `item_FFErr${i}`
          onCnfrmObj[itemkey] = `Item Id ${itemId} does not exist in /${constants.RET_ONSELECT}`
        }

        if (itemId in itemsIdList) {
          if (on_confirm.items[i].quantity.count != itemsIdList[itemId]) {
            onCnfrmObj.cntErr = `Warning: items[${i}].quantity.count for item ${itemId} mismatches with the items quantity selected in /${constants.RET_SELECT}`
          }
        }

        i++
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing Item and Fulfillment Id in /${constants.RET_ONSELECT} and /${constants.RET_CONFIRM}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing billing object in ${constants.RET_CONFIRM} and /${constants.RET_ONCONFIRM}`)
      const billing = getValue('billing')
      if (isObjectEqual(billing, on_confirm.billing).length > 0) {
        const billingMismatch = isObjectEqual(billing, on_confirm.billing)
        onCnfrmObj.bill = `${billingMismatch.join(', ')} mismatches in /billing in /${constants.RET_CONFIRM} and /${
          constants.RET_ONCONFIRM
        }`
      }
      // setValue("billing", on_confirm.billing);
    } catch (error: any) {
      logger.info(`!Error while comparing billing object in /${constants.RET_CONFIRM} and /${constants.RET_ONCONFIRM}`)
    }

    try {
      logger.info(`Checking fulfillments objects in /${constants.RET_ONCONFIRM}`)
      const itemFlfllmnts: any = getValue('itemFlfllmnts')
      let i = 0
      const len = on_confirm.fulfillments.length
      while (i < len) {
        //Comparing fulfillment Ids
        if (on_confirm.fulfillments[i].id) {
          const id = on_confirm.fulfillments[i].id
          if (!Object.values(itemFlfllmnts).includes(id)) {
            const key = `ffID${id}`
            //MM->Mismatch
            onCnfrmObj[key] = `fulfillment id ${id} does not exist in /${constants.RET_ONSELECT}`
          }
        } else {
          onCnfrmObj.ffId = `fulfillments[${i}].id is missing in /${constants.RET_ONCONFIRM}`
        }

        logger.info('Checking the fulfillments state')

        const ffDesc = on_confirm.fulfillments[i].state.descriptor

        const ffStateCheck = ffDesc.hasOwnProperty('code') ? ffDesc.code === 'Pending' : false

        if (!ffStateCheck) {
          const key = `ffState${i}`
          onCnfrmObj[key] = `default fulfillments state is missing in /${constants.RET_ONCONFIRM}`
        }

        if (!on_confirm.fulfillments[i].start || !on_confirm.fulfillments[i].end) {
          onCnfrmObj.ffstartend = `fulfillments[${i}] start and end locations are mandatory`
        }

        try {
          if (!compareCoordinates(on_confirm.fulfillments[i].start.location.gps, getValue('providerGps'))) {
            onCnfrmObj.sellerGpsErr = `store gps location /fulfillments[${i}]/start/location/gps can't change`
          }
        } catch (error: any) {
          logger.error(`!!Error while checking store location in /${constants.RET_ONCONFIRM}`)
        }

        try {
          if (!_.isEqual(on_confirm.fulfillments[i].start.location.descriptor.name, getValue('providerName'))) {
            onCnfrmObj.sellerNameErr = `store name  /fulfillments[${i}]/start/location/descriptor/name can't change`
          }
        } catch (error: any) {
          logger.error(`!!Error while checking store name in /${constants.RET_ONCONFIRM}`)
        }

        if (!_.isEqual(on_confirm.fulfillments[i].end.location.gps, getValue('buyerGps'))) {
          onCnfrmObj.buyerGpsErr = `fulfillments[${i}].end.location gps is not matching with gps in /select`
        }

        if (!_.isEqual(on_confirm.fulfillments[i].end.location.address.area_code, getValue('buyerAddr'))) {
          onCnfrmObj.gpsErr = `fulfillments[${i}].end.location.address.area_code is not matching with area_code in /select`
        }

        i++
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments object in /${constants.RET_ONCONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing /${constants.RET_ONCONFIRM} quoted Price and Payment Params amount`)
      if (parseFloat(on_confirm.payment.params.amount) != parseFloat(on_confirm.quote.price.value)) {
        onCnfrmObj.onConfirmedAmount = `Quoted price (/${constants.RET_ONCONFIRM}) doesn't match with the amount in payment.params`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while Comparing /${constants.RET_ONCONFIRM} quoted Price and Payment Params amount, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing Quote object for /${constants.RET_ONSELECT} and /${constants.RET_ONCONFIRM}`)
      if (!_.isEqual(getValue('quoteObj'), on_confirm.quote)) {
        onCnfrmObj.onQuoteObj = `Discrepancies between the quote object /${constants.RET_ONSELECT} and /${constants.RET_ONCONFIRM}`
      }
    } catch (error: any) {
      logger.error(`!!Error while comparing quote in /${constants.RET_ONSELECT} and /${constants.RET_ONCONFIRM}`)
    }

    try {
      logger.info(`Comparing order price value in /${constants.RET_ONSELECT} and /${constants.RET_ONCONFIRM}`)
      const onSelectPrice: any = getValue('onSelectPrice')
      const onConfirmQuotePrice = parseFloat(on_confirm.quote.price.value)
      if (onSelectPrice != onConfirmQuotePrice) {
        logger.info(
          `order quote price in /${constants.RET_ONCONFIRM} is not equal to the quoted price in /${constants.RET_ONSELECT}`,
        )
        onCnfrmObj.quoteErr = `Quoted Price in /${constants.RET_ONCONFIRM} ${onConfirmQuotePrice} does not match with the quoted price in /${constants.RET_ONSELECT} ${onSelectPrice}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing order price value in /${constants.RET_ONSELECT} and /${constants.RET_ONCONFIRM}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing payment object in /${constants.RET_CONFIRM} & /${constants.RET_ONCONFIRM}`)

      if (!_.isEqual(getValue('cnfrmpymnt'), on_confirm.payment)) {
        onCnfrmObj.pymntObj = `payment object mismatches in /${constants.RET_CONFIRM} & /${constants.RET_ONCONFIRM}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing payment object in /${constants.RET_CONFIRM} & /${constants.RET_ONCONFIRM}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Checking Buyer App finder fee amount in /${constants.RET_ONCONFIRM}`)
      const buyerFF: any = getValue(`${ApiSequence.SEARCH}_buyerFF`)
      if (
        on_confirm.payment['@ondc/org/buyer_app_finder_fee_amount'] &&
        parseFloat(on_confirm.payment['@ondc/org/buyer_app_finder_fee_amount']) != buyerFF
      ) {
        onCnfrmObj.buyerFF = `Buyer app finder fee can't change in /${constants.RET_ONCONFIRM}`
        logger.info(`Buyer app finder fee can't change in /${constants.RET_ONCONFIRM}`)
      }
    } catch (error: any) {
      logger.info(`!Error while comparing buyer app finder fee in /${constants.RET_ONCONFIRM}, ${error.stack}`)
    }

    return onCnfrmObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.RET_ONCONFIRM} API`, JSON.stringify(err.stack))
  }
}
