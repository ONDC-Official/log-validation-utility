import { logger } from '../../shared/logger'
import { getValue, setValue } from '../../shared/dao'
import constants, { mobilitySequence } from '../../constants'
import { validateSchema, isObjectEmpty, checkMobilityContext, checkBppIdOrBapId } from '../'
import _ from 'lodash'

export const checkOnSearch = (data: any, msgIdSet: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [mobilitySequence.ON_SEARCH]: 'Json cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.catalog || isObjectEmpty(message) || isObjectEmpty(message.catalog)) {
    return { missingFields: '/context, /message, /catalog or /message/catalog is missing or empty' }
  }

  const schemaValidation = validateSchema(context.domain.split(':')[1], constants.MOB_ONSEARCH, data)

  const contextRes: any = checkMobilityContext(context, constants.MOB_ONSEARCH)
  setValue(`${mobilitySequence.ON_SEARCH}_context`, context)
  setValue(`${mobilitySequence.ON_SEARCH}_message`, message)
  msgIdSet.add(context.message_id)

  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!context.bap_id) {
    errorObj['bap_id'] = 'context/bap_id is required'
  } else {
    const checkBap = checkBppIdOrBapId(context.bap_id)
    if (checkBap) Object.assign(errorObj, { bap_id: 'context/bap_id should not be a url' })
  }

  if (!context.bpp_id) {
    errorObj['bpp_id'] = 'context/bpp_id is required'
  } else {
    const checkBpp = checkBppIdOrBapId(context.bpp_id)
    console.log('checkBppcheckBppcheckBppcheckBppcheckBppcheckBpp', checkBpp)
    if (checkBpp) Object.assign(errorObj, { bpp_id: 'context/bpp_id should not be a url' })
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  setValue(`${mobilitySequence.ON_SEARCH}`, data)

  const searchContext: any = getValue(`${mobilitySequence.SEARCH}_context`)

  try {
    logger.info(`Storing BAP_ID and BPP_ID in /${constants.MOB_ONSEARCH}`)
    setValue('bapId', context.bap_id)
    setValue('bppId', context.bpp_id)
  } catch (error: any) {
    logger.error(`!!Error while storing BAP and BPP Ids in /${constants.MOB_ONSEARCH}, ${error.stack}`)
  }

  try {
    logger.info(`Comparing transaction Ids of /${constants.MOB_SEARCH} and /${constants.MOB_ONSEARCH}`)
    if (!_.isEqual(searchContext.transaction_id, context.transaction_id)) {
      errorObj.transaction_id = `Transaction Id for /${constants.MOB_SEARCH} and /${constants.MOB_ONSEARCH} api should be same`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing transaction ids for /${constants.MOB_SEARCH} and /${constants.MOB_ONSEARCH} api, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing Message Ids of /${constants.MOB_SEARCH} and /${constants.MOB_ONSEARCH}`)
    if (!_.isEqual(searchContext.message_id, context.message_id)) {
      errorObj.message_id = `Message Id for /${constants.MOB_SEARCH} and /${constants.MOB_ONSEARCH} api should be same`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing message ids for /${constants.MOB_SEARCH} and /${constants.MOB_ONSEARCH} api, ${error.stack}`,
    )
  }

  if (!context.location || !context.location.city || !context.location.country) {
    errorObj['location'] = 'context/location/city and context/location/country are required'
  }

  const onSearchCatalog: any = message.catalog
  const prvdrsId = new Set()
  const prvdrLocId = new Set()
  const itemsId = new Set()
  const storedLocations = new Set()
  const storedFulfillments = new Set()

  if (!onSearchCatalog.descriptor || !onSearchCatalog.descriptor.name) {
    errorObj['descriptor_name'] = 'message/catalog/descriptor/name is missing'
  }

  try {
    let i = 0
    const bppPrvdrs = onSearchCatalog['providers']
    const len = bppPrvdrs.length
    while (i < len) {
      const fulfillments = onSearchCatalog['providers'][i]['fulfillments']

      if (!fulfillments || fulfillments.length === 0) {
        errorObj[`provider_${i}_fulfillments`] = `Fulfillments are missing for provider ${i}`
      }

      const locations = onSearchCatalog['providers'][i]['locations']

      if (!locations || locations.length === 0) {
        errorObj[`provider_${i}_locations`] = `locations are missing for provider ${i}`
      }

      try {
        let j = 0
        const items = onSearchCatalog['providers'][i]['items']
        const iLen = items.length
        while (j < iLen) {
          const item = items[j]
          if (!item.id) {
            const key = `prvdr${i}item${j}_id`
            errorObj[key] = `Item ID is missing in /providers[${i}]/items[${j}]`
          } else if (itemsId.has(item.id)) {
            const key = `prvdr${i}item${j}_id`
            errorObj[key] = `Duplicate item ID: ${item.id} in providers[${i}]`
          } else {
            itemsId.add(item.id)
          }

          if (!item.descriptor || !item.descriptor.code) {
            const key = `prvdr${i}item${j}_descriptor`
            errorObj[key] = `Descriptor is missing in /providers[${i}]/items[${j}]`
          }

          const price = item.price
          if (!price || !price.currency || !price.minimum_value || !price.maximum_value || !price.value) {
            const key = `prvdr${i}item${j}_price`
            errorObj[key] = `Price is incomplete in /providers[${i}]/items[${j}]`
          }

          const locationIds = item.location_ids
          if (!locationIds || locationIds.length === 0) {
            const key = `prvdr${i}item${j}_location_ids`
            errorObj[key] = `Location IDs are missing or empty in /providers[${i}]/items[${j}]`
          } else {
            locationIds.forEach((locationId: string) => {
              if (!storedLocations.has(locationId)) {
                const key = `prvdr${i}item${j}_location_ids_not_found`
                errorObj[
                  key
                ] = `Location ID ${locationId} in /providers[${i}]/items[${j}] not found in stored locations`
              }
            })
          }

          const fulfillmentIds = item.fulfillment_ids
          if (!fulfillmentIds || fulfillmentIds.length === 0) {
            const key = `prvdr${i}item${j}_fulfillment_ids`
            errorObj[key] = `Fulfillment IDs are missing or empty in /providers[${i}]/items[${j}]`
          } else {
            fulfillmentIds.forEach((fulfillmentId: string) => {
              if (!storedFulfillments.has(fulfillmentId)) {
                const key = `prvdr${i}item${j}_fulfillment_ids_not_found`
                errorObj[
                  key
                ] = `Fulfillment ID ${fulfillmentId} in /providers[${i}]/items[${j}] not found in stored fulfillments`
              }
            })
          }

          j++
        }
      } catch (error: any) {
        logger.error(`!!Errors while checking items in providers[${i}], ${error.stack}`)
      }

      const payment = onSearchCatalog['providers'][i]['payment']

      if (!payment?.tags?.some((tag: any) => tag.descriptor.code === 'BUYER_FINDER_FEES')) {
        errorObj['BUYER_FINDER_FEES'] = {
          tags: `BUYER_FINDER_FEES tag must be present in items[${i}] inside ${mobilitySequence.ON_SEARCH}`,
        }
      }

      if (!payment?.tags?.some((tag: any) => tag.descriptor.code === 'SETTLEMENT_TERMS')) {
        errorObj['SETTLEMENT_TERMS'] = {
          tags: `SETTLEMENT_TERMS tag must be present in items[${i}] inside ${mobilitySequence.ON_SEARCH}`,
        }
      }

      i++
    }

    setValue(`${mobilitySequence.ON_SEARCH}prvdrsId`, prvdrsId)
    setValue(`${mobilitySequence.ON_SEARCH}prvdrLocId`, prvdrLocId)
    setValue(`${mobilitySequence.ON_SEARCH}_itemsId`, Array.from(itemsId))
    setValue(`${mobilitySequence.ON_SEARCH}_storedLocations`, Array.from(storedLocations))
    setValue(`${mobilitySequence.ON_SEARCH}_storedFulfillments`, Array.from(storedFulfillments))
    setValue(`ItemIDS`, itemsId)
  } catch (error: any) {
    logger.error(`!!Error while checking Providers info in /${constants.MOB_ONSEARCH}, ${error.stack}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
