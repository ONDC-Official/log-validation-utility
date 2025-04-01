import { logger } from '../../../shared/logger'
import { getValue, setValue } from '../../../shared/dao'
import constants, { airlinesSequence } from '../../../constants'
import { validateSchema, isObjectEmpty } from '../../'
import { validateContext } from '../../metro/metroChecks'
import { isEmpty, isNil } from 'lodash'
import { checkBilling, checkItemsExist, validateParams } from '../../metro/validate/helper'
import { validatePaymentTags } from '../tags'

export const checkConfirm = (data: any, msgIdSet: any) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [airlinesSequence.CONFIRM]: 'Json cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('TRV12', constants.CONFIRM, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.ON_SEARCH, constants.CONFIRM)
    setValue(`${airlinesSequence.CONFIRM}_message`, message)

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
      const onSelect: any = getValue(`${airlinesSequence.ON_SEARCH}_message`)
      onSelect?.order?.items.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
    }

    setValue('itemIds', newItemIDSValue)

    try {
      logger.info(`Comparing Provider Id of /${constants.ON_SEARCH} and /${constants.CONFIRM}`)
      const prvrdID = getValue('providerId') //type should be an array instead of string

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
    const getItemError = checkItemsExist(confirm?.items, newItemIDSValue, constants.CONFIRM)
    if (Object.keys(getItemError)?.length) Object.assign(errorObj, getItemError)

    try {
      logger.info(`Checking payments in /${constants.CONFIRM}`)
      confirm?.payments?.forEach((arr: any, i: number) => {
        if (!arr?.collected_by) {
          errorObj[`payemnts[${i}]_collected_by`] = `payments.collected_by must be present in ${constants.ON_SEARCH}`
        } else {
          const srchCollectBy = getValue(`collected_by`)
          if (srchCollectBy && srchCollectBy != arr?.collected_by)
            errorObj[`payemnts[${i}]_collected_by`] =
              `payments.collected_by value sent in ${constants.ON_SEARCH} should be ${srchCollectBy} as sent in ${constants.CONFIRM}`

          if (arr?.collected_by === 'BPP' && 'id' in arr)
            errorObj[`payemnts[${i}]_id`] = `id should not be present if collector is BPP`

          setValue(`collected_by`, arr?.collected_by)
        }

        const validTypes = ['PRE-ORDER', 'ON-FULFILLMENT', 'POST-FULFILLMENT']
        if (!arr?.type || !validTypes.includes(arr.type)) {
          errorObj[`payments[${i}]_type`] = `payments.params.type must be present in ${
            constants.CONFIRM
          } & its value must be one of: ${validTypes.join(', ')}`
        }

        const validStatus = ['NOT-PAID', 'PAID']
        if (!arr?.status || !validStatus.includes(arr.status)) {
          errorObj[`payments[${i}]_status`] = `payments.status must be present in ${
            constants.CONFIRM
          } & its value must be one of: ${validStatus.join(', ')}`
        }

        if (!arr.id) errorObj[`payments[${i}]_id`] = `payments.id must be present in ${constants.CONFIRM}`
        else setValue('paymentId', arr?.id)

        const payment_type = getValue('INIT_PAYMENT_TYPE') ?? 'NEFT'
        const validatePayementParams = validateParams(arr.params, arr?.collected_by, constants.CONFIRM, payment_type)
        if (!isEmpty(validatePayementParams)) Object.assign(errorObj, validatePayementParams)
        // const { params } = arr

        // if (!params) {
        //   errorObj[`payments[${i}]_params`] = `payments.params must be present in ${constants.CONFIRM}`
        // } else {
        //   const { amount, currency, transaction_id, bank_code, bank_account_number } = params

        //   if (!amount) {
        //     errorObj[`payments[${i}]_params_amount`] = `payments.params.amount must be present in ${constants.CONFIRM}`
        //   } else {
        //     setValue('paramsAmount', amount)
        //   }

        //   if (!currency) {
        //     errorObj[`payments[${i}]_params_currency`] =
        //       `payments.params.currency must be present in ${constants.CONFIRM}`
        //   } else if (currency !== 'INR') {
        //     errorObj[`payments[${i}]_params_currency`] = `payments.params.currency must be INR in ${constants.CONFIRM}`
        //   }

        //   if (!bank_code) {
        //     errorObj[`payments[${i}]_params_bank_code`] =
        //       `payments.params.bank_code must be present in ${constants.CONFIRM}`
        //   } else {
        //     setValue('paramsBankCode', bank_code)
        //   }

        //   if (!bank_account_number) {
        //     errorObj[`payments[${i}]_params_bank_account_number`] =
        //       `payments.params.bank_account_number must be present in ${constants.CONFIRM}`
        //   } else {
        //     setValue('paramsBankAccountNumber', bank_account_number)
        //   }

        //   if (!transaction_id) {
        //     errorObj[`payments[${i}]_params_transaction_id`] =
        //       `payments.params.transaction_id must be present in ${constants.CONFIRM}`
        //   } else {
        //     setValue('paramsTransactionId', transaction_id)
        //   }
        // }

        // Validate payment tags
        const tagsValidation = validatePaymentTags(arr.tags, constants?.CONFIRM)
        if (!tagsValidation.isValid) {
          Object.assign(errorObj, { tags: tagsValidation.errors })
        }
      })
    } catch (error: any) {
      logger.error(`!!Errors while checking payments in /${constants.CONFIRM}, ${error.stack}`)
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
