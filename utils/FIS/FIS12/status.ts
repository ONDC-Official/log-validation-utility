import { setValue } from '../../../shared/dao'
import constants, { FisApiSequence } from '../../../constants'
import { validateSchema, isObjectEmpty } from '../..'
import { validateContext } from './fisChecks'

export const checkStatus = (data: any, msgIdSet: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [FisApiSequence.STATUS]: 'Json cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || isObjectEmpty(message)) {
    return { missingFields: '/context, /message is missing or empty' }
  }

  const schemaValidation = validateSchema(context.domain.split(':')[1], constants.FIS_STATUS, data)
  const contextRes: any = validateContext(context, msgIdSet, constants.FIS_ONCONFIRM, constants.FIS_STATUS)
  msgIdSet.add(context.message_id)

  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  setValue(`${FisApiSequence.STATUS}`, data)

  if (!message.ref_id) {
    const key = `${FisApiSequence.STATUS}_ref_id`
    errorObj[key] = `ref_id in /${constants.FIS_STATUS} must be present`
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
