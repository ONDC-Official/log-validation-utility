import _ from 'lodash'
import { dropDB } from '../dao'
import { logger } from '../logger'
import { FIS13HealthSequence } from '../../constants'
import { search } from '../../utils/FIS/FIS13/search'
import { checkOnSearch } from '../../utils/FIS/FIS13/onSearch'
import { checkSelect } from '../../utils/FIS/FIS13/select'
import { checkOnSelect } from '../../utils/FIS/FIS13/onSelect'
import { checkInit } from '../../utils/FIS/FIS13/init'
import { checkOnInit } from '../../utils/FIS/FIS13/onInit'
import { checkConfirm } from '../../utils/FIS/FIS13/confirm'
import { checkOnConfirm } from '../../utils/FIS/FIS13/onConfirm'

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

  // if (!(flow in insuranceFlows)) {
  //   logReport = { ...logReport, version: `Invalid flow ${flow}` }
  // }

  switch (flow) {
    case 'HEALTH': {
      try {
        if (data[FIS13HealthSequence.SEARCH]) {
          const searchResp = search(data[FIS13HealthSequence.SEARCH], msgIdSet, flow, FIS13HealthSequence.SEARCH)
          if (!_.isEmpty(searchResp)) {
            logReport = { ...logReport, [FIS13HealthSequence.SEARCH]: searchResp }
          }
        }

        if (data[FIS13HealthSequence.ON_SEARCH]) {
          const onSearchResp = checkOnSearch(
            data[FIS13HealthSequence.ON_SEARCH],
            msgIdSet,
            flow,
            FIS13HealthSequence.ON_SEARCH,
          )
          if (!_.isEmpty(onSearchResp)) {
            logReport = { ...logReport, [FIS13HealthSequence.ON_SEARCH]: onSearchResp }
          }
        }

        if (data[FIS13HealthSequence.SEARCH_OFFER]) {
          const searchResp = search(data[FIS13HealthSequence.SEARCH_OFFER], msgIdSet, flow, FIS13HealthSequence.SEARCH_OFFER)
          if (!_.isEmpty(searchResp)) {
            logReport = { ...logReport, [FIS13HealthSequence.SEARCH_OFFER]: searchResp }
          }
        }

        if (data[FIS13HealthSequence.ON_SEARCH_OFFER]) {
          const onSearchResp = checkOnSearch(
            data[FIS13HealthSequence.ON_SEARCH_OFFER],
            msgIdSet,
            flow,
            FIS13HealthSequence.ON_SEARCH_OFFER,
          )
          if (!_.isEmpty(onSearchResp)) {
            logReport = { ...logReport, [FIS13HealthSequence.ON_SEARCH_OFFER]: onSearchResp }
          }
        }

        if (data[FIS13HealthSequence.SELECT_1]) {
          const selectResp = checkSelect(data[FIS13HealthSequence.SELECT_1], msgIdSet, FIS13HealthSequence.SELECT_1)
          if (!_.isEmpty(selectResp)) {
            logReport = { ...logReport, [FIS13HealthSequence.SELECT_1]: selectResp }
          }
        }

        if (data[FIS13HealthSequence.ON_SELECT_1]) {
          const onSelectResp = checkOnSelect(
            data[FIS13HealthSequence.ON_SELECT_1],
            msgIdSet,
            FIS13HealthSequence.ON_SELECT_1,
          )
          if (!_.isEmpty(onSelectResp)) {
            logReport = { ...logReport, [FIS13HealthSequence.ON_SELECT_1]: onSelectResp }
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
          const init = checkInit(data[FIS13HealthSequence.INIT_2], msgIdSet, FIS13HealthSequence.INIT_2)
          if (!_.isEmpty(init)) {
            logReport = { ...logReport, [FIS13HealthSequence.INIT_2]: init }
          }
        }

        if (data[FIS13HealthSequence.ON_INIT_2]) {
          const onInit = checkOnInit(data[FIS13HealthSequence.ON_INIT_2], msgIdSet, FIS13HealthSequence.ON_INIT_2)
          if (!_.isEmpty(onInit)) {
            logReport = { ...logReport, [FIS13HealthSequence.ON_INIT_2]: onInit }
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

        logger.info(logReport, 'Report Generated Successfully!!')
        return logReport
      } catch (error: any) {
        logger.error(error.message)
        return error.message
      }

      break
    }

    case 'MARINE': {
      try {
        if (data[FIS13HealthSequence.SEARCH]) {
          const searchResp = search(data[FIS13HealthSequence.SEARCH], msgIdSet, flow, FIS13HealthSequence.SEARCH)
          if (!_.isEmpty(searchResp)) {
            logReport = { ...logReport, [FIS13HealthSequence.SEARCH]: searchResp }
          }
        }

        if (data[FIS13HealthSequence.ON_SEARCH]) {
          const onSearchResp = checkOnSearch(
            data[FIS13HealthSequence.ON_SEARCH],
            msgIdSet,
            flow,
            FIS13HealthSequence.ON_SEARCH,
          )
          if (!_.isEmpty(onSearchResp)) {
            logReport = { ...logReport, [FIS13HealthSequence.ON_SEARCH]: onSearchResp }
          }
        }

        if (data[FIS13HealthSequence.SELECT_1]) {
          const selectResp = checkSelect(data[FIS13HealthSequence.SELECT_1], msgIdSet, FIS13HealthSequence.SELECT_1)
          if (!_.isEmpty(selectResp)) {
            logReport = { ...logReport, [FIS13HealthSequence.SELECT_1]: selectResp }
          }
        }

        if (data[FIS13HealthSequence.ON_SELECT_1]) {
          const onSelectResp = checkOnSelect(
            data[FIS13HealthSequence.ON_SELECT_1],
            msgIdSet,
            FIS13HealthSequence.ON_SELECT_1,
          )
          if (!_.isEmpty(onSelectResp)) {
            logReport = { ...logReport, [FIS13HealthSequence.ON_SELECT_1]: onSelectResp }
          }
        }

        if (data[FIS13HealthSequence.SELECT_2]) {
          const selectResp = checkSelect(data[FIS13HealthSequence.SELECT_2], msgIdSet, FIS13HealthSequence.SELECT_2)
          if (!_.isEmpty(selectResp)) {
            logReport = { ...logReport, [FIS13HealthSequence.SELECT_2]: selectResp }
          }
        }

        if (data[FIS13HealthSequence.ON_SELECT_2]) {
          const onSelectResp = checkOnSelect(
            data[FIS13HealthSequence.ON_SELECT_2],
            msgIdSet,
            FIS13HealthSequence.ON_SELECT_2,
          )
          if (!_.isEmpty(onSelectResp)) {
            logReport = { ...logReport, [FIS13HealthSequence.ON_SELECT_2]: onSelectResp }
          }
        }

        if (data[FIS13HealthSequence.INIT]) {
          const init = checkInit(data[FIS13HealthSequence.INIT], msgIdSet, FIS13HealthSequence.INIT)
          if (!_.isEmpty(init)) {
            logReport = { ...logReport, [FIS13HealthSequence.INIT]: init }
          }
        }

        if (data[FIS13HealthSequence.ON_INIT]) {
          const onInit = checkOnInit(data[FIS13HealthSequence.ON_INIT], msgIdSet, FIS13HealthSequence.ON_INIT)
          if (!_.isEmpty(onInit)) {
            logReport = { ...logReport, [FIS13HealthSequence.ON_INIT]: onInit }
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

        logger.info(logReport, 'Report Generated Successfully!!')
        return logReport
      } catch (error: any) {
        logger.error(error.message)
        return error.message
      }

      break
    }

    default:
      logReport = { ...logReport, version: `Invalid flow ${flow}` }
      break
  }
}
