/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { ApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty, checkContext, areTimestampsLessThanOrEqualTo } from '../..'
import { getValue, setValue } from '../../../shared/dao'

const startTimestampReq = ['Order-picked-up', 'Out-for-delivery', 'Order-delivered']

export const checkOnStatusPicked = (data: any, state: string) => {
  const onStatusObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.ON_STATUS_PICKED]: 'Json cannot be empty' }
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

    setValue(`${ApiSequence.ON_STATUS_PICKED}`, data)

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

    const on_status = message.order
    try {
      logger.info(`Comparing order Id in /${constants.RET_ONCONFIRM} and /${constants.RET_ONSTATUS}_${state}`)
      if (on_status.id != getValue('cnfrmOrdrId')) {
        logger.info(`Order id (/${constants.RET_ONSTATUS}_${state}) mismatches with /${constants.RET_CONFIRM})`)
        onStatusObj.onStatusOdrId = `Order id in /${constants.RET_CONFIRM} and /${constants.RET_ONSTATUS}_${state} do not match`
      }
    } catch (error) {
      logger.info(
        `!!Error while comparing order id in /${constants.RET_ONSTATUS}_${state} and /${constants.RET_CONFIRM}`,
        error,
      )
    }

    try {
      logger.info(`Comparing timestamp of /${constants.RET_ONCONFIRM} and /${constants.RET_ONSTATUS}_${state} API`)
      if (_.gte(getValue('tmstmp'), context.timestamp)) {
        onStatusObj.tmpstmp1 = `Timestamp for /${constants.RET_ONCONFIRM} api cannot be greater than or equal to /${constants.RET_ONSTATUS}_${state} api`
      }

      setValue('tmpstmp', on_status.context.timestamp)
    } catch (error: any) {
      logger.error(`!!Error occurred while comparing timestamp for /${constants.RET_ONSTATUS}_${state}, ${error.stack}`)
    }

    const contextTime = context.timestamp
    try {
      logger.info(`Comparing order.updated_at and context timestamp for /${constants.RET_ONSTATUS}_${state} API`)

      if (!areTimestampsLessThanOrEqualTo(on_status.updated_at, contextTime)) {
        onStatusObj.tmpstmp2 = ` order.updated_at timestamp should be less than or eqaul to  context timestamp for /${constants.RET_ONSTATUS}_${state} api`
      }
    } catch (error: any) {
      logger.error(
        `!!Error occurred while comparing order updated at for /${constants.RET_ONSTATUS}_${state}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Checking order state in /${constants.RET_ONSTATUS}_${state}`)
      if (on_status.state != 'In-progress') {
        onStatusObj.ordrState = `order/state should be "In-progress" for /${constants.RET_ONSTATUS}_${state}`
      }
    } catch (error: any) {
      logger.error(`!!Error while checking order state in /${constants.RET_ONSTATUS}_${state} Error: ${error.stack}`)
    }

    try {
      logger.info(`Checking timestamp of fulfillments/start/timestamp /${constants.RET_ONSTATUS}_${state}`)
      if (!startTimestampReq.includes(message.fulfillments.state.descriptor.code)) {
        console.log('====================================')
        console.log(startTimestampReq)
        console.log('====================================')
      }
    } catch (error) {
      logger.error(`!!Error while checking order state in /${constants.RET_ONSTATUS}_${state}`)
    }

    try {
      logger.info(`Checking pickup timestamp in /${constants.RET_ONSTATUS}_${state}`)
      const noOfFulfillments = on_status.fulfillments.length
      let orderPicked = false
      let i = 0
      const pickupTimestamps: any = {}

      while (i < noOfFulfillments) {
        const fulfillment = on_status.fulfillments[i]
        const ffState = fulfillment.state.descriptor.code

        console.log('fulfillment', fulfillment)
        //type should be Delivery
        if (fulfillment.type != 'Delivery') {
          i++
          continue
        }

        if (ffState === constants.ORDER_PICKED) {
          orderPicked = true
          const pickUpTime = fulfillment.start?.time.timestamp
          pickupTimestamps[fulfillment.id] = pickUpTime

          try {
            //checking pickup time matching with context timestamp
            if (!_.lte(pickUpTime, contextTime)) {
              onStatusObj.pickupTime = `pickup timestamp should match context/timestamp and can't be future dated`
            }
          } catch (error) {
            logger.error(
              `!!Error while checking pickup time matching with context timestamp in /${constants.RET_ONSTATUS}_${state}`,
              error,
            )
          }

          try {
            //checking order/updated_at timestamp
            if (!_.gte(on_status.updated_at, pickUpTime)) {
              onStatusObj.updatedAt = `order/updated_at timestamp can't be less than the pickup time`
            }

            if (!_.gte(contextTime, on_status.updated_at)) {
              onStatusObj.updatedAtTime = `order/updated_at timestamp can't be future dated (should match context/timestamp)`
            }
          } catch (error) {
            logger.error(
              `!!Error while checking order/updated_at timestamp in /${constants.RET_ONSTATUS}_${state}`,
              error,
            )
          }
        }

        i++
      }

      setValue('pickupTimestamps', pickupTimestamps)

      if (!orderPicked) {
        onStatusObj.noOrdrPicked = `fulfillments/state should be Order-picked-up for /${constants.RET_ONSTATUS}_${state}`
      }
    } catch (error: any) {
      logger.info(
        `Error while checking pickup timestamp in /${constants.RET_ONSTATUS}_${state}.json Error: ${error.stack}`,
      )
    }

    return onStatusObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.RET_ONSTATUS} API`, err)
  }
}
