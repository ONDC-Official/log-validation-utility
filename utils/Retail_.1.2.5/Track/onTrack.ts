/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { ApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchemaRetailV2, isObjectEmpty, checkContext, checkBppIdOrBapId } from '../..'
import { getValue, setValue } from '../../../shared/dao'

export const checkOnTrack = (data: any, schemaValidation?: boolean, stateless?: boolean) => {
  const onTrckObj: any = {}
  const schemaErrors: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.ON_TRACK]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || isObjectEmpty(message)) {
      return { missingFields: '/context, /message, is missing or empty' }
    }

    const schemaValidationResult =
      schemaValidation !== false ? validateSchemaRetailV2(context.domain.split(':')[1], constants.ON_TRACK, data) : 'skip'

    if (schemaValidationResult !== 'error' && schemaValidationResult !== 'skip') {
      Object.assign(schemaErrors, schemaValidationResult)
    }

    const contextRes: any = checkContext(context, constants.ON_TRACK)
    if (!contextRes?.valid) {
      Object.assign(onTrckObj, contextRes.ERRORS)
    }

    const checkBap = checkBppIdOrBapId(context.bap_id)
    const checkBpp = checkBppIdOrBapId(context.bpp_id)

    if (checkBap) Object.assign(onTrckObj, { bap_id: 'context/bap_id should not be a url' })
    if (checkBpp) Object.assign(onTrckObj, { bpp_id: 'context/bpp_id should not be a url' })

    if (stateless) {
      const hasSchema = Object.keys(schemaErrors).length > 0
      const hasBusiness = Object.keys(onTrckObj).length > 0
      if (!hasSchema && !hasBusiness) return false
      if (schemaValidation !== undefined) {
        return { schemaErrors, businessErrors: onTrckObj }
      }
      const combinedErrors = { ...schemaErrors, ...onTrckObj }
      return Object.keys(combinedErrors).length > 0 ? combinedErrors : false
    }

    const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
    const select: any = getValue(`${ApiSequence.SELECT}`)

    setValue(`${ApiSequence.ON_TRACK}`, data)

    try {
      logger.info(`Checking context for /${constants.ON_TRACK} API`) //checking context
      const res: any = checkContext(context, constants.ON_TRACK)
      if (!res.valid) {
        Object.assign(onTrckObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.ON_TRACK} context, ${error.stack}`)
    }

    try {
      logger.info(`Comparing city of /${constants.SEARCH} and /${constants.ON_TRACK}`)
      if (!_.isEqual(searchContext.city, context.city)) {
        onTrckObj.city = `City code mismatch in /${constants.SEARCH} and /${constants.ON_TRACK}`
      }
    } catch (error: any) {
      logger.error(`!!Error while comparing city in /${constants.SEARCH} and /${constants.ON_TRACK}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.SELECT} and /${constants.ON_TRACK}`)
      if (!_.isEqual(select.context.transaction_id, context.transaction_id)) {
        onTrckObj.txnId = `Transaction Id should be same from /${constants.SELECT} onwards`
      }
    } catch (error: any) {
      logger.info(
        `!!Error while comparing transaction ids for /${constants.SELECT} and /${constants.ON_TRACK} api, ${error.stack}`,
      )
    }

    const hasSchema = Object.keys(schemaErrors).length > 0
    const hasBusiness = Object.keys(onTrckObj).length > 0
    if (!hasSchema && !hasBusiness) return false
    if (schemaValidation !== undefined) {
      return { schemaErrors, businessErrors: onTrckObj }
    }
    const combinedErrors = { ...schemaErrors, ...onTrckObj }
    return Object.keys(combinedErrors).length > 0 ? combinedErrors : false
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_TRACK} API`, err)
    return { error: `Error while checking /${constants.ON_TRACK} API: ${err.message}` }
  }
}
