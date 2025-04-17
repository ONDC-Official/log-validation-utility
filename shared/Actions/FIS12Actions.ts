import _ from 'lodash'
import { dropDB, setValue } from '../dao'
import { logger } from '../logger'
import { FisApiSequence, fisFlows, FisWCLApiSequence } from '../../constants'
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
  wclCreditLineAssignmentSequence,
  wclCreditLineDrawdownSequence,
  wclMissedEmiPaymentSequence,
  wclPrePartPaymentSequence,
  wclDrawdownForeclosureSequence,
  wclCreditLineCancellationSequence,
} from '../../constants/fisFlows'
import { checksearchWCL } from '../../utils/FIS/FIS12/WCL/search'
import { checkon_searchWCL } from '../../utils/FIS/FIS12/WCL/on_search'
import { checkon_updateWCL } from '../../utils/FIS/FIS12/WCL/on_update'
import { checkupdateWCL } from '../../utils/FIS/FIS12/WCL/update'
import { checkselectWCL } from '../../utils/FIS/FIS12/WCL/select'
import { checkon_selectWCL } from '../../utils/FIS/FIS12/WCL/on_select'
import { checkon_statusWCL } from '../../utils/FIS/FIS12/WCL/on_status'
import { checkinitWCL } from '../../utils/FIS/FIS12/WCL/init'
import { checkOninitWCL } from '../../utils/FIS/FIS12/WCL/on_init'
import { checkConfirmWCL } from '../../utils/FIS/FIS12/WCL/confirm'
import { checkon_cancelWCL } from '../../utils/FIS/FIS12/WCL/on_cancel'
import { checkcancelWCL } from '../../utils/FIS/FIS12/WCL/cancel'
import { checkon_confirmWCL } from '../../utils/FIS/FIS12/WCL/on_confirm'

