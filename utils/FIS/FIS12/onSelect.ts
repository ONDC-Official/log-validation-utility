/* eslint-disable no-prototype-builtins */
import { getValue } from '../../../shared/dao'
import constants, { FisApiSequence } from '../../../constants'
import { validateSchema, isObjectEmpty } from '../..'
import _ from 'lodash'
import { logger } from '../../../shared/logger'
import { validateContext, validateXInput } from './fisChecks'
import { validateProviderTags } from './tags'

export const checkOnSelect = (data: any, msgIdSet: any, sequence: string) => {
  if (!data || isObjectEmpty(data)) {
    return { [constants.ON_SELECT]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema(context.domain.split(':')[1], constants.ON_SELECT, data)
  const contextRes: any = validateContext(context, msgIdSet, constants.SELECT, constants.ON_SELECT)

  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  const select: any = getValue(`${constants.SELECT}`)

  try {
    const itemIdArray: any[] = []
    const onSelect = message.order
    const itemIDS: any = getValue('ItmIDS')

    //provider checks
    const providerErrors = validateProvider(onSelect?.provider)
    Object.assign(errorObj, providerErrors)

    let newItemIDSValue: any[]
    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      select.message.order.items.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
    }

    try {
      logger.info(`Comparing Items object for /${constants.SELECT} and /${constants.ON_SELECT}`)
      onSelect.items.forEach((item: any, index: number) => {
        if (!newItemIDSValue.includes(item.id)) {
          const key = `item[${index}].item_id`
          errorObj[
            key
          ] = `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in previous call`
        }

        if (
          !item?.tags?.some((tag: any) => tag.descriptor.code === 'CONSENT_INFO' || tag.descriptor.code === 'LOAN_INFO')
        ) {
          errorObj['on_select_items'] = {
            tags: 'CONSENT_INFO or LOAN_INFO tag group must be present.',
          }
        }

        if (sequence !== FisApiSequence.ON_SELECT_1) {
          const itemPrice = parseFloat(item?.price?.value)
          const interestAmount =
            parseFloat(
              message.order?.quote?.breakup.find((item: any) => item.title.toUpperCase() === 'INTEREST')?.price.value,
            ) || 0
          const updatedQuotePrice = parseFloat(message.order?.quote?.price.value) - interestAmount
          if (itemPrice !== updatedQuotePrice) {
            errorObj[`item${index}_price`] = `Price value mismatch for item: ${item.id}`
          }

          const xinputValidationErrors = validateXInput(item?.xinput, 0, index, constants.ON_SELECT)
          if (xinputValidationErrors) {
            Object.assign(errorObj, xinputValidationErrors)
          }
        } else {
          if (!Object.prototype.hasOwnProperty.call(item?.xinput?.form, 'id')) {
            errorObj[`item${index}_form`] = `/message/order/items/form in item: ${item.id} must have id in form`
          } else {
            const id = item?.xinput?.form?.id
            const formId: any = getValue(`formId`)
            if (!_.isEqual(formId, id)) {
              errorObj[
                `item${index}_form`
              ] = `/message/order/items/xinput/form/id in item: ${id} should be the same as mapped in previous call ${formId}`
            }
          }

          // Check status in form_response
          if (!Object.prototype.hasOwnProperty.call(item?.xinput?.form_response, 'status')) {
            errorObj[
              `item${index}_xinput`
            ] = `/message/order/items/xinput in item: ${item.id} must have status in form_response`
          } else {
            const status = item?.xinput?.form_response?.status
            const code = 'PENDING'
            if (status !== code) {
              errorObj[
                `item${index}_status`
              ] = `/message/order/items/xinput/form_response/status in item: ${item.id} should be '${code}'`
            }
          }


          // Check submission_id in form_response
          if (!Object.prototype.hasOwnProperty.call(item?.xinput?.form_response, 'submission_id')) {
            errorObj[
              `item${index}_xinput`
            ] = `/message/order/items/xinput in item: ${item.id} must have submission_id in form_response`
          } else {
            const submissionId = getValue(`${sequence?.replace('on_', '')}_submission_id`)
            if (!_.isEqual(submissionId, item?.xinput?.form_response?.submission_id)) {
              errorObj.submission_id = `submission_id for /${constants.SELECT} and /${constants.ON_SELECT} api should be the same as sent in previous call`
            }
          }
        }
      })
    } catch (error: any) {
      logger.error(
        `!!Error while Comparing and Mapping Items in /${constants.ON_SEARCH} and /${constants.SELECT}, ${error.stack}`,
      )
    }

    //quote checks
    if (sequence !== FisApiSequence.ON_SELECT_1) {
      const quoteErrors = validateQuote(onSelect)
      Object.assign(errorObj, quoteErrors)
    }
  } catch (error: any) {
    logger.error(`!!Error occcurred while checking message in /${constants.SELECT},  ${error.message}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}

const validateProvider = (provider: any) => {
  const providerErrors: any = {}

  try {
    if (!provider) {
      providerErrors.provider = 'Provider details are missing or invalid.'
      return providerErrors
    }

    logger.info(`Comparing Provider Ids of /${constants.SELECT} and /${constants.ON_SELECT}`)
    const prvrdID: any = getValue('providerId')
    if (!_.isEqual(prvrdID, provider.id)) {
      providerErrors.prvdrId = `Provider Id for /${constants.SELECT} and /${constants.ON_SELECT} api should be same`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing provider ids for /${constants.SELECT} and /${constants.ON_SELECT} api, ${error.stack}`,
    )
  }

  try {
    logger.info(`Validating Descriptor for /${constants.ON_SELECT}`)

    if (!provider?.descriptor) {
      providerErrors.descriptor = 'Provider descriptor is missing or invalid.'
      return providerErrors
    }

    logger.info(`Validating Descriptor asdsafdsffor /${constants.ON_SELECT}`)

    if (!Array.isArray(provider.descriptor.images) || provider.descriptor.images.length < 1) {
      providerErrors.images = 'Descriptor images must be an array with a minimum length of one.'
    } else {
      provider.descriptor.images.forEach((image: any, index: number) => {
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
          if (!validSizes.includes(size_type)) {
            providerErrors[
              `images[${index}].size_type`
            ] = `Invalid image size in descriptor. It should be one of: ${validSizes.join(', ')}`
          }
        }
      })
    }

    logger.info(`Validating Descriptor fo123123123r /${constants.ON_SELECT}`)

    if (!provider.descriptor.name || !provider.descriptor.name.trim()) {
      providerErrors.name = `Provider name cannot be empty.`
    }

    if (provider.descriptor.short_desc && !provider.descriptor.short_desc.trim()) {
      providerErrors.short_desc = `Short description cannot be empty.`
    }

    if (provider.descriptor.long_desc && !provider.descriptor.long_desc.trim()) {
      providerErrors.long_desc = `Long description cannot be empty.`
    }

    // Validate tags
    const tagsValidation = validateProviderTags(provider?.tags)
    if (!tagsValidation.isValid) {
      Object.assign(providerErrors, { tags: tagsValidation.errors })
    }
  } catch (error: any) {
    logger.info(`Error while validating descriptor for /${constants.ON_SELECT}, ${error.stack}`)
  }

  return providerErrors
}

const validateQuote = (onSelect: any) => {
  const errorObj: any = {}

  try {
    logger.info(`Checking quote details in /${constants.ON_SELECT}`)

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
    logger.error(`!!Error while checking quote details in /${constants.ON_SELECT}`, error.stack)
  }

  return errorObj
}
