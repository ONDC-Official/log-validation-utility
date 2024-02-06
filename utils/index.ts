/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import { logger } from '../shared/logger'
import constants, { statusArray } from '../constants'
import schemaValidator from '../shared/schemaValidator'

export const isoUTCTimestamp = '^d{4}-d{2}-d{2}Td{2}:d{2}:d{2}(.d{1,3})?Z$'

export const getObjValues = (obj: any) => {
  let values = ''
  Object.values(obj).forEach((value) => {
    values += `- ${value}\n`
  })
  return values
}

export const timestampCheck = (date: string): any => {
  const dateParsed: any = new Date(Date.parse(date))
  if (!isNaN(dateParsed)) {
    if (dateParsed.toISOString() != date) {
      //FORMAT_ERR= Valid date but not in RFC 3339 format
      return { err: 'FORMAT_ERR' }
    }
  } else {
    //INVLD_DT= Invalid date-time format
    return { err: 'INVLD_DT' }
  }
}

export const checkContext = (
  data: { transaction_id: string; message_id: string; action: string; ttl: string; timestamp: string },
  path: any,
) => {
  if (!data) return
  const errObj: any = {}

  //Transaction ID != Message ID
  if (data.transaction_id === data.message_id) {
    errObj.id_err = "transaction_id and message id can't be same"
  }

  if (data.action != path) {
    errObj.action_err = `context.action should be ${path}`
  }

  if (data.ttl && data.ttl != constants.RET_CONTEXT_TTL) {
    {
      errObj.ttl_err = `ttl = ${constants.RET_CONTEXT_TTL} as per the API Contract`
    }
  }

  if (data.timestamp) {
    const date = data.timestamp
    const result = timestampCheck(date)
    if (result && result.err === 'FORMAT_ERR') {
      errObj.timestamp_err = 'Timestamp not in RFC 3339 (YYYY-MM-DDTHH:MN:SS.MSSZ) Format'
    } else if (result && result.err === 'INVLD_DT') {
      errObj.timestamp_err = 'Timestamp should be in date-time format'
    }
  }

  if (_.isEmpty(errObj)) {
    const result = { valid: true, SUCCESS: 'Context Valid' }
    return result
  } else {
    const result = { valid: false, ERRORS: errObj }
    return result
  }
}

export const checkFISContext = (
  data: {
    transaction_id: string
    message_id: string
    action: string
    ttl: string
    timestamp: string
    bppUri: string
    bppId: string
    bapId: string
    bapUri: string
  },
  path: any,
) => {
  if (!data) return
  const errObj: any = {}

  //Transaction ID != Message ID
  if (data.transaction_id === data.message_id) {
    errObj.id_err = "transaction_id and message id can't be same"
  }

  if (data.action != path) {
    errObj.action_err = `context.action should be ${path}`
  }

  if (!data.ttl) {
    errObj.ttl_err = 'ttl is required in the context'
  } else {
    const ttlRegex = /^PT(\d+M|\d+H\d+M|\d+H|\d+S)$/
    if (!ttlRegex.test(data.ttl)) {
      errObj.ttl_err = 'Invalid TTL format. Should be in the format PT10M.'
    }
  }

  if (data.timestamp) {
    const date = data.timestamp
    const result = timestampCheck(date)
    if (result && result.err === 'FORMAT_ERR') {
      errObj.timestamp_err = 'Timestamp not in RFC 3339 (YYYY-MM-DDTHH:MN:SS.MSSZ) Format'
    } else if (result && result.err === 'INVLD_DT') {
      errObj.timestamp_err = 'Timestamp should be in date-time format'
    }
  }

  if (_.isEmpty(errObj)) {
    const result = { valid: true, SUCCESS: 'Context Valid' }
    return result
  } else {
    const result = { valid: false, ERRORS: errObj }
    return result
  }
}

