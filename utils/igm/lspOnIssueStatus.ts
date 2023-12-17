import _ from 'lodash'
import { getValue } from '../../shared/dao'
import { checkContext, isObjectEmpty } from '../../utils/index'
import constants, { IGMApiSequence } from '../../constants/index'
import { validateSchema } from '../../utils/index'
import { logger } from '../../shared/logger'
import getLspIssueMessage from '../messages_constants'
import { checkOrganizationNameandDomain, compareContextTimeStampAndUpdatedAt } from './igmHelpers'

const checkLspOnIssueStatus = (data: any) => {
  const issueObj: any = {}

  const message = getLspIssueMessage(constants.RET_ONISSUE_STATUS)

  if (!data || isObjectEmpty(data)) {
    return { [IGMApiSequence.LSP_ON_ISSUE_STATUS]: 'Json cannot be empty' }
  }

  try {
    const issue: any = data

    try {
      logger.info(`Validating Schema for lsp_${constants.RET_ONISSUE_STATUS} API`)

      const vs = validateSchema('igm', constants.RET_ONISSUE_STATUS, issue)

      if (vs != 'error') {
        Object.assign(issueObj, vs)
      }
    } catch (error: any) {
      logger.error(
        `!!Error occurred while performing schema validation for /${constants.RET_ONISSUE_STATUS}_lsp, ${error.stack}`,
      )
    }

    try {
      logger.info(`Checking context for ${constants.RET_ONISSUE_STATUS} API`) //checking context
      var res: any = checkContext(issue.context, constants.RET_ONISSUE_STATUS)
      if (!res.valid) {
        Object.assign(issueObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`Some error occurred while checking /${constants.RET_ONISSUE_STATUS}_lsp context, ${error.stack}`)
    }

    try {
      logger.info(`comparing transaction id with stored id in the db in /${constants.RET_ONISSUE_STATUS}`)

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
      logger.error(`!!Some error occurred while checking /${constants.RET_ONISSUE_STATUS}_lsp context, ${error.stack}`)
    }

    try {
      logger.info(`checking updated_at and last respondent_action's updated_at /${constants.RET_ONISSUE_STATUS}`)

      const respondent_action = issue.message.issue.issue_actions.respondent_actions

      if (respondent_action[respondent_action.length - 1].updated_at !== issue.message.issue.updated_at) {
        issueObj.updated_at = message.updatedAtInRespondentAction
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.RET_ONISSUE_STATUS}_lsp message, ${error.stack}`)
    }

    const respondent_actions = issue.message.issue.issue_actions.respondent_actions

    checkOrganizationNameandDomain({
      endpoint: constants.RET_ONISSUE,
      actionPayload: respondent_actions,
      contextSubscriberId: issue.context.bap_id,
      contextDomain: issue.context.domain,
      issueReportObj: issueObj,
    })
    compareContextTimeStampAndUpdatedAt({
      endpoint: constants.RET_ONISSUE,
      contextTimeStamp: issue.context.timestamp,
      issue_updated_at: issue.message.issue.updated_at,
      issueReportObj: issueObj,
    })

    try {
      logger.info(`checking respondent action, and is RESOLVED, Resolution object /${constants.RET_ONISSUE_STATUS}`)

      const respondent_actions = issue.message.issue.issue_actions.respondent_actions
      if (respondent_actions.length === 0) {
        issueObj.respondent_action = message.respondent_action_required
      }

      if (respondent_actions[respondent_actions.length - 1].respondent_action === 'RESOLVED') {
        if (!_.has(issue.message.issue, 'resolution_provider')) {
          issueObj.resolution_provider = message.resolution_provider
        } else {
          if (_.has(issue.message.issue.resolution_provider, 'respondant_info')) {
            const respondant_info = issue.message.issue.resolution_provider.respondent_info

            if (respondant_info.type !== 'CASCADED-COUNTERPARTY-NP') {
              issueObj.respondant_info = message.respondent_info
            }
          }
        }
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.RET_ONISSUE_STATUS}_lsp message, ${error.stack}`)
    }

    return issueObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${constants.RET_ONISSUE_STATUS}_lsp API!`)
    } else {
      logger.error(`!!Some error occurred while checking /${constants.RET_ONISSUE_STATUS} API`, err)
    }
  }
}

export default checkLspOnIssueStatus
