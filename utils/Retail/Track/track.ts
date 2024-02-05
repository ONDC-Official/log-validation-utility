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
    const schemaValidation = validateSchema('RET11', constants.TRACK, data)
    const select: any = getValue(`${ApiSequence.SELECT}`)
    const contextRes: any = checkContext(context, constants.TRACK)

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
      logger.info(`Checking context for /${constants.TRACK} API`) //checking context
      const res: any = checkContext(context, constants.TRACK)
      if (!res.valid) {
        Object.assign(trckObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.TRACK} context, ${error.stack}`)
    }

    try {
      logger.info(`Comparing city of /${constants.SEARCH} and /${constants.TRACK}`)
      if (!_.isEqual(searchContext.city, context.city)) {
        trckObj.city = `City code mismatch in /${constants.SEARCH} and /${constants.TRACK}`
      }
    } catch (error: any) {
      logger.error(`!!Error while comparing city in /${constants.SEARCH} and /${constants.TRACK}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.SELECT} and /${constants.TRACK}`)
      if (!_.isEqual(select.context.transaction_id, context.transaction_id)) {
        trckObj.txnId = `Transaction Id should be same from /${constants.SELECT} onwards`
      }
    } catch (error: any) {
      logger.info(
        `!!Error while comparing transaction ids for /${constants.SELECT} and /${constants.TRACK} api, ${error.stack}`,
      )
    }

    return trckObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.TRACK} API`, err)
  }
}
