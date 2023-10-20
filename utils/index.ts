/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import { logger } from '../shared/logger'
import constants from '../constants'
import schemaValidator from '../shared/schemaValidator'

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
    } else {
      tags.push(`/message/intent/tags[0]/code should be 'catalog_inc'`)
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
