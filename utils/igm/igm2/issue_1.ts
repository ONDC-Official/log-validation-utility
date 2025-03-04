import _ from 'lodash'
import { getValue, setValue } from '../../../shared/dao'
import { checkContext, isObjectEmpty } from '../../../utils/index'
import { IGM2Sequence } from '../../../constants/index'
import { validateSchema } from '../../../utils/index'
import { logger } from '../../../shared/logger'
import { validateRefs } from './common/refs'
import { validateActions } from './common/actions'
import { validateActors } from './common/actors'

const checkIssueV2 = (data: any, apiSequence:string) => {
  const issueObj: any = {}

  if (!data || isObjectEmpty(data)) {
    return { [apiSequence]: 'JSON cannot be empty' }
  }
  console.log('+++++++ apisequence', apiSequence)
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
      
      // Sequence-specific validations based on apiSequence
      switch(apiSequence) {
        case IGM2Sequence.ISSUE_1:
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
          
        case IGM2Sequence.ISSUE_2:
          // For ISSUE_2: Status validation might be different
          if (message.issue.status === 'OPEN') {
            // It's okay if status is still OPEN, but we might expect progress
            logger.info(`${apiSequence}: Status is still OPEN, which is valid but issue may not be progressing`)
          }
          
          // Transaction and issue ID should be consistent with previous calls
          const storedTxnId = getValue('igmTxnId')
          if (storedTxnId && context.transaction_id !== storedTxnId) {
            issueObj.transaction_id = `Transaction ID ${context.transaction_id} should match with stored ID: ${storedTxnId}`
          }
          
          const storedIssueId = getValue('issueId')
          if (storedIssueId && message.issue.id !== storedIssueId) {
            issueObj.issue_id = `Issue ID ${message.issue.id} should match with previously stored ID: ${storedIssueId}`
          }
          break;
          
        case IGM2Sequence.ISSUE_3:
          // For ISSUE_3: We might expect actions to be recorded
          if (!message.issue.actions || message.issue.actions.length === 0) {
            issueObj.no_actions = `By ${apiSequence}, we would typically expect some actions to be recorded`
          }
          
          // Status might have progressed
          if (message.issue.status === 'OPEN' && message.issue.actions && message.issue.actions.length > 2) {
            issueObj.status_progress = `With ${message.issue.actions.length} actions recorded, status might be expected to progress beyond OPEN`
          }
          break;
          
        case IGM2Sequence.ISSUE_4:
          // For ISSUE_4: Status validation for later stage
          if (message.issue.status === 'OPEN' && !message.issue.escalation_level) {
            issueObj.escalation = `By ${apiSequence}, if status is still OPEN, we might expect escalation_level to be defined`
          }
          break;
          
        case IGM2Sequence.ISSUE_5:
          // For ISSUE_5: This might be approaching resolution
          if (message.issue.status === 'RESOLVED' && !message.issue.resolution) {
            issueObj.missing_resolution = `When status is RESOLVED in ${apiSequence}, resolution details must be provided`
          }
          break;
          
        default:
          logger.warn(`Unknown API sequence: ${apiSequence}. No specific validations applied.`)
          break;
      }

      // Refs validation using common function
      const refsErrors = validateRefs(message.issue.refs)
      Object.assign(issueObj, refsErrors)

      // Actions validation using common function
      const actionsErrors = validateActions(message.issue.actions)
      Object.assign(issueObj, actionsErrors)

      // Actors validation using common function
      const actorsErrors = validateActors(message.issue.actors)
      Object.assign(issueObj, actorsErrors)

      // Validate description
      if (message.issue.description) {
        if (!message.issue.description.code || !message.issue.description.short_desc) {
          issueObj.description = 'description must contain code and short_desc'
        }
        
        if (message.issue.description.images && !Array.isArray(message.issue.description.images)) {
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

export default checkIssueV2
