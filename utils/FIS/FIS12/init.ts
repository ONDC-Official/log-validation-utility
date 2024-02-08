import _ from 'lodash'
import constants from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty } from '../../'
import { getValue, setValue } from '../../../shared/dao'
import { validatePaymentTags } from './tags'
import { validateContext } from './fisChecks'

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

    const onSelect: any = getValue(`${constants.ON_SELECT}_context`)
    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.INIT, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.ON_SELECT, constants.INIT)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    setValue(`${constants.INIT}_context`, data?.context)

    const init = message.order
    const itemIDS: any = getValue('ItmIDS')
    const itemIdArray: any[] = []

    let newItemIDSValue: any[]

    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      onSelect.items.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
    }

    try {
      logger.info(`Comparing Provider object in /${constants.ON_SELECT} and /${constants.INIT}`)
      const providerIDs = getValue('providerId')
      const selectedProviderId = init.provider.id

      if (!providerIDs || providerIDs.length === 0) {
        logger.info(`Skipping Provider Ids check due to insufficient data`)
      } else if (!providerIDs.includes(selectedProviderId)) {
        errorObj.prvdrId = `Provider Id ${selectedProviderId} in /${constants.INIT} does not exist in /${constants.ON_SELECT}`
      } else {
        setValue('providerId', selectedProviderId)
      }
    } catch (error: any) {
      logger.error(
        `!!Error while checking provider object in /${constants.ON_SELECT} and /${constants.INIT}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing item object in /${constants.ON_SELECT} and /${constants.INIT}`)
      init.items.forEach((item: any, index: number) => {
        if (newItemIDSValue && !newItemIDSValue.includes(item.id)) {
          const key = `item[${index}].item_id`
          errorObj[
            key
          ] = `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in previous call`
        }

        const xinputErrors = validateXInput(item, index, sequence)
        Object.assign(errorObj, xinputErrors)
      })
    } catch (error: any) {
      logger.error(`!!Error while comparing Item in /${constants.ON_SELECT} and /${constants.INIT}`)
    }

    try {
      logger.info(`Checking payments in /${constants.INIT}`)
      init?.payments?.forEach((arr: any, i: number) => {
        if (!arr?.collected_by) {
          errorObj[`payemnts[${i}]_collected_by`] = `payments.collected_by must be present in ${constants.ON_SELECT}`
        } else {
          const srchCollectBy = getValue(`collected_by`)
          if (srchCollectBy != arr?.collected_by)
            errorObj[
              `payemnts[${i}]_collected_by`
            ] = `payments.collected_by value sent in ${constants.ON_SELECT} should be ${srchCollectBy} as sent in ${constants.INIT}`

          if (arr?.collected_by === 'BPP' && 'id' in arr)
            errorObj[`payemnts[${i}]_id`] = `id should not be present if collector is BPP`
        }

        if (!arr?.type || arr?.type !== 'ON_ORDER') {
          errorObj[
            `payments[${i}]_type`
          ] = `payments.params.type must be present in ${constants.INIT} & its value must be in a standard enum format (ON_ORDER)`
        }

        const params = arr.params
        if (!params?.bank_code) {
          errorObj[`payments[${i}]_bank_code`] = `payments.params.bank_code must be present in ${constants.INIT}`
        } else {
          setValue('bank_code', params?.bank_code)
        }

        if (!params?.bank_account_number) {
          errorObj[
            `payments[${i}]_bank_account_number`
          ] = `payments.params.bank_account_number must be present in ${constants.INIT}`
        } else {
          setValue('bank_account_number', params?.bank_account_number)
        }

        if (!params?.virtual_payment_address) {
          errorObj[
            `payments[${i}]_virtual_payment_address`
          ] = `payments.params.virtual_payment_address must be present in ${constants.INIT}`
        } else {
          setValue('virtual_payment_address', params?.virtual_payment_address)
        }

        // Validate payment tags
        const tagsValidation = validatePaymentTags(arr.tags)
        if (!tagsValidation.isValid) {
          Object.assign(errorObj, { tags: tagsValidation.errors })
        }
      })
    } catch (error: any) {
      logger.error(`!!Errors while checking payments in /${constants.INIT}, ${error.stack}`)
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.INIT} API`, err)
    return { error: err.message }
  }
}

const validateXInput = (item: any, index: number, sequence: string) => {
  const errorObj: any = {}

  if (!Object.prototype.hasOwnProperty.call(item?.xinput?.form, 'id')) {
    errorObj[`item${index}_form`] = `/message/order/items/form in item: ${item.id} must have both id in form`
  } else {
    const formId: any = getValue(`formId`)
    if (!_.isEqual(formId, item?.xinput?.form?.id)) {
      errorObj[`item${index}_formId`] = `Id mismatch in form for /${constants.ON_SELECT} and /${constants.INIT}`
    }
  }

  if (!Object.prototype.hasOwnProperty.call(item?.xinput?.form_response, 'status')) {
    errorObj[
      `item${index}_xinput`
    ] = `/message/order/items/xinput in item: ${item.id} must have status in form_response`
  } else {
    const status = item?.xinput?.form_response?.status
    const code = 'SUCCESS'
    if (status !== code) {
      errorObj[
        `item${index}_status`
      ] = `/message/order/items/xinput/form_response/status in item: ${item.id} should be '${code}'`
    }
  }

  if (!Object.prototype.hasOwnProperty.call(item?.xinput?.form_response, 'submission_id')) {
    errorObj[
      `item${index}_xinput`
    ] = `/message/order/items/xinput in item: ${item.id} must have submission_id in form_response`
  } else {
    setValue(`${sequence}_submission_id`, item?.xinput?.form_response?.submission_id)
  }

  return errorObj
}
