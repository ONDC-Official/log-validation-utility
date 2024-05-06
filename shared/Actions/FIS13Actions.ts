import _ from 'lodash'
import { dropDB } from '../dao'
import { logger } from '../logger'
import { FIS13HealthSequence, insuranceFlows } from '../../constants'
import { search } from '../../utils/FIS/FIS13/search'
import { checkOnSearch } from '../../utils/FIS/FIS13/onSearch'
import { checkSelect } from '../../utils/FIS/FIS13/select'
import { checkOnSelect } from '../../utils/FIS/FIS13/onSelect'
import { checkInit } from '../../utils/FIS/FIS13/init'
import { checkOnInit } from '../../utils/FIS/FIS13/onInit'
import { checkConfirm } from '../../utils/FIS/FIS13/confirm'
import { checkOnConfirm } from '../../utils/FIS/FIS13/onConfirm'
import { checkStatus } from '../../utils/FIS/FIS13/status'
import { checkOnStatus } from '../../utils/FIS/FIS13/onStatus'
import { checkCancel } from '../../utils/mobility/cancel'
import { checkOnCancel } from '../../utils/mobility/onCancel'

export function validateLogsForFIS13(data: any, flow: string, version: string) {
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

  if (!(flow in insuranceFlows)) {
    logReport = { ...logReport, version: `Invalid flow ${flow}` }
  }

  try {
    switch (flow) {
      case 'HEALTH': {
        if (data[FIS13HealthSequence.SEARCH_1]) {
          const searchResp = search(data[FIS13HealthSequence.SEARCH_1], msgIdSet, flow, FIS13HealthSequence.SEARCH_1)
          if (!_.isEmpty(searchResp)) {
            logReport = { ...logReport, [FIS13HealthSequence.SEARCH_1]: searchResp }
          }
        }

        if (data[FIS13HealthSequence.ON_SEARCH_1]) {
          const onSearchResp = checkOnSearch(
            data[FIS13HealthSequence.ON_SEARCH_1],
            msgIdSet,
            flow,
            FIS13HealthSequence.ON_SEARCH_1,
          )
          if (!_.isEmpty(onSearchResp)) {
            logReport = { ...logReport, [FIS13HealthSequence.ON_SEARCH_1]: onSearchResp }
          }
        }

        if (data[FIS13HealthSequence.SEARCH_2]) {
          const searchResp = search(data[FIS13HealthSequence.SEARCH_2], msgIdSet, flow, FIS13HealthSequence.SEARCH_2)
          if (!_.isEmpty(searchResp)) {
            logReport = { ...logReport, [FIS13HealthSequence.SEARCH_2]: searchResp }
          }
        }

        if (data[FIS13HealthSequence.ON_SEARCH_2]) {
          const onSearchResp = checkOnSearch(
            data[FIS13HealthSequence.ON_SEARCH_2],
            msgIdSet,
            flow,
            FIS13HealthSequence.ON_SEARCH_2,
          )
          if (!_.isEmpty(onSearchResp)) {
            logReport = { ...logReport, [FIS13HealthSequence.ON_SEARCH_2]: onSearchResp }
          }
        }

        if (data[FIS13HealthSequence.SELECT]) {
          const selectResp = checkSelect(data[FIS13HealthSequence.SELECT], msgIdSet, FIS13HealthSequence.SELECT)
          if (!_.isEmpty(selectResp)) {
            logReport = { ...logReport, [FIS13HealthSequence.SELECT]: selectResp }
          }
        }

        if (data[FIS13HealthSequence.ON_SELECT]) {
          const onSelectResp = checkOnSelect(
            data[FIS13HealthSequence.ON_SELECT],
            msgIdSet,
            FIS13HealthSequence.ON_SELECT,
          )
          if (!_.isEmpty(onSelectResp)) {
            logReport = { ...logReport, [FIS13HealthSequence.ON_SELECT]: onSelectResp }
          }
        }

        if (data[FIS13HealthSequence.INIT_1]) {
          const init = checkInit(data[FIS13HealthSequence.INIT_1], msgIdSet, FIS13HealthSequence.INIT_1)
          if (!_.isEmpty(init)) {
            logReport = { ...logReport, [FIS13HealthSequence.INIT_1]: init }
          }
        }

        if (data[FIS13HealthSequence.ON_INIT_1]) {
          const onInit = checkOnInit(data[FIS13HealthSequence.ON_INIT_1], msgIdSet, FIS13HealthSequence.ON_INIT_1)
          if (!_.isEmpty(onInit)) {
            logReport = { ...logReport, [FIS13HealthSequence.ON_INIT_1]: onInit }
          }
        }

        if (data[FIS13HealthSequence.INIT_2]) {
          const init2 = checkInit(data[FIS13HealthSequence.INIT_2], msgIdSet, FIS13HealthSequence.INIT_2)
          if (!_.isEmpty(init2)) {
            logReport = { ...logReport, [FIS13HealthSequence.INIT_2]: init2 }
          }
        }

        if (data[FIS13HealthSequence.ON_INIT_2]) {
          const onInit2 = checkOnInit(data[FIS13HealthSequence.ON_INIT_2], msgIdSet, FIS13HealthSequence.ON_INIT_2)
          if (!_.isEmpty(onInit2)) {
            logReport = { ...logReport, [FIS13HealthSequence.ON_INIT_2]: onInit2 }
          }
        }

        if (data[FIS13HealthSequence.STATUS]) {
          const status = checkStatus(data[FIS13HealthSequence.STATUS], msgIdSet)
          if (!_.isEmpty(status)) {
            logReport = { ...logReport, [FIS13HealthSequence.STATUS]: status }
          }
        }

        if (data[FIS13HealthSequence.ON_STATUS]) {
          const onStatus = checkOnStatus(data[FIS13HealthSequence.ON_STATUS], msgIdSet, flow)
          if (!_.isEmpty(onStatus)) {
            logReport = { ...logReport, [FIS13HealthSequence.ON_STATUS]: onStatus }
          }
        }

        if (data[FIS13HealthSequence.INIT_3]) {
          const init3 = checkInit(data[FIS13HealthSequence.INIT_3], msgIdSet, FIS13HealthSequence.INIT_3)
          if (!_.isEmpty(init3)) {
            logReport = { ...logReport, [FIS13HealthSequence.INIT_3]: init3 }
          }
        }

        if (data[FIS13HealthSequence.ON_INIT_3]) {
          const onInit3 = checkOnInit(data[FIS13HealthSequence.ON_INIT_3], msgIdSet, FIS13HealthSequence.ON_INIT_3)
          if (!_.isEmpty(onInit3)) {
            logReport = { ...logReport, [FIS13HealthSequence.ON_INIT_3]: onInit3 }
          }
        }

        if (data[FIS13HealthSequence.CONFIRM]) {
          const confirm = checkConfirm(data[FIS13HealthSequence.CONFIRM], msgIdSet)
          if (!_.isEmpty(confirm)) {
            logReport = { ...logReport, [FIS13HealthSequence.CONFIRM]: confirm }
          }
        }

        if (data[FIS13HealthSequence.ON_CONFIRM]) {
          const onConfirm = checkOnConfirm(data[FIS13HealthSequence.ON_CONFIRM], msgIdSet)
          if (!_.isEmpty(onConfirm)) {
            logReport = { ...logReport, [FIS13HealthSequence.ON_CONFIRM]: onConfirm }
          }
        }

        if (data[FIS13HealthSequence.CANCEL]) {
          const cancel = checkCancel(data[FIS13HealthSequence.CANCEL], msgIdSet, flow)
          if (!_.isEmpty(cancel)) {
            logReport = { ...logReport, [FIS13HealthSequence.CANCEL]: cancel }
          }
        }

        // if (data[FIS13HealthSequence.ON_CANCEL]) {
        //   const onCancel = checkOnCancel(data[FIS13HealthSequence.ON_CANCEL], msgIdSet, flow)
        //   if (!_.isEmpty(onCancel)) {
        //     logReport = { ...logReport, [FIS13HealthSequence.ON_CANCEL]: onCancel }
        //   }
        // }
        break
      }

      default:
        logReport = { ...logReport, version: `Invalid flow ${flow}` }
        break
    }

    logger.info(logReport, 'Report Generated Successfully!!')
    return logReport
  } catch (error: any) {
    logger.error(error.message)
    return error.message
  }
}
