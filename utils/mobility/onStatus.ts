/* eslint-disable no-prototype-builtins */
// import _ from 'lodash'
import constants, {
  mobilitySequence,
  MOB_VEHICLE_CATEGORIES as VALID_VEHICLE_CATEGORIES,
  MOB_FULL_STATE as VALID_FULL_STATE,
} from '../../constants'
import { logger } from '../../shared/logger'
import { validateSchema, isObjectEmpty } from '../'
import { getValue, setValue } from '../../shared/dao'
import {
  validateCancellationTerms,
  validateContext,
  validatePaymentParams,
  validateQuote,
  validateStops,
} from './mobilityChecks'
import { validatePaymentTags, validateRouteInfoTags } from './tags'

export const checkOnStatus = (data: any, msgIdSet: any) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [mobilitySequence.ON_STATUS]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.ON_STATUS, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.STATUS, constants.ON_STATUS)
    setValue(`${mobilitySequence.ON_STATUS}`, data)

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
    const storedFull: any = getValue(`${mobilitySequence.ON_SELECT}_storedFulfillments`)

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
      logger.info(`Comparing provider object in /${constants.STATUS} and /${constants.ON_STATUS}`)
      if (on_status.provider.id != getValue('providerId')) {
        errorObj.prvdrId = `Provider Id mismatches in /${constants.STATUS} and /${constants.ON_STATUS}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while checking provider object in /${constants.STATUS} and /${constants.ON_STATUS}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Validating fulfillments object for /${constants.ON_STATUS}`)
      on_status.fulfillments.forEach((fulfillment: any, index: number) => {
        const fulfillmentKey = `fulfillments[${index}]`

        if (!storedFull.includes(fulfillment.id)) {
          errorObj[
            `${fulfillmentKey}.id`
          ] = `/message/order/fulfillments/id in fulfillments: ${fulfillment.id} should be one of the /fulfillments/id mapped in previous call`
        } else {
          fulfillmentIdsSet.add(fulfillment.id)
        }

        if (!VALID_VEHICLE_CATEGORIES.includes(fulfillment.vehicle.category)) {
          errorObj[`${fulfillmentKey}.vehicleCategory`] = `Invalid vehicle category for fulfillment ${index}`
        }

        if (!VALID_FULL_STATE.includes(fulfillment?.state?.descriptor?.code)) {
          errorObj[`${fulfillmentKey}.state`] = `Invalid or missing descriptor.code for fulfillment ${index}`
        }

        const vehicle = fulfillment.vehicle

        if (!vehicle?.registration || !vehicle?.model || !vehicle?.make) {
          errorObj[`${fulfillmentKey}.details`] = `Vehicle object is incomplete for fulfillment ${index}`
        }

        if (fulfillment.type !== 'DELIVERY') {
          errorObj[
            `${fulfillmentKey}.type`
          ] = `Fulfillment type must be DELIVERY at index ${index} in /${constants.ON_STATUS}`
        }

        if (!Object.prototype.hasOwnProperty.call(fulfillment.customer?.person, 'name')) {
          errorObj[`fulfillments${index}_customer`] = `/message/order/fulfillments/customer in customer: must have name`
        } else {
          if (fulfillment.customer.person.name.trim() === '') {
            errorObj[`fulfillments${index}_customer_name`] = `Empty name is not allowed for fulfillment ${index}`
          } else {
            setValue(`customer_name`, fulfillment.customer.person.name)
          }
        }

        if (!Object.prototype.hasOwnProperty.call(fulfillment.customer?.contact, 'phone')) {
          errorObj[`fulfillments${index}_customer`] = `/message/order/fulfillments/customer in customer: must have name`
        } else {
          const phoneRegex = /^[0-9]{10}$/
          const isValidPhone = phoneRegex.test(fulfillment.customer.contact.phone)
          if (!isValidPhone) {
            errorObj[`fulfillments${index}_customer_phone`] = `Invalid phone format for fulfillment ${index}`
          } else {
            setValue(`customer_phone`, fulfillment.customer.contact.phone)
          }
        }

        if (!Object.prototype.hasOwnProperty.call(fulfillment.agent?.person, 'name')) {
          errorObj[`fulfillments${index}_agent`] = `/message/order/fulfillments/agent in agent: must have name`
        } else {
          if (fulfillment.agent.person.name.trim() === '') {
            errorObj[`fulfillments${index}_agent_name`] = `Empty name is not allowed for fulfillment ${index}`
          } else {
            setValue(`agent_name`, fulfillment.agent.person.name)
          }
        }

        if (!Object.prototype.hasOwnProperty.call(fulfillment.agent?.contact, 'phone')) {
          errorObj[`fulfillments${index}_agent`] = `/message/order/fulfillments/agent in agent: must have name`
        } else {
          const phoneRegex = /^[0-9]{10}$/
          const isValidPhone = phoneRegex.test(fulfillment.agent.contact.phone)
          if (!isValidPhone) {
            errorObj[`fulfillments${index}_agent_phone`] = `Invalid phone format for fulfillment ${index}`
          } else {
            setValue(`agent_phone`, fulfillment.agent.contact.phone)
          }
        }

        // Check stops for START and END, or time range with valid timestamp and GPS
        const otp = true
        const cancel = false
        validateStops(fulfillment?.stops, index, otp, cancel)

        if (fulfillment.tags) {
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
      logger.info(`Checking payments in /${constants.ON_STATUS}`)
      on_status?.payments?.forEach((arr: any, i: number) => {
        if (!arr?.collected_by) {
          errorObj[`payemnts[${i}]_collected_by`] = `payments.collected_by must be present in ${constants.ON_SELECT}`
        } else {
          const srchCollectBy = getValue(`collected_by`)
          if (srchCollectBy != arr?.collected_by)
            errorObj[
              `payemnts[${i}]_collected_by`
            ] = `payments.collected_by value sent in ${constants.ON_SELECT} should be ${srchCollectBy} as sent in ${constants.ON_STATUS}`
        }

        const validTypes = ['PRE-ORDER', 'ON-FULFILLMENT', 'POST-FULFILLMENT']
        if (!arr?.type || !validTypes.includes(arr.type)) {
          errorObj[`payments[${i}]_type`] = `payments.params.type must be present in ${
            constants.ON_STATUS
          } & its value must be one of: ${validTypes.join(', ')}`
        }

        const params = arr.params
        const bankCode: string | null = getValue('bank_code')
        const bankAccountNumber: string | null = getValue('bank_account_number')
        const virtualPaymentAddress: string | null = getValue('virtual_payment_address')
        // Validate bank_code
        validatePaymentParams(params, bankCode, 'bank_code', errorObj, i, constants.ON_STATUS)

        // Validate bank_account_number
        validatePaymentParams(params, bankAccountNumber, 'bank_account_number', errorObj, i, constants.ON_STATUS)

        // Validate virtual_payment_address
        validatePaymentParams(
          params,
          virtualPaymentAddress,
          'virtual_payment_address',
          errorObj,
          i,
          constants.ON_STATUS,
        )

        const validStatus = ['NOT-PAID', 'PAID']
        if (!arr?.status || !validStatus.includes(arr.status)) {
          errorObj[`payments[${i}]_status`] = `payments.status must be present in ${
            constants.ON_STATUS
          } & its value must be one of: ${validStatus.join(', ')}`
        } else {
          if (arr.status === 'PAID') {
            if (!arr?.params?.transaction_id) {
              errorObj[`payments[${i}]_transaction_id`] = `payments.params.transaction_id is required for 'PAID' status`
            } else {
              if (typeof arr?.params?.transaction_id !== 'string') {
                errorObj[`payments[${i}]_transaction_id`] = `payments.params.transaction_id must be a string`
              }
            }

            if (!arr?.params?.amount) {
              errorObj[`payments[${i}]_amount`] = `payments.params.amount is required for 'PAID' status`
            } else {
              const amount = parseFloat(arr?.params?.amount)
              if (isNaN(amount) || amount <= 0 || !Number.isInteger(amount)) {
                errorObj[`payments[${i}]_amount`] = `payments.params.amount must be a positive integer`
              }
            }
          }
        }

        // Validate payment tags
        const tagsValidation = validatePaymentTags(arr.tags)
        if (!tagsValidation.isValid) {
          Object.assign(errorObj, { tags: tagsValidation.errors })
        }
      })
    } catch (error: any) {
      logger.error(`!!Errors while checking payments in /${constants.ON_STATUS}, ${error.stack}`)
    }

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

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_STATUS} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}
