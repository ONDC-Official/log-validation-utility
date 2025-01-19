
import { RSF_v2_apiSequence } from '../../../constants/index'
import { isObjectEmpty } from '../../index'
import { validateSchema } from '../../index'
import { logger } from '../../../shared/logger'
import { setValue, getValue } from '../../../shared/dao'
import constants from '../../../constants/index'
import { compareContexts, validateSettlementAmounts } from '../rsfHelpers'

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
            `Order amount ${order.amount.value} does not match sum of settlement amounts`
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
