/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { ApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty, checkContext, areTimestampsLessThanOrEqualTo } from '../..'
import { getValue, setValue } from '../../../shared/dao'
import { checkFulfillmentID } from '../../index'

export const checkOnStatusDelivered = (data: any, state: string) => {
  const onStatusObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.ON_STATUS_DELIVERED]: 'JSON cannot be empty' }
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

    setValue(`${ApiSequence.ON_STATUS_DELIVERED}`, data)

    const picked_message_id: string | null = getValue('picked_message_id')
    const pending_message_id: string | null = getValue('pending_message_id')
    const delivered_message_id: string = context.message_id

    try {
      logger.info(
        `Comparing message_id for unsolicited calls for ${constants.ON_STATUS}.pending and ${constants.ON_STATUS}.picked and ${constants.ON_STATUS}.delivered`,
      )
      if (delivered_message_id === picked_message_id || delivered_message_id === pending_message_id) {
        logger.error(
          `Message_id for ${constants.ON_STATUS}.delivered cannot be same as ${constants.ON_STATUS}.picked or  ${constants.ON_STATUS}.pending`,
        )
        onStatusObj['invalid_message_id_delivered'] =
          `Message_id cannot be same for ${constants.ON_STATUS}.delivered and ${constants.ON_STATUS}.picked and ${constants.ON_STATUS}.pending `
      }
    } catch (error: any) {
      logger.error(
        `Error while comparing message_id for ${constants.ON_STATUS}.pending and ${constants.ON_STATUS}.picked and ${constants.ON_STATUS}.delivered`,
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
      logger.info(
        `Comparing timestamp of /${constants.ON_STATUS}_OutForDelivery and /${constants.ON_STATUS}_${state} API`,
      )
      if (_.gte(getValue('tmstmp'), context.timestamp)) {
        onStatusObj.inVldTmstmp = `Timestamp for /${constants.ON_STATUS}_OutForDelivery api cannot be greater than or equal to /${constants.ON_STATUS}_${state} api`
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.error(`!!Error occurred while comparing timestamp for /${constants.ON_STATUS}_${state}, ${error.stack}`)
    }
    try {
      logger.info(`Comparing timestamp of /${constants.ON_CONFIRM} and /${constants.ON_STATUS}_${state} API`)
      if (_.gte(getValue('onCnfrmtmpstmp'), context.timestamp)) {
        onStatusObj.tmpstmp1 = `Timestamp for /${constants.ON_CONFIRM} api cannot be greater than or equal to /${constants.ON_STATUS}_${state} api`
      }
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
      logger.info(`Checking order state in /${constants.ON_STATUS}_${state}`)
      if (on_status.state != 'Completed') {
        onStatusObj.ordrState = `order/state should be "Completed" for /${constants.ON_STATUS}_${state}`
      }
    } catch (error) {
      logger.error(`!!Error while checking order state in /${constants.ON_STATUS}_${state}`)
    }

    try {
      logger.info(`Checking delivery timestamp in /${constants.ON_STATUS}_${state}`)
      const noOfFulfillments = on_status.fulfillments.length
      let orderDelivered = false
      let i = 0
      const deliveryTimestamps: any = {}

      while (i < noOfFulfillments) {
        const fulfillment = on_status.fulfillments[i]
        const ffState = fulfillment.state.descriptor.code

        //type should be Delivery
        if (fulfillment.type != 'Delivery') {
          i++
          continue
        }

        if (ffState === constants.ORDER_DELIVERED) {
          orderDelivered = true
          const pickUpTime = fulfillment.start.time.timestamp
          const deliveryTime = fulfillment.end.time.timestamp
          deliveryTimestamps[fulfillment.id] = deliveryTime
          try {
            //checking delivery time exists or not
            if (!deliveryTime) {
              onStatusObj.deliverytime = `delivery timestamp is missing`
            } else {
              try {
                //checking delivery time matching with context timestamp
                if (!_.lte(deliveryTime, contextTime)) {
                  onStatusObj.deliveryTime = `delivery timestamp should match context/timestamp and can't be future dated; as delivery timestamp is ${deliveryTime} and context timestamp is ${contextTime}`
                }
              } catch (error) {
                logger.error(
                  `!!Error while checking delivery time matching with context timestamp in /${constants.ON_STATUS}_${state}`,
                  error,
                )
              }
              try {
                //checking delivery time and pickup time
                if (_.gte(pickUpTime, deliveryTime)) {
                  onStatusObj.delPickTime = `delivery timestamp (/end/time/timestamp) can't be less than or equal to the pickup timestamp (start/time/timestamp)`
                }
              } catch (error) {
                logger.error(
                  `!!Error while checking delivery time and pickup time in /${constants.ON_STATUS}_${state}`,
                  error,
                )
              }

              try {
                //checking order/updated_at timestamp
                if (!_.gte(on_status.updated_at, deliveryTime)) {
                  onStatusObj.updatedAt = `order/updated_at timestamp can't be less than the delivery time`
                }

                if (!_.gte(contextTime, on_status.updated_at)) {
                  onStatusObj.updatedAtTime = `order/updated_at timestamp can't be future dated (should match context/timestamp)`
                }
              } catch (error) {
                logger.info(
                  `!!Error while checking order/updated_at timestamp in /${constants.ON_STATUS}_${state}`,
                  error,
                )
              }
            }
          } catch (error) {
            logger.error(`!!Error delivery timestamp is missing /${constants.ON_STATUS}_${state}`, error)
          }
        }

        i++
      }

      if (!orderDelivered) {
        onStatusObj.noOrdrDelivered = `fulfillments/state should be ${constants.ORDER_DELIVERED} for /${constants.ON_STATUS}_${constants.ORDER_DELIVERED}`
      }
    } catch (error) {
      logger.info(`Error while checking delivery timestamp in /${constants.ON_STATUS}_${state}.json`)
    }

    // Checking fullfillment IDs for items
    try {
      logger.info(`Comparing fulfillmentID for items at /${constants.ON_STATUS}_delivery`)
      const items = on_status.items
      const flow = constants.ON_STATUS + '_delivery'
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
