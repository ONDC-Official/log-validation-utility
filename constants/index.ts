export default Object.freeze({
  RET_CONTEXT_TTL: 'PT30S',
  CONTEXT_ACTION: 'action',
  DB_PATH: 'dbfiles',
  DECIMAL_PRECISION: 6,
  ORDER_PICKED: 'Order-picked-up',
  ORDER_PACKED: 'Packed',
  ORDER_OUT_FOR_DELIVERY: 'Out-for-delivery',
  ORDER_DELIVERED: 'Order-delivered',
  SEARCH: 'search',
  INC_SEARCH: 'inc_search',
  ON_SEARCH: 'on_search',
  ON_SEARCHINC: 'on_search_inc',
  CATALOG_REJECTION: 'catalog_rejection',
  SELECT: 'select',
  ON_SELECT: 'on_select',
  SELECT_OUT_OF_STOCK: 'select_out_of_stock',
  ON_SELECT_OUT_OF_STOCK: 'on_select_out_of_stock',
  CONFIRM: 'confirm',
  ON_CONFIRM: 'on_confirm',
  INIT: 'init',
  ON_INIT: 'on_init',
  STATUS: 'status',
  UPDATE: 'update',
  ON_UPDATE: 'on_update',
  ON_UPDATE_INTERIM: 'on_update_interim',
  ON_STATUS: 'on_status',
  ON_STATUS_PENDING: 'on_status_pending',
  ON_STATUS_PACKED: 'on_status_packed',
  ON_STATUS_PICKED: 'on_status_picked',
  ON_STATUS_OUT_FOR_DELIVERY: 'on_status_out_for_delivery',
  ON_STATUS_DELIVERED: 'on_status_delivered',
  ON_STATUS_RTO_DELIVERED: 'on_status_rto_delivered/disposed',
  CANCEL: 'cancel',
  ON_CANCEL: 'on_cancel',
  ON_CANCEL_RTO: 'on_cancel_rto',
  TRACK: 'track',
  ON_TRACK: 'on_track',
  SUPPORT: 'support',
  ON_SUPPORT: 'on_support',
  RET_ISSUE: 'issue',
  RET_ONISSUE: 'on_issue',
  RET_ISSUE_STATUS: 'issue_status',
  RET_ONISSUE_STATUS: 'on_issue_status',
  RECEIVER_RECON: 'receiver_recon',
  ON_RECEIVER_RECON: 'on_receiver_recon',
})

export const ApiSequence = {
  SEARCH: 'search_full_catalog_refresh',
  ON_SEARCH: 'on_search_full_catalog_refresh',
  INC_SEARCH: 'search_inc_refresh',
  INC_ONSEARCH: 'on_search_inc_refresh',
  CATALOG_REJECTION: 'catalog_rejection',
  SELECT: 'select',
  ON_SELECT: 'on_select',
  INIT: 'init',
  ON_INIT: 'on_init',
  CONFIRM: 'confirm',
  ON_CONFIRM: 'on_confirm',
  CANCEL: 'cancel',
  ON_CANCEL: 'on_cancel',
  TRACK: 'track',
  ON_TRACK: 'on_track',
  STATUS: 'status',
  ON_STATUS_PENDING: 'on_status_pending',
  ON_STATUS_PACKED: 'on_status_packed',
  ON_STATUS_PICKED: 'on_status_picked',
  ON_STATUS_OUT_FOR_DELIVERY: 'on_status_out_for_delivery',
  ON_STATUS_DELIVERED: 'on_status_delivered',
  ON_STATUS_RTO_DELIVERED: 'on_status_rto_delivered/disposed',
  ON_UPDATE_PART_CANCEL: 'on_update_part_cancel',
  UPDATE: 'update',
  UPDATE_REVERSE_QC: 'update_reverse_qc',
  UPDATE_LIQUIDATED: 'update_liquidated',
  UPDATE_SETTLEMENT: 'update_settlement',
  UPDATE_SETTLEMENT_PART_CANCEL: 'update_settlement_part_cancel',
  UPDATE_SETTLEMENT_REVERSE_QC: 'update_settlement_reverse_qc',
  UPDATE_SETTLEMENT_LIQUIDATED: 'update_settlement_liquidated',
  ON_UPDATE: 'on_update',
  ON_UPDATE_INTERIM: 'on_update_interim',
  ON_UPDATE_INTERIM_REVERSE_QC: 'on_update_interim_reverse_qc',
  ON_UPDATE_INTERIM_LIQUIDATED: 'on_update_interim_liquidated',
  ON_UPDATE_PICKED: 'on_update_picked',
  ON_UPDATE_DELIVERED: 'on_update_delivered',
  ON_UPDATE_APPROVAL: 'on_update_approval',
  ON_UPDATE_LIQUIDATED: 'on_update_liquidated',
  SELECT_OUT_OF_STOCK: 'select_out_of_stock',
  ON_SELECT_OUT_OF_STOCK: 'on_select_out_of_stock',
}

