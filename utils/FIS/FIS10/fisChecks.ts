import { getValue, setValue } from '../../../shared/dao'
import constants, { flowsFis10 } from '../../../constants/'
import { logger } from '../../../shared/logger'
import { checkIdAndUri, checkFISContext, isValidEmail, isValidPhoneNumber } from '../../'
import _, { isEmpty, isEqual } from 'lodash'
import { validatePaymentTags } from './tags'

export const checkUniqueCategoryIds = (categoryIds: (string | number)[], availableCategoryIds: any): boolean => {
  const uniqueCategoryIds = new Set(categoryIds)
  return categoryIds.length === uniqueCategoryIds.size && categoryIds.every((id) => availableCategoryIds.has(id))
}

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

export const validateContext = (context: any, msgIdSet: any, pastCall: any, curentCall: any) => {
  const errorObj: any = {}

  const contextRes: any = checkFISContext(context, curentCall)

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  const prevContext: any = getValue(`${pastCall}_context`)
  setValue(`${curentCall}_context`, context)
  msgIdSet.add(context.message_id)

  if (!context.location || !context.location.city || !context.location.country) {
    errorObj['location'] = 'context/location/city and context/location/country are required'
  }

  try {
    logger.info(`Comparing BAP and BPP in /${curentCall}`)

    const bppValidationResult = checkIdAndUri(context?.bpp_id, context?.bpp_uri, 'bpp')
    const bapValidationResult = checkIdAndUri(context?.bap_id, context?.bap_uri, 'bap')

    if (bppValidationResult !== null) {
      errorObj.bpp = bppValidationResult
    }

    if (bapValidationResult !== null) {
      errorObj.bap = bapValidationResult
    }

    if (prevContext) {
      if (pastCall !== 'search') {
        if (!_.isEqual(prevContext.bpp_id, context.bpp_id)) {
          errorObj.bppIdContextMismatch = `BPP Id mismatch in /${pastCall} and /${curentCall}`
        }

        if (!_.isEqual(prevContext.bpp_uri, context.bpp_uri)) {
          errorObj.bppUriContextMismatch = `BPP URL mismatch in /${pastCall} and /${curentCall}`
        }
      }

      if (!_.isEqual(prevContext.bap_id, context.bap_id)) {
        errorObj.bapIdContextMismatch = `BAP Id mismatch in /${pastCall} and /${curentCall}`
      }

      if (!_.isEqual(prevContext.bap_uri, context.bap_uri)) {
        errorObj.bapUriContextMismatch = `BAP URL mismatch in /${pastCall} and /${curentCall}`
      }
    }
  } catch (error: any) {
    logger.error(`!!Error while comparing BAP and BPP Ids in /${curentCall}, ${error.stack}`)
  }

  if (prevContext) {
    try {
      logger.info(`Comparing city of /${pastCall} and /${curentCall}`)
      if (!_.isEqual(prevContext.location.city, context.location.city)) {
        errorObj.city = `City code mismatch in /${pastCall} and /${curentCall}`
      }
    } catch (error: any) {
      logger.error(`!!Error while comparing city in /${pastCall} and /${curentCall}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing country of /${pastCall} and /${curentCall}`)
      if (!_.isEqual(prevContext.location.country, context.location.country)) {
        errorObj.country = `Country code mismatch in /${pastCall} and /${curentCall}`
      }
    } catch (error: any) {
      logger.error(`!!Error while comparing country in /${pastCall} and /${curentCall}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing transaction Ids of /${pastCall} and /${curentCall}`)
      if (!_.isEqual(prevContext.transaction_id, context.transaction_id)) {
        errorObj.transaction_id = `Transaction Id for /${pastCall} and /${curentCall} api should be same`
      }
    } catch (error: any) {
      logger.info(`Error while comparing transaction ids for /${pastCall} and /${curentCall} api, ${error.stack}`)
    }

    try {
      logger.info(`Comparing Message Ids of /${pastCall} and /${curentCall}`)
      if (curentCall.startsWith('on_') && curentCall.includes(pastCall)) {
        logger.info(`Comparing Message Ids of /${pastCall} and /${curentCall}`)
        if (!_.isEqual(prevContext.message_id, context.message_id)) {
          errorObj.message_id = `message_id for /${pastCall} and /${curentCall} api should be same`
        }
      } else {
        logger.info(`Checking if Message Ids are different for /${pastCall} and /${curentCall}`)
        if (_.isEqual(prevContext.message_id, context.message_id)) {
          errorObj.message_id = `message_id for /${pastCall} and /${curentCall} api should be different`
        }
      }
    } catch (error: any) {
      logger.info(`Error while comparing message ids for /${pastCall} and /${curentCall} api, ${error.stack}`)
    }

    try {
      logger.info(`Comparing timestamp of /${pastCall} and /${curentCall}`)
      const tmpstmp = prevContext.timestamp
      if (_.gte(tmpstmp, context.timestamp)) {
        errorObj.tmpstmp = `Timestamp for /${curentCall} api should be greater than timestamp of /${pastCall} api`
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.error(`!!Error while comparing timestamp for /${pastCall} and /${curentCall}, ${error.stack}`)
    }
  }

  if (_.isEmpty(errorObj)) {
    const result = { valid: true, SUCCESS: 'Context Valid' }
    return result
  } else {
    const result = { valid: false, ERRORS: errorObj }
    return result
  }
}

export const validateCancellationTerms = (cancellationTerms: any, action: string) => {
  const errorObj: any = {}
  try {
    logger.info(`Checking cancellation terms in /${action}`)
    const cancellationTermsState = new Map()
    if (!cancellationTerms) {
      errorObj.cancellationTerms = `cancellation_terms are required in /${action}`
    } else if (cancellationTerms && cancellationTerms.length > 0) {
      for (let i = 0; i < cancellationTerms.length; i++) {
        const cancellationTerm = cancellationTerms[i]

        const hasExternalRef = cancellationTerm?.external_ref !== undefined
        const hasFulfillmentState = cancellationTerm?.fulfillment_state !== undefined
        const hasCancellationFee = cancellationTerm?.cancellation_fee !== undefined
        const hasPercentage = hasCancellationFee && cancellationTerm?.cancellation_fee?.percentage !== undefined
        const hasAmount = hasCancellationFee && cancellationTerm?.cancellation_fee?.amount !== undefined

        const isValidTerm =
          (hasExternalRef || (hasFulfillmentState && hasCancellationFee && (hasPercentage || hasAmount))) &&
          (!hasFulfillmentState ||
            (hasFulfillmentState &&
              cancellationTerm.fulfillment_state.descriptor &&
              cancellationTerm.fulfillment_state.descriptor.code &&
              ((hasPercentage &&
                !isNaN(parseFloat(cancellationTerm.cancellation_fee.percentage)) &&
                parseFloat(cancellationTerm.cancellation_fee.percentage) > 0 &&
                Number.isInteger(parseFloat(cancellationTerm.cancellation_fee.percentage))) ||
                (hasAmount &&
                  !isNaN(parseFloat(cancellationTerm.cancellation_fee.amount)) &&
                  parseFloat(cancellationTerm.cancellation_fee.amount) > 0))))

        if (!isValidTerm) {
          errorObj.cancellationFee = `Invalid Cancellation Term[${i}] - Either external_ref or fulfillment_state with valid cancellation_fee is required`
        }

        if (hasFulfillmentState) {
          const descriptorCode = cancellationTerm.fulfillment_state.descriptor.code
          const storedPercentage = cancellationTermsState.get(descriptorCode)

          if (storedPercentage === undefined) {
            cancellationTermsState.set(
              descriptorCode,
              hasPercentage ? cancellationTerm.cancellation_fee.percentage : cancellationTerm.cancellation_fee.amount,
            )
          } else if (
            storedPercentage !==
            (hasPercentage ? cancellationTerm.cancellation_fee.percentage : cancellationTerm.cancellation_fee.amount)
          ) {
            errorObj.cancellationFee = `Cancellation terms percentage or amount for ${descriptorCode} has changed`
          }
        }
      }
    } else {
      errorObj.cancellationTerms = `cancellation_terms should be an array in /${action}`
    }
  } catch (error: any) {
    logger.error(`!!Error while checking cancellation_terms in /${action}, ${error.stack}`)
  }

  return errorObj
}

export const validateDescriptor = (
  descriptor: any,
  action: string,
  path: string,
  checkCode: boolean,
  codes: string[],
): any => {
  try {
    const errorObj: any = {}
    if (!descriptor) {
      errorObj.descriptor = `descriptor is missing at ${path}.`
    } else {
      if (checkCode) {
        if (!descriptor?.code.trim()) {
          errorObj.code = `descriptor.code is missing at ${path}.`
        } else if (descriptor.code?.trim() !== descriptor.code?.trim()?.toUpperCase()) {
          errorObj.code = `descriptor.code must be in uppercase at ${path}., ${descriptor.code}`
        } else if (codes && codes?.includes(descriptor?.code))
          errorObj.code = `descriptor.code should be one of ${codes}`
      }

      if (descriptor?.images) {
        descriptor.images.forEach((image: any, index: number) => {
          const { url, size_type } = image
          if (!isValidUrl(url)) {
            errorObj[`image_url_[${index}]`] = `Invalid URL for image in descriptor at ${path}.`
          }

          const validSizes = ['xs', 'md', 'sm', 'lg']
          if (!validSizes.includes(size_type)) {
            errorObj[`image_size_[${index}]`] = `Invalid image size in descriptor, should be one of: ${validSizes.join(
              ', ',
            )} at ${path}.`
          }
        })
      }

      //validate name only if checkCode is false or name is present
      if (!checkCode || descriptor?.name) {
        if (!descriptor?.name?.trim()) {
          errorObj.name = `descriptor.name is missing or empty ${path}.`
        }
      }

      if (descriptor?.short_desc) {
        if (!descriptor.short_desc.trim()) {
          errorObj.short_desc = `descriptor.short_desc is empty at ${path}.`
        }
      }

      if (descriptor?.long_desc) {
        if (!descriptor.long_desc.trim()) {
          errorObj.long_desc = `descriptor.long_desc is empty at ${path}.`
        }
      }
    }

    return errorObj
  } catch (error: any) {
    logger.info(`Error while validating descriptor for /${action} at ${path}, ${error.stack}`)
  }
}

export const validateXInputSubmission = (xinput: any, index: number, sequence: string) => {
  const errorObj: any = {}

  if (!xinput) {
    errorObj[`item${index}`] = `xinput is missing in item${index}`
  } else {
    if (!Object.prototype.hasOwnProperty.call(xinput?.form, 'id')) {
      errorObj[`item${index}_form`] = `/message/order/items/form in item[${index}] must have id in form`
    } else {
      const formId: any = getValue(`formId`)
      if (!formId?.includes(xinput?.form?.id)) {
        errorObj[`item${index}_formId`] = `form.id: ${xinput?.form?.id} mismatches with form.id sent in past call`
      }
    }

    if (!Object.prototype.hasOwnProperty.call(xinput?.form_response, 'status')) {
      errorObj[
        `item${index}_xinput`
      ] = `/message/order/items/xinput in item[${index}] must have status in form_response`
    } else {
      const status = xinput?.form_response?.status
      const code = 'SUCCESS'
      if (status !== code) {
        errorObj[
          `item${index}_status`
        ] = `/message/order/items/xinput/form_response/status in item[${index}] should be '${code}'`
      }
    }

    if (!Object.prototype.hasOwnProperty.call(xinput?.form_response, 'submission_id')) {
      errorObj[
        `item${index}_xinput`
      ] = `/message/order/items/xinput in item[${index}] must have submission_id in form_response`
    } else {
      setValue(`${sequence}_submission_id`, xinput?.form_response?.submission_id)
    }
  }

  return errorObj
}

export const validateQuote = (quote: any) => {
  const errorObj: any = {}

  try {
    logger.info(`Checking quote details`)
    if (isEmpty(quote)) errorObj.quote = 'quote is  missing at message.order'
    else {
      const quoteBreakup = quote.breakup
      const validBreakupItems = ['ITEM', 'CONVENIENCE_FEE', 'TAX', 'OFFER']

      const requiredBreakupItems = validBreakupItems.filter((item) =>
        quoteBreakup.some((breakupItem: any) => breakupItem.title.toUpperCase() === item),
      )

      const missingBreakupItems = validBreakupItems
        .filter((item) => item !== 'OFFER')
        .filter((item) => !requiredBreakupItems.includes(item))

      if (missingBreakupItems.length > 0) {
        errorObj.missingBreakupItems = `Quote breakup is missing the following items: ${missingBreakupItems.join(', ')}`
      }

      const totalBreakupValue = quoteBreakup.reduce((total: any, item: any, index: number) => {
        const itemTitle = item?.title?.toUpperCase()
        if (requiredBreakupItems.includes(itemTitle)) {
          const itemValue = parseFloat(item?.price?.value)
          // if (itemTitle == 'OFFER') {
          //   return isNaN(itemValue) ? total : total - itemValue
          // }

          if (itemTitle == 'ITEM') {
            const subItem = item?.item
            const count = subItem?.quantity?.selected?.count
            const subPrice = subItem?.price?.value
            if (!count || !subPrice) {
              if (!count) errorObj[`${index}.count`] = 'count is  missing at item.quantity'
              if (!subPrice) errorObj[`${index}.price`] = 'value is  missing at item.price'
            } else if (subPrice * count != itemValue) {
              errorObj[`${index}.total`] = 'subPrice * count should be equal to total ITEM price'
            }
          }

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
    }
  } catch (error: any) {
    logger.error(`!!Error while checking quote details`, error.stack)
  }

  return errorObj
}

export const validateProvider = (provider: any, action: string) => {
  try {
    const providerErrors: any = {}
    if (!provider) {
      providerErrors.provider = 'Provider details are missing or invalid.'
      return providerErrors
    }

    if (!provider?.id) providerErrors.prvdrId = `provider.id is missing`
    else {
      logger.info(`Comparing provider id of /${action} & past call`)
      const prvrdID: any = getValue('providerId')
      if (!_.isEqual(prvrdID, provider?.id)) {
        providerErrors.prvdrId = `provider.id for /${action} & past call api should be same`
        setValue('providerId', provider?.id)
      }
    }

    // send true as last argument in case if code validation is needed
    const descriptorError = validateDescriptor(provider?.descriptor, action, `provider.descriptor`, false, [])
    if (descriptorError) Object.assign(providerErrors, descriptorError)
    return providerErrors
  } catch (error: any) {
    logger.info(`Error while checking provider object in /${action} api, ${error.stack}`)
  }
}

export const validateDocuments = (documents: any, action: string) => {
  try {
    logger.info(`Checking documents in /${action}`)
    const errors: any = {}

    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      errors.documents = 'Documents array is missing or empty in order'
    } else {
      const requiredDocumentCodes = ['POLICY_DOC', 'CLAIM_DOC', 'RENEW_DOC']

      documents.forEach((document, index) => {
        const documentKey = `documents[${index}]`

        if (!document.descriptor || !document.descriptor.code) {
          errors[`${documentKey}.code`] = 'Document descriptor is missing or empty'
        }

        if (!document.descriptor || !document.descriptor.name) {
          errors[`${documentKey}.name`] = 'Document descriptor name is missing or empty'
        }

        if (!document.descriptor || !document.descriptor.short_desc) {
          errors[`${documentKey}.short_desc`] = 'Document descriptor short_desc is missing or empty'
        }

        if (!document.descriptor || !document.descriptor.long_desc) {
          errors[`${documentKey}.long_desc`] = 'Document descriptor long_desc is missing or empty'
        }

        if (!document.mime_type) {
          errors[`${documentKey}.mime_type`] = 'Document mime_type is missing or empty'
        } else {
          const allowedMimeTypes = ['application/pdf']
          if (!allowedMimeTypes.includes(document.mime_type)) {
            errors[`${documentKey}.mime_type`] = `Invalid mime_type: ${document.mime_type}`
          }
        }

        if (!document.url) {
          errors[`${documentKey}.url`] = 'Document URL is missing or empty'
        }

        if (!requiredDocumentCodes.includes(document.descriptor.code)) {
          errors[`${documentKey}.code`] = `Invalid document code: ${document.descriptor.code}`
        }
      })

      // missing docs
      const missingDocuments = requiredDocumentCodes.filter(
        (code) => !documents.some((document) => document.descriptor.code === code),
      )
      if (missingDocuments.length > 0) {
        errors.missingDocuments = `Missing required documents: ${missingDocuments.join(', ')}`
      }
    }

    return errors
  } catch (error: any) {
    logger.error(`!!Error while checking documents in /${action}, ${error.stack}`)
  }
}

export const validateAddOns = (addOns: any, action: string) => {
  const errors: any = {}
  const idSet = new Set()

  try {
    logger.info(`Checking add_ons`)
    if (isEmpty(addOns)) errors.add_ons = `add_ons array is missing or empty in ${action}`
    else {
      addOns?.forEach((addOn: any, index: number) => {
        const key = `add_ons[${index}]`

        if (!addOn?.id) {
          errors[`${key}.id`] = `id is missing in add_ons[${index}]`
        } else if (idSet.has(addOn?.id)) {
          errors[`${key}.id`] = `duplicate provider id: ${addOn?.id} in add_ons`
        } else {
          idSet.add(addOn?.id)
        }

        if (!addOn?.descriptor?.code || !/^[A-Z_]+$/.test(addOn?.descriptor?.code))
          errors[`${key}.code`] = 'code should be present in a generic enum format'

        if (!addOn?.quantity.selected || !Number.isInteger(addOn?.quantity.selected) || addOn?.quantity.selected <= 0) {
          errors[`${key}.code`] = 'Invalid quantity.selected count'
        }
      })
    }

    return errors
  } catch (error: any) {
    logger.error(`!!Error while checking add_ons in /${action}, ${error.stack}`)
  }
}

export const validateBillingObject = (billing: any, action: string) => {
  try {
    logger.info(`checking billing object in /${action}`)
    const errorObj: any = {}
    const requiredFields = ['name', 'address', 'city', 'state', 'email', 'phone']
    requiredFields.forEach((field) => {
      if (!billing[field]) {
        errorObj[field] = `${field} is missing in billing object`
      }
    })

    if (billing?.city && (!billing?.city?.name || !billing?.city?.code)) {
      errorObj.city = `Either of code or name is missing in city object at billing`
    }

    if (billing?.state && (!billing?.state?.name || !billing?.state?.code)) {
      errorObj.state = `Either of code or name is missing in state object at billing`
    }

    return errorObj
  } catch (error: any) {
    logger.error(`!!Error while checking billing object in /${action}, ${error.stack}`)
    return { error: `Error occurred while validating billing object` }
  }
}

export const validateBapFulfillments = (fulfillments: any, action: string) => {
  try {
    logger.info(`checking fulfillments object for /${action}`)
    const errorObj: any = {}

    if (isEmpty(fulfillments)) {
      errorObj['fulfillments'] = 'fulfillments array is missing or empty'
    } else {
      const fullTypes: string[] = []
      const fulfillmentsId = new Set()
      const storedFullId: any = getValue('fulfillmentsIds')
      const storedFullTypes = getValue('fullTypes')
      console.log('-------------------------------------------------------------')

      console.log('storedFullTypes', storedFullTypes)
      fulfillments.forEach((fulfillment: any, index: number) => {
        const key = `fulfillment${index}`
        console.log('fulfillment', fulfillment.type)
        if (!fulfillment?.type) {
          errorObj[`${key}.type`] = `fulfillment.type: is missing at index: ${index}`
        } else if (!storedFullTypes?.includes(fulfillment?.type)) {
          errorObj[
            `${key}.type`
          ] = `fulfillment type: ${fulfillment.type} should be one of the selected types in past call:${fullTypes}`
        } else fullTypes.push(fulfillment?.type)

        if (!fulfillment?.id) {
          errorObj[`${key}.id`] = `fulfillment.id: is missing at index: ${index}`
        } else {
          //duplicate id check
          if (fulfillmentsId.has(fulfillment.id)) {
            errorObj[`${key}.duplicate_id`] = `duplicate fulfillment id: ${fulfillment.id}`
          } else {
            fulfillmentsId.add(fulfillment.id)
          }

          if (storedFullId && !storedFullId?.includes(fulfillment.id)) {
            errorObj[`${key}.id`] = `id at index: ${index} should be one of the id mapped in previous call`
          }
        }

        if (!fulfillment?.stops) {
          errorObj[`${key}.stops`] = `fulfillment.stops: is missing at index: ${index}`
        } else {
          fulfillment?.stops?.forEach((stop: any, j: number) => {
            if (!stop?.person?.name) errorObj[`${key}.name`] = `person.name is missing in stop${j} at /${action}`

            if (!stop?.contact?.email || !isValidEmail(stop?.contact?.email))
              errorObj[`${key}.email`] = `contact.email should be present with valid value in stop${j} at /${action}`

            if (!stop?.contact?.phone || !isValidPhoneNumber(stop?.contact?.phone))
              errorObj[`${key}.phone`] = `contact.phone should be present with valid value in stop${j} at /${action}`
          })
        }
      })

      setValue('fulfillmentsIds', fulfillmentsId)
      setValue('fullTypes', fullTypes)
    }

    return errorObj
  } catch (error: any) {
    logger.error(`!!Error occcurred while checking fulfillments in /${action},  ${error.message}`)
    return { error: error.message }
  }
}

export const validateBapItems = (items: any, action: string, checkPrice: boolean) => {
  try {
    logger.info(`checking items object for /${action}`)
    const errorObj: any = {}

    if (isEmpty(items)) {
      errorObj['items'] = 'items array is missing or empty'
    } else {
      const storedFullId: any = getValue('fulfillmentsIds')
      const itemsId = new Set()
      const storedItemId: any = getValue('itemsId')
      console.log('storedItemId------------------------------------', storedItemId)
      items.forEach((item: any, index: number) => {
        const key = `item${index}`

        if (!item?.id) {
          errorObj[`${key}.id`] = `item.id: is missing at index: ${index}`
        } else {
          //duplicate id check
          if (itemsId.has(item.id)) {
            errorObj[`${key}.duplicate_id`] = `duplicate item id: ${item.id}`
          } else {
            itemsId.add(item.id)
          }

          if (storedItemId && !storedItemId?.includes(item.id)) {
            errorObj[`${key}.id`] = `id at index: ${index} should be one of the id mapped in previous call`
          }
        }

        // fulfillment_ids
        if (!item?.fulfillment_ids) {
          errorObj[`${key}.fulfillment_ids`] = `item.fulfillment_ids: is missing at index: ${index}`
        } else {
          item?.fulfillment_ids?.forEach((fulfillment_id: string, index: number) => {
            if (storedFullId && !storedFullId?.includes(fulfillment_id))
              errorObj[
                `fulfillment_ids[${index}]`
              ] = `fulfillment_id value in /items[${index}] should match with id provided in fulfillments`
          })
        }

        // count
        const count = item?.quantity?.selected?.count
        if (!count) {
          errorObj[`item[${index}].count`] = `count should be present at item[${index}].quantity /${action}`
        }

        // price
        if (checkPrice && item?.price) {
          const price = item.price
          if (!price?.currency) {
            errorObj[`item[${index}].currency`] = `currency should be present at item[${index}].price /${action}`
          }

          if (!price?.offered_value) {
            errorObj[
              `item[${index}].offered_value`
            ] = `offered_value should be present at item[${index}].price /${action}`
          }
        }

        //tags
      })

      setValue('itemsId', itemsId)
    }

    return errorObj
  } catch (error: any) {
    logger.error(`!!Error occcurred while checking items in /${action},  ${error.message}`)
    return { error: error.message }
  }
}

export const validateBapOffers = (offers: any, action: string) => {
  try {
    logger.info(`checking offers object for /${action}`)
    const errorObj: any = {}

    if (!isEmpty(offers)) {
      const offerIds = new Set()
      const storedItemId: any = getValue('itemsId')
      const selectedOfferId = getValue('selectedOfferId')
      offers.forEach((offer: any, index: number) => {
        const key = `offer${index}`

        if (!offer?.id) {
          errorObj[`${key}.id`] = `offer.id: is missing at index: ${index}`
        } else {
          //duplicate id check
          if (offerIds.has(offer.id)) {
            errorObj[`${key}.duplicate_id`] = `duplicate offer id: ${offer.id}`
          } else {
            offerIds.add(offer.id)
          }

          if (selectedOfferId && !selectedOfferId?.includes(offer.id)) {
            errorObj[`${key}.id`] = `id at index: ${index} should be one of the id mapped in previous call`
          }
        }

        // item_ids
        if (!offer?.item_ids) {
          errorObj[`${key}.item_ids`] = `offer.item_ids: is missing at index: ${index}`
        } else {
          if (storedItemId && !storedItemId?.includes(offer?.item_ids)) {
            errorObj[`${key}.item_ids`] = `item_ids at index: ${index} should be one of the id present in items object`
          }
        }

        //tags
      })

      setValue('offerIds', offerIds)
    }

    return errorObj
  } catch (error: any) {
    logger.error(`!!Error occcurred while checking offers in /${action},  ${error.message}`)
    return { error: error.message }
  }
}

export const validatePaymentObject = (
  payments: any,
  action: string,
  validDescriptorCodes: string[],
  checkId: boolean,
): any => {
  try {
    const errorObj: any = {}
    if (isEmpty(payments)) {
      errorObj.payments = `payments array is missing or is empty`
    } else {
      const allowedStatusValues = ['NOT-PAID', 'PAID']
      const allowedCollectedBy = ['BAP', 'BPP']
      const requiredParams = ['bank_code', 'bank_account_number', 'virtual_payment_address']
      const validTypes = ['ON-ORDER']
      payments?.forEach((arr: any, i: number) => {
        const terms = [
          { code: 'VIRTUAL_ADDRESS', type: 'string' },
          { code: 'ACCOUNT_NO', type: 'string' },
          { code: 'BENEFICIARY_NAME', type: 'string' },
          { code: 'BANK_NAME', type: 'string' },
          { code: 'BRANCH_CODE', type: 'string' },
          { code: 'BRANCH_NAME', type: 'string' },
          {
            code: 'SETTLEMENT_TYPE',
            type: 'enum',
            value: ['upi', 'neft', 'rtgs'],
          },
        ]

        if (checkId || (action == constants.CONFIRM && arr?.collected_by == 'BAP')) {
          if (!arr?.id) {
            errorObj[`payemnts[${i}]_id`] = `payments.id must be present in ${action}`
          } else {
            const paymentId = getValue('paymentId')
            if (paymentId && !isEqual(paymentId, arr?.id))
              errorObj[`payemnts[${i}]_id`] = `payments.id in ${action}, should be same as sent in prev call`
            else setValue('paymentId', paymentId)
          }
        }

        if (!arr?.collected_by) {
          terms.push({
            code: 'SETTLEMENT_COUNTERPARTY',
            type: 'enum',
            value: ['BAP', 'BPP'],
          })
          errorObj[`payemnts[${i}]_collected_by`] = `payments.collected_by must be present in ${action}`
        } else if (!allowedCollectedBy.includes(arr?.collected_by)) {
          terms.push({
            code: 'SETTLEMENT_COUNTERPARTY',
            type: 'enum',
            value: ['BAP', 'BPP'],
          })
          errorObj[
            `payemnts[${i}]_collected_by`
          ] = `invalid collected_by at index:${i} in payments, should be either of ${allowedCollectedBy}`
        } else {
          terms.push({
            code: 'SETTLEMENT_COUNTERPARTY',
            type: 'enum',
            value: ['BAP', 'BPP']?.filter((item: string) => arr?.collected_by != item),
          })
          const collectedBy = getValue(`collected_by`)
          if (collectedBy && collectedBy != arr?.collected_by)
            errorObj[
              `payemnts[${i}]_collected_by`
            ] = `payments.collected_by value sent in ${action} should be same as sent in past call: ${collectedBy}`
        }

        // check status
        if (!arr?.status) errorObj.paymentStatus = `payment.status is missing for index:${i} in payments`
        else if (!arr?.status || !allowedStatusValues.includes(arr?.status)) {
          errorObj.paymentStatus = `invalid status at index:${i} in payments, should be either of ${allowedStatusValues}`
        }

        // check type
        if (!arr?.type || !validTypes.includes(arr.type)) {
          errorObj[
            `payments[${i}]_type`
          ] = `payments.type must be present in ${action} & its value must be one of: ${validTypes.join(', ')}`
        }

        // check params
        const params = arr?.params
        if (!params) errorObj.params = `payment.params is missing for index:${i} in payments`
        else {
          const missingParams = requiredParams.filter((param) => !Object.prototype.hasOwnProperty.call(params, param))
          if (missingParams.length > 0) {
            errorObj.missingParams = `Required params ${missingParams.join(', ')} are missing in payments`
          }
        }

        // Validate payment tags
        const tagsValidation = validatePaymentTags(arr?.tags, terms, validDescriptorCodes)
        if (!tagsValidation.isValid) {
          Object.assign(errorObj, { tags: tagsValidation.errors })
        }
      })
    }

    return errorObj
  } catch (error) {
    logger.error(`!!Some error occurred while checking payment object /${action} API`, error)
  }
}

export const validateBppFulfillments = (fulfillments: any, action: string, checkCode: boolean) => {
  try {
    logger.info(`checking fulfillments object for /${action}`)
    const errorObj: any = {}

    if (isEmpty(fulfillments)) {
      errorObj['fulfillments'] = 'fulfillments array is missing or empty'
    } else {
      const fullTypes: string[] = []
      const fulfillmentsId = new Set()
      const storedFullId: any = getValue('fulfillmentsIds')
      const storedFullTypes = getValue('fullTypes')
      const flow = getValue('flow')
      let cancelCount = 0
      fulfillments.forEach((fulfillment: any, index: number) => {
        const key = `fulfillment${index}`
        if (!fulfillment?.type) {
          errorObj[`${key}.type`] = `fulfillment.type: is missing at index: ${index}`
        } else if (!storedFullTypes?.includes(fulfillment?.type)) {
          errorObj[
            `${key}.type`
          ] = `fulfillment type: ${fulfillment.type} should be one of the selected types in past call:${fullTypes}`
        } else fullTypes.push(fulfillment?.type)

        if (!fulfillment?.id) {
          errorObj[`${key}.id`] = `fulfillment.id: is missing at index: ${index}`
        } else {
          //duplicate id check
          if (fulfillmentsId.has(fulfillment.id)) {
            errorObj[`${key}.duplicate_id`] = `duplicate fulfillment id: ${fulfillment.id}`
          } else {
            fulfillmentsId.add(fulfillment.id)
          }

          if (storedFullId && !storedFullId?.includes(fulfillment.id)) {
            errorObj[`${key}.id`] = `id at index: ${index} should be one of the id mapped in previous call`
          }
        }

        const code = fulfillment?.state?.descriptor?.code
        if (checkCode) {
          if (!code) {
            errorObj[`${key}.code`] = `code is missing at index: ${index} for state.descriptor`
          } else {
            if (flowsFis10.FLOW_3 == flow) {
              if (code !== 'CANCELLED')
                errorObj[`${key}.code`] = `code value should be 'CANCELLED' at index: ${index} for state.descriptor`
            } else {
              const validCodeType = ['COMPLETED', 'PENDING', 'FAILED', 'CANCELLED']
              if (!validCodeType?.includes(code)) {
                errorObj[`${key}.code`] = `code value should be one of  ${validCodeType.join(
                  ', ',
                )} at index: ${index} for state.descriptor`
              }

              if (code == 'CANCELLED') cancelCount++
            }
          }
        }

        if (!fulfillment?.stops) {
          errorObj[`${key}.stops`] = `fulfillment.stops: is missing at index: ${index}`
        } else {
          fulfillment?.stops?.forEach((stop: any, j: number) => {
            if (!stop?.person?.name) errorObj[`${key}.name`] = `person.name is missing in stop${j} at /${action}`

            if (!stop?.contact?.email || !isValidEmail(stop?.contact?.email))
              errorObj[`${key}.email`] = `contact.email should be present with valid value in stop${j} at /${action}`

            if (!stop?.contact?.phone || !isValidPhoneNumber(stop?.contact?.phone))
              errorObj[`${key}.phone`] = `contact.phone should be present with valid value in stop${j} at /${action}`

            if (!stop?.authorization?.token)
              errorObj[`${key}.token`] = `authorization.token should be present in stop${j} at /${action}`

            if (checkCode && (code == 'COMPLETED' || code == 'CANCELLED')) {
              if (!stop?.authorization?.type || stop?.authorization?.type !== 'CODE')
                errorObj[
                  `${key}.type`
                ] = `authorization.type should be present with valid value i.e. 'CODE' in stop${j} at /${action}`

              if (!stop?.authorization?.token)
                errorObj[`${key}.token`] = `authorization.token is missing in stop${j} at /${action}`
            }
          })
        }
      })

      if (flow == flowsFis10.FLOW_2 && cancelCount == 0)
        errorObj[
          'cancellation'
        ] = `fulfillments array should contain at least one index with code as CANCELLED, ${action}`

      setValue('fulfillmentsIds', fulfillmentsId)
      setValue('fullTypes', fullTypes)
    }

    return errorObj
  } catch (error: any) {
    logger.error(`!!Error occcurred while checking fulfillments in /${action},  ${error.message}`)
    return { error: error.message }
  }
}
