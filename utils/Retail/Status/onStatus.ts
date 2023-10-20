/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { ApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty, checkContext } from '../../../utils'
import { getValue, setValue } from '../../../shared/dao'

export const checkOnStatus = (data: any) => {
  const onStatusObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.ON_STATUS]: 'Json cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || isObjectEmpty(message)) {
      return { missingFields: '/context, /message, is missing or empty' }
    }

    const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
    const schemaValidation = validateSchema('RET11', constants.RET_ONSTATUS, data)
    const select: any = getValue(`${ApiSequence.SELECT}`)
    const contextRes: any = checkContext(context, constants.RET_ONSTATUS)

    if (schemaValidation !== 'error') {
      Object.assign(onStatusObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(onStatusObj, contextRes.ERRORS)
    }

    setValue(`${ApiSequence.ON_STATUS}`, data)

    try {
      logger.info(`Checking context for /${constants.RET_ONSTATUS} API`) //checking context
      const res: any = checkContext(context, constants.RET_ONSTATUS)
      if (!res.valid) {
        Object.assign(onStatusObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.RET_ONSTATUS} context, ${error.stack}`)
    }

    try {
      logger.info(`Comparing city of /${constants.RET_SEARCH} and /${constants.RET_ONSTATUS}`)
      if (!_.isEqual(searchContext.city, context.city)) {
        onStatusObj.city = `City code mismatch in /${constants.RET_SEARCH} and /${constants.RET_ONSTATUS}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing city in /${constants.RET_SEARCH} and /${constants.RET_ONSTATUS}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.RET_SELECT} and /${constants.RET_ONSTATUS}`)
      if (!_.isEqual(select.context.transaction_id, context.transaction_id)) {
        onStatusObj.txnId = `Transaction Id should be same from /${constants.RET_SELECT} onwards`
      }
    } catch (error: any) {
      logger.info(
        `!!Error while comparing transaction ids for /${constants.RET_SELECT} and /${constants.RET_ONSTATUS} api, ${error.stack}`,
      )
    }

    return onStatusObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.RET_ONSTATUS} API`, err)
  }
}
