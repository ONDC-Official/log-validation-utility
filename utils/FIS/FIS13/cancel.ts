import { getValue } from '../../../shared/dao'
import constants, { FisApiSequence } from '../../../constants'
import { validateSchema, isObjectEmpty } from '../..'
import { validateContext } from './fisChecks'
import _ from 'lodash'

export const checkCancel = (data: any, msgIdSet: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [FisApiSequence.CANCEL]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || isObjectEmpty(message)) {
    return { missingFields: '/context, /message is missing or empty' }
  }

  const schemaValidation = validateSchema(context.domain.split(':')[1], constants.CANCEL, data)
  const contextRes: any = validateContext(context, msgIdSet, constants.ON_CONFIRM, constants.CANCEL)
  msgIdSet.add(context.message_id)

  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  if (!message?.ref_id && !message?.order_id) {
    const key = `${FisApiSequence.CANCEL}_id`
    errorObj[key] = `either of ref_id or order_id must be present in /${constants.CANCEL}`
  } else {
    if (message?.ref_id && !_.isEqual(message?.ref_id, context.transaction_id)) {
      errorObj['ref_id'] = `ref_id value should be the value of transaction_id`
    }
  }

  const cancel: any = data?.message

  if (!('order_id' in cancel)) {
    errorObj['order'] = `order_id should be sent in /${constants.CANCEL}`
  } else {
    const orderId = getValue('orderId')
    if (!_.isEqual(orderId, cancel?.order_id))
      errorObj['order_id'] = `order_id should be similar to what sent in past call at /${constants.CANCEL}`
  }

  if (!cancel.descriptor.short_desc) {
    errorObj[`descriptor.short_desc`] = `descriptor.short_desc should be present at /${constants.CANCEL}`
  }

  if (!cancel?.cancellation_reason_id) {
    errorObj['cancellation_reason_id'] = `cancellation_reason_id should be present and valid in /${constants.CANCEL}`
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
