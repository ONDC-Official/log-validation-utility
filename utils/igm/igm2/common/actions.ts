import _ from 'lodash'
import { logger } from '../../../../shared/logger'

export const validateActions = (actions: any[]) => {
  const errors: any = {}

  try {
    logger.info('Validating actions array')

    if (!Array.isArray(actions)) {
      return { actions: 'actions must be an array' }
    }

    return errors
  } catch (error: any) {
    logger.error(`Error while validating actions: ${error.stack}`)
    return { actions_error: error.message }
  }
}