export const checkMobilityContext = (
  data: { transaction_id: string; message_id: string; action: string; ttl: string; timestamp: string },
  path: any,
) => {
  if (!data) return
  const errObj: any = {}
  if (data.transaction_id === data.message_id) {
    errObj.id_err = "transaction_id and message id can't be same"
  }

  if (data.action != path) {
    errObj.action_err = `context.action should be ${path}`
  }

  if (!data.ttl) {
    errObj.ttl_err = 'ttl is required in the context'
  } else {
    const ttlRegex = /^PT(\d+M|\d+H\d+M|\d+H|\d+S)$/
    if (!ttlRegex.test(data.ttl)) {
      errObj.ttl_err = 'Invalid TTL format. Should be in the format PT10M.'
    }
  }

  if (data.timestamp) {
    const date = data.timestamp
    const result = timestampCheck(date)
    if (result && result.err === 'FORMAT_ERR') {
      errObj.timestamp_err = 'Timestamp not in RFC 3339 (YYYY-MM-DDTHH:MN:SS.MSSZ) Format'
    } else if (result && result.err === 'INVLD_DT') {
      errObj.timestamp_err = 'Timestamp should be in date-time format'
    }
  }

  if (_.isEmpty(errObj)) {
    const result = { valid: true, SUCCESS: 'Context Valid' }
    return result
  } else {
    const result = { valid: false, ERRORS: errObj }
    return result
  }
}

export const checkMetroContext = (
  data: { transaction_id: string; message_id: string; action: string; ttl: string; timestamp: string },
  path: any,
) => {
  if (!data) return
  const errObj: any = {}
  if (data.transaction_id === data.message_id) {
    errObj.id_err = "transaction_id and message id can't be same"
  }

  if (data.action != path) {
    errObj.action_err = `context.action should be ${path}`
  }

  if (!data.ttl) {
    {
      errObj.ttl_err = `ttl should be present in context`
    }
  }

  if (data.timestamp) {
    const date = data.timestamp
    const result = timestampCheck(date)
    if (result && result.err === 'FORMAT_ERR') {
      errObj.timestamp_err = 'Timestamp not in RFC 3339 (YYYY-MM-DDTHH:MN:SS.MSSZ) Format'
    } else if (result && result.err === 'INVLD_DT') {
      errObj.timestamp_err = 'Timestamp should be in date-time format'
    }
  }

  if (_.isEmpty(errObj)) {
    const result = { valid: true, SUCCESS: 'Context Valid' }
    return result
  } else {
    const result = { valid: false, ERRORS: errObj }
    return result
  }
}


const validate_schema_for_retail_json = (vertical: string, api: string, data: any) => {
  const res = (schemaValidator as any)[`validate_schema_${api}_${vertical}_for_json`](data)

  return res
}

export const validateSchema = (domain: string, api: string, data: any) => {
  logger.info(`Inside Schema Validation for domain: ${domain}, api: ${api}`)
  const errObj: any = {}

  const schmaVldtr = validate_schema_for_retail_json(domain, api, data)

  const datavld = schmaVldtr
  if (datavld.status === 'fail') {
    const res = datavld.errors
    let i = 0
    const len = res.length
    while (i < len) {
      const key = `schemaErr${i}`
      errObj[key] = `${res[i].details} ${res[i].message}`
      i++
    }

    return errObj
  } else return 'error'
}

const getDecimalPrecision = (numberString: string) => {
  const parts = numberString.trim().split('.')
  if (parts.length === 2) {
    return parts[1].length
  } else {
    return 0
  }
}

export const checkGpsPrecision = (coordinates: string) => {
  try {
    const [lat, long] = coordinates.split(',')
    const latPrecision = getDecimalPrecision(lat)

    const longPrecision = getDecimalPrecision(long)
    const decimalPrecision = constants.DECIMAL_PRECISION

    if (latPrecision >= decimalPrecision && longPrecision >= decimalPrecision) {
      return 1
    } else return 0
  } catch (error) {
    logger.error(error)
    return error
  }
}

export const checkTagConditions = (message: any, context: any) => {
  const tags = []
  if (message.intent?.tags) {
    const catalogIncTags = message.intent.tags.find(
      (tag: { code: string; value: string }) => tag.code === 'catalog_inc',
    )

    if (catalogIncTags) {
      const startTimeTag = catalogIncTags.list.find((tag: { code: string; value: string }) => tag.code === 'start_time')
      const endTimeTag = catalogIncTags.list.find((tag: { code: string; value: string }) => tag.code === 'end_time')

      const modeTag = catalogIncTags.list.find((tag: { code: string; value: string }) => tag.code === 'mode')

      if (modeTag && modeTag.value !== 'start' && modeTag.value !== 'stop') {
        tags.push('/message/intent/tags/list/value should be one of start or stop')
      }

      if (startTimeTag && endTimeTag) {
        const startTime = new Date(startTimeTag.value).getTime()
        const endTime = new Date(endTimeTag.value).getTime()
        const contextTime = new Date(context.timestamp).getTime()

        if (startTime >= contextTime) {
          tags.push('/message/intent/tags/list/start_time/value cannot be greater than or equal to /context/timestamp')
        }

        if (endTime > contextTime) {
          tags.push('/message/intent/tags/list/end_time/value cannot be greater than /context/timestamp')
        }

        if (endTime <= startTime) {
          tags.push(
            '/message/intent/tags/list/end_time/value cannot be less or equal to than /message/intent/tags/list/start_time/value',
          )
        }
      }
    }
  } else {
    tags.push('/message/intent should have a required property tags')
  }

  return tags.length ? tags : null
}

