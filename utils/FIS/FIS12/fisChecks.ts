import { getValue, setValue } from '../../../shared/dao'
import { FisApiSequence, fisFlows, formHeadingsFis } from '../../../constants/'
import { logger } from '../../../shared/logger'
import { checkIdAndUri, checkFISContext, isValidUrl } from '../../'
import _, { isEmpty } from 'lodash'
import { validatePaymentTags } from './tags'
// import { validatePaymentTags } from './tags'
const FULFILLMENT_STATE_CODES = ['INITIATED', 'SANCTIONED', 'DISBURSED', 'PENDING', 'REJECTED', 'COMPLETED']

export const checkUniqueCategoryIds = (categoryIds: (string | number)[], availableCategoryIds: any): boolean => {
  const uniqueCategoryIds = new Set(categoryIds)
  return categoryIds.length === uniqueCategoryIds.size && categoryIds.every((id) => availableCategoryIds.has(id))
}

const getFormHeading = (action: any, loanType: any): string[] | string | null => {
  if (formHeadingsFis[loanType] && formHeadingsFis[loanType][action]) {
    return formHeadingsFis[loanType][action]
  }

  return null
}

export const validateFulfillments = (
  fulfillment: any,
  i: number,
  documents: any[] = [],
  fulfillmentCode: string = '',
): any | null => {
  const errors: any = {}

  const loanType: any = getValue(`LoanType`)

  if (!fulfillment.state || !fulfillment.state.descriptor || !fulfillment.state.descriptor.code) {
    errors.fulfillmentState = `Fulfillment[${i}] state descriptor code is missing`
  } else {
    const { code } = fulfillment.state.descriptor
    if (!isEmpty(fulfillmentCode) && fulfillmentCode != code) {
      errors.fulfillmentState = `Fulfillment[${i}] state descriptor code should be ${fulfillmentCode}`
    } else if (!FULFILLMENT_STATE_CODES.includes(code)) {
      errors.fulfillmentState = `Fulfillment[${i}] state descriptor code must be one of ${FULFILLMENT_STATE_CODES.join(
        ', ',
      )}`
    }
  }

  if (loanType === 'PERSONAL_LOAN') {
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

  if (loanType === 'INVOICE_BASED_LOAN') {
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

  if (Object.keys(errors).length > 0) {
    const indexedErrors: any = {}
    Object.keys(errors).forEach((key) => {
      indexedErrors[`fulfillments[${i}].${key}`] = errors[key]
    })
    return indexedErrors
  }

  return null
  // return Object.keys(errors).length > 0 ? errors : null
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
      if (!curentCall.includes('unsolicated')) {
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

export const validateXInputSubmission = (xinput: any, index: number, sequence: string) => {
  const errorObj: any = {}

  if (!xinput) {
    errorObj[`item${index}`] = `xinput is missing in item${index}`
  } else {
    const version: any = getValue('version')
    if (!Object.prototype.hasOwnProperty.call(xinput?.form, 'id')) {
      errorObj[`item${index}_form`] = `/message/order/items/form in item[${index}] must have id in form`
    } else {
      const formId: any = getValue(`formId`)
      if (!formId?.includes(xinput?.form?.id)) {
        errorObj[`item${index}_formId`] =
          `form.id: ${xinput?.form?.id} mismatches with form.id sent in past call, should be ${formId}`
      }
    }

    if (!xinput?.form_response) {
      errorObj[`item${index}_xinput`] = `form_response is missing in items/xinput in item[${index}]`
    } else {
      if (!xinput?.form_response?.status) {
        errorObj[`item${index}_xinput`] =
          `/message/order/items/xinput in item[${index}] must have status in form_response`
      } else {
        let code = 'SUCCESS'
        if (version == '2.0.0' && sequence == 'on_select_1') code = 'PENDING'
        else if (version == '2.0.0' && sequence == 'select_2') code = 'APPROVED'
        else if (version == '2.1.0' && sequence == 'search_3') code = 'APPROVED'
        else if (version == '2.1.0' && sequence == 'on_search_2') code = 'CONSENT_CREATED'
        const status = xinput?.form_response?.status
        if (status !== code) {
          errorObj[`item${index}_status`] =
            `/message/order/items/xinput/form_response/status in item[${index}] should be '${code}'`
        }
      }

      if (!xinput?.form_response?.submission_id) {
        errorObj[`item${index}_xinput`] =
          `/message/order/items/xinput in item[${index}] must have submission_id in form_response`
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
    let mainPaymentObjectCount = 0

    if (_.isEmpty(payments)) errorObj.payments = `payments array is missing or empty in ${action}`
    else {
      const allowedStatusValues = ['NOT-PAID', 'PAID']
      // const allowedTypeValues = ['PRE-ORDER', 'ON-FULFILLMENT']
      payments?.forEach((payment: any, index: number) => {
        if (payment?.time?.label) {
          if (!payment.status) {
            errorObj.payments = `status is missing in payments`
          } else {
            const allowedStatusValues = ['NOT-PAID', 'PAID']
            if (!allowedStatusValues.includes(payment.status)) {
              errorObj.paymentStatus = `Invalid value for status. It should be either of NOT-PAID or PAID.`
            }
          }

          if (payment.time && payment.time.range) {
            const { start, end } = payment.time.range
            const startTime = new Date(start).getTime()
            const endTime = new Date(end).getTime()

            if (isNaN(startTime) || isNaN(endTime) || startTime > endTime) {
              errorObj.invalidTimeRange = `Invalid time range for payment at index ${index}`
            }

            // if (index > 0) {
            //   const prevEndTime = new Date(payments[i - 1].time.range.end).getTime()
            //   if (startTime <= prevEndTime) {
            //     errorObj.timeRangeOrderError = `Time range order error for payment at index ${index}`
            //   }
            // }
          } else {
            errorObj.missingTimeRange = `Missing time range for payment at index ${index}`
          }
        } else {
          mainPaymentObjectCount++
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
            { code: 'SETTLEMENT_AMOUNT', type: 'amount' },
            {
              code: 'OFFLINE_CONTRACT',
              type: 'boolean',
            },
          ]

          if (!action.includes('on_init')) {
            terms.push(
              ...[
                { code: 'DELAY_INTEREST', type: 'amount' },
                { code: 'SETTLEMENT_TYPE', type: 'enum', value: ['upi', 'neft', 'rtgs'] },
              ],
            )
          }

          if (!payment?.collected_by) {
            errorObj[`payemnts[${index}]_collected_by`] = `payments.collected_by must be present in ${action}`
          } else {
            const collectedBy = getValue(`collected_by`)
            if (collectedBy && collectedBy != payment?.collected_by)
              errorObj[`payemnts[${index}]_collected_by`] =
                `payments.collected_by value sent in ${action} should be same as sent in past call: ${collectedBy}`
          }

          // check status
          if (!payment?.status) errorObj.paymentStatus = `payment.status is missing for index:${index} in payments`
          else if (!payment?.status || !allowedStatusValues.includes(payment?.status)) {
            errorObj.paymentStatus = `invalid status at index:${index} in payments, should be either of ${allowedStatusValues}`
          }

          // check type
          const validTypes = ['ON_ORDER', 'ON_FULFILLMENT', 'POST_FULFILLMENT']
          if (!payment?.type || !validTypes.includes(payment.type)) {
            errorObj[`payments[${index}]_type`] =
              `payments.type must be present in ${action} & its value must be one of: ${validTypes.join(', ')}`
          }

          // Validate payment tags
          const tagsValidation = validatePaymentTags(payment?.tags, terms)
          if (!tagsValidation.isValid) {
            Object.assign(errorObj, { tags: tagsValidation.errors })
          }
        }
      })

      if (mainPaymentObjectCount === 0) errorObj.mainPaymentObject = 'main paymnet object is missing'
      return errorObj
    }
  } catch (error: any) {
    logger.error(`!!Error while checking payment object in /${action}, ${error.stack}`)
  }
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
      errorObj[`${path}.descriptor`] = `descriptor is missing at ${path}.`
    } else {
      if (checkCode) {
        if (!descriptor?.code?.trim()) {
          errorObj[`${path}.code`] = `descriptor.code is missing at ${path}.`
        } else if (descriptor.code?.trim() !== descriptor.code?.trim()?.toUpperCase()) {
          errorObj[`${path}.code`] = `descriptor.code must be in uppercase at ${path}., ${descriptor.code}`
        } else if (codes && !codes?.includes(descriptor?.code))
          errorObj[`${path}.code`] = `descriptor.code should be one of ${codes} at ${path}`
      }

      if (descriptor?.images) {
        descriptor.images.forEach((image: any, index: number) => {
          const { url, size_type } = image
          if (!isValidUrl(url)) {
            errorObj[`${path}.image_url_[${index}]`] = `Invalid URL for image in descriptor at ${path}.`
          }

          const validSizes = ['xs', 'md', 'sm', 'lg']
          if (!validSizes.includes(size_type)) {
            errorObj[`${path}.image_size_[${index}]`] =
              `Invalid image size in descriptor, should be one of: ${validSizes.join(', ')} at ${path}.`
          }
        })
      }

      //validate name only if checkCode is false or name is present
      if (!checkCode || descriptor?.name) {
        if (!descriptor?.name?.trim()) {
          errorObj[`${path}.name`] = `descriptor.name is missing or empty ${path}.`
        }
      }

      if (descriptor?.short_desc) {
        if (!descriptor.short_desc.trim()) {
          errorObj[`${path}.short_desc`] = `descriptor.short_desc is empty at ${path}.`
        }
      }

      if (descriptor?.long_desc) {
        if (!descriptor.long_desc.trim()) {
          errorObj[`${path}.long_desc`] = `descriptor.long_desc is empty at ${path}.`
        }
      }
    }

    return errorObj
  } catch (error: any) {
    logger.info(`Error while validating descriptor for /${action} at ${path}, ${error.stack}`)
  }
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

    // send true as last argument in case if descriptor.code validation is required
    const descriptorError = validateDescriptor(provider?.descriptor, action, `provider.descriptor`, false, [])
    if (descriptorError) Object.assign(providerErrors, descriptorError)
    return providerErrors
  } catch (error: any) {
    logger.info(`Error while checking provider object in /${action} api, ${error.stack}`)
  }
}

export const validateXInput = (xinput: any, j: number, action: string, currIndex: number): any | null => {
  const errors: any = {}
  if (!xinput || typeof xinput !== 'object') {
    errors[`item${j}_xinput`] = `xinput is missing or not an object in items[${j}]`
  } else {
    const head = xinput?.head
    const form = xinput?.form

    if (!head || typeof head !== 'object') {
      errors[`item${j}_xinput_head`] = `head is missing or not an object in items[${j}].xinput`
    } else {
      const descriptor = head?.descriptor
      const index = head?.index
      const headings = head?.headings
      const loanType: any = getValue(`LoanType`)
      const formHeading: any = getFormHeading(action, loanType)
      console.log('formHeading', formHeading)

      console.log('formHeadingjqwdjwqnfjewnfjewn', formHeading, loanType, currIndex, formHeading[currIndex])

      if (!descriptor) {
        errors[`item${j}_xinput_head_descriptor`] = `descriptor is missing at items[${j}].xinput.head`
      } else if (!descriptor?.name) {
        errors[`item${j}_xinput_head_descriptor`] = `descriptor.name is missing at items[${j}].xinput.head`
      }
      // } else if (formHeading?.length && formHeading[currIndex] )
      // {
      //   errors[`item${j}_xinput_head_descriptor`] =
      //     `descriptor.name should be ${formHeading[currIndex]} at items[${j}].xinput.head form heading ${formHeading} ${formHeading?.length} ${formHeading[currIndex]} ${descriptor?.name} != ${formHeading[currIndex]}`
      // }

      console.log('currIndex', currIndex)

      // if (currIndex != index?.cur) {
      //   errors[`index`] = `index should be ${currIndex} items[${j}].xinput.head`
      // }

      if (
        !index ||
        typeof index !== 'object' ||
        typeof index?.min !== 'number' ||
        typeof index?.cur !== 'number' ||
        typeof index?.max !== 'number'
      ) {
        errors[`item${j}_xinput_head_index`] = `index is missing or incomplete in items[${j}].xinput.head`
      } else if (index?.cur < index?.min || index?.cur > index?.max) {
        errors[`item${j}_xinput_head_index`] = `cur should be between min and max in items[${j}].xinput.head.index`
      }

      if (!headings || isEmpty(headings)) {
        errors[`item${j}_xinput_head_headings`] = `headings is missing or empty at items[${j}].xinput.head`
      } else if (!headings || !Array.isArray(headings) || headings?.length !== index?.max + 1) {
        errors[`item${j}_xinput_head_headings`] = `max value should be ${
          formHeading?.length - 1
        } in items[${j}].xinput.head ${formHeading?.length} ${index?.max + 1}`
      }
    }

    if (!form) {
      errors[`item${j}_xinput_form`] = `form is missing at items[${j}].xinput`
    } else {
      const url = form?.url
      const id = form?.id

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

      if (!('resubmit' in form)) {
        errors.resubmit = `resubmit is missing in items[${j}].xinput.form`
      }

      if (!('multiple_sumbissions' in form)) {
        errors.multiple_sumbissions = `multiple_sumbissions is missing in items[${j}].xinput.form`
      }

      if (!('mime_type' in form)) {
        errors.mime_type = `mime_type is missing in items[${j}].xinput.form`
      }
    }
  }

  return Object.keys(errors).length > 0 ? errors : null
}

export const validateQuote = (onSelect: any, action: string) => {
  const errorObj: any = {}

  try {
    logger.info(`Checking quote details in /${action}`)

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

    if (action.includes(FisApiSequence.ON_UPDATE)) {
      const flow = getValue('flow')
      if (flow == fisFlows.FORECLOSURE_PERSONAL) {
        validBreakupItems.push(...['OUTSTANDING_PRINCIPAL', 'FORCLOSUER_CHARGES', 'OUTSTANDING_INTEREST'])
      } else if (flow == fisFlows.PRE_PART_PERSONAL) {
        validBreakupItems.push(...['OUTSTANDING_PRINCIPAL', 'PRE_PAYMENT_CHARGE', 'OUTSTANDING_INTEREST'])
      } else if (flow == fisFlows.MISSED_EMI_PERSONAL) {
        validBreakupItems.push(...['LATE_FEE_AMOUNT'])
      }
    }

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
  } catch (error: any) {
    logger.error(`!!Error while checking quote details in /${action}`, error.stack)
  }

  return errorObj
}

export const validateBAPItem = (select: any, action: string, prevCall: string, sequence: string) => {
  const errorObj: any = {}

  try {
    logger.info(`checking item array in /${action}`)
    if (!select.items) {
      errorObj.items = `items must be present & should non empty in /${action}`
    } else {
      const itemId = getValue(`${prevCall}_itemsId`)
      const parentItemId: any = getValue('parentItemId')
      const version: any = getValue('version')
      const selectedItemId = new Set()

      select?.items?.forEach((item: any, index: number) => {
        const key = `item[${index}]`
        // Validate item id
        if (!item?.id) {
          errorObj[`item[${index}].id`] = `id should be present at item[${index}] /$${action}`
        } else {
          selectedItemId?.add(item?.id)
          if (itemId && !itemId.includes(item.id)) {
            errorObj[`${key}.item_id`] =
              `/message/order/items/id in item: ${item.id} should be one of the item.id mapped in previous call`
          }
        }

        // Validate parent_item_id
        if (version == '2.1.0') {
          if (!item?.parent_item_id) errorObj.parent_item_id = `sub-parent_item_id not found in providers[${index}]`
          else {
            if (sequence == 'select_1' && version == '2.1.0') {
              if (itemId && !itemId.includes(item.parent_item_id)) {
                setValue('parentItemId', item.parent_item_id)
                errorObj[`${key}.parent_item_id`] =
                  `parent_item_id: ${item.parent_item_id} doesn't match with parent_item_id from past call in providers[${index}]`
              }
            } else {
              if (parentItemId && !parentItemId.includes(item.parent_item_id)) {
                setValue('parentItemId', item.parent_item_id)
                errorObj[`${key}.parent_item_id`] =
                  `parent_item_id: ${item.parent_item_id} doesn't match with parent_item_id from past call in providers[${index}]`
              }
            }
          }
        }

        //validate xInput form
        const xinputErrors =
          version == '2.1.0' && sequence == 'select_1' ? null : validateXInputSubmission(item?.xinput, index, sequence)
        Object.assign(errorObj, xinputErrors)
      })

      if (sequence == 'select_1' && version == '2.1.0') {
        const parentItemIds = select?.items
          ?.map((item: any) => {
            return item?.parent_item_id
          })
          ?.filter((item: string) => !!item)

        setValue('parentItemId', parentItemIds)
      }

      setValue('selectedItemId', selectedItemId)
    }
  } catch (error: any) {
    logger.error(`!!Error while checking item in /${action}`)
  }

  return errorObj
}

export const validateDocuments = (documents: any, action: string, requiredDocumentCodes: string[]) => {
  try {
    logger.info(`Checking documents in /${action}`)
    const errors: any = {}

    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      errors.documents = 'Documents array is missing or empty in order'
    } else {
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
