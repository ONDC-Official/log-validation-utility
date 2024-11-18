/* eslint-disable no-prototype-builtins */
import { isValidUrl } from '../../index'
import { logger } from '../../../shared/logger'
import { isEmpty } from 'lodash'
import { getValue, setValue } from '../../../shared/dao'

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

export const validatePaymentTags = (tags: Tag[], terms: any): ValidationResult => {
  const errors: string[] = []
  try {
    if (!tags) {
      errors.push(`payments.tags are empty or missing.`)
    } else {
      const validDescriptorCodes = ['BUYER_FINDER_FEES', 'SETTLEMENT_TERMS']

      // check missing tag-groups
      validDescriptorCodes.forEach((code) => {
        if (!tags.some((tag) => tag?.descriptor?.code === code)) {
          errors.push(`Tag-group ${code} is missing in payments`)
        }
      })

      tags.forEach((tag, index) => {
        if (!validDescriptorCodes.includes(tag?.descriptor?.code)) {
          errors.push(`Tag[${index}] has an invalid descriptor code`)
          //skip if invalid code is present
          return
        }

        if (tag?.display && typeof tag.display !== 'boolean') {
          errors.push(`Tag[${index}] is missing or has an invalid type, should be a boolean`)
        }

        switch (tag?.descriptor?.code) {
          case 'BUYER_FINDER_FEES': {
            if (!tag?.list || isEmpty(tag?.list)) {
              errors.push(`BUYER_FINDER_FEES tag.list is missing or empty`)
            } else {
              const expectedDescriptorCodes = ['BUYER_FINDER_FEES_PERCENTAGE', 'BUYER_FINDER_FEES_TYPE']
              const actualDescriptorCodes = tag.list.map((item: any) => item.descriptor.code)
              const invalidDescriptorCodes = actualDescriptorCodes.filter(
                (code) => !expectedDescriptorCodes.includes(code),
              )

              if (!actualDescriptorCodes.includes('BUYER_FINDER_FEES_PERCENTAGE')) {
                errors.push(`tag BUYER_FINDER_FEES_PERCENTAGE is missing in BUYER_FINDER_FEES tag-group`)
              }

              if (!actualDescriptorCodes.includes('BUYER_FINDER_FEES_TYPE')) {
                errors.push(`tag BUYER_FINDER_FEES_TYPE is missing in BUYER_FINDER_FEES tag-group`)
              }

              const buyerFinderFeesType: any = tag.list.find(
                (item: any) => item.descriptor.code === 'BUYER_FINDER_FEES_TYPE',
              )

              if (!buyerFinderFeesType || !buyerFinderFeesType?.value) {
                errors.push(`BUYER_FINDER_FEES_[${index}], tag BUYER_FINDER_FEES_TYPE value is missing `)
              } else if (buyerFinderFeesType?.value !== 'percent-annualized') {
                errors.push(`BUYER_FINDER_FEES_[${index}], BUYER_FINDER_FEES_TYPE must be 'percent-annualized'`)
              }

              const buyerFinderFeesPercentage: any = tag?.list.find(
                (item) => item.descriptor.code === 'BUYER_FINDER_FEES_PERCENTAGE',
              )

              if (!buyerFinderFeesPercentage || !buyerFinderFeesPercentage?.value) {
                errors.push(`BUYER_FINDER_FEES_[${index}], tag BUYER_FINDER_FEES_PERCENTAGE value is missing`)
              } else if (!/^[+-]?\d+(\.\d+)?$/.test(buyerFinderFeesPercentage.value)) {
                errors.push(`BUYER_FINDER_FEES_[${index}], BUYER_FINDER_FEES_PERCENTAGE must be a valid integer`)
              }

              if (invalidDescriptorCodes.length > 0) {
                errors.push(`Tag[${index}] has unexpected descriptor codes: ${invalidDescriptorCodes.join(', ')}`)
              }
            }

            break
          }

          case 'SETTLEMENT_TERMS': {
            if (!tag?.list) {
              errors.push(`SETTLEMENT_TERMS tag.list is missing or empty`)
            } else {
              const termCodesInTag = tag?.list?.map((item: any) => item?.descriptor?.code)

              // missing tags
              terms.forEach((term: any) => {
                if (!termCodesInTag?.includes(term.code)) {
                  errors.push(`SETTLEMENT_TERMS_[${index}], Term code '${term.code}' is not present in tag.list`)
                }
              })

              tag?.list?.forEach((item: any, itemIndex) => {
                const code = item?.descriptor?.code
                const value = item.value
                if (!code) {
                  errors.push(`SETTLEMENT_TERMS_[${index}], descriptor.code is missing at List item[${itemIndex}]`)
                } else if (!value) {
                  errors.push(`SETTLEMENT_TERMS_[${index}], value is missing at List item[${itemIndex}]`)
                } else {
                  switch (code) {
                    case terms.find((term: any) => term.code === code)?.code: {
                      const termDefinition: any = terms.find((term: any) => term.code === code)

                      switch (termDefinition?.type) {
                        case 'time':
                          if (!/^PT\d+[MH]$/.test(item.value)) {
                            errors.push(
                              `SETTLEMENT_TERMS_[${index}], List item[${itemIndex}] has an invalid duration value for ${termDefinition.code}`,
                            )
                          }

                          break

                        case 'enum':
                          if (!termDefinition?.value.includes(item.value)) {
                            errors.push(
                              `SETTLEMENT_TERMS_[${index}], List item[${itemIndex}] has an invalid value for ${termDefinition.code}`,
                            )
                          }

                          break

                        case 'amount':
                          if (!/^\d+(\.\d+)?$/.test(item.value)) {
                            errors.push(
                              `SETTLEMENT_TERMS_[${index}], List item[${itemIndex}] has an invalid value for ${termDefinition.code}`,
                            )
                          } else {
                            const savedAmount = getValue(termDefinition.code)
                            if (!savedAmount) setValue(termDefinition.code, item.value)
                            else if (savedAmount && savedAmount != item.value) {
                              errors.push(
                                `SETTLEMENT_TERMS_[${index}], Tag ${termDefinition.code} value mismatch between current:${item.value} & past call:${savedAmount}`,
                              )
                              setValue(termDefinition.code, item.value)
                            }
                          }

                          break

                        case 'boolean':
                          if (!['TRUE', 'FALSE'].includes(item.value.toUpperCase())) {
                            errors.push(
                              `SETTLEMENT_TERMS_[${index}], List item[${itemIndex}] has an invalid value for ${termDefinition.code}, should be a boolean`,
                            )
                          }

                          break

                        case 'url': {
                          if (typeof item.value !== 'string' || !isValidUrl(item.value)) {
                            errors.push(
                              `SETTLEMENT_TERMS_[${index}], List item[${itemIndex}] has an invalid URL for ${termDefinition.code}`,
                            )
                          }

                          break
                        }

                        case 'string':
                          if (typeof item.value !== 'string') {
                            errors.push(`SETTLEMENT_TERMS_[${index}], List item[${itemIndex}] type should be string`)
                          }

                          break

                        default:
                          errors.push(`SETTLEMENT_TERMS_[${index}], List item[${itemIndex}] has an invalid type`)
                      }

                      break
                    }

                    default:
                      errors.push(
                        `tag: ${item?.descriptor?.code} should not be part of SETTLEMENT_TERMS tag-group at index [${index}]`,
                      )
                  }
                }
              })
            }

            break
          }
        }
      })
    }
  } catch (error) {
    console.log('error', error)
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  }
}