export const timeDiff = (time1: any, time2: any) => {
  const dtime1: any = new Date(time1)
  const dtime2: any = new Date(time2)

  if (isNaN(dtime1 - dtime2)) return 0
  else return dtime1 - dtime2
}

export const emailRegex = (email: string) => {
  const emailRE = /^\S+@\S+\.\S+$/
  return emailRE.test(email)
}

export const hasProperty = (object: any, propetyName: string) => {
  return Object.prototype.hasOwnProperty.call(object, propetyName)
}

export const isObjectEmpty = (obj: any) => {
  return Object.keys(obj).length === 0
}

export const isoDurToSec = (duration: string) => {
  const durRE = /P((\d+)Y)?((\d+)M)?((\d+)W)?((\d+)D)?T?((\d+)H)?((\d+)M)?((\d+)S)?/

  const splitTime = durRE.exec(duration)
  if (!splitTime) {
    return 0
  }

  const years = Number(splitTime?.[2]) || 0
  const months = Number(splitTime?.[4]) || 0
  const weeks = Number(splitTime?.[6]) || 0
  const days = Number(splitTime?.[8]) || 0
  const hours = Number(splitTime?.[10]) || 0
  const minutes = Number(splitTime?.[12]) || 0
  const seconds = Number(splitTime?.[14]) || 0

  const result =
    years * 31536000 + months * 2628288 + weeks * 604800 + days * 86400 + hours * 3600 + minutes * 60 + seconds

  return result
}

export const isObjectEqual = (obj1: any, obj2: any, parentKey: string = ''): string[] => {
  const typeOfObj1 = typeof obj1
  const typeOfObj2 = typeof obj2

  if (typeOfObj1 !== typeOfObj2) {
    return [parentKey]
  }

  if (typeOfObj1 !== 'object' || obj1 === null || obj2 === null) {
    return obj1 === obj2 ? [] : [parentKey]
  }

  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) {
      return [parentKey]
    }

    const sortedObj1 = [...obj1].sort()
    const sortedObj2 = [...obj2].sort()

    for (let i = 0; i < sortedObj1.length; i++) {
      const nestedKeys = isObjectEqual(sortedObj1[i], sortedObj2[i], `${parentKey}[${i}]`)
      if (nestedKeys.length > 0) {
        return nestedKeys
      }
    }

    return []
  }

  const obj1Keys = Object.keys(obj1)
  const obj2Keys = Object.keys(obj2)

  const allKeys = [...new Set([...obj1Keys, ...obj2Keys])]

  const notEqualKeys: string[] = []

  for (const key of allKeys) {
    if (!obj2.hasOwnProperty(key) || !obj1.hasOwnProperty(key)) {
      notEqualKeys.push(parentKey ? `${parentKey}/${key}` : key)
      continue
    }

    const nestedKeys = isObjectEqual(obj1[key], obj2[key], parentKey ? `${parentKey}/${key}` : key)

    if (nestedKeys.length > 0) {
      notEqualKeys.push(...nestedKeys)
    }
  }

  return notEqualKeys
}

export function checkItemTag(item: any, itemArray: any[]) {
  for (const tag of item.tags) {
    if (tag.code === 'parent') {
      for (const list of tag.list) {
        if (list.code === 'id' && !itemArray.includes(list.value)) {
          return true
        }
      }
    }
  }

  return false
}

export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true
  }

  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false
    }
  }

  return true
}

export const compareCoordinates = (coord1: any, coord2: any) => {
  // Remove all spaces from the coordinates
  const cleanCoord1 = coord1.replace(/\s/g, '')
  const cleanCoord2 = coord2.replace(/\s/g, '')

  // Compare the cleaned coordinates
  return cleanCoord1 === cleanCoord2
}

export const compareQuote = (quote1: any, quote2: any): boolean => {
  const quoteString1 = JSON.stringify(quote1, replaceValueType)
  const quoteString2 = JSON.stringify(quote2, replaceValueType)
  return quoteString1 === quoteString2
}

