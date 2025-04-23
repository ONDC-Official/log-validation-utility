/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Ajv from 'ajv'
import fs from 'fs'
import addFormats from 'ajv-formats'
import yaml from 'js-yaml'
import { FnBselectSchema } from '../schema/Retail/RET11/select'
import { FnBsearchSchema } from '../schema/Retail/RET11/search'
import { FnBonSearchSchema } from '../schema/Retail/RET11/on_search'
import { FnBonSelectSchema } from '../schema/Retail/RET11/on_select'
import { FnBinitSchema } from '../schema/Retail/RET11/init'
import { FnBonInitSchema } from '../schema/Retail/RET11/on_init'
import { FnBconfirmSchema } from '../schema/Retail/RET11/confirm'
import { FnBonConfirmSchema } from '../schema/Retail/RET11/on_confirm'
import { cancelSchema } from '../schema/Retail/Cancel/cancel'
import { onCancelSchema } from '../schema/Retail/Cancel/onCancel'
import { status_cancel_RTO_Schema } from '../schema/Retail/Cancel/on_cancel_rto'
import { statusSchema } from '../schema/Retail/Status/status'
import { onStatusSchema } from '../schema/Retail/Status/on_status'
import { onTrackSchema } from '../schema/Retail/Track/on_track'
import { trackSchema } from '../schema/Retail/Track/track'
import { FnBonSearchIncSchema } from '../schema/Retail/RET11/on_search_inc'
import { searchSchema } from '../schema/Retail/RET/search'
import { onSearchSchema } from '../schema/Retail/RET/on_search'
import { selectSchema } from '../schema/Retail/RET/select'
import { onSelectSchema } from '../schema/Retail/RET/on_select'
import { initSchema } from '../schema/Retail/RET/init'
import { onInitSchema } from '../schema/Retail/RET/on_init'
import { confirmSchema } from '../schema/Retail/RET/confirm'
import { onConfirmSchema } from '../schema/Retail/RET/on_confirm'
import { catalogRejectionSchema } from '../schema/Retail/CatalogRejection/catalogRejection'
import issueSchema from '../schema/Igm/issueSchema'
import onIssueSchema from '../schema/Igm/onIssueSchema'
import issueStatusSchema from '../schema/Igm/issueStatusSchema'
import onIssueStatusSchema from '../schema/Igm/onIssueStatusSchema'
import issueCloseSchema from '../schema/Igm/issueCloseSchema'
import { onSearchIncSchema } from '../schema/Retail/RET/on_search_inc'
import { onUpdateSchema } from '../schema/Retail/Update/on_update'
import { updateSchema } from '../schema/Retail/Update/update'
import receiverReconSchema from '../schema/RSF/Rsf_v1/receiverReconSchema'
import onReceiverReconSchema from '../schema/RSF/Rsf_v1/onReciverReconSchema'
import settleSchema from '../schema/RSF/RSF_v2/settleSchema'
import onSettleSchema from '../schema/RSF/RSF_v2/on_settleSchema'
import reportSchema from '../schema/RSF/RSF_v2/reportSchema'
import onReportSchema from '../schema/RSF/RSF_v2/on_reportSchema'
import reconSchema from '../schema/RSF/RSF_v2/reconSchema'
import onReconSchema from '../schema/RSF/RSF_v2/on_reconSchema'
import { findProviderLocation } from '../utils'
import searchSchemaTRV14 from '../schema/TRV-14/search'
import select1SchemaTRV14 from '../schema/TRV-14/select1'
import onSelect1SchemaTRV14 from '../schema/TRV-14/onSelect1'
import select2SchemaTRV14 from '../schema/TRV-14/select2'
import onSelect2SchemaTRV14 from '../schema/TRV-14/onSelect2'
import initSchemaTRV14 from '../schema/TRV-14/init'
import onInitSchemaTRV14 from '../schema/TRV-14/onInit'
import confirmSchemaTRV14 from '../schema/TRV-14/confirm'
import onConfirmSchemaTRV14 from '../schema/TRV-14/onConfirm'
import statusSchemaTRV14 from '../schema/TRV-14/status'
import onStatusSchemaTRV14 from '../schema/TRV-14/onStatus'

import cancel1SchemaTRV14 from '../schema/TRV-14/cancel1'
import onCancel1SchemaTRV14 from '../schema/TRV-14/onCancel1'
import cancel2SchemaTRV14 from '../schema/TRV-14/cancel2'
import onCancel2SchemaTRV14 from '../schema/TRV-14/onCancel2'
import updateSchemaTRV14 from '../schema/TRV-14/update'
import onUpdateSchemaTRV14 from '../schema/TRV-14/onUpdate'
import onSearch1SchemaTRV14 from '../schema/TRV-14/onSearch1'
import onSearch2SchemaTRV14 from '../schema/TRV-14/onSearch2'
import newIssueSchema from '../schema/Igm/2.0.0/issue'
import newOnIssueSchema from '../schema/Igm/2.0.0/on_issue'
import { searchSchemaTRV_12 } from '../schema/TRV-12/search'
import { onSearchSchemaTRV_12 } from '../schema/TRV-12/on_search'
import { onSelectSchemaTRV_12 } from '../schema/TRV-12/on_select'
import { selectSchemaTRV_12 } from '../schema/TRV-12/select'
import { initSchemaTRV_12 } from '../schema/TRV-12/init'
import { onInitSchemaTRV_12 } from '../schema/TRV-12/on_init'
import { confirmSchemaTRV_12 } from '../schema/TRV-12/confirm'
import { cancelSchemaTRV_12 } from '../schema/TRV-12/cancel'
import { onConfirmSchemaTRV_12 } from '../schema/TRV-12/on_confirm'
import { onCancelSchemaTRV_12 } from '../schema/TRV-12/on_cancel'
import { searchFIS14Schema } from '../schema/FIS/Mutual_Funds/search'
import {onSearchFIS14Schema} from '../schema/FIS/Mutual_Funds/on_search'
import {selectFIS14Schema} from '../schema/FIS/Mutual_Funds/select'
import {onSelectFIS14Schema} from '../schema/FIS/Mutual_Funds/on_select'
import {initFIS14Schema} from '../schema/FIS/Mutual_Funds/init'
import {onInitFIS14Schema} from '../schema/FIS/Mutual_Funds/on_init'
import {confirmFIS14Schema} from '../schema/FIS/Mutual_Funds/confirm'
import {onConfirmFIS14Schema} from '../schema/FIS/Mutual_Funds/on_confirm'
// import { onStatusFIS14Schema } from '../schema/FIS/Mutual_Funds/on_status'
import { onUpdateFIS14Schema } from '../schema/FIS/Mutual_Funds/on_update'
import { searchFIS12WCLSchema } from '../schema/FIS/WCL/search'
import { onSearchFIS12WCLSchema } from '../schema/FIS/WCL/on_search'
import { onCancelFISWCLSchema } from '../schema/FIS/WCL/on_cancel'
import { cancelFISWCLSchema } from '../schema/FIS/WCL/cancel'
import { onUpdateFIS12WCLSchema } from '../schema/FIS/WCL/on_update'
import { updateFISWCLSchema } from '../schema/FIS/WCL/update'
import { onStatusFISWCLSchema } from '../schema/FIS/WCL/on_status'
import { onConfirmFISWCLSchema } from '../schema/FIS/WCL/on_confirm'
import { confirmFIS12WCLSchema } from '../schema/FIS/WCL/confirm'
import { onInitFIS12WCLSchema } from '../schema/FIS/WCL/on_init'
import { initFIS12Schema } from '../schema/FIS/WCL/init'
import { onSelectFIS12WCLSchema } from '../schema/FIS/WCL/on_select'
import { selectFIS12WCLSchema } from '../schema/FIS/WCL/select'
import { onUpdateFIS12FlowSchema } from '../schema/FIS/WCL/on_update_flow'

const ajv = new Ajv({
  allErrors: true,
  strict: 'log',
})
addFormats(ajv)
require('ajv-errors')(ajv)
ajv.addFormat('rfc3339-date-time', function (dateTimeString) {
  // Parse the date-time string
  const date = new Date(dateTimeString)

  // Check if the date is valid and if it matches the RFC3339 format
  if (isNaN(date.getTime())) {
    return false // Invalid date
  }

  // Convert the date to an RFC3339 string
  const rfc3339String = date.toISOString()

  // Compare the original string with the RFC3339 string
  // This ensures the string is in the correct format and represents a valid date
  return rfc3339String === dateTimeString
})

