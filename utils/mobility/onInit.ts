import _ from 'lodash'
import constants, { mobilitySequence } from '../../constants'
import { logger } from '../../shared/logger'
import { validateSchema, isObjectEmpty, checkMobilityContext, timeDiff as timeDifference, checkBppIdOrBapId } from '../'
import { getValue, setValue } from '../../shared/dao'

export const checkOnInit = (data: any, msgIdSet: any) => {
  try {
    const onInitObj: any = {}
    if (!data || isObjectEmpty(data)) {
      return { [mobilitySequence.ON_INIT]: 'Json cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.MOB_ONINIT, data)
    const searchContext: any = getValue(`${mobilitySequence.SEARCH}_context`)
    const contextRes: any = checkMobilityContext(context, constants.MOB_ONINIT)
    // const parentItemIdSet: any = getValue(`parentItemIdSet`)

    if (!context.bap_id) {
      onInitObj['bap_id'] = 'context/bap_id is required'
    } else {
      const checkBap = checkBppIdOrBapId(context.bap_id)
      if (checkBap) Object.assign(onInitObj, { bap_id: 'context/bap_id should not be a url' })
    }

    if (!context.bpp_id) {
      onInitObj['bpp_id'] = 'context/bpp_id is required'
    } else {
      const checkBpp = checkBppIdOrBapId(context.bpp_id)
      console.log('checkBppcheckBppcheckBppcheckBppcheckBppcheckBpp', checkBpp)
      if (checkBpp) Object.assign(onInitObj, { bpp_id: 'context/bpp_id should not be a url' })
    }

    if (schemaValidation !== 'error') {
      Object.assign(onInitObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(onInitObj, contextRes.ERRORS)
    }

    setValue(`${mobilitySequence.ON_INIT}`, data)
    msgIdSet.add(context.message_id)

    logger.info(`Checking context for /${constants.MOB_ONINIT} API`) //checking context
    try {
      const res: any = checkMobilityContext(context, constants.MOB_ONINIT)
      if (!res.valid) {
        Object.assign(onInitObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.MOB_ONINIT} context, ${error.stack}`)
    }

    try {
      logger.info(`Comparing city of ${constants.MOB_SEARCH} & ${constants.MOB_ONINIT}`)
      if (!_.isEqual(searchContext.location.city, context.location.city)) {
        onInitObj.city = `City code mismatch in ${constants.MOB_SEARCH} & ${constants.MOB_ONINIT}`
      }
    } catch (error: any) {
      logger.info(`Error while comparing city in ${constants.MOB_SEARCH} & ${constants.MOB_ONINIT}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing country of ${constants.MOB_SEARCH} & ${constants.MOB_ONINIT}`)
      if (!_.isEqual(searchContext.location.country, context.location.country)) {
        onInitObj.Country = `country code mismatch in ${constants.MOB_SEARCH} & ${constants.MOB_ONINIT}`
      }
    } catch (error: any) {
      logger.info(`Error while comparing country in ${constants.MOB_SEARCH} & ${constants.MOB_ONINIT}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing timestamp of ${constants.MOB_INIT} & ${constants.MOB_ONINIT}`)
      const tmpstmp = getValue('tmpstmp')
      if (_.gte(tmpstmp, context.timestamp)) {
        onInitObj.tmpstmp = `Timestamp for ${constants.MOB_INIT} api cannot be greater than or equal to ${constants.MOB_ONINIT} api`
      } else {
        const timeDiff = timeDifference(context.timestamp, tmpstmp)
        logger.info(timeDiff)
        if (timeDiff > 5000) {
          onInitObj.tmpstmp = `context/timestamp difference between /${constants.MOB_ONINIT} and /${constants.MOB_INIT} should be smaller than 5 sec`
        }
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.error(
        `!!Error while comparing timestamp for /${constants.MOB_INIT} and /${constants.MOB_ONINIT} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.MOB_SELECT} & /${constants.MOB_ONINIT}`)
      if (!_.isEqual(getValue('txnId'), context.transaction_id)) {
        onInitObj.txnId = `Transaction Id should be same from /${constants.MOB_SELECT} onwards`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing transaction ids for /${constants.MOB_SELECT} & /${constants.MOB_ONINIT} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing Message Ids of /${constants.MOB_INIT} and /${constants.MOB_ONINIT}`)
      if (!_.isEqual(getValue('msgId'), context.message_id)) {
        onInitObj.msgId = `Message Ids for /${constants.MOB_INIT} and /${constants.MOB_ONINIT} api should be same`
      }

      msgIdSet.add(context.message_id)
    } catch (error: any) {
      logger.error(`!!Error while checking message id for /${constants.MOB_INIT}, ${error.stack}`)
    }

    return onInitObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.MOB_ONINIT} API`, err)
    return { error: err.message }
  }
}
