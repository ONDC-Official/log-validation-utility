import _ from 'lodash'
import { logger } from '../../../shared/logger'
import constants, { ApiSequence } from '../../../constants'
import {
  validateSchema,
  isObjectEmpty,
  checkBppIdOrBapId,
  checkContext,
  sumQuoteBreakUp,
  mapCancellationID,
  payment_status,
  checkQuoteTrailSum,
  checkQuoteTrail,
} from '../../../utils'
import { getValue, setValue } from '../../../shared/dao'

export const checkOnUpdate = (data: any) => {
  const onupdtObj: any = {}
  const flow = getValue('flow')
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
      logger.info(`Checking context for /${constants.ON_UPDATE} API`)
      const res: any = checkContext(context, constants.ON_UPDATE)
      if (!res.valid) {
        Object.assign(onupdtObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.ON_UPDATE} context, ${error.stack}`)
    }

    // Comparing context.city with /search city
    try {
      logger.info(`Comparing city of /${constants.SEARCH} and /${constants.ON_UPDATE}`)
      if (!_.isEqual(searchContext.city, context.city)) {
        onupdtObj.city = `City code mismatch in /${constants.SEARCH} and /${constants.ON_UPDATE}`
      }
    } catch (error: any) {
      logger.error(`!!Error while comparing city in /${constants.SEARCH} and /${constants.ON_UPDATE}, ${error.stack}`)
    }

    // Comaring Timestamp of /update with /init API
    try {
      logger.info(`Comparing timestamp of /${constants.ON_INIT} and /${constants.ON_UPDATE}`)
      if (_.gte(getValue('tmpstmp'), context.timestamp)) {
        onupdtObj.tmpstmp = `Timestamp for /${constants.ON_INIT} api cannot be greater than or equal to /${constants.ON_UPDATE} api`
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.error(
        `!!Error while comparing timestamp for /${constants.ON_INIT} and /${constants.ON_UPDATE} api, ${error.stack}`,
      )
    }

    // Comparing transaction ID with /select API
    try {
      logger.info(`Comparing transaction Ids of /${constants.SELECT} and /${constants.ON_UPDATE}`)
      if (!_.isEqual(select.context.transaction_id, context.transaction_id)) {
        onupdtObj.txnId = `Transaction Id should be same from /${constants.SELECT} onwards`
      }
    } catch (error: any) {
      logger.info(
        `!!Error while comparing transaction ids for /${constants.SELECT} and /${constants.ON_UPDATE} api, ${error.stack}`,
      )
    }

    //Checking for valid quote breakups in ON_UPDATE
    try {
      logger.info(`Checking for valid quote breakup prices for /${constants.ON_UPDATE}`)
      if (!sumQuoteBreakUp(on_update.quote)) {
        onupdtObj.invldQuotePrices = `Item quote breakup prices for /${constants.ON_UPDATE} shoulb be equal to the net price.`
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
        onupdtObj.prvdrId = `provider.id mismatches in /${constants.ON_UPDATE} and /${constants.ON_SELECT}`
      }
      // Comparing the providerLoc with /select providerLoc
      if (on_update.provider.locations[0].id != getValue('providerLoc')) {
        onupdtObj.prvdrLoc = `provider.locations[0].id mismatches in /${constants.ON_SELECT} and /${constants.ON_UPDATE}`
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
          onupdtObj[key] = `Invalid Item Id provided in /${constants.ON_UPDATE}: ${item.id}`
        } else if (!updatedItems[item.id] === item.quantity.count) {
          const key = `inVldItemCount[${index}]`
          onupdtObj[key] = `Count provide for Item Id in /${constants.ON_UPDATE} should be same as /${constants.UPDATE}`
        }
      })
    } catch (error: any) {
      logger.error(`Error while checking for item IDs for /${constants.ON_UPDATE}, ${error.stack}`)
    }
    //checking for settlement details in payment
    try {
      logger.info(`Checking for settlement_details in /message/order/payment`)
      const settlement_details: any = on_update.payment['@ondc/org/settlement_details']
      settlement_details.map((data: any) => {
        if (data.settlement_type == 'upi') {
          if (!data.upi_address) {
            onupdtObj[`message/order.payment`] =
              `UPI_address is missing in /message/order/payment/@ondc/org/settlement_details`
          }
        }
      })
    } catch (error: any) {
      logger.error(`Error while checking the settlement details in /message/order/payment`)
    }

    if (flow === '6-a') {
      // Checking for quote_trail price and item quote price
      try {
        if (sumQuoteBreakUp(on_update.quote)) {
          const price = Number(on_update.quote.price.value)
          const priceAtConfirm = Number(getValue('quotePrice'))
          const cancelFulfillments = _.filter(on_update.fulfillments, { type: 'Cancel' })
          logger.info(`Checking for quote_trail price and item quote price sum for ${constants.ON_UPDATE}`)
          checkQuoteTrailSum(cancelFulfillments, price, priceAtConfirm, onupdtObj)
        } else {
          logger.error(`The price breakdown in brakup does not match with the total_price for ${constants.ON_UPDATE} `)
        }
      } catch (error: any) {
        logger.error(
          `Error occuerred while checking for quote_trail price and quote breakup price on /${constants.ON_UPDATE}`,
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
                  if (list.code == 'initiated_by' && list.value === context.bpp_id) {
                    mapCancellationID('SNP', reason_id, onupdtObj)
                  }
                })
              }
            })
          }
        })
      } catch (error: any) {
        logger.error(`!!Error while mapping cancellation_reason_id in ${constants.ON_UPDATE}`)
      }
    }

    try {
      // Checking for valid item ids inside on_update
      const items = on_update.items
      const itemSet: any = new Set()
      items.forEach((item: any) => {
        if (itemSet.has(JSON.stringify(item))) {
          onupdtObj[`DuplicateItem[${item.id}]`] = `Duplicate item found in /${constants.ON_UPDATE}`
        } else {
          itemSet.add(JSON.stringify(item)) // Add the item to the set if it's not already present
        }
      })
      let updateItemList: any = null
      if (getValue('flow') === '6-a') {
        updateItemList = getValue('SelectItemList')
      } else {
        updateItemList = getValue('updateItemList')
      }
      if (updateItemList) {
        items.forEach((item: any) => {
          if (!updateItemList.includes(item.id)) {
            const key = `inVldItemId[${item.id}]`
            onupdtObj[key] = `Item ID should be present in /${constants.UPDATE} API`
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
      logger.error(`Error while checking for item IDs for /${constants.ON_UPDATE}, ${error.stack}`)
    }

    //Checkign for valid item prices in /on_update
    try {
      logger.info(`Checking for valid item prices in /on_update`)
      const cancelFulfillments = _.filter(on_update.fulfillments, { type: 'Cancel' })
      const selectPriceMap: any = getValue('selectPriceMap')

      for (let obj of cancelFulfillments) {
        const quoteTrailItems = _.filter(obj.tags, { code: 'quote_trail' })
        checkQuoteTrail(quoteTrailItems, onupdtObj, selectPriceMap, quoteItemSet)
      }
    } catch (error: any) {
      logger.error(`Error while checking for valid item prices in /on_update`)
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
            logger.info(`Checking for quote_trail price and item quote price sum for ${constants.ON_UPDATE}`)
            checkQuoteTrailSum(returnFulfillments, price, priceAtConfirm, onupdtObj)
          }
        } else {
          logger.error(`The price breakdown in brakup does not match with the total_price for ${constants.ON_UPDATE} `)
        }
      } catch (error: any) {
        logger.error(
          `Error occuerred while checking for quote_trail price and quote breakup price on /${constants.ON_UPDATE}`,
        )
      }

      //Reason_id mapping
      try {
        logger.info(`Reason_id mapping for cancel_request`)
        const fulfillments = on_update.fulfillments
        fulfillments.map((fulfillment: any) => {
          if (fulfillment.type == 'Return') {
            const tags = fulfillment.tags
            tags.map((tag: any) => {
              if (tag.code == 'return_request') {
                const lists = tag.list
                let reason_id = ''
                lists.map((list: any) => {
                  if (list.code == 'reason_id') {
                    reason_id = list.value
                  }
                  if (list.code == 'initiated_by' && list.value === context.bap_id) {
                    mapCancellationID('BNP', reason_id, onupdtObj)
                  }
                })
              }
            })
          }
        })
      } catch (error: any) {
        logger.error(`!!Error while mapping cancellation_reason_id in ${constants.ON_UPDATE}`)
      }
    }

    if (flow === '6-c') {
      try {
        logger.info(`Reason_id mapping for cancel_request`)
        const fulfillments = on_update.fulfillments
        fulfillments.map((fulfillment: any) => {
          if (fulfillment.type == 'Return') {
            const tags = fulfillment.tags
            tags.map((tag: any) => {
              if (tag.code == 'return_request') {
                const lists = tag.list
                let reason_id = ''
                lists.map((list: any) => {
                  if (list.code == 'reason_id') {
                    reason_id = list.value
                  }
                  if (list.code == 'initiated_by' && list.value === context.bap_id) {
                    mapCancellationID('BNP', reason_id, onupdtObj)
                  }
                })
              }
            })
          }
        })
      } catch (error: any) {
        logger.error(`!!Error while mapping cancellation_reason_id in ${constants.ON_UPDATE}`)
      }

      // Checking for quote_trail price and item quote price
      try {
        if (sumQuoteBreakUp(on_update.quote)) {
          const price = Number(on_update.quote.price.value)
          const priceAtConfirm = Number(getValue('quotePrice'))
          const returnFulfillments = _.filter(on_update.fulfillments, { type: 'Return' })
          if (returnFulfillments[0].state.descriptor.code === 'Liquidated') {
            logger.info(`Checking for quote_trail price and item quote price sum for ${constants.ON_UPDATE}`)
            checkQuoteTrailSum(returnFulfillments, price, priceAtConfirm, onupdtObj)
          }
        } else {
          logger.error(`The price breakdown in brakup does not match with the total_price for ${constants.ON_UPDATE} `)
        }
      } catch (error: any) {
        logger.error(
          `Error occuerred while checking for quote_trail price and quote breakup price on /${constants.ON_UPDATE}`,
        )
      }
    }

    try {
      logger.info(`Checking for the availability of initiated_by code in ${constants.ON_UPDATE}`)
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
                  `${constants.ON_UPDATE} must have initiated_by code in fulfillments/tags/list`
              }
            }
            if (tag.code === 'return_request') {
              const list = tag.list
              const tags_initiated = list.find((data: any) => data.code === 'initiated_by')
              if (!tags_initiated) {
                onupdtObj[`message/order/fulfillments/tags`] =
                  `${constants.ON_UPDATE} must have initiated_by code in fulfillments/tags/list`
              }
            }
          })
        }
      })
    } catch (error: any) {
      logger.error(`Error while checking for the availability of initiated_by in ${constants.ON_UPDATE}`)
    }

    return onupdtObj
  } catch (error: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_UPDATE} API`, error.stack)
  }
}
