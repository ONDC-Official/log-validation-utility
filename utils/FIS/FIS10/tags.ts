
import { isValidEmail, isValidPhoneNumber, isValidUrl } from '../../index'
//import constants from '../../../constants'

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

const itemDetails = ['USABILITY', 'EXPIRY_PERIOD', 'TERMS_CONDITION', 'REDEMPTION_INSTRUCTION', 'OCCASION'];
const customization = ['ENABLED', 'RECEIVER_NAME', 'MESSAGE', 'PREVIEW_IMAGE'];
const brandDetails = ['BRAND_NAME', 'BRAND_PHONE', 'BRAND_EMAIL'];

export const validatePaymentTags = (tags: Tag[], terms: any, validDescriptorCodes: string[]): ValidationResult => {
  const errors: string[] = []
  if (!tags) {
    errors.push(`payments.tags are empty or missing.`)
  } else {
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
            const feePercentage = tag.list.find((item: any) => item.descriptor.code == 'BUYER_FINDER_FEES_PERCENTAGE')
            const feeValue = tag.list.find((item: any) => item.descriptor.code == 'BUYER_FINDER_FEES_VALUE')

            if (!feeValue && !feePercentage) {
              errors.push(
                `either of BUYER_FINDER_FEES_PERCENTAGE or BUYER_FINDER_FEES_VALUE should be present as part of  BUYER_FINDER_FEES`,
              )
            } else if (feeValue && feePercentage) {
              errors.push(
                `either of BUYER_FINDER_FEES_PERCENTAGE or BUYER_FINDER_FEES_VALUE should be present, not both.`,
              )
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
              switch (item.descriptor.code) {
                case terms.find((term: any) => term.code === item.descriptor.code)?.code: {
                  const termDefinition: any = terms.find((term: any) => term.code === item.descriptor.code)

                  switch (termDefinition?.type) {
                    case 'enum':
                      if (!termDefinition?.value.includes(item.value)) {
                        errors.push(
                          `SETTLEMENT_TERMS_[${index}], List item[${itemIndex}] has an invalid value for ${termDefinition.code}`,
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
                    `SETTLEMENT_TERMS_[${index}], List item[${itemIndex}] has an invalid descriptor code: ${item?.descriptor?.code}`,
                  )
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
                  `${item.descriptor.name
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

export const validateItemsTags = (tags: Tag[], action:string): ValidationResult => {
  const errors: string[] = []
  console.log(action)
  tags.forEach((tag, index) => {

    if (tag.descriptor.code === 'ITEM_DETAILS') {
      if (!tag.list) {
        errors.push(`In Tag[${index}] list object is missing`);
      } else {
        tag.list.forEach((item, index) => {
          if (!itemDetails.includes(item?.descriptor?.code)) {
            errors.push(`In list[${index}] descriptor code is not valid it should be from ${itemDetails}`);
          }
        });
      }
    }

    if (tag.descriptor.code === 'CUSTOMIZATION') {
      if (!tag.list) {
        errors.push(`In Tag[${index}] list object is missing`);
      } else {
        tag.list.forEach((item, index) => {
          if (customization.includes(item?.descriptor?.code)) {
            errors.push(`In list[${index}] descriptor code is not valid it should be from ${customization}`);
          }

        });
      }
    }

    if (tag.descriptor.code === 'BRAND_DETAILS') {
      if (!tag.list) {
        errors.push(`In Tag[${index}] list object is missing`);
      } else {
        tag.list.forEach((item, index) => {
          if (!brandDetails.includes(item?.descriptor?.code)) {
            errors.push(`In list[${index}] descriptor code is not valid it should be from ${brandDetails}`);
          }
        });
      }
    }

    

  })

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  }
}
