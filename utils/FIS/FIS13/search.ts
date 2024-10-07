import { logger } from '../../../shared/logger'
import { setValue, getValue } from '../../../shared/dao'
import constants, { insuranceFlows } from '../../../constants'
import { validateSchema, isObjectEmpty, checkFISContext } from '../../../utils'
import { validatePaymentTags } from './tags'
import { validateContext, validateXInputSubmission } from './fisChecks'
import { isEmpty, isEqual } from 'lodash'

export const search = (data: any, msgIdSet: any, flow: string, action: string) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [action]: 'JSON cannot be empty' }
    }

    if (
      !data.message ||
      !data.context ||
      !data.message.intent ||
      isObjectEmpty(data.message) ||
      isObjectEmpty(data.message.intent)
    ) {
      errorObj['missingFields'] = '/context, /message, /intent or /message/intent is missing or empty'
      return Object.keys(errorObj).length > 0 && errorObj
    }

    const { context, message } = data
    msgIdSet.add(context.message_id)

    // validate schema
    const schemaValidation = validateSchema('FIS', constants.SEARCH, data)
    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    // validate context
    let contextRes: any
    if (action?.includes('_offer')) {
      // if action is search_offer, validate context with bpp & bap details
      contextRes = validateContext(context, msgIdSet, action, constants.SEARCH)
    } else {
      // if action is search, validate context with only bap details
      contextRes = checkFISContext(data.context, action)
      setValue(`${action}_context`, data.context)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    // validate message
    try {
      // validate category
      logger.info(`Validating category in /${action}`)
      const code = message.intent?.category?.descriptor?.code
      if (code) {
        if (code != insuranceFlows[flow as keyof typeof insuranceFlows]) {
          errorObj['category'] = `code value should be ${
            insuranceFlows[flow as keyof typeof insuranceFlows]
          }, in a standard enum format as at category.descriptor`
        }

        setValue(`insurance`, code)
      } else
        errorObj['category'] = `code: ${
          insuranceFlows[flow as keyof typeof insuranceFlows]
        } must be present at category.descriptor`
    } catch (error: any) {
      logger.error(`!!Error occcurred while validating category in /${action},  ${error.message}`)
    }

    // validate payments
    try {
      logger.info(`Validating payments in /${action}`)
      const payment = message.intent?.payment
      if (!payment) errorObj[`payment`] = `payment is missing in ${action}`
      else {
        const collectedBy = payment?.collected_by
        const allowedCollectedByValues = ['BPP', 'BAP']
        const terms: any = [
          { code: 'STATIC_TERMS', type: 'url' },
          {
            code: 'OFFLINE_CONTRACT',
            type: 'boolean',
          },
        ]

        if (!collectedBy) {
          errorObj[`collected_by`] = `payment.collected_by must be present in ${action}`
        } else if (!allowedCollectedByValues.includes(collectedBy)) {
          errorObj['collected_by'] = `Invalid value for collected_by, should be either of ${allowedCollectedByValues}`
        } else {
          if (collectedBy == 'BPP') terms?.push({ code: 'DELAY_INTEREST', type: 'amount' })
          else {
            terms?.push({ code: 'SETTLEMENT_WINDOW', type: 'time', value: '/^PTd+[MH]$/' })
            terms?.push({
              code: 'SETTLEMENT_BASIS',
              type: 'enum',
              value: ['INVOICE_RECEIPT', 'Delivery', 'return_window_expiry'],
            })
          }

          setValue(`collected_by`, collectedBy)
        }

        // Validate payment tags
        const tagsValidation = validatePaymentTags(payment.tags, terms)
        console.log('tagsValidation', tagsValidation)
        if (!tagsValidation.isValid) {
          Object.assign(errorObj, { tags: tagsValidation.errors })
        }
      }
    } catch (error: any) {
      console.log('error', error)
      logger.error(`!!Error occcurred while validating payments in /${action},  ${error.message}`)
    }

    // checking providers
    try {
      // validate providers if type action is search_offer
      console.log('action', action)
      if (isEqual(action, 'search_offer')) {
        logger.info(`Validating providers in /${action}`)
        const provider = message.intent?.provider

        if (isEmpty(provider)) {
          errorObj.prvdr = `provider is missing in /${action}`
        } else {
          const providerId = getValue(`${constants.ON_SEARCH}prvdrsId`)
          const itemId = getValue(`${constants.ON_SEARCH}_itemsId`)

          console.log('providerId', providerId, providerId?.includes(provider?.id))

          if (!provider?.id) {
            errorObj.prvdrId = `provider.id is missing in /${action}`
          } else if (providerId && !providerId?.includes(provider?.id)) {
            errorObj.prvdrId = `provider.id: ${provider?.id} in /${action} does'nt exist in /${constants.ON_SEARCH}`
          }

          //check items
          try {
            logger.info(`checking item array in provider /${action}`)
            if (!provider.items) {
              errorObj.items = `items array must be present & should non empty in /${action}`
            } else {
              provider.items.forEach((item: any, index: number) => {
                // Validate item id
                if (!item?.id) {
                  errorObj[`item[${index}].id`] = `id should be present at item[${index}] /${action}`
                } else {
                  if (itemId && !itemId.includes(item.id)) {
                    const key = `item[${index}].item_id`
                    errorObj[
                      key
                    ] = `/message/order/items/id in item: ${item.id} should be one of the item.id mapped in previous call`
                  }
                }

                //validate xInput form
                const xinputErrors = validateXInputSubmission(item?.xinput, index, action)
                Object.assign(errorObj, xinputErrors)
              })
            }
          } catch (error: any) {
            logger.error(`!!Error while checking item in /${action}`)
          }
        }
      }
    } catch (error: any) {
      logger.error(`!!Error occcurred while validating providers in /${action},  ${error.message}`)
    }

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}
