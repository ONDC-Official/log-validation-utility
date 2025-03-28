import { isObjectEmpty, validateSchema } from '../..'
import constants from '../../../constants'
import { logger } from '../../../shared/logger'
import { checkFullfillementType, checkItems, validateContext, validateProvider } from './fis14checks'
import _, { isEmpty } from 'lodash'

export const checkOnStatus = (data: any, msgIdSet: any, sequence: string) => {
  try {
    const errorObj: any = {}
    if (!data || isObjectEmpty(data)) {
      return { [constants.ON_STATUS]: 'JSON cannot be empty' }
    }
    console.log('sequence', sequence)

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('FIS14', constants.ON_STATUS, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.ON_STATUS, constants.ON_STATUS)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }
    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const ON_STATUS = message.order

    // check provider
    try {
      logger.info(`Checking provider details in /${constants.ON_STATUS}`)
      const providerErrors = validateProvider(ON_STATUS?.provider, constants.ON_STATUS)
      Object.assign(errorObj, providerErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking provider details in /${constants.ON_STATUS}`, error.stack)
    }

    // check fullfillment
    try {
      logger.info(`Validating fulfillments array in /${constants.ON_STATUS}`)
      const fulfillments = ON_STATUS?.fulfillments
      if (!fulfillments) {
        errorObj.fulfillments = `fulfillments is missing at /${constants.ON_STATUS}`
      } else {
        fulfillments?.map((fulfillment: any, i: number) => {
          if (!fulfillment?.type) {
            errorObj[`fulfillments[${i}].type`] =
              `fulfillment[${i}].type should be present in fulfillment${i} at /${constants.ON_STATUS}`
          } else {
            const obj = checkFullfillementType(fulfillment?.type, sequence as any)
            if (Object.keys(obj).length > 0) {
              errorObj.typeError = obj
            }
          }

          if (!fulfillment?.stops) {
            errorObj[`fulfillments[${i}].stops`] =
              `fulfillment[${i}].stops should be present in fulfillment${i} at /${constants.ON_SELECT}`
          }
          fulfillment?.stops.map((stop: any) => {
            if (!stop?.time?.schedule?.frequency) {
              errorObj[`fulfillments[${i}].stops.time.schedule.frequency`] =
                `fulfillment[${i}].stops.time.schedule.frequency should be present in fulfillment${i} at /${constants.SELECT}`
            }
          })
          if (!fulfillment?.customer?.person?.id) {
            errorObj[`fulfillments[${i}].customer.person.id`] =
              `fulfillment[${i}].customer.person.id should be present in fulfillment${i} at /${constants.ON_STATUS}`
          }
          if (!fulfillment?.agent) {
            errorObj[`fulfillments[${i}].agent`] =
              `fulfillment[${i}].agent should be present in fulfillment${i} at /${constants.ON_STATUS}`
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments array in /${constants.ON_STATUS}, ${error.stack}`)
    }

    // check quote
    try {
      logger.info(`Checking quotes in /${constants.ON_STATUS}`)
      const quote = ON_STATUS?.quote
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
        // if (!quote?.breakup?.price) {
        //   errorObj['quotes.breakup.price'] = 'quotes.breakup.price is missing in message.order'
        // }
        // if (!quote?.breakup?.title) {
        //   errorObj['quotes.breakup.title'] = 'quotes.breakup.title is missing in message.order'
        // }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking quotes in /${constants.ON_STATUS}`, error.stack)
    }

    // check payments
    try {
      logger.info(`Checking payments in /${constants.ON_STATUS}`)
      const payments = ON_STATUS?.payments
      if (isEmpty(payments)) {
        errorObj.payments = `payments array is missing or is empty`
      } else {
        payments?.map((payment: any, i: number) => {
          if (!payment?.type) {
            errorObj[`payments[${i}].type`] = `payments[${i}].type is missing in /${constants.ON_STATUS}`
          }
          if (!payment.collected_by) {
            errorObj[`payments[${i}].collected_by`] =
              `payments[${i}].collected_by is missing in /${constants.ON_STATUS}`
          }
          if (!payment.params.source_bank_code) {
            errorObj[`payments[${i}].params.source_bank_code`] =
              `payments[${i}].params.source_bank_code is missing in /${constants.ON_STATUS}`
          }
          if (!payment.params.source_bank_account_number) {
            errorObj[`payments[${i}].params.source_bank_account_number`] =
              `payments[${i}].params.source_bank_account_number is missing in /${constants.ON_STATUS}`
          }
          if (!payment.params.source_bank_account_name) {
            errorObj[`payments[${i}].params.source_bank_account_name`] =
              `payments[${i}].params.source_bank_account_name is missing in /${constants.ON_STATUS}`
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Errors while checking payments in /${constants.ON_STATUS}, ${error.stack}`)
    }
    // check items
    try {
      logger.info(`Validating items array in /${constants.ON_STATUS}`)
      const error = checkItems(ON_STATUS)
      Object.assign(errorObj, error)
    } catch (error: any) {
      logger.error(`!!Error while checking items array in /${constants.ON_STATUS}, ${error.stack}`)
    }

    // cancel terms
    try {
      logger.info(`Checking cancel terms in /${constants.ON_STATUS}`)
      const cancelTerms = ON_STATUS?.cancellation_terms
      if (!cancelTerms) {
        errorObj['cancellation_terms'] = 'cancellation_terms is missing in /${constants.ON_STATUS}'
      }
      //     "reason_required": true,
      //     "external_ref": {
      //       "url": "https://api.sellerapp.com/cterms?id=214werw3w4",
      //       "mimetype": "text/html"
      //     }
      //   }
      cancelTerms?.map((term: any, i: number) => {
        if (!term?.reason_required) {
          errorObj[`cancellation_terms[${i}].reason_required`] =
            `cancellation_terms[${i}].reason_required is missing in /${constants.ON_STATUS}`
        }
        if (!term?.external_ref?.url) {
          errorObj[`cancellation_terms[${i}].external_ref.url`] =
            `cancellation_terms[${i}].external_ref.url is missing in /${constants.ON_STATUS}`
        }
        if (!term?.external_ref?.mimetype) {
          errorObj[`cancellation_terms[${i}].external_ref.mimetype`] =
            `cancellation_terms[${i}].external_ref.mimetype is missing in /${constants.ON_STATUS}`
        }
      })
    } catch (error: any) {
      logger.error(`!!Error while checking cancel terms in /${constants.ON_STATUS}`, error.stack)
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_STATUS} API`, err)
    return { error: err.message }
  }
}
