import { validatePaymentTags } from '../tags'
import constants, { metroSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import { setValue } from '../../../shared/dao'
import _ from 'lodash'

export function checkItemQuantity(quantity: { [key: string]: any }, i: number, j: number) {
  const errorObj: any = {}
  if (!quantity) {
    errorObj[`prvdr${i}item${j}_quantity`] = `Quantity is missing in /providers[${i}]/items[${j}]`
    return errorObj
  }

  if (!quantity?.maximum?.count) {
    errorObj[`prvdr${i}item${j}_quantity_maximum`] =
      `attribute maximium.count is missing in /providers[${i}]/items[${j}]`
  }
  if (!quantity?.minimum?.count) {
    errorObj[`prvdr${i}item${j}_quantity_minimum`] =
      `attribute minimum.count is missing in /providers[${i}]/items[${j}]`
  }

  return errorObj
}

export function checkItemTime(time: { [key: string]: any }, i: number, j: number) {
  const errorObj: any = {}
  if (!time) {
    errorObj['time'] = `time is missing in /providers[${i}]/items[${j}]`
    return errorObj
  }

  if (!time?.duration) {
    errorObj[`prvdr${i}item${j}time.duration`] = `duration is missing in /providers[${i}]/items[${j}].time`
  }

  if (!time?.label) {
    errorObj[`prvdr${i}item${j}time.label`] = `label is missing in /providers[${i}]/items[${j}].time`
  } else if (time?.label.toLowerCase() !== 'validity')
    errorObj[`prvdr${i}item${j}time.label`] = `label should be equal to 'Validity' at /providers[${i}]/items[${j}].time`

  // if (!time?.timestamp) {
  //   errorObj[`prvdr${i}item${j}time.timestamp`] = `timestamp is missing in /providers[${i}]/items[${j}].time`
  // }

  return errorObj
}

export function checkItemPrice(price: { [key: string]: any }, i: number, j: number) {
  const errorObj: any = {}
  if (!price) {
    errorObj['price'] = `price is missing in /providers[${i}]/items[${j}]`
    return errorObj
  }

  if (!price?.value) {
    errorObj[`prvdr${i}item${j}price.value`] = `value is missing in /providers[${i}]/items[${j}].price`
  }

  if (!price?.currency) {
    errorObj[`prvdr${i}item${j}price.currency`] = `currency is missing in /providers[${i}]/items[${j}].price`
  } else if (price?.currency.toUpperCase() !== 'INR')
    errorObj[`prvdr${i}item${j}price.currency`] =
      `currency should be equal to 'INR' at /providers[${i}]/items[${j}].price`

  return errorObj
}

export function checkRefIds(refIds: string[], i: number, j: number, storedIds: any, refName: string) {
  const errorObj: any = {}
  if (_.isEmpty(refIds)) {
    errorObj[`${refName}_ids`] = `${refName}_ids is missing or empty at /providers[${i}]/items[${j}]`
    return errorObj
  }

  refIds?.map((id: string) => {
    if (!storedIds.includes(id))
      errorObj[`${refName}_ids`] =
        `id:${id} doesn't match with the id's passed in ${refName}, at /providers[${i}]/items[${j}]`
  })

  return errorObj
}

export function checkPayment(payments: any, i: number, action: string) {
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

        const tagsValidation = validatePaymentTags(payment?.tags, action)
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

export function checkItemsExist(init: any, newItemIDSValue: any, action: string) {
  const errorObj: any = {}
  try {
    if (!init?.items || init?.items?.length === 0) {
      errorObj['items'] = `/message/order/items is missing in ${action}`
    } else {
      logger.info(`Comparing item in /${action}`)
      init.items.forEach((item: any, index: number) => {
        if (!item?.id) errorObj['itemId'] = `/message/order/items/id in ${index}: Item Id is Missing in ${action}`
        else {
          if (item?.id && !newItemIDSValue.includes(item.id)) {
            const key = `item[${index}].item_id`
            errorObj[key] =
              `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in previous call`
          }

          if (!item?.quantity) errorObj[`item[${index}].quantity`] = `Item quantity is missing in ${action}`

          if (item?.quantity && !item?.quantity?.selected)
            errorObj[`item[${index}].quantity_selected`] = `Item quantity selected is missing in ${action}`

          if (item?.quantity?.selected && !item?.quantity?.selected?.count)
            errorObj[`item[${index}].quantity_selected_count`] = `Item quantity selected count is missing in ${action}`
        }
      })
    }
  } catch (error: any) {
    logger.error(`!!Error while comparing Item Id in /${constants.ON_SEARCH} and /${action}`)
  }

  return errorObj
}

export function checkBilling(billing: any, action: string) {
  const errorObj: { [key: string]: any } = {}
  try {
    if (billing) {
      if (!billing.name) {
        errorObj['billing.name'] = `billing name must be present in /${action}`
      } else {
        setValue('billingName', billing.name)
      }

      if (!billing.email) {
        errorObj['billing.email'] = `billing.email must be present in /${action}`
      } else if (!isValidEmail(billing.email)) {
        errorObj['billing.email'] = `billing.email must be valid Email in /${action}`
      }

      if (!billing.phone) {
        errorObj['billing.phone'] = `billing.phone must be present in /${action}`
      } else if (!isValidPhoneNumber(billing.phone)) {
        errorObj['billing.phone'] = `billing.phone must be valid Phone Number in /${action}`
      }
    }
  } catch (error: any) {
    logger.error(`!!Error in billing of /${action}`)
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
    //seprate the start & end else if blocks
    if (!provider?.time) errorObj.prvdrIdTime = `Provider Time is Missing in /${constants.ON_INIT}`
    if (provider?.time && !provider?.time?.range)
      errorObj.prvdrTimeRange = `Provider Time Range is Missing in /${constants.ON_INIT}`
    if (provider?.time?.range && !provider?.time?.range?.start)
      errorObj.prvdrTimeRangeStart = `Provider Time Range Start is Missing in /${constants.ON_INIT}`
    if (provider?.time?.range && !provider?.time?.range?.end)
      errorObj.prvdrTimeRangeEnd = `Provider Time Range End is Missing in /${constants.ON_INIT}`
    if (provider?.time?.range?.start && !isValidDateTime(provider?.time?.range?.start))
      errorObj.prvdrStartFormat = `Range.start Time Format is Invalid in /${constants.ON_INIT}`
    if (provider?.time?.range?.end && !isValidDateTime(provider?.time?.range?.end))
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
