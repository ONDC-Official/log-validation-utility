import { logger } from '../../../shared/logger'
import { getValue, setValue } from '../../../shared/dao'
import constants, { ApiSequence } from '../../../constants'
import {
  validateSchema,
  checkGpsPrecision,
  checkTagConditions,
  isObjectEmpty,
  hasProperty,
  checkContext,
} from '../../../utils'
import _ from 'lodash'

export const checkSearchIncremental = (data: any, msgIdSet: any) => {
  try {
    const errorObj: any = {}
    if (!data || isObjectEmpty(data)) {
      errorObj[ApiSequence.INC_SEARCH] = 'JSON cannot be empty'
      return
    }

    const { message, context } = data
    if (!message || !context || !message.intent || isObjectEmpty(message) || isObjectEmpty(message.intent)) {
      return { missingFields: '/context, /message, /intent or /message/intent is missing or empty' }
    }
    const schemaValidation = validateSchema(context.domain.split(':')[1] || 'RET11', constants.INC_SEARCH, data)
    const contextRes: any = checkContext(context, constants.SEARCH)
    setValue(`${ApiSequence.INC_SEARCH}_context`, context)
    msgIdSet.add(context.message_id)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }
    if (_.isEqual(data.context, getValue(`domain`))) {
      errorObj[`Domain[${data.context.action}]`] = `Domain should be same in each action`
    }

    if (context.city !== '*') {
      errorObj.contextCityError = 'context/city should be "*" while sending search_inc_catalog request'
    }

    const buyerFF = parseFloat(message.intent?.payment?.['@ondc/org/buyer_app_finder_fee_amount'])

    if (isNaN(buyerFF)) {
      errorObj.payment = 'payment should have a key @ondc/org/buyer_app_finder_fee_amount'
    } else {
      setValue(`${ApiSequence.INC_SEARCH}_buyerFF`, buyerFF)
    }

    const fulfillment = data.message.intent && data.message.intent?.fulfillment
    if (fulfillment) {
      if (fulfillment.end) {
        const gps = fulfillment.end?.location?.gps
        if (gps) {
          if (!checkGpsPrecision(gps)) {
            errorObj['gpsPrecision'] =
              'fulfillment/end/location/gps coordinates must be specified with at least six decimal places of precision.'
          }
        } else {
          errorObj['fulfillmentLocation'] = 'fulfillment/end/location should have a required property gps'
        }
      }
    }

    if (hasProperty(data.message.intent, 'item') && hasProperty(data.message.intent, 'category')) {
      if (!errorObj.intent) {
        errorObj.intent = {}
      }

      errorObj.intent.category_or_item = '/message/intent cannot have both properties item and category'
    }

    if (message.intent?.tags) {
      let tags = checkTagConditions(message, context)
      if (tags) {
        errorObj.intent = { ...errorObj.intent, tags }
      }
    } else {
      errorObj.intent = '/message/intent should have a required property tags'
    }

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}
