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
    checkQuoteTrailSum,
    compareFulfillmentObject,
} from '../..'
import { getValue, setValue } from '../../../shared/dao'

export const checkOnStatusRTODelivered = (data: any) => {
    const onStatusRtoObj: any = {}
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
        schemaValidation = validateSchema(context.domain.split(':')[1], constants.ON_CANCEL_RTO, data)

        const select: any = getValue(`${ApiSequence.SELECT}`)
        const contextRes: any = checkContext(context, constants.ON_STATUS)
        const checkBap = checkBppIdOrBapId(context.bap_id)
        const checkBpp = checkBppIdOrBapId(context.bpp_id)
        const itemSet = new Set()
        const selectPriceMap: any = getValue('selectPriceMap')

        if (checkBap) Object.assign(onStatusRtoObj, { bap_id: 'context/bap_id should not be a url' })
        if (checkBpp) Object.assign(onStatusRtoObj, { bpp_id: 'context/bpp_id should not be a url' })
        if (schemaValidation !== 'error') {
            Object.assign(onStatusRtoObj, schemaValidation)
        }
        if (!contextRes?.valid) {
            Object.assign(onStatusRtoObj, contextRes.ERRORS)
        }

        if (!_.isEqual(data.context.domain.split(':')[1], getValue(`domain`))) {
            onStatusRtoObj[`Domain[${data.context.action}]`] = `Domain should be same in each action`
        }

        try {
            logger.info(`Checking context for /${constants.ON_STATUS_RTO_DELIVERED} API`) //checking context
            const res: any = checkContext(context, constants.ON_STATUS)
            if (!res.valid) {
                Object.assign(onStatusRtoObj, res.ERRORS)
            }
        } catch (error: any) {
            logger.error(`!!Some error occurred while checking /${constants.ON_STATUS_RTO_DELIVERED} context, ${error.stack}`)
        }

        try {
            logger.info(`Comparing city of /${constants.SEARCH} and /${constants.ON_STATUS_RTO_DELIVERED}`)
            if (!_.isEqual(searchContext.city, context.city)) {
                onStatusRtoObj.city = `City code mismatch in /${constants.SEARCH} and /${constants.ON_STATUS_RTO_DELIVERED}`
            }
        } catch (error: any) {
            logger.error(`!!Error while comparing city in /${constants.SEARCH} and /${constants.ON_STATUS_RTO_DELIVERED}, ${error.stack}`)
        }

        try {
            logger.info(`Comparing timestamp of /${constants.ON_INIT} and /${constants.ON_STATUS_RTO_DELIVERED}`)
            if (_.gte(getValue('onInitTmpstmp'), context.timestamp)) {
                onStatusRtoObj.tmpstmp = `Timestamp for /${constants.ON_INIT} api cannot be greater than or equal to /${constants.ON_STATUS_RTO_DELIVERED} api`
            }
        } catch (error: any) {
            logger.error(
                `!!Error while comparing timestamp for /${constants.ON_INIT} and /${constants.ON_STATUS_RTO_DELIVERED} api, ${error.stack}`,
            )
        }

        try {
            logger.info(`Comparing transaction Ids of /${constants.SELECT} and /${constants.ON_STATUS_RTO_DELIVERED}`)
            if (!_.isEqual(select.context.transaction_id, context.transaction_id)) {
                onStatusRtoObj.txnId = `Transaction Id should be same from /${constants.SELECT} onwards`
            }
        } catch (error: any) {
            logger.info(
                `!!Error while comparing transaction ids for /${constants.SELECT} and /${constants.ON_STATUS_RTO_DELIVERED} api, ${error.stack}`,
            )
        }

        const on_status_rto = message.order

        try {
            // Checking for valid item ids in /on_select
            const itemsOnSelect = getValue('SelectItemList')
            const itemsList = message.order.items
            const quoteobj = message.order.quote.breakup
            quoteobj.forEach((item: any) => {
                if (!itemsOnSelect?.includes(item['@ondc/org/item_id']) && item['@ondc/org/title_type'] === 'item') {
                    const key = `inVldItemId[${item.id}]`
                    onStatusRtoObj[key] = `Invalid Item Id provided in quote object /${constants.ON_STATUS_RTO_DELIVERED}: ${item.id}`
                }
            })
            itemsList.forEach((item: any) => {
                if (!itemsOnSelect?.includes(item.id)) {
                    const key = `inVldItemId[${item.id}]`
                    onStatusRtoObj[key] = `Invalid Item Id provided in /${constants.ON_STATUS_RTO_DELIVERED}: ${item.id}`
                } else {
                    itemSet.add(item.id)
                }
            })
        } catch (error: any) {
            logger.error(`Error while checking for item IDs for /${constants.ON_STATUS_RTO_DELIVERED}`, error.stack)
        }

        try {
            //Checking for valid fulfillment ids in /on_select and 0 item count in /on_status_rto
            const fulfillmentIdsOnSelect = getValue('selectFlflmntSet')
            const itemList = message.order.items
            itemList.forEach((item: any, index: number) => {
                if (fulfillmentIdsOnSelect) {
                    if (fulfillmentIdsOnSelect.includes(item.fulfillment_id) && item.quantity.count !== 0) {
                        onStatusRtoObj[`itemCount[${index}]`] = `Item count should be 0 for /${constants.ON_STATUS_RTO_DELIVERED} in forward shipment`
                    } else if (!fulfillmentIdsOnSelect.includes(item.fulfillment_id) && item.quantity.count === 0) {
                        onStatusRtoObj[`itemCount[${index}]`] = `Item count can't be 0 for /${constants.ON_STATUS_RTO_DELIVERED} in cancel shipment`
                    }
                }
            })
        } catch (error: any) {
            logger.error(`Error while checking for fulfillment IDs for /${constants.ON_STATUS_RTO_DELIVERED}`, error.stack)
        }

        // Check here for the comparison of on_status_rto and on_status_rto
        try {
            const deliveryFFObj = _.filter(on_status_rto.fulfillments, { type: 'Delivery' })
            if (deliveryFFObj.length == 0) {
                onStatusRtoObj[`deliveryFFObj`] = `fulfillment type delivery is missing in /${constants.ON_STATUS_RTO_DELIVERED}`
            }
            else {
                const deliveryFF = deliveryFFObj[0]
                const deliveryFFStart = deliveryFF.start
                const deliveryFFEnd = deliveryFF.end

                function checkFFStartOrEnd(ffStartOrEnd: any, startOrEnd: string) {
                    if (!ffStartOrEnd) {
                        onStatusRtoObj[`deliveryFFObj${startOrEnd}`] = `fulfillment type delivery ${startOrEnd.toLowerCase()} is missing in /${constants.ON_STATUS_RTO_DELIVERED}`
                    }
                    else {
                        if (_.isEmpty(ffStartOrEnd.location)) {
                            onStatusRtoObj[`deliveryFFObj/${startOrEnd}/Location`] = `fulfillment type delivery ${startOrEnd.toLowerCase()}/location is missing in /${constants.ON_STATUS_RTO_DELIVERED}`
                        }
                        else {
                            if (startOrEnd == "End") {
                                if (_.isEmpty(ffStartOrEnd.location?.address)) {
                                    onStatusRtoObj[`deliveryFFObj/${startOrEnd}/Location/Address`] = `fulfillment type delivery ${startOrEnd.toLowerCase()}/location/address is missing in /${constants.ON_STATUS_RTO_DELIVERED}`

                                }
                                else {
                                    if (_.isEmpty(ffStartOrEnd.location.address.name)) {
                                        onStatusRtoObj[`deliveryFFObj/${startOrEnd}/Location/Address/Name`] = `fulfillment type delivery ${startOrEnd.toLowerCase()}/location/address/name is missing in /${constants.ON_STATUS_RTO_DELIVERED}`
                                    }
                                    if (_.isEmpty(ffStartOrEnd.location.address.building)) {
                                        onStatusRtoObj[`deliveryFFObj/${startOrEnd}/Location/Address/Building`] = `fulfillment type delivery ${startOrEnd.toLowerCase()}/location/address/building is missing in /${constants.ON_STATUS_RTO_DELIVERED}`
                                    }
                                    if (_.isEmpty(ffStartOrEnd.location.address.country)) {
                                        onStatusRtoObj[`deliveryFFObj/${startOrEnd}/Location/Address/Country`] = `fulfillment type delivery ${startOrEnd.toLowerCase()}/location/address/country is missing in /${constants.ON_STATUS_RTO_DELIVERED}`
                                    }
                                }
                            }
                        }
                        if (_.isEmpty(ffStartOrEnd.time)) {
                            onStatusRtoObj[`deliveryFFObj/${startOrEnd}/time`] = `fulfillment type delivery ${startOrEnd.toLowerCase()}/time is missing in /${constants.ON_STATUS_RTO_DELIVERED}`
                        }
                        else {
                            if (_.isEmpty(ffStartOrEnd.time.range)) {
                                onStatusRtoObj[`deliveryFFObj/${startOrEnd}/Time/Range`] = `fulfillment type delivery ${startOrEnd.toLowerCase()}/time/range is missing in /${constants.ON_STATUS_RTO_DELIVERED}`
                            }
                            else {
                                if (!ffStartOrEnd.time.range.start) {
                                    onStatusRtoObj[`deliveryFFObj/${startOrEnd}/Time/Range/Start`] = `fulfillment type delivery ${startOrEnd.toLowerCase()}/time/range/start is missing in /${constants.ON_STATUS_RTO_DELIVERED}`
                                }
                                else {
                                    const date = new Date(ffStartOrEnd.time.range.start);
                                    if (String(date) == "Invalid Date") {
                                        onStatusRtoObj[`deliveryFFObj/${startOrEnd}/Time/Range/Start`] = `fulfillment type delivery ${startOrEnd.toLowerCase()}/time/range/start is not of a valid date format in /${constants.ON_STATUS_RTO_DELIVERED}`
                                    }
                                }
                                if (!ffStartOrEnd.time.range.end) {
                                    onStatusRtoObj[`deliveryFFObj/${startOrEnd}/Time/Range/End`] = `fulfillment type delivery ${startOrEnd.toLowerCase()}/time/range/end is missing in /${constants.ON_STATUS_RTO_DELIVERED}`
                                }
                                else {
                                    const date = new Date(ffStartOrEnd.time.range.end);
                                    if (String(date) == "Invalid Date") {
                                        onStatusRtoObj[`deliveryFFObj/${startOrEnd}/Time/Range/End`] = `fulfillment type delivery ${startOrEnd.toLowerCase()}/time/range/end is not of a valid date format in /${constants.ON_STATUS_RTO_DELIVERED}`
                                    }
                                }
                            }
                        }
                        if (_.isEmpty(ffStartOrEnd.contact)) {
                            onStatusRtoObj[`deliveryFFObj/${startOrEnd}/Contact`] = `fulfillment type delivery ${startOrEnd.toLowerCase()}/contact is missing in /${constants.ON_STATUS_RTO_DELIVERED}`
                        }
                        else {
                            if (!ffStartOrEnd.contact.phone) {
                                onStatusRtoObj[`deliveryFFObj/${startOrEnd}/Contact/Phone`] = `fulfillment type delivery ${startOrEnd.toLowerCase()}/contact/phone is missing in /${constants.ON_STATUS_RTO_DELIVERED}`

                            }
                            else if (isNaN(Number(ffStartOrEnd.contact.phone))) {
                                onStatusRtoObj[`deliveryFFObj/${startOrEnd}/Contact/Phone`] = `fulfillment type delivery ${startOrEnd.toLowerCase()}/contact/phone is not a valid phone_number in /${constants.ON_STATUS_RTO_DELIVERED}`

                            }
                            if (!ffStartOrEnd.contact.email) {
                                onStatusRtoObj[`deliveryFFObj/${startOrEnd}/Contact/Email`] = `fulfillment type delivery ${startOrEnd.toLowerCase()}/contact/email is missing in /${constants.ON_STATUS_RTO_DELIVERED}`
                            }
                            else if (typeof ffStartOrEnd.contact.email != "string") {
                                onStatusRtoObj[`deliveryFFObj/${startOrEnd}/Contact/Email`] = `fulfillment type delivery ${startOrEnd.toLowerCase()}/contact/email is not a type of string in /${constants.ON_STATUS_RTO_DELIVERED}`

                            }
                        }
                        if (startOrEnd == "End") {
                            if (_.isEmpty(ffStartOrEnd.person)) {
                                onStatusRtoObj[`deliveryFFObj/${startOrEnd}/Person`] = `fulfillment type delivery ${startOrEnd.toLowerCase()}/person is missing in /${constants.ON_STATUS_RTO_DELIVERED}`
                            }
                            else {
                                if (!ffStartOrEnd.person.name) {
                                    onStatusRtoObj[`deliveryFFObj/${startOrEnd}/Person/Name`] = `fulfillment type delivery ${startOrEnd.toLowerCase()}/person/name is missing in /${constants.ON_STATUS_RTO_DELIVERED}`
                                }
                                else if (typeof ffStartOrEnd.person.name != "string") {
                                    onStatusRtoObj[`deliveryFFObj/${startOrEnd}/Person`] = `fulfillment type delivery ${startOrEnd.toLowerCase()}/person/name is not a type of string in /${constants.ON_STATUS_RTO_DELIVERED}`
                                }
                            }
                        }
                    }
                }
                checkFFStartOrEnd(deliveryFFStart, "Start")
                checkFFStartOrEnd(deliveryFFEnd, "End")
            }
        }
        catch (error: any) {
            logger.error(`!!Error while checking fulfillment type delivery in  /${constants.ON_STATUS_RTO_DELIVERED}, ${error.stack}`)
        }


        //Comparing item count in /on_status_rto and /select
        const select_items: any = getValue('items')
        try {
            logger.info(`Matching the item count in message/order/items with that in /select`)
            const onCancelItems: any[] = on_status_rto.items
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
                onStatusRtoObj[`itemCount`] =
                    `Total item count in message/order/items doesn't match with item count of /${constants.ON_SELECT}`
            }
        } catch (error: any) {
            logger.error(`Error while matching the count of items in /on_update and /select: ${error.message}`)
        }

        try {
            logger.info(`Checking quote breakup prices for /${constants.ON_STATUS_RTO_DELIVERED}`)
            if (!sumQuoteBreakUp(on_status_rto.quote)) {
                const key = `invldQuotePrices`
                onStatusRtoObj[key] = `item quote breakup prices for ${constants.ON_STATUS_RTO_DELIVERED} should be equal to the total price.`
                logger.error(`item quote breakup prices for ${constants.ON_STATUS_RTO_DELIVERED} should be equal to the net price`)
            }
        } catch (error: any) {
            logger.error(`!!Error while Comparing Quote object for /${constants.ON_STATUS_RTO_DELIVERED}`)
        }

        try {
            if (sumQuoteBreakUp(on_status_rto.quote)) {
                logger.info(`Checking for quote_trail price and item quote price sum for ${constants.ON_STATUS_RTO_DELIVERED}`)
                const price = Number(on_status_rto.quote.price.value)
                const priceAtConfirm = Number(getValue('quotePrice'))
                let cancelFulfillments = null
                if (flow === '5') {
                    cancelFulfillments = _.filter(on_status_rto.fulfillments, { type: 'RTO' })
                } else {
                    cancelFulfillments = _.filter(on_status_rto.fulfillments, { type: 'Cancel' })
                }

                if (!cancelFulfillments.length && flow === '4') {
                    const key = `CancelFulfillmentMissing`
                    onStatusRtoObj[key] = `fulfillment type cancel is missing in /${constants.ON_STATUS_RTO_DELIVERED}`
                }
                checkQuoteTrailSum(cancelFulfillments, price, priceAtConfirm, onStatusRtoObj, ApiSequence.ON_CANCEL)

            } else {
                logger.error(`The price breakdown in brakup does not match with the total_price for ${constants.ON_STATUS_RTO_DELIVERED}`)
            }
        } catch (error: any) {
            logger.error(`!!Error while Comparing Quote_Trail object for /${constants.ON_STATUS_RTO_DELIVERED}, ${error.stack} `)
        }

        try {
            logger.info(`Checking for Item IDs in quote object in /${constants.ON_STATUS_RTO_DELIVERED}`)
            let cancelFulfillments = null
            if (flow === '5') {
                cancelFulfillments = _.filter(on_status_rto.fulfillments, { type: 'RTO' })
            } else {
                cancelFulfillments = _.filter(on_status_rto.fulfillments, { type: 'Cancel' })
            }
            for (let obj of cancelFulfillments) {
                const quoteTrailItems = _.filter(obj.tags, { code: 'quote_trail' })
                checkQuoteTrail(quoteTrailItems, onStatusRtoObj, selectPriceMap, itemSet)
            }
        } catch (error: any) {
            logger.error(`!!Error while checking quote object in /${constants.ON_STATUS_RTO_DELIVERED}, ${error.stack}`)
        }

        try {
            // Need to update this for LSP and LBNP
            logger.info(`Mapping valid cancellation_reason_id with the buyerNP or sellerNP in ${constants.ON_STATUS_RTO_DELIVERED}`)
            const cancellationObj = on_status_rto.cancellation
            const cancelled_by = cancellationObj.cancelled_by
            const reason_id = cancellationObj.reason.id
            if (cancelled_by === context.bap_id) {
                mapCancellationID('BNP', reason_id, onStatusRtoObj)
            } else {
                mapCancellationID('SNP', reason_id, onStatusRtoObj)
            }
            if (flow === '4' && cancelled_by !== context.bap_id) {
                const key = 'invalidCancelledByEntity'
                onStatusRtoObj[key] = `cancelled_by entity should be same as context/bap_id`
            }
        } catch (error: any) {
            logger.error(`!!Error while mapping cancellation_reason_id in ${constants.ON_STATUS_RTO_DELIVERED}`)
        }
        try {
            logger.info(`Comparing order ids in /${constants.ON_STATUS_RTO_DELIVERED} and /${constants.ON_CONFIRM}`)
            if (getValue('cnfrmOrdrId') != on_status_rto.id) {
                onStatusRtoObj.orderID = `Order Id mismatches in /${constants.ON_STATUS_RTO_DELIVERED} and /${constants.ON_CONFIRM}`
            }
        } catch (error: any) {
            logger.error(`!!Error while trying to fetch order ids in /${constants.ON_CONFIRM}, ${error.stack}`)
        }

        try {
            logger.info(`Checking provider id and location in /${constants.ON_STATUS_RTO_DELIVERED}`)
            if (on_status_rto.provider.id != getValue('providerId')) {
                onStatusRtoObj.prvdrId = `Provider Id mismatches in /${constants.ON_SELECT} and /${constants.ON_STATUS_RTO_DELIVERED}`
            }

            if (on_status_rto.provider.locations[0].id != getValue('providerLoc')) {
                onStatusRtoObj.prvdrLoc = `provider.locations[0].id mismatches in /${constants.ON_SEARCH} and /${constants.ON_STATUS_RTO_DELIVERED}`
            }
        } catch (error: any) {
            logger.error(`!!Error while checking provider id and location in /${constants.ON_STATUS_RTO_DELIVERED}, ${error.stack}`)
        }
        let Ids = []
        let Flfmntid = []
        try {
            logger.info(`Comparing item Ids and fulfillment ids in /${constants.ON_SELECT} and /${constants.ON_STATUS_RTO_DELIVERED}`)
            const itemFlfllmnts: any = getValue('itemFlfllmnts')
            let i = 0
            const len = on_status_rto.items.length
            let forwardFulfillmentCount = 0 // Counter for forward fulfillment
            let cancellationFulfillmentCount = 0 // Counter for cancellation fulfillment
            while (i < len) {
                const itemId = on_status_rto.items[i].id
                Ids.push(itemId)
                Flfmntid.push(on_status_rto.items[i].fulfillment_id)
                if (!(itemId in itemFlfllmnts)) {
                    const key = `ITEM_ID ${itemId}`
                    onStatusRtoObj[key] = `${itemId} itemID not found in ${constants.ON_SELECT}`
                }
                if (itemId in itemFlfllmnts && Object.values(itemFlfllmnts).includes(on_status_rto.items[i].fulfillment_id)) {
                    const key = `FF_ID ${on_status_rto.items[i].fulfillment_id}`
                    logger.info(`forward fulfillment found ${key}`)
                    forwardFulfillmentCount++
                }
                if (itemId in itemFlfllmnts && !Object.values(itemFlfllmnts).includes(on_status_rto.items[i].fulfillment_id)) {
                    const key = `FF_ID ${on_status_rto.items[i].fulfillment_id}`
                    logger.info(`Cancellation fulfillment found ${key}`)
                    cancellationFulfillmentCount++
                }
                i++
            }
            if (cancellationFulfillmentCount != forwardFulfillmentCount) {
                const key = `Fulfillment_mismatch`
                onStatusRtoObj[key] =
                    `The count of cancellation fulfillmentns is not equal to the count of forward fulfillments or invalid fulfillment id.`
            } else {
                logger.info(`The count of cancellation fulfillments is equal to the count of forward fulfillments.`)
            }
        } catch (error: any) {
            logger.error(
                `!!Error while comparing Item and Fulfillment Id in /${constants.ON_SELECT} and /${constants.ON_STATUS_RTO_DELIVERED}, ${error.stack}`,
            )
        }

        try {
            logger.info(`Comparing billing object in /${constants.INIT} and /${constants.ON_STATUS_RTO_DELIVERED}`)
            const billing = getValue('billing')

            const billingErrors = compareObjects(billing, on_status_rto.billing)

            if (billingErrors) {
                let i = 0
                const len = billingErrors.length
                while (i < len) {
                    const key = `billingErr${i}`
                    onStatusRtoObj[key] = `${billingErrors[i]} when compared with init billing object`
                    i++
                }
            }

            setValue('billing', on_status_rto.billing)
        } catch (error: any) {
            logger.error(`!!Error while comparing billing object in /${constants.CONFIRM} and /${constants.ON_STATUS_RTO_DELIVERED}`)
        }

        try {
            logger.info(`Checking fulfillments objects in /${constants.ON_STATUS_RTO_DELIVERED}`)
            let i = 0
            const len = on_status_rto.fulfillments.length
            while (i < len) {
                if (on_status_rto.fulfillments[i].id) {
                    const id = on_status_rto.fulfillments[i].id
                    const nonMatchingFlfmntid = new Set(Flfmntid)
                    if (!nonMatchingFlfmntid.has(id)) {
                        const key = `ffID ${id}`
                        //MM->Mismatch
                        onStatusRtoObj[key] = `fulfillment id ${id} does not exist in /${constants.ON_STATUS_RTO_DELIVERED} items.fulfillment_id`
                    }
                }
                i++
            }
        } catch (error: any) {
            logger.error(`!!Error while checking fulfillments object in /${constants.ON_STATUS_RTO_DELIVERED}, ${error.stack}`)
        }

        try {
            logger.info(`Checking payment object in /${constants.ON_STATUS_RTO_DELIVERED}`)

            if (!_.isEqual(on_status_rto.payment['@ondc/org/settlement_details'][0], getValue('sttlmntdtls'))) {
                onStatusRtoObj.sttlmntdtls = `payment settlement_details mismatch in /${constants.ON_INIT} & /${constants.ON_STATUS_RTO_DELIVERED}`
            }
            console.log("🚀 ~ checkOnStatusRTODelivered ~ on_status_rto.payment['@ondc/org/settlement_details'][0]:", on_status_rto.payment['@ondc/org/settlement_details'][0])
            console.log("🚀 ~ checkOnStatusRTODelivered ~ getValue('sttlmntdtls'):", getValue('sttlmntdtls'))

            if (!on_status_rto.hasOwnProperty('created_at') || !on_status_rto.hasOwnProperty('updated_at')) {
                onStatusRtoObj.ordertmpstmp = `order created and updated timestamps are mandatory in /${constants.ON_STATUS_RTO_DELIVERED}`
            } else {
                if (!_.gt(on_status_rto.updated_at, on_status_rto.created_at)) {
                    onStatusRtoObj.ordrupdtd = `order.updated_at timestamp should be greater than order.created_at timestamp`
                }
            }
        } catch (error: any) {
            logger.error(`!!Error while checking payment object in /${constants.ON_STATUS_RTO_DELIVERED}, ${error.stack}`)
        }

        try {
            logger.info(`storing payment object in /${constants.ON_STATUS_RTO_DELIVERED}`)
            setValue('cnfrmpymnt', on_status_rto.payment)
        } catch (error: any) {
            logger.error(`!!Error while storing payment object in /${constants.ON_STATUS_RTO_DELIVERED}, ${error.stack}`)
        }

        try {
            logger.info(`Checking if transaction_id is present in message.order.payment`)
            const payment = on_status_rto.payment
            const status = payment_status(payment)
            if (!status) {
                onStatusRtoObj['message/order/transaction_id'] = `Transaction_id missing in message/order/payment`
            }
        } catch (err: any) {
            logger.error(`Error while checking transaction is in message.order.payment`)
        }
        if (flow === '4') {
            try {
                logger.info(`Checking for valid cancellation reason ID in cancellation object of /${constants.ON_STATUS_RTO_DELIVERED}`)
                const reason_id = on_status_rto.cancellation.reason.id
                if (reason_id !== getValue('cnclRid')) {
                    onStatusRtoObj['reason_id'] =
                        `reason_id is different in cancellation object of /${constants.ON_STATUS_RTO_DELIVERED} from /${constants.CANCEL}`
                }
            } catch (err: any) {
                logger.error(
                    `Error while checking for valid cancellation reason ID in cancellation object of /${constants.ON_STATUS_RTO_DELIVERED}`,
                )
            }
        }

        try {
            // Checking for igm_request inside fulfillments for /on_status_rto
            const RTOobj = _.filter(on_status_rto.fulfillments, { type: 'RTO' })
            const DELobj = _.filter(on_status_rto.fulfillments, { type: 'Delivery' })
            let rto_start_location: any = {}
            let rto_end_location: any = {}
            let del_start_location: any = {}
            let del_end_location: any = {}
            let rto_delivered_or_disposed: boolean = false
            // For RTO Object
            if (!RTOobj.length) {
                logger.error(`RTO object is mandatory for ${constants.ON_STATUS_RTO_DELIVERED}`)
                const key = `missingRTO`
                onStatusRtoObj[key] = `RTO object is mandatory for ${constants.ON_STATUS_RTO_DELIVERED}`
            } else {
                for (let item of RTOobj) {
                    const validVal = ['RTO-Delivered', 'RTO-Disposed']
                    if (!validVal.includes(item.state?.descriptor?.code)) {
                        logger.error(
                            `Delivery state should be one of ['RTO-Delivered', 'RTO-Disposed'] for ${constants.ON_STATUS_RTO_DELIVERED}`,
                        )
                        const key = `invalidState`
                        onStatusRtoObj[key] =
                            `Delivery state should be one of ['RTO-Delivered', 'RTO-Disposed'] for ${constants.ON_STATUS_RTO_DELIVERED}`
                    }
                    else {
                        if (item.state.descriptor.code == validVal[1] || item.state.descriptor.code == validVal[2]) {
                            rto_delivered_or_disposed = true
                        }
                    }
                }

                // Checking for start object inside RTO
                if (!_.isEmpty(RTOobj[0]?.start)) {
                    const rto_obj_start = RTOobj[0]?.start
                    if (!_.isEmpty(rto_obj_start.location)) {
                        rto_start_location = rto_obj_start.location
                    }
                    else {
                        onStatusRtoObj['RTOfulfillment.start.location'] = `RTO fulfillment start location object is missing in ${constants.ON_STATUS_RTO_DELIVERED}`
                    }
                } else {
                    onStatusRtoObj['RTOfulfillment.start'] = `RTO fulfillment start object  is missing in ${constants.ON_STATUS_RTO_DELIVERED}`
                }

                // Checking for end object inside RTO
                if (!_.isEmpty(RTOobj[0]?.end)) {
                    const rto_obj_end = RTOobj[0]?.end
                    // Checking for time in end Object if the descriptor code is 'RTO-Delivered' or 'RTO-Disposed'
                    if (rto_delivered_or_disposed) {
                        if (_.isEmpty(rto_obj_end.time)) {
                            onStatusRtoObj[`rtoFFObj/end/time`] = `fulfillment type rto end/time is missing in /${constants.ON_STATUS_RTO_DELIVERED}`
                        }
                        else {
                            if (_.isEmpty(rto_obj_end.time.timestamp)) {
                                onStatusRtoObj[`rtoFFObj/end/Time/timestamp`] = `fulfillment type rto end/time/timestamp is missing in /${constants.ON_STATUS_RTO_DELIVERED}`
                            }
                            else {
                                const date = new Date(rto_obj_end.time.timestamp);
                                if (String(date) == "Invalid Date") {
                                    onStatusRtoObj[`rtoFFObj/end/Time/timestamp`] = `fulfillment type rto end/time/timestamp is not of a valid date format in /${constants.ON_STATUS_RTO_DELIVERED}`
                                }
                            }
                        }
                    }
                    else {
                        if ((rto_obj_end.time)) {
                            onStatusRtoObj[`rtoFFObj/end/time`] = `fulfillment type rto end/time should be present in /${constants.ON_STATUS_RTO_DELIVERED} when state/desc/code is RTO-Initiated`
                        }
                    }
                    if (!_.isEmpty(rto_obj_end?.location)) {
                        rto_end_location = rto_obj_end.location
                    }
                    else {
                        onStatusRtoObj['RTOfulfillment.end.location'] = `RTO fulfillment end location object is missing in ${constants.ON_STATUS_RTO_DELIVERED}`
                    }
                } else {
                    onStatusRtoObj['RTOfulfillment.end'] = `RTO fulfillment end object  is missing in ${constants.ON_STATUS_RTO_DELIVERED}`
                }
                const keys = Object.keys(RTOobj[0])

                const onCancelRtoObj = getValue('RTO_Obj')
                delete RTOobj[0].end.time
                delete RTOobj[0].state
                delete onCancelRtoObj?.state
                const errors = compareFulfillmentObject(RTOobj[0], onCancelRtoObj, keys, 0, constants.ON_STATUS_RTO_DELIVERED)
                if (errors.length > 0) {
                    errors.forEach((item: any) => {
                      onStatusRtoObj[item.errKey] = item.errMsg
                    })
                  }
            }

            // For Delivery Object
            if (!DELobj.length) {
                logger.error(`Delivery object is mandatory for ${constants.ON_STATUS_RTO_DELIVERED}`)
                const key = `missingDelivery`
                onStatusRtoObj[key] = `Delivery object is mandatory for ${constants.ON_STATUS_RTO_DELIVERED}`
            } else {

                // Checking for start object inside Delivery
                if (!_.isEmpty(DELobj[0]?.start)) {
                    const del_obj_start = DELobj[0]?.start

                    if (!_.isEmpty(del_obj_start?.location)) {
                        del_start_location = del_obj_start.location
                    }
                    else {
                        onStatusRtoObj['Delivery.start.location'] = `Delivery fulfillment start location object is missing in ${constants.ON_STATUS_RTO_DELIVERED}`
                        logger.error(`Delivery fulfillment start location is missing in ${constants.ON_STATUS_RTO_DELIVERED}`)
                    }
                } else {
                    onStatusRtoObj['DeliveryFulfillment.start'] = `Delivery fulfillment start object is missing in ${constants.ON_STATUS_RTO_DELIVERED}`
                }

                // Checking for end object inside Delivery
                if (!_.isEmpty(DELobj[0]?.end)) {
                    const del_obj_end = DELobj[0]?.end
                    if (!_.isEmpty(del_obj_end?.location)) {
                        del_end_location = del_obj_end.location
                    }
                    else {
                        onStatusRtoObj['DeliveryFulfillment.end.location'] = `Delivery fulfillment end location object is missing in ${constants.ON_STATUS_RTO_DELIVERED}`
                    }
                } else {
                    onStatusRtoObj['DeliveryFulfillment.end'] = `Delivery fulfillment end object  is missing in ${constants.ON_STATUS_RTO_DELIVERED}`
                }

                const keys = Object.keys(DELobj[0])
                const onCancelDELObj = getValue('DEL_Obj')
                const errors = compareFulfillmentObject(DELobj[0], onCancelDELObj, keys, 1, constants.ON_STATUS_RTO_DELIVERED)
                if (errors.length > 0) {
                    errors.forEach((item: any) => {
                      onStatusRtoObj[item.errKey] = item.errMsg
                    })
                  }
            }

            // Comparing rto_start_location and del_end_location
            if (!_.isEmpty(rto_start_location) && !_.isEmpty(del_end_location)) {
                if (!_.isEqual(rto_start_location?.address, del_end_location?.address)) {
                    onStatusRtoObj['RTO.start.location/DeliveryFulfillment.end.location'] = `RTO fulfillment start and Delivery fulfillment end location mismatch in ${constants.ON_STATUS_RTO_DELIVERED}`
                }
            } else {
                onStatusRtoObj['RTO.start.location/DeliveryFulfillment.end.location'] = `RTO fulfillment start or Delivery fulfillment end location is missing in ${constants.ON_STATUS_RTO_DELIVERED}`
            }

            // Comparing rto_start_location and del_start_location
            if (!_.isEmpty(rto_start_location?.address) && !_.isEmpty(del_start_location?.address) && _.isEqual(rto_start_location?.address, del_start_location?.address)) {
                onStatusRtoObj['RTO.start.location/DeliveryFulfillment.start.location'] = `RTO fulfillment start and Delivery fulfillment start location should not be equal in ${constants.ON_STATUS_RTO_DELIVERED}`
            }

            // Comparing rto_end_location and del_start_location
            if (!_.isEmpty(rto_end_location) && !_.isEmpty(del_start_location)) {
                if (!_.isEqual(rto_end_location?.address, del_start_location?.address)) {
                    onStatusRtoObj['RTO.end.location/DeliveryFulfillment.start.location'] = `RTO fulfillment end and Delivery fulfillment start location mismatch in ${constants.ON_STATUS_RTO_DELIVERED}`
                }
                if (_.isEmpty(rto_end_location?.id)) {
                    onStatusRtoObj['RTO.end.location/id'] = `RTO fulfillment end location id missing in ${constants.ON_STATUS_RTO_DELIVERED}`
                }
                if (_.isEmpty(del_start_location?.id)) {
                    onStatusRtoObj['DeliveryFulfillment.start.location/id'] = `Delivery fulfillment start location id missing in ${constants.ON_STATUS_RTO_DELIVERED}`
                }
                if (!_.isEqual(rto_end_location?.id, del_start_location?.id)) {
                    onStatusRtoObj['RTO.end.location/DeliveryFulfillment.start.location/id'] = `RTO fulfillment end and Delivery fulfillment start location id mismatch in ${constants.ON_STATUS_RTO_DELIVERED}`
                }
            } else {
                onStatusRtoObj['RTO.end.location/DeliveryFulfillment.start.location'] = `RTO fulfillment end or Delivery fulfillment start location is missing in ${constants.ON_STATUS_RTO_DELIVERED}`
                logger.error(`RTO end or Delivery start location is missing in ${constants.ON_STATUS_RTO_DELIVERED}`)
            }

            // Comparing rto_end_location and del_end_location
            if (!_.isEmpty(rto_end_location?.address) && !_.isEmpty(del_end_location?.address) && _.isEqual(rto_end_location?.address, del_end_location?.address)) {
                onStatusRtoObj['RTO.end_location/DeliveryFulfillment_end_location'] = `RTO fulfillment end and Delivery fulfillment end location should not be equal in ${constants.ON_STATUS_RTO_DELIVERED}`
            }



            const DeliveryObj = _.filter(on_status_rto.fulfillments, { type: 'Delivery' })

            let reasonID_flag = 0
            let rto_id_flag = 0
            let initiated_by_flag = 0
            for (let item of DeliveryObj) {
                if (item.state?.descriptor?.code !== 'Cancelled') {
                    logger.error(`Delivery state should be cancelled for ${constants.ON_STATUS_RTO_DELIVERED}`)
                    const key = `invalidState`
                    onStatusRtoObj[key] = `Delivery state should be Cancelled for ${constants.ON_STATUS_RTO_DELIVERED}`
                }
                if (item.state?.descriptor?.code === 'Cancelled' && (!item.tags || !item.tags.length)) {
                    logger.error(`Tags are mandatory for ${constants.ON_STATUS_RTO_DELIVERED} on cancelled state`)
                    const key = `missingTags`
                    onStatusRtoObj[key] =
                        `Tags are mandatory for ${constants.ON_STATUS_RTO_DELIVERED} on cancelled state for fulfillment type delivery`
                }
                const cancel_request = _.filter(item.tags, { code: 'cancel_request' })
                if (!cancel_request.length) {
                    logger.error(`Cancel Request is mandatory for ${constants.ON_STATUS_RTO_DELIVERED}`)
                    const key = `missingCancelRequest`
                    onStatusRtoObj[key] = `Cancel Request is mandatory for ${constants.ON_STATUS_RTO_DELIVERED} in fulfillment type delivery`
                } else {
                    cancel_request.forEach((tag: any) => {
                        if (!tag.list) {
                            const key = `missingListObj`
                            onStatusRtoObj[key] = `List object is mandatory for cancel_request`
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
                    logger.error(`Pre Cancel is mandatory for ${constants.ON_STATUS_RTO_DELIVERED}`)
                    const key = `missingPreCancel`
                    onStatusRtoObj[key] = `Pre Cancel is mandatory for ${constants.ON_STATUS_RTO_DELIVERED}`
                } else {
                    try {
                        logger.info(`Comparing timestamp of ${flow == '4' ? constants.ON_CONFIRM : constants.ON_STATUS_OUT_FOR_DELIVERY} and /${constants.ON_STATUS_RTO_DELIVERED} pre_cancel state updated_at timestamp`)
                        const timeStampObj = _.filter(preCancelObj[0]?.list, { code: 'updated_at' })
                        if (!timeStampObj.length) {
                            logger.error(`Pre Cancel timestamp is mandatory for ${constants.ON_STATUS_RTO_DELIVERED}`)
                            const key = `missingPrecancelUpdatedAttimeStamp`
                            onStatusRtoObj[key] = `Pre Cancel Updated at timeStamp is mandatory for ${constants.ON_STATUS_RTO_DELIVERED}`
                        }
                        else {
                            if (!_.isEqual(getValue('PreviousUpdatedTimestamp'), timeStampObj[0].value)) {
                                logger.error(`precancel_state.updated_at of ${constants.ON_STATUS_RTO_DELIVERED} is not equal with the ${flow == '4' ? constants.ON_CONFIRM : constants.ON_STATUS_OUT_FOR_DELIVERY} order.updated_at`)
                                const key = `precancelState.updatedAt`
                                onStatusRtoObj[key] = `precancel_state.updated_at of ${constants.ON_STATUS_RTO_DELIVERED} is not equal with the ${flow == '4' ? constants.ON_CONFIRM : constants.ON_STATUS_OUT_FOR_DELIVERY} order.updated_at`
                            }
                        }
                    } catch (error: any) {
                        logger.error(
                            `!!Error while comparing timestamp for /${flow == '4' ? constants.ON_CONFIRM : constants.ON_STATUS_OUT_FOR_DELIVERY} and /${constants.ON_STATUS_RTO_DELIVERED} api, ${error.stack}`,
                        )
                    }
                }
            }
            if (!reasonID_flag) {
                logger.error(`Reason ID is mandatory field for ${constants.ON_STATUS_RTO_DELIVERED}`)
                let key = `missingReasonID`
                onStatusRtoObj[key] = `Reason ID is mandatory field for ${constants.ON_STATUS_RTO_DELIVERED}`
            }
            if (!rto_id_flag && flow === '5') {
                logger.error(`RTO Id is mandatory field for ${constants.ON_STATUS_RTO_DELIVERED}`)
                let key = `missingRTOvalues`
                onStatusRtoObj[key] = `RTO Id is mandatory field for ${constants.ON_STATUS_RTO_DELIVERED}`
            }
            if (!initiated_by_flag) {
                logger.error(`Initiated_by is mandatory field for ${constants.ON_STATUS_RTO_DELIVERED}`)
                let key = `missingInitiatedBy`
                onStatusRtoObj[key] = `Initiated_by is mandatory field for ${constants.ON_STATUS_RTO_DELIVERED}`
            }
        } catch (error: any) {
            logger.error(`!!Error while checking Reason ID ,RTO Id and Initiated_by for ${constants.ON_STATUS_RTO_DELIVERED}`)
        }

        return onStatusRtoObj
    } catch (err: any) {
        logger.error(`!!Some error occurred while checking /${constants.ON_STATUS_RTO_DELIVERED} API`, err)
    }
}