import _ from 'lodash'
import { getValue, setValue } from '../../../shared/dao'
import { checkContext, isObjectEmpty } from '../../../utils/index'
import { IGM2Sequence, IGM2FlowSequence } from '../../../constants/index'
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
 * Validates actor relationships (complainant_id, source_id)
 */
const validateActorRelationships = (message: any, errorObj: any) => {
  if (!message.issue.actors || message.issue.actors.length === 0) return;
  
  // Check complainant_id matches INTERFACING_NP actor id
  const interfacingNpActor = message.issue.actors.find((actor: any) => actor.type === 'INTERFACING_NP');
  if (interfacingNpActor && message.issue.complainant_id !== interfacingNpActor.id) {
    errorObj.complainant_id = `complainant_id (${message.issue.complainant_id}) should match the id of the INTERFACING_NP actor (${interfacingNpActor.id})`;
  }
  
  // Check source_id matches CONSUMER actor id
  const consumerActor = message.issue.actors.find((actor: any) => actor.type === 'CONSUMER');
  if (consumerActor && message.issue.source_id !== consumerActor.id) {
    errorObj.source_id = `source_id (${message.issue.source_id}) should match the id of the CONSUMER actor (${consumerActor.id})`;
  }
};

/**
 * Validates updated_target if present
 */
const validateUpdatedTarget = (message: any, errorObj: any) => {
  if (!message.issue.updated_target) return;
  
  // Validate updated_target array
  if (!Array.isArray(message.issue.updated_target)) {
    errorObj.updated_target = 'updated_target must be an array';
    return;
  }

  message.issue.updated_target.forEach((target: any, index: number) => {
    // Check if target has required fields
    if (!target.path || !target.action) {
      errorObj[`updated_target_${index}`] = 'Each updated_target must have path and action fields';
      return;
    }

    // Validate action type
    const validActions = ['APPENDED', 'REMOVED', 'MODIFIED'];
    if (!validActions.includes(target.action)) {
      errorObj[`updated_target_${index}_action`] = `action must be one of: ${validActions.join(', ')}`;
    }

    // Validate path format (should be dot-notation path to a field)
    if (typeof target.path !== 'string' || !target.path.startsWith('issue.')) {
      errorObj[`updated_target_${index}_path`] = 'path must be a string starting with "issue."';
    }
  });
};

const checkOnIssueV2 = (data: any, apiSequence:string, flow: any) => {
  const onIssueObj: any = {}
  console.log("flow", flow)
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
      
      // Add new validations
      validateActorRelationships(message, onIssueObj)
      validateUpdatedTarget(message, onIssueObj)
      
      // For specific API sequences, add status validation
      if (apiSequence === IGM2Sequence.ON_ISSUE_1) {
        if (message.issue.status !== 'PROCESSING') {
          onIssueObj.status_on_issue_1 = `For ${apiSequence}, status should typically be PROCESSING, found: ${message.issue.status}`;
        }
      }
      
      // Reuse common validation functions for complex objects
      Object.assign(onIssueObj, validateRefs(message.issue.refs, flow))
      Object.assign(onIssueObj, validateActions(message.issue.actions, message))
      Object.assign(onIssueObj, validateActors(message.issue.actors, context, flow))
      validateDescription(message, onIssueObj)
      validateResolution(message, onIssueObj)

      if (message.issue.updated_at <= message.issue.created_at) {
        onIssueObj.updated_at_mismatch = 'updated_at must be greater than created_at'
      }

      // Sequence-specific validations
      switch(apiSequence) {
        case IGM2FlowSequence.FLOW_1.ON_ISSUE_PROCESSING_1:
          // For ON_ISSUE_1: updated_at should equal created_at
          break
          
        case IGM2Sequence.ON_ISSUE_2:
          
          break
          
        case IGM2Sequence.ON_ISSUE_3:
        
          break
          
        case IGM2Sequence.ON_ISSUE_4:
          break
          
        case IGM2Sequence.ON_ISSUE_5:
        case IGM2Sequence.ON_ISSUE_6:
        case IGM2Sequence.ON_ISSUE_7:
        
          
         
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