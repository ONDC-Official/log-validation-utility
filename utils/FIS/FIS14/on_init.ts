import { isObjectEmpty, validateSchema } from 'utils'
import constants from '../../../constants'
import { logger } from '../../../shared/logger'
import { checkItems, isValidPhoneNumber, validateContext, validateProvider } from './fis14checks'
import _, { isEmpty } from 'lodash'

export const checkOnInit = (data: any, msgIdSet: any, sequence: string) => {
  try {
    const errorObj: any = {}
    if (!data || isObjectEmpty(data)) {
      return { [constants.ON_INIT]: 'JSON cannot be empty' }
    }
    console.log('sequence', sequence)

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('FIS', constants.ON_INIT, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.INIT, constants.ON_INIT)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }
    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const on_init = message.order

    // check provider
    try {
      logger.info(`Checking provider details in /${constants.ON_INIT}`)
      const providerErrors = validateProvider(on_init?.provider, constants.ON_INIT)
      Object.assign(errorObj, providerErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking provider details in /${constants.ON_INIT}`, error.stack)
    }

    // check fullfillment
    try {
      logger.info(`Validating fulfillments array in /${constants.INIT}`)
      const fulfillments = on_init?.fulfillments
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

    // check quote
    try {
      logger.info(`Checking quotes in /${constants.ON_INIT}`)
      const quote = on_init?.quote
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
      logger.error(`!!Error while checking quotes in /${constants.ON_INIT}`, error.stack)
    }

    // check payments
    try {
      logger.info(`Checking payments in /${constants.INIT}`)
      const payments = on_init?.payments
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
    // check items
    try {
      logger.info(`Validating items array in /${constants.ON_INIT}`)
      const error = checkItems(on_init)
      Object.assign(errorObj, error)
    } catch (error: any) {
      logger.error(`!!Error while checking items array in /${constants.ON_INIT}, ${error.stack}`)
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_INIT} API`, err)
    return { error: err.message }
  }
}
