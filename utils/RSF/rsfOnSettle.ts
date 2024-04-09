import constants, { RSFapiSequence } from '../../constants/index'
import _ from 'lodash'
import { isObjectEmpty } from '../index'
import { validateSchema } from '../index'
import { logger } from '../../shared/logger'
import { checkCollectorAndReciverIdSettle } from './rsfHelpers'

const checkRsfOnSettle = (data: any) => {
  const rsfObj: any = {}

  if (!data || isObjectEmpty(data)) {
    return { [RSFapiSequence.ON_SETTLE]: 'JSON cannot be empty' }
  }

  try {
    const on_settle: any = data
    logger.info(`Validating Schema for ${constants.ON_SETTLE} API`)
    const vs = validateSchema('rsf', constants.ON_SETTLE, on_settle)
    if (vs != 'error') {
      Object.assign(rsfObj, vs)
    }
    try {
    } catch (error: any) {
      logger.error(
        `!!Error occurred while performing schema validation for /${constants.ON_SETTLE}_lsp, ${error.stack}`,
      )
    }

    checkCollectorAndReciverIdSettle({
      collectorId: on_settle.message.settlement.settlements[0].collector_app_id,
      receiver_app_id: on_settle.message.settlement.settlements[0].receiver_app_id,
      endpoint: constants.ON_SETTLE,
      issueReportObj: rsfObj,
    })

    return rsfObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${constants.ON_SETTLE} API!`)
    } else {
      logger.error(`!!Some error occurred while checking /${constants.ON_SETTLE} API`, err)
    }
  }
}

export default checkRsfOnSettle