const formatted_error = (errors: any) => {
  const error_list: any = []
  let status = ''
  errors.forEach((error: any) => {
    if (!['not', 'oneOf', 'anyOf', 'allOf', 'if', 'then', 'else'].includes(error.keyword)) {
      const error_dict = {
        message: `${error.message}${error.params.allowedValues ? ` (${error.params.allowedValues})` : ''}${
          error.params.allowedValue ? ` (${error.params.allowedValue})` : ''
        }${error.params.additionalProperty ? ` (${error.params.additionalProperty})` : ''}`,
        details: error.instancePath,
      }
      error_list.push(error_dict)
    }
  })
  if (error_list.length === 0) status = 'pass'
  else status = 'fail'
  const error_json = { errors: error_list, status: status }
  return error_json
}

const validate_schema = (data: any, schema: any) => {
  let error_list: any = []

  const validate = ajv.compile(schema)
  const valid = validate(data)
  if (findProviderLocation(data)) {
    error_list.push({
      instancePath: '/message/order',
      message: 'provider_location is not a valid attribute, it should not be provided',
      schemaPath: '/message/order',
      details: 'provider_location',
      params: {},
    })
  }
  if (!valid) {
    error_list = validate.errors
  }

  return error_list
}
// catalog_rejection
const validate_schema_catalog_rejection_RET10_for_json = (data: any) => {
  const error_list = validate_schema(data, catalogRejectionSchema)
  return formatted_error(error_list)
}

const validate_schema_catalog_rejection_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, catalogRejectionSchema)
  return formatted_error(error_list)
}
const validate_schema_catalog_rejection_RET12_for_json = (data: any) => {
  const error_list = validate_schema(data, catalogRejectionSchema)
  return formatted_error(error_list)
}
const validate_schema_catalog_rejection_RET13_for_json = (data: any) => {
  const error_list = validate_schema(data, catalogRejectionSchema)
  return formatted_error(error_list)
}
const validate_schema_catalog_rejection_RET14_for_json = (data: any) => {
  const error_list = validate_schema(data, catalogRejectionSchema)
  return formatted_error(error_list)
}
const validate_schema_catalog_rejection_RET15_for_json = (data: any) => {
  const error_list = validate_schema(data, catalogRejectionSchema)
  return formatted_error(error_list)
}
const validate_schema_catalog_rejection_RET16_for_json = (data: any) => {
  const error_list = validate_schema(data, catalogRejectionSchema)
  return formatted_error(error_list)
}
const validate_schema_catalog_rejection_RET17_for_json = (data: any) => {
  const error_list = validate_schema(data, catalogRejectionSchema)
  return formatted_error(error_list)
}
const validate_schema_catalog_rejection_RET18_for_json = (data: any) => {
  const error_list = validate_schema(data, catalogRejectionSchema)
  return formatted_error(error_list)
}
const validate_schema_catalog_rejection_AGR10_for_json = (data: any) => {
  const error_list = validate_schema(data, catalogRejectionSchema)
  return formatted_error(error_list)
}
const validate_schema_catalog_rejection_RET1A_for_json = (data: any) => {
  const error_list = validate_schema(data, catalogRejectionSchema)
  return formatted_error(error_list)
}

// search
const validate_schema_search_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, FnBsearchSchema)
  return formatted_error(error_list)
}
const validate_schema_search_RET10_for_json = (data: any) => {
  const error_list = validate_schema(data, searchSchema)
  return formatted_error(error_list)
}
const validate_schema_search_RET12_for_json = (data: any) => {
  const error_list = validate_schema(data, searchSchema)
  return formatted_error(error_list)
}
const validate_schema_search_RET13_for_json = (data: any) => {
  const error_list = validate_schema(data, searchSchema)
  return formatted_error(error_list)
}

const validate_schema_search_RET14_for_json = (data: any) => {
  const error_list = validate_schema(data, searchSchema)
  return formatted_error(error_list)
}
const validate_schema_search_RET15_for_json = (data: any) => {
  const error_list = validate_schema(data, searchSchema)
  return formatted_error(error_list)
}
const validate_schema_search_RET16_for_json = (data: any) => {
  const error_list = validate_schema(data, searchSchema)
  return formatted_error(error_list)
}
const validate_schema_search_RET17_for_json = (data: any) => {
  const error_list = validate_schema(data, searchSchema)
  return formatted_error(error_list)
}
const validate_schema_search_RET18_for_json = (data: any) => {
  const error_list = validate_schema(data, searchSchema)
  return formatted_error(error_list)
}
const validate_schema_search_RET19_for_json = (data: any) => {
  const error_list = validate_schema(data, searchSchema)
  return formatted_error(error_list)
}
const validate_schema_search_AGR10_for_json = (data: any) => {
  const error_list = validate_schema(data, searchSchema)
  return formatted_error(error_list)
}
const validate_schema_search_RET1A_for_json = (data: any) => {
  const error_list = validate_schema(data, searchSchema)
  return formatted_error(error_list)
}

const validate_schema_search_52110_for_json = (data: any) => {
  const error_list = validate_schema(data, searchSchema)
  return formatted_error(error_list)
}
const validate_schema_inc_search_RET10_for_json = (data: any) => {
  const error_list = validate_schema(data, searchSchema)
  return formatted_error(error_list)
}
const validate_schema_inc_search_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, searchSchema)
  return formatted_error(error_list)
}
const validate_schema_inc_search_RET12_for_json = (data: any) => {
  const error_list = validate_schema(data, searchSchema)
  return formatted_error(error_list)
}
const validate_schema_inc_search_RET13_for_json = (data: any) => {
  const error_list = validate_schema(data, searchSchema)
  return formatted_error(error_list)
}
const validate_schema_inc_search_RET14_for_json = (data: any) => {
  const error_list = validate_schema(data, searchSchema)
  return formatted_error(error_list)
}
const validate_schema_inc_search_RET15_for_json = (data: any) => {
  const error_list = validate_schema(data, searchSchema)
  return formatted_error(error_list)
}
const validate_schema_inc_search_RET16_for_json = (data: any) => {
  const error_list = validate_schema(data, searchSchema)
  return formatted_error(error_list)
}
const validate_schema_inc_search_RET18_for_json = (data: any) => {
  const error_list = validate_schema(data, searchSchema)
  return formatted_error(error_list)
}
const validate_schema_inc_search_AGR10_for_json = (data: any) => {
  const error_list = validate_schema(data, searchSchema)
  return formatted_error(error_list)
}
const validate_schema_inc_search_RET1A_for_json = (data: any) => {
  const error_list = validate_schema(data, searchSchema)
  return formatted_error(error_list)
}

const validate_schema_search_trv14_for_json = (data: any) => {
  const error_list = validate_schema(data, searchSchemaTRV14)
  return formatted_error(error_list)
}
// On search

const validate_schema_on_search_1_trv14_for_json = (data: any) => {
  const error_list = validate_schema(data, onSearch1SchemaTRV14)
  return formatted_error(error_list)
}

const validate_schema_on_search_2_trv14_for_json = (data: any) => {
  const error_list = validate_schema(data, onSearch2SchemaTRV14)
  return formatted_error(error_list)
}

const validate_schema_on_search_RET10_for_json = (data: any) => {
  const error_list = validate_schema(data, onSearchSchema)
  return formatted_error(error_list)
}

const validate_schema_on_search_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, FnBonSearchSchema)
  return formatted_error(error_list)
}

const validate_schema_on_search_RET12_for_json = (data: any) => {
  const error_list = validate_schema(data, onSearchSchema)
  return formatted_error(error_list)
}
const validate_schema_on_search_RET13_for_json = (data: any) => {
  const error_list = validate_schema(data, onSearchSchema)
  return formatted_error(error_list)
}
const validate_schema_on_search_RET14_for_json = (data: any) => {
  const error_list = validate_schema(data, onSearchSchema)
  return formatted_error(error_list)
}
const validate_schema_on_search_RET15_for_json = (data: any) => {
  const error_list = validate_schema(data, onSearchSchema)
  return formatted_error(error_list)
}
const validate_schema_on_search_RET16_for_json = (data: any) => {
  const error_list = validate_schema(data, onSearchSchema)
  return formatted_error(error_list)
}
const validate_schema_on_search_RET17_for_json = (data: any) => {
  const error_list = validate_schema(data, onSearchSchema)
  return formatted_error(error_list)
}
const validate_schema_on_search_RET18_for_json = (data: any) => {
  const error_list = validate_schema(data, onSearchSchema)
  return formatted_error(error_list)
}
const validate_schema_on_search_RET19_for_json = (data: any) => {
  const error_list = validate_schema(data, onSearchSchema)
  return formatted_error(error_list)
}
const validate_schema_on_search_AGR10_for_json = (data: any) => {
  const error_list = validate_schema(data, onSearchSchema)
  return formatted_error(error_list)
}
const validate_schema_on_search_RET1A_for_json = (data: any) => {
  const error_list = validate_schema(data, onSearchSchema)
  return formatted_error(error_list)
}
const validate_schema_on_search_52110_for_json = (data: any) => {
  const error_list = validate_schema(data, onSearchSchema)
  return formatted_error(error_list)
}

