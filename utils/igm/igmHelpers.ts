import { logger } from '../../shared/logger'
import _ from 'lodash'
import { setValue, getValue } from '../../shared/dao'

/**
 * @description Compare organization's name and domain with context information and report discrepancies.
 * @param {string} endpoint - The API endpoint being checked.
 * @param {Object[]} actionPayload - An array of action objects to compare.
 * @param {string} contextSubscriberId - The context subscriber ID, which can be a BAP ID or BPP ID.
 * @param {string} contextDomain - The context domain information.
 * @param {Object} issueReportObj - An object to collect and report discrepancies.
 */
export function checkOrganizationNameandDomain({
  endpoint,
  actionPayload,
  contextSubscriberId,
  contextDomain,
  issueReportObj,
}: {
  endpoint: string
  actionPayload: any
  contextSubscriberId: string
  contextDomain: string
  issueReportObj: any
}) {
  try {
    logger.info(`Checking organization's name for /${endpoint}_close`)

    const actionType = Object.keys(actionPayload[0]).includes('complainant_action')
      ? 'complainant_actions'
      : 'respondent_actions'

    for (const [index, action] of actionPayload.entries()) {
      let org_name = action.updated_by.org.name
      let org_id = org_name.split('::')

      if (!_.isEqual(contextSubscriberId, org_id[0])) {
        issueReportObj.org_name = `Organization's Name for /${endpoint} api in message/issue/issue_actions/${actionType}/[${index}] mismatched with BAP ID`
      }

      if (!_.lte(contextDomain, org_id[1])) {
        issueReportObj.org_domain = `Domain of organization for /${endpoint} api in message/issue/issue_actions/${actionType}/[${index}] mismatched with domain in context`
      }
    }
  } catch (error: any) {
    logger.error(`Error while checking organization's name for /${endpoint}_close api, ${error.stack}`)
  }
}

/**
 * @description Compare the 'updated_at' property of lastactions with 'messageUpdatedAt' and report discrepancies.
 * @param {string} endpoint - The API endpoint being checked.
 * @param {Object[]} actionPayload - An array of action objects to compare.
 * @param {string} messageUpdatedAt - The timestamp from the message context.
 * @param {Object} issueReportObj - An object to collect and report discrepancies.
 */
export function compareUpdatedAtAndContextTimeStamp({
  endpoint,
  actionPayload,
  messageUpdatedAt,
  issueReportObj,
}: {
  endpoint: string
  actionPayload: any
  messageUpdatedAt: string
  issueReportObj: any
}) {
  try {
    const actionType = Object.keys(actionPayload[0]).includes('complainant_action')
      ? 'complainant_actions'
      : 'respondent_actions'

    logger.info(`Checking 'updated_at' and last ${actionType}'s 'updated_at' for /${endpoint}`)

    //TODO: need to confirm this condition
    // !_.isEqual(actionPayload[actionPayload.length - 1].updated_at, messageUpdatedAt) &&
    //   !messageUpdatedAt > actionPayload[actionPayload.length - 1].updated_at

    if (!_.isEqual(actionPayload[actionPayload.length - 1].updated_at, messageUpdatedAt)) {
      issueReportObj.updated_at = `The 'updated_at' of message/issue/issue_action/${actionType}/index[${
        actionPayload.length - 1
      }]/updated_at should be the same as 'message/issue/update_at' in ${endpoint}`
    }
  } catch (error: any) {
    logger.error(`Error occurred while checking /${endpoint} message, ${error.stack}`)
  }
}

/**
 * @function compareCreationAndUpdationTime
 * should be used only for issue endpoint
 * @description Compare creation time, update time, and other conditions for a specific endpoint.
 * @param {string} endpoint - The API endpoint being checked.
 * @param {string} created_at - The creation timestamp.
 * @param {string} contextTimeStamp - The context timestamp.
 * @param {string} messageUpdatedAt - The message update timestamp.
 * @param {Object[]} responsdentActions - An array of respondent actions.
 * @param {string} domain - The domain from context.
 * @param {Object} issueReportObj - An object to collect and report discrepancies.
 */