export const FisApiSequence = {
  SEARCH: 'search',
  ON_SEARCH: 'on_search',
  SEARCH_2: 'search_2',
  ON_SEARCH_2: 'on_search_2',
  SEARCH_3: 'search_3',
  ON_SEARCH_3: 'on_search_3',
  SELECT_1: 'select_1',
  SELECT_2: 'select_2',
  SELECT_3: 'select_3',
  ON_SELECT_1: 'on_select_1',
  ON_SELECT_2: 'on_select_2',
  ON_SELECT_3: 'on_select_3',
  INIT_1: 'init_1',
  INIT_2: 'init_2',
  INIT_3: 'init_3',
  INIT_4: 'init_4',
  ON_INIT_1: 'on_init_1',
  ON_INIT_2: 'on_init_2',
  ON_INIT_3: 'on_init_3',
  ON_INIT_4: 'on_init_4',
  CONFIRM: 'confirm',
  ON_CONFIRM: 'on_confirm',
  CANCEL: 'cancel',
  ON_CANCEL: 'on_cancel',
  STATUS: 'status',
  ON_STATUS: 'on_status',
  ON_STATUS_KYC: 'on_status_kyc',
  ON_STATUS_EMANDATE: 'on_status_emandate',
  ON_STATUS_LOAN: 'on_status_loan',
  UPDATE: 'update',
  ON_UPDATE: 'on_update',
  ON_UPDATE_UNSOLICATED: 'on_update_unsolicated',
}

export const Fis10ApiSequence = {
  SEARCH: 'search',
  ON_SEARCH: 'on_search',
  SELECT: 'select',
  ON_SELECT: 'on_select',
  INIT: 'init',
  ON_INIT: 'on_init',
  CONFIRM: 'confirm',
  ON_CONFIRM: 'on_confirm',
  ON_CANCEL: 'on_cancel',
  STATUS: 'status',
  ON_STATUS: 'on_status',
  ON_UPDATE: 'on_update',
}

export const FIS13HealthSequence = {
  SEARCH: 'search',
  ON_SEARCH: 'on_search',
  SEARCH_OFFER: 'search_offer',
  ON_SEARCH_OFFER: 'on_search_offer',
  SELECT: 'select',
  ON_SELECT: 'on_select',
  INIT_1: 'init_1',
  INIT_2: 'init_2',
  INIT_3: 'init_3',
  ON_INIT_1: 'on_init_1',
  ON_INIT_2: 'on_init_2',
  ON_INIT_3: 'on_init_3',
  CONFIRM: 'confirm',
  ON_CONFIRM: 'on_confirm',
  CANCEL: 'cancel',
  ON_CANCEL: 'on_cancel',
  STATUS_2: 'status_2',
  STATUS: 'status',
  ON_STATUS: 'on_status',
  ON_SATUS_2: 'on_status_2',
  UPDATE: 'update',
  ON_UPDATE: 'on_update',
  ON_UPDATE_UNCOLICATED: 'on_update_uncolicated',
}

export const FIS14ApiSequence = {
  SEARCH: 'search',
  ON_SEARCH: 'on_search',
  SELECT: 'select',
  ON_SELECT: 'on_select',
  SELECT_1: 'select_1',
  ON_SELECT_1: 'on_select_1',
  SELECT_2: 'select_2',
  ON_SELECT_2: 'on_select_2',
  SELECT_3: 'select_3',
  ON_SELECT_3: 'on_select_3',
  INIT: 'init',
  ON_INIT: 'on_init',
  CONFIRM: 'confirm',
  ON_CONFIRM: 'on_confirm',
  ON_STATUS: 'on_status',
  UPDATE: 'update',
  ON_UPDATE: 'on_update',
  ON_UPDATE_1: 'on_update_1',
}

export const mobilitySequence = {
  SEARCH: 'search',
  ON_SEARCH: 'on_search',
  SELECT: 'select',
  ON_SELECT: 'on_select',
  INIT: 'init',
  ON_INIT: 'on_init',
  CONFIRM: 'confirm',
  ON_CONFIRM: 'on_confirm',
  CANCEL: 'cancel',
  SOFT_CANCEL: 'soft_cancel',
  ON_CANCEL: 'on_cancel',
  SOFT_ON_CANCEL: 'soft_on_cancel',
  UPDATE: 'update',
  ON_UPDATE: 'on_update',
  STATUS: 'status',
  ON_STATUS: 'on_status',
}