// On search Inc

const validate_schema_on_search_inc_RET10_for_json = (data: any) => {
  const error_list = validate_schema(data, onSearchIncSchema)
  return formatted_error(error_list)
}
const validate_schema_on_search_inc_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, FnBonSearchIncSchema)
  return formatted_error(error_list)
}
const validate_schema_on_search_inc_RET12_for_json = (data: any) => {
  const error_list = validate_schema(data, onSearchIncSchema)
  return formatted_error(error_list)
}
const validate_schema_on_search_inc_RET13_for_json = (data: any) => {
  const error_list = validate_schema(data, onSearchIncSchema)
  return formatted_error(error_list)
}
const validate_schema_on_search_inc_RET14_for_json = (data: any) => {
  const error_list = validate_schema(data, onSearchIncSchema)
  return formatted_error(error_list)
}
const validate_schema_on_search_inc_RET15_for_json = (data: any) => {
  const error_list = validate_schema(data, onSearchIncSchema)
  return formatted_error(error_list)
}
const validate_schema_on_search_inc_RET16_for_json = (data: any) => {
  const error_list = validate_schema(data, onSearchIncSchema)
  return formatted_error(error_list)
}
const validate_schema_on_search_inc_RET17_for_json = (data: any) => {
  const error_list = validate_schema(data, onSearchIncSchema)
  return formatted_error(error_list)
}
const validate_schema_on_search_inc_RET18_for_json = (data: any) => {
  const error_list = validate_schema(data, onSearchIncSchema)
  return formatted_error(error_list)
}
const validate_schema_on_search_inc_RET19_for_json = (data: any) => {
  const error_list = validate_schema(data, onSearchIncSchema)
  return formatted_error(error_list)
}
const validate_schema_on_search_inc_AGR10_for_json = (data: any) => {
  const error_list = validate_schema(data, onSearchIncSchema)
  return formatted_error(error_list)
}
const validate_schema_on_search_inc_RET1A_for_json = (data: any) => {
  const error_list = validate_schema(data, onSearchIncSchema)
  return formatted_error(error_list)
}
const validate_schema_on_search_inc_52110_for_json = (data: any) => {
  const error_list = validate_schema(data, onSearchIncSchema)
  return formatted_error(error_list)
}

// select

const validate_schema_select_1_trv14_for_json = (data: any) => {
  const error_list = validate_schema(data, select1SchemaTRV14)
  return formatted_error(error_list)
}
const validate_schema_select_2_trv14_for_json = (data: any) => {
  const error_list = validate_schema(data, select2SchemaTRV14)
  return formatted_error(error_list)
}
const validate_schema_select_RET10_for_json = (data: any) => {
  const error_list = validate_schema(data, selectSchema)
  return formatted_error(error_list)
}
const validate_schema_select_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, FnBselectSchema)
  return formatted_error(error_list)
}
const validate_schema_select_RET12_for_json = (data: any) => {
  const error_list = validate_schema(data, selectSchema)
  return formatted_error(error_list)
}
const validate_schema_select_RET13_for_json = (data: any) => {
  const error_list = validate_schema(data, selectSchema)
  return formatted_error(error_list)
}
const validate_schema_select_RET14_for_json = (data: any) => {
  const error_list = validate_schema(data, selectSchema)
  return formatted_error(error_list)
}
const validate_schema_select_RET15_for_json = (data: any) => {
  const error_list = validate_schema(data, selectSchema)
  return formatted_error(error_list)
}
const validate_schema_select_RET16_for_json = (data: any) => {
  const error_list = validate_schema(data, selectSchema)
  return formatted_error(error_list)
}
const validate_schema_select_RET17_for_json = (data: any) => {
  const error_list = validate_schema(data, selectSchema)
  return formatted_error(error_list)
}
const validate_schema_select_RET18_for_json = (data: any) => {
  const error_list = validate_schema(data, selectSchema)
  return formatted_error(error_list)
}
const validate_schema_select_RET19_for_json = (data: any) => {
  const error_list = validate_schema(data, selectSchema)
  return formatted_error(error_list)
}
const validate_schema_select_AGR10_for_json = (data: any) => {
  const error_list = validate_schema(data, selectSchema)
  return formatted_error(error_list)
}
const validate_schema_select_RET1A_for_json = (data: any) => {
  const error_list = validate_schema(data, selectSchema)
  return formatted_error(error_list)
}
const validate_schema_select_52110_for_json = (data: any) => {
  const error_list = validate_schema(data, selectSchema)
  return formatted_error(error_list)
}

// On select

const validate_schema_on_select_1_trv14_for_json = (data: any) => {
  const error_list = validate_schema(data, onSelect1SchemaTRV14)
  return formatted_error(error_list)
}

const validate_schema_on_select_2_trv14_for_json = (data: any) => {
  const error_list = validate_schema(data, onSelect2SchemaTRV14)
  return formatted_error(error_list)
}
const validate_schema_on_select_RET10_for_json = (data: any) => {
  const error_list = validate_schema(data, onSelectSchema)
  return formatted_error(error_list)
}
const validate_schema_on_select_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, FnBonSelectSchema)
  return formatted_error(error_list)
}
const validate_schema_on_select_RET12_for_json = (data: any) => {
  const error_list = validate_schema(data, onSelectSchema)
  return formatted_error(error_list)
}
const validate_schema_on_select_RET13_for_json = (data: any) => {
  const error_list = validate_schema(data, onSelectSchema)
  return formatted_error(error_list)
}
const validate_schema_on_select_RET14_for_json = (data: any) => {
  const error_list = validate_schema(data, onSelectSchema)
  return formatted_error(error_list)
}
const validate_schema_on_select_RET15_for_json = (data: any) => {
  const error_list = validate_schema(data, onSelectSchema)
  return formatted_error(error_list)
}
const validate_schema_on_select_RET16_for_json = (data: any) => {
  const error_list = validate_schema(data, onSelectSchema)
  return formatted_error(error_list)
}
const validate_schema_on_select_RET17_for_json = (data: any) => {
  const error_list = validate_schema(data, onSelectSchema)
  return formatted_error(error_list)
}
const validate_schema_on_select_RET18_for_json = (data: any) => {
  const error_list = validate_schema(data, onSelectSchema)
  return formatted_error(error_list)
}
const validate_schema_on_select_RET19_for_json = (data: any) => {
  const error_list = validate_schema(data, onSelectSchema)
  return formatted_error(error_list)
}
const validate_schema_on_select_AGR10_for_json = (data: any) => {
  const error_list = validate_schema(data, onSelectSchema)
  return formatted_error(error_list)
}
const validate_schema_on_select_RET1A_for_json = (data: any) => {
  const error_list = validate_schema(data, onSelectSchema)
  return formatted_error(error_list)
}
const validate_schema_on_select_52110_for_json = (data: any) => {
  const error_list = validate_schema(data, onSelectSchema)
  return formatted_error(error_list)
}

// init

const validate_schema_init_trv14_for_json = (data: any) => {
  const error_list = validate_schema(data, initSchemaTRV14)
  return formatted_error(error_list)
}
const validate_schema_init_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, FnBinitSchema)
  return formatted_error(error_list)
}
const validate_schema_init_RET10_for_json = (data: any) => {
  const error_list = validate_schema(data, initSchema)
  return formatted_error(error_list)
}
const validate_schema_init_RET12_for_json = (data: any) => {
  const error_list = validate_schema(data, initSchema)
  return formatted_error(error_list)
}
const validate_schema_init_RET13_for_json = (data: any) => {
  const error_list = validate_schema(data, initSchema)
  return formatted_error(error_list)
}
const validate_schema_init_RET14_for_json = (data: any) => {
  const error_list = validate_schema(data, initSchema)
  return formatted_error(error_list)
}
const validate_schema_init_RET15_for_json = (data: any) => {
  const error_list = validate_schema(data, initSchema)
  return formatted_error(error_list)
}
const validate_schema_init_RET16_for_json = (data: any) => {
  const error_list = validate_schema(data, initSchema)
  return formatted_error(error_list)
}
const validate_schema_init_RET17_for_json = (data: any) => {
  const error_list = validate_schema(data, initSchema)
  return formatted_error(error_list)
}
const validate_schema_init_RET18_for_json = (data: any) => {
  const error_list = validate_schema(data, initSchema)
  return formatted_error(error_list)
}
const validate_schema_init_RET19_for_json = (data: any) => {
  const error_list = validate_schema(data, initSchema)
  return formatted_error(error_list)
}
const validate_schema_init_AGR10_for_json = (data: any) => {
  const error_list = validate_schema(data, initSchema)
  return formatted_error(error_list)
}
const validate_schema_init_RET1A_for_json = (data: any) => {
  const error_list = validate_schema(data, initSchema)
  return formatted_error(error_list)
}
const validate_schema_init_52110_for_json = (data: any) => {
  const error_list = validate_schema(data, initSchema)
  return formatted_error(error_list)
}

