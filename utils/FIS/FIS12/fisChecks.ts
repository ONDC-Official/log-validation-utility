import { getValue, setValue } from '../../../shared/dao'
import { formHeadingsFis } from '../../../constants/'
import { logger } from '../../../shared/logger'
import { checkIdAndUri, checkFISContext } from '../../'
import _ from 'lodash'
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

export const validateFulfillments = (fulfillment: any, i: number, documents: any[]): any | null => {
  const errors: any = {}

  const loanType: any = getValue(`LoanType`)

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

  return Object.keys(errors).length > 0 ? errors : null
}

export const validateXInput = (xinput: any, i: number, j: number, action: string): any | null => {
  const errors: any = {}
  console.log('action', action)

  if (!xinput || typeof xinput !== 'object') {
    errors[`prvdr${i}item${j}_xinput`] = `xinput is missing or not an object in providers[${i}].items[${j}]`
  } else {
    const head = xinput.head
    const form = xinput.form

    if (!head || typeof head !== 'object') {
      errors[`prvdr${i}item${j}_xinput_head`] = `head is missing or not an object in providers[${i}].items[${j}].xinput`
    } else {
      const descriptor = head.descriptor
      const index = head.index
      const headings = head.headings

      if (!descriptor || typeof descriptor !== 'object' || !descriptor.name || typeof descriptor.name !== 'string') {
        errors[
          `prvdr${i}item${j}_xinput_head_descriptor`
        ] = `descriptor is missing or invalid in providers[${i}].items[${j}].xinput.head`
      }

      if (
        !index ||
        typeof index !== 'object' ||
        typeof index.min !== 'number' ||
        typeof index.cur !== 'number' ||
        typeof index.max !== 'number'
      ) {
        errors[
          `prvdr${i}item${j}_xinput_head_index`
        ] = `index is missing or invalid in providers[${i}].items[${j}].xinput.head`
      } else if (index.cur < index.min || index.cur > index.max) {
        errors[
          `prvdr${i}item${j}_xinput_head_index`
        ] = `cur should be between min and max in providers[${i}].items[${j}].xinput.head.index`
      }

      const loanType: any = getValue(`LoanType`)
      if (loanType && action) {
        const formHeading: any = getFormHeading(action, loanType)

        if (!headings || !Array.isArray(headings) || formHeading.length !== index.max + 1) {
          errors[`prvdr${i}item${j}_xinput_head_index`] = `max value should be ${
            formHeading?.length - 1
          } in providers[${i}].items[${j}].xinput.head`
        }
        // headings?.forEach((heading: string) => {
        //   if (!formHeading.includes(heading))``
        //     errors[
        //       `prvdr${i}item${j}_xinput_head_headings`
        //     ] = `Form headings array must only contain headings as defined in Api contract`
        // })
      }
    }

    if (!form || typeof form !== 'object') {
      errors[`prvdr${i}item${j}_xinput_form`] = `form is missing or not an object in providers[${i}].items[${j}].xinput`
    } else {
      const url = form.url
      const id = form.id

      if (!url || typeof url !== 'string' || !isValidUrl(url)) {
        errors[
          `prvdr${i}item${j}_xinput_form_url`
        ] = `url is missing, not a string, or not a valid URL in providers[${i}].items[${j}].xinput.form`
      }

      if (!id || typeof id !== 'string') {
        errors[
          `prvdr${i}item${j}_xinput_form_id`
        ] = `id is missing or not a string in providers[${i}].items[${j}].xinput.form`
      } else {
        setValue('formId', id)
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
      if (curentCall.startsWith('on_')) {
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
