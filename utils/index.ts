/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import { logger } from '../shared/logger'
import constants, { ApiSequence, statusArray } from '../constants'
import schemaValidator from '../shared/schemaValidator'
import data from '../constants/AreacodeMap.json'
import { reasonCodes } from '../constants/reasonCode'
import { InputObject } from '../shared/interface'
import { setValue } from '../shared/dao'
export const isoUTCTimestamp = '^d{4}-d{2}-d{2}Td{2}:d{2}:d{2}(.d{1,3})?Z$'
import { groceryCategoryMappingWithStatutory } from '../constants/category'
import { statutory_reqs } from './enum'

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
  try {
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
  } catch (e: any) {
    logger.error(`Some error occured while validating schema, ${e.stack}`)
  }
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

export const checkSixDigitGpsPrecision = (coordinates: string) => {
  try {
    const [lat, long] = coordinates.split(',')
    const latPrecision = getDecimalPrecision(lat)
    const longPrecision = getDecimalPrecision(long)
    const decimalPrecision = constants.DECIMAL_PRECISION

    if (latPrecision === decimalPrecision && longPrecision === decimalPrecision) {
      return true
    } else {
      return false
    }
  } catch (error) {
    logger.error(error)
    return false
  }
}

export const checkTagConditions = (message: any, context: any, apiSeq: string) => {
  const tags = []
  if (message.intent?.tags) {
    const catalogIncTags = message.intent.tags.find(
      (tag: { code: string; value: string }) => tag.code === 'catalog_inc',
    )

    if (catalogIncTags) {
      const startTimeTag = catalogIncTags.list.find((tag: { code: string; value: string }) => tag.code === 'start_time')
      const endTimeTag = catalogIncTags.list.find((tag: { code: string; value: string }) => tag.code === 'end_time')

      const modeTag = catalogIncTags.list.find((tag: { code: string; value: string }) => tag.code === 'mode')

      if (modeTag) {
        setValue('multiIncSearch', 'true')
      }

      if (modeTag && apiSeq == ApiSequence.INC_SEARCH) {
        if (modeTag.value === 'start' || modeTag.value === 'stop') {
          setValue(`${ApiSequence.INC_SEARCH}_push`, true)
        }
      }

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
  if (item.tags) {
    for (const tag of item.tags) {
      if (tag.code === 'parent') {
        for (const list of tag.list) {
          if (list.code === 'id' && !itemArray.includes(list.value)) {
            return true
          }
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
  if (!coord1 || !coord2) return false
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

    if (
      input?.startsWith('https://') ||
      input.startsWith('www') ||
      input.startsWith('https:') ||
      input.startsWith('http')
    )
      return `context/${type}_id should not be a url`
    return
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
              srvcabilityValErr: `value passed in serviceability tags[${i}] should be same as passed in location/circle`,
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
  try {
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
  } catch (error: any) {
    logger.error(`Error in finding GST number: ${error.stack}`)
  }

  return undefined
}

export function areTimestampsLessThanOrEqualTo(timestamp1: string, timestamp2: string): boolean {
  const date1 = new Date(timestamp1).getTime()
  const date2 = new Date(timestamp2).getTime()
  return date1 <= date2
}

export function validateStatusOrderAndTimestamp(set: any) {
  const errObj: any = {}
  let previousTimestamp: any = null
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
  if (value.startsWith('0')) {
    value = value.substring(1)
  }

  const val = value?.replace(/[^\d]/g, '')
  return phoneRegex.test(val)
}

export const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

export const isValidISO8601Duration = (duration: string): boolean => {
  const iso8601DurationRegex =
    /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/

  return iso8601DurationRegex.test(duration.trim())
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

export const compareSTDwithArea = (pincode: number, std: string): boolean => {
  return data.some((e: any) => e.Pincode === pincode && e['STD Code'] === std)
}

export const checkMandatoryTags = (i: string, items: any, errorObj: any, categoryJSON: any, categoryName: string) => {
  
  items.forEach((item: any, index: number) => {
    let attributeTag = null
    let originTag = null
    for (const tag of item.tags) {
      originTag = tag.code === 'origin' ? tag : originTag
      attributeTag = tag.code === 'attribute' ? tag : attributeTag
    }

    if (!originTag) {
      logger.error(`Origin tag fields are missing for ${categoryName} item[${index}]`)
      const key = `missingOriginTag[${i}][${index}]`
      errorObj[key] = `Origin tag fields are missing for ${categoryName} item[${index}]`
    }

    if (!attributeTag && categoryName !== 'Grocery') {
      logger.error(`Attribute tag fields are missing for ${categoryName} item[${index}]`)
      const key = `missingAttributeTag[${i}][${index}]`
      errorObj[key] = `Attribute tag fields are missing for ${categoryName} item[${index}]`
      return
    }

    if (attributeTag) {
      const tags = attributeTag.list
      const ctgrID = item.category_id

      if (categoryJSON.hasOwnProperty(ctgrID)) {
        logger.info(`Checking for item tags for ${categoryName} item[${index}]`)
        const mandatoryTags = categoryJSON[ctgrID] 
        const missingMandatoryTags: any[] = []
        tags.forEach((tag: { code: string }) => {
          const tagCode = tag.code
          if (!mandatoryTags[tagCode]) {
            missingMandatoryTags.push(tag.code)
          }
        })

        if (missingMandatoryTags.length > 0) {
          const key = `invalid_attribute[${i}][${index}]`
          errorObj[key] =`Invalid attribute for item with category id: ${missingMandatoryTags.join(', ')}`
        } else {
          console.log(`All tag codes have corresponding valid attributes.`)
        }
        for (const tagName in mandatoryTags) {
          if (mandatoryTags.hasOwnProperty(tagName)) {
            const tagInfo = mandatoryTags[tagName]
            const isTagMandatory = tagInfo.mandatory
            if (isTagMandatory) {
              let tagValue: any = null
              let originalTag: any = null
              const tagFound = tags.some((tag: any) :any=> {
                const res = tag.code === tagName.toLowerCase()
                if (res) {
                  tagValue = tag.value
                  originalTag = tag.value
                  
                }
                return res
              })
              if (!tagFound) {
                logger.error(
                  `Mandatory tag field [${tagName.toLowerCase()}] missing for ${categoryName} item[${index}]`,
                )
                const key = `missingTagsItem[${i}][${index}] : ${tagName.toLowerCase()}`
                errorObj[key] =
                  `Mandatory tag field [${tagName.toLowerCase()}] missing for ${categoryName} item[${index}]`
              } else {
                if (tagInfo.value.length > 0) {
                  let isValidValue = false
                  let regexPattern = ''

                  if (Array.isArray(tagInfo.value)) {
                    isValidValue = tagInfo.value.includes(originalTag) || tagInfo.value.includes(tagValue)
                  } else if (
                    typeof tagInfo.value === 'string' &&
                    tagInfo.value.startsWith('/') &&
                    tagInfo.value.endsWith('/')
                  ) {
                    regexPattern = tagInfo.value.slice(1, -1)
                    const regex = new RegExp(regexPattern)
                    isValidValue = regex.test(originalTag) || regex.test(tagValue)
                  }

                  if (!isValidValue) {
                    logger.error(`The item value can only be one of the possible values or match the regex pattern.`)
                    const key = `InvldValueforItem[${i}][${index}] : ${tagName}`
                    errorObj[key] =
                      `Invalid item value: [${originalTag}]. It must be one of the allowed values or match the regex pattern [${regexPattern}].`
                  }
                }
              }
            }
          }
        }
      } else {
        const key = `invalidCategoryId${ctgrID}`
        errorObj[key] = `Invalid category_id (${ctgrID}) for ${categoryName}`
      }
    }
  })
  return errorObj
}

export const checkDuplicateParentIdItems = (items: any) => {
  const map: any = {}

  items.forEach((item: any) => {
    const parent_item_id = item.parent_item_id
    if (parent_item_id) {
      if (!map[parent_item_id]) {
        map[parent_item_id] = [item]
      } else {
        map[parent_item_id].push(item)
      }
    }
  })
  return map
}

export const checkForDuplicates = (arr: any, errorObj: any) => {
  let index = 0
  const seen = new Set()
  for (const value of arr) {
    const stringValue = JSON.stringify(value)
    if (seen.has(stringValue)) {
      const key = `DuplicateVarient[${index}]`
      errorObj[key] = `Duplicate varient found for item in bpp/providers/items`
      logger.error(`Error: Duplicate varient of item found in bpp/providers/items`)
      index++
    }

    seen.add(stringValue)
  }
}

export const sumQuoteBreakUp = (quote: any) => {
  logger.info(`Checking for quote breakup price sum and total Price`)
  const totalPrice = Number(quote.price.value)
  let currentPrice = 0
  quote.breakup.forEach((item: any) => {
    currentPrice += Number(item.price.value)
  })
  return Math.round(totalPrice) === Math.round(currentPrice)
}

export const findVariantPath = (arr: any) => {
  const groupedByItemID = _.groupBy(arr, 'id')

  // Map over the grouped items and collect attribute paths for each item_id into an array
  const variantPath = _.map(groupedByItemID, (group, item_id) => {
    const paths = _.chain(group).flatMap('tags').filter({ code: 'attr' }).map('list[0].value').value()
    return { item_id, paths }
  })

  return variantPath
}

export const findValueAtPath = (path: string, item: any) => {
  const key = path.split('.').pop()
  let value = null
  item.tags[1].list.forEach((item: any) => {
    if (item.code === key) {
      value = item.value
    }
  })

  return { key, value }
}

export const mapCancellationID = (cancelled_by: string, reason_id: string, errorObj: any) => {
  logger.info(`Mapping cancellationID with valid ReasonID`)
  if (reason_id in reasonCodes && reasonCodes[reason_id].USED_BY.includes(cancelled_by)) {
    logger.info(`CancellationID ${reason_id} mapped with valid ReasonID for ${cancelled_by}`)
    return true
  } else {
    logger.error(`Invalid CancellationID ${reason_id} or not allowed for ${cancelled_by}`)
    errorObj['invldCancellationID'] = `Invalid CancellationID ${reason_id} or not allowed for ${cancelled_by}`
    return false
  }
}

export const payment_status = (payment: any) => {
  if (payment.status == 'PAID') {
    if (!payment.params.transaction_id) {
      return false
    }
  }

  return true
}

export const checkQuoteTrailSum = (
  fulfillmentArr: any[],
  price: number,
  priceAtConfirm: number,
  errorObj: any,
  apiSeq: string,
) => {
  let quoteTrailSum = 0
  for (const obj of fulfillmentArr) {
    const arrType = ['misc', 'packing', 'delivery', 'tax', 'item']
    const quoteTrailItems = _.filter(obj.tags, { code: 'quote_trail' })
    for (const item of quoteTrailItems) {
      for (const val of item.list) {
        if(val.code === 'type')
        {
          if(!arrType.includes(val.value))
          {
            errorObj[`invalidQuoteTrailType${apiSeq}`] = `Invalid Quote Trail Type '${val.value}'. It should be equal to one of the given value in small_case 'misc', 'packing', 'delivery', 'tax' or 'item'`
          }
        }
        if(val.code === 'type')
        {
          if(!arrType.includes(val.value))
          {
            errorObj[`invalidQuoteTrailType${apiSeq}`] = `Invalid Quote Trail Type '${val.value}'. It should be equal to one of the given value in small_case 'misc', 'packing', 'delivery', 'tax' or 'item'`
          }
        }
        if (val.code === 'value') {
          if (Math.abs(Number(val?.value)) <= 0) { 
            errorObj[`invalidQuoteTrailValue`] = `Invalid quote trail value, if the value is 0 in the quote.breakup shouldn't be provided in the quote_trail`
           }
          quoteTrailSum -= val.value
        }
      }
    }
  }
  quoteTrailSum = Number(quoteTrailSum.toFixed(2))
  if (Math.round(priceAtConfirm) != Math.round(price + quoteTrailSum)) {
    const key = `invldQuoteTrailPrices`
    errorObj[key] =
      `quote_trail price and item quote price sum for ${apiSeq} should be equal to the price as in ${constants.ON_CONFIRM}`
    logger.error(
      `quote_trail price and item quote price sum for ${apiSeq} should be equal to the price as in ${constants.ON_CONFIRM} `,
    )
  }
}

export const checkQuoteTrail = (quoteTrailItems: any[], errorObj: any, selectPriceMap: any, itemSet: any) => {
  try {
    for (const item of quoteTrailItems) {
      let value = null
      let itemValue = null
      let itemID = null
      let type = null
      for (const val of item.list) {
        if (val.code === 'id') {
          itemID = val.value
          value = selectPriceMap.get(val.value)
        } else if (val.code === 'value') {
          itemValue = Math.abs(parseFloat(val.value))
        } else if (val.code === 'type') {
          type = val.value
        }
      }

      if (value && itemValue && value !== itemValue && type === 'item') {
        const key = `invalidPrice[${itemID}]`
        errorObj[key] =
          `Price mismatch for  [${itemID}] provided in quote object '[${value}]'. Should be same as in quote of ${constants.ON_SELECT}`
      }

      if (!itemSet.has(itemID) && type === 'item') {
        const key = `invalidItemID[${itemID}]`
        errorObj[key] = `Item ID [${itemID}] not present in items array`
      }
    }
  } catch (error: any) {
    logger.error(error)
  }
}

function deepCompare(obj1: any, obj2: any): boolean {
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return obj1 === obj2
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepCompare(obj1[key], obj2[key])) {
      return false
    }
  }

  return true
}

export function compareQuoteObjects(obj1: InputObject, obj2: InputObject, api1: string, api2: string): string[] {
  const errors: string[] = []

  // Compare root level properties
  const rootKeys1 = Object.keys(obj1)
  const rootKeys2 = Object.keys(obj2)

  if (rootKeys1.length !== rootKeys2.length) {
    errors.push('Root level properties mismatch')
    return errors
  }

  // Compare breakup array
  obj1.breakup.forEach((item1) => {
    const matchingItem = obj2.breakup.find(
      (item2) =>
        item1['@ondc/org/item_id'] === item2['@ondc/org/item_id'] &&
        item1['@ondc/org/title_type'] === item2['@ondc/org/title_type'],
    )

    if (!matchingItem || !deepCompare(item1, matchingItem)) {
      errors.push(
        `Mismatch found for item with item_id ${item1['@ondc/org/item_id']} while comparing quote object of ${api1} and ${api2}`,
      )
    }
  })

  return errors
}

type ObjectType = {
  [key: string]: string | string[]
}

export function validateObjectString(obj: ObjectType): string | null {
  const errors: string[] = []

  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'string' && value.trim() === '') {
      errors.push(`'${key}'`)
    } else if (Array.isArray(value) && value.some((v) => typeof v === 'string' && v.trim() === '')) {
      errors.push(`'${key}'`)
    }
  })

  if (errors.length > 0) {
    return `${errors.join(', ')} cannot be empty`
  }

  return null
}

export function compareLists(list1: any[], list2: any[]): string[] {
  const errors: string[] = []

  for (const obj1 of list1) {
    const matchingObj = list2.find((obj2) => obj2.code === obj1.code)

    if (!matchingObj) {
      if (obj1.code !== 'np_type') {
        errors.push(`Code '${obj1.code}' present in first list but not in second list.`)
      }
    } else {
      if (obj1.value !== matchingObj.value) {
        errors.push(`Code '${obj1.code}' value not matching.`)
      }
    }
  }

  return errors
}

export const findProviderLocation = (obj: any): boolean => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (key === 'provider_location') {
        return true
      }
      if (typeof obj[key] === 'object') {
        const found = findProviderLocation(obj[key])
        if (found) {
          return true
        }
      }
    }
  }
  return false
}