// On init

const validate_schema_on_init_trv14_for_json = (data: any) => {
  const error_list = validate_schema(data, onInitSchemaTRV14)
  return formatted_error(error_list)
}
const validate_schema_on_init_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, FnBonInitSchema)
  return formatted_error(error_list)
}
const validate_schema_on_init_RET10_for_json = (data: any) => {
  const error_list = validate_schema(data, onInitSchema)
  return formatted_error(error_list)
}
const validate_schema_on_init_RET12_for_json = (data: any) => {
  const error_list = validate_schema(data, onInitSchema)
  return formatted_error(error_list)
}
const validate_schema_on_init_RET13_for_json = (data: any) => {
  const error_list = validate_schema(data, onInitSchema)
  return formatted_error(error_list)
}
const validate_schema_on_init_RET14_for_json = (data: any) => {
  const error_list = validate_schema(data, onInitSchema)
  return formatted_error(error_list)
}
const validate_schema_on_init_RET15_for_json = (data: any) => {
  const error_list = validate_schema(data, onInitSchema)
  return formatted_error(error_list)
}
const validate_schema_on_init_RET16_for_json = (data: any) => {
  const error_list = validate_schema(data, onInitSchema)
  return formatted_error(error_list)
}
const validate_schema_on_init_RET17_for_json = (data: any) => {
  const error_list = validate_schema(data, onInitSchema)
  return formatted_error(error_list)
}
const validate_schema_on_init_RET18_for_json = (data: any) => {
  const error_list = validate_schema(data, onInitSchema)
  return formatted_error(error_list)
}
const validate_schema_on_init_RET19_for_json = (data: any) => {
  const error_list = validate_schema(data, onInitSchema)
  return formatted_error(error_list)
}
const validate_schema_on_init_AGR10_for_json = (data: any) => {
  const error_list = validate_schema(data, onInitSchema)
  return formatted_error(error_list)
}
const validate_schema_on_init_RET1A_for_json = (data: any) => {
  const error_list = validate_schema(data, onInitSchema)
  return formatted_error(error_list)
}
const validate_schema_on_init_52110_for_json = (data: any) => {
  const error_list = validate_schema(data, onInitSchema)
  return formatted_error(error_list)
}

// confirm
const validate_schema_confirm_trv14_for_json = (data: any) => {
  const error_list = validate_schema(data, confirmSchemaTRV14)
  return formatted_error(error_list)
}
const validate_schema_confirm_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, FnBconfirmSchema)
  return formatted_error(error_list)
}

const validate_schema_confirm_RET10_for_json = (data: any) => {
  const error_list = validate_schema(data, confirmSchema)
  return formatted_error(error_list)
}

const validate_schema_confirm_RET12_for_json = (data: any) => {
  const error_list = validate_schema(data, confirmSchema)
  return formatted_error(error_list)
}
const validate_schema_confirm_RET13_for_json = (data: any) => {
  const error_list = validate_schema(data, confirmSchema)
  return formatted_error(error_list)
}
const validate_schema_confirm_RET14_for_json = (data: any) => {
  const error_list = validate_schema(data, confirmSchema)
  return formatted_error(error_list)
}
const validate_schema_confirm_RET15_for_json = (data: any) => {
  const error_list = validate_schema(data, confirmSchema)
  return formatted_error(error_list)
}
const validate_schema_confirm_RET16_for_json = (data: any) => {
  const error_list = validate_schema(data, confirmSchema)
  return formatted_error(error_list)
}
const validate_schema_confirm_RET17_for_json = (data: any) => {
  const error_list = validate_schema(data, confirmSchema)
  return formatted_error(error_list)
}
const validate_schema_confirm_RET18_for_json = (data: any) => {
  const error_list = validate_schema(data, confirmSchema)
  return formatted_error(error_list)
}
const validate_schema_confirm_RET19_for_json = (data: any) => {
  const error_list = validate_schema(data, confirmSchema)
  return formatted_error(error_list)
}
const validate_schema_confirm_AGR10_for_json = (data: any) => {
  const error_list = validate_schema(data, confirmSchema)
  return formatted_error(error_list)
}
const validate_schema_confirm_RET1A_for_json = (data: any) => {
  const error_list = validate_schema(data, confirmSchema)
  return formatted_error(error_list)
}
const validate_schema_confirm_52110_for_json = (data: any) => {
  const error_list = validate_schema(data, confirmSchema)
  return formatted_error(error_list)
}

// On confirm
const validate_schema_on_confirm_trv14_for_json = (data: any) => {
  const error_list = validate_schema(data, onConfirmSchemaTRV14)
  return formatted_error(error_list)
}
const validate_schema_on_confirm_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, FnBonConfirmSchema)
  return formatted_error(error_list)
}
const validate_schema_on_confirm_RET10_for_json = (data: any) => {
  const error_list = validate_schema(data, onConfirmSchema)
  return formatted_error(error_list)
}
const validate_schema_on_confirm_RET12_for_json = (data: any) => {
  const error_list = validate_schema(data, onConfirmSchema)
  return formatted_error(error_list)
}
const validate_schema_on_confirm_RET13_for_json = (data: any) => {
  const error_list = validate_schema(data, onConfirmSchema)
  return formatted_error(error_list)
}
const validate_schema_on_confirm_RET14_for_json = (data: any) => {
  const error_list = validate_schema(data, onConfirmSchema)
  return formatted_error(error_list)
}
const validate_schema_on_confirm_RET15_for_json = (data: any) => {
  const error_list = validate_schema(data, onConfirmSchema)
  return formatted_error(error_list)
}
const validate_schema_on_confirm_RET16_for_json = (data: any) => {
  const error_list = validate_schema(data, onConfirmSchema)
  return formatted_error(error_list)
}
const validate_schema_on_confirm_RET17_for_json = (data: any) => {
  const error_list = validate_schema(data, onConfirmSchema)
  return formatted_error(error_list)
}
const validate_schema_on_confirm_RET18_for_json = (data: any) => {
  const error_list = validate_schema(data, onConfirmSchema)
  return formatted_error(error_list)
}
const validate_schema_on_confirm_RET19_for_json = (data: any) => {
  const error_list = validate_schema(data, onConfirmSchema)
  return formatted_error(error_list)
}
const validate_schema_on_confirm_AGR10_for_json = (data: any) => {
  const error_list = validate_schema(data, onConfirmSchema)
  return formatted_error(error_list)
}
const validate_schema_on_confirm_RET1A_for_json = (data: any) => {
  const error_list = validate_schema(data, onConfirmSchema)
  return formatted_error(error_list)
}
const validate_schema_on_confirm_52110_for_json = (data: any) => {
  const error_list = validate_schema(data, onConfirmSchema)
  return formatted_error(error_list)
}
// Cancel

const validate_schema_cancel_1_trv14_for_json = (data: any) => {
  const error_list = validate_schema(data, cancel1SchemaTRV14)
  return formatted_error(error_list)
}
const validate_schema_cancel_2_trv14_for_json = (data: any) => {
  const error_list = validate_schema(data, cancel2SchemaTRV14)
  return formatted_error(error_list)
}
const validate_schema_cancel_RET10_for_json = (data: any) => {
  const error_list = validate_schema(data, cancelSchema)
  return formatted_error(error_list)
}
const validate_schema_cancel_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, cancelSchema)
  return formatted_error(error_list)
}
const validate_schema_cancel_RET19_for_json = (data: any) => {
  const error_list = validate_schema(data, cancelSchema)
  return formatted_error(error_list)
}

// ON_CANCEL
const validate_schema_on_cancel_1_trv14_for_json = (data: any) => {
  const error_list = validate_schema(data, onCancel1SchemaTRV14)
  return formatted_error(error_list)
}

