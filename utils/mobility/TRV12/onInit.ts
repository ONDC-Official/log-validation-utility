import { logger } from '../../../shared/logger'
import { getValue, setValue } from '../../../shared/dao'
import { validatePaymentTags, validateRouteInfoTags, validateTags } from '../../metro/tags'
import constants, { airlinesSequence, metroSequence } from '../../../constants'
import {
  validateCancellationTerms,
  validateDescriptor,
  validateQuote,
  validateStops,
} from '../../metro/metroChecks'
import { validateSchema, isObjectEmpty } from '../../'
import { validateContext } from '../../metro/metroChecks'
import { isEmpty, isNil } from 'lodash'
import {
  checkProviderTime,
  validateFulfillmentV2_0,
  validateParams,
} from '../../metro/validate/helper'
import { compareItems, validateQuotePricing } from './functions/helper'

export const checkOnInit = (data: any, msgIdSet: any, flow: { flow: string; flowSet: string }, version: string) => {
  try {
    const errorObj: any = {}
    let FULFILLMENT: string[] = []
    if (!data || isObjectEmpty(data)) {
      return { [airlinesSequence.ON_INIT]: 'Json cannot be empty' }
    }
    const onSelectMessage = getValue('on_select_message')
    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('TRV12', constants.ON_INIT, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.INIT, constants.ON_INIT)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const on_init = message.order
    const itemIDS: any = getValue('ItmIDS')
    const itemIdArray: any[] = []
    const prvdrId = getValue('providerId') || ([] as string[])
    // const storedFull: any = getValue(`${airlinesSequence.ON_SEARCH1}_storedFulfillments`)
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

    //check provider
    try {
      if (String(flow?.flow)?.toUpperCase() === 'AIRLINES' && on_init?.tags) {
        const tagsValidation: { [key: string]: any } | null = validateTags(on_init?.tags ?? [], 0)
        if (!isNil(tagsValidation)) Object.assign(errorObj, tagsValidation)
      }

      logger.info(`Checking provider Id in /${constants.ON_SEARCH} and /${constants.ON_INIT}`)
      if (!on_init.provider)
        //seprate both the checks from a single function
        errorObj.prvdrId = `Provider Id id missing in /${constants.ON_INIT}`

      if (!prvdrId.includes(on_init.provider.id))
        errorObj.prvdrId = `Provider Id mismatches in /${constants.INIT} and /${constants.ON_INIT}`

      // //use validateDescriptor instead
      const descriptorError = validateDescriptor(
        on_init?.provider?.descriptor,
        constants.ON_INIT,
        `provider.descriptor`,
        false,
        [],
      )
      if (descriptorError) Object.assign(errorObj, descriptorError)
      // if (!on_init?.provider?.descriptor)
      //   errorObj.prvdrIdDescriptor = `Provider Descriptor is Missing in /${constants.ON_INIT}`
      // else if (
      //   on_init?.provider?.descriptor &&
      //   (!on_init.provider.descriptor.name || on_init.provider.descriptor.name === '')
      // ) {
      //   errorObj.DescriptorName = `Provider Descriptor Name is Missing or Empty /${constants.ON_INIT}`
      // }

      //check time validation
      // fix checkProviderTime also
      if (String(flow?.flow).toUpperCase() === 'AIRLINES') {
        const checkTimeError = checkProviderTime(on_init?.provider)
        if (Object.keys(checkTimeError).length > 0) Object.assign(errorObj, checkTimeError)
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing provider Id in /${constants.ON_SEARCH} and /${constants.ON_INIT}, ${error.stack}`,
      )
    }

    //add billing & SCHEDULED_INFO tag-group function also
    //check fulfillments
    try {
      logger.info(`Validating fulfillments object for /${constants.ON_INIT}`)
      if (!on_init?.fulfillments) errorObj.fulfillments = `Fulfillments missing in /${constants.ON_INIT}`
      // wrap below conditions in an else block
      else {
        version === '2.0.0'
          ? on_init.fulfillments.forEach((fulfillment: any, index: number) => {
              const fulfillmentKey = `fulfillments[${index}]`

              if (fulfillment?.id) {
                fulfillmentIdsSet.add(fulfillment?.id)
                FULFILLMENT = [...FULFILLMENT, fulfillment?.id as string]
                setValue(`${airlinesSequence.ON_INIT}_storedFulfillments`, FULFILLMENT)
                // if (!storedFull.includes(fulfillment?.id)) {
                //   errorObj[`${fulfillmentKey}.id`] =
                //     `/message/order/fulfillments/id in fulfillments: ${fulfillment.id} should be one of the /fulfillments/id mapped in previous call`
                // }
              } else {
                errorObj[`Fulfillment[${index}].id`] = `fulfillment.id missing in /${constants.ON_INIT}`
              }

              if (fulfillment?.vehicle?.category !== (String(flow?.flow).toUpperCase() !== 'AIRLINES' ? 'AIRLINES' : 'AIRLINES')) {
                errorObj[`${fulfillmentKey}.vehicleCategory`] =
                  `Vehicle category should be ${String(flow?.flow).toUpperCase() !== 'AIRLINES' ? 'AIRLINES' : 'AIRLINES'} in Fulfillment.`
              }

              if (fulfillment.type !== 'TRIP') {
                errorObj[`${fulfillmentKey}.type`] =
                  `Fulfillment type must be TRIP at index ${index} in /${constants.ON_INIT}`
              }

              const otp = false
              const cancel = false
              const getStopsError = validateStops(fulfillment?.stops, index, otp, cancel, constants.ON_INIT)
              const errorValue = Object.values(getStopsError)[0] || []
              if (Object.keys(getStopsError).length > 0 && Object.keys(errorValue)?.length)
                Object.assign(errorObj, getStopsError)

              if (String(flow?.flow).toUpperCase() !== 'AIRLINES') {
                if (!fulfillment?.tags)
                  errorObj[`ulfillment_${index}_tags`] = `Tags should be present in Fulfillment in case of Intracity.`
                else {
                  // Validate route info tags
                  const tagsValidation = validateRouteInfoTags(fulfillment?.tags)
                  if (!tagsValidation.isValid) {
                    Object.assign(errorObj, { tags: tagsValidation.errors })
                  }
                }
              }
            })
          : on_init?.fulfillments &&
            validateFulfillmentV2_0(on_init?.fulfillments ?? [], errorObj, constants.ON_INIT, flow)

        setValue(`storedFulfillments`, fulfillmentIdsSet)
      }
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking fulfillments info in /${constants.ON_INIT},  ${error.message}`)
      return { error: error.message }
    }

    //check items
    try {
      //items null check
      if (!on_init?.items) errorObj.items = `Items missing in /${constants.ON_INIT}`
      const itemCheck = compareItems(on_init?.items, newItemIDSValue)
      if(!itemCheck.success) {
        Object.assign(errorObj, itemCheck.data)
      }
      if(onSelectMessage?.order?.items && JSON.stringify(on_init?.items) != JSON.stringify(onSelectMessage?.order?.items)){
        errorObj[`Items:error`] = `Items mismatch in ${metroSequence.ON_SELECT} and ${metroSequence.ON_INIT}`
      }
    
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking items info in /${constants.ON_INIT},  ${error.message}`)
      return { error: error.message }
    }

    //check cancellation_terms
    // revisit & handle external_ref check
    try {
      if (String(flow?.flow)?.toUpperCase() === 'AIRLINES') {
        if (!on_init?.cancellation_terms)
          errorObj.cancellation_terms = `cancellation_terms missing in /${constants.ON_INIT}`
        else {
          logger.info(`Checking cancellation terms in /${constants.ON_INIT}`)

          const cancellationErrors = validateCancellationTerms(on_init?.cancellation_terms, constants.ON_INIT)
          if (!isNil(cancellationErrors)) Object.assign(errorObj, cancellationErrors)
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation_terms in /${constants.ON_INIT}, ${error.stack}`)
    }

    //check payments
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

        const payment_type = getValue('INIT_PAYMENT_TYPE') ?? 'NEFT'

        const validatePayementParams = validateParams(arr.params, arr?.collected_by, constants.ON_INIT, payment_type)
        if (!isEmpty(validatePayementParams)) Object.assign(errorObj, validatePayementParams)
        // const params = arr.params
        // const bankCode: string | null = getValue('bank_code')
        // const bankAccountNumber: string | null = getValue('bank_account_number')
        // const virtualPaymentAddress: string | null = getValue('virtual_payment_address')
        // // Validate bank_code

        // validatePaymentParams(params, bankCode, 'bank_code', errorObj, i, constants.ON_INIT)

        // // Validate bank_account_number
        // validatePaymentParams(params, bankAccountNumber, 'bank_account_number', errorObj, i, constants.ON_INIT)

        // // Validate virtual_payment_address
        // validatePaymentParams(params, virtualPaymentAddress, 'virtual_payment_address', errorObj, i, constants.ON_INIT)

        // Validate payment tags
        const tagsValidation = validatePaymentTags(arr?.tags, constants?.ON_INIT)
        if (!tagsValidation.isValid) {
          Object.assign(errorObj, { tags: tagsValidation.errors })
        }
      })
    } catch (error: any) {
      logger.error(`!!Errors while checking payments in /${constants.ON_INIT}, ${error.stack}`)
    }

    //check quote
    try {
      logger.info(`Checking quote details in /${constants.ON_INIT}`)
      const quotePriceCheck = validateQuotePricing(on_init?.quote)
      if(!quotePriceCheck.success){
        Object.assign(errorObj, quotePriceCheck.data)
      }
      const quoteErrors = validateQuote(on_init?.quote, constants.ON_INIT)
      

      if(onSelectMessage?.order?.quote && JSON.stringify(on_init?.quote) !== JSON.stringify(onSelectMessage?.order?.quote)){
        errorObj[`Quote:error`] = `Quote mismatch in ${metroSequence.ON_SELECT} and ${metroSequence.ON_INIT}`
      }
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
