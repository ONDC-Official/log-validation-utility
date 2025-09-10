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
  validateTermsList,
} from '../..'
import _ from 'lodash'
import { FLOW } from '../../enum'

export const checkSearch = (
  data: any,
  msgIdSet: any,
  flow: any,
  stateless: boolean = false,
  schemaValidation?: boolean,
) => {
  const errorObj: any = {}
  const schemaErrors: any = {}
  const businessErrors: any = {}
  
  try {
    logger.info(`Checking JSON structure and required fields for ${ApiSequence.SEARCH} API with schemaValidation: ${schemaValidation}`)

    if (!data || isObjectEmpty(data)) {
      errorObj[ApiSequence.SEARCH] = 'JSON cannot be empty'
      return errorObj
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

    // Schema validation - run unless schemaValidation is explicitly false
    if (schemaValidation !== false) {
      const schemaDomain = data.context.domain.split(':')[1]
      logger.info(`checkSearch: calling schema validation with domain=${schemaDomain}, api=${constants.SEARCH}`)
      const schemaValidation = validateSchemaRetailV2(schemaDomain, constants.SEARCH, data)

      if (schemaValidation !== 'error') {
        Object.assign(schemaErrors, schemaValidation)
      }
    }

    // Business logic validation - run unless schemaValidation is explicitly true
    if (schemaValidation !== true) {
      try {
        logger.info(`Adding Message Id /${constants.SEARCH}`)
        msgIdSet.add(data.context.message_id)
        setValue(`${ApiSequence.SEARCH}_msgId`, data.context.message_id)
      } catch (error: any) {
        logger.error(`!!Error while checking message id for /${constants.SEARCH}, ${error.stack}`)
      }

      if (!stateless && !_.isEqual(data.context.domain.split(':')[1], getValue(`domain`))) {
        businessErrors[`Domain[${data.context.action}]`] = `Domain should be same in each action`
      }

      try {
        logger.info(`Checking for context in /context for ${constants.SEARCH} API`)
        const contextRes: any = checkContext(data.context, constants.SEARCH)
        setValue(`${ApiSequence.SEARCH}_context`, data.context)

        if (!contextRes?.valid) {
          Object.assign(businessErrors, contextRes.ERRORS)
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
          businessErrors['payment'] = 'payment should have a key @ondc/org/buyer_app_finder_fee_amount'
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
              businessErrors['gpsPrecision'] =
                'fulfillment/end/location/gps coordinates must be specified with at least 4 decimal places of precision.'
            }
          } else {
            businessErrors['gps'] = 'fulfillment/end/location/gps is required'
          }
        }
      } catch (error: any) {
        logger.error(`Error in checking fulfillment/end/location/gps: ${error.stack}`)
      }

      try {
        logger.info(`Checking for item and category in /message/intent for ${constants.SEARCH} API`)
        if (hasProperty(data.message.intent, 'item') && hasProperty(data.message.intent, 'category')) {
          if (!businessErrors.intent) {
            businessErrors.intent = {}
          }
          businessErrors.intent.category_or_item = '/message/intent cannot have both properties item and category'
        }
      } catch (error: any) {
        logger.error(`Error in checking item and category in /message/intent: ${error.stack}`)
      }

      try {
        logger.info(`Checking for tags in /message/intent for ${constants.SEARCH} API`)
        if (data.message.intent?.tags) {
          const bap_terms = data.message.intent.tags.find((tag: any) => tag.code === "bap_terms")
          const termsError = validateTermsList(bap_terms?.list ?? []);

          if (!termsError.isValid) {
            businessErrors['bap_terms'] = termsError.errors;
          }
          
          if (flow === FLOW.FLOW025) {
            const tags = data.message.intent?.tags
            const bnpTag = tags?.find((tag: any) => tag.code === 'bnp_demand_signal')
            const searchTerm = bnpTag?.list?.find((item: any) => item.code === 'search_term')

            if (!bnpTag) {
              businessErrors['missingTags'] = `Missing tag with code 'bnp_demand_signal' in /${constants.SEARCH} for flow025`
            }

            if (!searchTerm) {
              businessErrors['missingSearchTerm'] = `'bnp_demand_signal' tag is present but missing 'search_term' in its list`
            }
          }
          
          if (flow === FLOW.FLOW022) {
            const tags = data.message.intent?.tags
            const bnpTag = tags?.find((tag: any) => tag.code === 'bap_promos')
            if (!bnpTag) {
              businessErrors['missingTags'] = `Missing tag with code 'bap_promos' in /${constants.SEARCH} for flow022`
            }
            const category = bnpTag?.list?.find((item: any) => item.code === 'category')
            const hasFrom = bnpTag?.list?.find((item: any) => item.code === 'from')
            const hasTo = bnpTag?.list?.find((item: any) => item.code === 'to')
            if (!category) {
              businessErrors['missingSearchTerm'] = `'bnp_demand_signal' tag is present but missing 'category' in its list`
            }
            if (!hasFrom || !hasTo) {
              businessErrors['missingSearchTerm'] =
                `'bnp_demand_signal' tag is present but missing timing indicators such as ' from, to ' in its list`
            }
            if (hasFrom && hasTo) {
              const fromDate = new Date(hasFrom.value)
              const toDate = new Date(hasTo.value)

              if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
                businessErrors['invalidDate'] = `'from' or 'to' contains an invalid date format.`
              } else if (fromDate > toDate) {
                businessErrors['invalidDateRange'] = `'from' date cannot be later than 'to' date.`
              }
            }
          }

          const tagErrors = checkTagConditions(data.message, data.context, ApiSequence.SEARCH)
          if (tagErrors?.length) {
            businessErrors.intent = { ...businessErrors.intent, tags: tagErrors }
          }
        }
      } catch (error: any) {
        logger.error(`Error in checking tags in /message/intent: ${error.stack}`)
      }
    }

    // Always return buckets; let caller decide which to surface
    const hasSchema = Object.keys(schemaErrors).length > 0
    const hasBusiness = Object.keys(businessErrors).length > 0
    if (!hasSchema && !hasBusiness) return false
    return { schemaErrors, businessErrors }

  } catch (error: any) {
    logger.error(
      `Error while checking for JSON structure and required fields for ${ApiSequence.SEARCH}: ${error.stack}`,
    )
    return {
      error: `Error while checking for JSON structure and required fields for ${ApiSequence.SEARCH}: ${error.stack}`,
    }
  }
}
