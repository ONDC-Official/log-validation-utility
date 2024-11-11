/* eslint-disable no-prototype-builtins */
import constants from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty } from '../../'
import { getValue, setValue } from '../../../shared/dao'
import {
  checkUniqueCategoryIds,
  validateCancellationTerms,
  validateContext,
  validateDescriptor,
  validateDocuments,
  validateFulfillmentsArray,
  validatePaymentObject,
  validateProvider,
  validateQuote,
} from './fisChecks'
import { validateGeneralInfo } from './tags'
import _ from 'lodash'

export const checkOnUpdate = (data: any, msgIdSet: any) => {
  try {
    const errorObj: any = {}
    if (!data || isObjectEmpty(data)) {
      return { [constants.ON_UPDATE]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('FIS', constants.ON_UPDATE, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.ON_CONFIRM, constants.ON_UPDATE)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const on_update = message.order
    const insurance: any = getValue('insurance')
    const isAddOnPresent = getValue('isAddOnPresent')

    if (!on_update?.created_at) errorObj.created_at = `created_at in missing at message.order`
    else {
      const createdAt = getValue('created_at')
      if (createdAt != on_update?.created_at)
        errorObj.created_at = `created_at should be equal to created_at of past call`
    }
    if (!on_update?.updated_at) errorObj.updated_at = `updated_at in missing at message.order`
    else {
      const updatedAt = getValue('updated_at')
      if (context?.timestamp < on_update?.updated_at)
        errorObj.updated_at = `updated_at should be either equal or less than context.timestamp`
      else if (updatedAt != on_update?.updated_at)
        errorObj.updated_at = `updated_at shouldn't be equal to updated_at of past call`
    }

    //validate id
    try {
      logger.info(`Checking id in message object  /${constants.ON_UPDATE}`)
      if (!on_update?.id) {
        errorObj.id = `Id in message object must be present/${constants.ON_UPDATE}`
      } else {
        setValue('orderId', on_update?.id)
      }
    } catch (error: any) {
      logger.error(`!!Error while checking id in message object  /${constants.ON_UPDATE}, ${error.stack}`)
    }

    //validate status
    try {
      logger.info(`Checking status in message object  /${constants.ON_UPDATE}`)
      if (!on_update?.status) {
        errorObj.status = `status in message object must be present/${constants.ON_UPDATE}`
      } else if (on_update?.status !== 'ACTIVE')
        errorObj.status = `status should be a generic enum 'ACTIVE' at /${constants.ON_UPDATE}`
    } catch (error: any) {
      logger.error(`!!Error while checking status in message object  /${constants.ON_UPDATE}, ${error.stack}`)
    }

    //provider checks
    try {
      logger.info(`Checking provider id /${constants.ON_UPDATE}`)
      const providerErrors = validateProvider(on_update?.provider, constants.ON_UPDATE)
      Object.assign(errorObj, providerErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking provider id /${constants.ON_UPDATE}, ${error.stack}`)
    }

    //checks items
    try {
      logger.info(`Comparing item in /${constants.ON_UPDATE}`)

      if (_.isEmpty(on_update?.items)) {
        errorObj['items'] = 'items array is missing or empty in message.order'
      } else {
        const selectedItemId = getValue('selectedItemId')
        const categoriesId = getValue(`${constants.ON_SEARCH}categoryId`)
        const fullIds = getValue('fulfillmentIds')
        on_update?.items.forEach((item: any, index: number) => {
          if (selectedItemId && !selectedItemId.includes(item.id)) {
            const key = `item[${index}].item_id`
            errorObj[key] =
              `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in previous call`
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

          // Validate fulfillment_ids
          if (_.isEmpty(item.fulfillment_ids)) {
            errorObj.fulfillment_ids = `fulfillment_ids is missing or empty at items[${index}]`
          } else {
            const areFulfillmentIdsUnique = checkUniqueCategoryIds(item.fulfillment_ids, fullIds)
            if (!areFulfillmentIdsUnique) {
              const key = `item${index}_fulfillment_ids`
              errorObj[key] = `fulfillment_ids value in items[${index}] should match with id provided in fulfillments`
            }
          }

          // Validate descriptor
          const descriptorError = validateDescriptor(
            item?.descriptor,
            constants.ON_UPDATE,
            `items[${index}].descriptor`,
            false,
            [],
          )
          if (descriptorError) Object.assign(errorObj, descriptorError)

          // Validate price
          const price = item?.price
          if (!price) errorObj[`items[${index}].price`] = `price is missing at items[${index}]`
          else {
            if (!price?.currency) errorObj[`items[${index}].currency`] = `currency is missing at items[${index}].price`
            if (!price?.value) errorObj[`items[${index}].value`] = `value is missing at items[${index}].price`
          }

          // Validate time
          if (_.isEmpty(item?.time)) {
            errorObj.time = `time is missing or empty at items[${index}]`
          } else {
            const time = item?.time
            //Coverage Time -> MARINE
            const label = insurance == 'MARINE_INSURANCE' ? 'Coverage Time' : 'TENURE'
            if (time?.label && time?.label !== label)
              errorObj['time.label'] = `label is missing or should be equal to  ${label} at items[${index}]`

            if (insurance != 'MARINE_INSURANCE') {
              if (time?.duration) {
                errorObj['time.duration'] = `duration is missing at items[${index}]`
              } else if (!/^PT\d+([YMH])$/.test(time?.duration)) {
                errorObj['time.duration'] = `incorrect format or type for duration at items[${index}]`
              }
            } else {
              if (!time?.range || !time?.range?.start || !time?.range?.end) {
                errorObj['time.range'] = `range.start/end is missing at items[${index}].time`
              }
            }
          }

          // checks (parent_item_id & add_ons) for MOTOR & HEATLH, time for MARINE
          if (insurance != 'MARINE_INSURANCE') {
            // Validate parent_item_id
            if (!item?.parent_item_id) errorObj.parent_item_id = `parent_item_id not found in providers[${index}]`
            else {
              const parentItemId: any = getValue('parentItemId')
              if (parentItemId && !parentItemId.includes(item?.parent_item_id)) {
                errorObj.parent_item_id = `parent_item_id: ${item.parent_item_id} doesn't match with parent_item_id's from past call in providers[${index}]`
              }
            }

            // Validate add_ons
            try {
              if (isAddOnPresent) {
                logger.info(`Checking add_ons`)
                if (_.isEmpty(item?.add_ons))
                  errorObj[`item[${index}]_add_ons`] = `add_ons array is missing or empty in ${constants.ON_UPDATE}`
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

                    const price = addOn?.price
                    if (!price) errorObj[`${key}.price`] = `price is missing at items[${index}]`
                    else {
                      if (!price?.currency) errorObj[`${key}.currency`] = `currency is missing at items[${index}].price`
                      if (!price?.value) errorObj[`${key}.value`] = `value is missing at items[${index}].price`
                    }

                    if (!addOn?.descriptor?.code || !/^[A-Z_]+$/.test(addOn?.descriptor?.code))
                      errorObj[`${key}.code`] = 'code should be present in a generic enum format'

                    if (!addOn?.quantity?.selected?.count) {
                      errorObj[`${key}.code`] = 'quantity.count is missing in add_ons'
                    } else if (
                      !Number.isInteger(addOn?.quantity.selected.count) ||
                      addOn?.quantity.selected.count <= 0
                    ) {
                      errorObj[`${key}.code`] = 'Invalid quantity.selected count'
                    }
                  })
                }
              }
            } catch (error: any) {
              logger.error(`!!Error while checking add_ons in /${constants.ON_UPDATE}, ${error.stack}`)
            }
          }

          // Validate Item tags
          // let tagsValidation: any = {}
          // if (insurance == 'MARINE_INSURANCE') {
          //   tagsValidation = validatePolicyDetails(item?.tags, constants.ON_UPDATE)
          // } else {
          const tagsValidation = validateGeneralInfo(item?.tags, constants.ON_UPDATE)
          // tagsValidation = validateItemsTags(item?.tags)
          // }
          if (!tagsValidation.isValid) {
            // Object.assign(errorObj, { tags: tagsValidation.errors })
            errorObj[`items.tags[${index}]`] = { ...tagsValidation.errors }
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking items object in /${constants.ON_UPDATE}, ${error.stack}`)
    }

    //check fulfillments
    const fulfillmentValidation: string[] = validateFulfillmentsArray(on_update?.fulfillments, 'on_update')
    if (fulfillmentValidation.length > 0) {
      errorObj.fulfillments = fulfillmentValidation
    }

    //check quote
    try {
      logger.info(`Checking quote details in /${constants.ON_UPDATE}`)
      const quoteErrors = validateQuote(on_update?.quote)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking quote details in /${constants.ON_UPDATE}`, error.stack)
    }

    //check payments
    try {
      logger.info(`Checking payments details in /${constants.ON_UPDATE}`)
      const paymentErrors = validatePaymentObject(on_update?.payments, constants.ON_UPDATE)
      Object.assign(errorObj, paymentErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking payments details in /${constants.ON_UPDATE}`, error.stack)
    }

    //check cancellation terms
    try {
      logger.info(`Checking cancellation terms in /${constants.ON_UPDATE}`)
      const cancellationErrors = validateCancellationTerms(on_update?.cancellation_terms)
      Object.assign(errorObj, cancellationErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation_terms in /${constants.ON_UPDATE}, ${error.stack}`)
    }

    //check documents
    try {
      logger.info(`Checking documents in /${constants.ON_UPDATE}`)
      const documentsErrors = validateDocuments(on_update?.documents, constants.ON_UPDATE)
      Object.assign(errorObj, documentsErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking documents in /${constants.ON_UPDATE}, ${error.stack}`)
    }

    setValue('updated_at', on_update?.updated_at)
    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_UPDATE} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}
