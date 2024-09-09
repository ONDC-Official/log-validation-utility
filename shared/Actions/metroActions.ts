import _ from 'lodash'
import { dropDB } from '../dao'
import { logger } from '../logger'
import { metroSequence } from '../../constants'
import { search } from '../../utils/metro/search'
import { checkOnSearch } from '../../utils/metro/onSearch'
import { checkSelect } from '../../utils/metro/select'
import { checkOnSelect } from '../../utils/metro/onSelect'
import { checkInit } from '../../utils/metro/init'
import { checkOnInit } from '../../utils/metro/onInit'
import { checkConfirm } from '../../utils/metro/confirm'
import { checkOnConfirm } from '../../utils/metro/onConfirm'
import { checkStatus } from '../../utils/metro/status'
import { checkOnStatus } from '../../utils/metro/onStatus'
import { checkCancelPayload } from '../../utils/metro/cancel'
import { checkOnCancelPayload } from '../../utils/metro/onCancel'

export function validateLogsForMetro(data: any, flowName: string) {
  const msgIdSet = new Set()
  let logReport: any = {}
  const [first, ...rest] = flowName.split('_')
  const flow = { flow: first, flowSet: rest.join('_') }
  try {
    dropDB()
  } catch (error) {
    logger.error('!!Error while removing LMDB', error)
  }

  try {
    if (data[metroSequence.SEARCH1]) {
      const searchResp = search(data[metroSequence.SEARCH1], msgIdSet, false, flow)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [metroSequence.SEARCH1]: searchResp }
      }
    }

    if (data[metroSequence.ON_SEARCH1]) {
      const searchResp = checkOnSearch(data[metroSequence.ON_SEARCH1], msgIdSet, false, flow)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [metroSequence.ON_SEARCH1]: searchResp }
      }
    }

    if (data[metroSequence.SEARCH2]) {
      const searchResp = search(data[metroSequence.SEARCH2], msgIdSet, true, flow)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [metroSequence.SEARCH2]: searchResp }
      }
    }

    if (data[metroSequence.ON_SEARCH2]) {
      const searchResp = checkOnSearch(data[metroSequence.ON_SEARCH2], msgIdSet, true, flow)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [metroSequence.ON_SEARCH2]: searchResp }
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
      const searchResp = checkOnConfirm(data[metroSequence.ON_CONFIRM], msgIdSet, flow)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [metroSequence.ON_CONFIRM]: searchResp }
      }
    }

    if (data[metroSequence.STATUS]) {
      const searchResp = checkStatus(data[metroSequence.STATUS], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [metroSequence.STATUS]: searchResp }
      }
    }

    if (data[metroSequence.ON_STATUS]) {
      const searchResp = checkOnStatus(data[metroSequence.ON_STATUS], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [metroSequence.ON_STATUS]: searchResp }
      }
    }

    if (data[metroSequence.SOFT_CANCEL]) {
      const searchResp = checkCancelPayload(data[metroSequence.SOFT_CANCEL], msgIdSet, false)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [metroSequence.SOFT_CANCEL]: searchResp }
      }
    }

    if (data[metroSequence.CONFIRM_CANCEL]) {
      const searchResp = checkCancelPayload(data[metroSequence.CONFIRM_CANCEL], msgIdSet, true)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [metroSequence.CONFIRM_CANCEL]: searchResp }
      }
    }

    if (data[metroSequence.SOFT_ON_CANCEL]) {
      const searchResp = checkOnCancelPayload(data[metroSequence.SOFT_ON_CANCEL], msgIdSet, flow, false)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [metroSequence.SOFT_ON_CANCEL]: searchResp }
      }
    }

    if (data[metroSequence.CONFIRM_ON_CANCEL]) {
      const searchResp = checkOnCancelPayload(data[metroSequence.CONFIRM_ON_CANCEL], msgIdSet, flow, true)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [metroSequence.CONFIRM_ON_CANCEL]: searchResp }
      }
    }

    logger.info(logReport, 'Report Generated Successfully!!')
    return logReport
  } catch (error: any) {
    logger.error(error.message)
    return error.message
  }
}
