import { RSF_v2_apiSequence } from '../../../constants/index'
import _ from 'lodash'
import { isObjectEmpty } from '../../index'
import { validateSchema } from '../../index'
import { logger } from '../../../shared/logger'
import { getValue } from '../../../shared/dao'
import constants from '../../../constants/index'
import { compareContexts } from '../../RSF/rsfHelpers'
import { RSF_v2_Errors } from '../../../constants/RSFv2ErrorCodes'

const checkRsfOnSettle = (data: any) => {
  const rsfObj: any = {}
  const {context, message} = data
  try {
  
  if (!data || isObjectEmpty(data)) {
    return { [RSF_v2_apiSequence.ON_SETTLE]: 'JSON cannot be empty' }
  }

  try {

  const setlContext: any = getValue('settle_context')

      logger.info(`Validating Schema for ${RSF_v2_apiSequence.ON_SETTLE} API`)
      const vs = validateSchema('rsf', RSF_v2_apiSequence.ON_SETTLE, data)
      console.log("settle context ", setlContext)
      if (vs != 'error') {
        Object.assign(rsfObj, vs)
      }
   

    try{
    logger.info("Comparing context timestamp for on_settle")
    const contextValidationErrors = compareContexts(setlContext, context)
    if (contextValidationErrors != 'error') {
      Object.assign(rsfObj, contextValidationErrors)
    }

    }catch(error: any){
      logger.error(`!!Error while comparing context for /${constants.SETTLE} and /${constants.ON_SETTLE} api, ${error.stack}`)
    }

    logger.info('Comparing settlement_id from previous settle and on_settle')
    const settle_id = getValue('settle_message_settlement_id')
    console.log("settle_id", settle_id)
    console.log("on_Settle_id", message.settlement)
    if (settle_id !== message.settlement.id) {
      rsfObj.settlement_id = 'settlement_id in on_settle should match with settlement_id in settle'
    }


    logger.info('Validate required fields for MISC type for on_settle')

    console.log("msg on_settle", message)

    if (message?.settlement?.type === 'NIL') {
      console.log("in NIL type", message?.settlement?.type)
      if (message.settlement.id) {
        rsfObj.settlement_id = 'Settlement id is provided but not required when type is NIL';
      }
    } 

    if (message?.settlement?.type === 'MISC') {
      if (message?.collector_app_id) {
        rsfObj.collector_app_id = 'collector_app_id should not be present for MISC settlement type'
      }
      
      if (message?.receiver_app_id) {
        rsfObj.receiver_app_id = 'receiver_app_id should not be present for MISC settlement type'
      }
  
      if (!message?.settlement?.id) {
        rsfObj.settlement_id = 'settlement id is required for MISC type'
      }
  
      if (!message?.settlement?.orders?.[0]?.self?.amount?.currency || 
          !message?.settlement?.orders?.[0]?.self?.amount?.value) {
        rsfObj.settlement_amount = 'settlement amount with currency and value is required for MISC type'
      }

      if (message?.inter_participant) {
        rsfObj.inter_participant = 'inter_participant is not required for MISC type'
      }
    }
  
    logger.info('Validate required fields for NIL type')
    if (message?.settlement?.type === 'NIL') {
      if (message?.collector_app_id) {
        rsfObj.collector_app_id = 'collector_app_id should not be present for NIL settlement type'
      }
      
      if (message?.receiver_app_id) {
        rsfObj.receiver_app_id = 'receiver_app_id should not be present for NIL settlement type'
      }
  
      const settlementKeys = Object.keys(message.settlement)
      if (settlementKeys.length > 1) {
        rsfObj.settlement_fields = 'NIL settlement type should only contain type field'
      }
    }
    try {
      logger.info(`Validating error codes in settlement orders`)
      message?.settlement?.orders?.forEach((order: any, index: number) => {
        ['self', 'provider', 'inter_participant'].forEach(field => {
          if (order[field]?.error?.code) {
            const errorCode = order[field].error.code
            if (typeof errorCode === 'string' && !(errorCode in RSF_v2_Errors)) {
              rsfObj[`orders_${index}_${field}_error`] = `Invalid error code ${errorCode}. Must match RSFv2ErrorCodes.`
            }
          }
        })
      })
    } catch (error: any) {
      logger.error(`Error while validating error codes in settlement orders: ${error.stack}`)
    }


  }
  catch (err: any) {
    logger.error(`!!Some error occurred while checking /${RSF_v2_apiSequence.ON_SETTLE} API`, err)
  }

  return rsfObj

} catch (err: any) {
  if (err.code === 'ENOENT') {
    logger.info(`!!File not found for /${RSF_v2_apiSequence.SETTLE} API!`)
  } else {
    console.log("Error occurred while checking /API:", err)
    logger.error(`!!Some error occurred while checking /${RSF_v2_apiSequence.SETTLE} API`, err)
  }
}
}

export default checkRsfOnSettle