const replaceValueType = (key: any, value: any): number => {
  if (key == 'value') return parseInt(value)
  else return value
}

export const checkBppIdOrBapId = (input: string, type?: string) => {
  try {
    if (!input) {

      return `${type} Id is not present`
    }

    if (input?.includes('https://') || input.includes('www') || input.includes('https:') || input.includes('http'))
      return `context/${type}_id should not be a url`
  } catch (e) {
    return e
  }
}

export function checkServiceabilityType(tags: any[]) {
  for (let i = 0; i < tags.length; i++) {
    if (tags[i].code === 'serviceability') {
      for (let j = 0; j < tags[i].list.length; j++) {
        if (tags[i].list[j].code === 'type' && tags[i].list[j].value === '10') {
          return true
        }
      }
    }
  }

  return false
}

export function validateLocations(locations: any[], tags: any[]) {
  const errorObj = {}
  const validNumberRegex = /^[0-9]+$/
  for (let i = 0; i < locations.length; i++) {
    const location = locations[i]
    if (!location.circle) {
      Object.assign(errorObj, { locationErr: `"circle" not present in location with ID ${location.id}` })
    }

    const radius = location?.circle.radius

    if (radius && (radius?.unit !== 'km' || !validNumberRegex.test(radius.value))) {
      Object.assign(errorObj, { locationRadiusErr: `Invalid radius in location with ID ${location.id}` })
    }

    for (let i = 0; i < tags.length; i++) {
      if (tags[i].code === 'serviceability') {
        for (let j = 0; j < tags[i].list.length; j++) {
          if (tags[i].list[j].code === 'val' && tags[i].list[j].value !== radius.value) {
            Object.assign(errorObj, {
              srvcabilityValErr: `value passed in serviceability tags should be same as passed in location/circle`,
            })
          }
        }
      }
    }
  }

  return errorObj
}

export function isSequenceValid(set: any) {
  const numbers: any = Array.from(set)

  if (numbers.length < 2) {
    return
  }

  numbers.sort((a: number, b: number) => a - b) // Sort the numbers in ascending order.

  for (let i = 1; i < numbers.length; i++) {
    const current = parseInt(numbers[i])
    const previous = parseInt(numbers[i - 1])

    if (current !== previous + 1) {
      return false
    }
  }

  return true
}

export function findItemByItemType(item: any) {
  const tags = item.tags
  if (tags) {
    for (let j = 0; j < tags.length; j++) {
      if (
        tags[j].code === 'type' &&
        tags[j].list &&
        tags[j].list.length === 1 &&
        tags[j].list[0].code === 'type' &&
        tags[j].list[0].value === 'item'
      ) {
        return item
      }
    }
  }

  return null
}

export function isTagsValid(tags: any[], entity: string): boolean {
  const termsObject = tags.find((tag: { code: string }) => tag.code === entity)

  // If termsObject is found, check the list
  if (termsObject) {
    const taxNumberObject = termsObject.list.find((item: { code: string }) => item.code === 'tax_number')

    // If taxNumberObject is found, validate the value
    if (taxNumberObject) {
      const value = taxNumberObject.value

      if (typeof value === 'string' && value.length <= 15) {
        return true // Value is valid
      }
    }
  }

  return false
}

export function areGSTNumbersMatching(tags1: any[], tags2: any[], termToMatch: string): boolean {
  // Find the GST number in the first tags array based on the specified term
  const gstNumber1 = findGSTNumber(tags1, termToMatch)

  // Find the GST number in the second tags array based on the specified term
  const gstNumber2 = findGSTNumber(tags2, termToMatch)

  // Check if both GST numbers are the same

  if (typeof gstNumber2 === 'string' && typeof gstNumber1 === 'string') return gstNumber1 === gstNumber2
  else return false
}

export function areGSTNumbersDifferent(tags: any[]): boolean {
  // Find the "tax_number" in "bpp_terms"
  const bppTermsObject = tags.find((tag) => tag.code === 'bpp_terms')
  const bppTaxNumber = findTaxNumber(bppTermsObject)

  // Find the "tax_number" in "bap_terms"
  const bapTermsObject = tags.find((tag) => tag.code === 'bap_terms')
  const bapTaxNumber = findTaxNumber(bapTermsObject)

  // Check if both "tax_number" values are different
  if (typeof bppTaxNumber === 'string' && typeof bapTaxNumber === 'string') return bppTaxNumber === bapTaxNumber
  else return false
}

