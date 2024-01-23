import { setValue } from '../../../shared/dao'
import constants, { FisApiSequence } from '../../../constants'
import { validateSchema, isObjectEmpty } from '../..'
import { validateContext } from './fisChecks'

export const checkUpdate = (data: any, msgIdSet: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [FisApiSequence.UPDATE]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema(context.domain.split(':')[1], constants.UPDATE, data)
  const contextRes: any = validateContext(context, msgIdSet, constants.ON_CONFIRM, constants.UPDATE)
  msgIdSet.add(context.message_id)

  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  setValue(`${FisApiSequence.UPDATE}`, data)

  if (!message.update_target || !message.order[message.update_target] || !message.order.id) {
    const key = `${FisApiSequence.UPDATE}_message`
    errorObj[key] =
      'Invalid payload. update_target attribute must be present in message and order object must contain the specified update_target and order id.'
  }

  if (!message.update_target || !message.order[message.update_target] || !message.order.id) {
    const key = `${FisApiSequence.UPDATE}_message`
    errorObj[key] =
      'Invalid payload. update_target attribute must be present in message and order object must contain the specified update_target and order id.'
  }

  if (message.update_target === 'payments' && message.order?.payments?.amount) {
    setValue(`updatePayment`, message.order?.payments?.amount)
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
