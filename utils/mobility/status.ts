import { getValue, setValue } from '../../shared/dao'
import constants, { mobilitySequence } from '../../constants'
import { validateSchema, isObjectEmpty, checkMobilityContext, checkBppIdOrBapId } from '..'
import _ from 'lodash'
import { logger } from '../../shared/logger'

export const checkStatus = (data: any, msgIdSet: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [mobilitySequence.STATUS]: 'Json cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || isObjectEmpty(message)) {
    return { missingFields: '/context, /message is missing or empty' }
  }

  const schemaValidation = validateSchema(context.domain.split(':')[1], constants.MOB_STATUS, data)

  const contextRes: any = checkMobilityContext(context, constants.MOB_STATUS)
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
    console.log('checkBppcheckBppcheckBppcheckBppcheckBppcheckBpp', checkBpp)
    if (checkBpp) Object.assign(errorObj, { bpp_id: 'context/bpp_id should not be a url' })
  }

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  setValue(`${mobilitySequence.STATUS}`, data)

  const searchContext: any = getValue(`${mobilitySequence.SEARCH}_context`)
  const onsearchContext: any = getValue(`${mobilitySequence.ON_SEARCH}_context`)

  try {
    logger.info(`Comparing city of /${constants.MOB_SEARCH} and /${constants.MOB_STATUS}`)
    if (!_.isEqual(searchContext.location.city, context.location.city)) {
      const key = `${mobilitySequence.UPDATE}_city`
      errorObj[key] = `City code mismatch in /${mobilitySequence.UPDATE} and /${mobilitySequence.STATUS}`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing city in /${mobilitySequence.UPDATE} and /${mobilitySequence.STATUS}, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing country of /${constants.MOB_SEARCH} and /${constants.MOB_STATUS}`)
    if (!_.isEqual(searchContext.location.country, context.location.country)) {
      const key = `${mobilitySequence.UPDATE}_country`
      errorObj[key] = `Country code mismatch in /${mobilitySequence.UPDATE} and /${mobilitySequence.STATUS}`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing country in /${mobilitySequence.UPDATE} and /${mobilitySequence.STATUS}, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing timestamp of /${constants.MOB_ONUPDATE} and /${constants.MOB_STATUS}`)
    if (_.gte(onsearchContext.timestamp, context.timestamp)) {
      errorObj.tmpstmp = `Timestamp for /${constants.MOB_ONUPDATE} api cannot be greater than or equal to /${constants.MOB_STATUS} api`
    }

    setValue('tmpstmp', context.timestamp)
  } catch (error: any) {
    logger.info(
      `Error while comparing timestamp for /${constants.MOB_ONUPDATE} and /${constants.MOB_STATUS} api, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing Message Ids of /${constants.MOB_ONUPDATE} and /${constants.MOB_STATUS}`)
    if (_.isEqual(onsearchContext.message_id, context.message_id)) {
      const key = `${mobilitySequence.ON_UPDATE}_msgId`
      errorObj[key] = `Message Id for /${mobilitySequence.ON_UPDATE} and /${mobilitySequence.STATUS} api cannot be same`
    }

    if (_.isEqual(searchContext.message_id, context.message_id)) {
      const key = `${mobilitySequence.UPDATE}_msgId`
      errorObj[key] = `Message Id for /${mobilitySequence.UPDATE} and /${mobilitySequence.STATUS} api cannot be same`
    }

    setValue('msgId', context.message_id)
    setValue('txnId', context.transaction_id)
  } catch (error: any) {
    logger.info(
      `Error while comparing message ids for /${constants.MOB_ONUPDATE} and /${constants.MOB_STATUS} api, ${error.stack}`,
    )
    return { error: error.message }
  }

  if (!message.ref_id) {
    const key = `${mobilitySequence.STATUS}_ref_id`
    errorObj[key] = `ref_id in /${constants.MOB_STATUS} must be present`
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
