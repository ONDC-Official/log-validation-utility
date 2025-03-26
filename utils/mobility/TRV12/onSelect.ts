import { logger } from '../../../shared/logger'
import { getValue, setValue } from '../../../shared/dao'
import { validateRouteInfoTags } from '../../metro/tags'
import constants, { airlinesSequence, metroSequence } from '../../../constants'
import { validateQuote, validateStops } from '../../metro/metroChecks'
import { validateSchema, isObjectEmpty } from '../../'
import { validateContext } from '../../metro/metroChecks'
import { validateFulfillmentV2_0 } from '../../metro/validate/helper'

const VALID_DESCRIPTOR_CODES = ['RIDE', 'SJT', 'SFSJT', 'PASS', 'SEAT', 'NON STOP', 'CONNECT', 'RJT']
export const checkOnSelect = (
  data: any,
  msgIdSet: any,
  flow: { flow: string; flowSet: string },
  version: string,
  secondOnSelect: boolean,
) => {
  if (!data || isObjectEmpty(data)) {
    return secondOnSelect
      ? { [airlinesSequence.ON_SELECT2]: 'Json cannot be empty' }
      : { [airlinesSequence.ON_SELECT1]: 'Json cannot be empty' }
  }

  const errorObj: any = {}
  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema(
    'TRV12',
    secondOnSelect ? airlinesSequence?.ON_SELECT2 : airlinesSequence.ON_SELECT1,
    data,
  )
  const contextRes: any = validateContext(
    context,
    msgIdSet,
    secondOnSelect ? airlinesSequence.SELECT2 : airlinesSequence.SELECT1,
    secondOnSelect ? airlinesSequence.ON_SELECT2 : airlinesSequence.ON_SELECT1,
  )
  setValue(`${metroSequence.ON_SELECT}_message`, message)

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  // const searchContext: any = getValue(`${metroSequence.SEARCH}_context`)
  const select: any = getValue(`${metroSequence.SELECT}`) || []

  try {
    const onSelect = message?.order
    const itemIDS: any = getValue(`${metroSequence.ON_SEARCH1}_itemsId`)
    const itemIdArray: any[] = []
    const storedFull: any = getValue(`${metroSequence.ON_SEARCH1}_storedFulfillments`) || ''
    // const fulfillmentIdsSet = new Set()
    const itemIdsSet = new Set()

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
        ? onSelect?.fulfillments?.forEach((fulfillment: any, index: number) => {
            const fulfillmentKey = `fulfillments[${index}]`
            if (fulfillment?.vehicle?.category !== (String(flow?.flow).toUpperCase() !== 'METRO' ? 'BUS' : 'METRO')) {
              errorObj['vehicle'] =
                `vehicle.category should be ${String(flow?.flow).toUpperCase() !== 'METRO' ? 'BUS' : 'METRO'} in Fulfillment`
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

            if (fulfillment.tags && String(flow?.flow).toUpperCase() !== 'METRO') {
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
      logger.error(`!!Error occcurred while checking fulfillments info in /${constants.ON_SELECT},  ${error.stack}`)
      return { error: error.stack }
    }

    logger.info(`Mapping Item Ids /${constants.ON_SEARCH} and /${constants.ON_SELECT}`)
    let newItemIDSValue: any[]

    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      select?.message?.order?.items?.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
    }

    try {
      onSelect.items?.forEach((item: any, index: number) => {
        if (!newItemIDSValue.includes(item.id)) {
          const key = `item[${index}].item_id`
          errorObj[key] = `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in select`
        } else {
          itemIdsSet.add(item.id)
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

        const price = item?.price
        if (!price || !price?.currency || !price?.value) {
          const key = `item${index}_price`
          errorObj[key] = `Price is missing or incomplete in /items[${index}]`
        }

        if (!item?.fulfillment_ids || item?.fulfillment_ids?.length === 0) {
          errorObj[`invalidFulfillmentId_${index}`] = `fulfillment_ids should be present`
        } else {
        }

        if (item?.payment_ids) {
          errorObj[`payment_ids_${index}`] = `payment_ids are not part of /${constants.ON_SELECT}`
        }
      })
      setValue(`itemIds`, Array.from(newItemIDSValue))
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking items info in /${constants.ON_SELECT},  ${error.stack}`)
      return { error: error.stack }
    }

    try {
      logger.info(`Checking quote details in /${constants.ON_SELECT}`)
      const quoteErrors = validateQuote(onSelect?.quote, constants.ON_SELECT)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking Quote in /${constants.ON_SELECT},  ${error.stack}`)
      return { error: error.stack }
    }

    if (onSelect?.payments) {
      errorObj[`payments`] = `payments  is not part of /${constants.ON_SELECT}`
    }

    if (!onSelect?.cancellation_terms && String(flow?.flow)?.toUpperCase() !== 'BUS') {
      errorObj[`cancellation_terms`] = `cancellation_terms is missing in /${constants.ON_SELECT}`
    }

    setValue(`${metroSequence.ON_SELECT}`, data)
    setValue(`${metroSequence.ON_SELECT}_storedFulfillments`, Array.from(storedFull))
  } catch (error: any) {
    logger.error(`!!Error occcurred while checking order info in /${constants.ON_SELECT},  ${error.stack}`)
    return { error: error.stack }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
