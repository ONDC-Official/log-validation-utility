import _ from 'lodash'
import { dropDB, setValue, getValue } from '../shared/dao'
import { logger } from './logger'
import { ApiSequence, retailDomains } from '../constants'
import { validateSchema, isObjectEmpty } from '../utils'
import { extractRoutingType } from '../utils/Retail_.1.2.5/common/routingValidator'
import { checkOnsearchFullCatalogRefresh } from '../utils/Retail_.1.2.5/RET11_onSearch/onSearch'
import { checkSelect } from '../utils/Retail_.1.2.5/Select/select'
import { checkOnSelect } from '../utils/Retail_.1.2.5/Select/onSelect'
import { checkInit } from '../utils/Retail_.1.2.5/Init/init'
import { checkOnInit } from '../utils/Retail_.1.2.5/Init/onInit'
import { checkConfirm } from '../utils/Retail_.1.2.5/Confirm/confirm'
import { checkOnConfirm } from '../utils/Retail_.1.2.5/Confirm/onConfirm'
import { checkOnTrack } from '../utils/Retail_.1.2.5/Track/onTrack'
import { checkTrack } from '../utils/Retail_.1.2.5/Track/track'
import { checkOnStatusPending } from '../utils/Retail_.1.2.5/Status/onStatusPending'
import { checkStatus } from '../utils/Retail_.1.2.5/Status/status'
import { checkSearch } from '../utils/Retail_.1.2.5/Search/search'
import { checkOnsearch } from '../utils/Retail_.1.2.5/Search/on_search'
import { checkSearchIncremental } from '../utils/Retail_.1.2.5/SearchInc/searchIncremental'
import { checkOnsearchIncremental } from '../utils/Retail_.1.2.5/SearchInc/onSearchIncremental'
import { FLOW, OFFERSFLOW } from '../utils/enum'
import { checkSelect_OOS } from '../utils/Retail_.1.2.5/Select_OOS/select_oos'
import { checkOnSelect_OOS } from '../utils/Retail_.1.2.5/Select_OOS/on_select_oos'
import { checkUpdate } from '../utils/Retail_.1.2.5/Update/update'
import { checkOnUpdate } from '../utils/Retail_.1.2.5/Update/onUpdate'
import { checkOnStatusPacked } from '../utils/Retail_.1.2.5/Status/onStatusPacked'
import { checkOnStatusAtPickup } from '../utils/Retail_.1.2.5/Status/onStatusAtPickup'
import { checkOnStatusAtDelivery } from '../utils/Retail_.1.2.5/Status/onStatusAtDelivery'
import { checkOnStatusPicked } from '../utils/Retail_.1.2.5/Status/onStatusPicked'
import { checkOnStatusOutForDelivery } from '../utils/Retail_.1.2.5/Status/onStatusOutForDelivery'
import { checkOnStatusDelivered } from '../utils/Retail_.1.2.5/Status/onStatusDelivered'
import { checkOnStatusRTODelivered } from '../utils/Retail_.1.2.5/Status/onStatusRTODelivered'
import { checkOnStatusAgentAssigned } from '../utils/Retail_.1.2.5/Status/onStatusAgentAssigned'
import { checkOnStatusOutForPickup } from '../utils/Retail_.1.2.5/Status/onStatusOutForPickup'
import { checkOnStatusPickupFailed } from '../utils/Retail_.1.2.5/Status/onStatusPickupFailed'
import { checkOnStatusInTransit } from '../utils/Retail_.1.2.5/Status/onStatusInTransit'
import { checkOnStatusAtDestinationHub } from '../utils/Retail_.1.2.5/Status/onStatusAtDestinationHub'
import { checkOnStatusDeliveryFailed } from '../utils/Retail_.1.2.5/Status/onStatusDeliveryFailed'
import { checkCancel } from '../utils/Retail_.1.2.5/Cancel/cancel'
import { checkOnCancel } from '../utils/Retail_.1.2.5/Cancel/onCancel'
import { checkCatalogRejection } from '../utils/Retail_.1.2.5/Catalog_Rejection/catalogRejection'
import { P2P_STATES, P2H2P_STATES } from '../constants/fulfillmentStates'

// export const validateLogs = async (data: any, domain: string, flow: string) => {
//   const msgIdSet = new Set()
//   const quoteTrailItemsSet = new Set()
//   const settlementDetatilSet = new Set()
//   const fulfillmentsItemsSet = new Set()
//   let logReport: any = {}
//   setValue('flow', flow)
//   setValue('domain', domain.split(':')[1])
//   try {
//     dropDB()
//   } catch (error) {
//     logger.error('!!Error while removing LMDB', error)
//   }

//   try {
//     const validFlows = ['1', '2', '3', '4', '5', '6', '7', '8', '9', ]
//     if (!retailDomains.includes(domain)) {
//       return 'Domain should be of the 1.2.0 retail domains'
//     }
//     const flowOneSequence = [
//       ApiSequence.SEARCH,
//       ApiSequence.ON_SEARCH,
//       ApiSequence.INC_SEARCH,
//       ApiSequence.INC_ONSEARCH,
//     ]
//     const flowTwoSequence = [
//       ApiSequence.SEARCH,
//       ApiSequence.ON_SEARCH,
//       ApiSequence.SELECT,
//       ApiSequence.ON_SELECT,
//       ApiSequence.INIT,
//       ApiSequence.ON_INIT,
//       ApiSequence.CONFIRM,
//       ApiSequence.ON_CONFIRM,
//       ApiSequence.ON_STATUS_PENDING,
//       ApiSequence.ON_STATUS_PACKED,
//       ApiSequence.ON_STATUS_PICKED,
//       ApiSequence.ON_STATUS_OUT_FOR_DELIVERY,
//       ApiSequence.ON_STATUS_DELIVERED,
//     ]
//     const flowThreeSequence = [
//       ApiSequence.SEARCH,
//       ApiSequence.ON_SEARCH,
//       ApiSequence.SELECT_OUT_OF_STOCK,
//       ApiSequence.ON_SELECT_OUT_OF_STOCK,
//       ApiSequence.SELECT,
//       ApiSequence.ON_SELECT,
//       ApiSequence.INIT,
//       ApiSequence.ON_INIT,
//       ApiSequence.CONFIRM,
//       ApiSequence.ON_CONFIRM,
//       ApiSequence.ON_STATUS_PENDING,
//       ApiSequence.ON_STATUS_PACKED,
//       ApiSequence.ON_STATUS_PICKED,
//       ApiSequence.ON_STATUS_OUT_FOR_DELIVERY,
//       ApiSequence.ON_STATUS_DELIVERED,
//     ]
//     const flowFourSequence = [
//       ApiSequence.SEARCH,
//       ApiSequence.ON_SEARCH,
//       ApiSequence.SELECT,
//       ApiSequence.ON_SELECT,
//       ApiSequence.INIT,
//       ApiSequence.ON_INIT,
//       ApiSequence.CONFIRM,
//       ApiSequence.ON_CONFIRM,
//       ApiSequence.CANCEL,
//       ApiSequence.ON_CANCEL,
//     ]
//     const flowFiveSequence = [
//       ApiSequence.SEARCH,
//       ApiSequence.ON_SEARCH,
//       ApiSequence.SELECT,
//       ApiSequence.ON_SELECT,
//       ApiSequence.INIT,
//       ApiSequence.ON_INIT,
//       ApiSequence.CONFIRM,
//       ApiSequence.ON_CONFIRM,
//       ApiSequence.ON_STATUS_PENDING,
//       ApiSequence.ON_STATUS_PACKED,
//       ApiSequence.ON_STATUS_PICKED,
//       ApiSequence.ON_STATUS_OUT_FOR_DELIVERY,
//       ApiSequence.ON_CANCEL,
//       ApiSequence.ON_STATUS_RTO_DELIVERED,
//     ]

