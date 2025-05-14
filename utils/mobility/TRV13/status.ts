import { logger } from '../../../shared/logger'
import { setValue } from '../../../shared/dao'
import { TRV13ApiSequence } from '../../../constants'
import { validateSchema, isObjectEmpty } from '../../../utils'
import { validateContext } from '../mobilityChecks'

export const checkStatus = (data: any, msgIdSet: any, version: any) => {
    console.log("Version", version)
  if (!data || isObjectEmpty(data)) {
    return { [TRV13ApiSequence.STATUS]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || isObjectEmpty(message)) {
    return { missingFields: '/context, /message is missing or empty' }
  }

  const schemaValidation = validateSchema('TRV13', TRV13ApiSequence.STATUS, data)
  const contextRes: any = validateContext(context, msgIdSet, TRV13ApiSequence.STATUS, TRV13ApiSequence.STATUS)
  setValue(`${TRV13ApiSequence.STATUS}_message`, message)
  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  try {
    // Order ID validation
    if (!message?.order_id) {
      errorObj.order_id = 'order_id is missing in message'
    } else {
      if (typeof message.order_id !== 'string') {
        errorObj.order_id = 'order_id should be a string'
      }
      if (message.order_id.trim() === '') {
        errorObj.order_id = 'order_id cannot be empty'
      }
    }

  } catch (error: any) {
    logger.error(`!!Error while checking status info in /${TRV13ApiSequence.STATUS}, ${error.stack}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
