import { getValue, setValue } from '../../../shared/dao'
import { insuranceFormHeadings } from '../../../constants/'
import { logger } from '../../../shared/logger'
import { checkIdAndUri, checkFISContext } from '../../'
import _, { isArray, isEmpty } from 'lodash'
const FULFILLMENT_STATE_CODES = ['INITIATED', 'SANCTIONED', 'DISBURSED', 'PENDING', 'REJECTED', 'COMPLETED']

export const checkUniqueCategoryIds = (categoryIds: (string | number)[], availableCategoryIds: any): boolean => {
  console.log('categoryIds', categoryIds)
  console.log('availableCategoryIds', availableCategoryIds)
  const uniqueCategoryIds = new Set(categoryIds)
  const isIdAvailable = (id: string | number) => {
    if (availableCategoryIds instanceof Set) {
      return availableCategoryIds.has(id) 
    } else if (Array.isArray(availableCategoryIds)) {
      return availableCategoryIds.includes(id) 
    } else {
      throw new TypeError('availableCategoryIds must be either an Array or Set')
    }
  }

  return categoryIds.length === uniqueCategoryIds.size && categoryIds.every((id) => isIdAvailable(id))
}

const getFormHeading = (action: any, insuranceType: any): string[] | string | null => {
  if (insuranceFormHeadings[insuranceType] && insuranceFormHeadings[insuranceType][action]) {
    return insuranceFormHeadings[insuranceType][action]
  }

  return null
}

const getQuoteCodes = (flow: string): string[] => {
  switch (flow) {
    case 'HEALTH_INSURANCE':
      return ['BASE_PRICE', 'CONVIENCE', 'TAX', 'PROCESSING_FEE']
      break

    case 'MARINE_INSURANCE':
      return ['BASE_PRICE', 'TAX', 'PROCESSING_FEE']
      break

    case 'MOTOR_INSURANCE':
      return ['BASE_PRICE', 'TAX', 'PROCESSING_FEE']
      break

    default:
      return []
      break
  }
}

export const getCodes = (): string[] => {
  const insurance = getValue('insurance')
  switch (insurance) {
    case 'HEALTH_INSURANCE':
      return ['INDIVIDUAL_INSURANCE', 'FAMILY_INSURANCE', 'HEALTH_INSURANCE']

    case 'MARINE_INSURANCE':
      return ['MARINE_INSURANCE']

    default:
      return []
  }
}

//remove
export const validateFulfillments = (fulfillment: any, i: number, documents: any[]): any | null => {
  const errors: any = {}

  const insuranceType: any = getValue(`insuranceType`)

  if (!fulfillment.state || !fulfillment.state.descriptor || !fulfillment.state.descriptor.code) {
    errors.fulfillmentState = `Fulfillment[${i}] state descriptor code is missing`
  } else {
    const { code } = fulfillment.state.descriptor
    if (!FULFILLMENT_STATE_CODES.includes(code)) {
      errors.fulfillmentState = `Fulfillment[${i}] state descriptor code must be one of ${FULFILLMENT_STATE_CODES.join(
        ', ',
      )}`
    }
  }

  if (insuranceType === 'PERSONAL_LOAN') {
    if (
      !fulfillment.customer ||
      !fulfillment.customer.contact ||
      !fulfillment.customer.contact.email ||
      !fulfillment.customer.contact.phone ||
      !fulfillment.customer.person ||
      !fulfillment.customer.person.name
    ) {
      errors.customerInfo = `Customer information is incomplete for Fulfillment[${i}]`
    }
  }

  if (insuranceType === 'INVOICE_BASED_LOAN') {
    if (
      !fulfillment.customer ||
      !fulfillment.customer.organisation.address ||
      !fulfillment.customer.organisation.state ||
      !fulfillment.customer.organisation.state.name ||
      !fulfillment.customer.organisation.city ||
      !fulfillment.customer.organisation.city.name ||
      !fulfillment.customer.organisation.city.code ||
      !fulfillment.customer.organisation.contact ||
      !fulfillment.customer.organisation.contact.phone ||
      !fulfillment.customer.organisation.contact.email
    ) {
      errors.customerInfo = `Customer information is incomplete for Fulfillment[${i}]`
    }
  }

  if (fulfillment.code === 'DISBURSED') {
    const hasLoanCancellationDocument = documents.some((document: any) => {
      return document.descriptor && document.descriptor.code === 'LOAN_CANCELLATION'
    })

    if (!hasLoanCancellationDocument) {
      errors.missingLoanCancellationDocument =
        'Documents must contain LOAN_CANCELLATION when fulfillment code is DISBURSED'
    }
  }

  return Object.keys(errors).length > 0 ? errors : null
}