//     const flowSixSequence = [
//       ApiSequence.SEARCH,
//       ApiSequence.ON_SEARCH,
//       ApiSequence.SELECT,
//       ApiSequence.ON_SELECT,
//       ApiSequence.INIT,
//       ApiSequence.ON_INIT,
//       ApiSequence.CONFIRM,
//       ApiSequence.ON_CONFIRM,
//       ApiSequence.ON_UPDATE_PART_CANCEL,
//       ApiSequence.UPDATE_SETTLEMENT_PART_CANCEL,
//       ApiSequence.ON_STATUS_PENDING,
//       ApiSequence.ON_STATUS_PACKED,
//       ApiSequence.ON_STATUS_PICKED,
//       ApiSequence.ON_STATUS_OUT_FOR_DELIVERY,
//       ApiSequence.ON_STATUS_DELIVERED,
//       ApiSequence.UPDATE_REVERSE_QC,
//       ApiSequence.ON_UPDATE_INTERIM_REVERSE_QC,
//       ApiSequence.ON_UPDATE_APPROVAL,
//       ApiSequence.ON_UPDATE_PICKED,
//       ApiSequence.UPDATE_SETTLEMENT_REVERSE_QC,
//       ApiSequence.ON_UPDATE_DELIVERED,
//       ApiSequence.UPDATE_LIQUIDATED,
//       ApiSequence.ON_UPDATE_INTERIM_LIQUIDATED,
//       ApiSequence.ON_UPDATE_LIQUIDATED,
//       ApiSequence.UPDATE_SETTLEMENT_LIQUIDATED,
//     ]
//     const flowSevenSequence = [ApiSequence.SEARCH, ApiSequence.ON_SEARCH, ApiSequence.CATALOG_REJECTION]
//     const flowEightSequence = [ApiSequence.SEARCH, ApiSequence.ON_SEARCH]
//     const flowNineSequence = [ApiSequence.INC_SEARCH, ApiSequence.INC_ONSEARCH, ApiSequence.CATALOG_REJECTION]

//     const processApiSequence = (apiSequence: any, data: any, logReport: any, msgIdSet: any, flow: string) => {
//       if (validFlows.includes(flow)) {
//         apiSequence.forEach((apiSeq: any) => {
//           if (data[apiSeq]) {
//             const resp = getResponse(apiSeq, data[apiSeq], msgIdSet, flow)
//             if (!_.isEmpty(resp)) {
//               logReport = { ...logReport, [apiSeq]: resp }
//             }
//           } else {
//             logReport = { ...logReport, [apiSeq]: `Missing required data of : ${apiSeq}` }
//           }
//         })
//         logger.info(logReport, 'Report Generated Successfully!!')
//         return logReport
//       } else {
//         return { invldFlow: 'Provided flow is invalid' }
//       }
//     }
//     const getResponse = (apiSeq: any, data: any, msgIdSet: any, flow: string) => {
//       switch (apiSeq) {
//         case ApiSequence.SEARCH:
//           return checkSearch(data, msgIdSet)
//         case ApiSequence.ON_SEARCH:
//           if (domain === 'ONDC:RET11') {
//             return checkOnsearchFullCatalogRefresh(data)
//           } else {
//             return checkOnsearch(data)
//           }
//         case ApiSequence.INC_SEARCH:
//           return checkSearchIncremental(data, msgIdSet)
//         case ApiSequence.INC_ONSEARCH:
//           return checkOnsearchIncremental(data, msgIdSet)
//         case ApiSequence.SELECT:
//           if (flow === FLOW.FLOW3) {
//             return checkSelect_OOS(data, msgIdSet)
//           } else {
//             return checkSelect(data, msgIdSet, ApiSequence.SELECT)
//           }
//         case ApiSequence.ON_SELECT:
//           return checkOnSelect(data,flow)
//         case ApiSequence.SELECT_OUT_OF_STOCK:
//           return checkSelect(data, msgIdSet, ApiSequence.SELECT_OUT_OF_STOCK)
//         case ApiSequence.ON_SELECT_OUT_OF_STOCK:
//           return checkOnSelect_OOS(data)
//         case ApiSequence.INIT:
//           return checkInit(data, msgIdSet,flow)
//         case ApiSequence.ON_INIT:
//           return checkOnInit(data, flow)
//         case ApiSequence.CONFIRM:
//           return checkConfirm(data, msgIdSet, flow)
//         case ApiSequence.ON_CONFIRM:
//           return checkOnConfirm(data, fulfillmentsItemsSet, flow)
//         case ApiSequence.CANCEL:
//           return checkCancel(data, msgIdSet)
//         case ApiSequence.ON_CANCEL:
//           return checkOnCancel(data, msgIdSet)
//         case ApiSequence.ON_STATUS_RTO_DELIVERED:
//           return checkOnStatusRTODelivered(data)
//         case ApiSequence.STATUS:
//           return checkStatus(data)
//         case ApiSequence.ON_STATUS_PENDING:
//           return checkOnStatusPending(data, 'pending', msgIdSet, fulfillmentsItemsSet)
//         case ApiSequence.ON_STATUS_PACKED:
//           return checkOnStatusPacked(data, 'packed', msgIdSet, fulfillmentsItemsSet)
//         case ApiSequence.ON_STATUS_PICKED:
//           return checkOnStatusPicked(data, 'picked', msgIdSet, fulfillmentsItemsSet)
//         case ApiSequence.ON_STATUS_OUT_FOR_DELIVERY:
//           return checkOnStatusOutForDelivery(data, 'out-for-delivery', msgIdSet, fulfillmentsItemsSet)
//         case ApiSequence.ON_STATUS_DELIVERED:
//           return checkOnStatusDelivered(data, 'delivered', msgIdSet, fulfillmentsItemsSet)
//         case ApiSequence.ON_UPDATE_PART_CANCEL:
//           return checkOnUpdate(
//             data,
//             msgIdSet,
//             ApiSequence.ON_UPDATE_PART_CANCEL,
//             settlementDetatilSet,
//             quoteTrailItemsSet,
//             fulfillmentsItemsSet,
//             '6-a',
//           )
//         case ApiSequence.UPDATE_SETTLEMENT_PART_CANCEL:
//           return checkUpdate(data, msgIdSet, ApiSequence.UPDATE_SETTLEMENT_PART_CANCEL, settlementDetatilSet, '6-a')
//         case ApiSequence.UPDATE_REVERSE_QC:
//           return checkUpdate(data, msgIdSet, ApiSequence.UPDATE_REVERSE_QC, settlementDetatilSet, '6-b')

