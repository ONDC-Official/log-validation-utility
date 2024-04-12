/* eslint-disable no-prototype-builtins */
import constants from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty } from '../../'
import { validateContext } from './fisChecks'
import _ from 'lodash'
// import { validatePaymentTags } from './tags'

export const checkStatus = (data: any, msgIdSet: any) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [constants.STATUS]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.STATUS, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.ON_CONFIRM, constants.STATUS)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    if (!message?.ref_id && !message?.order_id) {
      const key = `${constants.STATUS}_id`
      errorObj[key] = `either of ref_id or order_id must be present in /${constants.STATUS}`
    } else {
      if (message?.ref_id && !_.isEqual(message?.ref_id, context.transaction_id)) {
        errorObj['ref_id'] = `ref_id value should be the value of transaction_id`
      }
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.STATUS} API`, err)
    return { error: err.message }
  }
}
