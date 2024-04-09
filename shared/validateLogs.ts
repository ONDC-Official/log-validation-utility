import _ from 'lodash'
import { dropDB, setValue } from '../shared/dao'
import { logger } from './logger'
import { ApiSequence, retailDomains, IGMApiSequence, RSFapiSequence } from '../constants'
import { validateSchema, isObjectEmpty } from '../utils'
import { checkOnsearchFullCatalogRefresh } from '../utils/Retail/RET11/onSearch'
import { checkSelect } from '../utils/Retail/RET11/select'
import { checkOnSelect } from '../utils/Retail/RET11/onSelect'
import { checkInit } from '../utils/Retail/RET11/init'
import { checkOnInit } from '../utils/Retail/RET11/onInit'
import { checkConfirm } from '../utils/Retail/RET11/confirm'
import { checkOnConfirm } from '../utils/Retail/RET11/onConfirm'
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
import { checkSearchIncremental } from '../utils/Retail/RET11/searchIncremental'
import { checkOnsearchIncremental } from '../utils/Retail/RET11/onSearchIncremental'
import { FLOW } from '../utils/enum'
import { checkSelect_OOS } from '../utils/Retail/Select/select_oos'
import { checkOnSelect_OOS } from '../utils/Retail/Select/on_select_oos'
import { checkUpdate } from '../utils/Retail/Update/update'
import { checkOnUpdate } from '../utils/Retail/Update/onUpdate'
import { checkOnStatusPacked } from '../utils/Retail/Status/onStatusPacked'
import { checkOnStatusPicked } from '../utils/Retail/Status/onStatusPicked'
import { checkOnStatusOutForDelivery } from '../utils/Retail/Status/onStatusOutForDelivery'
import { checkOnStatusDelivered } from '../utils/Retail/Status/onStatusDelivered'
import { checkCancel } from '../utils/Retail/Cancel/cancel'
import { checkOnCancel } from '../utils/Retail/Cancel/onCancel'
import checkRsfReceiverRecon from '../utils/RSF/rsfReceiverRecon'
import checkRsfOnReceiverRecon from '../utils/RSF/rsfOnReciverRecon'
import checkRsfSettle from '../utils/RSF/rsfSettle'
import checkRsfOnSettle from '../utils/RSF/rsfOnSettle'

