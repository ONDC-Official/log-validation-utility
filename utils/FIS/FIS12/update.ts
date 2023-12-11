import { getValue, setValue } from '../../../shared/dao'
import constants, { FisApiSequence } from '../../../constants'
import { validateSchema, isObjectEmpty, checkFISContext, checkBppIdOrBapId } from '../..'
import _ from 'lodash'
import { logger } from '../../../shared/logger'

export const checkUpdate = (data: any, msgIdSet: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [FisApiSequence.UPDATE]: 'Json cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema(context.domain.split(':')[1], constants.FIS_UPDATE, data)

  const contextRes: any = checkFISContext(context, constants.FIS_UPDATE)
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

  setValue(`${FisApiSequence.UPDATE}`, data)

  const searchContext: any = getValue(`${FisApiSequence.SEARCH}_context`)
  const onsearchContext: any = getValue(`${FisApiSequence.ON_CONFIRM}_context`)

  try {
    logger.info(`Comparing city of /${constants.FIS_CONFIRM} and /${constants.FIS_UPDATE}`)
    if (!_.isEqual(searchContext.location.city, context.location.city)) {
      const key = `${FisApiSequence.CONFIRM}_city`
      errorObj[key] = `City code mismatch in /${FisApiSequence.CONFIRM} and /${FisApiSequence.UPDATE}`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing city in /${FisApiSequence.CONFIRM} and /${FisApiSequence.UPDATE}, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing country of /${constants.FIS_CONFIRM} and /${constants.FIS_UPDATE}`)
    if (!_.isEqual(searchContext.location.country, context.location.country)) {
      const key = `${FisApiSequence.CONFIRM}_country`
      errorObj[key] = `Country code mismatch in /${FisApiSequence.CONFIRM} and /${FisApiSequence.UPDATE}`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing country in /${FisApiSequence.CONFIRM} and /${FisApiSequence.UPDATE}, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing timestamp of /${constants.FIS_ONCONFIRM} and /${constants.FIS_UPDATE}`)
    if (_.gte(onsearchContext.timestamp, context.timestamp)) {
      errorObj.tmpstmp = `Timestamp for /${constants.FIS_ONCONFIRM} api cannot be greater than or equal to /${constants.FIS_UPDATE} api`
    }

    setValue('tmpstmp', context.timestamp)
  } catch (error: any) {
    logger.info(
      `Error while comparing timestamp for /${constants.FIS_ONCONFIRM} and /${constants.FIS_UPDATE} api, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing Message Ids of /${constants.FIS_ONCONFIRM} and /${constants.FIS_UPDATE}`)
    if (_.isEqual(onsearchContext.message_id, context.message_id)) {
      const key = `${FisApiSequence.ON_CONFIRM}_msgId`
      errorObj[key] = `Message Id for /${FisApiSequence.ON_CONFIRM} and /${FisApiSequence.UPDATE} api cannot be same`
    }

    if (_.isEqual(searchContext.message_id, context.message_id)) {
      const key = `${FisApiSequence.CONFIRM}_msgId`
      errorObj[key] = `Message Id for /${FisApiSequence.CONFIRM} and /${FisApiSequence.UPDATE} api cannot be same`
    }

    setValue('msgId', context.message_id)
    setValue('txnId', context.transaction_id)
  } catch (error: any) {
    logger.info(
      `Error while comparing message ids for /${constants.FIS_ONCONFIRM} and /${constants.FIS_UPDATE} api, ${error.stack}`,
    )
    return { error: error.message }
  }

  if (!message.update_target || !message.order[message.update_target] || !message.order.id) {
    const key = `${FisApiSequence.UPDATE}_message`
    errorObj[key] =
      'Invalid payload. update_target attribute must be present in message and order object must contain the specified update_target and order id.'
  }

  if (!message.update_target || !message.order[message.update_target] || !message.order.id) {
    const key = `${FisApiSequence.UPDATE}_message`
    errorObj[key] =
      'Invalid payload. update_target attribute must be present in message and order object must contain the specified update_target and order id.'
  }

  if (message.update_target === 'payments' && message.order?.payments?.amount) {
    setValue(`updatePayment`, message.order?.payments?.amount)
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