export const metroSequence = {
  SEARCH: 'search',
  ON_SEARCH: 'on_search',
  SELECT: 'select',
  ON_SELECT: 'on_select',
  INIT: 'init',
  ON_INIT: 'on_init',
  CONFIRM: 'confirm',
  ON_CONFIRM: 'on_confirm',
  CANCEL: 'cancel',
  SOFT_CANCEL: 'soft_cancel',
  ON_CANCEL: 'on_cancel',
  SOFT_ON_CANCEL: 'soft_on_cancel',
  UPDATE: 'update',
  ON_UPDATE: 'on_update',
  STATUS: 'status',
  ON_STATUS: 'on_status',
}

export const mobilityFlow: any = {
  AIRLINES: 'airlines',
  METRO: 'metro',
  ONDEMAND: 'on-demand',
  INTERCITY: 'intercity',
  INTRACITY: 'intracity',
}

export const formHeadingsFis: any = {
  INVOICE_BASED_LOAN: {
    on_search: ['Organization Information'],
    on_select: ['Set Loan Amount', 'Know your Customer'],
    on_init: 'Account details based loan form',
  },
  PERSONAL_LOAN: {
    on_search: ['Personal Information'],
    on_select: ['Set Loan Amount', 'Know your Customer'],
    on_init: ['Account Information', 'E-mandate', 'Loan Agreement'],
  },
}

export const insuranceFormHeadings: any = {
  HEALTH_INSURANCE: {
    on_search: ['Individual Information'],
    on_search_offer: ['PED, PAN & DOB Details'],
    on_select: ['EKYC'],
    on_init: ['Buyer Details', 'Manual Review', 'Nominee Details'],
  },
  MARINE_INSURANCE: {
    on_search: ['Individual Information'],
    on_select: ['EKYC'],
    on_init: ['Buyer Details', 'Manual Review', 'Nominee Details'],
  },
}

export const fisFlows = {
  INVOICE: 'INVOICE_BASED_LOAN',
  PERSONAL: 'PERSONAL_LOAN',
  PRE_INVOICE: 'PERSONAL_LOAN',
  PRE_PERSONAL: 'INVOICE_BASED_LOAN',
  LOAN_FORECLOSURE: 'FORECLOSURE',
  PRE_PART_PAYMENT: 'PRE_PART_PAYMENT',
  MISSED_EMI_PAYMENT: 'MISSED_EMI_PAYMENT',
}

export const insuranceFlows = {
  HEALTH: 'HEALTH_INSURANCE',
  MARINE: 'MARINE_INSURANCE',
  CLAIM_HEALTH: 'CLAIM_HEALTH_INSURANCE',
  RENEW_HEALTH: 'RENEW_HEALTH_INSURANCE',
}

export const fis14Flows = {
  SEARCH_FULL_PULL: 'SEARCH_FULL_PULL',
  SEARCH_INCREMENT: 'SEARCH_INCREMENT',
  SIP_NEW_FOLIO_WITH_KYC: 'SIP_NEW_FOLIO_WITH_KYC',
  SIP_INSTALLEMENT_SUCCESS: 'SIP_INSTALLEMENT_SUCCESS',
  SIP_INSTALLEMENT_FAILURE: 'SIP_INSTALLEMENT_FAILURE',
  LUMPSUM_EXISTING_FOLIO: 'LUMPSUM_EXISTING_FOLIO',
  LUMPSUM_PAYMENT_RETRY: 'LUMPSUM_PAYMENT_RETRY',
  REDEMPTION: 'REDEMPTION',
}

export const fis14FlowSequence = {
  SEARCH_FULL_PULL: ['SEARCH', 'ON_SEARCH'],
  SEACH_INCREMENT: ['SEARCH', 'ON_SEARCH'],
  SIP_NEW_FOLIO_WITH_KYC: [
    'SELECT',
    'ON_SELECT',
    'SELECT_1',
    'ON_SELECT_1',
    'SELECT_2',
    'ON_SELECT_2',
    'SELECT_3',
    'ON_SELECT_3',
    'INIT',
    'ON_INIT',
    'CONFIRM',
    'ON_CONFIRM',
    'ON_STATUS',
  ],
  SIP_INSTALLEMENT_SUCCESS: ['ON_UPDATE', 'ON_CONFIRM', 'ON_STATUS', 'ON_UPDATE_1'],
  SIP_INSTALLEMENT_FAILURE: ['ON_UPDATE', 'ON_CONFIRM', 'ON_UPDATE_1'],
  LUMPSUM_EXISTING_FOLIO: ['SELECT', 'ON_SELECT', 'INIT', 'ON_INIT', 'CONFIRM', 'ON_CONFIRM', 'ON_STATUS', 'ON_UPDATE'],
  LUMPSUM_PAYMENT_RETRY: ['SELECT', 'ON_SELECT', 'INIT', 'ON_INIT', 'CONFIRM', 'ON_UPDATE', 'UPDATE', 'ON_UPDATE_1'],
  REDEMPTION: ['SELECT', 'ON_SELECT', 'INIT', 'ON_INIT', 'CONFIRM', 'ON_CONFIRM', 'ON_UPDATE'],
}

