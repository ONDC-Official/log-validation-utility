/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import { getValue, setValue } from '../../../shared/dao'
import constants from '../../../constants'
import { validateSchema, isObjectEmpty } from '../..'
import { logger } from '../../../shared/logger'
import {
  checkUniqueCategoryIds,
  validateContext,
  validateDescriptor,
  validateProvider,
  validateQuote,
  validateSimplePaymentObject,
  validateXInput,
} from './fisChecks'
import { validateGeneralInfo } from './tags'

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
    const itemsId = new Set()
    const categoriesId = getValue(`${constants.ON_SEARCH}categoryId`)
    const insurance = getValue('insurance')
    const isAddOnPresent = getValue('isAddOnPresent')

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
          if (!item?.id) {
            errorObj[`item${index}`] = `item.id: is missing at index: ${index}`
          } else if (!selectedItemId?.includes(item.id)) {
            errorObj[`item${index}`] =
              `item id: ${item.id} in items[${index}], should be one of the selected id from /${constants.SELECT} api`
          } else if (itemsId.has(item.id)) {
            errorObj[`item${index}`] = `duplicate item id: ${item.id} in items[${index}]`
          } else {
            itemsId.add(item.id)
          }

          // Validate category_ids
          if (_.isEmpty(item?.category_ids)) {
            errorObj.category_ids = `category_ids is missing or empty at items[${index}]`
          } else {
            const areCategoryIdsUnique = checkUniqueCategoryIds(item?.category_ids, categoriesId)
            if (!areCategoryIdsUnique) {
              const key = `item${index}_category_ids`
              errorObj[key] = `category_ids value in items[${index}] should match with id provided in categories`
            }
          }

          // Validate descriptor
          const descriptorError = validateDescriptor(
            item?.descriptor,
            constants.ON_SELECT,
            `items[${index}].descriptor`,
            false,
            [],
          )
          if (descriptorError) Object.assign(errorObj, descriptorError)

          // price check
          const price = item?.price
          if (!price) errorObj['price'] = `price is missing at items[${index}]`
          else {
            if (!price?.currency) errorObj['currency'] = `currency is missing at items[${index}].price`
            if (!price?.value) errorObj['value'] = `value is missing at items[${index}].price`
          }

          // checks (time, parent_item_id & add_ons) for MOTOR & HEATLH
          if (insurance != 'MARINE_INSURANCE') {
            //Validate time
            if (_.isEmpty(item?.time)) {
              errorObj.time = `time is missing or empty at items[${index}]`
            } else {
              const time = item?.time
              if (time?.label && time?.label !== 'TENURE')
                errorObj['time.label'] = `label is missing or should be equal to TENURE at items[${index}]`

              if (!time?.duration) {
                errorObj['time.duration'] = `duration is missing at items[${index}]`
              } else if (!/^P(?:(\d+Y)?(\d+M)?(\d+W)?(\d+D)?)?(T(?:(\d+H)?(\d+M)?(\d+S)?))?$/.test(time?.duration)) {
                errorObj['time.duration'] = `incorrect format or type for duration at items[${index}]`
              }
            }

            // Validate parent_item_id
            if (!item?.parent_item_id) errorObj.parent_item_id = `parent_item_id not found in providers[${index}]`
            else {
              const parentItemId: any = getValue('parentItemId')
              if (parentItemId && !parentItemId.includes(item?.parent_item_id)) {
                errorObj.parent_item_id = `parent_item_id: ${item.parent_item_id} doesn't match with parent_item_id from past call in providers[${index}]`
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

                    // price check
                    // if (insurance != 'MOTOR_INSURANCE') {
                    const price = addOn?.price
                    if (!price) errorObj['add_ons.price'] = `price is missing at items[${index}]`
                    else {
                      if (!price?.currency)
                        errorObj['add_ons.currency'] = `currency is missing at items[${index}].price`
                      if (!price?.value) errorObj['add_ons.value'] = `value is missing at items[${index}].price`
                    }
                    // }
                  })
                }

                // return errorObj
              }
            } catch (error: any) {
              logger.error(`!!Error while checking add_ons in /${constants.SELECT}, ${error.stack}`)
            }
          }

          // Validate xinput
          if (insurance != 'LIFE_INSURANCE') {
            const xinput = item?.xinput
            const xinputValidationErrors = validateXInput(xinput, index, constants.ON_SELECT, 0)
            if (xinputValidationErrors) {
              Object.assign(errorObj, xinputValidationErrors)
            }
          }
          // Validate Item tags
          // let tagsValidation: any = {}
          // if (insurance == 'MARINE_INSURANCE') {
          //   tagsValidation = validatePolicyDetails(item?.tags, sequence)
          //   console.log('tagsValidation', sequence, tagsValidation)
          // } else {
          const tagsValidation = validateGeneralInfo(item?.tags, sequence)
          // }
          if (!tagsValidation.isValid) {
            errorObj[`items.tags[${index}]`] = { ...tagsValidation.errors }
          }
        })
        setValue('selectedItemId', itemsId)
      }
    } catch (error: any) {
      logger.error(
        `!!Error while Comparing and Mapping Items in /${constants.ON_SELECT} and /${constants.SELECT}, ${error.stack}`,
      )
    }

    //check payments
    if (insurance == 'LIFE_INSURANCE') {
      try {
        logger.info(`Checking payments details in /${constants.ON_SELECT}`)
        const paymentErrors = validateSimplePaymentObject(onSelect?.payments, constants.ON_SELECT)
        Object.assign(errorObj, paymentErrors)
      } catch (error: any) {
        logger.error(`!!Error while checking payments details in /${constants.ON_SELECT}`, error.stack)
      }
    }

    //check quote
    try {
      logger.info(`Checking quote details in /${constants.ON_SELECT}`)
      const quoteErrors = validateQuote(onSelect?.quote)
      console.log('quoteErrors', quoteErrors)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking quote details in /${constants.ON_SELECT}`, error.stack)
    }
  } catch (error: any) {
    logger.error(`!!Error occcurred while checking message in /${constants.SELECT},  ${error.message}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
