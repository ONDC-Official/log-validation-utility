import _ from 'lodash'
import constants, { ApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import {
  validateSchema,
  isObjectEmpty,
  checkContext,
  checkBppIdOrBapId,
  sumQuoteBreakUp,
  payment_status,
  mapCancellationID,
} from '../../../utils'
import { getValue, setValue } from '../../../shared/dao'

export const checkOnUpdate = (data: any) => {
  const onUpdateObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.ON_UPDATE]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data

    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.ON_UPDATE, data)
    const select: any = getValue(`${ApiSequence.SELECT}`)
    const contextRes: any = checkContext(context, constants.ON_UPDATE)
    const checkBap = checkBppIdOrBapId(context.bap_id)
    const checkBpp = checkBppIdOrBapId(context.bpp_id)

    if (checkBap) Object.assign(onUpdateObj, { bap_id: 'context/bap_id should not be a url' })
    if (checkBpp) Object.assign(onUpdateObj, { bpp_id: 'context/bpp_id should not be a url' })
    if (schemaValidation !== 'error') {
      Object.assign(onUpdateObj, schemaValidation)
    }
    if (!contextRes?.valid) {
      Object.assign(onUpdateObj, contextRes.ERRORS)
    }

    setValue(`${ApiSequence.ON_UPDATE}`, data)

    const on_update = message.order

    // Comaring city of ON_UPDATE with ON_SEARCH
    try {
      logger.info(`Comparing city of /${constants.ON_UPDATE} with /${constants.ON_SEARCH}`)
      if (!_.isEqual(searchContext.city, context.city)) {
        onUpdateObj.city = `City code mismatch in /${constants.ON_UPDATE} and ${constants.ON_SEARCH}`
      }
    } catch (error: any) {
      logger.error(`!!Error occurred while comparing city of /${constants.ON_UPDATE} with /${constants.ON_SEARCH}`)
    }

    // Comparing timestamp of context with ON_INIT timestamp
    try {
      logger.info(`Comparing timestamp of /${constants.ON_INIT} and /${constants.ON_UPDATE}`)
      if (_.gte(getValue('tmpstmp'), context.timestamp)) {
        onUpdateObj.tmpstmp = `Timestamp for /${constants.ON_INIT} api cannot be greater than or equals to /${constants.ON_UPDATE} api`
      }

      setValue(`tmpstmp`, context.timestamp)
    } catch (error: any) {
      logger.error(`!!Error occurred while comparing timestamp of /${constants.ON_UPDATE} and /${constants.ON_INIT}`)
    }

    //Comapring transaction IDs of /ON_UPDATE with /SELECT
    try {
      logger.info(`Comparing transaction Ids of /${constants.SELECT} and /${constants.ON_UPDATE}`)
      if (!_.isEqual(select.context.transaction_id, context.transaction_id)) {
        onUpdateObj.txnId = `Transaction Id should be same from /${constants.SELECT} onwards`
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
        onUpdateObj.invldCancellationPrices = `Item quote breakup prices for /${constants.ON_UPDATE} shoulb be equal to the net price.`
      }
    } catch (error: any) {
      logger.error(`Error occurred while checking for valid quote breakup in ON_UPDATE`)
    }

    // Checking for quote_trail price and item quote price
    try {
      if (sumQuoteBreakUp(on_update.quote)) {
        logger.info(`Checking for quote_trail price and item quote price sum for ${constants.ON_UPDATE}`)
        const price = Number(on_update.quote.price.value)
        const priceAtConfirm = Number(getValue('quotePrice'))
        const cancelFulfillments = _.filter(on_update.fulfillments, { type: 'Cancel' })
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
            const key = `invldCancellationPrices`
            onUpdateObj[key] =
              `quote_trail price and item quote price sum for ${constants.ON_UPDATE} should be equal to the price as in ${constants.ON_CONFIRM}`
            logger.error(
              `quote_trail price and item quote price sum for ${constants.ON_UPDATE} should be equal to the price as in ${constants.ON_CONFIRM} `,
            )
          }
        }
      } else {
        logger.error(`The price breakdown in brakup does not match with the total_price for ${constants.ON_UPDATE} `)
      }
    } catch (error: any) {
      logger.error(
        `Error occuerred while checking for quote_trail price and quote breakup price on /${constants.ON_UPDATE}`,
      )
    }

    // Comparing quote Object of /ON_UPDATE with /ON_SELECT
    try {
      logger.info(`Comparing Quote object for /${constants.ON_SELECT} and /${constants.ON_UPDATE}`)
      if (!_.isEqual(getValue('quoteObj'), on_update.quote)) {
        onUpdateObj.quoteObj = `Discrepancies between the quote object in /${constants.ON_SELECT} and /${constants.ON_UPDATE}`
      }
    } catch (error: any) {
      logger.error(`!!Error while Comparing Quote object for /${constants.ON_SELECT} and /${constants.ON_UPDATE}`)
    }

    //Comparing item count in /on_update and /select
    const select_items: any = getValue('items')
    try {
      logger.info(`Matching the item count in message/order/items with that in /select`)
      const onUpdate_items = on_update.items
      let onUpdate_count = 0
      onUpdate_items.map((data: any) => {
        data.tags.map((data2: any) => {
          data2.list.map((data3: any) => {
            if (data3.code === 'type') {
              if (data3.value === 'item') {
                onUpdate_count++
              }
            }
          })
        })
      })

      select_items.map((data: any) => {
        if (data.quantity.count != onUpdate_count) {
          onUpdateObj[`on_update/message/order/items/count`] =
            `Item count in /on_update/message/order/items doesn't match with previous count of items`
        }
      })
    } catch (error: any) {
      logger.error(`Error while matching the count of items in /on_update and /select`)
    }

    //Comparing the sum of quote_trail items and quote.price with that of net price of previous calls
    try {
      const fulfillments = on_update.fulfillments
      let onUpdate_price: any = '0'
      fulfillments.map((data: any) => {
        if (data.type == 'Cancel') {
          const tags = data.tags
          tags.map((data1: any) => {
            if (data1.code == 'quote_trail') {
              const list = data1.list
              list.map((data3: any) => {
                if (data3.code == 'value') {
                  onUpdate_price = parseFloat(onUpdate_price) - parseFloat(data3.value)
                }
              })
            }
          })
        }
      })
      onUpdate_price = parseFloat(onUpdate_price) + parseFloat(on_update.quote.price.value)
      const onSelect_price: any = getValue('quote_price')
      if (parseFloat(onUpdate_price) != parseFloat(onSelect_price)) {
        onUpdateObj[`/on_update/message/order/fulfillments`] =
          `Sum of quote_trail price and quote.price doesnot match the net price of previous calls`
      }
    } catch (error: any) {
      logger.error(
        `Error while matching the sum of quote_trail items and quote_price in on_update/message/order/fulfillments with that net price in previous calls`,
      )
    }

    //Check for status (Paid and Unpaid) and transaction_id available
    try {
      logger.info(`Checking if payment status is Paid or Unpaid and availability of transaction_id`)
      const payment = on_update.payment
      const status = payment_status(payment)
      if (!status) {
        onUpdateObj['message/order/transaction_id'] = `Transaction_id missing in message/order/payment`
      }
    } catch (error: any) {
      logger.error(`Error while checking the payment status`)
    }

    //Comparing the updated_at timestamp with of context.timestamp
    try {
      if (!_.gte(context.timestamp, on_update.updated_at)) {
        onUpdateObj[`context/timestamp`] = `context/timestamp cannot be greater than message/order/updated_at timestamp`
      }
    } catch (error: any) {
      logger.error(`Error while comparing context/timestamp and updated_at timestamp`)
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
                if (list.code == 'initiated_by') {
                  if (list.value === context.bpp_id) {
                    mapCancellationID('SNP', reason_id, onUpdateObj)
                  }
                }
              })
            }
          })
        }
      })
    } catch (error: any) {
      logger.error(`!!Error while mapping cancellation_reason_id in ${constants.ON_CANCEL}`)
    }

    return onUpdateObj
  } catch (error: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_UPDATE}, ${error.stack} `)
  }
}