export function compareTimeRanges(data1: any, action1: any, data2: any, action2: any): string[] | null {
  const keys = ['start', 'end']
  const errors: string[] = []

  keys.forEach((key) => {
    if (!data1[key]?.time?.range || !data2[key]?.time?.range) {
      errors.push(`/${key}/range is not provided in one or both objects`)
      return // Skip comparison if range is not provided
    }

    const range1 = data1[key].time.range
    const range2 = data2[key].time.range

    if (
      !isValidTimestamp(range1.start) ||
      !isValidTimestamp(range1.end) ||
      !isValidTimestamp(range2.start) ||
      !isValidTimestamp(range2.end)
    ) {
      errors.push(`/${key}/range has invalid timestamp format`)
      return // Skip comparison if timestamp format is invalid
    }

    if (range1.start !== range2.start) {
      errors.push(
        `/${key}/range/start_time "${range1.start}" of ${action1} mismatched with /${key}/range/start_time "${range2.start}" of ${action2}`,
      )
    }

    if (range1.end !== range2.end) {
      errors.push(
        `/${key}/range/end_time "${range1.end}" of ${action1} mismatched with /${key}/range/end_time "${range2.end}" of ${action2}`,
      )
    }
  })

  return errors.length === 0 ? null : errors
}

export function compareFulfillmentObject(obj1: any, obj2: any, keys: string[], i: number, apiSeq: string) {
  const errors: any[] = []

  keys.forEach((key: string) => {
    if (_.isArray(obj1[key])) {
      obj1[key] = _.sortBy(obj1[key], ['code'])
    }
    if (_.isArray(obj2[key])) {
      obj2[key] = _.sortBy(obj2[key], ['code'])
    }

    if (!_.isEqual(obj1[key], obj2[key])) {
      if (
        typeof obj1[key] === 'object' &&
        typeof obj2[key] === 'object' &&
        Object.keys(obj1[key]).length > 0 &&
        Object.keys(obj2[key]).length > 0
      ) {
        const obj1_nested = obj1[key]
        const obj2_nested = obj2[key]

        const obj1_nested_keys = Object.keys(obj1_nested)
        const obj2_nested_keys = Object.keys(obj2_nested)

        const nestedKeys = obj1_nested_keys.length > obj2_nested_keys.length ? obj1_nested_keys : obj2_nested_keys

        nestedKeys.forEach((key_nested: string) => {
          if (!_.isEqual(obj1_nested[key_nested], obj2_nested[key_nested])) {
            const errKey = `message/order.fulfillments/${i}/${key}/${key_nested}`
            const errMsg = `Mismatch occurred while comparing '${obj1.type}' fulfillment object with ${apiSeq} on key '${key}/${key_nested}'`
            errors.push({ errKey, errMsg })
          }
        })
      } else {
        const errKey = `message/order.fulfillments/${i}/${key}`
        const errMsg = `Mismatch occurred while comparing '${obj1.type}' fulfillment object with ${apiSeq} on key '${key}'`
        errors.push({ errKey, errMsg })
      }
    }
  })

  return errors
}