export const validateXInput = (xinput: any, j: number, action: string, currIndex: number): any | null => {
  const errors: any = {}
  if (!xinput || typeof xinput !== 'object') {
    errors[`item${j}_xinput`] = `xinput is missing or not an object in items[${j}]`
  } else {
    const head = xinput.head
    const form = xinput.form

    if (!head || typeof head !== 'object') {
      errors[`item${j}_xinput_head`] = `head is missing or not an object in items[${j}].xinput`
    } else {
      const descriptor = head.descriptor
      const index = head.index
      const headings = head.headings

      if (!descriptor || typeof descriptor !== 'object' || !descriptor.name || typeof descriptor.name !== 'string') {
        errors[`item${j}_xinput_head_descriptor`] = `descriptor is missing or invalid in items[${j}].xinput.head`
      }

      if (currIndex != index?.cur) {
        errors[`index`] = `index should be ${currIndex} items[${j}].xinput.head`
      }

      if (
        !index ||
        typeof index !== 'object' ||
        typeof index.min !== 'number' ||
        typeof index.cur !== 'number' ||
        typeof index.max !== 'number'
      ) {
        errors[`item${j}_xinput_head_index`] = `index is missing or invalid in items[${j}].xinput.head`
      } else if (index.cur < index.min || index.cur > index.max) {
        errors[`item${j}_xinput_head_index`] = `cur should be between min and max in items[${j}].xinput.head.index`
      }

      const insuranceType: any = getValue(`insuranceType`)
      if (insuranceType && action) {
        const formHeading: any = getFormHeading(action, insuranceType)

        if (!headings || !Array.isArray(headings) || formHeading.length !== index.max + 1) {
          errors[`item${j}_xinput_head_index`] = `max value should be ${
            formHeading?.length - 1
          } in items[${j}].xinput.head`
        }
      }
    }

    if (!form || typeof form !== 'object') {
      errors[`item${j}_xinput_form`] = `form is missing or not an object in items[${j}].xinput`
    } else {
      const url = form.url
      const id = form.id

      if (!url || typeof url !== 'string' || !isValidUrl(url)) {
        errors[`item${j}_xinput_form_url`] =
          `url is missing, not a string, or not a valid URL in items[${j}].xinput.form`
      }

      if (!id || typeof id !== 'string') {
        errors[`item${j}_xinput_form_id`] = `id is missing or not a string in items[${j}].xinput.form`
      } else {
        const formId: string[] | any = getValue('formId')
        if (Array.isArray(formId)) {
          formId.push(id)
          setValue('formId', formId)
        } else if (typeof formId === 'string') {
          const newArray: string[] = [formId, id]
          setValue('formId', newArray)
        } else if (formId === undefined) {
          setValue('formId', [id])
        }
      }

      if (!isEmpty(form?.resubmit) || typeof form?.resubmit !== 'boolean') {
        errors.resubmit = `resubmit is missing or type is incorrect in items[${j}].xinput.form`
      }

      if (typeof form?.multiple_sumbissions !== 'boolean') {
        errors.multiple_sumbissions = `multiple_sumbissions is missing or type is incorrect in items[${j}].xinput.form`
      }

      if (!form?.mime_type) {
        errors.mime_type = `mime_type is missing in items[${j}].xinput.form`
      }
    }
  }

  return Object.keys(errors).length > 0 ? errors : null
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

export const validateCancellationTerms = (cancellationTerms: any) => {
  const errors: string[] = []

  if (!isArray(cancellationTerms)) {
    errors.push(`cancellationTerms are missing or empty`)
    return errors
  }

  const isValidPercentage = (percentage: string) => /^[1-9][0-9]?%$/.test(percentage) // Valid percentages from 1% to 99%
  const isValidMIMEType = (mimetype: string) => mimetype === 'text/html' // Only allowing 'text/html' in this case
  const isValidURL = (url: string) => /^(https?:\/\/[^\s]+$)/.test(url) // Valid URL format
  const isValidFulfillmentStateCode = (code: string) => ['INSURANCE_PROCESSING', 'INSURANCE_GRANTED'].includes(code) // Allowed codes

  cancellationTerms.forEach((term: any, index: number) => {
    // Vaidate cancellation_fee
    if (term.cancellation_fee && term.cancellation_fee.percentage) {
      const { percentage } = term.cancellation_fee
      if (!isValidPercentage(percentage)) {
        errors.push(
          `CancellationTerm[${index}] has an invalid percentage '${percentage}'. Expected a valid percentage like '3%'.`,
        )
      }
    } else {
      errors.push(`CancellationTerm[${index}] is missing the 'cancellation_fee' or 'percentage'.`)
    }

    // Validate external_ref
    if (term.external_ref) {
      const { mimetype, url } = term.external_ref
      if (!isValidMIMEType(mimetype)) {
        errors.push(`CancellationTerm[${index}] has an invalid mimetype '${mimetype}'. Expected 'text/html'.`)
      }
      if (!isValidURL(url)) {
        errors.push(`CancellationTerm[${index}] has an invalid URL '${url}'.`)
      }
    } else {
      errors.push(`CancellationTerm[${index}] is missing 'external_ref'.`)
    }

    // Validate fulfillment_state
    if (term.fulfillment_state && term.fulfillment_state.descriptor) {
      const { code } = term.fulfillment_state.descriptor
      if (!isValidFulfillmentStateCode(code)) {
        errors.push(`CancellationTerm[${index}] has an invalid fulfillment state code '${code}'.`)
      }
    } else {
      errors.push(`CancellationTerm[${index}] is missing 'fulfillment_state' or 'descriptor'.`)
    }
  })

  return errors
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
          errorObj.code = `descriptor.code should be one of ${codes} at ${path}`
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
    if (!xinput?.form) {
      errorObj[`item${index}_form`] = `form is missing in items[${index}].xinput`
    } else {
      const formId: any = getValue(`formId`)
      if (!formId?.includes(xinput?.form?.id)) {
        errorObj[`item${index}_formId`] = `form.id: ${xinput?.form?.id} mismatches with form.id sent in past call`
      }
    }

    //check form_response
    if (!xinput?.form_response) {
      errorObj[`item${index}_form_response`] = `form_response is missing in items[${index}].xinput`
    } else {
      const formResponse = xinput?.form_response
      if (!formResponse?.status) {
        errorObj[`item${index}_form_response.status`] = `status is missing in xinput.form_response`
      } else {
        const status = xinput?.form_response?.status
        const code = 'SUCCESS'
        if (status !== code) {
          errorObj[`item${index}_status`] =
            `/message/order/items/xinput/form_response/status in item[${index}] should be '${code}'`
        }
      }
      if (!formResponse?.submission_id) {
        errorObj[`item${index}_form_response.submission_id`] = `submission_id is missing in xinput.form_response`
      } else {
        setValue(`${sequence}_submission_id`, xinput?.form_response?.submission_id)
      }
    }
  }

  return errorObj
}

