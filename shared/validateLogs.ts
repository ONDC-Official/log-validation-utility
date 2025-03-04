import _ from 'lodash'
import { dropDB, setValue } from '../shared/dao'
import { logger } from './logger'
import { ApiSequence, retailDomains, IGMApiSequence,IGM2Sequence, RSFapiSequence, RSF_v2_apiSequence } from '../constants'
import { validateSchema, isObjectEmpty } from '../utils'
import { checkOnsearchFullCatalogRefresh } from '../utils/Retail/RET11_onSearch/onSearch'
import { checkSelect } from '../utils/Retail/Select/select'
import { checkOnSelect } from '../utils/Retail/Select/onSelect'
import { checkInit } from '../utils/Retail/Init/init'
import { checkOnInit } from '../utils/Retail/Init/onInit'
import { checkConfirm } from '../utils/Retail/Confirm/confirm'
import { checkOnConfirm } from '../utils/Retail/Confirm/onConfirm'
import { checkOnTrack } from '../utils/Retail/Track/onTrack'
import { checkTrack } from '../utils/Retail/Track/track'
import { checkOnStatusPending } from '../utils/Retail/Status/onStatusPending'
import { checkStatus } from '../utils/Retail/Status/status'
import { checkSearch } from '../utils/Retail/Search/search'
import { checkOnsearch } from '../utils/Retail/Search/on_search'
import checkIssue from '../utils/igm/retIssue'
import checkIssueStatus from '../utils/igm/retIssueStatus'
import checkOnIssue from '../utils/igm/retOnIssue'
import checkLspIssue from '../utils/igm/lspIssue'
import checkLspIssueStatus from '../utils/igm/lspIssueStatus'
import checkLspOnIssueStatus from '../utils/igm/lspOnIssueStatus'
import checkLspOnIssue from '../utils/igm/lspOnIssue'
import checkOnIssueStatus from '../utils/igm/retOnIssueStatus'
import checkOnIssueStatusUnsolicited from '../utils/igm/retOnIssueStatus(unsolicited)'
import checkLspIssueClose from '../utils/igm/lspIssue(close)'
import checkIssueClose from '../utils/igm/retIssueClose'
import { checkSearchIncremental } from '../utils/Retail/SearchInc/searchIncremental'
import { checkOnsearchIncremental } from '../utils/Retail/SearchInc/onSearchIncremental'
import { FLOW } from '../utils/enum'
import { checkSelect_OOS } from '../utils/Retail/Select_OOS/select_oos'
import { checkOnSelect_OOS } from '../utils/Retail/Select_OOS/on_select_oos'
import { checkUpdate } from '../utils/Retail/Update/update'
import { checkOnUpdate } from '../utils/Retail/Update/onUpdate'
import { checkOnStatusPacked } from '../utils/Retail/Status/onStatusPacked'
import { checkOnStatusPicked } from '../utils/Retail/Status/onStatusPicked'
import { checkOnStatusOutForDelivery } from '../utils/Retail/Status/onStatusOutForDelivery'
import { checkOnStatusDelivered } from '../utils/Retail/Status/onStatusDelivered'
import { checkOnStatusRTODelivered } from '../utils/Retail/Status/onStatusRTODelivered'
import { checkCancel } from '../utils/Retail/Cancel/cancel'
import { checkOnCancel } from '../utils/Retail/Cancel/onCancel'
import checkRsfReceiverRecon from '../utils/RSF/RSF_v1/rsfReceiverRecon'
import checkRsfOnReceiverRecon from '../utils/RSF/RSF_v1/rsfOnReciverRecon'
import checkRsfSettle from '../utils/RSF/RSF_v2/settle'
import checkRsfOnSettle from '../utils/RSF/RSF_v2/on_settle'
import checkRsfReport from '../utils/RSF/RSF_v2/report'
import checkRsfOnReport from '../utils/RSF/RSF_v2/on_report'
import checkRsfRecon from '../utils/RSF/RSF_v2/recon'
import checkRsfOnRecon from '../utils/RSF/RSF_v2/on_recon'
import checkOnIssueV2 from '../utils/igm/igm2/on_issue_1'
import checkIssueV2 from '../utils/igm/igm2/issue_1'

