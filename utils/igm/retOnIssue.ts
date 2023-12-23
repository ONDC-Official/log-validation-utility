import _ from 'lodash'
import { setValue, getValue } from '../../shared/dao'
import { checkContext, isObjectEmpty } from '../../utils/index'
import constants, { IGMApiSequence } from '../../constants/index'
import { validateSchema } from '../../utils/index'
import { logger } from '../../shared/logger'
import {
  checkCreatedAtInAll,
  checkDomainInAll,
  checkOrganizationNameandDomain,
  compareContextTimeStampAndUpdatedAt,
  compareUpdatedAtAndContextTimeStamp,
} from './igmHelpers'

const checkOnIssue = (data: any) => {
  const onissueObj: any = {}
  let res: any = {}
  try {
    const on_issue: any = data

    if (!data || isObjectEmpty(data)) {
      return { [IGMApiSequence.RET_ON_ISSUE]: 'Json cannot be empty' }
    }

    try {
      logger.info(`Validating Schema for ${constants.RET_ONISSUE} API`)
      const vs = validateSchema('igm', constants.RET_ONISSUE, on_issue)
      if (vs != 'error') {
        Object.assign(onissueObj, vs)
      }
    } catch (error: any) {
      logger.error(`!!Error occurred while performing schema validation for /${constants.RET_ONISSUE}, ${error.stack}`)
    }

    logger.info(`Checking context for ${constants.RET_ONISSUE} API`) //checking context
    try {
      res = checkContext(on_issue.context, constants.RET_ONISSUE)
      if (!res.valid) {
        Object.assign(onissueObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`Some error occurred while checking /${constants.RET_ONISSUE} context, ${error.stack}`)
    }

    try {
      logger.info(`Comparing transaction ID of /${constants.RET_ISSUE} and /${constants.RET_ONISSUE}`)
      if (!_.isEqual(getValue('igmTxnId'), on_issue.context.transaction_id)) {
        onissueObj.igmTxnId = `transaction  ID mismatch in /${constants.RET_ISSUE} and /${constants.RET_ONISSUE}`
      }
    } catch (error: any) {
      logger.error(
        `Error while comparing transaction ID in /${constants.RET_ISSUE} and /${constants.RET_ONISSUE}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing MESSAGE ID of /${constants.RET_ISSUE} and /${constants.RET_ONISSUE}`)
      if (!_.isEqual(getValue('igmIssueMsgId'), on_issue.context.message_id)) {
        onissueObj.igmIssueMsgId = `Message  ID mismatch in /${constants.RET_ISSUE} and /${constants.RET_ONISSUE}`
      }
    } catch (error: any) {
      logger.error(
        `Error while comparing Message ID in /${constants.RET_ISSUE} and /${constants.RET_ONISSUE}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing Domain of /${constants.RET_ISSUE} and /${constants.RET_ONISSUE}`)
      if (!_.isEqual(getValue('igmDomain'), on_issue.context.domain)) {
        onissueObj.igmDomain = `Domain for /${constants.RET_ISSUE} api should be equal to /${constants.RET_ONISSUE} api`
      }
    } catch (error: any) {
      logger.error(
        `Error while comparing Domain for /${constants.RET_ISSUE} and /${constants.RET_ONISSUE} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing core version of /${constants.RET_ISSUE} and /${constants.RET_ONISSUE}`)
      setValue('core_version', on_issue.context.core_version)
    } catch (error: any) {
      logger.error(
        `Error while comparing core version for /${constants.RET_ISSUE} and /${constants.RET_ONISSUE} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Phone Number Check for /${constants.RET_ONISSUE}`)

      if (
        !_.inRange(
          on_issue?.message?.issue?.issue_actions?.respondent_actions?.[0]?.updated_by?.contact?.phone,
          1000000000,
          99999999999,
        )
      ) {
        onissueObj.Phn = `Phone Number for /${constants.RET_ONISSUE} api is not in the valid Range`
      }
    } catch (error: any) {
      logger.error(`Error while checking phone number for /${constants.RET_ONISSUE} api, ${error.stack}`)
    }

    // try {
    //   logger.info(
    //     `Checking time of creation and updation for /${constants.RET_ONISSUE}`
    //   );
    //   if (!_.lte(issue.context.timestamp, on_issue.message.issue.created_at)) {
    //     onissueObj.updatedTime = `Time of Creation for /${constants.RET_ONISSUE} api should be less than context timestamp`;
    //   }
    // } catch (error:any) {
    //   logger.error(
    //     `Error while checking time of creation and updation for /${constants.RET_ONISSUE} api, ${error.stack}`
    //   );
    // }
    setValue('igmCreatedAt', on_issue.message.issue.created_at)

    const respondent_actions = on_issue.message.issue.issue_actions.respondent_actions

    checkOrganizationNameandDomain({
      endpoint: constants.RET_ONISSUE,
      actionPayload: respondent_actions,
      contextSubscriberId: on_issue.context.bpp_id,
      contextDomain: on_issue.context.domain,
      issueReportObj: onissueObj,
      IdType: 'BPP',
    })

    compareUpdatedAtAndContextTimeStamp({
      endpoint: constants.RET_ONISSUE,
      actionPayload: respondent_actions,
      messageUpdatedAt: on_issue.message.issue.updated_at,
      issueReportObj: onissueObj,
    })

    checkCreatedAtInAll({
      endpoint: constants.RET_ONISSUE,
      created_at: on_issue.message.issue.created_at,
      issueReportObj: onissueObj,
    })

    checkDomainInAll({ endpoint: constants.RET_ONISSUE, domain: on_issue.context.domain, issueReportObj: onissueObj })

    compareContextTimeStampAndUpdatedAt({
      endpoint: constants.RET_ONISSUE,
      contextTimeStamp: on_issue.context.timestamp,
      issue_updated_at: on_issue.message.issue.updated_at,
      issueReportObj: onissueObj,
    })

    setValue('onissueObj', onissueObj)

    // setValue("onissueObj", onissueObj);
    return onissueObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${constants.RET_ONISSUE} API!`)
    } else {
      logger.error(`!!Some error occurred while checking /${constants.RET_ONISSUE} API`, err)
    }
  }
}

export default checkOnIssue
