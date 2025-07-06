/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { ApiSequence, ROUTING_ENUMS, PAYMENT_STATUS} from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty, checkContext, areTimestampsLessThanOrEqualTo, compareFulfillmentObject } from '../..'
import { getValue, setValue } from '../../../shared/dao'
import { FLOW } from '../../enum'

export const checkOnStatusAtPickup = (data: any, state: string, msgIdSet: any, fulfillmentsItemsSet: any) => {
  const onStatusObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.ON_STATUS_AT_PICKUP]: 'JSON cannot be empty' }
    }
    const flow = getValue('flow')
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

    try {
      logger.info(`Adding Message Id /${constants.ON_STATUS_AT_PICKUP}`)
      if (msgIdSet.has(context.message_id)) {
        onStatusObj[`${ApiSequence.ON_STATUS_AT_PICKUP}_msgId`] = `Message id should not be same with previous calls`
      }
      msgIdSet.add(context.message_id)
    } catch (error: any) {
      logger.error(`!!Error while checking message id for /${constants.ON_STATUS_AT_PICKUP}, ${error.stack}`)
    }

    if (!_.isEqual(data.context.domain.split(':')[1], getValue(`domain`))) {
      onStatusObj[`Domain[${data.context.action}]`] = `Domain should be same in each action`
    }

    setValue(`${ApiSequence.ON_STATUS_AT_PICKUP}`, data)

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
      logger.info(`Comparing timestamp of /${constants.ON_STATUS}_picked and /${constants.ON_STATUS}_${state} API`)
      if (_.gte(getValue('tmpstmp'), context.timestamp)) {
        onStatusObj.inVldTmstmp = `Timestamp in previous /${constants.ON_STATUS} api cannot be greater than or equal to /${constants.ON_STATUS}_${state} api`
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

    try {
      // For Delivery Object
      const DELobj = _.filter(on_status.fulfillments, { type: 'Delivery' })
      if (!DELobj.length) {
        logger.error(`Delivery object is mandatory for ${ApiSequence.ON_STATUS_AT_PICKUP}`)
        const key = `missingDelivery`
        onStatusObj[key] = `Delivery object is mandatory for ${ApiSequence.ON_STATUS_AT_PICKUP}`
      } else {
        const deliveryObj = DELobj[0]
        if (!deliveryObj.tags) {
          const key = `missingTags`
          onStatusObj[key] = `Tags are mandatory in Delivery Fulfillment for ${ApiSequence.ON_STATUS_AT_PICKUP}`
        }
        else {
          const tags = deliveryObj.tags
          const routingTagArr = _.filter(tags, { code: 'routing' })
          if (!routingTagArr.length) {
            const key = `missingRouting/Tag`
            onStatusObj[key] = `RoutingTag object is mandatory in Tags of Delivery Object for ${ApiSequence.ON_STATUS_AT_PICKUP}`
          }
          else {
            const routingTag = routingTagArr[0]
            const routingTagList = routingTag.list
            if (!routingTagList) {
              const key = `missingRouting/Tag/List`
              onStatusObj[key] = `RoutingTagList is mandatory in RoutingTag of Delivery Object for ${ApiSequence.ON_STATUS_AT_PICKUP}`
            }
            else {
              const routingTagTypeArr = _.filter(routingTagList, { code: 'type' })
              if (!routingTagTypeArr.length) {
                const key = `missingRouting/Tag/List/Type`
                onStatusObj[key] = `RoutingTagListType object is mandatory in RoutingTag/List of Delivery Object for ${ApiSequence.ON_STATUS_AT_PICKUP}`
              }
              else {
                const routingTagType = routingTagTypeArr[0]
                if (!ROUTING_ENUMS.includes(routingTagType.value)) {
                  const key = `missingRouting/Tag/List/Type/Value`;
                  onStatusObj[key] = `RoutingTagListType Value is mandatory in RoutingTag of Delivery Object for ${ApiSequence.ON_STATUS_AT_PICKUP} and should be equal to 'P2P' or 'P2H2P'`;
                }
              }
            }
          }
        }
      }
    } catch (error: any) {
      logger.error(`Error while checking Fulfillments Delivery Obj in /${ApiSequence.ON_STATUS_AT_PICKUP}, ${error.stack}`)
    }

    const contextTime = context.timestamp
    try {
      logger.info(`Comparing order.updated_at and context timestamp for /${constants.ON_STATUS}_${state} API`)
      if (!_.isEqual(on_status.created_at, getValue(`cnfrmTmpstmp`))) {
        onStatusObj.tmpstmp = `Created At timestamp for /${constants.ON_STATUS}_${state} should be equal to context timestamp at ${constants.CONFIRM}`
      }

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
      if (on_status.state != 'In-progress') {
        onStatusObj.ordrState = `order/state should be "In-progress" for /${constants.ON_STATUS}_${state}`
      }
    } catch (error: any) {
      logger.error(`!!Error while checking order state in /${constants.ON_STATUS}_${state} Error: ${error.stack}`)
    }

     try {
          if (flow === FLOW.FLOW012) {
            logger.info('Payment status check in on status picked call')
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
          onStatusObj[key] = `missingFulfillments is mandatory for ${ApiSequence.ON_STATUS_AT_PICKUP}`
        }
        else {
          fulfillments.forEach((ff: any) => {
            if (ff.type == "Delivery") {
              setValue("deliveryTmpStmp", ff?.start?.time?.timestamp)
            }
          });
          let i: number = 0
          fulfillmentsItemsSet.forEach((obj1: any) => {
            const keys = Object.keys(obj1)

            let obj2: any = _.filter(fulfillments, { type: `${obj1.type}` })
            let apiSeq = obj1.type === "Cancel" ? ApiSequence.ON_UPDATE_PART_CANCEL : (getValue('onCnfrmState') === "Accepted" ? (ApiSequence.ON_CONFIRM) : (ApiSequence.ON_STATUS_PENDING))
            if (obj2.length > 0) {
              obj2 = obj2[0]
              if (obj2.type == "Delivery") {
                delete obj2?.start?.instructions
                delete obj2?.end?.instructions
                delete obj2?.agent
                delete obj2?.start?.time?.timestamp
                delete obj2?.tags
                delete obj2?.state
              }
              apiSeq = obj2.type === "Cancel" ? ApiSequence.ON_UPDATE_PART_CANCEL : (getValue('onCnfrmState') === "Accepted" ? (ApiSequence.ON_CONFIRM) : (ApiSequence.ON_STATUS_PENDING))
              const errors = compareFulfillmentObject(obj1, obj2, keys, i, apiSeq)
              if (errors.length > 0) {
                errors.forEach((item: any) => {
                  onStatusObj[item.errKey] = item.errMsg
                })
              }
            }
            else {
              onStatusObj[`message/order.fulfillments/${i}`] = `Missing fulfillment type '${obj1.type}' in ${ApiSequence.ON_STATUS_AT_PICKUP} as compared to ${apiSeq}`
            }
            i++
          });
        }

      } catch (error: any) {
        logger.error(`Error while checking Fulfillments Delivery Obj in /${ApiSequence.ON_STATUS_AT_PICKUP}, ${error.stack}`)
      }
    }

    return onStatusObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_STATUS} API`, err)
  }
}
