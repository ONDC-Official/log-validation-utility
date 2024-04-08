/* eslint-disable no-prototype-builtins */
import constants from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty, isValidEmail, isValidPhoneNumber } from '../../'
import { getValue, setValue } from '../../../shared/dao'
import { validateContext, validateQuote } from './fisChecks'
import _, { isEmpty } from 'lodash'
import { validatePaymentTags } from './tags'

export const checkConfirm = (data: any, msgIdSet: any) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [constants.CONFIRM]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.CONFIRM, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.ON_INIT, constants.CONFIRM)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const confirm = message.order
    const itemIDS: any = getValue('ItmIDS')

    // check provider
    try {
      logger.info(`Validating provider object for /${constants.CONFIRM}`)
      const selectedProviderId = getValue('providerId')
      const providerId = confirm?.provider?.id

      if (!providerId) {
        errorObj.prvdrId = `provider.id is missing in /${constants.CONFIRM}`
      } else if (selectedProviderId && !_.isEqual(selectedProviderId, providerId)) {
        errorObj.prvdrId = `provider.id: ${providerId} in /${constants.CONFIRM} does'nt matches with the selected id ${selectedProviderId}`
        setValue('selectedProviderId', providerId)
      }
    } catch (error: any) {
      logger.error(`!!Error while checking provider object for /${constants.CONFIRM}, ${error.stack}`)
    }

    //check fulfillments
    try {
      logger.info(`checking fulfillments array in /${constants.CONFIRM}`)
      const fulfillments = confirm.fulfillments
      if (!fulfillments) {
        errorObj.fulfillments = `fulfillments is missing at /${constants.CONFIRM}`
      } else {
        const fulfillmentIds: any = getValue(`fulfillmentIds`)
        fulfillments?.map((fulfillment: any, i: number) => {
          if (!fulfillment?.id) errorObj[`fulfillment${i}`] = `missing fulfillment.id in providers[${i}]`
          else if (fulfillmentIds && !fulfillmentIds.has(fulfillment.id)) {
            fulfillmentIds.add(fulfillment.id)
            errorObj[`fulfillment${i}`] = `mismatched fulfillment id: ${fulfillment.id} in providers[${i}]`
          }

          if (!fulfillment?.person?.name)
            errorObj.name = `person.name is missing in fulfillment${i} at /${constants.CONFIRM}`

          if (!fulfillment?.contact?.email || !isValidEmail(fulfillment?.contact?.email))
            errorObj.email = `contact.email should be present with valid email in fulfillment${i} at /${constants.CONFIRM}`

          if (!fulfillment?.contact?.phone || !isValidPhoneNumber(fulfillment?.contact?.phone))
            errorObj.phone = `contact.phone should be present with valid number in fulfillment${i} at /${constants.CONFIRM}`
        })
        setValue(`fulfillmentIds`, fulfillmentIds)
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments array in /${constants.CONFIRM}, ${error.stack}`)
    }

    //check items
    try {
      logger.info(`checking item array in /${constants.CONFIRM}`)
      if (!confirm.items) {
        errorObj.items = `items must be present & should non empty in /${constants.CONFIRM}`
      } else {
        const parentItemId: any = getValue('parentItemId')
        confirm.items.forEach((item: any, index: number) => {
          // Validate item id
          if (!item?.id) {
            errorObj[`item[${index}].id`] = `id should be present at item[${index}] /${constants.CONFIRM}`
          } else {
            if (itemIDS && !itemIDS.includes(item.id)) {
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
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking item in /${constants.CONFIRM}`)
    }

    // check payments
    try {
      logger.info(`Checking payments in /${constants.CONFIRM}`)
      const payments = confirm?.payments
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
            { code: 'MANDATORY_ARBITRATION', type: 'boolean' },
            { code: 'STATIC_TERMS', type: 'url' },
            { code: 'COURT_JURISDICTION', type: 'string' },
            { code: 'DELAY_INTEREST', type: 'amount' },
          ]

          if (!arr?.collected_by) {
            errorObj[`payemnts[${i}]_collected_by`] = `payments.collected_by must be present in ${constants.CONFIRM}`
          } else {
            const collectedBy = getValue(`collected_by`)
            if (collectedBy && collectedBy != arr?.collected_by)
              errorObj[
                `payemnts[${i}]_collected_by`
              ] = `payments.collected_by value sent in ${constants.CONFIRM} should be same as sent in past call: ${collectedBy}`

            if (arr?.collected_by === 'BPP') {
              terms.push({ code: 'SETTLEMENT_AMOUNT', type: 'amount' })
              terms.push({ code: 'SETTLEMENT_TYPE', type: 'enum', value: ['upi', 'neft', 'rtgs'] })
            }
          }

          // check status
          if (!arr?.status) errorObj.paymentStatus = `payment.status is missing for index:${i} in payments`
          else if (!arr?.status || !allowedStatusValues.includes(arr?.status)) {
            errorObj.paymentStatus = `invalid status at index:${i} in payments, should be either of ${allowedStatusValues}`
          }

          // check type
          const validTypes = ['PRE-ORDER', 'ON-FULFILLMENT', 'POST-FULFILLMENT']
          if (!arr?.type || !validTypes.includes(arr.type)) {
            errorObj[`payments[${i}]_type`] = `payments.params.type must be present in ${
              constants.CONFIRM
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
      logger.error(`!!Errors while checking payments in /${constants.CONFIRM}, ${error.stack}`)
    }

    //check quote
    try {
      logger.info(`Checking quote details in /${constants.CONFIRM}`)
      const quoteErrors = validateQuote(confirm?.quote)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking quote details in /${constants.CONFIRM}`, error.stack)
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.CONFIRM} API`, err)
    return { error: err.message }
  }
}
