// import { logger } from '../../shared/logger'
import { setValue } from '../../shared/dao'
import { rsfSequence } from '../../constants'
import { validateSchema, isObjectEmpty, checkContext } from '../'

export const collectorRecon = (data: any, msgIdSet: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [rsfSequence.COLLECTOR_RECON]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.catalog || isObjectEmpty(message)) {
    return { missingFields: '/context or /message is missing or empty' }
  }

  const contextRes: any = checkContext(context, rsfSequence.COLLECTOR_RECON)
  const schemaValidation = validateSchema(context.domain.split(':')[1], rsfSequence.COLLECTOR_RECON, data)
  setValue(`${rsfSequence.COLLECTOR_RECON}_message`, message)
  msgIdSet.add(data.context.message_id)
  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
