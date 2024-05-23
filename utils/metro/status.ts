import { setValue } from '../../shared/dao'
import constants, { mobilitySequence } from '../../constants'
import { validateSchema, isObjectEmpty } from '..'
// import { logger } from '../../shared/logger'
import { validateContext } from './mobilityChecks'
import _ from 'lodash'

export const checkStatus = (data: any, msgIdSet: any) => {
  const errorObj: any = {}

  if (!data || isObjectEmpty(data)) {
    return { [mobilitySequence.STATUS]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || isObjectEmpty(message)) {
    return { missingFields: '/context, /message is missing or empty' }
  }

  const schemaValidation = validateSchema('TRV', constants.STATUS, data)
  const contextRes: any = validateContext(context, msgIdSet, constants.ON_INIT, constants.STATUS)
  setValue(`${mobilitySequence.STATUS}_message`, message)

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  if (!message?.ref_id && !message?.order_id) {
    const key = `${mobilitySequence.STATUS}_id`
    errorObj[key] = `either of ref_id or order_id must be present in /${constants.STATUS}`
  } else {
    if (message?.ref_id && !_.isEqual(message?.ref_id, context.transaction_id)) {
      errorObj['ref_id'] = `ref_id value should be the value of transaction_id`
    }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
