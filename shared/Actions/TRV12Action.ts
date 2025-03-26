import _ from 'lodash'
import { dropDB } from '../dao'
import { logger } from '../logger'
import { airlinesSequence } from '../../constants'
import { search } from '../../utils/mobility/TRV12/search'
import { checkOnSearch } from '../../utils/mobility/TRV12/onSearch'
import { checkSelect } from '../../utils/mobility/TRV12/select'
import { checkOnSelect } from '../../utils/mobility/TRV12/onSelect'
import { checkInit } from '../../utils/mobility/TRV12/init'
import { checkOnInit } from '../../utils/mobility/TRV12/onInit'
import { checkConfirm } from '../../utils/mobility/TRV12/confirm'
import { checkOnConfirm } from '../../utils/mobility/TRV12/onConfirm'
import { checkCancelPayload } from '../../utils/mobility/TRV12/cancel'
import { checkOnCancelPayload } from '../../utils/mobility/TRV12/onCancel'

export function validateLogsForAirline(data: any, flowName: string, version: string) {
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
    if (data[airlinesSequence?.SEARCH]) {
      const searchResp = search(data[airlinesSequence?.SEARCH], msgIdSet, flow)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [airlinesSequence.SEARCH]: searchResp }
      }
    }

    if (data[airlinesSequence.ON_SEARCH]) {
      const onSearchResp = checkOnSearch(data[airlinesSequence.ON_SEARCH], msgIdSet, false, flow)
      if (!_.isEmpty(onSearchResp)) {
        logReport = { ...logReport, [airlinesSequence.ON_SEARCH]: onSearchResp }
      }
    }

    if (data[airlinesSequence.ON_SEARCH]) {
      const selectresp = checkOnSearch(data[airlinesSequence.ON_SEARCH], msgIdSet, true, flow)
      if (!_.isEmpty(selectresp)) {
        logReport = { ...logReport, [airlinesSequence.ON_SEARCH]: selectresp }
      }
    }

    if (data[airlinesSequence.SELECT1]) {
      const onSelectResp = checkSelect(data[airlinesSequence.SELECT1], msgIdSet, false)
      if (!_.isEmpty(onSelectResp)) {
        logReport = { ...logReport, [airlinesSequence.SELECT1]: onSelectResp }
      }
    }
    

    if (data[airlinesSequence.ON_SELECT1]) {
      const onSelectResp = checkOnSelect(data[airlinesSequence.ON_SELECT1], msgIdSet, flow, version, false)
      if (!_.isEmpty(onSelectResp)) {
        logReport = { ...logReport, [airlinesSequence.ON_SELECT1]: onSelectResp }
      }
    }

    if (data[airlinesSequence.SELECT2]) {
      const onSelectResp = checkSelect(data[airlinesSequence.SELECT2], msgIdSet, true)
      if (!_.isEmpty(onSelectResp)) {
        logReport = { ...logReport, [airlinesSequence.SELECT2]: onSelectResp }
      }
    }

    if (data[airlinesSequence.ON_SELECT2]) {
      const onSelectResp = checkOnSelect(data[airlinesSequence.ON_SELECT2], msgIdSet, flow, version, true)
      if (!_.isEmpty(onSelectResp)) {
        logReport = { ...logReport, [airlinesSequence.ON_SELECT2]: onSelectResp }
      }
    }

    if (data[airlinesSequence.INIT]) {
      const initResp = checkInit(data[airlinesSequence.INIT], msgIdSet)
      if (!_.isEmpty(initResp)) {
        logReport = { ...logReport, [airlinesSequence.INIT]: initResp }
      }
    }

    if (data[airlinesSequence.ON_INIT]) {
      const onInitResp = checkOnInit(data[airlinesSequence.ON_INIT], msgIdSet, flow, version)
      if (!_.isEmpty(onInitResp)) {
        logReport = { ...logReport, [airlinesSequence.ON_INIT]: onInitResp }
      }
    }

    if (data[airlinesSequence.CONFIRM]) {
      const confirmResp = checkConfirm(data[airlinesSequence.CONFIRM], msgIdSet)
      if (!_.isEmpty(confirmResp)) {
        logReport = { ...logReport, [airlinesSequence.CONFIRM]: confirmResp }
      }
    }

    if (data[airlinesSequence.ON_CONFIRM]) {
      const onConfirmResp = checkOnConfirm(data[airlinesSequence.ON_CONFIRM], msgIdSet, flow, version)
      if (!_.isEmpty(onConfirmResp)) {
        logReport = { ...logReport, [airlinesSequence.ON_CONFIRM]: onConfirmResp }
      }
    }

    if (data[airlinesSequence.CANCEL]) {
      const cancelResp = checkCancelPayload(data[airlinesSequence.CANCEL], msgIdSet, false)
      if (!_.isEmpty(cancelResp)) {
        logReport = { ...logReport, [airlinesSequence.CANCEL]: cancelResp }
      }
    }

    if (data[airlinesSequence.ON_CANCEL]) {
      const onCancelResp = checkOnCancelPayload(data[airlinesSequence.ON_CANCEL], msgIdSet, flow, false)
      if (!_.isEmpty(onCancelResp)) {
        logReport = { ...logReport, [airlinesSequence.ON_CANCEL]: onCancelResp }
      }
    }

    logger.info(logReport, 'Report Generated Successfully!!')
    return logReport
  } catch (error: any) {
    logger.error(error.message)
    return error.message
  }
}
