import { logger } from '../../../shared/logger'
import { setValue } from '../../../shared/dao'
import { TRV13ApiSequence } from '../../../constants'
import { validateSchema, isObjectEmpty } from '../../../utils'
import { validateContext } from '../mobilityChecks'

export const checkCancel = (data: any, msgIdSet: any, version: any) => {
  console.log("Version", version)
  if (!data || isObjectEmpty(data)) {
    return { [TRV13ApiSequence.CANCEL]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || isObjectEmpty(message)) {
    return { missingFields: '/context, /message is missing or empty' }
  }

  const schemaValidation = validateSchema('TRV13', TRV13ApiSequence.CANCEL, data)
  const contextRes: any = validateContext(context, msgIdSet, TRV13ApiSequence.CANCEL, TRV13ApiSequence.CANCEL)
  setValue(`${TRV13ApiSequence.CANCEL}_message`, message)
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

    // Cancellation reason ID validation
    if (!message?.cancellation_reason_id) {
      errorObj.cancellation_reason_id = 'cancellation_reason_id is missing in message'
    } else {
      if (typeof message.cancellation_reason_id !== 'string') {
        errorObj.cancellation_reason_id = 'cancellation_reason_id should be a string'
      }
      if (message.cancellation_reason_id.trim() === '') {
        errorObj.cancellation_reason_id = 'cancellation_reason_id cannot be empty'
      }
    }

    // Descriptor validation
    if (!message?.descriptor) {
      errorObj.descriptor = 'descriptor is missing in message'
    } else {
      const descriptor = message.descriptor

      // Short description validation
      if (!descriptor?.short_desc) {
        errorObj.descriptor_short_desc = 'descriptor.short_desc is missing'
      } else {
        if (typeof descriptor.short_desc !== 'string') {
          errorObj.descriptor_short_desc = 'descriptor.short_desc should be a string'
        }
        if (descriptor.short_desc.trim() === '') {
          errorObj.descriptor_short_desc = 'descriptor.short_desc cannot be empty'
        }
      }

      // Long description validation (optional)
      if (descriptor?.long_desc) {
        if (typeof descriptor.long_desc !== 'string') {
          errorObj.descriptor_long_desc = 'descriptor.long_desc should be a string'
        }
        if (descriptor.long_desc.trim() === '') {
          errorObj.descriptor_long_desc = 'descriptor.long_desc cannot be empty'
        }
      }
    }

  } catch (error: any) {
    logger.error(`!!Error while checking cancel info in /${TRV13ApiSequence.CANCEL}, ${error.stack}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
