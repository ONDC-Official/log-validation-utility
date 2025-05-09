import _, { isEmpty } from 'lodash'
import { logger } from '../../../shared/logger'
import constants, { ApiSequence } from '../../../constants'
import {
    validateSchemaRetailV2,
    isObjectEmpty,
    checkBppIdOrBapId,
    checkContext,
    sumQuoteBreakUp,
    payment_status,
    checkQuoteTrailSum,
    compareQuoteObjects,
    compareCoordinates,
    checkQuoteTrail,
} from '../..'
import { getValue, setValue } from '../../../shared/dao'
import { timeDiff } from '../../index';
import {
    partcancel_return_reasonCodes,
    return_rejected_request_reasonCodes,
    return_request_reasonCodes,
} from '../../../constants/reasonCode'

export const checkOnUpdate = (data: any, msgIdSet: any, apiSeq: any, settlementDetatilSet: any, quoteTrailItemsSet: any, fulfillmentsItemsSet: any, flow: any) => {
    const onupdtObj: any = {}
    const quoteItemSet: any = new Set()
    const onConfirmQuote = getValue(`${constants.ON_CONFIRM}/quote`)
    const selectPriceMap: any = getValue('selectPriceMap')
    const itemSet = new Set()
    // const onConfirmDeliveryFulfillment = getValue('deliveryFulfillment');
    try {
        if (!data || isObjectEmpty(data)) {
            return { [ApiSequence.ON_UPDATE]: 'JSON cannot be empty' }
        }

        const { message, context }: any = data

        const on_update = message.order
        const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
        const select: any = getValue(`${ApiSequence.SELECT}`)
        setValue(`${ApiSequence.ON_UPDATE}`, data)

        if (!message || !context || isObjectEmpty(message) || isObjectEmpty(message.order)) {
            return { missingFields: '/context, /message, /message/order is missing or empty' }
        }

        // Validating Schema
        const schemaValidation = validateSchemaRetailV2(context.domain.split(':')[1], constants.ON_UPDATE, data)

        if (schemaValidation !== 'error') {
            Object.assign(onupdtObj, schemaValidation)
        }

        // have to change here as well for flow 6-a and 6-b
        try {
            if ((flow === '6-b' && apiSeq == ApiSequence.ON_UPDATE_INTERIM_REVERSE_QC) || (flow === '6-c' && apiSeq == ApiSequence.ON_UPDATE_INTERIM_LIQUIDATED)) {
                if (apiSeq == ApiSequence.ON_UPDATE_INTERIM_REVERSE_QC) {
                    logger.info(`Comparing Message Ids of /${ApiSequence.UPDATE_REVERSE_QC} and /${ApiSequence.ON_UPDATE_INTERIM_REVERSE_QC}`)
                    if (!_.isEqual(getValue(`${ApiSequence.UPDATE_REVERSE_QC}_msgId`), context.message_id)) {
                        onupdtObj[`${apiSeq}_msgId`] =
                            `Message Ids for  /${ApiSequence.UPDATE_REVERSE_QC} and /${ApiSequence.ON_UPDATE_INTERIM_REVERSE_QC} api should be same`
                    }
                }
                else if (apiSeq == ApiSequence.ON_UPDATE_INTERIM_LIQUIDATED) {
                    logger.info(`Comparing Message Ids of /${ApiSequence.UPDATE_LIQUIDATED} and /${ApiSequence.ON_UPDATE_INTERIM_LIQUIDATED}`)
                    if (!_.isEqual(getValue(`${ApiSequence.UPDATE_LIQUIDATED}_msgId`), context.message_id)) {
                        onupdtObj[`${apiSeq}_msgId`] =
                            `Message Ids for  /${ApiSequence.UPDATE_LIQUIDATED} and /${ApiSequence.ON_UPDATE_INTERIM_LIQUIDATED} api should be same`
                    }
                }
                else if (apiSeq == ApiSequence.ON_UPDATE_REPLACEMENT) {
                    logger.info(`Comparing Message Ids of /${ApiSequence.UPDATE_REPLACEMENT} and /${ApiSequence.ON_UPDATE_REPLACEMENT}`)
                    if (!_.isEqual(getValue(`${ApiSequence.UPDATE_REPLACEMENT}_msgId`), context.message_id)) {
                        onupdtObj[`${apiSeq}_msgId`] =
                            `Message Ids for  /${ApiSequence.UPDATE_REPLACEMENT} and /${ApiSequence.ON_UPDATE_REPLACEMENT} api should be same`
                    }
                }
            } else {
                logger.info(`Adding Message Id /${apiSeq}`)
                if (msgIdSet.has(context.message_id)) {
                    onupdtObj[`${apiSeq}_msgId`] = `Message id should not be same with previous calls`
                }
                msgIdSet.add(context.message_id)
            }
        } catch (error: any) {
            logger.error(`!!Error while checking message id for /${apiSeq}, ${error.stack}`)
        }

        // Checking bap_id and bpp_id format
        const checkBap = checkBppIdOrBapId(context.bap_id)
        const checkBpp = checkBppIdOrBapId(context.bpp_id)
        if (checkBap) Object.assign(onupdtObj, { bap_id: 'context/bap_id should not be a url' })
        if (checkBpp) Object.assign(onupdtObj, { bpp_id: 'context/bpp_id should not be a url' })

        if (!_.isEqual(data.context.domain.split(':')[1], getValue(`domain`))) {
            onupdtObj[`Domain[${data.context.action}]`] = `Domain should be same in each action`
        }

        // Checkinf for valid context object
        try {
            logger.info(`Checking context for /${apiSeq} API`)
            const res: any = checkContext(context, constants.ON_UPDATE)
            if (!res.valid) {
                Object.assign(onupdtObj, res.ERRORS)
            }
        } catch (error: any) {
            logger.error(`!!Some error occurred while checking /${apiSeq} context, ${error.stack}`)
        }

        // Comparing context.city with /search city
        try {
            logger.info(`Comparing city of /${constants.SEARCH} and /${apiSeq}`)
            if (!_.isEqual(searchContext.city, context.city)) {
                onupdtObj.city = `City code mismatch in /${constants.SEARCH} and /${apiSeq}`
            }
        } catch (error: any) {
            logger.error(`!!Error while comparing city in /${constants.SEARCH} and /${apiSeq}, ${error.stack}`)
        }

        // Comparing transaction ID with /select API
        try {
            logger.info(`Comparing transaction Ids of /${constants.SELECT} and /${apiSeq}`)
            if (!_.isEqual(select.context.transaction_id, context.transaction_id)) {
                onupdtObj.txnId = `Transaction Id should be same from /${constants.SELECT} onwards`
            }
        } catch (error: any) {
            logger.info(
                `!!Error while comparing transaction ids for /${constants.SELECT} and /${apiSeq} api, ${error.stack}`,
            )
        }

        //Checking for valid quote breakups in ON_UPDATE
        try {
            logger.info(`Checking for valid quote breakup prices for /${apiSeq}`)
            if (!sumQuoteBreakUp(on_update.quote)) {
                onupdtObj.invldQuotePrices = `Item quote breakup prices for /${apiSeq} should be equal to the net price.`
            }
        } catch (error: any) {
            logger.error(`Error occurred while checking for valid quote breakup in ON_UPDATE`)
        }

        //Check for status (Paid and Unpaid) and transaction_id available
        try {
            logger.info(`Checking if payment status is Paid or Unpaid and availability of transaction_id`)
            const payment = on_update.payment
            const status = payment_status(payment, flow)
            if (!status) {
                onupdtObj['message/order/transaction_id'] = `Transaction_id missing in message/order/payment`
            }
        } catch (error: any) {
            logger.error(`Error while checking the payment status`)
        }

        try {
            // Comparing the providerId with /select providerId
            if (getValue('providerId') != on_update.provider.id) {
                onupdtObj.prvdrId = `provider.id mismatches in /${apiSeq} and /${constants.ON_SELECT}`
            }
            // Comparing the providerLoc with /select providerLoc
            if (on_update.provider.locations[0].id != getValue('providerLoc')) {
                onupdtObj.prvdrLoc = `provider.locations[0].id mismatches in /${constants.ON_SELECT} and /${apiSeq}`
            }
            //Comparing the updated_at timestamp with of context.timestamp
            if (!_.gte(context.timestamp, on_update.updated_at)) {
                onupdtObj[`context/timestamp`] = `context/timestamp should be greater than message/order/updated_at timestamp`
            }
        } catch (error: any) {
            logger.error(`Error while comparing context/timestamp and updated_at timestamp`)
        }

        try {
            // Checking for valid item ids in /on_select
            const itemsList = message.order.items
            let updatedItems: any = getValue('SelectItemList')

            itemsList.forEach((item: any, index: number) => {
                if (!updatedItems?.includes(item.id)) {
                    const key = `inVldItemId[${index}]`
                    onupdtObj[key] = `Invalid Item Id provided in /${apiSeq}: ${item.id}`
                } else if (!updatedItems[item.id] === item.quantity.count) {
                    const key = `inVldItemCount[${index}]`
                    onupdtObj[key] = `Count provide for Item Id in /${apiSeq} should be same as /${constants.UPDATE}`
                }
            })
        } catch (error: any) {
            logger.error(`Error while checking for item IDs for /${apiSeq}, ${error.stack}`)
        }

        //checking for settlement details in payment
        try {
            logger.info(`Checking for settlement_details in /message/order/payment`)
            const settlement_details: any = on_update.payment['@ondc/org/settlement_details']
            if (!settlement_details || settlement_details.length == 0) {
                const key = "payment/settlement_details"
                onupdtObj[key] = "The settlement_details are missing or empty in the payment object"
            }
            settlement_details.map((data: any) => {
                if (data.settlement_type == 'upi' && data.settlement_counterparty == 'seller-app') {
                    if (data.settlement_type == 'upi' && data.settlement_counterparty == 'seller-app') {
                        if (!data.upi_address) {
                            onupdtObj[`message/order.payment`] =
                                `UPI_address is missing in /message/order/payment/@ondc/org/settlement_details`
                        }
                    }

                }
            })
        } catch (error: any) {
            logger.error(`Error while checking the settlement details in /message/order/payment`)
        }
        //checking for settlement details in payment and comparing previous settlement_details
        try {
            logger.info(`Checking for settlement_details in /message/order/payment and comparing previous settlement_details`)
            const settlement_details: any = on_update.payment['@ondc/org/settlement_details']
            if (flow === '6-a') {
                settlementDetatilSet.add(settlement_details[0])
            }
            else {
                let i = 0;
                settlementDetatilSet.forEach((obj1: any) => {
                    const exist = settlement_details.some((obj2: any) => {
                        return _.isEqual(obj1, obj2)

                    });
                    if (!exist) {
                        onupdtObj[`message/order.payment/@ondc/org/settlement_details/${i++}`] = `Missing payment/@ondc/org/settlement_details as compare to the previous calls or not captured correctly i.e. ${JSON.stringify(obj1)}`
                    }
                });
            }
        } catch (error: any) {
            logger.error(`Error while checking the settlement details in /message/order/payment and comparing previous settlement_details`)
        }

        try {
            // Checking for valid item ids inside on_update
            const items = on_update.items
            const itemSet: any = new Set()
            items.forEach((item: any) => {
                if (itemSet.has(JSON.stringify(item))) {
                    onupdtObj[`DuplicateItem[${item.id}]`] = `Duplicate item found in /${apiSeq}`
                } else {
                    itemSet.add(JSON.stringify(item)) // Add the item to the set if it's not already present
                }
            })
            let updateItemList: any = null
            if (flow === '6-a') {
                updateItemList = getValue('SelectItemList')
            } else {
                updateItemList = getValue('updateItemList')
            }
            if (updateItemList) {
                items.forEach((item: any) => {
                    if (!updateItemList.includes(item.id)) {
                        const key = `inVldItemId[${item.id}]`
                        onupdtObj[key] = `Item ID should be present in /${constants.SELECT}  API`
                    } else {
                        quoteItemSet.add(item.id)
                    }
                })
                on_update.quote.breakup.forEach((item: any) => {
                    if (!updateItemList.includes(item['@ondc/org/item_id']) && item['"@ondc/org/title_type"'] === 'item') {
                        const key = `inVldQuoteItemId[${item['@ondc/org/item_id']}]`
                        onupdtObj[key] =
                            `Invalid item ID provided in quote object : ${item['@ondc/org/item_id']}should be present in /${constants.UPDATE} API`
                    }
                })
            }
        } catch (error: any) {
            logger.error(`Error while checking for item IDs for /${apiSeq}, ${error.stack}`)
        }

        try {
              console.log("onConfirmQuote",JSON.stringify(onConfirmQuote));
                    logger.info(`Comparing Quote object for /${constants.ON_CONFIRM} and /${constants.ON_CANCEL}`)
                    const quoteErrors = compareQuoteObjects(onConfirmQuote, on_update.quote, constants.ON_CONFIRM, constants.ON_UPDATE)
                    if (quoteErrors) {
                      let i = 0
                      const len = quoteErrors.length
                      while (i < len) {
                        const key = `quoteErr${i}`
                        onupdtObj[key] = `${quoteErrors[i]}`
                        i++
                      }
                    }
            } catch (error:any) {
              logger.error(`!!Error while Comparing Quote object for /${constants.ON_CANCEL}, ${error.stack} `)
            }

        try {
            // For Delivery Object
            const DELobj = _.filter(on_update.fulfillments, { type: 'Delivery' })
            let del_start_location: any = {}
            if (!DELobj.length) {
                logger.error(`Delivery object is mandatory for ${apiSeq}`)
                const key = `missingDelivery`
                onupdtObj[key] = `Delivery object is mandatory for ${apiSeq}`
            } else {
                // Checking for start object inside Delivery
                if (!_.isEmpty(DELobj[0]?.start)) {
                    const del_obj_start = DELobj[0]?.start
                    if (!_.isEmpty(del_obj_start?.location)) {
                        del_start_location = del_obj_start.location
                        if (!del_start_location.id) {
                            onupdtObj['Delivery.start.location.id'] = `Delivery fulfillment start location id is missing in ${apiSeq}`
                        }
                    }
                    else {
                        onupdtObj['Delivery.start.location'] = `Delivery fulfillment start location object is missing in ${apiSeq}`
                        logger.error(`Delivery fulfillment start location is missing in ${apiSeq}`)
                    }
                } else {
                    onupdtObj['DeliveryFulfillment.start'] = `Delivery fulfillment start object is missing in ${apiSeq}`
                }
            }
        } catch (error: any) {
            logger.error(`Error while checking Fulfillments Delivery Obj in /${apiSeq}, ${error.stack}`)
        }


        // Compare return_request object

        try {
            logger.info(`Checking for the availability of initiated_by code in ${apiSeq}`)
            const fulfillments = on_update.fulfillments
            fulfillments.map((fulfillment: any, iF: number) => {
                if (fulfillment.tags) {
                    const tags = fulfillment.tags
                    tags.map((tag: any, iT: any) => {
                        if (tag.code === 'cancel_request') {
                            const list = tag.list
                            const tags_initiated = list.find((data: any) => data.code === 'initiated_by')
                            if (!tags_initiated) {
                                onupdtObj[`message/order/fulfillments${iF}/tags${iT}`] =
                                    `${apiSeq} must have initiated_by code in fulfillments/tags/list`
                            }
                        }
                        if (tag.code === 'return_request') {
                            const list = tag.list
                            const tags_initiated = list.find((data: any) => data.code === 'initiated_by')
                            if (!tags_initiated) {
                                onupdtObj[`message/order/fulfillments${iF}/tags${iT}`] =
                                    `${apiSeq} must have initiated_by code in fulfillments/tags/list`
                            }
                        }
                    })
                }
            })
        } catch (error: any) {
            logger.error(`Error while checking for the availability of initiated_by in ${apiSeq}`)
        }

        const flowSixAChecks =  (data: any) => {
            try {
                try {
                    const orderState = getValue('orderState')
                    if (data.state != orderState) {
                        onupdtObj[`order.state`] = `order.state shouldn't be changed from ${orderState} to ${data.state} in /${apiSeq}`
                    }
                }
                catch {
                    logger.error(`Error while checkign order.state for the /${apiSeq}`)
                }

                try {
                    setValue(`${ApiSequence.ON_UPDATE_PART_CANCEL}_tmpstmp`, context.timestamp)
                } catch (e: any) {
                    logger.error(`Error while context/timestamp for the /${apiSeq}`)
                }

                try {
                    data.fulfillments.forEach((fulfillment: any) => {
                        if (fulfillment.type === 'Cancel') {
                            setValue('cancelFulfillmentID', fulfillment.id)
                        }
                    })
                } catch (e: any) {
                    logger.error(`Error while setting cancelFulfillmentID in /${apiSeq}`)
                }

                // Checking for quote_trail price and item quote price and adding 
                try {
                    if (sumQuoteBreakUp(on_update.quote)) {
                        const price = Number(on_update.quote.price.value)
                        const priceAtConfirm = Number(getValue('quotePrice'))
                        const cancelFulfillments = _.filter(on_update.fulfillments, { type: 'Cancel' })
                        for (let obj of cancelFulfillments) {
                          const offerItems = on_update.quote.breakup.find(
                            (item: any) => item['@ondc/org/title_type'] === 'offer',
                          )
                          const quoteTrailItems = _.filter(obj.tags, { code: 'quote_trail' })
                          const offerBreakup = onConfirmQuote.breakup
                            .filter((item: any) => item['@ondc/org/title_type'] === 'offer')
                            .map((item: any) => ({
                              id: item['@ondc/org/item_id'],
                              value: parseFloat(item.price?.value),
                            }))
                          console.log('offerBreakupValue', JSON.stringify(offerBreakup))

                          if (offerItems) {
                            const offerType = offerItems?.item?.tags
                              ?.find((tag: any) => tag.code === 'offer')
                              ?.list?.find((entry: any) => entry.code === 'type')?.value
                            if (offerType === 'buyXgetY') {
                              const benefitValue = parseInt(
                                offerItems?.item?.tags
                                  ?.find((tag: any) => tag.code === 'offer')
                                  ?.list?.find((entry: any) => entry.code === 'item_value').value || '0',
                              )
                              if (benefitValue > 0) {
                                const quoteTrailItemOffer = quoteTrailItems.find((trail) =>
                                  trail.list.some((entry: any) => entry.code === 'type' && entry.value === 'offer'),
                                )
                                if (quoteTrailItemOffer) {
                                  offerBreakup.forEach((offer: any) => {
                                    const idEntry = quoteTrailItemOffer.list.find((item: any) => item.code === 'id')
                                    const valueEntry = quoteTrailItemOffer.list.find(
                                      (item: any) => item.code === 'value',
                                    )

                                    const actualId = idEntry?.value
                                    const quoteValue = parseFloat(valueEntry?.value || '0')
                                    const expectedValue = Math.abs(offer.value)

                                    if (actualId !== offer.id) {
                                      onupdtObj['invalidItem'] = `ID : expected '${offer.id}', got '${actualId}'`
                                    } else if (quoteValue < expectedValue) {
                                      onupdtObj['invalidItem'] =
                                        `Value mismatch for ID '${offer.id}': expected ${expectedValue}, got ${quoteValue}`
                                    }
                                  })
                                  const quoteTrailValue = parseInt(
                                    quoteTrailItemOffer.list.find((entry: any) => entry.code === 'value')?.value || '0',
                                  )
                                  console.log('quoteTrailValue', quoteTrailValue, quoteTrailItemOffer)
                                }

                                console.log('offerItem', JSON.stringify(offerItems), quoteTrailItemOffer)
                              }
                              console.log('benefitValue', benefitValue)
                            }
                          }

                          // if()

                          console.log('quoteTrailItems', JSON.stringify(quoteTrailItems))

                          checkQuoteTrail(quoteTrailItems, onupdtObj, selectPriceMap, itemSet)
                        }
                        logger.info(`Checking for quote_trail price and item quote price sum for ${apiSeq}`)
                        checkQuoteTrailSum(cancelFulfillments, price, priceAtConfirm, onupdtObj, ApiSequence.ON_UPDATE)
                    } else {
                        logger.error(
                            `The price breakdown in brakup does not match with the total_price for ${apiSeq} `,
                        )
                    }
                } catch (error: any) {
                    logger.error(
                        `Error occurred while checking for quote_trail price and quote breakup price on /${apiSeq}`,
                    )
                }

                // Checking for quoteTrailItems and adding to quoteTrailItemsSet
                try {
                    let cancelFulfillmentsArray = _.filter(on_update.fulfillments, { type: 'Cancel' })
                    if (cancelFulfillmentsArray.length != 0) {
                        const cancelFulfillments = cancelFulfillmentsArray[0]
                        const quoteTrailItems = cancelFulfillments.tags.filter(
                            (tag: any) => tag.code == 'quote_trail')
                        if (quoteTrailItems.length != 0) {
                            quoteTrailItems.forEach((item: any) => {
                                quoteTrailItemsSet.add(item)
                            });
                        }
                        else {
                            onupdtObj[`message/order.fulfillments/Cancel/tags/quote_trail`] = `Fulfillments/Cancel/tags/quote_trail is missing in ${apiSeq}`
                        }
                    }
                    else {
                        onupdtObj[`message/order.fulfillments/Cancel`] = `Fulfillments/Cancel is missing in ${apiSeq}`
                    }
                } catch (error: any) {
                    logger.error(
                        `Error occurred while checking for quote_trail in /${apiSeq}`,
                    )
                }

                //Reason_id mapping
                try {
                    logger.info(`Reason_id mapping for cancel_request`)
                    const fulfillments = on_update.fulfillments
                    let cancelRequestPresent = false
                    fulfillments.map((fulfillment: any) => {
                        if (fulfillment.type == 'Cancel') {
                            const tags = fulfillment.tags
                            tags.map((tag: any) => {
                                if (tag.code == 'cancel_request') {
                                    cancelRequestPresent = true
                                    const lists = tag.list
                                    let reason_id = ''
                                    lists.map((list: any) => {
                                        if (list.code == 'reason_id') {
                                            reason_id = list.value
                                        }
                                        if (list.code == 'initiated_by' && list.value !== context.bpp_id) {
                                            onupdtObj['invalid_initiated_by'] = `initiated_by should be ${context.bpp_id}`
                                        }
                                        if (
                                            list.code == 'initiated_by' &&
                                            list.value === context.bpp_id &&
                                            !partcancel_return_reasonCodes.includes(reason_id)
                                        ) {
                                            onupdtObj['invalid_partcancel_return_request_reason'] =
                                                `reason code allowed are ${partcancel_return_reasonCodes}`
                                        }
                                    })
                                }
                            })
                        }
                    })
                    if (!cancelRequestPresent) {
                        onupdtObj['cancelRequest'] = `Cancel request is not present in the 'Cancel' fulfillment`
                    }
                } catch (error: any) {
                    logger.error(`!!Error while mapping cancellation_reason_id in ${apiSeq}`)
                }
                // Checking for fulfillmentsItems and adding to fulfillmentsItemsSet
                try {
                    let fulfillmentsArray = JSON.parse(JSON.stringify(on_update.fulfillments))
                    if (fulfillmentsArray.length != 0) {
                        fulfillmentsArray.forEach((ff: any) => {
                            if (ff.type == "Cancel") {
                                fulfillmentsItemsSet.add((ff))
                            }
                        })
                    }
                    else {
                        onupdtObj[`message/order.fulfillments`] = `Fulfillments are missing in ${apiSeq}`
                    }
                } catch (error: any) {
                    logger.error(
                        `Error occurred while checking for fulfillments in /${apiSeq}`,
                    )
                }
            } catch (error: any) {
                logger.error(`Error while checking the flow 6-a checks in /${apiSeq}`)
            }
        }

        try {
            // Checking fulfillment.id, fulfillment.type and tracking
            logger.info('Checking fulfillment.id, fulfillment.type and tracking')
            on_update.fulfillments.forEach((ff: any) => {
                let ffId = ""
                let ffType = ""

                if (!ff.id) {
                    logger.info(`Fulfillment Id must be present `)
                    onupdtObj["ffId"] = `Fulfillment Id must be present`
                }
                if (!ff.type) {
                    logger.info(`Fulfillment Type must be present`)
                    onupdtObj["ffType"] = `Fulfillment Type must be present`
                }

                ffType = ff.type
                ffId = ff.id

                if (ffType != "Return" && ffType != "Cancel") {
                    if (getValue(`${ffId}_tracking`)) {
                        if ((ff.tracking === false || ff.tracking === true)) {
                            if (getValue(`${ffId}_tracking`) != ff.tracking) {
                                logger.info(`Fulfillment Tracking mismatch with the ${constants.ON_SELECT} call`)
                                onupdtObj["ffTracking"] = `Fulfillment Tracking mismatch with the ${constants.ON_SELECT} call`
                            }
                        }
                        else {
                            logger.info(`Tracking must be present for fulfillment ID: ${ff.id} in boolean form`)
                            onupdtObj["ffTracking"] = `Tracking must be present for fulfillment ID: ${ff.id} in boolean form`
                        }
                    }
                }
            })
        } catch (error: any) {
            logger.info(`Error while checking fulfillments id, type and tracking in /${constants.ON_STATUS}`)
        }

        if (flow === '6-b' || flow === '6-c' || flow === "00B") {
            try {
                const timestampOnUpdatePartCancel = getValue(`${ApiSequence.ON_UPDATE_PART_CANCEL}_tmpstmp`)
                const timeDif = timeDiff(context.timestamp, timestampOnUpdatePartCancel)
                if (timeDif <= 0 && (flow !== "00B" || apiSeq !== ApiSequence.ON_UPDATE_REPLACEMENT)) {
                    const key = 'context/timestamp'
                    onupdtObj[key] = `context/timestamp of /${apiSeq} should be greater than /${ApiSequence.ON_UPDATE_PART_CANCEL} context/timestamp`
                }

                const timestamp = getValue('timestamp_')
                if (timestamp && timestamp.length != 0) {
                    const timeDif2 = timeDiff(context.timestamp, timestamp[0])
                    if (timeDif2 <= 0) {
                        const key = 'context/timestamp/'
                        onupdtObj[key] = `context/timestamp of /${apiSeq} should be greater than context/timestamp of /${timestamp[1]}`
                    }
                }
                else {
                    const key = 'context/timestamp/'
                    onupdtObj[key] = `context/timestamp of the previous call is missing or the previous action call itself is missing`
                }
                setValue('timestamp_', [context.timestamp, apiSeq])

            } catch (e: any) {
                logger.error(`Error while context/timestamp for the /${apiSeq}`)
            }

            try {
                const returnFulfillmentArr = _.filter(on_update?.fulfillments, { type: "Return" })
                function getReturnFfIdAndQuantity(returnFulfillment: any): any {
                    const ffId = returnFulfillment?.id
                    if (!ffId) {
                        onupdtObj["returnFulfillmentId"] = `Fulfillment ID is missing for return fulfillment in ${apiSeq}`
                    }
                    let itemQuantity = ""
                    if (!_.isEmpty(returnFulfillment?.tags)) {
                        const returnFulifllmentTags = returnFulfillment?.tags[0]
                        if (!_.isEmpty(returnFulifllmentTags?.list)) {
                            const returnFulifillmentTagsList = returnFulifllmentTags.list
                            const replaceObj = _.find(returnFulifillmentTagsList, { code: "replace" });
                            if (replaceObj && replaceObj.value) {
                                let replaceValue = replaceObj.value;

                                if (replaceValue === "yes" || replaceValue === "no") {
                                    logger.info(`Valid replace value: ${replaceValue} for /${apiSeq}`);
                                }
                            }

                            const itemQuantityArr = _.filter(returnFulifillmentTagsList, { code: "item_quantity" })

                            if (itemQuantityArr.length > 0 && itemQuantityArr[0]?.value) {
                                itemQuantity = itemQuantityArr[0]?.value
                            }
                            else {
                                onupdtObj['returnFulfillment/code/item_quantity'] = `Return fulfillment/tags/list/code/item_quantity is missing in ${apiSeq}`
                            }

                        }
                        else {
                            onupdtObj[`returnFulfillment`] = `Return fulfillment/tags/list is missing in ${apiSeq}`
                        }
                    }
                    else {
                        onupdtObj[`returnFulfillment`] = `Return fulfillment/tags is missing in ${apiSeq}`
                    }
                    return { ffId: ffId, itemQuantity: itemQuantity }
                }
                if (returnFulfillmentArr.length > 0) {
                    let obj = getReturnFfIdAndQuantity(returnFulfillmentArr[0])
                    if (returnFulfillmentArr.length > 1) {
                        const obj2 = getReturnFfIdAndQuantity(returnFulfillmentArr[1])
                        const returnFfIdAndQuantiy: any = getValue(`${ApiSequence.UPDATE_REVERSE_QC}_ffId_itemQuantiy`)
                        if (obj?.ffId == returnFfIdAndQuantiy?.ffId) {
                            obj.ffId = obj2?.ffId
                            obj.itemQuantity = obj2?.itemQuantity
                        }
                    }

                    let updateReturnFfIdAndQuantiy: any = "";
                    if (flow === '6-b') {
                        updateReturnFfIdAndQuantiy = getValue(`${ApiSequence.UPDATE_REVERSE_QC}_ffId_itemQuantiy`)
                    }
                    else {
                        updateReturnFfIdAndQuantiy = getValue(`${ApiSequence.UPDATE_LIQUIDATED}_ffId_itemQuantiy`)
                    }

                    if (!_.isEmpty(updateReturnFfIdAndQuantiy)) {
                        if (obj?.ffId && updateReturnFfIdAndQuantiy?.ffId && obj?.ffId != updateReturnFfIdAndQuantiy?.ffId) {
                            onupdtObj['returnFulfillment/id'] = `Mismatch occur between the fulfillment Id of ${apiSeq} ${obj?.ffId} and fulfillment Id of ${updateReturnFfIdAndQuantiy?.apiSeq} ${updateReturnFfIdAndQuantiy?.ffId}`
                        }
                        if (obj?.itemQuantity && updateReturnFfIdAndQuantiy?.itemQuantity && obj?.itemQuantity != updateReturnFfIdAndQuantiy?.itemQuantity) {
                            onupdtObj['returnFulfillment/itemQuantity'] = `itemQuantity mismatch between the ${apiSeq} and ${updateReturnFfIdAndQuantiy?.apiSeq}`
                        }
                    }
                }
                else {
                    onupdtObj[`returnFulfillment`] = `Return fulfillment is missing in ${apiSeq}`
                }
            } catch (e: any) {
                logger.error(`Error while returnFulfillment for the /${apiSeq}`)
            }

            try {
                if (on_update.state != 'Completed') {
                    onupdtObj[`order.state`] = `Order state should be equal to the 'Completed' in the ${apiSeq}`
                }

            } catch (error: any) {
                logger.error(`Error while checking order.state for the /${apiSeq}`)

            }

        }

        if (flow === '6-a') {
            flowSixAChecks(message.order)
        }
        if (flow === '6-b' || flow === '00B') {

            // Checking for location and time id is there or not in start/end object of return fulfillment
            if (apiSeq == ApiSequence.ON_UPDATE_APPROVAL || apiSeq == ApiSequence.ON_UPDATE_PICKED || apiSeq == ApiSequence.ON_UPDATE_DELIVERED || apiSeq === ApiSequence.ON_UPDATE_REPLACEMENT) {
                try {
                    // For Return Object
                    const RETobj:any = _.filter(on_update.fulfillments, { type: 'Return' })
                    let ret_start_location: any = {}
                    if (!RETobj.length) {
                        logger.error(`Return object is mandatory for ${apiSeq}`)
                        const key = `missingReturn`
                        onupdtObj[key] = `Return object is mandatory for ${apiSeq}`
                    } else {
                        // Checking for end object inside Return
                        if (!_.isEmpty(RETobj[0]?.end)) {
                            const ret_obj_end = RETobj[0]?.end
                            if (_.isEmpty(ret_obj_end?.location)) {
                                onupdtObj['Return.end.location'] = `Return fulfillment end location object is missing in ${apiSeq}`
                                logger.error(`Return fulfillment end location is missing in ${apiSeq}`)
                            }
                            if (apiSeq == ApiSequence.ON_UPDATE_DELIVERED) {
                                if (!_.isEmpty(ret_obj_end?.time)) {
                                    const ret_obj_end_time = ret_obj_end.time
                                    if (!_.isEmpty(ret_obj_end_time?.timestamp)) {
                                        const ret_obj_end_time_timestamp = new Date(ret_obj_end_time.timestamp)
                                        if (!(ret_obj_end_time_timestamp instanceof Date) || ret_obj_end_time_timestamp > new Date(context.timestamp)) {
                                            const key = 'returnFF/end/time/timestamp'
                                            onupdtObj[key] = `end/time/timestamp of return fulfillment should be less than or equal to context/timestamp of ${apiSeq}`
                                        }
                                    }
                                    else {
                                        const key = 'returnFF/end/time/timestamp'
                                        onupdtObj[key] = `end/time/timestamp of return fulfillment is missing`
                                    }

                                }
                                else {
                                    const key = 'returnFF/end/time/timestamp'
                                    onupdtObj[key] = `returnFF/end/time/timestamp of return fulfillment is missing`
                                }
                            }
                        }
                        else {
                            onupdtObj['ReturnFulfillment.end'] = `Return fulfillment end object is missing in ${apiSeq}`
                        }

                        // Checking for start object inside Return
                        if (!_.isEmpty(RETobj[0]?.start)) {
                            const ret_obj_start = RETobj[0]?.start
                            if (!_.isEmpty(ret_obj_start?.location)) {
                                ret_start_location = ret_obj_start.location
                                if (ret_start_location.id) {
                                    onupdtObj['Return.start.location.id'] = `Return fulfillment start location id is not required in ${apiSeq}`
                                }
                            }
                            else {
                                onupdtObj['Return.start.location'] = `Return fulfillment start location object is missing in ${apiSeq}`
                                logger.error(`Return fulfillment start location is missing in ${apiSeq}`)
                            }
                            if (!_.isEmpty(ret_obj_start?.time)) {
                                const ret_obj_start_time = ret_obj_start.time
                                if (apiSeq == ApiSequence.ON_UPDATE_APPROVAL) {
                                    if (!_.isEmpty(ret_obj_start_time?.range)) {
                                        const ret_obj_start_time_range = ret_obj_start_time?.range
                                        const startTime: any = new Date(ret_obj_start_time_range?.start)
                                        const endTime: any = new Date(ret_obj_start_time_range?.end)

                                        if (!(startTime instanceof Date) || !(endTime instanceof Date)) {

                                            if (!(startTime instanceof Date)) {
                                                const key = 'returnFF/start/time/range/start'
                                                onupdtObj[key] = `start/time/range/start of /${apiSeq} should have valid time format for return fulfillment`

                                            }
                                            if (!(endTime instanceof Date)) {
                                                const key = 'returnFF/start/time/range/end'
                                                onupdtObj[key] = `end/time/range/end of /${apiSeq} should have valid time format for return fulfillment`

                                            }
                                        }
                                        else {
                                            const timeDifStart = timeDiff(ret_obj_start_time_range?.start, context.timestamp)
                                            if (timeDifStart < 0) {
                                                const key = 'returnFF/start/time/range/start'
                                                onupdtObj[key] = `start/time/range/start time of return fulfillment should be greater than context/timestamp of ${apiSeq}`
                                            }

                                            const timeDifEnd = timeDiff(ret_obj_start_time_range?.end, context.timestamp)
                                            if (timeDifEnd <= 0) {
                                                const key = 'returnFF/start/time/range/end'
                                                onupdtObj[key] = `start/time/range/end time of return fulfillment should be greater than context/timestamp of ${apiSeq}`
                                            }
                                            setValue(`${ApiSequence.ON_UPDATE_APPROVAL}`, { start: startTime, end: endTime })
                                            if (startTime >= endTime) {
                                                const key = 'returnFF/start/time/range/'
                                                onupdtObj[key] = `start/time/range/start should not be greater than or equal to start/time/range/end in return fulfillment`
                                            }
                                        }
                                    }
                                    else {
                                        onupdtObj['Return.start.time.range'] = `Return fulfillment start time range object is missing in ${apiSeq}`
                                    }
                                }
                                else {
                                    if (!_.isEmpty(ret_obj_start_time?.timestamp)) {
                                        const ret_obj_start_time_timestamp: any = new Date(ret_obj_start_time.timestamp)
                                        const onUpdateApprovalTimeRanges = getValue(`${ApiSequence.ON_UPDATE_APPROVAL}`)
                                        let startTime: any = ""
                                        let endTime: any = ""
                                        if (!isEmpty(onUpdateApprovalTimeRanges)) {
                                            const { start, end }: any = onUpdateApprovalTimeRanges
                                            startTime = start
                                            endTime = end
                                        }
                                        if (!(ret_obj_start_time_timestamp instanceof Date)) {
                                            const key = 'returnFF/start/time/timestamp'
                                            onupdtObj[key] = `start/time/timestamp of return fulfillment should have valid time format`
                                        }
                                        else {
                                            if ((startTime instanceof Date) && (endTime instanceof Date) && (ret_obj_start_time_timestamp < startTime || ret_obj_start_time_timestamp > endTime)) {
                                                const key = 'returnFF/start/time/timestamp'
                                                onupdtObj[key] = `start/time/timestamp of return fulfillment should be in the valid time/range as in ${ApiSequence.ON_UPDATE_APPROVAL}`
                                            }
                                            if (ret_obj_start_time_timestamp > context.timestamp) {
                                                const key = 'returnFF/start/time/timestamp/'
                                                onupdtObj[key] = `start/time/timestamp of return fulfillment should be less than context/timestamp of ${apiSeq}`
                                            }
                                        }
                                    }
                                    else {
                                        const key = 'returnFF/start/time/timestamp'
                                        onupdtObj[key] = `start/time/timestamp of return fulfillment is missing`
                                    }
                                }
                            }
                            else {
                                onupdtObj['Return.start.time'] = `Return fulfillment start time object is missing in ${apiSeq}`
                            }
                        } else {
                            onupdtObj['ReturnFulfillment.start'] = `Return fulfillment start object is missing in ${apiSeq}`
                        }                         
                    }
                } catch (error: any) {
                    logger.error(`Error while checking Fulfillments Return Obj in /${apiSeq}, ${error.stack}`)
                }
            }

            // Checking for quote_trail price and item quote price
            try {
                if (sumQuoteBreakUp(on_update.quote)) {
                    const price = Number(on_update.quote.price.value)
                    const priceAtConfirm = Number(getValue('quotePrice'))
                    const returnCancelFulfillments = _.filter(on_update.fulfillments, (item) =>
                        item.type === 'Return' || item.type === 'Cancel'
                    )
                    if (
                        apiSeq == ApiSequence.ON_UPDATE_PICKED || apiSeq == ApiSequence.ON_UPDATE_DELIVERED
                    ) {
                        const offerItems = on_update.quote.breakup.find(
                            (item: any) => item['@ondc/org/title_type'] === 'offer',
                          )
                          const quoteTrailItems = _.filter(returnCancelFulfillments[0].tags, { code: 'quote_trail' })
                          const offerBreakup = onConfirmQuote.breakup
                            .filter((item: any) => item['@ondc/org/title_type'] === 'offer')
                            .map((item: any) => ({
                              id: item['@ondc/org/item_id'],
                              value: parseFloat(item.price?.value),
                            }))
                          console.log('offerBreakupValue', JSON.stringify(offerBreakup))

                          if (offerItems) {
                            const offerType = offerItems?.item?.tags
                              ?.find((tag: any) => tag.code === 'offer')
                              ?.list?.find((entry: any) => entry.code === 'type')?.value
                            if (offerType === 'buyXgetY') {
                              const benefitValue = parseInt(
                                offerItems?.item?.tags
                                  ?.find((tag: any) => tag.code === 'offer')
                                  ?.list?.find((entry: any) => entry.code === 'item_value').value || '0',
                              )
                              if (benefitValue > 0) {
                                const quoteTrailItemOffer = quoteTrailItems.find((trail) =>
                                  trail.list.some((entry: any) => entry.code === 'type' && entry.value === 'offer'),
                                )
                                if (quoteTrailItemOffer) {
                                  offerBreakup.forEach((offer: any) => {
                                    const idEntry = quoteTrailItemOffer.list.find((item: any) => item.code === 'id')
                                    const valueEntry = quoteTrailItemOffer.list.find(
                                      (item: any) => item.code === 'value',
                                    )

                                    const actualId = idEntry?.value
                                    const quoteValue = parseFloat(valueEntry?.value || '0')
                                    const expectedValue = Math.abs(offer.value)

                                    if (actualId !== offer.id) {
                                      onupdtObj['invalidItem'] = `ID : expected '${offer.id}', got '${actualId}'`
                                    } else if (quoteValue < expectedValue) {
                                      onupdtObj['invalidItem'] =
                                        `Value mismatch for ID '${offer.id}': expected ${expectedValue}, got ${quoteValue}`
                                    }
                                  })
                                  const quoteTrailValue = parseInt(
                                    quoteTrailItemOffer.list.find((entry: any) => entry.code === 'value')?.value || '0',
                                  )
                                  console.log('quoteTrailValue', quoteTrailValue, quoteTrailItemOffer)
                                }

                                console.log('offerItem', JSON.stringify(offerItems), quoteTrailItemOffer)
                              }
                              console.log('benefitValue', benefitValue)
                            }
                          }

                          // if()

                          console.log('quoteTrailItems', JSON.stringify(quoteTrailItems))

                          checkQuoteTrail(quoteTrailItems, onupdtObj, selectPriceMap, itemSet)
                        logger.info(`Checking for quote_trail price and item quote price sum for ${apiSeq}`)
                        checkQuoteTrailSum(returnCancelFulfillments, price, priceAtConfirm, onupdtObj, ApiSequence.ON_UPDATE)
                    }
                } else {
                    logger.error(`The price breakdown in brakup does not match with the total_price for ${apiSeq} `)
                }
            } catch (error: any) {
                logger.error(
                    `Error occuerred while checking for quote_trail price and quote breakup price on /${apiSeq}`,
                )
            }

            // Checking for quoteTrailItems and adding to quoteTrailItemsSet and comparing with the previous calls
            try {
              if (flow !== '00B') {
                let cancelFulfillmentsArray = _.filter(on_update.fulfillments, { type: 'Cancel' })
                if (cancelFulfillmentsArray.length != 0) {
                  const cancelFulfillments = cancelFulfillmentsArray[0]
                  const quoteTrailItems = cancelFulfillments.tags.filter((tag: any) => tag.code == 'quote_trail')
                  if (quoteTrailItems.length != 0) {
                    if (apiSeq == ApiSequence.ON_UPDATE_INTERIM_REVERSE_QC) {
                      quoteTrailItems.forEach((item: any) => {
                        quoteTrailItemsSet.add(item)
                      })
                    }

                    quoteTrailItemsSet.forEach((obj1: any) => {
                      const exist = quoteTrailItems.some((obj2: any) => {
                        return _.isEqual(obj1, obj2)
                      })
                      if (!exist) {
                        onupdtObj[`message/order.fulfillments/Cancel/tags/quote_trail`] =
                          'Missing fulfillments/Cancel/tags/quote_trail as compare to the previous calls'
                      }
                    })
                  } else {
                    onupdtObj[`message/ordobj1er.fulfillments/Cancel/tags/quote_trail`] =
                      `Fulfillments/Cancel/tags/quote_trail is missing in ${apiSeq}`
                  }
                } else {
                  onupdtObj[`message/order.fulfillments/Cancel`] = `Fulfillments/Cancel is missing in ${apiSeq}`
                }
              }
            } catch (error: any) {
              logger.error(`Error occurred while checking for quote_trail in /${apiSeq}`)
            }

            //Reason_id mapping
            try {
                logger.info(`Reason_id mapping for cancel_request`)
                const fulfillments = on_update.fulfillments
                fulfillments.map((fulfillment: any) => {
                    if (fulfillment.type !== 'Return') return

                    const tags = fulfillment.tags
                    let returnRequestPresent = false
                    tags.forEach((tag: any) => {
                        if (tag.code !== 'return_request') return
                        returnRequestPresent = true
                        const lists = tag.list
                        let reason_id = 'not_found'

                        lists.forEach((list: any) => {
                            if (list.code === 'reason_id') {
                                reason_id = list.value
                            }
                            if (list.code === 'initiated_by') {
                                if (list.value !== context.bap_id) {
                                    onupdtObj['invalid_initiated_by'] = `initiated_by should be ${context.bap_id}`
                                }

                                if (
                                    reason_id !== 'not_found' &&
                                    list.value === context.bap_id &&
                                    !return_request_reasonCodes.includes(reason_id)
                                ) {
                                    onupdtObj['invalid_return_request_reason'] = `reason code allowed are ${return_request_reasonCodes}`
                                }
                            }
                        })
                    })
                    if (!returnRequestPresent) {
                        onupdtObj['returnRequest'] = `return request is not present in the 'Return' fulfillment`
                    }
                })
            } catch (error: any) {
                logger.error(`!!Error while mapping cancellation_reason_id in ${apiSeq}`)
            }
        }
        if (flow === '6-c') {
            try {
                logger.info(`Reason_id mapping for cancel_request`)
                const fulfillments = on_update.fulfillments
                fulfillments.map((fulfillment: any) => {
                    if (fulfillment.type !== 'Return') return

                    const tags = fulfillment.tags
                    let returnRejectedRequestPresent = false
                    tags.forEach((tag: any) => {
                        if (tag.code !== 'return_request') return
                        returnRejectedRequestPresent = true
                        const lists = tag.list
                        let reason_id = ''

                        lists.forEach((list: any) => {
                            if (list.code === 'reason_id') {
                                reason_id = list.value
                            }
                            if (list.code === 'initiated_by') {
                                if (list.value !== context.bap_id) {
                                    onupdtObj['invalid_initiated_by'] = `initiated_by should be ${context.bap_id}`
                                }
                                if (
                                    reason_id &&
                                    list.value === context.bap_id &&
                                    !return_rejected_request_reasonCodes.includes(reason_id)
                                ) {
                                    onupdtObj['invalid_return_rejected_request_reasonCodes'] =
                                        `reason code allowed are ${return_rejected_request_reasonCodes}`
                                }
                            }
                        })
                    })
                    if (!returnRejectedRequestPresent) {
                        onupdtObj['returnRejectedRequest'] = `return rejected request is not present in the 'Return' fulfillment`
                    }
                })
            } catch (error: any) {
                logger.error(`!!Error while mapping cancellation_reason_id in ${apiSeq}`)
            }

            // Checking for quote_trail price and item quote price
            try {
                if (sumQuoteBreakUp(on_update.quote)) {
                    const price = Number(on_update.quote.price.value)
                    const priceAtConfirm = Number(getValue('quotePrice'))
                    const returnCancelFulfillments = _.filter(on_update.fulfillments, (item) =>
                        item.type === 'Return' || item.type === 'Cancel')
                    if (apiSeq == ApiSequence.ON_UPDATE_LIQUIDATED) {
                        logger.info(`Checking for quote_trail price and item quote price sum for ${apiSeq}`)
                        checkQuoteTrailSum(returnCancelFulfillments, price, priceAtConfirm, onupdtObj, ApiSequence.ON_UPDATE)
                    }
                } else {
                    logger.error(`The price breakdown in brakup does not match with the total_price for ${apiSeq} `)
                }
            } catch (error: any) {
                logger.error(
                    `Error occuerred while checking for quote_trail price and quote breakup price on /${apiSeq}`,
                )
            }

            // Checking for quoteTrailItems and adding to quoteTrailItemsSet and comparing with the previous calls
            try {
                let cancelFulfillmentsArray = _.filter(on_update.fulfillments, { type: 'Cancel' })
                if (cancelFulfillmentsArray.length != 0) {
                    const cancelFulfillments = cancelFulfillmentsArray[0]
                    const quoteTrailItems = cancelFulfillments.tags.filter(
                        (tag: any) => tag.code == 'quote_trail')
                    if (quoteTrailItems.length != 0) {
                        if (apiSeq == ApiSequence.ON_UPDATE_LIQUIDATED) {
                            quoteTrailItems.forEach((item: any) => {
                                quoteTrailItemsSet.add(item)
                            });
                        }

                        quoteTrailItemsSet.forEach((obj1: any) => {
                            const exist = quoteTrailItems.some((obj2: any) => {
                                return _.isEqual(obj1, obj2)
                            });
                            if (!exist) {
                                onupdtObj[`message/order.fulfillments/Cancel/tags/quote_trail`] = "Missing fulfillments/Cancel/tags/quote_trail as compare to the previous calls"
                            }
                        });
                    }
                    else {
                        onupdtObj[`message/order.fulfillments/Cancel/tags/quote_trail`] = `Fulfillments/Cancel/tags/quote_trail is missing in ${apiSeq}`
                    }
                }
                else {
                    onupdtObj[`message/order.fulfillments/Cancel`] = `Fulfillments/Cancel is missing in ${apiSeq}`
                }

            } catch (error: any) {
                logger.error(
                    `Error occurred while checking for quote_trail in /${apiSeq}`,
                )
            }
        }
        if (apiSeq === ApiSequence.ON_UPDATE_REPLACEMENT || flow === '00B') {
          try {
            const RETobj: any = _.filter(on_update.fulfillments, { type: 'Return' })
            console.log("RETobj",RETobj);
            
            const returnFulfillmentState = RETobj[0].state.descriptor.code
            console.log("returnFulfillmentState",returnFulfillmentState);
            
            const updateReplaceValue = getValue('update_replace_value')
            console.log("updateReplaceValue",updateReplaceValue);
            
            if (updateReplaceValue != null) {
              if (apiSeq === ApiSequence.ON_UPDATE_REPLACEMENT) {
                if (updateReplaceValue === 'yes') {
                  const returnRequestTag = RETobj[0].tags.find((tag: any) => tag.code === 'return_request')
                  console.log("returnRequestTag",returnRequestTag);
                  

                  if (returnFulfillmentState !== 'Return_Picked') {
                    onupdtObj['replacement'] =
                      `Invalid fulfillment state for ${flow} as fulfillment/state/descriptor/code should be 'Return_Picked'`
                  }

                  if (returnRequestTag) {
                    const replaceEntry = returnRequestTag.list.find((entry: any) => entry.code === 'replace')
                    const replaceRequestEntry = RETobj[0].tags.find((entry: any) => entry.code === 'replace_request')

                    // Validate 'replace' field
                    if (!replaceEntry) {
                      onupdtObj['replace_check'] = `'replace' is missing inside return_request tag`
                    } else if (replaceEntry.value !== updateReplaceValue) {
                      onupdtObj['replace_check'] =
                        `'replace' value mismatch inside return_request: expected '${updateReplaceValue}', found '${replaceEntry.value}'`
                    }

                    // Validate 'replace_request' field and corresponding fulfillment
                    if (!replaceRequestEntry) {
                      onupdtObj['replace_request'] = `'replace_request' is missing inside replacement fulfillment`
                    } else {
                      const replaceFulfillmentId = replaceRequestEntry.list.find(
                        (item: any) => item.code === 'id',
                      ).value
                      console.log("replaceFulfillmentId",replaceFulfillmentId,JSON.stringify(replaceRequestEntry));
                      
                      const deliveryFulfillment = on_update.fulfillments.find((f: any) => f.id === replaceFulfillmentId)
                      console.log("deliveryFulfillment",deliveryFulfillment);
                      
                      

                      if (!deliveryFulfillment) {
                        onupdtObj['replace_request'] =
                          `'replace_request' ID '${replaceFulfillmentId}' not found in fulfillments list`
                      } else if (deliveryFulfillment.type !== 'Delivery') {
                        onupdtObj['replace_request'] =
                          `'replace_request' ID '${replaceFulfillmentId}' is not of type 'Delivery'`
                      }
                      try {
                        setValue(`replacementFulfillment`,deliveryFulfillment)
                        if (!deliveryFulfillment['@ondc/org/TAT']) {
                          onupdtObj[`message.order.fulfillments[${deliveryFulfillment.id}]`] =
                            `'TAT' must be provided in message/order/fulfillments`
                        }
                        // Comparing on_confirm delivery fulfillment with on_update replace fulfillment
                        const ffDesc = deliveryFulfillment.state.descriptor

                        const ffStateCheck = ffDesc.hasOwnProperty('code') ? ffDesc.code === 'Pending' : false
                        setValue(`ffIdPrecancel`, ffDesc?.code)
                        if (!ffStateCheck) {
                          const key = `ffState:fulfillment[id]:${deliveryFulfillment.id}`
                          onupdtObj[key] = `default fulfillments state is missing in /${constants.ON_UPDATE_REPLACEMENT}`
                        }

                        if (!deliveryFulfillment.start || !deliveryFulfillment.end) {
                          onupdtObj.ffstartend = `fulfillments start and end locations are mandatory for fulfillment id: ${deliveryFulfillment.id}`
                        }

                        try {
                          if (
                            !compareCoordinates(deliveryFulfillment.start.location.gps, getValue('providerGps'))
                          ) {
                            onupdtObj.sellerGpsErr = `store gps location /fulfillments/:${deliveryFulfillment.id}/start/location/gps can't change`
                          }
                        } catch (error: any) {
                          logger.error(
                            `!!Error while checking store location in /${constants.ON_UPDATE_REPLACEMENT}, ${error.stack}`,
                          )
                        }

                        try {
                          if (!getValue('providerName')) {
                            onupdtObj.sellerNameErr = `Invalid store name inside fulfillments in /${constants.ON_UPDATE_REPLACEMENT}`
                          } else if (
                            !_.isEqual(
                              deliveryFulfillment.start.location.descriptor.name,
                              getValue('providerName'),
                            )
                          ) {
                            onupdtObj.sellerNameErr = `store name  /fulfillments/start/location/descriptor/name can't change with fulfillment id: ${deliveryFulfillment.id}`
                          }
                        } catch (error: any) {
                          logger.error(`!!Error while checking store name in /${constants.ON_CONFIRM}`)
                        }

                        if (!_.isEqual(deliveryFulfillment.end.location.gps, getValue('buyerGps'))) {
                          onupdtObj.buyerGpsErr = `fulfillments.end.location gps with id ${deliveryFulfillment.id} is not matching with gps in /on_conifrm`
                        }

                        if (
                          !_.isEqual(deliveryFulfillment.end.location.address.area_code, getValue('buyerAddr'))
                        ) {
                          onupdtObj.gpsErr = `fulfillments.end.location.address.area_code with id ${deliveryFulfillment.id} is not matching with area_code in /on_confirm`
                        }
                      } catch (error:any) {
                        logger.error(`Error while comparing fulfillment obj ${apiSeq.ON_UPDATE_REPLACEMENT} and ${apiSeq.ON_CONFIRM}`,error.stack)
                      }
                    }
                  } else {
                    onupdtObj['replace_check'] = `'return_request' tag is missing in tags`
                  }
                } else {
                  onupdtObj['rplcmnt'] =
                    `Replacement not possible as expected value for replace is yes but got ${updateReplaceValue}`
                }
              }
            }
          } catch (error:any) {
            console.error(`!!Some error occurred while checking /${apiSeq} API`, error.stack)
          }
        }
        return onupdtObj
    } catch (error: any) {
        logger.error(`!!Some error occurred while checking /${apiSeq} API`, error.stack)
    }
}