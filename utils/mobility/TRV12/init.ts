import { logger } from '../../../shared/logger'
import { getValue, setValue } from '../../../shared/dao'
import constants, { airlinesSequence } from '../../../constants'
import { validateSchema, isObjectEmpty } from '../../'
import { validateContext } from '../../metro/metroChecks'
import { isEmpty, isNil } from 'lodash'
import { checkBilling, checkItemsExist, validateParams } from '../../metro/validate/helper'
import { validatePaymentTags } from '../tags'

export const checkInit = (data: any, msgIdSet: any) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [airlinesSequence.INIT]: 'Json cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('TRV12', constants.INIT, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.ON_SEARCH, constants.INIT)
    setValue(`${airlinesSequence.INIT}_message`, message)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const init = message.order

    const itemIDS: any = getValue('itemIds')
    const itemIdArray: any[] = []
    let newItemIDSValue: any[]

    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      const onSelect: any = getValue(`${airlinesSequence.ON_SEARCH}_message`)
      onSelect &&
        onSelect?.order?.items.map((item: { id: string }) => {
          itemIdArray.push(item.id)
        })
      newItemIDSValue = itemIdArray
    }

    setValue('itemIds', newItemIDSValue)

    try {
      logger.info(`Comparing Provider Id of /${constants.ON_SEARCH} and /${constants.INIT}`)
      const prvrdID = getValue('providerId') as any //type should be an array instead of string
      const selectedProviderId = init?.provider?.id ?? null

      if (!isNil(selectedProviderId)) {
        if (!isEmpty(prvrdID)) {
          if (!prvrdID?.includes(selectedProviderId)) {
            errorObj['providerId'] =
              'Provider Id for /' + constants.ON_SELECT + ' and /' + constants.INIT + ' should be same'
          }
        } else setValue('providerId', [selectedProviderId])
      } else errorObj['providerId'] = 'Provider Id is missing in /' + constants.INIT
    } catch (error: any) {
      logger.info(
        `Error while comparing provider id for /${constants.ON_SEARCH} and /${constants.INIT} api, ${error.stack}`,
      )
    }

    //check items
    const getItemError = checkItemsExist(init?.items, newItemIDSValue, constants.INIT)
    if (Object.keys(getItemError)?.length) Object.assign(errorObj, getItemError)

    try {
      logger.info(`Checking payments in /${constants.INIT}`)
      init?.payments?.forEach((arr: any, i: number) => {
        if (!arr?.collected_by) {
          errorObj[`payemnts[${i}]_collected_by`] = `payments.collected_by must be present in ${constants.ON_SEARCH}`
        } else {
          const srchCollectBy = getValue(`collected_by`)
          if (srchCollectBy && srchCollectBy != arr?.collected_by)
            errorObj[`payemnts[${i}]_collected_by`] =
              `payments.collected_by value sent in ${constants.ON_SEARCH} should be ${srchCollectBy} as sent in ${constants.INIT}`

          if (arr?.collected_by === 'BPP' && 'id' in arr)
            errorObj[`payemnts[${i}]_id`] = `id should not be present if collector is BPP`

          setValue(`collected_by`, arr?.collected_by)
        }

        const validTypes = ['PRE-ORDER', 'ON-FULFILLMENT', 'POST-FULFILLMENT']
        if (!arr?.type || !validTypes.includes(arr.type)) {
          errorObj[`payments[${i}]_type`] = `payments.params.type must be present in ${
            constants.INIT
          } & its value must be one of: ${validTypes.join(', ')}`
        }

        const validStatus = ['NOT-PAID', 'PAID']
        if (!arr?.status || !validStatus.includes(arr.status)) {
          errorObj[`payments[${i}]_status`] = `payments.status must be present in ${
            constants.INIT
          } & its value must be one of: ${validStatus.join(', ')}`
        }

        // const params = arr.params
        // validatePaymentParams(params, errorObj, i, constants.INIT)

        // Validate payment tags
        const tagsValidation = validatePaymentTags(arr.tags, constants?.INIT)
        if (!tagsValidation.isValid) {
          Object.assign(errorObj, { tags: tagsValidation.errors })
        }

        const payment_type = getValue('INIT_PAYMENT_TYPE') ?? 'NEFT'
        const validatePayementParams = validateParams(arr.params, arr?.collected_by, constants.INIT, payment_type)
        if (!isEmpty(validatePayementParams)) Object.assign(errorObj, validatePayementParams)
      })
    } catch (error: any) {
      logger.error(`!!Errors while checking payments in /${constants.INIT}, ${error.stack}`)
    }

    //check billing
    if (!isNil(init?.billing)) {
      const getBillingError = checkBilling(init?.billing, 'Init')
      if (Object.keys(getBillingError)?.length) Object.assign(errorObj, getBillingError)
    } else errorObj['billing'] = `billing object is missing in /${constants.INIT}`

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.INIT} API`, err)
    return { error: err.message }
  }
}
