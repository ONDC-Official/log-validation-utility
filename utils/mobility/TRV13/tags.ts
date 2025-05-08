/* eslint-disable no-prototype-builtins */
import { isEmpty } from 'lodash'
import { isValidEmail, isValidPhoneNumber, isValidUrl } from '../../'

interface Tag {
  display: boolean
  descriptor: {
    code: string
    name: string
  }
  list: {
    descriptor: {
      code: string
      name: string
    }
    value: any
  }[]
}

interface ValidationResult {
  isValid: boolean
  errors?: string[]
}

interface RouteInfoTag {
  descriptor: {
    code: string
    name: string
  }
  display: boolean
  list: Array<{
    descriptor: {
      code: string
      name: string
    }
    value: string
  }>
}

export const validateRouteInfoTags = (tags: RouteInfoTag[]): ValidationResult => {
  const errors: string[] = []

  if (!tags) {
    errors.push('Tags are missing in fulfillments')
    return {
      isValid: false,
      errors,
    }
  }

  tags.forEach((tag, index) => {
    if (tag?.descriptor?.code === 'ROUTE_INFO') {
      if (tag.display !== undefined && typeof tag.display !== 'boolean') {
        errors.push(`route.tag[${index}] has an invalid value for the 'display' property. It should be a boolean.`)
      }

      const polyLineTag = tag?.list.find((item) => item?.descriptor?.code === 'ENCODED_POLYLINE')
      const waypointsTag = tag?.list.find((item) => item?.descriptor?.code === 'WAYPOINTS')
      if (!polyLineTag) errors.push(`tag ENCODED_POLYLINE is missing in ROUTE_INFO tag-group`)
      if (!waypointsTag) errors.push(`tag WAYPOINTS is missing in ROUTE_INFO tag-group`)

      tag?.list.forEach((item, itemIndex) => {
        const descriptorCode = item?.descriptor?.code

        if (!descriptorCode) {
          errors.push(`descriptor.code is missing at route.tag[${index}], List item[${itemIndex}].`)
        } else if (descriptorCode !== descriptorCode.toUpperCase()) {
          errors.push(`code should be in uppercase at route.tag[${index}], List item[${itemIndex}].`)
        }

        switch (descriptorCode.toUpperCase()) {
          case 'ENCODED_POLYLINE':
            if (typeof item.value !== 'string') {
              errors.push(
                `route.tag[${index}], List item[${itemIndex}] has an invalid value for ENCODED_POLYLINE. It should be a string.`,
              )
            }

            break

          case 'WAYPOINTS':
            if (typeof item.value !== 'string') {
              errors.push(
                `route.tag[${index}], List item[${itemIndex}] has an invalid value for WAYPOINTS. It should be a string.`,
              )
            }

            break

          default:
            errors.push(`route.tag[${index}], List item[${itemIndex}] has an unexpected descriptor code`)
        }
      })
    }
  })

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  }
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

      switch (tag?.descriptor?.code) {
        case 'BUYER_FINDER_FEES': {
          if (!tag?.list || isEmpty(tag?.list)) {
            errors.push(`BUYER_FINDER_FEES tag.list is missing or empty`)
          } else {
            const expectedDescriptorCodes = ['BUYER_FINDER_FEES_PERCENTAGE']
            const actualDescriptorCodes = tag.list.map((item: any) => item?.descriptor?.code)
            const invalidDescriptorCodes = actualDescriptorCodes.filter(
              (code) => !expectedDescriptorCodes.includes(code),
            )

            if (!actualDescriptorCodes.includes('BUYER_FINDER_FEES_PERCENTAGE')) {
              errors.push(`BUYER_FINDER_FEES_PERCENTAGE is missing `)
            }

            if (invalidDescriptorCodes.length > 0) {
              errors.push(
                `Tag[${index}] has unexpected or missing descriptor codes: ${invalidDescriptorCodes.join(', ')}`,
              )
            }

            const buyerFinderFeesPercentage = tag?.list.find(
              (item) => item?.descriptor?.code === 'BUYER_FINDER_FEES_PERCENTAGE',
            )

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
              switch (item?.descriptor?.code) {
                case terms.find((term: any) => term.code === item?.descriptor?.code)?.code: {
                  const termDefinition: any = terms.find((term: any) => term.code === item?.descriptor?.code)

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
      errors.push(`provider.tag${index}] has an invalid descriptor code`)
      return
    }

    if (tag.display !== undefined && typeof tag.display !== 'boolean') {
      errors.push(`provider.tag${index}] has an invalid value for the 'display' property. It should be a boolean.`)
    }

    switch (tag.descriptor.code) {
      case 'CONTACT_INFO': {
        tag.list.forEach((item: any, itemIndex) => {
          switch (item.descriptor.code) {
            case 'GRO_NAME':
              if (typeof item.value !== 'string' || item.value.trim() === '') {
                errors.push(
                  `${item.descriptor.name} in contact.tag${index}], List item[${itemIndex}] must be a non-empty string`,
                )
              }

              break

            case 'GRO_EMAIL':
              if (!isValidEmail(item.value)) {
                errors.push(
                  `${item.descriptor.name} in contact.tag${index}], List item[${itemIndex}] must be a valid email address`,
                )
              }

              break

            case 'GRO_CONTACT_NUMBER':
              if (!isValidPhoneNumber(item.value)) {
                errors.push(
                  `${item.descriptor.name} in contact.tag${index}], List item[${itemIndex}] must be a valid 10-digit phone number`,
                )
              }

              break

            case 'CUSTOMER_SUPPORT_LINK':
              if (!isValidUrl(item.value)) {
                errors.push(
                  `${item.descriptor.name} in contact.tag${index}], List item[${itemIndex}] must be a valid URL`,
                )
              }

              break

            case 'CUSTOMER_SUPPORT_EMAIL':
              if (!isValidEmail(item.value)) {
                errors.push(
                  `${item.descriptor.name} in contact.tag${index}], List item[${itemIndex}] must be a valid email address`,
                )
              }

              break

            case 'CUSTOMER_SUPPORT_CONTACT_NUMBER':
              if (!isValidPhoneNumber(item.value)) {
                errors.push(
                  `${item.descriptor.name} in contact.tag${index}], List item[${itemIndex}] must be a valid 10-digit phone number`,
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
                errors.push(`lsp.tag[${index}], List item[${itemIndex}] has an invalid or empty value for LSP_NAME`)
              }

              break
            case 'LSP_EMAIL':
              if (!isValidEmail(item.value)) {
                errors.push(`lsp.tag[${index}], List item[${itemIndex}] has an invalid email for LSP_EMAIL`)
              }

              break
            case 'LSP_CONTACT_NUMBER':
              if (!isValidPhoneNumber(item.value)) {
                errors.push(
                  `lsp.tag[${index}], List item[${itemIndex}] has an invalid phone number for LSP_CONTACT_NUMBER`,
                )
              }

              break
            case 'LSP_ADDRESS':
              if (typeof item.value !== 'string' || item.value.trim() === '') {
                errors.push(`lsp.tag[${index}], List item[${itemIndex}] has an invalid or empty value for LSP_ADDRESS`)
              }

              break
            default:
              errors.push(`lsp.tag[${index}], List item[${itemIndex}] has an unexpected descriptor code`)
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

  if (!tags) {
    errors.push('Tags are required for validation in items')
    return {
      isValid: false,
      errors,
    }
  }

  tags.forEach((tag, index) => {
    switch (tag.descriptor.code) {
      case 'INFO': {
        if (tag.descriptor.name !== 'General Information') {
          errors.push(
            `info-tag[${index}] has an invalid name for the 'INFO' descriptor. It should be 'General Information'.`,
          )
        }

        const distanceToNearestDriverMeter = tag.list.find(
          (item) => item.descriptor.code === 'DISTANCE_TO_NEAREST_DRIVER_METER',
        )
        const etaToNearestDriverMin = tag.list.find((item) => item.descriptor.code === 'ETA_TO_NEAREST_DRIVER_MIN')

        if (!distanceToNearestDriverMeter || parseInt(distanceToNearestDriverMeter.value) < 0) {
          errors.push(`general-info.tag[${index}], DISTANCE_TO_NEAREST_DRIVER_METER must be a positive integer`)
        }

        if (!etaToNearestDriverMin || parseInt(etaToNearestDriverMin.value) < 0) {
          errors.push(`general-info.tag[${index}], ETA_TO_NEAREST_DRIVER_MIN must be a positive integer`)
        }

        break
      }

      case 'FARE_POLICY': {
        const fareDescriptors = [
          'MIN_FARE',
          'MIN_FARE_DISTANCE_KM',
          'PER_KM_CHARGE',
          'PICKUP_CHARGE',
          'WAITING_CHARGE_PER_MIN',
          'NIGHT_CHARGE_MULTIPLIER',
        ]

        tag.list.forEach((item, itemIndex) => {
          if (!fareDescriptors.includes(item.descriptor.code)) {
            errors.push(`fair-policy.tag[${index}], List item[${itemIndex}] has an unexpected descriptor code`)
            return
          }

          if (
            item.descriptor.code !== 'NIGHT_SHIFT_START_TIME' &&
            item.descriptor.code !== 'NIGHT_SHIFT_END_TIME' &&
            (!/^\d+(\.\d+)?$/.test(item.value) || parseFloat(item.value) < 0)
          ) {
            errors.push(
              `fair-policy.tag[${index}], List item[${itemIndex}] must be a valid non-negative integer or float`,
            )
          }

          if (
            (item.descriptor.code === 'NIGHT_SHIFT_START_TIME' || item.descriptor.code === 'NIGHT_SHIFT_END_TIME') &&
            !/^\d{2}:\d{2}:\d{2}$/.test(item.value)
          ) {
            errors.push(
              `fair-policy.tag[${index}], List item[${itemIndex}] must be a valid timestamp in the format HH:mm:ss`,
            )
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

export const validateLocationTag = (tags: Tag[]): ValidationResult => {
  const errors: string[] = []

  if (!tags?.length) {
    errors.push(`tags array is empty`)
  } else {
    tags.forEach((tag, index) => {
      if (tag?.descriptor?.code !== 'LOCATION') {
        errors.push(`LOCATION tag is missing`)
        return
      }

      if (!tag.list) {
        errors.push(`list is missing for tag-group LOCATION`)
      } else {
        const startAreaItem = tag.list.find((item) => item.descriptor.code === 'START_AREA')
        const endAreaItem = tag.list.find((item) => item.descriptor.code === 'END_AREA')

        if (!startAreaItem) {
          errors.push(`LOCATION: START_AREA tag is missing at index: ${index}`)
        } else if (typeof startAreaItem.value !== 'string' || startAreaItem.value.trim() === '') {
          errors.push(`START_AREA value is missing/empty or type is incorrect in LOCATION tag at index ${index}.`)
        }

        if (!endAreaItem) {
          errors.push(`LOCATION: END_AREA tag is missing at index: ${index}`)
        } else if (typeof endAreaItem.value !== 'string' || endAreaItem.value.trim() === '') {
          errors.push(`END_AREA value is missing/empty or type is incorrect in LOCATION tag at index ${index}.`)
        }
      }
    })
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  }
}

export const validateTermsAndFeesTags = (tags: any, sequence: string) => {
  const errors: string[] = []

  // Expected structure requirements for each tag
  const requiredTagStructure: any = {
    BAP_TERMS: ['STATIC_TERMS', 'STATIC_TERMS_NEW', 'EFFECTIVE_DATE'],
    BUYER_FINDER_FEES: ['BUYER_FINDER_FEES_PERCENTAGE'],
  }

  if (sequence?.includes('_inc') || sequence === 'search_inc') requiredTagStructure['CATALOG_INC'] = ['MODE']

  console.log('requiredTagStructure---', requiredTagStructure, 'sequence:', sequence)

  // Descriptors with specific validation rules
  const descriptorValidators: any = {
    STATIC_TERMS: (value: string) => /^https?:\/\/.+/.test(value),
    STATIC_TERMS_NEW: (value: string) => /^https?:\/\/.+/.test(value),
    EFFECTIVE_DATE: (value: string) => !isNaN(Date.parse(value)),
    BUYER_FINDER_FEES_PERCENTAGE: (value: string) => /^[0-9]+(\.[0-9]+)?$/.test(value),
    MODE: (value: string) => ['START', 'STOP'].includes(value),
  }

  // Check if required tags are present
  const foundTags: any = {}
  tags.forEach((tag: any) => {
    if (!requiredTagStructure[tag.descriptor?.code]) {
      errors.push(`Invalid tag-group '${tag.descriptor?.code}'.`)
    } else if (tag.descriptor?.code) {
      foundTags[tag.descriptor.code] = tag
    }
  })

  for (const requiredTag in requiredTagStructure) {
    if (!foundTags[requiredTag]) {
      errors.push(`Missing tag-group '${requiredTag}'.`)
      continue
    }

    const tag = foundTags[requiredTag]
    const requiredDescriptors = requiredTagStructure[requiredTag]
    // const descriptorsMap = tag.list.reduce((acc: any, item: any) => {
    //   if (item.descriptor?.code) {
    //     acc[item.descriptor.code] = item?.value
    //   }
    //   return acc
    // }, {})

    // Validate each required descriptor within the tag
    requiredDescriptors.forEach((descriptorCode: string) => {
      const descriptorItem = tag.list.find((item: any) => item.descriptor?.code === descriptorCode)
      if (!descriptorItem) {
        errors.push(`Missing required descriptor code '${descriptorCode}' in tag-group '${requiredTag}'.`)
      } else if (descriptorItem.value === undefined || descriptorItem.value === null || descriptorItem.value === '') {
        errors.push(`Missing required value for descriptor '${descriptorCode}' in tag-group '${requiredTag}'.`)
      } else if (descriptorValidators[descriptorCode] && !descriptorValidators[descriptorCode](descriptorItem.value)) {
        errors.push(
          `Invalid value '${descriptorItem.value}' for descriptor '${descriptorCode}' in tag-group '${requiredTag}'.`,
        )
      }
    })
  }

  return errors
}
