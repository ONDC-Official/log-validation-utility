import { SRV19APISequence } from '../../constants'
import { dropDB } from '../../shared/dao'
import { logger } from '../../shared/logger'
import _ from 'lodash'
import { checkSearch } from '../../utils/SRV/SRV19/search'
import { checkOnSearch } from '../../utils/SRV/SRV19/onSearch'
import { checkSelect } from '../../utils/SRV/SRV19/select'
import { checkOnSelect } from '../../utils/SRV/SRV19/onSelect'
import { checkInit } from '../../utils/SRV/SRV19/init'
import { checkOnInit } from '../../utils/SRV/SRV19/onInit'
import { checkConfirm } from '../../utils/SRV/SRV19/confirm'
import { checkOnConfirm } from '../../utils/SRV/SRV19/onConfirm'
import { checkStatus } from '../../utils/SRV/SRV19/status'
import { checkOnStatus } from '../../utils/SRV/SRV19/onStatus'
import { checkCancel } from '../../utils/SRV/SRV19/cancel'
import { checkOnCancel } from '../../utils/SRV/SRV19/onCancel'
import { checkUpdate } from '../../utils/SRV/SRV19/update'
import { checkOnUpdate } from '../../utils/SRV/SRV19/onUpdate'
export function validateLogsForSRV19(data: any, _flow: string, version: string) {
  const msgIdSet = new Set()
  let logReport: any = {}

  try {
    dropDB()
  } catch (error) {
    logger.error('!!Error while removing LMDB', error)
  }

  console.log('VERSION', version)
  if (!_.isEqual(version, '2.0.0')) {
    logReport = { ...logReport, version: `Invalid version ${version}` }
  }
  try {
    if (data[SRV19APISequence.SEARCH]) {
      const errors = checkSearch(data[SRV19APISequence.SEARCH], msgIdSet, version, SRV19APISequence.SEARCH)
     
      if (!_.isEmpty(errors)) {
      
        logReport = { ...logReport, [SRV19APISequence.SEARCH]: errors }
      }
    }
    if (data[SRV19APISequence.ON_SEARCH]) {
      const errors = checkOnSearch(data[SRV19APISequence.ON_SEARCH], msgIdSet, version)
     
      if (!_.isEmpty(errors)) {
      
        logReport = { ...logReport, [SRV19APISequence.ON_SEARCH]: errors }
      }
    }
    if (data[SRV19APISequence.SELECT]) {
      const errors = checkSelect(data[SRV19APISequence.SELECT], msgIdSet)
     
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [SRV19APISequence.SELECT]: errors }
      }
    }
    if (data[SRV19APISequence.ON_SELECT]) {
      const errors = checkOnSelect(data[SRV19APISequence.ON_SELECT], msgIdSet, version)
     
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [SRV19APISequence.ON_SELECT]: errors }
      }
    }
    if (data[SRV19APISequence.INIT]) {
      const errors = checkInit(data[SRV19APISequence.INIT], msgIdSet, version)
     
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [SRV19APISequence.INIT]: errors }
      }
    }
    if (data[SRV19APISequence.ON_INIT]) {
      const errors = checkOnInit(data[SRV19APISequence.ON_INIT], msgIdSet, version)
     
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [SRV19APISequence.ON_INIT]: errors }
      }
    }
    if (data[SRV19APISequence.CONFIRM]) {
      const errors = checkConfirm(data[SRV19APISequence.CONFIRM], msgIdSet, version)
     
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [SRV19APISequence.CONFIRM]: errors }
      }
    }
    if (data[SRV19APISequence.ON_CONFIRM]) {
      const errors = checkOnConfirm(data[SRV19APISequence.ON_CONFIRM], msgIdSet, version)
     
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [SRV19APISequence.ON_CONFIRM]: errors }
      }
    }
    if (data[SRV19APISequence.STATUS]) {
      const errors = checkStatus(data[SRV19APISequence.STATUS], msgIdSet)
     
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [SRV19APISequence.STATUS]: errors }
      }
    }
    if (data[SRV19APISequence.ON_STATUS]) {
      const errors = checkOnStatus(data[SRV19APISequence.ON_STATUS], msgIdSet, version)
     
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [SRV19APISequence.ON_STATUS]: errors }
      }
    }
    if (data[SRV19APISequence.CANCEL]) {
      const errors = checkCancel(data[SRV19APISequence.CANCEL], msgIdSet, version)
     
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [SRV19APISequence.CANCEL]: errors }
      }
    }
    if (data[SRV19APISequence.ON_CANCEL]) {
      const errors = checkOnCancel(data[SRV19APISequence.ON_CANCEL], msgIdSet, version)
     
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [SRV19APISequence.ON_CANCEL]: errors }
      }
    }
    if (data[SRV19APISequence.UPDATE]) {
      const errors = checkUpdate(data[SRV19APISequence.UPDATE], msgIdSet, version)
     
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [SRV19APISequence.UPDATE]: errors }
      }
    }
    if (data[SRV19APISequence.ON_UPDATE]) {
      const errors = checkOnUpdate(data[SRV19APISequence.ON_UPDATE], msgIdSet, version)
     
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [SRV19APISequence.ON_UPDATE]: errors }
      }
    }

    logger.info(logReport, 'Report Generated Successfully!!')
    return logReport
  } catch (error: any) {
    logger.error(error.message)
    return error.message
  }
}
