// import _ from 'lodash'
import constants, { mobilitySequence } from '../../constants'
import { logger } from '../../shared/logger'
import { validateSchema, isObjectEmpty } from '../'
import { getValue, setValue } from '../../shared/dao'
import {
  validateContext,
  validateQuote,
  validateCancellationTerms,
  validateItemRefIds,
  validatePayloadAgainstSchema,
  validatePaymentObject,
  validateProviderId,
  validateFulfillments,
  hasOnlyAllowedKeys,
} from './mobilityChecks'
import { validateItemsTags } from './tags'
import attributeConfig from './config/config2.0.1.json'
import _ from 'lodash'

export const checkOnInit = (data: any, msgIdSet: any, version: any) => {
  try {
    const errorObj: any = {}
    if (!data || isObjectEmpty(data)) {
      return { [mobilitySequence.ON_INIT]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('TRV', constants.ON_INIT, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.INIT, constants.ON_INIT)
    setValue(`${mobilitySequence.ON_INIT}_message`, message)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const on_init = message.order
    const itemIDS: any = getValue(`itemIds`)
    const locationIds = getValue(`locationIds`)
    const fulfillmentIdsSet = new Set()

    //provider id check
    try {
      logger.info(`Checking provider id in /${constants.ON_INIT}`)
      const providerError = validateProviderId(on_init?.provider?.id, constants.INIT, constants.ON_INIT)
      const additionalKeys = hasOnlyAllowedKeys(on_init?.provider, ['id', 'descriptor'])
      Object.assign(errorObj, providerError)
      errorObj.providerAddKeys = `provider obj is having additional keys ${additionalKeys.join(', ')}`
    } catch (error: any) {
      logger.error(`!!Error while checking provider id in /${constants.ON_INIT}, ${error.stack}`)
    }

    //fulfillments checks
    const fulfillmentError = validateFulfillments(
      on_init?.fulfillments,
      fulfillmentIdsSet,
      constants.ON_INIT,
      false,
      false,
      '',
    )
    Object.assign(errorObj, fulfillmentError)

    //items checks
    try {
      logger.info(`Validating items object for /${constants.ON_INIT}`)
      if (!on_init?.items) errorObj.items = `items is missing in /${constants.ON_INIT}`
      else {
        on_init.items.forEach((item: any, index: number) => {
          const itemKey = `items[${index}]`

          if (!item?.id) {
            errorObj[`${itemKey}.id`] = `id is missing in [${itemKey}]`
          } else if (!itemIDS.includes(item.id)) {
            errorObj[`${itemKey}.id`] =
              `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in /${constants.ON_INIT}`
          }

          //price check
          if (!item?.price?.value) errorObj[`${itemKey}.price`] = `value is missing at item.index ${index} `
          if (!item?.price?.currency)
            errorObj[`${itemKey}.price.currency`] = `currency is missing at item.index ${index} `

          //fulfillment_ids, location_ids & payment_ids checks
          const refIdsErrors = validateItemRefIds(
            item,
            constants.ON_INIT,
            index,
            fulfillmentIdsSet,
            new Set(locationIds),
            new Set(),
          )
          Object.assign(errorObj, refIdsErrors)

          //descriptor.code
          if (!item?.descriptor?.code)
            errorObj[`${itemKey}.code`] = `descriptor.code is missing at index: ${index} in /${constants.ON_INIT}`
          else if (item.descriptor.code !== 'RIDE') {
            errorObj[`${itemKey}.type`] = `descriptor.code must be RIDE at item.index ${index} in /${constants.ON_INIT}`
          }

          // FARE_POLICY & INFO checks
          if (item?.tags) {
            const tagsValidation = validateItemsTags(item.tags)
            if (!tagsValidation.isValid) {
              Object.assign(errorObj, { itemTags: tagsValidation.errors })
            }
          } else {
            Object.assign(errorObj, { itemTags: `Missing tag-group at ${itemKey}` })
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking items info in /${constants.ON_INIT},  ${error.message}`)
      return { error: error.message }
    }

    try {
      logger.info(`Checking cancellation terms in /${constants.ON_INIT}`)
      const cancellationErrors = validateCancellationTerms(on_init.cancellation_terms, constants.ON_INIT)
      Object.assign(errorObj, cancellationErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation_terms in /${constants.ON_INIT}, ${error.stack}`)
    }

    // check payments
    try {
      logger.info(`Checking payments in /${constants.ON_INIT}`)
      const payments = on_init?.payments
      const paymentErrors = validatePaymentObject(payments, constants.ON_INIT)
      Object.assign(errorObj, paymentErrors)
    } catch (error: any) {
      logger.error(`!!Errors while checking payments in /${constants.ON_INIT}, ${error.stack}`)
    }

    try {
      logger.info(`Checking quote details in /${constants.ON_INIT}`)
      const quoteErrors = validateQuote(on_init?.quote, constants.ON_INIT)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking Quote in /${constants.ON_INIT},  ${error.message}`)
      return { error: error.message }
    }

    if (version === '2.0.1') {
      const additionalAttributes: any = attributeConfig.on_init
      validatePayloadAgainstSchema(additionalAttributes, data, errorObj, '', '')
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_INIT} API`, err)
    return { error: err.message }
  }
}
