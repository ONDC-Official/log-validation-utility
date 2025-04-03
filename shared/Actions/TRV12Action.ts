import _ from 'lodash'
import { dropDB } from '../dao'
import { logger } from '../logger'
import { airlinesSequence, intercitySequence } from '../../constants'
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
import { checkStatusPayload } from '../../utils/mobility/TRV12/status'
import { checkOnStatusPayload } from '../../utils/mobility/TRV12/onStatus'

export function validateLogsForTRV12(data: any, flowName: string, version: string) {
  const msgIdSet = new Set()
  let logReport: any = {}
  console.log('flowname: ', flowName)
  const [first, ...rest] = flowName.split('-')
  const flow = { flow: first.trim(), flowSet: rest.join('-') }
  const realFlow = flow.flow.substring(0, flow.flow.length - 1).toUpperCase()
  try {
    dropDB()
  } catch (error) {
    logger.error('!!Error while removing LMDB', error)
  }

  try {
    switch (realFlow) {
      case 'AIRLINE':
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
          const onSelectResp = checkSelect(data[airlinesSequence.SELECT1], msgIdSet, flow)
          if (!_.isEmpty(onSelectResp)) {
            logReport = { ...logReport, [airlinesSequence.SELECT1]: onSelectResp }
          }
        }

        if (data[airlinesSequence.ON_SELECT1]) {
          const onSelectResp = checkOnSelect(data[airlinesSequence.ON_SELECT1], msgIdSet, flow, version)
          if (!_.isEmpty(onSelectResp)) {
            logReport = { ...logReport, [airlinesSequence.ON_SELECT1]: onSelectResp }
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
        if (data[airlinesSequence.STATUS]) {
          const statusResp = checkStatusPayload(data[airlinesSequence.STATUS], msgIdSet)
          if (!_.isEmpty(statusResp)) {
            logReport = { ...logReport, [airlinesSequence.STATUS]: statusResp }
          }
        }
        if (data[airlinesSequence.ON_STATUS]) {
          const onStatusResp = checkOnStatusPayload(data[airlinesSequence.ON_STATUS], msgIdSet)
          if (!_.isEmpty(onStatusResp)) {
            logReport = { ...logReport, [airlinesSequence.ON_STATUS]: onStatusResp }
          }
        }

        break
      case 'BUS':
        if (data[intercitySequence?.SEARCH]) {
          const searchResp = search(data[intercitySequence?.SEARCH], msgIdSet, flow)
          if (!_.isEmpty(searchResp)) {
            logReport = { ...logReport, [intercitySequence.SEARCH]: searchResp }
          }
        }
        if (data[intercitySequence.ON_SEARCH]) {
          const onSearchResp = checkOnSearch(data[intercitySequence.ON_SEARCH], msgIdSet, false, flow)
          if (!_.isEmpty(onSearchResp)) {
            logReport = { ...logReport, [intercitySequence.ON_SEARCH]: onSearchResp }
          }
        }
        if (data[intercitySequence.SELECT]) {
          const selectResp = checkSelect(data[intercitySequence.SELECT], msgIdSet, flow)
          if (!_.isEmpty(selectResp)) {
            logReport = { ...logReport, [intercitySequence.SELECT]: selectResp }
          }
        }

        break
    }

    logger.info(logReport, 'Report Generated Successfully!!')
    return logReport
  } catch (error: any) {
    logger.error(error.message)
    return error.message
  }
}
