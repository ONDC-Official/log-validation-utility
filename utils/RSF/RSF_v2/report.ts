import { RSF_v2_apiSequence } from '../../../constants/index'
import { isObjectEmpty } from '../../index'
import { validateSchema } from '../../index'
import { logger } from '../../../shared/logger'
import { setValue, getValue } from '../../../shared/dao'

const checkRsfReport = (data: any) => {
  const rsfObj: any = {}
  const { message, context }: any = data
  console.log("message",message)

  if (!data || isObjectEmpty(data)) {
    return { [RSF_v2_apiSequence.REPORT]: 'JSON cannot be empty' }
  }

  try {
    logger.info(`Validating Schema for ${RSF_v2_apiSequence.REPORT} API`)
    const vs = validateSchema('rsf', RSF_v2_apiSequence.REPORT, data)

    if (vs != 'error') {
      Object.assign(rsfObj, vs)
    }

    setValue('report_context', context)
    setValue('report_message', message)

  try{

    logger.info('Validating settle ids for report')
    const setlContext: any = getValue('settle_context')
    if(setlContext.transaction_id !== message.ref_transaction_id && setlContext.message_id !== message.ref_message_id){
      rsfObj.settlement_id = 'settle context.transaction_id and message_id should match with ref_transaction_id and message_id'
    }

  }catch(err){
    logger.error('Error occurred while validating settle ids for report', err)
  }

    return rsfObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${RSF_v2_apiSequence.REPORT} API!`)
    } else {
      console.log("Error occurred while checking /API:", err)
      logger.error(`!!Some error occurred while checking /${RSF_v2_apiSequence.REPORT} API`, err)
    }
  }
}

export default checkRsfReport
