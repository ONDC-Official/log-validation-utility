import { logger } from "../../../../shared/logger"

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

export function checkItemQuantity(quantity: { [key: string]: any }, i: number, j: number) {
  const errorObj: any = {}
  if (!quantity) {
    errorObj[`prvdr${i}item${j}_quantity`] = `Quantity is missing in /providers[${i}]/items[${j}]`
    return errorObj
  }

  if (!quantity?.selected?.count) {
    errorObj[`prvdr${i}item${j}_quantity_maximum`] =
      `attribute maximium.count is missing in /providers[${i}]/items[${j}]`
  }
  if (!quantity?.selected?.count) {
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
  } else if (time?.label.toUpperCase() !== 'JOURNEY_TIME')
    errorObj[`prvdr${i}item${j}time.label`] =
      `label should be equal to 'JOURNEY_TIME' at /providers[${i}]/items[${j}].time`

  return errorObj
}

export const validateDescriptor = (
  descriptor: any,
  action: string,
  path: string,
  checkCode: boolean,
  codes: string[],
): any => {
  try {
    const errorObj: any = {}
    if (!descriptor) {
      errorObj.descriptor = `descriptor is missing at ${path}.`
    } else {
      if (checkCode) {
        if (!descriptor?.code) {
          errorObj.code = `descriptor.code is missing at ${path}.`
        } else if (descriptor.code?.trim() !== descriptor.code?.trim()?.toUpperCase()) {
          errorObj.code = `descriptor.code must be in uppercase at ${path}., ${descriptor.code}`
        } else if (descriptor?.code && !codes?.includes(descriptor?.code))
          errorObj.code = `descriptor.code should be one of ${codes}`
      }

      //validate name only if checkCode is false or name is present
      if (!checkCode || descriptor?.name) {
        if (!descriptor?.name?.trim()) {
          errorObj.name = `descriptor.name is missing or empty ${path}.`
        }
      }

      if (descriptor?.short_desc) {
        if (!descriptor.short_desc.trim()) {
          errorObj.short_desc = `descriptor.short_desc is empty at ${path}.`
        }
      }

      if (descriptor?.long_desc) {
        if (!descriptor.long_desc.trim()) {
          errorObj.long_desc = `descriptor.long_desc is empty at ${path}.`
        }
      }
    }

    return errorObj
  } catch (error: any) {
    logger.info(`Error while validating descriptor for /${action} at ${path}, ${error.stack}`)
  }
}
