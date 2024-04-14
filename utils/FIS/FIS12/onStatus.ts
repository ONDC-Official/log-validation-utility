/* eslint-disable no-prototype-builtins */
import constants, { FisApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty } from '../../'
import { getValue, setValue } from '../../../shared/dao'
import {
  validateCancellationTerms,
  validateContext,
  validateDocuments,
  validateFulfillments,
  validatePaymentsObject,
  validateXInputSubmission,
} from './fisChecks'
import { isEmpty } from 'lodash'
import { validatePaymentTags } from './tags'

export const checkOnStatus = (data: any, msgIdSet: any, sequence: string) => {
  const onStatusObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [FisApiSequence.ON_STATUS]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('FIS', constants.ON_STATUS, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.STATUS, constants.ON_STATUS)

    if (schemaValidation !== 'error') {
      Object.assign(onStatusObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(onStatusObj, contextRes.ERRORS)
    }

    setValue(`${FisApiSequence.ON_STATUS}`, data)

    const on_status = message.order
    const itemIDS: any = getValue('ItmIDS')
    const itemIdArray: any[] = []

    let newItemIDSValue: any[]

    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      on_status.items.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
    }

    setValue('ItmIDS', newItemIDSValue)

    try {
      logger.info(`Checking provider id /${constants.ON_STATUS}`)
      if (on_status.provider.id != getValue('providerId')) {
        onStatusObj.prvdrId = `Provider Id mismatches in /${constants.ON_SEARCH} and /${constants.ON_STATUS}`
      }

      logger.info(`Checking tags in /${constants.ON_STATUS}`)
      const providerTags = on_status.provider.tags

      if (!providerTags || !Array.isArray(providerTags) || providerTags.length === 0) {
        onStatusObj.tags = 'Tags array is missing or empty in provider'
      }
    } catch (error: any) {
      logger.error(`!!Error while checking provider id /${constants.ON_STATUS}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing item in and /${constants.ON_UPDATE}`)

      on_status.items.forEach((item: any, index: number) => {
        if (!newItemIDSValue.includes(item.id)) {
          const key = `item[${index}].item_id`
          onStatusObj[
            key
          ] = `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in previous call`
        }

        if (sequence === FisApiSequence.ON_STATUS) {
          if (
            item.xinput &&
            (!item.xinput.form_response ||
              !item.xinput.form_response.status ||
              !item.xinput.form_response.submission_id)
          ) {
            onStatusObj.xinput = `xinput or xinput.form_response is missing in /${constants.ON_STATUS}`
          }
        } else {
          //validate xInput form
          const xinputErrors = validateXInputSubmission(item?.xinput, index, sequence)
          Object.assign(onStatusObj, xinputErrors)
        }

        if (item.tags) {
          const loanInfoTag = item.tags.find((tag: any) => tag.descriptor.code === 'LOAN_INFO')
          if (!loanInfoTag) {
            onStatusObj[`loanInfoTagSubtagsMissing`] = `The LOAN_INFO tag group for Item ${item.id}: was not found`
          }
        }

        // if (item?.descriptor?.code !== fisFlows[flow as keyof typeof fisFlows])
        //   onStatusObj[`item[${index}].code`] = `Descriptor code: ${
        //     item?.descriptor?.code
        //   } in item[${index}] must be the same as ${fisFlows[flow as keyof typeof fisFlows]}`

        if (on_status.quote.price.value !== item?.price?.value) {
          onStatusObj[`item${index}_price`] = `Price mismatch for item: ${item.id}`
        }
      })
    } catch (error: any) {
      logger.error(`!!Error while comparing Item in /${constants.ON_UPDATE}, ${error.stack}`)
    }

    try {
      logger.info(`Checking fulfillments objects in /${constants.ON_STATUS}`)
      let i = 0
      const len = on_status.fulfillments.length
      while (i < len) {
        const fulfillment = on_status.fulfillments[i]
        const fulfillmentErrors = validateFulfillments(fulfillment, i, on_status.documents)
        if (fulfillmentErrors) {
          Object.assign(onStatusObj, fulfillmentErrors)
        }

        i++
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments object in /${constants.ON_STATUS}, ${error.stack}`)
    }

    try {
      logger.info(`Checking quote details in /${constants.ON_STATUS}`)

      const quote = on_status.quote
      const quoteBreakup = quote.breakup

      const requiredBreakupItems = [
        'PRINCIPAL',
        'INTEREST',
        'NET_DISBURSED_AMOUNT',
        'OTHER_UPFRONT_CHARGES',
        'INSURANCE_CHARGES',
        'OTHER_CHARGES',
        'PROCESSING_FEE',
      ]
      const missingBreakupItems = requiredBreakupItems.filter(
        (item) => !quoteBreakup.find((breakupItem: any) => breakupItem.title.toUpperCase() === item),
      )

      if (missingBreakupItems.length > 0) {
        onStatusObj.missingBreakupItems = `Quote breakup is missing the following items: ${missingBreakupItems.join(
          ', ',
        )}`
      }

      const totalBreakupValue = quoteBreakup.reduce(
        (total: any, item: any) =>
          total + (item.title.toUpperCase() != 'NET_DISBURSED_AMOUNT' ? parseFloat(item.price.value) : 0),
        0,
      )
      const priceValue = parseFloat(quote.price.value)

      if (totalBreakupValue !== priceValue) {
        onStatusObj.breakupTotalMismatch = `Total of quote breakup (${totalBreakupValue}) does not match with price.value (${priceValue})`
      }

      const currencies = quoteBreakup.map((item: any) => item.currency)
      if (new Set(currencies).size !== 1) {
        onStatusObj.multipleCurrencies = 'Currency must be the same for all items in the quote breakup'
      }

      if (!quote.ttl) {
        onStatusObj.missingTTL = 'TTL is required in the quote'
      }
    } catch (error: any) {
      logger.error(`!!Error while checking quote details in /${constants.ON_STATUS}`, error.stack)
    }

    // check payments
    try {
      logger.info(`Checking payments in /${constants.ON_STATUS}`)
      const payments = on_status?.payments

      if (sequence === FisApiSequence.ON_STATUS) {
        const paymentError = validatePaymentsObject(payments, constants.ON_STATUS)
        if (paymentError) Object.assign(onStatusObj, paymentError)
      } else {
        if (isEmpty(payments)) {
          onStatusObj.payments = `payments array is missing or is empty`
        } else {
          const allowedStatusValues = ['NOT-PAID', 'PAID']
          payments?.forEach((arr: any, i: number) => {
            const terms = [
              { code: 'SETTLEMENT_WINDOW', type: 'time', value: '/^PTd+[MH]$/' },
              {
                code: 'SETTLEMENT_BASIS',
                type: 'enum',
                value: ['INVOICE_RECEIPT', 'Delivery'],
              },
              { code: 'MANDATORY_ARBITRATION', type: 'boolean' },
              { code: 'STATIC_TERMS', type: 'url' },
              { code: 'COURT_JURISDICTION', type: 'string' },
              { code: 'DELAY_INTEREST', type: 'amount' },
              { code: 'SETTLEMENT_AMOUNT', type: 'amount' },
              { code: 'SETTLEMENT_TYPE', type: 'enum', value: ['upi', 'neft', 'rtgs'] },
              {
                code: 'OFFLINE_CONTRACT',
                type: 'boolean',
              },
            ]

            if (!arr?.collected_by) {
              onStatusObj[
                `payemnts[${i}]_collected_by`
              ] = `payments.collected_by must be present in ${constants.ON_STATUS}`
            } else {
              const collectedBy = getValue(`collected_by`)
              if (collectedBy && collectedBy != arr?.collected_by)
                onStatusObj[
                  `payemnts[${i}]_collected_by`
                ] = `payments.collected_by value sent in ${constants.ON_STATUS} should be same as sent in past call: ${collectedBy}`
            }

            // check status
            if (!arr?.status) onStatusObj.paymentStatus = `payment.status is missing for index:${i} in payments`
            else if (!arr?.status || !allowedStatusValues.includes(arr?.status)) {
              onStatusObj.paymentStatus = `invalid status at index:${i} in payments, should be either of ${allowedStatusValues}`
            }

            // check type
            const validTypes = ['ON-ORDER', 'ON-FULFILLMENT', 'POST-FULFILLMENT']
            if (!arr?.type || !validTypes.includes(arr.type)) {
              onStatusObj[`payments[${i}]_type`] = `payments.type must be present in ${
                constants.ON_STATUS
              } & its value must be one of: ${validTypes.join(', ')}`
            }

            // Validate payment tags
            const tagsValidation = validatePaymentTags(arr?.tags, terms)
            if (!tagsValidation.isValid) {
              Object.assign(onStatusObj, { tags: tagsValidation.errors })
            }
          })
        }
      }
    } catch (error: any) {
      logger.error(`!!Errors while checking payments in /${constants.ON_STATUS}, ${error.stack}`)
    }

    try {
      logger.info(`Checking cancellation terms in /${constants.ON_STATUS}`)
      const cancellationErrors = validateCancellationTerms(on_status?.cancellation_terms, constants.ON_STATUS)
      Object.assign(onStatusObj, cancellationErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation_terms in /${constants.ON_STATUS}, ${error.stack}`)
    }

    //check documents
    try {
      logger.info(`Checking documents in /${constants.ON_STATUS}`)
      const requiredDocumentCodes = ['LOAN_AGREEMENT', 'LOAN_CANCELLATION']
      const cancellationErrors = validateDocuments(on_status?.documents, constants.ON_STATUS, requiredDocumentCodes)
      Object.assign(onStatusObj, cancellationErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking documents in /${constants.ON_STATUS}, ${error.stack}`)
    }

    return onStatusObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_STATUS} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}
