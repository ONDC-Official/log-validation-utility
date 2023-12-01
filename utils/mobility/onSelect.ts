import { logger } from '../../shared/logger'
import constants, { mobilitySequence } from '../../constants'
import { validateSchema, isObjectEmpty, checkMobilityContext, timeDiff, checkBppIdOrBapId } from '../'
import _ from 'lodash'
import { getValue, setValue } from '../../shared/dao'

export const checkOnSelect = (data: any, msgIdSet: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [mobilitySequence.ON_SELECT]: 'Json cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema(context.domain.split(':')[1], constants.MOB_ONSELECT, data)

  const contextRes: any = checkMobilityContext(context, constants.MOB_ONSELECT)
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

  const searchContext: any = getValue(`${mobilitySequence.SEARCH}_context`)
  const select: any = getValue(`${mobilitySequence.SELECT}`)

  try {
    logger.info(`Comparing city of /${constants.MOB_SEARCH} and /${constants.MOB_ONSELECT}`)
    if (!_.isEqual(searchContext.location.city, context.location.city)) {
      errorObj.city = `City code mismatch in /${constants.MOB_SEARCH} and /${constants.MOB_ONSELECT}`
    }
  } catch (error: any) {
    logger.error(
      `!!Error while comparing city in /${constants.MOB_SEARCH} and /${constants.MOB_ONSELECT}, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing country of /${constants.MOB_SEARCH} and /${constants.MOB_ONSELECT}`)
    if (!_.isEqual(searchContext.location.country, context.location.country)) {
      errorObj.country = `Country code mismatch in /${constants.MOB_SEARCH} and /${constants.MOB_ONSELECT}`
    }
  } catch (error: any) {
    logger.error(
      `!!Error while comparing country in /${constants.MOB_SEARCH} and /${constants.MOB_ONSELECT}, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing timestamp of /${constants.MOB_SELECT} and /${constants.MOB_ONSELECT}`)
    const tmpstmp = select.context.timestamp
    if (_.gte(tmpstmp, context.timestamp)) {
      errorObj.tmpstmp = `Timestamp for /${constants.MOB_SELECT} api cannot be greater than or equal to /${constants.MOB_ONSELECT} api`
    } else {
      const timeDifference = timeDiff(context.timestamp, tmpstmp)
      logger.info(timeDifference)
      if (timeDifference > 5000) {
        errorObj.tmpstmp = `context/timestamp difference between /${constants.MOB_ONSELECT} and /${constants.FIS_SELECT} should be smaller than 5 sec`
      }
    }

    setValue('tmpstmp', context.timestamp)
  } catch (error: any) {
    logger.error(
      `!!Error while comparing timestamp for /${constants.MOB_SELECT} and /${constants.MOB_ONSELECT}, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing transaction Ids of /${constants.MOB_SELECT} and /${constants.MOB_ONSELECT}`)
    if (!_.isEqual(select.context.transaction_id, context.transaction_id)) {
      errorObj.txnId = `Transaction Id should be same throughout`
    }
  } catch (error: any) {
    logger.error(
      `!!Error while comparing transaction ids for /${constants.MOB_SELECT} and /${constants.MOB_ONSELECT} api, ${error.stack}`,
    )
    return { error: error.message }
  }

  try {
    logger.info(`Comparing Message Ids of /${constants.MOB_SELECT} and /${constants.MOB_ONSELECT}`)
    if (!_.isEqual(select.context.message_id, context.message_id)) {
      errorObj.msgId = `Message Id for /${constants.MOB_SELECT} and /${constants.MOB_ONSELECT} api should be same`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing message ids for /${constants.MOB_SELECT} and /${constants.MOB_ONSELECT} api, ${error.stack}`,
    )
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
