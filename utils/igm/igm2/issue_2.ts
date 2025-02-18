import _ from 'lodash'
import { checkContext, isObjectEmpty } from '../../../utils/index'
import constants from '../../../constants/index'
import { validateSchema } from '../../../utils/index'
import { logger } from '../../../shared/logger'
import issue_subcategory from '../../issue_subcategories'
import {
  checkOrganizationNameandDomain,
  compareContextTimeStampAndUpdatedAt,
  compareCreatedAtAndUpdationTime,
  compareUpdatedAtAndContextTimeStamp,
} from '../igmHelpers'

const validateIssuePayload = (data: any) => {
  const issueObj: any = {}
  let res: any = {}

  if (!data || isObjectEmpty(data)) {
    return { error: 'JSON cannot be empty' }
  }

  try {
    const issue: any = data

    try {
      logger.info(`Validating Schema for ${constants.RET_ISSUE} API`)
      const vs = validateSchema('igm', constants.RET_ISSUE, issue)
      if (vs !== 'error') {
        Object.assign(issueObj, vs)
      }
    } catch (error: any) {
      logger.error(`Error occurred during schema validation: ${error.stack}`)
    }

    try {
      logger.info(`Checking context for ${constants.RET_ISSUE} API`)
      res = checkContext(issue.context, constants.RET_ISSUE)
      if (!res.valid) {
        Object.assign(issueObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`Error occurred while checking context: ${error.stack}`)
    }

    try {
      logger.info(`Validating timestamps`)
      if (!issue.message.issue.created_at) {
        issueObj.createdAt = 'created_at is required'
      }
      if (!issue.message.issue.updated_at) {
        issueObj.updatedAt = 'updated_at is required'
      }
    } catch (error: any) {
      logger.error(`Error validating timestamps: ${error.stack}`)
    }

    try {
      logger.info(`Checking actions in issue`)
      issue.message.issue.actions.forEach((action: any) => {
        if (!action.updated_at) {
          issueObj.actionUpdatedAt = `Action ID ${action.id} must have an updated_at timestamp`
        }
      })
    } catch (error: any) {
      logger.error(`Error checking actions: ${error.stack}`)
    }

    try {
      logger.info(`Validating phone numbers`)
      issue.message.issue.actors.forEach((actor: any) => {
        if (!_.inRange(actor.info.contact.phone, 1000000000, 99999999999)) {
          issueObj.phoneValidation = `Phone number for actor ${actor.id} is not in a valid range`
        }
      })
    } catch (error: any) {
      logger.error(`Error validating phone numbers: ${error.stack}`)
    }

    return issueObj
  } catch (err: any) {
    logger.error(`Unexpected error: ${err}`)
  }
}

export default validateIssuePayload
