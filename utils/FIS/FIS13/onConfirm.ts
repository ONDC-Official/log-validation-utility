/* eslint-disable no-prototype-builtins */
import constants, { FisApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty, isValidEmail, isValidPhoneNumber } from '../../'
import { getValue, setValue } from '../../../shared/dao'
import {
  checkUniqueCategoryIds,
  validateCancellationTerms,
  validateContext,
  validateDescriptor,
  validateDocuments,
  // validateFulfillments,
  // validatePayments,
  validateProvider,
  validateQuote,
} from './fisChecks'
import { validateItemsTags } from './tags'
import _ from 'lodash'

export const checkOnConfirm = (data: any, msgIdSet: any) => {
  const onCnfrmObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [FisApiSequence.ON_CONFIRM]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('FIS', constants.ON_CONFIRM, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.CONFIRM, constants.ON_CONFIRM)

    if (schemaValidation !== 'error') {
      Object.assign(onCnfrmObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(onCnfrmObj, contextRes.ERRORS)
    }

    setValue(`${FisApiSequence.ON_CONFIRM}`, data)

    const on_confirm = message.order
    const itemIDS: any = getValue('ItmIDS')
    const itemIdArray: any[] = []

    let newItemIDSValue: any[]

    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      on_confirm.items.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
    }

    setValue('ItmIDS', newItemIDSValue)

    //validate id
    try {
      logger.info(`Checking id in message object  /${constants.ON_CONFIRM}`)
      if (!on_confirm?.id) {
        onCnfrmObj.id = `Id in message object must be present/${constants.ON_CONFIRM}`
      } else {
        setValue('orderId', on_confirm?.id)
      }
    } catch (error: any) {
      logger.error(`!!Error while checking id in message object  /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    //validate status
    try {
      logger.info(`Checking status in message object  /${constants.ON_CONFIRM}`)
      if (!on_confirm?.status) {
        onCnfrmObj.status = `status in message object must be present/${constants.ON_CONFIRM}`
      } else if (on_confirm?.status !== 'ACTIVE')
        onCnfrmObj.status = `status should be a generic enum 'ACTIVE' at /${constants.ON_CONFIRM}`
    } catch (error: any) {
      logger.error(`!!Error while checking status in message object  /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    //provider checks
    try {
      logger.info(`Checking provider id /${constants.ON_CONFIRM}`)
      const providerErrors = validateProvider(on_confirm?.provider, constants.ON_CONFIRM)
      Object.assign(on_confirm, providerErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking provider id /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    //checks items
    try {
      logger.info(`Comparing item in /${constants.ON_CONFIRM}`)

      if (_.isEmpty(on_confirm?.items)) {
        onCnfrmObj['items'] = 'items array is missing or empty in message.order'
      } else {
        const selectedItemId = getValue('selectedItemId')
        const categoriesId = getValue(`${constants.ON_SEARCH}categoryId`)
        on_confirm.items.forEach((item: any, index: number) => {
          if (selectedItemId && !selectedItemId.includes(item.id)) {
            const key = `item[${index}].item_id`
            onCnfrmObj[
              key
            ] = `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in previous call`
          }

          // Validate parent_item_id
          if (!item?.parent_item_id) onCnfrmObj.parent_item_id = `parent_item_id not found in providers[${index}]`
          else {
            const parentItemId: any = getValue('parentItemId')
            if (parentItemId && !parentItemId.has(item?.parent_item_id)) {
              onCnfrmObj.parent_item_id = `parent_item_id: ${item.parent_item_id} doesn't match with parent_item_id's from past call in providers[${index}]`
            }
          }

          // Validate category_ids
          if (_.isEmpty(item.category_ids)) {
            onCnfrmObj.category_ids = `category_ids is missing or empty at items[${index}]`
          } else {
            const areCategoryIdsUnique = checkUniqueCategoryIds(item.category_ids, categoriesId)
            if (!areCategoryIdsUnique) {
              const key = `item${index}_category_ids`
              onCnfrmObj[key] = `category_ids value in items[${index}] should match with id provided in categories`
            }
          }

          // Validate descriptor
          const descriptorError = validateDescriptor(
            item?.descriptor,
            constants.ON_CONFIRM,
            `items[${index}].descriptor`,
            false,
          )
          if (descriptorError) Object.assign(onCnfrmObj, descriptorError)

          // Validate time
          if (_.isEmpty(item?.time)) {
            onCnfrmObj.time = `time is missing or empty at items[${index}]`
          } else {
            const time = item?.time
            if (time?.label && time?.label !== 'TENURE')
              onCnfrmObj['time.label'] = `label is missing or should be equal to TENURE at items[${index}]`

            if (time?.duration && !/^PT\d+([YMH])$/.test(time?.duration)) {
              onCnfrmObj['time.duration'] = `duration is missing at items[${index}]`
            } else if (!/^PT\d+[MH]$/.test(time?.duration)) {
              onCnfrmObj['time.duration'] = `incorrect format or type for duration at items[${index}]`
            }
          }

          // Validate add_ons
          try {
            logger.info(`Checking add_ons`)
            if (_.isEmpty(item?.add_ons))
              onCnfrmObj[`item[${index}]_add_ons`] = `add_ons array is missing or empty in ${constants.ON_CONFIRM}`
            else {
              const selectedAddOnIds: any = getValue(`selectedAddOnIds`)
              item?.add_ons?.forEach((addOn: any, j: number) => {
                const key = `item[${index}]_add_ons[${j}]`

                if (!addOn?.id) {
                  onCnfrmObj[`${key}.id`] = `id is missing in add_ons[${j}]`
                } else {
                  if (selectedAddOnIds && !selectedAddOnIds.has(addOn?.id)) {
                    onCnfrmObj[`${key}.id`] = `id: ${addOn?.id} not found in previous provided add_ons`
                  }
                }

                if (!addOn?.descriptor?.code || !/^[A-Z_]+$/.test(addOn?.descriptor?.code))
                  onCnfrmObj[`${key}.code`] = 'code should be present in a generic enum format'

                if (
                  !addOn?.quantity.selected ||
                  !Number.isInteger(addOn?.quantity.selected) ||
                  addOn?.quantity.selected <= 0
                ) {
                  onCnfrmObj[`${key}.code`] = 'Invalid quantity.selected count'
                }
              })
            }

            return onCnfrmObj
          } catch (error: any) {
            logger.error(`!!Error while checking add_ons in /${constants.ON_CONFIRM}, ${error.stack}`)
          }

          // Validate Item tags
          const tagsValidation = validateItemsTags(item?.tags)
          if (!tagsValidation.isValid) {
            Object.assign(onCnfrmObj, { tags: tagsValidation.errors })
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking items object in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    //check fulfillments
    try {
      logger.info(`checking fulfillments array in /${constants.ON_INIT}`)
      const fulfillments = on_confirm.fulfillments
      if (!fulfillments) {
        onCnfrmObj.fulfillments = `fulfillments should be present & non empty in /${constants.ON_INIT}`
      } else {
        fulfillments?.map((fulfillment: any, i: number) => {
          if (!fulfillment?.person?.name || typeof fulfillment?.person?.name !== 'string')
            onCnfrmObj.name = `person.name should be present with valid value in fulfillment${i} at /${constants.ON_INIT}`

          if (!fulfillment?.contact?.email || !isValidEmail(fulfillment?.contact?.email))
            onCnfrmObj.email = `contact.email should be present with valid email in fulfillment${i} at /${constants.ON_INIT}`

          if (!fulfillment?.contact?.phone || !isValidPhoneNumber(fulfillment?.contact?.phone))
            onCnfrmObj.phone = `contact.phone should be present with valid number in fulfillment${i} at /${constants.ON_INIT}`

          if (fulfillment?.state?.descriptor?.code != 'GRANTED')
            onCnfrmObj[`fulfillments.state`] = `code should be 'GRANTED' in fulfillment${i} at /${constants.ON_INIT}`
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments array in /${constants.ON_INIT}, ${error.stack}`)
    }

    //check quote
    try {
      logger.info(`Checking quote details in /${constants.ON_CONFIRM}`)
      const quoteErrors = validateQuote(on_confirm?.quote)
      Object.assign(onCnfrmObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking quote details in /${constants.ON_CONFIRM}`, error.stack)
    }

    //check payments
    // try {
    //   logger.info(`Checking payments details in /${constants.ON_CONFIRM}`)
    //   const paymentErrors = validatePayments(on_confirm?.payments, constants.ON_CONFIRM, on_confirm?.quote)
    //   Object.assign(onCnfrmObj, paymentErrors)
    // } catch (error: any) {
    //   logger.error(`!!Error while checking payments details in /${constants.ON_CONFIRM}`, error.stack)
    // }

    //check cancellation terms
    try {
      logger.info(`Checking cancellation terms in /${constants.ON_CONFIRM}`)
      const cancellationErrors = validateCancellationTerms(on_confirm?.cancellation_terms, constants.ON_CONFIRM)
      Object.assign(onCnfrmObj, cancellationErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation_terms in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    //check documents
    try {
      logger.info(`Checking documents in /${constants.ON_CONFIRM}`)
      const cancellationErrors = validateDocuments(on_confirm?.documents, constants.ON_CONFIRM)
      Object.assign(onCnfrmObj, cancellationErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking documents in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    return onCnfrmObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_CONFIRM} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}
