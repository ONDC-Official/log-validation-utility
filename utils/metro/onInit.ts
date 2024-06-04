// import _ from 'lodash'
import constants, { metroSequence } from '../../constants'
import { logger } from '../../shared/logger'
import { validateSchema, isObjectEmpty } from '..'
import { getValue, setValue } from '../../shared/dao'
import {
  validateContext,
  validatePaymentParams,
  validateQuote,
  validateStops,
  validateCancellationTerms,
  validateItemDescriptor,
} from './metroChecks'
import { validatePaymentTags, validateRouteInfoTags } from './tags'
import { checkProviderTime } from './validate/helper'

const VALID_DESCRIPTOR_CODES = ['SJT', 'SFSJT', 'RJT', 'PASS']
const VALID_VEHICLE_CATEGORIES = ['METRO']
export const checkOnInit = (data: any, msgIdSet: any) => {
  try {
    const errorObj: any = {}
    if (!data || isObjectEmpty(data)) {
      return { [metroSequence.ON_INIT]: 'Json cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('TRV', constants.ON_INIT, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.INIT, constants.ON_INIT)
    setValue(`${metroSequence.ON_INIT}_message`, message)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const on_init = message.order
    const itemIDS: any = getValue('ItmIDS')
    const itemIdArray: any[] = []
    const storedFull: any = getValue(`${metroSequence.ON_SEARCH1}_storedFulfillments`)
    const fulfillmentIdsSet = new Set()

    let newItemIDSValue: any[]

    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      on_init.items.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
    }

    setValue('ItmIDS', newItemIDSValue)

    try {
      logger.info(`Checking provider Id in /${constants.ON_SEARCH} and /${constants.ON_INIT}`)
      if (!on_init.provider || on_init.provider.id != getValue('providerId')) {
        errorObj.prvdrId = `Provider Id mismatches in /${constants.ON_SEARCH} and /${constants.ON_INIT}`
      }

      if (!on_init?.provider?.descriptor)
        errorObj.prvdrIdDescriptor = `Provider Descriptor is Missing in /${constants.ON_INIT}`
      else if (
        on_init?.provider?.descriptor &&
        (!on_init.provider.descriptor.name || on_init.provider.descriptor.name === '')
      ) {
        errorObj.DescriptorName = `Provider Descriptor Name is Missing or Empty /${constants.ON_INIT}`
      }

      //check time validation
      const checkTimeError = checkProviderTime(on_init?.provider)
      if (Object.keys(checkTimeError).length > 0) Object.assign(errorObj, checkTimeError)

      //time missing
      //descriptormissing, create common function
    } catch (error: any) {
      logger.error(
        `!!Error while comparing provider Id in /${constants.ON_SEARCH} and /${constants.ON_INIT}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Validating fulfillments object for /${constants.ON_INIT}`)
      //fullfilments attribute not present
      if (!on_init?.fulfillments) errorObj.fulfillments = `Fulfillments missing in /${constants.ON_INIT}`

      on_init?.fulfillments &&
        on_init.fulfillments.forEach((fulfillment: any, index: number) => {
          const fulfillmentKey = `fulfillments[${index}]`
          //fulfillment.id missing

          if (fulfillment?.id) {
            fulfillmentIdsSet.add(fulfillment?.id)
            if (!storedFull.includes(fulfillment?.id)) {
              errorObj[`${fulfillmentKey}.id`] =
                `/message/order/fulfillments/id in fulfillments: ${fulfillment.id} should be one of the /fulfillments/id mapped in previous call`
            }
          } else {
            errorObj[`Fulfillment[${index}].id`] = `Fulfillment Id missing in /${constants.ON_INIT}`
          }

          //cross check enumf from contract
          if (!VALID_VEHICLE_CATEGORIES.includes(fulfillment.vehicle.category)) {
            errorObj[`${fulfillmentKey}.vehicleCategory`] =
              `Vehicle category should be one of ${VALID_VEHICLE_CATEGORIES}`
          }

          if (fulfillment.type !== 'TRIP') {
            errorObj[`${fulfillmentKey}.type`] =
              `Fulfillment type must be TRIP at index ${index} in /${constants.ON_INIT}`
          }

          // Check stops for START and END, or time range with valid timestamp and GPS
          const otp = false
          const cancel = false
          //revisit
          const getStopsError = validateStops(fulfillment?.stops, index, otp, cancel)
          if (Object.keys(getStopsError).length > 0) Object.assign(errorObj, getStopsError)

          if (fulfillment?.tags) {
            // Validate route info tags
            const tagsValidation = validateRouteInfoTags(fulfillment.tags)
            if (!tagsValidation.isValid) {
              Object.assign(errorObj, { tags: tagsValidation.errors })
            }
          }
        })
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking fulfillments info in /${constants.ON_INIT},  ${error.message}`)
      return { error: error.message }
    }

    try {
      on_init.items.forEach((item: any, index: number) => {
        if (!newItemIDSValue.includes(item.id)) {
          const key = `item[${index}].item_id`
          errorObj[key] =
            `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in /${constants.ON_INIT}`
        }

        const getDescriptorError = validateItemDescriptor(item, index, VALID_DESCRIPTOR_CODES)
        if (Object.keys(getDescriptorError)?.length) Object.assign(errorObj, getDescriptorError)

        const price = item.price
        if (!price || !price.currency || !price.value) {
          const key = `item${index}_price`
          errorObj[key] = `Price is incomplete in /items[${index}]`
        }

        item.fulfillment_ids.forEach((fulfillmentId: string) => {
          if (!fulfillmentIdsSet.has(fulfillmentId)) {
            errorObj[`invalidFulfillmentId_${index}`] =
              `Fulfillment ID should be one of the fulfillment id  '${fulfillmentId}' at index ${index} in /${constants.ON_INIT} is not valid`
          }
        })
      })
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

    try {
      logger.info(`Checking payments in /${constants.ON_INIT}`)
      on_init?.payments?.forEach((arr: any, i: number) => {
        if (!arr?.collected_by) {
          errorObj[`payemnts[${i}]_collected_by`] = `payments.collected_by must be present in ${constants.ON_INIT}`
        } else {
          const srchCollectBy = getValue(`collected_by`)
          if (srchCollectBy != arr?.collected_by)
            errorObj[`payemnts[${i}]_collected_by`] =
              `payments.collected_by value sent in ${constants.ON_INIT} should be ${srchCollectBy} as sent in ${constants.ON_SEARCH}`
        }

        const validTypes = ['PRE-ORDER', 'ON-FULFILLMENT', 'POST-FULFILLMENT']
        if (!arr?.type || !validTypes.includes(arr.type)) {
          errorObj[`payments[${i}]_type`] = `payments.params.type must be present in ${
            constants.ON_INIT
          } & its value must be one of: ${validTypes.join(', ')}`
        }

        const validStatus = ['NOT-PAID', 'PAID']
        if (!arr?.status || !validStatus.includes(arr.status)) {
          errorObj[`payments[${i}]_status`] = `payments.status must be present in ${
            constants.ON_INIT
          } & its value must be one of: ${validStatus.join(', ')}`
        }

        const params = arr.params
        const bankCode: string | null = getValue('bank_code')
        const bankAccountNumber: string | null = getValue('bank_account_number')
        const virtualPaymentAddress: string | null = getValue('virtual_payment_address')
        // Validate bank_code
        validatePaymentParams(params, bankCode, 'bank_code', errorObj, i, constants.ON_INIT)

        // Validate bank_account_number
        validatePaymentParams(params, bankAccountNumber, 'bank_account_number', errorObj, i, constants.ON_INIT)

        // Validate virtual_payment_address
        validatePaymentParams(params, virtualPaymentAddress, 'virtual_payment_address', errorObj, i, constants.ON_INIT)

        // Validate payment tags
        const tagsValidation = validatePaymentTags(arr.tags)
        if (!tagsValidation.isValid) {
          Object.assign(errorObj, { tags: tagsValidation.errors })
        }
      })
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

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_INIT} API`, err)
    return { error: err.message }
  }
}