export const validatePaymentsObject = (payments: any, action: string) => {
  try {
    logger.info(`checking payment object in /${action}`)
    const errorObj: any = {}
    // const buyerFinderFeesTag = payments[0].tags.find((tag: any) => tag.descriptor.code === 'BUYER_FINDER_FEES')
    // const settlementTermsTag = payments[0].tags.find((tag: any) => tag.descriptor.code === 'SETTLEMENT_TERMS')

    // if (!buyerFinderFeesTag) {
    //   errorObj.buyerFinderFees = `BUYER_FINDER_FEES tag is missing in payments`
    // }

    // if (!settlementTermsTag) {
    //   errorObj.settlementTerms = `SETTLEMENT_TERMS tag is missing in payments`
    // }

    if (_.isEmpty(payments)) errorObj.payments = `payments array is missing or empty in ${action}`
    else {
      const allowedStatusValues = ['NOT-PAID', 'PAID']
      const allowedTypeValues = ['PRE-ORDER', 'ON-FULFILLMENT']
      const requiredParams = ['bank_code', 'bank_account_number', 'virtual_payment_address']
      payments?.forEach((payment: any, index: number) => {
        // check status
        if (!payment?.status)
          errorObj.paymentStatus = `payment.status is missing for index:${index} in payments at ${action}`
        else if (!payment?.status || !allowedStatusValues.includes(payment?.status)) {
          errorObj.paymentStatus = `invalid status at index:${index} in payments, should be either of ${allowedStatusValues}`
        }

        // check type
        if (!payment?.type) errorObj.paymentType = `payment.type is missing for index:${index} in payments at ${action}`
        else if (!payment?.type || !allowedTypeValues.includes(payment?.type)) {
          errorObj.paymentType = `invalid type at index:${index} in payments, should be one of ${allowedTypeValues}`
        }

        // check params
        const params = payment?.params
        const missingParams = requiredParams.filter((param) => !Object.prototype.hasOwnProperty.call(params, param))
        if (missingParams.length > 0) {
          errorObj.missingParams = `Required params ${missingParams.join(', ')} are missing in payments`
        }

        // check collected_by
        if (!payment.collected_by) {
          errorObj.payments = `collected_by is missing in payments`
        } else {
          const collectedBy = getValue(`collected_by`)
          if (collectedBy && collectedBy !== payment.collected_by) {
            errorObj.collectedBy = `collected_by didn't match with what was sent in previous call.`
          } else {
            const allowedCollectedByValues = ['BPP', 'BAP']
            if (!allowedCollectedByValues.includes(payment.collected_by)) {
              errorObj.collectedBy = `Invalid value for collected_by, should be either of ${allowedCollectedByValues}`
            }

            setValue(`collected_by`, payment.collected_by)
          }
        }
      })
    }
  } catch (error: any) {
    logger.error(`!!Error while checking payment object in /${action}, ${error.stack}`)
  }
}

