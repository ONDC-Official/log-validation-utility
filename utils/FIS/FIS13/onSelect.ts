/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import { getValue } from '../../../shared/dao'
import constants from '../../../constants'
import { validateSchema, isObjectEmpty } from '../..'
import { logger } from '../../../shared/logger'
import {
  checkUniqueCategoryIds,
  validateContext,
  validateDescriptor,
  validateProvider,
  validateQuote,
  validateXInput,
} from './fisChecks'
import { validateItemsTags } from './tags'

export const checkOnSelect = (data: any, msgIdSet: any, sequence: string) => {
  if (!data || isObjectEmpty(data)) {
    return { [constants.ON_SELECT]: 'JSON cannot be empty' }
  }

  console.log('sequence', sequence)

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema('FIS', constants.ON_SELECT, data)
  const contextRes: any = validateContext(context, msgIdSet, constants.SELECT, constants.ON_SELECT)

  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  try {
    const onSelect = message.order
    const categoriesId = getValue(`${constants.ON_SEARCH}categoryId`)

    //provider checks
    try {
      logger.info(`Checking provider details in /${constants.ON_SELECT}`)
      const providerErrors = validateProvider(onSelect?.provider, constants.ON_SELECT)
      Object.assign(errorObj, providerErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking provider details in /${constants.ON_SELECT}`, error.stack)
    }

    //items checks
    try {
      logger.info(`Comparing Items object for /${constants.SELECT} and /${constants.ON_SELECT}`)
      if (_.isEmpty(onSelect?.items)) {
        errorObj['items'] = 'items array is missing or empty in message.order'
      } else {
        const selectedItemId = getValue('selectedItemId')
        onSelect.items.forEach((item: any, index: number) => {
          if (selectedItemId && !selectedItemId.includes(item.id)) {
            const key = `item[${index}].item_id`
            errorObj[key] =
              `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in previous call`
          }

          // Validate parent_item_id
          if (!item?.parent_item_id) errorObj.parent_item_id = `parent_item_id not found in providers[${index}]`
          else {
            const parentItemId = getValue('parentItemId')
            if (parentItemId && !parentItemId.includes(item.parent_item_id)) {
              errorObj.parent_item_id = `parent_item_id: ${item.parent_item_id} doesn't match with parent_item_id from past call in providers[${index}]`
            }
          }

          // Validate category_ids
          if (_.isEmpty(item.category_ids)) {
            errorObj.category_ids = `category_ids is missing or empty at items[${index}]`
          } else {
            const areCategoryIdsUnique = checkUniqueCategoryIds(item.category_ids, categoriesId)
            if (!areCategoryIdsUnique) {
              const key = `item${index}_category_ids`
              errorObj[key] = `category_ids value in items[${index}] should match with id provided in categories`
            }
          }

          // Validate descriptor
          const descriptorError = validateDescriptor(
            item?.descriptor,
            constants.ON_SEARCH,
            `items[${index}].descriptor`,
            false,
          )
          if (descriptorError) Object.assign(errorObj, descriptorError)

          // Validate time
          if (_.isEmpty(item?.time)) {
            errorObj.time = `time is missing or empty at items[${index}]`
          } else {
            const time = item?.time
            if (time?.label && time?.label !== 'TENURE')
              errorObj['time.label'] = `label is missing or should be equal to TENURE at items[${index}]`

            if (time?.duration && !/^PT\d+([YMH])$/.test(time?.duration)) {
              errorObj['time.duration'] = `duration is missing at items[${index}]`
            } else if (!/^PT\d+[MH]$/.test(time?.duration)) {
              errorObj['time.duration'] = `incorrect format or type for duration at items[${index}]`
            }
          }

          // Validate add_ons
          try {
            logger.info(`Checking add_ons`)
            if (_.isEmpty(item?.add_ons))
              errorObj[`item[${index}]_add_ons`] = `add_ons array is missing or empty in ${constants.SELECT}`
            else {
              const selectedAddOnIds: any = getValue(`selectedAddOnIds`)
              item?.add_ons?.forEach((addOn: any, j: number) => {
                const key = `item[${index}]_add_ons[${j}]`

                if (!addOn?.id) {
                  errorObj[`${key}.id`] = `id is missing in add_ons[${j}]`
                } else {
                  if (selectedAddOnIds && !selectedAddOnIds.has(addOn?.id)) {
                    errorObj[`${key}.id`] = `id: ${addOn?.id} not found in previous provided add_ons`
                  }
                }

                if (!addOn?.descriptor?.code || !/^[A-Z_]+$/.test(addOn?.descriptor?.code))
                  errorObj[`${key}.code`] = 'code should be present in a generic enum format'

                if (
                  !addOn?.quantity.selected ||
                  !Number.isInteger(addOn?.quantity.selected) ||
                  addOn?.quantity.selected <= 0
                ) {
                  errorObj[`${key}.code`] = 'Invalid quantity.selected count'
                }
              })
            }

            return errorObj
          } catch (error: any) {
            logger.error(`!!Error while checking add_ons in /${constants.SELECT}, ${error.stack}`)
          }

          // Validate xinput
          const xinput = item?.xinput
          const xinputValidationErrors = validateXInput(xinput, index, constants.ON_SEARCH, 0)
          if (xinputValidationErrors) {
            Object.assign(errorObj, xinputValidationErrors)
          }

          // Validate Item tags
          const tagsValidation = validateItemsTags(item?.tags)
          if (!tagsValidation.isValid) {
            Object.assign(errorObj, { tags: tagsValidation.errors })
          }
        })
      }
    } catch (error: any) {
      logger.error(
        `!!Error while Comparing and Mapping Items in /${constants.ON_SEARCH} and /${constants.SELECT}, ${error.stack}`,
      )
    }

    //check quote
    try {
      logger.info(`Checking quote details in /${constants.ON_UPDATE}`)
      const quoteErrors = validateQuote(onSelect?.quote)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking quote details in /${constants.ON_UPDATE}`, error.stack)
    }
  } catch (error: any) {
    logger.error(`!!Error occcurred while checking message in /${constants.SELECT},  ${error.message}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
