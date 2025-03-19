import { RSF_v2_apiSequence } from '../../../constants/index'
import { isObjectEmpty } from '../../index'
import { validateSchema } from '../../index'
import { logger } from '../../../shared/logger'
import { setValue } from '../../../shared/dao'
import { checkDuplicateOrderIds } from '../rsfHelpers'

const checkRsfSettle = (data: any) => {
  const rsfObj: any = {}
  const { message, context }: any = data
  console.log("message",message)

  if (!data || isObjectEmpty(data)) {
    return { [RSF_v2_apiSequence.SETTLE]: 'JSON cannot be empty' }
  }

  setValue('settle_context', context)
  setValue('settle_message', message)
  setValue('settle_message_settlement_id', message.settlement.id)

  console.log('settle_message_settlement_id', message.settlement.id)
  try {
    logger.info(`Validating Schema for ${RSF_v2_apiSequence.SETTLE} API`)
    const vs = validateSchema('rsf', RSF_v2_apiSequence.SETTLE, data)
    logger.info(`Schema validation result for ${RSF_v2_apiSequence.SETTLE}:`, vs)

  if (message?.collector_app_id === context?.bpp_id) {
    rsfObj.collector_app_id = 'collector_app_id should not match with bpp_id'
  }

  if (message?.receiver_app_id === context?.bpp_id) {
    rsfObj.receiver_app_id = 'receiver_app_id should not match with bpp_id'
  }
  if (vs != 'error') {
    Object.assign(rsfObj, vs)
  }

  logger.info('Validate required fields for MISC type')
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

  logger.info('Checking duplicate order IDs')
  const duplicateOrderId = checkDuplicateOrderIds(message?.settlement?.orders)
  if(duplicateOrderId) {
    rsfObj.duplicate_order_id = duplicateOrderId
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

export default checkRsfSettle