import { logger } from 'shared/logger'
import { isObjectEmpty, validateSchema } from 'utils'
import constants from '../../../constants'
import { checkItems, isValidPhoneNumber, validateContext, validateProvider } from './fis14checks'
import { isEmpty } from 'lodash'

export const checkConfirm = (data: any, msgIdSet: any, sequence: string) => {
  try {
    const errorObj: any = {}

    if (!data || isObjectEmpty(data)) {
      return { [constants.ON_CONFIRM]: 'JSON cannot be empty' }
    }
    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('FIS', constants.ON_CONFIRM, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.CONFIRM, constants.ON_CONFIRM)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }
    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const confirm = message.order

    // check provider
    try {
      logger.info(`Checking provider details in /${constants.ON_INIT}`)
      const providerErrors = validateProvider(confirm?.provider, constants.ON_INIT)
      Object.assign(errorObj, providerErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking provider details in /${constants.ON_INIT}`, error.stack)
    }
    // check items
    try {
      logger.info(`Validating items array in /${constants.ON_INIT}`)
      const error = checkItems(confirm)
      Object.assign(errorObj, error)
    } catch (error: any) {
      logger.error(`!!Error while checking items array in /${constants.ON_INIT}, ${error.stack}`)
    }

    // check fullfillment
    try {
      logger.info(`Validating fulfillments array in /${constants.INIT}`)
      const fulfillments = confirm?.fulfillments
      if (!fulfillments) {
        errorObj.fulfillments = `fulfillments is missing at /${constants.INIT}`
      } else {
        fulfillments?.map((fulfillment: any, i: number) => {
          if (!fulfillment?.type) {
            errorObj[`fulfillments[${i}].type`] =
              `fulfillment[${i}].type should be present in fulfillment${i} at /${constants.INIT}`
          }
          if (!fulfillment?.contact?.phone || !isValidPhoneNumber(fulfillment?.contact?.phone)) {
            errorObj[`fulfillments[${i}].contact.phone`] =
              `contact.phone should be present with valid value in fulfillment${i} at /${constants.INIT}`
          }
          if (!fulfillment?.stops?.time?.schedule?.frequency) {
            errorObj[`fulfillments[${i}].stops.time.schedule.frequency`] =
              `fulfillment[${i}].stops.time.schedule.frequency should be present in fulfillment${i} at /${constants.INIT}`
          }
          if (!fulfillment?.customer?.person?.id) {
            errorObj[`fulfillments[${i}].customer.person.id`] =
              `fulfillment[${i}].customer.person.id should be present in fulfillment${i} at /${constants.INIT}`
          }
          if (!fulfillment?.agent) {
            errorObj[`fulfillments[${i}].agent`] =
              `fulfillment[${i}].agent should be present in fulfillment${i} at /${constants.INIT}`
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments array in /${constants.INIT}, ${error.stack}`)
    }

    // payments
    try {
      logger.info(`Checking payments in /${constants.INIT}`)
      const payments = confirm?.payments
      if (isEmpty(payments)) {
        errorObj.payments = `payments array is missing or is empty`
      } else {
        payments?.map((payment: any, i: number) => {
          if (!payment?.type) {
            errorObj[`payments[${i}].type`] = `payments[${i}].type is missing in /${constants.INIT}`
          }
          if (!payment.collected_by) {
            errorObj[`payments[${i}].collected_by`] = `payments[${i}].collected_by is missing in /${constants.INIT}`
          }
          if (!payment.params.source_bank_code) {
            errorObj[`payments[${i}].params.source_bank_code`] =
              `payments[${i}].params.source_bank_code is missing in /${constants.INIT}`
          }
          if (!payment.params.source_bank_account_number) {
            errorObj[`payments[${i}].params.source_bank_account_number`] =
              `payments[${i}].params.source_bank_account_number is missing in /${constants.INIT}`
          }
          if (!!payment.params.source_bank_account_name) {
            errorObj[`payments[${i}].params.source_bank_account_name`] =
              `payments[${i}].params.source_bank_account_name is missing in /${constants.INIT}`
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Errors while checking payments in /${constants.INIT}, ${error.stack}`)
    }

    return errorObj
  } catch (error: any) {
    logger.error(`!!Error while checking confirm details in /${constants.ON_CONFIRM}`, error.stack)
    return { error: error.message }
  }
}
