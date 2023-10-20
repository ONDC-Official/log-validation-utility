/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { ApiSequence, buyerCancellationRid } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty, checkContext } from '../../../utils'
import { getValue, setValue } from '../../../shared/dao'

export const checkCancel = (data: any) => {
  const cnclObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.CANCEL]: 'Json cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || isObjectEmpty(message)) {
      return { missingFields: '/context, /message, is missing or empty' }
    }

    const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
    const schemaValidation = validateSchema('RET11', constants.RET_CANCEL, data)
    const select: any = getValue(`${ApiSequence.SELECT}`)
    const contextRes: any = checkContext(context, constants.RET_CANCEL)

    if (schemaValidation !== 'error') {
      Object.assign(cnclObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(cnclObj, contextRes.ERRORS)
    }

    setValue(`${ApiSequence.CANCEL}`, data)

    try {
      logger.info(`Checking context for /${constants.RET_CANCEL} API`) //checking context
      const res: any = checkContext(context, constants.RET_CANCEL)
      if (!res.valid) {
        Object.assign(cnclObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.RET_CANCEL} context, ${error.stack}`)
    }

    try {
      logger.info(`Comparing city of /${constants.RET_SEARCH} and /${constants.RET_CANCEL}`)
      if (!_.isEqual(searchContext.city, context.city)) {
        cnclObj.city = `City code mismatch in /${constants.RET_SEARCH} and /${constants.RET_CANCEL}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing city in /${constants.RET_SEARCH} and /${constants.RET_CANCEL}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing timestamp of /${constants.RET_ONINIT} and /${constants.RET_CANCEL}`)
      if (_.gte(getValue('tmpstmp'), context.timestamp)) {
        cnclObj.tmpstmp = `Timestamp for /${constants.RET_ONINIT} api cannot be greater than or equal to /${constants.RET_CANCEL} api`
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.error(
        `!!Error while comparing timestamp for /${constants.RET_ONINIT} and /${constants.RET_CANCEL} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.RET_SELECT} and /${constants.RET_CANCEL}`)
      if (!_.isEqual(select.context.transaction_id, context.transaction_id)) {
        cnclObj.txnId = `Transaction Id should be same from /${constants.RET_SELECT} onwards`
      }
    } catch (error: any) {
      logger.info(
        `!!Error while comparing transaction ids for /${constants.RET_SELECT} and /${constants.RET_CANCEL} api, ${error.stack}`,
      )
    }

    const cancel = message

    try {
      logger.info(`Comparing order Id in /${constants.RET_CANCEL} and /${constants.RET_CONFIRM}`)
      if (cancel.order_id != getValue('cnfrmOrdrId')) {
        cnclObj.cancelOrdrId = `Order Id in /${constants.RET_CANCEL} and /${constants.RET_CONFIRM} do not match`
        logger.info(`Order Id mismatch in /${constants.RET_CANCEL} and /${constants.RET_CONFIRM}`)
      }
    } catch (error: any) {
      logger.info(
        `Error while comparing order id in /${constants.RET_CANCEL} and /${constants.RET_CONFIRM}, ${error.stack}`,
      )
    }

    try {
      logger.info('Checking the validity of cancellation reason id')
      if (!buyerCancellationRid.has(cancel.cancellation_reason_id)) {
        logger.info(`cancellation_reason_id should be a valid cancellation id (buyer app initiated)`)

        cnclObj.cancelRid = `Cancellation reason id is not a valid reason id (buyer app initiated)`
      } else setValue('cnclRid', cancel.cancellation_reason_id)
    } catch (error: any) {
      logger.info(`Error while checking validity of cancellation reason id /${constants.RET_CANCEL}, ${error.stack}`)
    }

    return cnclObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.RET_CANCEL} API`, err)
  }
}
