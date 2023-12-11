import _ from 'lodash'
import { dropDB } from '../dao'
import { logger } from '../logger'
import { FisApiSequence } from '../../constants'
import { search } from '../../utils/FIS/FIS12/search'
import { checkOnSearch } from '../../utils/FIS/FIS12/onSearch'
import { checkSelect } from '../../utils/FIS/FIS12/select'
import { checkOnSelect } from '../../utils/FIS/FIS12/onSelect'
import { checkOnSelect2 } from '../../utils/FIS/FIS12/onSelect2'
import { checkInit } from '../../utils/FIS/FIS12/init'
import { checkOnInit } from '../../utils/FIS/FIS12/onInit'
import { checkConfirm } from '../../utils/FIS/FIS12/confirm'
import { checkOnConfirm } from '../../utils/FIS/FIS12/onConfirm'
import { checkUpdate } from '../../utils/FIS/FIS12/update'
import { checkOnUpdate } from '../../utils/FIS/FIS12/onUpdate'
import { checkStatus } from '../../utils/FIS/FIS12/status'
import { checkOnStatus } from '../../utils/FIS/FIS12/onStatus'

export function validateLogsForFIS12(data: any, domain: string, flow: string) {
  const msgIdSet = new Set()
  let logReport: any = {}
  try {
    dropDB()
  } catch (error) {
    logger.error('!!Error while removing LMDB', error)
  }

  console.log('domain', domain)

  try {
    if (data[FisApiSequence.SEARCH]) {
      const searchResp = search(data[FisApiSequence.SEARCH], msgIdSet, flow)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [FisApiSequence.SEARCH]: searchResp }
      }
    }

    if (data[FisApiSequence.ON_SEARCH]) {
      const onSearchResp = checkOnSearch(data[FisApiSequence.ON_SEARCH], msgIdSet, flow)
      if (!_.isEmpty(onSearchResp)) {
        logReport = { ...logReport, [FisApiSequence.ON_SEARCH]: onSearchResp }
      }
    }

    if (data[FisApiSequence.SELECT]) {
      const selectResp = checkSelect(data[FisApiSequence.SELECT], msgIdSet)
      if (!_.isEmpty(selectResp)) {
        logReport = { ...logReport, [FisApiSequence.SELECT]: selectResp }
      }
    }

    if (data[FisApiSequence.ON_SELECT]) {
      const onSelectResp = checkOnSelect(data[FisApiSequence.ON_SELECT], msgIdSet)
      if (!_.isEmpty(onSelectResp)) {
        logReport = { ...logReport, [FisApiSequence.ON_SELECT]: onSelectResp }
      }
    }

    if (data[FisApiSequence.SELECT_2]) {
      const select2Resp = checkSelect(data[FisApiSequence.SELECT_2], msgIdSet)
      if (!_.isEmpty(select2Resp)) {
        logReport = { ...logReport, [FisApiSequence.SELECT_2]: select2Resp }
      }
    }

    if (data[FisApiSequence.ON_SELECT_2]) {
      const onSelect2Resp = checkOnSelect2(data[FisApiSequence.ON_SELECT_2], msgIdSet)
      if (!_.isEmpty(onSelect2Resp)) {
        logReport = { ...logReport, [FisApiSequence.ON_SELECT_2]: onSelect2Resp }
      }
    }

    if (data[FisApiSequence.SELECT_3]) {
      const select3Resp = checkSelect(data[FisApiSequence.SELECT_3], msgIdSet)
      if (!_.isEmpty(select3Resp)) {
        logReport = { ...logReport, [FisApiSequence.SELECT_3]: select3Resp }
      }
    }

    if (data[FisApiSequence.ON_SELECT_3]) {
      const onSelect3Resp = checkOnSelect2(data[FisApiSequence.ON_SELECT_3], msgIdSet)
      if (!_.isEmpty(onSelect3Resp)) {
        logReport = { ...logReport, [FisApiSequence.ON_SELECT_3]: onSelect3Resp }
      }
    }

    if (data[FisApiSequence.INIT]) {
      const init = checkInit(data[FisApiSequence.INIT], msgIdSet)
      if (!_.isEmpty(init)) {
        logReport = { ...logReport, [FisApiSequence.INIT]: init }
      }
    }

    if (data[FisApiSequence.ON_INIT]) {
      const onInit = checkOnInit(data[FisApiSequence.ON_INIT], msgIdSet)
      if (!_.isEmpty(onInit)) {
        logReport = { ...logReport, [FisApiSequence.ON_INIT]: onInit }
      }
    }

    if (data[FisApiSequence.INIT_2]) {
      const init2 = checkInit(data[FisApiSequence.INIT_2], msgIdSet)
      if (!_.isEmpty(init2)) {
        logReport = { ...logReport, [FisApiSequence.INIT_2]: init2 }
      }
    }

    if (data[FisApiSequence.ON_INIT_2]) {
      const onInit2 = checkOnInit(data[FisApiSequence.ON_INIT_2], msgIdSet)
      if (!_.isEmpty(onInit2)) {
        logReport = { ...logReport, [FisApiSequence.ON_INIT_2]: onInit2 }
      }
    }

    if (data[FisApiSequence.INIT_3]) {
      const init3 = checkInit(data[FisApiSequence.INIT_3], msgIdSet)
      if (!_.isEmpty(init3)) {
        logReport = { ...logReport, [FisApiSequence.INIT_3]: init3 }
      }
    }

    if (data[FisApiSequence.ON_INIT_3]) {
      const onInit3 = checkOnInit(data[FisApiSequence.ON_INIT_3], msgIdSet)
      if (!_.isEmpty(onInit3)) {
        logReport = { ...logReport, [FisApiSequence.ON_INIT_3]: onInit3 }
      }
    }

    if (data[FisApiSequence.INIT_4]) {
      const init4 = checkInit(data[FisApiSequence.INIT_4], msgIdSet)
      if (!_.isEmpty(init4)) {
        logReport = { ...logReport, [FisApiSequence.INIT_4]: init4 }
      }
    }

    if (data[FisApiSequence.ON_INIT_4]) {
      const onInit4 = checkOnInit(data[FisApiSequence.ON_INIT_4], msgIdSet)
      if (!_.isEmpty(onInit4)) {
        logReport = { ...logReport, [FisApiSequence.ON_INIT_4]: onInit4 }
      }
    }

    if (data[FisApiSequence.CONFIRM]) {
      const confirm = checkConfirm(data[FisApiSequence.CONFIRM])
      if (!_.isEmpty(confirm)) {
        logReport = { ...logReport, [FisApiSequence.CONFIRM]: confirm }
      }
    }

    if (data[FisApiSequence.ON_CONFIRM]) {
      const onConfirm = checkOnConfirm(data[FisApiSequence.ON_CONFIRM], flow)
      if (!_.isEmpty(onConfirm)) {
        logReport = { ...logReport, [FisApiSequence.ON_CONFIRM]: onConfirm }
      }
    }

    if (data[FisApiSequence.ON_UPDATE]) {
      const onUpdate = checkOnUpdate(data[FisApiSequence.ON_UPDATE], flow)
      if (!_.isEmpty(onUpdate)) {
        logReport = { ...logReport, [FisApiSequence.ON_UPDATE]: onUpdate }
      }
    }

    if (data[FisApiSequence.UPDATE]) {
      const update = checkUpdate(data[FisApiSequence.UPDATE], msgIdSet)
      if (!_.isEmpty(update)) {
        logReport = { ...logReport, [FisApiSequence.UPDATE]: update }
      }
    }

    if (data[FisApiSequence.ON_UPDATE_1]) {
      const onUpdate1 = checkOnUpdate(data[FisApiSequence.ON_UPDATE_1], flow)
      if (!_.isEmpty(onUpdate1)) {
        logReport = { ...logReport, [FisApiSequence.ON_UPDATE_1]: onUpdate1 }
      }
    }

    if (data[FisApiSequence.STATUS]) {
      const status = checkStatus(data[FisApiSequence.STATUS], msgIdSet)
      if (!_.isEmpty(status)) {
        logReport = { ...logReport, [FisApiSequence.STATUS]: status }
      }
    }

    if (data[FisApiSequence.ON_STATUS]) {
      const onStatus = checkOnStatus(data[FisApiSequence.ON_STATUS], flow)
      if (!_.isEmpty(onStatus)) {
        logReport = { ...logReport, [FisApiSequence.ON_STATUS]: onStatus }
      }
    }

    logger.info(logReport, 'Report Generated Successfully!!')
    return logReport
  } catch (error: any) {
    logger.error(error.message)
    return error.message
  }
}
