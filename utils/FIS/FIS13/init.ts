import _, { isEmpty } from 'lodash'
import constants from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty, isValidPhoneNumber, isValidEmail } from '../../'
import { getValue, setValue } from '../../../shared/dao'
import { checkUniqueCategoryIds, validateContext, validateQuote, validateXInputSubmission } from './fisChecks'
import { validatePaymentTags } from './tags'

export const checkInit = (data: any, msgIdSet: any, sequence: string) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [constants.INIT]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('FIS', constants.INIT, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.ON_SELECT, constants.INIT)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const init = message.order
    const insurance: any = getValue('insurance')
    const isAddOnPresent = getValue('isAddOnPresent')

    // check provider
    try {
      logger.info(`Validating provider object for /${constants.INIT}`)
      const selectedProviderId = getValue('providerId')
      const providerId = init?.provider?.id

      if (!providerId) {
        errorObj.prvdrId = `provider.id is missing in /${constants.INIT}`
      } else if (selectedProviderId && !_.isEqual(selectedProviderId, providerId)) {
        errorObj.prvdrId = `provider.id: ${providerId} in /${constants.INIT} does'nt matches with the selected id ${selectedProviderId}`
        setValue('providerId', providerId)
      }
    } catch (error: any) {
      logger.error(`!!Error while checking provider object for /${constants.INIT}, ${error.stack}`)
    }

    //check fulfillments
    try {
      logger.info(`checking fulfillments array in /${constants.INIT}`)
      const fulfillments = init?.fulfillments
      if (!fulfillments) {
        errorObj.fulfillments = `fulfillments is missing at /${constants.INIT}`
      } else {
        const fullIds: any = getValue('fulfillmentIds')
        console.log('fullIds', fullIds)
        fulfillments?.map((fulfillment: any, i: number) => {
          const key = `fulfillment[${i}]`
          const customer = fulfillment?.customer
          if (!customer?.person?.name) errorObj.name = `person.name is missing in fulfillment${i} at /${constants.INIT}`

          if (!customer?.contact?.email || !isValidEmail(customer?.contact?.email))
            errorObj.email = `contact.email should be present with valid value in fulfillment${i} at /${constants.INIT}`

          if (!customer?.contact?.phone || !isValidPhoneNumber(customer?.contact?.phone))
            errorObj.phone = `contact.phone should be present with valid value in fulfillment${i} at /${constants.INIT}`

          if (sequence == 'init_2') {
            if (!fulfillment?.id) {
              errorObj[`${key}.id`] = `fulfillment.id: is missing at index: ${i}`
            } else if (!fullIds?.includes(fulfillment.id)) {
              errorObj[`${key}.id`] = `fulfillment.id: should be of the id sent in past call, at ${i}`
            }

            if (insurance == 'HEALTH_INSURANCE' && !fulfillment?.type) {
              errorObj[`${key}.type`] = `fulfillment.type: is missing at index: ${i}`
            }
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments array in /${constants.INIT}, ${error.stack}`)
    }

    //check items
    try {
      logger.info(`checking item array in /${constants.INIT}`)
      if (!init?.items) {
        errorObj.items = `items is missing in /${constants.INIT}`
      } else {
        const parentItemId: any = getValue('parentItemId')
        const storedItemId: any = getValue('selectedItemId')
        const categoriesId = getValue(`${constants.ON_SEARCH}categoryId`)
        const itemsId = new Set()
        init.items.forEach((item: any, index: number) => {
          const key = `item[${index}]`

          // Validate item id
          if (!item?.id) {
            errorObj[`${key}.id`] = `item.id: is missing at index: ${index}`
          } else {
            //duplicate id check
            if (itemsId.has(item.id)) {
              errorObj[`${key}.duplicate_id`] = `duplicate item id: ${item.id}`
            } else {
              itemsId.add(item.id)
            }

            if (storedItemId && !storedItemId?.includes(item.id)) {
              errorObj[`${key}.id`] = `id at index: ${index} should be one of the id mapped in previous call`
            }
          }

          // checks (parent_item_id & add_ons) for MOTOR & HEATLH, time for MARINE
          if (insurance != 'MARINE_INSURANCE') {
            // Validate parent_item_id
            if (!item?.parent_item_id) errorObj.parent_item_id = `parent_item_id not found in items[${index}]`
            else if (parentItemId && !parentItemId.includes(item?.parent_item_id)) {
              errorObj.parent_item_id = `parent_item_id: ${item.parent_item_id} doesn't match with parent_item_id from past call in items[${index}]`
            }

            // Validate add_ons
            try {
              if (isAddOnPresent) {
                logger.info(`Checking add_ons`)
                if (_.isEmpty(item?.add_ons))
                  errorObj[`item[${index}]_add_ons`] = `add_ons array is missing or empty in ${constants.INIT}`
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
              logger.error(`!!Error while checking add_ons in /${constants.INIT}, ${error.stack}`)
            }
          } else {
            // Validate time
            if (_.isEmpty(item?.time)) {
              errorObj.time = `time is missing or empty at items[${index}]`
            } else {
              const time = item?.time
              if (!time?.label || time?.label !== 'Coverage Time')
                errorObj['time.label'] = `label is missing or should be equal to 'Coverage Time' at items[${index}]`

              if (!time?.range?.start) errorObj['time.range.start'] = `start is missing at items[${index}].range`
              if (!time?.range?.end) errorObj['time.range.end'] = `end is missing at items[${index}].range`
            }
          }

          //validate xInput form
          const xinputErrors = validateXInputSubmission(item?.xinput, index, sequence)
          Object.assign(errorObj, xinputErrors)

          if (insurance == 'MOTOR_INSURANCE') {
            // Validate category_ids
            if (_.isEmpty(item?.category_ids)) {
              errorObj.category_ids = `category_ids is missing or empty at items[${index}]`
            } else {
              const areCategoryIdsUnique = checkUniqueCategoryIds(item?.category_ids, categoriesId)
              if (!areCategoryIdsUnique) {
                const key = `item${index}_category_ids`
                errorObj[key] =
                  `category_ids value in items[${index}] should match with id provided in categories on on_search`
              }
            }
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking item in /${constants.INIT}`)
    }

    // check payments
    try {
      logger.info(`Checking payments in /${constants.INIT}`)
      const payments = init?.payments
      if (isEmpty(payments)) {
        errorObj.payments = `payments array is missing or is empty`
      } else {
        const allowedStatusValues = ['NOT-PAID', 'PAID']
        const requiredParams = ['bank_code', 'bank_account_number', 'virtual_payment_address']
        payments?.forEach((arr: any, i: number) => {
          const terms = [
            { code: 'SETTLEMENT_WINDOW', type: 'time', value: '/^PTd+[MH]$/' },
            {
              code: 'SETTLEMENT_BASIS',
              type: 'enum',
              value: ['INVOICE_RECEIPT', 'Delivery'],
            },
            // { code: 'MANDATORY_ARBITRATION', type: 'boolean' },
            { code: 'OFFLINE_CONTRACT', type: 'boolean' },
            { code: 'STATIC_TERMS', type: 'url' },
            // { code: 'COURT_JURISDICTION', type: 'string' },
            { code: 'DELAY_INTEREST', type: 'amount' },
          ]

          if (!arr?.collected_by) {
            errorObj[`payemnts[${i}]_collected_by`] = `payments.collected_by must be present in ${constants.INIT}`
          } else {
            const collectedBy = getValue(`collected_by`)
            if (collectedBy && collectedBy != arr?.collected_by)
              errorObj[`payemnts[${i}]_collected_by`] =
                `payments.collected_by value sent in ${constants.INIT} should be same as sent in past call: ${collectedBy}`

            if (arr?.collected_by === 'BPP') {
              terms.push({ code: 'SETTLEMENT_AMOUNT', type: 'amount' })
              terms.push({ code: 'SETTLEMENT_TYPE', type: 'enum', value: ['upi', 'neft', 'rtgs'] })
            }
          }

          console.log('updated terms--------------------', terms)

          // check status
          if (!arr?.status) errorObj.paymentStatus = `payment.status is missing for index:${i} in payments`
          else if (!arr?.status || !allowedStatusValues.includes(arr?.status)) {
            errorObj.paymentStatus = `invalid status at index:${i} in payments, should be either of ${allowedStatusValues}`
          }

          // check type
          const validTypes = ['PRE-ORDER', 'ON-FULFILLMENT', 'POST-FULFILLMENT']
          if (!arr?.type || !validTypes.includes(arr.type)) {
            errorObj[`payments[${i}]_type`] = `payments.type is missing in ${
              constants.INIT
            } & its value must be one of: ${validTypes.join(', ')}`
          }

          // check params
          const params = arr?.params
          if (!params) errorObj.params = `payment.params is missing for index:${i} in payments`
          else {
            const missingParams = requiredParams.filter((param) => !Object.prototype.hasOwnProperty.call(params, param))
            if (missingParams.length > 0) {
              errorObj.missingParams = `Required params ${missingParams.join(', ')} are missing in payments`
            }
          }

          // Validate payment tags
          const tagsValidation = validatePaymentTags(arr?.tags, terms)
          if (!tagsValidation.isValid) {
            Object.assign(errorObj, { tags: tagsValidation.errors })
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Errors while checking payments in /${constants.INIT}, ${error.stack}`)
    }

    //check quote
    if (insurance == 'MARINE_INSURANCE') {
      try {
        logger.info(`Checking quote details in /${constants.INIT}`)
        const quoteErrors = validateQuote(init?.quote)
        Object.assign(errorObj, quoteErrors)
      } catch (error: any) {
        logger.error(`!!Error while checking quote details in /${constants.INIT}`, error.stack)
      }
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.INIT} API`, err)
    return { error: err.message }
  }
}
