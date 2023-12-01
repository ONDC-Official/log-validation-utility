import _ from 'lodash'
import constants, { mobilitySequence } from '../../constants'
import { logger } from '../../shared/logger'
import { validateSchema, isObjectEmpty, checkMobilityContext, checkBppIdOrBapId } from '../'
import { getValue, setValue } from '../../shared/dao'

export const checkConfirm = (data: any) => {
  const cnfrmObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [mobilitySequence.CONFIRM]: 'Json cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const searchContext: any = getValue(`${mobilitySequence.SEARCH}_context`)
    const select: any = getValue(`${mobilitySequence.SELECT}`)
    // const parentItemIdSet: any = getValue(`parentItemIdSet`)
    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.MOB_CONFIRM, data)

    const contextRes: any = checkMobilityContext(context, constants.MOB_CONFIRM)

    if (!context.bap_id) {
      cnfrmObj['bap_id'] = 'context/bap_id is required'
    } else {
      const checkBap = checkBppIdOrBapId(context.bap_id)
      if (checkBap) Object.assign(cnfrmObj, { bap_id: 'context/bap_id should not be a url' })
    }

    if (!context.bpp_id) {
      cnfrmObj['bpp_id'] = 'context/bpp_id is required'
    } else {
      const checkBpp = checkBppIdOrBapId(context.bpp_id)
      console.log('checkBppcheckBppcheckBppcheckBppcheckBppcheckBpp', checkBpp)
      if (checkBpp) Object.assign(cnfrmObj, { bpp_id: 'context/bpp_id should not be a url' })
    }

    if (schemaValidation !== 'error') {
      Object.assign(cnfrmObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(cnfrmObj, contextRes.ERRORS)
    }

    setValue(`${mobilitySequence.CONFIRM}`, data)

    try {
      logger.info(`Comparing city of /${constants.MOB_SEARCH} and /${constants.MOB_CONFIRM}`)
      if (!_.isEqual(searchContext.location.city, context.location.city)) {
        cnfrmObj.city = `City code mismatch in /${constants.MOB_SEARCH} and /${constants.MOB_CONFIRM}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing city in /${constants.MOB_SEARCH} and /${constants.MOB_CONFIRM}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing country of /${constants.MOB_SEARCH} and /${constants.MOB_CONFIRM}`)
      if (!_.isEqual(searchContext.location.country, context.location.country)) {
        cnfrmObj.country = `Country code mismatch in /${constants.MOB_SEARCH} and /${constants.MOB_CONFIRM}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing country in /${constants.MOB_SEARCH} and /${constants.MOB_CONFIRM}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing timestamp of /${constants.MOB_ONINIT} and /${constants.MOB_CONFIRM}`)
      if (_.gte(getValue('tmpstmp'), context.timestamp)) {
        cnfrmObj.tmpstmp = `Timestamp for /${constants.MOB_ONINIT} api cannot be greater than or equal to /${constants.MOB_CONFIRM} api`
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.error(
        `!!Error while comparing timestamp for /${constants.MOB_ONINIT} and /${constants.MOB_CONFIRM} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.MOB_SELECT} and /${constants.MOB_CONFIRM}`)
      if (!_.isEqual(select.context.transaction_id, context.transaction_id)) {
        cnfrmObj.txnId = `Transaction Id should be same from /${constants.MOB_SELECT} onwards`
      }
    } catch (error: any) {
      logger.info(
        `!!Error while comparing transaction ids for /${constants.MOB_SELECT} and /${constants.MOB_CONFIRM} api, ${error.stack}`,
      )
    }

    return cnfrmObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.FIS_CONFIRM} API`, err)
    return { error: err.message }
  }
}
