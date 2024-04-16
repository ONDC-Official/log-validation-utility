/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { ApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import {
  validateSchema,
  isObjectEmpty,
  checkContext,
  checkBppIdOrBapId,
  compareObjects,
  sumQuoteBreakUp,
  payment_status,
  mapCancellationID,
  checkQuoteTrail,
} from '../../../utils'
import { getValue, setValue } from '../../../shared/dao'

export const checkOnCancel = (data: any, msgIdSet: any) => {
  const onCnclObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.ON_CANCEL]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }
    const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
    const flow = getValue('flow')
    let schemaValidation: any
    if (flow === '5') {
      schemaValidation = validateSchema(context.domain.split(':')[1], constants.ON_CANCEL_RTO, data)
    } else {
      schemaValidation = validateSchema(context.domain.split(':')[1], constants.ON_CANCEL, data)
    }
    const select: any = getValue(`${ApiSequence.SELECT}`)
    const contextRes: any = checkContext(context, constants.ON_CANCEL)
    const checkBap = checkBppIdOrBapId(context.bap_id)
    const checkBpp = checkBppIdOrBapId(context.bpp_id)
    const itemSet = new Set()
    const selectPriceMap: any = getValue('selectPriceMap')

    if (checkBap) Object.assign(onCnclObj, { bap_id: 'context/bap_id should not be a url' })
    if (checkBpp) Object.assign(onCnclObj, { bpp_id: 'context/bpp_id should not be a url' })
    if (schemaValidation !== 'error') {
      Object.assign(onCnclObj, schemaValidation)
    }
    if (!contextRes?.valid) {
      Object.assign(onCnclObj, contextRes.ERRORS)
    }

    if (!msgIdSet.add(context.message_id)) {
      onCnclObj['messageId'] = 'message_id should be unique'
    }
    if (!_.isEqual(data.context.domain.split(':')[1], getValue(`domain`))) {
      onCnclObj[`Domain[${data.context.action}]`] = `Domain should be same in each action`
    }

    setValue(`${ApiSequence.CANCEL}`, data)

    try {
      logger.info(`Checking context for /${constants.ON_CANCEL} API`) //checking context
      const res: any = checkContext(context, constants.ON_CANCEL)
      if (!res.valid) {
        Object.assign(onCnclObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.ON_CANCEL} context, ${error.stack}`)
    }

    try {
      logger.info(`Comparing city of /${constants.SEARCH} and /${constants.ON_CANCEL}`)
      if (!_.isEqual(searchContext.city, context.city)) {
        onCnclObj.city = `City code mismatch in /${constants.SEARCH} and /${constants.ON_CANCEL}`
      }
    } catch (error: any) {
      logger.error(`!!Error while comparing city in /${constants.SEARCH} and /${constants.ON_CANCEL}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing timestamp of /${constants.ON_INIT} and /${constants.ON_CANCEL}`)
      if (_.gte(getValue('tmpstmp'), context.timestamp)) {
        onCnclObj.tmpstmp = `Timestamp for /${constants.ON_CONFIRM} api cannot be greater than or equal to /${constants.ON_CANCEL} api`
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.error(
        `!!Error while comparing timestamp for /${constants.ON_INIT} and /${constants.ON_CANCEL} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.SELECT} and /${constants.ON_CANCEL}`)
      if (!_.isEqual(select.context.transaction_id, context.transaction_id)) {
        onCnclObj.txnId = `Transaction Id should be same from /${constants.SELECT} onwards`
      }
    } catch (error: any) {
      logger.info(
        `!!Error while comparing transaction ids for /${constants.SELECT} and /${constants.ON_CANCEL} api, ${error.stack}`,
      )
    }

    const on_cancel = message.order

    try {
      // Checking for valid item ids in /on_select
      const itemsOnSelect = getValue('SelectItemList')
      const itemsList = message.order.items
      const quoteobj = message.order.quote.breakup
      quoteobj.forEach((item: any) => {
        if (!itemsOnSelect?.includes(item['@ondc/org/item_id']) && item['@ondc/org/title_type'] === 'item') {
          const key = `inVldItemId[${item.id}]`
          onCnclObj[key] = `Invalid Item Id provided in quote object /${constants.ON_CANCEL}: ${item.id}`
        }
      })
      itemsList.forEach((item: any) => {
        if (!itemsOnSelect?.includes(item.id)) {
          const key = `inVldItemId[${item.id}]`
          onCnclObj[key] = `Invalid Item Id provided in /${constants.ON_CANCEL}: ${item.id}`
        } else {
          itemSet.add(item.id)
        }
      })
    } catch (error: any) {
      logger.error(`Error while checking for item IDs for /${constants.ON_CANCEL}`, error.stack)
    }

    try {
      //Checking for valid fulfillment ids in /on_select and 0 item count in /on_cancel
      const fulfillmentIdsOnSelect = getValue('selectFlflmntSet')
      const itemList = message.order.items
      itemList.forEach((item: any, index: number) => {
        if (fulfillmentIdsOnSelect) {
          if (fulfillmentIdsOnSelect.includes(item.fulfillment_id) && item.quantity.count !== 0) {
            onCnclObj[`itemCount[${index}]`] = `Item count should be 0 for /${constants.ON_CANCEL} in forward shipment`
          } else if (!fulfillmentIdsOnSelect.includes(item.fulfillment_id) && item.quantity.count === 0) {
            onCnclObj[`itemCount[${index}]`] = `Item count can't be 0 for /${constants.ON_CANCEL} in cancel shipment`
          }
        }
      })
    } catch (error: any) {
      logger.error(`Error while checking for fulfillment IDs for /${constants.ON_CANCEL}`, error.stack)
    }
    //Comparing item count in /on_cancel and /select
    const select_items: any = getValue('items')
    try {
      logger.info(`Matching the item count in message/order/items with that in /select`)
      const onCancelItems: any[] = on_cancel.items
      let onCancelItemCount: number = 0
      let onSelectItemCount: number = 0
      let selectItems: any = {}
      select_items.forEach((selectItem: any) => {
        onSelectItemCount += selectItem.quantity.count / 1
        selectItems[selectItem.count] = selectItem.quantity.count
        selectItems[selectItem.id] = selectItem.id
      })

      onCancelItems.forEach((item: any) => {
        onCancelItemCount += item.quantity.count / 1
      })
      if (onSelectItemCount !== onCancelItemCount) {
        onCnclObj[`itemCount`] =
          `Total item count in message/order/items doesn't match with item count of /${constants.ON_SELECT}`
      }
    } catch (error: any) {
      logger.error(`Error while matching the count of items in /on_update and /select: ${error.message}`)
    }

    try {
      logger.info(`Checking quote breakup prices for /${constants.ON_CANCEL}`)
      if (!sumQuoteBreakUp(on_cancel.quote)) {
        const key = `invldQuotePrices`
        onCnclObj[key] = `item quote breakup prices for ${constants.ON_CANCEL} should be equal to the total price.`
        logger.error(`item quote breakup prices for ${constants.ON_CANCEL} should be equal to the net price`)
      }
    } catch (error: any) {
      logger.error(`!!Error while Comparing Quote object for /${constants.ON_CANCEL}`)
    }

    try {
      if (sumQuoteBreakUp(on_cancel.quote)) {
        logger.info(`Checking for quote_trail price and item quote price sum for ${constants.ON_CANCEL}`)
        const price = Number(on_cancel.quote.price.value)
        const priceAtConfirm = Number(getValue('quotePrice'))
        let cancelFulfillments = null
        if (flow === '5') {
          cancelFulfillments = _.filter(on_cancel.fulfillments, { type: 'RTO' })
        } else {
          cancelFulfillments = _.filter(on_cancel.fulfillments, { type: 'Cancel' })
        }

        if (!cancelFulfillments.length && flow === '4') {
          const key = `CancelFulfillmentMissing`
          onCnclObj[key] = `fulfillment type cancel is missing in /${constants.ON_CANCEL}`
        }
        for (let obj of cancelFulfillments) {
          let quoteTrailSum = 0
          const quoteTrailItems = _.filter(obj.tags, { code: 'quote_trail' })
          for (let item of quoteTrailItems) {
            for (let val of item.list) {
              if (val.code === 'value') {
                quoteTrailSum += Math.abs(val.value)
              }
            }
          }
          if (priceAtConfirm != price + quoteTrailSum) {
            const key = `invldQuoteTrailPrices`
            onCnclObj[key] =
              `quote_trail price and item quote price sum for ${constants.ON_CANCEL} should be equal to the price as in ${constants.ON_CONFIRM}`
            logger.error(
              `quote_trail price and item quote price sum for ${constants.ON_CANCEL} should be equal to the price as in ${constants.ON_CONFIRM} `,
            )
          }
        }
      } else {
        logger.error(`The price breakdown in brakup does not match with the total_price for ${constants.ON_CANCEL}`)
      }
    } catch (error: any) {
      logger.error(`!!Error while Comparing Quote_Trail object for /${constants.ON_CANCEL}, ${error.stack} `)
    }

    try {
      logger.info(`Checking for Item IDs in quote object in /${constants.ON_CANCEL}`)
      let cancelFulfillments = null
      if (flow === '5') {
        cancelFulfillments = _.filter(on_cancel.fulfillments, { type: 'RTO' })
      } else {
        cancelFulfillments = _.filter(on_cancel.fulfillments, { type: 'Cancel' })
      }
      for (let obj of cancelFulfillments) {
        const quoteTrailItems = _.filter(obj.tags, { code: 'quote_trail' })
        checkQuoteTrail(quoteTrailItems, onCnclObj, selectPriceMap, itemSet)
      }
    } catch (error: any) {
      logger.error(`!!Error while checking quote object in /${constants.ON_CANCEL}, ${error.stack}`)
    }

    try {
      // Need to update this for LSP and LBNP
      logger.info(`Mapping valid cancellation_reason_id with the buyerNP or sellerNP in ${constants.ON_CANCEL}`)
      const cancellationObj = on_cancel.cancellation
      const cancelled_by = cancellationObj.cancelled_by
      const reason_id = cancellationObj.reason.id
      if (cancelled_by === context.bap_id) {
        mapCancellationID('BNP', reason_id, onCnclObj)
      } else {
        mapCancellationID('SNP', reason_id, onCnclObj)
      }
      if (flow === '4' && cancelled_by !== context.bap_id) {
        const key = 'invalidCancelledByEntity'
        onCnclObj[key] = `cancelled_by entity should be same as context/bap_id`
      }
    } catch (error: any) {
      logger.error(`!!Error while mapping cancellation_reason_id in ${constants.ON_CANCEL}`)
    }
    try {
      logger.info(`Comparing order ids in /${constants.ON_CANCEL} and /${constants.ON_CONFIRM}`)
      if (getValue('cnfrmOrdrId') != on_cancel.id) {
        onCnclObj.orderID = `Order Id mismatches in /${constants.ON_CANCEL} and /${constants.ON_CONFIRM}`
      }
    } catch (error: any) {
      logger.error(`!!Error while trying to fetch order ids in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Checking provider id and location in /${constants.ON_CANCEL}`)
      if (on_cancel.provider.id != getValue('providerId')) {
        onCnclObj.prvdrId = `Provider Id mismatches in /${constants.ON_SELECT} and /${constants.ON_CANCEL}`
      }

      if (on_cancel.provider.locations[0].id != getValue('providerLoc')) {
        onCnclObj.prvdrLoc = `provider.locations[0].id mismatches in /${constants.ON_SEARCH} and /${constants.ON_CANCEL}`
      }
    } catch (error: any) {
      logger.error(`!!Error while checking provider id and location in /${constants.ON_CANCEL}, ${error.stack}`)
    }
    let Ids = []
    let Flfmntid = []
    try {
      logger.info(`Comparing item Ids and fulfillment ids in /${constants.ON_SELECT} and /${constants.ON_CANCEL}`)
      const itemFlfllmnts: any = getValue('itemFlfllmnts')
      let i = 0
      const len = on_cancel.items.length
      let forwardFulfillmentCount = 0 // Counter for forward fulfillment
      let cancellationFulfillmentCount = 0 // Counter for cancellation fulfillment
      while (i < len) {
        const itemId = on_cancel.items[i].id
        Ids.push(itemId)
        Flfmntid.push(on_cancel.items[i].fulfillment_id)
        if (!(itemId in itemFlfllmnts)) {
          const key = `ITEM_ID ${itemId}`
          onCnclObj[key] = `${itemId} itemID not found in ${constants.ON_SELECT}`
        }
        if (itemId in itemFlfllmnts && Object.values(itemFlfllmnts).includes(on_cancel.items[i].fulfillment_id)) {
          const key = `FF_ID ${on_cancel.items[i].fulfillment_id}`
          logger.info(`forward fulfillment found ${key}`)
          forwardFulfillmentCount++
        }
        if (itemId in itemFlfllmnts && !Object.values(itemFlfllmnts).includes(on_cancel.items[i].fulfillment_id)) {
          const key = `FF_ID ${on_cancel.items[i].fulfillment_id}`
          logger.info(`Cancellation fulfillment found ${key}`)
          cancellationFulfillmentCount++
        }
        i++
      }
      if (cancellationFulfillmentCount != forwardFulfillmentCount) {
        const key = `Fulfillment_mismatch`
        onCnclObj[key] =
          `The count of cancellation fulfillmentsn is not equal to the count of forward fulfillments or invalid fulfillment id.`
      } else {
        logger.info(`The count of cancellation fulfillments is equal to the count of forward fulfillments.`)
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing Item and Fulfillment Id in /${constants.ON_SELECT} and /${constants.ON_CANCEL}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing billing object in /${constants.INIT} and /${constants.ON_CANCEL}`)
      const billing = getValue('billing')

      const billingErrors = compareObjects(billing, on_cancel.billing)

      if (billingErrors) {
        let i = 0
        const len = billingErrors.length
        while (i < len) {
          const key = `billingErr${i}`
          onCnclObj[key] = `${billingErrors[i]} when compared with init billing object`
          i++
        }
      }

      setValue('billing', on_cancel.billing)
    } catch (error: any) {
      logger.error(`!!Error while comparing billing object in /${constants.CONFIRM} and /${constants.ON_CANCEL}`)
    }

    try {
      logger.info(`Checking fulfillments objects in /${constants.ON_CANCEL}`)
      const itemFlfllmnts: any = getValue('itemFlfllmnts')
      let i = 0
      const len = on_cancel.fulfillments.length
      while (i < len) {
        if (on_cancel.fulfillments[i].id) {
          const id = on_cancel.fulfillments[i].id
          const nonMatchingFlfmntid = new Set(Flfmntid)
          if (!nonMatchingFlfmntid.has(id)) {
            const key = `ffID ${id}`
            //MM->Mismatch
            onCnclObj[key] = `fulfillment id ${id} does not exist in /${constants.ON_CANCEL} items.fulfillment_id`
          }
        }
        i++
      }

      while (i < len && flow !== '5' && on_cancel.fulfillments[i].type !== 'Cancel') {
        //Comparing fulfillment Ids
        if (on_cancel.fulfillments[i].id) {
          const id = on_cancel.fulfillments[i].id
          if (!Object.values(itemFlfllmnts).includes(id)) {
            const key = `ffID ${id}`
            //MM->Mismatch
            onCnclObj[key] = `fulfillment id ${id} does not exist in /${constants.ON_SELECT}`
          }
        } else {
          onCnclObj.ffId = `fulfillments[${i}].id is missing in /${constants.CONFIRM}`
        }

        if (!on_cancel.fulfillments[i].end || !on_cancel.fulfillments[i].end.person) {
          onCnclObj.ffprsn = `fulfillments[${i}].end.person object is missing`
        }

        if (!_.isEqual(on_cancel.fulfillments[i].end.location.gps, getValue('buyerGps'))) {
          onCnclObj.gpsErr = `fulfillments[${i}].end.location gps is not matching with gps in /select`
        }

        if (!_.isEqual(on_cancel.fulfillments[i].end.location.address.area_code, getValue('buyerAddr'))) {
          onCnclObj.gpsErr = `fulfillments[${i}].end.location.address.area_code is not matching with area_code in /select`
        }

        i++
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments object in /${constants.ON_CANCEL}, ${error.stack}`)
    }

    try {
      logger.info(`Checking payment object in /${constants.ON_CANCEL}`)

      if (!_.isEqual(on_cancel.payment['@ondc/org/settlement_details'][0], getValue('sttlmntdtls'))) {
        onCnclObj.sttlmntdtls = `payment settlement_details mismatch in /${constants.ON_INIT} & /${constants.ON_CANCEL}`
      }

      if (!on_cancel.hasOwnProperty('created_at') || !on_cancel.hasOwnProperty('updated_at')) {
        onCnclObj.ordertmpstmp = `order created and updated timestamps are mandatory in /${constants.ON_CANCEL}`
      } else {
        if (!_.gt(on_cancel.updated_at, on_cancel.created_at)) {
          onCnclObj.ordrupdtd = `order.updated_at timestamp should be greater than order.created_at timestamp`
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking payment object in /${constants.ON_CANCEL}, ${error.stack}`)
    }

    try {
      logger.info(`storing payment object in /${constants.ON_CANCEL}`)
      setValue('cnfrmpymnt', on_cancel.payment)
    } catch (error: any) {
      logger.error(`!!Error while storing payment object in /${constants.ON_CANCEL}, ${error.stack}`)
    }

    try {
      logger.info(`Checking if transaction_id is present in message.order.payment`)
      const payment = on_cancel.payment
      const status = payment_status(payment)
      if (!status) {
        onCnclObj['message/order/transaction_id'] = `Transaction_id missing in message/order/payment`
      }
    } catch (err: any) {
      logger.error(`Error while checking transaction is in message.order.payment`)
    }
    if (flow === '4') {
      try {
        logger.info(`Checking for valid cancellation reason ID in cancellation object of /${constants.ON_CANCEL}`)
        const reason_id = on_cancel.cancellation.reason.id
        if (reason_id !== getValue('cnclRid')) {
          onCnclObj['reason_id'] =
            `reason_id is different in cancellation object of /${constants.ON_CANCEL} from /${constants.CANCEL}`
        }
      } catch (err: any) {
        logger.error(
          `Error while checking for valid cancellation reason ID in cancellation object of /${constants.ON_CANCEL}`,
        )
      }
    }

    try {
      // Checking for igm_request inside fulfillments for /on_cancel
      if (flow === '5') {
        const RTOobj = _.filter(on_cancel.fulfillments, { type: 'RTO' })
        const DELobj = _.filter(on_cancel.fulfillments, { type: 'Delivery' })
        let rto_start_location: any = {}
        let rto_end_location: any = {}
        let del_start_location: any = {}
        let del_end_location: any = {}

        // For RTO Object
        if (!RTOobj.length) {
          logger.error(`RTO object is mandatory for ${constants.ON_CANCEL}`)
          const key = `missingRTO`
          onCnclObj[key] = `RTO object is mandatory for ${constants.ON_CANCEL}`
        } else {
          for (let item of RTOobj) {
            const validVal = ['RTO-Initiated', 'RTO-Delivered', 'RTO-Disposed']
            if (!validVal.includes(item.state?.descriptor?.code)) {
              logger.error(
                `Delivery state should be one of ['RTO-Initiated','RTO-Approved','RTO-Completed'] for ${constants.ON_CANCEL}`,
              )
              const key = `invalidState`
              onCnclObj[key] =
                `Delivery state should be one of ['RTO-Initiated','RTO-Approved','RTO-Completed'] for ${constants.ON_CANCEL}`
            }
          }

          // Checking for start object inside RTO
          if (!_.isEmpty(RTOobj[0]?.start)) {
            const rto_obj_start = RTOobj[0]?.start
            if (!_.isEmpty(rto_obj_start.location)) {
              rto_start_location = rto_obj_start.location
            }
            else {
              onCnclObj['RTOfulfillment.start.location'] = `RTO fulfillment start location object is missing in ${constants.ON_CANCEL}`
            }
          } else {
            onCnclObj['RTOfulfillment.start'] = `RTO fulfillment start object  is missing in ${constants.ON_CANCEL}`
          }

          // Checking for end object inside RTO
          if (!_.isEmpty(RTOobj[0]?.end)) {
            const rto_obj_end = RTOobj[0]?.end
            if (!_.isEmpty(rto_obj_end?.location)) {
              rto_end_location = rto_obj_end.location
            }
            else {
              onCnclObj['RTOfulfillment.end.location'] = `RTO fulfillment end location object is missing in ${constants.ON_CANCEL}`
            }
          } else {
            onCnclObj['RTOfulfillment.end'] = `RTO fulfillment end object  is missing in ${constants.ON_CANCEL}`
          }
        }

        // For Delivery Object
        if (!DELobj.length) {
          logger.error(`Delivery object is mandatory for ${constants.ON_CANCEL}`)
          const key = `missingDelivery`
          onCnclObj[key] = `Delivery object is mandatory for ${constants.ON_CANCEL}`
        } else {
          
          // Checking for start object inside Delivery
          if (!_.isEmpty(DELobj[0]?.start)) {
            const del_obj_start = DELobj[0]?.start

            if (!_.isEmpty(del_obj_start?.location)) {
              del_start_location = del_obj_start.location
            }
            else {
              onCnclObj['Delivery.start.location'] = `Delivery fulfillment start location object is missing in ${constants.ON_CANCEL}`
              logger.error(`Delivery fulfillment start location is missing in ${constants.ON_CANCEL}`)
            }
          } else {
            onCnclObj['DeliveryFulfillment.start'] = `Delivery fulfillment start object is missing in ${constants.ON_CANCEL}`
          }

          // Checking for end object inside Delivery
          if (!_.isEmpty(DELobj[0]?.end)) {
            const del_obj_end = DELobj[0]?.end
            if (!_.isEmpty(del_obj_end?.location)) {
              del_end_location = del_obj_end.location
            }
            else {
              onCnclObj['DeliveryFulfillment.end.location'] = `Delivery fulfillment end location object is missing in ${constants.ON_CANCEL}`
            }
          } else {
            onCnclObj['DeliveryFulfillment.end'] = `Delivery fulfillment end object  is missing in ${constants.ON_CANCEL}`
          }
        }

        // Comparing rto_start_location and del_end_location
        if (!_.isEmpty(rto_start_location) && !_.isEmpty(del_end_location)) {
          if (!_.isEqual(rto_start_location, del_end_location)) {
            onCnclObj['RTO.start.location/DeliveryFulfillment.end.location'] = `RTO fulfillment start and Delivery fulfillment end location mismatch in ${constants.ON_CANCEL}`
          }
        } else {
          onCnclObj['RTO.start.location/DeliveryFulfillment.end.location'] = `RTO fulfillment start or Delivery fulfillment end location is missing in ${constants.ON_CANCEL}`
        }

        // Comparing rto_start_location and del_start_location
        if (!_.isEmpty(rto_start_location) && !_.isEmpty(del_start_location) && _.isEqual(rto_start_location, del_start_location)) {
          onCnclObj['RTO.start.location/DeliveryFulfillment.start.location'] = `RTO fulfillment start and Delivery fulfillment start location should not be equal in ${constants.ON_CANCEL}`
        }

        // Comparing rto_end_location and del_start_location
        if (!_.isEmpty(rto_end_location) && !_.isEmpty(del_start_location)) {
          if (!_.isEqual(rto_end_location, del_start_location)) {
            onCnclObj['RTO.end.location/DeliveryFulfillment.start.location'] = `RTO fulfillment end and Delivery fulfillment start location mismatch in ${constants.ON_CANCEL}`
          }
        } else {
          onCnclObj['RTO.end.location/DeliveryFulfillment.start.location'] = `RTO fulfillment end or Delivery fulfillment start location is missing in ${constants.ON_CANCEL}`
          logger.error(`RTO end or Delivery start location is missing in ${constants.ON_CANCEL}`)
        }

        // Comparing rto_end_location and del_end_location
        if (!_.isEmpty(rto_end_location) && !_.isEmpty(del_end_location) && _.isEqual(rto_end_location, del_end_location)) {
          onCnclObj['RTO.end_location/DeliveryFulfillment_end_location'] = `RTO fulfillment end and Delivery fulfillment end location should not be equal in ${constants.ON_CANCEL}`
        }
      }

      try {
        logger.info(`Checking payment object in /${constants.CONFIRM}`)

        if (!_.isEqual(on_cancel.payment['@ondc/org/settlement_details'][0], getValue('sttlmntdtls'))) {
          onCnclObj.sttlmntdtls = `payment settlement_details mismatch in /${constants.ON_INIT} & /${constants.CONFIRM}`
        }

        if (!on_cancel.hasOwnProperty('created_at') || !on_cancel.hasOwnProperty('updated_at')) {
          onCnclObj.ordertmpstmp = `order created and updated timestamps are mandatory in /${constants.CONFIRM}`
        } else {
          if (!_.isEqual(on_cancel.created_at, getValue('cnfrmTmpstmp'))) {
            onCnclObj.orderCrtd = `order.created_at timestamp should match context.timestamp of confirm`
          }
        }
      } catch (error: any) {
        logger.error(`!!Error while checking payment object in /${constants.CONFIRM}, ${error.stack}`)
      }
      if (flow === '4') {
        const Cancelobj = _.filter(on_cancel.fulfillments, { type: 'Cancel' })
        if (!Cancelobj.length) {
          logger.error(`Cancel object is mandatory for ${constants.ON_CANCEL}`)
          const key = `missingCancel`
          onCnclObj[key] = `Cancel object is mandatory for ${constants.ON_CANCEL}`
        }
      }

      const DeliveryObj = _.filter(on_cancel.fulfillments, { type: 'Delivery' })

      let reasonID_flag = 0
      let rto_id_flag = 0
      let initiated_by_flag = 0
      for (let item of DeliveryObj) {
        if (item.state?.descriptor?.code !== 'Cancelled') {
          logger.error(`Delivery state should be cancelled for ${constants.ON_CANCEL}`)
          const key = `invalidState`
          onCnclObj[key] = `Delivery state should be Cancelled for ${constants.ON_CANCEL}`
        }
        if (item.state?.descriptor?.code === 'Cancelled' && (!item.tags || !item.tags.length)) {
          logger.error(`Tags are mandatory for ${constants.ON_CANCEL} on cancelled state`)
          const key = `missingTags`
          onCnclObj[key] =
            `Tags are mandatory for ${constants.ON_CANCEL} on cancelled state for fulfillment type delivery`
        }
        const cancel_request = _.filter(item.tags, { code: 'cancel_request' })
        if (!cancel_request.length) {
          logger.error(`Cancel Request is mandatory for ${constants.ON_CANCEL}`)
          const key = `missingCancelRequest`
          onCnclObj[key] = `Cancel Request is mandatory for ${constants.ON_CANCEL} in fulfillment type delivery`
        } else {
          cancel_request.forEach((tag: any) => {
            if (!tag.list) {
              const key = `missingListObj`
              onCnclObj[key] = `List object is mandatory for cancel_request`
              return
            }
            tag.list.some((i: any) => {
              if (i.code === 'reason_id') {
                reasonID_flag = 1
              }
              if (i.code === 'rto_id') {
                rto_id_flag = 1
              }
              if (i.code === 'initiated_by') {
                initiated_by_flag = 1
              }
            })
          })
        }
        const preCancelObj = _.filter(item.tags, { code: 'precancel_state' })
        if (!preCancelObj.length) {
          logger.error(`Pre Cancel is mandatory for ${constants.ON_CANCEL}`)
          const key = `missingPreCancel`
          onCnclObj[key] = `Pre Cancel is mandatory for ${constants.ON_CANCEL}`
        }
      }
      if (!reasonID_flag) {
        logger.error(`Reason ID is mandatory field for ${constants.ON_CANCEL}`)
        let key = `missingReasonID`
        onCnclObj[key] = `Reason ID is mandatory field for ${constants.ON_CANCEL}`
      }
      if (!rto_id_flag && flow === '5') {
        logger.error(`RTO Id is mandatory field for ${constants.ON_CANCEL}`)
        let key = `missingRTOvalues`
        onCnclObj[key] = `RTO Id is mandatory field for ${constants.ON_CANCEL}`
      }
      if (!initiated_by_flag) {
        logger.error(`Initiated_by is mandatory field for ${constants.ON_CANCEL}`)
        let key = `missingInitiatedBy`
        onCnclObj[key] = `Initiated_by is mandatory field for ${constants.ON_CANCEL}`
      }
    } catch (error: any) {
      logger.error(`!!Error while checking Reason ID ,RTO Id and Initiated_by for ${constants.ON_CANCEL}`)
    }

    return onCnclObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_CANCEL} API`, err)
  }
}