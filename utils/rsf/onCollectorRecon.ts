// import { logger } from '../../shared/logger'
import { setValue } from '../../shared/dao'
import { rsfSequence } from '../../constants'
import { validateSchema, isObjectEmpty } from '../'
import { validateContext } from './rsfChecks'

export const onCollectorRecon = (data: any, msgIdSet: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [rsfSequence.ON_COLLECTOR_RECON]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.catalog || isObjectEmpty(message)) {
    return { missingFields: '/context or /message is missing or empty' }
  }

  const contextRes: any = validateContext(
    context,
    msgIdSet,
    rsfSequence.COLLECTOR_RECON,
    rsfSequence.ON_COLLECTOR_RECON,
  )
  const schemaValidation = validateSchema(context.domain.split(':')[1], rsfSequence.ON_COLLECTOR_RECON, data)
  setValue(`${rsfSequence.ON_COLLECTOR_RECON}_message`, message)
  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
