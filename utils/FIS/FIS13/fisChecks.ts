import { getValue, setValue } from '../../../shared/dao'
import { insuranceFormHeadings } from '../../../constants/'
import { logger } from '../../../shared/logger'
import { checkIdAndUri, checkFISContext } from '../../'
import _, { isEmpty } from 'lodash'
const FULFILLMENT_STATE_CODES = ['INITIATED', 'SANCTIONED', 'DISBURSED', 'PENDING', 'REJECTED', 'COMPLETED']

export const checkUniqueCategoryIds = (categoryIds: (string | number)[], availableCategoryIds: any): boolean => {
  const uniqueCategoryIds = new Set(categoryIds)
  return categoryIds.length === uniqueCategoryIds.size && categoryIds.every((id) => availableCategoryIds.has(id))
}

const getFormHeading = (action: any, insuranceType: any): string[] | string | null => {
  if (insuranceFormHeadings[insuranceType] && insuranceFormHeadings[insuranceType][action]) {
    return insuranceFormHeadings[insuranceType][action]
  }

  return null
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

      if (!form?.resubmit || typeof form?.resubmit !== 'boolean') {
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

export const validateDescriptor = (descriptor: any, action: string, path: string, checkCode: boolean): any => {
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
        }
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
      errorObj[`item${index}_xinput`] =
        `/message/order/items/xinput in item[${index}] must have status in form_response`
    } else {
      const status = xinput?.form_response?.status
      const code = 'SUCCESS'
      if (status !== code) {
        errorObj[`item${index}_status`] =
          `/message/order/items/xinput/form_response/status in item[${index}] should be '${code}'`
      }
    }

    if (!Object.prototype.hasOwnProperty.call(xinput?.form_response, 'submission_id')) {
      errorObj[`item${index}_xinput`] =
        `/message/order/items/xinput in item[${index}] must have submission_id in form_response`
    } else {
      setValue(`${sequence}_submission_id`, xinput?.form_response?.submission_id)
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
      const quoteBreakup = quote.breakup
      const validBreakupItems = ['BASE_PRICE', 'CONVIENCE_FEE', 'TAX', 'PROCESSING_FEE']

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
    const descriptorError = validateDescriptor(provider?.descriptor, action, `provider.descriptor`, false)
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

    console.log('documents', documents)

    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      errors.documents = 'Documents array is missing or empty in order'
    } else {
      const requiredDocumentCodes = ['POLICY_DOC', 'CLAIM_DOC', 'RENEW_DOC']

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
