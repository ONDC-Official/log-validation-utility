import { logger } from '../../../shared/logger'
import { setValue } from '../../../shared/dao'
import constants, { ApiSequence } from '../../../constants'
import {
  checkContext,
  validateSchema,
  checkGpsPrecision,
  checkTagConditions,
  isObjectEmpty,
  hasProperty,
} from '../../../utils'

export const checkSearchIncremental = (data: any, msgIdSet: any) => {
  try {
    const srchObj: any = { intent: { tags: [] } }

    if (!data || isObjectEmpty(data)) {
      throw new Error(`${ApiSequence.INC_SEARCH} Json cannot be empty`)
    }

    if (
      !data.message ||
      !data.context ||
      !data.message.intent ||
      isObjectEmpty(data.message) ||
      isObjectEmpty(data.message.intent)
    ) {
      throw new Error('/context, /message, /intent or /message/intent is missing or empty')
    }

    const contextRes: any = checkContext(data.context, constants.RET_SEARCH)
    setValue(ApiSequence.SEARCH, data.context)
    msgIdSet.add(data.context.message_id)

    if (!contextRes?.valid) {
      Object.assign(srchObj, contextRes.ERRORS)
    } else {
      const schemaValidation = validateSchema('RET11', constants.RET_SEARCH, data)

      if (schemaValidation !== 'error') {
        Object.assign(srchObj, schemaValidation)
      }

      const buyerFF = parseFloat(data.message.intent?.payment?.['@ondc/org/buyer_app_finder_fee_amount'])

      if (!isNaN(buyerFF)) {
        setValue('buyerFF', buyerFF)
      } else {
        throw new Error('payment should have a key @ondc/org/buyer_app_finder_fee_amount')
      }

      const fulfillment = data.message.intent?.fulfillment
      if (fulfillment) {
        if (fulfillment.end) {
          const gps = fulfillment.end?.location?.gps

          if (gps) {
            if (!checkGpsPrecision(gps)) {
              srchObj.gpsPrecision =
                'fulfillment/end/location/gps coordinates must be specified with at least six decimal places of precision.'
            }
          } else {
            throw new Error('fulfillment/end/location should have a required property gps')
          }
        }
      }

      if (hasProperty(data.message.intent, 'item') && hasProperty(data.message.intent, 'category')) {
        srchObj.intent.category_or_item = '/message/intent cannot have both properties item and category'
      }
    }

    if (data.message.intent?.tags) checkTagConditions(data.message, data.context, srchObj)
    return srchObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}
