import { logger } from '../../../shared/logger'
import { getValue, setValue } from '../../../shared/dao'
import { validatePaymentTags, validateRouteInfoTags } from '../../metro/tags'
import constants, { airlinesSequence } from '../../../constants'
import { validateCancellationTerms, validateQuote, validateStops } from '../../metro/metroChecks'
import { validateSchema, isObjectEmpty } from '../../'
import { validateContext } from '../../metro/metroChecks'
import { validateParams } from '../../metro/validate/helper'
import { isEmpty } from 'lodash'
import { compareItems, validateQuotePricing } from './functions/helper'

const VALID_VEHICLE_CATEGORIES = ['AUTO_RICKSHAW', 'CAB', 'METRO', 'BUS', 'AIRLINE']
const validTypes = ['PRE-ORDER', 'ON-FULFILLMENT', 'POST-FULFILLMENT']
const validStatus = ['NOT-PAID', 'PAID']

export const checkOnCancelPayload = (
  data: any,
  msgIdSet: any,
  flow: { flow: string; flowSet: string },
  cancelType: boolean,
) => {
  const errorObj: any = {}
  const payment = getValue('paymentId')
  try {
    if (!data || isObjectEmpty(data)) {
      return { [constants.ON_CANCEL]: 'Json cannot be empty' }
    }
    const onConfirmMessage = getValue('on_confirm_message')

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('TRV12', constants.ON_CANCEL, data)
    const contextRes: any = validateContext(
      context,
      msgIdSet,
      cancelType ? airlinesSequence?.CANCEL : airlinesSequence?.CANCEL,
      cancelType ? airlinesSequence?.ON_CANCEL : airlinesSequence?.ON_CANCEL,
    )
    setValue(`${constants.ON_CANCEL}_message`, message)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const on_cancel = message.order
    const itemIDS: any = getValue('ItmIDS')
    const orderId = getValue('orderId')
    const itemIdArray: any[] = []
    const fulfillmentIdsSet = new Set()
    const storedFull: any = getValue(`${airlinesSequence.ON_CONFIRM}_storedFulfillments`)
    // const getFulfillmentId = getValue('StoredFulfillmentId') || []

    let newItemIDSValue: any[]

    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      on_cancel.items.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
    }

    setValue('ItmIDS', newItemIDSValue)

    try {
      logger.info(`Checking id in message object  /${constants.ON_CANCEL}`)
      if (!on_cancel.id) {
        errorObj.id = `Order ID must be present/${constants.ON_CANCEL}`
      } else if (on_cancel?.id !== orderId) {
        errorObj['order_id'] = `order_id should be same as in /${constants.ON_CONFIRM}`
      }
    } catch (error: any) {
      logger.error(`!!Error while checking id in message object  /${constants.ON_CANCEL}, ${error.stack}`)
    }

    if (!on_cancel?.status) errorObj.status = `status should be sent in /${constants.CONFIRM}`
    else if (on_cancel?.status != (cancelType ? 'CANCELLED' : 'SOFT_CANCEL'))
      errorObj['status'] = `status should be ${cancelType ? 'CANCELLED' : 'SOFT_CANCEL'} in /${constants.ON_CANCEL}`

    try {
      logger.info(`Comparing provider object in /${constants.CONFIRM} and /${constants.ON_CANCEL}`)
      if (on_cancel?.provider?.id != getValue('providerId')) {
        errorObj.prvdrId = `Provider Id mismatches in /${constants.CONFIRM} and /${constants.ON_CANCEL}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while checking provider object in /${constants.CONFIRM} and /${constants.ON_CANCEL}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Validating fulfillments object for /${constants.ON_CANCEL}`)
      on_cancel?.fulfillments?.forEach((fulfillment: any, index: number) => {
        const fulfillmentKey = `fulfillments[${index}]`

        if (!isEmpty(storedFull) && !storedFull.includes(fulfillment?.id)) {
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
            `Fulfillment type must be DELIVERY at index ${index} in /${constants.ON_CANCEL}`
        }

        // Check stops for START and END, or time range with valid timestamp and GPS
        const getStopsError = validateStops(fulfillment?.stops, index, false, false, constants.ON_CANCEL)
        const errorValue = Object.values(getStopsError)[0] || []
        if (Object.keys(getStopsError).length > 0 && Object.keys(errorValue)?.length)
          Object.assign(errorObj, getStopsError)

        if (fulfillment.tags) {
          // Validate route info tags
          if (String(flow.flow.toUpperCase()).includes('AIRLINES')) {
            const tagsValidation = validateRouteInfoTags(fulfillment.tags)
            if (!tagsValidation.isValid) {
              Object.assign(errorObj, { tags: tagsValidation.errors })
            }
          }
        }
      })
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking fulfillments info in /${constants.ON_CANCEL},  ${error.message}`)
      return { error: error.message }
    }

    try {
      if(on_cancel?.items){
        const itemsCheck = compareItems(on_cancel?.items, newItemIDSValue);
        if(!itemsCheck.success){
          Object.assign(errorObj, itemsCheck.data)

        }
        if(onConfirmMessage?.order?.items && JSON.stringify(onConfirmMessage?.order?.items) !== JSON.stringify(on_cancel?.items)){
          errorObj[`Items:error`] = `Items mismatch in ${constants.ON_CONFIRM} and ${constants.ON_CANCEL}`
        }

      }
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking items info in /${constants.ON_CANCEL},  ${error.message}`)
      return { error: error.message }
    }

    try {
      logger.info(`Checking payments in /${constants.ON_CANCEL}`)
      on_cancel?.payments?.forEach((arr: any, i: number) => {
        if (!arr?.collected_by) {
          errorObj[`payemnts[${i}]_collected_by`] = `payments.collected_by must be present in ${constants.ON_SEARCH}`
        } else {
          const srchCollectBy = getValue(`collected_by`)
          if (srchCollectBy != arr?.collected_by)
            errorObj[`payemnts[${i}]_collected_by`] =
              `payments.collected_by value sent in ${constants.ON_SEARCH} should be ${srchCollectBy} as sent in ${constants.ON_CANCEL}`
        }

        if (!arr.id) errorObj[`payments[${i}]_id`] = `payments.id must be present in ${constants.ON_CANCEL}`

        if (arr?.id && arr?.id !== payment)
          errorObj[`payments[${i}]_id`] = `payments.id value should be ${payment} as sent in ${constants.CONFIRM}`

        if (!arr?.type || !validTypes.includes(arr.type)) {
          errorObj[`payments[${i}]_type`] = `payments.params.type must be present in ${
            constants.ON_CANCEL
          } & its value must be one of: ${validTypes.join(', ')}`
        }

        if (!arr?.status || !validStatus.includes(arr.status)) {
          errorObj[`payments[${i}]_status`] = `payments.status must be present in ${
            constants.ON_CANCEL
          } & its value must be one of: ${validStatus.join(', ')}`
        }

        // const params = arr.params
        // const bankCode: string | null = getValue('bank_code')
        // const bankAccountNumber: string | null = getValue('bank_account_number')
        // const virtualPaymentAddress: string | null = getValue('virtual_payment_address')

        //---------------------------PAYMENT PARAMS-----------------------------
        const payment_type = getValue('INIT_PAYMENT_TYPE') ?? 'NEFT'
        const validatePayementParams = validateParams(arr.params, arr?.collected_by, constants.ON_CANCEL, payment_type)
        if (!isEmpty(validatePayementParams)) Object.assign(errorObj, validatePayementParams)
        // if (!params) {
        //   errorObj[`payments[${i}]_params`] = `payments.params must be present in ${constants.CONFIRM}`
        // }
        // // Validate bank_code
        // validatePaymentParams(params, bankCode, 'bank_code', errorObj, i, constants.ON_CANCEL)

        // // Validate bank_account_number
        // validatePaymentParams(params, bankAccountNumber, 'bank_account_number', errorObj, i, constants.ON_CANCEL)

        // // Validate virtual_payment_address
        // validatePaymentParams(
        //   params,
        //   virtualPaymentAddress,
        //   'virtual_payment_address',
        //   errorObj,
        //   i,
        //   constants.ON_CANCEL,
        // )

        if (arr.time) {
          if (!arr.label || arr.label !== 'INSTALLMENT') {
            errorObj.time.label = `If time is present in payment, the corresponding label should be INSTALLMENT.`
          }
        }

        // Validate payment tags
        const tagsValidation = validatePaymentTags(arr.tags, constants?.ON_CANCEL)
        if (!tagsValidation.isValid) {
          Object.assign(errorObj, { tags: tagsValidation.errors })
        }
      })
    } catch (error: any) {
      logger.error(`!!Errors while checking payments in /${constants.ON_CANCEL}, ${error.stack}`)
    }

    try {
      logger.info(`Checking quote details in /${constants.ON_CANCEL}`)
      const quotePriceCheck = validateQuotePricing(on_cancel?.quote)
      if(!quotePriceCheck.success){
        Object.assign(errorObj, quotePriceCheck.data)
      }
      const quoteErrors = validateQuote(on_cancel?.quote, constants.ON_CANCEL)
      Object.assign(errorObj, quoteErrors)
      if(onConfirmMessage?.order?.quote && JSON.stringify(onConfirmMessage?.order?.quote) !== JSON.stringify(on_cancel?.quote)){
        errorObj[`Quote:error`] = `Quote mismatch in ${constants.ON_CONFIRM} and ${constants.ON_CANCEL}`
      }
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking Quote in /${constants.ON_CANCEL},  ${error.message}`)
      return { error: error.message }
    }

    try {
      logger.info(`Checking cancellation terms in /${constants.ON_CANCEL}`)
      const cancellationErrors = validateCancellationTerms(on_cancel.cancellation_terms, constants.ON_CANCEL)
      Object.assign(errorObj, cancellationErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation_terms in /${constants.ON_CANCEL}, ${error.stack}`)
    }

    try {
      const { cancellation } = on_cancel || {}

      if (!cancellation) {
        errorObj.cancellation = `cancellation is missing in /${constants.ON_CANCEL}`
      } else {
        const { cancelled_by, time } = cancellation

        if (!cancelled_by) {
          errorObj.cancelled_by = `cancelled_by is missing in /${constants.ON_CANCEL}`
        } else if (cancelled_by !== 'CONSUMER') {
          errorObj.cancelled_by = `cancelled_by must be CONSUMER in /${constants.ON_CANCEL}`
        }

        if (!time) {
          errorObj.time = `time is missing in /${constants.ON_CANCEL}`
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation in /${constants.ON_CANCEL}, ${error.stack}`)
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_CANCEL} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}
