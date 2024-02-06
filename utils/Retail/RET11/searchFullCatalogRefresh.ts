import { logger } from '../../../shared/logger'
import { setValue } from '../../../shared/dao'
import constants, { ApiSequence } from '../../../constants'
import {
  validateSchema,
  checkGpsPrecision,
  isObjectEmpty,
  hasProperty,
  checkContext,
  checkTagConditions,
} from '../../../utils'

export const checkSearchFullCatalogRefresh = (data: any, msgIdSet: any) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      errorObj[ApiSequence.SEARCH] = 'JSON cannot be empty'
      return
    }

    if (
      !data.message ||
      !data.context ||
      !data.message.intent ||
      isObjectEmpty(data.message) ||
      isObjectEmpty(data.message.intent)
    ) {
      errorObj['missingFields'] = '/context, /message, /intent or /message/intent is missing or empty'
      return Object.keys(errorObj).length > 0 && errorObj
    }

    // msgIdSet.add(data.context.message_id) //Duplicate db entry below

    const schemaValidation = validateSchema('RET11', constants.SEARCH, data)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    const contextRes: any = checkContext(data.context, constants.SEARCH)
    setValue(`${ApiSequence.SEARCH}_context`, data.context)
    msgIdSet.add(data.context.message_id)

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const buyerFF = parseFloat(data.message.intent?.payment?.['@ondc/org/buyer_app_finder_fee_amount'])

    if (!isNaN(buyerFF)) {
      setValue(`${ApiSequence.SEARCH}_buyerFF`, buyerFF)
    } else {
      errorObj['payment'] = 'payment should have a key @ondc/org/buyer_app_finder_fee_amount'
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

    if (data.message.intent?.tags) {
      const tagErrors = checkTagConditions(data.message, data.context)
      tagErrors?.length ? (errorObj.intent = { ...errorObj.intent, tags: tagErrors }) : null
    }

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}
