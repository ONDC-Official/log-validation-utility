import { getValue } from '../../../shared/dao'
import { formHeadingsFis } from '../../../constants/'

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

  const loanType: any = getValue(`LoanType`)

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

      if (!headings || !Array.isArray(headings) || headings.length !== index.max + 1) {
        errors[
          `prvdr${i}item${j}_xinput_head_headings`
        ] = `headings array should be of size max + 1 in providers[${i}].items[${j}].xinput.head`
      }

      if (loanType && action) {
        const formHeading: any = getFormHeading(action, loanType)
        headings?.forEach((heading: string) => {
          if (!formHeading.includes(heading))
            errors[
              `prvdr${i}item${j}_xinput_head_headings`
            ] = `Form headings array must only contain headings as defined in Api contract`
        })
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
