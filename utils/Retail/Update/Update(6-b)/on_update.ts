import _ from 'lodash'
import { logger } from '../../../../shared/logger'
import constants, { ApiSequence } from '../../../../constants'
import {
  validateSchema,
  isObjectEmpty,
  checkBppIdOrBapId,
  checkContext,
  compareObjects,
  sumQuoteBreakUp,
} from '../../../../utils'
import { getValue, setValue } from '../../../../shared/dao'

export const checkOnUpdateRQC = (data: any) => {
  console.log(`Inside OnUpdate RQC`)
  const onupdtObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.ON_UPDATE]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data

    const on_update = message.order
    const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
    const select: any = getValue(`${ApiSequence.SELECT}`)

    if (!message || !context || isObjectEmpty(message)) {
      return { missingFields: '/context, /message, is missing or empty' }
    }

    // Validating Schema
    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.ON_UPDATE_RQC, data)

    if (schemaValidation !== 'error') {
      Object.assign(onupdtObj, schemaValidation)
    }

    // Checking bap_id and bpp_id format
    const checkBap = checkBppIdOrBapId(context.bap_id)
    const checkBpp = checkBppIdOrBapId(context.bpp_id)
    if (checkBap) Object.assign(onupdtObj, { bap_id: 'context/bap_id should not be a url' })
    if (checkBpp) Object.assign(onupdtObj, { bpp_id: 'context/bpp_id should not be a url' })

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

    // Compare return_request object
    try {
      logger.info(`Checking for return_request object in /${constants.ON_UPDATE}`)
      const obj = getValue('return_request_obj')
      let return_request_obj = null
      on_update.fulfillments.forEach((item: any) => {
        if (item.tags) {
          item.tags.forEach((tag: any) => {
            if (tag.code === 'return_request') {
              return_request_obj = tag
            }
          })
        }
      })
      const requestObjectErr = compareObjects(obj, return_request_obj)

      if (requestObjectErr) {
        let i = 0
        const len = requestObjectErr.length
        while (i < len) {
          const key = `returnRequestObjectErr[${i}]`
          onupdtObj[key] = `${requestObjectErr[i]}`
          i++
        }
      }
    } catch (error: any) {
      logger.error(`Error while checking for return_request_obj for /${constants.UPDATE}`)
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
          for (let obj of returnFulfillments) {
            let quoteTrailSum = 0
            const quoteTrailItems = _.filter(obj.tags, { code: 'quote_trail' })
            for (let item of quoteTrailItems) {
              for (let val of item.list) {
                if (val.code === 'value') {
                  quoteTrailSum += Math.abs(val.value)
                }
              }
            }
            console.log('PRICE--->', price)
            console.log('Priceatconfirm--->', priceAtConfirm)
            console.log('quoteTrailSum--->', quoteTrailSum)
            if (priceAtConfirm != price + quoteTrailSum) {
              const key = `invldQuoteTrailPrices`
              onupdtObj[key] =
                `quote_trail price and item quote price sum for ${constants.ON_UPDATE} should be equal to the price as in ${constants.ON_CONFIRM}`
              logger.error(
                `quote_trail price and item quote price sum for ${constants.ON_UPDATE} should be equal to the price as in ${constants.ON_CONFIRM} `,
              )
            }
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

    // Reason code mapping

    return onupdtObj
  } catch (error: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_UPDATE} API`, error.stack)
  }
}
