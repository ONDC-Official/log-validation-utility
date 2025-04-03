import { validatePaymentTags } from '../../tags'
import constants, { metroSequence } from '../../../../constants'
import { logger } from '../../../../shared/logger'
import { getValue, setValue } from '../../../../shared/dao'
import _, { isEmpty, isNil } from 'lodash'
// import { METRODOMAIN } from './functions/constant'

export function checkItemQuantity(quantity: { [key: string]: any }, i: number, j: number) {
  const errorObj: any = {}
  if (!quantity) {
    errorObj[`prvdr${i}item${j}_quantity`] = `Quantity is missing in /providers[${i}]/items[${j}]`
    return errorObj
  }

  if (!quantity?.selected?.count) {
    errorObj[`prvdr${i}item${j}_quantity_selected`] =
      `attribute selected.count is missing in /providers[${i}]/items[${j}]`
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
  } else if (time?.label !== 'JOURNEY_TIME')
    errorObj[`prvdr${i}item${j}time.label`] =
      `label should be equal to 'JOURNEY_TIME' at /providers[${i}]/items[${j}].time`

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

export function checkItemsExist(items: any, newItemIDSValue: any, action: string) {
  const errorObj: any = {}
  try {
    if (!items || items?.length === 0) {
      errorObj['items'] = `/message/order/items is missing in ${action}`
    } else {
      logger.info(`Comparing item in /${action}`)
      items?.forEach((item: any, index: number) => {
        if (!item?.id) errorObj['itemId'] = `/message/order/items/id in ${index}: Item Id is Missing in ${action}`
        else {
          const getItemCount = getValue(`quantity_count`)
          if (isNil(getItemCount)) setValue(`quantity_count`, getItemCount)

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

interface BillingValidationResult {
  [key: string]: string
}

interface BillingInfo {
  name?: string
  email?: string
  phone?: string
}

export function checkBilling(billing: BillingInfo, action: string): BillingValidationResult {
  const errorObj: BillingValidationResult = {}

  if (!billing) {
    return errorObj
  }

  try {
    // Validate name
    if (!billing.name?.trim()) {
      errorObj['billing.name'] = `billing name must be present in /${action}`
    } else {
      setValue('billingName', billing.name)
    }

    // Validate email
    if (!billing.email?.trim()) {
      errorObj['billing.email'] = `billing/email must be present in /${action}`
    } else if (!isValidEmail(billing.email)) {
      errorObj['billing.email'] = `billing/email must be valid Email in /${action}`
    }

    // Validate phone
    if (!billing.phone?.trim()) {
      errorObj['billing.phone'] = `billing/phone must be present in /${action}`
    } else if (!isValidPhoneNumber(billing.phone)) {
      errorObj['billing.phone'] = `billing/phone must be valid Phone Number in /${action}`
    }
  } catch (error) {
    logger.error(
      `Error validating billing info for /${action}: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }

  return errorObj
}

function isValidEmail(email: string) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

function isValidPhoneNumber(phoneNumber: string) {
  const phoneRegex = /^(?:\+91-)?\d{10}$/
  return phoneRegex.test(phoneNumber)
}

export function checkProviderTime(provider: any) {
  const errorObj: any = {}
  const { time } = provider || {}
  const { range } = time || {}

  if (!time) {
    errorObj.prvdrIdTime = `Provider Time is Missing in /${constants.ON_INIT}`
    return errorObj
  }
  if (!range) {
    errorObj.prvdrTimeRange = `Provider Time Range is Missing in /${constants.ON_INIT}`
    return errorObj
  }

  const { start, end } = range

  if (!start) {
    errorObj.prvdrTimeRangeStart = `Provider Time Range Start is Missing in /${constants.ON_INIT}`
  } else if (!isValidDateTime(start)) {
    errorObj.prvdrStartFormat = `Range.start Time Format is Invalid in /${constants.ON_INIT}`
  }

  if (!end) {
    errorObj.prvdrTimeRangeEnd = `Provider Time Range End is Missing in /${constants.ON_INIT}`
  } else if (!isValidDateTime(end)) {
    errorObj.prvdrEndFormat = `Range.end Time Format is Invalid in /${constants.ON_INIT}`
  }

  return errorObj
}

function isValidDateTime(dateTimeString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
  return regex.test(dateTimeString)
}

export function validateFarePolicyTags(tags: { [key: string]: any }[], i: number, j: number, action: string) {
  const errorObj: string[] = []
  try {
    tags?.forEach((tag) => {
      if (tag?.descriptor?.code !== 'FARE_POLICY')
        errorObj.push(`Tag descriptor code should be 'FARE_POLICY' in /providers[${i}]/items[${j}]`)
      else {
        let hasRestrictedPerson = false
        let hasRestrictedProof = false

        tag?.list?.forEach((item: any, itemIndex: number) => {
          const descriptorCode = item.descriptor.code

          // Check if descriptor code is not in uppercase
          if (descriptorCode !== descriptorCode.toUpperCase()) {
            errorObj.push(`Code should be in uppercase at Fare Policy Tag[${i}], List item[${itemIndex}].`)
          }

          // Validate known descriptor codes
          if (descriptorCode?.toUpperCase() === 'RESTRICTED_PERSON') {
            hasRestrictedPerson = true // Mark ROUTE_ID as found
            if (typeof item.value !== 'string') {
              errorObj.push(
                `Fare Policy Tag[${i}], List item[${itemIndex}] has an invalid value for RESTRICTED_PERSON. It should be a string.`,
              )
            }
          }
          if (descriptorCode?.toUpperCase() === 'RESTRICTED_PROOF') {
            hasRestrictedProof = true // Mark ROUTE_DIRECTION as found
            if (typeof item.value !== 'string') {
              errorObj.push(
                `Fare Policy Tag[${i}], List item[${itemIndex}] has an invalid value for RESTRICTED_PROOF. It should be a string.`,
              )
            }
          }
        })

        // Check if both RESTRICTED_PERSON and RESTRICTED_PROOF are present
        if (!hasRestrictedPerson) {
          errorObj.push(`Fare Policy tag[${i}] is missing RESTRICTED_PERSON.`)
        }

        if (!hasRestrictedProof) {
          errorObj.push(`Fare Policy tag[${i}] is missing RESTRICTED_PROOF.`)
        }
      }
    })
  } catch (error: any) {
    logger.error(`!!Error in Provider Time of /${action}`)
  }

  return errorObj
}

export function validateParams(
  params: { [key: string]: any },
  collected_by: string,
  action: string,
  payment_type: string = 'UPI',
) {
  const errorObj: any = {}
  const requiredParams = ['bank_code', 'bank_account_number']
  const collectedBy = collected_by.toUpperCase()

  try {
    // Early return if params validation is not required
    if (
      (action === constants.INIT && collectedBy === 'BAP') ||
      (action === constants.ON_INIT && collectedBy === 'BPP')
    ) {
      if (params && !isEmpty(params))
        errorObj.payment_params = `params must not be present in /${action} if collector is ${collected_by}.`
      else if (params && isEmpty(params))
        errorObj.payment_params = `params object must not be present and non-empty in /${action} if collector is ${collected_by}`

      return errorObj
    }

    // Check if params exist when required
    if (!params || isEmpty(params)) {
      errorObj.payment_params = `params object must be present and non-empty in /${action}`

      return errorObj
    }

    // Validate required parameters
    let requiredParmsToCheck = action?.includes(constants.INIT)
      ? requiredParams
      : [...requiredParams, 'amount', 'currency', 'transaction_id']

    requiredParmsToCheck =
      payment_type === 'UPI' ? [...requiredParmsToCheck, 'virtual_payment_address'] : requiredParmsToCheck

    for (const param of requiredParmsToCheck) {
      if (!(param in params)) {
        errorObj[`payment_params_${param}`] = `params.${param} must be present in /${action}`

        continue
      }

      const storedValue = getValue(`payment_${param}`)
      if (isNil(storedValue)) setValue(`payment_${param}`, params[param])
      else if (storedValue !== params[param])
        errorObj[`payment_params_${param}`] = `params.${param} must be same as sent in previous call.`
    }

    return errorObj
  } catch (error) {
    logger.info(`Error validating params in /${action}`)
    return errorObj
  }
}

export function validateFulfillmentV2_0(
  fulfillment: any,
  errorObj: any,
  action: string,
  flow: { flow: string; flowSet: string },
) {
  try {
    console.log(flow)
    const getItemCount = getValue(`quantity_count`) ?? 0
    if (fulfillment?.length !== Number(getItemCount) + 1)
      errorObj.fulfillment = `fulfillment length must be count ${Number(getItemCount) + 1} in /${action}`
    else {
      fulfillment.forEach((item: any, index: number) => {
        if (!item?.id) errorObj.fulfillment = `fulfillment[${index}] must have id in /${action}`
      })
    }
  } catch (error) {
    logger.info(`Error validating fulfillment in /${action}`)
    return errorObj
  }
}

export function validateDomain(domainName: string) {
  return domainName === 'METRO' ? true : false
}

export function validateFulfillmentStops(stops: any) {
  const errorObj: Record<string, string[]> = {}

  const stopTypes = new Set<string>()

  for (const stop of stops) {
    if (!stop?.type) {
      if (!errorObj['stops']) errorObj['stops'] = []
      errorObj['stops'].push("Each stop must have a 'type' (START or END)")
    } else {
      stopTypes.add(stop.type)
    }
  }

  if (!stopTypes.has('START') && !stopTypes.has('END')) {
    return { stops: ["Stops must include both 'START' and 'END' types"] }
  }

  if (!stopTypes.has('START')) {
    errorObj['stops'] = ["Stops must include a 'START' type"]
  } else if (!stopTypes.has('END')) {
    errorObj['stops'] = ["Stops must include an 'END' type"]
  }

  return Object.keys(errorObj).length ? errorObj : null
}

export function validateQuotePricing(quote: any) {
  const errorObj: Record<string, string> = {};
  let calculatedTotal = 0;

  for (const item of quote.breakup) {
    const itemPrice = parseFloat(item?.price?.value) || 0;
    calculatedTotal += itemPrice;

    if (item.item?.quantity?.selected?.count) {
      const quantity = item.item.quantity.selected.count || 0;
      const individualPrice = parseFloat(item.item?.price?.value) || 0;
      const expectedPrice = quantity * individualPrice;
      if (expectedPrice !== itemPrice) {
        errorObj[`quote:${item.item.id}`|| "unknown"] = `Mismatch in price calculation: Expected ${expectedPrice}, Found ${itemPrice}`;
      }
    }
  }
  console.log('Calculated Total Price: ', calculatedTotal);
  console.log('Given Total Price: ', quote?.price?.value)

  const totalPrice = parseFloat(quote?.price?.value) || 0;
  if (calculatedTotal !== totalPrice) {
    errorObj["quote:total"] = `Total price mismatch: Expected ${totalPrice}, Calculated ${calculatedTotal}`;
  }

  if (Object.keys(errorObj).length) {
    return { success: false, data: errorObj };
  }
  return { success: true, data: "Validation successful" };
}

export function compareItems(items: any[], storedItemIDS: string[]): { success: boolean; data: Record<string, string> } {
  const parentItems: Record<string, number> = {};
  const childItems: Record<string, number> = {};
  const errorObj: Record<string, string> = {};
  
  items.forEach((item: any, index: number) => {
    const itemId = item.id;
    const parentItemId = item.parent_item_id;
    const itemCount = item?.quantity?.selected?.count || 0;

    if (itemId) {
      parentItems[itemId] = itemCount;
    } else if (parentItemId) {
      if (itemCount !== 1) {
        errorObj[`item[${parentItemId}].quantity_count`] =
          `Parent item ${parentItemId} should have total selected count of 1`;
      }
      childItems[parentItemId] = (childItems[parentItemId] || 0) + 1;
    }
    
    if (storedItemIDS && !storedItemIDS.includes(itemId)) {
      errorObj[`item[${index}].item_id`] =
        `/message/order/items/id in item: ${itemId} should be one of the /item/id mapped in previous call`;
    }
  });

  Object.keys(childItems).forEach((parentId) => {
    if (parentItems[parentId] !== childItems[parentId]) {
      errorObj[`item[${parentId}].quantity_count`] =
        `Parent item ${parentId} has total count ${parentItems[parentId]}, but child items sum up to ${childItems[parentId]}`;
    }
  });

  return {
    success: Object.keys(errorObj).length === 0,
    data: errorObj,
  };
}

export function processFulfillments(fulfillments : any) {
  let tripDetails = null;
  let ticketCount = 0;
  let totalSeatPrice = 0;
  let seatNumbers : any = [];
  
  fulfillments.forEach((fulfillment : any) => {
      if (fulfillment.type === "TRIP") {
          tripDetails = {
              id: fulfillment.id,
              vehicleCategory: fulfillment.vehicle?.category || "",
              vehicleCode: fulfillment.vehicle?.code || "",
              operatedBy: fulfillment.tags?.find((tag : any) => tag.descriptor?.code === "INFO")?.list?.find((item : any) => item.descriptor?.code === "OPERATED_BY")?.value || "",
              stops: fulfillment.stops?.map((stop : any) => ({
                  id: stop.id,
                  type: stop.type,
                  location: stop.location?.descriptor?.name || "",
                  code: stop.location?.descriptor?.code || "",
                  timestamp: stop.time?.timestamp || ""
              })) || []
          };
      }
      
      if (fulfillment.type === "TICKET") {
          ticketCount++;
          let seatPrice = 0;
          let seatNumber = "";
          
          fulfillment.tags?.forEach((tag : any) => {
              if (tag.descriptor?.code === "SEAT_GRID") {
                  tag.list?.forEach((item : any) => {
                      if (item.descriptor?.code === "SEAT_PRICE") {
                          seatPrice = parseFloat(item.value) || 0;
                      }
                      if (item.descriptor?.code === "SEAT_NUMBER") {
                          seatNumber = item.value;
                      }
                  });
              }
          });
          totalSeatPrice += seatPrice;
          if (seatNumber) {
              seatNumbers.push(seatNumber);
          }
      }
  });
  
  return {
      tripDetails,
      ticketCount,
      totalSeatPrice,
      seatNumbers
  };
}