export const validateQuote = (quote: any) => {
  const errorObj: any = {}

  try {
    logger.info(`Checking quote details`)
    if (isEmpty(quote)) errorObj.quote = 'quote is  missing at message.order'
    else {
      const quoteBreakup = quote?.breakup
      const insurance: any = getValue('insurance')
      const validBreakupItems = getQuoteCodes(insurance)

      const requiredBreakupItems = validBreakupItems.filter((item) =>
        quoteBreakup.some((breakupItem: any) => breakupItem.title.toUpperCase() === item),
      )

      const missingBreakupItems = validBreakupItems.filter((item) => !requiredBreakupItems.includes(item))

      if (missingBreakupItems.length > 0) {
        errorObj.missingBreakupItems = `Quote breakup is missing the following items: ${missingBreakupItems.join(', ')}`
      }

      const totalBreakupValue = quoteBreakup.reduce((total: any, item: any) => {
        const itemTitle = item.title.toUpperCase()
        if (requiredBreakupItems.includes(itemTitle)) {
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

      const currencies = quoteBreakup.map((item: any, index: number) => {
        if (!item?.price?.currency) {
          console.log('item?.price?.currency', index, item)
          errorObj[`missingCurrency[${index}]`] = `Currency is missing for breakup item: ${item.title}`
        }
        return item?.price?.currency
      })

      if (new Set(currencies).size !== 1) {
        errorObj.multipleCurrencies = 'Currency must be the same for all items in the quote breakup'
      }

      if (!quote.ttl) {
        errorObj.missingTTL = 'TTL is required in the quote'
      }

      if (insurance == 'HEALTH_INSURANCE' && !quote?.id) {
        errorObj.quoteId = 'id is missing in quote'
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
      if (prvrdID && !_.isEqual(prvrdID, provider?.id)) {
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
    const insurance: any = getValue('insurance')

    console.log('documents', documents)

    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      errors.documents = 'Documents array is missing or empty in order'
    } else {
      const requiredDocumentCodes = ['POLICY_DOC', 'CLAIM_DOC']
      if (insurance != 'MARINE_INSURANCE') requiredDocumentCodes.push('RENEW_DOC')

      documents.forEach((document, index) => {
        console.log('document', document)
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

        console.log('errors', errors)

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

      console.log('fbwehfbjwefnjwenfjwenfjwnejk')

      // missing docs
      const missingDocuments = requiredDocumentCodes.filter(
        (code) => !documents.some((document) => document.descriptor.code === code),
      )

      console.log('missingDocuments', missingDocuments)
      if (missingDocuments.length > 0) {
        errors.missingDocuments = `Missing required documents: ${missingDocuments.join(', ')}`
      }
    }

    console.log('errors', errors)

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

export const validateFulfillmentsArray = (fulfillments: any, action: string) => {
  const errors: string[] = []
  const fullIds: string[] = []

  if (!isArray(fulfillments)) {
    errors.push(`Fulfillments are missing or empty`)
    return errors
  }
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isValidPhone = (phone: string) => /^\+?\d{1,3}?[- ]?\d{10}$/.test(phone) // E.g. +91-9999999999
  const isValidDate = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(new Date(date).getTime())
  const isValidGender = (gender: string) => ['male', 'female', 'other'].includes(gender)
  const isValidGSTIN = (gstin: string) => /^[0-9A-Z]{15}$/.test(gstin) // GSTIN: 15 alphanumeric characters
  const isBooleanString = (value: string) => value === 'true' || value === 'false'

  fulfillments.forEach((fulfillment: any, index: number) => {
    // Validate the customer object
    if (!fulfillment.customer) {
      errors.push(`Fulfillment[${index}] is missing the customer object.`)
    } else {
      const customer = fulfillment?.customer

      // Validate the contact details
      if (customer?.contact) {
        const { email, phone } = customer.contact
        if (!isValidEmail(email)) {
          errors.push(`Fulfillment[${index}] has an invalid email '${email}'.`)
        }
        if (!isValidPhone(phone)) {
          errors.push(`Fulfillment[${index}] has an invalid phone number '${phone}'.`)
        }
      } else {
        errors.push(`Fulfillment[${index}] is missing contact details.`)
      }

      // Validate the organization address
      if (action.includes('on_')) {
        if (
          !customer?.organization ||
          (typeof customer?.organization?.address === 'string' && customer?.organization?.address?.length === 0)
        ) {
          errors.push(`Fulfillment[${index}] has an invalid or missing organization address.`)
        }
      }

      // Validate the person details
      if (customer.person) {
        const { dob, gender, name, tags } = customer.person
        if (!isValidDate(dob)) {
          errors.push(`Fulfillment[${index}] has an invalid date of birth '${dob}'.`)
        }
        if (!isValidGender(gender)) {
          errors.push(`Fulfillment[${index}] has an invalid gender '${gender}'.`)
        }
        if (!name || typeof name !== 'string' || name.length === 0) {
          errors.push(`Fulfillment[${index}] has an invalid name '${name}'.`)
        }

        if (action.includes('confirm')) {
          if (tags && Array.isArray(tags)) {
            fulfillment.tags.forEach((tag: any, tagIndex: number) => {
              if (!tag.descriptor || !tag.descriptor.code || !tag.descriptor.name) {
                errors.push(`Fulfillment[${index}] -> Tag[${tagIndex}] is missing descriptor fields.`)
              }

              // Only validate PERSON_ADDITIONAL_DETAILS
              if (tag.descriptor.code === 'PERSON_ADDITIONAL_DETAILS') {
                tag.list.forEach((item: any, itemIndex: number) => {
                  const descriptorCode = item.descriptor?.code
                  const value = item.value

                  // Validate POLITICALLY_EXPOSED_PERSON
                  if (descriptorCode === 'POLITICALLY_EXPOSED_PERSON') {
                    if (!isBooleanString(value)) {
                      errors.push(
                        `Fulfillment[${index}] -> Tag[${tagIndex}] -> List[${itemIndex}] has an invalid value for 'POLITICALLY_EXPOSED_PERSON'. Expected 'true' or 'false'.`,
                      )
                    }
                  }

                  // Validate GSTIN
                  if (descriptorCode === 'GSTIN') {
                    if (!isValidGSTIN(value)) {
                      errors.push(
                        `Fulfillment[${index}] -> Tag[${tagIndex}] -> List[${itemIndex}] has an invalid GSTIN '${value}'. Expected a valid 15-character alphanumeric GSTIN.`,
                      )
                    }
                  }
                })
              }
            })
          } else if (tags) {
            errors.push(`Fulfillment[${index}] has an invalid 'tags' field. It should be an array.`)
          } else {
            errors.push(`tags not present at Fulfillments[${index}]`)
          }

          if (action == 'on_confirm') {
            if (!customer?.state || !customer?.state?.descriptor || !customer?.state?.descriptor?.code) {
              errors.push(`state.descriptor.code is missing at Fulfillment[${index}]`)
            }
          }
        }
      } else {
        errors.push(`Fulfillment[${index}] is missing person details.`)
      }
    }

    // Validate the fulfillment ID and type
    if (!fulfillment.id || typeof fulfillment.id !== 'string' || fulfillment.id.length === 0) {
      errors.push(`Fulfillment[${index}] has an invalid or missing ID.`)
    } else {
      fullIds?.push(fulfillment.id)
    }
    if (!fulfillment.type || typeof fulfillment.type !== 'string' || fulfillment.type.length === 0) {
      errors.push(`Fulfillment[${index}] has an invalid or missing type.`)
    } else if (fulfillment.type !== 'POLICY') {
      errors.push(`Fulfillment[${index}] has an unsupported type '${fulfillment.type}'. Expected 'POLICY'.`)
    }
  })

  if (action == 'on_init') setValue(`fulfillmentIds`, fullIds)
  return errors
}
