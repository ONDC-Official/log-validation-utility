import { RSF_v2_apiSequence } from '../../../constants/index'
import { isObjectEmpty } from '../../index'
import { validateSchema } from '../../index'
import { logger } from '../../../shared/logger'
import { setValue , getValue} from '../../../shared/dao'
import { validateSettlementAmounts, getAllSettlementIds,} from '../rsfHelpers'

const checkRsfRecon = (data: any) => {
  const rsfObj: any = {}
  const { message, context }: any = data
  if (!data || isObjectEmpty(data)) {
    return { [RSF_v2_apiSequence.RECON]: 'JSON cannot be empty' }
  }

  try {
    logger.info(`Validating Schema for ${RSF_v2_apiSequence.RECON} API`)
    const vs = validateSchema('rsf', RSF_v2_apiSequence.RECON, data)

    if (vs != 'error') {
      Object.assign(rsfObj, vs)
    }

    setValue('recon_context', context)
    setValue('recon_message', message)

    try {
      logger.info('Extracting settlement IDs from orders')
      const settlementIds = getAllSettlementIds(message?.orders || [])
      logger.info(`Found ${settlementIds.length} settlement IDs: ${JSON.stringify(settlementIds)}`)
      setValue('recon_settlement_ids', settlementIds)
      
      const settleId = getValue('settle_message_settlement_id')
      if (settleId) {
        logger.info(`Checking if settle ID ${settleId} is present in recon settlement IDs`)
        if (!settlementIds.includes(settleId)) {
          rsfObj.settlement_id_mismatch = `Settlement ID ${settleId} from /settle API is not present in the settlement IDs from /recon API`
          logger.error(`Settlement ID ${settleId} from /settle API is not present in the settlement IDs from /recon API`)
        } else {
          logger.info(`Settlement ID ${settleId} from /settle API is present in the settlement IDs from /recon API`)
        }
      } else {
        logger.warn('No settlement_id found to compare with recon settlement IDs')
      }
    } catch (err) {
      logger.error('Error occurred while extracting and validating settlement IDs', err)
    }
    
  try{  
    logger.info('Validating reconcile orders')
    message?.orders?.forEach((order: any, orderIndex: number) => {
      order?.settlements?.forEach((settlement: any, settlementIndex: number) => {
        const updatedAt = new Date(settlement.updated_at)
        const contextTimestamp = new Date(context.timestamp)
        
        if (updatedAt > contextTimestamp) {
          rsfObj[`orders_${orderIndex}_settlements_${settlementIndex}_timestamp`] = 
            'Settlement updated_at timestamp cannot be greater than context timestamp'
        }
      })
    })
  }catch(err){
    logger.error('Error occurred while validating reconcile orders', err)
  }

  //amount validation
  try{
    logger.info('Validating reconcile amounts')
    message?.orders?.forEach((order: any, index: number) => {
      if (!validateSettlementAmounts(order)) {
        rsfObj[`order_${index}_amount_mismatch`] = 
          `Order amount ${order.amount.value} does not match sum of settlement amounts`
      }
    })
  }catch(err){
    logger.error('Error occurred while validating reconcile amounts', err)
  }
  

    return rsfObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${RSF_v2_apiSequence.RECON} API!`)
    } else {
      console.log("Error occurred while checking /API:", err)
      logger.error(`!!Some error occurred while checking /${RSF_v2_apiSequence.RECON} API`, err)
    }
  }
}

export default checkRsfRecon