//         case ApiSequence.ON_UPDATE_INTERIM_REVERSE_QC:
//           return checkOnUpdate(
//             data,
//             msgIdSet,
//             ApiSequence.ON_UPDATE_INTERIM_REVERSE_QC,
//             settlementDetatilSet,
//             quoteTrailItemsSet,
//             fulfillmentsItemsSet,
//             '6-b',
//           )
//         case ApiSequence.ON_UPDATE_APPROVAL:
//           return checkOnUpdate(
//             data,
//             msgIdSet,
//             ApiSequence.ON_UPDATE_APPROVAL,
//             settlementDetatilSet,
//             quoteTrailItemsSet,
//             fulfillmentsItemsSet,
//             '6-b',
//           )
//         case ApiSequence.ON_UPDATE_PICKED:
//           return checkOnUpdate(
//             data,
//             msgIdSet,
//             ApiSequence.ON_UPDATE_PICKED,
//             settlementDetatilSet,
//             quoteTrailItemsSet,
//             fulfillmentsItemsSet,
//             '6-b',
//           )
//         case ApiSequence.UPDATE_SETTLEMENT_REVERSE_QC:
//           return checkUpdate(data, msgIdSet, ApiSequence.UPDATE_SETTLEMENT_REVERSE_QC, settlementDetatilSet, '6-b')
//         case ApiSequence.ON_UPDATE_DELIVERED:
//           return checkOnUpdate(
//             data,
//             msgIdSet,
//             ApiSequence.ON_UPDATE_DELIVERED,
//             settlementDetatilSet,
//             quoteTrailItemsSet,
//             fulfillmentsItemsSet,
//             '6-b',
//           )
//         case ApiSequence.UPDATE_LIQUIDATED:
//           return checkUpdate(data, msgIdSet, ApiSequence.UPDATE_LIQUIDATED, settlementDetatilSet, '6-c')
//         case ApiSequence.ON_UPDATE_INTERIM_LIQUIDATED:
//           return checkOnUpdate(
//             data,
//             msgIdSet,
//             ApiSequence.ON_UPDATE_INTERIM_LIQUIDATED,
//             settlementDetatilSet,
//             quoteTrailItemsSet,
//             fulfillmentsItemsSet,
//             '6-c',
//           )
//         case ApiSequence.ON_UPDATE_LIQUIDATED:
//           return checkOnUpdate(
//             data,
//             msgIdSet,
//             ApiSequence.ON_UPDATE_LIQUIDATED,
//             settlementDetatilSet,
//             quoteTrailItemsSet,
//             fulfillmentsItemsSet,
//             '6-c',
//           )
//         case ApiSequence.UPDATE_SETTLEMENT_LIQUIDATED:
//           return checkUpdate(data, msgIdSet, ApiSequence.UPDATE_SETTLEMENT_LIQUIDATED, settlementDetatilSet, '6-c')
//         case ApiSequence.TRACK:
//           return checkTrack(data)
//         case ApiSequence.ON_TRACK:
//           return checkOnTrack(data)
//         case ApiSequence.CATALOG_REJECTION:
//           return checkCatalogRejection(data)
//         default:
//           return null
//       }
//     }
//     switch (flow) {
//       case FLOW.FLOW1:
//         logReport = processApiSequence(flowOneSequence, data, logReport, msgIdSet, flow)
//         break
//       case FLOW.FLOW2:
//         logReport = processApiSequence(flowTwoSequence, data, logReport, msgIdSet, flow)
//         break
//       case FLOW.FLOW3:
//         logReport = processApiSequence(flowThreeSequence, data, logReport, msgIdSet, flow)
//         break
//       case FLOW.FLOW4:
//         logReport = processApiSequence(flowFourSequence, data, logReport, msgIdSet, flow)
//         break
//       case FLOW.FLOW5:
//         logReport = processApiSequence(flowFiveSequence, data, logReport, msgIdSet, flow)
//         break
//       case FLOW.FLOW6:
//         logReport = processApiSequence(flowSixSequence, data, logReport, msgIdSet, flow)
//         break
//       case FLOW.FLOW7:
//         logReport = processApiSequence(flowSevenSequence, data, logReport, msgIdSet, flow)
//         break
//       case FLOW.FLOW8:
//         logReport = processApiSequence(flowEightSequence, data, logReport, msgIdSet, flow)
//         break
//       case FLOW.FLOW9:
//         logReport = processApiSequence(flowNineSequence, data, logReport, msgIdSet, flow)
//         break          
//     }
//   } catch (error: any) {
//     logger.error(error.message)
//     return error.message
//   }

