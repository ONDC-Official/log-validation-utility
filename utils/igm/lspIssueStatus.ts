import getLspIssueMessage from '../messages_constants'
import { getValue } from '../../shared/dao'
import { checkContext, isObjectEmpty } from '../../utils/index'
import constants, { IGMApiSequence } from '../../constants/index'
import { validateSchema } from '../../utils/index'
import { logger } from '../../shared/logger'

const checkLspIssueStatus = (data: any) => {
  const issueObj: any = {}
  const res: any = {}
  const message = getLspIssueMessage(constants.RET_ISSUE_STATUS)

  if (!data || isObjectEmpty(data)) {
    return { [IGMApiSequence.RET_ISSUE_STATUS]: 'Json cannot be empty' }
  }

  try {
    const issue: any = data
    try {
      logger.info(`Validating Schema for ${constants.RET_ISSUE_STATUS} API`)

      const vs = validateSchema('igm', constants.RET_ISSUE_STATUS, issue)

      if (vs != 'error') {
        Object.assign(issueObj, vs)
      }
    } catch (error: any) {
      logger.error(
        `!!Error occurred while performing schema validation for /${constants.RET_ISSUE_STATUS}_lsp, ${error.stack}`,
      )
    }

    try {
      logger.info(`Checking context for ${constants.RET_ISSUE_STATUS} API`) //checking context
      const res: any = checkContext(issue.context, constants.RET_ISSUE_STATUS)
      if (!res.valid) {
        Object.assign(issueObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`Some error occurred while checking /${constants.RET_ISSUE_STATUS} context, ${error.stack}`)
    }

    try {
      logger.info(`comparing transaction i with stored id in the db in /${constants.RET_ISSUE_STATUS}`)

      // msgIdSet.add(issue.context.message_id);
      if (!res.valid) {
        Object.assign(issueObj, res.ERRORS)
      }

      // checking transaction id
      const transaction_id = getValue('igmTxnId')

      if (transaction_id === issue.context.transaction_id) {
        issueObj.transaction_id = message.transaction_id_issue_message
      }

      const sellerBppId = getValue('seller_bpp_id')

      const sellerBppuri = getValue('seller_bpp_uri')

      if (sellerBppId !== issue.context.bap_id) {
        issueObj.bpp_id = message.bap_id
      }

      if (sellerBppuri !== issue.context.bap_uri) {
        issueObj.bpp_uri = message.bap_uri
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.RET_ISSUE_STATUS} context, ${error.stack}`)
    }

    return issueObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${constants.RET_ISSUE_STATUS}_lsp API!`)
    } else {
      logger.error(`!!Some error occurred while checking /${constants.RET_ISSUE_STATUS} API`, err)
    }
  }
}

export default checkLspIssueStatus
