import _ from 'lodash'
import { dropDB } from '../dao'
import { logger } from '../logger'
import { FIS14ApiSequence, fis14Flows, fis14FlowSequence } from '../../constants'
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

  if (flow in fis14Flows) {
    const validateApiSequence = validateApiSequenceForFIS14(data, flow as any)
    logReport = { ...logReport, validateApiSequence }
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
    if (
      data[FIS14ApiSequence.SELECT] ||
      data[FIS14ApiSequence.SELECT_1] ||
      data[FIS14ApiSequence.SELECT_2] ||
      data[FIS14ApiSequence.SELECT_3]
    ) {
      const selectResp = checkSelect(data[FIS14ApiSequence.SELECT], msgIdSet, flow)
      if (!_.isEmpty(selectResp)) {
        logReport = { ...logReport, [FIS14ApiSequence.SELECT]: selectResp }
      }
    }
    if (
      data[FIS14ApiSequence.ON_SELECT] ||
      data[FIS14ApiSequence.ON_SELECT_1] ||
      data[FIS14ApiSequence.ON_SELECT_2] ||
      data[FIS14ApiSequence.ON_SELECT_3]
    ) {
      const onSelectResp = checkOnSelect(data[FIS14ApiSequence.ON_SELECT], msgIdSet, flow as any)
      if (!_.isEmpty(onSelectResp)) {
        logReport = { ...logReport, [FIS14ApiSequence.ON_SELECT]: onSelectResp }
      }
    }
    if (data[FIS14ApiSequence.INIT]) {
      const initResp = checkInit(data[FIS14ApiSequence.INIT], msgIdSet, flow)
      if (!_.isEmpty(initResp)) {
        logReport = { ...logReport, [FIS14ApiSequence.INIT]: initResp }
      }
    }

    if (data[FIS14ApiSequence.ON_INIT]) {
      const onInitResp = checkOnInit(data[FIS14ApiSequence.ON_INIT], msgIdSet, flow)
      if (!_.isEmpty(onInitResp)) {
        logReport = { ...logReport, [FIS14ApiSequence.ON_INIT]: onInitResp }
      }
    }

    if (data[FIS14ApiSequence.CONFIRM]) {
      const confirmResp = checkConfirm(data[FIS14ApiSequence.CONFIRM], msgIdSet, flow)
      if (!_.isEmpty(confirmResp)) {
        logReport = { ...logReport, [FIS14ApiSequence.CONFIRM]: confirmResp }
      }
    }

    if (data[FIS14ApiSequence.ON_CONFIRM]) {
      const onConfirmResp = checkOnConfirm(data[FIS14ApiSequence.ON_CONFIRM], msgIdSet, flow)
      if (!_.isEmpty(onConfirmResp)) {
        logReport = { ...logReport, [FIS14ApiSequence.ON_CONFIRM]: onConfirmResp }
      }
    }

    if (data[FIS14ApiSequence.ON_STATUS]) {
      const onStatusResp = checkOnStatus(data[FIS14ApiSequence.ON_STATUS], msgIdSet, flow)
      if (!_.isEmpty(onStatusResp)) {
        logReport = { ...logReport, [FIS14ApiSequence.ON_STATUS]: onStatusResp }
      }
    }

    if (data[FIS14ApiSequence.ON_UPDATE] || data[FIS14ApiSequence.ON_UPDATE_1]) {
      const onUpdateResp = checkOnUpdate(data[FIS14ApiSequence.ON_UPDATE], msgIdSet, flow)
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

export function getFis14Format(version: string) {
  console.log('version', version)
  return fis14FlowSequence
}

function validateApiSequenceForFIS14(data: any, flow: keyof typeof fis14FlowSequence) {
  const dataKeys = Object.keys(data)
  const flowSequeunce: string[] = fis14FlowSequence[flow]
  const errorObjet: any = {}
  for (const item of flowSequeunce) {
    if (!dataKeys.includes(item.toLowerCase())) {
      errorObjet[item] = `Missing ${item} in the sequence`
    }
  }
  return errorObjet
}
