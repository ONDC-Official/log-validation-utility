import _ from 'lodash'
import { dropDB, setValue } from '../dao'
import { logger } from '../logger'
import { insuranceFlows, FIS13HealthSequence } from '../../constants'
import { search } from '../../utils/FIS/FIS13/search'
import { checkOnSearch } from '../../utils/FIS/FIS13/onSearch'
import { checkSelect } from '../../utils/FIS/FIS13/select'
import { checkOnSelect } from '../../utils/FIS/FIS13/onSelect'
import { checkInit } from '../../utils/FIS/FIS13/init'
import { checkOnInit } from '../../utils/FIS/FIS13/onInit'
import { checkConfirm } from '../../utils/FIS/FIS13/confirm'
import { checkOnConfirm } from '../../utils/FIS/FIS13/onConfirm'
import { checkOnUpdate } from '../../utils/FIS/FIS13/onUpdate'
import { checkOnStatus } from '../../utils/FIS/FIS13/onStatus'
import { checkCancel } from '../../utils/FIS/FIS13/cancel'
import { checkOnCancel } from '../../utils/FIS/FIS13/onCancel'
import { healthSequence, marineSequence, renewSequence, claimSequence, cancelSequence } from '../../constants/fisFlows'

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

  setValue(`flow`, flow)

  try {
    const processFIS13HealthSequence = (FIS13HealthSequence: any, data: any, logReport: any, flow: string) => {
      if (!(flow in insuranceFlows)) {
        FIS13HealthSequence.forEach((apiSeq: any) => {
          if (data[apiSeq]) {
            const resp = getResponse(apiSeq, data, msgIdSet)
            console.log('resp', resp, apiSeq)
            if (!_.isEmpty(resp)) {
              logReport = { ...logReport, [apiSeq]: resp }
            }
          } else {
            logReport = { ...logReport, [apiSeq]: `Missing required data of : ${apiSeq}` }
          }
        })
        logger.info(logReport, 'Report Generated Successfully!!')
        return logReport
      } else {
        return { invldFlow: 'Provided flow is invalid' }
      }
    }

    const getResponse = (apiSeq: any, data: any, msgIdSet: any) => {
      switch (apiSeq) {
        case FIS13HealthSequence.SEARCH_1:
          return search(data[FIS13HealthSequence.SEARCH_1], msgIdSet, flow, FIS13HealthSequence.SEARCH_1)
        case FIS13HealthSequence.ON_SEARCH_1:
          return checkOnSearch(data[FIS13HealthSequence.ON_SEARCH_1], msgIdSet, flow, FIS13HealthSequence.ON_SEARCH_1)
        case FIS13HealthSequence.SEARCH_2:
          return search(data[FIS13HealthSequence.SEARCH_2], msgIdSet, flow, FIS13HealthSequence.SEARCH_2)
        case FIS13HealthSequence.ON_SEARCH_2:
          return checkOnSearch(data[FIS13HealthSequence.ON_SEARCH_2], msgIdSet, flow, FIS13HealthSequence.ON_SEARCH_2)

        case FIS13HealthSequence.SELECT:
          return checkSelect(data[FIS13HealthSequence.SELECT], msgIdSet, FIS13HealthSequence.SELECT)
        case FIS13HealthSequence.ON_SELECT:
          return checkOnSelect(data[FIS13HealthSequence.ON_SELECT], msgIdSet, FIS13HealthSequence.ON_SELECT)
        case FIS13HealthSequence.SELECT_1:
          return checkSelect(data[FIS13HealthSequence.SELECT_1], msgIdSet, FIS13HealthSequence.SELECT_1)
        case FIS13HealthSequence.ON_SELECT_1:
          return checkOnSelect(data[FIS13HealthSequence.ON_SELECT_1], msgIdSet, FIS13HealthSequence.ON_SELECT_1)
        case FIS13HealthSequence.SELECT_2:
          return checkSelect(data[FIS13HealthSequence.SELECT_2], msgIdSet, FIS13HealthSequence.SELECT_2)
        case FIS13HealthSequence.ON_SELECT_2:
          return checkOnSelect(data[FIS13HealthSequence.ON_SELECT_2], msgIdSet, FIS13HealthSequence.ON_SELECT_2)

        case FIS13HealthSequence.INIT:
          return checkInit(data[FIS13HealthSequence.INIT], msgIdSet, FIS13HealthSequence.INIT)
        case FIS13HealthSequence.ON_INIT:
          return checkOnInit(data[FIS13HealthSequence.ON_INIT], msgIdSet, FIS13HealthSequence.ON_INIT)
        case FIS13HealthSequence.INIT_1:
          return checkInit(data[FIS13HealthSequence.INIT_1], msgIdSet, FIS13HealthSequence.INIT_1)
        case FIS13HealthSequence.ON_INIT_1:
          return checkOnInit(data[FIS13HealthSequence.ON_INIT_1], msgIdSet, FIS13HealthSequence.ON_INIT_1)
        case FIS13HealthSequence.INIT_2:
          return checkInit(data[FIS13HealthSequence.INIT_2], msgIdSet, FIS13HealthSequence.INIT_2)
        case FIS13HealthSequence.ON_INIT_2:
          return checkOnInit(data[FIS13HealthSequence.ON_INIT_2], msgIdSet, FIS13HealthSequence.ON_INIT_2)

        case FIS13HealthSequence.CONFIRM:
          return checkConfirm(data[FIS13HealthSequence.CONFIRM], msgIdSet)
        case FIS13HealthSequence.ON_CONFIRM:
          return checkOnConfirm(data[FIS13HealthSequence.ON_CONFIRM], msgIdSet)

        case FIS13HealthSequence.ON_UPDATE_1:
          return checkOnUpdate(data[FIS13HealthSequence.ON_UPDATE_1], msgIdSet)
        case FIS13HealthSequence.ON_UPDATE_2:
          return checkOnUpdate(data[FIS13HealthSequence.ON_UPDATE_2], msgIdSet)
        case FIS13HealthSequence.ON_UPDATE_3:
          return checkOnUpdate(data[FIS13HealthSequence.ON_UPDATE_3], msgIdSet)

        case FIS13HealthSequence.ON_STATUS:
          return checkOnStatus(data[FIS13HealthSequence.ON_STATUS], msgIdSet, flow)

        case FIS13HealthSequence.CANCEL:
          return checkCancel(data[FIS13HealthSequence.CANCEL], msgIdSet)
        case FIS13HealthSequence.ON_CANCEL:
          return checkOnCancel(data[FIS13HealthSequence.ON_CANCEL], msgIdSet)

        default:
          return null
      }
    }

    switch (flow) {
      case insuranceFlows.HEALTH:
        logReport = processFIS13HealthSequence(healthSequence, data, logReport, flow)
        break
      case insuranceFlows.CLAIM_HEALTH:
        logReport = processFIS13HealthSequence(claimSequence, data, logReport, flow)
        break
      case insuranceFlows.RENEW_HEALTH:
        logReport = processFIS13HealthSequence(renewSequence, data, logReport, flow)
        break
      case insuranceFlows.MARINE:
        logReport = processFIS13HealthSequence(marineSequence, data, logReport, flow)
        break
      case insuranceFlows.CLAIM_MARINE:
        logReport = processFIS13HealthSequence(claimSequence, data, logReport, flow)
        break
      case insuranceFlows.CANCEL_MARINE:
        logReport = processFIS13HealthSequence(cancelSequence, data, logReport, flow)
        break
    }
    return logReport
  } catch (error: any) {
    logger.error(error)
    console.log(error)
    return error.message
  }

  // if (!(flow in insuranceFlows)) {
  //   logReport = { ...logReport, version: `Invalid flow ${flow}` }
  // }

  // switch (flow) {

  //   case 'MOTOR': {
  //     try {
  //       if (data[FIS13HealthSequence.SEARCH]) {
  //         const searchResp = search(data[FIS13HealthSequence.SEARCH], msgIdSet, flow, FIS13HealthSequence.SEARCH)
  //         if (!_.isEmpty(searchResp)) {
  //           logReport = { ...logReport, [FIS13HealthSequence.SEARCH]: searchResp }
  //         }
  //       }

  //       if (data[FIS13HealthSequence.ON_SEARCH]) {
  //         const onSearchResp = checkOnSearch(
  //           data[FIS13HealthSequence.ON_SEARCH],
  //           msgIdSet,
  //           flow,
  //           FIS13HealthSequence.ON_SEARCH,
  //         )
  //         if (!_.isEmpty(onSearchResp)) {
  //           logReport = { ...logReport, [FIS13HealthSequence.ON_SEARCH]: onSearchResp }
  //         }
  //       }

  //       if (data[FIS13HealthSequence.SELECT_1]) {
  //         const selectResp = checkSelect(data[FIS13HealthSequence.SELECT_1], msgIdSet, FIS13HealthSequence.SELECT_1)
  //         if (!_.isEmpty(selectResp)) {
  //           logReport = { ...logReport, [FIS13HealthSequence.SELECT_1]: selectResp }
  //         }
  //       }

  //       if (data[FIS13HealthSequence.ON_SELECT_1]) {
  //         const onSelectResp = checkOnSelect(
  //           data[FIS13HealthSequence.ON_SELECT_1],
  //           msgIdSet,
  //           FIS13HealthSequence.ON_SELECT_1,
  //         )
  //         if (!_.isEmpty(onSelectResp)) {
  //           logReport = { ...logReport, [FIS13HealthSequence.ON_SELECT_1]: onSelectResp }
  //         }
  //       }

  //       if (data[FIS13HealthSequence.SELECT_2]) {
  //         const selectResp = checkSelect(data[FIS13HealthSequence.SELECT_2], msgIdSet, FIS13HealthSequence.SELECT_2)
  //         if (!_.isEmpty(selectResp)) {
  //           logReport = { ...logReport, [FIS13HealthSequence.SELECT_2]: selectResp }
  //         }
  //       }

  //       if (data[FIS13HealthSequence.ON_SELECT_2]) {
  //         const onSelectResp = checkOnSelect(
  //           data[FIS13HealthSequence.ON_SELECT_2],
  //           msgIdSet,
  //           FIS13HealthSequence.ON_SELECT_2,
  //         )
  //         if (!_.isEmpty(onSelectResp)) {
  //           logReport = { ...logReport, [FIS13HealthSequence.ON_SELECT_2]: onSelectResp }
  //         }
  //       }

  //       if (data[FIS13HealthSequence.INIT]) {
  //         const init = checkInit(data[FIS13HealthSequence.INIT], msgIdSet, FIS13HealthSequence.INIT)
  //         if (!_.isEmpty(init)) {
  //           logReport = { ...logReport, [FIS13HealthSequence.INIT]: init }
  //         }
  //       }

  //       if (data[FIS13HealthSequence.ON_INIT]) {
  //         const onInit = checkOnInit(data[FIS13HealthSequence.ON_INIT], msgIdSet, FIS13HealthSequence.ON_INIT)
  //         if (!_.isEmpty(onInit)) {
  //           logReport = { ...logReport, [FIS13HealthSequence.ON_INIT]: onInit }
  //         }
  //       }

  //       if (data[FIS13HealthSequence.CONFIRM]) {
  //         const confirm = checkConfirm(data[FIS13HealthSequence.CONFIRM], msgIdSet)
  //         if (!_.isEmpty(confirm)) {
  //           logReport = { ...logReport, [FIS13HealthSequence.CONFIRM]: confirm }
  //         }
  //       }

  //       if (data[FIS13HealthSequence.ON_CONFIRM]) {
  //         const onConfirm = checkOnConfirm(data[FIS13HealthSequence.ON_CONFIRM], msgIdSet)
  //         if (!_.isEmpty(onConfirm)) {
  //           logReport = { ...logReport, [FIS13HealthSequence.ON_CONFIRM]: onConfirm }
  //         }
  //       }

  //       logger.info(logReport, 'Report Generated Successfully!!')
  //       return logReport
  //     } catch (error: any) {
  //       logger.error(error.message)
  //       return error.message
  //     }

  //     break
  //   }

  //   default:
  //     logReport = { ...logReport, version: `Invalid flow ${flow}` }
  //     break
  // }
}
