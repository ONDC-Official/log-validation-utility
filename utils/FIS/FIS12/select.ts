/* eslint-disable no-prototype-builtins */
import { getValue, setValue } from '../../../shared/dao'
import constants, { FisApiSequence } from '../../../constants'
import { validateSchema, isObjectEmpty } from '../../'
import _ from 'lodash'
import { logger } from '../../../shared/logger'
import { validateContext } from './fisChecks'

export const checkSelect = (data: any, msgIdSet: any, sequence: string) => {
  if (!data || isObjectEmpty(data)) {
    return { [constants.FIS_SELECT]: 'Json cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema(context.domain.split(':')[1], constants.FIS_SELECT, data)
  const contextRes: any = validateContext(context, msgIdSet, constants.FIS_ONSEARCH, constants.FIS_SELECT)

  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  setValue(`${constants.FIS_SELECT}`, data)

  const onSearch: any = getValue(`${FisApiSequence.ON_SEARCH}`)

  try {
    const storedItemIDS: any = getValue(`${FisApiSequence.ON_SEARCH}_itemsId`)
    const select = message.order
    const selectedIds: any[] = []

    try {
      logger.info(`Comparing Provider object for /${constants.FIS_ONSEARCH} and /${constants.FIS_SELECT}`)
      const providerIDs = onSearch?.message?.catalog['providers']?.map((provider: { id: any }) => provider?.id)
      const selectedProviderId = select.provider.id

      if (!providerIDs || providerIDs.length === 0) {
        logger.info(`Skipping Provider Ids check due to insufficient data`)
      } else if (!providerIDs.includes(selectedProviderId)) {
        errorObj.prvdrId = `Provider Id ${selectedProviderId} in /${constants.FIS_SELECT} does not exist in /${constants.FIS_ONSEARCH}`
      } else {
        setValue('providerId', selectedProviderId)
      }
    } catch (error: any) {
      logger.info(
        `Error while comparing provider ids for /${constants.FIS_ONSEARCH} and /${constants.FIS_SELECT} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing Items object for /${constants.FIS_ONSEARCH} and /${constants.FIS_SELECT}`)
      select.items.forEach((item: any, index: number) => {
        if (storedItemIDS && !storedItemIDS.includes(item.id)) {
          const key = `item[${index}].item_id`
          errorObj[
            key
          ] = `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in previous call`
        }

        selectedIds.push(item.id)
        const xinputErrors = validateXInput(item, index, sequence)
        Object.assign(errorObj, xinputErrors)
      })
      setValue('ItmIDS', selectedIds)
    } catch (error: any) {
      logger.error(
        `!!Error while Comparing and Mapping Items in /${constants.FIS_ONSEARCH} and /${constants.FIS_SELECT}, ${error.stack}`,
      )
    }
  } catch (error: any) {
    logger.error(`!!Error occcurred while checking providers info in /${constants.FIS_SELECT},  ${error.message}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}

const validateXInput = (item: any, index: number, sequence: string) => {
  const errorObj: any = {}

  if (!Object.prototype.hasOwnProperty.call(item?.xinput?.form, 'id')) {
    errorObj[`item${index}_form`] = `/message/order/items/form in item: ${item.id} must have both id in form`
  } else {
    const formId: any = getValue(`formId`)
    if (!_.isEqual(formId, item?.xinput?.form?.id)) {
      errorObj[
        `item${index}_formId`
      ] = `Id mismatch in form for /${constants.FIS_ONSEARCH} and /${constants.FIS_SELECT}`
    }
  }

  if (!Object.prototype.hasOwnProperty.call(item?.xinput?.form_response, 'status')) {
    errorObj[
      `item${index}_xinput`
    ] = `/message/order/items/xinput in item: ${item.id} must have status in form_response`
  } else {
    const status = item?.xinput?.form_response?.status
    const code = sequence === 'select_2' ? 'APPROVED' : 'SUCCESS'
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
