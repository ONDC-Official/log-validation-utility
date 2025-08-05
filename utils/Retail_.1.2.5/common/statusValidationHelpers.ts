import _ from 'lodash'
import { getValue } from '../../../shared/dao'
import { logger } from '../../../shared/logger'
import { FLOW } from '../../enum'
import { ROUTING_ENUMS } from '../../../constants/fulfillmentStates'
import { PAYMENT_STATUS } from '../../../constants'

/**
 * Validates payment status for COD flows
 * @param payment - Payment object from order
 * @param flow - Current flow type
 * @param apiName - API name for error reporting
 * @returns Error object if validation fails
 */
export const validatePaymentStatus = (payment: any, flow: string, apiName: string): Record<string, string> => {
  const errors: Record<string, string> = {}
  
  try {
    if (flow === FLOW.FLOW012) {
      logger.info(`Checking payment status for COD flow in ${apiName}`)
      
      if (!payment) {
        errors.paymentMissing = `Payment object is required for COD flow (${FLOW.FLOW012}) in ${apiName}`
        return errors
      }
      
      if (payment.status !== PAYMENT_STATUS.NOT_PAID) {
        errors.paymentStatus = `Payment status should be '${PAYMENT_STATUS.NOT_PAID}' for COD flow in ${apiName}, but found '${payment.status}'`
      }
      
      if (!payment.transaction_id) {
        errors.paymentTxnId = `Payment transaction_id is required for COD flow in ${apiName}`
      }
    }
  } catch (error: any) {
    logger.error(`Error validating payment status in ${apiName}: ${error.stack}`)
    errors.paymentValidationError = `Error validating payment status: ${error.message}`
  }
  
  return errors
}

/**
 * Validates provider credentials for digital lending flows
 * @param provider - Provider object from order
 * @param flow - Current flow type
 * @param apiName - API name for error reporting
 * @returns Error object if validation fails
 */
export const validateProviderCredentials = (provider: any, flow: string, apiName: string): Record<string, string> => {
  const errors: Record<string, string> = {}
  
  try {
    if (flow === FLOW.FLOW017) {
      logger.info(`Checking provider credentials for digital lending flow in ${apiName}`)
      
      const credsWithProviderId = getValue('credsWithProviderId')
      if (!credsWithProviderId) {
        logger.warn(`No stored provider credentials found for comparison in ${apiName}`)
        return errors
      }
      
      if (!provider?.cred) {
        errors.providerCredsMissing = `Provider credentials are required for digital lending flow (${FLOW.FLOW017}) in ${apiName}`
        return errors
      }
      
      const storedCreds = credsWithProviderId[provider.id]
      if (storedCreds && !_.isEqual(storedCreds, provider.cred)) {
        errors.providerCredsMismatch = `Provider credentials mismatch with /on_search in ${apiName}`
      }
    }
  } catch (error: any) {
    logger.error(`Error validating provider credentials in ${apiName}: ${error.stack}`)
    errors.providerCredsError = `Error validating provider credentials: ${error.message}`
  }
  
  return errors
}

/**
 * Validates fulfillment object consistency
 * @param currentFulfillment - Current fulfillment object
 * @param storedFulfillment - Previously stored fulfillment object
 * @param apiName - API name for error reporting
 * @returns Error object if validation fails
 */
export const validateFulfillmentConsistency = (
  currentFulfillment: any, 
  storedFulfillment: any, 
  apiName: string
): Record<string, string> => {
  const errors: Record<string, string> = {}
  
  try {
    if (!storedFulfillment) {
      logger.info(`No stored fulfillment found for comparison in ${apiName}`)
      return errors
    }
    
    // Validate GPS consistency
    if (currentFulfillment.start?.location?.gps && storedFulfillment.start?.location?.gps) {
      if (!_.isEqual(currentFulfillment.start.location.gps, storedFulfillment.start.location.gps)) {
        errors[`fulfillmentGPS[${currentFulfillment.id}]`] = 
          `Start location GPS mismatch in ${apiName}. Expected: ${storedFulfillment.start.location.gps}, Found: ${currentFulfillment.start.location.gps}`
      }
    }
    
    // Validate area code consistency
    if (currentFulfillment.end?.location?.address?.area_code) {
      const buyerAreaCode = getValue('buyerAddr')
      if (buyerAreaCode && currentFulfillment.end.location.address.area_code !== buyerAreaCode) {
        errors[`fulfillmentAreaCode[${currentFulfillment.id}]`] = 
          `End location area code mismatch in ${apiName}. Expected: ${buyerAreaCode}, Found: ${currentFulfillment.end.location.address.area_code}`
      }
    }
    
    // Validate provider name consistency
    if (currentFulfillment['@ondc/org/provider_name'] && storedFulfillment['@ondc/org/provider_name']) {
      if (currentFulfillment['@ondc/org/provider_name'] !== storedFulfillment['@ondc/org/provider_name']) {
        errors[`fulfillmentProviderName[${currentFulfillment.id}]`] = 
          `Provider name mismatch in ${apiName}. Expected: ${storedFulfillment['@ondc/org/provider_name']}, Found: ${currentFulfillment['@ondc/org/provider_name']}`
      }
    }
    
    // Validate TAT consistency
    if (currentFulfillment['@ondc/org/TAT'] && storedFulfillment['@ondc/org/TAT']) {
      if (currentFulfillment['@ondc/org/TAT'] !== storedFulfillment['@ondc/org/TAT']) {
        errors[`fulfillmentTAT[${currentFulfillment.id}]`] = 
          `TAT mismatch in ${apiName}. Expected: ${storedFulfillment['@ondc/org/TAT']}, Found: ${currentFulfillment['@ondc/org/TAT']}`
      }
    }
  } catch (error: any) {
    logger.error(`Error validating fulfillment consistency in ${apiName}: ${error.stack}`)
    errors.fulfillmentConsistencyError = `Error validating fulfillment consistency: ${error.message}`
  }
  
  return errors
}

