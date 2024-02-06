import _ from 'lodash'
import { setValue } from '../../shared/dao'
import { checkContext, isObjectEmpty } from '../../utils/index'
import constants, { IGMApiSequence } from '../../constants/index'
import { validateSchema } from '../../utils/index'
import { logger } from '../../shared/logger'
import { compareContextTimeStampAndUpdatedAt } from './igmHelpers'
const checkIssueClose = (data: any) => {
  const issueObj: any = {}
  let res: any = []

  if (!data || isObjectEmpty(data)) {
    return { [IGMApiSequence.RET_ISSUE]: 'JSON cannot be empty' }
  }

  try {
    const issue: any = data

    try {
      logger.info(`Validating Schema for ${constants.RET_ISSUE}_close API`)
      const vs = validateSchema('igm', `${constants.RET_ISSUE}_close`, issue)
      if (vs != 'error') {
        Object.assign(issueObj, vs)
      }
    } catch (error: any) {
      logger.error(
        `!!Error occurred while performing schema validation for /${constants.RET_ISSUE}_close, ${error.stack}`,
      )
    }

    try {
      logger.info(`Checking context for ${constants.RET_ISSUE}_close API`) //checking context
      res = checkContext(issue.context, `${constants.RET_ISSUE}`)
      if (!res.valid) {
        Object.assign(issueObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`Some error occurred while checking /${constants.RET_ISSUE}_close context, ${error.stack}`)
    }

    try {
      logger.info(`Phone Number Check for /${constants.RET_ISSUE}`)
      if (
        !_.inRange(
          issue.message.issue.issue_actions.complainant_actions?.[0].updated_by?.contact?.phone,
          1000000000,
          99999999999,
        )
      ) {
        issueObj.phone = `Phone Number for /${constants.RET_ISSUE}_close api is not in the valid Range`
      }

      setValue('igmPhn', issue.message.issue.issue_actions.complainant_actions?.[0].updated_by?.contact?.phone)
    } catch (error: any) {
      logger.error(`Error while checking phone number for /${constants.RET_ISSUE}_close api, ${error.stack}`)
    }

    try {
      logger.info(`Checking time of creation and updation for /${constants.RET_ISSUE}_close`)

      compareContextTimeStampAndUpdatedAt({
        endpoint: `${constants.RET_ISSUE}_close`,
        contextTimeStamp: issue.context.timestamp,
        issue_updated_at: issue.message.issue.updated_at,
        issueReportObj: issueObj,
      })

      setValue('igmCreatedAt', issue.message.issue.created_at)
    } catch (error: any) {
      logger.error(
        `Error while checking time of creation and updation for /${constants.RET_ISSUE}_close api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Checking organization's name for /${constants.RET_ISSUE}_close`)
      const org_name = issue.message.issue.issue_actions.complainant_actions[0].updated_by.org.name
      const org_id = org_name.split('::')
      if (!_.isEqual(issue.context.bap_id, org_id[0])) {
        issueObj.org_name = `Organization's Name for /${constants.RET_ISSUE}_close api mismatched with bap id`
      }

      if (!_.lte(issue.context.domain, org_id[1])) {
        issueObj.org_domain = `Domain of organization for /${constants.RET_ISSUE}_close api mismatched with domain in context`
      }
    } catch (error: any) {
      logger.error(`Error while checking organization's name for /${constants.RET_ISSUE}_close api, ${error.stack}`)
    }

    return issueObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${constants.RET_ISSUE}_close API!`)
    } else {
      logger.error(`!!Some error occurred while checking /${constants.RET_ISSUE} API`, err)
    }
  }
}

export default checkIssueClose
