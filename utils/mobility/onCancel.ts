/* eslint-disable no-prototype-builtins */
// import _ from 'lodash'
import constants, { mobilitySequence } from '../../constants'
import { logger } from '../../shared/logger'
import { validateSchema, isObjectEmpty } from '../'
import { getValue, setValue } from '../../shared/dao'
import {
  validateCancellationTerms,
  validateContext,
  validatePayloadAgainstSchema,
  validateProviderId,
  validateItems,
  validatePaymentObject,
  validateQuote,
  validateFulfillments,
} from './mobilityChecks'
import _ from 'lodash'
import attributeConfig from './config/config2.0.1.json'

export const checkOnCancel = (data: any, msgIdSet: any, sequence: string, version: any) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [mobilitySequence.ON_CANCEL]: 'JSON cannot be empty' }
    }

    const { message, context } = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /catalog or /message/catalog is missing or empty' }
    }

    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.ON_CANCEL, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.CANCEL, constants.ON_CANCEL)
    setValue(`${mobilitySequence.ON_CANCEL}_message`, message)

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    const onCancel: any = message.order
    const fulfillmentIdsSet = new Set()
    const itemIDS: any = getValue('ItmIDS')
    const itemIdArray: any[] = []

    let newItemIDSValue: any[]

    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      onCancel.items.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
    }

    setValue('ItmIDS', newItemIDSValue)

    if (!('id' in onCancel)) {
      errorObj['order'] = `id should be sent in /${constants.ON_CANCEL}`
    }

    // check status
    try {
      logger.info(`Validating status for /${constants.ON_CANCEL}`)
      const status = onCancel?.status
      if (!status) {
        errorObj['status'] = `status should be sent in /${constants.CANCEL}`
      } else if (sequence === 'on_cancel') {
        if (status !== 'CANCELLED') {
          errorObj['status'] = `status should be CANCELLED in /${constants.ON_CANCEL}`
        }
      } else if (sequence === 'soft_on_cancel') {
        if (status !== 'SOFT_CANCEL') {
          errorObj['status'] = `status should be SOFT_CANCEL in /${constants.ON_CANCEL}`
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while validating provider for /${constants.ON_CANCEL}, ${error.stack}`)
    }

    //provider id check
    try {
      logger.info(`Checking provider id in /${constants.ON_CANCEL}`)
      const providerError = validateProviderId(onCancel?.provider?.id, constants.CANCEL, constants.ON_CANCEL)
      Object.assign(errorObj, providerError)
    } catch (error: any) {
      logger.error(`!!Error while checking provider id in /${constants.ON_CANCEL}, ${error.stack}`)
    }

    //fulfillments checks
    let stateCode: string = 'RIDE_CANCELLED'
    if (sequence == 'soft_on_cancel') {
      stateCode = 'RIDE_CONFIRMED'
    }
    const fulfillmentError = validateFulfillments(
      onCancel?.fulfillments,
      fulfillmentIdsSet,
      constants.ON_STATUS,
      false,
      true,
      stateCode,
    )
    Object.assign(errorObj, fulfillmentError)

    //items checks
    const itemErrors = validateItems(onCancel?.items, constants.ON_CANCEL, fulfillmentIdsSet)
    Object.assign(errorObj, itemErrors)

    // check payments
    try {
      logger.info(`Checking payments in /${constants.ON_CANCEL}`)
      const payments = onCancel?.payments
      const paymentErrors = validatePaymentObject(payments, constants.ON_CANCEL)
      Object.assign(errorObj, paymentErrors)
    } catch (error: any) {
      logger.error(`!!Errors while checking payments in /${constants.ON_CANCEL}, ${error.stack}`)
    }

    //quote check
    try {
      logger.info(`Checking quote details in /${constants.ON_CANCEL}`)
      const quoteErrors = validateQuote(onCancel?.quote, constants.ON_CANCEL)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking Quote in /${constants.ON_CANCEL},  ${error.message}`)
      return { error: error.message }
    }

    //cancellation_terms check
    try {
      logger.info(`Checking cancellation terms in /${constants.ON_CANCEL}`)
      const cancellationErrors = validateCancellationTerms(onCancel.cancellation_terms, constants.ON_CANCEL)
      Object.assign(errorObj, cancellationErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation_terms in /${constants.ON_CANCEL}, ${error.stack}`)
    }

    if (version === '2.0.1') {
      const additionalAttributes: any = attributeConfig.on_cancel
      validatePayloadAgainstSchema(additionalAttributes, data, errorObj, '', '')
    }

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_CANCEL} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}
