/* eslint-disable no-prototype-builtins */
import { getValue, setValue } from '../../../shared/dao'
import constants from '../../../constants'
import { validateSchema, isObjectEmpty } from '../../'
import { isEmpty } from 'lodash'
import { logger } from '../../../shared/logger'
import { validateContext } from './fisChecks'

export const checkSelect = (data: any, msgIdSet: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [constants.SELECT]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema('FIS10', constants.SELECT, data)
  const contextRes: any = validateContext(context, msgIdSet, constants.ON_SEARCH, constants.SELECT)
  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  setValue(`${constants.SELECT}`, data)
  const selectedItemId: string[] = []
  const selectedOfferId: string[] = []

  try {
    const select = message.order

    //check provider
    try {
      logger.info(`Comparing Provider object for /${constants.ON_SEARCH} and /${constants.SELECT}`)

      const selectedProviderId = select?.provider?.id
      console.log('selectedProviderId', selectedProviderId)
      if (!selectedProviderId) errorObj.prvdrId = `provider.id is missing in /${constants.SELECT}`
      else {
        const providerIDs: any = getValue(`${constants.ON_SEARCH}prvdrsId`)
        if (!providerIDs || providerIDs.length === 0) {
          logger.info(`Skipping Provider Ids check due to insufficient data`)
        } else {
          if (!providerIDs.includes(selectedProviderId)) {
            errorObj.prvdrId = `Provider Id ${selectedProviderId} in /${constants.SELECT} does not exist in /${constants.ON_SEARCH}`
          } else {
            setValue('providerId', selectedProviderId)
          }
        }
      }
    } catch (error: any) {
      logger.info(
        `Error while comparing provider ids for /${constants.ON_SEARCH} and /${constants.SELECT} api, ${error.stack}`,
      )
    }

    //check fulfillments
    try {
      logger.info(`checking fulfillments object for /${constants.ON_SEARCH} and /${constants.SELECT}`)

      if (isEmpty(select?.fulfillments)) {
        errorObj['fulfillments'] = 'fulfillments array is missing or empty'
      } else {
        const fullTypes: string[] = []
        const fulfillmentTypes: any = getValue(`fulfillmentTypes`)
        select.fulfillments.forEach((fulfillment: any, index: number) => {
          const key = `fulfillment${index}`
          if (!fulfillment?.type) {
            errorObj[`${key}.type`] = `fulfillment.type: is missing at index: ${index}`
          } else if (fulfillmentTypes && !fulfillmentTypes.includes(fulfillment?.type)) {
            errorObj[
              `${key}.type`
            ] = `fulfillment.type:  at index: ${index}, should be one of the type as sent in offers of /${constants.ON_SEARCH}`
          } else fullTypes.push(fulfillment?.type)
        })

        setValue('fullTypes', fullTypes)
      }
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking fulfillments in /${constants.SELECT},  ${error.message}`)
      return { error: error.message }
    }

    //check items
    try {
      logger.info(`checking item array in /${constants.SELECT}`)

      if (isEmpty(select?.items)) {
        errorObj.items = `items must be present & should be non empty in /${constants.SELECT}`
      } else {
        const itemId = getValue(`${constants.ON_SEARCH}_itemsId`)
        select?.items?.forEach((item: any, index: number) => {
          // Validate item id
          if (!item?.id) {
            errorObj[`item[${index}].id`] = `id should be present at item[${index}] /${constants.SELECT}`
          } else {
            selectedItemId?.push(item?.id)
            if (itemId && !itemId.includes(item.id)) {
              const key = `item[${index}].item_id`
              errorObj[
                key
              ] = `/message/order/items/id in item: ${item.id} should be one of the item.id mapped in previous call`
            }
          }

          const count = item?.quantity?.selected?.count
          if (!count) {
            errorObj[`item[${index}].count`] = `count should be present at item[${index}].quantity /${constants.SELECT}`
          }

          if (item?.price) {
            const price = item.price
            if (!price?.currency) {
              errorObj[
                `item[${index}].currency`
              ] = `currency should be present at item[${index}].price /${constants.SELECT}`
            }

            if (!price?.offered_value) {
              errorObj[
                `item[${index}].offered_value`
              ] = `offered_value should be present at item[${index}].price /${constants.SELECT}`
            }
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking item in /${constants.SELECT},  ${error.message}`)
    }

    //check offers
    try {
      logger.info(`checking offers object for /${constants.ON_SEARCH} and /${constants.SELECT}`)

      if (!isEmpty(select?.offers)) {
        const offerIds = getValue(`${constants.ON_SEARCH}_offerIds`)
        select.offers.forEach((offer: any, index: number) => {
          // Validate offer id
          const key = `offers[${index}]`
          if (!offer?.id) {
            errorObj[`${key}.id`] = `id is missing at offer[${index}] /${constants.SELECT}`
          } else {
            selectedOfferId?.push(offer?.id)
            if (offerIds && !offerIds.includes(offer.id)) {
              errorObj[`${key}.id`] = `id in offer: ${offer.id} should be one of the offer.id mapped in previous call`
            }
          }

          if (!offer?.item_ids) {
            errorObj[`${key}.item_ids`] = `item_ids is missing at offer[${index}] /${constants.SELECT}`
          } else {
            if (selectedItemId && !selectedItemId.includes(offer?.item_ids)) {
              errorObj[`${key}.item_ids`] = `item_ids in offer: ${offer.id} should be one of the id sent in items array`
            }
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking offers in /${constants.SELECT},  ${error.message}`)
      return { error: error.message }
    }

    setValue('selectedItemId', selectedItemId)
    setValue('selectedOfferId', selectedOfferId)
  } catch (error: any) {
    logger.error(`!!Error occcurred while checking message in /${constants.SELECT},  ${error.message}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