const validate_schema_on_cancel_2_trv14_for_json = (data: any) => {
  const error_list = validate_schema(data, onCancel2SchemaTRV14)
  return formatted_error(error_list)
}
const validate_schema_on_cancel_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, onCancelSchema)
  return formatted_error(error_list)
}
const validate_schema_on_cancel_RET10_for_json = (data: any) => {
  const error_list = validate_schema(data, onCancelSchema)
  return formatted_error(error_list)
}
const validate_schema_on_cancel_RET12_for_json = (data: any) => {
  const error_list = validate_schema(data, onCancelSchema)
  return formatted_error(error_list)
}
const validate_schema_on_cancel_RET13_for_json = (data: any) => {
  const error_list = validate_schema(data, onCancelSchema)
  return formatted_error(error_list)
}
const validate_schema_on_cancel_RET14_for_json = (data: any) => {
  const error_list = validate_schema(data, onCancelSchema)
  return formatted_error(error_list)
}
const validate_schema_on_cancel_RET15_for_json = (data: any) => {
  const error_list = validate_schema(data, onCancelSchema)
  return formatted_error(error_list)
}
const validate_schema_on_cancel_RET16_for_json = (data: any) => {
  const error_list = validate_schema(data, onCancelSchema)
  return formatted_error(error_list)
}
const validate_schema_on_cancel_RET17_for_json = (data: any) => {
  const error_list = validate_schema(data, onCancelSchema)
  return formatted_error(error_list)
}
const validate_schema_on_cancel_RET18_for_json = (data: any) => {
  const error_list = validate_schema(data, onCancelSchema)
  return formatted_error(error_list)
}

const validate_schema_on_cancel_rto_RET10_for_json = (data: any) => {
  const error_list = validate_schema(data, status_cancel_RTO_Schema)
  return formatted_error(error_list)
}
const validate_schema_on_cancel_rto_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, status_cancel_RTO_Schema)
  return formatted_error(error_list)
}
const validate_schema_on_cancel_rto_RET12_for_json = (data: any) => {
  const error_list = validate_schema(data, status_cancel_RTO_Schema)
  return formatted_error(error_list)
}
const validate_schema_on_cancel_rto_RET13_for_json = (data: any) => {
  const error_list = validate_schema(data, status_cancel_RTO_Schema)
  return formatted_error(error_list)
}
const validate_schema_on_cancel_rto_RET14_for_json = (data: any) => {
  const error_list = validate_schema(data, status_cancel_RTO_Schema)
  return formatted_error(error_list)
}
const validate_schema_on_cancel_rto_RET15_for_json = (data: any) => {
  const error_list = validate_schema(data, status_cancel_RTO_Schema)
  return formatted_error(error_list)
}
const validate_schema_on_cancel_rto_RET16_for_json = (data: any) => {
  const error_list = validate_schema(data, status_cancel_RTO_Schema)
  return formatted_error(error_list)
}
const validate_schema_on_cancel_rto_RET17_for_json = (data: any) => {
  const error_list = validate_schema(data, status_cancel_RTO_Schema)
  return formatted_error(error_list)
}
const validate_schema_on_cancel_rto_RET18_for_json = (data: any) => {
  const error_list = validate_schema(data, status_cancel_RTO_Schema)
  return formatted_error(error_list)
}
const validate_schema_on_cancel_rto_RET19_for_json = (data: any) => {
  const error_list = validate_schema(data, status_cancel_RTO_Schema)
  return formatted_error(error_list)
}
const validate_schema_on_cancel_rto_AGR10_for_json = (data: any) => {
  const error_list = validate_schema(data, status_cancel_RTO_Schema)
  return formatted_error(error_list)
}
const validate_schema_on_cancel_rto_RET1A_for_json = (data: any) => {
  const error_list = validate_schema(data, status_cancel_RTO_Schema)
  return formatted_error(error_list)
}
const validate_schema_track_RET10_for_json = (data: any) => {
  const error_list = validate_schema(data, trackSchema)
  return formatted_error(error_list)
}
const validate_schema_track_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, trackSchema)
  return formatted_error(error_list)
}
const validate_schema_on_track_RET10_for_json = (data: any) => {
  const error_list = validate_schema(data, onTrackSchema)
  return formatted_error(error_list)
}
const validate_schema_on_track_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, onTrackSchema)
  return formatted_error(error_list)
}

// Status
const validate_schema_status_trv14_for_json = (data: any) => {
  const error_list = validate_schema(data, statusSchemaTRV14)
  return formatted_error(error_list)
}
const validate_schema_status_RET10_for_json = (data: any) => {
  const error_list = validate_schema(data, statusSchema)
  return formatted_error(error_list)
}
const validate_schema_status_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, statusSchema)
  return formatted_error(error_list)
}

export const validate_schema_status_RET19_for_json = (data: any) => {
  const error_list = validate_schema(data, statusSchema)
  return formatted_error(error_list)
}
// ON_STATUS

const validate_schema_on_status_trv14_for_json = (data: any) => {
  const error_list = validate_schema(data, onStatusSchemaTRV14)
  return formatted_error(error_list)
}
const validate_schema_on_status_RET10_for_json = (data: any) => {
  const error_list = validate_schema(data, onStatusSchema)
  return formatted_error(error_list)
}
const validate_schema_on_status_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, onStatusSchema)
  return formatted_error(error_list)
}
const validate_schema_on_status_RET12_for_json = (data: any) => {
  const error_list = validate_schema(data, onStatusSchema)
  return formatted_error(error_list)
}
const validate_schema_on_status_RET13_for_json = (data: any) => {
  const error_list = validate_schema(data, onStatusSchema)
  return formatted_error(error_list)
}
const validate_schema_on_status_RET14_for_json = (data: any) => {
  const error_list = validate_schema(data, onStatusSchema)
  return formatted_error(error_list)
}
const validate_schema_on_status_RET15_for_json = (data: any) => {
  const error_list = validate_schema(data, onStatusSchema)
  return formatted_error(error_list)
}
const validate_schema_on_status_RET16_for_json = (data: any) => {
  const error_list = validate_schema(data, onStatusSchema)
  return formatted_error(error_list)
}
const validate_schema_on_status_RET17_for_json = (data: any) => {
  const error_list = validate_schema(data, onStatusSchema)
  return formatted_error(error_list)
}
const validate_schema_on_status_RET18_for_json = (data: any) => {
  const error_list = validate_schema(data, onStatusSchema)
  return formatted_error(error_list)
}
const validate_schema_on_status_RET19_for_json = (data: any) => {
  const error_list = validate_schema(data, onStatusSchema)
  return formatted_error(error_list)
}
const validate_schema_on_status_AGR10_for_json = (data: any) => {
  const error_list = validate_schema(data, onStatusSchema)
  return formatted_error(error_list)
}
const validate_schema_on_status_RET1A_for_json = (data: any) => {
  const error_list = validate_schema(data, onStatusSchema)
  return formatted_error(error_list)
}

// Update

const validate_schema_update_trv14_for_json = (data: any) => {
  const error_list = validate_schema(data, updateSchemaTRV14)
  return formatted_error(error_list)
}

const validate_schema_update_RET10_for_json = (data: any) => {
  const error_list = validate_schema(data, updateSchema)
  return formatted_error(error_list)
}
const validate_schema_on_update_RET10_for_json = (data: any) => {
  const error_list = validate_schema(data, onUpdateSchema)
  return formatted_error(error_list)
}
const validate_schema_update_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, updateSchema)
  return formatted_error(error_list)
}
const validate_schema_on_update_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, onUpdateSchema)
  return formatted_error(error_list)
}
const validate_schema_update_RET12_for_json = (data: any) => {
  const error_list = validate_schema(data, updateSchema)
  return formatted_error(error_list)
}
const validate_schema_on_update_RET12_for_json = (data: any) => {
  const error_list = validate_schema(data, onUpdateSchema)
  return formatted_error(error_list)
}
const validate_schema_update_RET13_for_json = (data: any) => {
  const error_list = validate_schema(data, updateSchema)
  return formatted_error(error_list)
}
const validate_schema_on_update_RET13_for_json = (data: any) => {
  const error_list = validate_schema(data, onUpdateSchema)
  return formatted_error(error_list)
}
const validate_schema_update_RET14_for_json = (data: any) => {
  const error_list = validate_schema(data, updateSchema)
  return formatted_error(error_list)
}
const validate_schema_on_update_RET14_for_json = (data: any) => {
  const error_list = validate_schema(data, onUpdateSchema)
  return formatted_error(error_list)
}
const validate_schema_update_RET15_for_json = (data: any) => {
  const error_list = validate_schema(data, updateSchema)
  return formatted_error(error_list)
}

// ON UPDATE
const validate_schema_on_update_trv14_for_json = (data: any) => {
  const error_list = validate_schema(data, onUpdateSchemaTRV14)
  return formatted_error(error_list)
}

