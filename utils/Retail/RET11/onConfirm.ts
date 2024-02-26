/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { ApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import {
  validateSchema,
  isObjectEmpty,
  checkContext,
  timeDiff as timeDifference,
  compareCoordinates,
  checkItemTag,
  checkBppIdOrBapId,
  areGSTNumbersMatching,
  compareObjects,
  sumQuoteBreakUp,
  payment_status
} from '../../../utils'
import { getValue, setValue } from '../../../shared/dao'

export const checkOnConfirm = (data: any) => {
  const onCnfrmObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.ON_CONFIRM]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
    const parentItemIdSet: any = getValue(`parentItemIdSet`)
    const select_customIdArray: any = getValue(`select_customIdArray`)    

    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.ON_CONFIRM, data)

    const contextRes: any = checkContext(context, constants.ON_CONFIRM)

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
      logger.info(`Comparing city of /${constants.SEARCH} and /${constants.ON_CONFIRM}`)
      if (!_.isEqual(searchContext.city, context.city)) {
        onCnfrmObj.city = `City code mismatch in /${constants.SEARCH} and /${constants.ON_CONFIRM}`
      }
    } catch (error: any) {
      logger.info(`Error while comparing city in /${constants.SEARCH} and /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing timestamp of /${constants.CONFIRM} and /${constants.ON_CONFIRM}`)
      const tmpstmp = getValue('tmpstmp')
      if (_.gte(tmpstmp, context.timestamp)) {
        onCnfrmObj.tmpstmp = `Timestamp for /${constants.CONFIRM} api cannot be greater than or equal to /${constants.ON_CONFIRM} api`
      } else {
        const timeDiff = timeDifference(context.timestamp, tmpstmp)
        logger.info(timeDiff)
        if (timeDiff > 5000) {
          onCnfrmObj.tmpstmp = `context/timestamp difference between /${constants.ON_CONFIRM} and /${constants.CONFIRM} should be less than 5 sec`
        }
      }
      setValue('tmpstmp', context.timestamp)
      setValue('onCnfrmtmpstmp', context.timestamp)
    } catch (error: any) {
      logger.info(
        `Error while comparing timestamp for /${constants.CONFIRM} and /${constants.ON_CONFIRM} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.SELECT} and /${constants.ON_CONFIRM}`)
      if (!_.isEqual(getValue('txnId'), context.transaction_id)) {
        onCnfrmObj.txnId = `Transaction Id should be same from /${constants.SELECT} onwards`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing transaction ids for /${constants.SELECT} and /${constants.ON_CONFIRM} api, ${error.stack}`,
      )
    }

    const on_confirm = message.order

    try {
      logger.info(`Comparing order ids in /${constants.CONFIRM} and /${constants.ON_CONFIRM}`)
      if (getValue('cnfrmOrdrId') != on_confirm.id) {
        onCnfrmObj.orderID = `Order Id mismatches in /${constants.CONFIRM} and /${constants.ON_CONFIRM}`
      }
    } catch (error: any) {
      logger.error(`!!Error while trying to fetch order ids in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`checking created_at and updated_at timestamp in /${constants.ON_CONFIRM}`)
      const cnfrmOrdrCrtd = getValue('ordrCrtd')
      const cnfrmOrdrUpdtd = getValue('ordrUpdtd')
      if (on_confirm.state === 'Created' || on_confirm.state === 'Accepted') {
        if (cnfrmOrdrCrtd && (!on_confirm.created_at || on_confirm.created_at != cnfrmOrdrCrtd)) {
          onCnfrmObj.crtdtmstmp = `order.created_at timestamp mismatches in /${constants.CONFIRM} and /${constants.ON_CONFIRM}`
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
      logger.error(`!!Error while checking order timestamps in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Checking provider id and location in /${constants.ON_CONFIRM}`)
      if (on_confirm.provider.id != getValue('providerId')) {
        onCnfrmObj.prvdrId = `Provider Id mismatches in /${constants.ON_SEARCH} and /${constants.ON_CONFIRM}`
      }

      if (on_confirm.provider.locations[0].id != getValue('providerLoc')) {
        onCnfrmObj.prvdrLoc = `provider.locations[0].id mismatches in /${constants.ON_SEARCH} and /${constants.ON_CONFIRM}`
      }
    } catch (error: any) {
      logger.error(`!!Error while checking provider id and location in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing item Ids and fulfillment ids in /${constants.ON_SELECT} and /${constants.ON_CONFIRM}`)
      const itemFlfllmnts: any = getValue('itemFlfllmnts')
      const itemsIdList: any = getValue('itemsIdList')
      let i = 0
      const len = on_confirm.items.length

      while (i < len) {
        const itemId = on_confirm.items[i].id
        const item = on_confirm.items[i]

        if (checkItemTag(item, select_customIdArray)) {
          const itemkey = `item${i}tags.parent_id`
          onCnfrmObj[itemkey] =
            `items[${i}].tags.parent_id mismatches for Item ${itemId} in /${constants.SELECT} and /${constants.INIT}`
        }

        if (!parentItemIdSet.includes(item.parent_item_id)) {
          const itemkey = `item_PrntItmId${i}`
          onCnfrmObj[itemkey] =
            `items[${i}].parent_item_id mismatches for Item ${itemId} in /${constants.ON_SELECT} and /${constants.ON_INIT}`
        }

        if (itemId in itemFlfllmnts) {
          if (on_confirm.items[i].fulfillment_id != itemFlfllmnts[itemId]) {
            const itemkey = `item_FFErr${i}`
            onCnfrmObj[itemkey] =
              `items[${i}].fulfillment_id mismatches for Item ${itemId} in /${constants.ON_SELECT} and /${constants.ON_CONFIRM}`
          }
        } else {
          const itemkey = `item_FFErr${i}`
          onCnfrmObj[itemkey] = `Item Id ${itemId} does not exist in /${constants.ON_SELECT}`
        }

        if (itemId in itemsIdList) {
          if (on_confirm.items[i].quantity.count != itemsIdList[itemId]) {
            onCnfrmObj.cntErr = `Warning: items[${i}].quantity.count for item ${itemId} mismatches with the items quantity selected in /${constants.SELECT}`
          }
        }

        i++
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing Item and Fulfillment Id in /${constants.ON_SELECT} and /${constants.CONFIRM}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Checking for number of digits in tax number in message.order.tags[0].list`)
      const list = message.order.tags[0].list

      list.map((item: any) => {
        if (item.code == 'tax_number') {
          if (item.value.length !== 15) {
            const key = `message.order.tags[0].list`
            onCnfrmObj[key] = `Number of digits in tax number in  message.order.tags[0].list should be 15`
          }
        }
      })
    } catch (error: any) {
      logger.error(`Error while checking for the number of digits in tax_number`)
    }

    try {
      logger.info(`Comparing timestamp of context and updatedAt for /${constants.ON_CONFIRM}`)
      if (!_.isEqual(context.timestamp, on_confirm.updated_at)) {
        const key = `invldUpdtdTmstp`
        onCnfrmObj[key] = `updated_at timestamp should be equal to  context timestamp for /${constants.ON_CONFIRM}`
        logger.error(`updated_at timestamp should be equal to  context timestamp for /${constants.ON_CONFIRM}`)
      }
    } catch (error: any) {
      logger.error(`!!Error while compairing updated_at timestamp with context timestamp for ${constants.ON_CONFIRM}`)
    }

    try {
      logger.info(`Comparing billing object in ${constants.CONFIRM} and /${constants.ON_CONFIRM}`)
      const billing = getValue('billing')

      const billingErrors = compareObjects(billing, on_confirm.billing)

      if (billingErrors) {
        let i = 0
        const len = billingErrors.length
        while (i < len) {
          const key = `billingErr${i}`
          onCnfrmObj[key] = `${billingErrors[i]}`
          i++
        }
      }
    } catch (error: any) {
      logger.info(`!Error while comparing billing object in /${constants.CONFIRM} and /${constants.ON_CONFIRM}`)
    }

    try {
      logger.info(`Checking fulfillments objects in /${constants.ON_CONFIRM}`)
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
            onCnfrmObj[key] = `fulfillment id ${id} does not exist in /${constants.ON_SELECT}`
          }
        } else {
          onCnfrmObj.ffId = `fulfillments[${i}].id is missing in /${constants.ON_CONFIRM}`
        }

        logger.info('Checking the fulfillments state')

        const ffDesc = on_confirm.fulfillments[i].state.descriptor

        const ffStateCheck = ffDesc.hasOwnProperty('code') ? ffDesc.code === 'Pending' : false

        if (!ffStateCheck) {
          const key = `ffState${i}`
          onCnfrmObj[key] = `default fulfillments state is missing in /${constants.ON_CONFIRM}`
        }

        if (!on_confirm.fulfillments[i].start || !on_confirm.fulfillments[i].end) {
          onCnfrmObj.ffstartend = `fulfillments[${i}] start and end locations are mandatory`
        }

        try {
          if (!compareCoordinates(on_confirm.fulfillments[i].start.location.gps, getValue('providerGps'))) {
            onCnfrmObj.sellerGpsErr = `store gps location /fulfillments[${i}]/start/location/gps can't change`
          }
        } catch (error: any) {
          logger.error(`!!Error while checking store location in /${constants.ON_CONFIRM}`)
        }

        try {
          if (!_.isEqual(on_confirm.fulfillments[i].start.location.descriptor.name, getValue('providerName'))) {
            onCnfrmObj.sellerNameErr = `store name  /fulfillments[${i}]/start/location/descriptor/name can't change`
          }
        } catch (error: any) {
          logger.error(`!!Error while checking store name in /${constants.ON_CONFIRM}`)
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
      logger.error(`!!Error while checking fulfillments object in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing /${constants.ON_CONFIRM} quoted Price and Payment Params amount`)
      setValue('quotePrice', on_confirm.quote.price.value)
      if (parseFloat(on_confirm.payment.params.amount) != parseFloat(on_confirm.quote.price.value)) {
        onCnfrmObj.onConfirmedAmount = `Quoted price (/${constants.ON_CONFIRM}) doesn't match with the amount in payment.params`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while Comparing /${constants.ON_CONFIRM} quoted Price and Payment Params amount, ${error.stack}`,
      )
    }

    try {
      logger.info(`Checking quote breakup prices for /${constants.ON_CONFIRM}`)
      if (!sumQuoteBreakUp(on_confirm.quote)) {
        const key = `invldPrices`
        onCnfrmObj[key] = `item quote breakup prices for ${constants.ON_CONFIRM} should be equal to the total price.`
        logger.error(`item quote breakup prices for ${constants.ON_CONFIRM} should be equal to the total price`)
      }
    } catch (error: any) {
      logger.error(`!!Error while Comparing Quote object for /${constants.ON_CONFIRM}`)
    }

    try {
      logger.info(`Comparing Quote object for /${constants.ON_SELECT} and /${constants.ON_CONFIRM}`)

      const confirm_quote = getValue('quoteObj')
      const quoteErrors = compareObjects(confirm_quote, on_confirm.quote)

      if (quoteErrors) {
        let i = 0
        const len = quoteErrors.length
        while (i < len) {
          const key = `quoteErr${i}`
          onCnfrmObj[key] = `${quoteErrors[i]}`
          i++
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while comparing quote in /${constants.ON_SELECT} and /${constants.ON_CONFIRM}`)
    }

    try {
      logger.info(`Comparing order price value in /${constants.ON_SELECT} and /${constants.ON_CONFIRM}`)
      const onSelectPrice: any = getValue('onSelectPrice')
      const onConfirmQuotePrice = parseFloat(on_confirm.quote.price.value)
      if (onSelectPrice != onConfirmQuotePrice) {
        logger.info(
          `order quote price in /${constants.ON_CONFIRM} is not equal to the quoted price in /${constants.ON_SELECT}`,
        )
        onCnfrmObj.quoteErr = `Quoted Price in /${constants.ON_CONFIRM} ${onConfirmQuotePrice} does not match with the quoted price in /${constants.ON_SELECT} ${onSelectPrice}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing order price value in /${constants.ON_SELECT} and /${constants.ON_CONFIRM}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing payment object in /${constants.CONFIRM} & /${constants.ON_CONFIRM}`)

      if (!_.isEqual(getValue('cnfrmpymnt'), on_confirm.payment)) {
        onCnfrmObj.pymntObj = `payment object mismatches in /${constants.CONFIRM} & /${constants.ON_CONFIRM}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing payment object in /${constants.CONFIRM} & /${constants.ON_CONFIRM}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Checking Buyer App finder fee amount in /${constants.ON_CONFIRM}`)
      const buyerFF: any = getValue(`${ApiSequence.SEARCH}_buyerFF`)
      if (
        on_confirm.payment['@ondc/org/buyer_app_finder_fee_amount'] &&
        parseFloat(on_confirm.payment['@ondc/org/buyer_app_finder_fee_amount']) != buyerFF
      ) {
        onCnfrmObj.buyerFF = `Buyer app finder fee can't change in /${constants.ON_CONFIRM}`
        logger.info(`Buyer app finder fee can't change in /${constants.ON_CONFIRM}`)
      }
    } catch (error: any) {
      logger.info(`!Error while comparing buyer app finder fee in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    const list_ON_INIT: any = getValue('list_ON_INIT')
    let ON_INIT_val: string;
    list_ON_INIT.map((data: any) => {
      if(data.code == 'tax_number'){
        ON_INIT_val = data.value;
      }
    })
    
    try {
      logger.info(`Checking if tax_number in bpp_terms in ON_CONFIRM and ON_INIT is same`)
      let list_ON_CONFIRM: any;
      message.order.tags.forEach((data: any) => {
        if(data.code == 'bpp_terms'){
          list_ON_CONFIRM = data.list
        }
      })
      list_ON_CONFIRM.map((data: any) => {
        if(data.code == 'tax_number'){
          if(data.value != ON_INIT_val){
            onCnfrmObj['message/order/tags/bpp_terms'] = `Value of tax Number mismatched in message/order/tags/bpp_terms for ON_INIT and ON_CONFIRM`
          }
        }
      })
    } catch (error: any) {
      logger.error(`Error while matching the tax_number in ON_CONFIRM and ON_INIT`)
    }

    try {
      logger.info(`Comparing tags in /${constants.CONFIRM} and /${constants.ON_CONFIRM}`)
      const confirm_tags: any[] | any = getValue('confirm_tags')
      if (on_confirm.tags) {
        const bap_terms = areGSTNumbersMatching(confirm_tags, on_confirm.tags, 'bap_terms')

        if (bap_terms === false) {
          onCnfrmObj.tags_bap_terms = `Tags should have same and valid gst_number as passed in /${constants.CONFIRM}`
        }

        const bpp_terms = areGSTNumbersMatching(confirm_tags, on_confirm.tags, 'bpp_terms')
        if (bpp_terms === false) {
          onCnfrmObj.tags_bpp_terms = `Tags should have same and valid gst_number as passed in /${constants.ON_INIT} and ${constants.CONFIRM}`
        }
      }
    } catch (error: any) {
      logger.error(
        `!!Error while Comparing tags in /${constants.CONFIRM} and /${constants.ON_CONFIRM}
        ${error.stack}`,
      )
    }

    try {
      logger.info(`Checking if transaction_id is present in message.order.payment`)
      const payment = on_confirm.payment
      const status = payment_status(payment);
      if(!status){
        onCnfrmObj['message/order/transaction_id'] = `Transaction_id missing in message/order/payment`
      }
    } catch (err: any) {
      logger.error(`Error while checking transaction is in message.order.payment`)
    }

    return onCnfrmObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_CONFIRM} API`, JSON.stringify(err.stack))
  }
}
