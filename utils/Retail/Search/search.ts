import { logger } from '../../../shared/logger'
import { getValue, setValue } from '../../../shared/dao'
import constants, { ApiSequence } from '../../../constants'
import {
  validateSchema,
  checkGpsPrecision,
  isObjectEmpty,
  hasProperty,
  checkContext,
  checkTagConditions,
} from '../../../utils'
import _ from 'lodash'

export const checkSearch = (data: any, msgIdSet: any) => {
  const errorObj: any = {}
  try {
    logger.info(`Checking JSON structure and required fields for ${ApiSequence.SEARCH} API`)

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


    const schemaValidation = validateSchema(data.context.domain.split(':')[1], constants.SEARCH, data)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    try {
      logger.info(`Adding Message Id /${constants.SEARCH}`)
      msgIdSet.add(data.context.message_id)
      setValue(`${ApiSequence.SEARCH}_msgId`, data.context.message_id)
    } catch (error: any) {
      logger.error(`!!Error while checking message id for /${constants.SEARCH}, ${error.stack}`)
    }
    
    if (!_.isEqual(data.context.domain.split(':')[1], getValue(`domain`))) {
      errorObj[`Domain[${data.context.action}]`] = `Domain should be same in each action`
    }

    try {
      logger.info(`Checking for context in /context for ${constants.SEARCH} API`)
      const contextRes: any = checkContext(data.context, constants.SEARCH)
      setValue(`${ApiSequence.SEARCH}_context`, data.context)

      if (!contextRes?.valid) {
        Object.assign(errorObj, contextRes.ERRORS)
      }
    } catch (error: any) {
      logger.error(`Error in checking context for ${ApiSequence.SEARCH}: ${error.stack}`)
    }

    try {
      logger.info(`Checking for buyer app finder fee amount for ${ApiSequence.SEARCH}`)
      const buyerFF = parseFloat(data.message.intent?.payment?.['@ondc/org/buyer_app_finder_fee_amount'])

      if (!isNaN(buyerFF)) {
        setValue(`${ApiSequence.SEARCH}_buyerFF`, buyerFF)
      } else {
        errorObj['payment'] = 'payment should have a key @ondc/org/buyer_app_finder_fee_amount'
      }
    } catch (error: any) {
      logger.error(`Error in checking buyer app finder fee amount: ${error.stack}`)
    }

    try {
      logger.info(`Checking for fulfillment/end/location/gps for ${ApiSequence.SEARCH}`)
      const fulfillment = data.message.intent && data.message.intent?.fulfillment
      if (fulfillment && fulfillment.end) {
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
    } catch (error: any) {
      logger.error(`Error in checking fulfillment/end/location/gps: ${error.stack}`)
    }

    try {
      logger.info(`Checking for item and category in /message/intent for ${constants.SEARCH} API`)
      if (hasProperty(data.message.intent, 'item') && hasProperty(data.message.intent, 'category')) {
        if (!errorObj.intent) {
          errorObj.intent = {}
        }
        errorObj.intent.category_or_item = '/message/intent cannot have both properties item and category'
      }
    } catch (error: any) {
      logger.error(`Error in checking item and category in /message/intent: ${error.stack}`)
    }

    try {
      logger.info(`Checking for tags in /message/intent for ${constants.SEARCH} API`)
      if (data.message.intent?.tags) {
        const tagErrors = checkTagConditions(data.message, data.context)
        tagErrors?.length ? (errorObj.intent = { ...errorObj.intent, tags: tagErrors }) : null
      }
    } catch (error: any) {
      logger.error(`Error in checking tags in /message/intent: ${error.stack}`)
    }

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(
      `Error while checking for JSON structure and required fields for ${ApiSequence.SEARCH}: ${error.stack}`,
    )
    return {
      error: `Error while checking for JSON structure and required fields for ${ApiSequence.SEARCH}: ${error.stack}`,
    }
  }
}
