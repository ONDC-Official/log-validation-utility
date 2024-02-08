/* eslint-disable no-prototype-builtins */

import { isValidEmail, isValidPhoneNumber, isValidUrl } from '../../index'

interface Tag {
  display: any
  descriptor: {
    code: string
  }
  list: {
    descriptor: {
      code: string
    }
    value: any
  }[]
}

interface ValidationResult {
  isValid: boolean
  errors?: string[]
}

export const validatePaymentTags = (tags: Tag[]): ValidationResult => {
  const errors: string[] = []

  const validDescriptorCodes = ['BUYER_FINDER_FEES', 'SETTLEMENT_TERMS']

  tags.forEach((tag, index) => {
    if (!validDescriptorCodes.includes(tag.descriptor.code)) {
      errors.push(`Tag[${index}] has an invalid descriptor code`)
      return
    }

    if (tag.display !== undefined && typeof tag.display !== 'boolean') {
      errors.push(`Tag[${index}] has an invalid value for the 'display' property. It should be a boolean.`)
    }

    switch (tag.descriptor.code) {
      case 'BUYER_FINDER_FEES': {
        const expectedDescriptorCodes = ['BUYER_FINDER_FEES_PERCENTAGE', 'BUYER_FINDER_FEES_TYPE']

        const actualDescriptorCodes = tag.list.map((item: any) => item.descriptor.code)

        const invalidDescriptorCodes = actualDescriptorCodes.filter((code) => !expectedDescriptorCodes.includes(code))
        if (invalidDescriptorCodes.length > 0) {
          errors.push(`Tag[${index}] has unexpected descriptor codes: ${invalidDescriptorCodes.join(', ')}`)
        }

        const buyerFinderFeesType: any = tag.list.find((item: any) => item.descriptor.code === 'BUYER_FINDER_FEES_TYPE')
        const buyerFinderFeesPercentage = tag.list.find(
          (item) => item.descriptor.code === 'BUYER_FINDER_FEES_PERCENTAGE',
        )

        if (!buyerFinderFeesType || buyerFinderFeesType.value !== 'percent-annualized') {
          errors.push(`BUYER_FINDER_FEES_[${index}], BUYER_FINDER_FEES_PERCENTAGE must be 'percent-annualized'`)
        }

        if (!buyerFinderFeesPercentage || !/^[+-]?\d+(\.\d+)?$/.test(buyerFinderFeesPercentage.value)) {
          errors.push(`BUYER_FINDER_FEES_[${index}], BUYER_FINDER_FEES_PERCENTAGE must be a valid integer`)
        }

        break
      }

      case 'SETTLEMENT_TERMS': {
        tag.list.forEach((item: any, itemIndex) => {
          switch (item.descriptor.code) {
            case 'SETTLEMENT_WINDOW':
              if (!/^PT\d+[MH]$/.test(item.value)) {
                errors.push(`SETTLEMENT_TERMS_[${index}], List item[${itemIndex}] has an invalid duration value`)
              }

              break
            case 'SETTLEMENT_BASIS':
              if (item.value.toUpperCase() !== 'INVOICE_RECEIPT') {
                errors.push(
                  `SETTLEMENT_TERMS_[${index}], List item[${itemIndex}] has an invalid value for SETTLEMENT_BASIS`,
                )
              }

              break
            case 'MANDATORY_ARBITRATION':
              if (!['TRUE', 'FALSE'].includes(item.value.toUpperCase())) {
                errors.push(
                  `SETTLEMENT_TERMS_[${index}], List item[${itemIndex}] has an invalid value for MANDATORY_ARBITRATION`,
                )
              }

              break
            case 'COURT_JURISDICTION':
              if (typeof item.value !== 'string') {
                errors.push(`SETTLEMENT_TERMS_[${index}], List item[${itemIndex}] type should be string`)
              }

              break
            case 'STATIC_TERMS':
              if (typeof item.value !== 'string') {
                errors.push(`SETTLEMENT_TERMS_[${index}], List item[${itemIndex}] has an invalid URL for STATIC_TERMS`)
              }

              break
            case 'SETTLEMENT_TYPE':
              if (!['neft', 'upi', 'rtgs']?.includes(item?.value)) {
                errors.push(
                  `SETTLEMENT_TERMS_[${index}], List item[${itemIndex}] has an invalid value for SETTLEMENT_TYPE`,
                )
              }

              break
            case 'SETTLEMENT_AMOUNT':
              if (!/^\d+(\.\d+)?$/.test(item.value)) {
                errors.push(
                  `SETTLEMENT_TERMS_[${index}], List item[${itemIndex}] has an invalid value for SETTLEMENT_AMOUNT`,
                )
              }

              break

            case 'DELAY_INTEREST':
              if (!/^\d+(\.\d+)?$/.test(item.value)) {
                errors.push(
                  `SETTLEMENT_TERMS_[${index}], List item[${itemIndex}] has an invalid value for DELAY_INTEREST`,
                )
              }

              break

            default:
              errors.push(`SETTLEMENT_TERMS_[${index}], List item[${itemIndex}] has an invalid descriptor code`)
          }
        })

        break
      }
    }
  })

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  }
}

