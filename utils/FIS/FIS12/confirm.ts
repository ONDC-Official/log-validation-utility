/* eslint-disable no-prototype-builtins */
import constants, { FisApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty } from '../../'
import { getValue, setValue } from '../../../shared/dao'
import { validateContext, validateXInputSubmission } from './fisChecks'
import _, { isEmpty } from 'lodash'
import { validatePaymentTags } from './tags'

export const checkConfirm = (data: any, msgIdSet: any) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [FisApiSequence.CONFIRM]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('FIS', constants.CONFIRM, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.ON_INIT, constants.CONFIRM)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    setValue(`${FisApiSequence.CONFIRM}`, data)

    const confirm = message.order
    const itemIDS: any = getValue('ItmIDS')
    const version: any = getValue('version')

    // check provider
    try {
      logger.info(`Comparing Provider object in /${constants.ON_INIT} and /${constants.CONFIRM}`)
      const selectedProviderId = getValue('selectedProviderId')
      const providerId = confirm?.provider?.id

      if (!providerId) {
        errorObj.prvdrId = `provider.id is missing in /${constants.CONFIRM}`
      } else if (selectedProviderId && !_.isEqual(selectedProviderId, providerId)) {
        errorObj.prvdrId = `provider.id: ${providerId} in /${constants.CONFIRM} does'nt exist in /${constants.ON_INIT}`
        setValue('selectedProviderId', providerId)
      }
    } catch (error: any) {
      logger.error(
        `!!Error while checking provider object in /${constants.ON_INIT} and /${constants.CONFIRM}, ${error.stack}`,
      )
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
          if (version == '2.1.0') {
            if (!item?.parent_item_id) errorObj.parent_item_id = `sub-parent_item_id not found in providers[${index}]`
            else if (!_.isEqual(item.parent_item_id, parentItemId)) {
              setValue('parentItemId', item.parent_item_id)
              errorObj.parent_item_id = `parent_item_id: ${item.parent_item_id} doesn't match with parent_item_id from past call in providers[${index}]`
            }
          }

          //validate xInput form
          const xinputErrors = validateXInputSubmission(item?.xinput, index, constants?.CONFIRM)
          Object.assign(errorObj, xinputErrors)
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
            { code: 'SETTLEMENT_AMOUNT', type: 'amount' },
            { code: 'SETTLEMENT_TYPE', type: 'enum', value: ['upi', 'neft', 'rtgs'] },
            {
              code: 'OFFLINE_CONTRACT',
              type: 'boolean',
            },
          ]

          if (!arr?.collected_by) {
            errorObj[`payemnts[${i}]_collected_by`] = `payments.collected_by must be present in ${constants.CONFIRM}`
          } else {
            const collectedBy = getValue(`collected_by`)
            if (collectedBy && collectedBy != arr?.collected_by)
              errorObj[
                `payemnts[${i}]_collected_by`
              ] = `payments.collected_by value sent in ${constants.CONFIRM} should be same as sent in past call: ${collectedBy}`
          }

          // check status
          if (!arr?.status) errorObj.paymentStatus = `payment.status is missing for index:${i} in payments`
          else if (!arr?.status || !allowedStatusValues.includes(arr?.status)) {
            errorObj.paymentStatus = `invalid status at index:${i} in payments, should be either of ${allowedStatusValues}`
          }

          // check type
          const validTypes = ['ON_ORDER', 'ON_FULFILLMENT', 'POST_FULFILLMENT']
          if (!arr?.type || !validTypes.includes(arr.type)) {
            errorObj[`payments[${i}]_type`] = `payments.type must be present in ${
              constants.CONFIRM
            } & its value must be one of: ${validTypes.join(', ')}`
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

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.CONFIRM} API`, err)
    return { error: err.message }
  }
}
