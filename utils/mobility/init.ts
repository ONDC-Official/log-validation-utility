import _ from 'lodash'
import constants, { mobilitySequence } from '../../constants'
import { logger } from '../../shared/logger'
import { validateSchema, isObjectEmpty, checkFISContext, checkBppIdOrBapId } from '../'
import { getValue, setValue } from '../../shared/dao'

export const checkInit = (data: any, msgIdSet: any) => {
  const initObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [mobilitySequence.INIT]: 'Json cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const searchContext: any = getValue(`${mobilitySequence.SEARCH}_context`)
    const select: any = getValue(`${mobilitySequence.SELECT}`)
    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.MOB_INIT, data)

    const contextRes: any = checkFISContext(context, constants.MOB_INIT)
    msgIdSet.add(context.message_id)

    if (!context.bap_id) {
      initObj['bap_id'] = 'context/bap_id is required'
    } else {
      const checkBap = checkBppIdOrBapId(context.bap_id)
      if (checkBap) Object.assign(initObj, { bap_id: 'context/bap_id should not be a url' })
    }

    if (!context.bpp_id) {
      initObj['bpp_id'] = 'context/bpp_id is required'
    } else {
      const checkBpp = checkBppIdOrBapId(context.bpp_id)
      console.log('checkBppcheckBppcheckBppcheckBppcheckBppcheckBpp', checkBpp)
      if (checkBpp) Object.assign(initObj, { bpp_id: 'context/bpp_id should not be a url' })
    }

    if (schemaValidation !== 'error') {
      Object.assign(initObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(initObj, contextRes.ERRORS)
    }

    setValue(`${mobilitySequence.INIT}`, data)

    try {
      logger.info(`Checking context for /${constants.FIS_INIT} API`)
      const res: any = checkFISContext(context, constants.FIS_INIT)
      if (!res.valid) {
        Object.assign(initObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.MOB_INIT} context, ${error.stack}`)
    }

    try {
      logger.info(`Comparing city of /${constants.FIS_SELECT} and /${constants.FIS_INIT}`)

      if (!_.isEqual(searchContext.location.city, context.location.city)) {
        initObj.city = `City code mismatch in /${constants.FIS_SELECT} and /${constants.FIS_INIT}`
      }
    } catch (error: any) {
      logger.info(`Error while comparing city in /${constants.MOB_SELECT} and /${constants.MOB_INIT}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing country of /${constants.FIS_SELECT} and /${constants.FIS_INIT}`)

      if (!_.isEqual(searchContext.location.country, context.location.country)) {
        initObj.country = `Country code mismatch in /${constants.FIS_SELECT} and /${constants.FIS_INIT}`
      }
    } catch (error: any) {
      logger.info(
        `Error while comparing country in /${constants.MOB_SELECT} and /${constants.MOB_INIT}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing timestamp of /${constants.RET_ONSELECT} and /${constants.FIS_INIT}`)
      if (_.gte(getValue('tmpstmp'), context.timestamp)) {
        initObj.tmpstmp = `Timestamp for  /${constants.RET_ONSELECT} api cannot be greater than or equal to /init api`
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.error(
        `!!Error while comparing timestamp for /${constants.MOB_ONSELECT} and /${constants.MOB_INIT} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.RET_SELECT} and /${constants.FIS_INIT}`)
      if (!_.isEqual(select.context.transaction_id, context.transaction_id)) {
        initObj.txnId = `Transaction Id should be same from /${constants.RET_SELECT} onwards`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing transaction ids for /${constants.MOB_SELECT} and /${constants.MOB_INIT} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Checking Message Ids of /${constants.FIS_INIT}`)

      setValue('msgId', context.message_id)
    } catch (error: any) {
      logger.info(`Error while checking message id for /${constants.MOB_INIT}, ${error.stack}`)
    }

    return initObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.MOB_INIT} API`, err)
    return { error: err.message }
  }
}