export const validateProviderTags = (tags: Tag[]): ValidationResult => {
  const errors: string[] = []

  const validDescriptorCodes = ['CONTACT_INFO', 'LSP_INFO']

  tags.forEach((tag, index) => {
    if (!validDescriptorCodes.includes(tag.descriptor.code)) {
      errors.push(`Tag[${index}] has an invalid descriptor code`)
      return
    }

    if (tag.display !== undefined && typeof tag.display !== 'boolean') {
      errors.push(`Tag[${index}] has an invalid value for the 'display' property. It should be a boolean.`)
    }

    switch (tag.descriptor.code) {
      case 'CONTACT_INFO': {
        tag.list.forEach((item: any, itemIndex) => {
          switch (item.descriptor.code) {
            case 'GRO_NAME':
              if (typeof item.value !== 'string' || item.value.trim() === '') {
                errors.push(
                  `${item.descriptor.name} in Tag[${index}], List item[${itemIndex}] must be a non-empty string`,
                )
              }

              break

            case 'GRO_EMAIL':
              if (!isValidEmail(item.value)) {
                errors.push(
                  `${item.descriptor.name} in Tag[${index}], List item[${itemIndex}] must be a valid email address`,
                )
              }

              break

            case 'GRO_CONTACT_NUMBER':
              if (!isValidPhoneNumber(item.value)) {
                errors.push(
                  `${item.descriptor.name} in Tag[${index}], List item[${itemIndex}] must be a valid 10-digit phone number`,
                )
              }

              break

            case 'CUSTOMER_SUPPORT_LINK':
              if (!isValidUrl(item.value)) {
                errors.push(`${item.descriptor.name} in Tag[${index}], List item[${itemIndex}] must be a valid URL`)
              }

              break

            case 'CUSTOMER_SUPPORT_EMAIL':
              if (!isValidEmail(item.value)) {
                errors.push(
                  `${item.descriptor.name} in Tag[${index}], List item[${itemIndex}] must be a valid email address`,
                )
              }

              break

            case 'CUSTOMER_SUPPORT_CONTACT_NUMBER':
              if (!isValidPhoneNumber(item.value)) {
                errors.push(
                  `${
                    item.descriptor.name
                  } in Tag[${index}], List item[${itemIndex}] must be a valid 10-digit phone number ${item.value
                    ?.replace(/\s+/g, ' ')
                    .trim()}`,
                )
              }

              break
          }
        })

        break
      }

      case 'LSP_INFO':
        tag.list.forEach((item: any, itemIndex) => {
          switch (item.descriptor.code) {
            case 'LSP_NAME':
              if (typeof item.value !== 'string' || item.value.trim() === '') {
                errors.push(`Tag[${index}], List item[${itemIndex}] has an invalid or empty value for LSP_NAME`)
              }

              break
            case 'LSP_EMAIL':
              if (!isValidEmail(item.value)) {
                errors.push(`Tag[${index}], List item[${itemIndex}] has an invalid email for LSP_EMAIL`)
              }

              break
            case 'LSP_CONTACT_NUMBER':
              if (!isValidPhoneNumber(item.value)) {
                errors.push(`Tag[${index}], List item[${itemIndex}] has an invalid phone number for LSP_CONTACT_NUMBER`)
              }

              break
            case 'LSP_ADDRESS':
              if (typeof item.value !== 'string' || item.value.trim() === '') {
                errors.push(`Tag[${index}], List item[${itemIndex}] has an invalid or empty value for LSP_ADDRESS`)
              }

              break
            default:
              errors.push(`Tag[${index}], List item[${itemIndex}] has an unexpected descriptor code`)
          }
        })

        break
    }
  })

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  }
}

