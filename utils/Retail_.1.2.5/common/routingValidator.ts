import { logger } from '../../../shared/logger'
import { 
  ROUTING_ENUMS, 
  getAllowedStatesForRouting, 
  getRequiredStatesForRouting,
  getForbiddenStatesForRouting,
  STATE_TRANSITIONS 
} from '../../../constants/fulfillmentStates'

/**
 * Extract routing type from fulfillments array
 * @param fulfillments - Array of fulfillment objects
 * @returns Routing type (P2P/P2H2P) or null if not found
 */
export const extractRoutingType = (fulfillments: any[]): string | null => {
  try {
    if (!fulfillments || !Array.isArray(fulfillments) || fulfillments.length === 0) {
      logger.debug('extractRoutingType: fulfillments is not a valid array or is empty')
      return null
    }

    // Find delivery fulfillment
    const deliveryFulfillment = fulfillments.find(f => f && f.type === 'Delivery')
    if (!deliveryFulfillment) {
      logger.debug('extractRoutingType: no delivery fulfillment found')
      return null
    }

    if (!deliveryFulfillment.tags || !Array.isArray(deliveryFulfillment.tags)) {
      logger.debug('extractRoutingType: no tags found in delivery fulfillment')
      return null
    }

    // Find routing tag
    const routingTag = deliveryFulfillment.tags.find((tag: any) => tag && tag.code === 'routing')
    if (!routingTag) {
      logger.debug('extractRoutingType: no routing tag found')
      return null
    }

    if (!routingTag.list || !Array.isArray(routingTag.list) || routingTag.list.length === 0) {
      logger.debug('extractRoutingType: routing tag list is not valid or empty')
      return null
    }

    // Find routing type value
    const routingTypeTag = routingTag.list.find((item: any) => item && item.code === 'type')
    if (!routingTypeTag) {
      logger.debug('extractRoutingType: no routing type tag found')
      return null
    }

    if (!routingTypeTag.value) {
      logger.debug('extractRoutingType: routing type value is empty')
      return null
    }

    logger.debug(`extractRoutingType: found routing type: ${routingTypeTag.value}`)
    return routingTypeTag.value
  } catch (error) {
    logger.error('Error extracting routing type:', error)
    return null
  }
}

/**
 * Get default routing type based on domain
 * @param domain - Domain code (e.g., RET11, RET12)
 * @returns Default routing type
 */
export const getDefaultRouting = (domain: string): string => {
  // RET11 (Food & Beverage) defaults to P2P, all others default to P2H2P
  return domain === 'RET11' ? 'P2P' : 'P2H2P'
}

/**
 * Validate if a fulfillment state is valid for the given routing type
 * @param state - Fulfillment state
 * @param routing - Routing type (P2P/P2H2P)
 * @returns true if valid, false otherwise
 */
export const validateStateForRouting = (state: string, routing: string): boolean => {
  if (!ROUTING_ENUMS.includes(routing)) {
    return false
  }

  const allowedStates = getAllowedStatesForRouting(routing)
  return allowedStates.includes(state)
}

/**
 * Check if a state is forbidden for the given routing type
 * @param state - Fulfillment state
 * @param routing - Routing type (P2P/P2H2P)
 * @returns true if forbidden, false otherwise
 */
export const isStateForbiddenForRouting = (state: string, routing: string): boolean => {
  if (!ROUTING_ENUMS.includes(routing)) {
    return false
  }

  const forbiddenStates = getForbiddenStatesForRouting(routing)
  return forbiddenStates.includes(state)
}

/**
 * Validate state transition is valid
 * @param prevState - Previous state
 * @param currentState - Current state
 * @param routing - Routing type
 * @returns Error message if invalid, null if valid
 */
export const validateStateTransition = (
  prevState: string, 
  currentState: string, 
  routing: string
): string | null => {
  // First check if the current state is valid for routing
  if (!validateStateForRouting(currentState, routing)) {
    if (isStateForbiddenForRouting(currentState, routing)) {
      return `Fulfillment state '${currentState}' is not allowed for ${routing} routing`
    }
    return `Invalid fulfillment state '${currentState}' for ${routing} routing`
  }

  // Check if transition is valid
  const validTransitions = (STATE_TRANSITIONS as Record<string, string[]>)[prevState]
  if (!validTransitions) {
    return `Unknown previous state: ${prevState}`
  }

  if (!validTransitions.includes(currentState)) {
    return `Invalid state transition from '${prevState}' to '${currentState}'`
  }

  return null
}

/**
 * Get the expected next states for a given state
 * @param currentState - Current fulfillment state
 * @param routing - Routing type
 * @returns Array of valid next states
 */
export const getValidNextStates = (currentState: string, routing: string): string[] => {
  const possibleTransitions = (STATE_TRANSITIONS as Record<string, string[]>)[currentState] || []
  const allowedStates = getAllowedStatesForRouting(routing)
  
  // Filter transitions to only include states allowed for this routing type
  return possibleTransitions.filter((state: string) => allowedStates.includes(state))
}

/**
 * Validate routing type value
 * @param routing - Routing type to validate
 * @returns true if valid, false otherwise
 */
export const isValidRoutingType = (routing: string): boolean => {
  return ROUTING_ENUMS.includes(routing)
}

/**
 * Check if all required states are present in the flow
 * @param states - Array of states that occurred in the flow
 * @param routing - Routing type
 * @returns Array of missing required states
 */
export const getMissingRequiredStates = (states: string[], routing: string): string[] => {
  const requiredStates = getRequiredStatesForRouting(routing)
  return requiredStates.filter(state => !states.includes(state))
}