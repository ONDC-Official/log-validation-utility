/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { ApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty, checkContext, checkBppIdOrBapId } from '../../../utils'
import { getValue, setValue } from '../../../shared/dao'

export const checkTrack = (data: any) => {
  const trckObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.TRACK]: 'Json cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || isObjectEmpty(message)) {
      return { missingFields: '/context, /message, is missing or empty' }
    }

    const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
    const schemaValidation = validateSchema('RET11', constants.RET_TRACK, data)
    const select: any = getValue(`${ApiSequence.SELECT}`)
    const contextRes: any = checkContext(context, constants.RET_TRACK)

    const checkBap = checkBppIdOrBapId(context.bap_id)
    const checkBpp = checkBppIdOrBapId(context.bpp_id)

    if (checkBap) Object.assign(trckObj, { bap_id: 'context/bap_id should not be a url' })
    if (checkBpp) Object.assign(trckObj, { bpp_id: 'context/bpp_id should not be a url' })

    if (schemaValidation !== 'error') {
      Object.assign(trckObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(trckObj, contextRes.ERRORS)
    }

    setValue(`${ApiSequence.TRACK}`, data)

    try {
      logger.info(`Checking context for /${constants.RET_TRACK} API`) //checking context
      const res: any = checkContext(context, constants.RET_TRACK)
      if (!res.valid) {
        Object.assign(trckObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.RET_TRACK} context, ${error.stack}`)
    }

    try {
      logger.info(`Comparing city of /${constants.RET_SEARCH} and /${constants.RET_TRACK}`)
      if (!_.isEqual(searchContext.city, context.city)) {
        trckObj.city = `City code mismatch in /${constants.RET_SEARCH} and /${constants.RET_TRACK}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing city in /${constants.RET_SEARCH} and /${constants.RET_TRACK}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.RET_SELECT} and /${constants.RET_TRACK}`)
      if (!_.isEqual(select.context.transaction_id, context.transaction_id)) {
        trckObj.txnId = `Transaction Id should be same from /${constants.RET_SELECT} onwards`
      }
    } catch (error: any) {
      logger.info(
        `!!Error while comparing transaction ids for /${constants.RET_SELECT} and /${constants.RET_TRACK} api, ${error.stack}`,
      )
    }

    return trckObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.RET_TRACK} API`, err)
  }
}
