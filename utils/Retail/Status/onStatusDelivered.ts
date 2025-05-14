/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { ApiSequence, ROUTING_ENUMS, PAYMENT_STATUS } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty, checkContext, areTimestampsLessThanOrEqualTo, compareTimeRanges, compareFulfillmentObject } from '../..'
import { getValue, setValue } from '../../../shared/dao'
import { FLOW } from '../../../utils/enum'

export const checkOnStatusDelivered = (data: any, state: string, msgIdSet: any, fulfillmentsItemsSet: any) => {
  const onStatusObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.ON_STATUS_DELIVERED]: 'JSON cannot be empty' }
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

    try {
      logger.info(`Adding Message Id /${constants.ON_STATUS_DELIVERED}`)
      if (msgIdSet.has(context.message_id)) {
        onStatusObj[`${ApiSequence.ON_STATUS_DELIVERED}_msgId`] = `Message id should not be same with previous calls`
      }
      msgIdSet.add(context.message_id)
    } catch (error: any) {
      logger.error(`!!Error while checking message id for /${constants.ON_STATUS_DELIVERED}, ${error.stack}`)
    }

    if (!contextRes?.valid) {
      Object.assign(onStatusObj, contextRes.ERRORS)
    }

    setValue(`${ApiSequence.ON_STATUS_DELIVERED}`, data)

    if (!_.isEqual(data.context.domain.split(':')[1], getValue(`domain`))) {
      onStatusObj[`Domain[${data.context.action}]`] = `Domain should be same in each action`
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

    try {
      // For Delivery Object
      const DELobj = _.filter(on_status.fulfillments, { type: 'Delivery' })
      if (!DELobj.length) {
        logger.error(`Delivery object is mandatory for ${ApiSequence.ON_STATUS_DELIVERED}`)
        const key = `missingDelivery`
        onStatusObj[key] = `Delivery object is mandatory for ${ApiSequence.ON_STATUS_DELIVERED}`
      } else {
        const deliveryObj = DELobj[0]
        if (!deliveryObj.tags) {
          const key = `missingTags`
          onStatusObj[key] = `Tags are mandatory in Delivery Fulfillment for ${ApiSequence.ON_STATUS_DELIVERED}`
        }
        else {
          const tags = deliveryObj.tags
          const routingTagArr = _.filter(tags, { code: 'routing' })
          if (!routingTagArr.length) {
            const key = `missingRouting/Tag`
            onStatusObj[key] = `RoutingTag object is mandatory in Tags of Delivery Object for ${ApiSequence.ON_STATUS_DELIVERED}`
          }
          else {
            const routingTag = routingTagArr[0]
            const routingTagList = routingTag.list
            if (!routingTagList) {
              const key = `missingRouting/Tag/List`
              onStatusObj[key] = `RoutingTagList is mandatory in RoutingTag of Delivery Object for ${ApiSequence.ON_STATUS_DELIVERED}`
            }
            else {
              const routingTagTypeArr = _.filter(routingTagList, { code: 'type' })
              if (!routingTagTypeArr.length) {
                const key = `missingRouting/Tag/List/Type`
                onStatusObj[key] = `RoutingTagListType object is mandatory in RoutingTag/List of Delivery Object for ${ApiSequence.ON_STATUS_DELIVERED}`
              }
              else {
                const routingTagType = routingTagTypeArr[0]
                if (!ROUTING_ENUMS.includes(routingTagType.value)) {
                  const key = `missingRouting/Tag/List/Type/Value`;
                  onStatusObj[key] = `RoutingTagListType Value is mandatory in RoutingTag of Delivery Object for ${ApiSequence.ON_STATUS_DELIVERED} and should be equal to 'P2P' or 'P2H2P'`;
                }
              }
            }
          }
        }
      }
    } catch (error: any) {
      logger.error(`Error while checking Fulfillments Delivery Obj in /${ApiSequence.ON_STATUS_PICKED}, ${error.stack}`)
    }
    try {
      // For Delivery Object
      const DELobj = _.filter(on_status.fulfillments, { type: 'Delivery' })
      if (!DELobj.length) {
        logger.error(`Delivery object is mandatory for ${ApiSequence.ON_STATUS_DELIVERED}`)
        const key = `missingDelivery`
        onStatusObj[key] = `Delivery object is mandatory for ${ApiSequence.ON_STATUS_DELIVERED}`
      } else {
        const deliveryObj = DELobj[0]
        if (!deliveryObj.tags) {
          const key = `missingTags`
          onStatusObj[key] = `Tags are mandatory in Delivery Fulfillment for ${ApiSequence.ON_STATUS_DELIVERED}`
        }
        else {
          const tags = deliveryObj.tags
          const routingTagArr = _.filter(tags, { code: 'routing' })
          if (!routingTagArr.length) {
            const key = `missingRouting/Tag`
            onStatusObj[key] = `RoutingTag object is mandatory in Tags of Delivery Object for ${ApiSequence.ON_STATUS_DELIVERED}`
          }
          else {
            const routingTag = routingTagArr[0]
            const routingTagList = routingTag.list
            if (!routingTagList) {
              const key = `missingRouting/Tag/List`
              onStatusObj[key] = `RoutingTagList is mandatory in RoutingTag of Delivery Object for ${ApiSequence.ON_STATUS_DELIVERED}`
            }
            else {
              const routingTagTypeArr = _.filter(routingTagList, { code: 'type' })
              if (!routingTagTypeArr.length) {
                const key = `missingRouting/Tag/List/Type`
                onStatusObj[key] = `RoutingTagListType object is mandatory in RoutingTag/List of Delivery Object for ${ApiSequence.ON_STATUS_DELIVERED}`
              }
              else {
                const routingTagType = routingTagTypeArr[0]
                if (!ROUTING_ENUMS.includes(routingTagType.value)) {
                  const key = `missingRouting/Tag/List/Type/Value`;
                  onStatusObj[key] = `RoutingTagListType Value is mandatory in RoutingTag of Delivery Object for ${ApiSequence.ON_STATUS_DELIVERED} and should be equal to 'P2P' or 'P2H2P'`;
                }
              }
            }
          }
        }
      }
    } catch (error: any) {
      logger.error(`Error while checking Fulfillments Delivery Obj in /${ApiSequence.ON_STATUS_PICKED}, ${error.stack}`)
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
      if (!_.isEqual(on_status.created_at, getValue('cnfrmTmpstmp'))) {
        onStatusObj.tmpstmp = `Created At timestamp for /${constants.ON_STATUS}_${state} should be equal to context timestamp at ${constants.CONFIRM}`
      }
    } catch (error: any) {
      logger.error(`!!Error occurred while comparing timestamp for /${constants.ON_STATUS}_${state}, ${error.stack}`)
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
      logger.info(`comparing fulfillment ranges `)
      const storedFulfillment = getValue(`deliveryFulfillment`)
      const deliveryFulfillment = on_status.fulfillments.filter((fulfillment: any) => fulfillment.type === 'Delivery')
      const storedFulfillmentAction = getValue('deliveryFulfillmentAction')
      const fulfillmentRangeerrors = compareTimeRanges(storedFulfillment, storedFulfillmentAction, deliveryFulfillment[0], ApiSequence.ON_STATUS_DELIVERED)
      if (fulfillmentRangeerrors) {
        let i = 0
        const len = fulfillmentRangeerrors.length
        while (i < len) {
          const key = `fulfilmntRngErr${i}`
          onStatusObj[key] = `${fulfillmentRangeerrors[i]}`
          i++
        }
      }
    } catch (error: any) {
      logger.error(`Error while comparing fulfillment ranges , ${error.stack}`)
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
                  onStatusObj.deliveryTime = `delivery timestamp should be less than or equal to context/timestamp and can't be future dated as this on_status is sent after the the product is delivered; as delivery timestamp is ${deliveryTime} and context timestamp is ${contextTime}`
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

      if (!orderDelivered) {
        onStatusObj.noOrdrDelivered = `fulfillments/state should be ${constants.ORDER_DELIVERED} for /${constants.ON_STATUS}_${constants.ORDER_DELIVERED}`
      }
    } catch (error) {
      logger.info(`Error while checking delivery timestamp in /${constants.ON_STATUS}_${state}.json`)
    }
    try {
      if (flow === FLOW.FLOW012) {
        logger.info('Payment status check in on status delivered call')
        const payment = on_status.payment
        if (payment.status == PAYMENT_STATUS.NOT_PAID) {
          logger.error(`Payment status should be ${PAYMENT_STATUS.PAID} for ${FLOW.FLOW012} flow (Item has been delivered in this state!)`);
          onStatusObj.pymntstatus = `Payment status should be ${PAYMENT_STATUS.PAID} for ${FLOW.FLOW012} flow since Item has been delivered in this state (Cash on Delivery)`
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
          onStatusObj[key] = `missingFulfillments is mandatory for ${ApiSequence.ON_STATUS_DELIVERED}`
        }
        else {
          const fulfillmentsItemsStatusSet = new Set()
          fulfillments.forEach((ff: any, i: number) => {
            if (ff.type == "Delivery" && !_.isEqual(ff?.start?.time?.timestamp, getValue("deliveryTmpStmp"))) {
              onStatusObj[`message/order.fulfillments/${i}`] = `Mismatch occur while comparing ${ff.type} fulfillment start timestamp with the ${ApiSequence.ON_STATUS_PICKED}`
            }
            fulfillmentsItemsStatusSet.add(JSON.stringify(ff))
          });
          let i: number = 0
          fulfillmentsItemsSet.forEach((obj1: any) => {
            const keys = Object.keys(obj1)

            let obj2: any = _.filter(fulfillments, { type: `${obj1.type}` })
            let apiSeq = obj1.type === "Cancel" ? ApiSequence.ON_UPDATE_PART_CANCEL : (getValue('onCnfrmState') === "Accepted" ? (ApiSequence.ON_CONFIRM) : (ApiSequence.ON_STATUS_PENDING))
            if (obj2.length > 0) {
              obj2 = obj2[0]
              if (obj2.type == "Delivery") {
                delete obj2?.tags
                delete obj2?.agent
                delete obj2?.start?.instructions
                delete obj2?.end?.instructions
                delete obj2?.start?.time?.timestamp
                delete obj2?.end?.time?.timestamp
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
              onStatusObj[`message/order.fulfillments/${i}`] = `Missing fulfillment type '${obj1.type}' in ${ApiSequence.ON_STATUS_DELIVERED} as compared to ${apiSeq}`
            }
            i++
          });
          fulfillmentsItemsSet.clear();
          fulfillmentsItemsStatusSet.forEach((ff: any) => {
            const obj: any = JSON.parse(ff)
            delete obj?.state
            delete obj?.start?.time
            delete obj?.end?.time
            fulfillmentsItemsSet.add(obj)
          })
        }

      } catch (error: any) {
        logger.error(`Error while checking Fulfillments Delivery Obj in /${ApiSequence.ON_STATUS_DELIVERED}, ${error.stack}`)
      }
    }

    return onStatusObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_STATUS} API`, err)
  }
}
