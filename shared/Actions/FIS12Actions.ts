import _ from 'lodash'
import { dropDB, setValue } from '../dao'
import { logger } from '../logger'
import { FisApiSequence, fisFlows } from '../../constants'
import { search } from '../../utils/FIS/FIS12/search'
import { checkOnSearch } from '../../utils/FIS/FIS12/onSearch'
import { checkSelect } from '../../utils/FIS/FIS12/select'
import { checkOnSelect } from '../../utils/FIS/FIS12/onSelect'
import { checkInit } from '../../utils/FIS/FIS12/init'
import { checkOnInit } from '../../utils/FIS/FIS12/onInit'
import { checkConfirm } from '../../utils/FIS/FIS12/confirm'
import { checkOnConfirm } from '../../utils/FIS/FIS12/onConfirm'
import { checkUpdate } from '../../utils/FIS/FIS12/update'
import { checkOnUpdate } from '../../utils/FIS/FIS12/onUpdate'
import { checkStatus } from '../../utils/FIS/FIS12/status'
import { checkOnStatus } from '../../utils/FIS/FIS12/onStatus'

export function validateLogsForFIS12(data: any, flow: string, version: string) {
  const msgIdSet = new Set()
  let logReport: any = {}
  setValue('version', version)

  try {
    dropDB()
  } catch (error) {
    logger.error('!!Error while removing LMDB', error)
  }

  if (!(flow in fisFlows)) {
    logReport = { ...logReport, version: `Invalid flow ${flow}` }
  }

  try {
    switch (version) {
      case '2.0.0': {
        if (data[FisApiSequence.SEARCH]) {
          const searchResp = search(data[FisApiSequence.SEARCH], msgIdSet, flow)
          if (!_.isEmpty(searchResp)) {
            logReport = { ...logReport, [FisApiSequence.SEARCH]: searchResp }
          }
        }

        if (data[FisApiSequence.ON_SEARCH]) {
          const onSearchResp = checkOnSearch(data[FisApiSequence.ON_SEARCH], msgIdSet, FisApiSequence.ON_SEARCH, flow)
          if (!_.isEmpty(onSearchResp)) {
            logReport = { ...logReport, [FisApiSequence.ON_SEARCH]: onSearchResp }
          }
        }

        if (data[FisApiSequence.SELECT_1]) {
          const selectResp = checkSelect(data[FisApiSequence.SELECT_1], msgIdSet, FisApiSequence.SELECT_1)
          if (!_.isEmpty(selectResp)) {
            logReport = { ...logReport, [FisApiSequence.SELECT_1]: selectResp }
          }
        }

        if (data[FisApiSequence.ON_SELECT_1]) {
          const onSelectResp = checkOnSelect(
            data[FisApiSequence.ON_SELECT_1],
            msgIdSet,
            FisApiSequence.ON_SELECT_1,
            flow,
          )
          if (!_.isEmpty(onSelectResp)) {
            logReport = { ...logReport, [FisApiSequence.ON_SELECT_1]: onSelectResp }
          }
        }

        if (data[FisApiSequence.SELECT_2]) {
          const select2Resp = checkSelect(data[FisApiSequence.SELECT_2], msgIdSet, FisApiSequence.SELECT_2)
          if (!_.isEmpty(select2Resp)) {
            logReport = { ...logReport, [FisApiSequence.SELECT_2]: select2Resp }
          }
        }

        if (data[FisApiSequence.ON_SELECT_2]) {
          const onSelect2Resp = checkOnSelect(
            data[FisApiSequence.ON_SELECT_2],
            msgIdSet,
            FisApiSequence.ON_SELECT_2,
            flow,
          )
          if (!_.isEmpty(onSelect2Resp)) {
            logReport = { ...logReport, [FisApiSequence.ON_SELECT_2]: onSelect2Resp }
          }
        }

        if (data[FisApiSequence.SELECT_3]) {
          const select3Resp = checkSelect(data[FisApiSequence.SELECT_3], msgIdSet, FisApiSequence.SELECT_3)
          if (!_.isEmpty(select3Resp)) {
            logReport = { ...logReport, [FisApiSequence.SELECT_3]: select3Resp }
          }
        }

        if (data[FisApiSequence.ON_SELECT_3]) {
          const onSelect3Resp = checkOnSelect(
            data[FisApiSequence.ON_SELECT_3],
            msgIdSet,
            FisApiSequence.ON_SELECT_3,
            flow,
          )
          if (!_.isEmpty(onSelect3Resp)) {
            logReport = { ...logReport, [FisApiSequence.ON_SELECT_3]: onSelect3Resp }
          }
        }

        if (data[FisApiSequence.INIT_1]) {
          const init = checkInit(data[FisApiSequence.INIT_1], msgIdSet, FisApiSequence.INIT_1)
          if (!_.isEmpty(init)) {
            logReport = { ...logReport, [FisApiSequence.INIT_1]: init }
          }
        }

        if (data[FisApiSequence.ON_INIT_1]) {
          const onInit = checkOnInit(data[FisApiSequence.ON_INIT_1], msgIdSet, FisApiSequence.ON_INIT_1, flow)
          if (!_.isEmpty(onInit)) {
            logReport = { ...logReport, [FisApiSequence.ON_INIT_1]: onInit }
          }
        }

        if (data[FisApiSequence.INIT_2]) {
          const init2 = checkInit(data[FisApiSequence.INIT_2], msgIdSet, FisApiSequence.INIT_2)
          if (!_.isEmpty(init2)) {
            logReport = { ...logReport, [FisApiSequence.INIT_2]: init2 }
          }
        }

        if (data[FisApiSequence.ON_INIT_2]) {
          const onInit2 = checkOnInit(data[FisApiSequence.ON_INIT_2], msgIdSet, FisApiSequence.ON_INIT_2, flow)
          if (!_.isEmpty(onInit2)) {
            logReport = { ...logReport, [FisApiSequence.ON_INIT_2]: onInit2 }
          }
        }

        if (data[FisApiSequence.INIT_3]) {
          const init3 = checkInit(data[FisApiSequence.INIT_3], msgIdSet, FisApiSequence.INIT_3)
          if (!_.isEmpty(init3)) {
            logReport = { ...logReport, [FisApiSequence.INIT_3]: init3 }
          }
        }

        if (data[FisApiSequence.ON_INIT_3]) {
          const onInit3 = checkOnInit(data[FisApiSequence.ON_INIT_3], msgIdSet, FisApiSequence.ON_INIT_3, flow)
          if (!_.isEmpty(onInit3)) {
            logReport = { ...logReport, [FisApiSequence.ON_INIT_3]: onInit3 }
          }
        }

        if (data[FisApiSequence.CONFIRM]) {
          const confirm = checkConfirm(data[FisApiSequence.CONFIRM], msgIdSet)
          if (!_.isEmpty(confirm)) {
            logReport = { ...logReport, [FisApiSequence.CONFIRM]: confirm }
          }
        }

        if (data[FisApiSequence.ON_CONFIRM]) {
          const onConfirm = checkOnConfirm(data[FisApiSequence.ON_CONFIRM], msgIdSet, flow)
          if (!_.isEmpty(onConfirm)) {
            logReport = { ...logReport, [FisApiSequence.ON_CONFIRM]: onConfirm }
          }
        }

        if (flow === fisFlows.PERSONAL) {
          if (data[FisApiSequence.ON_UPDATE_UNSOLICATED]) {
            const onUpdate = checkOnUpdate(
              data[FisApiSequence.ON_UPDATE_UNSOLICATED],
              msgIdSet,
              flow,
              FisApiSequence.ON_UPDATE_UNSOLICATED,
            )
            if (!_.isEmpty(onUpdate)) {
              logReport = { ...logReport, [FisApiSequence.ON_UPDATE_UNSOLICATED]: onUpdate }
            }
          }
        }

        if (data[FisApiSequence.UPDATE]) {
          const update = checkUpdate(data[FisApiSequence.UPDATE], msgIdSet, flow)
          if (!_.isEmpty(update)) {
            logReport = { ...logReport, [FisApiSequence.UPDATE]: update }
          }
        }

        if (data[FisApiSequence.ON_UPDATE]) {
          const onUpdate = checkOnUpdate(data[FisApiSequence.ON_UPDATE], msgIdSet, flow, FisApiSequence.ON_UPDATE)
          if (!_.isEmpty(onUpdate)) {
            logReport = { ...logReport, [FisApiSequence.ON_UPDATE]: onUpdate }
          }
        }

        if (flow === 'LOAN_FORECLOSURE') {
          if (data[FisApiSequence.ON_UPDATE_UNSOLICATED]) {
            const onUpdate = checkOnUpdate(
              data[FisApiSequence.ON_UPDATE_UNSOLICATED],
              msgIdSet,
              flow,
              FisApiSequence.ON_UPDATE_UNSOLICATED,
            )
            if (!_.isEmpty(onUpdate)) {
              logReport = { ...logReport, [FisApiSequence.ON_UPDATE_UNSOLICATED]: onUpdate }
            }
          }
        }

        if (data[FisApiSequence.STATUS]) {
          const status = checkStatus(data[FisApiSequence.STATUS], msgIdSet)
          if (!_.isEmpty(status)) {
            logReport = { ...logReport, [FisApiSequence.STATUS]: status }
          }
        }

        if (data[FisApiSequence.ON_STATUS]) {
          const onStatus = checkOnStatus(data[FisApiSequence.ON_STATUS], msgIdSet, FisApiSequence.ON_STATUS)
          if (!_.isEmpty(onStatus)) {
            logReport = { ...logReport, [FisApiSequence.ON_STATUS]: onStatus }
          }
        }

        if (data[FisApiSequence.ON_STATUS_KYC]) {
          const onStatusKyc = checkOnStatus(data[FisApiSequence.ON_STATUS_KYC], msgIdSet, FisApiSequence.ON_STATUS_KYC)
          if (!_.isEmpty(onStatusKyc)) {
            logReport = { ...logReport, [FisApiSequence.ON_STATUS_KYC]: onStatusKyc }
          }
        }

        if (data[FisApiSequence.ON_STATUS_EMANDATE]) {
          const onStatusEmandate = checkOnStatus(
            data[FisApiSequence.ON_STATUS_EMANDATE],
            msgIdSet,
            FisApiSequence.ON_STATUS_EMANDATE,
          )
          if (!_.isEmpty(onStatusEmandate)) {
            logReport = { ...logReport, [FisApiSequence.ON_STATUS_EMANDATE]: onStatusEmandate }
          }
        }

        if (data[FisApiSequence.ON_STATUS_LOAN]) {
          const onStatusLoan = checkOnStatus(
            data[FisApiSequence.ON_STATUS_LOAN],
            msgIdSet,
            FisApiSequence.ON_STATUS_LOAN,
          )
          if (!_.isEmpty(onStatusLoan)) {
            logReport = { ...logReport, [FisApiSequence.ON_STATUS_LOAN]: onStatusLoan }
          }
        }

        break
      }

      case '2.1.0': {
        if (data[FisApiSequence.SEARCH]) {
          const searchResp = search(data[FisApiSequence.SEARCH], msgIdSet, flow)
          if (!_.isEmpty(searchResp)) {
            logReport = { ...logReport, [FisApiSequence.SEARCH]: searchResp }
          }
        }

        if (data[FisApiSequence.ON_SEARCH]) {
          const onSearchResp = checkOnSearch(data[FisApiSequence.ON_SEARCH], msgIdSet, FisApiSequence.ON_SEARCH, flow)
          if (!_.isEmpty(onSearchResp)) {
            logReport = { ...logReport, [FisApiSequence.ON_SEARCH]: onSearchResp }
          }
        }

        if (data[FisApiSequence.SEARCH_2]) {
          const searchResp = search(data[FisApiSequence.SEARCH_2], msgIdSet, flow)
          if (!_.isEmpty(searchResp)) {
            logReport = { ...logReport, [FisApiSequence.SEARCH_2]: searchResp }
          }
        }

        if (data[FisApiSequence.ON_SEARCH_2]) {
          const onSearchResp = checkOnSearch(
            data[FisApiSequence.ON_SEARCH_2],
            msgIdSet,
            FisApiSequence.ON_SEARCH_2,
            flow,
          )
          if (!_.isEmpty(onSearchResp)) {
            logReport = { ...logReport, [FisApiSequence.ON_SEARCH_2]: onSearchResp }
          }
        }

        if (data[FisApiSequence.SEARCH_3]) {
          const searchResp = search(data[FisApiSequence.SEARCH_3], msgIdSet, flow)
          if (!_.isEmpty(searchResp)) {
            logReport = { ...logReport, [FisApiSequence.SEARCH_3]: searchResp }
          }
        }

        if (data[FisApiSequence.ON_SEARCH_3]) {
          const onSearchResp = checkOnSearch(
            data[FisApiSequence.ON_SEARCH_3],
            msgIdSet,
            FisApiSequence.ON_SEARCH_3,
            flow,
          )
          if (!_.isEmpty(onSearchResp)) {
            logReport = { ...logReport, [FisApiSequence.ON_SEARCH_3]: onSearchResp }
          }
        }

        if (data[FisApiSequence.SELECT_1]) {
          const selectResp = checkSelect(data[FisApiSequence.SELECT_1], msgIdSet, FisApiSequence.SELECT_1)
          if (!_.isEmpty(selectResp)) {
            logReport = { ...logReport, [FisApiSequence.SELECT_1]: selectResp }
          }
        }

        if (data[FisApiSequence.ON_SELECT_1]) {
          const onSelectResp = checkOnSelect(
            data[FisApiSequence.ON_SELECT_1],
            msgIdSet,
            FisApiSequence.ON_SELECT_1,
            flow,
          )
          if (!_.isEmpty(onSelectResp)) {
            logReport = { ...logReport, [FisApiSequence.ON_SELECT_1]: onSelectResp }
          }
        }

        if (data[FisApiSequence.SELECT_2]) {
          const select2Resp = checkSelect(data[FisApiSequence.SELECT_2], msgIdSet, FisApiSequence.SELECT_2)
          if (!_.isEmpty(select2Resp)) {
            logReport = { ...logReport, [FisApiSequence.SELECT_2]: select2Resp }
          }
        }

        if (data[FisApiSequence.ON_SELECT_2]) {
          const onSelect2Resp = checkOnSelect(
            data[FisApiSequence.ON_SELECT_2],
            msgIdSet,
            FisApiSequence.ON_SELECT_2,
            flow,
          )
          if (!_.isEmpty(onSelect2Resp)) {
            logReport = { ...logReport, [FisApiSequence.ON_SELECT_2]: onSelect2Resp }
          }
        }

        if (data[FisApiSequence.INIT_1]) {
          const init = checkInit(data[FisApiSequence.INIT_1], msgIdSet, FisApiSequence.INIT_1)
          if (!_.isEmpty(init)) {
            logReport = { ...logReport, [FisApiSequence.INIT_1]: init }
          }
        }

        if (data[FisApiSequence.ON_INIT_1]) {
          const onInit = checkOnInit(data[FisApiSequence.ON_INIT_1], msgIdSet, FisApiSequence.ON_INIT_1, flow)
          if (!_.isEmpty(onInit)) {
            logReport = { ...logReport, [FisApiSequence.ON_INIT_1]: onInit }
          }
        }

        if (data[FisApiSequence.INIT_2]) {
          const init2 = checkInit(data[FisApiSequence.INIT_2], msgIdSet, FisApiSequence.INIT_2)
          if (!_.isEmpty(init2)) {
            logReport = { ...logReport, [FisApiSequence.INIT_2]: init2 }
          }
        }

        if (data[FisApiSequence.ON_INIT_2]) {
          const onInit2 = checkOnInit(data[FisApiSequence.ON_INIT_2], msgIdSet, FisApiSequence.ON_INIT_2, flow)
          if (!_.isEmpty(onInit2)) {
            logReport = { ...logReport, [FisApiSequence.ON_INIT_2]: onInit2 }
          }
        }

        if (data[FisApiSequence.INIT_3]) {
          const init3 = checkInit(data[FisApiSequence.INIT_3], msgIdSet, FisApiSequence.INIT_3)
          if (!_.isEmpty(init3)) {
            logReport = { ...logReport, [FisApiSequence.INIT_3]: init3 }
          }
        }

        if (data[FisApiSequence.ON_INIT_3]) {
          const onInit3 = checkOnInit(data[FisApiSequence.ON_INIT_3], msgIdSet, FisApiSequence.ON_INIT_3, flow)
          if (!_.isEmpty(onInit3)) {
            logReport = { ...logReport, [FisApiSequence.ON_INIT_3]: onInit3 }
          }
        }

        if (data[FisApiSequence.INIT_4]) {
          const init3 = checkInit(data[FisApiSequence.INIT_4], msgIdSet, FisApiSequence.INIT_4)
          if (!_.isEmpty(init3)) {
            logReport = { ...logReport, [FisApiSequence.INIT_4]: init3 }
          }
        }

        if (data[FisApiSequence.ON_INIT_4]) {
          const onInit3 = checkOnInit(data[FisApiSequence.ON_INIT_4], msgIdSet, FisApiSequence.ON_INIT_4, flow)
          if (!_.isEmpty(onInit3)) {
            logReport = { ...logReport, [FisApiSequence.ON_INIT_4]: onInit3 }
          }
        }

        if (data[FisApiSequence.CONFIRM]) {
          const confirm = checkConfirm(data[FisApiSequence.CONFIRM], msgIdSet)
          if (!_.isEmpty(confirm)) {
            logReport = { ...logReport, [FisApiSequence.CONFIRM]: confirm }
          }
        }

        if (data[FisApiSequence.ON_CONFIRM]) {
          const onConfirm = checkOnConfirm(data[FisApiSequence.ON_CONFIRM], msgIdSet, flow)
          if (!_.isEmpty(onConfirm)) {
            logReport = { ...logReport, [FisApiSequence.ON_CONFIRM]: onConfirm }
          }
        }

        // if (flow === fisFlows.PERSONAL) {
        //   if (data[FisApiSequence.ON_UPDATE_UNSOLICATED]) {
        //     const onUpdate = checkOnUpdate(
        //       data[FisApiSequence.ON_UPDATE_UNSOLICATED],
        //       msgIdSet,
        //       flow,
        //       FisApiSequence.ON_UPDATE_UNSOLICATED,
        //     )
        //     if (!_.isEmpty(onUpdate)) {
        //       logReport = { ...logReport, [FisApiSequence.ON_UPDATE_UNSOLICATED]: onUpdate }
        //     }
        //   }
        // }

        if (data[FisApiSequence.UPDATE]) {
          const update = checkUpdate(data[FisApiSequence.UPDATE], msgIdSet, flow)
          if (!_.isEmpty(update)) {
            logReport = { ...logReport, [FisApiSequence.UPDATE]: update }
          }
        }

        if (data[FisApiSequence.ON_UPDATE]) {
          const onUpdate = checkOnUpdate(data[FisApiSequence.ON_UPDATE], msgIdSet, flow, FisApiSequence.ON_UPDATE)
          if (!_.isEmpty(onUpdate)) {
            logReport = { ...logReport, [FisApiSequence.ON_UPDATE]: onUpdate }
          }
        }

        // if (flow === fisFlows.LOAN_FORECLOSURE) {
        //   if (data[FisApiSequence.ON_UPDATE_UNSOLICATED]) {
        //     const onUpdate = checkOnUpdate(
        //       data[FisApiSequence.ON_UPDATE_UNSOLICATED],
        //       msgIdSet,
        //       flow,
        //       FisApiSequence.ON_UPDATE_UNSOLICATED,
        //     )
        //     if (!_.isEmpty(onUpdate)) {
        //       logReport = { ...logReport, [FisApiSequence.ON_UPDATE_UNSOLICATED]: onUpdate }
        //     }
        //   }
        // }

        if (data[FisApiSequence.STATUS]) {
          const status = checkStatus(data[FisApiSequence.STATUS], msgIdSet)
          if (!_.isEmpty(status)) {
            logReport = { ...logReport, [FisApiSequence.STATUS]: status }
          }
        }

        if (data[FisApiSequence.ON_STATUS]) {
          const onStatus = checkOnStatus(data[FisApiSequence.ON_STATUS], msgIdSet, FisApiSequence.ON_STATUS)
          if (!_.isEmpty(onStatus)) {
            logReport = { ...logReport, [FisApiSequence.ON_STATUS]: onStatus }
          }
        }

        break
      }

      default:
        logReport = { ...logReport, version: `Invalid version ${version}` }
        break
    }

    logger.info(logReport, 'Report Generated Successfully!!')
    return logReport
  } catch (error: any) {
    logger.error(error.message)
    return error.message
  }
}
