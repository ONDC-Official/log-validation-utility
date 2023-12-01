/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { mobilitySequence } from '../../constants'
import { logger } from '../../shared/logger'
import { validateSchema, isObjectEmpty, checkMobilityContext, timeDiff as timeDifference, checkBppIdOrBapId } from '../'
import { getValue, setValue } from '../../shared/dao'

export const checkOnStatus = (data: any) => {
  const onStatusObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [mobilitySequence.ON_STATUS]: 'Json cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const searchContext: any = getValue(`${mobilitySequence.SEARCH}_context`)
    // const parentItemIdSet: any = getValue(`parentItemIdSet`)

    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.MOB_ONSTATUS, data)

    const contextRes: any = checkMobilityContext(context, constants.MOB_ONSTATUS)

    if (!context.bap_id) {
      onStatusObj['bap_id'] = 'context/bap_id is required'
    } else {
      const checkBap = checkBppIdOrBapId(context.bap_id)
      if (checkBap) Object.assign(onStatusObj, { bap_id: 'context/bap_id should not be a url' })
    }

    if (!context.bpp_id) {
      onStatusObj['bpp_id'] = 'context/bpp_id is required'
    } else {
      const checkBpp = checkBppIdOrBapId(context.bpp_id)
      console.log('checkBppcheckBppcheckBppcheckBppcheckBppcheckBpp', checkBpp)
      if (checkBpp) Object.assign(onStatusObj, { bpp_id: 'context/bpp_id should not be a url' })
    }

    if (schemaValidation !== 'error') {
      Object.assign(onStatusObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(onStatusObj, contextRes.ERRORS)
    }

    setValue(`${mobilitySequence.ON_STATUS}`, data)

    try {
      logger.info(`Comparing city of /${constants.MOB_UPDATE} and /${constants.MOB_ONSTATUS}`)
      if (!_.isEqual(searchContext.location.city, context.location.city)) {
        onStatusObj.city = `City code mismatch in /${constants.MOB_UPDATE} and /${constants.MOB_ONSTATUS}`
      }
    } catch (error: any) {
      logger.info(
        `Error while comparing city in /${constants.MOB_UPDATE} and /${constants.MOB_ONSTATUS}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing country of /${constants.MOB_UPDATE} and /${constants.MOB_ONSTATUS}`)
      if (!_.isEqual(searchContext.location.country, context.location.country)) {
        onStatusObj.country = `Country code mismatch in /${constants.MOB_UPDATE} and /${constants.MOB_ONSTATUS}`
      }
    } catch (error: any) {
      logger.info(
        `Error while comparing country in /${constants.MOB_UPDATE} and /${constants.MOB_ONSTATUS}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing timestamp of /${constants.MOB_STATUS} and /${constants.MOB_ONSTATUS}`)
      const tmpstmp = getValue('tmpstmp')
      if (_.gte(tmpstmp, context.timestamp)) {
        onStatusObj.tmpstmp = `Timestamp for /${constants.MOB_STATUS} api cannot be greater than or equal to /${constants.MOB_ONSTATUS} api`
      } else {
        const timeDiff = timeDifference(context.timestamp, tmpstmp)
        logger.info(timeDiff)
        if (timeDiff > 5000) {
          onStatusObj.tmpstmp = `context/timestamp difference between /${constants.MOB_ONSTATUS} and /${constants.MOB_STATUS} should be smaller than 5 sec`
        }
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.info(
        `Error while comparing timestamp for /${constants.MOB_STATUS} and /${constants.MOB_ONSTATUS} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.MOB_SELECT} and /${constants.MOB_ONSTATUS}`)
      if (!_.isEqual(getValue('txnId'), context.transaction_id)) {
        onStatusObj.txnId = `Transaction Id should be same from /${constants.MOB_SELECT} onwards`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing transaction ids for /${constants.MOB_SELECT} and /${constants.MOB_ONSTATUS} api, ${error.stack}`,
      )
    }

    return onStatusObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.MOB_ONSTATUS} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}
