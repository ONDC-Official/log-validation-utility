import { isArray } from 'lodash'
import { getValue } from '../../../shared/dao'
import { isValidEmail, isValidPhoneNumber, isValidUrl } from '../../index'
import { FIS13HealthSequence } from '../../../constants'

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
  if (!tags) {
    errors.push(`payments.tags are empty or missing.`)
  } else {
    const validDescriptorCodes = ['BUYER_FINDER_FEES', 'SETTLEMENT_TERMS']

    // check missing tag-groups
    validDescriptorCodes.forEach((code) => {
      if (!tags.some((tag) => tag.descriptor.code === code)) {
        errors.push(`Tag-group ${code} is missing in payments`)
      }
    })

    tags.forEach((tag, index) => {
      if (!validDescriptorCodes.includes(tag.descriptor.code)) {
        errors.push(`Tag[${index}] has an invalid descriptor code`)
        //skip if invalid code is present
        return
      }

      if (tag?.display && typeof tag.display !== 'boolean') {
        errors.push(`Tag[${index}] is missing or has an invalid type, should be a boolean`)
      }

      switch (tag.descriptor.code) {
        case 'BUYER_FINDER_FEES': {
          if (!tag?.list) {
            errors.push(`BUYER_FINDER_FEES tag.list is missing or empty`)
          } else {
            const expectedDescriptorCodes = ['BUYER_FINDER_FEES_PERCENTAGE', 'BUYER_FINDER_FEES_TYPE']
            const actualDescriptorCodes = tag.list.map((item: any) => item.descriptor.code)
            const invalidDescriptorCodes = actualDescriptorCodes.filter(
              (code) => !expectedDescriptorCodes.includes(code),
            )

            console.log(
              'actualDescriptorCodes-------------------',
              actualDescriptorCodes,
              actualDescriptorCodes.includes('BUYER_FINDER_FEES_PERCENTAGE'),
            )

            if (!actualDescriptorCodes.includes('BUYER_FINDER_FEES_PERCENTAGE')) {
              console.log('wejhfiuwerhfervjernvjernv')

              errors.push(`BUYER_FINDER_FEES_PERCENTAGE is missing `)
            }

            console.log('errors------------------------', errors)

            if (!actualDescriptorCodes.includes('BUYER_FINDER_FEES_TYPE')) {
              errors.push(`BUYER_FINDER_FEES_TYPE is missing `)
            }

            if (invalidDescriptorCodes.length > 0) {
              errors.push(`Tag[${index}] has unexpected descriptor codes: ${invalidDescriptorCodes.join(', ')}`)
            }

            const buyerFinderFeesType: any = tag?.list.find(
              (item: any) => item.descriptor.code === 'BUYER_FINDER_FEES_TYPE',
            )
            const buyerFinderFeesPercentage = tag?.list.find(
              (item) => item.descriptor.code === 'BUYER_FINDER_FEES_PERCENTAGE',
            )

            if (buyerFinderFeesType && buyerFinderFeesType.value !== 'percent-annualized') {
              errors.push(`BUYER_FINDER_FEES_[${index}], BUYER_FINDER_FEES_PERCENTAGE must be 'percent-annualized'`)
            }

            if (buyerFinderFeesPercentage && !/^[+-]?\d+(\.\d+)?$/.test(buyerFinderFeesPercentage.value)) {
              errors.push(`BUYER_FINDER_FEES_[${index}], BUYER_FINDER_FEES_PERCENTAGE must be a valid integer`)
            }
          }

          break
        }

        case 'SETTLEMENT_TERMS': {
          if (!tag?.list) {
            errors.push(`SETTLEMENT_TERMS tag.list is missing or empty`)
          } else {
            const termCodesInTag = tag?.list?.map((item: any) => item.descriptor.code)

            // missing tags
            terms.forEach((term: any) => {
              if (!termCodesInTag?.includes(term.code)) {
                errors.push(`SETTLEMENT_TERMS_[${index}], Term code '${term.code}' is not present in tag.list`)
              }
            })

            tag?.list?.forEach((item: any, itemIndex) => {
              const code = item.descriptor.code
              const value = item.value
              if (!code) {
                errors.push(`SETTLEMENT_TERMS_[${index}], code is missing at List item[${itemIndex}]`)
              } else if (!value) {
                errors.push(`SETTLEMENT_TERMS_[${index}], value is missing at List item[${itemIndex}]`)
              } else {
                switch (item.descriptor.code) {
                  case terms.find((term: any) => term.code === item.descriptor.code)?.code: {
                    const termDefinition: any = terms.find((term: any) => term.code === item.descriptor.code)

                    switch (termDefinition?.type) {
                      case 'time':
                        console.log('/^PTd+[MH]$/.test(item.value)', /^PT\d+[MH]$/.test(item.value))
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
                        }

                        break

                      case 'boolean':
                        if (!['TRUE', 'FALSE'].includes(item.value.toUpperCase())) {
                          errors.push(
                            `SETTLEMENT_TERMS_[${index}], List item[${itemIndex}] has an invalid value for ${termDefinition.code}, should be a boolean`,
                          )
                        }

                        break

                      case 'url':
                        if (typeof item.value !== 'string' || !isValidUrl(item.value)) {
                          errors.push(
                            `SETTLEMENT_TERMS_[${index}], List item[${itemIndex}] has an invalid URL for ${termDefinition.code}`,
                          )
                        }

                        break

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

    switch (tag?.descriptor?.code) {
      case 'LOAN_INFO': {
        tag.list.forEach((item: any, itemIndex) => {
          switch (item.descriptor.code) {
            case 'FORECLOSURE_FEE': {
              const ratio = parseFloat(item.value)
              if (isNaN(ratio) || ratio < 0 || ratio > 1) {
                errors.push(
                  `'CLAIM_SETTLEMENT_RATIO' in Tag[${index}], List item[${itemIndex}] must be a valid decimal between 0 and 1.`,
                )
              }

              break
            }

            case 'OTHER_PENALTY_FEE':
            case 'DELAY_PENALTY_FEE':
            case 'INTEREST_RATE_CONVERSION_CHARGE':
            case 'APPLICATION_FEE':
            case 'TERM':
            case 'INTEREST_RATE': {
              const numericValue = parseInt(item.value, 10)
              if (isNaN(numericValue) || numericValue < 0) {
                errors.push(
                  `'${item.descriptor.code}' in Tag[${index}], List item[${itemIndex}] must be a valid non-negative integer.`,
                )
              }

              break
            }

            // case 'INITIAL_WAITING_PERIOD': {
            //   if (item.value.toLowerCase() !== 'true' && item.value.toLowerCase() !== 'false') {
            //     errors.push(
            //       `'${item.descriptor.code}' in Tag[${index}], List item[${itemIndex}] must be a boolean in string.`,
            //     )
            //   }

            //   break
            // }

            // case 'MATERNITY_COVERAGE':
            // case 'INITIAL_WAITING_PERIOD':
            // case 'CO_PAYMENT':
            // case 'RESTORATION_BENEFIT': {
            //   if (item.value.toLowerCase() !== 'no' && item.value.toLowerCase() !== 'yes') {
            //     errors.push(
            //       `'${item.descriptor.code}' in Tag[${index}], List item[${itemIndex}] must be either of yes or no`,
            //     )
            //   }

            //   break
            // }
          }
        })

        break
      }

      case 'GENERAL_INFO': {
        tag.list.forEach((item: any, itemIndex) => {
          switch (item.descriptor.code) {
            case 'FORECLOSURE_FEE': {
              const ratio = parseFloat(item.value)
              if (isNaN(ratio) || ratio < 0 || ratio > 1) {
                errors.push(
                  `'CLAIM_SETTLEMENT_RATIO' in Tag[${index}], List item[${itemIndex}] must be a valid decimal between 0 and 1.`,
                )
              }

              break
            }

            case 'OTHER_PENALTY_FEE':
            case 'DELAY_PENALTY_FEE':
            case 'INTEREST_RATE_CONVERSION_CHARGE':
            case 'APPLICATION_FEE':
            case 'TERM':
            case 'INTEREST_RATE': {
              const numericValue = parseInt(item.value, 10)
              if (isNaN(numericValue) || numericValue < 0) {
                errors.push(
                  `'${item.descriptor.code}' in Tag[${index}], List item[${itemIndex}] must be a valid non-negative integer.`,
                )
              }

              break
            }

            // case 'INITIAL_WAITING_PERIOD': {
            //   if (item.value.toLowerCase() !== 'true' && item.value.toLowerCase() !== 'false') {
            //     errors.push(
            //       `'${item.descriptor.code}' in Tag[${index}], List item[${itemIndex}] must be a boolean in string.`,
            //     )
            //   }

            //   break
            // }

            // case 'MATERNITY_COVERAGE':
            // case 'INITIAL_WAITING_PERIOD':
            // case 'CO_PAYMENT':
            // case 'RESTORATION_BENEFIT': {
            //   if (item.value.toLowerCase() !== 'no' && item.value.toLowerCase() !== 'yes') {
            //     errors.push(
            //       `'${item.descriptor.code}' in Tag[${index}], List item[${itemIndex}] must be either of yes or no`,
            //     )
            //   }

            //   break
            // }
          }
        })

        break
      }

      default:
        errors.push(`code is missing or invalid at Tag[${index}]`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  }
}

export const validateGeneralInfo = (tags: any, action: string) => {
  const errors: string[] = []
  const insuranceType = getValue('insurance')

  const marineDescriptors: any = {
    CO_PAYMENT: (value: string) => value === 'Yes' || value === 'No',
    LIABILITY_COVERAGE: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
    PROTECTION_AND_INDEMNITY: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
    EXTENDED_COVERAGE: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
    DEDUCTIBLES_AND_EXCESS: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
    INSTITUTE_CARGO_CLAUSE: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
  }

  const motorDescriptors: any = {
    PERSONAL_ACCIDENT_COVER: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
    DEPRECIATION_COVER: (value: string) => value === 'Yes' || value === 'No',
    ROAD_SIDE_ASSISTANCE: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
    CONSUMABLES_COVER: (value: string) => value === 'Yes' || value === 'No',
    ELECTRICAL_ACCESSORIES_COVER: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
    NON_ELECTRICAL_ACCESSORIES_COVER: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
    ENGINE_COVER: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
    EXTERNAL_CNG_OR_LPG_COVER: (value: string) => value === 'Yes' || value === 'No',
    KEY_COVER: (value: string) => value === 'Yes' || value === 'No',
    PERSONAL_BAGGAGE_COVER: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
    TYRE_COVER: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
    RETURN_TO_INVOICE: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
    PER_DAY_CASH: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
  }

  let healthDescriptors: any = {
    COVERAGE_AMOUNT: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) > 0,
    CO_PAYMENT: (value: string) => value === 'Yes' || value === 'No',
    ROOM_RENT_CAP: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
    RESTORATION_BENEFIT: (value: string) => value === 'Yes' || value === 'No',
    CLAIM_SETTLEMENT_RATIO: (value: string) =>
      !isNaN(parseFloat(value)) && parseFloat(value) >= 0 && parseFloat(value) <= 1,
    PRE_HOSPITALIZATION_COVERAGE_DAYS: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
    POST_HOSPITALIZATION_COVERAGE_DAYS: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
    MATERNITY_COVERAGE: (value: string) => value === 'Yes' || value === 'No',
    INITIAL_WAITING_PERIOD: (value: string) => value === 'Yes' || value === 'No',
    CASHLESS_HOSPITALS: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
    ROOM_CATEGORY: (value: string) => typeof value === 'string' && value.length > 0,
  }

  const vahanDetailsDescriptors: any = {
    MODEL: (value: string) => typeof value === 'string' && value.trim().length > 0,
    MAKE: (value: string) => typeof value === 'string' && value.trim().length > 0,
    FUEL_TYPE: (value: string) => typeof value === 'string' && value.trim().length > 0,
    VARIANT: (value: string) => typeof value === 'string' && value.trim().length > 0,
    REGISTERED_CITY: (value: string) => typeof value === 'string' && value.trim().length > 0,
    REGISTERED_DATE: (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value), // YYYY-MM-DD format
    CHASSIS_NUMBER: (value: string) => typeof value === 'string' && value.trim().length > 0,
    ENGINE_NUMBER: (value: string) => typeof value === 'string' && value.trim().length > 0,
    PREVIOUS_POLICY_NUMBER: (value: string) => typeof value === 'string' && value.trim().length > 0,
    PREVIOUS_INSURER: (value: string) => typeof value === 'string' && value.trim().length > 0,
    PREVIOUS_POLICY_END_DATE: (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value), // YYYY-MM-DD format
  }

  let requiredDescriptors: any
  if (insuranceType === 'MARINE_INSURANCE') {
    requiredDescriptors = marineDescriptors
  } else if (insuranceType === 'HEALTH_INSURANCE') {
    requiredDescriptors = healthDescriptors
  } else if (insuranceType === 'MOTOR_INSURANCE') {
    requiredDescriptors = motorDescriptors
  }

  if (insuranceType !== 'MARINE_INSURANCE') {
    if (action.includes('_2')) {
      let conditionalDescriptors: any = {
        BASE_PRICE: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
        CONVIENCE_FEE: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
        PROCESSING_FEE: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
        TAX: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
        OFFER_VALIDITY: (value: string) => /^P(T?\d+H?M?D?)$/.test(value),
      }
      if (insuranceType === 'MOTOR_INSURANCE') {
        conditionalDescriptors = {
          ...conditionalDescriptors,
          MANUAL_REVIEW: (value: string) => value === 'true' || value === 'false',
          IDV_VALUE: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
          IDV_MIN_VALUE: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
          IDV_MAX_VALUE: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
        }
      }
      requiredDescriptors = { ...requiredDescriptors, ...conditionalDescriptors }
    }

    if (action.includes('on_')) {
      if (insuranceType === 'HEALTH_INSURANCE') {
        requiredDescriptors = {
          ...requiredDescriptors,
          PROPOSAL_ID: (value: string) => typeof value === 'string' && value.length > 0,
        }
      } else if (insuranceType === 'MOTOR_INSURANCE') {
        requiredDescriptors = {
          ...requiredDescriptors,
          MANUAL_REVIEW: (value: string) => value === 'true' || value === 'false',
          IDV_VALUE: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
        }
      }
    }
  }

  const validateDescriptorList = (list: any[], descriptorRules: any, tagName: string) => {
    list.forEach((item, index) => {
      const descriptorCode = item.descriptor?.code
      const value = item.value

      if (!descriptorCode) {
        errors.push(`${tagName} -> List[${index}] is missing a descriptor code.`)
      } else if (!descriptorRules[descriptorCode]) {
        errors.push(`${tagName} -> List[${index}] has an unknown descriptor code: '${descriptorCode}'.`)
      } else if (!value) {
        errors.push(`${tagName} -> List[${index}] is missing a value for descriptor code '${descriptorCode}'.`)
      } else if (!descriptorRules[descriptorCode](value)) {
        errors.push(
          `${tagName} -> List[${index}] has an invalid value '${value}' for descriptor code '${descriptorCode}'.`,
        )
      }
    })
  }

  tags.forEach((tag: any, index: number) => {
    const tagCode = tag.descriptor?.code
    const tagName = `Tag[${index}] (${tagCode})`
    const list = tag.list

    if (!tagCode) {
      errors.push(`Tag[${index}] is missing a descriptor code.`)
      return
    }

    if (!Array.isArray(list) || list.length === 0) {
      errors.push(`${tagName} has a missing or empty list.`)
      return
    }

    if (tagCode === 'GENERAL_INFO') {
      validateDescriptorList(list, requiredDescriptors, tagName)
    } else if (tagCode === 'VAHAN_DETAILS') {
      validateDescriptorList(list, vahanDetailsDescriptors, tagName)
    } else {
      errors.push(`${tagName} has an unrecognized descriptor code.`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  }

  // const descriptorCodesSet = new Set(tags.flatMap((tag: any) => tag.list?.map((item: any) => item.descriptor?.code)))

  // Object.keys(requiredDescriptors).forEach((requiredCode) => {
  //   if (!descriptorCodesSet.has(requiredCode)) {
  //     errors.push(`Missing required descriptor code: '${requiredCode}'.`)
  //   }
  // })

  // if (!tags || isEmpty(tags)) {
  //   errors.push(`Tags is empty or missing`)
  // } else {
  //   tags.forEach((tag: any, tagIndex: number) => {
  //     if (!tag.descriptor || !tag.descriptor.code || !tag.descriptor.name) {
  //       errors.push(`Tag[${tagIndex}] is missing required descriptor fields (code or name).`)
  //     }

  //     // Check if list exists and is an array
  //     if (!tag?.list || isEmpty(tag?.list)) {
  //       errors.push(`Tag[${tagIndex}] has an missing or empty list.`)
  //     } else {
  //       // Iterate through the list of items
  //       tag.list.forEach((item: any, itemIndex: number) => {
  //         const descriptorCode = item.descriptor?.code
  //         const descriptorName = item.descriptor?.name
  //         const value = item?.value

  //         // Check if descriptor fields exist
  //         if (!descriptorCode || !descriptorName) {
  //           errors.push(`Tag[${tagIndex}] -> List[${itemIndex}] is missing required descriptor fields (code or name).`)
  //           return
  //         }

  //         // Validate descriptor code
  //         if (!(descriptorCode in requiredDescriptors)) {
  //           errors.push(`Tag[${tagIndex}] -> List[${itemIndex}] has an unknown descriptor code: '${descriptorCode}'.`)
  //         } else {
  //           // Validate the value based on descriptor code
  //           const validateValue = requiredDescriptors[descriptorCode]
  //           if (!value) {
  //             errors.push(
  //               `Tag[${tagIndex}] -> value is missing at List[${itemIndex}] for descriptor code '${descriptorCode}'.`,
  //             )
  //           } else if (!validateValue(value)) {
  //             errors.push(
  //               `Tag[${tagIndex}] -> List[${itemIndex}] has an invalid value '${value}' for descriptor code '${descriptorCode}'.`,
  //             )
  //           }
  //         }
  //       })
  //     }
  //   })
  // }

  // return {
  //   isValid: errors.length === 0,
  //   errors: errors.length > 0 ? errors : undefined,
  // }
}

export const validatePolicyDetails = (tags: any, action: string) => {
  const errors: string[] = []

  let requiredDescriptors: any = {
    COMMODITY_TYPE: (value: string) => typeof value === 'string' && value.length > 0,
    SUM_INSURED: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
    MODE_OF_CONVEYANCE: (value: string) => ['cargo', 'air', 'sea'].includes(value?.toLowerCase()),
    BASIS_OF_VALUATION: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) > 0,
  }

  if (action != 'on_select_1') {
    const conditionalDescriptors: any = {
      POLICY_START_DATE: (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value), // YYYY-MM-DD format
      // COVERAGE_FROM: (value: string) => typeof value === 'string' && value.length > 0,
      // COVERAGE_TO: (value: string) => typeof value === 'string' && value.length > 0,
      INVOICE_DATE: (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value), // YYYY-MM-DD format
      // CARGO_DETAILS: (value: string) => typeof value === 'string' && value.length > 0,
      // PACKAGING_DETAILS: (value: string) => typeof value === 'string' && value.length > 0,
      INVOICE_NUMBER: (value: string) => typeof value === 'string' && /^\d+$/.test(value), // Numeric string
    }

    requiredDescriptors = { ...requiredDescriptors, ...conditionalDescriptors }
  }

  // if (action === 'confirm') {
  //   delete requiredDescriptors['COMMODITY_TYPE']
  //   delete requiredDescriptors['MODE_OF_CONVEYANCE']
  //   delete requiredDescriptors['BASIS_OF_VALUATION']
  // }

  console.log('requiredDescriptors', action, requiredDescriptors)
  tags.forEach((tag: any, tagIndex: number) => {
    if (!tag.descriptor || !tag.descriptor.code) {
      errors.push(`descriptor.code is missing at Tag[${tagIndex}]`)
    } else if (tag.descriptor.code !== 'POLICY_DETAILS') {
      errors.push(`descriptor.code should be 'POLICY_DETAILS' at Tag[${tagIndex}]`)
    }

    if (!tag.descriptor || !tag.descriptor.name) {
      errors.push(`descriptor.name is missing at Tag[${tagIndex}]`)
    }

    if (!tag.list || !Array.isArray(tag.list)) {
      errors.push(`Tag[${tagIndex}] has an invalid 'list' field. It should be an array.`)
    } else {
      tag.list.forEach((item: any, itemIndex: number) => {
        const descriptorCode = item.descriptor?.code
        const descriptorName = item.descriptor?.name
        const value = item.value

        // Check if descriptor fields exist
        if (!descriptorCode || !descriptorName) {
          errors.push(`Tag[${tagIndex}] -> List[${itemIndex}] is missing required descriptor fields (code or name).`)
          return
        }

        // Validate descriptor code
        if (!(descriptorCode in requiredDescriptors)) {
          errors.push(`Tag[${tagIndex}] -> List[${itemIndex}] has an unknown descriptor code: '${descriptorCode}'.`)
        } else {
          // Validate the value based on descriptor code
          const validateValue = requiredDescriptors[descriptorCode]
          if (!validateValue(value)) {
            errors.push(
              `Tag[${tagIndex}] -> List[${itemIndex}] has an invalid value '${value}' for descriptor code '${descriptorCode}'.`,
            )
          }

          delete requiredDescriptors[descriptorCode]
        }
      })
    }
  })

  if (Object.keys(requiredDescriptors)?.length > 0) {
    errors.push(`Missing tags ${Object.keys(requiredDescriptors)} at POLICY_DETAILS tag-group`)
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  }
}

export const validateIdvSelected = (tags: any) => {
  const errors: string[] = []

  const generalInfoTag = tags.find((tag: any) => tag.descriptor?.code === 'GENERAL_INFO')

  if (!generalInfoTag) {
    errors.push("Missing 'GENERAL_INFO' tag.")
  } else {
    if (!generalInfoTag.list || !Array.isArray(generalInfoTag.list)) {
      errors.push("'GENERAL_INFO' tag has an invalid 'list' field. It should be an array.")
    } else {
      const idvItem = generalInfoTag.list.find((item: any) => item.descriptor?.code === 'IDV_SELECTED')

      if (!idvItem) {
        errors.push("Missing 'IDV_SELECTED' descriptor in the 'GENERAL_INFO' tag.")
      } else {
        const value = idvItem.value
        if (isNaN(parseFloat(value)) || parseFloat(value) < 0) {
          errors.push(`Invalid value '${value}' for 'IDV_SELECTED'. It should be a number greater than or equal to 0.`)
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  }
}

export const validateClaimTags = (tags: any, action: string) => {
  const errors: string[] = []

  if (!isArray(tags)) {
    errors.push(`fulfillments.tags are missing or empty`)
    return {
      isValid: false,
      errors,
    }
  }

  let requiredDescriptors: any = {
    REQUESTED_CLAIM_AMOUNT: (value: string) => /^[0-9]+(\s?[a-zA-Z]+)?$/.test(value),
  }

  if (action == FIS13HealthSequence.ON_UPDATE_2 || action.includes('on_status')) {
    const conditionalDescriptors: any = {
      APPROVED_CLAIM_AMOUNT: (value: string) => /^[0-9]+(\s?[a-zA-Z]+)?$/.test(value),
    }

    requiredDescriptors = { ...requiredDescriptors, ...conditionalDescriptors }
  } else if (action == FIS13HealthSequence.ON_UPDATE_3) {
    const conditionalDescriptors: any = {
      APPROVED_CLAIM_AMOUNT: (value: string) => /^[0-9]+(\s?[a-zA-Z]+)?$/.test(value),
      REF_ID: (value: string) => typeof value === 'string' && value.length > 0,
    }

    requiredDescriptors = { ...requiredDescriptors, ...conditionalDescriptors }
  }

  tags.forEach((tag: any, tagIndex: number) => {
    if (!tag.descriptor || !tag.descriptor.code) {
      errors.push(`descriptor.code is missing at Tag[${tagIndex}]`)
    } else if (tag.descriptor.code !== 'INFO') {
      errors.push(`descriptor.code should be 'INFO' at Tag[${tagIndex}]`)
    }

    if (!tag.list || !Array.isArray(tag.list)) {
      errors.push(`Tag[${tagIndex}] has an invalid 'list' field. It should be an array.`)
    } else {
      tag.list.forEach((item: any, itemIndex: number) => {
        const descriptorCode = item.descriptor?.code
        const value = item.value

        if (!descriptorCode) {
          errors.push(`Tag[${tagIndex}] -> List[${itemIndex}] is missing descriptor code.`)
          return
        }

        if (!(descriptorCode in requiredDescriptors)) {
          errors.push(`Tag[${tagIndex}] -> List[${itemIndex}] has an unknown descriptor code: '${descriptorCode}'.`)
        } else {
          const validateValue = requiredDescriptors[descriptorCode]
          if (!validateValue(value)) {
            errors.push(
              `Tag[${tagIndex}] -> List[${itemIndex}] has an invalid value '${value}' for descriptor code '${descriptorCode}'.`,
            )
          }

          delete requiredDescriptors[descriptorCode]
        }
      })
    }
  })

  if (Object.keys(requiredDescriptors)?.length > 0) {
    errors.push(`Missing tags ${Object.keys(requiredDescriptors)} at INFO tag-group`)
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : [],
  }
}

export const validateContactAndLspInfo = (tags: any) => {
  const errors: string[] = []

  const contactInfoDescriptors: any = {
    GRO_NAME: (value: string) => typeof value === 'string' && value.trim().length > 0,
    GRO_EMAIL: (value: string) => typeof value === 'string' && value.includes('@'),
    GRO_CONTACT_NUMBER: (value: string) => typeof value === 'string' && /^\d{10,15}$/.test(value),
    CUSTOMER_SUPPORT_LINK: (value: string) => typeof value === 'string' && value.startsWith('http'),
    CUSTOMER_SUPPORT_CONTACT_NUMBER: (value: string) => typeof value === 'string' && /^\d{10,15}$/.test(value),
    CUSTOMER_SUPPORT_EMAIL: (value: string) => typeof value === 'string' && value.includes('@'),
  }

  const lspInfoDescriptors: any = {
    LSP_NAME: (value: string) => typeof value === 'string' && value.trim().length > 0,
    LSP_EMAIL: (value: string) => typeof value === 'string' && value.includes('@'),
    LSP_CONTACT_NUMBER: (value: string) => typeof value === 'string' && /^\d{10,15}$/.test(value),
    LSP_ADDRESS: (value: string) => typeof value === 'string' && value.trim().length > 0,
  }

  if (!Array.isArray(tags) || tags.length === 0) {
    throw new Error('Tags array is missing or empty.')
  }

  tags.forEach((tag: any, index: number) => {
    if (!tag.descriptor || !tag.descriptor.code) {
      throw new Error(`Tag[${index}] is missing descriptor or code.`)
    }

    const tagCode = tag.descriptor.code
    const tagName = `Tag[${index}] (${tagCode})`
    const list = tag.list

    if (!Array.isArray(list) || list.length === 0) {
      throw new Error(`${tagName} has a missing or empty list.`)
    }

    let requiredDescriptors: any
    if (tagCode === 'CONTACT_INFO') {
      requiredDescriptors = contactInfoDescriptors
    } else if (tagCode === 'LSP_INFO') {
      requiredDescriptors = lspInfoDescriptors
    } else {
      throw new Error(`${tagName} has an unrecognized descriptor code.`)
    }

    list.forEach((item, itemIndex) => {
      const descriptorCode = item.descriptor?.code
      const value = item.value

      if (!descriptorCode) {
        throw new Error(`${tagName} -> List[${itemIndex}] is missing a descriptor code.`)
      }

      if (!requiredDescriptors[descriptorCode]) {
        throw new Error(`${tagName} -> List[${itemIndex}] has an unknown descriptor code: '${descriptorCode}'.`)
      }

      if (!value) {
        throw new Error(`${tagName} -> List[${itemIndex}] is missing a value for descriptor code '${descriptorCode}'.`)
      }

      if (!requiredDescriptors[descriptorCode](value)) {
        throw new Error(
          `${tagName} -> List[${itemIndex}] has an invalid value '${value}' for descriptor code '${descriptorCode}'.`,
        )
      }
    })
  })

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : [],
  }
}
