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
import _ from 'lodash'
import attributeConfig from './config/config2.0.1.json'

export const checkInit = (data: any, msgIdSet: any, version: any) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [mobilitySequence.INIT]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.INIT, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.ON_SELECT, constants.INIT)
    setValue(`${mobilitySequence.INIT}_message`, message)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const init = message.order

    const itemIDS: any = getValue('itemIds')
    const storedFull: any = getValue(`${mobilitySequence.ON_SELECT}_storedFulfillments`)

    try {
      logger.info(`Comparing Provider Id of /${constants.ON_SELECT} and /${constants.INIT}`)
      const prvrdID: any = getValue('providerId')
      const selectedProviderId = init.provider.id

      if (!prvrdID) {
        logger.info(`Skipping Provider Id check due to insufficient data`)
        setValue('providerId', selectedProviderId)
      } else if (!_.isEqual(prvrdID, init.provider.id)) {
        errorObj.prvdrId = `Provider Id for /${constants.ON_SELECT} and /${constants.INIT} api should be same`
      } else {
        setValue('providerId', selectedProviderId)
      }
    } catch (error: any) {
      logger.info(
        `Error while comparing provider id for /${constants.ON_SELECT} and /${constants.INIT} api, ${error.stack}`,
      )
    }

    //items check
    try {
      logger.info(`Comparing item in /${constants.INIT}`)
      if (!init.items) errorObj[`items`] = `items is missing or empty`
      else {
        init.items.forEach((item: any, index: number) => {
          if (!itemIDS.includes(item.id)) {
            errorObj[
              `item[${index}].item_id`
            ] = `/message/order/items/id in item: ${item.id} at /${constants.INIT} should be one of the /item/id mapped in past call`
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while comparing Item Id in /${constants.ON_SELECT} and /${constants.INIT}`)
    }

    try {
      logger.info(`Validating fulfillments object for /${constants.INIT}`)
      init.fulfillments.forEach((fulfillment: any, index: number) => {
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
        const customerErrors = validateEntity(fulfillment.customer, 'customer', constants.INIT, index)
        Object.assign(errorObj, customerErrors)

        // Check stops for START and END, or time range with valid timestamp and GPS
        const otp = false
        const cancel = false
        const stopsError = validateStops(fulfillment?.stops, index, otp, cancel)
        if (!stopsError?.valid) Object.assign(errorObj, stopsError.errors)
      })
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking fulfillments info in /${constants.INIT},  ${error.message}`)
      return { error: error.message }
    }

    // check provider payments
    try {
      logger.info(`Checking payments in /${constants.INIT}`)
      const payments = init?.payments
      const paymentErrors = validatePaymentObject(payments, constants.INIT)
      Object.assign(errorObj, paymentErrors)
    } catch (error: any) {
      logger.error(`!!Errors while checking payments in /${constants.INIT}, ${error.stack}`)
    }

    if ('billing' in init && init?.billing?.name) {
      setValue('billingName', init?.billing?.name)
    } else {
      errorObj['billing'] = `billing.name is missing in /${constants.INIT}`
    }

    if (version === '2.0.1') {
      const additionalAttributes: any = attributeConfig.init
      validatePayloadAgainstSchema(additionalAttributes, data, errorObj, '', '')
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.INIT} API`, err)
    return { error: err.message }
  }
}
