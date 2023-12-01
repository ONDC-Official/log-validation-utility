import { logger } from '../../shared/logger'
import { getValue, setValue } from '../../shared/dao'
import constants, { mobilitySequence } from '../../constants'
import { validateSchema, isObjectEmpty, checkMobilityContext, checkBppIdOrBapId } from '../'
import _ from 'lodash'

export const checkSelect = (data: any, msgIdSet: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [mobilitySequence.SELECT]: 'Json cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema(context.domain.split(':')[1], constants.FIS_SELECT, data)

  const contextRes: any = checkMobilityContext(context, constants.MOB_SELECT)
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

  setValue(`${mobilitySequence.SELECT}`, data)

  const searchContext: any = getValue(`${mobilitySequence.SEARCH}_context`)
  const onSearchContext: any = getValue(`${mobilitySequence.ON_SEARCH}_context`)

  try {
    logger.info(`Comparing city of /${constants.MOB_ONSEARCH} and /${constants.MOB_SELECT}`)
    if (!_.isEqual(onSearchContext?.location?.city, context?.location?.city)) {
      const key = `${mobilitySequence.ON_SEARCH}_city`
      errorObj[key] = `City code mismatch in /${mobilitySequence.ON_SEARCH} and /${mobilitySequence.SELECT}`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing city in /${mobilitySequence.SEARCH} and /${mobilitySequence.SELECT}, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing country of /${constants.MOB_ONSEARCH} and /${constants.MOB_SELECT}`)
    if (!_.isEqual(onSearchContext?.location?.country, context?.location?.country)) {
      const key = `${mobilitySequence.ON_SEARCH}_country`
      errorObj[key] = `Country code mismatch in /${mobilitySequence.ON_SEARCH} and /${mobilitySequence.SELECT}`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing country in /${mobilitySequence.SEARCH} and /${mobilitySequence.SELECT}, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing timestamp of /${constants.MOB_ONSEARCH} and /${constants.MOB_SELECT}`)
    if (_.gte(onSearchContext.timestamp, context.timestamp)) {
      errorObj.tmpstmp = `Timestamp for /${constants.MOB_ONSEARCH} api cannot be greater than or equal to /${constants.MOB_SELECT} api`
    }

    setValue('tmpstmp', context.timestamp)
  } catch (error: any) {
    logger.info(
      `Error while comparing timestamp for /${constants.MOB_ONSEARCH} and /${constants.MOB_SELECT} api, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing Message Ids of /${constants.MOB_ONSEARCH} and /${constants.MOB_SELECT}`)
    if (_.isEqual(onSearchContext.message_id, context.message_id)) {
      const key = `${mobilitySequence.ON_SEARCH}_msgId`
      errorObj[key] = `Message Id for /${mobilitySequence.ON_SEARCH} and /${mobilitySequence.SELECT} api cannot be same`
    }

    if (_.isEqual(searchContext.message_id, context.message_id)) {
      const key = `${mobilitySequence.SEARCH}_msgId`
      errorObj[key] = `Message Id for /${mobilitySequence.SEARCH} and /${mobilitySequence.SELECT} api cannot be same`
    }

    setValue('msgId', context.message_id)
    setValue('txnId', context.transaction_id)
  } catch (error: any) {
    logger.info(
      `Error while comparing message ids for /${constants.MOB_ONSEARCH} and /${constants.MOB_SELECT} api, ${error.stack}`,
    )
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
