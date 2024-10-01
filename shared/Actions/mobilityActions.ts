import _ from 'lodash'
import { dropDB, setValue } from '../dao'
import { logger } from '../logger'
import { mobilitySequence, onDemandFlows } from '../../constants'
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

export function validateLogsForMobility(data: any, flow: string, version: string) {
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

  if (!(flow in onDemandFlows)) {
    logReport = { ...logReport, version: `Invalid flow ${flow}` }
  } else setValue('flow', flow)

  try {
    if (data[mobilitySequence.SEARCH]) {
      const errors = search(data[mobilitySequence.SEARCH], msgIdSet, version)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [mobilitySequence.SEARCH]: errors }
      }
    }

    if (data[mobilitySequence.ON_SEARCH]) {
      const errors = checkOnSearch(data[mobilitySequence.ON_SEARCH], msgIdSet, version)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [mobilitySequence.ON_SEARCH]: errors }
      }
    }

    if (data[mobilitySequence.SELECT]) {
      const errors = checkSelect(data[mobilitySequence.SELECT], msgIdSet)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [mobilitySequence.SELECT]: errors }
      }
    }

    if (data[mobilitySequence.ON_SELECT]) {
      const errors = checkOnSelect(data[mobilitySequence.ON_SELECT], msgIdSet, version)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [mobilitySequence.ON_SELECT]: errors }
      }
    }

    if (data[mobilitySequence.INIT]) {
      const errors = checkInit(data[mobilitySequence.INIT], msgIdSet, version)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [mobilitySequence.INIT]: errors }
      }
    }

    if (data[mobilitySequence.ON_INIT]) {
      const errors = checkOnInit(data[mobilitySequence.ON_INIT], msgIdSet, version)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [mobilitySequence.ON_INIT]: errors }
      }
    }

    if (data[mobilitySequence.CONFIRM]) {
      const errors = checkConfirm(data[mobilitySequence.CONFIRM], msgIdSet, version)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [mobilitySequence.CONFIRM]: errors }
      }
    }

    if (data[mobilitySequence.ON_CONFIRM]) {
      const errors = checkOnConfirm(data[mobilitySequence.ON_CONFIRM], msgIdSet, version)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [mobilitySequence.ON_CONFIRM]: errors }
      }
    }

    if (data[mobilitySequence.UPDATE]) {
      const errors = checkUpdate(data[mobilitySequence.UPDATE], msgIdSet)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [mobilitySequence.UPDATE]: errors }
      }
    }

    if (data[mobilitySequence.ON_UPDATE]) {
      const errors = checkOnUpdate(data[mobilitySequence.ON_UPDATE], msgIdSet, version)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [mobilitySequence.ON_UPDATE]: errors }
      }
    }

    if (data[mobilitySequence.STATUS]) {
      const errors = checkStatus(data[mobilitySequence.STATUS], msgIdSet)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [mobilitySequence.STATUS]: errors }
      }
    }

    if (data[mobilitySequence.ON_STATUS]) {
      const errors = checkOnStatus(data[mobilitySequence.ON_STATUS], msgIdSet, version)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [mobilitySequence.ON_STATUS]: errors }
      }
    }

    if (data[mobilitySequence.SOFT_CANCEL]) {
      const errors = checkCancel(data[mobilitySequence.SOFT_CANCEL], msgIdSet, mobilitySequence.SOFT_CANCEL)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [mobilitySequence.SOFT_CANCEL]: errors }
      }
    }

    if (data[mobilitySequence.SOFT_ON_CANCEL]) {
      const errors = checkOnCancel(
        data[mobilitySequence.SOFT_ON_CANCEL],
        msgIdSet,
        mobilitySequence.SOFT_ON_CANCEL,
        version,
      )
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [mobilitySequence.SOFT_ON_CANCEL]: errors }
      }
    }

    if (data[mobilitySequence.CANCEL]) {
      const errors = checkCancel(data[mobilitySequence.CANCEL], msgIdSet, mobilitySequence.CANCEL)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [mobilitySequence.CANCEL]: errors }
      }
    }

    if (data[mobilitySequence.ON_CANCEL]) {
      const errors = checkOnCancel(data[mobilitySequence.ON_CANCEL], msgIdSet, mobilitySequence.ON_CANCEL, version)
      if (!_.isEmpty(errors)) {
        logReport = { ...logReport, [mobilitySequence.ON_CANCEL]: errors }
      }
    }

    if (flow === 'RIDER_CANCEL') {
      const cancelKeys = [
        mobilitySequence.SOFT_CANCEL,
        mobilitySequence.SOFT_ON_CANCEL,
        mobilitySequence.CANCEL,
        mobilitySequence.ON_CANCEL,
      ]

      if (!cancelKeys.some((key) => key in data)) {
        logReport.error = 'RIDER_CANCEL flow calls are incomplete'
      }
    }

    logger.info(logReport, 'Report Generated Successfully!!')
    return logReport
  } catch (error: any) {
    logger.error(error.message)
    return error.message
  }
}
