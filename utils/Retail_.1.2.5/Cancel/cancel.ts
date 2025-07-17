/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { ApiSequence, buyerCancellationRid } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchemaRetailV2, isObjectEmpty, checkContext, checkBppIdOrBapId } from '../..'
import { getValue, setValue } from '../../../shared/dao'
import { FLOW } from '../../enum'
import {isValidISO8601Duration} from '../../index'

export const checkCancel = (data: any, msgIdSet: any,action:string,flow?:string) => {
  const cnclObj: any = {}
  // const forceCnclObj:any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.CANCEL]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || isObjectEmpty(message)) {
      return { missingFields: '/context, /message, is missing or empty' }
    }

    const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
    const schemaValidation = validateSchemaRetailV2('RET11', constants.CANCEL, data)
    const select: any = getValue(`${ApiSequence.SELECT}`)
    const contextRes: any = checkContext(context, constants.CANCEL)

    const checkBap = checkBppIdOrBapId(context.bap_id)
    const checkBpp = checkBppIdOrBapId(context.bpp_id)

    if (checkBap) Object.assign(cnclObj, { bap_id: 'context/bap_id should not be a url' })
    if (checkBpp) Object.assign(cnclObj, { bpp_id: 'context/bpp_id should not be a url' })
    if (schemaValidation !== 'error') {
      Object.assign(cnclObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(cnclObj, contextRes.ERRORS)
    }

    try {
      logger.info(`Adding Message Id /${constants.CANCEL}`)
      if (msgIdSet.has(context.message_id)) {
        cnclObj[`${ApiSequence.CANCEL}_msgId`] = `Message id should not be same with previous calls`
      }
      msgIdSet.add(context.message_id)
      setValue(`${ApiSequence.CANCEL}_msgId`, data.context.message_id)
    } catch (error: any) {
      logger.error(`!!Error while checking message id for /${constants.CANCEL}, ${error.stack}`)
    }

    if (!_.isEqual(data.context.domain.split(':')[1], getValue(`domain`))) {
      cnclObj[`Domain[${data.context.action}]`] = `Domain should be same in each action`
    }
    setValue(`${ApiSequence.CANCEL}`, data)

    try {
      logger.info(`Checking context for /${constants.CANCEL} API`) //checking context
      const res: any = checkContext(context, constants.CANCEL)
      if (!res.valid) {
        Object.assign(cnclObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.CANCEL} context, ${error.stack}`)
    }

    try {
      logger.info(`Comparing city of /${constants.SEARCH} and /${constants.CANCEL}`)
      if (!_.isEqual(searchContext.city, context.city)) {
        cnclObj.city = `City code mismatch in /${constants.SEARCH} and /${constants.CANCEL}`
      }
    } catch (error: any) {
      logger.error(`!!Error while comparing city in /${constants.SEARCH} and /${constants.CANCEL}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing timestamp of /${constants.ON_INIT} and /${constants.CANCEL}`)
      if (_.gte(getValue('tmpstmp'), context.timestamp)) {
        cnclObj.tmpstmp = `Timestamp for /${constants.ON_INIT} api cannot be greater than or equal to /${constants.CANCEL} api`
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.error(
        `!!Error while comparing timestamp for /${constants.ON_INIT} and /${constants.CANCEL} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.SELECT} and /${constants.CANCEL}`)
      if (!_.isEqual(select.context.transaction_id, context.transaction_id)) {
        cnclObj.txnId = `Transaction Id should be same from /${constants.SELECT} onwards`
      }
    } catch (error: any) {
      logger.info(
        `!!Error while comparing transaction ids for /${constants.SELECT} and /${constants.CANCEL} api, ${error.stack}`,
      )
    }

    const cancel = message

    try {
      logger.info(`Comparing order Id in /${constants.CANCEL} and /${constants.CONFIRM}`)
      if (cancel.order_id != getValue('cnfrmOrdrId')) {
        cnclObj.cancelOrdrId = `Order Id in /${constants.CANCEL} and /${constants.CONFIRM} do not match`
        logger.info(`Order Id mismatch in /${constants.CANCEL} and /${constants.CONFIRM}`)
      }
    } catch (error: any) {
      logger.info(`Error while comparing order id in /${constants.CANCEL} and /${constants.CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info('Checking the validity of cancellation reason id for buyer')
      if (!buyerCancellationRid.has(cancel.cancellation_reason_id)) {
        logger.info(`cancellation_reason_id should be a valid cancellation id (buyer app initiated)`)

        cnclObj.cancelRid = `Cancellation reason id is not a valid reason id (buyer app initiated)`
      } else setValue('cnclRid', cancel.cancellation_reason_id)
    } catch (error: any) {
      logger.info(`Error while checking validity of cancellation reason id /${constants.CANCEL}, ${error.stack}`)
    }
    try {
      const descriptor = cancel?.descriptor.name
      if (flow === FLOW.FLOW00D) {
        if (descriptor === 'fulfillment') {
          setValue('FulfillmentId', cancel?.descriptor.short_desc)

        }
      }
    } catch (err: any) {
      logger.error(`!!Some error occurred while checking /${constants.CANCEL} API`, err)
    }
    try {
      if (flow === FLOW.FLOW005) {
        console.log("cancel.tags",JSON.stringify(cancel.tags));
        
        if (cancel.cancellation_reason_id !== '052') {
          cnclObj['invalidCancellationReasonId'] =
            `In /${constants.FORCE_CANCEL}, cancellation_reason_id must be '052'`
        }
        // Validate tags array
        if (!cancel.descriptor.tags || !Array.isArray(cancel.descriptor.tags) || cancel.descriptor.tags.length === 0) {
          cnclObj['invldTags'] = `message/descriptor/tags is missing or invalid in /${constants.FORCE_CANCEL}`
        } else {
          const paramsTag = cancel.descriptor.tags.find((tag: any) => tag.code === 'params')
          if (!paramsTag || !paramsTag.list || !Array.isArray(paramsTag.list)) {
            cnclObj['missingParamsTag'] =
              `message/descriptor/tags must contain a 'params' tag with a valid list in /${constants.FORCE_CANCEL}`
          } else {
            const forceParam = paramsTag.list.find((item: any) => item.code === 'force')
            const ttlResponseParam = paramsTag.list.find((item: any) => item.code === 'ttl_response')

            // Validate force parameter
            if (!forceParam || !forceParam.code) {
              cnclObj['missingForceParam'] =
                `message/descriptor/tags/params must contain a 'force' parameter in /${constants.FORCE_CANCEL}`
            } else if (!['yes', 'no'].includes(forceParam.value)) {
              cnclObj['invalidForceValue'] =
                `message/descriptor/tags/params/force must be 'yes' or 'no' in /${constants.FORCE_CANCEL}`
            }

            // Validate ttl_response parameter
            if (!ttlResponseParam || !ttlResponseParam.value) {
              cnclObj['missingTtlResponse'] =
                `message/descriptor/tags/params must contain a 'ttl_response' parameter in /${constants.FORCE_CANCEL}`
            } else if (!isValidISO8601Duration(ttlResponseParam.value)) {
              cnclObj['invalidTtlResponseValue'] =
                `message/descriptor/tags/params/ttl_response must be a valid ISO8601 duration in /${constants.FORCE_CANCEL}`
            }
            if (action === constants.FORCE_CANCEL) {
              if (forceParam?.value !== 'yes') {
                cnclObj['forceParamMustBeYes'] = `In /${constants.FORCE_CANCEL}, force must be 'yes'`
              }

            }
          }
        }
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.FORCE_CANCEL} API`, error)
    }

    return cnclObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.CANCEL} API`, err)
  }
}
