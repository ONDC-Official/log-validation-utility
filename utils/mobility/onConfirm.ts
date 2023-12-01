/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { mobilitySequence } from '../../constants'
import { logger } from '../../shared/logger'
import { validateSchema, isObjectEmpty, checkMobilityContext, timeDiff as timeDifference, checkBppIdOrBapId } from '../'
import { getValue, setValue } from '../../shared/dao'

export const checkOnConfirm = (data: any) => {
  const onCnfrmObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [mobilitySequence.ON_CONFIRM]: 'Json cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const searchContext: any = getValue(`${mobilitySequence.SEARCH}_context`)
    // const parentItemIdSet: any = getValue(`parentItemIdSet`)

    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.MOB_ONCONFIRM, data)

    const contextRes: any = checkMobilityContext(context, constants.MOB_ONCONFIRM)

    if (!context.bap_id) {
      onCnfrmObj['bap_id'] = 'context/bap_id is required'
    } else {
      const checkBap = checkBppIdOrBapId(context.bap_id)
      if (checkBap) Object.assign(onCnfrmObj, { bap_id: 'context/bap_id should not be a url' })
    }

    if (!context.bpp_id) {
      onCnfrmObj['bpp_id'] = 'context/bpp_id is required'
    } else {
      const checkBpp = checkBppIdOrBapId(context.bpp_id)
      console.log('checkBppcheckBppcheckBppcheckBppcheckBppcheckBpp', checkBpp)
      if (checkBpp) Object.assign(onCnfrmObj, { bpp_id: 'context/bpp_id should not be a url' })
    }

    if (schemaValidation !== 'error') {
      Object.assign(onCnfrmObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(onCnfrmObj, contextRes.ERRORS)
    }

    setValue(`${mobilitySequence.ON_CONFIRM}`, data)

    try {
      logger.info(`Comparing city of /${constants.MOB_SEARCH} and /${constants.MOB_ONCONFIRM}`)
      if (!_.isEqual(searchContext.location.city, context.location.city)) {
        onCnfrmObj.city = `City code mismatch in /${constants.MOB_SEARCH} and /${constants.MOB_ONCONFIRM}`
      }
    } catch (error: any) {
      logger.info(
        `Error while comparing city in /${constants.MOB_SEARCH} and /${constants.MOB_ONCONFIRM}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing country of /${constants.MOB_SEARCH} and /${constants.MOB_ONCONFIRM}`)
      if (!_.isEqual(searchContext.location.country, context.location.country)) {
        onCnfrmObj.country = `Country code mismatch in /${constants.MOB_SEARCH} and /${constants.MOB_ONCONFIRM}`
      }
    } catch (error: any) {
      logger.info(
        `Error while comparing country in /${constants.MOB_SEARCH} and /${constants.MOB_ONCONFIRM}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing timestamp of /${constants.MOB_CONFIRM} and /${constants.MOB_ONCONFIRM}`)
      const tmpstmp = getValue('tmpstmp')
      if (_.gte(tmpstmp, context.timestamp)) {
        onCnfrmObj.tmpstmp = `Timestamp for /${constants.MOB_CONFIRM} api cannot be greater than or equal to /${constants.MOB_ONCONFIRM} api`
      } else {
        const timeDiff = timeDifference(context.timestamp, tmpstmp)
        logger.info(timeDiff)
        if (timeDiff > 5000) {
          onCnfrmObj.tmpstmp = `context/timestamp difference between /${constants.MOB_ONCONFIRM} and /${constants.MOB_CONFIRM} should be smaller than 5 sec`
        }
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.info(
        `Error while comparing timestamp for /${constants.MOB_CONFIRM} and /${constants.MOB_ONCONFIRM} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.MOB_SELECT} and /${constants.MOB_ONCONFIRM}`)
      if (!_.isEqual(getValue('txnId'), context.transaction_id)) {
        onCnfrmObj.txnId = `Transaction Id should be same from /${constants.MOB_SELECT} onwards`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing transaction ids for /${constants.MOB_SELECT} and /${constants.MOB_ONCONFIRM} api, ${error.stack}`,
      )
    }

    return onCnfrmObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.MOB_ONCONFIRM} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}
