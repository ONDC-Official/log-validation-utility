// import _ from 'lodash'
import constants, { metroSequence } from '../../constants'
import { logger } from '../../shared/logger'
import { validateSchema, isObjectEmpty } from '../'
import { getValue, setValue } from '../../shared/dao'
import { validateContext, validatePaymentParams, validateQuote, validateStops } from './mobilityChecks'
import { validatePaymentTags, validateRouteInfoTags } from './tags'

// const cancellationTermsState = new Map()

const VALID_DESCRIPTOR_CODES = ['RIDE', 'SJT', 'SESJT', 'RUT', 'PASS', 'SEAT', 'NON STOP', 'CONNECT']
const VALID_VEHICLE_CATEGORIES = ['AUTO_RICKSHAW', 'CAB', 'METRO', 'BUS', 'AIRLINE']

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

    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.MOB_ONINIT, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.MOB_INIT, constants.MOB_ONINIT)
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
    const storedFull: any = getValue(`${metroSequence.ON_SELECT}_storedFulfillments`)
    const fulfillmentIdsSet = new Set()

    let newItemIDSValue: any[]

    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      on_init.items.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
      console.log('test')
    }

    setValue('ItmIDS', newItemIDSValue)

    try {
      logger.info(`Checking provider Id in /${constants.MET_ONSEARCH} and /${constants.MET_ONINIT}`)
      if (!on_init.provider || on_init.provider.id != getValue('providerId')) {
        errorObj.prvdrId = `Provider Id mismatches in /${constants.MET_ONSEARCH} and /${constants.MET_ONINIT}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing provider Id in /${constants.MET_ONSEARCH} and /${constants.MET_ONINIT}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Validating fulfillments object for /${constants.MET_ONINIT}`)
      on_init.fulfillments.forEach((fulfillment: any, index: number) => {
        const fulfillmentKey = `fulfillments[${index}]`
        fulfillmentIdsSet.add(fulfillment.id)
        if (!storedFull.includes(fulfillment.id)) {
          errorObj[
            `${fulfillmentKey}.id`
          ] = `/message/order/fulfillments/id in fulfillments: ${fulfillment.id} should be one of the /fulfillments/id mapped in previous call`
        }

        if (!VALID_VEHICLE_CATEGORIES.includes(fulfillment.vehicle.category)) {
          errorObj[
            `${fulfillmentKey}.vehicleCategory`
          ] = `Vehicle category should be one of ${VALID_VEHICLE_CATEGORIES}`
        }

        if (fulfillment.type !== 'DELIVERY') {
          errorObj[
            `${fulfillmentKey}.type`
          ] = `Fulfillment type must be DELIVERY at index ${index} in /${constants.MET_ONINIT}`
        }

        if (Object.prototype.hasOwnProperty.call(fulfillment, 'agent')) {
          errorObj[`fulfillments${index}_agent`] = `/message/order/agent is not part of /${constants.MET_ONINIT} call`
        }

        // Check stops for START and END, or time range with valid timestamp and GPS
        const otp = false
        const cancel = false
        validateStops(fulfillment?.stops, index, otp, cancel)

        // Validate route info tags
        const tagsValidation = validateRouteInfoTags(fulfillment.tags)
        if (!tagsValidation.isValid) {
          Object.assign(errorObj, { tags: tagsValidation.errors })
        }
      })
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking fulfillments info in /${constants.MOB_ONINIT},  ${error.message}`)
      return { error: error.message }
    }

    try {
      on_init.items.forEach((item: any, index: number) => {
        if (!newItemIDSValue.includes(item.id)) {
          const key = `item[${index}].item_id`
          errorObj[
            key
          ] = `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in /${constants.MOB_ONINIT}`
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

        item.fulfillment_ids.forEach((fulfillmentId: string) => {
          if (!fulfillmentIdsSet.has(fulfillmentId)) {
            errorObj[
              `invalidFulfillmentId_${index}`
            ] = `Fulfillment ID should be one of the fulfillment id  '${fulfillmentId}' at index ${index} in /${constants.MOB_ONINIT} is not valid`
          }
        })

        // Validate item tags
        const tagsValidation = validateRouteInfoTags(item.tags)
        if (!tagsValidation.isValid) {
          Object.assign(errorObj, { tags: tagsValidation.errors })
        }
      })
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking items info in /${constants.MOB_ONINIT},  ${error.message}`)
      return { error: error.message }
    }

    try {
      logger.info(`Checking cancellation terms in /${constants.MOB_ONINIT}`)
      const cancellationTerms = on_init.cancellation_terms

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
        errorObj.cancellationTerms = `Cancellation Terms are required in /${constants.MOB_ONINIT}`
      }
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation terms in /${constants.MOB_ONINIT}, ${error.stack}`)
    }

    try {
      logger.info(`Checking payments in /${constants.MOB_ONINIT}`)
      on_init?.payments?.forEach((arr: any, i: number) => {
        if (!arr?.collected_by) {
          errorObj[`payemnts[${i}]_collected_by`] = `payments.collected_by must be present in ${constants.MOB_ONINIT}`
        } else {
          const srchCollectBy = getValue(`collected_by`)
          if (srchCollectBy != arr?.collected_by)
            errorObj[
              `payemnts[${i}]_collected_by`
            ] = `payments.collected_by value sent in ${constants.MOB_ONINIT} should be ${srchCollectBy} as sent in ${constants.MOB_ONSELECT}`
        }

        const validTypes = ['PRE-ORDER', 'ON-FULFILLMENT', 'POST-FULFILLMENT']
        if (!arr?.type || !validTypes.includes(arr.type)) {
          errorObj[`payments[${i}]_type`] = `payments.params.type must be present in ${
            constants.MOB_ONINIT
          } & its value must be one of: ${validTypes.join(', ')}`
        }

        const validStatus = ['NOT-PAID', 'PAID']
        if (!arr?.status || !validStatus.includes(arr.status)) {
          errorObj[`payments[${i}]_status`] = `payments.status must be present in ${
            constants.MOB_ONINIT
          } & its value must be one of: ${validStatus.join(', ')}`
        }

        const params = arr.params
        const bankCode: string | null = getValue('bank_code')
        const bankAccountNumber: string | null = getValue('bank_account_number')
        const virtualPaymentAddress: string | null = getValue('virtual_payment_address')
        // Validate bank_code
        validatePaymentParams(params, bankCode, 'bank_code', errorObj, i, constants.MOB_ONINIT)

        // Validate bank_account_number
        validatePaymentParams(params, bankAccountNumber, 'bank_account_number', errorObj, i, constants.MOB_ONINIT)

        // Validate virtual_payment_address
        validatePaymentParams(
          params,
          virtualPaymentAddress,
          'virtual_payment_address',
          errorObj,
          i,
          constants.MOB_ONINIT,
        )

        // Validate payment tags
        const tagsValidation = validatePaymentTags(arr.tags)
        if (!tagsValidation.isValid) {
          Object.assign(errorObj, { tags: tagsValidation.errors })
        }
      })
    } catch (error: any) {
      logger.error(`!!Errors while checking payments in /${constants.MOB_ONINIT}, ${error.stack}`)
    }

    try {
      logger.info(`Checking quote details in /${constants.MOB_ONINIT}`)
      const quoteErrors = validateQuote(on_init?.quote, constants.MOB_ONINIT)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking Quote in /${constants.MOB_ONINIT},  ${error.message}`)
      return { error: error.message }
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.MOB_ONINIT} API`, err)
    return { error: err.message }
  }
}
