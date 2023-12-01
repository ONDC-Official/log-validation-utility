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

const ajv = new Ajv({
  allErrors: true,
  strict: 'log',
})
addFormats(ajv)
require('ajv-errors')(ajv)

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
  if (!valid) {
    error_list = validate.errors
  }

  return error_list
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
  const error_list = validate_schema(data, FnBsearchSchema)
  return formatted_error(error_list)
}
const validate_schema_search_RET13_for_json = (data: any) => {
  const error_list = validate_schema(data, FnBsearchSchema)
  return formatted_error(error_list)
}

const validate_schema_search_RET14_for_json = (data: any) => {
  const error_list = validate_schema(data, FnBsearchSchema)
  return formatted_error(error_list)
}

// On search

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

// On search Inc

const validate_schema_on_search_inc_RET10_for_json = (data: any) => {
  const error_list = validate_schema(data, FnBonSearchIncSchema)
  return formatted_error(error_list)
}
const validate_schema_on_search_inc_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, FnBonSearchIncSchema)
  return formatted_error(error_list)
}
const validate_schema_on_search_inc_RET12_for_json = (data: any) => {
  const error_list = validate_schema(data, FnBonSearchIncSchema)
  return formatted_error(error_list)
}

// select
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

// On select
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

// init
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

// On init

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

// confirm

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

// On confirm

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

const validate_schema_cancel_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, cancelSchema)
  return formatted_error(error_list)
}
const validate_schema_on_cancel_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, onCancelSchema)
  return formatted_error(error_list)
}

const validate_schema_track_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, trackSchema)
  return formatted_error(error_list)
}
const validate_schema_on_track_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, onTrackSchema)
  return formatted_error(error_list)
}
const validate_schema_status_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, statusSchema)
  return formatted_error(error_list)
}
const validate_schema_on_status_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, onStatusSchema)
  return formatted_error(error_list)
}

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

const FIS12Validator = {
  validate_schema_search_FIS12_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/search.yaml'),
  validate_schema_on_search_FIS12_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/on_search.yaml'),
  validate_schema_select_FIS12_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/select.yaml'),
  validate_schema_on_select_FIS12_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/on_select.yaml'),
  validate_schema_init_FIS12_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/init.yaml'),
  validate_schema_on_init_FIS12_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/on_init.yaml'),
  validate_schema_confirm_FIS12_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/confirm.yaml'),
  validate_schema_on_confirm_FIS12_for_json: (data: any) =>
    validate_schema_for_json(data, 'schema/FIS/on_confirm.yaml'),
  validate_schema_update_FIS12_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/update.yaml'),
  validate_schema_status_FIS12_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/status.yaml'),
  validate_schema_on_status_FIS12_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/on_status.yaml'),
  validate_schema_search_TRV10_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/search.yaml'),
  validate_schema_on_search_TRV10_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/on_search.yaml'),
  validate_schema_select_TRV10_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/select.yaml'),
  validate_schema_on_select_TRV10_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/on_select.yaml'),
  validate_schema_init_TRV10_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/init.yaml'),
  validate_schema_on_init_TRV10_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/on_init.yaml'),
  validate_schema_confirm_TRV10_for_json: (data: any) => validate_schema_for_json(data, 'schema/FIS/confirm.yaml'),
  validate_schema_on_confirm_TRV10_for_json: (data: any) =>
    validate_schema_for_json(data, 'schema/FIS/on_confirm.yaml'),
}

export default {
  validate_schema_search_RET11_for_json,
  validate_schema_select_RET11_for_json,
  validate_schema_on_search_RET11_for_json,
  validate_schema_on_select_RET11_for_json,
  validate_schema_init_RET11_for_json,
  validate_schema_on_init_RET11_for_json,
  validate_schema_confirm_RET11_for_json,
  validate_schema_on_confirm_RET11_for_json,
  validate_schema_cancel_RET11_for_json,
  validate_schema_on_cancel_RET11_for_json,
  validate_schema_track_RET11_for_json,
  validate_schema_on_track_RET11_for_json,
  validate_schema_status_RET11_for_json,
  validate_schema_on_status_RET11_for_json,
  validate_schema_on_search_inc_RET11_for_json,
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
  ...FIS12Validator,
}
