import constants, { mobilitySequence, ON_DEMAND_VEHICLE } from '../../constants'
import { logger } from '../../shared/logger'
import { validateSchema, isObjectEmpty } from '../'
import { getValue, setValue } from '../../shared/dao'
import {
  validateContext,
  validateEntity,
  validateStops,
  validatePayloadAgainstSchema,
  validatePaymentObject,
} from './mobilityChecks'
import attributeConfig from './config/config2.0.1.json'

export const checkConfirm = (data: any, msgIdSet: any, version: any) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [mobilitySequence.CONFIRM]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.CONFIRM, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.ON_INIT, constants.CONFIRM)
    setValue(`${mobilitySequence.CONFIRM}_message`, message)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const confirm = message.order
    const itemIDS: any = getValue('itemIds')
    const storedFull: any = getValue(`${mobilitySequence.ON_SELECT}_storedFulfillments`)

    if (Object.prototype.hasOwnProperty.call(confirm, 'id')) {
      errorObj[`order`] = `/message/order/id is not part of /${constants.CONFIRM} call`
    }

    //provider id check
    try {
      logger.info(`Comparing provider object in /${constants.ON_INIT} and /${constants.CONFIRM}`)
      if (getValue('providerId') != confirm.provider['id']) {
        errorObj.prvdId = `Provider Id mismatches in /${constants.ON_INIT} and /${constants.CONFIRM}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while checking provider object in /${constants.ON_INIT} and /${constants.CONFIRM}, ${error.stack}`,
      )
    }

    //items check
    try {
      logger.info(`Comparing item in /${constants.CONFIRM}`)
      if (!confirm.items) errorObj[`items`] = `items is missing or empty`
      else {
        confirm.items.forEach((item: any, index: number) => {
          if (!itemIDS.includes(item.id)) {
            errorObj[
              `item[${index}].item_id`
            ] = `/message/order/items/id in item: ${item.id} at /${constants.CONFIRM} should be one of the /item/id mapped in past call`
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while comparing Item Id in /${constants.ON_INIT} and /${constants.CONFIRM}`)
    }

    // check provider payments
    try {
      logger.info(`Checking payments in /${constants.CONFIRM}`)
      const payments = confirm?.payments
      const paymentErrors = validatePaymentObject(payments, constants.CONFIRM)
      Object.assign(errorObj, paymentErrors)
    } catch (error: any) {
      logger.error(`!!Errors while checking payments in /${constants.CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Validating fulfillments object for /${constants.CONFIRM}`)
      confirm.fulfillments.forEach((fulfillment: any, index: number) => {
        const fulfillmentKey = `fulfillments[${index}]`
        if (!fulfillment?.id) {
          errorObj[fulfillmentKey] = `id is missing in fulfillments[${index}]`
        } else if (!storedFull.includes(fulfillment.id)) {
          errorObj[
            `${fulfillmentKey}.id`
          ] = `/message/order/fulfillments/id in fulfillments: ${fulfillment.id} should be one of the /fulfillments/id mapped in previous call`
        }

        if (!ON_DEMAND_VEHICLE.includes(fulfillment.vehicle.category)) {
          errorObj[`${fulfillmentKey}.vehicleCategory`] = `Vehicle category should be one of ${ON_DEMAND_VEHICLE}`
        }

        //customer checks
        const customerErrors = validateEntity(fulfillment.customer, 'customer', constants.CONFIRM, index)
        Object.assign(errorObj, customerErrors)

        // Check stops for START and END, or time range with valid timestamp and GPS
        const otp = false
        const cancel = false
        const stopsError = validateStops(fulfillment?.stops, index, otp, cancel)
        if (!stopsError?.valid) Object.assign(errorObj, stopsError?.errors)
      })
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking fulfillments info in /${constants.CONFIRM},  ${error.message}`)
      return { error: error.message }
    }

    if ('billing' in confirm && confirm?.billing?.name) {
      setValue('billingName', confirm?.billing?.name)
    } else {
      errorObj['billing'] = `billing must be part of /${constants.CONFIRM}`
    }

    if (version === '2.0.1') {
      const additionalAttributes: any = attributeConfig.confirm
      validatePayloadAgainstSchema(additionalAttributes, data, errorObj, '', '')
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.CONFIRM} API`, err)
    return { error: err.message }
  }
}