export const validateLogs = async (data: any, domain: string, flow: string) => {
  const msgIdSet = new Set()
  let logReport: any = {}
  setValue('flow', flow)
  setValue('domain', domain.split(':')[1])
  try {
    dropDB()
  } catch (error) {
    logger.error('!!Error while removing LMDB', error)
  }

  try {
    const validFlows = ['1', '2', '3', '4', '5', '6-a', '6-b', '6-c']
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
    ]
    const flowSixASequence = [
      ApiSequence.SEARCH,
      ApiSequence.ON_SEARCH,
      ApiSequence.SELECT,
      ApiSequence.ON_SELECT,
      ApiSequence.INIT,
      ApiSequence.ON_INIT,
      ApiSequence.CONFIRM,
      ApiSequence.ON_CONFIRM,
      ApiSequence.ON_UPDATE,
      ApiSequence.UPDATE,
    ]
    const flowSixBSequence = [
      ApiSequence.SEARCH,
      ApiSequence.ON_SEARCH,
      ApiSequence.SELECT,
      ApiSequence.ON_SELECT,
      ApiSequence.INIT,
      ApiSequence.ON_INIT,
      ApiSequence.CONFIRM,
      ApiSequence.ON_CONFIRM,
      ApiSequence.UPDATE,
      ApiSequence.ON_UPDATE_INTERIM,
      ApiSequence.ON_UPDATE_APPROVAL,
      ApiSequence.ON_UPDATE_PICKED,
      ApiSequence.UPDATE_SETTLEMENT,
      ApiSequence.ON_UPDATE_DELIVERED,
    ]
    const flowSixCSequence = [
      ApiSequence.SEARCH,
      ApiSequence.ON_SEARCH,
      ApiSequence.SELECT,
      ApiSequence.ON_SELECT,
      ApiSequence.INIT,
      ApiSequence.ON_INIT,
      ApiSequence.CONFIRM,
      ApiSequence.ON_CONFIRM,
      ApiSequence.UPDATE,
      ApiSequence.ON_UPDATE_INTERIM,
      ApiSequence.ON_UPDATE_LIQUIDATED,
      ApiSequence.UPDATE_SETTLEMENT,
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
            return checkOnsearchFullCatalogRefresh(data, msgIdSet)
          } else {
            return checkOnsearch(data, msgIdSet)
          }
        case ApiSequence.INC_SEARCH:
          return checkSearchIncremental(data, msgIdSet)
        case ApiSequence.INC_ONSEARCH:
          return checkOnsearchIncremental(data, msgIdSet)
        case ApiSequence.SELECT:
          if (flow === FLOW.FLOW3) {
            return checkSelect_OOS(data, msgIdSet)
          } else {
            return checkSelect(data, msgIdSet)
          }
        case ApiSequence.ON_SELECT:
          return checkOnSelect(data)
        case ApiSequence.SELECT_OUT_OF_STOCK:
          return checkSelect(data, msgIdSet)
        case ApiSequence.ON_SELECT_OUT_OF_STOCK:
          return checkOnSelect_OOS(data)
        case ApiSequence.INIT:
          return checkInit(data, msgIdSet)
        case ApiSequence.ON_INIT:
          return checkOnInit(data, msgIdSet)
        case ApiSequence.CONFIRM:
          return checkConfirm(data, msgIdSet)
        case ApiSequence.ON_CONFIRM:
          return checkOnConfirm(data)
        case ApiSequence.CANCEL:
          return checkCancel(data, msgIdSet)
        case ApiSequence.ON_CANCEL:
          return checkOnCancel(data, msgIdSet)
        case ApiSequence.STATUS:
          return checkStatus(data)
        case ApiSequence.ON_STATUS_PENDING:
          return checkOnStatusPending(data, 'pending', msgIdSet)
        case ApiSequence.ON_STATUS_PACKED:
          return checkOnStatusPacked(data, 'packed', msgIdSet)
        case ApiSequence.ON_STATUS_PICKED:
          return checkOnStatusPicked(data, 'picked', msgIdSet)
        case ApiSequence.ON_STATUS_OUT_FOR_DELIVERY:
          return checkOnStatusOutForDelivery(data, 'out-for-delivery', msgIdSet)
        case ApiSequence.ON_STATUS_DELIVERED:
          return checkOnStatusDelivered(data, 'delivered', msgIdSet)
        case ApiSequence.UPDATE:
          return checkUpdate(data)
        case ApiSequence.UPDATE_SETTLEMENT:
          return checkUpdate(data)
        case ApiSequence.ON_UPDATE:
          return checkOnUpdate(data)
        case ApiSequence.ON_UPDATE_INTERIM:
          return checkOnUpdate(data)
        case ApiSequence.ON_UPDATE_APPROVAL:
          return checkOnUpdate(data)
        case ApiSequence.ON_UPDATE_DELIVERED:
          return checkOnUpdate(data)
        case ApiSequence.ON_UPDATE_LIQUIDATED:
          return checkOnUpdate(data)
        case ApiSequence.ON_UPDATE_PICKED:
          return checkOnUpdate(data)
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
      case FLOW.FLOW6A:
        logReport = processApiSequence(flowSixASequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW6B:
        logReport = processApiSequence(flowSixBSequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW6C:
        logReport = processApiSequence(flowSixCSequence, data, logReport, msgIdSet, flow)
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
      const ret_onissue_status = checkOnIssueStatus(data[IGMApiSequence.RET_ON_ISSUE_STATUS])

      if (!_.isEmpty(ret_onissue_status)) {
        logReport = { ...logReport, [IGMApiSequence.RET_ON_ISSUE_STATUS]: ret_onissue_status }
      }
    }

    if (data[IGMApiSequence.RET_ON_ISSUE_STATUS_UNSOLICITED]) {
      const ret_onissue_status_un = checkOnIssueStatusUnsolicited(data[IGMApiSequence.RET_ON_ISSUE_STATUS_UNSOLICITED])

      if (!_.isEmpty(ret_onissue_status_un)) {
        logReport = { ...logReport, [IGMApiSequence.RET_ON_ISSUE_STATUS_UNSOLICITED]: ret_onissue_status_un }
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
    if (data[RSFapiSequence.SETTLE]) {
      const settle = checkRsfSettle(data[RSFapiSequence.SETTLE])
      if (!_.isEmpty(settle)) {
        logReport = { ...logReport, [RSFapiSequence.SETTLE]: settle }
      }
    }
    if (data[RSFapiSequence.ON_SETTLE]) {
      const on_settle = checkRsfOnSettle(data[RSFapiSequence.ON_SETTLE])
      if (!_.isEmpty(on_settle)) {
        logReport = { ...logReport, [RSFapiSequence.ON_SETTLE]: on_settle }
      }
    }

    logger.info(logReport, 'Report Generated Successfully!!')
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
