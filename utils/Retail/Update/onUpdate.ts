import _ from 'lodash'
import { logger } from '../../../shared/logger'
import constants, { ApiSequence } from '../../../constants'
import {
  validateSchema,
  isObjectEmpty,
  checkBppIdOrBapId,
  checkContext,
  sumQuoteBreakUp,
  payment_status,
  checkQuoteTrailSum,
} from '../../../utils'
import { getValue, setValue } from '../../../shared/dao'
import {
  partcancel_return_reasonCodes,
  return_rejected_request_reasonCodes,
  return_request_reasonCodes,
} from '../../../constants/reasonCode'
export const checkOnUpdate = (data: any, msgIdSet: any, apiSeq: any, settlementDetatilSet: any, flow: any) => {
  const onupdtObj: any = {}
  const quoteItemSet: any = new Set()
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
    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.ON_UPDATE, data)

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
      const status = payment_status(payment)
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
      settlement_details.map((data: any) => {
        if (data.settlement_type == 'upi' && data.settlement_counterparty == 'seller-app') {
          if (data.settlement_type == 'upi' && data.settlement_counterparty == 'seller-app') {
            if (!data.upi_address) {
              onupdtObj[`message/order.payment`] =
                `UPI_address is missing in /message/order/payment/@ondc/org/settlement_details`
            }
          }
          if (flow === '6-a') {
            settlementDetatilSet.add(settlement_details[0])
          }
          else {
            settlementDetatilSet.forEach((obj1: any) => {
              const exist = settlement_details.some((obj2: any) => {
                return _.isEqual(obj1, obj2)

              });
              if (!exist) {
                onupdtObj[`message/order.payment/@ondc/org/settlement_details`] = "Missing payment/@ondc/org/settlement_details as compare to the previous calls"
              }
            });
          }
        }
      })
    } catch (error: any) {
      logger.error(`Error while checking the settlement details in /message/order/payment`)
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

    // Compare return_request object

    if (flow === '6-b') {
      // Checking for quote_trail price and item quote price
      try {
        if (sumQuoteBreakUp(on_update.quote)) {
          const price = Number(on_update.quote.price.value)
          const priceAtConfirm = Number(getValue('quotePrice'))
          const returnFulfillments = _.filter(on_update.fulfillments, { type: 'Return' })
          if (
            returnFulfillments[0].state.descriptor.code === 'Return_Picked' ||
            returnFulfillments[0].state.descriptor.code === 'Return_Delivered'
          ) {
            logger.info(`Checking for quote_trail price and item quote price sum for ${apiSeq}`)
            checkQuoteTrailSum(returnFulfillments, price, priceAtConfirm, onupdtObj)
          }
        } else {
          logger.error(`The price breakdown in brakup does not match with the total_price for ${apiSeq} `)
        }
      } catch (error: any) {
        logger.error(
          `Error occuerred while checking for quote_trail price and quote breakup price on /${apiSeq}`,
        )
      }

      //Reason_id mapping
      try {
        logger.info(`Reason_id mapping for cancel_request`)
        const fulfillments = on_update.fulfillments
        fulfillments.map((fulfillment: any) => {
          if (fulfillment.type !== 'Return') return

          const tags = fulfillment.tags
          tags.forEach((tag: any) => {
            if (tag.code !== 'return_request') return

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
          tags.forEach((tag: any) => {
            if (tag.code !== 'return_request') return

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
        })
      } catch (error: any) {
        logger.error(`!!Error while mapping cancellation_reason_id in ${apiSeq}`)
      }

      // Checking for quote_trail price and item quote price
      try {
        if (sumQuoteBreakUp(on_update.quote)) {
          const price = Number(on_update.quote.price.value)
          const priceAtConfirm = Number(getValue('quotePrice'))
          const returnFulfillments = _.filter(on_update.fulfillments, { type: 'Return' })
          if (returnFulfillments[0].state.descriptor.code === 'Liquidated') {
            logger.info(`Checking for quote_trail price and item quote price sum for ${apiSeq}`)
            checkQuoteTrailSum(returnFulfillments, price, priceAtConfirm, onupdtObj)
          }
        } else {
          logger.error(`The price breakdown in brakup does not match with the total_price for ${apiSeq} `)
        }
      } catch (error: any) {
        logger.error(
          `Error occuerred while checking for quote_trail price and quote breakup price on /${apiSeq}`,
        )
      }
    }
    try {
      logger.info(`Checking for the availability of initiated_by code in ${apiSeq}`)
      const fulfillments = on_update.fulfillments
      fulfillments.map((fulfillment: any) => {
        if (fulfillment.tags) {
          const tags = fulfillment.tags
          tags.map((tag: any) => {
            if (tag.code === 'cancel_request') {
              const list = tag.list
              const tags_initiated = list.find((data: any) => data.code === 'initiated_by')
              if (!tags_initiated) {
                onupdtObj[`message/order/fulfillments/tags`] =
                  `${apiSeq} must have initiated_by code in fulfillments/tags/list`
              }
            }
            if (tag.code === 'return_request') {
              const list = tag.list
              const tags_initiated = list.find((data: any) => data.code === 'initiated_by')
              if (!tags_initiated) {
                onupdtObj[`message/order/fulfillments/tags`] =
                  `${apiSeq} must have initiated_by code in fulfillments/tags/list`
              }
            }
          })
        }
      })
    } catch (error: any) {
      logger.error(`Error while checking for the availability of initiated_by in ${apiSeq}`)
    }

    const flowSixAChecks = (data: any) => {
      try {
        try {
          data.fulfillments.forEach((fulfillment: any) => {
            if (fulfillment.type === 'Cancel') {
              setValue('cancelFulfillmentID', fulfillment.id)
            }
          })
        } catch (e: any) {
          logger.error(`Error while setting cancelFulfillmentID in /${apiSeq}`)
        }

        // Checking for quote_trail price and item quote price
        try {
          if (sumQuoteBreakUp(on_update.quote)) {
            const price = Number(on_update.quote.price.value)
            const priceAtConfirm = Number(getValue('quotePrice'))
            const cancelFulfillments = _.filter(on_update.fulfillments, { type: 'Cancel' })
            logger.info(`Checking for quote_trail price and item quote price sum for ${apiSeq}`)
            checkQuoteTrailSum(cancelFulfillments, price, priceAtConfirm, onupdtObj)
          } else {
            logger.error(
              `The price breakdown in brakup does not match with the total_price for ${apiSeq} `,
            )
          }
        } catch (error: any) {
          logger.error(
            `Error occuerred while checking for quote_trail price and quote breakup price on /${apiSeq}`,
          )
        }

        //Reason_id mapping
        try {
          logger.info(`Reason_id mapping for cancel_request`)
          const fulfillments = on_update.fulfillments
          fulfillments.map((fulfillment: any) => {
            if (fulfillment.type == 'Cancel') {
              const tags = fulfillment.tags
              tags.map((tag: any) => {
                if (tag.code == 'cancel_request') {
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
        } catch (error: any) {
          logger.error(`!!Error while mapping cancellation_reason_id in ${apiSeq}`)
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

    if (flow === '6-a') {
      flowSixAChecks(message.order)
    }

    return onupdtObj
  } catch (error: any) {
    logger.error(`!!Some error occurred while checking /${apiSeq} API`, error.stack)
  }
}