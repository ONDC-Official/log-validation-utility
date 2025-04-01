import { isObjectEmpty, validateSchema } from '../..'
import constants from '../../../constants'
import { logger } from '../../../shared/logger'
import {
  checkFullfillementType,
  checkItems,
  isValidPhoneNumber,
  validateContext,
  validateProvider,
  validatePayments,
} from './fis14checks'
import {
  validateSIPFlow,
  validateSIPInstalmentFlow,
  validateLumpsumFlow,
  validateRedemptionFlow
} from './flowValidationsOn_Update'
import _ from 'lodash'

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

    const schemaValidation = validateSchema('FIS14', constants.ON_UPDATE, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.ON_UPDATE, constants.ON_UPDATE)

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
      logger.info(`Validating fulfillments array in /${constants.ON_UPDATE}`)
      const fulfillments = ON_UPDATE?.fulfillments
      if (!fulfillments) {
        errorObj.fulfillments = `fulfillments is missing at /${constants.ON_UPDATE}`
      } else {
        fulfillments?.forEach((fulfillment: any, i: number) => {
          if (!fulfillment?.type) {
            errorObj[`fulfillments[${i}].type`] =
              `fulfillment[${i}].type should be present in fulfillment${i} at /${constants.ON_UPDATE}`
          } else {
            const obj = checkFullfillementType(fulfillment?.type, sequence as any)
            if (Object.keys(obj).length > 0) {
              errorObj.typeError = obj
            }
            
            switch(fulfillment.type) {
              case 'SIP':
                validateSIPFlow(fulfillment, errorObj, i)
                break
              case 'SIP_INSTALMENT':
                validateSIPInstalmentFlow(fulfillment, errorObj, i, ON_UPDATE.status)
                break
              case 'LUMPSUM':
                validateLumpsumFlow(fulfillment, errorObj, i, ON_UPDATE.status)
                break
              case 'REDEMPTION':
                validateRedemptionFlow(fulfillment, errorObj, i)
                break
              default:
                errorObj[`fulfillments[${i}].type.unknown`] = 
                  `Unknown fulfillment type: ${fulfillment.type}`
            }
          }
          
          // Common validations for all fulfillment types
          if (!fulfillment?.contact?.phone || !isValidPhoneNumber(fulfillment?.contact?.phone)) {
            errorObj[`fulfillments[${i}].contact.phone`] =
              `contact.phone should be present with valid value in fulfillment${i} at /${constants.ON_UPDATE}`
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments array in /${constants.ON_UPDATE}, ${error.stack}`)
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
        } else if (Array.isArray(quote.breakup)) {
          quote.breakup.forEach((item: any, i: number) => {
            if (!item?.price) {
              errorObj[`quotes.breakup[${i}].price`] = `quotes.breakup[${i}].price is missing`
            }
            if (!item?.title) {
              errorObj[`quotes.breakup[${i}].title`] = `quotes.breakup[${i}].title is missing`
            }
          })
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking quotes in /${constants.ON_UPDATE}`, error.stack)
    }
    try {
      logger.info(`Checking payments in /${constants.ON_UPDATE}`)
      validatePayments(ON_UPDATE?.payments || [], errorObj, ON_UPDATE?.status)
    } catch (error: any) {
      logger.error(`!!Errors while checking payments in /${constants.ON_UPDATE}, ${error.stack}`)
    }
    
    // check items
    try {
      logger.info(`Validating items array in /${constants.ON_UPDATE}`)
      const error = checkItems(ON_UPDATE)
      Object.assign(errorObj, error)
    } catch (error: any) {
      logger.error(`!!Error while checking items array in /${constants.ON_UPDATE}, ${error.stack}`)
    }

    // base details
    try {
      logger.info(`Checking base details in /${constants.ON_UPDATE}`)
      if (!ON_UPDATE.id) {
        errorObj['id'] = 'id is missing in message.order'
      }
      if (!ON_UPDATE.status) {
        errorObj['status'] = 'status is missing in message.order'
      } else {
        // Validate status values
        const validStatuses = ['CREATED', 'ACCEPTED', 'IN-PROGRESS', 'COMPLETED', 'CANCELLED']
        if (!validStatuses.includes(ON_UPDATE.status)) {
          errorObj['status.value'] = `status must be one of: ${validStatuses.join(', ')}`
        }
      }
      if (!ON_UPDATE.created_at) {
        errorObj['created_at'] = 'created_at is missing in message.order'
      }
      if (!ON_UPDATE.updated_at) {
        errorObj['updated_at'] = 'updated_at is missing in message.order'
      } else if (ON_UPDATE.created_at && new Date(ON_UPDATE.updated_at) < new Date(ON_UPDATE.created_at)) {
        errorObj['updated_at.value'] = 'updated_at cannot be earlier than created_at'
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