export const onDemandFlows = {
  HAPPY_FLOW: 'HAPPY_FLOW',
  RIDER_CANCEL: 'RIDER_CANCEL',
  DRIVER_CANCEL: 'DRIVER_CANCEL',
  PRICE_UPDATE: 'PRICE_UPDATE',
}

export const flowsFis10 = {
  FLOW_1: 'FLOW_1',
  FLOW_2: 'FLOW_2',
  FLOW_3: 'FLOW_3',
}

export const IGMApiSequence = {
  RET_ISSUE: 'ret_issue',
  RET_ISSUE_CLOSE: 'ret_issue_close',
  RET_ON_ISSUE: 'ret_on_issue',
  RET_ISSUE_STATUS: 'ret_issue_status',
  RET_ON_ISSUE_STATUS: 'ret_on_issue_status',
  RET_ON_ISSUE_STATUS_UNSOLICITED: 'ret_on_issue_status_unsolicited',
  LSP_ISSUE: 'lsp_issue',
  LSP_ISSUE_CLOSE: 'lsp_issue_close',
  LSP_ON_ISSUE: 'lsp_on_issue',
  LSP_ISSUE_STATUS: 'lsp_issue_status',
  LSP_ON_ISSUE_STATUS: 'lsp_on_issue_status',
}

export const RSFapiSequence = {
  RECEIVER_RECON: 'receiver_recon',
  ON_RECEIVER_RECON: 'on_receiver_recon',
}

export const actionsArray = [
  'search',
  'on_search',
  'select',
  'on_select',
  'init',
  'on_init',
  'confirm',
  'on_confirm',
  'update',
  'on_update',
  'cancel',
  'on_cancel',
  'track',
  'on_track',
  'status',
  'on_status',
]

export const statusArray = [
  'Pending',
  'Packed',
  'Agent-assigned',
  'Order-picked-up',
  'Out-for-delivery',
  'Order-delivered',
  'Cancelled',
]

export const buyerCancellationRid = new Set(['001', '003', '006', '009', '010'])
export const buyerReturnId = new Set(['001', '002', '003', '004', '005'])
export const rtoCancellationRid = new Set(['003', '006', '009', '010', '011', '012', '013', '014', '015', '016', '017'])

export const sellerCancellationRid = new Set([
  '002',
  '005',
  '008',
  '011',
  '012',
  '013',
  '014',
  '015',
  '016',
  '017',
  '018',
  '019',
  '020',
  '021',
])

export const retailDomains = [
  'ONDC:RET10',
  'ONDC:RET11',
  'ONDC:RET12',
  'ONDC:RET13',
  'ONDC:RET14',
  'ONDC:RET15',
  'ONDC:RET16',
  'ONDC:RET17',
  'ONDC:RET18',
  'ONDC:RET19',
  'ONDC:AGR10',
  'ONDC:RET1A',
]
export const ROUTING_ENUMS = ['P2P', 'P2H2P']
export const MOB_VEHICLE_CATEGORIES = ['AUTO_RICKSHAW', 'CAB', 'METRO', 'BUS', 'AIRLINE']
export const ON_DEMAND_VEHICLE = ['AUTO_RICKSHAW', 'CAB']
export const MOB__DESCRIPTOR_CODES = ['RIDE', 'SJT', 'SESJT', 'RUT', 'PASS', 'SEAT', 'NON STOP', 'CONNECT']
export const MOB_FULL_STATE = [
  'RIDE_CANCELLED',
  'RIDE_ENDED',
  'RIDE_STARTED',
  'RIDE_ASSIGNED',
  'RIDE_ENROUTE_PICKUP',
  'RIDE_ARRIVED_PICKUP',
]

export const ffCategory = [
  ['Immediate Delivery', 'Standard Delivery', 'Express Delivery'],
  ['Takeaway', 'Kerbside'],
]