export const validateProviderTags = (tags: Tag[]): any => {
  try {
    logger.info(`Checking tags for providers`)
    const errors: string[] = []

    if (!tags || tags.length === 0) {
      errors.push('provider.tags are missing')
      return {
        isValid: false,
        errors,
      }
    }

    const validDescriptorCodes = ['CONTACT_INFO', 'LSP_INFO']

    tags?.forEach((tag, index) => {
      if (!validDescriptorCodes.includes(tag?.descriptor?.code)) {
        errors.push(`Tag[${index}] has an invalid descriptor code`)
        return
      }

      if (!tag?.display) {
        errors.push(`Tag[${index}].display is missing`)
      }

      // switch (tag?.descriptor?.code) {
      //   case 'CONTACT_INFO': {
      //     const validContactListCodes = [
      //       'GRO_NAME',
      //       'GRO_EMAIL',
      //       'GRO_CONTACT_NUMBER',
      //       'CUSTOMER_SUPPORT_CONTACT_NUMBER',
      //       'GRO_DESIGNATION',
      //       'GRO_ADDRESS',
      //       'CUSTOMER_SUPPORT_LINK',
      //       'CUSTOMER_SUPPORT_EMAIL',
      //     ]

      //     tag.list.forEach((item: any, itemIndex) => {
      //       if (!item.descriptor.code || !item.value) {
      //         errors.push(
      //           `List item at index ${itemIndex} within CONTACT_INFO tag[${index}] is missing descriptor or value`,
      //         )
      //         return
      //       }

      //       if (!validContactListCodes.includes(item.descriptor.code)) {
      //         errors.push(
      //           `List item descriptor code '${item.descriptor.code}' at index ${itemIndex} within CONTACT_INFO tag[${index}] is invalid`,
      //         )
      //         return
      //       }

      //       switch (item.descriptor.code) {
      //         case 'GRO_NAME':
      //         case 'GRO_DESIGNATION':
      //         case 'GRO_ADDRESS':
      //           if (typeof item.value !== 'string' || item.value.trim() === '') {
      //             errors.push(
      //               `${item.descriptor.name} in CONTACT_INFO tag[${index}], List item[${itemIndex}] must be a non-empty string`,
      //             )
      //           }

      //           break

      //         case 'GRO_EMAIL':
      //         case 'CUSTOMER_SUPPORT_EMAIL':
      //           if (!isValidEmail(item.value)) {
      //             errors.push(
      //               `${item.descriptor.name} in CONTACT_INFO tag[${index}], List item[${itemIndex}] must be a valid email address`,
      //             )
      //           }

      //           break

      //         case 'GRO_CONTACT_NUMBER':
      //         case 'CUSTOMER_SUPPORT_CONTACT_NUMBER':
      //           if (!isValidPhoneNumber(item.value)) {
      //             errors.push(
      //               `${item.descriptor.name} in CONTACT_INFO tag[${index}], List item[${itemIndex}] must be a valid 10-digit phone number`,
      //             )
      //           }

      //           break

      //         case 'CUSTOMER_SUPPORT_LINK':
      //           if (!isValidUrl(item.value)) {
      //             errors.push(
      //               `${item.descriptor.name} in CONTACT_INFO tag[${index}], List item[${itemIndex}] must be a valid URL`,
      //             )
      //           }

      //           break

      //         default:
      //           break
      //       }
      //     })
      //     break
      //   }

      //   case 'LSP_INFO': {
      //     const validLspListCodes = ['LSP_NAME', 'LSP_EMAIL', 'LSP_CONTACT_NUMBER', 'LSP_ADDRESS']

      //     tag.list.forEach((item: any, itemIndex) => {
      //       if (!item.descriptor.code || !item.value) {
      //         errors.push(
      //           `List item at index ${itemIndex} within LSP_INFO tag[${index}] is missing descriptor or value`,
      //         )
      //         return
      //       }

      //       if (!validLspListCodes.includes(item.descriptor.code)) {
      //         errors.push(
      //           `List item descriptor code '${item.descriptor.code}' at index ${itemIndex} within LSP_INFO tag[${index}] is invalid`,
      //         )
      //         return
      //       }

      //       switch (item.descriptor.code) {
      //         case 'LSP_NAME':
      //         case 'LSP_ADDRESS':
      //           if (typeof item.value !== 'string' || item.value.trim() === '') {
      //             errors.push(
      //               `${item.descriptor.name} in LSP_INFO tag[${index}], List item[${itemIndex}] must be a non-empty string`,
      //             )
      //           }

      //           break

      //         case 'LSP_EMAIL':
      //           if (!isValidEmail(item.value)) {
      //             errors.push(
      //               `${item.descriptor.name} in LSP_INFO tag[${index}], List item[${itemIndex}] must be a valid email address`,
      //             )
      //           }

      //           break

      //         case 'LSP_CONTACT_NUMBER':
      //           if (!isValidPhoneNumber(item.value)) {
      //             errors.push(
      //               `${item.descriptor.name} in LSP_INFO tag[${index}], List item[${itemIndex}] must be a valid 10-digit phone number`,
      //             )
      //           }

      //           break

      //         default:
      //           break
      //       }
      //     })
      //     break
      //   }
      // }
    })

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    }
  } catch (error: any) {
    logger.error(`!!Error while checking Providers info in , ${error.stack}`)
    return { error: error.message }
  }
}

