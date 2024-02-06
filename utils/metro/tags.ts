/* eslint-disable no-prototype-builtins */
import { isValidEmail, isValidPhoneNumber, isValidUrl } from '..'

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
    if (tag.descriptor.code === 'ROUTE_INFO') {
      if (tag.display !== undefined && typeof tag.display !== 'boolean') {
        errors.push(`route.tag[${index}] has an invalid value for the 'display' property. It should be a boolean.`)
      }

      tag.list.forEach((item, itemIndex) => {
        const descriptorCode = item.descriptor.code

        if (descriptorCode !== descriptorCode.toUpperCase()) {
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

export const validatePaymentTags = (tags: Tag[]): ValidationResult => {
  const errors: string[] = []

  const validDescriptorCodes = ['BUYER_FINDER_FEES', 'SETTLEMENT_TERMS']
  const settlementTypes = ['upi', 'neft', 'rtgs']
  const settlementBasis = ['Delivery', 'INVOICE_RECEIPT']

  tags.forEach((tag, index) => {
    if (!validDescriptorCodes.includes(tag.descriptor.code)) {
      errors.push(`payment.tag[${index}] has an invalid descriptor code`)
      return
    }

    if (tag.display !== undefined && typeof tag.display !== 'boolean') {
      errors.push(`payment.tag[${index}] has an invalid value for the 'display' property. It should be a boolean.`)
    }

    switch (tag.descriptor.code) {
      case 'BUYER_FINDER_FEES': {
        const expectedDescriptorCodes = ['BUYER_FINDER_FEES_PERCENTAGE', 'BUYER_FINDER_FEES_TYPE']

        const actualDescriptorCodes = tag.list.map((item: any) => item.descriptor.code)

        const invalidDescriptorCodes = actualDescriptorCodes.filter((code) => !expectedDescriptorCodes.includes(code))
        if (invalidDescriptorCodes.length > 0) {
          errors.push(`payment.tag[${index}] has unexpected descriptor codes: ${invalidDescriptorCodes.join(', ')}`)
        }

        // const buyerFinderFeesType: any = tag.list.find((item: any) => item.descriptor.code === 'BUYER_FINDER_FEES_TYPE')
        const buyerFinderFeesPercentage = tag.list.find(
          (item) => item.descriptor.code === 'BUYER_FINDER_FEES_PERCENTAGE',
        )

        if (!buyerFinderFeesPercentage || !/^\d+$/.test(buyerFinderFeesPercentage.value)) {
          errors.push(`BUYER_FINDER_FEES_[${index}], BUYER_FINDER_FEES_PERCENTAGE must be a valid integer`)
        }

        break
      }

      case 'SETTLEMENT_TERMS': {
        tag.list.forEach((item: any, itemIndex) => {
          switch (item.descriptor.code) {
            case 'SETTLEMENT_WINDOW':
              if (!/^PT(\d+H)?(\d+M)?(\d+S)?$/.test(item.value)) {
                errors.push(`SETTLEMENT_TERMS_[${index}], List item[${itemIndex}] has an invalid duration value`)
              }

              break
            case 'SETTLEMENT_BASIS':
              if (!settlementBasis?.includes(item.value)) {
                errors.push(
                  `SETTLEMENT_TERMS_[${index}],SETTLEMENT_BASIS must be either if ${settlementBasis} at item[${itemIndex}]`,
                )
              }

              break
            case 'SETTLEMENT_TYPE':
              if (!settlementTypes?.includes(item.value?.toLowerCase())) {
                errors.push(
                  `SETTLEMENT_TERMS_[${index}],SETTLEMENT_TYPE must be either if ${settlementTypes} at item[${itemIndex}]`,
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

export function validateCancellationTerm(term: any, index: number) {
  const fulfillmentStateCode = term?.fulfillment_state?.descriptor?.code
  const reasonRequired = term?.reason_required
  const cancellationFeePercentage = term?.cancellation_fee?.percentage
  const cancellationFeeAmount = term?.cancellation_fee?.amount?.value

  const errors: any = {}

  if (!fulfillmentStateCode) {
    errors[`fulfillmentStateCode_${index}`] = `fulfillment_state.descriptor.code is missing`
  }

  if (reasonRequired === undefined) {
    errors[`reasonRequired_${index}`] = `reason_required is missing`
  }

  if (cancellationFeePercentage === undefined && cancellationFeeAmount === undefined) {
    errors[`cancellationFee_${index}`] = `cancellation_fee is missing or invalid`
  }

  return errors
}