/**
 * Validates routing tag structure in fulfillment
 * @param fulfillment - Fulfillment object containing routing tags
 * @param expectedRouting - Expected routing type (P2P/P2H2P)
 * @param apiName - API name for error reporting
 * @returns Error object if validation fails
 */
export const validateRoutingTagStructure = (
  fulfillment: any, 
  expectedRouting: string | null,
  apiName: string
): Record<string, string> => {
  const errors: Record<string, string> = {}
  
  try {
    if (!fulfillment.tags || !Array.isArray(fulfillment.tags)) {
      errors.routingTagMissing = `Routing tags are required in fulfillment for ${apiName}`
      return errors
    }
    
    const routingTag = fulfillment.tags.find((tag: any) => tag.code === 'routing')
    if (!routingTag) {
      errors.routingTagNotFound = `Routing tag with code 'routing' not found in fulfillment tags for ${apiName}`
      return errors
    }
    
    if (!routingTag.list || !Array.isArray(routingTag.list)) {
      errors.routingTagListMissing = `Routing tag list is required for ${apiName}`
      return errors
    }
    
    const routingTypeTag = routingTag.list.find((item: any) => item.code === 'type')
    if (!routingTypeTag) {
      errors.routingTypeTagMissing = `Routing type tag with code 'type' not found in routing tag list for ${apiName}`
      return errors
    }
    
    if (!routingTypeTag.value) {
      errors.routingTypeValueMissing = `Routing type value is required for ${apiName}`
      return errors
    }
    
    if (!ROUTING_ENUMS.includes(routingTypeTag.value)) {
      errors.invalidRoutingType = 
        `Invalid routing type '${routingTypeTag.value}' in ${apiName}. Must be one of: ${ROUTING_ENUMS.join(', ')}`
    }
    
    if (expectedRouting && routingTypeTag.value !== expectedRouting) {
      errors.routingTypeMismatch = 
        `Routing type mismatch in ${apiName}. Expected: ${expectedRouting}, Found: ${routingTypeTag.value}`
    }
  } catch (error: any) {
    logger.error(`Error validating routing tag structure in ${apiName}: ${error.stack}`)
    errors.routingTagError = `Error validating routing tag structure: ${error.message}`
  }
  
  return errors
}

/**
 * Validates state transitions based on allowed sequences
 * @param previousState - Previous fulfillment state
 * @param currentState - Current fulfillment state
 * @param allowedTransitions - Map of allowed state transitions
 * @param apiName - API name for error reporting
 * @returns Error object if validation fails
 */
export const validateStateTransition = (
  previousState: string | null,
  currentState: string,
  allowedTransitions: Record<string, string[]>,
  apiName: string
): Record<string, string> => {
  const errors: Record<string, string> = {}
  
  try {
    if (!previousState) {
      logger.info(`No previous state stored for transition validation in ${apiName}`)
      return errors
    }
    
    const allowedStates = allowedTransitions[previousState]
    if (!allowedStates) {
      logger.warn(`No transition rules defined for state '${previousState}' in ${apiName}`)
      return errors
    }
    
    if (!allowedStates.includes(currentState)) {
      errors.invalidStateTransition = 
        `Invalid state transition in ${apiName}. Cannot transition from '${previousState}' to '${currentState}'. ` +
        `Allowed transitions: ${allowedStates.join(', ')}`
    }
  } catch (error: any) {
    logger.error(`Error validating state transition in ${apiName}: ${error.stack}`)
    errors.stateTransitionError = `Error validating state transition: ${error.message}`
  }
  
  return errors
}

/**
 * Validates order updated_at timestamp
 * @param orderUpdatedAt - Order updated_at timestamp
 * @param contextTimestamp - Context timestamp
 * @param previousUpdatedAt - Previous updated_at timestamp if available
 * @param apiName - API name for error reporting
 * @returns Error object if validation fails
 */
export const validateOrderUpdatedAt = (
  orderUpdatedAt: string,
  contextTimestamp: string,
  previousUpdatedAt: string | null,
  apiName: string
): Record<string, string> => {
  const errors: Record<string, string> = {}
  
  try {
    if (!orderUpdatedAt) {
      errors.updatedAtMissing = `order.updated_at is required in ${apiName}`
      return errors
    }
    
    // Check if updated_at <= context timestamp
    if (new Date(orderUpdatedAt) > new Date(contextTimestamp)) {
      errors.updatedAtFuture = 
        `order.updated_at timestamp should be less than or equal to context timestamp in ${apiName}`
    }
    
    // Check if updated_at >= previous updated_at
    if (previousUpdatedAt && new Date(orderUpdatedAt) < new Date(previousUpdatedAt)) {
      errors.updatedAtPast = 
        `order.updated_at timestamp should be greater than or equal to previous updated_at in ${apiName}`
    }
  } catch (error: any) {
    logger.error(`Error validating order.updated_at in ${apiName}: ${error.stack}`)
    errors.updatedAtError = `Error validating order.updated_at: ${error.message}`
  }
  
  return errors
}