const validate_schema_on_update_RET15_for_json = (data: any) => {
  const error_list = validate_schema(data, onUpdateSchema)
  return formatted_error(error_list)
}
const validate_schema_update_RET16_for_json = (data: any) => {
  const error_list = validate_schema(data, updateSchema)
  return formatted_error(error_list)
}
const validate_schema_on_update_RET16_for_json = (data: any) => {
  const error_list = validate_schema(data, onUpdateSchema)
  return formatted_error(error_list)
}
const validate_schema_update_RET18_for_json = (data: any) => {
  const error_list = validate_schema(data, updateSchema)
  return formatted_error(error_list)
}
const validate_schema_on_update_RET18_for_json = (data: any) => {
  const error_list = validate_schema(data, onUpdateSchema)
  return formatted_error(error_list)
}

// IGM 2.0.0

const validate_schema_issue_igm2_for_json = (data: any) => {
  console.log('inside new issue schema')
  const error_list = validate_schema(data, newIssueSchema)
  return formatted_error(error_list)
}

const validate_schema_on_issue_igm2_for_json = (data: any) => {
  const error_list = validate_schema(data, newOnIssueSchema)
  return formatted_error(error_list)
}

//IGM

const validate_schema_issue_igm_for_json = (data: any) => {
  const error_list = validate_schema(data, issueSchema)
  return formatted_error(error_list)
}

const validate_schema_on_issue_igm_for_json = (data: any) => {
  const error_list = validate_schema(data, onIssueSchema)
  return formatted_error(error_list)
}

const validate_schema_issue_status_igm_for_json = (data: any) => {
  const error_list = validate_schema(data, issueStatusSchema)
  return formatted_error(error_list)
}

const validate_schema_on_issue_status_igm_for_json = (data: any) => {
  const error_list = validate_schema(data, onIssueStatusSchema)
  return formatted_error(error_list)
}

// TRV-12 Search
const validate_schema_search_TRV12_for_json = (data: any) => {
  const error_list = validate_schema(data, searchSchemaTRV_12)
  return formatted_error(error_list)
}

const validate_schema_on_search_TRV12_for_json = (data: any) => {
  const error_list = validate_schema(data, onSearchSchemaTRV_12)
  return formatted_error(error_list)
}

const validate_schema_select_TRV12_for_json = (data: any) => {
  const error_list = validate_schema(data, selectSchemaTRV_12)
  return formatted_error(error_list)
}

const validate_schema_on_select_TRV12_for_json = (data: any) => {
  const error_list = validate_schema(data, onSelectSchemaTRV_12)
  return formatted_error(error_list)
}

const validate_schema_init_TRV12_for_json = (data: any) => {
  const error_list = validate_schema(data, initSchemaTRV_12)
  return formatted_error(error_list)
}

const validate_schema_on_init_TRV12_for_json = (data: any) => {
  const error_list = validate_schema(data, onInitSchemaTRV_12)
  return formatted_error(error_list)
}

const validate_schema_confirm_TRV12_for_json = (data: any) => {
  const error_list = validate_schema(data, confirmSchemaTRV_12)
  return formatted_error(error_list)
}

const validate_schema_on_confirm_TRV12_for_json = (data: any) => {
  const error_list = validate_schema(data, onConfirmSchemaTRV_12)
  return formatted_error(error_list)
}

const validate_schema_cancel_TRV12_for_json = (data: any) => {
  const error_list = validate_schema(data, cancelSchemaTRV_12)
  return formatted_error(error_list)
}

const validate_schema_on_cancel_TRV12_for_json = (data: any) => {
  const error_list = validate_schema(data, onCancelSchemaTRV_12)
  return formatted_error(error_list)
}

//________________________________________________________________________________________________

const validate_schema_for_json = (data: any, schemaPath: any) => {
  let error_list
  try {
    const schemaYAML = fs.readFileSync(schemaPath, 'utf8')
    const schema = yaml.load(schemaYAML)
    if (typeof schema === 'object') {
      error_list = validate_schema(data, schema)
    } else {
      console.log('Schema is not a valid object.')
      error_list = []
    }
  } catch (err) {
    console.log('Error loading or parsing schema:', err)
    error_list = []
  }

  return formatted_error(error_list)
}

const FISValidator = {
  validate_schema_search_FIS_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/search.yaml'),
  validate_schema_on_search_FIS_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/on_search.yaml'),
  validate_schema_select_FIS_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/select.yaml'),
  validate_schema_on_select_FIS_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/on_select.yaml'),
  validate_schema_init_FIS_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/init.yaml'),
  validate_schema_on_init_FIS_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/on_init.yaml'),
  validate_schema_confirm_FIS_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/confirm.yaml'),
  validate_schema_on_confirm_FIS_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/on_confirm.yaml'),
  validate_schema_update_FIS_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/update.yaml'),
  validate_schema_on_update_FIS_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/on_update.yaml'),
  validate_schema_on_update_FIS12_for_json: (data: any) =>
    validate_schema_for_json(data, 'schema/FIS/FIS12/on_update.yaml'),
  validate_schema_status_FIS_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/status.yaml'),
  validate_schema_on_status_FIS_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/on_status.yaml'),
}

//schema validation for FIS 14
const validate_schema_search_FIS14_for_json = (data: any) => {
  console.log("data->", data)
  const error_list = validate_schema(data, searchFIS14Schema)
  return formatted_error(error_list)
}

const validate_schema_on_search_FIS14_for_json = (data: any) => {
  const error_list = validate_schema(data, onSearchFIS14Schema)
  return formatted_error(error_list)
}

const validate_schema_select_FIS14_for_json = (data: any) => {
  const error_list = validate_schema(data, selectFIS14Schema)
  return formatted_error(error_list)
}

const validate_schema_on_select_FIS14_for_json = (data: any) => {
  const error_list = validate_schema(data, onSelectFIS14Schema)
  return formatted_error(error_list)
}

const validate_schema_init_FIS14_for_json = (data: any) => {
  const error_list = validate_schema(data, initFIS14Schema)
  return formatted_error(error_list)
}

const validate_schema_on_init_FIS14_for_json = (data: any) => {
  const error_list = validate_schema(data, onInitFIS14Schema)
  return formatted_error(error_list)
}

const validate_schema_confirm_FIS14_for_json = (data: any) => {
  const error_list = validate_schema(data, confirmFIS14Schema)
  return formatted_error(error_list)
}

const validate_schema_on_confirm_FIS14_for_json = (data: any) => {
  const error_list = validate_schema(data, onConfirmFIS14Schema)
  return formatted_error(error_list)
}

// const validate_schema_on_status_FIS14_for_json = (data: any) => {
//   const error_list = validate_schema(data, onStatusFIS14Schema)
//   return formatted_error(error_list)
// }

const validate_schema_on_update_FIS14_for_json = (data: any) => {
  const error_list = validate_schema(data, onUpdateFIS14Schema)
  return formatted_error(error_list)
}

//validate schema for FIS 12 Working capital
const validate_schema_search_FIS_WCL_for_json = (data: any) => {
  const error_list = validate_schema(data, searchFIS12WCLSchema)
  return formatted_error(error_list)
}

const validate_schema_on_search_FIS_WCL_for_json = (data: any) => {
  const error_list = validate_schema(data, onSearchFIS12WCLSchema)
  return formatted_error(error_list)
}

const validate_schema_select_FIS_WCL_for_json = (data: any) => {
  const error_list = validate_schema(data, selectFIS12WCLSchema)
  return formatted_error(error_list)
}
const validate_schema_on_select_FIS_WCL_for_json = (data: any) => {
  const error_list = validate_schema(data, onSelectFIS12WCLSchema)
  return formatted_error(error_list)
}
const validate_schema_init_FIS_WCL_for_json = (data: any) => {
  const error_list = validate_schema(data, initFIS12Schema)
  return formatted_error(error_list)
}
const validate_schema_on_init_FIS_WCL_for_json = (data: any) => {
  const error_list = validate_schema(data, onInitFIS12WCLSchema)
  return formatted_error(error_list)
}

const validate_schema_confirm_FIS_WCL_for_json = (data: any) => {
  const error_list = validate_schema(data, confirmFIS12WCLSchema)
  return formatted_error(error_list)
}
const validate_schema_on_confirm_FIS_WCL_for_json = (data: any) => {
  const error_list = validate_schema(data, onConfirmFISWCLSchema)
  return formatted_error(error_list)
}
const validate_schema_on_status_FIS_WCL_for_json = (data: any) => {
  const error_list = validate_schema(data, onStatusFISWCLSchema)
  return formatted_error(error_list)
}

const validate_schema_update_FIS_WCL_for_json = (data: any) => {
  const error_list = validate_schema(data, updateFISWCLSchema)
  return formatted_error(error_list)
}
const validate_schema_on_update_FIS_WCL_for_json = (data: any) => {
  const error_list = validate_schema(data, onUpdateFIS12WCLSchema)
  return formatted_error(error_list)
}

