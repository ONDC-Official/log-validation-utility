import _ from 'lodash'
import { getValue, setValue } from '../../../../shared/dao'
import { logger } from 'shared/logger'

export const validateContext = (context: any) => {
  const contextErrors: any = {}
  const errorObj: any = {}
  
  try {
    if (!context) {
      return { valid: false, ERRORS: { context: 'Context is required' } }
    }

    // Required fields in context
    const requiredFields = [
      'domain', 'action', 'core_version', 'bap_id', 'bap_uri', 
      'bpp_id', 'bpp_uri', 'transaction_id', 'message_id', 'timestamp'
    ]

    // Check for missing required fields
    requiredFields.forEach(field => {
      if (!context[field]) {
        contextErrors[field] = `${field} is missing in context`
      }
    })

    // Validate domain for IGM
    if (context.domain && !context.domain.startsWith('ONDC:')) {
      contextErrors.domain = `Domain ${context.domain} should start with "ONDC:"`
    }

    // Validate action matches the API
    if (context.action !== 'issue') {
      contextErrors.action = `Action should be "issue" for issue API, found ${context.action}`
    }

    // Validate core_version format (x.y.z)
    if (context.core_version && !/^\d+\.\d+\.\d+$/.test(context.core_version)) {
      contextErrors.core_version = `Invalid core_version format: ${context.core_version}`
    }

    // Validate timestamp format
    if (context.timestamp) {
      try {
        const date = new Date(context.timestamp)
        if (isNaN(date.getTime())) {
          contextErrors.timestamp = `Invalid timestamp: ${context.timestamp}`
        }
      } catch (error) {
        contextErrors.timestamp = `Invalid timestamp: ${context.timestamp}`
      }
    }

    // Check for duplicate message_id using getValue/setValue
    if (context.message_id) {
      const msgIds = getValue('msgIds') || []
      if (msgIds.includes(context.message_id)) {
        contextErrors.message_id = `Duplicate message_id: ${context.message_id}`
      } else {
        msgIds.push(context.message_id)
        setValue('msgIds', msgIds)
      }
    }

    // Check if transaction_id is consistent across calls
    const txnId = getValue('txnId')
    if (txnId && txnId !== context.transaction_id) {
      contextErrors.transaction_id = `Transaction ID mismatch: expected ${txnId}, found ${context.transaction_id}`
    } else if (!txnId && context.transaction_id) {
      setValue('txnId', context.transaction_id)
    }

    // Validate location if present
    if (context.location) {
      if (context.location.country && !context.location.country.code) {
        contextErrors.location_country_code = 'Location country code is missing'
      }
      if (context.location.city && !context.location.city.code) {
        contextErrors.location_city_code = 'Location city code is missing'
      }
    }

    // Check ttl format if present (should be ISO 8601 duration format)
    if (context.ttl && !/^P(?!$)(\d+Y)?(\d+M)?(\d+W)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?$/.test(context.ttl)) {
      contextErrors.ttl = `Invalid ttl format: ${context.ttl}`
    }

    return {
      valid: Object.keys(contextErrors).length === 0,
      ERRORS: contextErrors
    }
  } catch (error: any) {
    logger.error(`Error while validating context for issue: ${error.stack}`)
    errorObj.error = error.message
    return { valid: false, ERRORS: errorObj }
  }
}
