import { logger } from '../../../shared/logger'
import { getValue, setValue } from '../../../shared/dao'
import constants, { airlinesSequence } from '../../../constants'
import { validateSchema, isObjectEmpty } from '../../'
import { validateContext } from '../../metro/metroChecks'

export const checkCancelPayload = (data: any, msgIdSet: any, cancelType: boolean) => {
  const errorObj: any = {}
  const orderId = getValue('orderId')
  try {
    if (!data || isObjectEmpty(data)) {
      return { [constants.CANCEL]: 'Json cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || isObjectEmpty(message)) {
      return { missingFields: '/context, /message, /message/order ID is missing or empty' }
    }

    const schemaValidation = validateSchema('TRV12', constants.CANCEL, data)
    const contextRes: any = validateContext(
      context,
      msgIdSet,
      cancelType ? airlinesSequence?.ON_CANCEL : constants.ON_CONFIRM,
      cancelType ? airlinesSequence?.CANCEL : airlinesSequence?.CANCEL,
    )
    setValue(`${constants.CANCEL}_message`, message)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    if (!message?.order_id) errorObj['order_id'] = `order_id should be sent in /${constants.CANCEL}`
    else {
      if (message?.order_id !== orderId) errorObj['order_id'] = `order_id should be same as in /${constants.ON_CONFIRM}`

      const { cancellation_reason_id, descriptor } = message
      if (!cancellation_reason_id)
        errorObj['cancellation_reason_id'] = `cancellation_reason_id should be sent in /${constants.CANCEL}`
      else if (cancellation_reason_id === '0' || typeof cancellation_reason_id === 'number')
        errorObj['cancellation_reason_id'] =
          `cancellation_reason_id should not be 0 or Type Integer in /${constants.CANCEL}`

      if (!descriptor) errorObj['descriptor'] = `descriptor should be sent in /${constants.CANCEL}`
      else {
        const { name, code } = descriptor
        if (!name && !code)
          errorObj['descriptorname&code'] = `descriptor name and code both are missing in /${constants.CANCEL}`
        else if (!code) errorObj['descriptor_code'] = `descriptor code should be sent in /${constants.CANCEL}`
        else if (code !== (cancelType ? 'CONFIRM_CANCEL' : 'SOFT_CANCEL'))
          errorObj['descriptor_code'] =
            `descriptor code should be ${cancelType ? 'CONFIRM_CANCEL' : 'SOFT_CANCEL'} in /${constants.CANCEL}`
      }
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.INIT} API`, err)
    return { error: err.message }
  }
}
