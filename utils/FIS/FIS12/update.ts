import { getValue, setValue } from '../../../shared/dao'
import constants, { FisApiSequence, fisFlows } from '../../../constants'
import { validateSchema, isObjectEmpty } from '../..'
import { validateContext } from './fisChecks'
import { logger } from '../../../shared/logger'
import _ from 'lodash'

interface Payment {
  time?: {
    label?: string
  }
  params?: {
    amount?: number
    currency?: string
  }
}

export const checkUpdate = (data: any, msgIdSet: any, flow: string) => {
  if (!data || isObjectEmpty(data)) {
    return { [FisApiSequence.UPDATE]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema('FIS', constants.UPDATE, data)
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

  //check order.id
  try {
    logger.info(`Checking id in message object  /${constants.UPDATE}`)
    if (!message?.order?.id) {
      errorObj.id = `order.id must be present in message object at /${constants.UPDATE}`
    } else {
      const orderId = getValue('orderId')
      if (!_.isEqual(message?.order?.id, orderId)) {
        errorObj.id = `order.id: ${message?.order?.id} mismatches with id:${orderId} provided is past call /${constants.UPDATE}`
      }
    }
  } catch (error: any) {
    logger.error(`!!Error while checking id in message object  /${constants.UPDATE}, ${error.stack}`)
  }

  if (!message.update_target || !message.order[message.update_target]) {
    const key = `${FisApiSequence.UPDATE}_message`
    errorObj[key] =
      'Invalid payload. update_target attribute must be present in message and order object must contain the specified update_target.'
  }

  const keyPrefix: string = `${FisApiSequence.UPDATE}`

  const validatePayments = (flowType: string, paramsCheck?: boolean): void => {
    const payments: Payment[] = message.order['payments']

    if (payments?.length > 0) {
      const payment: Payment | undefined = payments[0]

      if (!(payment?.time?.label === flowType)) {
        errorObj[`${keyPrefix}_label`] =
          `payments attribute must be present in order object and time.label must be ${flowType}.`
      }

      if (paramsCheck) {
        const params: Payment['params'] | undefined = payment?.params
        if (!params?.amount || !params?.currency) {
          errorObj[`${keyPrefix}_params`] =
            `payments attribute must be present in order object and params.amount and params.currency must be present.`
        } else {
          setValue('PRE_PART_AMOUNT', params?.amount)
        }
      }
    } else {
      errorObj[`${keyPrefix}_payments`] = 'payments attribute must be present in order object.'
    }
  }

  console.log('wnfjwnvjkernvjkernvjkernvjk    flow', flow)

  if (flow === fisFlows.PERSONAL && !message.order[message.update_target]?.personal_details) {
    errorObj[`${keyPrefix}_message`] = 'personal_details attribute must be present in order object.'
  } else if (flow === fisFlows.FORECLOSURE_PERSONAL) {
    validatePayments('FORECLOSURE')
  } else if (flow === fisFlows.PRE_PART_PERSONAL) {
    validatePayments('PRE_PART_PAYMENT', true)
  } else if (flow === fisFlows.MISSED_EMI_PERSONAL) {
    validatePayments('MISSED_EMI_PAYMENT')
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
