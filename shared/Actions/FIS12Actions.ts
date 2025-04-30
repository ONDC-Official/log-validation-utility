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
// import { checkStatus } from '../../utils/FIS/FIS12/status'
import { checkOnStatus } from '../../utils/FIS/FIS12/onStatus'
import {
  personalSequence,
  personalWithoutMonitoringSequence,
  personalWithoutMonitoringAndAggregatorSequence,
  personalForclosureSequence,
  personalPrePartSequence,
  personalMissedEmiSequence,
  invoiceSequence,
  invoiceForclosureSequence,
  invoicePrePartSequence,
  invoiceMissedEmiSequence,
  invoiceWithoutMonitoringAndAggregatorSequence,
} from '../../constants/fisFlows'

export function validateLogsForFIS12(data: any, flow: string, version: string) {
  const msgIdSet = new Set()
  let logReport: any = {}
  setValue('version', version)
  let flowName = ''
  if (fisFlows.hasOwnProperty(flow)) {
    setValue(`flow`, flow)
    flowName = fisFlows[flow]
    setValue(`flow_type`, flowName)
  } else {
    logReport = {
      ...logReport,
      version: `Invalid flow ${flow} provided are the flows you can implement ${Object.values(fisFlows)}`,
    }
  }

  try {
    dropDB()
  } catch (error) {
    logger.error('!!Error while removing LMDB', error)
  }

  try {
    const processFIS12Sequence = (FIS12Sequence: any, data: any, logReport: any, flow: string) => {
      if (flow in fisFlows) {
        FIS12Sequence.forEach((apiSeq: any) => {
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
        case FisApiSequence.SEARCH:
          return search(data[FisApiSequence.SEARCH], msgIdSet, flow, FisApiSequence.SEARCH)
        case FisApiSequence.ON_SEARCH:
          return checkOnSearch(data[FisApiSequence.ON_SEARCH], msgIdSet, flow, FisApiSequence.ON_SEARCH)
        case FisApiSequence.SEARCH_1:
          return search(data[FisApiSequence.SEARCH_1], msgIdSet, flow, FisApiSequence.SEARCH_1)
        case FisApiSequence.ON_SEARCH_1:
          return checkOnSearch(data[FisApiSequence.ON_SEARCH_1], msgIdSet, flow, FisApiSequence.ON_SEARCH_1)
        case FisApiSequence.SEARCH_2:
          return search(data[FisApiSequence.SEARCH_2], msgIdSet, flow, FisApiSequence.SEARCH_2)
        case FisApiSequence.ON_SEARCH_2:
          return checkOnSearch(data[FisApiSequence.ON_SEARCH_2], msgIdSet, flow, FisApiSequence.ON_SEARCH_2)
        case FisApiSequence.SEARCH_3:
          return search(data[FisApiSequence.SEARCH_3], msgIdSet, flow, FisApiSequence.SEARCH_3)
        case FisApiSequence.ON_SEARCH_3:
          return checkOnSearch(data[FisApiSequence.ON_SEARCH_3], msgIdSet, flow, FisApiSequence.ON_SEARCH_3)

        case FisApiSequence.SELECT_1:
          return checkSelect(data[FisApiSequence.SELECT_1], msgIdSet, FisApiSequence.SELECT_1)
        case FisApiSequence.ON_SELECT_1:
          return checkOnSelect(data[FisApiSequence.ON_SELECT_1], msgIdSet, FisApiSequence.ON_SELECT_1)
        case FisApiSequence.SELECT_2:
          return checkSelect(data[FisApiSequence.SELECT_2], msgIdSet, FisApiSequence.SELECT_2)
        case FisApiSequence.ON_SELECT_2:
          return checkOnSelect(data[FisApiSequence.ON_SELECT_2], msgIdSet, FisApiSequence.ON_SELECT_2)
        case FisApiSequence.SELECT_3:
          return checkSelect(data[FisApiSequence.SELECT_3], msgIdSet, FisApiSequence.SELECT_3)
        case FisApiSequence.ON_SELECT_3:
          return checkOnSelect(data[FisApiSequence.ON_SELECT_3], msgIdSet, FisApiSequence.ON_SELECT_3)

        case FisApiSequence.INIT_1:
          return checkInit(data[FisApiSequence.INIT_1], msgIdSet, FisApiSequence.INIT_1)
        case FisApiSequence.ON_INIT_1:
          return checkOnInit(data[FisApiSequence.ON_INIT_1], msgIdSet, FisApiSequence.ON_INIT_1)
        case FisApiSequence.INIT_2:
          return checkInit(data[FisApiSequence.INIT_2], msgIdSet, FisApiSequence.INIT_2)
        case FisApiSequence.ON_INIT_2:
          return checkOnInit(data[FisApiSequence.ON_INIT_2], msgIdSet, FisApiSequence.ON_INIT_2)
        case FisApiSequence.INIT_3:
          return checkInit(data[FisApiSequence.INIT_3], msgIdSet, FisApiSequence.INIT_3)
        case FisApiSequence.ON_INIT_3:
          return checkOnInit(data[FisApiSequence.ON_INIT_3], msgIdSet, FisApiSequence.ON_INIT_3)
        case FisApiSequence.INIT_4:
          return checkInit(data[FisApiSequence.INIT_4], msgIdSet, FisApiSequence.INIT_4)
        case FisApiSequence.ON_INIT_4:
          return checkOnInit(data[FisApiSequence.ON_INIT_4], msgIdSet, FisApiSequence.ON_INIT_4)

        case FisApiSequence.CONFIRM:
          return checkConfirm(data[FisApiSequence.CONFIRM], msgIdSet)
        case FisApiSequence.ON_CONFIRM:
          return checkOnConfirm(data[FisApiSequence.ON_CONFIRM], msgIdSet)

        case FisApiSequence.UPDATE:
          return checkUpdate(data[FisApiSequence.UPDATE], msgIdSet, flow)
        case FisApiSequence.ON_UPDATE:
          return checkOnUpdate(data[FisApiSequence.ON_UPDATE], msgIdSet, flow, FisApiSequence.ON_UPDATE)
        case FisApiSequence.ON_UPDATE_UNSOLICATED:
          return checkOnUpdate(
            data[FisApiSequence.ON_UPDATE_UNSOLICATED],
            msgIdSet,
            flow,
            FisApiSequence.ON_UPDATE_UNSOLICATED,
          )

        case FisApiSequence.ON_STATUS_EKYC:
          return checkOnStatus(data[FisApiSequence.ON_STATUS_EKYC], msgIdSet, FisApiSequence.ON_STATUS_EKYC)
        case FisApiSequence.ON_STATUS_ENACH:
          return checkOnStatus(data[FisApiSequence.ON_STATUS_ENACH], msgIdSet, FisApiSequence.ON_STATUS_ENACH)

        case FisApiSequence.ON_STATUS_ESIGN:
          return checkOnStatus(data[FisApiSequence.ON_STATUS_ESIGN], msgIdSet, FisApiSequence.ON_STATUS_ESIGN)

        case FisApiSequence.ON_STATUS:
          return checkOnStatus(data[FisApiSequence.ON_STATUS], msgIdSet, FisApiSequence.ON_STATUS)

        default:
          return null
      }
    }

    switch (version) {
      case '2.0.0': {
        switch (flowName) {
          case fisFlows.PERSONAL:
            logReport = processFIS12Sequence(personalSequence, data, logReport, flow)
            break
          case fisFlows.FORECLOSURE_PERSONAL:
            logReport = processFIS12Sequence(personalForclosureSequence, data, logReport, flow)
            break
          case fisFlows.PRE_PART_PERSONAL:
            logReport = processFIS12Sequence(personalPrePartSequence, data, logReport, flow)
            break
          case fisFlows.MISSED_EMI_PERSONAL:
            logReport = processFIS12Sequence(personalMissedEmiSequence, data, logReport, flow)
            break
          case fisFlows.PERSONAL_WITHOUT_AGGREGATOR:
            logReport = processFIS12Sequence(personalWithoutMonitoringSequence, data, logReport, flow)
            break
          case fisFlows.PERSONAL_WITHOUT_AGGREGATOR_AND_MONITORING:
            logReport = processFIS12Sequence(personalWithoutMonitoringAndAggregatorSequence, data, logReport, flow)
            break
        }

        break
      }

      case '2.1.0': {
        switch (flowName) {
          case fisFlows.INVOICE:
            logReport = processFIS12Sequence(invoiceSequence, data, logReport, flow)
            break
          case fisFlows.FORECLOSURE_INVOICE:
            logReport = processFIS12Sequence(invoiceForclosureSequence, data, logReport, flow)
            break
          case fisFlows.PRE_PART_INVOICE:
            logReport = processFIS12Sequence(invoicePrePartSequence, data, logReport, flow)
            break
          case fisFlows.MISSED_EMI_INVOICE:
            logReport = processFIS12Sequence(invoiceMissedEmiSequence, data, logReport, flow)
            break
          case fisFlows.INVOICE_WITHOUT_AGGREGATOR_AND_MONITORING:
            logReport = processFIS12Sequence(invoiceWithoutMonitoringAndAggregatorSequence, data, logReport, flow)
            break
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
