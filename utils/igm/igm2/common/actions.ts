import _ from 'lodash'
import { logger } from '../../../../shared/logger'

export enum ActiondescriptorCodes {
  RESOLUTION_PROPOSED = 'RESOLUTION_PROPOSED',
  RESOLUTION_ACCEPTED = 'RESOLUTION_ACCEPTED',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  CLOSE = 'CLOSE',
}


export const validateActions = (actions: any[], message: any) => {
  const errors: Record<string, string> = {}

  try {
    logger.info('Validating actions array')

    if (!Array.isArray(actions)) {
      return { actions: 'actions must be an array' }
    }

    actions.forEach((action, index) => {
      validateActionUpdatedBy(action, index, errors)
      validateActionUpdatedTime(action, index, errors)
      validateActiondescriptorCode(action, index, message, errors)
    })

    return errors
  } catch (error: any) {
    logger.error(`Error while validating actions: ${error.stack}`)
    return { actions_error: error.message }
  }
}

/**
 * Validates action updated_by
 */
function validateActionUpdatedBy(action: any, index: number, errors: Record<string, string>): void {
  if (!action.action_by) {
    errors[`action_${index}_action_by`] = 'action action_by is required'
  }
}

/**
 * Validates action updated_time
 */
function validateActionUpdatedTime(action: any, index: number, errors: Record<string, string>): void {
  if (!action.updated_at) {
    errors[`action_${index}_updated_at`] = 'action updated_at is required'
  }
}

/**
 * Validates action descriptor code and related requirements
 */
function validateActiondescriptorCode(action: any, index: number, message: any, errors: Record<string, string>): void {
  if (!action.descriptor || !action.descriptor.code) {
    errors[`action_${index}_descriptor_code`] = 'action descriptor.code is required'
    return
  }

  const code = action.descriptor.code

  // Check for resolution-related codes that require message/issue/resolutions
  if (isResolutionRelatedCode(code)) {
    validateResolutionsExist(message, index, code, errors)
  }

  // Check for CLOSE action that requires tags
  if (code === ActiondescriptorCodes.CLOSE) {
    validateCloseActionTags(action, index, errors)
  }
}

/**
 * Checks if the action code is related to resolutions
 */
function isResolutionRelatedCode(code: string): boolean {
  return [
    ActiondescriptorCodes.RESOLUTION_PROPOSED,
    ActiondescriptorCodes.RESOLUTION_ACCEPTED,
    ActiondescriptorCodes.RESOLVED,
    ActiondescriptorCodes.CLOSED,
  ].includes(code as ActiondescriptorCodes)
}

/**
 * Validates that resolutions exist when required by action code
 */
function validateResolutionsExist(message: any, index: number, code: string, errors: Record<string, string>): void {
  if (
    !message ||
    !message.issue ||
    !message.issue.resolutions ||
    !Array.isArray(message.issue.resolutions) ||
    message.issue.resolutions.length === 0
  ) {
    errors[`action_${index}_resolutions`] =
      `For action descriptor.code "${code}", message.issue.resolutions is required`
  }
}

/**
 * Validates that tags exist for CLOSE action
 */
function validateCloseActionTags(action: any, index: number, errors: Record<string, string>): void {
  if (!action.tags || !Array.isArray(action.tags) || action.tags.length === 0) {
    errors[`action_${index}_tags`] = 'For CLOSE action, tags are mandatory'
  }
}
