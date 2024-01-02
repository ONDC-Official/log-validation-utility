import { setValue } from '../../shared/dao'
import constants, { mobilitySequence } from '../../constants'
import { validateSchema, isObjectEmpty } from '..'
// import { logger } from '../../shared/logger'
import { validateContext } from './mobilityChecks'
import _ from 'lodash'

export const checkStatus = (data: any, msgIdSet: any) => {
  const errorObj: any = {}

  if (!data || isObjectEmpty(data)) {
    return { [mobilitySequence.STATUS]: 'Json cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || isObjectEmpty(message)) {
    return { missingFields: '/context, /message is missing or empty' }
  }

  const schemaValidation = validateSchema(context.domain.split(':')[1], constants.MOB_STATUS, data)
  const contextRes: any = validateContext(context, msgIdSet, constants.MOB_ONINIT, constants.MOB_STATUS)
  setValue(`${mobilitySequence.STATUS}_message`, message)

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  if (!message.ref_id) {
    const key = `${mobilitySequence.STATUS}_ref_id`
    errorObj[key] = `ref_id in /${constants.MOB_STATUS} must be present`
  } else {
    if (_.isEqual(message.ref_id, context.transaction_id)) {
      errorObj['ref_id'] = `ref_id value should be the value of transaction_id`
    }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
