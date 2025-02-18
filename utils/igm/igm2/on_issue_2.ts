import _ from 'lodash'
import { setValue, getValue } from '../../../shared/dao'
import { checkContext, isObjectEmpty } from '../../index'
import constants, { IGMApiSequence } from '../../../constants/index'
import { validateSchema } from '../../index'
import { logger } from '../../../shared/logger'
import {
  checkCreatedAtInAll,
  checkDomainInAll,
  checkOrganizationNameandDomain,
  compareContextTimeStampAndUpdatedAt,
  compareUpdatedAtAndContextTimeStamp,
} from '../igmHelpers'

const checkOnIssue = (data: any, type: string) => {
  const onissueObj: any = {}
  let res: any = {}

  try {
    const on_issue: any = data

    if (!data || isObjectEmpty(data)) {
      return { [IGMApiSequence.RET_ON_ISSUE]: 'JSON cannot be empty' }
    }

    // Schema validation
    try {
      logger.info(`Validating Schema for ${constants.RET_ONISSUE} API`)
      const vs = validateSchema('igm', constants.RET_ONISSUE, on_issue)
      if (vs !== 'error') {
        Object.assign(onissueObj, vs)
      }
    } catch (error: any) {
      logger.error(`Error occurred while performing schema validation for /${constants.RET_ONISSUE}, ${error.stack}`)
    }

    // Context validation
    logger.info(`Checking context for ${constants.RET_ONISSUE} API`)
    try {
      res = checkContext(on_issue.context, constants.RET_ONISSUE)
      if (!res.valid) {
        Object.assign(onissueObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`Error occurred while checking /${constants.RET_ONISSUE} context, ${error.stack}`)
    }

    // Transaction ID validation
    try {
      logger.info(`Comparing transaction ID of /${constants.RET_ISSUE} and /${constants.RET_ONISSUE}`)
      if (!_.isEqual(getValue('igmTxnId'), on_issue.context.transaction_id)) {
        onissueObj.igmTxnId = `Transaction ID mismatch in /${constants.RET_ISSUE} and /${constants.RET_ONISSUE}`
      }
    } catch (error: any) {
      logger.error(`Error comparing transaction ID for /${constants.RET_ISSUE} and /${constants.RET_ONISSUE}, ${error.stack}`)
    }

    // Message ID validation
    try {
      logger.info(`Comparing MESSAGE ID of /${constants.RET_ISSUE} and /${constants.RET_ONISSUE}`)
      if (!_.isEqual(getValue('igmIssueMsgId'), on_issue.context.message_id)) {
        onissueObj.igmIssueMsgId = `Message ID mismatch in /${constants.RET_ISSUE} and /${constants.RET_ONISSUE}`
      }
    } catch (error: any) {
      logger.error(`Error comparing Message ID for /${constants.RET_ISSUE} and /${constants.RET_ONISSUE}, ${error.stack}`)
    }

    // Domain validation
    try {
      logger.info(`Comparing Domain of /${constants.RET_ISSUE} and /${constants.RET_ONISSUE}`)
      if (!_.isEqual(getValue('igmDomain'), on_issue.context.domain)) {
        onissueObj.igmDomain = `Domain mismatch for /${constants.RET_ISSUE} and /${constants.RET_ONISSUE}`
      }
    } catch (error: any) {
      logger.error(`Error comparing Domain for /${constants.RET_ISSUE} and /${constants.RET_ONISSUE}, ${error.stack}`)
    }

    // Core version validation
    try {
      logger.info(`Comparing core version of /${constants.RET_ISSUE} and /${constants.RET_ONISSUE}`)
      setValue('core_version', on_issue.context.core_version)
    } catch (error: any) {
      logger.error(`Error comparing core version for /${constants.RET_ISSUE} and /${constants.RET_ONISSUE}, ${error.stack}`)
    }

    // Phone number validation
    try {
      logger.info(`Phone Number Check for /${constants.RET_ONISSUE}`)
      if (
        !_.inRange(
          on_issue?.message?.issue?.issue_actions?.respondent_actions?.[0]?.updated_by?.contact?.phone,
          1000000000,
          99999999999,
        )
      ) {
        onissueObj.Phn = `Phone Number for /${constants.RET_ONISSUE} API is not in the valid range`
      }
    } catch (error: any) {
      logger.error(`Error checking phone number for /${constants.RET_ONISSUE} API, ${error.stack}`)
    }

    // Created/Updated Time validation
    try {
      logger.info(`Checking time of creation and updation for /${constants.RET_ONISSUE}`)
      if (!_.lte(on_issue.context.timestamp, on_issue.message.issue.created_at)) {
        onissueObj.updatedTime = `Time of Creation for /${constants.RET_ONISSUE} API should be less than context timestamp`
      }
    } catch (error: any) {
      logger.error(`Error comparing time of creation and updation for /${constants.RET_ONISSUE} API, ${error.stack}`)
    }

    setValue('igmCreatedAt', on_issue.message.issue.created_at)

    // Action validations
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

    checkDomainInAll({
      endpoint: constants.RET_ONISSUE,
      domain: on_issue.context.domain,
      issueReportObj: onissueObj,
    })

    compareContextTimeStampAndUpdatedAt({
      endpoint: constants.RET_ONISSUE,
      contextTimeStamp: on_issue.context.timestamp,
      issue_updated_at: on_issue.message.issue.updated_at,
      issueReportObj: onissueObj,
    })

    setValue('onissueObj', onissueObj)

    return onissueObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`File not found for /${constants.RET_ONISSUE} API!`)
    } else {
      logger.error(`Error occurred while checking /${constants.RET_ONISSUE} API`, err)
    }
  }
}

export default checkOnIssue
