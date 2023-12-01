/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { mobilitySequence } from '../../constants'
import { logger } from '../../shared/logger'
import { validateSchema, isObjectEmpty, checkMobilityContext, timeDiff as timeDifference, checkBppIdOrBapId } from '../'
import { getValue, setValue } from '../../shared/dao'

export const checkOnUpdate = (data: any) => {
  const onUpdateObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [mobilitySequence.ON_UPDATE]: 'Json cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const searchContext: any = getValue(`${mobilitySequence.SEARCH}_context`)
    // const parentItemIdSet: any = getValue(`parentItemIdSet`)

    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.MOB_ONUPDATE, data)

    const contextRes: any = checkMobilityContext(context, constants.MOB_ONUPDATE)

    if (!context.bap_id) {
      onUpdateObj['bap_id'] = 'context/bap_id is required'
    } else {
      const checkBap = checkBppIdOrBapId(context.bap_id)
      if (checkBap) Object.assign(onUpdateObj, { bap_id: 'context/bap_id should not be a url' })
    }

    if (!context.bpp_id) {
      onUpdateObj['bpp_id'] = 'context/bpp_id is required'
    } else {
      const checkBpp = checkBppIdOrBapId(context.bpp_id)
      console.log('checkBppcheckBppcheckBppcheckBppcheckBppcheckBpp', checkBpp)
      if (checkBpp) Object.assign(onUpdateObj, { bpp_id: 'context/bpp_id should not be a url' })
    }

    if (schemaValidation !== 'error') {
      Object.assign(onUpdateObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(onUpdateObj, contextRes.ERRORS)
    }

    setValue(`${mobilitySequence.ON_UPDATE}`, data)

    try {
      logger.info(`Comparing city of /${constants.MOB_SEARCH} and /${constants.MOB_ONUPDATE}`)
      if (!_.isEqual(searchContext.location.city, context.location.city)) {
        onUpdateObj.city = `City code mismatch in /${constants.MOB_SEARCH} and /${constants.MOB_ONUPDATE}`
      }
    } catch (error: any) {
      logger.info(
        `Error while comparing city in /${constants.MOB_SEARCH} and /${constants.MOB_ONUPDATE}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing country of /${constants.MOB_SEARCH} and /${constants.MOB_ONUPDATE}`)
      if (!_.isEqual(searchContext.location.country, context.location.country)) {
        onUpdateObj.country = `Country code mismatch in /${constants.MOB_SEARCH} and /${constants.MOB_ONUPDATE}`
      }
    } catch (error: any) {
      logger.info(
        `Error while comparing country in /${constants.MOB_SEARCH} and /${constants.MOB_ONUPDATE}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing timestamp of /${constants.MOB_UPDATE} and /${constants.MOB_ONUPDATE}`)
      const tmpstmp = getValue('tmpstmp')
      if (_.gte(tmpstmp, context.timestamp)) {
        onUpdateObj.tmpstmp = `Timestamp for /${constants.MOB_UPDATE} api cannot be greater than or equal to /${constants.MOB_ONUPDATE} api`
      } else {
        const timeDiff = timeDifference(context.timestamp, tmpstmp)
        logger.info(timeDiff)
        if (timeDiff > 5000) {
          onUpdateObj.tmpstmp = `context/timestamp difference between /${constants.MOB_ONUPDATE} and /${constants.MOB_UPDATE} should be smaller than 5 sec`
        }
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.info(
        `Error while comparing timestamp for /${constants.MOB_UPDATE} and /${constants.MOB_ONUPDATE} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.MOB_CONFIRM} and /${constants.MOB_ONUPDATE}`)
      if (!_.isEqual(getValue('txnId'), context.transaction_id)) {
        onUpdateObj.txnId = `Transaction Id should be same from /${constants.MOB_CONFIRM} onwards`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing transaction ids for /${constants.MOB_CONFIRM} and /${constants.MOB_ONUPDATE} api, ${error.stack}`,
      )
    }

    return onUpdateObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.MOB_ONUPDATE} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}
