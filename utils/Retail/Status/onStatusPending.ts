/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { ApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty, checkContext, areTimestampsLessThanOrEqualTo, payment_status } from '../..'
import { getValue, setValue } from '../../../shared/dao'

export const checkOnStatusPending = (data: any, state: string, msgIdSet: any) => {
  const onStatusObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.ON_STATUS_PENDING]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || isObjectEmpty(message)) {
      return { missingFields: '/context, /message, is missing or empty' }
    }

    const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.ON_STATUS, data)
    const contextRes: any = checkContext(context, constants.ON_STATUS)

    if (schemaValidation !== 'error') {
      Object.assign(onStatusObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(onStatusObj, contextRes.ERRORS)
    }

    if (!_.isEqual(data.context.domain.split(':')[1], getValue(`domain`))) {
      onStatusObj[`Domain[${data.context.action}]`] = `Domain should be same in each action`
    }

    if (!msgIdSet.add(context.message_id)) {
      onStatusObj['messageId'] = 'message_id should be unique'
    }

    setValue(`${ApiSequence.ON_STATUS_PENDING}`, data)
    setValue('pending_message_id', context.message_id)

    try {
      logger.info(`Checking context for /${constants.ON_STATUS} API`) //checking context
      const res: any = checkContext(context, constants.ON_STATUS)
      if (!res.valid) {
        Object.assign(onStatusObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.ON_STATUS} context, ${error.stack}`)
    }

    try {
      logger.info(`Comparing city of /${constants.SEARCH} and /${constants.ON_STATUS}`)
      if (!_.isEqual(searchContext.city, context.city)) {
        onStatusObj.city = `City code mismatch in /${constants.SEARCH} and /${constants.ON_STATUS}`
      }
    } catch (error: any) {
      logger.error(`!!Error while comparing city in /${constants.SEARCH} and /${constants.ON_STATUS}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.SELECT} and /${constants.ON_STATUS}`)
      if (!_.isEqual(getValue('txnId'), context.transaction_id)) {
        onStatusObj.txnId = `Transaction Id should be same from /${constants.SELECT} onwards`
      }
    } catch (error: any) {
      logger.info(
        `!!Error while comparing transaction ids for /${constants.SELECT} and /${constants.ON_STATUS} api, ${error.stack}`,
      )
    }

    const on_status = message.order
    try {
      logger.info(`Comparing order Id in /${constants.ON_CONFIRM} and /${constants.ON_STATUS}_${state}`)
      if (on_status.id != getValue('cnfrmOrdrId')) {
        logger.info(`Order id (/${constants.ON_STATUS}_${state}) mismatches with /${constants.CONFIRM})`)
        onStatusObj.onStatusOdrId = `Order id in /${constants.CONFIRM} and /${constants.ON_STATUS}_${state} do not match`
      }
    } catch (error) {
      logger.info(
        `!!Error while comparing order id in /${constants.ON_STATUS}_${state} and /${constants.CONFIRM}`,
        error,
      )
    }

    try {
      logger.info(`Validating order state`)
      if (on_status.state !== 'Accepted') {
        onStatusObj[`order_state`] =
          `Order state should be accepted whenever Status is being sent 'Accepted'. Current state: ${on_status.state}`
      }
    } catch (error: any) {
      logger.error(`Error while validating order state, ${error.stack}`)
    }

    try {
      if (!_.isEqual(getValue(`cnfrmTmpstmp`), on_status.created_at)) {
        onStatusObj.tmpstmp = `Created At timestamp for /${constants.ON_STATUS}_${state} should be equal to context timestamp at ${constants.CONFIRM}`
      }
    } catch (error: any) {
      logger.error(`!!Error occurred while comparing timestamp for /${constants.ON_STATUS}_${state}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing timestamp of /${constants.ON_CONFIRM} and /${constants.ON_STATUS}_${state} API`)
      if (_.gte(getValue('onCnfrmtmpstmp'), context.timestamp)) {
        onStatusObj.tmpstmp1 = `Timestamp for /${constants.ON_CONFIRM} api cannot be greater than or equal to /${constants.ON_STATUS}_${state} api`
      }
      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.error(`!!Error occurred while comparing timestamp for /${constants.ON_STATUS}_${state}, ${error.stack}`)
    }

    const contextTime = context.timestamp
    try {
      logger.info(`Comparing order.updated_at and context timestamp for /${constants.ON_STATUS}_${state} API`)

      if (!areTimestampsLessThanOrEqualTo(on_status.updated_at, contextTime)) {
        onStatusObj.tmpstmp2 = `order.updated_at timestamp should be less than or eqaul to  context timestamp for /${constants.ON_STATUS}_${state} api`
      }
    } catch (error: any) {
      logger.error(
        `!!Error occurred while comparing order updated at for /${constants.ON_STATUS}_${state}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Checking if transaction_id is present in message.order.payment`)
      const payment = on_status.payment
      const status = payment_status(payment)
      if (!status) {
        onStatusObj['message/order/transaction_id'] = `Transaction_id missing in message/order/payment`
      }
    } catch (err: any) {
      logger.error(`Error while checking transaction is in message.order.payment`)
    }

    return onStatusObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_STATUS} API`, err)
  }
}
