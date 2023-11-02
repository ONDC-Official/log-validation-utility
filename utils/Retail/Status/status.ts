/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { ApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty, checkContext, checkBppIdOrBapId } from '../../../utils'
import { getValue, setValue } from '../../../shared/dao'

export const checkStatus = (data: any) => {
  const statusObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.STATUS]: 'Json cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || isObjectEmpty(message)) {
      return { missingFields: '/context, /message, is missing or empty' }
    }

    const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
    const schemaValidation = validateSchema('RET11', constants.RET_STATUS, data)
    const select: any = getValue(`${ApiSequence.SELECT}`)
    const contextRes: any = checkContext(context, constants.RET_STATUS)

    const checkBap = checkBppIdOrBapId(context.bap_id)
    const checkBpp = checkBppIdOrBapId(context.bpp_id)

    if (checkBap) Object.assign(statusObj, { bap_id: 'context/bap_id should not be a url' })
    if (checkBpp) Object.assign(statusObj, { bpp_id: 'context/bpp_id should not be a url' })
    if (schemaValidation !== 'error') {
      Object.assign(statusObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(statusObj, contextRes.ERRORS)
    }

    setValue(`${ApiSequence.STATUS}`, data)

    try {
      logger.info(`Checking context for /${constants.RET_STATUS} API`) //checking context
      const res: any = checkContext(context, constants.RET_STATUS)
      if (!res.valid) {
        Object.assign(statusObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.RET_STATUS} context, ${error.stack}`)
    }

    try {
      logger.info(`Comparing city of /${constants.RET_SEARCH} and /${constants.RET_STATUS}`)
      if (!_.isEqual(searchContext.city, context.city)) {
        statusObj.city = `City code mismatch in /${constants.RET_SEARCH} and /${constants.RET_STATUS}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing city in /${constants.RET_SEARCH} and /${constants.RET_STATUS}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.RET_SELECT} and /${constants.RET_STATUS}`)
      if (!_.isEqual(select.context.transaction_id, context.transaction_id)) {
        statusObj.txnId = `Transaction Id should be same from /${constants.RET_SELECT} onwards`
      }
    } catch (error: any) {
      logger.info(
        `!!Error while comparing transaction ids for /${constants.RET_SELECT} and /${constants.RET_STATUS} api, ${error.stack}`,
      )
    }

    return statusObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.RET_STATUS} API`, err)
  }
}