export const validateItemsTags = (tags: Tag[]): ValidationResult => {
  const errors: string[] = []

  tags.forEach((tag, index) => {
    if (tag.display !== undefined && typeof tag.display !== 'boolean') {
      errors.push(`Tag[${index}] has an invalid value for the 'display' property. It should be a boolean.`)
    }

    switch (tag?.descriptor?.code) {
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

      case 'CONSENT_INFO':
        {
          tag.list.forEach((item: any, itemIndex) => {
            switch (item.descriptor.code) {
              case 'CONSENT_HANDLER':
                if (typeof item.value !== 'string') {
                  errors.push(`CONSENT_INFO_[${index}], List item[${itemIndex}] type should be string`)
                }

                break
            }
          })
        }

        break

      default:
        errors.push(`incorrect tag group ${tag?.descriptor?.code}`)
        break
    }
  })

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  }
}

export const validateLoanInfoTags = (tags: Tag[], flag: string): ValidationResult => {
  const errors: string[] = []

  if (!tags || tags.length === 0) {
    errors.push('Tags array must have a minimum length of 1')
    return {
      isValid: false,
      errors,
    }
  }

  tags.forEach((tag, index) => {
    if (!tag?.descriptor?.code || !tag.list) {
      errors.push(`Tag at index ${index} is missing descriptor or list`)
      return
    }

    if (tag?.descriptor?.code !== 'LOAN_INFO') {
      errors.push(`Tag at index ${index} has an invalid descriptor code. It should be 'LOAN_INFO'`)
    }

    let validListCodes = [
      'INTEREST_RATE',
      'TERM',
      'INTEREST_RATE_TYPE',
      'APPLICATION_FEE',
      'FORECLOSURE_FEE',
      'INTEREST_RATE_CONVERSION_CHARGE',
      'DELAY_PENALTY_FEE',
      'OTHER_PENALTY_FEE',
      'TNC_LINK',
    ]

    if (flag === 'PERSONAL_LOAN') {
      validListCodes = validListCodes.concat([
        'ANNUAL_PERCENTAGE_RATE',
        'REPAYMENT_FREQUENCY',
        'NUMBER_OF_INSTALLMENTS_OF_REPAYMENT',
        'INSTALLMENT_AMOUNT',
        'COOL_OFF_PERIOD',
      ])
    }

    tag.list.forEach((item, itemIndex) => {
      if (!item.descriptor.code || !item.value) {
        errors.push(`List item at index ${itemIndex} within tag ${index} is missing descriptor or value`)
        return
      }

      if (!validListCodes.includes(item.descriptor.code)) {
        errors.push(
          `List item descriptor code '${item.descriptor.code}' at index ${itemIndex} within tag ${index} is invalid`,
        )
      }

      switch (item.descriptor.code) {
        case 'INTEREST_RATE':
        case 'FORECLOSURE_FEE':
        case 'DELAY_PENALTY_FEE':
        case 'OTHER_PENALTY_FEE':
        case 'ANNUAL_PERCENTAGE_RATE':
          if (!/^\d+(\.\d+)?\s*.*$/.test(item.value) || parseFloat(item.value) < 0) {
            errors.push(
              `Value for '${item.descriptor.code}' at index ${itemIndex} within tag ${index} must be a valid percentage`,
            )
          }

          break
        case 'TERM':
        case 'APPLICATION_FEE':
        case 'INSTALLMENT_AMOUNT':
        case 'INTEREST_RATE_CONVERSION_CHARGE':
        case 'NUMBER_OF_INSTALLMENTS_OF_REPAYMENT':
          if (!/^\d+(\.\d+)?\s*.*$/.test(item.value) || parseFloat(item.value) < 0) {
            errors.push(
              `Value for '${item.descriptor.code}' at index ${itemIndex} within tag ${index} must be a positive number`,
            )
          }

          break

        case 'COOL_OFF_PERIOD': {
          if (!/^PT(\d+D)?(\d+H)?(\d+M)?(\d+S)?$/.test(item.value)) {
            errors.push(
              `Value for '${item.descriptor.code}' at index ${itemIndex} within tag ${index} must be in ISO 8601 duration format`,
            )
          }

          break
        }

        case 'TNC_LINK':
          if (!isValidUrl(item.value)) {
            errors.push(`Value for 'TNC_LINK' at index ${itemIndex} within tag ${index} must be a valid URL`)
          }

          break

        case 'INTEREST_RATE_TYPE':
        case 'REPAYMENT_FREQUENCY':
          if (typeof item.value !== 'string' || item.value.trim() === '') {
            errors.push(
              `Value for '${item.descriptor.code}' at index ${itemIndex} within tag ${index} must be a non-empty string`,
            )
          }

          break
        default:
          errors.push(`invalid list code ${item.descriptor.code}`)
          break
      }
    })
  })

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  }
}

