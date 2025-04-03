import { logger } from '../../../shared/logger'
import { getValue, setValue } from '../../../shared/dao'
import constants, { airlinesSequence } from '../../../constants'
import { validateSchema, isObjectEmpty } from '../../'
import { validateContext } from '../../metro/metroChecks'

export const checkStatusPayload = (data: any, msgIdSet: any) => {
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
        airlinesSequence?.ON_CANCEL,
      constants.STATUS
    )
    setValue(`${constants.STATUS}_message`, message)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    if (!message?.order_id) errorObj['order_id'] = `order_id should be sent in /${constants.STATUS}`
    else {
      if (message?.order_id !== orderId) errorObj['order_id'] = `order_id should be same as in /${constants.ON_CONFIRM}`
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.INIT} API`, err)
    return { error: err.message }
  }
}
