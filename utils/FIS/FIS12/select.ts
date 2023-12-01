import { getValue, setValue } from '../../../shared/dao'
import constants, { FisApiSequence } from '../../../constants'
import { validateSchema, isObjectEmpty, checkFISContext, checkBppIdOrBapId } from '../../'
import _ from 'lodash'
import { logger } from '../../../shared/logger'

export const checkSelect = (data: any, msgIdSet: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [FisApiSequence.SELECT]: 'Json cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema(context.domain.split(':')[1], constants.FIS_SELECT, data)

  const contextRes: any = checkFISContext(context, constants.FIS_SELECT)
  msgIdSet.add(context.message_id)

  const errorObj: any = {}

  const checkBap = checkBppIdOrBapId(context.bap_id)
  const checkBpp = checkBppIdOrBapId(context.bpp_id)

  if (checkBap) Object.assign(errorObj, { bap_id: 'context/bap_id should not be a url' })
  if (checkBpp) Object.assign(errorObj, { bpp_id: 'context/bpp_id should not be a url' })

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  setValue(`${FisApiSequence.SELECT}`, data)

  const searchContext: any = getValue(`${FisApiSequence.SEARCH}_context`)
  const onSearchContext: any = getValue(`${FisApiSequence.ON_SEARCH}_context`)

  try {
    logger.info(`Comparing city of /${constants.FIS_ONSEARCH} and /${constants.FIS_SELECT}`)
    if (!_.isEqual(onSearchContext?.location?.city, context?.location?.city)) {
      const key = `${FisApiSequence.ON_SEARCH}_city`
      errorObj[key] = `City code mismatch in /${FisApiSequence.ON_SEARCH} and /${FisApiSequence.SELECT}`
    }
  } catch (error: any) {
    logger.info(`Error while comparing city in /${FisApiSequence.SEARCH} and /${FisApiSequence.SELECT}, ${error.stack}`)
  }

  try {
    logger.info(`Comparing country of /${constants.FIS_ONSEARCH} and /${constants.FIS_SELECT}`)
    if (!_.isEqual(onSearchContext?.location?.country, context?.location?.country)) {
      const key = `${FisApiSequence.ON_SEARCH}_country`
      errorObj[key] = `Country code mismatch in /${FisApiSequence.ON_SEARCH} and /${FisApiSequence.SELECT}`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing country in /${FisApiSequence.SEARCH} and /${FisApiSequence.SELECT}, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing timestamp of /${constants.FIS_ONSEARCH} and /${constants.FIS_SELECT}`)
    if (_.gte(onSearchContext.timestamp, context.timestamp)) {
      errorObj.tmpstmp = `Timestamp for /${constants.FIS_ONSEARCH} api cannot be greater than or equal to /${constants.FIS_SELECT} api`
    }

    setValue('tmpstmp', context.timestamp)
  } catch (error: any) {
    logger.info(
      `Error while comparing timestamp for /${constants.FIS_ONSEARCH} and /${constants.FIS_SELECT} api, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing Message Ids of /${constants.FIS_ONSEARCH} and /${constants.FIS_SELECT}`)
    if (_.isEqual(onSearchContext.message_id, context.message_id)) {
      const key = `${FisApiSequence.ON_SEARCH}_msgId`
      errorObj[key] = `Message Id for /${FisApiSequence.ON_SEARCH} and /${FisApiSequence.SELECT} api cannot be same`
    }

    if (_.isEqual(searchContext.message_id, context.message_id)) {
      const key = `${FisApiSequence.SEARCH}_msgId`
      errorObj[key] = `Message Id for /${FisApiSequence.SEARCH} and /${FisApiSequence.SELECT} api cannot be same`
    }

    setValue('msgId', context.message_id)
    setValue('txnId', context.transaction_id)
  } catch (error: any) {
    logger.info(
      `Error while comparing message ids for /${constants.FIS_ONSEARCH} and /${constants.FIS_SELECT} api, ${error.stack}`,
    )
  }

  try {
    const storedFormIds: any = getValue('select_storedFormIds')
    const storedItemIDS: any = getValue(`${FisApiSequence.ON_SEARCH}_itemsId`)

    const select = message.order
    const onSearch: any = getValue(`${FisApiSequence.ON_SEARCH}`)

    let provider = onSearch?.message?.catalog['providers'].filter(
      (provider: { id: any }) => provider.id === select.provider.id,
    )

    if (provider.length === 0)
      errorObj[
        'provider.id'
      ] = `/message/order/provider/id in provider: ${select.provider.id} should be one of the /provider/id mapped in on_search`

    if (provider[0]) {
      provider = provider[0]

      setValue('providerId', provider.id)
      setValue('providerName', provider.descriptor.name)

      logger.info(
        `Mapping Item Ids with their counts and categories /${constants.FIS_ONSEARCH} and /${constants.FIS_SELECT}`,
      )

      try {
        select.items.forEach((item: any, index: number) => {
          if (!storedItemIDS.includes(item.id)) {
            const key = `item[${index}].item_id`
            errorObj[
              key
            ] = `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in previous call`
          } else {
            if (
              !Object.prototype.hasOwnProperty.call(item?.xinput?.form_response, 'submission_id') ||
              !Object.prototype.hasOwnProperty.call(item?.xinput?.form_response, 'status')
            )
              errorObj[
                `item${index}_xinput`
              ] = `/message/order/items/xinput in item: ${item.id} must have both status & submission_id in form_response`

            const formId = item?.xinput?.form.id
            const status = item?.xinput?.form_response?.status

            if (storedFormIds === undefined) {
              storedFormIds.add(formId)
            }

            if (getValue(`${FisApiSequence.SELECT}_form_${formId}_status`) === status) {
              const key = `item${index}_status`
              errorObj[
                key
              ] = `/message/order/items/xinput/form_response/status in item: ${item.id} should be different from previous select calls for the same form_id: ${formId}`
            }
          }
        })

        setValue('select_storedFormIds', storedFormIds)

        logger.info(`Provider Id in /${constants.FIS_ONSEARCH} and /${constants.FIS_SELECT} matched`)
      } catch (error: any) {
        logger.error(
          `!!Error while Comparing and Mapping Items in /${constants.FIS_ONSEARCH} and /${constants.FIS_SELECT}, ${error.stack}`,
        )
      }
    } else {
      logger.info(`Provider Ids in /${constants.FIS_ONSEARCH} and /${constants.FIS_SELECT} mismatch`)
      errorObj.prvdrIdMatch = `Provider Id ${select.provider.id} in /${constants.FIS_SELECT} does not exist in /${constants.FIS_ONSEARCH}`
    }
  } catch (error: any) {
    logger.error(`!!Error occcurred while checking providers info in /${constants.FIS_SELECT},  ${error.message}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
