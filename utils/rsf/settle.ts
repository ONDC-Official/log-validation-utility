// import { logger } from '../../shared/logger'
import { setValue } from '../../shared/dao'
import { rsfSequence } from '../../constants'
import { validateSchema, isObjectEmpty } from '../'
import { validateContext } from './rsfChecks'

export const settle = (data: any, msgIdSet: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [rsfSequence.SETTLE]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.catalog || isObjectEmpty(message)) {
    return { missingFields: '/context or /message is missing or empty' }
  }

  const contextRes: any = validateContext(context, msgIdSet, rsfSequence.ON_COLLECTOR_RECON, rsfSequence.SETTLE)
  const schemaValidation = validateSchema(context.domain.split(':')[1], rsfSequence.SETTLE, data)
  setValue(`${rsfSequence.SETTLE}_message`, message)
  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
