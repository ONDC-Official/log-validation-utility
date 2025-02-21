// export default checkIssueV2;
import _ from 'lodash'
import { setValue } from '../../../shared/dao'
import { checkContext, isObjectEmpty } from '../../../utils/index'
import constants, { IGM2Sequence } from '../../../constants/index'
import { validateSchema } from '../../../utils/index'
import { logger } from '../../../shared/logger'
import { validateRefs } from './common/refs'
import { validateActions } from './common/actions'
import { validateActors } from './common/actors'


const checkIssueV2 = (data: any) => {
  const issueObj: any = {}

  if (!data || isObjectEmpty(data)) {
    return { [IGM2Sequence.ISSUE_1]: 'JSON cannot be empty' }
  }

  try {
    const issue: any = data

    // Schema validation
    try {
      logger.info(`Validating Schema for ${constants.ISSUE_1} API`)
      const vs = validateSchema('igm2', data?.context?.action, issue)
      if (vs != 'error') {
        Object.assign(issueObj, vs)
      }
    } catch (error: any) {
      logger.error(`Error in schema validation: ${error.stack}`)
    }

    // Context validation
    try {
      logger.info(`Checking context for ${constants.ISSUE_1} API`)
      const res = checkContext(issue.context, data?.context?.action)
      if (!res?.valid) {
        Object.assign(issueObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`Error in context validation: ${error.stack}`)
    }

    // Validate issue specific fields
    try {
      const { message } = issue
      
      // Timestamp validation
      if (new Date(message.issue.created_at) > new Date(message.issue.updated_at)) {
        issueObj.timestamp = 'created_at cannot be greater than updated_at'
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

    } catch (error: any) {
      logger.error(`Error in issue validation: ${error.stack}`)
    }

    return issueObj

  } catch (err: any) {
    logger.error(`Error in checkIssueV2: ${err.stack}`)
    return { error: 'Internal validation error' }
  }
}

export default checkIssueV2