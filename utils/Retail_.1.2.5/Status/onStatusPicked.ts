/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { ApiSequence, ROUTING_ENUMS, PAYMENT_STATUS } from '../../../constants'
import { logger } from '../../../shared/logger'
import {
  validateSchemaRetailV2,
  isObjectEmpty,
  checkContext,
  areTimestampsLessThanOrEqualTo,
  compareTimeRanges,
  compareFulfillmentObject,
  getProviderId,
} from '../..'
import { getValue, setValue } from '../../../shared/dao'
import { FLOW } from '../../enum'
import { delivery_delay_reasonCodes } from '../../../constants/reasonCode'

export const checkOnStatusPicked = (data: any, state: string, msgIdSet: any, fulfillmentsItemsSet: any) => {
  const onStatusObj: any = {}
  const states: string[] = ['Order-picked-up', 'Order-delivered']
  try {
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.ON_STATUS_PICKED]: 'JSON cannot be empty' }
    }
    const flow = getValue('flow')
    const { message, context }: any = data
    if (!message || !context || isObjectEmpty(message)) {
      return { missingFields: '/context, /message, is missing or empty' }
    }

    const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
    const schemaValidation = validateSchemaRetailV2(context.domain.split(':')[1], constants.ON_STATUS, data)
    const contextRes: any = checkContext(context, constants.ON_STATUS)

    if (schemaValidation !== 'error') {
      Object.assign(onStatusObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(onStatusObj, contextRes.ERRORS)
    }

    try {
      logger.info(`Adding Message Id /${constants.ON_STATUS_PICKED}`)
      if (msgIdSet.has(context.message_id)) {
        onStatusObj[`${ApiSequence.ON_STATUS_PICKED}_msgId`] = `Message id should not be same with previous calls`
      }
      msgIdSet.add(context.message_id)
    } catch (error: any) {
      logger.error(`!!Error while checking message id for /${constants.ON_STATUS_PICKED}, ${error.stack}`)
    }

    if (!_.isEqual(data.context.domain.split(':')[1], getValue(`domain`))) {
      onStatusObj[`Domain[${data.context.action}]`] = `Domain should be same in each action`
    }

    setValue(`${ApiSequence.ON_STATUS_PICKED}`, data)

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
        logger.error(`Delivery object is mandatory for ${ApiSequence.ON_STATUS_PICKED}`)
        const key = `missingDelivery`
        onStatusObj[key] = `Delivery object is mandatory for ${ApiSequence.ON_STATUS_PICKED}`
      } else {
        const deliveryObj = DELobj[0]
        if (!deliveryObj.tags) {
          const key = `missingTags`
          onStatusObj[key] = `Tags are mandatory in Delivery Fulfillment for ${ApiSequence.ON_STATUS_PICKED}`
        } else {
          const tags = deliveryObj.tags
          const routingTagArr = _.filter(tags, { code: 'routing' })
          if (!routingTagArr.length) {
            const key = `missingRouting/Tag`
            onStatusObj[key] =
              `RoutingTag object is mandatory in Tags of Delivery Object for ${ApiSequence.ON_STATUS_PICKED}`
          } else {
            const routingTag = routingTagArr[0]
            const routingTagList = routingTag.list
            if (!routingTagList) {
              const key = `missingRouting/Tag/List`
              onStatusObj[key] =
                `RoutingTagList is mandatory in RoutingTag of Delivery Object for ${ApiSequence.ON_STATUS_PICKED}`
            } else {
              const routingTagTypeArr = _.filter(routingTagList, { code: 'type' })
              if (!routingTagTypeArr.length) {
                const key = `missingRouting/Tag/List/Type`
                onStatusObj[key] =
                  `RoutingTagListType object is mandatory in RoutingTag/List of Delivery Object for ${ApiSequence.ON_STATUS_PICKED}`
              } else {
                const routingTagType = routingTagTypeArr[0]
                if (!ROUTING_ENUMS.includes(routingTagType.value)) {
                  const key = `missingRouting/Tag/List/Type/Value`
                  onStatusObj[key] =
                    `RoutingTagListType Value is mandatory in RoutingTag of Delivery Object for ${ApiSequence.ON_STATUS_PICKED} and should be equal to 'P2P' or 'P2H2P'`
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
      logger.info(`Checking pickup timestamp in /${constants.ON_STATUS}_${state}`)
      const noOfFulfillments = on_status.fulfillments.length
      let orderPicked = false
      let i = 0
      const pickupTimestamps: any = {}

      while (i < noOfFulfillments) {
        const fulfillment = on_status.fulfillments[i]
        const ffState = fulfillment.state.descriptor.code

        //type should be Delivery
        if (fulfillment.type != 'Delivery') {
          i++
          continue
        }

        if (ffState === constants.ORDER_PICKED) {
          orderPicked = true
          const pickUpTime = fulfillment.start?.time.timestamp
          pickupTimestamps[fulfillment.id] = pickUpTime
          if (!pickUpTime) {
            onStatusObj.pickUpTime = `picked timestamp is missing`
          } else {
            try {
              //checking pickup time matching with context timestamp
              if (!_.lte(pickUpTime, contextTime)) {
                onStatusObj.pickupTime = `pickup timestamp should match context/timestamp and can't be future dated`
              }
            } catch (error) {
              logger.error(
                `!!Error while checking pickup time matching with context timestamp in /${constants.ON_STATUS}_${state}`,
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
                `!!Error while checking order/updated_at timestamp in /${constants.ON_STATUS}_${state}`,
                error,
              )
            }
          }
        }

        i++
      }

      try {
        logger.info(`Storing delivery fulfillment if not present in ${constants.ON_CONFIRM} and comparing if present`)
        const storedFulfillment = getValue(`deliveryFulfillment`)
        const deliveryFulfillment = on_status.fulfillments.filter((fulfillment: any) => fulfillment.type === 'Delivery')
        const { start, end } = deliveryFulfillment[0]
        const startRange = start.time.range
        const endRange = end.time.range

        if (!startRange || !endRange) {
          onStatusObj[
            `fulfillment.${[deliveryFulfillment.id]}.range`
          ]`Delivery fulfillment (${deliveryFulfillment.id}) has incomplete time range.`
        }
        if (storedFulfillment == 'undefined') {
          setValue('deliveryFulfillment', deliveryFulfillment[0])
          setValue('deliveryFulfillmentAction', ApiSequence.ON_STATUS_PICKED)
        } else {
          const storedFulfillmentAction = getValue('deliveryFulfillmentAction')
          const fulfillmentRangeerrors = compareTimeRanges(
            storedFulfillment,
            storedFulfillmentAction,
            deliveryFulfillment[0],
            ApiSequence.ON_STATUS_PICKED,
          )

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
        // Checking fulfillment.id, fulfillment.type and tracking
        logger.info('Checking fulfillment.id, fulfillment.type and tracking')
        on_status.fulfillments.forEach((ff: any) => {
          let ffId = ''

          if (!ff.id) {
            logger.info(`Fulfillment Id must be present `)
            onStatusObj['ffId'] = `Fulfillment Id must be present`
          }

          ffId = ff.id
          if (ff.type != 'Cancel') {
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

      setValue('pickupTimestamps', pickupTimestamps)

      if (!orderPicked) {
        onStatusObj.noOrdrPicked = `fulfillments/state should be ${constants.ORDER_PICKED} for /${constants.ON_STATUS}_${constants.ORDER_PICKED}`
      }
    } catch (error: any) {
      logger.info(
        `Error while checking pickup timestamp in /${constants.ON_STATUS}_${state}.json Error: ${error.stack}`,
      )
    }
    try {
      if (flow === FLOW.FLOW2A) {
        logger.info('Payment status check in on status picked call')
        const payment = on_status.payment
        if (payment.status !== PAYMENT_STATUS.NOT_PAID) {
          logger.error(`Payment status should be ${PAYMENT_STATUS.NOT_PAID} for ${FLOW.FLOW2A} flow (Cash on Delivery)`)
          onStatusObj.pymntstatus = `Payment status should be ${PAYMENT_STATUS.NOT_PAID} for ${FLOW.FLOW2A} flow (Cash on Delivery)`
        }
      }
    } catch (err: any) {
      logger.error('Error while checking payment in message/order/payment: ' + err.message)
    }

    if (flow === '6' || flow === '2' || flow === '3' || flow === '5') {
      try {
        // For Delivery Object
        const fulfillments = on_status.fulfillments
        if (!fulfillments.length) {
          const key = `missingFulfillments`
          onStatusObj[key] = `missingFulfillments is mandatory for ${ApiSequence.ON_STATUS_PICKED}`
        } else {
          fulfillments.forEach((ff: any) => {
            if (ff.type == 'Delivery') {
              setValue('deliveryTmpStmp', ff?.start?.time?.timestamp)
            }
          })
          let i: number = 0
          fulfillmentsItemsSet.forEach((obj1: any) => {
            const keys = Object.keys(obj1)

            let obj2: any = _.filter(fulfillments, { type: `${obj1.type}` })
            let apiSeq =
              obj1.type === 'Cancel'
                ? ApiSequence.ON_UPDATE_PART_CANCEL
                : getValue('onCnfrmState') === 'Accepted'
                  ? ApiSequence.ON_CONFIRM
                  : ApiSequence.ON_STATUS_PENDING
            if (obj2.length > 0) {
              obj2 = obj2[0]
              if (obj2.type == 'Delivery') {
                delete obj2?.start?.instructions
                delete obj2?.end?.instructions
                delete obj2?.agent
                delete obj2?.start?.time?.timestamp
                delete obj2?.tags
                delete obj2?.state
              }
              apiSeq =
                obj2.type === 'Cancel'
                  ? ApiSequence.ON_UPDATE_PART_CANCEL
                  : getValue('onCnfrmState') === 'Accepted'
                    ? ApiSequence.ON_CONFIRM
                    : ApiSequence.ON_STATUS_PENDING
              const errors = compareFulfillmentObject(obj1, obj2, keys, i, apiSeq)
              if (errors.length > 0) {
                errors.forEach((item: any) => {
                  onStatusObj[item.errKey] = item.errMsg
                })
              }
            } else {
              onStatusObj[`message/order.fulfillments/${i}`] =
                `Missing fulfillment type '${obj1.type}' in ${ApiSequence.ON_STATUS_PICKED} as compared to ${apiSeq}`
            }
            i++
          })
        }
      } catch (error: any) {
        logger.error(
          `Error while checking Fulfillments Delivery Obj in /${ApiSequence.ON_STATUS_PICKED}, ${error.stack}`,
        )
      }
    }

    function validateFulfillmentTags(fulfillments: any) {
      const errors: any[] = []

      fulfillments.forEach((fulfillment: any) => {
        const tags = fulfillment.tags || []
        // Step 1: Get all fulfillment_delay tags
        const delayTags = tags.filter((tag: { code: string }) => tag.code === 'fulfillment_delay')

        if (delayTags.length === 0) {
          errors.push({
            fulfillmentId: fulfillment.id,
            error: "Missing 'fulfillment_delay' tag",
          })
          return
        }

        // Step 2: Group by 'state' and pick latest by 'timestamp'
        const latestByState: Record<string, any> = {}

        delayTags.forEach((tag: any) => {
          const tagList = tag.list || []
          const stateEntry = tagList.find((entry: any) => entry.code === 'state')
          const timestampEntry = tagList.find((entry: any) => entry.code === 'timestamp')
          if (stateEntry && stateEntry.value && timestampEntry && timestampEntry.value) {
            const state = stateEntry.value
            const timestamp = new Date(timestampEntry.value).getTime()

            const existingTimestamp = _.get(latestByState[state], 'list', []).find(
              (e: any) => e.code === 'timestamp',
            )?.value

            if (!latestByState[state] || _.gt(new Date(existingTimestamp).getTime(), timestamp)) {
              latestByState[state] = tag.list
            }
          }
        })

        // Step 3: Validate only latest fulfillment_delay tags per state
        Object.entries(latestByState).forEach(([stateValue, tag]) => {
          const tagList = tag.list || []
          setValue('fulfillmentDelayTagList', tagList)
          // Validate state (already grouped by it, but still check validity)
          if (!states.includes(stateValue)) {
            errors.push({
              fulfillmentId: fulfillment.id,
              error: `'state' value '${stateValue}' must be one of ${states}`,
            })
          }

          // Validate reason_id
          const reasonEntry = tag.find((entry: any) => entry.code === 'reason_id')
          if (!reasonEntry || !reasonEntry.value) {
            errors.push({
              fulfillmentId: fulfillment.id,
              error: `Missing or invalid 'reason_id' in 'fulfillment_delay' tag (state: ${stateValue})`,
            })
          } else if (!delivery_delay_reasonCodes.includes(reasonEntry.value)) {
            errors.push({
              fulfillmentId: fulfillment.id,
              error: `'reason_id' must be one of ${delivery_delay_reasonCodes} (state: ${stateValue})`,
            })
          }

          // Validate timestamp
          const timestampEntry = tag.find((entry: any) => entry.code === 'timestamp')

          if (!timestampEntry || !timestampEntry.value) {
            errors.push({
              fulfillmentId: fulfillment.id,
              error: `Missing or invalid 'timestamp' in 'fulfillment_delay' tag (state: ${stateValue})`,
            })
          } else {
            try {
              const stateEntry = tag.find((entry: any) => entry.code === 'state')
              const deliveryFulfillment = fulfillments.find((f: any) => f.type === 'Delivery')

              if (!stateEntry?.value || !timestampEntry?.value || !deliveryFulfillment) return

              const state = stateEntry.value
              const timestamp = timestampEntry.value

              const stateTimestampMap: Record<string, string | undefined> = {
                'Order-picked-up': deliveryFulfillment.start?.time?.timestamp,
                'Order-delivered': deliveryFulfillment.end?.time?.timestamp,
              }

              const fulfillmentTimestamp = stateTimestampMap[state]

              if (fulfillmentTimestamp && _.gte(timestamp, fulfillmentTimestamp)) {
                onStatusObj.tmpstmp = `Timestamp in fulfillmentDelay in fulfillmentTags cannot be greater than or equal to ${state === 'Order-picked-up' ? 'start' : 'end'} timestamp in fulfillments`
              }

              if (_.gte(timestamp, context.timestamp)) {
                onStatusObj.tmpstmp = `Timestamp for /${constants.ON_STATUS_PICKED} api cannot be greater than or equal to /on_status_picked api`
              }

              setValue('timestampOrderPicked', timestamp)
            } catch (error: any) {
              logger.error(`!!Error comparing timestamp for /${constants.ON_STATUS_PICKED}, ${error.stack}`)
            }

            const isValidDate = !isNaN(Date.parse(timestampEntry.value))
            if (!isValidDate) {
              errors.push({
                fulfillmentId: fulfillment.id,
                error: `'timestamp' value '${timestampEntry.value}' is not a valid ISO date (state: ${stateValue})`,
              })
            }
          }
        })
      })

      return errors
    }
    if (flow === FLOW.FLOW020) {
      const fulfillments = on_status.fulfillments
      const res = validateFulfillmentTags(fulfillments)
      res.map((ele: { fulfillmentId: string; error: string }, index: number) => {
        const key = `invalid_attribute/${index}/${ele.fulfillmentId}`
        onStatusObj[key] = `${ele.error}`
      })
    }

    if (flow === FLOW.FLOW01C) {
      const fulfillments = on_status.fulfillments
      const deliveryFulfillment = fulfillments.find((f: any) => f.type === 'Delivery')

      if (!deliveryFulfillment.hasOwnProperty('provider_id')) {
        onStatusObj['missingFulfillments'] =
          `provider_id must be present in ${ApiSequence.ON_STATUS_PICKED} as order is accepted`
      }

      const id = getProviderId(deliveryFulfillment)
      const fulfillmentProviderId = getValue('fulfillmentProviderId')

      if (deliveryFulfillment.hasOwnProperty('provider_id') && id !== fulfillmentProviderId) {
        onStatusObj['providerIdMismatch'] =
          `provider_id in fulfillment in ${ApiSequence.ON_CONFIRM} does not match expected provider_id: expected '${fulfillmentProviderId}' in ${ApiSequence.ON_STATUS_PICKED} but got ${id}`
      }
    }

    return onStatusObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_STATUS} API`, err)
  }
}
