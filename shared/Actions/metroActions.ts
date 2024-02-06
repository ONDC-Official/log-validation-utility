import _ from 'lodash'
import { dropDB } from '../dao'
import { logger } from '../logger'
import { metroSequence } from '../../constants'
import { search } from '../../utils/metro/search'
// import { checkCancel } from '../../utils/metro/cancel'
import { checkOnSearch } from '../../utils/metro/onSearch'
import { checkSelect } from '../../utils/metro/select'
import { checkOnSelect } from '../../utils/metro/onSelect'
import { checkInit } from '../../utils/metro/init'
import { checkOnInit } from '../../utils/metro/onInit'
import { checkConfirm } from '../../utils/metro/confirm'
import { checkOnConfirm } from '../../utils/metro/onConfirm'
// import { checkUpdate } from '../../utils/metro/update'
// import { checkOnUpdate } from '../../utils/metro/onUpdate'
// import { checkStatus } from '../../utils/metro/status'
// import { checkOnStatus } from '../../utils/metro/onStatus'
// import { checkOnCancel } from '../../utils/metro/onCancel'

export function validateLogsFormetro(data: any) {
  const msgIdSet = new Set()
  let logReport: any = {}
  try {
    dropDB()
  } catch (error) {
    logger.error('!!Error while removing LMDB', error)
  }



  try {
    if (data[metroSequence.SEARCH]) {
      const searchResp = search(data[metroSequence.SEARCH], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [metroSequence.SEARCH]: searchResp }
      }
    }

    if (data[metroSequence.ON_SEARCH]) {
      const searchResp = checkOnSearch(data[metroSequence.ON_SEARCH], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [metroSequence.ON_SEARCH]: searchResp }
      }
    }

    if (data[metroSequence.SELECT]) {
      const searchResp = checkSelect(data[metroSequence.SELECT], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [metroSequence.SELECT]: searchResp }
      }
    }

    if (data[metroSequence.ON_SELECT]) {
      const searchResp = checkOnSelect(data[metroSequence.ON_SELECT], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [metroSequence.ON_SELECT]: searchResp }
      }
    }

    if (data[metroSequence.INIT]) {
      const searchResp = checkInit(data[metroSequence.INIT], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [metroSequence.INIT]: searchResp }
      }
    }

    if (data[metroSequence.ON_INIT]) {
      const searchResp = checkOnInit(data[metroSequence.ON_INIT], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [metroSequence.ON_INIT]: searchResp }
      }
    }

    if (data[metroSequence.CONFIRM]) {
      const searchResp = checkConfirm(data[metroSequence.CONFIRM], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [metroSequence.CONFIRM]: searchResp }
      }
    }

    if (data[metroSequence.ON_CONFIRM]) {
      const searchResp = checkOnConfirm(data[metroSequence.ON_CONFIRM], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [metroSequence.ON_CONFIRM]: searchResp }
      }
    }

    // if (data[metroSequence.UPDATE]) {
    //   const searchResp = checkUpdate(data[metroSequence.UPDATE], msgIdSet)
    //   if (!_.isEmpty(searchResp)) {
    //     logReport = { ...logReport, [metroSequence.UPDATE]: searchResp }

    // }

    // if (data[metroSequence.ON_UPDATE]) {
    //   const searchResp = checkOnUpdate(data[metroSequence.ON_UPDATE])
    //   if (!_.isEmpty(searchResp)) {
    //     logReport = { ...logReport, [metroSequence.ON_UPDATE]: searchResp }
    //   }
    // }

    // if (data[metroSequence.STATUS]) {
    //   const searchResp = checkStatus(data[metroSequence.STATUS], msgIdSet)
    //   if (!_.isEmpty(searchResp)) {
    //     logReport = { ...logReport, [metroSequence.STATUS]: searchResp }
    //   }
    // }

    // if (data[metroSequence.ON_STATUS]) {
    //   const searchResp = checkOnStatus(data[metroSequence.ON_STATUS], msgIdSet)
    //   if (!_.isEmpty(searchResp)) {
    //     logReport = { ...logReport, [metroSequence.ON_STATUS]: searchResp }
    //   }
    // }

    // if (data[metroSequence.SOFT_CANCEL]) {
    //   const searchResp = checkCancel(data[metroSequence.SOFT_CANCEL], msgIdSet, metroSequence.SOFT_CANCEL)
    //   if (!_.isEmpty(searchResp)) {
    //     logReport = { ...logReport, [metroSequence.SOFT_CANCEL]: searchResp }
    //   }
    // }

    // if (data[metroSequence.SOFT_ON_CANCEL]) {
    //   const searchResp = checkOnCancel(data[metroSequence.SOFT_ON_CANCEL], msgIdSet, metroSequence.SOFT_ON_CANCEL)
    //   if (!_.isEmpty(searchResp)) {
    //     logReport = { ...logReport, [metroSequence.SOFT_ON_CANCEL]: searchResp }
    //   }
    // }

    // if (data[metroSequence.CANCEL]) {
    //   const searchResp = checkCancel(data[metroSequence.CANCEL], msgIdSet, metroSequence.CANCEL)
    //   if (!_.isEmpty(searchResp)) {
    //     logReport = { ...logReport, [metroSequence.CANCEL]: searchResp }
    //   }
    // }

    // if (data[metroSequence.ON_CANCEL]) {
    //   const searchResp = checkOnCancel(data[metroSequence.ON_CANCEL], msgIdSet, metroSequence.ON_CANCEL)
    //   if (!_.isEmpty(searchResp)) {
    //     logReport = { ...logReport, [metroSequence.ON_CANCEL]: searchResp }
    //   }
    // }

    // if (flow === 'RIDER_CANCEL') {
    //   const cancelKeys = [
    //     metroSequence.SOFT_CANCEL,
    //     metroSequence.SOFT_ON_CANCEL,
    //     metroSequence.CANCEL,
    //     metroSequence.ON_CANCEL,
    //   ]

    //   if (!cancelKeys.some((key) => key in data)) {
    //     logReport.error = 'RIDER_CANCEL flow calls are incomplete'
    //   }
    // }

    logger.info(logReport, 'Report Generated Successfully!!')
    return logReport
  } catch (error: any) {
    logger.error(error.message)
    return error.message
  }
}
