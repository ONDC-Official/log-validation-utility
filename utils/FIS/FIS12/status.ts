import { getValue, setValue } from '../../../shared/dao'
import constants, { FisApiSequence } from '../../../constants'
import { validateSchema, isObjectEmpty, checkFISContext, checkBppIdOrBapId } from '../..'
import _ from 'lodash'
import { logger } from '../../../shared/logger'

export const checkStatus = (data: any, msgIdSet: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [FisApiSequence.STATUS]: 'Json cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || isObjectEmpty(message)) {
    return { missingFields: '/context, /message is missing or empty' }
  }

  const schemaValidation = validateSchema(context.domain.split(':')[1], constants.FIS_STATUS, data)

  const contextRes: any = checkFISContext(context, constants.FIS_STATUS)
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

  setValue(`${FisApiSequence.STATUS}`, data)

  const searchContext: any = getValue(`${FisApiSequence.SEARCH}_context`)
  const onsearchContext: any = getValue(`${FisApiSequence.ON_SEARCH}_context`)

  try {
    logger.info(`Comparing city of /${constants.FIS_SEARCH} and /${constants.FIS_STATUS}`)
    if (!_.isEqual(searchContext.location.city, context.location.city)) {
      const key = `${FisApiSequence.UPDATE}_city`
      errorObj[key] = `City code mismatch in /${FisApiSequence.UPDATE} and /${FisApiSequence.STATUS}`
    }
  } catch (error: any) {
    logger.info(`Error while comparing city in /${FisApiSequence.UPDATE} and /${FisApiSequence.STATUS}, ${error.stack}`)
  }

  try {
    logger.info(`Comparing country of /${constants.FIS_SEARCH} and /${constants.FIS_STATUS}`)
    if (!_.isEqual(searchContext.location.country, context.location.country)) {
      const key = `${FisApiSequence.UPDATE}_country`
      errorObj[key] = `Country code mismatch in /${FisApiSequence.UPDATE} and /${FisApiSequence.STATUS}`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing country in /${FisApiSequence.UPDATE} and /${FisApiSequence.STATUS}, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing timestamp of /${constants.FIS_ONUPDATE} and /${constants.FIS_STATUS}`)
    if (_.gte(onsearchContext.timestamp, context.timestamp)) {
      errorObj.tmpstmp = `Timestamp for /${constants.FIS_ONUPDATE} api cannot be greater than or equal to /${constants.FIS_STATUS} api`
    }

    setValue('tmpstmp', context.timestamp)
  } catch (error: any) {
    logger.info(
      `Error while comparing timestamp for /${constants.FIS_ONUPDATE} and /${constants.FIS_STATUS} api, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing Message Ids of /${constants.FIS_ONUPDATE} and /${constants.FIS_STATUS}`)
    if (_.isEqual(onsearchContext.message_id, context.message_id)) {
      const key = `${FisApiSequence.ON_UPDATE}_msgId`
      errorObj[key] = `Message Id for /${FisApiSequence.ON_UPDATE} and /${FisApiSequence.STATUS} api cannot be same`
    }

    if (_.isEqual(searchContext.message_id, context.message_id)) {
      const key = `${FisApiSequence.UPDATE}_msgId`
      errorObj[key] = `Message Id for /${FisApiSequence.UPDATE} and /${FisApiSequence.STATUS} api cannot be same`
    }

    setValue('msgId', context.message_id)
    setValue('txnId', context.transaction_id)
  } catch (error: any) {
    logger.info(
      `Error while comparing message ids for /${constants.FIS_ONUPDATE} and /${constants.FIS_STATUS} api, ${error.stack}`,
    )
    return { error: error.message }
  }

  if (!message.ref_id) {
    const key = `${FisApiSequence.STATUS}_ref_id`
    errorObj[key] = `ref_id in /${constants.FIS_STATUS} must be present`
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
