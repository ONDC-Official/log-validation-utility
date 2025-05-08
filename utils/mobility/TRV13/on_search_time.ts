import { logger } from '../../../shared/logger'
import { setValue } from '../../../shared/dao'
import { TRV13ApiSequence } from '../../../constants'
import { validateSchema, isObjectEmpty } from '../../../utils'
import { validateContext } from '../mobilityChecks'

export const checkOnSearchTime = (data: any, msgIdSet: any, version: any) => {
  console.log("Version", version)
  if (!data || isObjectEmpty(data)) {
    return { [TRV13ApiSequence.ON_SEARCH_TIME]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.catalog || isObjectEmpty(message) || isObjectEmpty(message.catalog)) {
    return { missingFields: '/context, /message, /catalog or /message/catalog is missing or empty' }
  }

  const schemaValidation = validateSchema('TRV13', TRV13ApiSequence.ON_SEARCH_TIME, data)
  const contextRes: any = validateContext(context, msgIdSet, TRV13ApiSequence.SEARCH_TIME, TRV13ApiSequence.ON_SEARCH_TIME)
  setValue(`${TRV13ApiSequence.ON_SEARCH_TIME}_message`, message)
  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  const onSearchCatalog: any = message.catalog

  try {
    let i = 0
    const bppPrvdrs = onSearchCatalog?.providers
    const len = bppPrvdrs?.length

    while (i < len) {
      // Provider time validation
      if (!bppPrvdrs[i]?.time) {
        errorObj[`provider_${i}_time`] = `provider.time is missing at index ${i}`
      } else {
        if (!bppPrvdrs[i].time?.label || bppPrvdrs[i].time?.label !== 'ENABLE') {
          errorObj[`provider_${i}_time_label`] = `provider.time.label should be 'ENABLE' at index ${i}`
        }
        if (!bppPrvdrs[i].time?.timestamp) {
          errorObj[`provider_${i}_time_timestamp`] = `provider.time.timestamp is missing at index ${i}`
        } else {
          // Validate timestamp format
          const timestamp = new Date(bppPrvdrs[i].time.timestamp)
          if (isNaN(timestamp.getTime())) {
            errorObj[`provider_${i}_time_timestamp`] = `provider.time.timestamp should be in ISO 8601 format at index ${i}`
          }
        }
      }

      // Items time validation
      const items = bppPrvdrs[i]?.items
      if (items && items.length > 0) {
        items.forEach((item: any, j: number) => {
          if (!item?.time) {
            errorObj[`provider_${i}_item_${j}_time`] = `item.time is missing at index ${j}`
          } else {
            // Time label validation
            if (!item.time?.label || item.time?.label !== 'ENABLE') {
              errorObj[`provider_${i}_item_${j}_time_label`] = `item.time.label should be 'ENABLE' at index ${j}`
            }

            // Timestamp validation
            if (!item.time?.timestamp) {
              errorObj[`provider_${i}_item_${j}_time_timestamp`] = `item.time.timestamp is missing at index ${j}`
            } else {
              const timestamp = new Date(item.time.timestamp)
              if (isNaN(timestamp.getTime())) {
                errorObj[`provider_${i}_item_${j}_time_timestamp`] = `item.time.timestamp should be in ISO 8601 format at index ${j}`
              }
            }

            // Time range validation (if present)
            if (item.time?.range) {
              if (!item.time.range?.start) {
                errorObj[`provider_${i}_item_${j}_time_range_start`] = `item.time.range.start is missing at index ${j}`
              } else {
                const startTime = new Date(item.time.range.start)
                if (isNaN(startTime.getTime())) {
                  errorObj[`provider_${i}_item_${j}_time_range_start`] = `item.time.range.start should be in ISO 8601 format at index ${j}`
                }
              }

              if (!item.time.range?.end) {
                errorObj[`provider_${i}_item_${j}_time_range_end`] = `item.time.range.end is missing at index ${j}`
              } else {
                const endTime = new Date(item.time.range.end)
                if (isNaN(endTime.getTime())) {
                  errorObj[`provider_${i}_item_${j}_time_range_end`] = `item.time.range.end should be in ISO 8601 format at index ${j}`
                }
              }

              // Validate that end time is after start time
              if (item.time.range?.start && item.time.range?.end) {
                const startTime = new Date(item.time.range.start)
                const endTime = new Date(item.time.range.end)
                if (startTime >= endTime) {
                  errorObj[`provider_${i}_item_${j}_time_range`] = `item.time.range.end should be after item.time.range.start at index ${j}`
                }
              }
            }

            // Duration validation (if present)
            if (item.time?.duration) {
              if (!item.time.duration.match(/^PT\d+[HMS]$/)) {
                errorObj[`provider_${i}_item_${j}_time_duration`] = `item.time.duration should be in ISO 8601 duration format (e.g., PT2H) at index ${j}`
              } else {
                // Validate duration format
                const duration = item.time.duration
                const hours = duration.match(/(\d+)H/)
                const minutes = duration.match(/(\d+)M/)
                const seconds = duration.match(/(\d+)S/)

                if (hours && parseInt(hours[1]) > 24) {
                  errorObj[`provider_${i}_item_${j}_time_duration`] = `item.time.duration hours should not exceed 24 at index ${j}`
                }
                if (minutes && parseInt(minutes[1]) > 59) {
                  errorObj[`provider_${i}_item_${j}_time_duration`] = `item.time.duration minutes should not exceed 59 at index ${j}`
                }
                if (seconds && parseInt(seconds[1]) > 59) {
                  errorObj[`provider_${i}_item_${j}_time_duration`] = `item.time.duration seconds should not exceed 59 at index ${j}`
                }
              }
            }
          }
        })
      }

      i++
    }
  } catch (error: any) {
    logger.error(`!!Error while checking time info in /${TRV13ApiSequence.ON_SEARCH_TIME}, ${error.stack}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
