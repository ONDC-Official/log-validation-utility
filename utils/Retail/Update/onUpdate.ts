import _ from 'lodash'
import constants, { ApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty, checkContext, checkBppIdOrBapId, sumQuoteBreakUp } from '../../../utils'
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
    return onUpdateObj
  } catch (error: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_UPDATE}, ${error.stack} `)
  }
}
