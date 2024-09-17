import { isObjectEmpty, validateSchema } from 'utils'
import constants from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateContext, validateProvider } from './fis14checks'
import _ from 'lodash'

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

    // check quotes
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

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_INIT} API`, err)
    return { error: err.message }
  }
}