function findTaxNumber(termObject: any): string | undefined {
  if (termObject) {
    const taxNumberObject = termObject.list.find((item: { code: string }) => item.code === 'tax_number')

    if (taxNumberObject) {
      const value = taxNumberObject.value

      if (typeof value === 'string') {
        return value
      }
    }
  }

  return undefined
}

function findGSTNumber(tags: any[], termToMatch: string): string | undefined {
  // Find the object with the specified term
  const termObject = tags.find((tag) => tag.code === termToMatch)

  // If termObject is found, check the list for the GST number
  if (termObject) {
    const taxNumberObject = termObject.list.find((item: { code: string }) => item.code === 'tax_number')

    // If taxNumberObject is found, return the GST number
    if (taxNumberObject) {
      const value = taxNumberObject.value

      if (typeof value === 'string' && value.length <= 15) {
        return value // Return the GST number
      }
    }
  }

  return undefined // GST number not found or not valid
}

export function areTimestampsLessThanOrEqualTo(timestamp1: string, timestamp2: string): boolean {
  const date1 = new Date(timestamp1).getTime()
  const date2 = new Date(timestamp2).getTime()
  return date1 <= date2
}

export function validateStatusOrderAndTimestamp(set: any) {
  const errObj: any = {}
  let previousTimestamp = null
  let previousStatusIndex = -1

  for (const obj of set) {
    if (!obj.hasOwnProperty('status') || !obj.hasOwnProperty('timestamp')) {
      errObj.status = `on_status calls must have either of following status ${statusArray}`
    }

    const statusIndex = statusArray.indexOf(obj.status)
    if (statusIndex === -1 || statusIndex < previousStatusIndex) {
      errObj.status = `on_status calls must have their order state in inc. order of Pending, Packed, Agent-assigned, Order-picked-up, Out-for-delivery, Order-delivered, Cancelled`
    }

    if (obj.timestamp < previousTimestamp) {
      errObj.time = `Timestamp on previous on_status call shouldn't be greater than timestamp on current on_status ${previousTimestamp} && ${obj.timestamp}`
    }

    previousStatusIndex = statusIndex
    previousTimestamp = obj.timestamp
  }

  if (_.isEmpty(errObj)) {
    const result = { valid: true, SUCCESS: 'Valid order states' }
    return result
  } else {
    const result = { valid: false, ERRORS: errObj }
    return result
  }
}

export const isValidEmail = (value: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

export const isValidPhoneNumber = (value: string): boolean => {
  const phoneRegex = /^(\d{10}|\d{11})$/
  const val = value?.replace(/[^\d]/g, '')
  return phoneRegex.test(val)
}

export const isValidUrl = (url: string) => {
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(:[0-9]+)?([/\w.-]*)*\/?$/
  return urlRegex.test(url)
}

export const checkIdAndUri = (id: string, uri: string, type: string) => {
  try {
    const errors: string[] = []

    if (!id) {
      errors.push(`${type}_id is not present`)
    }

    if (id && uri) {
      const idDomain = id.split('.')[0]
      const uriDomain = new URL(uri).hostname.split('.')[0]

      if (idDomain !== uriDomain) {
        errors.push(`${type}_id (${idDomain}) should be the domain part of ${type}_uri (${uriDomain})`)
      }
    }

    if (id && (id.includes('https://') || id.includes('www') || id.includes('https:') || id.includes('http'))) {
      errors.push(`context/${type}_id should not be a URL`)
    }

    return errors.length > 0 ? errors.join(', ') : null
  } catch (e: any) {
    return e.message || 'An error occurred during validation'
  }
}

export function compareObjects(obj1: any, obj2: any, parentKey?: string): string[] {
  const errors: string[] = []

  // Check if obj1 or obj2 is undefined or null
  if (obj1 === null || obj1 === undefined || obj2 === null || obj2 === undefined) {
    errors.push('One of the objects is undefined or null')
    return errors
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  // Check for key length mismatch
  if (keys1.length !== keys2.length) {
    errors.push(`Key length mismatch for ${parentKey || 'root'}`)
    return errors // Stop comparing if key length mismatch is detected
  }

  for (const key of keys1) {
    const fullKey = parentKey ? `${parentKey}.${key}` : key

    if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
      const nestedErrors = compareObjects(obj1[key], obj2[key], fullKey)
      errors.push(...nestedErrors)
    } else if (obj1[key] !== obj2[key]) {
      errors.push(`Key '${fullKey}' mismatch: ${obj1[key]} !== ${obj2[key]}`)
    }
  }

  return errors
}