export function compareCreatedAtAndUpdationTime({
  endpoint,
  created_at,
  contextTimeStamp,
  messageUpdatedAt,
  domain,
  issueReportObj,
}: {
  endpoint: string
  created_at: string
  contextTimeStamp: string
  messageUpdatedAt: string
  domain: string
  issueReportObj: any
}) {
  try {
    logger.info(`Checking time of creation and updation for /${endpoint}`)

    if (!_.isEqual(created_at, messageUpdatedAt)) {
      issueReportObj.respTime = `Time of creation (created_at) and time of updation for /${endpoint} api should be the same`

      if (!_.lte(created_at, contextTimeStamp)) {
        issueReportObj.updatedTime = `created_at for /${endpoint} api should be less than context.timestamp`
      }
    }

    if (endpoint === 'issue') {
      setValue('issueCreatedAt', created_at)
      setValue('issuedomain', domain)
    }
  } catch (error) {
    logger.error(`Error occurred while checking time of creation and updation for /${endpoint} api, ${endpoint}`)
  }
}

/**
 * @description Check if 'created_at' matches issue's 'created_at'.
 * @param {string} endpoint - The API endpoint being checked.
 * @param {string} created_at - The creation timestamp.
 * @param {Object} issueReportObj - An object to collect and report discrepancies.
 */
export function checkCreatedAtInAll({
  endpoint,
  created_at,
  issueReportObj,
}: {
  endpoint: string
  created_at: string
  issueReportObj: any
}) {
  try {
    logger.info(`Checking 'created_at' for /${endpoint}`)

    const issue_created_at = getValue('issueCreatedAt')

    if (created_at !== issue_created_at) {
      issueReportObj.created_at = `'created_at' should match issue's 'created_at'`
    }
  } catch (error: any) {
    logger.error(`Error occurred while checking 'created_at' for /${endpoint}_close api, ${error.stack}`)
  }
}

/**
 * @description Check if 'created_at' matches issue's 'created_at'.
 * @param {string} endpoint - The API endpoint being checked.
 * @param {string} contextTimeStamp - The creation timestamp.
 * @param {string} issue_updated_at - The issue updated time stamp
 * @param {Object} issueReportObj - An object to collect and report discrepancies.
 */
export function compareContextTimeStampAndUpdatedAt({
  endpoint,
  contextTimeStamp,
  issue_updated_at,
  issueReportObj,
}: {
  endpoint: string
  contextTimeStamp: string
  issue_updated_at: string
  issueReportObj: any
}) {
  try {
    logger.info(`Checking 'comparing 'context_timstamp' and updated_at' for /${endpoint}`)

    if (!_.gte(contextTimeStamp, issue_updated_at)) {
      issueReportObj.created_at = `context timestamp should be greater than or equal to updated_at in ${endpoint}`
    }
  } catch (error: any) {
    logger.error(
      `Error occurred while comparing 'context_timstamp' and updated_at for /${endpoint}_close api, ${error.stack}`,
    )
  }
}

/**
 * @description Check if the provided domain code is the same across all APIs.
 * @param {string} endpoint - The API endpoint being checked.
 * @param {string} domain - The domain from the context to be checked.
 * @param {Object} issueReportObj - An object to collect and report discrepancies.
 */
export function checkDomainInAll({
  endpoint,
  domain,
  issueReportObj,
}: {
  endpoint: string
  domain: string
  issueReportObj: any
}) {
  try {
    logger.info(`Checking domain for /${endpoint}`)
    const issue_domain = getValue('issuedomain')
    if (domain !== issue_domain) {
      issueReportObj.domain = `Domain code provided should be the same across all APIs.`
    }
  } catch (error: any) {
    logger.error(`Error occurred while checking domain for /${endpoint}_close api, ${error.stack}`)
  }
}
