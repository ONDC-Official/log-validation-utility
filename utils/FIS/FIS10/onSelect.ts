/* eslint-disable no-case-declarations */
/* eslint-disable no-prototype-builtins */
import { logger } from '../../../shared/logger'
import { getValue, setValue } from '../../../shared/dao'
import constants from '../../../constants'
import { validateSchema, isObjectEmpty } from '../../'
import { validateContext, validateQuote } from './fisChecks'
// import { validateItemsTags } from './tags'
import { isEmpty } from 'lodash'
import _ from 'lodash'

export const checkOnSelect = (data: any, msgIdSet: any, flow: string) => {
  if (!data || isObjectEmpty(data)) {
    return { [constants.ON_SELECT]: 'JSON cannot be empty' }
  }

  console.log('flow---------------', flow)

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema('FIS10', constants.ON_SELECT, data)
  const contextRes: any = validateContext(context, msgIdSet, constants.SELECT, constants.ON_SELECT)
  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  const onSelect: any = message.order
  const itemsId = new Set()
  const offersId = new Set()
  const fulfillmentsIds = new Set()
  const fulfillmentTypes = new Set()

  //check Provider
  try {
    logger.info(`Comparing Provider object for /${constants.SELECT} and /${constants.ON_SELECT}`)
    const providerId = onSelect?.provider?.id
    if (!providerId) errorObj.prvdrId = `provider.id is missing in /${constants.ON_SELECT}`
    else {
      const selectedProviderId: any = getValue(`providerId`)
      if (selectedProviderId && !_.isEqual(selectedProviderId, providerId)) {
        errorObj.prvdrId = `Provider Id ${providerId} in /${constants.ON_SELECT} does not exist in /${constants.SELECT}`
      }
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing provider id for /${constants.ON_SELECT} and /${constants.SELECT} api, ${error.stack}`,
    )
  }

  // check fulfillments
  try {
    logger.info(`Checking fulfillments`)
    const fulfillments = onSelect?.fulfillments

    if (isEmpty(fulfillments)) {
      errorObj['fulfillments'] = 'fulfillments array is missing or empty'
    } else {
      const fullTypes = getValue('fullTypes')
      fulfillments.forEach((fulfillment: any, j: number) => {
        logger.info(`Validating uniqueness for id at fulfillments[${j}]...`)
        const key = `fulfillment${j}`
        if (!fulfillment?.id) {
          errorObj[`${key}.id`] = `fulfillment.id: is missing at index: ${j}`
        } else if (fulfillmentsIds.has(fulfillment.id)) {
          errorObj[`${key}.id`] = `duplicate fulfillment id: ${fulfillment.id}`
        } else {
          fulfillmentsIds.add(fulfillment.id)
        }

        if (!fulfillment?.type) {
          errorObj[`${key}.type`] = `fulfillment.type: is missing at index: ${j}`
        } else if (fullTypes?.includes(fulfillment.type)) {
          errorObj[
            `${key}.type`
          ] = `fulfillment type: ${fulfillment.type} should be one of the selected types in past call:${fullTypes}`
        } else fulfillmentTypes.add(fulfillment.type)
      })

      setValue('fulfillmentsIds', fulfillmentsIds)
    }
  } catch (error: any) {
    logger.error(`!!Errors while checking fulfillments`)
  }

  // check items
  try {
    logger.info(`Checking items `)
    const items = onSelect?.items

    if (isEmpty(items)) {
      errorObj[`items`] = 'items array is missing or empty in message.order'
    } else {
      const selectedItemId = getValue('selectedItemId')
      items.forEach((item: any, j: number) => {
        logger.info(`Validating uniqueness for item id in items[${j}]...`)
        if (!item?.id) {
          errorObj[`item${j}`] = `item.id: is missing at index: ${j}`
        } else if (!selectedItemId?.includes(item.id)) {
          errorObj[
            `item${j}`
          ] = `item id: ${item.id} in items[${j}], should be one of the selected id from /${constants.SELECT} api`
        } else if (itemsId.has(item.id)) {
          errorObj[`item${j}`] = `duplicate item id: ${item.id} in items[${j}]`
        } else {
          itemsId.add(item.id)
        }

        // price checks
        if (!item?.price) {
          errorObj[`item${j}.price`] = `price is missing in item${j}`
        } else {
          if (!item?.price?.value) {
            errorObj[`item${j}.value`] = `value is missing in item${j}.price`
          }

          if (!item?.price?.offered_value) {
            errorObj[`item${j}.offered_value`] = `offered_value is missing in item${j}.price`
          }
        }

        // time checks
        if (!item?.time) {
          errorObj[`item${j}.time`] = `time is missing in item${j}`
        } else {
          if (!item?.time?.label) {
            errorObj[`item${j}.label`] = `label is missing in item${j}.time`
          } else if (item?.time?.label !== 'VALIDITY') {
            errorObj[
              `item${j}.label`
            ] = `value is wrong, should be in a generic enum format i.e. 'VALIDITY'  in item${j}.time`
          }

          // Check if either duration or timestamp is present, but not both
          if (!item?.time?.duration && !item?.time?.timestamp) {
            errorObj[
              `item${j}.duration/timestamp`
            ] = `Either duration or timestamp must be present in item${j}.time, but not both`
          } else if (item?.time?.duration && item?.time?.timestamp) {
            errorObj[
              `item${j}.duration/timestamp`
            ] = `Both duration and timestamp are present in item${j}.time, but only one should be`
          }
        }

        // Validate fulfillment_ids
        if (item?.fulfillment_ids) {
          item?.fulfillment_ids?.forEach((fulfillment_id: string, index: number) => {
            const areFulfillmentIdsUnique = fulfillmentsIds.has(fulfillment_id)
            if (!areFulfillmentIdsUnique) {
              const key = `item${j}_fulfillment_ids[${index}]`
              errorObj[key] = `fulfillment_id value in /items[${j}] should match with id provided in fulfillments`
            }
          })
        }
      })

      setValue('itemsId', itemsId)
    }
  } catch (error: any) {
    logger.error(`!!Errors while checking items, ${error.stack}`)
  }

  // check offers
  try {
    logger.info(`Checking offers`)
    const offers = onSelect?.offers

    if (!isEmpty(offers)) {
      const selectedOfferId = getValue('selectedOfferId')
      offers.forEach((offer: any, j: number) => {
        logger.info(`Validating uniqueness for offer id in offers[${j}]...`)
        if (!offer?.id) {
          errorObj[`offer${j}`] = `offer.id: is missing at index: ${j}`
        } else if (!selectedOfferId?.includes(offer.id)) {
          errorObj[
            `offer${j}`
          ] = `offer id: ${offer.id} in offers[${j}], should be one of the selected id from /${constants.SELECT} api`
        } else if (offersId.has(offer.id)) {
          errorObj[`offer${j}`] = `duplicate offer id: ${offer.id}`
        } else {
          offersId.add(offer.id)
        }

        // Validate item_ids
        if (isEmpty(offer?.item_ids)) {
          errorObj[`item_ids`] = `item_ids is missing or empty at offers[${j}]`
        } else {
          const areItemsIdsUnique = itemsId.has(offer.item_ids)
          if (!areItemsIdsUnique) {
            const key = `offer${j}_item_ids`
            errorObj[key] = `item_ids value in offers[${j}] should match with id provided in fulfillments`
          }
        }

        // Validate offer tags
        // const tagsValidation = validateOffersTags(offer?.tags)
        // if (!tagsValidation.isValid) {
        //   Object.assign(errorObj, { tags: tagsValidation.errors })
        // }
      })
    }
  } catch (error: any) {
    logger.error(`!!Errors while checking offers, ${error.stack}`)
  }

  //check quote
  try {
    logger.info(`Checking quote details in /${constants.ON_SELECT}`)
    const quoteErrors = validateQuote(onSelect?.quote)
    Object.assign(errorObj, quoteErrors)
  } catch (error: any) {
    logger.error(`!!Error while checking quote details in /${constants.ON_SELECT}`, error.stack)
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
