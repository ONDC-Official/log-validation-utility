/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { ApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty, checkContext, checkBppIdOrBapId } from '../../../utils'
import { getValue, setValue } from '../../../shared/dao'

export const checkOnTrack = (data: any) => {
  const onTrckObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.ON_TRACK]: 'Json cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || isObjectEmpty(message)) {
      return { missingFields: '/context, /message, is missing or empty' }
    }

    const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
    const schemaValidation = validateSchema('RET11', constants.RET_ONTRACK, data)
    const select: any = getValue(`${ApiSequence.SELECT}`)
    const contextRes: any = checkContext(context, constants.RET_ONTRACK)

    const checkBap = checkBppIdOrBapId(context.bap_id)
    const checkBpp = checkBppIdOrBapId(context.bpp_id)

    if (checkBap) Object.assign(onTrckObj, { bap_id: 'context/bap_id should not be a url' })
    if (checkBpp) Object.assign(onTrckObj, { bpp_id: 'context/bpp_id should not be a url' })
    if (schemaValidation !== 'error') {
      Object.assign(onTrckObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(onTrckObj, contextRes.ERRORS)
    }

    setValue(`${ApiSequence.ON_TRACK}`, data)

    try {
      logger.info(`Checking context for /${constants.RET_ONTRACK} API`) //checking context
      const res: any = checkContext(context, constants.RET_ONTRACK)
      if (!res.valid) {
        Object.assign(onTrckObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.RET_ONTRACK} context, ${error.stack}`)
    }

    try {
      logger.info(`Comparing city of /${constants.RET_SEARCH} and /${constants.RET_ONTRACK}`)
      if (!_.isEqual(searchContext.city, context.city)) {
        onTrckObj.city = `City code mismatch in /${constants.RET_SEARCH} and /${constants.RET_ONTRACK}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing city in /${constants.RET_SEARCH} and /${constants.RET_ONTRACK}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.RET_SELECT} and /${constants.RET_ONTRACK}`)
      if (!_.isEqual(select.context.transaction_id, context.transaction_id)) {
        onTrckObj.txnId = `Transaction Id should be same from /${constants.RET_SELECT} onwards`
      }
    } catch (error: any) {
      logger.info(
        `!!Error while comparing transaction ids for /${constants.RET_SELECT} and /${constants.RET_ONTRACK} api, ${error.stack}`,
      )
    }

    return onTrckObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.RET_ONTRACK} API`, err)
  }
}
