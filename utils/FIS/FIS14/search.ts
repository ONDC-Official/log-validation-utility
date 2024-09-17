import constants from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty } from '../../'
import { getValue, setValue } from '../../../shared/dao'
import _ from 'lodash'

export const checkSearch = (data: any, msgIdSet: any, flow: string, action: string) => {
  const errorObj: any = {}
  if (!data || isObjectEmpty(data)) {
    return { [action]: 'JSON cannot be empty' }
  }

  if (
    !data.message ||
    !data.context ||
    !data.message.intent ||
    isObjectEmpty(data.message) ||
    isObjectEmpty(data.message.intent)
  ) {
    errorObj['missingFields'] = '/context, /message, /intent or /message/intent is missing or empty'
    return Object.keys(errorObj).length > 0 && errorObj
  }

  const { context, message } = data
  msgIdSet.add(context.message_id)

  const schemaValidation = validateSchema('FIS', constants.SEARCH, data)
  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  try {
    logger.info(`Validating category in /${action}`)
    const code = message.intent?.category?.descriptor?.code
    if (code) {
      if (code != 'MUTUAL_FUNDS') {
        errorObj['category'] = `code value should be MUTUAL_FUNDS, in a standard enum format as at category.descriptor`
      }
    }
  } catch (error: any) {
    logger.error(`!!Error while validating category in /${action}, ${error.stack}`)
  }
}
