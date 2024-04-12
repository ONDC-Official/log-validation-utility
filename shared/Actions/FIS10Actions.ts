import _ from 'lodash'
import { dropDB } from '../dao'
import { logger } from '../logger'
import { Fis10ApiSequence, flowsFis10 } from '../../constants'
import { search } from '../../utils/FIS/FIS10/search'
import { checkOnSearch } from '../../utils/FIS/FIS10/onSearch'
import { checkSelect } from '../../utils/FIS/FIS10/select'
import { checkOnSelect } from '../../utils/FIS/FIS10/onSelect'
import { checkInit } from '../../utils/FIS/FIS10/init'
import { checkOnInit } from '../../utils/FIS/FIS10/onInit'
import { checkConfirm } from '../../utils/FIS/FIS10/confirm'
import { checkOnConfirm } from '../../utils/FIS/FIS10/onConfirm'
import { checkStatus } from '../../utils/FIS/FIS10/status'
import { checkOnStatus } from '../../utils/FIS/FIS10/onStatus'
import { checkOnCancel } from '../../utils/FIS/FIS10/onCancel'
import { checkOnUpdate } from '../../utils/FIS/FIS10/onUpdate'

export function validateLogsForFIS10(data: any, domain: string, flow: string, version: string) {
  const msgIdSet = new Set()
  let logReport: any = {}
  try {
    dropDB()
  } catch (error) {
    logger.error('!!Error while removing LMDB', error)
  }

  console.log('domain', domain)

  if (!_.isEqual(version, '2.0.0')) {
    logReport = { ...logReport, version: `Invalid version ${version}` }
  }

  if (!(flow in flowsFis10)) {
    logReport = { ...logReport, version: `Invalid flow ${flow}` }
  }

  try {
    if (data[Fis10ApiSequence.SEARCH]) {
      const searchResp = search(data[Fis10ApiSequence.SEARCH], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [Fis10ApiSequence.SEARCH]: searchResp }
      }
    }

    if (data[Fis10ApiSequence.ON_SEARCH]) {
      const onSearchResp = checkOnSearch(data[Fis10ApiSequence.ON_SEARCH], msgIdSet, flow, Fis10ApiSequence.ON_SEARCH)
      if (!_.isEmpty(onSearchResp)) {
        logReport = { ...logReport, [Fis10ApiSequence.ON_SEARCH]: onSearchResp }
      }
    }

    if (data[Fis10ApiSequence.SELECT]) {
      const selectResp = checkSelect(data[Fis10ApiSequence.SELECT], msgIdSet)
      if (!_.isEmpty(selectResp)) {
        logReport = { ...logReport, [Fis10ApiSequence.SELECT]: selectResp }
      }
    }

    if (data[Fis10ApiSequence.ON_SELECT]) {
      const onSelectResp = checkOnSelect(data[Fis10ApiSequence.ON_SELECT], msgIdSet, Fis10ApiSequence.ON_SELECT)
      if (!_.isEmpty(onSelectResp)) {
        logReport = { ...logReport, [Fis10ApiSequence.ON_SELECT]: onSelectResp }
      }
    }

    if (data[Fis10ApiSequence.INIT]) {
      const init = checkInit(data[Fis10ApiSequence.INIT], msgIdSet)
      if (!_.isEmpty(init)) {
        logReport = { ...logReport, [Fis10ApiSequence.INIT]: init }
      }
    }

    if (data[Fis10ApiSequence.ON_INIT]) {
      const onInit = checkOnInit(data[Fis10ApiSequence.ON_INIT], msgIdSet)
      if (!_.isEmpty(onInit)) {
        logReport = { ...logReport, [Fis10ApiSequence.ON_INIT]: onInit }
      }
    }

    if (data[Fis10ApiSequence.CONFIRM]) {
      const confirm = checkConfirm(data[Fis10ApiSequence.CONFIRM], msgIdSet)
      if (!_.isEmpty(confirm)) {
        logReport = { ...logReport, [Fis10ApiSequence.CONFIRM]: confirm }
      }
    }

    if (data[Fis10ApiSequence.ON_CONFIRM]) {
      const onConfirm = checkOnConfirm(data[Fis10ApiSequence.ON_CONFIRM], msgIdSet)
      if (!_.isEmpty(onConfirm)) {
        logReport = { ...logReport, [Fis10ApiSequence.ON_CONFIRM]: onConfirm }
      }
    }

    if (data[Fis10ApiSequence.STATUS]) {
      const status = checkStatus(data[Fis10ApiSequence.STATUS], msgIdSet)
      if (!_.isEmpty(confirm)) {
        logReport = { ...logReport, [Fis10ApiSequence.STATUS]: status }
      }
    }

    if (data[Fis10ApiSequence.ON_STATUS]) {
      const onStatus = checkOnStatus(data[Fis10ApiSequence.ON_STATUS], msgIdSet)
      if (!_.isEmpty(onStatus)) {
        logReport = { ...logReport, [Fis10ApiSequence.ON_STATUS]: onStatus }
      }
    }

    if (data[Fis10ApiSequence.ON_UPDATE]) {
      const onUpdate = checkOnUpdate(data[Fis10ApiSequence.ON_UPDATE], msgIdSet)
      if (!_.isEmpty(onUpdate)) {
        logReport = { ...logReport, [Fis10ApiSequence.ON_UPDATE]: onUpdate }
      }
    }

    if (data[Fis10ApiSequence.ON_CANCEL]) {
      const onCancel = checkOnCancel(data[Fis10ApiSequence.ON_CANCEL], msgIdSet)
      if (!_.isEmpty(onCancel)) {
        logReport = { ...logReport, [Fis10ApiSequence.ON_CANCEL]: onCancel }
      }
    }

    logger.info(logReport, 'Report Generated Successfully!!')
    return logReport
  } catch (error: any) {
    logger.error(error.message)
    return error.message
  }
}
