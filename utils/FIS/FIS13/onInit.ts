/* eslint-disable no-prototype-builtins */
// import _ from 'lodash'
import constants from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty } from '../../'
import {
  checkUniqueCategoryIds,
  validateCancellationTerms,
  validateContext,
  validateDescriptor,
  validateFulfillmentsArray,
  validatePaymentObject,
  validateProvider,
  validateQuote,
  validateXInput,
} from './fisChecks'
import { getValue } from '../../../shared/dao'
import { validateGeneralInfo } from './tags'
import _, { isEmpty } from 'lodash'

export const checkOnInit = (data: any, msgIdSet: any, sequence: string) => {
  try {
    const errorObj: any = {}
    if (!data || isObjectEmpty(data)) {
      return { [constants.ON_INIT]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('FIS', constants.ON_INIT, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.INIT, constants.ON_INIT)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const on_init = message.order
    const insurance: any = getValue('insurance')
    const isAddOnPresent = getValue('isAddOnPresent')

    //provider checks
    try {
      logger.info(`Checking provider details in /${constants.ON_INIT}`)
      const providerErrors = validateProvider(on_init?.provider, constants.ON_INIT)
      Object.assign(errorObj, providerErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking provider details in /${constants.ON_INIT}`, error.stack)
    }

    //check fulfillments
    const fulfillmentValidation: string[] = validateFulfillmentsArray(on_init?.fulfillments, sequence)
    if (fulfillmentValidation.length > 0) {
      errorObj.fulfillments = fulfillmentValidation
    }

    //checks items
    try {
      logger.info(`Comparing item in /${constants.ON_INIT}`)

      if (_.isEmpty(on_init?.items)) {
        errorObj['items'] = 'items array is missing or empty in message.order'
      } else {
        const selectedItemId = getValue('selectedItemId')
        const categoriesId = getValue(`${constants.ON_SEARCH}categoryId`)
        on_init.items.forEach((item: any, index: number) => {
          if (selectedItemId && !selectedItemId.includes(item.id)) {
            const key = `item[${index}].item_id`
            errorObj[key] =
              `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in previous call`
          }

          // Validate category_ids
          if (_.isEmpty(item?.category_ids)) {
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
            constants.ON_INIT,
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
              errorObj['time.label'] = `label is missing or should be equal to ${label} at items[${index}]`

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

          // checks (parent_item_id, xinput & add_ons) for MOTOR & HEATLH, time for MARINE
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
                  errorObj[`item[${index}]_add_ons`] = `add_ons array is missing or empty in ${constants.ON_INIT}`
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
              logger.error(`!!Error while checking add_ons in /${constants.ON_INIT}, ${error.stack}`)
            }

            // Validate xinput
            const xinput = item?.xinput
            const currIndex = parseInt(sequence.replace('on_init_', ''))
            const xinputValidationErrors = validateXInput(xinput, index, constants.INIT, currIndex ? currIndex - 1 : 0)
            if (xinputValidationErrors) {
              Object.assign(errorObj, xinputValidationErrors)
            }

            // Validate fulfillment_ids
            if (insurance == 'MOTOR_INSURANCE') {
              const fullIds = getValue('fulfillmentIds')
              if (_.isEmpty(item.fulfillment_ids)) {
                errorObj.fulfillment_ids = `fulfillment_ids is missing or empty at items[${index}]`
              } else {
                const areFulfillmentIdsUnique = checkUniqueCategoryIds(item.fulfillment_ids, fullIds)
                if (!areFulfillmentIdsUnique) {
                  const key = `item${index}_fulfillment_ids`
                  errorObj[key] =
                    `fulfillment_ids value in items[${index}] should match with id provided in fulfillments`
                }
              }
            }
          }

          // Validate Item tags
          // let tagsValidation: any = {}
          // if (insurance == 'MARINE_INSURANCE') {
          //   tagsValidation = validatePolicyDetails(item?.tags, sequence)
          //   console.log('tagsValidation', sequence, tagsValidation)
          // } else {
          const tagsValidation = validateGeneralInfo(item?.tags, sequence)
          // tagsValidation = validateItemsTags(item?.tags)
          // }
          if (!tagsValidation.isValid) {
            // Object.assign(errorObj, { tags: tagsValidation.errors })
            errorObj[`items.tags[${index}]`] = { ...tagsValidation.errors }
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking items object in /${constants.ON_INIT}, ${error.stack}`)
    }

    //check quote
    try {
      logger.info(`Checking quote details in /${constants.ON_INIT}`)
      const quoteErrors = validateQuote(on_init?.quote)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking quote details in /${constants.ON_INIT}`, error.stack)
    }

    //check payments
    try {
      logger.info(`Checking payments details in /${constants.ON_INIT}`)
      const paymentErrors = validatePaymentObject(on_init?.payments, constants.ON_INIT)
      Object.assign(errorObj, paymentErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking payments details in /${constants.ON_INIT}`, error.stack)
    }

    //check cancellation terms
    if (insurance != 'MOTOR_INSURANCE')
      try {
        logger.info(`Checking cancellation terms in /${constants.ON_INIT}`)
        const cancellationErrors = validateCancellationTerms(on_init?.cancellation_terms)
        if (!isEmpty(cancellationErrors)) errorObj.cancellation_terms = cancellationErrors
      } catch (error: any) {
        logger.error(`!!Error while checking cancellation_terms in /${constants.ON_INIT}, ${error.stack}`)
      }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_INIT} API`, err)
    return { error: err.message }
  }
}