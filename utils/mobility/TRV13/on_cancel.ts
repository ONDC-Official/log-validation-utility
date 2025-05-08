import { logger } from '../../../shared/logger'
import { setValue } from '../../../shared/dao'
import { TRV13ApiSequence } from '../../../constants'
import { validateSchema, isObjectEmpty } from '../../../utils'
import { validateContext } from '../mobilityChecks'

export const checkOnCancel = (data: any, msgIdSet: any, version: any) => {
    console.log("Version", version)
  if (!data || isObjectEmpty(data)) {
    return { [TRV13ApiSequence.ON_CANCEL]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema('TRV13', TRV13ApiSequence.ON_CANCEL, data)
  const contextRes: any = validateContext(context, msgIdSet, TRV13ApiSequence.CANCEL, TRV13ApiSequence.ON_CANCEL)
  setValue(`${TRV13ApiSequence.ON_CANCEL}_message`, message)
  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  const onCancelOrder: any = message.order

  try {
    // Order ID validation
    if (!onCancelOrder?.id) {
      errorObj.order_id = 'order.id is missing'
    } else {
      if (typeof onCancelOrder.id !== 'string') {
        errorObj.order_id = 'order.id should be a string'
      }
      if (onCancelOrder.id.trim() === '') {
        errorObj.order_id = 'order.id cannot be empty'
      }
    }

    // Order status validation
    if (!onCancelOrder?.status) {
      errorObj.order_status = 'order.status is missing'
    } else {
      if (onCancelOrder.status !== 'CANCELLED') {
        errorObj.order_status = 'order.status should be CANCELLED'
      }
    }

    // Cancellation validation
    if (!onCancelOrder?.cancellation) {
      errorObj.cancellation = 'order.cancellation is missing'
    } else {
      const cancellation = onCancelOrder.cancellation

      // Cancelled by validation
      if (!cancellation?.cancelled_by) {
        errorObj.cancellation_cancelled_by = 'order.cancellation.cancelled_by is missing'
      } else {
        const validCancelledBy = ['CONSUMER', 'PROVIDER']
        if (!validCancelledBy.includes(cancellation.cancelled_by)) {
          errorObj.cancellation_cancelled_by = `order.cancellation.cancelled_by should be one of ${validCancelledBy.join(', ')}`
        }
      }

      // Reason validation
      if (!cancellation?.reason) {
        errorObj.cancellation_reason = 'order.cancellation.reason is missing'
      } else {
        const reason = cancellation.reason

        // Reason ID validation
        if (!reason?.id) {
          errorObj.cancellation_reason_id = 'order.cancellation.reason.id is missing'
        } else {
          if (typeof reason.id !== 'string') {
            errorObj.cancellation_reason_id = 'order.cancellation.reason.id should be a string'
          }
          if (reason.id.trim() === '') {
            errorObj.cancellation_reason_id = 'order.cancellation.reason.id cannot be empty'
          }
        }

        // Descriptor validation
        if (!reason?.descriptor) {
          errorObj.cancellation_reason_descriptor = 'order.cancellation.reason.descriptor is missing'
        } else {
          const descriptor = reason.descriptor

          // Short description validation
          if (!descriptor?.short_desc) {
            errorObj.cancellation_reason_descriptor_short_desc = 'order.cancellation.reason.descriptor.short_desc is missing'
          } else {
            if (typeof descriptor.short_desc !== 'string') {
              errorObj.cancellation_reason_descriptor_short_desc = 'order.cancellation.reason.descriptor.short_desc should be a string'
            }
            if (descriptor.short_desc.trim() === '') {
              errorObj.cancellation_reason_descriptor_short_desc = 'order.cancellation.reason.descriptor.short_desc cannot be empty'
            }
          }

          // Long description validation (optional)
          if (descriptor?.long_desc) {
            if (typeof descriptor.long_desc !== 'string') {
              errorObj.cancellation_reason_descriptor_long_desc = 'order.cancellation.reason.descriptor.long_desc should be a string'
            }
            if (descriptor.long_desc.trim() === '') {
              errorObj.cancellation_reason_descriptor_long_desc = 'order.cancellation.reason.descriptor.long_desc cannot be empty'
            }
          }
        }
      }
    }

    // Updated at validation
    if (!onCancelOrder?.updated_at) {
      errorObj.updated_at = 'order.updated_at is missing'
    } else {
      const updatedDate = new Date(onCancelOrder.updated_at)
      if (isNaN(updatedDate.getTime())) {
        errorObj.updated_at = 'order.updated_at should be a valid ISO date string'
      }
    }

  } catch (error: any) {
    logger.error(`!!Error while checking on_cancel info in /${TRV13ApiSequence.ON_CANCEL}, ${error.stack}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
