/* eslint-disable no-prototype-builtins */
// import _ from 'lodash'
import constants, { metroSequence } from '../../constants'
import { logger } from '../../shared/logger'
import { validateSchema, isObjectEmpty } from '..'
import { getValue, setValue } from '../../shared/dao'
import {
  validateContext,
  // validatePaymentParams,
  validateQuote,
  validateStops,
  validateCancellationTerms,
} from './metroChecks'
import { validatePaymentsTags } from './tags'
import { isEmpty } from 'lodash'

const VALID_VEHICLE_CATEGORIES = ['AUTO_RICKSHAW', 'CAB', 'METRO', 'BUS', 'AIRLINE']
const VALID_DESCRIPTOR_CODES = ['RIDE', 'SJT', 'SESJT', 'RUT', 'PASS', 'SEAT', 'NON STOP', 'CONNECT']

export const checkOnStatus = (data: any, msgIdSet: any) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [metroSequence.ON_STATUS]: 'Json cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('TRV', constants.ON_STATUS, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.STATUS, constants.ON_STATUS)
    setValue(`${metroSequence.ON_STATUS}_message`, message)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const on_status = message.order
    const itemIDS: any = getValue('ItmIDS')
    const itemIdArray: any[] = []
    const fulfillmentIdsSet = new Set()
    const storedFull: any = getValue(`${metroSequence.ON_INIT}_storedFulfillments`)

    let newItemIDSValue: any[]

    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      on_status.items.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
    }

    setValue('ItmIDS', newItemIDSValue)

    try {
      logger.info(`Checking id in message object  /${constants.ON_STATUS}`)
      if (!on_status.id) {
        errorObj.id = `Id in message object must be present/${constants.ON_STATUS}`
      } else {
        setValue('orderId', on_status?.id)
      }
    } catch (error: any) {
      logger.error(`!!Error while checking id in message object  /${constants.ON_STATUS}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing provider object in /${constants.CONFIRM} and /${constants.ON_STATUS}`)
      if (on_status.provider.id != getValue('providerId')) {
        errorObj.prvdrId = `Provider Id mismatches in /${constants.CONFIRM} and /${constants.ON_STATUS}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while checking provider object in /${constants.CONFIRM} and /${constants.ON_STATUS}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Validating fulfillments object for /${constants.ON_STATUS}`)
      on_status.fulfillments.forEach((fulfillment: any, index: number) => {
        const fulfillmentKey = `fulfillments[${index}]`

        if (!storedFull.includes(fulfillment.id)) {
          errorObj[`${fulfillmentKey}.id`] =
            `/message/order/fulfillments/id in fulfillments: ${fulfillment.id} should be one of the /fulfillments/id mapped in previous call`
        } else {
          fulfillmentIdsSet.add(fulfillment.id)
        }

        if (!fulfillment?.vehicle) {
          errorObj['Vehicle'] = 'Vehicle Object Is Missing'
        } else {
          if (!VALID_VEHICLE_CATEGORIES.includes(fulfillment?.vehicle?.category)) {
            errorObj[`${fulfillmentKey}.vehicleCategory`] =
              `Vehicle category should be one of ${VALID_VEHICLE_CATEGORIES}`
          }
        }

        if (fulfillment.type !== 'TRIP') {
          errorObj[`${fulfillmentKey}.type`] =
            `Fulfillment type must be DELIVERY at index ${index} in /${constants.ON_STATUS}`
        }

        // Check stops for START and END, or time range with valid timestamp and GPS
        const otp = true
        const cancel = false
        validateStops(fulfillment?.stops, index, otp, cancel, constants.ON_STATUS)
      })
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking fulfillments info in /${constants.ON_INIT},  ${error.message}`)
      return { error: error.message }
    }

    try {
      on_status.items &&
        on_status.items.forEach((item: any, index: number) => {
          if (!newItemIDSValue.includes(item.id)) {
            const key = `item[${index}].item_id`
            errorObj[key] =
              `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in /${constants.ON_STATUS}`
          }

          if (!item.descriptor || !item.descriptor.code) {
            const key = `item${index}_descriptor`
            errorObj[key] = `Descriptor is missing in items[${index}]`
          } else {
            if (!VALID_DESCRIPTOR_CODES.includes(item.descriptor.code)) {
              const key = `item${index}_descriptor`
              errorObj[key] =
                `descriptor.code should be one of ${VALID_DESCRIPTOR_CODES} instead of ${item.descriptor.code}`
            }
          }

          const price = item.price
          if (!price || !price.currency || !price.value) {
            const key = `item${index}_price`
            errorObj[key] = `Price is incomplete in /items[${index}]`
          }

          item.fulfillment_ids &&
            item.fulfillment_ids.forEach((fulfillmentId: string) => {
              if (!storedFull.includes(fulfillmentId)) {
                errorObj[`invalidItemFulfillmentId_${index}`] =
                  `Fulfillment ID should be one of the fulfillment id  '${fulfillmentId}' at index ${index} in /${constants.ON_STATUS} should be mapped with the ON_INIT fulfillment id.`
              }
            })
        })
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking items info in /${constants.ON_STATUS},  ${error.message}`)
      return { error: error.message }
    }

    // check payments
    try {
      logger.info(`Checking payments in /${constants.ON_STATUS}`)
      const payments = on_status?.payments
      if (isEmpty(payments)) {
        errorObj.payments = `payments array is missing or is empty`
      } else {
        const allowedStatusValues = ['NOT-PAID', 'PAID']
        const requiredParams = ['bank_code', 'bank_account_number', 'transaction_id', 'amount', 'currency']
        payments?.forEach((arr: any, i: number) => {
          const terms = [
            { code: 'SETTLEMENT_WINDOW', type: 'time', value: '/^(P(d+D)?(T(d+H)?(d+M)?(d+S)?)?)$/' },
            {
              code: 'SETTLEMENT_BASIS',
              type: 'enum',
              value: ['INVOICE_RECEIPT', 'Delivery'],
            },
            { code: 'MANDATORY_ARBITRATION', type: 'boolean' },
            { code: 'STATIC_TERMS', type: 'url' },
            { code: 'COURT_JURISDICTION', type: 'string' },
            { code: 'SETTLEMENT_AMOUNT', type: 'amount' },
            { code: 'SETTLEMENT_TYPE', type: 'enum', value: ['NEFT', 'UPI'] },
          ]

          if (!arr?.collected_by) {
            errorObj[`payemnts[${i}]_collected_by`] = `payments.collected_by must be present in ${constants.ON_STATUS}`
          } else {
            const collectedBy = getValue(`collected_by`)
            if (collectedBy && collectedBy != arr?.collected_by)
              errorObj[`payemnts[${i}]_collected_by`] =
                `payments.collected_by value sent in ${constants.ON_STATUS} should be same as sent in past call: ${collectedBy}`
          }

          // check status
          if (!arr?.status) errorObj.paymentStatus = `payment.status is missing for index:${i} in payments`
          else if (!arr?.status || !allowedStatusValues.includes(arr?.status)) {
            errorObj.paymentStatus = `invalid status at index:${i} in payments, should be either of ${allowedStatusValues}`
          }

          // check type
          const validTypes = ['PRE-ORDER', 'ON-FULFILLMENT', 'POST-FULFILLMENT']
          if (!arr?.type || !validTypes.includes(arr.type)) {
            errorObj[`payments[${i}]_type`] = `payments.type must be present in ${
              constants.ON_STATUS
            } & its value must be one of: ${validTypes.join(', ')}`
          }

          // check params
          const params = arr?.params
          if (!params) errorObj.params = `payment.params is missing for index:${i} in payments`
          else {
            const settlementTerms = arr?.tags.find((tag: any) => tag.descriptor.code === 'SETTLEMENT_TERMS')
            const settlementType = settlementTerms?.list.find((item: any) => item.descriptor.code === 'SETTLEMENT_TYPE')
            if (settlementType && settlementType?.value?.toUpperCase() == 'UPI')
              requiredParams.push('virtual_payment_address')
            const missingParams = requiredParams.filter((param) => !Object.prototype.hasOwnProperty.call(params, param))
            if (missingParams.length > 0) {
              errorObj.missingParams = `Required params ${missingParams.join(', ')} are missing in payments`
            }
          }

          // Validate payment tags
          const tagsValidation = validatePaymentsTags(arr?.tags, terms)
          if (!tagsValidation.isValid) {
            Object.assign(errorObj, { tags: tagsValidation.errors })
          }
        })
      }
    } catch (error: any) {}

    try {
      logger.info(`Checking quote details in /${constants.ON_STATUS}`)
      const quoteErrors = validateQuote(on_status?.quote, constants.ON_STATUS)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking Quote in /${constants.ON_STATUS},  ${error.message}`)
      return { error: error.message }
    }

    try {
      logger.info(`Checking cancellation terms in /${constants.ON_STATUS}`)
      const cancellationErrors = validateCancellationTerms(on_status.cancellation_terms, constants.ON_STATUS)
      Object.assign(errorObj, cancellationErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation_terms in /${constants.ON_STATUS}, ${error.stack}`)
    }

    if (!on_status?.created_at) errorObj.created_at = `created_at is missing in /${constants.ON_STATUS}`
    else {
      const createdAt = getValue('created_at')
      if (on_status?.created_at !== createdAt)
        errorObj.created_at = `created_at should match /${constants.ON_CONFIRM}'s created_at`
    }

    if (!on_status?.updated_at) errorObj.updated_at = `updated_at is missing in /${constants.ON_STATUS}`
    else if (on_status?.updated_at > context?.timestamp)
      errorObj.updated_at = `updated_at should be lesser or equal to context.timestamp in /${constants.ON_STATUS}`

    try {
      logger.info(`Checking status in message object  /${constants.ON_STATUS}`)
      if (!message.order.status) errorObj.status = 'status is missing in the message.order object'
      else if (!['COMPLETE', 'ACTIVE'].includes(message.order.status)) {
        errorObj.status = 'Invalid value for status in the message.order object. Should be one of: COMPLETE or ACTIVE'
      }
    } catch (error: any) {
      logger.error(`!!Error while checking status in message.order object  /${constants.ON_STATUS}, ${error.stack}`)
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_STATUS} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}
