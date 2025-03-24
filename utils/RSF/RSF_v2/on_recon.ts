
import { RSF_v2_apiSequence } from '../../../constants/index'
import { isObjectEmpty } from '../../index'
import { validateSchema } from '../../index'
import { logger } from '../../../shared/logger'
import { setValue, getValue } from '../../../shared/dao'
import constants from '../../../constants/index'
import { compareContexts,   validateSettlementAmounts, getAllSettlementIds} from '../rsfHelpers'

const checkRsfOnRecon = (data: any) => {
  const rsfObj: any = {}

  const { message, context }: any = data

  if (!data || isObjectEmpty(data)) {
    return { [RSF_v2_apiSequence.ON_RECON]: 'JSON cannot be empty' }
  }

  try {
    logger.info(`Validating Schema for ${RSF_v2_apiSequence.ON_RECON} API`)
    const vs = validateSchema('rsf', RSF_v2_apiSequence.ON_RECON, data)

    if (vs != 'error') {
      Object.assign(rsfObj, vs)
    }

    setValue('on_recon_context', context)
    setValue('on_recon_message', message)

    const recon_context = getValue('recon_context')

    try{
      const contextValidationErrors = compareContexts(recon_context, context)
      if (contextValidationErrors != 'error') {
        Object.assign(rsfObj, contextValidationErrors)
      }

    }catch(error: any){
      logger.error(`!!Error while comparing context for /${constants.RECON} and /${constants.ON_RECON} api, ${error.stack}`)
    }

    try {
      logger.info('Extracting settlement IDs from orders')
      const settlementIds = getAllSettlementIds(message?.orders || [])
      logger.info(`Found ${settlementIds.length} settlement IDs: ${JSON.stringify(settlementIds)}`)
      setValue('on_recon_settlement_ids', settlementIds)
      const settleId = getValue('settle_message_settlement_id')
      if (settleId) {
        logger.info(`Checking if settle ID ${settleId} is present in recon settlement IDs`)
        if (!settlementIds.includes(settleId)) {
          rsfObj.settlement_id_mismatch = `Settlement ID ${settleId} from /settle API is not present in the settlement IDs from /on_recon API`
          logger.error(`Settlement ID ${settleId} from /settle API is not present in the settlement IDs from /on_recon API`)
        } else {
          logger.info(`Settlement ID ${settleId} from /settle API is present in the settlement IDs from /on_recon API`)
        }
      } else {
        logger.warn('No settle_message_settlement_id found to compare with recon settlement IDs')
      }
    } catch (err) {
      logger.error('Error occurred while extracting and validating settlement IDs', err)
    }

    try {
      const reconAccordStatus = message?.orders?.every((order: any) => order?.recon_accord === true)

      if (reconAccordStatus === true) {
        const allRequiredDueDatesPresent = message?.orders?.every((order: any) => {
          if (!order.settlements || !Array.isArray(order.settlements)) {
            return false
          }
          
          return order.settlements.every((settlement: any) => {
            if (['PENDING', 'TO_BE_INITIATED'].includes(settlement.status)) {
              return !!settlement.due_date
            }

            else if (settlement.status === 'SETTLED') {
              return !!settlement.settlement_ref_no
            }
            return true
          })
        })
        
        if (!allRequiredDueDatesPresent) {
          rsfObj.due_date_missing = 'When recon_accord is true, all PENDING or TO_BE_INITIATED settlements must have due_date'
        }
      }
    } catch (error: any) {
      logger.error(`Error while validating recon_accord`, error)
    }
    //amount validation
    try {
      logger.info('validating recon_accord is false')
      if (message.orders.recon_accord === false) {
        const reconMessageAmount = parseFloat(getValue('recon_message')?.amount?.value || '0')
        const messageAmount = parseFloat(message?.amount?.value || '0')
        const amountDifference = Math.abs(reconMessageAmount - messageAmount)
    
        const totalDiffValue = message.orders.settlements.reduce((sum: number, settlement: any) => {
          return sum + parseFloat(settlement.amount?.diff_value || '0')
        }, 0)
    
        if (Math.abs(amountDifference - totalDiffValue) > 0.01) {
          rsfObj.diff_value_mismatch = 'Sum of diff_values does not match the difference between recon amount and message amount'
        }
      }
    } catch (err) {
      logger.error('Error while validating diff values:', err)
    }
    
    
    try{
      logger.info('Validating reconcile amounts')
      message?.orders?.forEach((order: any, index: number) => {
        if (!validateSettlementAmounts(order)) {
          rsfObj[`order_${index}_amount_mismatch`] = 
            `Order amount ${order.amount.value} does not match sum of settlement amounts ${getValue('totalSettlementAmount')}`
        }
      })
    }catch(err){
      logger.error('Error occurred while validating reconcile amounts', err)
    }

    return rsfObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${RSF_v2_apiSequence.ON_RECON} API!`)
    } else {
      console.log("Error occurred while checking /API:", err)
      logger.error(`!!Some error occurred while checking /${RSF_v2_apiSequence.ON_RECON} API`, err)
    }
  }
}

export default checkRsfOnRecon