export const validateLogs = async (data: any, domain: string, flow: string) => {
  const msgIdSet = new Set()
  const quoteTrailItemsSet = new Set()
  const settlementDetatilSet = new Set()
  const fulfillmentsItemsSet = new Set()
  let logReport: any = {}
  setValue('flow', flow)
  setValue('domain', domain.split(':')[1])
  try {
    dropDB()
  } catch (error) {
    logger.error('!!Error while removing LMDB', error)
  }

  try {
    const validFlows = ['1', '2', '3', '4', '5', '6']
    if (!retailDomains.includes(domain)) {
      return 'Domain should be one of the 1.2.0 retail domains'
    }
    const flowOneSequence = [
      ApiSequence.SEARCH,
      ApiSequence.ON_SEARCH,
      ApiSequence.INC_SEARCH,
      ApiSequence.INC_ONSEARCH,
    ]
    const flowTwoSequence = [
      ApiSequence.SEARCH,
      ApiSequence.ON_SEARCH,
      ApiSequence.SELECT,
      ApiSequence.ON_SELECT,
      ApiSequence.INIT,
      ApiSequence.ON_INIT,
      ApiSequence.CONFIRM,
      ApiSequence.ON_CONFIRM,
      ApiSequence.ON_STATUS_PENDING,
      ApiSequence.ON_STATUS_PACKED,
      ApiSequence.ON_STATUS_PICKED,
      ApiSequence.ON_STATUS_OUT_FOR_DELIVERY,
      ApiSequence.ON_STATUS_DELIVERED,
    ]
    const flowThreeSequence = [
      ApiSequence.SEARCH,
      ApiSequence.ON_SEARCH,
      ApiSequence.SELECT_OUT_OF_STOCK,
      ApiSequence.ON_SELECT_OUT_OF_STOCK,
      ApiSequence.SELECT,
      ApiSequence.ON_SELECT,
      ApiSequence.INIT,
      ApiSequence.ON_INIT,
      ApiSequence.CONFIRM,
      ApiSequence.ON_CONFIRM,
      ApiSequence.ON_STATUS_PENDING,
      ApiSequence.ON_STATUS_PACKED,
      ApiSequence.ON_STATUS_PICKED,
      ApiSequence.ON_STATUS_OUT_FOR_DELIVERY,
      ApiSequence.ON_STATUS_DELIVERED,
    ]
    const flowFourSequence = [
      ApiSequence.SEARCH,
      ApiSequence.ON_SEARCH,
      ApiSequence.SELECT,
      ApiSequence.ON_SELECT,
      ApiSequence.INIT,
      ApiSequence.ON_INIT,
      ApiSequence.CONFIRM,
      ApiSequence.ON_CONFIRM,
      ApiSequence.CANCEL,
      ApiSequence.ON_CANCEL,
    ]
    const flowFiveSeqeence = [
      ApiSequence.SEARCH,
      ApiSequence.ON_SEARCH,
      ApiSequence.SELECT,
      ApiSequence.ON_SELECT,
      ApiSequence.INIT,
      ApiSequence.ON_INIT,
      ApiSequence.CONFIRM,
      ApiSequence.ON_CONFIRM,
      ApiSequence.ON_STATUS_PENDING,
      ApiSequence.ON_STATUS_PACKED,
      ApiSequence.ON_STATUS_PICKED,
      ApiSequence.ON_STATUS_OUT_FOR_DELIVERY,
      ApiSequence.ON_CANCEL,
      ApiSequence.ON_STATUS_RTO_DELIVERED
    ]

    const flowSixSequence = [
      ApiSequence.SEARCH,
      ApiSequence.ON_SEARCH,
      ApiSequence.SELECT,
      ApiSequence.ON_SELECT,
      ApiSequence.INIT,
      ApiSequence.ON_INIT,
      ApiSequence.CONFIRM,
      ApiSequence.ON_CONFIRM,
      ApiSequence.ON_UPDATE_PART_CANCEL,
      ApiSequence.UPDATE_SETTLEMENT_PART_CANCEL,
      ApiSequence.ON_STATUS_PENDING,
      ApiSequence.ON_STATUS_PACKED,
      ApiSequence.ON_STATUS_PICKED,
      ApiSequence.ON_STATUS_OUT_FOR_DELIVERY,
      ApiSequence.ON_STATUS_DELIVERED,
      ApiSequence.UPDATE_REVERSE_QC,
      ApiSequence.ON_UPDATE_INTERIM_REVERSE_QC,
      ApiSequence.ON_UPDATE_APPROVAL,
      ApiSequence.ON_UPDATE_PICKED,
      ApiSequence.UPDATE_SETTLEMENT_REVERSE_QC,
      ApiSequence.ON_UPDATE_DELIVERED,
      ApiSequence.UPDATE_LIQUIDATED,
      ApiSequence.ON_UPDATE_INTERIM_LIQUIDATED,
      ApiSequence.ON_UPDATE_LIQUIDATED,
      ApiSequence.UPDATE_SETTLEMENT_LIQUIDATED,
    ]

    const processApiSequence = (apiSequence: any, data: any, logReport: any, msgIdSet: any, flow: string) => {
      if (validFlows.includes(flow)) {
        apiSequence.forEach((apiSeq: any) => {
          if (data[apiSeq]) {
            const resp = getResponse(apiSeq, data[apiSeq], msgIdSet)
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
        case ApiSequence.SEARCH:
          return checkSearch(data, msgIdSet)
        case ApiSequence.ON_SEARCH:
          if (domain === 'ONDC:RET11') {
            return checkOnsearchFullCatalogRefresh(data)
          } else {
            return checkOnsearch(data)
          }
        case ApiSequence.INC_SEARCH:
          return checkSearchIncremental(data, msgIdSet)
        case ApiSequence.INC_ONSEARCH:
          return checkOnsearchIncremental(data, msgIdSet)
        case ApiSequence.SELECT:
          if (flow === FLOW.FLOW3) {
            return checkSelect_OOS(data, msgIdSet)
          } else {
            return checkSelect(data, msgIdSet, ApiSequence.SELECT)
          }
        case ApiSequence.ON_SELECT:
          return checkOnSelect(data)
        case ApiSequence.SELECT_OUT_OF_STOCK:
          return checkSelect(data, msgIdSet, ApiSequence.SELECT_OUT_OF_STOCK)
        case ApiSequence.ON_SELECT_OUT_OF_STOCK:
          return checkOnSelect_OOS(data)
        case ApiSequence.INIT:
          return checkInit(data, msgIdSet)
        case ApiSequence.ON_INIT:
          return checkOnInit(data)
        case ApiSequence.CONFIRM:
          return checkConfirm(data, msgIdSet)
        case ApiSequence.ON_CONFIRM:
          return checkOnConfirm(data, fulfillmentsItemsSet)
        case ApiSequence.CANCEL:
          return checkCancel(data, msgIdSet)
        case ApiSequence.ON_CANCEL:
          return checkOnCancel(data, msgIdSet)
        case ApiSequence.ON_STATUS_RTO_DELIVERED:
          return checkOnStatusRTODelivered(data)
        case ApiSequence.STATUS:
          return checkStatus(data)
        case ApiSequence.ON_STATUS_PENDING:
          return checkOnStatusPending(data, 'pending', msgIdSet, fulfillmentsItemsSet)
        case ApiSequence.ON_STATUS_PACKED:
          return checkOnStatusPacked(data, 'packed', msgIdSet, fulfillmentsItemsSet)
        case ApiSequence.ON_STATUS_PICKED:
          return checkOnStatusPicked(data, 'picked', msgIdSet, fulfillmentsItemsSet)
        case ApiSequence.ON_STATUS_OUT_FOR_DELIVERY:
          return checkOnStatusOutForDelivery(data, 'out-for-delivery', msgIdSet, fulfillmentsItemsSet)
        case ApiSequence.ON_STATUS_DELIVERED:
          return checkOnStatusDelivered(data, 'delivered', msgIdSet, fulfillmentsItemsSet)
        case ApiSequence.ON_UPDATE_PART_CANCEL:
          return checkOnUpdate(data, msgIdSet, ApiSequence.ON_UPDATE_PART_CANCEL, settlementDetatilSet, quoteTrailItemsSet, fulfillmentsItemsSet, "6-a")
        case ApiSequence.UPDATE_SETTLEMENT_PART_CANCEL:
          return checkUpdate(data, msgIdSet, ApiSequence.UPDATE_SETTLEMENT_PART_CANCEL, settlementDetatilSet, '6-a')
        case ApiSequence.UPDATE_REVERSE_QC:
          return checkUpdate(data, msgIdSet, ApiSequence.UPDATE_REVERSE_QC, settlementDetatilSet, '6-b')
        case ApiSequence.ON_UPDATE_INTERIM_REVERSE_QC:
          return checkOnUpdate(data, msgIdSet, ApiSequence.ON_UPDATE_INTERIM_REVERSE_QC, settlementDetatilSet, quoteTrailItemsSet, fulfillmentsItemsSet, '6-b')
        case ApiSequence.ON_UPDATE_APPROVAL:
          return checkOnUpdate(data, msgIdSet, ApiSequence.ON_UPDATE_APPROVAL, settlementDetatilSet, quoteTrailItemsSet, fulfillmentsItemsSet, "6-b")
        case ApiSequence.ON_UPDATE_PICKED:
          return checkOnUpdate(data, msgIdSet, ApiSequence.ON_UPDATE_PICKED, settlementDetatilSet, quoteTrailItemsSet, fulfillmentsItemsSet, "6-b")
        case ApiSequence.UPDATE_SETTLEMENT_REVERSE_QC:
          return checkUpdate(data, msgIdSet, ApiSequence.UPDATE_SETTLEMENT_REVERSE_QC, settlementDetatilSet, '6-b')
        case ApiSequence.ON_UPDATE_DELIVERED:
          return checkOnUpdate(data, msgIdSet, ApiSequence.ON_UPDATE_DELIVERED, settlementDetatilSet, quoteTrailItemsSet, fulfillmentsItemsSet, "6-b")
        case ApiSequence.UPDATE_LIQUIDATED:
          return checkUpdate(data, msgIdSet, ApiSequence.UPDATE_LIQUIDATED, settlementDetatilSet, '6-c')
        case ApiSequence.ON_UPDATE_INTERIM_LIQUIDATED:
          return checkOnUpdate(data, msgIdSet, ApiSequence.ON_UPDATE_INTERIM_LIQUIDATED, settlementDetatilSet, quoteTrailItemsSet, fulfillmentsItemsSet, "6-c")
        case ApiSequence.ON_UPDATE_LIQUIDATED:
          return checkOnUpdate(data, msgIdSet, ApiSequence.ON_UPDATE_LIQUIDATED, settlementDetatilSet, quoteTrailItemsSet, fulfillmentsItemsSet, "6-c")
        case ApiSequence.UPDATE_SETTLEMENT_LIQUIDATED:
          return checkUpdate(data, msgIdSet, ApiSequence.UPDATE_SETTLEMENT_LIQUIDATED, settlementDetatilSet, '6-c')
        case ApiSequence.TRACK:
          return checkTrack(data)
        case ApiSequence.ON_TRACK:
          return checkOnTrack(data)
        default:
          return null
      }
    }
    switch (flow) {
      case FLOW.FLOW1:
        logReport = processApiSequence(flowOneSequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW2:
        logReport = processApiSequence(flowTwoSequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW3:
        logReport = processApiSequence(flowThreeSequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW4:
        logReport = processApiSequence(flowFourSequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW5:
        logReport = processApiSequence(flowFiveSeqeence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW6:
        logReport = processApiSequence(flowSixSequence, data, logReport, msgIdSet, flow)
        break
    }
  } catch (error: any) {
    logger.error(error.message)
    return error.message
  }

  return logReport
}

export const IGMvalidateLogs = (data: any) => {
  let logReport: any = {}
  let retIsResolved = false

  try {
    dropDB()
  } catch (error) {
    logger.error('!!Error while removing LMDB', error)
  }

  try {
    if (data[IGMApiSequence.RET_ISSUE]) {
      const ret_issue = checkIssue(data[IGMApiSequence.RET_ISSUE])

      if (!_.isEmpty(ret_issue)) {
        logReport = { ...logReport, [IGMApiSequence.RET_ISSUE]: ret_issue }
      }
    }

    if (data[IGMApiSequence.RET_ISSUE_CLOSE]) {
      const ret_issue_close = checkIssueClose(data[IGMApiSequence.RET_ISSUE_CLOSE])

      if (!_.isEmpty(ret_issue_close)) {
        logReport = { ...logReport, [`${IGMApiSequence.RET_ISSUE}_CLOSE`]: ret_issue_close }
      }
    }

    if (data[IGMApiSequence.RET_ON_ISSUE]) {
      const ret_onissue = checkOnIssue(data[IGMApiSequence.RET_ON_ISSUE])

      if (!_.isEmpty(ret_onissue)) {
        logReport = { ...logReport, [IGMApiSequence.RET_ON_ISSUE]: ret_onissue }
      }
    }

    if (data[IGMApiSequence.RET_ISSUE_STATUS]) {
      const ret_issue_status = checkIssueStatus(data[IGMApiSequence.RET_ISSUE_STATUS])

      if (!_.isEmpty(ret_issue_status)) {
        logReport = { ...logReport, [IGMApiSequence.RET_ISSUE_STATUS]: ret_issue_status }
      }
    }

    if (data[IGMApiSequence.RET_ON_ISSUE_STATUS]) {
      const { onIssueStatusObj, isResolved } = checkOnIssueStatus(data[IGMApiSequence.RET_ON_ISSUE_STATUS])
      retIsResolved = isResolved
      if (!_.isEmpty(onIssueStatusObj)) {
        logReport = { ...logReport, [IGMApiSequence.RET_ON_ISSUE_STATUS]: onIssueStatusObj }
      }
    }

    if (data[IGMApiSequence.RET_ON_ISSUE_STATUS_UNSOLICITED]) {
      const { onIssueStatusObj, isResolved } = checkOnIssueStatusUnsolicited(
        data[IGMApiSequence.RET_ON_ISSUE_STATUS_UNSOLICITED],
        retIsResolved,
      )
      retIsResolved = isResolved

      if (!retIsResolved) {
        onIssueStatusObj.respondentActions = `At least one action with respondent_action 'Resolved' exists in /on_issue_status(unsolicited) or /on_issue_status.`
      }
      if (!_.isEmpty(onIssueStatusObj)) {
        logReport = { ...logReport, [IGMApiSequence.RET_ON_ISSUE_STATUS_UNSOLICITED]: onIssueStatusObj }
      }
    }

    if (data[IGMApiSequence.LSP_ISSUE]) {
      const lsp_issue = checkLspIssue(data[IGMApiSequence.LSP_ISSUE])

      if (!_.isEmpty(lsp_issue)) {
        logReport = { ...logReport, [IGMApiSequence.LSP_ISSUE]: lsp_issue }
      }
    }

    if (data[IGMApiSequence.LSP_ON_ISSUE]) {
      const lsp_on_issue = checkLspOnIssue(data[IGMApiSequence.LSP_ON_ISSUE])

      if (!_.isEmpty(lsp_on_issue)) {
        logReport = { ...logReport, [IGMApiSequence.LSP_ON_ISSUE]: lsp_on_issue }
      }
    }

    if (data[IGMApiSequence.LSP_ISSUE_CLOSE]) {
      const lsp_on_issue = checkLspIssueClose(data[IGMApiSequence.LSP_ISSUE_CLOSE])

      if (!_.isEmpty(lsp_on_issue)) {
        logReport = { ...logReport, [IGMApiSequence.LSP_ISSUE_CLOSE]: lsp_on_issue }
      }
    }

    if (data[IGMApiSequence.LSP_ISSUE_STATUS]) {
      const lsp_issue_status = checkLspIssueStatus(data[IGMApiSequence.LSP_ISSUE_STATUS])

      if (!_.isEmpty(lsp_issue_status)) {
        logReport = { ...logReport, [IGMApiSequence.LSP_ISSUE_STATUS]: lsp_issue_status }
      }
    }

    if (data[IGMApiSequence.LSP_ON_ISSUE_STATUS]) {
      const lsp_on_issue = checkLspOnIssueStatus(data[IGMApiSequence.LSP_ON_ISSUE_STATUS])

      if (!_.isEmpty(lsp_on_issue)) {
        logReport = { ...logReport, [IGMApiSequence.LSP_ON_ISSUE_STATUS]: lsp_on_issue }
      }
    }

    logger.info(logReport, 'Report Generated Successfully!!')
    return logReport
  } catch (error: any) {
    logger.error(error.message)
    return error.message
  }
}

export const IGMvalidateLogs2 = (data: any) => {
  let logReport: any = {}


  try {
    dropDB()
  } catch (error) {
    logger.error('!!Error while removing LMDB', error)
  }

  try {
    if (data[IGM2Sequence.ISSUE_1]) {
      const issue_1 = checkIssueV2(data[IGM2Sequence.ISSUE_1], IGM2Sequence.ISSUE_1)

      if (!_.isEmpty(issue_1)) {
        logReport = { ...logReport, [IGM2Sequence.ISSUE_1]: issue_1 }
      }
    }

    if (data[IGM2Sequence.ON_ISSUE_1]) {
      const on_issue_1 = checkOnIssueV2(data[IGM2Sequence.ON_ISSUE_1],IGM2Sequence.ON_ISSUE_1)

      if (!_.isEmpty(on_issue_1)) {
        logReport = { ...logReport, [IGM2Sequence.ON_ISSUE_1]: on_issue_1 }
      }
    }

    if(data[IGM2Sequence.ON_ISSUE_2]){
      const on_issue_2 = checkOnIssueV2(data[IGM2Sequence.ON_ISSUE_2],IGM2Sequence.ON_ISSUE_2  )

      if (!_.isEmpty(on_issue_2)) {
        logReport = { ...logReport, [IGM2Sequence.ON_ISSUE_1]: on_issue_2 }
      }
    }

    if(data[IGM2Sequence.ISSUE_2]){
      const on_issue_2 = checkOnIssueV2(data[IGM2Sequence.ON_ISSUE_2],IGM2Sequence.ISSUE_2  )

      if (!_.isEmpty(on_issue_2)) {
        logReport = { ...logReport, [IGM2Sequence.ON_ISSUE_1]: on_issue_2 }
      }
    }

    if (data[IGM2Sequence.ON_ISSUE_3]) {
      const on_issue_3 = checkOnIssueV2(data[IGM2Sequence.ON_ISSUE_3],IGM2Sequence.ON_ISSUE_3)

      if (!_.isEmpty(on_issue_3)) {
        logReport = { ...logReport, [IGM2Sequence.ON_ISSUE_3]: on_issue_3 }
      }
    }

    if(data[IGM2Sequence.ON_ISSUE_4]){
      const ON_ISSUE_4 = checkOnIssueV2(data[IGM2Sequence.ON_ISSUE_4],IGM2Sequence.ISSUE_4  )

      if (!_.isEmpty(ON_ISSUE_4)) {
        logReport = { ...logReport, [IGM2Sequence.ON_ISSUE_4]: ON_ISSUE_4}
      }
    }

    if(data[IGM2Sequence.ISSUE_3]){
      const ISSUE_3 = checkOnIssueV2(data[IGM2Sequence.ON_ISSUE_3],IGM2Sequence.ISSUE_3  )

      if (!_.isEmpty(ISSUE_3)) {
        logReport = { ...logReport, [IGM2Sequence.ON_ISSUE_1]: ISSUE_3 }
      }
    }

    if(data[IGM2Sequence.ON_ISSUE_5]){
      const on_issue_5 = checkOnIssueV2(data[IGM2Sequence.ON_ISSUE_5],IGM2Sequence.ON_ISSUE_5  )

      if (!_.isEmpty(on_issue_5)) {
        logReport = { ...logReport, [IGM2Sequence.ON_ISSUE_5]: on_issue_5 }
      }
    }

    if(data[IGM2Sequence.ISSUE_4]){
      const ISSUE_4 = checkOnIssueV2(data[IGM2Sequence.ON_ISSUE_4],IGM2Sequence.ISSUE_4  )

      if (!_.isEmpty(ISSUE_4)) {
        logReport = { ...logReport, [IGM2Sequence.ON_ISSUE_1]: ISSUE_4 }
      }
    }

    if(data[IGM2Sequence.ISSUE_5]){
      const ISSUE_5 = checkOnIssueV2(data[IGM2Sequence.ON_ISSUE_5],IGM2Sequence.ISSUE_5  )

      if (!_.isEmpty(ISSUE_5)) {
        logReport = { ...logReport, [IGM2Sequence.ON_ISSUE_1]: ISSUE_5 }
      }
    }

    if(data[IGM2Sequence.ON_ISSUE_6]){
      const on_issue_6 = checkOnIssueV2(data[IGM2Sequence.ON_ISSUE_6],IGM2Sequence.ON_ISSUE_6  )

      if (!_.isEmpty(on_issue_6)) {
        logReport = { ...logReport, [IGM2Sequence.ON_ISSUE_6]: on_issue_6 }
      }
    }

    if(data[IGM2Sequence.ON_ISSUE_7]){
      const on_issue_7 = checkOnIssueV2(data[IGM2Sequence.ON_ISSUE_7],IGM2Sequence.ON_ISSUE_7  )

      if (!_.isEmpty(on_issue_7)) {
        logReport = { ...logReport, [IGM2Sequence.ON_ISSUE_6]: on_issue_7 }
      }
    }

    

    logger.info(logReport, 'Report Generated Successfully!!')
    return logReport
  } catch (error: any) {
    logger.error(error.message)
    return error.message
  }
}

export const RSFvalidateLogs = (data: any) => {
  let logReport: any = {}
  
  try {
    dropDB()
  } catch (error) {
    logger.error('!!Error while removing LMDB', error)
  }

  try {
    if (data[RSFapiSequence.RECEIVER_RECON]) {
      const receiver_recon = checkRsfReceiverRecon(data[RSFapiSequence.RECEIVER_RECON])
      if (!_.isEmpty(receiver_recon)) {
        logReport = { ...logReport, [RSFapiSequence.RECEIVER_RECON]: receiver_recon }
      }
    }
    if (data[RSFapiSequence.ON_RECEIVER_RECON]) {
      const on_receiver_recon = checkRsfOnReceiverRecon(data[RSFapiSequence.ON_RECEIVER_RECON])

      if (!_.isEmpty(on_receiver_recon)) {
        logReport = { ...logReport, [RSFapiSequence.ON_RECEIVER_RECON]: on_receiver_recon }
      }
    }

    logger.info(logReport, 'Report Generated Successfully!!')
    return logReport
  } catch (error: any) {
    logger.error(error.message)
    return error.message
  }
}

export const RSFvalidateLogsV2 = (data: any) => {
  logger.info("Processing RSF v2.0.0 data:", data)
  let logReport: any = {}
  
  try {
    dropDB()
  } catch (error) {
    logger.error('Error while removing LMDB', error)
  }

  try {

    if (data[RSF_v2_apiSequence.SETTLE]) {
      const settle = checkRsfSettle(data[RSF_v2_apiSequence.SETTLE])
      if (!_.isEmpty(settle)) {
        logReport = { ...logReport, [RSF_v2_apiSequence.SETTLE]: settle }
      }
    }
    
    if (data[RSF_v2_apiSequence.ON_SETTLE]) {
      const on_settle = checkRsfOnSettle(data[RSF_v2_apiSequence.ON_SETTLE])
      if (!_.isEmpty(on_settle)) {
        logReport = { ...logReport, [RSF_v2_apiSequence.ON_SETTLE]: on_settle }
      }
    }

    if (data[RSF_v2_apiSequence.REPORT]) {
      const report = checkRsfReport(data[RSF_v2_apiSequence.REPORT])
      if (!_.isEmpty(report)) {
        logReport = { ...logReport, [RSF_v2_apiSequence.REPORT]: report }
      }
    }

    if (data[RSF_v2_apiSequence.ON_REPORT]) {
      const on_report = checkRsfOnReport(data[RSF_v2_apiSequence.ON_REPORT])
      if (!_.isEmpty(on_report)) {
        logReport = { ...logReport, [RSF_v2_apiSequence.ON_REPORT]: on_report }
      }
    }

    if (data[RSF_v2_apiSequence.RECON]) {
      const recon = checkRsfRecon(data[RSF_v2_apiSequence.RECON])
      if (!_.isEmpty(recon)) {
        logReport = { ...logReport, [RSF_v2_apiSequence.RECON]: recon }
      }
    }

    if (data[RSF_v2_apiSequence.ON_RECON]) {
      const on_recon = checkRsfOnRecon(data[RSF_v2_apiSequence.ON_RECON])
      if (!_.isEmpty(on_recon)) {
        logReport = { ...logReport, [RSF_v2_apiSequence.ON_RECON]: on_recon }
      }
    }

    logger.info('RSF v2.0.0 Report Generated Successfully')
    return logReport
  } catch (error: any) {
    logger.error(error.message)
    return error.message
  }
}


export const validateActionSchema = (data: any, domain: string, action: string) => {
  const errorObj: any = {}

  if (domain === 'ONDC:RET11') {
    const schemaError = validateSchema('RET11', action, data)
    if (schemaError !== 'error') Object.assign(errorObj, schemaError)
    return isObjectEmpty(errorObj) ? false : errorObj
  } else {
    const schemaError = validateSchema('RET10', action, data)
    if (schemaError !== 'error') Object.assign(errorObj, schemaError)
    return isObjectEmpty(errorObj) ? false : errorObj
  }
}
