import constants, { RSFapiSequence } from '../../constants/index'
import _ from 'lodash'
import { isObjectEmpty } from '../../utils/index'
import { validateSchema } from '../../utils/index'
import { logger } from '../../shared/logger'

const checkOnReceiverRecon = (data: any) => {
  const issueObj: any = {}

  if (!data || isObjectEmpty(data)) {
    return { [RSFapiSequence.ON_RECEIVER_RECON]: 'JSON cannot be empty' }
  }

  try {
    const issue: any = data
    logger.info(`Validating Schema for ${constants.ON_RECEIVER_RECON} API`)
    const vs = validateSchema('rsf', constants.ON_RECEIVER_RECON, issue)
    if (vs != 'error') {
      Object.assign(issueObj, vs)
    }
    try {
    } catch (error: any) {
      logger.error(
        `!!Error occurred while performing schema validation for /${constants.ON_RECEIVER_RECON}_lsp, ${error.stack}`,
      )
    }
    return issueObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${constants.ON_RECEIVER_RECON} API!`)
    } else {
      logger.error(`!!Some error occurred while checking /${constants.ON_RECEIVER_RECON} API`, err)
    }
  }
}

export default checkOnReceiverRecon
