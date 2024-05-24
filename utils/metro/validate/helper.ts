import { validatePaymentTags } from '../tags'
import constants, { metroSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import { setValue } from '../../../shared/dao'

export function checkItemQuantity(item: { [key: string]: any }, i: number, j: number) {
  const errorObj: any = {}
  if (!item?.quantity) {
    errorObj[`prvdr${i}item${j}_quantity`] = `Quantity is missing in /providers[${i}]/items[${j}]`
    return errorObj
  }

  if (item?.quantity && Object.keys(item?.quantity).length === 0) {
    errorObj[`prvdr${i}item${j}_quantity`] =
      `Quantity object has missing keys "maximum and minimumin" /providers[${i}]/items[${j}]`
    return errorObj
  }

  if (item?.quantity && Object.keys(item?.quantity).length === 1) {
    const keys = Object.keys(item?.quantity)[0]
    errorObj[`prvdr${i}item${j}_quantity`] =
      `Quantity object has missing keys ${keys === 'maximum' ? 'minimum' : 'maximum'} in /providers[${i}]/items[${j}]`
    return errorObj
  }

  if (item?.quantity?.maximum && item?.quantity?.minimum) {
    if (!item?.quantity?.maximum?.count) {
      errorObj[`prvdr${i}item${j}_quantity_maximum`] =
        `In Quantity object maximum object has missing keys count in /providers[${i}]/items[${j}]`
      return errorObj
    }
    if (!item?.quantity?.minimum?.count) {
      errorObj[`prvdr${i}item${j}_quantity_minimum`] =
        `In Quantity object minimum object has missing keys count in /providers[${i}]/items[${j}]`
      return errorObj
    }
  }

  return errorObj
}

export function checkItemTime(item: { [key: string]: any }, i: number, j: number) {
  const errorObj: any = {}
  if (!item?.time) {
    errorObj['item_time'] = `Time is missing in /providers[${i}]/items[${j}]`
    return errorObj
  }

  if (item?.time && Object.keys(item?.time).length === 0) {
    errorObj['item_time'] = `Time has missing keys "label and duration" in /providers[${i}]/items[${j}]`
    return errorObj
  }

  if (item?.time && Object.keys(item?.time).length === 1) {
    const keys = Object.keys(item?.time)[0]
    errorObj['item_time'] =
      `Time has missing keys ${keys === 'label' ? 'duration' : 'label'} in /providers[${i}]/items[${j}]`
    return errorObj
  }

  return errorObj
}

export function checkPayment(payments: any, i: number) {
  const errorObj: any = {}
  if (!payments || payments.length === 0) {
    errorObj[`provider_${i}_payments`] = `Payments are missing for provider ${i}`
  } else {
    try {
      logger.info(`Validating payments object for /${constants.ON_SEARCH}`)
      payments?.map((payment: any, i: number) => {
        const collectedBy = payment?.collected_by

        if (!collectedBy) {
          errorObj[`collected_by`] = `payment.collected_by must be present in ${metroSequence.ON_SEARCH1}`
        } else {
          setValue(`collected_by`, collectedBy)
          if (collectedBy !== 'BPP' && collectedBy !== 'BAP') {
            errorObj['collected_by'] =
              `payment.collected_by can only be either 'BPP' or 'BAP' in ${metroSequence.ON_SEARCH1}`
          }
        }

        // Validate payment tags
        if (!payment?.tags) errorObj['payment.tags'] = `payment.tags is missing in ${metroSequence.ON_SEARCH1}`

        const tagsValidation = validatePaymentTags(payment?.tags)
        if (!tagsValidation?.isValid) {
          const dynamicKey = `${i}_tags`
          Object.assign(errorObj, { [dynamicKey]: tagsValidation.errors })
        }
      })
    } catch (error: any) {
      logger.error(`!!Error occcurred while validating payments in /${constants.ON_SEARCH},  ${error.message}`)
    }
  }

  return errorObj
}

export function checkItemsExist(init: any, newItemIDSValue: any) {
  const errorObj: any = {}
  try {
    logger.info(`Comparing item in /${constants.INIT}`)
    init.items.forEach((item: any, index: number) => {
      if (!item?.id) errorObj['itemId'] = `/message/order/items/id in ${index}: Item Id is Missing in ${constants.INIT}`

      if (item?.id && !newItemIDSValue.includes(item.id)) {
        const key = `item[${index}].item_id`
        errorObj[key] =
          `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in previous call`
      }

      if (!item?.quantity) errorObj[`item[${index}].quantity`] = `Item quantity is missing in ${constants.INIT}`

      if (item?.quantity && !item?.quantity?.selected)
        errorObj[`item[${index}].quantity_selected`] = `Item quantity selected is missing in ${constants.INIT}`

      if (item?.quantity?.selected && !item?.quantity?.selected?.count)
        errorObj[`item[${index}].quantity_selected_count`] =
          `Item quantity selected count is missing in ${constants.INIT}`
    })
  } catch (error: any) {
    logger.error(`!!Error while comparing Item Id in /${constants.ON_SEARCH} and /${constants.INIT}`)
  }

  return errorObj
}

export function checkBilling(init: any) {
  const errorObj: { [key: string]: any } = {}

  try {
    const { billing } = init

    if (billing) {
      if (!billing.name) {
        errorObj['billing.name'] = `billing name must be present in /${constants.INIT}`
      } else {
        setValue('billingName', billing.name)
      }

      if (!billing.email) {
        errorObj['billing.email'] = `billing.email must be present in /${constants.INIT}`
      } else if (!isValidEmail(billing.email)) {
        errorObj['billing.email'] = `billing.email must be valid Email in /${constants.INIT}`
      }

      if (!billing.phone) {
        errorObj['billing.phone'] = `billing.phone must be present in /${constants.INIT}`
      } else if (!isValidPhoneNumber(billing.phone)) {
        errorObj['billing.phone'] = `billing.phone must be valid Phone Number in /${constants.INIT}`
      }
    }
  } catch (error: any) {
    logger.error(`!!Error in billing of /${constants.INIT}`)
  }

  return errorObj
}

function isValidEmail(email: string) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

function isValidPhoneNumber(phoneNumber: string) {
  const phoneRegex = /^\+91-\d{10}$/
  return phoneRegex.test(phoneNumber)
}

export function checkProviderTime(provider: any) {
  const errorObj: any = {}
  try {
    if (!provider?.time) errorObj.prvdrIdTime = `Provider Time is Missing in /${constants.ON_INIT}`
    else if (provider?.time && !provider?.time?.range)
      errorObj.prvdrTimeRange = `Provider Time Range is Missing in /${constants.ON_INIT}`
    else if (provider?.time?.range && !provider?.time?.range?.start)
      errorObj.prvdrTimeRangeStart = `Provider Time Range Start is Missing in /${constants.ON_INIT}`
    else if (provider?.time?.range && !provider?.time?.range?.end)
      errorObj.prvdrTimeRangeEnd = `Provider Time Range End is Missing in /${constants.ON_INIT}`
    else if (provider?.time?.range?.start && !isValidDateTime(provider?.time?.range?.start))
      errorObj.prvdrStartFormat = `Range.start Time Format is Invalid in /${constants.ON_INIT}`
    else if (provider?.time?.range?.end && !isValidDateTime(provider?.time?.range?.end))
      errorObj.prvdrEndFormat = `Range.end Time Format is Invalid in /${constants.ON_INIT}`

  } catch (error: any) {
    logger.error(`!!Error in Provider Time of /${constants.INIT}`)
  }

  return errorObj
}

function isValidDateTime(dateTimeString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
  return regex.test(dateTimeString)
}