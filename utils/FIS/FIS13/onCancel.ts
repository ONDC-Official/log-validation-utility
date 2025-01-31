/* eslint-disable no-prototype-builtins */
import constants, { FisApiSequence } from '../../../constants'
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

export const checkOnCancel = (data: any, msgIdSet: any) => {
  try {
    const errorObj: any = {}
    if (!data || isObjectEmpty(data)) {
      return { [FisApiSequence.ON_CANCEL]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('FIS', constants.ON_CANCEL, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.CANCEL, constants.ON_CANCEL)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const on_cancel = message.order
    const insurance: any = getValue('insurance')
    const isAddOnPresent = getValue('isAddOnPresent')

    if (!on_cancel?.created_at) errorObj.created_at = `created_at in missing at message.order`
    else {
      const creadtedAt = getValue('created_at')
      if (creadtedAt && creadtedAt != on_cancel?.created_at)
        errorObj.created_at = `created_at${on_cancel?.created_at} should be same as created_at${creadtedAt} sent in /${constants.ON_CONFIRM}`
    }
    if (!on_cancel?.updated_at) errorObj.updated_at = `updated_at in missing at message.order`
    else {
      const updatedAt = getValue('updated_at')
      if (context?.timestamp < on_cancel?.updated_at)
        errorObj.updated_at = `updated_at should be either equal or less than context.timestamp`

      if (updatedAt == on_cancel?.updated_at)
        errorObj.updated_at = `updated_at${on_cancel?.updated_at} can't be same as past call's updated_at${updatedAt}`
      setValue('updated_at', on_cancel?.updated_at)
    }

    //validate id
    try {
      logger.info(`Checking id in message object  /${constants.ON_CANCEL}`)
      if (!on_cancel?.id) {
        errorObj.id = `Id in message object must be present/${constants.ON_CANCEL}`
      } else {
        const orderId = getValue('orderId')
        if (orderId && orderId != on_cancel?.id)
          errorObj.orderId = `order.id${on_cancel?.id} should be same as order.id${orderId} sent in /${constants.ON_CONFIRM}`
      }
    } catch (error: any) {
      logger.error(`!!Error while checking id in message object  /${constants.ON_CANCEL}, ${error.stack}`)
    }

    //validate status
    try {
      logger.info(`Checking status in message object  /${constants.ON_CANCEL}`)
      if (!on_cancel?.status) {
        errorObj.status = `status in message object must be present/${constants.ON_CANCEL}`
      } else if (on_cancel?.status !== 'CANCELLATION_INITIATED')
        errorObj.status = `status should be a generic enum 'CANCELLATION_INITIATED' at /${constants.ON_CANCEL}`
    } catch (error: any) {
      logger.error(`!!Error while checking status in message object  /${constants.ON_CANCEL}, ${error.stack}`)
    }

    //provider checks
    try {
      logger.info(`Checking provider id /${constants.ON_CANCEL}`)
      const providerErrors = validateProvider(on_cancel?.provider, constants.ON_CANCEL)
      Object.assign(errorObj, providerErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking provider id /${constants.ON_CANCEL}, ${error.stack}`)
    }

    //check fulfillments
    const fulfillmentValidation: string[] = validateFulfillmentsArray(on_cancel?.fulfillments, 'on_cancel')
    if (fulfillmentValidation.length > 0) {
      errorObj.fulfillments = fulfillmentValidation
    }

    //checks items
    try {
      logger.info(`Comparing item in /${constants.ON_CANCEL}`)

      if (_.isEmpty(on_cancel?.items)) {
        errorObj['items'] = 'items array is missing or empty in message.order'
      } else {
        const selectedItemId = getValue('selectedItemId')
        const categoriesId = getValue(`${constants.ON_SEARCH}categoryId`)
        const fullIds = getValue('fulfillmentIds')
        on_cancel.items.forEach((item: any, index: number) => {
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
            constants.ON_CANCEL,
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
              if (!time?.duration) {
                errorObj['time.duration'] = `duration is missing at items[${index}]`
              } else if (!/^P(?:(\d+Y)?(\d+M)?(\d+W)?(\d+D)?)?(T(?:(\d+H)?(\d+M)?(\d+S)?))?$/.test(time?.duration)) {
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
              logger.error(`!!Error while checking add_ons in /${constants.ON_CANCEL}, ${error.stack}`)
            }
          }

          // Validate Item tags
          // let tagsValidation: any = {}
          // if (insurance == 'MARINE_INSURANCE') {
          //   tagsValidation = validatePolicyDetails(item?.tags, constants.ON_CANCEL)
          // } else {
          const tagsValidation = validateGeneralInfo(item?.tags, constants.ON_CANCEL)
          // tagsValidation = validateItemsTags(item?.tags)
          // }
          if (!tagsValidation.isValid) {
            // Object.assign(errorObj, { tags: tagsValidation.errors })
            errorObj[`items.tags[${index}]`] = { ...tagsValidation.errors }
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking items object in /${constants.ON_CANCEL}, ${error.stack}`)
    }

    //check quote
    try {
      logger.info(`Checking quote details in /${constants.ON_CANCEL}`)
      const quoteErrors = validateQuote(on_cancel?.quote)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking quote details in /${constants.ON_CANCEL}`, error.stack)
    }

    //check payments
    try {
      logger.info(`Checking payments details in /${constants.ON_CANCEL}`)
      const paymentErrors = validatePaymentObject(on_cancel?.payments, constants.ON_CANCEL)
      Object.assign(errorObj, paymentErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking payments details in /${constants.ON_CANCEL}`, error.stack)
    }

    //check cancellation terms
    if (insurance != 'MOTOR_INSURANCE') {
      try {
        logger.info(`Checking cancellation terms in /${constants.ON_CANCEL}`)
        const cancellationErrors = validateCancellationTerms(on_cancel?.cancellation_terms)
        Object.assign(errorObj, cancellationErrors)
      } catch (error: any) {
        logger.error(`!!Error while checking cancellation_terms in /${constants.ON_CANCEL}, ${error.stack}`)
      }
    }

    //check documents
    try {
      logger.info(`Checking documents in /${constants.ON_CANCEL}`)
      const cancellationErrors = validateDocuments(on_cancel?.documents, constants.ON_CANCEL)
      Object.assign(errorObj, cancellationErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking documents in /${constants.ON_CANCEL}, ${error.stack}`)
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_CANCEL} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}