export function validateLogsForFIS12(data: any, flow: string, version: string) {
  const msgIdSet = new Set()
  let logReport: any = {}
  setValue('version', version)
  setValue('flow_type', flow)

  try {
    dropDB()
  } catch (error) {
    logger.error('!!Error while removing LMDB', error)
  }

  if (!Object.values(fisFlows).includes(flow)) {
    logReport = {
      ...logReport,
      version: `Invalid flow ${flow} provided are the flows you can implement ${Object.values(fisFlows)}`,
    }
    return logReport
  }

  try {
    const processFIS12Sequence = (FIS12Sequence: any, data: any, logReport: any, flow: string) => {
      console.log('FIS12Sequence', FIS12Sequence)
      if (flow in fisFlows) {
        let hasErrors = false

        FIS12Sequence.forEach((apiSeq: any) => {
          if (data[apiSeq]) {
            const resp = getResponse(apiSeq, data, msgIdSet)
            console.log('resp', resp, apiSeq)
            if (!_.isEmpty(resp)) {
              logReport = { ...logReport, [apiSeq]: resp }
              hasErrors = true
            }
          } else {
            logReport = { ...logReport, [apiSeq]: `Missing required data of : ${apiSeq}` }
            hasErrors = true
          }
        })

        logger.info(logReport, 'Report Generated Successfully!!')

        // If no errors were found, return an empty object
        return hasErrors ? logReport : {}
      } else {
        console.log('Invalid flow', fisFlows)
        return { invldFlow: 'Provided flow is invalid' }
      }
    }

    const getResponse = (apiSeq: any, data: any, msgIdSet: any) => {
      if (flow.includes('WCL')) {
        switch (apiSeq) {
          // Search related cases
          case FisWCLApiSequence.SEARCH:
            console.log('FIS12Sequeishchnce')
            return checksearchWCL(data[FisWCLApiSequence.SEARCH], msgIdSet, flow, FisWCLApiSequence.SEARCH)
          case FisWCLApiSequence.ON_SEARCH:
            return checkon_searchWCL(data[FisWCLApiSequence.ON_SEARCH], msgIdSet, flow, FisWCLApiSequence.ON_SEARCH)
          case FisWCLApiSequence.SEARCH_1:
            return checksearchWCL(data[FisWCLApiSequence.SEARCH_1], msgIdSet, flow, FisWCLApiSequence.SEARCH_1)
          case FisWCLApiSequence.ON_SEARCH_1:
            return checkon_searchWCL(data[FisWCLApiSequence.ON_SEARCH_1], msgIdSet, flow, FisWCLApiSequence.ON_SEARCH_1)
          case FisWCLApiSequence.SEARCH_2:
            return checksearchWCL(data[FisWCLApiSequence.SEARCH_2], msgIdSet, flow, FisWCLApiSequence.SEARCH_2)
          case FisWCLApiSequence.ON_SEARCH_2:
            return checkon_searchWCL(data[FisWCLApiSequence.ON_SEARCH_2], msgIdSet, flow, FisWCLApiSequence.ON_SEARCH_2)

          // Select related cases
          case FisWCLApiSequence.SELECT:
            return checkselectWCL(data[FisWCLApiSequence.SELECT], msgIdSet, flow, FisWCLApiSequence.SELECT)
          case FisWCLApiSequence.ON_SELECT:
            return checkon_selectWCL(data[FisWCLApiSequence.ON_SELECT], msgIdSet, flow, FisWCLApiSequence.ON_SELECT)
          case FisWCLApiSequence.SELECT_1:
            return checkselectWCL(data[FisWCLApiSequence.SELECT_1], msgIdSet, flow, FisWCLApiSequence.SELECT_1)
          case FisWCLApiSequence.ON_SELECT_1:
            return checkon_selectWCL(data[FisWCLApiSequence.ON_SELECT_1], msgIdSet, flow, FisWCLApiSequence.ON_SELECT_1)
          case FisWCLApiSequence.SELECT_2:
            return checkselectWCL(data[FisWCLApiSequence.SELECT_2], msgIdSet, flow, FisWCLApiSequence.SELECT_2)
          case FisWCLApiSequence.ON_SELECT_2:
            return checkon_selectWCL(data[FisWCLApiSequence.ON_SELECT_2], msgIdSet, flow, FisWCLApiSequence.ON_SELECT_2)
          case FisWCLApiSequence.SELECT_3:
            return checkselectWCL(data[FisWCLApiSequence.SELECT_3], msgIdSet, flow, FisWCLApiSequence.SELECT_3)
          case FisWCLApiSequence.ON_SELECT_3:
            return checkon_selectWCL(data[FisWCLApiSequence.ON_SELECT_3], msgIdSet, flow, FisWCLApiSequence.ON_SELECT_3)

          // Status related cases
          case FisWCLApiSequence.ON_STATUS_KYC:
            return checkon_statusWCL(
              data[FisWCLApiSequence.ON_STATUS_KYC],
              msgIdSet,
              flow,
              FisWCLApiSequence.ON_STATUS_KYC,
            )
          case FisWCLApiSequence.ON_STATUS_EKYC:
            return checkon_statusWCL(
              data[FisWCLApiSequence.ON_STATUS_EKYC],
              msgIdSet,
              flow,
              FisWCLApiSequence.ON_STATUS_EKYC,
            )
          case FisWCLApiSequence.ON_STATUS_ESIGN:
            return checkon_statusWCL(
              data[FisWCLApiSequence.ON_STATUS_ESIGN],
              msgIdSet,
              flow,
              FisWCLApiSequence.ON_STATUS_ESIGN,
            )
          case FisWCLApiSequence.ON_STATUS_EMANDATE:
            return checkon_statusWCL(
              data[FisWCLApiSequence.ON_STATUS_EMANDATE],
              msgIdSet,
              flow,
              FisWCLApiSequence.ON_STATUS_EMANDATE,
            )
          case FisWCLApiSequence.STATUS:
            return checkon_statusWCL(data[FisWCLApiSequence.STATUS], msgIdSet, flow, FisWCLApiSequence.STATUS)
          case FisWCLApiSequence.ON_STATUS:
            return checkon_statusWCL(data[FisWCLApiSequence.ON_STATUS], msgIdSet, flow, FisWCLApiSequence.ON_STATUS)

          // Init related cases
          case FisWCLApiSequence.INIT:
            return checkinitWCL(data[FisWCLApiSequence.INIT], msgIdSet, flow, FisWCLApiSequence.INIT)
          case FisWCLApiSequence.ON_INIT:
            return checkOninitWCL(data[FisWCLApiSequence.ON_INIT], msgIdSet, flow, FisWCLApiSequence.ON_INIT)
          case FisWCLApiSequence.INIT_1:
            return checkinitWCL(data[FisWCLApiSequence.INIT_1], msgIdSet, flow, FisWCLApiSequence.INIT_1)
          case FisWCLApiSequence.ON_INIT_1:
            return checkOninitWCL(data[FisWCLApiSequence.ON_INIT_1], msgIdSet, flow, FisWCLApiSequence.ON_INIT_1)
          case FisWCLApiSequence.INIT_2:
            return checkinitWCL(data[FisWCLApiSequence.INIT_2], msgIdSet, flow, FisWCLApiSequence.INIT_2)
          case FisWCLApiSequence.ON_INIT_2:
            return checkOninitWCL(data[FisWCLApiSequence.ON_INIT_2], msgIdSet, flow, FisWCLApiSequence.ON_INIT_2)
          case FisWCLApiSequence.INIT_3:
            return checkinitWCL(data[FisWCLApiSequence.INIT_3], msgIdSet, flow, FisWCLApiSequence.INIT_3)
          case FisWCLApiSequence.ON_INIT_3:
            return checkOninitWCL(data[FisWCLApiSequence.ON_INIT_3], msgIdSet, flow, FisWCLApiSequence.ON_INIT_3)

          // Confirm/Cancel related cases
          case FisWCLApiSequence.CONFIRM:
            return checkConfirmWCL(data[FisWCLApiSequence.CONFIRM], msgIdSet, flow, FisWCLApiSequence.CONFIRM)
          case FisWCLApiSequence.ON_CONFIRM:
            return checkon_confirmWCL(data[FisWCLApiSequence.ON_CONFIRM], msgIdSet, flow, FisWCLApiSequence.ON_CONFIRM)
          case FisWCLApiSequence.CANCEL:
            return checkcancelWCL(data[FisWCLApiSequence.CANCEL], msgIdSet, flow, FisWCLApiSequence.CANCEL)
          case FisWCLApiSequence.ON_CANCEL:
            return checkon_cancelWCL(data[FisWCLApiSequence.ON_CANCEL], msgIdSet, flow, FisWCLApiSequence.ON_CANCEL)

          // Update related cases
          case FisWCLApiSequence.UPDATE:
            return checkupdateWCL(data[FisWCLApiSequence.UPDATE], msgIdSet, flow, FisWCLApiSequence.UPDATE)
          case FisWCLApiSequence.ON_UPDATE:
            return checkon_updateWCL(data[FisWCLApiSequence.ON_UPDATE], msgIdSet, flow, FisWCLApiSequence.ON_UPDATE)
          case FisWCLApiSequence.ON_UPDATE_EMI_DETAIL:
            return checkon_updateWCL(
              data[FisWCLApiSequence.ON_UPDATE_EMI_DETAIL],
              msgIdSet,
              flow,
              FisWCLApiSequence.ON_UPDATE_EMI_DETAIL,
            )
          case FisWCLApiSequence.ON_UPDATE_PRE_PART_PAYMENT:
            return checkon_updateWCL(
              data[FisWCLApiSequence.ON_UPDATE_PRE_PART_PAYMENT],
              msgIdSet,
              flow,
              FisWCLApiSequence.ON_UPDATE_PRE_PART_PAYMENT,
            )
          case FisWCLApiSequence.ON_UPDATE_FORECLOSURE_DETAIL:
            return checkon_updateWCL(
              data[FisWCLApiSequence.ON_UPDATE_FORECLOSURE_DETAIL],
              msgIdSet,
              flow,
              FisWCLApiSequence.ON_UPDATE_FORECLOSURE_DETAIL,
            )
          case FisWCLApiSequence.ON_UPDATE_BASE_TRANSACTION:
            return checkon_updateWCL(
              data[FisWCLApiSequence.ON_UPDATE_BASE_TRANSACTION],
              msgIdSet,
              flow,
              FisWCLApiSequence.ON_UPDATE_BASE_TRANSACTION,
            )
          case FisWCLApiSequence.ON_UPDATE_UNSOLICATED:
            return checkon_updateWCL(
              data[FisWCLApiSequence.ON_UPDATE_UNSOLICATED],
              msgIdSet,
              flow,
              FisWCLApiSequence.ON_UPDATE_UNSOLICATED,
            )
          case FisWCLApiSequence.ON_UPDATE_PAYMENT_STATUS:
            return checkon_updateWCL(
              data[FisWCLApiSequence.ON_UPDATE_PAYMENT_STATUS],
              msgIdSet,
              flow,
              FisWCLApiSequence.ON_UPDATE_PAYMENT_STATUS,
            )
          default:
            return { invalidApiSeq: `Invalid API Sequence ${apiSeq} for flow ${flow}` }
        }
      }

      switch (apiSeq) {
        case FisApiSequence.SEARCH:
          return search(data[FisApiSequence.SEARCH], msgIdSet, flow, FisApiSequence.SEARCH)
        case FisApiSequence.ON_SEARCH:
          return checkOnSearch(data[FisApiSequence.ON_SEARCH], msgIdSet, flow, FisApiSequence.ON_SEARCH)

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

        case FisApiSequence.CONFIRM:
          return checkConfirm(data[FisApiSequence.CONFIRM], msgIdSet)
        case FisApiSequence.ON_CONFIRM:
          return checkOnConfirm(data[FisApiSequence.ON_CONFIRM], msgIdSet, flow)

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
          return checkOnStatus(data[FisApiSequence.ON_STATUS_EKYC], msgIdSet, FisApiSequence.ON_STATUS_EKYC, flow)
        case FisApiSequence.ON_STATUS_ENACH:
          return checkOnStatus(data[FisApiSequence.ON_STATUS_ENACH], msgIdSet, FisApiSequence.ON_STATUS_ENACH, flow)

        case FisApiSequence.ON_STATUS_ESIGN:
          return checkOnStatus(data[FisApiSequence.ON_STATUS_ESIGN], msgIdSet, FisApiSequence.ON_STATUS_ESIGN, flow)

        case FisApiSequence.ON_STATUS:
          return checkOnStatus(data[FisApiSequence.ON_STATUS], msgIdSet, FisApiSequence.ON_STATUS, flow)
      }
    }
    switch (flow) {
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
      case fisFlows.WCL_CREDIT_LINE_ASSIGNMENT:
        logReport = processFIS12Sequence(wclCreditLineAssignmentSequence, data, logReport, flow)
        break
      case fisFlows.WCL_CREDIT_LINE_DRAWDOWN:
        logReport = processFIS12Sequence(wclCreditLineDrawdownSequence, data, logReport, flow)
        break
      case fisFlows.WCL_MISSED_EMI_PAYMENT:
        logReport = processFIS12Sequence(wclMissedEmiPaymentSequence, data, logReport, flow)
        break
      case fisFlows.WCL_PRE_PART_PAYMENT:
        logReport = processFIS12Sequence(wclPrePartPaymentSequence, data, logReport, flow)
        break
      case fisFlows.WCL_DRAWDOWN_FORECLOSURE:
        logReport = processFIS12Sequence(wclDrawdownForeclosureSequence, data, logReport, flow)
        break
      case fisFlows.WCL_CREDIT_LINE_CANCELLATION:
        logReport = processFIS12Sequence(wclCreditLineCancellationSequence, data, logReport, flow)
        break
    }

    // switch (version) {
    //   case '2.0.0': {
    //     if (data[FisApiSequence.SEARCH]) {
    //       const searchResp = search(data[FisApiSequence.SEARCH], msgIdSet, flow, FisApiSequence.SEARCH)
    //       if (!_.isEmpty(searchResp)) {
    //         logReport = { ...logReport, [FisApiSequence.SEARCH]: searchResp }
    //       }
    //     }

    //     if (data[FisApiSequence.ON_SEARCH]) {
    //       const onSearchResp = checkOnSearch(data[FisApiSequence.ON_SEARCH], msgIdSet, FisApiSequence.ON_SEARCH, flow)
    //       if (!_.isEmpty(onSearchResp)) {
    //         logReport = { ...logReport, [FisApiSequence.ON_SEARCH]: onSearchResp }
    //       }
    //     }

    //     if (data[FisApiSequence.SELECT_1]) {
    //       const selectResp = checkSelect(data[FisApiSequence.SELECT_1], msgIdSet, FisApiSequence.SELECT_1)
    //       if (!_.isEmpty(selectResp)) {
    //         logReport = { ...logReport, [FisApiSequence.SELECT_1]: selectResp }
    //       }
    //     }

    //     if (data[FisApiSequence.ON_SELECT_1]) {
    //       const onSelectResp = checkOnSelect(data[FisApiSequence.ON_SELECT_1], msgIdSet, FisApiSequence.ON_SELECT_1)
    //       if (!_.isEmpty(onSelectResp)) {
    //         logReport = { ...logReport, [FisApiSequence.ON_SELECT_1]: onSelectResp }
    //       }
    //     }

    //     if (data[FisApiSequence.SELECT_2]) {
    //       const select2Resp = checkSelect(data[FisApiSequence.SELECT_2], msgIdSet, FisApiSequence.SELECT_2)
    //       if (!_.isEmpty(select2Resp)) {
    //         logReport = { ...logReport, [FisApiSequence.SELECT_2]: select2Resp }
    //       }
    //     }

    //     if (data[FisApiSequence.ON_SELECT_2]) {
    //       const onSelect2Resp = checkOnSelect(data[FisApiSequence.ON_SELECT_2], msgIdSet, FisApiSequence.ON_SELECT_2)
    //       if (!_.isEmpty(onSelect2Resp)) {
    //         logReport = { ...logReport, [FisApiSequence.ON_SELECT_2]: onSelect2Resp }
    //       }
    //     }

    //     if (data[FisApiSequence.SELECT_3]) {
    //       const select3Resp = checkSelect(data[FisApiSequence.SELECT_3], msgIdSet, FisApiSequence.SELECT_3)
    //       if (!_.isEmpty(select3Resp)) {
    //         logReport = { ...logReport, [FisApiSequence.SELECT_3]: select3Resp }
    //       }
    //     }

    //     if (data[FisApiSequence.ON_SELECT_3]) {
    //       const onSelect3Resp = checkOnSelect(data[FisApiSequence.ON_SELECT_3], msgIdSet, FisApiSequence.ON_SELECT_3)
    //       if (!_.isEmpty(onSelect3Resp)) {
    //         logReport = { ...logReport, [FisApiSequence.ON_SELECT_3]: onSelect3Resp }
    //       }
    //     }

    //     if (data[FisApiSequence.ON_STATUS_EKYC]) {
    //       const onStatusKyc = checkOnStatus(
    //         data[FisApiSequence.ON_STATUS_EKYC],
    //         msgIdSet,
    //         FisApiSequence.ON_STATUS_EKYC,
    //         flow,
    //       )
    //       if (!_.isEmpty(onStatusKyc)) {
    //         logReport = { ...logReport, [FisApiSequence.ON_STATUS_EKYC]: onStatusKyc }
    //       }
    //     }

    //     if (data[FisApiSequence.INIT_1]) {
    //       const init = checkInit(data[FisApiSequence.INIT_1], msgIdSet, FisApiSequence.INIT_1)
    //       if (!_.isEmpty(init)) {
    //         logReport = { ...logReport, [FisApiSequence.INIT_1]: init }
    //       }
    //     }

    //     if (data[FisApiSequence.ON_INIT_1]) {
    //       const onInit = checkOnInit(data[FisApiSequence.ON_INIT_1], msgIdSet, FisApiSequence.ON_INIT_1)
    //       if (!_.isEmpty(onInit)) {
    //         logReport = { ...logReport, [FisApiSequence.ON_INIT_1]: onInit }
    //       }
    //     }

    //     if (data[FisApiSequence.INIT_2]) {
    //       const init2 = checkInit(data[FisApiSequence.INIT_2], msgIdSet, FisApiSequence.INIT_2)
    //       if (!_.isEmpty(init2)) {
    //         logReport = { ...logReport, [FisApiSequence.INIT_2]: init2 }
    //       }
    //     }

    //     if (data[FisApiSequence.ON_INIT_2]) {
    //       const onInit2 = checkOnInit(data[FisApiSequence.ON_INIT_2], msgIdSet, FisApiSequence.ON_INIT_2)
    //       if (!_.isEmpty(onInit2)) {
    //         logReport = { ...logReport, [FisApiSequence.ON_INIT_2]: onInit2 }
    //       }
    //     }

    //     if (data[FisApiSequence.ON_STATUS_ENACH]) {
    //       const onStatusKyc = checkOnStatus(
    //         data[FisApiSequence.ON_STATUS_ENACH],
    //         msgIdSet,
    //         FisApiSequence.ON_STATUS_ENACH,
    //         flow,
    //       )
    //       if (!_.isEmpty(onStatusKyc)) {
    //         logReport = { ...logReport, [FisApiSequence.ON_STATUS_ENACH]: onStatusKyc }
    //       }
    //     }

    //     if (data[FisApiSequence.INIT_3]) {
    //       const init3 = checkInit(data[FisApiSequence.INIT_3], msgIdSet, FisApiSequence.INIT_3)
    //       if (!_.isEmpty(init3)) {
    //         logReport = { ...logReport, [FisApiSequence.INIT_3]: init3 }
    //       }
    //     }

    //     if (data[FisApiSequence.ON_INIT_3]) {
    //       const onInit3 = checkOnInit(data[FisApiSequence.ON_INIT_3], msgIdSet, FisApiSequence.ON_INIT_3)
    //       if (!_.isEmpty(onInit3)) {
    //         logReport = { ...logReport, [FisApiSequence.ON_INIT_3]: onInit3 }
    //       }
    //     }

    //     if (data[FisApiSequence.ON_STATUS_ESIGN]) {
    //       const onStatusKyc = checkOnStatus(
    //         data[FisApiSequence.ON_STATUS_ESIGN],
    //         msgIdSet,
    //         FisApiSequence.ON_STATUS_ESIGN,
    //         flow,
    //       )
    //       if (!_.isEmpty(onStatusKyc)) {
    //         logReport = { ...logReport, [FisApiSequence.ON_STATUS_ESIGN]: onStatusKyc }
    //       }
    //     }

    //     if (data[FisApiSequence.CONFIRM]) {
    //       const confirm = checkConfirm(data[FisApiSequence.CONFIRM], msgIdSet)
    //       if (!_.isEmpty(confirm)) {
    //         logReport = { ...logReport, [FisApiSequence.CONFIRM]: confirm }
    //       }
    //     }

    //     if (data[FisApiSequence.ON_CONFIRM]) {
    //       const onConfirm = checkOnConfirm(data[FisApiSequence.ON_CONFIRM], msgIdSet, flow)
    //       if (!_.isEmpty(onConfirm)) {
    //         logReport = { ...logReport, [FisApiSequence.ON_CONFIRM]: onConfirm }
    //       }
    //     }

    //     if (flow === fisFlows.PERSONAL) {
    //       if (data[FisApiSequence.ON_UPDATE_UNSOLICATED]) {
    //         const onUpdate = checkOnUpdate(
    //           data[FisApiSequence.ON_UPDATE_UNSOLICATED],
    //           msgIdSet,
    //           flow,
    //           FisApiSequence.ON_UPDATE_UNSOLICATED,
    //         )
    //         if (!_.isEmpty(onUpdate)) {
    //           logReport = { ...logReport, [FisApiSequence.ON_UPDATE_UNSOLICATED]: onUpdate }
    //         }
    //       }
    //     }

    //     if (data[FisApiSequence.UPDATE]) {
    //       const update = checkUpdate(data[FisApiSequence.UPDATE], msgIdSet, flow)
    //       if (!_.isEmpty(update)) {
    //         logReport = { ...logReport, [FisApiSequence.UPDATE]: update }
    //       }
    //     }

    //     if (data[FisApiSequence.ON_UPDATE]) {
    //       const onUpdate = checkOnUpdate(data[FisApiSequence.ON_UPDATE], msgIdSet, flow, FisApiSequence.ON_UPDATE)
    //       if (!_.isEmpty(onUpdate)) {
    //         logReport = { ...logReport, [FisApiSequence.ON_UPDATE]: onUpdate }
    //       }
    //     }

    //     if (flow !== fisFlows.PERSONAL) {
    //       if (data[FisApiSequence.ON_UPDATE_UNSOLICATED]) {
    //         const onUpdate = checkOnUpdate(
    //           data[FisApiSequence.ON_UPDATE_UNSOLICATED],
    //           msgIdSet,
    //           flow,
    //           FisApiSequence.ON_UPDATE_UNSOLICATED,
    //         )
    //         if (!_.isEmpty(onUpdate)) {
    //           logReport = { ...logReport, [FisApiSequence.ON_UPDATE_UNSOLICATED]: onUpdate }
    //         }
    //       }
    //     }

    //     if (data[FisApiSequence.STATUS]) {
    //       const status = checkStatus(data[FisApiSequence.STATUS], msgIdSet)
    //       if (!_.isEmpty(status)) {
    //         logReport = { ...logReport, [FisApiSequence.STATUS]: status }
    //       }
    //     }

    //     if (data[FisApiSequence.ON_STATUS]) {
    //       const onStatus = checkOnStatus(data[FisApiSequence.ON_STATUS], msgIdSet, FisApiSequence.ON_STATUS, flow)
    //       if (!_.isEmpty(onStatus)) {
    //         logReport = { ...logReport, [FisApiSequence.ON_STATUS]: onStatus }
    //       }
    //     }

    //     break
    //   }

    //   case '2.1.0': {
    //     if (data[FisApiSequence.SEARCH]) {
    //       const searchResp = search(data[FisApiSequence.SEARCH], msgIdSet, flow, FisApiSequence.SEARCH)
    //       if (!_.isEmpty(searchResp)) {
    //         logReport = { ...logReport, [FisApiSequence.SEARCH]: searchResp }
    //       }
    //     }

    //     if (data[FisApiSequence.ON_SEARCH]) {
    //       const onSearchResp = checkOnSearch(data[FisApiSequence.ON_SEARCH], msgIdSet, FisApiSequence.ON_SEARCH, flow)
    //       if (!_.isEmpty(onSearchResp)) {
    //         logReport = { ...logReport, [FisApiSequence.ON_SEARCH]: onSearchResp }
    //       }
    //     }

    //     if (data[FisApiSequence.SEARCH_2]) {
    //       const search2Resp = search(data[FisApiSequence.SEARCH_2], msgIdSet, flow, FisApiSequence.SEARCH_2)
    //       if (!_.isEmpty(search2Resp)) {
    //         logReport = { ...logReport, [FisApiSequence.SEARCH_2]: search2Resp }
    //       }
    //     }

    //     if (data[FisApiSequence.ON_SEARCH_2]) {
    //       const onSearch2Resp = checkOnSearch(
    //         data[FisApiSequence.ON_SEARCH_2],
    //         msgIdSet,
    //         FisApiSequence.ON_SEARCH_2,
    //         flow,
    //       )
    //       if (!_.isEmpty(onSearch2Resp)) {
    //         logReport = { ...logReport, [FisApiSequence.ON_SEARCH_2]: onSearch2Resp }
    //       }
    //     }

    //     if (data[FisApiSequence.SEARCH_3]) {
    //       const search3Resp = search(data[FisApiSequence.SEARCH_3], msgIdSet, flow, FisApiSequence.SEARCH_3)
    //       if (!_.isEmpty(search3Resp)) {
    //         logReport = { ...logReport, [FisApiSequence.SEARCH_3]: search3Resp }
    //       }
    //     }

    //     if (data[FisApiSequence.ON_SEARCH_3]) {
    //       const onSearch3Resp = checkOnSearch(
    //         data[FisApiSequence.ON_SEARCH_3],
    //         msgIdSet,
    //         FisApiSequence.ON_SEARCH_3,
    //         flow,
    //       )
    //       if (!_.isEmpty(onSearch3Resp)) {
    //         logReport = { ...logReport, [FisApiSequence.ON_SEARCH_3]: onSearch3Resp }
    //       }
    //     }

    //     if (data[FisApiSequence.SELECT_1]) {
    //       const selectResp = checkSelect(data[FisApiSequence.SELECT_1], msgIdSet, FisApiSequence.SELECT_1)
    //       if (!_.isEmpty(selectResp)) {
    //         logReport = { ...logReport, [FisApiSequence.SELECT_1]: selectResp }
    //       }
    //     }

    //     if (data[FisApiSequence.ON_SELECT_1]) {
    //       const onSelectResp = checkOnSelect(data[FisApiSequence.ON_SELECT_1], msgIdSet, FisApiSequence.ON_SELECT_1)
    //       if (!_.isEmpty(onSelectResp)) {
    //         logReport = { ...logReport, [FisApiSequence.ON_SELECT_1]: onSelectResp }
    //       }
    //     }

    //     if (data[FisApiSequence.SELECT_2]) {
    //       const select2Resp = checkSelect(data[FisApiSequence.SELECT_2], msgIdSet, FisApiSequence.SELECT_2)
    //       if (!_.isEmpty(select2Resp)) {
    //         logReport = { ...logReport, [FisApiSequence.SELECT_2]: select2Resp }
    //       }
    //     }

    //     if (data[FisApiSequence.ON_SELECT_2]) {
    //       const onSelect2Resp = checkOnSelect(data[FisApiSequence.ON_SELECT_2], msgIdSet, FisApiSequence.ON_SELECT_2)
    //       if (!_.isEmpty(onSelect2Resp)) {
    //         logReport = { ...logReport, [FisApiSequence.ON_SELECT_2]: onSelect2Resp }
    //       }
    //     }

    //     if (data[FisApiSequence.INIT_1]) {
    //       const init = checkInit(data[FisApiSequence.INIT_1], msgIdSet, FisApiSequence.INIT_1)
    //       if (!_.isEmpty(init)) {
    //         logReport = { ...logReport, [FisApiSequence.INIT_1]: init }
    //       }
    //     }

    //     if (data[FisApiSequence.ON_INIT_1]) {
    //       const onInit = checkOnInit(data[FisApiSequence.ON_INIT_1], msgIdSet, FisApiSequence.ON_INIT_1)
    //       if (!_.isEmpty(onInit)) {
    //         logReport = { ...logReport, [FisApiSequence.ON_INIT_1]: onInit }
    //       }
    //     }

    //     if (data[FisApiSequence.INIT_2]) {
    //       const init2 = checkInit(data[FisApiSequence.INIT_2], msgIdSet, FisApiSequence.INIT_2)
    //       if (!_.isEmpty(init2)) {
    //         logReport = { ...logReport, [FisApiSequence.INIT_2]: init2 }
    //       }
    //     }

    //     if (data[FisApiSequence.ON_INIT_2]) {
    //       const onInit2 = checkOnInit(data[FisApiSequence.ON_INIT_2], msgIdSet, FisApiSequence.ON_INIT_2)
    //       if (!_.isEmpty(onInit2)) {
    //         logReport = { ...logReport, [FisApiSequence.ON_INIT_2]: onInit2 }
    //       }
    //     }

    //     if (data[FisApiSequence.INIT_3]) {
    //       const init3 = checkInit(data[FisApiSequence.INIT_3], msgIdSet, FisApiSequence.INIT_3)
    //       if (!_.isEmpty(init3)) {
    //         logReport = { ...logReport, [FisApiSequence.INIT_3]: init3 }
    //       }
    //     }

    //     if (data[FisApiSequence.ON_INIT_3]) {
    //       const onInit3 = checkOnInit(data[FisApiSequence.ON_INIT_3], msgIdSet, FisApiSequence.ON_INIT_3)
    //       if (!_.isEmpty(onInit3)) {
    //         logReport = { ...logReport, [FisApiSequence.ON_INIT_3]: onInit3 }
    //       }
    //     }

    //     if (data[FisApiSequence.INIT_4]) {
    //       const init3 = checkInit(data[FisApiSequence.INIT_4], msgIdSet, FisApiSequence.INIT_4)
    //       if (!_.isEmpty(init3)) {
    //         logReport = { ...logReport, [FisApiSequence.INIT_4]: init3 }
    //       }
    //     }

    //     if (data[FisApiSequence.ON_INIT_4]) {
    //       const onInit3 = checkOnInit(data[FisApiSequence.ON_INIT_4], msgIdSet, FisApiSequence.ON_INIT_4)
    //       if (!_.isEmpty(onInit3)) {
    //         logReport = { ...logReport, [FisApiSequence.ON_INIT_4]: onInit3 }
    //       }
    //     }

    //     if (data[FisApiSequence.CONFIRM]) {
    //       const confirm = checkConfirm(data[FisApiSequence.CONFIRM], msgIdSet)
    //       if (!_.isEmpty(confirm)) {
    //         logReport = { ...logReport, [FisApiSequence.CONFIRM]: confirm }
    //       }
    //     }

    //     if (data[FisApiSequence.ON_CONFIRM]) {
    //       const onConfirm = checkOnConfirm(data[FisApiSequence.ON_CONFIRM], msgIdSet, flow)
    //       if (!_.isEmpty(onConfirm)) {
    //         logReport = { ...logReport, [FisApiSequence.ON_CONFIRM]: onConfirm }
    //       }
    //     }

    //     // if (flow === fisFlows.PERSONAL) {
    //     //   if (data[FisApiSequence.ON_UPDATE_UNSOLICATED]) {
    //     //     const onUpdate = checkOnUpdate(
    //     //       data[FisApiSequence.ON_UPDATE_UNSOLICATED],
    //     //       msgIdSet,
    //     //       flow,
    //     //       FisApiSequence.ON_UPDATE_UNSOLICATED,
    //     //     )
    //     //     if (!_.isEmpty(onUpdate)) {
    //     //       logReport = { ...logReport, [FisApiSequence.ON_UPDATE_UNSOLICATED]: onUpdate }
    //     //     }
    //     //   }
    //     // }

    //     if (data[FisApiSequence.UPDATE]) {
    //       const update = checkUpdate(data[FisApiSequence.UPDATE], msgIdSet, flow)
    //       if (!_.isEmpty(update)) {
    //         logReport = { ...logReport, [FisApiSequence.UPDATE]: update }
    //       }
    //     }

    //     if (data[FisApiSequence.ON_UPDATE]) {
    //       const onUpdate = checkOnUpdate(data[FisApiSequence.ON_UPDATE], msgIdSet, flow, FisApiSequence.ON_UPDATE)
    //       if (!_.isEmpty(onUpdate)) {
    //         logReport = { ...logReport, [FisApiSequence.ON_UPDATE]: onUpdate }
    //       }
    //     }

    //     // if (flow === fisFlows.LOAN_FORECLOSURE) {
    //     //   if (data[FisApiSequence.ON_UPDATE_UNSOLICATED]) {
    //     //     const onUpdate = checkOnUpdate(
    //     //       data[FisApiSequence.ON_UPDATE_UNSOLICATED],
    //     //       msgIdSet,
    //     //       flow,
    //     //       FisApiSequence.ON_UPDATE_UNSOLICATED,
    //     //     )
    //     //     if (!_.isEmpty(onUpdate)) {
    //     //       logReport = { ...logReport, [FisApiSequence.ON_UPDATE_UNSOLICATED]: onUpdate }
    //     //     }
    //     //   }
    //     // }

    //     if (data[FisApiSequence.STATUS]) {
    //       const status = checkStatus(data[FisApiSequence.STATUS], msgIdSet)
    //       if (!_.isEmpty(status)) {
    //         logReport = { ...logReport, [FisApiSequence.STATUS]: status }
    //       }
    //     }

    //     if (data[FisApiSequence.ON_STATUS]) {
    //       const onStatus = checkOnStatus(data[FisApiSequence.ON_STATUS], msgIdSet, FisApiSequence.ON_STATUS, flow)
    //       if (!_.isEmpty(onStatus)) {
    //         logReport = { ...logReport, [FisApiSequence.ON_STATUS]: onStatus }
    //       }
    //     }

    //     break
    //   }

    //   default:
    //     logReport = { ...logReport, version: `Invalid version ${version}` }
    //     break
    // }

    logger.info(logReport, 'Report Generated Successfully!!')
    console.log('checking log report', logReport)

    // Check if there are any validation errors
    if (Object.keys(logReport).length === 0) {
      // No errors, return empty object
      return {}
    } else {
      // Return only the validation errors
      return logReport
    }
  } catch (error: any) {
    logger.error(error.message)
    return error.message
  }
}
