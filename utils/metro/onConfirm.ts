/* eslint-disable no-prototype-builtins */
// import _ from 'lodash'
import constants, { metroSequence } from '../../constants'
import { logger } from '../../shared/logger'
import { validateSchema, isObjectEmpty } from '..'
import { getValue, setValue } from '../../shared/dao'
import { validateContext, validatePaymentParams, validateQuote, validateStops } from './metroChecks'
import { validatePaymentTags, validateRouteInfoTags } from './tags'

const VALID_VEHICLE_CATEGORIES = ['AUTO_RICKSHAW', 'CAB', 'METRO', 'BUS', 'AIRLINE']
const VALID_FULL_STATE = [
  'RIDE_CANCELLED',
  'RIDE_ENDED',
  'RIDE_STARTED',
  'RIDE_ASSIGNED',
  'RIDE_ENROUTE_PICKUP',
  'RIDE_ARRIVED_PICKUP',
]
const VALID_DESCRIPTOR_CODES = ['RIDE', 'SJT', 'SESJT', 'RUT', 'PASS', 'SEAT', 'NON STOP', 'CONNECT']

export const checkOnConfirm = (data: any, msgIdSet: any) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [metroSequence.ON_CONFIRM]: 'Json cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.MET_ONCONFIRM, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.MET_CONFIRM, constants.MET_ONCONFIRM)
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
    const storedFull: any = getValue(`${metroSequence.ON_SELECT}_storedFulfillments`)

    let newItemIDSValue: any[]

    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      on_confirm.items.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
      console.log('test')
    }

    setValue('ItmIDS', newItemIDSValue)

    try {
      logger.info(`Checking id in message object  /${constants.MET_ONCONFIRM}`)
      if (!on_confirm.id) {
        errorObj.id = `Id in message object must be present/${constants.MET_ONCONFIRM}`
      } else {
        setValue('orderId', on_confirm?.id)
      }
    } catch (error: any) {
      logger.error(`!!Error while checking id in message object  /${constants.MET_ONCONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing provider object in /${constants.MET_CONFIRM} and /${constants.MET_ONCONFIRM}`)
      if (on_confirm.provider.id != getValue('providerId')) {
        errorObj.prvdrId = `Provider Id mismatches in /${constants.MET_CONFIRM} and /${constants.MET_ONCONFIRM}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while checking provider object in /${constants.MET_CONFIRM} and /${constants.MET_ONCONFIRM}, ${error.stack}`,
      )
    }

    console.log('on_confirm.items', on_confirm.items)

    try {
      on_confirm.items &&
        on_confirm.items.forEach((item: any, index: number) => {
          if (!newItemIDSValue.includes(item.id)) {
            const key = `item[${index}].item_id`
            errorObj[
              key
            ] = `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in /${constants.MET_ONCONFIRM}`
          }

          if (!item.descriptor || !item.descriptor.code) {
            const key = `item${index}_descriptor`
            errorObj[key] = `Descriptor is missing in items[${index}]`
          } else {
            if (!VALID_DESCRIPTOR_CODES.includes(item.descriptor.code)) {
              const key = `item${index}_descriptor`
              errorObj[
                key
              ] = `descriptor.code should be one of ${VALID_DESCRIPTOR_CODES} instead of ${item.descriptor.code}`
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
                errorObj[
                  `invalidFulfillmentId_${index}`
                ] = `Fulfillment ID should be one of the fulfillment id  '${fulfillmentId}' at index ${index} in /${constants.MET_ONCONFIRM} is not valid`
              }
            })

          // Validate item tags
          const tagsValidation = validateRouteInfoTags(item.tags)
          if (!tagsValidation.isValid) {
            Object.assign(errorObj, { tags: tagsValidation.errors })
          }
        })
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking items info in /${constants.MET_ONCONFIRM},  ${error.message}`)
      return { error: error.message }
    }

    try {
      logger.info(`Validating fulfillments object for /${constants.MET_ONCONFIRM}`)
      on_confirm.fulfillments.forEach((fulfillment: any, index: number) => {
        const fulfillmentKey = `fulfillments[${index}]`

        if (!storedFull.includes(fulfillment.id)) {
          errorObj[
            `${fulfillmentKey}.id`
          ] = `/message/order/fulfillments/id in fulfillments: ${fulfillment.id} should be one of the /fulfillments/id mapped in previous call`
        } else {
          fulfillmentIdsSet.add(fulfillment.id)
        }

        if (!VALID_VEHICLE_CATEGORIES.includes(fulfillment.vehicle.category)) {
          errorObj[
            `${fulfillmentKey}.vehicleCategory`
          ] = `Vehicle category should be one of ${VALID_VEHICLE_CATEGORIES}`
        }

        if (!VALID_FULL_STATE.includes(fulfillment?.state?.descriptor?.code)) {
          errorObj[`${fulfillmentKey}.state`] = `Invalid descriptor code for fulfillment ${index}`
        }

        const vehicle = fulfillment.vehicle

        if (!vehicle?.registration || !vehicle?.model || !vehicle?.make) {
          errorObj[`${fulfillmentKey}.details`] = `Vehicle object is incomplete for fulfillment ${index}`
        }

        if (fulfillment.type !== 'DELIVERY') {
          errorObj[
            `${fulfillmentKey}.type`
          ] = `Fulfillment type must be DELIVERY at index ${index} in /${constants.MET_ONCONFIRM}`
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

        // Validate route info tags
        const tagsValidation = validateRouteInfoTags(fulfillment.tags)
        if (!tagsValidation.isValid) {
          Object.assign(errorObj, { tags: tagsValidation.errors })
        }
      })
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking fulfillments info in /${constants.MET_ONINIT},  ${error.message}`)
      return { error: error.message }
    }

    try {
      logger.info(`Checking payments in /${constants.MET_ONCONFIRM}`)
      on_confirm?.payments?.forEach((arr: any, i: number) => {
        if (!arr?.collected_by) {
          errorObj[`payemnts[${i}]_collected_by`] = `payments.collected_by must be present in ${constants.MET_ONSELECT}`
        } else {
          const srchCollectBy = getValue(`collected_by`)
          if (srchCollectBy != arr?.collected_by)
            errorObj[
              `payemnts[${i}]_collected_by`
            ] = `payments.collected_by value sent in ${constants.MET_ONSELECT} should be ${srchCollectBy} as sent in ${constants.MET_ONCONFIRM}`
        }

        const validTypes = ['PRE-ORDER', 'ON-FULFILLMENT', 'POST-FULFILLMENT']
        if (!arr?.type || !validTypes.includes(arr.type)) {
          errorObj[`payments[${i}]_type`] = `payments.params.type must be present in ${
            constants.MET_ONCONFIRM
          } & its value must be one of: ${validTypes.join(', ')}`
        }

        const validStatus = ['NOT-PAID', 'PAID']
        if (!arr?.status || !validStatus.includes(arr.status)) {
          errorObj[`payments[${i}]_status`] = `payments.status must be present in ${
            constants.MET_ONCONFIRM
          } & its value must be one of: ${validStatus.join(', ')}`
        }

        const params = arr.params
        const bankCode: string | null = getValue('bank_code')
        const bankAccountNumber: string | null = getValue('bank_account_number')
        const virtualPaymentAddress: string | null = getValue('virtual_payment_address')
        // Validate bank_code
        validatePaymentParams(params, bankCode, 'bank_code', errorObj, i, constants.MET_ONCONFIRM)

        // Validate bank_account_number
        validatePaymentParams(params, bankAccountNumber, 'bank_account_number', errorObj, i, constants.MET_ONCONFIRM)

        // Validate virtual_payment_address
        validatePaymentParams(
          params,
          virtualPaymentAddress,
          'virtual_payment_address',
          errorObj,
          i,
          constants.MET_ONCONFIRM,
        )

        if (arr.time) {
          if (!arr.label || arr.label !== 'INSTALLMENT') {
            errorObj.time.label = `If time is present in payment, the corresponding label should be INSTALLMENT.`
          }
        }

        // Validate payment tags
        const tagsValidation = validatePaymentTags(arr.tags)
        if (!tagsValidation.isValid) {
          Object.assign(errorObj, { tags: tagsValidation.errors })
        }
      })
    } catch (error: any) {
      logger.error(`!!Errors while checking payments in /${constants.MET_ONCONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Checking quote details in /${constants.MET_ONCONFIRM}`)
      const quoteErrors = validateQuote(on_confirm?.quote, constants.MET_ONCONFIRM)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking Quote in /${constants.MET_ONCONFIRM},  ${error.message}`)
      return { error: error.message }
    }

    try {
      logger.info(`Checking cancellation terms in /${constants.MET_ONCONFIRM}`)
      const cancellationTerms = on_confirm.cancellation_terms

      if (cancellationTerms && cancellationTerms.length > 0) {
        for (let i = 0; i < cancellationTerms.length; i++) {
          const cancellationTerm = cancellationTerms[i]

          if (
            cancellationTerm.fulfillment_state &&
            cancellationTerm.fulfillment_state.descriptor &&
            cancellationTerm.fulfillment_state.descriptor.code &&
            (!cancellationTerm.cancellation_fee ||
              !(
                (cancellationTerm.cancellation_fee.percentage && !cancellationTerm.cancellation_fee.amount) ||
                (!cancellationTerm.cancellation_fee.percentage && cancellationTerm.cancellation_fee.amount)
              ))
          ) {
            errorObj.cancellationFee = `Either percentage or amount.currency & amount.value should be present, but not both, for Cancellation Term[${i}] when fulfillment_state is present`
          }

          // const descriptorCode = cancellationTerm.fulfillment_state.descriptor.code
          // const storedPercentage = cancellationTermsState.get(descriptorCode)

          // if (storedPercentage === undefined) {
          //   cancellationTermsState.set(descriptorCode, cancellationTerm.cancellation_fee.percentage)
          // } else if (storedPercentage !== cancellationTerm.cancellation_fee.percentage) {
          //   errorObj.cancellationFee = `Cancellation terms percentage for ${descriptorCode} has changed`
          // }
        }
      } else {
        errorObj.cancellationTerms = `Cancellation Terms are required in /${constants.MET_ONCONFIRM}`
      }
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation terms in /${constants.MET_ONCONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Checking status in message object  /${constants.MET_ONCONFIRM}`)
      if (!message.status || !['COMPLETE', 'ACTIVE'].includes(message.status)) {
        errorObj.status = 'Invalid or missing status in the message object. It must be one of: COMPLETE or ACTIVE'
      }
    } catch (error: any) {
      logger.error(`!!Error while checking status in message object  /${constants.MET_ONCONFIRM}, ${error.stack}`)
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.MET_ONCONFIRM} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}
