/* eslint-disable no-prototype-builtins */
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
} from './metroChecks'
import { validatePaymentTags, validateRouteInfoTags } from './tags'

const VALID_VEHICLE_CATEGORIES = ['AUTO_RICKSHAW', 'CAB', 'METRO', 'BUS', 'AIRLINE']
const VALID_DESCRIPTOR_CODES = ['RIDE', 'SJT', 'SESJT', 'RUT', 'PASS', 'SEAT', 'NON STOP', 'CONNECT']

export const checkOnConfirm = (data: any, msgIdSet: any, flow: { flow: string; flowSet: string }) => {
  const errorObj: any = {}
  const payment = getValue('paymentId')
  const paymentAmount = getValue('paramsAmount')
  const paymentTransactionId = getValue('paramsTransactionId')
  try {
    if (!data || isObjectEmpty(data)) {
      return { [metroSequence.ON_CONFIRM]: 'Json cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('TRV', constants.ON_CONFIRM, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.CONFIRM, constants.ON_CONFIRM)
    setValue(`${metroSequence.ON_CONFIRM}_message`, message)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const on_confirm = message.order
    const itemIDS: any = getValue('ItmIDS')
    const itemIdArray: any[] = []
    const fulfillmentIdsSet = new Set()
    const storedFull: any = getValue(`${metroSequence.ON_INIT}_storedFulfillments`)
    // const getFulfillmentId = getValue('StoredFulfillmentId') || []

    let newItemIDSValue: any[]

    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      on_confirm.items.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
    }

    setValue('ItmIDS', newItemIDSValue)

    try {
      logger.info(`Checking id in message object  /${constants.ON_CONFIRM}`)
      if (!on_confirm.id) {
        errorObj.id = `Id in message object must be present/${constants.ON_CONFIRM}`
      } else {
        setValue('orderId', on_confirm?.id)
      }
    } catch (error: any) {
      logger.error(`!!Error while checking id in message object  /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing provider object in /${constants.CONFIRM} and /${constants.ON_CONFIRM}`)
      if (on_confirm.provider.id != getValue('providerId')) {
        errorObj.prvdrId = `Provider Id mismatches in /${constants.CONFIRM} and /${constants.ON_CONFIRM}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while checking provider object in /${constants.CONFIRM} and /${constants.ON_CONFIRM}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Validating fulfillments object for /${constants.ON_CONFIRM}`)
      on_confirm.fulfillments.forEach((fulfillment: any, index: number) => {
        const fulfillmentKey = `fulfillments[${index}]`

        if (!storedFull.includes(fulfillment?.id)) {
          errorObj[`${fulfillmentKey}.id`] =
            `/message/order/fulfillments/id in fulfillments: ${fulfillment.id} should be one of the /fulfillments/id mapped in ${constants.ON_INIT}`
        } else {
          fulfillmentIdsSet.add(fulfillment?.id)
        }

        if (!fulfillment?.vehicle) {
          errorObj['Vehicle'] = 'Vehicle Object Is Missing'
        } else {
          if (!VALID_VEHICLE_CATEGORIES.includes(fulfillment.vehicle.category)) {
            errorObj[`${fulfillmentKey}.vehicleCategory`] =
              `Vehicle category should be one of ${VALID_VEHICLE_CATEGORIES}`
          }
        }

        if (fulfillment.type !== 'TRIP') {
          errorObj[`${fulfillmentKey}.type`] =
            `Fulfillment type must be DELIVERY at index ${index} in /${constants.ON_CONFIRM}`
        }

        // Check stops for START and END, or time range with valid timestamp and GPS
        const otp = true
        const cancel = false
        const getStopsError = validateStops(fulfillment?.stops, index, otp, cancel, constants.ON_CONFIRM)
        const errorValue = Object.values(getStopsError)[0] || []
        if (Object.keys(getStopsError).length > 0 && Object.keys(errorValue)?.length)
          Object.assign(errorObj, getStopsError)

        if (fulfillment.tags) {
          // Validate route info tags
          if (String(flow.flow.toUpperCase()).includes('INTRACITY')) {
            const tagsValidation = validateRouteInfoTags(fulfillment.tags)
            if (!tagsValidation.isValid) {
              Object.assign(errorObj, { tags: tagsValidation.errors })
            }
          }
        }
      })
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking fulfillments info in /${constants.ON_INIT},  ${error.message}`)
      return { error: error.message }
    }

    try {
      on_confirm.items &&
        on_confirm.items.forEach((item: any, index: number) => {
          if (!newItemIDSValue.includes(item.id)) {
            const key = `item[${index}].item_id`
            errorObj[key] =
              `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in /${constants.ON_INIT}`
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
              if (!fulfillmentIdsSet.has(fulfillmentId)) {
                errorObj[`invalidFulfillmentId_${index}`] =
                  `Fulfillment ID should be one of the fulfillment id  '${fulfillmentId}' at index ${index} in /${constants.ON_CONFIRM} is not valid`
              }
            })
        })
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking items info in /${constants.ON_CONFIRM},  ${error.message}`)
      return { error: error.message }
    }

    try {
      logger.info(`Checking payments in /${constants.ON_CONFIRM}`)
      on_confirm?.payments?.forEach((arr: any, i: number) => {
        if (!arr?.collected_by) {
          errorObj[`payemnts[${i}]_collected_by`] = `payments.collected_by must be present in ${constants.ON_SEARCH}`
        } else {
          const srchCollectBy = getValue(`collected_by`)
          if (srchCollectBy != arr?.collected_by)
            errorObj[`payemnts[${i}]_collected_by`] =
              `payments.collected_by value sent in ${constants.ON_SEARCH} should be ${srchCollectBy} as sent in ${constants.ON_CONFIRM}`
        }

        if (!arr.id) errorObj[`payments[${i}]_id`] = `payments.id must be present in ${constants.ON_CONFIRM}`

        if (arr?.id && arr?.id !== payment)
          errorObj[`payments[${i}]_id`] = `payments.id valueshould be ${payment} as sent in ${constants.CONFIRM}`

        const validTypes = ['PRE-ORDER', 'ON-FULFILLMENT', 'POST-FULFILLMENT']
        if (!arr?.type || !validTypes.includes(arr.type)) {
          errorObj[`payments[${i}]_type`] = `payments.params.type must be present in ${
            constants.ON_CONFIRM
          } & its value must be one of: ${validTypes.join(', ')}`
        }

        const validStatus = ['NOT-PAID', 'PAID']
        if (!arr?.status || !validStatus.includes(arr.status)) {
          errorObj[`payments[${i}]_status`] = `payments.status must be present in ${
            constants.ON_CONFIRM
          } & its value must be one of: ${validStatus.join(', ')}`
        }

        const params = arr.params
        const bankCode: string | null = getValue('bank_code')
        const bankAccountNumber: string | null = getValue('bank_account_number')
        const virtualPaymentAddress: string | null = getValue('virtual_payment_address')

        //--------------------------------------------------------
        if (!params) {
          errorObj[`payments[${i}]_params`] = `payments.params must be present in ${constants.CONFIRM}`
        } else {
          const { amount, currency, transaction_id } = params

          if (!amount) {
            errorObj[`payments[${i}]_params_amount`] = `payments.params.amount must be present in ${constants.ON_CONFIRM}`
          } else if (amount !== paymentAmount) {
            errorObj[`payments[${i}]_params_amount`] =
              `payments.params.amount must match with the ${paymentAmount} in ${constants.ON_CONFIRM}`
          }

          if (!currency) {
            errorObj[`payments[${i}]_params_currency`] =
              `payments.params.currency must be present in ${constants.CONFIRM}`
          } else if (currency !== 'INR') {
            errorObj[`payments[${i}]_params_currency`] = `payments.params.currency must be INR in ${constants.ON_CONFIRM}`
          }

          if (!transaction_id) {
            errorObj[`payments[${i}]_params_transaction_id`] =
              `payments.params.transaction_id must be present in ${constants.ON_CONFIRM}`
          } else if (transaction_id !== paymentTransactionId) {
            errorObj[`payments[${i}]_params_transaction_id`] =
              `payments.params.transaction_id must match with the ${paymentTransactionId} in ${constants.ON_CONFIRM}`
          }
        }
        // Validate bank_code
        validatePaymentParams(params, bankCode, 'bank_code', errorObj, i, constants.ON_CONFIRM)

        // Validate bank_account_number
        validatePaymentParams(params, bankAccountNumber, 'bank_account_number', errorObj, i, constants.ON_CONFIRM)

        // Validate virtual_payment_address
        validatePaymentParams(
          params,
          virtualPaymentAddress,
          'virtual_payment_address',
          errorObj,
          i,
          constants.ON_CONFIRM,
        )

        if (arr.time) {
          if (!arr.label || arr.label !== 'INSTALLMENT') {
            errorObj.time.label = `If time is present in payment, the corresponding label should be INSTALLMENT.`
          }
        }

        // Validate payment tags
        const tagsValidation = validatePaymentTags(arr.tags, constants?.ON_CONFIRM)
        if (!tagsValidation.isValid) {
          Object.assign(errorObj, { tags: tagsValidation.errors })
        }
      })
    } catch (error: any) {
      logger.error(`!!Errors while checking payments in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Checking quote details in /${constants.ON_CONFIRM}`)
      const quoteErrors = validateQuote(on_confirm?.quote, constants.ON_CONFIRM)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking Quote in /${constants.ON_CONFIRM},  ${error.message}`)
      return { error: error.message }
    }

    try {
      logger.info(`Checking cancellation terms in /${constants.ON_CONFIRM}`)
      const cancellationErrors = validateCancellationTerms(on_confirm.cancellation_terms, constants.ON_CONFIRM)
      Object.assign(errorObj, cancellationErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation_terms in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Checking status in message object  /${constants.ON_CONFIRM}`)
      if (!message.order.status || !['COMPLETE', 'ACTIVE'].includes(message.order.status)) {
        errorObj.status =
          'Invalid or missing"` status in the message.order object. It must be one of: COMPLETE or ACTIVE'
      }
    } catch (error: any) {
      logger.error(`!!Error while checking status in message.order object  /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    if (!on_confirm?.created_at) errorObj.created_at = `created_at is missing in /${constants.ON_CONFIRM}`
    else if (on_confirm?.created_at !== context?.timestamp)
      errorObj.created_at = `created_at must match with context.timestamp in /${constants.ON_CONFIRM}`

    if (!on_confirm?.updated_at) errorObj.updated_at = `updated_at is missing in /${constants.ON_CONFIRM}`
    else if (on_confirm?.updated_at !== context?.timestamp)
      errorObj.updated_at = `updated_at must match with context.timestamp in /${constants.ON_CONFIRM}`

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_CONFIRM} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}
