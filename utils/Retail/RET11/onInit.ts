/* eslint-disable no-prototype-builtins */
import _, { isArray } from 'lodash'
import constants, { ApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import {
  validateSchema,
  isObjectEmpty,
  checkContext,
  timeDiff as timeDifference,
  checkItemTag,
  checkBppIdOrBapId,
  isTagsValid,
  compareObjects,
  payment_status,
  compareQuoteObjects,
} from '../../../utils'
import { getValue, setValue } from '../../../shared/dao'

export const checkOnInit = (data: any, msgIdSet: any) => {
  try {
    const onInitObj: any = {}
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.ON_INIT]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.ON_INIT, data)
    const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
    const contextRes: any = checkContext(context, constants.ON_INIT)
    const parentItemIdSet: any = getValue(`parentItemIdSet`)
    const select_customIdArray: any = getValue(`select_customIdArray`)

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
    if (_.isEqual(data.context, getValue(`domain`))) {
      onInitObj[`Domain[${data.context.action}]`] = `Domain should be same in each action`
    }

    setValue(`${ApiSequence.ON_INIT}`, data)
    msgIdSet.add(context.message_id)

    logger.info(`Checking context for /${constants.ON_INIT} API`) //checking context
    try {
      const res: any = checkContext(context, constants.ON_INIT)
      if (!res.valid) {
        Object.assign(onInitObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.ON_INIT} context, ${error.stack}`)
    }

    try {
      logger.info(`Comparing city of ${constants.SEARCH} & ${constants.ON_INIT}`)
      if (!_.isEqual(searchContext.city, context.city)) {
        onInitObj.city = `City code mismatch in ${constants.SEARCH} & ${constants.ON_INIT}`
      }
    } catch (error: any) {
      logger.info(`Error while comparing city in ${constants.SEARCH} & ${constants.ON_INIT}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing timestamp of ${constants.INIT} & ${constants.ON_INIT}`)
      const tmpstmp = getValue('tmpstmp')
      if (_.gt(tmpstmp, context.timestamp)) {
        onInitObj.tmpstmp = `Timestamp for ${constants.INIT} api cannot be greater than or equal to ${constants.ON_INIT} api`
      } else {
        const timeDiff = timeDifference(context.timestamp, tmpstmp)
        logger.info(timeDiff)
        if (timeDiff > 5000) {
          onInitObj.tmpstmp = `context/timestamp difference between /${constants.ON_INIT} and /${constants.INIT} should be less than 5 sec`
        }
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.error(
        `!!Error while comparing timestamp for /${constants.INIT} and /${constants.ON_INIT} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.SELECT} & /${constants.ON_INIT}`)
      if (!_.isEqual(getValue('txnId'), context.transaction_id)) {
        onInitObj.txnId = `Transaction Id should be same from /${constants.SELECT} onwards`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing transaction ids for /${constants.SELECT} & /${constants.ON_INIT} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing Message Ids of /${constants.INIT} and /${constants.ON_INIT}`)
      if (!_.isEqual(getValue('msgId'), context.message_id)) {
        onInitObj.msgId = `Message Ids for /${constants.INIT} and /${constants.ON_INIT} api should be same`
      }

      msgIdSet.add(context.message_id)
    } catch (error: any) {
      logger.error(`!!Error while checking message id for /${constants.INIT}, ${error.stack}`)
    }

    const on_init = message.order

    try {
      logger.info(`Checking provider id and location in /${constants.CONFIRM}`)
      if (on_init.provider.id != getValue('providerId')) {
        onInitObj.prvdrId = `Provider Id mismatches in /${constants.ON_SEARCH} and /${constants.CONFIRM}`
      }

      if (on_init.provider.location && on_init.provider.locations[0].id != getValue('providerLoc')) {
        onInitObj.prvdrLoc = `provider.locations[0].id mismatches in /${constants.ON_SEARCH} and /${constants.CONFIRM}`
      }
    } catch (error: any) {
      logger.error(`!!Error while checking provider id and location in /${constants.CONFIRM}, ${error.stack}`)
    }

    // checking for tax_number in tags
    try {
      logger.info(`Checking for tax_number for ${constants.ON_INIT}`)
      const bpp_terms_obj:any = message.order.tags.filter((item: any) =>{
        return item?.code == "bpp_terms"
      })[0]
      const tags = bpp_terms_obj.list
      const np_type_on_search = getValue(`${ApiSequence.ON_SEARCH}np_type`)
      let tax_number: any = {}
      let provider_tax_number: any = {}
      tags.forEach((e: any) => {
        if (e.code === 'tax_number') {
          if (!e.value) {
            logger.error(`value must be present for tax_number in ${constants.ON_INIT}`);
            onInitObj.taxNumberValue = `value must be present for tax_number in ${constants.ON_INIT}`;
        } else {
            const taxNumberPattern = new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');
              if (!taxNumberPattern.test(e.value)) {
                logger.error(`Invalid format for tax_number in ${constants.ON_INIT}`);
                onInitObj.taxNumberValue = `Invalid format for tax_number in ${constants.ON_INIT}`;
            }
        }        
          tax_number = e
        }
        if (e.code === 'provider_tax_number') {
          if (!e.value) {
            logger.error(`value must be present for provider_tax_number in ${constants.ON_INIT}`);
            onInitObj.provider_tax_number = `value must be present for provider_tax_number in ${constants.ON_INIT}`;
        } else {
            const taxNumberPattern = new RegExp('^[A-Z]{5}[0-9]{4}[A-Z]{1}$');
                if (!taxNumberPattern.test(e.value)) {
                logger.error(`Invalid format for provider_tax_number in ${constants.ON_INIT}`);
                onInitObj.provider_tax_number = `Invalid format for provider_tax_number in ${constants.ON_INIT}`;
            }
        }
        
          provider_tax_number = e
        }
      })
      if (_.isEmpty(tax_number)) {
        logger.error(`tax_number must present in ${constants.ON_INIT}`)
        onInitObj.taxNumber = `tax_number must be present for ${constants.ON_INIT}`
      }
      if (_.isEmpty(provider_tax_number)) {
        logger.error(`tax_number must present in ${constants.ON_INIT}`)
        onInitObj.providertaxNumber = `provider_tax_number must be present for ${constants.ON_INIT}`
      }
      if (tax_number.value?.length == 15 && provider_tax_number?.value?.length == 10 && np_type_on_search == "MSN") {
        const pan_id = tax_number?.value.slice(2, 12)
        if (pan_id != provider_tax_number?.value) {
          logger.error(`Pan_id is different in tax_number and provider_tax_number in ${constants.ON_INIT}`)
          onInitObj[`message.order.tags[0].list`] = `Pan_id is different in tax_number and provider_tax_number in message.order.tags[0].list`
        }
      }

    } catch (error: any) {
      logger.error(`tax_number not present in tags for ${constants.ON_INIT}`)
    }

    try {
      logger.info(`Checking for tags in /${constants.ON_INIT}`)
      if (on_init.tags && isArray(on_init.tags)) {
        setValue(
          'bpp_tags',
          on_init.tags.forEach((data: any) => {
            if (data.code == 'bpp_terms') {
              setValue('list_ON_INIT', data.list)
            }
          }),
        )
      }
    } catch (error: any) {
      logger.error(`!!Error while checking tags in /${constants.ON_INIT} ${error.stack}`)
    }

    try {
      logger.info(`Comparing item Ids and fulfillment Ids in /${constants.ON_SELECT} and /${constants.ON_INIT}`)
      const itemFlfllmnts: any = getValue('itemFlfllmnts')
      const itemsIdList: any = getValue('itemsIdList')
      let i = 0
      const len: any = on_init.items.length
      while (i < len) {
        const itemId: any = on_init.items[i].id
        const item = on_init.items[i]

        if (checkItemTag(item, select_customIdArray)) {
          const itemkey = `item${i}tags.parent_id`
          onInitObj[itemkey] =
            `items[${i}].tags.parent_id mismatches for Item ${itemId} in /${constants.SELECT} and /${constants.INIT}`
        }

        if (parentItemIdSet && item.parent_item_id && !parentItemIdSet.includes(item.parent_item_id)) {
          const itemkey = `item_PrntItmId${i}`
          onInitObj[itemkey] =
            `items[${i}].parent_item_id mismatches for Item ${itemId} in /${constants.ON_SEARCH} and /${constants.ON_INIT}`
        }

        if (itemId in itemFlfllmnts) {
          if (on_init.items[i].fulfillment_id != itemFlfllmnts[itemId]) {
            const itemkey = `item_FFErr${i}`
            onInitObj[itemkey] =
              `items[${i}].fulfillment_id mismatches for Item ${itemId} in /${constants.ON_SELECT} and /${constants.ON_INIT}`
          }
        } else {
          const itemkey = `item_FFErr${i}`
          onInitObj[itemkey] = `Item Id ${itemId} does not exist in /on_select`
        }

        if (itemId in itemsIdList) {
          if (on_init.items[i].quantity.count != itemsIdList[itemId]) {
            onInitObj.countErr = `Warning: items[${i}].quantity.count for item ${itemId} mismatches with the items quantity selected in /${constants.SELECT}`
          }
        }

        i++
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing Item and Fulfillment Id in /${constants.ON_SELECT} and /${constants.ON_INIT}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Validating fulfillments`)
      on_init?.fulfillments.forEach((fulfillment: any) => {
        const { type } = fulfillment
        if (type == 'Delivery') {
          if (fulfillment.tags && fulfillment.tags.length > 0) {
            onInitObj[`fulfillments[${fulfillment.id}]`] =
              `/message/order/fulfillment of type 'delivery' should not have tags `
          }
        } else if (type !== 'Delivery') {
          onInitObj[`fulfillments[${fulfillment.id}]`] = `Fulfillment type should be 'Delivery' (case-sensitive)`
        }
      })
    } catch (error: any) {
      logger.error(`Error while validating fulfillments, ${error.stack}`)
    }

    try {
      logger.info(`Comparing billing object in /${constants.INIT} and /${constants.ON_INIT}`)
      const billing = getValue('billing')

      const billingErrors = compareObjects(billing, on_init.billing)

      if (billingErrors) {
        let i = 0
        const len = billingErrors.length
        while (i < len) {
          const key = `billingErr${i}`
          onInitObj[key] = `${billingErrors[i]}  when compared with init billing object`
          i++
        }
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing billing object in /${constants.INIT} and /${constants.ON_INIT}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Checking fulfillments objects in /${constants.ON_INIT}`)
      const itemFlfllmnts: any = getValue('itemFlfllmnts')
      let i = 0
      const len = on_init.fulfillments.length
      while (i < len) {
        //Comparing fulfillment Ids

        if (on_init.fulfillments[i].id) {
          const id = on_init.fulfillments[i].id
          if (!Object.values(itemFlfllmnts).includes(id)) {
            const key = `ffID ${id}`
            //MM->Mismatch
            onInitObj[key] = `fulfillment id ${id} does not exist in /${constants.ON_SELECT}`
          }
        } else {
          onInitObj.ffId = `fulfillments[].id is missing in /${constants.ON_INIT}`
        }

        if (!_.isEqual(on_init.fulfillments[i].end.location.gps, getValue('buyerGps'))) {
          const gpskey = `gpsKey${i}`
          onInitObj[gpskey] =
            `gps coordinates in fulfillments[${i}].end.location mismatch in /${constants.SELECT} & /${constants.ON_INIT}`
        }

        if (!_.isEqual(on_init.fulfillments[i].end.location.address.area_code, getValue('buyerAddr'))) {
          const addrkey = `addrKey${i}`
          onInitObj[addrkey] =
            `address.area_code in fulfillments[${i}].end.location mismatch in /${constants.SELECT} & /${constants.ON_INIT}`
        }

        i++
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments object in /${constants.ON_INIT}, ${error.stack}`)
    }

    try {
      let initQuotePrice = 0
      let initBreakupPrice = 0
      // setValue("onInitQuote", quote);
      logger.info(`Calculating Net /${constants.ON_INIT} Price breakup`)
      on_init.quote.breakup.forEach((element: { price: { value: string } }) => {
        initBreakupPrice += parseFloat(element.price.value)
      })
      logger.info(`/${constants.ON_INIT} Price Breakup: ${initBreakupPrice}`)

      initQuotePrice = parseFloat(on_init.quote.price.value)

      logger.info(`/${constants.ON_INIT} Quoted Price: ${initQuotePrice}`)

      logger.info(`Comparing /${constants.ON_INIT} Quoted Price and Net Price Breakup`)
      if (Math.round(initQuotePrice) != Math.round(initBreakupPrice)) {
        logger.info(`Quoted Price in /${constants.ON_INIT} is not equal to the Net Breakup Price`)
        onInitObj.onInitPriceErr = `Quoted Price ${initQuotePrice} does not match with Net Breakup Price ${initBreakupPrice} in /${constants.ON_INIT}`
      }

      logger.info(`Comparing /${constants.ON_INIT} Quoted Price and /${constants.ON_SELECT} Quoted Price`)
      const onSelectPrice: any = getValue('onSelectPrice')
      if (Math.round(onSelectPrice) != Math.round(initQuotePrice)) {
        logger.info(`Quoted Price in /${constants.ON_INIT} is not equal to the quoted price in /${constants.ON_SELECT}`)
        onInitObj.onInitPriceErr2 = `Quoted Price in /${constants.ON_INIT} INR ${initQuotePrice} does not match with the quoted price in /${constants.ON_SELECT} INR ${onSelectPrice}`
      }

      logger.info(`Checking Payment Object for  /${constants.ON_INIT}`)
      if (!on_init.payment) {
        onInitObj.pymntOnInitObj = `Payment Object can't be null in /${constants.ON_INIT}`
      }
    } catch (error: any) {
      logger.error(`!!Error while checking /${constants.ON_INIT} Quoted Price and Net Price Breakup, ${error.stack}`)
    }

    try {
      logger.info(`Checking Buyer App finder fee amount in /${constants.ON_INIT}`)
      const buyerFF: any = getValue(`${ApiSequence.SEARCH}_buyerFF`)
      // if (payment["@ondc/org/buyer_app_finder_fee_amount"])
      if (
        !on_init.payment['@ondc/org/buyer_app_finder_fee_amount'] ||
        parseFloat(on_init.payment['@ondc/org/buyer_app_finder_fee_amount']) != buyerFF
      ) {
        onInitObj.buyerFF = `Buyer app finder fee can't change in /${constants.ON_INIT}`
        // logger.info(`Buyer app finder fee amount can't change in /on_init`);
      }
    } catch (error: any) {
      logger.error(`!!Error while checking buyer app finder fee in /${constants.ON_INIT}, ${error.stack}`)
    }

    try {
      logger.info(`Checking Quote Object in /${constants.ON_SELECT} and /${constants.ON_INIT}`)
      const on_select_quote: any = getValue('quoteObj')
      const quoteErrors = compareQuoteObjects(on_select_quote, on_init.quote, constants.ON_SELECT, constants.ON_INIT)
      const hasItemWithQuantity = _.some(on_init.quote.breakup, (item) => _.has(item, 'item.quantity'))
      if (hasItemWithQuantity) {
        const key = `quantErr`
        onInitObj[key] =
          `Extra attribute Quantity provided in quote object i.e not supposed to be provided after on_select so invalid quote object`
      } else if (quoteErrors) {
        let i = 0
        const len = quoteErrors.length
        while (i < len) {
          const key = `quoteErr${i}`
          onInitObj[key] = `${quoteErrors[i]}`
          i++
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking quote object in /${constants.ON_SELECT} and /${constants.ON_INIT}`)
    }

    try {
      logger.info(`checking payment object in /${constants.ON_INIT}`)
      if (on_init.payment['@ondc/org/settlement_details'][0]['settlement_counterparty'] != 'seller-app') {
        onInitObj.sttlmntcntrparty = `settlement_counterparty is expected to be 'seller-app' in @ondc/org/settlement_details`
      }

      logger.info(`checking payment details in /${constants.ON_INIT}`)
      const data = on_init.payment['@ondc/org/settlement_details'][0]
      if (
        data['settlement_type'] !== 'neft' &&
        data['settlement_type'] !== 'rtgs' &&
        data['settlement_type'] !== 'upi'
      ) {
        logger.error(
          `settlement_type is expected to be 'neft/rtgs/upi' in @ondc/org/settlement_detailsin /${constants.ON_INIT}`,
        )
        onInitObj.sttlmntcntrparty = `settlement_type is expected to be 'neft/rtgs/upi' in @ondc/org/settlement_details`
      } else if (data['settlement_type'] !== 'upi') {
        let missingFields = []
        if (!data.bank_name) {
          missingFields.push('bank_name')
        }
        if (!data.branch_name) {
          missingFields.push('branch_name')
        }
        if (!data.beneficiary_name || data.beneficiary_name.trim() === '') {
          missingFields.push('beneficiary_name')
        }
        if (!data.settlement_phase) {
          missingFields.push('settlement_phase')
        }
        if (!data.settlement_ifsc_code) {
          missingFields.push('settlement_ifsc_code')
        }
        if (!data.settlement_counterparty) {
          missingFields.push('settlement_counterparty')
        }
        if (!data.settlement_bank_account_no || data.settlement_bank_account_no.trim() === '') {
          missingFields.push('settlement_bank_account_no')
        }

        if (missingFields.length > 0) {
          logger.error(`Payment details are missing: ${missingFields.join(', ')} /${constants.ON_INIT}`)
          onInitObj.paymentDetails = `Payment details are missing: ${missingFields.join(', ')}/${constants.ON_INIT}`
        }
      } else {
        if (!data.upi_address || data.upi_address.trim() === '') {
          logger.error(`Payment details are missing /${constants.ON_INIT}`)
          onInitObj.paymentDetails = `Payment details are missing/${constants.ON_INIT}`
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking payment object in /${constants.ON_INIT}`)
    }

    try {
      logger.info(`storing payment settlement details in /${constants.ON_INIT}`)
      if (on_init.payment.hasOwnProperty('@ondc/org/settlement_details'))
        setValue('sttlmntdtls', on_init.payment['@ondc/org/settlement_details'][0])
      else {
        onInitObj.pymntSttlmntObj = `payment settlement_details missing in /${constants.ON_INIT}`
      }
    } catch (error: any) {
      logger.error(`!!Error while storing payment settlement details in /${constants.ON_INIT}`)
    }

    try {
      if (on_init.tags) {
        const isValid = isTagsValid(on_init.tags, 'bpp_terms')
        if (isValid === false) {
          onInitObj.onInitTags = `Tags should have valid gst number and fields in /${constants.ON_INIT}`
        }

        setValue('on_init_tags', on_init.tags)
      }
    } catch (error: any) {
      logger.error(`!!Error while checking tags in /${constants.ON_INIT} ${error.stack}`)
    }

    try {
      logger.info(`Checking if transaction_id is present in message.order.payment`)
      const payment = on_init.payment
      const status = payment_status(payment)
      if (!status) {
        onInitObj['message/order/transaction_id'] = `Transaction_id missing in message/order/payment`
      }
    } catch (err: any) {
      logger.error(`Error while checking transaction is in message.order.payment`)
    }

    try {
      logger.info(`Validating tags`)
      on_init?.tags.forEach((tag: any) => {
        const providerTaxNumber = tag.list.find((item: any) => item.code === 'provider_tax_number')
        if (providerTaxNumber) {
          const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
          if (!panRegex.test(providerTaxNumber.value)) {
            onInitObj[`tags`] = `'provider_tax_number' should have a valid PAN number format`
          }
        }
      })
    } catch (error: any) {
      logger.error(`Error while validating tags, ${error.stack}`)
    }

    return onInitObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_INIT} API`, err)
  }
}