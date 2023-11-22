import _ from 'lodash'
import { checkSearchFullCatalogRefresh } from '../utils/Retail/RET11/searchFullCatalogRefresh'
import { dropDB } from '../shared/dao'
import { logger } from './logger'
import { ApiSequence, retailDomains } from '../constants'
import { checkSearchIncremental } from '../utils/Retail/RET11/searchIncremental'
import { validateSchema, isObjectEmpty } from '../utils'
import { checkOnsearchFullCatalogRefresh } from '../utils/Retail/RET11/onSearch'
import { checkOnsearchIncremental } from '../utils/Retail/RET11/onSearchIncremental'
import { checkSelect } from '../utils/Retail/RET11/select'
import { checkOnSelect } from '../utils/Retail/RET11/onSelect'
import { checkInit } from '../utils/Retail/RET11/init'
import { checkOnInit } from '../utils/Retail/RET11/onInit'
import { checkConfirm } from '../utils/Retail/RET11/confirm'
import { checkOnConfirm } from '../utils/Retail/RET11/onConfirm'
import { checkCancel } from '../utils/Retail/Cancel/cancel'
import { checkOnCancel } from '../utils/Retail/Cancel/onCancel'
import { checkOnTrack } from '../utils/Retail/Track/onTrack'
import { checkTrack } from '../utils/Retail/Track/track'
import { checkOnStatusPending } from '../utils/Retail/Status/onStatusPending'
import { checkStatus } from '../utils/Retail/Status/status'
import { checkSearch } from '../utils/Retail/Search/search'
import { checkOnsearch } from '../utils/Retail/Search/on_search'
import { checkOnStatusPicked } from '../utils/Retail/Status/onStatusPicked'
import { checkOnStatusDelivered } from '../utils/Retail/Status/onStatusDelivered'