const validate_schema_cancel_FIS_WCL_for_json = (data: any) => {
  const error_list = validate_schema(data, cancelFISWCLSchema)
  return formatted_error(error_list)
}
const validate_schema_on_cancel_FIS_WCL_for_json = (data: any) => {
  const error_list = validate_schema(data, onCancelFISWCLSchema)
  return formatted_error(error_list)
}

const validate_schema_on_update_foreclosure_FIS_WCL_for_json = (data: any) => {
  const error_list = validate_schema(data, onUpdateFIS12FlowSchema)
  return formatted_error(error_list)
}

const validate_schema_on_update_flow_FIS_WCL_for_json = (data: any) => {
  const error_list = validate_schema(data, onUpdateFIS12FlowSchema)
  return formatted_error(error_list)
}


const TRVValidator = {
  validate_schema_search_TRV_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/search.yaml'),
  validate_schema_on_search_TRV_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/on_search.yaml'),
  validate_schema_select_TRV_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/select.yaml'),
  validate_schema_on_select_TRV_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/on_select.yaml'),
  validate_schema_init_TRV_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/init.yaml'),
  validate_schema_on_init_TRV_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/on_init.yaml'),
  validate_schema_confirm_TRV_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/confirm.yaml'),
  validate_schema_on_confirm_TRV_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/on_confirm.yaml'),
  validate_schema_update_TRV_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/update.yaml'),
  validate_schema_on_update_TRV_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/on_update.yaml'),
  validate_schema_status_TRV_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/status.yaml'),
  validate_schema_on_status_TRV_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/on_status.yaml'),
  validate_schema_cancel_TRV_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/cancel.yaml'),
  validate_schema_on_cancel_TRV_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/on_cancel.yaml'),
}

const validate_schema_issue_close_igm_for_json = (data: any) => {
  const error_list = validate_schema(data, issueCloseSchema)
  return formatted_error(error_list)
}

const validate_schema_receiver_recon_rsf_for_json = (data: any) => {
  const error_list = validate_schema(data, receiverReconSchema)
  return formatted_error(error_list)
}

const validate_schema_on_receiver_recon_rsf_for_json = (data: any) => {
  const error_list = validate_schema(data, onReceiverReconSchema)
  return formatted_error(error_list)
}

const validate_schema_settle_rsf_for_json = (data: any) => {
  console.log('data of settle', data)
  const error_list = validate_schema(data, settleSchema)
  console.log('error_list of settle', formatted_error(error_list))
  return formatted_error(error_list)
}

const validate_schema_on_settle_rsf_for_json = (data: any) => {
  const error_list = validate_schema(data, onSettleSchema)
  return formatted_error(error_list)
}

const validate_schema_report_rsf_for_json = (data: any) => {
  console.log('data of report', data)
  const error_list = validate_schema(data, reportSchema)
  console.log('error_list of reporrt', formatted_error(error_list))
  return formatted_error(error_list)
}
 
const validate_schema_on_report_rsf_for_json = (data: any) => {
  const error_list = validate_schema(data, onReportSchema)
  return formatted_error(error_list)
}

const validate_schema_recon_rsf_for_json = (data: any) => {
  console.log('data of recon', data)
  const error_list = validate_schema(data, reconSchema)
  return formatted_error(error_list)
}

const validate_schema_on_recon_rsf_for_json = (data: any) => {
  const error_list = validate_schema(data, onReconSchema)
  return formatted_error(error_list)
}

