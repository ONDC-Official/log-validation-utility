import { logger } from '../../shared/logger'
import { setValue } from '../../shared/dao'
import constants, { mobilitySequence } from '../../constants'
import { validateSchema, isObjectEmpty } from '..'
import { validateContext } from './mobilityChecks'

export const checkCancel = (data: any, msgIdSet: any, sequence: string) => {
  try {
    if (!data || isObjectEmpty(data)) {
      return { [mobilitySequence.ON_CANCEL]: 'Json cannot be empty' }
    }

    const { message, context } = data
    if (!message || !context || !message.catalog || isObjectEmpty(message) || isObjectEmpty(message.catalog)) {
      return { missingFields: '/context, /message, /catalog or /message/catalog is missing or empty' }
    }

    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.MOB_CANCEL, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.MOB_ONCONFIRM, constants.MOB_CANCEL)
    setValue(`${mobilitySequence.CANCEL}_message`, message)

    const errorObj: any = {}

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const cancel: any = data?.message.order

    if (!('order_id' in cancel)) {
      errorObj['order'] = `order_id should be sent in /${constants.MOB_CANCEL}`
    }

    if (!cancel.descriptor.code) {
      errorObj[`descriptor.code`] = `descriptor.code should be present at /${constants.MOB_CANCEL}`
    } else {
      if (sequence === 'soft_cancel' && cancel.descriptor.code != 'SOFT_CANCEL') {
        errorObj[`descriptor.code`] = `descriptor.code should be SOFT_CANCEL at /${constants.MOB_CANCEL}`
      } else {
        if (cancel.descriptor.code != 'CONFIRM_CANCEL') {
          errorObj[`descriptor.code`] = `descriptor.code should be CONFIRM_CANCEL at /${constants.MOB_CANCEL}`
        }
      }
    }

    if (!cancel?.cancellation_reason_id) {
      errorObj[
        'cancellation_reason_id'
      ] = `cancellation_reason_id should be present and valid in /${constants.MOB_CANCEL}`
    }

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}
