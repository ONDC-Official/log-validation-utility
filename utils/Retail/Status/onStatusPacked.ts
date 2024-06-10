/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { ApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty, checkContext, areTimestampsLessThanOrEqualTo, compareTimeRanges, compareFulfillmentObject } from '../..'
import { getValue, setValue } from '../../../shared/dao'

export const checkOnStatusPacked = (data: any, state: string, msgIdSet: any, fulfillmentsItemsSet: any) => {
  const onStatusObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.ON_STATUS_PACKED]: 'JSON cannot be empty' }
    }

    const flow = getValue('flow')
    const { message, context }: any = data
    if (!message || !context || isObjectEmpty(message)) {
      return { missingFields: '/context, /message, is missing or empty' }
    }

    if (!_.isEqual(data.context.domain.split(':')[1], getValue(`domain`))) {
      onStatusObj[`Domain[${data.context.action}]`] = `Domain should be same in each action`
    }

    const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
    const schemaValidation = validateSchema('RET11', constants.ON_STATUS, data)
    const contextRes: any = checkContext(context, constants.ON_STATUS)

    if (schemaValidation !== 'error') {
      Object.assign(onStatusObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(onStatusObj, contextRes.ERRORS)
    }

    try {
      logger.info(`Adding Message Id /${constants.ON_STATUS_PACKED}`)
      if (msgIdSet.has(context.message_id)) {
        onStatusObj[`${ApiSequence.ON_STATUS_PACKED}_msgId`] = `Message id should not be same with previous calls`
      }
      msgIdSet.add(context.message_id)
    } catch (error: any) {
      logger.error(`!!Error while checking message id for /${constants.ON_STATUS_PACKED}, ${error.stack}`)
    }

    setValue(`${ApiSequence.ON_STATUS_PACKED}`, data)

    const pending_message_id: string | null = getValue('pending_message_id')
    const packed_message_id: string = context.message_id

    setValue(`packed_message_id`, packed_message_id)

    try {
      logger.info(
        `Comparing message_id for unsolicited calls for ${constants.ON_STATUS}.pending and ${constants.ON_STATUS}.packed`,
      )

      if (pending_message_id === packed_message_id) {
        onStatusObj['invalid_message_id'] =
          `Message_id cannot be same for ${constants.ON_STATUS}.pending and ${constants.ON_STATUS}.packed`
      }
    } catch (error: any) {
      logger.error(
        `Error while comparing message_id for ${constants.ON_STATUS}.pending and ${constants.ON_STATUS}.packed`,
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
      logger.info(`Comparing timestamp of /${constants.ON_STATUS}_Pending and /${constants.ON_STATUS}_${state} API`)
      if (_.gte(getValue('tmstmp'), context.timestamp)) {
        onStatusObj.inVldTmstmp = `Timestamp for /${constants.ON_STATUS}_Pending api cannot be greater than or equal to /${constants.ON_STATUS}_${state} api`
      }
      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.error(`!!Error occurred while comparing timestamp for /${constants.ON_STATUS}_${state}, ${error.stack}`)
    }
    try {
      if (!_.isEqual(getValue(`cnfrmTmpstmp`), on_status.created_at)) {
        onStatusObj.tmpstmp = `Created At timestamp for /${constants.ON_STATUS}_${state}.message.order should be equal to context timestamp at ${constants.CONFIRM}`
      }
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
      logger.info(`comparing fulfillment ranges `)
      const storedFulfillment = getValue(`deliveryFulfillment`)
      const deliveryFulfillment = on_status.fulfillments.filter((fulfillment: any) => fulfillment.type === 'Delivery')
      const storedFulfillmentAction = getValue('deliveryFulfillmentAction')
      const fulfillmentRangeerrors = compareTimeRanges(storedFulfillment, storedFulfillmentAction, deliveryFulfillment[0], ApiSequence.ON_STATUS_PACKED)
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
          if (`${ffId}_tracking`) {
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
      if (on_status.state != 'In-progress') {
        onStatusObj.ordrState = `order/state should be "In-progress" for /${constants.ON_STATUS}_${state}`
      }
    } catch (error: any) {
      logger.error(`!!Error while checking order state in /${constants.ON_STATUS}_${state} Error: ${error.stack}`)
    }

    if (flow == '6') {
      try {
        // For Delivery Object
        const fulfillments = on_status.fulfillments
        if (!fulfillments.length) {
          const key = `missingFulfillments`
          onStatusObj[key] = `missingFulfillments is mandatory for ${ApiSequence.ON_STATUS_PACKED}`
        }
        else {
          let i: number = 0
          fulfillmentsItemsSet.forEach((obj1: any) => {
            const keys = Object.keys(obj1)

            let obj2: any = _.filter(fulfillments, { type: `${obj1.type}` })
            if (obj2.length > 0) {
              obj2 = obj2[0]
              if (obj2.type == "Delivery") {
                delete obj2?.start?.instructions
                delete obj2?.end?.instructions
                delete obj2?.tags
                delete obj2?.state
              }
              const apiSeq = obj2.type === "Cancel" ? ApiSequence.ON_UPDATE_PART_CANCEL : (getValue('onCnfrmState') === "Accepted" ? (ApiSequence.ON_CONFIRM) : (ApiSequence.ON_STATUS_PENDING))
              const errors = compareFulfillmentObject(obj1, obj2, keys, i, apiSeq)
              if (errors.length > 0) {
                errors.forEach((item: any) => {
                  onStatusObj[item.errKey] = item.errMsg
                })
              }
            }
            else {
              onStatusObj[`message/order.fulfillments/${i}`] = `Missing fulfillment type '${obj1.type}' in ${ApiSequence.ON_STATUS_PACKED} as compared to ${ApiSequence.ON_STATUS_PENDING}`
            }
            i++
          });
        }

      } catch (error: any) {
        logger.error(`Error while checking Fulfillments Delivery Obj in /${ApiSequence.ON_STATUS_PACKED}, ${error.stack}`)
      }
    }

    return onStatusObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_STATUS} API`, err)
  }
}
