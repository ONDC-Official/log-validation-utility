/* eslint-disable no-prototype-builtins */
import { getValue, setValue } from '../../../shared/dao'
import constants from '../../../constants'
import { validateSchema, isObjectEmpty } from '../../'
import { isEmpty } from 'lodash'
import { logger } from '../../../shared/logger'
import { validateContext, validateXInputSubmission } from './fisChecks'
import { validateIdvSelected } from './tags'

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
  const selectedAddOn = new Set()
  const selectedItemId = new Set()
  const parentItemId = new Set()
  const insurance = getValue('insurance')

  try {
    const select = message.order

    //check provider
    try {
      logger.info(`Comparing Provider object for /${constants.ON_SEARCH} and /${constants.SELECT}`)

      const selectedProviderId = select?.provider?.id
      console.log('selectedProviderId', selectedProviderId)
      if (!selectedProviderId) errorObj.prvdrId = `provider.id is missing in /${constants.SELECT}`
      else {
        const providerIDs: any = getValue(`${constants.ON_SEARCH}prvdrsId`)
        if (!providerIDs || providerIDs.length === 0) {
          logger.info(`Skipping Provider Ids check due to insufficient data`)
        } else {
          if (!providerIDs.includes(selectedProviderId)) {
            errorObj.prvdrId = `Provider Id ${selectedProviderId} in /${constants.SELECT} does not exist in /${constants.ON_SEARCH}`
          } else {
            setValue('providerId', selectedProviderId)
          }
        }
      }
    } catch (error: any) {
      logger.info(
        `Error while comparing provider ids for /${constants.ON_SEARCH} and /${constants.SELECT} api, ${error.stack}`,
      )
    }

    //check fulfillments for HEALTH
    // if (insurance == 'HEALTH_INSURANCE') {
    //   try {
    //     logger.info(`checking fulfillments object for /${constants.ON_SEARCH} and /${constants.SELECT}`)

    //     if (isEmpty(select?.fulfillments)) {
    //       errorObj.fulfillments = `fulfillments must be present & should be non empty in /${constants.SELECT}`
    //     } else {
    //       select?.fulfillments.forEach((fulfillment: any, index: number) => {
    //         const customer = fulfillment?.customer
    //         if (customer?.contact?.email && !isValidEmail(customer?.contact?.email)) {
    //           errorObj[`fulfillment${index}_email`] = `email is missing or is invalid for fulfillment at index ${index}`
    //         }

    //         const phone = customer?.contact?.phone
    //         if (!phone || !isValidPhoneNumber(phone)) {
    //           errorObj[`fulfillment${index}_phone`] = `Invalid phone number for fulfillment at index ${index}`
    //         }

    //         const person = customer?.person
    //         if (!person) {
    //           errorObj[`fulfillment${index}_person`] = `Person is missing for fulfillment at index ${index}`
    //         }
    //       })
    //     }
    //   } catch (error: any) {
    //     logger.error(`!!Error occcurred while checking fulfillments in /${constants.SELECT},  ${error.message}`)
    //     return { error: error.message }
    //   }
    // }

    //check fulfillments
    if (select?.fulfillments) {
      errorObj.fulfillments = `fulfillments shouldn't be present in /${constants.SELECT}`
    }

    //check tags
    if (select?.tags) {
      errorObj.tags = `tags shouldn't be present in /${constants.SELECT}`
    }

    //check items
    try {
      logger.info(`checking items array in /${constants.SELECT}`)
      if (isEmpty(select?.items)) {
        errorObj.items = `items must be present & should be non empty in /${constants.SELECT}`
      } else {
        const itemId = getValue(`${constants.ON_SEARCH}_itemsId`)

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
              errorObj[key] =
                `/message/order/items/id in item: ${item.id} should be one of the item.id mapped in previous call`
            }
          }

          // Validate parent_item_id & add_ons for HEALTH & MOTOR
          if (insurance != 'MARINE_INSURANCE') {
            // Validate parent_item_id
            if (!item?.parent_item_id) errorObj.parent_item_id = `parent_item_id not found in providers[${index}]`
            else {
              parentItemId.add(item?.parent_item_id)
              if (itemId && !itemId.includes(item?.parent_item_id)) {
                errorObj.parent_item_id = `parent_item_id: ${item.parent_item_id} doesn't match with parent_item_id from past call in providers[${index}]`
              }
            }

            // Validate add_ons
            try {
              logger.info(`Checking add_ons`)
              if (!isEmpty(item?.add_ons)) {
                setValue('isAddOnPresent', 'Yes')
                // errorObj[`item[${index}]_add_ons`] = `add_ons array is missing or empty in ${constants.SELECT}`
                // else {
                const addOnIdSet: any = getValue(`${constants.ON_SEARCH}_addOnIdSet`)
                console.log('addOnIdSet--------', addOnIdSet)
                item?.add_ons?.forEach((addOn: any, j: number) => {
                  const key = `item[${index}]_add_ons[${j}]`

                  if (!addOn?.id) {
                    errorObj[`${key}.id`] = `id is missing in add_ons[${j}]`
                  } else {
                    selectedAddOn.add(addOn?.id)
                    if (addOnIdSet && !addOnIdSet.includes(addOn?.id)) {
                      errorObj[`${key}.id`] = `id: ${addOn?.id} not found in add_ons provided in past call`
                    }
                  }

                  if (!addOn?.quantity?.selected?.count) {
                    errorObj[`${key}.code`] = 'quantity.count is missing in add_ons'
                  } else if (!Number.isInteger(addOn?.quantity.selected.count) || addOn?.quantity.selected.count <= 0) {
                    errorObj[`${key}.code`] = 'Invalid quantity.selected count'
                  }
                })
              }

              return errorObj
            } catch (error: any) {
              logger.error(`!!Error while checking add_ons in /${constants.SELECT}, ${error.stack}`)
            }
          } else {
            if (item?.parent_item_id)
              errorObj.parent_item_id = `parent_item_id shouldn't be present in providers[${index}]`
            if (item?.add_ons) errorObj.add_ons = `add_ons shouldn't be present in providers[${index}]`
          }

          //validate xInput & tags form for MARINE & MOTOR
          if (insurance != 'HEALTH_INSURANCE') {
            if (insurance === 'MOTOR_INSURANCE' && sequence.includes('_1')) {
              const tagsErrors = validateIdvSelected(item?.tags)
              Object.assign(errorObj, tagsErrors)
            } else {
              const xinputErrors = validateXInputSubmission(item?.xinput, index, sequence)
              Object.assign(errorObj, xinputErrors)
            }
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking item in /${constants.SELECT},  ${error.message}`)
    }

    setValue('selectedItemId', selectedItemId)
    setValue(`selectedAddOnIds`, selectedAddOn)
    setValue('parentItemId', parentItemId)
  } catch (error: any) {
    logger.error(`!!Error occcurred while checking message in /${constants.SELECT},  ${error.message}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
