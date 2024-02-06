import _ from 'lodash'
import { dropDB } from '../dao'
import { logger } from '../logger'
import { metroSequence } from '../../constants'
import { search } from '../../utils/metro/search'
import { checkOnSearch } from '../../utils/metro/onSearch'
import { checkSelect } from '../../utils/metro/select'
import { checkOnSelect } from '../../utils/metro/onSelect'
import { checkInit } from '../../utils/metro/init'
import { checkOnInit } from '../../utils/metro/onInit'
import { checkConfirm } from '../../utils/metro/confirm'
import { checkOnConfirm } from '../../utils/metro/onConfirm'


export function validateLogsFormetro(data: any) {
  const msgIdSet = new Set()
  let logReport: any = {}
  try {
    dropDB()
  } catch (error) {
    logger.error('!!Error while removing LMDB', error)
  }



  try {
    if (data[metroSequence.SEARCH]) {
      const searchResp = search(data[metroSequence.SEARCH], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [metroSequence.SEARCH]: searchResp }
      }
    }

    if (data[metroSequence.ON_SEARCH]) {
      const searchResp = checkOnSearch(data[metroSequence.ON_SEARCH], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [metroSequence.ON_SEARCH]: searchResp }
      }
    }

    if (data[metroSequence.SELECT]) {
      const searchResp = checkSelect(data[metroSequence.SELECT], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [metroSequence.SELECT]: searchResp }
      }
    }

    if (data[metroSequence.ON_SELECT]) {
      const searchResp = checkOnSelect(data[metroSequence.ON_SELECT], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [metroSequence.ON_SELECT]: searchResp }
      }
    }

    if (data[metroSequence.INIT]) {
      const searchResp = checkInit(data[metroSequence.INIT], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [metroSequence.INIT]: searchResp }
      }
    }

    if (data[metroSequence.ON_INIT]) {
      const searchResp = checkOnInit(data[metroSequence.ON_INIT], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [metroSequence.ON_INIT]: searchResp }
      }
    }

    if (data[metroSequence.CONFIRM]) {
      const searchResp = checkConfirm(data[metroSequence.CONFIRM], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [metroSequence.CONFIRM]: searchResp }
      }
    }

    if (data[metroSequence.ON_CONFIRM]) {
      const searchResp = checkOnConfirm(data[metroSequence.ON_CONFIRM], msgIdSet)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [metroSequence.ON_CONFIRM]: searchResp }
      }
    }


    logger.info(logReport, 'Report Generated Successfully!!')
    return logReport
  } catch (error: any) {
    logger.error(error.message)
    return error.message
  }
}
