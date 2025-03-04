import _ from 'lodash'
import { getValue, setValue } from '../../../shared/dao'
import { checkContext, isObjectEmpty } from '../../../utils/index'
import { IGM2Sequence } from '../../../constants/index'
import { validateSchema } from '../../../utils/index'
import { logger } from '../../../shared/logger'
import { validateRefs } from './common/refs'
import { validateActions } from './common/actions'
import { validateActors } from './common/actors'

/**
 * Validates transaction and issue ID consistency
 */
const validateConsistency = (context: any, message: any, errorObj: any) => {
  // Check transaction_id consistency
  const storedTxnId = getValue('igmTxnId')
  if (storedTxnId && context.transaction_id !== storedTxnId) {
    errorObj.transaction_id = `Transaction ID ${context.transaction_id} should match with the stored transaction ID: ${storedTxnId}`
  }
  
  // Check issue_id consistency
  const storedIssueId = getValue('issueId')
  if (storedIssueId && message.issue.id !== storedIssueId) {
    errorObj.issue_id = `Issue ID ${message.issue.id} should match with the stored issue ID: ${storedIssueId}`
  }
}

/**
 * Validates message ID uniqueness
 */
const validateMessageIdUniqueness = (context: any, errorObj: any) => {
  const storedMsgIds = getValue('msgIds') || []
  if (storedMsgIds.includes(context.message_id)) {
    errorObj.message_id = `Message ID should be unique, but ${context.message_id} was already used`
  } else {
    storedMsgIds.push(context.message_id)
    setValue('msgIds', storedMsgIds)
  }
}

/**
 * Validates timestamps in the issue
 */
const validateTimestamps = (message: any, context: any, errorObj: any) => {
  // created_at cannot be greater than updated_at
  if (new Date(message.issue.created_at) > new Date(message.issue.updated_at)) {
    errorObj.timestamp = 'created_at cannot be greater than updated_at'
  }

  // updated_at should be equal or greater than context/timestamp
  if (new Date(message.issue.updated_at) < new Date(context.timestamp)) {
    errorObj.timestamp_validation = 'Issue updated_at should be equal to or greater than context timestamp'
  }
}

/**
 * Validates the issue status
 */
const validateStatus = (message: any, errorObj: any) => {
  const allowedStatuses = ['OPEN', 'CLOSED', 'PROCESSING', 'RESOLVED']
  if (!allowedStatuses.includes(message.issue.status)) {
    errorObj.status = `Issue status must be one of: ${allowedStatuses.join(', ')}, found: ${message.issue.status}`
  }
}

/**
 * Validates respondent_ids against actors
 */
const validateRespondentIds = (message: any, errorObj: any) => {
  if (!message.issue.respondent_ids || message.issue.respondent_ids.length === 0) return
  
  if (!message.issue.actors || message.issue.actors.length === 0) {
    errorObj.respondent_ids = 'respondent_ids are specified but no actors are present'
    return
  }
  
  const actorIds = message.issue.actors.map((actor: any) => actor.id)
  const invalidRespondentIds = message.issue.respondent_ids.filter((id: string) => !actorIds.includes(id))
  
  if (invalidRespondentIds.length > 0) {
    errorObj.respondent_ids = `The following respondent_ids are not present in actors: ${invalidRespondentIds.join(', ')}`
  }
}

/**
 * Validates the last_action_id and updated_at with actions array
 */
const validateLastAction = (message: any, errorObj: any) => {
  if (!message.issue.actions || message.issue.actions.length === 0) {
    if (message.issue.last_action_id) {
      errorObj.missing_actions = 'last_action_id is specified but no actions are present'
    }
    return
  }
  
  const lastAction = message.issue.actions[message.issue.actions.length - 1]
  
  // updated_at should be equal or less than last action's updated_at
  if (new Date(message.issue.updated_at) > new Date(lastAction.updated_at)) {
    errorObj.updated_at_sequence = 'Issue updated_at should be equal to or less than the last action\'s updated_at'
  }
  
  // last_action_id should match the last action's id
  if (message.issue.last_action_id !== lastAction.id) {
    errorObj.last_action_id = `last_action_id (${message.issue.last_action_id}) should match the id of the last action (${lastAction.id})`
  }
}

/**
 * Validates description object
 */
const validateDescription = (message: any, errorObj: any) => {
  if (!message.issue.description) return
  
  if (!message.issue.description.code || !message.issue.description.short_desc) {
    errorObj.description = 'description must contain code and short_desc'
  }
  
  if (message.issue.description.images) {
    if (!Array.isArray(message.issue.description.images)) {
      errorObj.images = 'images must be an array'
    } else {
      // Validate each image URL
      message.issue.description.images.forEach((url: string, index: number) => {
        try {
          new URL(url)
        } catch (error) {
          errorObj[`image_url_${index}`] = `Invalid URL in images array at index ${index}: ${url}`
        }
      })
    }
  }
}

/**
 * Validates resolution object if present
 */
const validateResolution = (message: any, errorObj: any) => {
  if (!message.issue.resolution) return
  
  if (!message.issue.resolution.short_desc) {
    errorObj.resolution = 'resolution must contain short_desc'
  }
  
  if (message.issue.resolution.selected_reason_code && 
      message.issue.description && 
      message.issue.resolution.selected_reason_code !== message.issue.description.code) {
    errorObj.selected_reason_code = `selected_reason_code (${message.issue.resolution.selected_reason_code}) should match description code (${message.issue.description.code})`
  }
}

