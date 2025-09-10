import { logger } from '../../../shared/logger'
import { getValue, setValue } from '../../../shared/dao'
import constants, { ApiSequence } from '../../../constants'
import {
  validateSchemaRetailV2,
  checkGpsPrecision,
  checkTagConditions,
  isObjectEmpty,
  hasProperty,
  checkContext,
} from '../..'
import _ from 'lodash'

export const checkSearchIncremental = (data: any, msgIdSet: any, schemaValidation?: boolean, stateless?: boolean) => {
  try {
    const errorObj: any = {}
    const schemaErrors: any = {}
    if (!data || isObjectEmpty(data)) {
      errorObj[ApiSequence.INC_SEARCH] = 'JSON cannot be empty'
      return
    }

    const { message, context } = data
    if (!message || !context || !message.intent || isObjectEmpty(message) || isObjectEmpty(message.intent)) {
      return { missingFields: '/context, /message, /intent or /message/intent is missing or empty' }
    }

    const schemaValidationResult =
      schemaValidation !== false
        ? validateSchemaRetailV2(context.domain.split(':')[1] || 'RET11', constants.INC_SEARCH, data)
        : 'skip'

    if (schemaValidationResult !== 'error' && schemaValidationResult !== 'skip') {
      Object.assign(schemaErrors, schemaValidationResult)
    }

    const contextRes: any = checkContext(context, constants.SEARCH)
    setValue(`${ApiSequence.INC_SEARCH}_context`, context)

    if (!stateless) {
      try {
        logger.info(`Adding Message Id /${constants.INC_SEARCH}`)
        if (msgIdSet.has(context.message_id)) {
          errorObj[`${ApiSequence.INC_SEARCH}_msgId`] = `Message id should not be same with previous calls`
        }
        msgIdSet.add(context.message_id)
      } catch (error: any) {
        logger.error(`!!Error while checking message id for /${constants.INC_SEARCH}, ${error.stack}`)
      }
    }
    if (schemaValidationResult !== 'error' && schemaValidationResult !== 'skip') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }
    if (!stateless && _.isEqual(data.context, getValue(`domain`))) {
      errorObj[`Domain[${data.context.action}]`] = `Domain should be same in each action`
    }

    if (context.city !== '*') {
      errorObj.contextCityError = 'context/city should be "*" while sending search_inc_catalog request'
    }

    if (!stateless) {

      const onSearchContext: any = getValue(`${ApiSequence.ON_SEARCH}_context`)
      try {
        logger.info(`Comparing timestamp of /${constants.ON_SEARCH} and /${constants.INC_SEARCH}}`)
        const tmpstmp = onSearchContext?.timestamp
        if (_.gte(tmpstmp, context.timestamp)) {
          errorObj.tmpstmp = `Timestamp for /${constants.ON_SEARCH} api cannot be greater than or equal to /${constants.INC_SEARCH} api`
        }
      } catch (error: any) {
        logger.info(
          `Error while comparing timestamp for /${constants.ON_SEARCH} and /${constants.INC_SEARCH}} api, ${error.stack}`,
        )
      }
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
              'fulfillment/end/location/gps coordinates must be specified with at least 4 decimal places of precision.'
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
      setValue(`${ApiSequence.INC_SEARCH}_push`, false)
      let tags = checkTagConditions(message, context, ApiSequence.INC_SEARCH)
      if (tags) {
        errorObj.intent = { ...errorObj.intent, tags }
      }
    } else {
      errorObj.intent = '/message/intent should have a required property tags'
    }

    const hasSchema = Object.keys(schemaErrors).length > 0
    const hasBusiness = Object.keys(errorObj).length > 0

    if (stateless) {
      if (schemaValidation === true) {
        return hasSchema ? { schemaErrors } : false
      }
      if (schemaValidation === false) {
        return hasBusiness ? { errorObj } : false
      }
      if (!hasSchema && !hasBusiness) return false
      return { schemaErrors, businessErrors: errorObj }
    }

    if (schemaValidation === true) {
      return hasSchema ? { schemaErrors } : false
    } else if (schemaValidation === false) {
      return hasBusiness ? { errorObj } : false
    } else {
      return { schemaErrors, businessErrors: errorObj }
    }
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}
