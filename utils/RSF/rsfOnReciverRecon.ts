import constants, { RSFapiSequence } from '../../constants/index'
import _ from 'lodash'
import { isObjectEmpty } from '../index'
import { validateSchema } from '../index'
import { logger } from '../../shared/logger'
import { checkCollectorAndReciverIdSettle } from './rsfHelpers'

const checkRsfOnReceiverRecon = (data: any) => {
  const rsfObj: any = {}

  if (!data || isObjectEmpty(data)) {
    return { [RSFapiSequence.ON_RECEIVER_RECON]: 'JSON cannot be empty' }
  }

  try {
    const issue: any = data
    logger.info(`Validating Schema for ${constants.ON_RECEIVER_RECON} API`)
    const vs = validateSchema('rsf', constants.ON_RECEIVER_RECON, issue)
    if (vs != 'error') {
      Object.assign(rsfObj, vs)
    }
    try {
    } catch (error: any) {
      logger.error(
        `!!Error occurred while performing schema validation for /${constants.ON_RECEIVER_RECON}_lsp, ${error.stack}`,
      )
    }

    checkCollectorAndReciverIdSettle({
      collectorId: issue.message.orderbook.orders[0].collector_app_id,
      receiver_app_id: issue.message.orderbook.orders[0].receiver_app_id,
      endpoint: constants.ON_RECEIVER_RECON,
      issueReportObj: rsfObj,
    })

    return rsfObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${constants.ON_RECEIVER_RECON} API!`)
    } else {
      logger.error(`!!Some error occurred while checking /${constants.ON_RECEIVER_RECON} API`, err)
    }
  }
}

export default checkRsfOnReceiverRecon
