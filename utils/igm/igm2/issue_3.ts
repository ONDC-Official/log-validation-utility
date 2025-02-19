import _ from 'lodash'
// import { setValue } from '../../shared/dao'
import { checkContext, isObjectEmpty, isValidUrl, isValidEmail } from '../../../utils/index'
import constants from '../../../constants/index'
import { validateSchema } from '../../../utils/index'
import { logger } from '../../../shared/logger'

const validateIssuePayload = (data: any) => {
  const issueObj: any = {}
  let res: any = {}

  if (!data || isObjectEmpty(data)) {
    return { error: 'JSON cannot be empty' }
  }

  try {
    const issue: any = data

    try {
      logger.info(`Validating Schema for ${constants.ISSUE_1} API`)
      const vs = validateSchema('igm', constants.ISSUE_1, issue)
      if (vs !== 'error') {
        Object.assign(issueObj, vs)
      }
    } catch (error: any) {
      logger.error(`Error occurred during schema validation: ${error.stack}`)
    }

    try {
      logger.info(`Checking context for ${constants.ISSUE_1} API`)
      res = checkContext(issue.context, constants.ISSUE_1)
      if (!res.valid) {
        Object.assign(issueObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`Error occurred while checking context: ${error.stack}`)
    }

    try {
      logger.info(`Validating required fields`)
      const requiredFields = ['context.domain', 'context.action', 'message.issue.status', 'message.issue.created_at', 'message.issue.updated_at']
      requiredFields.forEach(field => {
        if (!_.get(issue, field)) {
          issueObj[field] = `${field} is required`
        }
      })
    } catch (error: any) {
      logger.error(`Error validating required fields: ${error.stack}`)
    }

    try {
      logger.info(`Validating timestamps`)
      if (issue.message.issue.created_at && issue.message.issue.updated_at) {
        if (new Date(issue.message.issue.created_at) > new Date(issue.message.issue.updated_at)) {
          issueObj.createdAtValidation = 'created_at must be less than or equal to updated_at'
        }
      }
    } catch (error: any) {
      logger.error(`Error validating timestamps: ${error.stack}`)
    }

    try {
      logger.info(`Checking actions in issue`)
      issue.message.issue.actions.forEach((action: any) => {
        if (!action.updated_at) {
          issueObj[`actionUpdatedAt_${action.id}`] = `Action ID ${action.id} must have an updated_at timestamp`
        }
        if (action.ref_id && !issue.message.issue.actions.some((a: any) => a.id === action.ref_id)) {
          issueObj[`actionRefValidation_${action.id}`] = `Action ID ${action.id} has an invalid ref_id: ${action.ref_id}`
        }
      })
    } catch (error: any) {
      logger.error(`Error checking actions: ${error.stack}`)
    }

    try {
      logger.info(`Validating phone numbers`)
      issue.message.issue.actors.forEach((actor: any) => {
        if (!_.inRange(actor.info.contact.phone, 1000000000, 99999999999)) {
          issueObj[`phoneValidation_${actor.id}`] = `Phone number for actor ${actor.id} is not in a valid range`
        }
        if (!isValidEmail(actor.info.contact.email)) {
          issueObj[`emailValidation_${actor.id}`] = `Invalid email format for actor ${actor.id}`
        }
      })
    } catch (error: any) {
      logger.error(`Error validating phone numbers: ${error.stack}`)
    }

    try {
      logger.info(`Validating respondent_ids, complainant_id, and source_id exist in actors`)
      const actorIds = issue.message.issue.actors.map((actor: any) => actor.id)
      if (!actorIds.includes(issue.message.issue.complainant_id)) {
        issueObj.complainantValidation = 'complainant_id must exist in actors'
      }
      if (!actorIds.includes(issue.message.issue.source_id)) {
        issueObj.sourceIdValidation = 'source_id must exist in actors'
      }
      issue.message.issue.respondent_ids.forEach((respId: any) => {
        if (!actorIds.includes(respId)) {
          issueObj[`respondentValidation_${respId}`] = `respondent_id ${respId} must exist in actors`
        }
      })
    } catch (error: any) {
      logger.error(`Error validating respondent_ids, complainant_id, and source_id: ${error.stack}`)
    }

    try {
      logger.info(`Validating URLs`)
      if (issue.message.issue.description) {
        if (!isValidUrl(issue.message.issue.description.additional_desc?.url)) {
          issueObj.descriptionUrlValidation = 'Invalid additional description URL'
        }
        issue.message.issue.description.images?.forEach((url: any, index: number) => {
          if (!isValidUrl(url)) {
            issueObj[`descriptionImageValidation_${index}`] = `Invalid image URL: ${url}`
          }
        })
      }
      issue.message.issue.actions.forEach((action: any) => {
        action.description?.media?.forEach((media: any, index: number) => {
          if (!isValidUrl(media.url)) {
            issueObj[`actionMediaValidation_${action.id}_${index}`] = `Invalid media URL: ${media.url}`
          }
        })
      })
    } catch (error: any) {
      logger.error(`Error validating URLs: ${error.stack}`)
    }

    return issueObj
  } catch (err: any) {
    logger.error(`Unexpected error: ${err}`)
  }
}

export default validateIssuePayload