export const validateLoanTags = (tags: any, sequence: any) => {
  const errors: string[] = []
  let tagGroupCode = 'LOAN_INFO'
  // const LoanType = getValue('LoanType')
  // PERSONAL-> on_search-> GENERAL_INFO  rest on_actions -> LOAN_INFO

  const parentItemDescriptor: any = {
    MIN_INTEREST_RATE: (value: string) => /\d+(\.\d+)?%/.test(value),
    MAX_INTEREST_RATE: (value: string) => /\d+(\.\d+)?%/.test(value),
    MIN_TENURE: (value: string) => /\d+\s+(months?|years?)/i.test(value),
    MAX_TENURE: (value: string) => /\d+\s+(months?|years?)/i.test(value),
    MIN_LOAN_AMOUNT: (value: string) => /^[0-9]+$/.test(value),
    MAX_LOAN_AMOUNT: (value: string) => /^[0-9]+$/.test(value),
  }

  const childItemDescriptor: any = {
    INTEREST_RATE: (value: string) => /\d+(\.\d+)?%/.test(value), // Matches values like "12%" or "12.5%"
    TERM: (value: string) => /\d+\s+(months?|years?)/i.test(value), // Matches "5 months", "2 years"
    INTEREST_RATE_TYPE: (value: string) => value === 'FIXED' || value === 'FLOATING',
    APPLICATION_FEE: (value: string) => /^[0-9]+(\sINR)?$/.test(value), // Matches "1000 INR" or "1000"
    FORECLOSURE_FEE: (value: string) => /\d+(\.\d+)?%/.test(value), // Matches values like "0.5%" or "1.5%"
    INTEREST_RATE_CONVERSION_CHARGE: (value: string) => value === 'NA' || /^[0-9]+(\sINR)?$/.test(value),
    DELAY_PENALTY_FEE: (value: string) => /\d+(\.\d+)?%/.test(value), // Matches percentage values like "5%"
    OTHER_PENALTY_FEE: (value: string) => /\d+(\.\d+)?%/.test(value), // Matches percentage values like "1%"
    TNC_LINK: (value: string) => /^https?:\/\/.+/.test(value), // Validates URLs
    PRINCIPAL: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) > 0, // Numeric validation
    INTEREST: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
    PROCESSING_FEE: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
    OTHER_CHARGES: (value: string) => !isNaN(parseFloat(value)),
    OFFER_VALIDITY: (value: string) => /^P(T?\d+H?M?D?)$/.test(value), // ISO 8601 duration format
    INVOICE_NUMBER: (value: string) => typeof value === 'string' && value.length > 0, // Invoice should be a non-empty string
    INSTALLMENT_AMOUNT: (value: string) => /^[0-9]+\sINR$/.test(value), // Matches "46360 INR"
    OTHER_UPFRONT_CHARGES: (value: string) => /^[0-9]+\sINR$/.test(value), // Matches "0 INR" or similar
    NET_DISBURSED_AMOUNT: (value: string) => /^[0-9]+\sINR$/.test(value),
    ANNUAL_PERCENTAGE_RATE: (value: string) => /\d+(\.\d+)?%/.test(value), // Matches "5%"
    COOL_OFF_PERIOD: (value: string) => /^P\d+D$/.test(value), // ISO 8601 for periods like "P30D"
    REPAYMENT_FREQUENCY: (value: string) => /^P\d+[MD]$/.test(value), // ISO 8601 format for "P1M"
    NUMBER_OF_INSTALLMENTS_OF_REPAYMENT: (value: string) => Number.isInteger(parseInt(value)),
    INSURANCE_CHARGES: (value: string) => /^[0-9]+\sINR$/.test(value),
    KFS_LINK: (value: string) => /^https?:\/\/.+/.test(value), // Validates URLs
  }

  let loanDescriptors: any
  if (sequence === 'on_search' || sequence === 'on_search_2') {
    loanDescriptors = parentItemDescriptor
    tagGroupCode = 'GENERAL_INFO'
  } else loanDescriptors = childItemDescriptor

  const descriptorCodesSet = new Set(tags.flatMap((tag: any) => tag.list?.map((item: any) => item.descriptor?.code)))

  Object.keys(loanDescriptors).forEach((requiredCode) => {
    if (!descriptorCodesSet.has(requiredCode)) {
      errors.push(`Missing required descriptor code: '${requiredCode}'.`)
    }
  })

  if (!tags || isEmpty(tags)) {
    errors.push(`Tags is empty or missing`)
  } else {
    tags.forEach((tag: any, tagIndex: number) => {
      if (!tag.descriptor) {
        errors.push(`Tag[${tagIndex}] is missing required descriptor`)
      } else if (!tag?.descriptor?.code) {
        errors.push(`descriptor.code is missing at Tag[${tagIndex}]`)
      } else if (tag?.descriptor?.code !== tagGroupCode) {
        errors.push(`descriptor.code value should be equal to ${tagGroupCode} at Tag[${tagIndex}]`)
      }

      if (!tag?.list || isEmpty(tag?.list)) {
        errors.push(`Tag[${tagIndex}] has an missing or empty list.`)
      } else {
        tag.list.forEach((item: any, itemIndex: number) => {
          const descriptorCode = item.descriptor?.code
          const descriptorName = item.descriptor?.name
          const value = item?.value

          if (!descriptorCode || !descriptorName) {
            errors.push(`Tag[${tagIndex}] -> List[${itemIndex}] is missing required descriptor fields (code or name).`)
            return
          }

          if (!(descriptorCode in loanDescriptors)) {
            errors.push(`Tag[${tagIndex}] -> List[${itemIndex}] has an unknown descriptor code: '${descriptorCode}'.`)
          } else {
            const validateValue = loanDescriptors[descriptorCode]
            if (!value) {
              errors.push(
                `Tag[${tagIndex}] -> value is missing at List[${itemIndex}] for descriptor code '${descriptorCode}'.`,
              )
            } else if (!validateValue(value)) {
              errors.push(
                `Tag[${tagIndex}] -> List[${itemIndex}] has an invalid value '${value}' for descriptor code '${descriptorCode}'.`,
              )
            }
          }
        })
      }
    })
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  }
}
