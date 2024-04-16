/* eslint-disable no-prototype-builtins */
// import _ from 'lodash'
import constants from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty, isValidEmail, isValidPhoneNumber } from '../../'
import {
  checkUniqueCategoryIds,
  validateContext,
  validateDescriptor,
  validateProvider,
  validateQuote,
} from './fisChecks'
import { getValue, setValue } from '../../../shared/dao'
import { validateItemsTags } from './tags'
import _ from 'lodash'

export const checkOnInit = (data: any, msgIdSet: any, sequence: string) => {
  try {
    const errorObj: any = {}
    if (!data || isObjectEmpty(data)) {
      return { [constants.ON_INIT]: 'JSON cannot be empty' }
    }

    console.log('sequence', sequence)

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

    setValue(`${constants.ON_INIT}`, data)

    const on_init = message.order

    //provider checks
    try {
      logger.info(`Checking provider details in /${constants.ON_INIT}`)
      const providerErrors = validateProvider(on_init?.provider, constants.ON_INIT)
      Object.assign(errorObj, providerErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking provider details in /${constants.ON_INIT}`, error.stack)
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
            errorObj[
              key
            ] = `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in previous call`
          }

          // Validate parent_item_id
          if (!item?.parent_item_id) errorObj.parent_item_id = `parent_item_id not found in providers[${index}]`
          else {
            const parentItemId: any = getValue('parentItemId')
            if (parentItemId && !parentItemId.has(item?.parent_item_id)) {
              errorObj.parent_item_id = `parent_item_id: ${item.parent_item_id} doesn't match with parent_item_id's from past call in providers[${index}]`
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
            constants.ON_INIT,
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
            logger.error(`!!Error while checking add_ons in /${constants.ON_INIT}, ${error.stack}`)
          }

          // Validate Item tags
          const tagsValidation = validateItemsTags(item?.tags)
          if (!tagsValidation.isValid) {
            Object.assign(errorObj, { tags: tagsValidation.errors })
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking items object in /${constants.ON_INIT}, ${error.stack}`)
    }

    //check fulfillments
    try {
      logger.info(`checking fulfillments array in /${constants.ON_INIT}`)
      const fulfillments = on_init.fulfillments
      if (!fulfillments) {
        errorObj.fulfillments = `fulfillments should be present & non empty in /${constants.ON_INIT}`
      } else {
        const fulfillmentIds = new Set()
        fulfillments?.map((fulfillment: any, i: number) => {
          if (!fulfillment.id) errorObj[`fulfillment${i}`] = `missing fulfillment.id in providers[${i}]`
          else if (fulfillmentIds.has(fulfillment.id)) {
            errorObj[`fulfillment${i}`] = `duplicate fulfillment id: ${fulfillment.id} in providers[${i}]`
          } else {
            fulfillmentIds.add(fulfillment.id)
          }

          if (!fulfillment?.person?.name || typeof fulfillment?.person?.name !== 'string')
            errorObj.name = `person.name should be present with valid value in fulfillment${i} at /${constants.ON_INIT}`

          if (!fulfillment?.contact?.email || isValidEmail(fulfillment?.contact?.email))
            errorObj.email = `contact.email should be present with valid email in fulfillment${i} at /${constants.ON_INIT}`

          if (!fulfillment?.contact?.phone || isValidPhoneNumber(fulfillment?.contact?.phone))
            errorObj.phone = `contact.phone should be present with valid number in fulfillment${i} at /${constants.ON_INIT}`
        })
        setValue(`fulfillmentIds`, fulfillmentIds)
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments array in /${constants.ON_INIT}, ${error.stack}`)
    }

    //check payments
    // try {
    //   logger.info(`Checking payments in /${constants.ON_INIT}`)
    //   const xinputErrors = validatePaymentsObject(on_init?.payments, constants.ON_INIT)
    //   Object.assign(errorObj, xinputErrors)
    // } catch (error: any) {
    //   logger.error(`!!Errors while checking payments in /${constants.ON_INIT}, ${error.stack}`)
    // }

    //check quote
    try {
      logger.info(`Checking quote details in /${constants.ON_INIT}`)
      const quoteErrors = validateQuote(on_init?.quote)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking quote details in /${constants.ON_INIT}`, error.stack)
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_INIT} API`, err)
    return { error: err.message }
  }
}
