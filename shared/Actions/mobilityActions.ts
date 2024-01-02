import _ from 'lodash'
import { dropDB } from '../dao'
import { logger } from '../logger'
import { mobilitySequence } from '../../constants'
import { search } from '../../utils/mobility/search'
import { checkCancel } from '../../utils/mobility/cancel'
import { checkOnSearch } from '../../utils/mobility/onSearch'
import { checkSelect } from '../../utils/mobility/select'
import { checkOnSelect } from '../../utils/mobility/onSelect'
import { checkInit } from '../../utils/mobility/init'
import { checkOnInit } from '../../utils/mobility/onInit'
import { checkConfirm } from '../../utils/mobility/confirm'
import { checkOnConfirm } from '../../utils/mobility/onConfirm'
import { checkUpdate } from '../../utils/mobility/update'
import { checkOnUpdate } from '../../utils/mobility/onUpdate'
import { checkStatus } from '../../utils/mobility/status'
import { checkOnStatus } from '../../utils/mobility/onStatus'
import { checkOnCancel } from '../../utils/mobility/onCancel'

export function validateLogsForMobility(data: any, domain: string, flow: string) {
  const msgIdSet = new Set()
  let logReport: any = {}
  try {
    dropDB()
  } catch (error) {
    logger.error('!!Error while removing LMDB', error)
  }

  console.log('domain', domain)

  try {
    if (data[mobilitySequence.SEARCH]) {
      const searchResp = search(data[mobilitySequence.SEARCH], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [mobilitySequence.SEARCH]: searchResp }
      }
    }

    if (data[mobilitySequence.ON_SEARCH]) {
      const searchResp = checkOnSearch(data[mobilitySequence.ON_SEARCH], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [mobilitySequence.ON_SEARCH]: searchResp }
      }
    }

    if (data[mobilitySequence.SELECT]) {
      const searchResp = checkSelect(data[mobilitySequence.SELECT], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [mobilitySequence.SELECT]: searchResp }
      }
    }

    if (data[mobilitySequence.ON_SELECT]) {
      const searchResp = checkOnSelect(data[mobilitySequence.ON_SELECT], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [mobilitySequence.ON_SELECT]: searchResp }
      }
    }

    if (data[mobilitySequence.INIT]) {
      const searchResp = checkInit(data[mobilitySequence.INIT], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [mobilitySequence.INIT]: searchResp }
      }
    }

    if (data[mobilitySequence.ON_INIT]) {
      const searchResp = checkOnInit(data[mobilitySequence.ON_INIT], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [mobilitySequence.ON_INIT]: searchResp }
      }
    }

    if (data[mobilitySequence.CONFIRM]) {
      const searchResp = checkConfirm(data[mobilitySequence.CONFIRM], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [mobilitySequence.CONFIRM]: searchResp }
      }
    }

    if (data[mobilitySequence.ON_CONFIRM]) {
      const searchResp = checkOnConfirm(data[mobilitySequence.ON_CONFIRM], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [mobilitySequence.ON_CONFIRM]: searchResp }
      }
    }

    if (data[mobilitySequence.UPDATE]) {
      const searchResp = checkUpdate(data[mobilitySequence.UPDATE], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [mobilitySequence.UPDATE]: searchResp }
      }
    }

    if (data[mobilitySequence.ON_UPDATE]) {
      const searchResp = checkOnUpdate(data[mobilitySequence.ON_UPDATE])
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [mobilitySequence.ON_UPDATE]: searchResp }
      }
    }

    if (data[mobilitySequence.STATUS]) {
      const searchResp = checkStatus(data[mobilitySequence.STATUS], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [mobilitySequence.STATUS]: searchResp }
      }
    }

    if (data[mobilitySequence.ON_STATUS]) {
      const searchResp = checkOnStatus(data[mobilitySequence.ON_STATUS], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [mobilitySequence.ON_STATUS]: searchResp }
      }
    }

    if (data[mobilitySequence.CANCEL]) {
      const searchResp = checkCancel(data[mobilitySequence.CANCEL], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [mobilitySequence.CANCEL]: searchResp }
      }
    }

    if (data[mobilitySequence.ON_CANCEL]) {
      const searchResp = checkOnCancel(data[mobilitySequence.ON_CANCEL], msgIdSet, flow)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [mobilitySequence.ON_CANCEL]: searchResp }
      }
    }

    logger.info(logReport, 'Report Generated Successfully!!')
    return logReport
  } catch (error: any) {
    logger.error(error.message)
    return error.message
  }
}