export const validateItemsTags = (tags: Tag[]): ValidationResult => {
  const errors: string[] = []

  tags.forEach((tag, index) => {
    if (tag.display !== undefined && typeof tag.display !== 'boolean') {
      errors.push(`Tag[${index}] has an invalid value for the 'display' property. It should be a boolean.`)
    }

    switch (tag.descriptor.code) {
      case 'GENERAL_INFO': {
        let minInterestRate: number | undefined
        let maxInterestRate: number | undefined
        let minTenure: number | undefined
        let maxTenure: number | undefined
        let minLoanAmount: number | undefined
        let maxLoanAmount: number | undefined

        tag.list.forEach((item: any, itemIndex) => {
          switch (item.descriptor.code) {
            case 'MIN_INTEREST_RATE':
              minInterestRate = parseFloat(item.value)
              if (isNaN(minInterestRate) || minInterestRate < 0) {
                errors.push(
                  `${item.descriptor.name} in Tag[${index}], List item[${itemIndex}] must be a valid non-negative interest rate (e.g., "9%")`,
                )
              }

              break

            case 'MAX_INTEREST_RATE':
              maxInterestRate = parseFloat(item.value)
              if (isNaN(maxInterestRate) || maxInterestRate < 0) {
                errors.push(
                  `${item.descriptor.name} in Tag[${index}], List item[${itemIndex}] must be a valid non-negative interest rate (e.g., "15%")`,
                )
              }

              break

            case 'MIN_TENURE':
              minTenure = parseInt(item.value, 10)
              if (isNaN(minTenure) || minTenure < 0) {
                errors.push(
                  `${item.descriptor.name} in Tag[${index}], List item[${itemIndex}] must be a valid non-negative integer representing tenure (e.g., "5 months")`,
                )
              }

              break

            case 'MAX_TENURE':
              maxTenure = parseInt(item.value, 10)
              if (isNaN(maxTenure) || maxTenure < 0) {
                errors.push(
                  `${item.descriptor.name} in Tag[${index}], List item[${itemIndex}] must be a valid non-negative integer representing tenure (e.g., "5 years")`,
                )
              }

              break

            case 'MIN_LOAN_AMOUNT':
              minLoanAmount = parseInt(item.value, 10)
              if (isNaN(minLoanAmount) || minLoanAmount < 0) {
                errors.push(
                  `${item.descriptor.name} in Tag[${index}], List item[${itemIndex}] must be a valid non-negative integer representing loan amount (e.g., "50000")`,
                )
              }

              break

            case 'MAX_LOAN_AMOUNT':
              maxLoanAmount = parseInt(item.value, 10)
              if (isNaN(maxLoanAmount) || maxLoanAmount < 0) {
                errors.push(
                  `${item.descriptor.name} in Tag[${index}], List item[${itemIndex}] must be a valid non-negative integer representing loan amount (e.g., "5000000")`,
                )
              }

              break
          }
        })

        if (minInterestRate !== undefined && maxInterestRate !== undefined && minInterestRate > maxInterestRate) {
          errors.push(`Minimum interest rate must be less than or equal to the maximum interest rate in Tag[${index}]`)
        }

        if (minTenure !== undefined && maxTenure !== undefined && minTenure > maxTenure) {
          errors.push(`Minimum tenure must be less than or equal to the maximum tenure in Tag[${index}]`)
        }

        if (minLoanAmount !== undefined && maxLoanAmount !== undefined && minLoanAmount > maxLoanAmount) {
          errors.push(`Minimum loan amount must be less than or equal to the maximum loan amount in Tag[${index}]`)
        }

        break
      }
    }
  })

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  }
}