export const validateLogs = (data: any, domain: string) => {
  const msgIdSet = new Set()
  let logReport: any = {}

  try {
    dropDB()
  } catch (error) {
    logger.error('!!Error while removing LMDB', error)
  }

  try {
    if (domain === 'ONDC:RET11') {
      if (data[ApiSequence.SEARCH]) {
        const searchFullCatalogRefreshResp = checkSearchFullCatalogRefresh(data[ApiSequence.SEARCH], msgIdSet)
        if (!_.isEmpty(searchFullCatalogRefreshResp)) {
          logReport = { ...logReport, [ApiSequence.SEARCH]: searchFullCatalogRefreshResp }
        }
      }

      if (data[ApiSequence.INC_SEARCH]) {
        const searchIncrementalRefreshResp = checkSearchIncremental(data[ApiSequence.INC_SEARCH], msgIdSet)

        if (!_.isEmpty(searchIncrementalRefreshResp)) {
          logReport = { ...logReport, [ApiSequence.INC_SEARCH]: searchIncrementalRefreshResp }
        }
      }

      if (data[ApiSequence.ON_SEARCH]) {
        const onSearchFullCatalogRefreshResp = checkOnsearchFullCatalogRefresh(data[ApiSequence.ON_SEARCH], msgIdSet)

        if (!_.isEmpty(onSearchFullCatalogRefreshResp)) {
          logReport = { ...logReport, [ApiSequence.ON_SEARCH]: onSearchFullCatalogRefreshResp }
        }
      }

      if (data[ApiSequence.INC_ONSEARCH]) {
        const onSearchIncrementalRefreshResp = checkOnsearchIncremental(data[ApiSequence.INC_ONSEARCH], msgIdSet)
        if (!_.isEmpty(onSearchIncrementalRefreshResp)) {
          logReport = { ...logReport, [ApiSequence.INC_ONSEARCH]: onSearchIncrementalRefreshResp }
        }
      }

      if (data[ApiSequence.SELECT]) {
        const selectResp = checkSelect(data[ApiSequence.SELECT], msgIdSet)

        if (!_.isEmpty(selectResp)) {
          logReport = { ...logReport, [ApiSequence.SELECT]: selectResp }
        }
      }

      if (data[ApiSequence.ON_SELECT]) {
        const on_selectResp = checkOnSelect(data[ApiSequence.ON_SELECT])

        if (!_.isEmpty(on_selectResp)) {
          logReport = { ...logReport, [ApiSequence.ON_SELECT]: on_selectResp }
        }
      }

      if (data[ApiSequence.INIT]) {
        const initResp = checkInit(data[ApiSequence.INIT])

        if (!_.isEmpty(initResp)) {
          logReport = { ...logReport, [ApiSequence.INIT]: initResp }
        }
      }

      if (data[ApiSequence.ON_INIT]) {
        const on_initResp = checkOnInit(data[ApiSequence.ON_INIT], msgIdSet)

        if (!_.isEmpty(on_initResp)) {
          logReport = { ...logReport, [ApiSequence.ON_INIT]: on_initResp }
        }
      }

      if (data[ApiSequence.CONFIRM]) {
        const confirmResps = checkConfirm(data[ApiSequence.CONFIRM])

        if (!_.isEmpty(confirmResps)) {
          logReport = { ...logReport, [ApiSequence.CONFIRM]: confirmResps }
        }
      }

      if (data[ApiSequence.ON_CONFIRM]) {
        const on_confirmResps = checkOnConfirm(data[ApiSequence.ON_CONFIRM])

        if (!_.isEmpty(on_confirmResps)) {
          logReport = { ...logReport, [ApiSequence.ON_CONFIRM]: on_confirmResps }
        }
      }

      if (data[ApiSequence.CANCEL]) {
        const cancelResp = checkCancel(data[ApiSequence.CANCEL])

        if (!_.isEmpty(cancelResp)) {
          logReport = { ...logReport, [ApiSequence.CANCEL]: cancelResp }
        }
      }

      if (data[ApiSequence.ON_CANCEL]) {
        const onCancelResp = checkOnCancel(data[ApiSequence.ON_CANCEL])

        if (!_.isEmpty(onCancelResp)) {
          logReport = { ...logReport, [ApiSequence.ON_CANCEL]: onCancelResp }
        }
      }

      if (data[ApiSequence.STATUS]) {
        const statusResp = checkStatus(data[ApiSequence.STATUS])

        if (!_.isEmpty(statusResp)) {
          logReport = { ...logReport, [ApiSequence.STATUS]: statusResp }
        }
      }

      if (data[ApiSequence.ON_STATUS_PENDING]) {
        const onStatusResp = checkOnStatusPending(data[ApiSequence.ON_STATUS_PENDING], 'pending')

        if (!_.isEmpty(onStatusResp)) {
          logReport = { ...logReport, [ApiSequence.ON_STATUS_PENDING]: onStatusResp }
        }
      }

      if (data[ApiSequence.ON_STATUS_PICKED]) {
        const onStatusResp = checkOnStatusPicked(data[ApiSequence.ON_STATUS_PICKED], 'pending')

        if (!_.isEmpty(onStatusResp)) {
          logReport = { ...logReport, [ApiSequence.ON_STATUS_PICKED]: onStatusResp }
        }
      }

      if (data[ApiSequence.ON_STATUS_DELIVERED]) {
        const onStatusResp = checkOnStatusDelivered(data[ApiSequence.ON_STATUS_DELIVERED], 'pending')

        if (!_.isEmpty(onStatusResp)) {
          logReport = { ...logReport, [ApiSequence.ON_STATUS_DELIVERED]: onStatusResp }
        }
      }

      if (data[ApiSequence.TRACK]) {
        const TrackResp = checkTrack(data[ApiSequence.TRACK])

        if (!_.isEmpty(TrackResp)) {
          logReport = { ...logReport, [ApiSequence.TRACK]: TrackResp }
        }
      }

      if (data[ApiSequence.ON_TRACK]) {
        const onTrackResp = checkOnTrack(data[ApiSequence.ON_TRACK])

        if (!_.isEmpty(onTrackResp)) {
          logReport = { ...logReport, [ApiSequence.ON_TRACK]: onTrackResp }
        }
      }

      logger.info(logReport, 'Report Generated Successfully!!')
      return logReport
    } else {
      if (!retailDomains.includes(domain)) {
        return 'Domain should be one of the 1.2.0 retail domains'
      }

      if (data[ApiSequence.SEARCH]) {
        const searchFullCatalogRefreshResp = checkSearch(data[ApiSequence.SEARCH], msgIdSet)
        if (!_.isEmpty(searchFullCatalogRefreshResp)) {
          logReport = { ...logReport, [ApiSequence.SEARCH]: searchFullCatalogRefreshResp }
        }
      }

      if (data[ApiSequence.ON_SEARCH]) {
        const onSearchFullCatalogRefreshResp = checkOnsearch(data[ApiSequence.ON_SEARCH], msgIdSet)
        if (!_.isEmpty(onSearchFullCatalogRefreshResp)) {
          logReport = { ...logReport, [ApiSequence.ON_SEARCH]: onSearchFullCatalogRefreshResp }
        }
      }

      if (data[ApiSequence.INC_SEARCH]) {
        const searchIncrementalRefreshResp = checkSearchIncremental(data[ApiSequence.INC_SEARCH], msgIdSet)

        if (!_.isEmpty(searchIncrementalRefreshResp)) {
          logReport = { ...logReport, [ApiSequence.INC_SEARCH]: searchIncrementalRefreshResp }
        }
      }

      if (data[ApiSequence.INC_ONSEARCH]) {
        const onSearchIncrementalRefreshResp = checkOnsearchIncremental(data[ApiSequence.INC_ONSEARCH], msgIdSet)
        if (!_.isEmpty(onSearchIncrementalRefreshResp)) {
          logReport = { ...logReport, [ApiSequence.INC_ONSEARCH]: onSearchIncrementalRefreshResp }
        }
      }

      if (data[ApiSequence.SELECT]) {
        const selectResp = checkSelect(data[ApiSequence.SELECT], msgIdSet)

        if (!_.isEmpty(selectResp)) {
          logReport = { ...logReport, [ApiSequence.SELECT]: selectResp }
        }
      }

      if (data[ApiSequence.ON_SELECT]) {
        const on_selectResp = checkOnSelect(data[ApiSequence.ON_SELECT])

        if (!_.isEmpty(on_selectResp)) {
          logReport = { ...logReport, [ApiSequence.ON_SELECT]: on_selectResp }
        }
      }

      if (data[ApiSequence.INIT]) {
        const initResp = checkInit(data[ApiSequence.INIT])

        if (!_.isEmpty(initResp)) {
          logReport = { ...logReport, [ApiSequence.INIT]: initResp }
        }
      }

      if (data[ApiSequence.ON_INIT]) {
        const on_initResp = checkOnInit(data[ApiSequence.ON_INIT], msgIdSet)

        if (!_.isEmpty(on_initResp)) {
          logReport = { ...logReport, [ApiSequence.ON_INIT]: on_initResp }
        }
      }

      if (data[ApiSequence.CONFIRM]) {
        const confirmResps = checkConfirm(data[ApiSequence.CONFIRM])

        if (!_.isEmpty(confirmResps)) {
          logReport = { ...logReport, [ApiSequence.CONFIRM]: confirmResps }
        }
      }

      if (data[ApiSequence.ON_CONFIRM]) {
        const on_confirmResps = checkOnConfirm(data[ApiSequence.ON_CONFIRM])

        if (!_.isEmpty(on_confirmResps)) {
          logReport = { ...logReport, [ApiSequence.ON_CONFIRM]: on_confirmResps }
        }
      }

      if (data[ApiSequence.STATUS]) {
        const statusResp = checkStatus(data[ApiSequence.STATUS])

        if (!_.isEmpty(statusResp)) {
          logReport = { ...logReport, [ApiSequence.STATUS]: statusResp }
        }
      }

      if (data[ApiSequence.ON_STATUS_PENDING]) {
        const onStatusResp = checkOnStatusPending(data[ApiSequence.ON_STATUS_PENDING], 'pending')

        if (!_.isEmpty(onStatusResp)) {
          logReport = { ...logReport, [ApiSequence.ON_STATUS_PENDING]: onStatusResp }
        }
      }

      if (data[ApiSequence.ON_STATUS_PICKED]) {
        const onStatusResp = checkOnStatusPicked(data[ApiSequence.ON_STATUS_PICKED], 'pending')

        if (!_.isEmpty(onStatusResp)) {
          logReport = { ...logReport, [ApiSequence.ON_STATUS_PICKED]: onStatusResp }
        }
      }

      if (data[ApiSequence.ON_STATUS_DELIVERED]) {
        const onStatusResp = checkOnStatusDelivered(data[ApiSequence.ON_STATUS_DELIVERED], 'pending')

        if (!_.isEmpty(onStatusResp)) {
          logReport = { ...logReport, [ApiSequence.ON_STATUS_DELIVERED]: onStatusResp }
        }
      }

      logger.info(logReport, 'Report Generated Successfully!!')
      return logReport
    }
  } catch (error: any) {
    logger.error(error.message)
    return error.message
  }
}

export const validateActionSchema = (data: any, domain: string, action: string) => {
  const errorObj: any = {}

  switch (domain) {
    case 'ONDC:RET11': {
      const schemaError = validateSchema('RET11', action, data)
      if (schemaError !== 'error') Object.assign(errorObj, schemaError)
      return isObjectEmpty(errorObj) ? false : errorObj
    }

    case 'ONDC:RET10': {
      const schemaError = validateSchema('RET10', action, data)
      if (schemaError !== 'error') Object.assign(errorObj, schemaError)
      return isObjectEmpty(errorObj) ? false : errorObj
    }

    case 'ONDC:RET12': {
      const schemaError = validateSchema('RET12', action, data)
      if (schemaError !== 'error') Object.assign(errorObj, schemaError)
      return isObjectEmpty(errorObj) ? false : errorObj
    }

    default:
      return 'Invalid Domain!! Please Enter a valid domain'
  }
}
