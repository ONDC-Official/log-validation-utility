/* eslint-disable no-prototype-builtins */
import constants, { FisApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty } from '../../'
import { getValue, setValue } from '../../../shared/dao'
import { validateCancellationTerms, validateContext, validateFulfillments, validatePayments } from './fisChecks'

export const checkOnConfirm = (data: any, msgIdSet: any, flow: any) => {
  const onCnfrmObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [FisApiSequence.ON_CONFIRM]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.ON_CONFIRM, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.CONFIRM, constants.ON_CONFIRM)

    if (schemaValidation !== 'error') {
      Object.assign(onCnfrmObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(onCnfrmObj, contextRes.ERRORS)
    }

    setValue(`${FisApiSequence.ON_CONFIRM}`, data)

    const on_confirm = message.order
    const itemIDS: any = getValue('ItmIDS')
    const itemIdArray: any[] = []

    let newItemIDSValue: any[]

    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      on_confirm.items.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
    }

    setValue('ItmIDS', newItemIDSValue)

    try {
      logger.info(`Checking id in message object  /${constants.ON_CONFIRM}`)
      if (!on_confirm.id) {
        onCnfrmObj.id = `Id in message object must be present/${constants.ON_CONFIRM}`
      } else {
        setValue('orderId', on_confirm?.id)
      }
    } catch (error: any) {
      logger.error(`!!Error while checking id in message object  /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Checking provider id /${constants.ON_CONFIRM}`)

      if (['PRE_INVOICE', 'PRE_PERSONAL'].includes(flow)) {
        const on_confirmProviderId = on_confirm.provider.id
        setValue('providerId', on_confirmProviderId)
      } else {
        if (on_confirm.provider.id !== getValue('providerId')) {
          onCnfrmObj.prvdrId = `Provider Id mismatches in /${constants.ON_SEARCH} and /${constants.ON_CONFIRM}`
        }
      }

      logger.info(`Checking tags in /${constants.ON_CONFIRM}`)
      const providerTags = on_confirm.provider.tags

      if (!providerTags || !Array.isArray(providerTags) || providerTags.length === 0) {
        onCnfrmObj.tags = 'Tags array is missing or empty in provider'
      }
    } catch (error: any) {
      logger.error(`!!Error while checking provider id /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing item in /${constants.ON_CONFIRM}`)

      on_confirm.items.forEach((item: any, index: number) => {
        if (!newItemIDSValue.includes(item.id)) {
          const key = `item[${index}].item_id`
          onCnfrmObj[
            key
          ] = `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in previous call`
        }

        if (on_confirm.quote.price.value !== item?.price?.value) {
          onCnfrmObj[`item${index}_price`] = `Price mismatch for item: ${item.id}`
        }

        if (item.tags) {
          const loanInfoTag = item.tags.find((tag: any) => tag.descriptor.code === 'LOAN_INFO')
          if (!loanInfoTag) {
            onCnfrmObj[`loanInfoTagSubtagsMissing`] = `The LOAN_INFO tag group for Item ${item.id}: was not found`
          }
        }
      })
    } catch (error: any) {
      logger.error(
        `!!Error while comparing Item in /${constants.ON_SELECT} and /${constants.ON_CONFIRM}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Checking fulfillments objects in /${constants.ON_CONFIRM}`)
      let i = 0
      const len = on_confirm.fulfillments.length
      while (i < len) {
        const fulfillment = on_confirm.fulfillments[i]
        const fulfillmentErrors = validateFulfillments(fulfillment, i, on_confirm.documents)
        if (fulfillmentErrors) {
          Object.assign(onCnfrmObj, fulfillmentErrors)
        }

        i++
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments object in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Checking quote details in /${constants.ON_CONFIRM}`)

      const quote = on_confirm.quote
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
        onCnfrmObj.missingBreakupItems = `Quote breakup is missing the following items: ${missingBreakupItems.join(
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
        onCnfrmObj.breakupTotalMismatch = `Total of quote breakup (${totalBreakupValue}) does not match with price.value (${priceValue})`
      }

      const currencies = quoteBreakup.map((item: any) => item.currency)
      if (new Set(currencies).size !== 1) {
        onCnfrmObj.multipleCurrencies = 'Currency must be the same for all items in the quote breakup'
      }

      if (!quote.ttl) {
        onCnfrmObj.missingTTL = 'TTL is required in the quote'
      }
    } catch (error: any) {
      logger.error(`!!Error while checking quote details in /${constants.ON_CONFIRM}`, error.stack)
    }

    try {
      logger.info(`Checking payments details in /${constants.ON_CONFIRM}`)

      const paymentErrors = validatePayments(on_confirm?.payments, constants.ON_CONFIRM, on_confirm?.quote)
      Object.assign(onCnfrmObj, paymentErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking payments details in /${constants.ON_CONFIRM}`, error.stack)
    }

    try {
      logger.info(`Checking cancellation terms in /${constants.ON_CONFIRM}`)
      const cancellationErrors = validateCancellationTerms(on_confirm?.cancellation_terms, constants.ON_CONFIRM)
      Object.assign(onCnfrmObj, cancellationErrors)
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation_terms in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Checking documents in /${constants.ON_CONFIRM}`)
      const documents = on_confirm.documents

      if (!documents || !Array.isArray(documents) || documents.length === 0) {
        onCnfrmObj.documents = 'Documents array is missing or empty in order'
      } else {
        documents.forEach((document, index) => {
          const documentKey = `documents[${index}]`

          if (!document.descriptor || !document.descriptor.code) {
            onCnfrmObj[`${documentKey}.code`] = 'Document descriptor is missing or empty'
          }

          if (!document.descriptor || !document.descriptor.name) {
            onCnfrmObj[`${documentKey}.name`] = 'Document descriptor name is missing or empty'
          }

          if (!document.descriptor || !document.descriptor.short_desc) {
            onCnfrmObj[`${documentKey}.short_desc`] = 'Document descriptor short_desc is missing or empty'
          }

          if (!document.descriptor || !document.descriptor.long_desc) {
            onCnfrmObj[`${documentKey}.long_desc`] = 'Document descriptor long_desc is missing or empty'
          }

          if (!document.mime_type) {
            onCnfrmObj[`${documentKey}.mime_type`] = 'Document mime_type is missing or empty'
          } else {
            const allowedMimeTypes = ['application/pdf']
            if (!allowedMimeTypes.includes(document.mime_type)) {
              onCnfrmObj[`${documentKey}.mime_type`] = `Invalid mime_type: ${document.mime_type}`
            }
          }

          if (!document.url) {
            onCnfrmObj[`${documentKey}.url`] = 'Document URL is missing or empty'
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking documents in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    return onCnfrmObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_CONFIRM} API`, JSON.stringify(err.stack))
    return { error: err.message }
  }
}
