import constants, { RSFapiSequence } from '../../constants/index'
import _ from 'lodash'
import { isObjectEmpty } from '../index'
import { validateSchema } from '../index'
import { logger } from '../../shared/logger'
import { setValue } from '../../shared/dao'

const checkRsfSettle = (data: any) => {
  const rsfObj: any = {}

  if (!data || isObjectEmpty(data)) {
    return { [RSFapiSequence.SETTLE]: 'JSON cannot be empty' }
  }

  try {
    const settle: any = data
    logger.info(`Validating Schema for ${constants.SETTLE} API`)
    const vs = validateSchema('rsf', constants.SETTLE, settle)
    if (vs != 'error') {
      Object.assign(rsfObj, vs)
    }
    try {
    } catch (error: any) {
      logger.error(`!!Error occurred while performing schema validation for /${constants.SETTLE}_lsp, ${error.stack}`)
    }

    try {
      logger.info(
        `Storing igmTxnID igmTmpstmp igmType igmCoreVersion igmDomain igmIssueMesgId in /${constants.RET_ISSUE}`,
      ) //storing IgmTxnId IgmTmpstmp igmType igmCoreVersion igmDomain
      setValue('rsfColAppId', settle.message.settlement.settlements[0].collector_app_id)
      setValue('rsfRecAppId', settle.message.settlement.settlements[0].receiver_app_id)
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.RET_ISSUE} context, ${error.stack}`)
    }

    return rsfObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${constants.SETTLE} API!`)
    } else {
      logger.error(`!!Some error occurred while checking /${constants.SETTLE} API`, err)
    }
  }
}

export default checkRsfSettle
