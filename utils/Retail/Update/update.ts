/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { ApiSequence, buyerCancellationRid, rtoCancellationRid } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty, checkContext, checkBppIdOrBapId } from '../../../utils'
import { getValue, setValue } from '../../../shared/dao'

export const checkUpdate = (data: any) => {
  const updtObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.UPDATE]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || isObjectEmpty(message)) {
      return { missingFields: '/context, /message, is missing or empty' }
    }

    const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.UPDATE, data)
    const select: any = getValue(`${ApiSequence.SELECT}`)
    const contextRes: any = checkContext(context, constants.UPDATE)

    const checkBap = checkBppIdOrBapId(context.bap_id)
    const checkBpp = checkBppIdOrBapId(context.bpp_id)

    if (checkBap) Object.assign(updtObj, { bap_id: 'context/bap_id should not be a url' })
    if (checkBpp) Object.assign(updtObj, { bpp_id: 'context/bpp_id should not be a url' })
    if (schemaValidation !== 'error') {
      Object.assign(updtObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(updtObj, contextRes.ERRORS)
    }

    setValue(`${ApiSequence.UPDATE}`, data)

    // Comaring city of ON_UPDATE with ON_SEARCH
    try {
      logger.info(`Comparing city of /${constants.SEARCH} and /${constants.UPDATE}`)
      if (!_.isEqual(searchContext.city, context.city)) {
        updtObj.city = `City code mismatch in /${constants.SEARCH} and /${constants.UPDATE}`
      }
    } catch (error: any) {
      logger.error(`!!Error while comparing city in /${constants.SEARCH} and /${constants.UPDATE}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing timestamp of /${constants.ON_INIT} and /${constants.UPDATE}`)
      if (_.gte(getValue('tmpstmp'), context.timestamp)) {
        updtObj.tmpstmp = `Timestamp for /${constants.ON_INIT} api cannot be greater than or equal to /${constants.UPDATE} api`
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.error(
        `!!Error while comparing timestamp for /${constants.ON_INIT} and /${constants.UPDATE} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.SELECT} and /${constants.UPDATE}`)
      if (!_.isEqual(select.context.transaction_id, context.transaction_id)) {
        updtObj.txnId = `Transaction Id should be same from /${constants.SELECT} onwards`
      }
    } catch (error: any) {
      logger.info(
        `!!Error while comparing transaction ids for /${constants.SELECT} and /${constants.UPDATE} api, ${error.stack}`,
      )
    }

    const cancel = message

    try {
      logger.info(`Comparing order Id in /${constants.UPDATE} and /${constants.CONFIRM}`)
      if (cancel.order_id != getValue('cnfrmOrdrId')) {
        updtObj.cancelOrdrId = `Order Id in /${constants.UPDATE} and /${constants.CONFIRM} do not match`
        logger.info(`Order Id mismatch in /${constants.UPDATE} and /${constants.CONFIRM}`)
      }
    } catch (error: any) {
      logger.info(`Error while comparing order id in /${constants.UPDATE} and /${constants.CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info('Checking the validity of cancellation reason id for buyer')
      if (!buyerCancellationRid.has(cancel.cancellation_reason_id)) {
        logger.info(`cancellation_reason_id should be a valid cancellation id (buyer app initiated)`)

        updtObj.cancelRid = `Cancellation reason id is not a valid reason id (buyer app initiated)`
      } else setValue('cnclRid', cancel.cancellation_reason_id)

      if (!rtoCancellationRid.has(cancel.cancellation_reason_id)) {
        logger.info(`cancellation_reason_id should be a valid cancellation id (RTO initiated)`)

        updtObj.RTOcancelRid = `Cancellation reason id is not a valid reason id (RTO initiated)`
      } else setValue('rtoCnclRid', cancel.cancellation_reason_id)
    } catch (error: any) {
      logger.info(`Error while checking validity of cancellation reason id /${constants.UPDATE}, ${error.stack}`)
    }

    return updtObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.UPDATE} API`, err)
  }
}
