import { logger } from '../../../shared/logger'
import { getValue, setValue } from '../../../shared/dao'
import constants, { ApiSequence } from '../../../constants'
import {
  validateSchemaRetailV2,
  checkGpsPrecision,
  isObjectEmpty,
  hasProperty,
  checkContext,
  checkTagConditions,
} from '../..'
import _ from 'lodash'
import { FLOW } from '../../enum'

export const checkSearch = (data: any, msgIdSet: any, flow: any) => {
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

    const schemaValidation = validateSchemaRetailV2(data.context.domain.split(':')[1], constants.SEARCH, data)

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
              'fulfillment/end/location/gps coordinates must be specified with at least 4 decimal places of precision.'
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
        if (flow === FLOW.FLOW025) {
          const tags = data.message.intent?.tags

          const bnpTag = tags?.find((tag: any) => tag.code === 'bnp_demand_signal')
          const searchTerm = bnpTag.list?.find((item: any) => item.code === 'search_term')

          if (!bnpTag) {
            errorObj['missingTags'] = `Missing tag with code 'bnp_demand_signal' in /${constants.SEARCH} for flow025`
          }

          if (!searchTerm) {
            errorObj['missingSearchTerm'] = `'bnp_demand_signal' tag is present but missing 'search_term' in its list`
          }
        }
        if (flow === FLOW.FLOW022) {
          const tags = data.message.intent?.tags
          const bnpTag = tags?.find((tag: any) => tag.code === 'bap_promos')
          if (!bnpTag) {
            errorObj['missingTags'] = `Missing tag with code 'bap_promos' in /${constants.SEARCH} for flow022`
          }
          const category = bnpTag.list?.find((item: any) => item.code === 'category')
          const hasFrom = bnpTag.list?.find((item: any) => item.code === 'from')
          const hasTo = bnpTag.list?.find((item: any) => item.code === 'to')
          if (!category) {
            errorObj['missingSearchTerm'] = `'bnp_demand_signal' tag is present but missing 'category' in its list`
          }
          if (!hasFrom || !hasTo) {
            errorObj['missingSearchTerm'] =
              `'bnp_demand_signal' tag is present but missing timing indicators such as ' from, to ' in its list`
          }
          if (hasFrom && hasTo) {
            const fromDate = new Date(hasFrom.value)
            const toDate = new Date(hasTo.value)

            if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
              errorObj['invalidDate'] = `'from' or 'to' contains an invalid date format.`
            } else if (fromDate > toDate) {
              errorObj['invalidDateRange'] = `'from' date cannot be later than 'to' date.`
            }
          }
        }

        const tagErrors = checkTagConditions(data.message, data.context, ApiSequence.SEARCH)
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
