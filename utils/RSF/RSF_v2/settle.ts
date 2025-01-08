import { RSF_v2_apiSequence } from '../../../constants/index'
import _ from 'lodash'
import { isObjectEmpty } from '../../index'
import { validateSchema } from '../../index'
import { logger } from '../../../shared/logger'

const checkRsfSettle = (data: any) => {
  const rsfObj: any = {}

  if (!data || isObjectEmpty(data)) {
    return { [RSF_v2_apiSequence.SETTLE]: 'JSON cannot be empty' }
  }

  try {
    const errorObj: any = data
    logger.info(`Validating Schema for ${RSF_v2_apiSequence.SETTLE} API`)
    const vs = validateSchema('rsf', RSF_v2_apiSequence.SETTLE, errorObj)

  logger.info(`Schema validation result for ${RSF_v2_apiSequence.SETTLE}:`, vs)

  if (vs != 'error') {
    Object.assign(rsfObj, vs)
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