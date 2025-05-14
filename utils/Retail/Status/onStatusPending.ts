/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { ApiSequence, PAYMENT_STATUS } from '../../../constants'
import { logger } from '../../../shared/logger'
import { FLOW } from '../../../utils/enum'
import {
  validateSchema,
  isObjectEmpty,
  checkContext,
  areTimestampsLessThanOrEqualTo,
  payment_status,
  compareTimeRanges,
} from '../..'
import { getValue, setValue } from '../../../shared/dao'

export const checkOnStatusPending = (data: any, state: string, msgIdSet: any, fulfillmentsItemsSet: any) => {
  const onStatusObj: any = {}
  try {
    const onConfirmOrderState = getValue('onCnfrmState')
    if (!data || isObjectEmpty(data)) {
      if (onConfirmOrderState === "Accepted")
        return
      return { [ApiSequence.ON_STATUS_PENDING]: 'JSON cannot be empty' }
    }
    const flow = getValue('flow')
    const { message, context }: any = data
    if (!message || !context || isObjectEmpty(message)) {
      if (onConfirmOrderState === "Accepted")
        return
      return { missingFields: '/context, /message, is missing or empty' }
    }

    if (onConfirmOrderState === "Accepted")
      return { errmsg: "When the onConfirm Order State is 'Accepted', the on_status_pending is not required!" }

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

    try {
      logger.info(`Adding Message Id /${constants.ON_STATUS_PENDING}`)
      if (msgIdSet.has(context.message_id)) {
        onStatusObj[`${ApiSequence.ON_STATUS_PENDING}_msgId`] = `Message id should not be same with previous calls`
      }
      msgIdSet.add(context.message_id)
    } catch (error: any) {
      logger.error(`!!Error while checking message id for /${constants.ON_STATUS_PENDING}, ${error.stack}`)
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
      // Checking fulfillment.id, fulfillment.type and tracking
      logger.info('Checking fulfillment.id, fulfillment.type and tracking')
      on_status.fulfillments.forEach((ff: any) => {
        let ffId = ''

        if (!ff.id) {
          logger.info(`Fulfillment Id must be present `)
          onStatusObj['ffId'] = `Fulfillment Id must be present`
        }

        ffId = ff.id
        if (ff.type != "Cancel") {
          if (getValue(`${ffId}_tracking`)) {
            if (ff.tracking === false || ff.tracking === true) {
              if (getValue(`${ffId}_tracking`) != ff.tracking) {
                logger.info(`Fulfillment Tracking mismatch with the ${constants.ON_SELECT} call`)
                onStatusObj['ffTracking'] = `Fulfillment Tracking mismatch with the ${constants.ON_SELECT} call`
              }
            } else {
              logger.info(`Tracking must be present for fulfillment ID: ${ff.id} in boolean form`)
              onStatusObj['ffTracking'] = `Tracking must be present for fulfillment ID: ${ff.id} in boolean form`
            }
          }
        }
      })
    } catch (error: any) {
      logger.info(`Error while checking fulfillments id, type and tracking in /${constants.ON_STATUS}`)
    }

    try {
      logger.info(`Storing delivery fulfillment if not present in ${constants.ON_CONFIRM} and comparing if present`)
      const storedFulfillment = getValue(`deliveryFulfillment`)
      const deliveryFulfillment = on_status.fulfillments.filter((fulfillment: any) => fulfillment.type === 'Delivery')
      if (storedFulfillment == 'undefined') {
        setValue('deliveryFulfillment', deliveryFulfillment[0])
        setValue('deliveryFulfillmentAction', ApiSequence.ON_STATUS_PENDING)
      } else {
        const storedFulfillmentAction = getValue('deliveryFulfillmentAction')
        const fulfillmentRangeerrors = compareTimeRanges(storedFulfillment, storedFulfillmentAction, deliveryFulfillment[0], ApiSequence.ON_STATUS_PENDING)

        if (fulfillmentRangeerrors) {
          let i = 0
          const len = fulfillmentRangeerrors.length
          while (i < len) {
            const key = `fulfilmntRngErr${i}`
            onStatusObj[key] = `${fulfillmentRangeerrors[i]}`
            i++
          }
        }
      }
    } catch (error: any) {
      logger.error(`Error while Storing delivery fulfillment, ${error.stack}`)
    }

    try {
      logger.info(`Validating order state`)
      setValue('orderState', on_status.state)
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
      const status = payment_status(payment, flow)
      if (!status) {
        onStatusObj['message/order/transaction_id'] = `Transaction_id missing in message/order/payment`
      }
    } catch (err: any) {
      logger.error(`Error while checking transaction is in message.order.payment`)
    }
    try {
      if (flow === FLOW.FLOW012) {
        logger.info('Payment status check in on status pending call')
        const payment = on_status.payment
        if (payment.status !== PAYMENT_STATUS.NOT_PAID) {
          logger.error(`Payment status should be ${PAYMENT_STATUS.NOT_PAID} for ${FLOW.FLOW012} flow (Cash on Delivery)`);
          onStatusObj.pymntstatus = `Payment status should be ${PAYMENT_STATUS.NOT_PAID} for ${FLOW.FLOW012} flow (Cash on Delivery)`
        }
      }
    } catch (err: any) {
      logger.error('Error while checking payment in message/order/payment: ' + err.message);
    }
    if (flow === '6' || flow === '2' || flow === '3' || flow === '5') {
      try {
        // For Delivery Object
        const fulfillments = on_status.fulfillments
        if (!fulfillments.length) {
          const key = `missingFulfillments`
          onStatusObj[key] = `missingFulfillments is mandatory for ${ApiSequence.ON_STATUS_PENDING}`
        }
        else {
          const deliveryObjArr = _.filter(fulfillments, { type: "Delivery" })
          if (!deliveryObjArr.length) {
            onStatusObj[`message/order.fulfillments/`] = `Delivery fullfillment must be present in ${ApiSequence.ON_STATUS_PENDING}`
          }
          else {
            const deliverObj = deliveryObjArr[0]
            delete deliverObj?.state
            delete deliverObj?.tags
            delete deliverObj?.start?.instructions
            delete deliverObj?.end?.instructions
            fulfillmentsItemsSet.add(deliverObj)
          }
        }

      } catch (error: any) {
        logger.error(`Error while checking Fulfillments Delivery Obj in /${ApiSequence.ON_STATUS_PENDING}, ${error.stack}`)
      }
    }

    return onStatusObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_STATUS} API`, err)
  }
}