//   return logReport
// }
export const validateLogsRetailV2 = async (data: any, domain: string, flow: string) => {
  const msgIdSet = new Set()
  const quoteTrailItemsSet = new Set()
  const settlementDetatilSet = new Set()
  const fulfillmentsItemsSet = new Set()
  let logReport: any = {}
  setValue('flow', flow)
  setValue('domain', domain.split(':')[1])
  try {
    await dropDB()
  } catch (error) {
    logger.error('!!Error while removing LMDB', error)
  }

  try {
    const validFlows = [
      '1',
      '2',
      '012',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0091', '0092', '0093', '0094', '0095', '0096', '0097', '0098', '020', '00B',
      '01C',
      '008',
      '003',
      '00F',
      '011',
      '017',
      '00D',
      '00E',
      '016',
      '01F',
      '00C',
      '01E',
      '001',
      '025',
      '022',
      '004',
      '01D',
      '005',
      '002'
    ]
    if (!retailDomains.includes(domain)) {
      return 'Domain should 1.2.5 retail domains'
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
      ApiSequence.ON_STATUS_AGENT_ASSIGNED,
      ApiSequence.ON_STATUS_AT_PICKUP,
      ApiSequence.ON_STATUS_OUT_FOR_PICKUP,
      ApiSequence.ON_STATUS_PICKUP_FAILED,
      ApiSequence.ON_STATUS_PICKED,
      ApiSequence.ON_STATUS_AT_DELIVERY,
      ApiSequence.ON_STATUS_IN_TRANSIT,
      ApiSequence.ON_STATUS_AT_DESTINATION_HUB,
      ApiSequence.TRACK,
      ApiSequence.ON_TRACK,
      ApiSequence.ON_STATUS_OUT_FOR_DELIVERY,
      ApiSequence.ON_STATUS_DELIVERY_FAILED,
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
      ApiSequence.ON_STATUS_AGENT_ASSIGNED,
      ApiSequence.ON_STATUS_AT_PICKUP,
      ApiSequence.ON_STATUS_OUT_FOR_PICKUP,
      ApiSequence.ON_STATUS_PICKUP_FAILED,
      ApiSequence.ON_STATUS_PICKED,
      ApiSequence.ON_STATUS_AT_DELIVERY,
      ApiSequence.ON_STATUS_IN_TRANSIT,
      ApiSequence.ON_STATUS_AT_DESTINATION_HUB,
      ApiSequence.ON_STATUS_OUT_FOR_DELIVERY,
      ApiSequence.ON_STATUS_DELIVERY_FAILED,
      ApiSequence.ON_STATUS_DELIVERED,
      ApiSequence.TRACK,
      ApiSequence.ON_TRACK
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
    const flowFiveSequence = [
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
      ApiSequence.ON_STATUS_AGENT_ASSIGNED,
      ApiSequence.ON_STATUS_AT_PICKUP,
      ApiSequence.ON_STATUS_OUT_FOR_PICKUP,
      ApiSequence.ON_STATUS_PICKUP_FAILED,
      ApiSequence.ON_STATUS_PICKED,
      ApiSequence.ON_STATUS_AT_DELIVERY,
      ApiSequence.ON_STATUS_IN_TRANSIT,
      ApiSequence.ON_STATUS_AT_DESTINATION_HUB,
      ApiSequence.ON_STATUS_OUT_FOR_DELIVERY,
      ApiSequence.ON_STATUS_DELIVERY_FAILED,
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
      ApiSequence.ON_STATUS_PENDING,
      ApiSequence.ON_STATUS_PACKED,
      ApiSequence.ON_STATUS_AGENT_ASSIGNED,
      ApiSequence.ON_STATUS_AT_PICKUP,
      ApiSequence.ON_STATUS_OUT_FOR_PICKUP,
      ApiSequence.ON_STATUS_PICKUP_FAILED,
      ApiSequence.ON_STATUS_PICKED,
      ApiSequence.ON_STATUS_AT_DELIVERY,
      ApiSequence.ON_STATUS_IN_TRANSIT,
      ApiSequence.ON_STATUS_AT_DESTINATION_HUB,
      ApiSequence.ON_STATUS_OUT_FOR_DELIVERY,
      ApiSequence.ON_STATUS_DELIVERY_FAILED,
      ApiSequence.ON_STATUS_DELIVERED,
      ApiSequence.UPDATE_LIQUIDATED,
      ApiSequence.ON_UPDATE_INTERIM_LIQUIDATED,
      ApiSequence.ON_UPDATE_LIQUIDATED,
      ApiSequence.UPDATE_SETTLEMENT_LIQUIDATED,
    ]
    const flowSevenSequence = [ApiSequence.SEARCH, ApiSequence.ON_SEARCH, ApiSequence.CATALOG_REJECTION]
    const flowEightSequence = [ApiSequence.SEARCH, ApiSequence.ON_SEARCH]
    const flowNineSequence = [ApiSequence.INC_SEARCH, ApiSequence.INC_ONSEARCH, ApiSequence.CATALOG_REJECTION]
    const flow020Sequence = [
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
    const flowOfferTypeDiscountSequence = [
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
    const flowOfferTypeFreebieSequence = [
      ApiSequence.SEARCH,
      ApiSequence.ON_SEARCH,
      ApiSequence.SELECT,
      ApiSequence.ON_SELECT,
      ApiSequence.INIT,
      ApiSequence.ON_INIT,
      ApiSequence.CONFIRM,
      ApiSequence.ON_CONFIRM,
    ]
    const flowOfferTypebuyXgetYSequence = [
      ApiSequence.SEARCH,
      ApiSequence.ON_SEARCH,
      ApiSequence.SELECT,
      ApiSequence.ON_SELECT,
      ApiSequence.INIT,
      ApiSequence.ON_INIT,
      ApiSequence.CONFIRM,
      ApiSequence.ON_CONFIRM,
    ]
    const flowOfferTypeDeliverySequence = [
      ApiSequence.SEARCH,
      ApiSequence.ON_SEARCH,
      ApiSequence.SELECT,
      ApiSequence.ON_SELECT,
      ApiSequence.INIT,
      ApiSequence.ON_INIT,
      ApiSequence.CONFIRM,
      ApiSequence.ON_CONFIRM,
    ]
    const flowOfferTypeSlabSequence = [
      ApiSequence.SEARCH,
      ApiSequence.ON_SEARCH,
      ApiSequence.SELECT,
      ApiSequence.ON_SELECT,
      ApiSequence.INIT,
      ApiSequence.ON_INIT,
      ApiSequence.CONFIRM,
      ApiSequence.ON_CONFIRM,
    ]
    const flowOfferTypeComboSequence = [
      ApiSequence.SEARCH,
      ApiSequence.ON_SEARCH,
      ApiSequence.SELECT,
      ApiSequence.ON_SELECT,
      ApiSequence.INIT,
      ApiSequence.ON_INIT,
      ApiSequence.CONFIRM,
      ApiSequence.ON_CONFIRM,
    ]
    const flowOfferTypeExchangeSequence = [
      ApiSequence.SEARCH,
      ApiSequence.ON_SEARCH,
      ApiSequence.SELECT,
      ApiSequence.ON_SELECT,
      ApiSequence.INIT,
      ApiSequence.ON_INIT,
      ApiSequence.CONFIRM,
      ApiSequence.ON_CONFIRM,
    ]
    const flowOfferTypeFinancingSequence = [
      ApiSequence.SEARCH,
      ApiSequence.ON_SEARCH,
      ApiSequence.SELECT,
      ApiSequence.ON_SELECT,
      ApiSequence.INIT,
      ApiSequence.ON_INIT,
      ApiSequence.CONFIRM,
      ApiSequence.ON_CONFIRM,
    ]
    const flowReplacementSequence = [
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
      ApiSequence.UPDATE_REPLACEMENT,
      ApiSequence.ON_UPDATE_INTERIM_REVERSE_QC,
      ApiSequence.ON_UPDATE_APPROVAL,
      ApiSequence.ON_UPDATE_REPLACEMENT,
      ApiSequence.REPLACEMENT_ON_STATUS_PENDING,
      ApiSequence.REPLACEMENT_ON_STATUS_PACKED,
      ApiSequence.REPLACEMENT_ON_STATUS_PICKED,
      ApiSequence.REPLACEMENT_ON_STATUS_OUT_FOR_DELIVERY,
      ApiSequence.REPLACEMENT_ON_STATUS_DELIVERED,
    ]
    const flow01CSequence = [
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
    const flow008Sequence = [
      ApiSequence.SEARCH,
      ApiSequence.ON_SEARCH,
      ApiSequence.SELECT,
      ApiSequence.ON_SELECT,
      ApiSequence.INIT,
      ApiSequence.ON_INIT,
    ]
    const flow003Sequence = [
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
    ]
    const flow00FSequence = [
      ApiSequence.SEARCH,
      ApiSequence.ON_SEARCH,
      ApiSequence.SELECT,
      ApiSequence.ON_SELECT,
      ApiSequence.INIT,
      ApiSequence.ON_INIT,
      ApiSequence.CONFIRM,
      ApiSequence.ON_CONFIRM,
      ApiSequence.UPDATE_ADDRESS,
      ApiSequence.ON_UPDATE_ADDRESS,
    ]
    const flow011Sequence = [
      ApiSequence.SEARCH,
      ApiSequence.ON_SEARCH,
      ApiSequence.SELECT,
      ApiSequence.ON_SELECT,
      ApiSequence.INIT,
      ApiSequence.ON_INIT,
      ApiSequence.CONFIRM,
      ApiSequence.ON_CONFIRM,
      ApiSequence.UPDATE_INSTRUCTIONS,
      ApiSequence.ON_UPDATE_INSTRUCTIONS,
    ]
    const flow017Sequence = [
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
      ApiSequence.ON_STATUS_AGENT_ASSIGNED,
      ApiSequence.ON_STATUS_PICKED,
      ApiSequence.ON_STATUS_OUT_FOR_DELIVERY,
      ApiSequence.ON_STATUS_DELIVERED,
      ApiSequence.ON_UPDATE,
      ApiSequence.ON_CANCEL,
    ]
    const flow00DSequence = [
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
      ApiSequence.ON_STATUS_AGENT_ASSIGNED,
      ApiSequence.ON_STATUS_PICKED,
      ApiSequence.ON_STATUS_OUT_FOR_DELIVERY,
      ApiSequence.ON_STATUS_DELIVERED,
      ApiSequence.CANCEL,
      ApiSequence.ON_CANCEL,
    ]
    const flow00ESequence = [
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
      ApiSequence.UPDATE,
    ]
    const flow012Sequence = [
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
      ApiSequence.ON_STATUS_AGENT_ASSIGNED,
      ApiSequence.ON_STATUS_PICKED,
      ApiSequence.TRACK,
      ApiSequence.ON_TRACK,
      ApiSequence.ON_STATUS_OUT_FOR_DELIVERY,
      ApiSequence.ON_STATUS_DELIVERED,
    ]
    const flow016Sequence = [
      ApiSequence.SEARCH,
      ApiSequence.ON_SEARCH,
      ApiSequence.SELECT,
      ApiSequence.ON_SELECT,
      ApiSequence.INIT,
      ApiSequence.ON_INIT,
      ApiSequence.CONFIRM,
      ApiSequence.ON_CONFIRM,

    ]
    const flow01FSequence = [
      ApiSequence.SEARCH,
      ApiSequence.ON_SEARCH,
      ApiSequence.SELECT,
      ApiSequence.ON_SELECT,
      ApiSequence.INIT,
      ApiSequence.ON_INIT,
      ApiSequence.CONFIRM,
      ApiSequence.ON_CONFIRM,

    ]
    const flow01ESequence = [
      ApiSequence.SEARCH,
      ApiSequence.ON_SEARCH,
      ApiSequence.SELECT,
      ApiSequence.ON_SELECT,
      ApiSequence.INIT,
      ApiSequence.ON_INIT,
      ApiSequence.CONFIRM,
      ApiSequence.ON_CONFIRM,
    ]

    const flow00CSequence = [
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
      ApiSequence.ON_STATUS_AGENT_ASSIGNED,
      ApiSequence.ON_STATUS_PICKED,
      ApiSequence.ON_STATUS_OUT_FOR_DELIVERY,
      ApiSequence.ON_STATUS_DELIVERED,
      ApiSequence.UPDATE,
      // ApiSequence.ON_UPDATE_INTERIM_REVERSE_QC,
      // ApiSequence.ON_UPDATE_APPROVAL,
      // ApiSequence.ON_UPDATE_REPLACEMENT,
      // ApiSequence.REPLACEMENT_ON_STATUS_PENDING,
      // ApiSequence.REPLACEMENT_ON_STATUS_PACKED,
      // ApiSequence.REPLACEMENT_ON_STATUS_PICKED,
      // ApiSequence.REPLACEMENT_ON_STATUS_OUT_FOR_DELIVERY,
      // ApiSequence.REPLACEMENT_ON_STATUS_DELIVERED,
    ]
    const flow019Sequence = [
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
      ApiSequence.ON_STATUS_AGENT_ASSIGNED,
      ApiSequence.ON_STATUS_AT_PICKUP,
      ApiSequence.ON_STATUS_PICKED,
      ApiSequence.TRACK,
      ApiSequence.ON_TRACK,
      ApiSequence.ON_STATUS_AT_DELIVERY,
      ApiSequence.ON_STATUS_DELIVERED,
    ]
    const flow015Sequence = [
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
      ApiSequence.ON_STATUS_AGENT_ASSIGNED,
      ApiSequence.ON_STATUS_PICKED,
      ApiSequence.ON_STATUS_OUT_FOR_DELIVERY,
      ApiSequence.ON_STATUS_DELIVERED,
      ApiSequence.UPDATE_LIQUIDATED,
      ApiSequence.ON_UPDATE_INTERIM_LIQUIDATED,
      ApiSequence.ON_UPDATE_LIQUIDATED,
      ApiSequence.UPDATE_SETTLEMENT_LIQUIDATED,
    ]
    const flow005Sequence = [
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
      ApiSequence.ON_STATUS_AGENT_ASSIGNED,
      ApiSequence.ON_STATUS_AT_PICKUP,
      ApiSequence.ON_STATUS_PICKED,
      // ApiSequence.ON_STATUS_AT_DELIVERY,
      ApiSequence.CANCEL,
      ApiSequence.FORCE_CANCEL,
      ApiSequence.ON_CANCEL,
    ]

    const flow002Sequence = [
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
      ApiSequence.ON_STATUS_AGENT_ASSIGNED,
      ApiSequence.ON_STATUS_PICKED
    ]


    const flow010Sequence = [
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
      ApiSequence.ON_STATUS_AGENT_ASSIGNED,
      ApiSequence.ON_STATUS_PICKED,
      ApiSequence.ON_STATUS_OUT_FOR_DELIVERY,
      ApiSequence.ON_UPDATE_DELIVERY_AUTH,
      ApiSequence.ON_STATUS_DELIVERED
    ]
    const flow00ASequence = [
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
      ApiSequence.ON_STATUS_AGENT_ASSIGNED,
      ApiSequence.ON_STATUS_PICKED,
      ApiSequence.ON_STATUS_OUT_FOR_DELIVERY,
      ApiSequence.ON_STATUS_DELIVERED
    ]

    const flow001Sequence = [
      ApiSequence.SEARCH,
      ApiSequence.ON_SEARCH,
      ApiSequence.SELECT,
      ApiSequence.ON_SELECT,
      ApiSequence.INIT,
      ApiSequence.ON_INIT,
      ApiSequence.CONFIRM,
      ApiSequence.ON_CONFIRM,

    ]
    const flow025Sequence = [
      ApiSequence.SEARCH,
      ApiSequence.ON_SEARCH,
      ApiSequence.SELECT,
      ApiSequence.ON_SELECT,

    ]
    const flow022Sequence = [
      ApiSequence.SEARCH,
      ApiSequence.ON_SEARCH,


    ]
    const flow004Sequence = [
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
      ApiSequence.ON_STATUS_AGENT_ASSIGNED,
      ApiSequence.ON_STATUS_PICKED,
      ApiSequence.ON_STATUS_OUT_FOR_DELIVERY,
      ApiSequence.ON_STATUS_DELIVERED,


    ]
    const flow01DSequence = [
      ApiSequence.SEARCH,
      ApiSequence.ON_SEARCH,
      ApiSequence.SELECT,
      ApiSequence.ON_SELECT,
      ApiSequence.INIT,
      ApiSequence.ON_INIT,
      ApiSequence.CONFIRM,
      ApiSequence.ON_CONFIRM,
      ApiSequence.ON_STATUS_PENDING
    ]
    // const flow
    const processApiSequence = (apiSequence: any, data: any, logReport: any, msgIdSet: any, flow: string) => {
      if (validFlows.includes(flow)) {
        // Try to extract routing type from on_confirm if it hasn't been set yet
        let routingType = getValue('routingType')
        
        if (!routingType && data.on_confirm) {
          try {
            const onConfirmData = data.on_confirm
            if (onConfirmData.message?.order?.fulfillments) {
              const tempRoutingType = extractRoutingType(onConfirmData.message.order.fulfillments)
              if (tempRoutingType) {
                setValue('routingType', tempRoutingType)
                routingType = tempRoutingType
                logger.info(`Pre-extracted routing type: ${routingType} from on_confirm`)
              }
            }
          } catch (error) {
            logger.error(`Error pre-extracting routing type: ${error}`)
          }
        }
        
        // Map API sequence to state names (reused across the function)
        const stateMapping: Record<string, string> = {
          [ApiSequence.ON_STATUS_PENDING]: 'Pending',
          [ApiSequence.ON_STATUS_PACKED]: 'Packed',
          [ApiSequence.ON_STATUS_AGENT_ASSIGNED]: 'Agent-assigned',
          [ApiSequence.ON_STATUS_AT_PICKUP]: 'At-pickup',
          [ApiSequence.ON_STATUS_OUT_FOR_PICKUP]: 'Out-for-pickup',
          [ApiSequence.ON_STATUS_PICKUP_FAILED]: 'Pickup-failed',
          [ApiSequence.ON_STATUS_PICKED]: 'Order-picked-up',
          [ApiSequence.ON_STATUS_AT_DELIVERY]: 'At-delivery',
          [ApiSequence.ON_STATUS_IN_TRANSIT]: 'In-transit',
          [ApiSequence.ON_STATUS_AT_DESTINATION_HUB]: 'At-destination-hub',
          [ApiSequence.ON_STATUS_OUT_FOR_DELIVERY]: 'Out-for-delivery',
          [ApiSequence.ON_STATUS_DELIVERY_FAILED]: 'Delivery-failed',
          [ApiSequence.ON_STATUS_DELIVERED]: 'Order-delivered',
          [ApiSequence.ON_STATUS_RTO_DELIVERED]: 'Cancelled'
        }
        
        // Filter API sequence based on routing type
        const filteredApiSequence = apiSequence.filter((apiSeq: any) => {
          // Always include non-status APIs
          if (!apiSeq.includes('on_status_')) {
            return true
          }
          
          const state = stateMapping[apiSeq]
          if (!state || !routingType) {
            return true // If we can't map the state or no routing type, include it
          }
          
          // Check if state is allowed for the routing type with null safety
          try {
            if (routingType === 'P2P') {
              if (P2P_STATES && P2P_STATES.FORBIDDEN && Array.isArray(P2P_STATES.FORBIDDEN)) {
                return !P2P_STATES.FORBIDDEN.includes(state)
              }
            } else if (routingType === 'P2H2P') {
              if (P2H2P_STATES && P2H2P_STATES.FORBIDDEN && Array.isArray(P2H2P_STATES.FORBIDDEN)) {
                return !P2H2P_STATES.FORBIDDEN.includes(state)
              }
            }
          } catch (error) {
            logger.error(`Error checking forbidden states for routing ${routingType}: ${error}`)
          }
          
          return true
        })
        
        filteredApiSequence.forEach((apiSeq: any) => {
          if (data[apiSeq]) {
            // Check if this state is forbidden for the current routing type
            const state = stateMapping[apiSeq]
            let isForbidden = false
            
            // Debug logging
            if (apiSeq.includes('on_status_')) {
              logger.info(`Processing ${apiSeq}, mapped state: ${state}, routing: ${routingType}`)
            }
            
            if (state && routingType && apiSeq.includes('on_status_')) {
              try {
                if (routingType === 'P2P' && P2P_STATES && P2P_STATES.FORBIDDEN && Array.isArray(P2P_STATES.FORBIDDEN)) {
                  isForbidden = P2P_STATES.FORBIDDEN.includes(state)
                  if (isForbidden) {
                    logger.info(`Skipping forbidden state ${state} (${apiSeq}) for P2P routing`)
                  }
                } else if (routingType === 'P2H2P' && P2H2P_STATES && P2H2P_STATES.FORBIDDEN && Array.isArray(P2H2P_STATES.FORBIDDEN)) {
                  isForbidden = P2H2P_STATES.FORBIDDEN.includes(state)
                  if (isForbidden) {
                    logger.info(`Skipping forbidden state ${state} (${apiSeq}) for P2H2P routing`)
                  }
                }
              } catch (error) {
                logger.error(`Error checking forbidden states: ${error}`)
              }
            }
            
            // Skip validation for forbidden states even if they exist in the data
            if (!isForbidden) {
              const resp = getResponse(apiSeq, data[apiSeq], msgIdSet, flow)
              if (!_.isEmpty(resp)) {
                logReport = { ...logReport, [apiSeq]: resp }
              }
            }
          } else {
            // Check if this is a required state for the routing type
            const state = stateMapping[apiSeq]
            if (state && routingType) {
              let isRequired = false
              let isForbidden = false
              
              try {
                if (routingType === 'P2P' && P2P_STATES) {
                  if (P2P_STATES.REQUIRED && Array.isArray(P2P_STATES.REQUIRED)) {
                    isRequired = P2P_STATES.REQUIRED.includes(state)
                  }
                  if (P2P_STATES.FORBIDDEN && Array.isArray(P2P_STATES.FORBIDDEN)) {
                    isForbidden = P2P_STATES.FORBIDDEN.includes(state)
                  }
                } else if (routingType === 'P2H2P' && P2H2P_STATES) {
                  if (P2H2P_STATES.REQUIRED && Array.isArray(P2H2P_STATES.REQUIRED)) {
                    isRequired = P2H2P_STATES.REQUIRED.includes(state)
                  }
                  if (P2H2P_STATES.FORBIDDEN && Array.isArray(P2H2P_STATES.FORBIDDEN)) {
                    isForbidden = P2H2P_STATES.FORBIDDEN.includes(state)
                  }
                }
              } catch (error) {
                logger.error(`Error checking states for routing ${routingType}: ${error}`)
              }
              
              // Only report missing if it's required, not if it's forbidden or optional
              if (isRequired) {
                logReport = { ...logReport, [apiSeq]: `Missing required data of : ${apiSeq} (Required for ${routingType} routing)` }
              } else if (!isForbidden && !apiSeq.includes('on_status_')) {
                // Only report missing for non-status APIs that are not forbidden
                logReport = { ...logReport, [apiSeq]: `Missing required data of : ${apiSeq}` }
              }
              // Don't report anything for forbidden states - they shouldn't be present
            } else if (!apiSeq.includes('on_status_')) {
              // Always report missing for non-status APIs when no routing type is available
              logReport = { ...logReport, [apiSeq]: `Missing required data of : ${apiSeq}` }
            }
          }
        })
        logger.info(logReport, 'Report Generated Successfully!!')
        return logReport
      } else {
        return { invldFlow: 'Provided flow is invalid' }
      }
    }
    const getResponse = (apiSeq: any, data: any, msgIdSet: any, flow: string) => {
      switch (apiSeq) {
        case ApiSequence.SEARCH:
          return checkSearch(data, msgIdSet, flow)
        case ApiSequence.ON_SEARCH:
          if (domain === 'ONDC:RET11') {
            return checkOnsearchFullCatalogRefresh(data, flow)
          } else {
            return checkOnsearch(data,flow)
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
          return checkOnSelect(data, flow)
        case ApiSequence.SELECT_OUT_OF_STOCK:
          return checkSelect(data, msgIdSet, ApiSequence.SELECT_OUT_OF_STOCK)
        case ApiSequence.ON_SELECT_OUT_OF_STOCK:
          return checkOnSelect_OOS(data)
        case ApiSequence.INIT:
          return checkInit(data, msgIdSet, flow)
        case ApiSequence.ON_INIT:
          return checkOnInit(data, flow)
        case ApiSequence.CONFIRM:
          return checkConfirm(data, msgIdSet, flow)
        case ApiSequence.ON_CONFIRM:
          return checkOnConfirm(data, flow)
        case ApiSequence.CANCEL:
          return checkCancel(data, msgIdSet,'cancel',flow)
        case ApiSequence.CANCEL:
          return checkCancel(data, msgIdSet,'force_cancel',flow)
        case ApiSequence.ON_CANCEL:
          return checkOnCancel(data, msgIdSet)
        case ApiSequence.ON_STATUS_RTO_DELIVERED:
          return checkOnStatusRTODelivered(data)
        case ApiSequence.STATUS:
          return checkStatus(data)
        case ApiSequence.ON_STATUS_PENDING:
          return checkOnStatusPending(data, 'pending', msgIdSet, fulfillmentsItemsSet)
        case ApiSequence.REPLACEMENT_ON_STATUS_PENDING:
          return checkOnStatusPending(data, 'replacement_on_status_pending', msgIdSet, fulfillmentsItemsSet)
        case ApiSequence.ON_STATUS_PACKED:
          return checkOnStatusPacked(data, 'packed', msgIdSet, fulfillmentsItemsSet)
        case ApiSequence.REPLACEMENT_ON_STATUS_PACKED:
          return checkOnStatusPacked(data, 'replacement_on_status_packed', msgIdSet, fulfillmentsItemsSet)
        case ApiSequence.ON_STATUS_AT_PICKUP:
          return checkOnStatusAtPickup(data, 'At-pickup', msgIdSet, fulfillmentsItemsSet, flow)
        case ApiSequence.ON_STATUS_PICKED:
          return checkOnStatusPicked(data, 'picked', msgIdSet, fulfillmentsItemsSet)
        case ApiSequence.REPLACEMENT_ON_STATUS_PICKED:
          return checkOnStatusPicked(data, 'replacement_on_status_picked', msgIdSet, fulfillmentsItemsSet)
        case ApiSequence.ON_STATUS_OUT_FOR_DELIVERY:
          return checkOnStatusOutForDelivery(data, 'out-for-delivery', msgIdSet, fulfillmentsItemsSet)
        case ApiSequence.ON_STATUS_AT_DELIVERY:
          return checkOnStatusAtDelivery(data, 'At-delivery', msgIdSet, fulfillmentsItemsSet, flow)
        case ApiSequence.REPLACEMENT_ON_STATUS_OUT_FOR_DELIVERY:
          return checkOnStatusOutForDelivery(data, 'replacement_on_status_out_for_delivery', msgIdSet, fulfillmentsItemsSet)
        case ApiSequence.ON_STATUS_DELIVERED:
          return checkOnStatusDelivered(data, 'delivered', msgIdSet, fulfillmentsItemsSet)
        case ApiSequence.REPLACEMENT_ON_STATUS_DELIVERED:
          return checkOnStatusDelivered(data, 'replacement_on_status_delivered', msgIdSet, fulfillmentsItemsSet)
        case ApiSequence.ON_STATUS_AGENT_ASSIGNED:
          return checkOnStatusAgentAssigned(data, 'agent-assigned', msgIdSet, fulfillmentsItemsSet, flow)
        case ApiSequence.ON_STATUS_OUT_FOR_PICKUP:
          return checkOnStatusOutForPickup(data, 'out-for-pickup', msgIdSet, fulfillmentsItemsSet, flow)
        case ApiSequence.ON_STATUS_PICKUP_FAILED:
          return checkOnStatusPickupFailed(data, 'pickup-failed', msgIdSet, fulfillmentsItemsSet, flow)
        case ApiSequence.ON_STATUS_IN_TRANSIT:
          return checkOnStatusInTransit(data, 'in-transit', msgIdSet, fulfillmentsItemsSet, flow)
        case ApiSequence.ON_STATUS_AT_DESTINATION_HUB:
          return checkOnStatusAtDestinationHub(data, 'at-destination-hub', msgIdSet, fulfillmentsItemsSet, flow)
        case ApiSequence.ON_STATUS_DELIVERY_FAILED:
          return checkOnStatusDeliveryFailed(data, 'delivery-failed', msgIdSet, fulfillmentsItemsSet)
        case ApiSequence.UPDATE:
          return checkUpdate(data, msgIdSet, ApiSequence.UPDATE, settlementDetatilSet, flow)
        case ApiSequence.UPDATE_ADDRESS:
          return checkUpdate(data, msgIdSet, ApiSequence.UPDATE_ADDRESS, settlementDetatilSet, flow)
        case ApiSequence.UPDATE_INSTRUCTIONS:
          return checkUpdate(data, msgIdSet, ApiSequence.UPDATE_INSTRUCTIONS, settlementDetatilSet, flow)
        case ApiSequence.ON_UPDATE_PART_CANCEL:
          return checkOnUpdate(
            data,
            msgIdSet,
            ApiSequence.ON_UPDATE_PART_CANCEL,
            settlementDetatilSet,
            quoteTrailItemsSet,
            fulfillmentsItemsSet,
            '6-a',
          )
        case ApiSequence.ON_UPDATE_DELIVERY_AUTH:
          return checkOnUpdate(
            data,
            msgIdSet,
            ApiSequence.ON_UPDATE_PART_CANCEL,
            settlementDetatilSet,
            quoteTrailItemsSet,
            fulfillmentsItemsSet,
            '010',
          )
        case ApiSequence.UPDATE_SETTLEMENT_PART_CANCEL:
          return checkUpdate(data, msgIdSet, ApiSequence.UPDATE_SETTLEMENT_PART_CANCEL, settlementDetatilSet, '6-a')
        case ApiSequence.UPDATE_REVERSE_QC:
          return checkUpdate(data, msgIdSet, ApiSequence.UPDATE_REVERSE_QC, settlementDetatilSet, '6-b')
        case ApiSequence.UPDATE_REPLACEMENT:
          return checkUpdate(data, msgIdSet, ApiSequence.UPDATE_REPLACEMENT, settlementDetatilSet, '00B')
        case ApiSequence.ON_UPDATE_INTERIM_REVERSE_QC:
          return checkOnUpdate(
            data,
            msgIdSet,
            ApiSequence.ON_UPDATE_INTERIM_REVERSE_QC,
            settlementDetatilSet,
            quoteTrailItemsSet,
            fulfillmentsItemsSet,
            '6-b',
          )
        case ApiSequence.ON_UPDATE_ADDRESS:
          return checkOnUpdate(
            data,
            msgIdSet,
            ApiSequence.ON_UPDATE_ADDRESS,
            settlementDetatilSet,
            quoteTrailItemsSet,
            fulfillmentsItemsSet,
            flow,
          )
        case ApiSequence.ON_UPDATE_INSTRUCTIONS:
          return checkOnUpdate(
            data,
            msgIdSet,
            ApiSequence.ON_UPDATE_INSTRUCTIONS,
            settlementDetatilSet,
            quoteTrailItemsSet,
            fulfillmentsItemsSet,
            flow,
          )
        case ApiSequence.ON_UPDATE_ADDRESS:
          return checkOnUpdate(
            data,
            msgIdSet,
            ApiSequence.ON_UPDATE_ADDRESS,
            settlementDetatilSet,
            quoteTrailItemsSet,
            fulfillmentsItemsSet,
            flow,
          )
        case ApiSequence.ON_UPDATE_INSTRUCTIONS:
          return checkOnUpdate(
            data,
            msgIdSet,
            ApiSequence.ON_UPDATE_INSTRUCTIONS,
            settlementDetatilSet,
            quoteTrailItemsSet,
            fulfillmentsItemsSet,
            flow,
          )
        case ApiSequence.ON_UPDATE_APPROVAL:
          return checkOnUpdate(
            data,
            msgIdSet,
            ApiSequence.ON_UPDATE_APPROVAL,
            settlementDetatilSet,
            quoteTrailItemsSet,
            fulfillmentsItemsSet,
            '6-b',
          )
        case ApiSequence.ON_UPDATE_REPLACEMENT:
          return checkOnUpdate(
            data,
            msgIdSet,
            ApiSequence.ON_UPDATE_REPLACEMENT,
            settlementDetatilSet,
            quoteTrailItemsSet,
            fulfillmentsItemsSet,
            '00B',
          )
        case ApiSequence.ON_UPDATE_PICKED:
          return checkOnUpdate(
            data,
            msgIdSet,
            ApiSequence.ON_UPDATE_PICKED,
            settlementDetatilSet,
            quoteTrailItemsSet,
            fulfillmentsItemsSet,
            '6-b',
          )
        case ApiSequence.UPDATE_SETTLEMENT_REVERSE_QC:
          return checkUpdate(data, msgIdSet, ApiSequence.UPDATE_SETTLEMENT_REVERSE_QC, settlementDetatilSet, '6-b')
        case ApiSequence.ON_UPDATE_DELIVERED:
          return checkOnUpdate(
            data,
            msgIdSet,
            ApiSequence.ON_UPDATE_DELIVERED,
            settlementDetatilSet,
            quoteTrailItemsSet,
            fulfillmentsItemsSet,
            '6-b',
          )
        case ApiSequence.ON_UPDATE:
          return checkOnUpdate(
            data,
            msgIdSet,
            ApiSequence.ON_UPDATE,
            settlementDetatilSet,
            quoteTrailItemsSet,
            fulfillmentsItemsSet,
            flow,
          )
        case ApiSequence.UPDATE_LIQUIDATED:
          return checkUpdate(data, msgIdSet, ApiSequence.UPDATE_LIQUIDATED, settlementDetatilSet, '6-c')
        case ApiSequence.ON_UPDATE_INTERIM_LIQUIDATED:
          return checkOnUpdate(
            data,
            msgIdSet,
            ApiSequence.ON_UPDATE_INTERIM_LIQUIDATED,
            settlementDetatilSet,
            quoteTrailItemsSet,
            fulfillmentsItemsSet,
            '6-c',
          )
        case ApiSequence.ON_UPDATE_LIQUIDATED:
          return checkOnUpdate(
            data,
            msgIdSet,
            ApiSequence.ON_UPDATE_LIQUIDATED,
            settlementDetatilSet,
            quoteTrailItemsSet,
            fulfillmentsItemsSet,
            '6-c',
          )
        case ApiSequence.UPDATE_SETTLEMENT_LIQUIDATED:
          return checkUpdate(data, msgIdSet, ApiSequence.UPDATE_SETTLEMENT_LIQUIDATED, settlementDetatilSet, '6-c')
        case ApiSequence.TRACK:
          return checkTrack(data)
        case ApiSequence.ON_TRACK:
          return checkOnTrack(data)
        case ApiSequence.CATALOG_REJECTION:
          return checkCatalogRejection(data)
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
      case FLOW.FLOW012:
        logReport = processApiSequence(flow012Sequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW3:
        logReport = processApiSequence(flowThreeSequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW4:
        logReport = processApiSequence(flowFourSequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW5:
        logReport = processApiSequence(flowFiveSequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW6:
        logReport = processApiSequence(flowSixSequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW7:
        logReport = processApiSequence(flowSevenSequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW8:
        logReport = processApiSequence(flowEightSequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW9:
        logReport = processApiSequence(flowNineSequence, data, logReport, msgIdSet, flow)
        break
      case OFFERSFLOW.FLOW0091:
        logReport = processApiSequence(flowOfferTypeDiscountSequence, data, logReport, msgIdSet, flow)
        break
      case OFFERSFLOW.FLOW0092:
        logReport = processApiSequence(flowOfferTypebuyXgetYSequence, data, logReport, msgIdSet, flow)
        break
      case OFFERSFLOW.FLOW0093:
        logReport = processApiSequence(flowOfferTypeFreebieSequence, data, logReport, msgIdSet, flow)
        break
      case OFFERSFLOW.FLOW0094:
        logReport = processApiSequence(flowOfferTypeSlabSequence, data, logReport, msgIdSet, flow)
        break
      case OFFERSFLOW.FLOW0095:
        logReport = processApiSequence(flowOfferTypeComboSequence, data, logReport, msgIdSet, flow)
        break
      case OFFERSFLOW.FLOW0096:
        logReport = processApiSequence(flowOfferTypeDeliverySequence, data, logReport, msgIdSet, flow)
        break
      case OFFERSFLOW.FLOW0097:
        logReport = processApiSequence(flowOfferTypeExchangeSequence, data, logReport, msgIdSet, flow)
        break
      case OFFERSFLOW.FLOW0098:
        logReport = processApiSequence(flowOfferTypeFinancingSequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW020:
        logReport = processApiSequence(flow020Sequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW00B:
        logReport = processApiSequence(flowReplacementSequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW01C:
        logReport = processApiSequence(flow01CSequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW008:
        logReport = processApiSequence(flow008Sequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW003:
        logReport = processApiSequence(flow003Sequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW00F:
        logReport = processApiSequence(flow00FSequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW011:
        logReport = processApiSequence(flow011Sequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW017:
        logReport = processApiSequence(flow017Sequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW00D:
        logReport = processApiSequence(flow00DSequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW00E:
        logReport = processApiSequence(flow00ESequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW012:
        logReport = processApiSequence(flow012Sequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW016:
        logReport = processApiSequence(flow016Sequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW01F:
        logReport = processApiSequence(flow01FSequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW01E:
        logReport = processApiSequence(flow01ESequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW001:
        logReport = processApiSequence(flow001Sequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW022:
        logReport = processApiSequence(flow022Sequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW025:
        logReport = processApiSequence(flow025Sequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW004:
        logReport = processApiSequence(flow004Sequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW01D:
        logReport = processApiSequence(flow01DSequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW00C:
        logReport = processApiSequence(flow00CSequence, data, logReport, msgIdSet, '00C')
        break
      case FLOW.FLOW019:
        logReport = processApiSequence(flow019Sequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW015:
        logReport = processApiSequence(flow015Sequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW005:
        logReport = processApiSequence(flow005Sequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW002:
        logReport = processApiSequence(flow002Sequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW010:
        logReport = processApiSequence(flow010Sequence, data, logReport, msgIdSet, flow)
        break
      case FLOW.FLOW00A:
        logReport = processApiSequence(flow00ASequence, data, logReport, msgIdSet, flow)
        break
    }
  } catch (error: any) {
    logger.error(error.message)
    return error.message
  }

  return logReport
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
