/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { ApiSequence, buyerCancellationRid } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty, checkContext, checkBppIdOrBapId } from '../../../utils'
import { getValue, setValue } from '../../../shared/dao'

export const checkCancel = (data: any) => {
  const cnclObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.CANCEL]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || isObjectEmpty(message)) {
      return { missingFields: '/context, /message, is missing or empty' }
    }

    const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
    const schemaValidation = validateSchema('RET11', constants.CANCEL, data)
    const select: any = getValue(`${ApiSequence.SELECT}`)
    const contextRes: any = checkContext(context, constants.CANCEL)

    const checkBap = checkBppIdOrBapId(context.bap_id)
    const checkBpp = checkBppIdOrBapId(context.bpp_id)

    if (checkBap) Object.assign(cnclObj, { bap_id: 'context/bap_id should not be a url' })
    if (checkBpp) Object.assign(cnclObj, { bpp_id: 'context/bpp_id should not be a url' })
    if (schemaValidation !== 'error') {
      Object.assign(cnclObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(cnclObj, contextRes.ERRORS)
    }

    setValue(`${ApiSequence.CANCEL}`, data)

    try {
      logger.info(`Checking context for /${constants.CANCEL} API`) //checking context
      const res: any = checkContext(context, constants.CANCEL)
      if (!res.valid) {
        Object.assign(cnclObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.CANCEL} context, ${error.stack}`)
    }

    try {
      logger.info(`Comparing city of /${constants.SEARCH} and /${constants.CANCEL}`)
      if (!_.isEqual(searchContext.city, context.city)) {
        cnclObj.city = `City code mismatch in /${constants.SEARCH} and /${constants.CANCEL}`
      }
    } catch (error: any) {
      logger.error(`!!Error while comparing city in /${constants.SEARCH} and /${constants.CANCEL}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing timestamp of /${constants.ON_INIT} and /${constants.CANCEL}`)
      if (_.gte(getValue('tmpstmp'), context.timestamp)) {
        cnclObj.tmpstmp = `Timestamp for /${constants.ON_INIT} api cannot be greater than or equal to /${constants.CANCEL} api`
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.error(
        `!!Error while comparing timestamp for /${constants.ON_INIT} and /${constants.CANCEL} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.SELECT} and /${constants.CANCEL}`)
      if (!_.isEqual(select.context.transaction_id, context.transaction_id)) {
        cnclObj.txnId = `Transaction Id should be same from /${constants.SELECT} onwards`
      }
    } catch (error: any) {
      logger.info(
        `!!Error while comparing transaction ids for /${constants.SELECT} and /${constants.CANCEL} api, ${error.stack}`,
      )
    }

    const cancel = message

    try {
      logger.info(`Comparing order Id in /${constants.CANCEL} and /${constants.CONFIRM}`)
      if (cancel.order_id != getValue('cnfrmOrdrId')) {
        cnclObj.cancelOrdrId = `Order Id in /${constants.CANCEL} and /${constants.CONFIRM} do not match`
        logger.info(`Order Id mismatch in /${constants.CANCEL} and /${constants.CONFIRM}`)
      }
    } catch (error: any) {
      logger.info(`Error while comparing order id in /${constants.CANCEL} and /${constants.CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info('Checking the validity of cancellation reason id')
      if (!buyerCancellationRid.has(cancel.cancellation_reason_id)) {
        logger.info(`cancellation_reason_id should be a valid cancellation id (buyer app initiated)`)

        cnclObj.cancelRid = `Cancellation reason id is not a valid reason id (buyer app initiated)`
      } else setValue('cnclRid', cancel.cancellation_reason_id)
    } catch (error: any) {
      logger.info(`Error while checking validity of cancellation reason id /${constants.CANCEL}, ${error.stack}`)
    }

    return cnclObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.CANCEL} API`, err)
  }
}
