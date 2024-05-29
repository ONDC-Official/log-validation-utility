import _ from 'lodash'
import { logger } from '../../../shared/logger'
import constants, { ApiSequence, buyerReturnId } from '../../../constants'
import { validateSchema, isObjectEmpty, checkBppIdOrBapId, checkContext, isValidUrl, timeDiff } from '../../../utils'
import { getValue, setValue } from '../../../shared/dao'

export const checkUpdate = (data: any, msgIdSet: any, apiSeq: any, settlementDetatilSet: any, flow: any) => {
  const updtObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.UPDATE]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
    const select: any = getValue(`${ApiSequence.SELECT}`)
    if (!message || !context || isObjectEmpty(message)) {
      return { missingFields: '/context, /message, is missing or empty' }
    }

    const update = message.order
    const selectItemList: any = getValue('SelectItemList')

    try {
      logger.info(`Adding Message Id /${apiSeq}`)
      if (msgIdSet.has(context.message_id)) {
        updtObj[`${apiSeq}_msgId`] = `Message id should not be same with previous calls`
      }
      msgIdSet.add(context.message_id)
      // for update and on_update_interim
      if (flow === '6-b' && apiSeq == ApiSequence.UPDATE_REVERSE_QC) { setValue(`${ApiSequence.UPDATE_REVERSE_QC}_msgId`, data.context.message_id) }
      if (flow === '6-c' && apiSeq == ApiSequence.UPDATE_LIQUIDATED) { setValue(`${ApiSequence.UPDATE_LIQUIDATED}_msgId`, data.context.message_id) }
    } catch (error: any) {
      logger.error(`!!Error while checking message id for /${apiSeq}, ${error.stack}`)
    }


    try {
      const timestampOnUpdatePartCancel = getValue(`${ApiSequence.ON_UPDATE_PART_CANCEL}_tmpstmp`)
      const timeDif = timeDiff(context.timestamp, timestampOnUpdatePartCancel)
      if (timeDif <= 0) {
        const key = 'context/timestamp'
        updtObj[key] = `context/timestamp of /${apiSeq} should be greater than /${ApiSequence.ON_UPDATE_PART_CANCEL} context/timestamp`
      }

      if (flow === '6-b' || flow === '6-c') {
        if (apiSeq === ApiSequence.UPDATE_LIQUIDATED || apiSeq === ApiSequence.UPDATE_REVERSE_QC) {
          setValue('timestamp_', [context.timestamp, apiSeq])
        }
        else {
          const timestamp = getValue('timestamp_')
          if (timestamp && timestamp.length != 0) {
            const timeDif2 = timeDiff(context.timestamp, timestamp[0])
            if (timeDif2 <= 0) {
              const key = 'context/timestamp/'
              updtObj[key] = `context/timestamp of /${apiSeq} should be greater than context/timestamp of /${timestamp[1]}`
            }
          }
          else {
            const key = 'context/timestamp/'
            updtObj[key] = `context/timestamp of the previous call is missing or the previous action call itself is missing`
          }
          setValue('timestamp_', [context.timestamp, apiSeq])
          if (apiSeq === ApiSequence.UPDATE_SETTLEMENT_LIQUIDATED || apiSeq === ApiSequence.ON_UPDATE_DELIVERED) {
            setValue('timestamp_', [])
          }
        }
      }
    } catch (e: any) {
      logger.error(`Error while context/timestamp for the /${apiSeq}`)
    }


    // Validating Schema
    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.UPDATE, data)

    if (schemaValidation !== 'error') {
      Object.assign(updtObj, schemaValidation)
    }

    // Checking bap_id and bpp_id format
    const checkBap = checkBppIdOrBapId(context.bap_id)
    const checkBpp = checkBppIdOrBapId(context.bpp_id)
    if (checkBap) Object.assign(updtObj, { bap_id: 'context/bap_id should not be a url' })
    if (checkBpp) Object.assign(updtObj, { bpp_id: 'context/bpp_id should not be a url' })

    if (!_.isEqual(data.context.domain.split(':')[1], getValue(`domain`))) {
      updtObj[`Domain[${data.context.action}]`] = `Domain should be same in each action`
    }

    setValue(`${ApiSequence.UPDATE}`, data)
    // Checkinf for valid context object
    try {
      logger.info(`Checking context for /${apiSeq} API`) //checking context
      const res: any = checkContext(context, constants.UPDATE)
      if (!res.valid) {
        Object.assign(updtObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${apiSeq} context, ${error.stack}`)
    }

    // Comparing context.city with /search city
    try {
      logger.info(`Comparing city of /${constants.SEARCH} and /${apiSeq}`)
      if (!_.isEqual(searchContext.city, context.city)) {
        updtObj.city = `City code mismatch in /${constants.SEARCH} and /${apiSeq}`
      }
    } catch (error: any) {
      logger.error(`!!Error while comparing city in /${constants.SEARCH} and /${apiSeq}, ${error.stack}`)
    }

    // Comaring Timestamp of /update with /on_init API
    try {
      logger.info(`Comparing timestamp of /${constants.ON_INIT} and /${apiSeq}`)
      if (_.gte(getValue('onInitTmpstmp'), context.timestamp)) {
        updtObj.tmpstmp = `Timestamp for /${constants.ON_INIT} api cannot be greater than or equal to /${apiSeq} api`
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.error(
        `!!Error while comparing timestamp for /${constants.ON_INIT} and /${apiSeq} api, ${error.stack}`,
      )
    }

    // Comparing transaction ID with /select API
    try {
      logger.info(`Comparing transaction Ids of /${constants.SELECT} and /${apiSeq}`)
      if (!_.isEqual(select.context.transaction_id, context.transaction_id)) {
        updtObj.txnId = `Transaction Id should be same from /${constants.SELECT} onwards`
      }
    } catch (error: any) {
      logger.info(
        `!!Error while comparing transaction ids for /${constants.SELECT} and /${apiSeq} api, ${error.stack}`,
      )
    }

    setValue('updtMsgIdRQC', context.message_id)

    // Checking for payment object in message.order
    try {
      const payment = update.payment
      if (payment) {
        const settlement_details = payment['@ondc/org/settlement_details']
        for (let item of settlement_details) {
          let settlement_amount = item.settlement_amount
          setValue('settlement_amount', settlement_amount)
        }
        settlementDetatilSet.add(settlement_details[0])
      }
    } catch (error: any) {
      logger.error(`!!Error occurred while checking for payment object in /${apiSeq} API`, error.stack)
    }

    if (flow === '6-a') {
      try {
        logger.info(`Checking for fulfillment ID in /${apiSeq} API`)
        const fulfillmentID = getValue('cancelFulfillmentID')
        update.fulfillments.forEach((fulfillment: any) => {
          if (fulfillment.type === 'Cancel' && fulfillment.id !== fulfillmentID) {
            updtObj.fulfillmentID = `Cancel fulfillment ID should be same as the one in /${constants.ON_UPDATE} API`
          }
        })
      } catch (error: any) {
        logger.error(`!!Error occurred while checking for fulfillment ID in /${apiSeq} API`, error.stack)
      }
    }

    // Checking for return_request object in /Update
    if (update.fulfillments[0].tags) {
      try {
        logger.info(`Checking for return_request object in /${apiSeq}`)
        const updateItemSet: any = {}
        const updateItemList: any = []
        const updateReturnId: any = []
        const itemFlfllmnts: any = getValue('itemFlfllmnts')
        let return_request_obj = null
        update.fulfillments.forEach((item: any) => {
          item.tags?.forEach((tag: any) => {
            if (tag.code === 'return_request') {
              return_request_obj = tag
              let key: any = null
              tag.list.forEach((item: any) => {
                if (item.code === 'item_id') {
                  key = item.value
                  if (!selectItemList.includes(key)) {
                    logger.error(`Item code should be present in /${constants.SELECT} API`)
                    const key = `inVldItemId[${item.value}]`
                    updtObj[key] = `Item ID should be present in /${constants.SELECT} API for /${apiSeq}`
                  } else {
                    updateItemSet[item.value] = item.value
                    updateItemList.push(item.value)
                    setValue('updatedItemID', item.value)
                  }
                }
                if (item.code === 'id') {
                  if (Object.values(itemFlfllmnts).includes(item.value)) {
                    updtObj.nonUniqueReturnFulfillment = `${item.value} is not a unique fulfillment`
                  } else {
                    updateReturnId.push(item.value)
                  }
                }
                if (item.code === 'item_quantity') {
                  let val = item.value
                  updateItemSet[key] = val
                }
                if (item.code === 'reason_id') {
                  logger.info(`Checking for valid buyer reasonID for /${apiSeq}`)
                  let reasonId = item.value

                  if (!buyerReturnId.has(reasonId)) {
                    logger.error(`reason_id should be a valid cancellation id (buyer app initiated)`)
                    updtObj.updateRid = `reason_id is not a valid reason id (buyer app initiated)`
                  }
                }
                if (item.code === 'images') {
                  const images = item.value
                  const allurls = images?.every((img: string) => isValidUrl(img))
                  if (!allurls) {
                    logger.error(
                      `Images array should be prvided as comma seperated values and each image should be an url`,
                    )
                    const key = `invldImageURL`
                    updtObj[key] =
                      `Images array should be prvided as comma seperated values and each image should be an url for /${apiSeq}`
                  }
                }
              })
            }
          })
        })
        setValue('updateReturnId', updateReturnId)
        setValue('updateItemSet', updateItemSet)
        setValue('updateItemList', updateItemList) // for 6-a 
        setValue('return_request_obj', return_request_obj)
      } catch (error: any) {
        logger.error(`Error while checking for return_request_obj for /${apiSeq} , ${error}`)
      }
    }

    return updtObj
  } catch (error: any) {
    logger.error(`!!Some error occurred while checking /${apiSeq} API`, error.stack)
  }
}