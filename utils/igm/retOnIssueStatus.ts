import _ from 'lodash'
import { setValue, getValue } from '../../shared/dao'
import { checkContext } from '../../utils/index'
import constants from '../../constants/index'
import { validateSchema } from '../../utils/index'
import { logger } from '../../shared/logger'
import {
  checkCreatedAtInAll,
  checkDomainInAll,
  checkOrganizationNameandDomain,
  compareContextTimeStampAndUpdatedAt,
  compareUpdatedAtAndContextTimeStamp,
  compareUpdatedAtForRespondantActions,
} from './igmHelpers'

const checkOnIssueStatus = (data: any) => {
  const onIssueStatusObj: any = {}
  let res: any = {}
  try {
    const onIssueStatus: any = data
    try {
      logger.info(`Validating Schema for ${constants.RET_ONISSUE_STATUS} API`)
      const vs = validateSchema('igm', constants.RET_ONISSUE_STATUS, onIssueStatus)
      if (vs != 'error') {
        Object.assign(onIssueStatusObj, vs)
      }
    } catch (error: any) {
      logger.error(
        `!!Error occurred while performing schema validation for /${constants.RET_ONISSUE_STATUS}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Checking context for /${constants.RET_ONISSUE_STATUS} API`) //checking context
      res = checkContext(onIssueStatus.context, constants.RET_ONISSUE_STATUS)
      if (!res.valid) {
        Object.assign(onIssueStatusObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.RET_ONISSUE_STATUS} context, ${error.stack}`)
    }

    try {
      logger.info(`Phone Number Check for /${constants.RET_ONISSUE_STATUS}`)

      if (
        !_.inRange(
          onIssueStatus?.message?.issue?.issue_actions?.respondent_actions?.[0]?.updated_by?.contact?.phone,
          1000000000,
          99999999999,
        )
      ) {
        onIssueStatusObj.Phn = `Phone Number for /${constants.RET_ONISSUE_STATUS} api is not in the valid Range`
      }
    } catch (error: any) {
      logger.error(`Error while checking phone number for /${constants.RET_ONISSUE_STATUS} api, ${error.stack}`)
    }

    try {
      logger.info(`Comparing transaction ID of /${constants.RET_ISSUE} and /${constants.RET_ONISSUE_STATUS}`)
      if (!_.isEqual(getValue('igmTxnId'), onIssueStatus.context.transaction_id)) {
        onIssueStatusObj.igmTxnId = `transaction ID mismatch in /${constants.RET_ISSUE} and /${constants.RET_ONISSUE_STATUS}`
      }
    } catch (error: any) {
      logger.error(
        `Error while comparing transaction ID in /${constants.RET_ISSUE} and /${constants.RET_ONISSUE_STATUS}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing MESSAGE ID of /${constants.RET_ISSUE_STATUS} and /${constants.RET_ONISSUE_STATUS}`)
      if (!_.isEqual(getValue('igmIssueStatMsgId'), onIssueStatus.context.message_id)) {
        onIssueStatusObj.igmIssueMsgId = `Message  ID mismatch in /${constants.RET_ISSUE_STATUS} and /${constants.RET_ONISSUE_STATUS}`
      }
    } catch (error: any) {
      logger.error(
        `Error while comparing Message ID in /${constants.RET_ISSUE_STATUS} and /${constants.RET_ONISSUE_STATUS}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Checking refund amount for /${constants.RET_ONISSUE_STATUS}`)
      if (
        onIssueStatus?.message?.issue?.resolution?.refund_amount &&
        onIssueStatus?.message?.issue.resolution.action_triggered != 'REFUND'
      ) {
        onIssueStatusObj.refund_amt = `Refund Amount for /${constants.RET_ONISSUE_STATUS} should only be when action type is REFUND `
      }
    } catch (error: any) {
      logger.error(`Error while checking refund amount for /${constants.RET_ONISSUE_STATUS} api, ${error.stack}`)
    }

    try {
      logger.info(`Comparing Domain of /${constants.RET_ISSUE} and /${constants.RET_ONISSUE_STATUS}`)
      if (!_.isEqual(getValue('igmDomain'), onIssueStatus.context.domain)) {
        onIssueStatusObj.igmDomain = `Domain for /${constants.RET_ISSUE} api should be equal to /${constants.RET_ONISSUE_STATUS} api`
      }
    } catch (error: any) {
      logger.error(
        `Error while comparing Domain for /${constants.RET_ISSUE} and /${constants.RET_ONISSUE_STATUS} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Phone Number Check for /${constants.RET_ONISSUE_STATUS}`)

      if (
        !_.inRange(
          onIssueStatus?.message?.issue?.issue_actions?.respondent_actions?.[0]?.updated_by?.contact?.phone,
          1000000000,
          99999999999,
        )
      ) {
        onIssueStatusObj.Phn = `Phone Number for /${constants.RET_ONISSUE_STATUS} api is not in the valid Range`
      }
    } catch (error: any) {
      logger.error(`Error while checking phone number for /${constants.RET_ONISSUE_STATUS} api, ${error.stack}`)
    }

    const respondent_actions = onIssueStatus.message.issue.issue_actions.respondent_actions

    checkOrganizationNameandDomain({
      endpoint: constants.RET_ONISSUE_STATUS,
      actionPayload: respondent_actions,
      contextSubscriberId: onIssueStatus.context.bpp_id,
      contextDomain: onIssueStatus.context.domain,
      issueReportObj: onIssueStatusObj,
      IdType: 'BPP',
    })

    compareUpdatedAtAndContextTimeStamp({
      endpoint: constants.RET_ONISSUE_STATUS,
      actionPayload: respondent_actions,
      messageUpdatedAt: onIssueStatus.message.issue.updated_at,
      issueReportObj: onIssueStatusObj,
    })

    checkCreatedAtInAll({
      endpoint: constants.RET_ONISSUE_STATUS,
      created_at: onIssueStatus.message.issue.created_at,
      issueReportObj: onIssueStatusObj,
    })

    checkDomainInAll({
      endpoint: constants.RET_ONISSUE_STATUS,
      domain: onIssueStatus.context.domain,
      issueReportObj: onIssueStatusObj,
    })

    compareUpdatedAtForRespondantActions({
      endpoint: constants.RET_ONISSUE,
      updated_at: onIssueStatus.message.issue.updated_at,
      respondent_actions: respondent_actions,
      issueReportObj: onIssueStatusObj,
    })

    compareContextTimeStampAndUpdatedAt({
      endpoint: constants.RET_ONISSUE_STATUS,
      contextTimeStamp: onIssueStatus.context.timestamp,
      issue_updated_at: onIssueStatus.message.issue.updated_at,
      issueReportObj: onIssueStatusObj,
    })

    setValue('onIssueStatusObj', onIssueStatusObj)

    // setValue("onIssueStatusObj", onIssueStatusObj);
    return onIssueStatusObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.error(`!!File not found for /${constants.RET_ONISSUE_STATUS} API!`)
    } else {
      logger.error(`!!Some error occurred while checking /${constants.RET_ONISSUE_STATUS} API`, err)
    }
  }
}

export default checkOnIssueStatus
