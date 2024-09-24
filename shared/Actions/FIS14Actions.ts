import _ from 'lodash'
import { dropDB } from '../dao'
import { logger } from '../logger'
import { FIS14ApiSequence, fis14Flows } from '../../constants'
import { checkSearch } from '../../utils/FIS/FIS14/search'
import { checkInit } from '../../utils/FIS/FIS14/init'
import { checkOnInit } from '../../utils/FIS/FIS14/onInit'
import { checkConfirm } from '../../utils/FIS/FIS14/confirm'
import { checkOnConfirm } from '../../utils/FIS/FIS14/onConfirm'
import { checkOnStatus } from '../../utils/FIS/FIS14/onStatus'
import { checkOnUpdate } from '../../utils/FIS/FIS14/onUpdate'
import { checkonSearch } from '../../utils/FIS/FIS14/onSearch'
import { checkSelect } from '../../utils/FIS/FIS14/select'
import { checkOnSelect } from '../../utils/FIS/FIS14/onSelect'

export function validateLogsForFIS14(data: any, flow: string, version: string) {
  const msgIdSet = new Set()
  let logReport: any = {}
  try {
    dropDB()
  } catch (error) {
    logger.error('!!Error while removing LMDB', error)
  }

  if (!_.isEqual(version, '2.0.0')) {
    logReport = { ...logReport, version: `Invalid version ${version}` }
  }

  if (!(flow in fis14Flows)) {
    logReport = { ...logReport, version: `Invalid flow ${flow}` }
  }

  try {
    if (data[FIS14ApiSequence.SEARCH]) {
      console.log('validing search')
      const searchResp = checkSearch(data[FIS14ApiSequence.SEARCH], msgIdSet, flow, FIS14ApiSequence.SEARCH)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [FIS14ApiSequence.SEARCH]: searchResp }
      }
    }
    if (data[FIS14ApiSequence.ON_SEARCH]) {
      const onSearchResp = checkonSearch(data[FIS14ApiSequence.ON_SEARCH], msgIdSet, flow)
      if (!_.isEmpty(onSearchResp)) {
        logReport = { ...logReport, [FIS14ApiSequence.ON_SEARCH]: onSearchResp }
      }
    }
    if (data[FIS14ApiSequence.SELECT]) {
      const selectResp = checkSelect(data[FIS14ApiSequence.SELECT], msgIdSet, flow)
      if (!_.isEmpty(selectResp)) {
        logReport = { ...logReport, [FIS14ApiSequence.SELECT]: selectResp }
      }
    }
    if (data[FIS14ApiSequence.ON_SELECT]) {
      const onSelectResp = checkOnSelect(data[FIS14ApiSequence.ON_SELECT], msgIdSet, flow)
      if (!_.isEmpty(onSelectResp)) {
        logReport = { ...logReport, [FIS14ApiSequence.ON_SELECT]: onSelectResp }
      }
    }
    if (data[FIS14ApiSequence.INIT]) {
      const initResp = checkInit(data[FIS14ApiSequence.INIT], msgIdSet, FIS14ApiSequence.INIT)
      if (!_.isEmpty(initResp)) {
        logReport = { ...logReport, [FIS14ApiSequence.INIT]: initResp }
      }
    }

    if (data[FIS14ApiSequence.ON_INIT]) {
      const onInitResp = checkOnInit(data[FIS14ApiSequence.ON_INIT], msgIdSet, FIS14ApiSequence.ON_INIT)
      if (!_.isEmpty(onInitResp)) {
        logReport = { ...logReport, [FIS14ApiSequence.ON_INIT]: onInitResp }
      }
    }

    if (data[FIS14ApiSequence.CONFIRM]) {
      const confirmResp = checkConfirm(data[FIS14ApiSequence.CONFIRM], msgIdSet, FIS14ApiSequence.CONFIRM)
      if (!_.isEmpty(confirmResp)) {
        logReport = { ...logReport, [FIS14ApiSequence.CONFIRM]: confirmResp }
      }
    }

    if (data[FIS14ApiSequence.ON_CONFIRM]) {
      const onConfirmResp = checkOnConfirm(data[FIS14ApiSequence.ON_CONFIRM], msgIdSet, FIS14ApiSequence.ON_CONFIRM)
      if (!_.isEmpty(onConfirmResp)) {
        logReport = { ...logReport, [FIS14ApiSequence.ON_CONFIRM]: onConfirmResp }
      }
    }

    if (data[FIS14ApiSequence.ON_STATUS]) {
      const onStatusResp = checkOnStatus(data[FIS14ApiSequence.ON_STATUS], msgIdSet, FIS14ApiSequence.ON_STATUS)
      if (!_.isEmpty(onStatusResp)) {
        logReport = { ...logReport, [FIS14ApiSequence.ON_STATUS]: onStatusResp }
      }
    }

    if (data[FIS14ApiSequence.ON_UPDATE]) {
      const onUpdateResp = checkOnUpdate(data[FIS14ApiSequence.ON_UPDATE], msgIdSet, FIS14ApiSequence.ON_UPDATE)
      if (!_.isEmpty(onUpdateResp)) {
        logReport = { ...logReport, [FIS14ApiSequence.ON_UPDATE]: onUpdateResp }
      }
    }

    logger.info(logReport, 'Report Generated Successfully!!')
    return logReport
  } catch (error: any) {
    logger.error(error.message)
    return error.message
  }
}
