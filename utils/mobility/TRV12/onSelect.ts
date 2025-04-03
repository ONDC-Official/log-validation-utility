import { logger } from '../../../shared/logger'
import { getValue, setValue } from '../../../shared/dao'
import { validateRouteInfoTags } from '../../metro/tags'
import constants, { metroSequence } from '../../../constants'
import { validateQuote, validateStops } from '../../metro/metroChecks'
import { validateSchema, isObjectEmpty } from '../../'
import { validateContext } from '../../metro/metroChecks'
import { validateFulfillmentV2_0 } from '../../metro/validate/helper'
import {  compareItems, validateQuotePricing } from './functions/helper'

export const checkOnSelect = (data: any, msgIdSet: any, flow: { flow: string; flowSet: string }, version: string) => {
  if (!data || isObjectEmpty(data)) {
    return { [metroSequence.ON_SELECT]: 'Json cannot be empty' }
  }

  const errorObj: any = {}
  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema(flow?.flow === 'Airlines' ? 'TRV12' : 'TRV12BUS', constants.ON_SELECT, data)
  const contextRes: any = validateContext(context, msgIdSet, constants.SELECT, constants.ON_SELECT)
  setValue(`${metroSequence.ON_SELECT}_message`, message)

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  // const searchContext: any = getValue(`${metroSequence.SEARCH}_context`)
  const select: any = getValue(`${metroSequence.SELECT}`)

  try {
    const onSelect = message?.order
    const itemIDS: any = getValue(`${metroSequence.ON_SEARCH1}_itemsId`)
    const itemIdArray: any[] = []
    const storedFull: any = getValue(`${metroSequence.ON_SEARCH1}_storedFulfillments`)
    // const fulfillmentIdsSet = new Set()

    try {
      logger.info(`Comparing Provider Id of /${constants.SELECT} and /${constants.ON_SELECT}`)
      const prvrdID: any = getValue('providerId')
      const selectedProviderId = onSelect.provider.id

      if (!prvrdID) {
        logger.info(`Skipping Provider Id check due to insufficient data`)
        setValue('providerId', [selectedProviderId])
      } else if (!prvrdID.includes(selectedProviderId)) {
        errorObj.prvdrId = `Provider Id for /${constants.SELECT} and /${constants.ON_SELECT} api should be same`
      } else {
        setValue('providerId', [selectedProviderId])
      }
    } catch (error: any) {
      logger.info(
        `Error while comparing provider id for /${constants.SELECT} and /${constants.ON_SELECT} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Validating fulfillments object for /${constants.ON_SELECT}`)
      version === '2.0.0'
        ? onSelect?.fulfillments.forEach((fulfillment: any, index: number) => {
            const fulfillmentKey = `fulfillments[${index}]`

            // if (storedFull && !storedFull.includes(fulfillment.id)) {
            //   errorObj[`${fulfillmentKey}.id`] =
            //     `/message/order/fulfillments/id in fulfillments: ${fulfillment.id} should be one of the /fulfillments/id mapped in previous call`
            // } else {
            //   fulfillmentIdsSet.add(fulfillment.id)
            // }

            if (fulfillment?.vehicle?.category !== (String(flow?.flow).toUpperCase() !== 'AIRLINE' ? 'BUS' : 'METRO')) {
              errorObj['vehicle'] =
                `vehicle.category should be ${String(flow?.flow).toUpperCase() !== 'AIRLINE' ? 'AIRLINE' : 'AIRLINE'} in Fulfillment`
            }

            if (!fulfillment.type) {
              errorObj[`${fulfillmentKey}.type`] = `Fulfillment type is missing`
            } else if (fulfillment.type !== 'TRIP') {
              errorObj[`${fulfillmentKey}.type`] =
                `Fulfillment type must be TRIP at index ${index} in /${constants.ON_SELECT}`
            }

            // Check stops for START and END, or time range with valid timestamp and GPS
            const otp = false
            const cancel = false
            const getStopsError = validateStops(fulfillment?.stops, index, otp, cancel, constants.ON_SELECT)
            const errorValue = Object.values(getStopsError)[0] || []
            if (Object.keys(getStopsError).length > 0 && Object.keys(errorValue)?.length)
              Object.assign(errorObj, getStopsError)

            if (fulfillment.tags && String(flow?.flow).toUpperCase() !== 'AIRLINE') {
              // Validate route info tags
              const tagsValidation = validateRouteInfoTags(fulfillment?.tags)
              if (!tagsValidation.isValid) {
                Object.assign(errorObj, { tags: tagsValidation.errors })
              }
            }
          })
        : onSelect?.fulfillments &&
          validateFulfillmentV2_0(onSelect?.fulfillments ?? [], errorObj, constants.ON_SELECT, flow)
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking fulfillments info in /${constants.ON_SELECT},  ${error.message}`)
      return { error: error.message }
    }

    logger.info(`Mapping Item Ids /${constants.ON_SEARCH} and /${constants.ON_SELECT}`)
    let newItemIDSValue: any[]

    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      select?.message?.order?.items.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
    }

    try {

       logger.info(`Comparing Items object for /${constants.SELECT} and /${constants.ON_SELECT}`);
        const itemsCheck = compareItems(onSelect.items, itemIdArray) 
        if(!itemsCheck.success) {
          Object.assign(errorObj, itemsCheck.data)
        }
     
      setValue(`itemIds`, Array.from(newItemIDSValue))
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking items info in /${constants.ON_SELECT},  ${error.message}`)
      return { error: error.message }
    }
    if(onSelect?.quote)
    {
      try {
        logger.info(`Checking quote details in /${constants.ON_SELECT}`)
        const quoteCheck = validateQuotePricing(onSelect?.quote)
        if(!quoteCheck.success) {
          Object.assign(errorObj, quoteCheck.data)
        }
        const quoteErrors = validateQuote(onSelect?.quote, constants.ON_SELECT)
        Object.assign(errorObj, quoteErrors)
        
      } catch (error: any) {
        logger.error(`!!Error occcurred while checking Quote in /${constants.ON_SELECT},  ${error.message}`)
        return { error: error.message }
      }
    }

    if (onSelect?.payments) {
      errorObj[`payments`] = `payments  is not part of /${constants.ON_SELECT}`
    }

    if (!onSelect?.cancellation_terms && String(flow?.flow)?.toUpperCase() !== 'AIRLINES') {
      errorObj[`cancellation_terms`] = `cancellation_terms is missing in /${constants.ON_SELECT}`
    }

    setValue(`${metroSequence.ON_SELECT}`, data)
    setValue(`${metroSequence.ON_SELECT}_storedFulfillments`, Array.from(storedFull || []))
  } catch (error: any) {
    logger.error(`!!Error occcurred while checking order info in /${constants.ON_SELECT},  ${error.message}`)
    return { error1: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
