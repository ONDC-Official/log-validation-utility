import _ from 'lodash'
import { logger } from '../../../../shared/logger'

export const validateActions = (actions: any[]) => {
  const errors: any = {}

  try {
    logger.info('Validating actions array')

    if (!Array.isArray(actions)) {
      return { actions: 'actions must be an array' }
    }

    actions.forEach((action, index) => {
      if (!action.id) {
        errors[`action_${index}_id`] = 'action id is required'
      }

      if (!action.updated_at) {
        errors[`action_${index}_updated_at`] = 'updated_at is required'
      }

      if (!action.action_by) {
        errors[`action_${index}_action_by`] = 'action_by is required'
      }

      if (action.description) {
        if (!action.description.code) {
          errors[`action_${index}_desc_code`] = 'description code is required'
        }
        if (!action.description.short_desc) {
          errors[`action_${index}_desc_short`] = 'description short_desc is required'
        }
      }

      if (action.actor_details && !action.actor_details.name) {
        errors[`action_${index}_actor_name`] = 'actor_details name is required'
      }
    })

    return errors
  } catch (error: any) {
    logger.error(`Error while validating actions: ${error.stack}`)
    return { actions_error: error.message }
  }
}
