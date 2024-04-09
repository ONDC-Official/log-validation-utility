import constants, { RSFapiSequence } from '../../constants/index'
import _ from 'lodash'
import { isObjectEmpty } from '../index'
import { validateSchema } from '../index'
import { logger } from '../../shared/logger'
import { CompareTimeStamps, checkCollectorAndReciverIdSettle } from './rsfHelpers'

const checkRsfReceiverRecon = (data: any) => {
  const rsfObj: any = {}

  if (!data || isObjectEmpty(data)) {
    return { [RSFapiSequence.RECEIVER_RECON]: 'JSON cannot be empty' }
  }

  try {
    const issue: any = data
    logger.info(`Validating Schema for ${constants.RECEIVER_RECON} API`)
    const vs = validateSchema('rsf', constants.RECEIVER_RECON, issue)
    if (vs != 'error') {
      Object.assign(rsfObj, vs)
    }
    try {
    } catch (error: any) {
      logger.error(
        `!!Error occurred while performing schema validation for /${constants.RECEIVER_RECON}_lsp, ${error.stack}`,
      )
    }
    issue.message.orderbook.orders.forEach((order: any) => {
      CompareTimeStamps({
        CreatedAt: order.created_at,
        contextTimeStamp: issue.context.timestamp,
        UpdatedAt: order.updated_at,
        issueReportObj: rsfObj,
      })
    })

    checkCollectorAndReciverIdSettle({
      collectorId: issue.message.orderbook.orders[0].collector_app_id,
      receiver_app_id: issue.message.orderbook.orders[0].receiver_app_id,
      endpoint: constants.RECEIVER_RECON,
      issueReportObj: rsfObj,
    })

    return rsfObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${constants.RECEIVER_RECON} API!`)
    } else {
      logger.error(`!!Some error occurred while checking /${constants.RECEIVER_RECON} API`, err)
    }
  }
}

export default checkRsfReceiverRecon
