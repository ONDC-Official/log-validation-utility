/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { ApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty, checkContext, areTimestampsLessThanOrEqualTo } from '../..'
import { getValue, setValue } from '../../../shared/dao'
import { checkFulfillmentID } from '../../index'

export const checkOnStatusOutForDelivery = (data: any, state: string, msgIdSet: any) => {
  const onStatusObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.ON_STATUS_OUT_FOR_DELIVERY]: 'JSON cannot be empty' }
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
    if (!msgIdSet.add(context.message_id)) {
      onStatusObj['messageId'] = 'message_id should be unique'
    }
    if (!contextRes?.valid) {
      Object.assign(onStatusObj, contextRes.ERRORS)
    }

    if (!_.isEqual(data.context.domain.split(':')[1], getValue(`domain`))) {
      onStatusObj[`Domain[${data.context.action}]`] = `Domain should be same in each action`
    }

    setValue(`${ApiSequence.ON_STATUS_OUT_FOR_DELIVERY}`, data)

    const packed_message_id: string | null = getValue('packed_message_id')
    const out_for_delivery_message_id: string = context.message_id

    setValue(`out_for_delivery_message_id`, out_for_delivery_message_id)

    try {
      logger.info(
        `Comparing message_id for unsolicited calls for ${constants.ON_STATUS}.packed and ${constants.ON_STATUS}.out_for_delivery`,
      )

      if (packed_message_id === out_for_delivery_message_id) {
        onStatusObj['invalid_message_id'] =
          `Message_id cannot be same for ${constants.ON_STATUS}.packed and ${constants.ON_STATUS}.out_for_delivery`
      }
    } catch (error: any) {
      logger.error(
        `Error while comparing message_id for ${constants.ON_STATUS}.packed and ${constants.ON_STATUS}.out_for_delivery`,
      )
    }

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
      logger.info(`Comparing timestamp of /${constants.ON_CONFIRM} and /${constants.ON_STATUS}_${state} API`)
      if (_.gte(getValue('onCnfrmtmpstmp'), context.timestamp)) {
        onStatusObj.tmpstmp1 = `Timestamp for /${constants.ON_CONFIRM} api cannot be greater than or equal to /${constants.ON_STATUS}_${state} api`
      }
    } catch (error: any) {
      logger.error(`!!Error occurred while comparing timestamp for /${constants.ON_STATUS}_${state}, ${error.stack}`)
    }
    try {
      logger.info(
        `Comparing timestamp of /${constants.ON_STATUS}_Out_for_delivery and /${constants.ON_STATUS}_${state} API`,
      )
      if (_.gte(getValue('tmstmp'), context.timestamp)) {
        onStatusObj.inVldTmstmp = `Timestamp for /${constants.ON_STATUS}_Out_for_delivery api cannot be greater than or equal to /${constants.ON_STATUS}_${state} api`
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.error(`!!Error occurred while comparing timestamp for /${constants.ON_STATUS}_${state}, ${error.stack}`)
    }

    const contextTime = context.timestamp
    try {
      logger.info(`Comparing order.updated_at and context timestamp for /${constants.ON_STATUS}_${state} API`)

      if (!areTimestampsLessThanOrEqualTo(on_status.updated_at, contextTime)) {
        onStatusObj.tmpstmp2 = ` order.updated_at timestamp should be less than or eqaul to  context timestamp for /${constants.ON_STATUS}_${state} api`
      }
    } catch (error: any) {
      logger.error(
        `!!Error occurred while comparing order updated at for /${constants.ON_STATUS}_${state}, ${error.stack}`,
      )
    }
    try {
      if (!_.isEqual(getValue(`cnfrmTmpstmp`), on_status.created_at)) {
        onStatusObj.tmpstmp = `Created At timestamp for /${constants.ON_STATUS}_${state} should be equal to context timestamp at ${constants.CONFIRM}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error occurred while comparing order created at for /${constants.ON_STATUS}_${state}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Checking order state in /${constants.ON_STATUS}_${state}`)
      if (on_status.state != 'In-progress') {
        onStatusObj.ordrState = `order/state should be "In-progress" for /${constants.ON_STATUS}_${state}`
      }
    } catch (error: any) {
      logger.error(`!!Error while checking order state in /${constants.ON_STATUS}_${state} Error: ${error.stack}`)
    }

    try {
      logger.info(`Checking Out_for_delivery timestamp in /${constants.ON_STATUS}_${state}`)
      const noOfFulfillments = on_status.fulfillments.length
      let orderOut_for_delivery = false
      let i = 0
      const outforDeliveryTimestamps: any = {}

      while (i < noOfFulfillments) {
        const fulfillment = on_status.fulfillments[i]
        const ffState = fulfillment.state.descriptor.code

        //type should be Delivery
        if (fulfillment.type != 'Delivery') {
          i++
          continue
        }

        if (ffState === constants.ORDER_OUT_FOR_DELIVERY) {
          orderOut_for_delivery = true
          const out_for_delivery_time = fulfillment.start.time.timestamp
          outforDeliveryTimestamps[fulfillment.id] = out_for_delivery_time
          if (!out_for_delivery_time) {
            onStatusObj.out_for_delivery_time = `Out_for_delivery timestamp is missing`
          } else {
            try {
              //checking out for delivery time matching with context timestamp
              if (!_.lte(out_for_delivery_time, contextTime)) {
                onStatusObj.out_for_delivery_time = `Fulfillments start timestamp should match context/timestamp and can't be future dated`
              }
            } catch (error) {
              logger.error(
                `!!Error while checking Out_for_delivery time matching with context timestamp in /${constants.ON_STATUS}_${state}`,
                error,
              )
            }

            try {
              //checking order/updated_at timestamp
              if (!_.gte(on_status.updated_at, out_for_delivery_time)) {
                onStatusObj.updatedAt = `order/updated_at timestamp can't be less than the Out_for_delivery time`
              }

              if (!_.gte(contextTime, on_status.updated_at)) {
                onStatusObj.updatedAtTime = `order/updated_at timestamp can't be future dated (should match context/timestamp)`
              }
            } catch (error) {
              logger.error(
                `!!Error while checking order/updated_at timestamp in /${constants.ON_STATUS}_${state}`,
                error,
              )
            }
          }
        }

        i++
      }

      setValue('outforDeliveryTimestamps', outforDeliveryTimestamps)

      if (!orderOut_for_delivery) {
        onStatusObj.noOrdrOut_for_delivery = `fulfillments/state Should be ${state} for /${constants.ON_STATUS}_${constants.ORDER_OUT_FOR_DELIVERY}`
      }
    } catch (error: any) {
      logger.info(
        `Error while checking out for delivery timestamp in /${constants.ON_STATUS}_${state}.json Error: ${error.stack}`,
      )
    }

    // Checking fullfillment IDs for items
    try {
      logger.info(`Comparing fulfillmentID for items at /${constants.ON_STATUS}_out_for_delivery`)
      const items = on_status.items
      const flow = constants.ON_STATUS + '_out_for_delivery'
      const err = checkFulfillmentID(items, onStatusObj, flow)
      Object.assign(onStatusObj, err)
    } catch (error: any) {
      logger.error(
        `!!Error occurred while checking for fulfillmentID for /${constants.ON_STATUS}_${state}, ${error.stack}`,
      )
    }

    return onStatusObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_STATUS} API`, err)
  }
}
