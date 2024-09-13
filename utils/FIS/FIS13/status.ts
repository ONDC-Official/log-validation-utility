import constants, { FisApiSequence } from '../../../constants'
import { validateSchema, isObjectEmpty } from '../..'
import { validateContext } from './fisChecks'
import _ from 'lodash'

export const checkStatus = (data: any, msgIdSet: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [FisApiSequence.STATUS]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || isObjectEmpty(message)) {
    return { missingFields: '/context, /message is missing or empty' }
  }

  const schemaValidation = validateSchema('FIS', constants.STATUS, data)
  const contextRes: any = validateContext(context, msgIdSet, constants.ON_CONFIRM, constants.STATUS)
  msgIdSet.add(context.message_id)

  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  if (!message?.ref_id && !message?.order_id) {
    const key = `${FisApiSequence.STATUS}_id`
    errorObj[key] = `either of ref_id or order_id must be present in /${constants.STATUS}`
  } else {
    if (message?.ref_id && !_.isEqual(message?.ref_id, context.transaction_id)) {
      errorObj['ref_id'] = `ref_id value should be the value of transaction_id`
    }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
