import _ from 'lodash'
import { logger } from '../../../shared/logger'
import constants, { ApiSequence, buyerCancellationRid } from '../../../constants'
import { validateSchema, isObjectEmpty, checkBppIdOrBapId, checkContext, isValidUrl } from '../../../utils'
import { getValue, setValue } from '../../../shared/dao'

export const checkUpdate = (data: any) => {
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
      logger.info(`Checking context for /${constants.UPDATE} API`) //checking context
      const res: any = checkContext(context, constants.UPDATE)
      if (!res.valid) {
        Object.assign(updtObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.UPDATE} context, ${error.stack}`)
    }

    // Comparing context.city with /search city
    try {
      logger.info(`Comparing city of /${constants.SEARCH} and /${constants.UPDATE}`)
      if (!_.isEqual(searchContext.city, context.city)) {
        updtObj.city = `City code mismatch in /${constants.SEARCH} and /${constants.UPDATE}`
      }
    } catch (error: any) {
      logger.error(`!!Error while comparing city in /${constants.SEARCH} and /${constants.UPDATE}, ${error.stack}`)
    }

    // Comaring Timestamp of /update with /init API
    try {
      logger.info(`Comparing timestamp of /${constants.ON_INIT} and /${constants.UPDATE}`)
      if (_.gte(getValue('tmpstmp'), context.timestamp)) {
        updtObj.tmpstmp = `Timestamp for /${constants.ON_INIT} api cannot be greater than or equal to /${constants.UPDATE} api`
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.error(
        `!!Error while comparing timestamp for /${constants.ON_INIT} and /${constants.UPDATE} api, ${error.stack}`,
      )
    }

    // Comparing transaction ID with /select API
    try {
      logger.info(`Comparing transaction Ids of /${constants.SELECT} and /${constants.UPDATE}`)
      if (!_.isEqual(select.context.transaction_id, context.transaction_id)) {
        updtObj.txnId = `Transaction Id should be same from /${constants.SELECT} onwards`
      }
    } catch (error: any) {
      logger.info(
        `!!Error while comparing transaction ids for /${constants.SELECT} and /${constants.UPDATE} api, ${error.stack}`,
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
      }
    } catch (error: any) {
      logger.error(`!!Error occurred while checking for payment object in /${constants.UPDATE} API`, error.stack)
    }

    // Check for message.order.fulfillments.tags --> code: images & format:url, code: ttl_approval , & format: duration

    // Checking for return_request object in /Update
    if (update.fulfillments[0].tags) {
      try {
        logger.info(`Checking for return_request object in /${constants.UPDATE}`)
        const updateItemSet: any = {}
        const updateItemList: any = []
        let return_request_obj = null
        update.fulfillments.forEach((item: any) => {
          item.tags.forEach((tag: any) => {
            if (tag.code === 'return_request') {
              return_request_obj = tag
              let key: any = null
              tag.list.forEach((item: any) => {
                if (item.code === 'item_id') {
                  key = item.value
                  if (!selectItemList.includes(key)) {
                    logger.error(`Item code should be present in /${constants.SELECT} API`)
                    const key = `inVldItemId[${item.value}]`
                    updtObj[key] = `Item ID should be present in /${constants.SELECT} API for /${constants.UPDATE}`
                  } else {
                    updateItemSet[item.value] = item.value
                    updateItemList.push(item.value)
                    setValue('updatedItemID', item.value)
                  }
                }
                if (item.code === 'item_quantity') {
                  let val = item.value
                  updateItemSet[key] = val
                }
                if (item.code === 'reason_id') {
                  logger.info(`Checking for valid buyer reasonID for /${constants.UPDATE}`)
                  let reasonId = item.value

                  if (!buyerCancellationRid.has(reasonId)) {
                    logger.info(`reason_id should be a valid cancellation id (buyer app initiated)`)

                    updtObj.updateRid = `reason_id is not a valid reason id (buyer app initiated)`
                  }
                }
                if (item.code === 'images') {
                  const images = item.value
                  const allurls = images.every((img: string) => isValidUrl(img))
                  if (!allurls) {
                    logger.error(
                      `Images array should be prvided as comma seperated values and each image should be an url`,
                    )
                    const key = `invldImageURL`
                    updtObj[key] =
                      `Images array should be prvided as comma seperated values and each image should be an url for /${constants.UPDATE}`
                  }
                }
              })
            }
          })
        })
        setValue('updateItemSet', updateItemSet)
        setValue('updateItemList', updateItemList)
        setValue('return_request_obj', return_request_obj)
      } catch (error: any) {
        logger.error(`Error while checking for return_request_obj for /${constants.UPDATE} , ${error}`)
      }
    }

    return updtObj
  } catch (error: any) {
    logger.error(`!!Some error occurred while checking /${constants.UPDATE} API`, error.stack)
  }
}
