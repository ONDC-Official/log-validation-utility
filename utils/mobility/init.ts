import constants, { metroSequence } from '../../constants'
import { logger } from '../../shared/logger'
import { validateSchema, isObjectEmpty } from '../'
import { getValue, setValue } from '../../shared/dao'
import { validateContext, validateStops } from './metroChecks'
import { validatePaymentTags } from './tags'
import _ from 'lodash'

const VALID_VEHICLE_CATEGORIES = ['AUTO_RICKSHAW', 'CAB', 'METRO', 'BUS', 'AIRLINE']
export const checkInit = (data: any, msgIdSet: any) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [metroSequence.INIT]: 'Json cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.MET_INIT, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.MET_ONSELECT, constants.MET_INIT)
    setValue(`${metroSequence.INIT}_message`, message)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const init = message.order

    const itemIDS: any = getValue('itemIds')
    const itemIdArray: any[] = []
    const storedFull: any = getValue(`${metroSequence.ON_SELECT}_storedFulfillments`)
    let newItemIDSValue: any[]

    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      const onSelect: any = getValue(`${metroSequence.ON_SELECT}_message`)
      onSelect.order.items.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
    }

    setValue('itemIds', newItemIDSValue)

    try {
      logger.info(`Comparing Provider Id of /${constants.MET_ONSELECT} and /${constants.MET_INIT}`)
      const prvrdID: any = getValue('providerId')
      const selectedProviderId = init.provider.id

      if (!prvrdID) {
        logger.info(`Skipping Provider Id check due to insufficient data`)
        setValue('providerId', selectedProviderId)
      } else if (!_.isEqual(prvrdID, init.provider.id)) {
        errorObj.prvdrId = `Provider Id for /${constants.MET_ONSELECT} and /${constants.MET_INIT} api should be same`
      } else {
        setValue('providerId', selectedProviderId)
      }
    } catch (error: any) {
      logger.info(
        `Error while comparing provider id for /${constants.MET_ONSELECT} and /${constants.MET_INIT} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing item in /${constants.MET_INIT}`)
      init.items.forEach((item: any, index: number) => {
        if (!newItemIDSValue.includes(item.id)) {
          const key = `item[${index}].item_id`
          errorObj[
            key
          ] = `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in previous call`
        }
      })
    } catch (error: any) {
      logger.error(`!!Error while comparing Item Id in /${constants.MET_ONSELECT} and /${constants.MET_INIT}`)
    }

    try {
      logger.info(`Checking payments in /${constants.MET_INIT}`)
      init?.payments?.forEach((arr: any, i: number) => {
        if (!arr?.collected_by) {
          errorObj[`payemnts[${i}]_collected_by`] = `payments.collected_by must be present in ${constants.MET_ONSELECT}`
        } else {
          const srchCollectBy = getValue(`collected_by`)
          if (srchCollectBy && srchCollectBy != arr?.collected_by)
            errorObj[
              `payemnts[${i}]_collected_by`
            ] = `payments.collected_by value sent in ${constants.MET_ONSELECT} should be ${srchCollectBy} as sent in ${constants.MET_INIT}`

          if (arr?.collected_by === 'BPP' && 'id' in arr)
            errorObj[`payemnts[${i}]_id`] = `id should not be present if collector is BPP`

          setValue(`collected_by`, arr?.collected_by)
        }

        const validTypes = ['PRE-ORDER', 'ON-FULFILLMENT', 'POST-FULFILLMENT']
        if (!arr?.type || !validTypes.includes(arr.type)) {
          errorObj[`payments[${i}]_type`] = `payments.params.type must be present in ${
            constants.MET_INIT
          } & its value must be one of: ${validTypes.join(', ')}`
        }

        const validStatus = ['NOT-PAID', 'PAID']
        if (!arr?.status || !validStatus.includes(arr.status)) {
          errorObj[`payments[${i}]_status`] = `payments.status must be present in ${
            constants.MET_INIT
          } & its value must be one of: ${validStatus.join(', ')}`
        }

        const params = arr.params
        if (!params?.bank_code) {
          errorObj[`payments[${i}]_bank_code`] = `payments.params.bank_code must be present in ${constants.MET_INIT}`
        } else {
          setValue('bank_code', params?.bank_code)
        }

        if (!params?.bank_account_number) {
          errorObj[
            `payments[${i}]_bank_account_number`
          ] = `payments.params.bank_account_number must be present in ${constants.MET_INIT}`
        } else {
          setValue('bank_account_number', params?.bank_account_number)
        }

        if (!params?.virtual_payment_address) {
          errorObj[
            `payments[${i}]_virtual_payment_address`
          ] = `payments.params.virtual_payment_address must be present in ${constants.MET_INIT}`
        } else {
          setValue('virtual_payment_address', params?.virtual_payment_address)
        }

        // Validate payment tags
        const tagsValidation = validatePaymentTags(arr.tags)
        if (!tagsValidation.isValid) {
          Object.assign(errorObj, { tags: tagsValidation.errors })
        }
      })
    } catch (error: any) {
      logger.error(`!!Errors while checking payments in /${constants.MET_INIT}, ${error.stack}`)
    }

    try {
      logger.info(`Validating fulfillments object for /${constants.MET_INIT}`)
      init.fulfillments.forEach((full: any, index: number) => {
        const fulfillmentKey = `fulfillments[${index}]`
        console.log('storedFull--', storedFull)
        if (storedFull && !storedFull.includes(full.id)) {
          const key = `fulfillments[${index}].id`
          errorObj[
            key
          ] = `/message/order/fulfillments/id in fulfillments: ${full.id} should be one of the /fulfillments/id mapped in previous call`
        }

        if (!VALID_VEHICLE_CATEGORIES.includes(full.vehicle.category)) {
          errorObj[
            `fulfillment_${index}_vehicleCategory`
          ] = `Vehicle category should be one of ${VALID_VEHICLE_CATEGORIES}`
        }

        if (!Object.prototype.hasOwnProperty.call(full.customer?.person, 'name')) {
          errorObj[`fulfillments${index}_customer`] = `/message/order/fulfillments/customer in customer: must have name`
        } else {
          if (full.customer.person.name.trim() === '') {
            errorObj[`fulfillments${index}_customer_name`] = `Empty name is not allowed for fulfillment ${index}`
          } else {
            setValue(`customer_name`, full.customer.person.name)
          }
        }

        if (!Object.prototype.hasOwnProperty.call(full.customer?.contact, 'phone')) {
          errorObj[`fulfillments${index}_customer`] = `/message/order/fulfillments/customer in customer: must have name`
        } else {
          const phoneRegex = /^[0-9]{10}$/
          const isValidPhone = phoneRegex.test(full.customer.contact.phone)
          if (!isValidPhone) {
            errorObj[`fulfillments${index}_customer_phone`] = `Invalid phone format for fulfillment ${index}`
          } else {
            setValue(`customer_phone`, full.customer.contact.phone)
          }
        }

        if (Object.prototype.hasOwnProperty.call(full, 'agent')) {
          errorObj[`fulfillments${index}_agent`] = `/message/order/agent is not part of init call`
        }

        if (full.type !== 'DELIVERY') {
          errorObj[
            `${fulfillmentKey}.type`
          ] = `Fulfillment type must be DELIVERY at index ${index} in /${constants.MET_ONSELECT}`
        }

        // Check stops for START and END, or time range with valid timestamp and GPS
        const otp = false
        const cancel = false
        validateStops(full?.stops, index, otp, cancel)
      })
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking fulfillments info in /${constants.MET_INIT},  ${error.message}`)
      return { error: error.message }
    }

    if ('billing' in init && init?.billing?.name) {
      setValue('billingName', init?.billing?.name)
    } else {
      errorObj['billing'] = `billing must be part of /${constants.MET_INIT}`
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.MET_INIT} API`, err)
    return { error: err.message }
  }
}
