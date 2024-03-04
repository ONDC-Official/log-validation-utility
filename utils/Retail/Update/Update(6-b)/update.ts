import _ from 'lodash'
import { logger } from '../../../../shared/logger'
import constants, { ApiSequence } from '../../../../constants'
import { validateSchema, isObjectEmpty, checkBppIdOrBapId, checkContext } from '../../../../utils'
import { getValue, setValue } from '../../../../shared/dao'

export const checkUpdateRQC = (data: any) => {
  console.log(`Inside Update RQC`)
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

    // Validating Schema
    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.UPDATE_RQC, data)

    if (schemaValidation !== 'error') {
      Object.assign(updtObj, schemaValidation)
    }

    // Checking bap_id and bpp_id format
    const checkBap = checkBppIdOrBapId(context.bap_id)
    const checkBpp = checkBppIdOrBapId(context.bpp_id)
    if (checkBap) Object.assign(updtObj, { bap_id: 'context/bap_id should not be a url' })
    if (checkBpp) Object.assign(updtObj, { bpp_id: 'context/bpp_id should not be a url' })

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

    // Checking for return_request object in /Update
    try {
      logger.info(`Checking for return_request object in /${constants.UPDATE}`)
      let return_request_obj = null
      update.fulfillments.forEach((item: any) => {
        item.tags.forEach((tag: any) => {
          if (tag.code === 'return_request') {
            return_request_obj = tag
            tag.list.forEach((item: any) => {
              if (item.code === 'item_id') {
                setValue('updatedItemID', item.value)
              }
            })
          }
        })
      })
      setValue('return_request_obj', return_request_obj)
    } catch (error: any) {
      logger.error(`Error while checking for return_request_obj for /${constants.UPDATE} , ${error}`)
    }

    setValue('updtMsgIdRQC', context.message_id)

    // Check for message.order.fulfillments.tags --> code: images & format:url, code: ttl_approval , & format: duration

    // Reason code mapping
    return updtObj
  } catch (error: any) {
    logger.error(`!!Some error occurred while checking /${constants.UPDATE} API`, error.stack)
  }
}
