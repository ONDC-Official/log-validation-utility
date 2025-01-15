import { RSF_v2_apiSequence } from '../../../constants/index'
import { isObjectEmpty } from '../../index'
import { validateSchema } from '../../index'
import { logger } from '../../../shared/logger'
import { setValue } from '../../../shared/dao'

const checkRsfSettle = (data: any) => {
  const rsfObj: any = {}
  const { message, context }: any = data
  console.log("message",message)

  if (!data || isObjectEmpty(data)) {
    return { [RSF_v2_apiSequence.SETTLE]: 'JSON cannot be empty' }
  }

  try {
    logger.info(`Validating Schema for ${RSF_v2_apiSequence.SETTLE} API`)
    const vs = validateSchema('rsf', RSF_v2_apiSequence.SETTLE, data)

    console.log("Schema validation err obj",data)
    console.log("Schema validation rsf obj",rsfObj)
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

  setValue('settle_context', context)
  setValue('settle_message', message)

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