export default {
  validate_schema_catalog_rejection_RET10_for_json,
  validate_schema_catalog_rejection_RET11_for_json,
  validate_schema_catalog_rejection_RET12_for_json,
  validate_schema_catalog_rejection_RET13_for_json,
  validate_schema_catalog_rejection_RET14_for_json,
  validate_schema_catalog_rejection_RET15_for_json,
  validate_schema_catalog_rejection_RET16_for_json,
  validate_schema_catalog_rejection_RET17_for_json,
  validate_schema_catalog_rejection_RET18_for_json,
  validate_schema_catalog_rejection_AGR10_for_json,
  validate_schema_catalog_rejection_RET1A_for_json,
  validate_schema_search_trv14_for_json,
  validate_schema_on_search_1_trv14_for_json,
  validate_schema_on_search_2_trv14_for_json,
  validate_schema_select_1_trv14_for_json,
  validate_schema_on_select_1_trv14_for_json,
  validate_schema_select_2_trv14_for_json,
  validate_schema_on_select_2_trv14_for_json,
  validate_schema_init_trv14_for_json,
  validate_schema_on_init_trv14_for_json,
  validate_schema_confirm_trv14_for_json,
  validate_schema_on_confirm_trv14_for_json,
  validate_schema_status_trv14_for_json,
  validate_schema_on_status_trv14_for_json,
  validate_schema_cancel_1_trv14_for_json,
  validate_schema_on_cancel_1_trv14_for_json,
  validate_schema_cancel_2_trv14_for_json,
  validate_schema_on_cancel_2_trv14_for_json,
  validate_schema_update_trv14_for_json,
  validate_schema_on_update_trv14_for_json,
  validate_schema_search_RET11_for_json,
  validate_schema_search_RET19_for_json,
  validate_schema_select_RET11_for_json,
  validate_schema_select_RET19_for_json,
  validate_schema_on_search_RET11_for_json,
  validate_schema_on_search_RET19_for_json,
  validate_schema_on_select_RET11_for_json,
  validate_schema_init_RET11_for_json,
  validate_schema_init_RET19_for_json,
  validate_schema_on_init_RET11_for_json,
  validate_schema_on_init_RET19_for_json,
  validate_schema_confirm_RET11_for_json,
  validate_schema_confirm_RET19_for_json,
  validate_schema_on_confirm_RET11_for_json,
  validate_schema_on_confirm_RET19_for_json,
  validate_schema_cancel_RET11_for_json,
  validate_schema_cancel_RET19_for_json,
  validate_schema_on_cancel_RET11_for_json,
  // validate_schema_on_cancel_RET19_for_json,
  validate_schema_track_RET11_for_json,
  validate_schema_on_track_RET11_for_json,
  validate_schema_status_RET11_for_json,
  validate_schema_on_status_RET11_for_json,
  // validate_schema_on_status_RET19_for_json,
  validate_schema_on_search_inc_RET11_for_json,
  validate_schema_on_search_inc_RET19_for_json,
  validate_schema_search_RET10_for_json,
  validate_schema_search_RET12_for_json,
  validate_schema_search_RET13_for_json,
  validate_schema_search_RET14_for_json,
  validate_schema_on_search_RET10_for_json,
  validate_schema_on_search_RET12_for_json,
  validate_schema_select_RET10_for_json,
  validate_schema_select_RET12_for_json,
  validate_schema_on_select_RET10_for_json,
  validate_schema_on_select_RET12_for_json,
  validate_schema_init_RET10_for_json,
  validate_schema_init_RET12_for_json,
  validate_schema_on_init_RET10_for_json,
  validate_schema_on_init_RET12_for_json,
  validate_schema_confirm_RET10_for_json,
  validate_schema_confirm_RET12_for_json,
  validate_schema_on_confirm_RET12_for_json,
  validate_schema_on_confirm_RET10_for_json,
  validate_schema_on_search_inc_RET10_for_json,
  validate_schema_on_search_inc_RET12_for_json,
  validate_schema_issue_igm_for_json,
  validate_schema_issue_close_igm_for_json,
  validate_schema_on_issue_igm_for_json,
  validate_schema_issue_status_igm_for_json,
  validate_schema_on_issue_status_igm_for_json,
  validate_schema_search_RET15_for_json,
  validate_schema_search_RET16_for_json,
  validate_schema_search_RET17_for_json,
  validate_schema_search_RET18_for_json,
  validate_schema_inc_search_RET10_for_json,
  validate_schema_inc_search_RET11_for_json,
  validate_schema_inc_search_RET12_for_json,
  validate_schema_inc_search_RET13_for_json,
  validate_schema_inc_search_RET14_for_json,
  validate_schema_inc_search_RET15_for_json,
  validate_schema_inc_search_RET16_for_json,
  validate_schema_inc_search_RET18_for_json,
  validate_schema_on_search_RET13_for_json,
  validate_schema_on_search_RET14_for_json,
  validate_schema_on_search_RET15_for_json,
  validate_schema_on_search_RET16_for_json,
  validate_schema_on_search_RET17_for_json,
  validate_schema_on_search_RET18_for_json,
  validate_schema_on_search_inc_RET13_for_json,
  validate_schema_on_search_inc_RET14_for_json,
  validate_schema_on_search_inc_RET15_for_json,
  validate_schema_on_search_inc_RET16_for_json,
  validate_schema_on_search_inc_RET17_for_json,
  validate_schema_on_search_inc_RET18_for_json,
  validate_schema_select_RET13_for_json,
  validate_schema_select_RET14_for_json,
  validate_schema_select_RET15_for_json,
  validate_schema_select_RET16_for_json,
  validate_schema_select_RET17_for_json,
  validate_schema_select_RET18_for_json,
  validate_schema_select_AGR10_for_json,
  validate_schema_select_RET1A_for_json,
  validate_schema_on_select_RET13_for_json,
  validate_schema_on_select_RET14_for_json,
  validate_schema_on_select_RET15_for_json,
  validate_schema_on_select_RET16_for_json,
  validate_schema_on_select_RET17_for_json,
  validate_schema_on_select_RET18_for_json,
  validate_schema_on_select_RET19_for_json,
  validate_schema_on_select_AGR10_for_json,
  validate_schema_on_select_RET1A_for_json,
  validate_schema_init_RET13_for_json,
  validate_schema_init_RET14_for_json,
  validate_schema_init_RET15_for_json,
  validate_schema_init_RET16_for_json,
  validate_schema_init_RET17_for_json,
  validate_schema_init_RET18_for_json,
  validate_schema_init_AGR10_for_json,
  validate_schema_init_RET1A_for_json,
  validate_schema_on_init_RET13_for_json,
  validate_schema_on_init_RET14_for_json,
  validate_schema_on_init_RET15_for_json,
  validate_schema_on_init_RET16_for_json,
  validate_schema_on_init_RET17_for_json,
  validate_schema_on_init_RET18_for_json,
  validate_schema_on_init_AGR10_for_json,
  validate_schema_on_init_RET1A_for_json,
  validate_schema_confirm_RET13_for_json,
  validate_schema_confirm_RET14_for_json,
  validate_schema_confirm_RET15_for_json,
  validate_schema_confirm_RET16_for_json,
  validate_schema_confirm_RET17_for_json,
  validate_schema_confirm_RET18_for_json,
  validate_schema_confirm_AGR10_for_json,
  validate_schema_confirm_RET1A_for_json,
  validate_schema_on_confirm_RET13_for_json,
  validate_schema_on_confirm_RET14_for_json,
  validate_schema_on_confirm_RET15_for_json,
  validate_schema_on_confirm_RET16_for_json,
  validate_schema_on_confirm_RET17_for_json,
  validate_schema_on_confirm_RET18_for_json,
  validate_schema_search_52110_for_json,
  validate_schema_on_confirm_AGR10_for_json,
  validate_schema_on_confirm_RET1A_for_json,
  validate_schema_on_search_52110_for_json,
  validate_schema_select_52110_for_json,
  validate_schema_on_select_52110_for_json,
  validate_schema_init_52110_for_json,
  validate_schema_on_init_52110_for_json,
  validate_schema_confirm_52110_for_json,
  validate_schema_on_confirm_52110_for_json,
  validate_schema_on_search_inc_52110_for_json,
  validate_schema_on_status_RET10_for_json,
  validate_schema_on_status_RET12_for_json,
  validate_schema_on_status_RET13_for_json,
  validate_schema_on_status_RET14_for_json,
  validate_schema_on_status_RET15_for_json,
  validate_schema_on_status_RET16_for_json,
  validate_schema_on_status_RET17_for_json,
  validate_schema_on_status_RET18_for_json,
  validate_schema_on_status_RET19_for_json,
  validate_schema_on_status_AGR10_for_json,
  validate_schema_on_status_RET1A_for_json,
  validate_schema_status_RET10_for_json,
  validate_schema_cancel_RET10_for_json,
  validate_schema_on_cancel_RET10_for_json,
  validate_schema_on_cancel_RET12_for_json,
  validate_schema_on_cancel_RET13_for_json,
  validate_schema_on_cancel_RET14_for_json,
  validate_schema_on_cancel_RET15_for_json,
  validate_schema_on_cancel_RET16_for_json,
  validate_schema_on_cancel_RET17_for_json,
  validate_schema_on_cancel_RET18_for_json,

  validate_schema_on_cancel_rto_RET10_for_json,
  validate_schema_on_cancel_rto_RET11_for_json,
  validate_schema_on_cancel_rto_RET12_for_json,
  validate_schema_on_cancel_rto_RET13_for_json,
  validate_schema_on_cancel_rto_RET14_for_json,
  validate_schema_on_cancel_rto_RET15_for_json,
  validate_schema_on_cancel_rto_RET16_for_json,
  validate_schema_on_cancel_rto_RET17_for_json,
  validate_schema_on_cancel_rto_RET18_for_json,
  validate_schema_on_cancel_rto_RET19_for_json,
  validate_schema_on_cancel_rto_AGR10_for_json,
  validate_schema_on_cancel_rto_RET1A_for_json,

  validate_schema_on_update_RET10_for_json,
  validate_schema_update_RET10_for_json,
  validate_schema_on_update_RET11_for_json,
  validate_schema_update_RET11_for_json,
  validate_schema_on_update_RET12_for_json,
  validate_schema_update_RET12_for_json,
  validate_schema_on_update_RET13_for_json,
  validate_schema_update_RET13_for_json,
  validate_schema_on_update_RET14_for_json,
  validate_schema_update_RET14_for_json,
  validate_schema_on_update_RET15_for_json,
  validate_schema_update_RET15_for_json,
  validate_schema_on_update_RET16_for_json,
  validate_schema_update_RET16_for_json,
  validate_schema_on_update_RET18_for_json,
  validate_schema_update_RET18_for_json,
  validate_schema_track_RET10_for_json,
  validate_schema_on_track_RET10_for_json,
  validate_schema_receiver_recon_rsf_for_json,
  validate_schema_on_receiver_recon_rsf_for_json,
  validate_schema_settle_rsf_for_json,
  validate_schema_on_settle_rsf_for_json,
  validate_schema_report_rsf_for_json,
  validate_schema_on_report_rsf_for_json,
  validate_schema_recon_rsf_for_json,
  validate_schema_on_recon_rsf_for_json,

  validate_schema_search_AGR10_for_json,
  validate_schema_on_search_AGR10_for_json,
  validate_schema_inc_search_AGR10_for_json,
  validate_schema_on_search_inc_AGR10_for_json,
  validate_schema_search_RET1A_for_json,
  validate_schema_on_search_RET1A_for_json,
  validate_schema_inc_search_RET1A_for_json,
  validate_schema_on_search_inc_RET1A_for_json,

  // IGM 2.0.0
  validate_schema_issue_igm2_for_json,
  validate_schema_on_issue_igm2_for_json,

  // TRV12-Airline
  validate_schema_search_TRV12_for_json,
  validate_schema_on_search_TRV12_for_json,
  validate_schema_select_TRV12_for_json,
  validate_schema_on_select_TRV12_for_json,
  validate_schema_init_TRV12_for_json,
  validate_schema_on_init_TRV12_for_json,
  validate_schema_confirm_TRV12_for_json,
  validate_schema_on_confirm_TRV12_for_json,
  validate_schema_cancel_TRV12_for_json,
  validate_schema_on_cancel_TRV12_for_json,

  //FIS14-Mutual Funds
  validate_schema_search_FIS14_for_json,
  validate_schema_on_search_FIS14_for_json,
  validate_schema_select_FIS14_for_json,
  validate_schema_on_select_FIS14_for_json,
  validate_schema_init_FIS14_for_json,
  validate_schema_on_init_FIS14_for_json,
  validate_schema_confirm_FIS14_for_json,
  validate_schema_on_confirm_FIS14_for_json,
  // validate_schema_on_status_FIS14_for_json ,
  validate_schema_on_update_FIS14_for_json,

  // FIS 12 : WCL
  validate_schema_search_FIS_WCL_for_json,
  validate_schema_on_search_FIS_WCL_for_json,
  validate_schema_select_FIS_WCL_for_json,
  validate_schema_on_select_FIS_WCL_for_json,
  validate_schema_init_FIS_WCL_for_json,
  validate_schema_on_init_FIS_WCL_for_json,
  validate_schema_confirm_FIS_WCL_for_json,
  validate_schema_on_confirm_FIS_WCL_for_json,
  validate_schema_on_status_FIS_WCL_for_json,
  validate_schema_update_FIS_WCL_for_json,
  validate_schema_on_update_FIS_WCL_for_json,
  validate_schema_on_update_foreclosure_FIS_WCL_for_json,
  validate_schema_on_update_flow_FIS_WCL_for_json,
  validate_schema_cancel_FIS_WCL_for_json,
  validate_schema_on_cancel_FIS_WCL_for_json,

  ...TRVValidator,
  ...FISValidator,
}