/**
 * Stores important values for future validation
 */
const storeValues = (message: any, context: any, apiSequence: string) => {
  setValue('onIssueStatus', message.issue.status)
  setValue('onIssueLastActionId', message.issue.last_action_id)
  setValue(`${apiSequence}_timestamp`, context.timestamp)
}

/**
 * Consolidated validator for all on_issue sequences (on_issue_1 to on_issue_7)
 * @param data The API payload to validate
 * @param apiSequence The API sequence identifier
 * @returns Validation errors object
 */
const checkOnIssueV2 = (data: any, apiSequence = IGM2Sequence.ON_ISSUE_1) => {
  const onIssueObj: any = {}

  if (!data || isObjectEmpty(data)) {
    return { [apiSequence]: 'JSON cannot be empty' }
  }

  try {
    const onIssue: any = data

    // Schema validation
    try {
      logger.info(`Validating Schema for ${apiSequence} API`)
      const vs = validateSchema('igm2', data?.context?.action, onIssue)
      if (vs != 'error') {
        Object.assign(onIssueObj, vs)
      }
    } catch (error: any) {
      logger.error(`Error in schema validation for ${apiSequence}: ${error.stack}`)
    }

    // Context validation
    try {
      logger.info(`Checking context for ${apiSequence} API`)
      const res: any = checkContext(onIssue.context, data?.context?.action)
      if (!res?.valid) {
        Object.assign(onIssueObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`Error in context validation for ${apiSequence}: ${error.stack}`)
    }

    // Validate on_issue-specific fields
    try {
      const { message, context } = onIssue
      
      // Common validations
      validateTimestamps(message, context, onIssueObj)
      validateStatus(message, onIssueObj)
      validateConsistency(context, message, onIssueObj)
      validateMessageIdUniqueness(context, onIssueObj)
      validateLastAction(message, onIssueObj)
      validateRespondentIds(message, onIssueObj)
      
      // Reuse common validation functions for complex objects
      Object.assign(onIssueObj, validateRefs(message.issue.refs))
      Object.assign(onIssueObj, validateActions(message.issue.actions))
      Object.assign(onIssueObj, validateActors(message.issue.actors))
      validateDescription(message, onIssueObj)
      validateResolution(message, onIssueObj)

      // Sequence-specific validations
      switch(apiSequence) {
        case IGM2Sequence.ON_ISSUE_1:
          // For ON_ISSUE_1: updated_at should equal created_at
          if (message.issue.updated_at !== message.issue.created_at) {
            onIssueObj.updated_at_mismatch = `In ${apiSequence}, updated_at should be equal to created_at`
          }
          break
          
        case IGM2Sequence.ON_ISSUE_2:
          // For ON_ISSUE_2: Validate respondent actions
          if (message.issue.actions && message.issue.actions.length > 0) {
            const respondentActions = message.issue.actions.filter((action: any) => 
              action.type === 'RESPONDENT_ACTION' && action.updated_by === 'RESPONDENT')
            
            if (respondentActions.length === 0) {
              onIssueObj.respondent_actions = `${apiSequence} should include at least one respondent action`
            }
          }
          break
          
        case IGM2Sequence.ON_ISSUE_3:
          // For ON_ISSUE_3: Additional validations specific to this stage
          if (message.issue.status !== 'PROCESSING' && message.issue.status !== 'RESOLVED') {
            onIssueObj.status_validation = `${apiSequence} typically expects status to be PROCESSING or RESOLVED, found: ${message.issue.status}`
          }
          break
          
        case IGM2Sequence.ON_ISSUE_4:
          // For ON_ISSUE_4: Validate resolution progress
          if (message.issue.status === 'RESOLVED' && !message.issue.resolution) {
            onIssueObj.missing_resolution = `When status is RESOLVED in ${apiSequence}, resolution details must be provided`
          }
          break
          
        case IGM2Sequence.ON_ISSUE_5:
        case IGM2Sequence.ON_ISSUE_6:
        case IGM2Sequence.ON_ISSUE_7:
          // Check escalation sequence - these usually come later in workflows
          if (message.issue.escalation_level && 
              (typeof message.issue.escalation_level !== 'number' || 
               message.issue.escalation_level < 1)) {
            onIssueObj.escalation_level = 'escalation_level must be a positive number'
          }
          
          // For later stages, status should typically move toward resolution
          if (apiSequence === IGM2Sequence.ON_ISSUE_7 && 
              message.issue.status !== 'RESOLVED' && 
              message.issue.status !== 'CLOSED') {
            onIssueObj.final_status = `By ${apiSequence}, issue status should typically be RESOLVED or CLOSED, found: ${message.issue.status}`
          }
          break
          
        default:
          logger.warn(`Unknown API sequence: ${apiSequence}. No specific validations applied.`)
          break
      }

      // Store updated values
      storeValues(message, context, apiSequence)

    } catch (error: any) {
      logger.error(`Error in on_issue validation for ${apiSequence}: ${error.stack}`)
    }

    logger.info(`Completed validation for ${apiSequence}`)
    return onIssueObj

  } catch (err: any) {
    logger.error(`Error in checkOnIssueV2 for ${apiSequence}: ${err.stack}`)
    return { error: 'Internal validation error' }
  }
}

export default checkOnIssueV2