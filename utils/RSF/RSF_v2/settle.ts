import { RSF_v2_apiSequence } from '../../../constants/index'
import _ from 'lodash'
import { isObjectEmpty } from '../../index'
import { validateSchema } from '../../index'
import { logger } from '../../../shared/logger'
import { CompareTimeStamps } from '../rsfHelpers'

const checkRsfSettle = (data: any) => {
  const rsfObj: any = {}

  if (!data || isObjectEmpty(data)) {
    return { [RSF_v2_apiSequence.SETTLE]: 'JSON cannot be empty' }
  }

  try {
    const errorObj: any = data
    logger.info(`Validating Schema for ${RSF_v2_apiSequence.SETTLE} API`)
    const vs = validateSchema('rsf', RSF_v2_apiSequence.SETTLE, errorObj)
    if (vs != 'error') {
      Object.assign(rsfObj, vs)
    }
    try {
    } catch (error: any) {
      logger.error(
        `!!Error occurred while performing schema validation for /${RSF_v2_apiSequence.SETTLE}, ${error.stack}`,
      )
    }
    errorObj.message.orderbook.orders.forEach((order: any) => {
      CompareTimeStamps({
        CreatedAt: order.created_at,
        contextTimeStamp: errorObj.context.timestamp,
        UpdatedAt: order.updated_at,
        issueReportObj: rsfObj,
      })
    })
    return rsfObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${RSF_v2_apiSequence.SETTLE} API!`)
    } else {
      logger.error(`!!Some error occurred while checking /${RSF_v2_apiSequence.SETTLE} API`, err)
    }
  }
}

export default checkRsfSettle