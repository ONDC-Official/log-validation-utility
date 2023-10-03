import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { FnBselectSchema } from '../schema/Retail/RET11/select'
import { FnBsearchSchema } from '../schema/Retail/RET11/search'
import { FnBonSearchSchema } from '../schema/Retail/RET11/on_search'
import { FnBonSelectSchema } from '../schema/Retail/RET11/on_select'

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

const validate_schema_search_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, FnBsearchSchema)
  return formatted_error(error_list)
}
const validate_schema_on_search_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, FnBonSearchSchema)
  return formatted_error(error_list)
}

const validate_schema_select_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, FnBselectSchema)
  return formatted_error(error_list)
}

const validate_schema_on_select_RET11_for_json = (data: any) => {
  const error_list = validate_schema(data, FnBonSelectSchema)
  return formatted_error(error_list)
}

export default {
  validate_schema_search_RET11_for_json,
  validate_schema_select_RET11_for_json,
  validate_schema_on_search_RET11_for_json,
  validate_schema_on_select_RET11_for_json,
}
