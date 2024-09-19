import { isObjectEmpty, validateSchema } from '../..'
import constants from '../../../constants'
import { logger } from '../../../shared/logger'
import { checkItems, isValidPhoneNumber, validateContext, validateProvider } from './fis14checks'
import _, { isEmpty } from 'lodash'

export const checkOnUpdate = (data: any, msgIdSet: any, sequence: string) => {
  try {
    const errorObj: any = {}
    if (!data || isObjectEmpty(data)) {
      return { [constants.ON_UPDATE]: 'JSON cannot be empty' }
    }
    console.log('sequence', sequence)

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('FIS', constants.ON_UPDATE, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.INIT, constants.ON_UPDATE)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }
    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const ON_UPDATE = message.order

    // check provider
    try {
      logger.info(`Checking provider details in /${constants.ON_UPDATE}`)
      const providerErrors = validateProvider(ON_UPDATE?.provider, constants.ON_UPDATE)
      Object.assign(errorObj, providerErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking provider details in /${constants.ON_UPDATE}`, error.stack)
    }

    // check fullfillment
    try {
      logger.info(`Validating fulfillments array in /${constants.INIT}`)
      const fulfillments = ON_UPDATE?.fulfillments
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
      logger.info(`Checking quotes in /${constants.ON_UPDATE}`)
      const quote = ON_UPDATE?.quote
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
      logger.error(`!!Error while checking quotes in /${constants.ON_UPDATE}`, error.stack)
    }

    // check payments
    try {
      logger.info(`Checking payments in /${constants.INIT}`)
      const payments = ON_UPDATE?.payments
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
      logger.info(`Validating items array in /${constants.ON_UPDATE}`)
      const error = checkItems(ON_UPDATE)
      Object.assign(errorObj, error)
    } catch (error: any) {
      logger.error(`!!Error while checking items array in /${constants.ON_UPDATE}, ${error.stack}`)
    }

    // base detials
    try {
      logger.info(`Checking base details in /${constants.ON_UPDATE}`)
      if (!ON_UPDATE.id) {
        errorObj['id'] = 'id is missing in message.order'
      }
      if (!ON_UPDATE.status) {
        errorObj['status'] = 'status is missing in message.order'
      }
      if (!ON_UPDATE.created_at) {
        errorObj['created_at'] = 'created_at is missing in message.order'
      }
      if (!ON_UPDATE.updated_at) {
        errorObj['updated_at'] = 'updated_at is missing in message.order'
      }
      if (!ON_UPDATE.ref_order_ids) {
        errorObj['ref_order_ids'] = 'ref_order_ids is missing in message.order'
      }
    } catch (error: any) {
      logger.error(`!!Error while checking base details in /${constants.ON_UPDATE}`, error.stack)
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_UPDATE} API`, err)
    return { error: err.message }
  }
}
