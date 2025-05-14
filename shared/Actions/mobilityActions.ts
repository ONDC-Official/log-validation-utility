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
import {
  driverNotFound,
  driverNotFoundPostConfirm,
  driverOnConfirmSequence,
  driverPostConfirmSequence,
  driverRideCancellation,
  rideCancellation,
} from '../../constants/trvFlows'

export function validateLogsForMobility(data: any, flow: string, version: string) {
  const msgIdSet = new Set()
  let logReport: any = {}
  try {
    dropDB()
  } catch (error) {
    logger.error('!!Error while removing LMDB', error)
  }

  if (!_.isEqual(version, '2.0.0') || !_.isEqual(version, '2.0.1')) {
    logReport = { ...logReport, version: `Invalid version ${version}` }
  }

  if (!(flow in onDemandFlows)) {
    logReport = { ...logReport, version: `Invalid flow ${flow}` }
  } else setValue('flow', flow)

  try {
    const processFlowSequence = (flowSequence: any, data: any, logReport: any) => {
      if ((flow in onDemandFlows)) {
        flowSequence.forEach((apiSeq: any) => {
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
        console.log('Provided flow is invalid', flow, flow in onDemandFlows, onDemandFlows)
        return { invldFlow: 'Provided flow is invalid' }
      }
    }

    const getResponse = (apiSeq: any, data: any, msgIdSet: any) => {
      switch (apiSeq) {
        case mobilitySequence.SEARCH:
          return search(data[mobilitySequence.SEARCH], msgIdSet, version)
        case mobilitySequence.ON_SEARCH:
          return checkOnSearch(data[mobilitySequence.ON_SEARCH], msgIdSet, version)

        case mobilitySequence.SELECT:
          return checkSelect(data[mobilitySequence.SELECT], msgIdSet)
        case mobilitySequence.ON_SELECT:
          return checkOnSelect(data[mobilitySequence.ON_SELECT], msgIdSet, version)

        case mobilitySequence.INIT:
          return checkInit(data[mobilitySequence.INIT], msgIdSet, version)
        case mobilitySequence.ON_INIT:
          return checkOnInit(data[mobilitySequence.ON_INIT], msgIdSet, version)

        case mobilitySequence.CONFIRM:
          return checkConfirm(data[mobilitySequence.CONFIRM], msgIdSet, version)
        case mobilitySequence.ON_CONFIRM:
          return checkOnConfirm(data[mobilitySequence.ON_CONFIRM], msgIdSet, version)

        case mobilitySequence.UPDATE:
          return checkUpdate(data[mobilitySequence.UPDATE], msgIdSet)
        case mobilitySequence.ON_UPDATE:
          return checkOnUpdate(data[mobilitySequence.ON_UPDATE], msgIdSet, version)

        case mobilitySequence.STATUS:
          return checkStatus(data[mobilitySequence.STATUS], msgIdSet)
        case mobilitySequence.ON_STATUS:
          return checkOnStatus(data[mobilitySequence.ON_STATUS], msgIdSet, version)

        case mobilitySequence.SOFT_CANCEL:
          return checkCancel(data[mobilitySequence.SOFT_CANCEL], msgIdSet, mobilitySequence.SOFT_CANCEL)
        case mobilitySequence.SOFT_ON_CANCEL:
          return checkOnCancel(
            data[mobilitySequence.SOFT_ON_CANCEL],
            msgIdSet,
            mobilitySequence.SOFT_ON_CANCEL,
            version,
          )

        case mobilitySequence.CANCEL:
          return checkCancel(data[mobilitySequence.CANCEL], msgIdSet, mobilitySequence.CANCEL)
        case mobilitySequence.ON_CANCEL:
          return checkOnCancel(data[mobilitySequence.ON_CANCEL], msgIdSet, mobilitySequence.ON_CANCEL, version)

        default:
          return null
      }
    }

    switch (flow) {
      case onDemandFlows.DRIVER_ON_CONFIRM:
        logReport = processFlowSequence(driverOnConfirmSequence, data, logReport)
        break
      case onDemandFlows.DRIVER_POST_CONFIRM:
        logReport = processFlowSequence(driverPostConfirmSequence, data, logReport)
        break
      case onDemandFlows.RIDER_CANCEL:
        logReport = processFlowSequence(rideCancellation, data, logReport)
        break
      case onDemandFlows.DRIVER_CANCEL:
        logReport = processFlowSequence(driverRideCancellation, data, logReport)
        break
      case onDemandFlows.PRICE_UPDATE:
        logReport = processFlowSequence(driverOnConfirmSequence, data, logReport)
        break
      case onDemandFlows.DRIVER_NOT_FOUND:
        logReport = processFlowSequence(driverNotFound, data, logReport)
        break
      case onDemandFlows.DRIVER_NOT_FOUND_POST_CONFIRM:
        logReport = processFlowSequence(driverNotFoundPostConfirm, data, logReport)
        break
    }

    logger.info(logReport, 'Report Generated Successfully!!')
    return logReport
  } catch (error: any) {
    logger.error(error.message)
    return error.message
  }
}
