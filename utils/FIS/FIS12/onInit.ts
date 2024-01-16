/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty } from '../../'
import { validateContext, validateFulfillments, validateXInput } from './fisChecks'
import { getValue, setValue } from '../../../shared/dao'
import { validatePaymentTags, validateProviderTags } from './tags'

const cancellationTermsState = new Map()

export const checkOnInit = (data: any, msgIdSet: any, sequence: string) => {
  try {
    const errorObj: any = {}
    if (!data || isObjectEmpty(data)) {
      return { [constants.ON_INIT]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.ON_INIT, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.INIT, constants.ON_INIT)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    setValue(`${constants.ON_INIT}`, data)

    const on_init = message.order
    const itemIDS: any = getValue('ItmIDS')
    const itemIdArray: any[] = []

    //provider checks
    const providerErrors = validateProvider(on_init?.provider)
    Object.assign(errorObj, providerErrors)

    let newItemIDSValue: any[]
    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      on_init.items.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
    }

    setValue('ItmIDS', newItemIDSValue)

    try {
      logger.info(`Comparing Items object for /${constants.ON_SELECT} and /${constants.ON_INIT}`)
      on_init.items.forEach((item: any, index: number) => {
        if (!newItemIDSValue.includes(item.id)) {
          const key = `item[${index}].item_id`
          errorObj[
            key
          ] = `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in previous call`
        }

        // if (initQuotePrice !== item?.price?.value) {
        //   errorObj[`item${index}_price`] = `Price mismatch for item: ${item.id}`
        // }

        // if (sequence !== 'on_select') {
        const itemPrice = parseFloat(item.price.value)
        const quotePrice = parseFloat(message.order.quote.price.value)
        if (itemPrice !== quotePrice) {
          errorObj[`item${index}_price`] = `Price value mismatch for item: ${item.id}`
        }

        const xinputValidationErrors = validateXInput(item?.xinput, 0, index, constants.ON_INIT)
        if (xinputValidationErrors) {
          Object.assign(errorObj, xinputValidationErrors)
        }
        // } else {
        //   // Check status in form_response
        //   if (!Object.prototype.hasOwnProperty.call(item?.xinput?.form_response, 'status')) {
        //     errorObj[
        //       `item${index}_xinput`
        //     ] = `/message/order/items/xinput in item: ${item.id} must have status in form_response`
        //   } else {
        //     const status = item?.xinput?.form_response?.status
        //     const code = 'PENDING'
        //     if (status !== code) {
        //       errorObj[
        //         `item${index}_status`
        //       ] = `/message/order/items/xinput/form_response/status in item: ${item.id} should be '${code}'`
        //     }
        //   }

        //   // Check submission_id in form_response
        //   if (!Object.prototype.hasOwnProperty.call(item?.xinput?.form_response, 'submission_id')) {
        //     errorObj[
        //       `item${index}_xinput`
        //     ] = `/message/order/items/xinput in item: ${item.id} must have submission_id in form_response`
        //   } else {
        //     setValue(`${constants.ON_SELECT}_submission_id`, item?.xinput?.form_response?.submission_id)
        //   }
        // }

        if (
          !item?.tags?.some((tag: any) => tag.descriptor.code === 'CONSENT_INFO' || tag.descriptor.code === 'LOAN_INFO')
        ) {
          errorObj['on_init_items'] = {
            tags: 'CONSENT_INFO or LOAN_INFO tag group must be present.',
          }
        }
      })
    } catch (error: any) {
      logger.error(
        `!!Error while comparing Item and Fulfillment Id in /${constants.ON_SELECT} and /${constants.ON_INIT}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Checking cancellation terms in /${constants.ON_INIT}`)
      const cancellationTerms = on_init.cancellation_terms

      if (cancellationTerms && cancellationTerms.length > 0) {
        for (let i = 0; i < cancellationTerms.length; i++) {
          const cancellationTerm = cancellationTerms[i]

          if (
            cancellationTerm.fulfillment_state &&
            cancellationTerm.fulfillment_state.descriptor &&
            cancellationTerm.fulfillment_state.descriptor.code &&
            (!cancellationTerm.cancellation_fee ||
              !cancellationTerm.cancellation_fee.percentage ||
              isNaN(parseFloat(cancellationTerm.cancellation_fee.percentage)) ||
              parseFloat(cancellationTerm.cancellation_fee.percentage) <= 0 ||
              !Number.isInteger(parseFloat(cancellationTerm.cancellation_fee.percentage)))
          ) {
            errorObj.cancellationFee = `Cancellation fee is required and must be bounded by 0 and 100 for Cancellation Term[${i}]`
          }

          const descriptorCode = cancellationTerm.fulfillment_state.descriptor.code
          const storedPercentage = cancellationTermsState.get(descriptorCode)

          if (storedPercentage === undefined) {
            cancellationTermsState.set(descriptorCode, cancellationTerm.cancellation_fee.percentage)
          } else if (storedPercentage !== cancellationTerm.cancellation_fee.percentage) {
            errorObj.cancellationFee = `Cancellation terms percentage for ${descriptorCode} has changed`
          }
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking cancellation terms in /${constants.ON_INIT}, ${error.stack}`)
    }

    try {
      logger.info(`Checking fulfillments objects in /${constants.ON_INIT}`)
      let i = 0
      const len = on_init.fulfillments.length
      while (i < len) {
        const fulfillment = on_init.fulfillments[i]
        const fulfillmentErrors = validateFulfillments(fulfillment, i, [])
        if (fulfillmentErrors) {
          Object.assign(errorObj, fulfillmentErrors)
        }

        i++
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments object in /${constants.ON_INIT}, ${error.stack}`)
    }

    // logger.info(`Comparing /${constants.ON_INIT} Quoted Price and /${constants.ON_SELECT} Quoted Price`)
    // const onSelectPrice: any = getValue('onSelectPrice')
    // if (onSelectPrice != initQuotePrice) {
    //   logger.info(
    //     `Quoted Price in /${constants.ON_INIT} is not equal to the quoted price in /${constants.ON_SELECT}`,
    //   )
    //   errorObj.ON_INITPriceErr2 = `Quoted Price in /${constants.ON_INIT} INR ${initQuotePrice} does not match with the quoted price in /${constants.ON_SELECT} INR ${onSelectPrice}`
    // }

    logger.info(`Checking Payment Object for  /${constants.ON_INIT}`)
    if (!on_init.payments) {
      errorObj.pymnterrorObj = `Payment Object can't be null in /${constants.ON_INIT}`
    } else {
      try {
        logger.info(`Checking Payment Object for  /${constants.ON_INIT}`)
        on_init.payments?.map((payment: any) => {
          if (!payment.status) {
            errorObj.payments = `status is missing in payments`
          } else {
            const allowedStatusValues = ['NOT_PAID', 'PAID']

            if (!allowedStatusValues.includes(payment.status)) {
              errorObj.paymentStatus = `Invalid value for status. It should be either of NOT_PAID or PAID.`
            }
          }

          if (!payment.collected_by) {
            errorObj.payments = `collected_by is missing in payments`
          } else {
            const allowedCollectedByValues = ['BPP', 'BAP']

            const collectedBy = getValue(`collected_by`)
            if (collectedBy && collectedBy !== payment.collected_by) {
              errorObj.collectedBy = `Collected_By didn't matched with what was send in previous call.`
            } else {
              if (!allowedCollectedByValues.includes(payment.collected_by)) {
                errorObj.collectedBy = `Invalid value for collected_by. It should be either BPP or BAP.`
              }

              setValue(`collected_by`, payment.collected_by)
            }
          }

          if (sequence == 'on_init3' && payment.time) {
            if (!payment.label || payment.label !== 'INSTALLMENT') {
              errorObj.time.label = `If time is present in payment, the corresponding label should be INSTALLMENT.`
            }
          }

          if (payment.tags) {
            // Validate payment tags
            const tagsValidation = validatePaymentTags(payment.tags)
            if (!tagsValidation.isValid) {
              Object.assign(errorObj, { tags: tagsValidation.errors })
            }
          }
        })
      } catch (error: any) {
        logger.error(`!!Error while checking Payment Object in /${constants.ON_INIT}, ${error.stack}`)
      }
    }

    //quote checks
    if (sequence !== 'on_select') {
      const quoteErrors = validateQuote(on_init)
      Object.assign(errorObj, quoteErrors)
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_INIT} API`, err)
    return { error: err.message }
  }
}

const validateProvider = (provider: any) => {
  const providerErrors: any = {}

  try {
    if (!provider) {
      providerErrors.provider = 'Provider details are missing or invalid.'
      return providerErrors
    }

    logger.info(`Comparing Provider Ids of /${constants.ON_SEARCH} and /${constants.ON_INIT}`)
    const prvrdID: any = getValue('providerId')
    if (!_.isEqual(prvrdID, provider.id)) {
      providerErrors.prvdrId = `Provider Id for /${constants.ON_SEARCH} and /${constants.ON_INIT} api should be same`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing provider ids for /${constants.ON_SEARCH} and /${constants.ON_INIT} api, ${error.stack}`,
    )
  }

  try {
    logger.info(`Validating Descriptor for /${constants.ON_INIT}`)

    if (!provider?.descriptor) {
      providerErrors.descriptor = 'Provider descriptor is missing or invalid.'
      return providerErrors
    }

    if (!Array.isArray(provider?.descriptor?.images) || provider?.descriptor?.images?.length < 1) {
      providerErrors.images = 'Descriptor images must be an array with a minimum length of one.'
    } else {
      provider?.descriptor?.images.forEach((image: any, index: number) => {
        if (!image || typeof image !== 'object' || Array.isArray(image) || Object.keys(image).length !== 2) {
          providerErrors[
            `images[${index}]`
          ] = `Invalid image structure in descriptor. Each image should be an object with "url" and "size_type" properties.`
        } else {
          const { url, size_type } = image
          if (typeof url !== 'string' || !url.trim()) {
            providerErrors[`images[${index}].url`] = `Invalid URL for image in descriptor.`
          }

          const validSizes = ['md', 'sm', 'lg']
          if (size_type && !validSizes.includes(size_type)) {
            providerErrors[
              `images[${index}].size_type`
            ] = `Invalid image size in descriptor. It should be one of: ${validSizes.join(', ')}`
          }
        }
      })
    }

    if (!provider?.descriptor?.name || !provider?.descriptor?.name?.trim()) {
      providerErrors.name = `Provider name cannot be empty.`
    }

    if (provider?.descriptor?.short_desc && !provider?.descriptor?.short_desc?.trim()) {
      providerErrors.short_desc = `Short description cannot be empty.`
    }

    if (provider?.descriptor?.long_desc && !provider?.descriptor?.long_desc.trim()) {
      providerErrors.long_desc = `Long description cannot be empty.`
    }
  } catch (error: any) {
    logger.info(`Error while validating descriptor for /${constants.ON_INIT}, ${error.stack}`)
  }

  // Validate tags
  const tagsValidation = validateProviderTags(provider?.tags)
  if (!tagsValidation.isValid) {
    Object.assign(providerErrors, { tags: tagsValidation.errors })
  }

  return providerErrors
}

