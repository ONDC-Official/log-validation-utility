import _ from 'lodash'
import { dropDB, setValue } from '../dao'
import { logger } from '../logger'
import {TRV13ApiSequence, TRV13Flows } from '../../constants'
import { search } from '../../utils/mobility/TRV13/search'
import { checkOnSearch } from '../../utils/mobility/TRV13/on_search'
import { checkOnSearchInc } from '../../utils/mobility/TRV13/on_search_inc'
import { checkOnSearchTime } from '../../utils/mobility/TRV13/on_search_time'
import { checkSelect } from '../../utils/mobility/TRV13/select'
import { checkOnSelect } from '../../utils/mobility/TRV13/on_select'
import { checkInit } from '../../utils/mobility/TRV13/init'
import { checkOnInit } from '../../utils/mobility/TRV13/on_init'
import { checkConfirm } from '../../utils/mobility/TRV13/confirm'
import { checkOnConfirm } from '../../utils/mobility/TRV13/on_confirm'
import { checkUpdate } from '../../utils/mobility/TRV13/update'
import { checkOnUpdate } from '../../utils/mobility/TRV13/on_update'
import { checkStatus } from '../../utils/mobility/TRV13/status'
import { checkOnStatus } from '../../utils/mobility/TRV13/on_status'
import { checkCancel } from '../../utils/mobility/TRV13/cancel'
import { checkOnCancel } from '../../utils/mobility/TRV13/on_cancel'


export function validateLogsForTRV13(data: any, version: string, flow: string) {
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

  if (!(flow in TRV13Flows)) {
    logReport = { ...logReport, version: `Invalid flow ${flow}` }
  } else setValue('flow', flow)

  try {
    if (data[TRV13ApiSequence.SEARCH]) {
      const errors = search(data[TRV13ApiSequence.SEARCH], msgIdSet, version, TRV13ApiSequence.SEARCH)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [TRV13ApiSequence.SEARCH]: errors }
      }
    }

    if (data[TRV13ApiSequence.ON_SEARCH]) {
      const errors = checkOnSearch(data[TRV13ApiSequence.ON_SEARCH], msgIdSet, version)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [TRV13ApiSequence.ON_SEARCH]: errors }
      }
    }

    if (data[TRV13ApiSequence.SEARCH_INC]) {
      const errors = search(data[TRV13ApiSequence.SEARCH_INC], msgIdSet, version, TRV13ApiSequence.SEARCH_INC)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [TRV13ApiSequence.SEARCH_INC]: errors }
      }
    }

    if (data[TRV13ApiSequence.ON_SEARCH_INC]) {
      const errors = checkOnSearchInc(data[TRV13ApiSequence.ON_SEARCH_INC], msgIdSet, version)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [TRV13ApiSequence.ON_SEARCH_INC]: errors }
      }
    }
    
    if (data[TRV13ApiSequence.SEARCH_TIME]) {
      const errors = search(data[TRV13ApiSequence.SEARCH_TIME], msgIdSet, version, TRV13ApiSequence.SEARCH_TIME)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [TRV13ApiSequence.SEARCH_TIME]: errors }
      }
    }

    if (data[TRV13ApiSequence.ON_SEARCH_TIME]) {
      const errors = checkOnSearchTime(data[TRV13ApiSequence.ON_SEARCH_TIME], msgIdSet, version)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [TRV13ApiSequence.ON_SEARCH_TIME]: errors }
      }
    }

    if (data[TRV13ApiSequence.SELECT]) {
      const errors = checkSelect(data[TRV13ApiSequence.SELECT], msgIdSet, version)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [TRV13ApiSequence.SELECT]: errors }
      }
    }

    if (data[TRV13ApiSequence.ON_SELECT]) {
      const errors = checkOnSelect(data[TRV13ApiSequence.ON_SELECT], msgIdSet, version)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [TRV13ApiSequence.ON_SELECT]: errors }
      }
    }

    if (data[TRV13ApiSequence.INIT]) {
      const errors = checkInit(data[TRV13ApiSequence.INIT], msgIdSet, version)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [TRV13ApiSequence.INIT]: errors }
      }
    }

    if (data[TRV13ApiSequence.ON_INIT]) {
      const errors = checkOnInit(data[TRV13ApiSequence.ON_INIT], msgIdSet, version)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [TRV13ApiSequence.ON_INIT]: errors }
      }
    }

    if (data[TRV13ApiSequence.CONFIRM]) {
      const errors = checkConfirm(data[TRV13ApiSequence.CONFIRM], msgIdSet, version)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [TRV13ApiSequence.CONFIRM]: errors }
      }
    }

    if (data[TRV13ApiSequence.ON_CONFIRM]) {
      const errors = checkOnConfirm(data[TRV13ApiSequence.ON_CONFIRM], msgIdSet, version)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [TRV13ApiSequence.ON_CONFIRM]: errors }
      }
    }
    
    if (data[TRV13ApiSequence.UPDATE]) {
      const errors = checkUpdate(data[TRV13ApiSequence.UPDATE], msgIdSet, version)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [TRV13ApiSequence.UPDATE]: errors }
      }
    }
    
    if (data[TRV13ApiSequence.ON_UPDATE]) {
      const errors = checkOnUpdate(data[TRV13ApiSequence.ON_UPDATE], msgIdSet, version)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [TRV13ApiSequence.ON_UPDATE]: errors }
      }
    }

    if (data[TRV13ApiSequence.STATUS]) {
      const errors = checkStatus(data[TRV13ApiSequence.STATUS], msgIdSet, version)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [TRV13ApiSequence.STATUS]: errors }
      }
    }

    if (data[TRV13ApiSequence.ON_STATUS]) {
      const errors = checkOnStatus(data[TRV13ApiSequence.ON_STATUS], msgIdSet, version)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [TRV13ApiSequence.ON_STATUS]: errors }
      }
    }

    if (data[TRV13ApiSequence.CANCEL]) {
      const errors = checkCancel(data[TRV13ApiSequence.CANCEL], msgIdSet, version)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [TRV13ApiSequence.CANCEL]: errors }
      }
    }
    
    if (data[TRV13ApiSequence.ON_CANCEL]) {
      const errors = checkOnCancel(data[TRV13ApiSequence.ON_CANCEL], msgIdSet, version)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [TRV13ApiSequence.ON_CANCEL]: errors }
      }
    }
    

    


    logger.info(logReport, 'Report Generated Successfully!!')
    return logReport
  } catch (error: any) {
    logger.error(error.message)
    return error.message
  }
}
