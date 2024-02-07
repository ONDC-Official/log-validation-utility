import { getValue, setValue } from '../../shared/dao'
import constants, { mobilitySequence } from '../../constants'
import { validateSchema, isObjectEmpty, checkMobilityContext, checkBppIdOrBapId } from '..'
import _ from 'lodash'
import { logger } from '../../shared/logger'

export const checkUpdate = (data: any, msgIdSet: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [mobilitySequence.UPDATE]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema(context.domain.split(':')[1], constants.UPDATE, data)

  const contextRes: any = checkMobilityContext(context, constants.UPDATE)
  msgIdSet.add(context.message_id)

  const errorObj: any = {}

  if (!context.bap_id) {
    errorObj['bap_id'] = 'context/bap_id is required'
  } else {
    const checkBap = checkBppIdOrBapId(context.bap_id)
    if (checkBap) Object.assign(errorObj, { bap_id: 'context/bap_id should not be a url' })
  }

  if (!context.bpp_id) {
    errorObj['bpp_id'] = 'context/bpp_id is required'
  } else {
    const checkBpp = checkBppIdOrBapId(context.bpp_id)
    if (checkBpp) Object.assign(errorObj, { bpp_id: 'context/bpp_id should not be a url' })
  }

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  setValue(`${mobilitySequence.UPDATE}`, data)

  const searchContext: any = getValue(`${mobilitySequence.SEARCH}_context`)
  const onsearchContext: any = getValue(`${mobilitySequence.ON_CONFIRM}_context`)

  try {
    logger.info(`Comparing city of /${constants.CONFIRM} and /${constants.UPDATE}`)
    if (!_.isEqual(searchContext.location.city, context.location.city)) {
      const key = `${mobilitySequence.CONFIRM}_city`
      errorObj[key] = `City code mismatch in /${mobilitySequence.CONFIRM} and /${mobilitySequence.UPDATE}`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing city in /${mobilitySequence.CONFIRM} and /${mobilitySequence.UPDATE}, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing country of /${constants.CONFIRM} and /${constants.UPDATE}`)
    if (!_.isEqual(searchContext.location.country, context.location.country)) {
      const key = `${mobilitySequence.CONFIRM}_country`
      errorObj[key] = `Country code mismatch in /${mobilitySequence.CONFIRM} and /${mobilitySequence.UPDATE}`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing country in /${mobilitySequence.CONFIRM} and /${mobilitySequence.UPDATE}, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing timestamp of /${constants.ON_CONFIRM} and /${constants.UPDATE}`)
    if (_.gte(onsearchContext.timestamp, context.timestamp)) {
      errorObj.tmpstmp = `Timestamp for /${constants.ON_CONFIRM} api cannot be greater than or equal to /${constants.UPDATE} api`
    }

    setValue('tmpstmp', context.timestamp)
  } catch (error: any) {
    logger.info(
      `Error while comparing timestamp for /${constants.ON_CONFIRM} and /${constants.UPDATE} api, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing Message Ids of /${constants.ON_CONFIRM} and /${constants.UPDATE}`)
    if (_.isEqual(onsearchContext.message_id, context.message_id)) {
      const key = `${mobilitySequence.ON_CONFIRM}_msgId`
      errorObj[
        key
      ] = `Message Id for /${mobilitySequence.ON_CONFIRM} and /${mobilitySequence.UPDATE} api cannot be same`
    }

    if (_.isEqual(searchContext.message_id, context.message_id)) {
      const key = `${mobilitySequence.CONFIRM}_msgId`
      errorObj[key] = `Message Id for /${mobilitySequence.CONFIRM} and /${mobilitySequence.UPDATE} api cannot be same`
    }

    setValue('msgId', context.message_id)
    setValue('txnId', context.transaction_id)
  } catch (error: any) {
    logger.info(
      `Error while comparing message ids for /${constants.ON_CONFIRM} and /${constants.UPDATE} api, ${error.stack}`,
    )
    return { error: error.message }
  }

  if (!message.update_target || !message.order[message.update_target] || !message.order.id) {
    const key = `${mobilitySequence.UPDATE}_message`
    errorObj[key] =
      'Invalid payload. update_target attribute must be present in message and order object must contain the specified update_target and order id.'
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
