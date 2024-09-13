import constants, { metroSequence } from '../../constants'
import { logger } from '../../shared/logger'
import { validateSchema, isObjectEmpty } from '..'
import { getValue, setValue } from '../../shared/dao'
import { validateContext } from './metroChecks'
import { validatePaymentsTags } from './tags'
import { checkItemsExist, checkBilling } from './validate/helper'
import _, { isEmpty, isNil } from 'lodash'

export const checkConfirm = (data: any, msgIdSet: any) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [metroSequence.CONFIRM]: 'Json cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('TRV', constants.CONFIRM, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.ON_SEARCH, constants.CONFIRM)
    setValue(`${metroSequence.CONFIRM}_message`, message)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const confirm = message.order

    const itemIDS: any = getValue('itemIds')
    const itemIdArray: any[] = []
    let newItemIDSValue: any[]

    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      const onSelect: any = getValue(`${metroSequence.ON_SEARCH1}_message`)
      onSelect.order.items.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
    }

    setValue('itemIds', newItemIDSValue)

    try {
      logger.info(`Comparing Provider Id of /${constants.ON_SEARCH} and /${constants.CONFIRM}`)
      const prvrdID = getValue('providerId')

      const selectedProviderId = confirm?.provider?.id ?? null

      if (!isNil(selectedProviderId)) {
        if (!prvrdID?.includes(selectedProviderId))
          errorObj['providerId'] = `Provider Id for /${constants.ON_INIT} and /${constants.CONFIRM} api should be same`
      } else errorObj['providerId'] = 'Provider Id is missing in /' + constants.CONFIRM
    } catch (error: any) {
      logger.info(
        `Error while comparing provider id for /${constants.ON_SEARCH} and /${constants.CONFIRM} api, ${error.stack}`,
      )
    }

    //check items
    const getItemError = checkItemsExist(confirm, newItemIDSValue, 'CONFIRM')
    if (Object.keys(getItemError)?.length) Object.assign(errorObj, getItemError)

    // check payments
    try {
      logger.info(`Checking payments in /${constants.CONFIRM}`)
      const payments = confirm?.payments
      if (isEmpty(payments)) {
        errorObj.payments = `payments array is missing or is empty`
      } else {
        const paymentId = getValue('paymentId')
        const allowedStatusValues = ['NOT-PAID', 'PAID']
        const requiredParams = ['transaction_id', 'amount', 'currency']
        payments?.forEach((arr: any, i: number) => {
          const terms = [
            { code: 'SETTLEMENT_WINDOW', type: 'time', value: '/^(P(d+D)?(T(d+H)?(d+M)?(d+S)?)?)$/' },
            {
              code: 'SETTLEMENT_BASIS',
              type: 'enum',
              value: ['INVOICE_RECEIPT', 'Delivery'],
            },
            { code: 'MANDATORY_ARBITRATION', type: 'boolean' },
            { code: 'STATIC_TERMS', type: 'url' },
            { code: 'COURT_JURISDICTION', type: 'string' },
            { code: 'SETTLEMENT_AMOUNT', type: 'amount' },
            { code: 'SETTLEMENT_TYPE', type: 'enum', value: ['NEFT', 'UPI'] },
          ]

          if (!arr.id) errorObj[`payments[${i}]_id`] = `payments.id must be present in ${constants.CONFIRM}`
          else if (arr?.id && arr?.id !== paymentId) {
            setValue('paymentId', arr?.id)
            errorObj[`payments[${i}]_id`] = `payments.id value should be ${paymentId} as sent in ${constants.ON_INIT}`
          }

          if (!arr?.collected_by) {
            errorObj[`payemnts[${i}]_collected_by`] = `payments.collected_by must be present in ${constants.CONFIRM}`
          } else {
            const collectedBy = getValue(`collected_by`)
            if (collectedBy && collectedBy != arr?.collected_by)
              errorObj[`payemnts[${i}]_collected_by`] =
                `payments.collected_by value sent in ${constants.CONFIRM} should be same as sent in past call: ${collectedBy}`
          }

          // check status
          if (!arr?.status) errorObj.paymentStatus = `payment.status is missing for index:${i} in payments`
          else if (!arr?.status || !allowedStatusValues.includes(arr?.status)) {
            errorObj.paymentStatus = `invalid status at index:${i} in payments, should be either of ${allowedStatusValues}`
          }

          // check type
          const validTypes = ['PRE-ORDER', 'ON-FULFILLMENT', 'POST-FULFILLMENT']
          if (!arr?.type || !validTypes.includes(arr.type)) {
            errorObj[`payments[${i}]_type`] = `payments.type must be present in ${
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
          const tagsValidation = validatePaymentsTags(arr?.tags, terms)
          if (!tagsValidation.isValid) {
            Object.assign(errorObj, { tags: tagsValidation.errors })
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Errors while checking payments in /${constants.INIT}, ${error.stack}`)
    }

    //check billing
    if (!isNil(confirm?.billing)) {
      const getBillingError = checkBilling(confirm?.billing, 'CONFIRM')
      if (Object.keys(getBillingError)?.length) Object.assign(errorObj, getBillingError)
    } else errorObj['billing'] = `billing object is missing in /${constants.CONFIRM}`

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.CONFIRM} API`, err)
    return { error: err.message }
  }
}
