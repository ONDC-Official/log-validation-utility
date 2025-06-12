import _ from 'lodash'
import { getValue, setValue } from '../../../shared/dao'
import { checkContext, isObjectEmpty } from '../../../utils/index'
import { IGM2FlowSequence } from '../../../constants/index'
import { validateSchema } from '../../../utils/index'
import { logger } from '../../../shared/logger'
import { validateRefs } from './common/refs'
import { validateActions } from './common/actions'
import { validateActors } from './common/actors'

const checkIssueV2 = (data: any, apiSequence:string, flow: any) => {
  const issueObj: any = {}

  if (!data || isObjectEmpty(data)) {
    return { [apiSequence]: 'JSON cannot be empty' }
  }

  try {
    const issue: any = data

    // Schema validation
    try {
      logger.info(`Validating Schema for ${apiSequence} API`)
      const vs = validateSchema('igm2', data?.context?.action, issue)
      if (vs != 'error') {
        Object.assign(issueObj, vs)
      }
    } catch (error: any) {
      logger.error(`Error in schema validation for ${apiSequence}: ${error.stack}`)
    }

    // Context validation
    try {
      logger.info(`Checking context for ${apiSequence} API`)
      const res:any = checkContext(issue.context, data?.context?.action)
      if (!res?.valid) {
        Object.assign(issueObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`Error in context validation for ${apiSequence}: ${error.stack}`)
    }

    // Validate issue specific fields
    try {
      const { message, context } = issue
      
      // Timestamp validation
      if (new Date(message.issue.created_at) > new Date(message.issue.updated_at)) {
        issueObj.timestamp = 'created_at cannot be greater than updated_at'
      }
      
      // Validation #2: updated_at should be equal or greater than context/timestamp
      if (new Date(message.issue.updated_at) > new Date(context.timestamp)) {
        issueObj.timestamp_validation = 'Issue updated_at should be equal to or less than context timestamp'
      }
      
      // Validation #3 & #4: Check last_action_id and updated_at with actions array
      if (message.issue.actions && message.issue.actions.length > 0) {
        const lastAction = message.issue.actions[message.issue.actions.length - 1]
        
        // updated_at should be equal or less than last action's updated_at
        if (new Date(message.issue.updated_at) > new Date(lastAction.updated_at)) {
          issueObj.updated_at_sequence = 'Issue updated_at should be equal to or less than the last action\'s updated_at'
        }
        
        // last_action_id should match the last action's id
        if (message.issue.last_action_id !== lastAction.id) {
          issueObj.last_action_id = `last_action_id (${message.issue.last_action_id}) should match the id of the last action (${lastAction.id})`
        }
      }
      
      // Add this after the timestamp validations but before the switch statement
      validateUpdatedTarget(message, apiSequence, issueObj);

      // Sequence-specific validations based on apiSequence
      switch(apiSequence) {
        case IGM2FlowSequence.FLOW_1.ISSUE_OPEN:
          // For ISSUE_1: updated_at should equal created_at
          if (message.issue.updated_at !== message.issue.created_at) {
            issueObj.updated_at_mismatch = `In ${apiSequence}, updated_at should be equal to created_at`
          }
          
          // For ISSUE_1: status should be OPEN
          if (message.issue.status !== 'OPEN') {
            issueObj.status_issue_1 = `For ${apiSequence}, status should be OPEN, found: ${message.issue.status}`
          }
          
          // Validate actors relationships for ISSUE_1
          if (message.issue.actors && message.issue.actors.length > 0) {
            const interfacingNpActor = message.issue.actors.find((actor: any) => actor.type === 'INTERFACING_NP')          
            const consumerActor = message.issue.actors.find((actor: any) => actor.type === 'CONSUMER')
            
            // complainant_id should match INTERFACING_NP actor id
            if (interfacingNpActor && message.issue.complainant_id !== interfacingNpActor.id) {
              issueObj.complainant_id = `complainant_id (${message.issue.complainant_id}) should match the id of the INTERFACING_NP actor (${interfacingNpActor.id})`
            }
            
            // source_id should match CONSUMER actor id
            if (consumerActor && message.issue.source_id !== consumerActor.id) {
              issueObj.source_id = `source_id (${message.issue.source_id}) should match the id of the CONSUMER actor (${consumerActor.id})`
            }
          }
          break;
          
        case IGM2FlowSequence.FLOW_1.ISSUE_INFO_PROVIDED_1:
        case IGM2FlowSequence.FLOW_1.ISSUE_INFO_PROVIDED_2:
          // For INFO_PROVIDED: Status validation might be different
          if (message.issue.status === 'OPEN') {
            // It's okay if status is still OPEN, but we might expect progress
            logger.info(`${apiSequence}: Status is still OPEN, which is valid but issue may not be progressing`)
          }
          
          // Transaction and issue ID should be consistent with previous calls
          const storedIssueId = getValue('issueId')
          if (storedIssueId && message.issue.id !== storedIssueId) {
            issueObj.issue_id = `Issue ID ${message.issue.id} should match with previously stored ID: ${storedIssueId}`
          }
          break;
          
        case IGM2FlowSequence.FLOW_1.ISSUE_RESOLUTION_ACCEPTED:
          // For ISSUE_RESOLUTION_ACCEPTED: We might expect actions to be recorded
          if (!message.issue.actions || message.issue.actions.length === 0) {
            issueObj.no_actions = `By ${apiSequence}, we would typically expect some actions to be recorded`
          }
          break;
          
        case IGM2FlowSequence.FLOW_1.ISSUE_CLOSED:
          // For ISSUE_CLOSED: This might be approaching resolution
          if (message.issue.status === 'RESOLVED' && !message.issue.resolution) {
            issueObj.missing_resolution = `When status is RESOLVED in ${apiSequence}, resolution details must be provided`
          }
          break;
          
        default:
          logger.warn(`Unknown API sequence: ${apiSequence}. No specific validations applied.`)
          break;
      }

      // Refs validation using common function
      const refsErrors = validateRefs(message.issue.refs, flow)
      Object.assign(issueObj, refsErrors)

      // Actions validation using common function
      const actionsErrors = validateActions(message.issue.actions, message)
      Object.assign(issueObj, actionsErrors)

      // Actors validation using common function
      const actorsErrors = validateActors(message.issue.actors, context, flow)
      Object.assign(issueObj, actorsErrors)

      // Validate descriptor
      if (message.issue.descriptor) {
        if (!message.issue.descriptor.code || !message.issue.descriptor.short_desc) {
          issueObj.descriptor = 'descriptor must contain code and short_desc'
        }
        
        if (message.issue.descriptor.images && !Array.isArray(message.issue.descriptor.images)) {
          issueObj.images = 'images must be an array'
        }
      }

      // Store important values
      setValue('igmTxnId', issue.context.transaction_id)
      setValue('igmTmpstmp', issue.context.timestamp)
      setValue('igmCoreVersion', issue.context.core_version)
      setValue('igmDomain', issue.context.domain)
      setValue('igmIssueMsgId', issue.context.message_id)
      setValue('seller_bpp_id', issue.context.bpp_id)
      setValue('seller_bpp_uri', issue.context.bpp_uri)
      setValue('issueId', message.issue.id)
      setValue('issueStatus', message.issue.status)
      setValue('issueLastActionId', message.issue.last_action_id)
      setValue(`${apiSequence}_timestamp`, context.timestamp)

    } catch (error: any) {
      logger.error(`Error in issue validation for ${apiSequence}: ${error.stack}`)
    }

    logger.info(`Completed validation for ${apiSequence}`)
    return issueObj

  } catch (err: any) {
    logger.error(`Error in checkIssueV2 for ${apiSequence}: ${err.stack}`)
    return { error: 'Internal validation error' }
  }
}

/**
 * Validates update_target if present
 */
const validateUpdatedTarget = (message: any, apiSequence: string, errorObj: any) => {
  // Skip validation for ISSUE_OPEN
  if (apiSequence === IGM2FlowSequence.FLOW_1.ISSUE_OPEN) return;
  
  if (!message.issue.update_target) return;
  
  // Validate update_target array
  if (!Array.isArray(message.issue.update_target)) {
    errorObj.update_target = 'update_target must be an array';
    return;
  }

  message.issue.update_target.forEach((target: any, index: number) => {
    // Check if target has required fields
    if (!target.path || !target.action) {
      errorObj[`update_target_${index}`] = 'Each update_target must have path and action fields';
      return;
    }

    // Validate action type
    const validActions = ['APPENDED', 'REMOVED', 'MODIFIED'];
    if (!validActions.includes(target.action)) {
      errorObj[`update_target_${index}_action`] = `action must be one of: ${validActions.join(', ')}`;
    }

    // Validate path format (should be dot-notation path to a field)
    if (typeof target.path !== 'string' || !target.path.startsWith('issue.')) {
      errorObj[`update_target_${index}_path`] = 'path must be a string starting with "issue."';
    }
  });
};

export default checkIssueV2 