import { logger } from '../../../shared/logger'

import constants from '../../../constants'
import { isValidPhoneNumber, validateSchema } from '../..'
import { checkItems, validateContext, validateProvider } from './fis14checks'
// import { error } from 'console'
import { isEmpty } from 'lodash'
import _ from 'lodash'

export const checkOnConfirm = (data: any, msgIdSet: any, sequence: string) => {
  try {
    const errorObj: any = {}
    if (!data || Object.keys(data).length === 0) {
      return { error: 'JSON cannot be empty' }
    }
    console.log('sequence', sequence)
    const { message, context }: any = data
    if (
      !message ||
      !context ||
      !message.order ||
      Object.keys(message).length === 0 ||
      Object.keys(message.order).length === 0
    ) {
      return { error: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('FIS', constants.ON_CONFIRM, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.CONFIRM, constants.ON_CONFIRM)

    if (schemaValidation !== 'error') {
      return schemaValidation
    }
    if (!contextRes?.valid) {
      return contextRes.ERRORS
    }

    const on_confirm = message.order

    if (!on_confirm.status) {
      errorObj['status'] = 'status is required'
    }
    if (!on_confirm.id) {
      errorObj['id'] = 'id is required'
    }

    // check provider
    try {
      logger.info(`Checking provider details in /${constants.ON_CONFIRM}`)
      const providerErrors = validateProvider(on_confirm?.provider, constants.ON_CONFIRM)
      Object.assign(errorObj, providerErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking provider details in /${constants.ON_CONFIRM}`, error.stack)
    }
    // check fullfillment
    try {
      logger.info(`Validating fulfillments array in /${constants.ON_CONFIRM}`)
      const fulfillments = on_confirm?.fulfillments
      if (!fulfillments) {
        errorObj.fulfillments = `fulfillments is missing at /${constants.ON_CONFIRM}`
      } else {
        fulfillments?.map((fulfillment: any, i: number) => {
          if (!fulfillment?.type) {
            errorObj[`fulfillments[${i}].type`] =
              `fulfillment[${i}].type should be present in fulfillment${i} at /${constants.ON_CONFIRM}`
          }
          if (!fulfillment?.contact?.phone || !isValidPhoneNumber(fulfillment?.contact?.phone)) {
            errorObj[`fulfillments[${i}].contact.phone`] =
              `contact.phone should be present with valid value in fulfillment${i} at /${constants.ON_CONFIRM}`
          }
          if (!fulfillment?.stops?.time?.schedule?.frequency) {
            errorObj[`fulfillments[${i}].stops.time.schedule.frequency`] =
              `fulfillment[${i}].stops.time.schedule.frequency should be present in fulfillment${i} at /${constants.ON_CONFIRM}`
          }
          if (!fulfillment?.customer?.person?.id) {
            errorObj[`fulfillments[${i}].customer.person.id`] =
              `fulfillment[${i}].customer.person.id should be present in fulfillment${i} at /${constants.ON_CONFIRM}`
          }
          if (!fulfillment?.agent) {
            errorObj[`fulfillments[${i}].agent`] =
              `fulfillment[${i}].agent should be present in fulfillment${i} at /${constants.ON_CONFIRM}`
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments array in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    // check quote
    try {
      logger.info(`Checking quotes in /${constants.ON_CONFIRM}`)
      const quote = on_confirm?.quote
      if (_.isEmpty(quote)) {
        errorObj['quotes'] = 'quotes array is missing or empty in message.order'
      } else {
        if (!quote?.id) {
          errorObj['quotes.id'] = 'quotes.id is missing in message.order'
        }
        if (!quote?.price) {
          errorObj['quotes.price'] = 'quotes.price is missing in message.order'
        }
        if (!quote?.breakup) {
          errorObj['quotes.breakup'] = 'quotes.breakup is missing in message.order'
        }
        if (!quote?.breakup?.price) {
          errorObj['quotes.breakup.price'] = 'quotes.breakup.price is missing in message.order'
        }
        if (!quote?.breakup?.title) {
          errorObj['quotes.breakup.title'] = 'quotes.breakup.title is missing in message.order'
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking quotes in /${constants.ON_CONFIRM}`, error.stack)
    }

    // check payments
    try {
      logger.info(`Checking payments in /${constants.ON_CONFIRM}`)
      const payments = on_confirm?.payments
      if (isEmpty(payments)) {
        errorObj.payments = `payments array is missing or is empty`
      } else {
        payments?.map((payment: any, i: number) => {
          if (!payment?.type) {
            errorObj[`payments[${i}].type`] = `payments[${i}].type is missing in /${constants.ON_CONFIRM}`
          }
          if (!payment.collected_by) {
            errorObj[`payments[${i}].collected_by`] =
              `payments[${i}].collected_by is missing in /${constants.ON_CONFIRM}`
          }
          if (!payment.params.source_bank_code) {
            errorObj[`payments[${i}].params.source_bank_code`] =
              `payments[${i}].params.source_bank_code is missing in /${constants.ON_CONFIRM}`
          }
          if (!payment.params.source_bank_account_number) {
            errorObj[`payments[${i}].params.source_bank_account_number`] =
              `payments[${i}].params.source_bank_account_number is missing in /${constants.ON_CONFIRM}`
          }
          if (!!payment.params.source_bank_account_name) {
            errorObj[`payments[${i}].params.source_bank_account_name`] =
              `payments[${i}].params.source_bank_account_name is missing in /${constants.ON_CONFIRM}`
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Errors while checking payments in /${constants.ON_CONFIRM}, ${error.stack}`)
    }
    // check items
    try {
      logger.info(`Validating items array in /${constants.ON_CONFIRM}`)
      const error = checkItems(on_confirm)
      Object.assign(errorObj, error)
    } catch (error: any) {
      logger.error(`!!Error while checking items array in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_CONFIRM} API`, err)
    return { error: err.message }
  }
}
