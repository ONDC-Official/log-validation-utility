/* eslint-disable no-prototype-builtins */
import { getValue, setValue } from '../../../shared/dao'
import constants from '../../../constants'
import { validateSchema, isObjectEmpty, isValidEmail, isValidPhoneNumber } from '../../'
import _, { isEmpty } from 'lodash'
import { logger } from '../../../shared/logger'
import { validateContext, validateXInputSubmission } from './fisChecks'

export const checkSelect = (data: any, msgIdSet: any, sequence: string) => {
  if (!data || isObjectEmpty(data)) {
    return { [constants.SELECT]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema('FIS', constants.SELECT, data)
  const contextRes: any = validateContext(context, msgIdSet, constants.ON_SEARCH, constants.SELECT)
  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  setValue(`${constants.SELECT}`, data)
  const onSearch: any = getValue(`${constants.ON_SEARCH}`)
  const selectedAddOn = new Set()
  const selectedItemId = new Set()

  try {
    // const storedItemIDS: any = getValue(`${constants.ON_SEARCH}_itemsId`)
    const select = message.order
    // const selectedIds: any[] = []

    try {
      logger.info(`Comparing Provider object for /${constants.ON_SEARCH} and /${constants.SELECT}`)
      const providerIDs = onSearch?.message?.catalog['providers']?.map((provider: { id: any }) => provider?.id)
      if (!providerIDs || providerIDs.length === 0) {
        logger.info(`Skipping Provider Ids check due to insufficient data`)
      } else {
        const selectedProviderId = select?.provider?.id
        if (!providerIDs.includes(selectedProviderId)) {
          errorObj.prvdrId = `Provider Id ${selectedProviderId} in /${constants.SELECT} does not exist in /${constants.ON_SEARCH}`
        } else {
          setValue('providerId', selectedProviderId)
        }
      }
    } catch (error: any) {
      logger.info(
        `Error while comparing provider ids for /${constants.ON_SEARCH} and /${constants.SELECT} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`checking fulfillments object for /${constants.ON_SEARCH} and /${constants.SELECT}`)

      select.fulfillments.forEach((fulfillment: any, index: number) => {
        if (!fulfillment.id) {
          errorObj[`fulfillment${index}_id`] = `Fulfillment ID is missing for fulfillment at index ${index}`
        }

        const customer = fulfillment.customer
        if (!customer || !customer.contact || !customer.contact.email || !isValidEmail(customer.contact.email)) {
          errorObj[`fulfillment${index}_email`] = `Invalid email for fulfillment at index ${index}`
        }

        const phone = customer.contact.phone
        if (!phone || !isValidPhoneNumber(phone)) {
          errorObj[`fulfillment${index}_phone`] = `Invalid phone number for fulfillment at index ${index}`
        }

        const person = customer.person
        if (!person || typeof person !== 'string') {
          errorObj[`fulfillment${index}_person`] = `Person is missing or not a string for fulfillment at index ${index}`
        }
      })
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
        const parentItemId: any = getValue('parentItemId')

        console.log('itemId', itemId)
        console.log('parentItemId', parentItemId)
        select?.items?.forEach((item: any, index: number) => {
          // Validate item id
          if (!item?.id) {
            errorObj[`item[${index}].id`] = `id should be present at item[${index}] /${constants.SELECT}`
          } else {
            selectedItemId?.add(item?.id)
            if (itemId && !itemId.includes(item.id)) {
              const key = `item[${index}].item_id`
              errorObj[
                key
              ] = `/message/order/items/id in item: ${item.id} should be one of the item.id mapped in previous call`
            }
          }

          // Validate parent_item_id
          if (!item?.parent_item_id) errorObj.parent_item_id = `sub-parent_item_id not found in providers[${index}]`
          else if (!_.isEqual(item.parent_item_id, parentItemId)) {
            setValue('parentItemId', item.parent_item_id)
            errorObj.parent_item_id = `parent_item_id: ${item.parent_item_id} doesn't match with parent_item_id from past call in providers[${index}]`
          }

          //validate xInput form
          const xinputErrors = validateXInputSubmission(item?.xinput, index, sequence)
          Object.assign(errorObj, xinputErrors)

          // Validate add_ons
          try {
            logger.info(`Checking add_ons`)
            if (isEmpty(item?.add_ons))
              errorObj[`item[${index}]_add_ons`] = `add_ons array is missing or empty in ${constants.SELECT}`
            else {
              const addOnIdSet: any = getValue(`${constants.ON_SEARCH}_addOnIdSet`)
              item?.add_ons?.forEach((addOn: any, j: number) => {
                const key = `item[${index}]_add_ons[${j}]`

                if (!addOn?.id) {
                  errorObj[`${key}.id`] = `id is missing in add_ons[${j}]`
                } else {
                  selectedAddOn.add(addOn?.id)
                  if (addOnIdSet && !addOnIdSet.has(addOn?.id)) {
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
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking item in /${constants.SELECT},  ${error.message}`)
    }

    setValue('selectedItemId', selectedItemId)
    setValue(`selectedAddOnIds`, selectedAddOn)
  } catch (error: any) {
    logger.error(`!!Error occcurred while checking message in /${constants.SELECT},  ${error.message}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
