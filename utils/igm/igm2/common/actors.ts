import _ from 'lodash'
import { logger } from '../../../../shared/logger'
import { IGM2Flows } from '../../../../utils/constants/index'

/**
 * Validates the actors array according to IGM2 specifications
 * @param actors - Array of actor objects to validate
 * @param context - Context object containing domain, bap_id, bpp_id
 * @param flow - The IGM2 flow type (FLOW_1, FLOW_2, FLOW_3)
 * @returns Object containing validation errors, if any
 */
export const validateActors = (actors: any[], context: any, flow: any) => {
  const errors: Record<string, string> = {}
  try {
    logger.info('Validating actors array')

    if (!Array.isArray(actors)) {
      return { actors: 'actors must be an array' }
    }

    actors.forEach((actor, index) => {
      validateActorType(actor, index, errors)
      validateActorInfo(actor, index, context, flow, errors)
      validateContactDetails(actor, index, errors)
    })

    return errors
  } catch (error: any) {
    logger.error(`Error while validating actors: ${error.stack}`)
    return { actors_error: error.message }
  }
}

/**
 * Validates actor type
 */
function validateActorType(actor: any, index: number, errors: Record<string, string>): void {
  if (!actor.type) {
    errors[`actor_${index}_type`] = 'actor type is required'
  }
}

/**
 * Validates actor info including organization details
 */
function validateActorInfo(
  actor: any, 
  index: number, 
  context: any, 
  flow: string, 
  errors: Record<string, string>
): void {
  if (!actor.info) {
    errors[`actor_${index}_info`] = 'actor info is required'
    return
  }
  
  validateOrgDetails(actor, index, context, flow, errors)
}

/**
 * Validates organization details within actor info
 */
function validateOrgDetails(
  actor: any, 
  index: number, 
  context: any, 
  flow: string, 
  errors: Record<string, string>
): void {
  if (!actor.info.org) {
    errors[`actor_${index}_info_org`] = 'actor info.org is required'
    return
  }
  
  if (!actor.info.org.name) {
    errors[`actor_${index}_info_org_name`] = 'actor info.org.name is required'
    return
  }
  
  if ([IGM2Flows.FLOW_1, IGM2Flows.FLOW_2, IGM2Flows.FLOW_3].includes(flow)) {
    const expectedFormat = getExpectedOrgNameFormat(actor.type, context, flow)
    
    if (expectedFormat && actor.info.org.name !== expectedFormat) {
      errors[`actor_${index}_info_org_name`] = 
        `For actor type "${actor.type}" in ${flow}, org.name should be "${expectedFormat}"`
    }
  }
}

/**
 * Validates contact details if present
 */
function validateContactDetails(actor: any, index: number, errors: Record<string, string>): void {
  if (!actor.info || !actor.info.contact) {
    return
  }
  
  const contact = actor.info.contact
  
  if (contact.phone && !_.inRange(parseInt(contact.phone), 1000000000, 9999999999)) {
    errors[`actor_${index}_phone`] = 'Invalid phone number format'
  }
  
  if (contact.email && !contact.email.includes('@')) {
    errors[`actor_${index}_email`] = 'Invalid email format'
  }
}

/**
 * Determines the expected organization name format based on actor type and flow
 * @param actorType - Type of the actor (CONSUMER, INTERFACING_NP, etc.)
 * @param context - Context object containing domain, bap_id, bpp_id
 * @param flow - The IGM2 flow type
 * @returns Expected format string or null if format cannot be determined
 */
function getExpectedOrgNameFormat(actorType: string, context: any, flow: string): string | null {
  if (!context || !context.domain) {
    return null
  }
  
  const bapIdFormat = context.bap_id ? `${context.bap_id}::${context.domain}` : null
  const bppIdFormat = context.bpp_id ? `${context.bpp_id}::${context.domain}` : null
  
  if (!bapIdFormat || !bppIdFormat) {
    return null
  }
  
  return getFormatByFlowAndActorType(flow, actorType, bapIdFormat, bppIdFormat)
}

/**
 * Gets the expected format based on flow type and actor type
 */
function getFormatByFlowAndActorType(
  flow: string, 
  actorType: string, 
  bapIdFormat: string, 
  bppIdFormat: string
): string | null {
  switch (flow) {
    case IGM2Flows.FLOW_1:
      return getFlow1Format(actorType, bapIdFormat, bppIdFormat)
      
    case IGM2Flows.FLOW_2:
      return getFlow2Format(actorType, bapIdFormat, bppIdFormat)
      
    case IGM2Flows.FLOW_3:
      return getFlow3Format(actorType, bapIdFormat, bppIdFormat)
      
    default:
      return null
  }
}

/**
 * Gets the expected format for FLOW_1
 */
function getFlow1Format(actorType: string, bapIdFormat: string, bppIdFormat: string): string | null {
  switch (actorType) {
    case 'CONSUMER':
    case 'INTERFACING_NP':
      return bapIdFormat
    case 'COUNTERPARTY_NP':
    case 'COUNTERPARTY_NP_GRO':
      return bppIdFormat
    default:
      return null
  }
}

/**
 * Gets the expected format for FLOW_2
 */
function getFlow2Format(actorType: string, bapIdFormat: string, bppIdFormat: string): string | null {
  switch (actorType) {
    case 'SELLER':
    case 'INTERFACING_NP':
      return bppIdFormat
    case 'COUNTERPARTY_NP':
    case 'COUNTERPARTY_NP_GRO':
      return bapIdFormat
    default:
      return null
  }
}

/**
 * Gets the expected format for FLOW_3
 */
function getFlow3Format(actorType: string, bapIdFormat: string, bppIdFormat: string): string | null {
  switch (actorType) {
    case 'CONSUMER':
    case 'INTERFACING_NP':
      return bapIdFormat
    case 'COUNTERPARTY_NP':
    case 'COUNTERPARTY_NP_GRO':
      return bppIdFormat
    default:
      return null
  }
}
