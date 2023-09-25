import { logger } from '../../../shared/logger'
import { setValue } from '../../../shared/dao'
import constants, { ApiSequence } from '../../../constants'
import {
  validateSchema,
  checkGpsPrecision,
  checkTagConditions,
  isObjectEmpty,
  hasProperty,
  checkContext,
} from '../../../utils'

export const checkSearchIncremental = (data: any, msgIdSet: any) => {
  try {
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.INC_SEARCH]: 'Json cannot be empty' }
    }

    const { message, context } = data

    if (!message || !context || !message.intent || isObjectEmpty(message) || isObjectEmpty(message.intent)) {
      return { missingFields: '/context, /message, /intent or /message/intent is missing or empty' }
    }

    setValue(ApiSequence.SEARCH, context)
    msgIdSet.add(context.message_id)

    const schemaValidation = validateSchema('RET11', constants.RET_SEARCH, data)

    const contextRes: any = checkContext(context, constants.RET_SEARCH)
    setValue(ApiSequence.SEARCH, context)
    msgIdSet.add(context.message_id)

    const errorObj: any = {}

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const buyerFF = parseFloat(message.intent?.payment?.['@ondc/org/buyer_app_finder_fee_amount'])

    if (isNaN(buyerFF)) {
      errorObj.payment = 'payment should have a key @ondc/org/buyer_app_finder_fee_amount'
    } else {
      setValue('buyerFF', buyerFF)
    }

    const fulfillment = message.intent && message.intent.fulfillment

    if (fulfillment && fulfillment.end) {
      const gps = fulfillment.end.location?.gps

      if (gps && !checkGpsPrecision(gps)) {
        errorObj.gpsPrecision =
          'fulfillment/end/location/gps coordinates must be specified with at least six decimal places of precision.'
      } else if (!gps) {
        errorObj.fulfillmentLocation = 'fulfillment/end/location should have a required property gps'
      }
    }

    if (hasProperty(message.intent, 'item') && hasProperty(message.intent, 'category')) {
      errorObj.intent = { category_or_item: '/message/intent cannot have both properties item and category' }
    }

    if (message.intent?.tags) {
      errorObj.intent = { ...errorObj.intent, tags: checkTagConditions(message, context) }
    } else {
      errorObj.intent = '/message/intent should have a required property tags'
    }

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}
