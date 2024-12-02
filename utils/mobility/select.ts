import { logger } from '../../shared/logger'
import { getValue, setValue } from '../../shared/dao'
import constants, { mobilitySequence } from '../../constants'
import { validateSchema, isObjectEmpty } from '../'
// import _ from 'lodash'
import { validateContext } from './mobilityChecks'

export const checkSelect = (data: any, msgIdSet: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [mobilitySequence.SELECT]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema('TRV', constants.SELECT, data)
  const contextRes: any = validateContext(context, msgIdSet, constants.ON_SEARCH, constants.SELECT)
  setValue(`${mobilitySequence.SELECT}_message`, message)
  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  try {
    const storedItemIDS: any = getValue(`${mobilitySequence.ON_SEARCH}_itemsId`)
    const select = message.order
    const itemsId = new Set()

    try {
      logger.info(`Comparing Provider object for /${constants.ON_SEARCH} and /${constants.SELECT}`)
      const providerIDs = getValue(`providerIds`)
      const selectedProviderId = select?.provider?.id

      if (!selectedProviderId) {
        errorObj.prvdrId = `provider.id is missing`
      } else if (!providerIDs || providerIDs.length === 0) {
        logger.info(`Skipping Provider Ids check due to insufficient data`)
      } else if (!providerIDs.includes(selectedProviderId)) {
        errorObj.prvdrId = `Provider Id ${selectedProviderId} in /${constants.SELECT} does not exist in /${constants.ON_SEARCH}`
      } else {
        setValue('providerId', selectedProviderId)
      }
    } catch (error: any) {
      logger.info(
        `Error while comparing provider ids for /${constants.ON_SEARCH} and /${constants.SELECT} api, ${error.stack}`,
      )
    }

    //items checks
    try {
      logger.info(`Comparing Items object for /${constants.ON_SEARCH} and /${constants.SELECT}`)
      if (!select.items) errorObj.item = `items is missing or empty`
      else {
        select.items.forEach((item: any, index: number) => {
          if (!item.id) errorObj.item = `id is missing at index item.${index}`
          else {
            if (storedItemIDS && !storedItemIDS.includes(item.id)) {
              const key = `item[${index}].item_id`
              errorObj[key] = `selected id: ${item.id} should be one of the /item/id mapped in previous call`
            }

            itemsId.add(item.id)
          }
        })
      }

      setValue(`itemIds`, itemsId)
    } catch (error: any) {
      logger.error(
        `!!Error while Comparing and Mapping Items in /${constants.ON_SEARCH} and /${constants.SELECT}, ${error.stack}`,
      )
    }
  } catch (error: any) {
    logger.error(`!!Error occcurred while validating message object in /${constants.SELECT},  ${error.message}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