const validateQuote = (onSelect: any) => {
  const errorObj: any = {}

  try {
    logger.info(`Checking quote details in /${constants.ON_INIT}`)

    const quote = onSelect.quote
    const quoteBreakup = quote.breakup

    const validBreakupItems = [
      'PRINCIPAL',
      'INTEREST',
      'NET_DISBURSED_AMOUNT',
      'OTHER_UPFRONT_CHARGES',
      'INSURANCE_CHARGES',
      'OTHER_CHARGES',
      'PROCESSING_FEE',
    ]

    const requiredBreakupItems = validBreakupItems.filter((item) =>
      quoteBreakup.some((breakupItem: any) => breakupItem.title.toUpperCase() === item),
    )

    const missingBreakupItems = validBreakupItems.filter((item) => !requiredBreakupItems.includes(item))

    if (missingBreakupItems.length > 0) {
      errorObj.missingBreakupItems = `Quote breakup is missing the following items: ${missingBreakupItems.join(', ')}`
    }

    const totalBreakupValue = quoteBreakup.reduce((total: any, item: any) => {
      const itemTitle = item.title.toUpperCase()
      if (requiredBreakupItems.includes(itemTitle) && itemTitle !== 'NET_DISBURSED_AMOUNT') {
        const itemValue = parseFloat(item.price.value)
        return isNaN(itemValue) ? total : total + itemValue
      }

      return total
    }, 0)

    const priceValue = parseFloat(quote.price.value)

    if (isNaN(totalBreakupValue)) {
      errorObj.breakupTotalMismatch = 'Invalid values in quote breakup'
    } else if (totalBreakupValue !== priceValue) {
      errorObj.breakupTotalMismatch = `Total of quote breakup (${totalBreakupValue}) does not match with price.value (${priceValue})`
    }

    const currencies = quoteBreakup.map((item: any) => item.currency)
    if (new Set(currencies).size !== 1) {
      errorObj.multipleCurrencies = 'Currency must be the same for all items in the quote breakup'
    }

    if (!quote.ttl) {
      errorObj.missingTTL = 'TTL is required in the quote'
    }
  } catch (error: any) {
    logger.error(`!!Error while checking quote details in /${constants.ON_INIT}`, error.stack)
  }

  return errorObj
}