export function checkForStatutory(item: any, i: number, j: number, errorObj: any, statutory_req: string) {
  const requiredFields: Record<string, string[]> = {
    '@ondc/org/statutory_reqs_prepackaged_food': [
      'nutritional_info',
      'additives_info',
      'brand_owner_FSSAI_license_no',
      'other_FSSAI_license_no',
      'importer_FSSAI_license_no',
    ],
    '@ondc/org/statutory_reqs_packaged_commodities': [
      'manufacturer_or_packer_name',
      'manufacturer_or_packer_address',
      'common_or_generic_name_of_commodity',
      'month_year_of_manufacture_packing_import',
    ],
  }

  if (!_.isEmpty(item[statutory_req] || typeof item[statutory_req] !== 'object' || item[statutory_req] === null)) {
    const data = item[statutory_req]
    requiredFields[statutory_req].forEach((field: any, k: number) => {
      if (typeof data[field] !== 'string' || data[field].trim() === '') {
        Object.assign(errorObj, {
          [`prvdr${i}item${j}${field}${k}statutoryReq`]: `The item${j}/'${statutory_req}'/${field}${k} is missing or not a string in bpp/providers/items for /${constants.ON_SEARCH}`,
        })
      }
    })
  } else {
    Object.assign(errorObj, {
      [`prvdr${i}item${j}statutoryReq`]: `The following item/category_id is not having item${j}/'${statutory_req}' in bpp/providers for /${constants.ON_SEARCH}`,
    })
  }

  return errorObj
}

export function getStatutoryRequirement(category: string): statutory_reqs | undefined {
  return groceryCategoryMappingWithStatutory[category]
}

function isValidTimestamp(timestamp: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(timestamp)
}

export function checkIdInUri(Uri: string, id: string): boolean {
  return Uri.includes(id)
}

export function validateBapUri(bapUri: string, bap_id: string, errorObj: any): any {
  if (!checkIdInUri(bapUri, bap_id)) {
    errorObj['bap_id_in_uri'] = `Bap_id ${bap_id} is not found in BapUri ${bapUri}`
  }
}

export function validateBppUri(bppUri: string, bpp_id: string, errorObj: any): any {
  if (!checkIdInUri(bppUri, bpp_id)) {
    errorObj['bpp_id_in_uri'] = `Bpp_id ${bpp_id} is not found in BppUri ${bppUri}`
  }
}
