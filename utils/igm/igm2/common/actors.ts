import _ from 'lodash'
import { logger } from '../../../../shared/logger'
import { IGM2Flows } from '../../../../utils/constants/index'


export const validateActors = (actors: any[], context: any, flow: any) => {
  const errors: any = {}
  try {
    logger.info('Validating actors array')

    if (!Array.isArray(actors)) {
      return { actors: 'actors must be an array' }
    }

    actors.forEach((actor, index) => {
      // Check actor type
      if (!actor.type) {
        errors[`actor_${index}_type`] = 'actor type is required'
      }
      
      // Check actor info
      if (!actor.info) {
        errors[`actor_${index}_info`] = 'actor info is required'
      } else {
        // Check org
        if (!actor.info.org) {
          errors[`actor_${index}_info_org`] = 'actor info.org is required'
        } else if (!actor.info.org.name) {
          errors[`actor_${index}_info_org_name`] = 'actor info.org.name is required'
        } else if (flow === IGM2Flows.FLOW_1) {
          const expectedFormat = getExpectedOrgNameFormat(actor.type, context);
          
          if (expectedFormat && actor.info.org.name !== expectedFormat) {
            errors[`actor_${index}_info_org_name`] = 
              `For actor type "${actor.type}", org.name should be "${expectedFormat}" (context.bap_id::context.domain)`
          }
        }
      }
      
      if (actor.info) {
        
        if (actor.info.contact) {
          const contact = actor.info.contact
          if (contact.phone && !_.inRange(parseInt(contact.phone), 1000000000, 9999999999)) {
            errors[`actor_${index}_phone`] = 'Invalid phone number format'
          }
          if (contact.email && !contact.email.includes('@')) {
            errors[`actor_${index}_email`] = 'Invalid email format'
          }
        }
      }
    })

    return errors
  } catch (error: any) {
    logger.error(`Error while validating actors: ${error.stack}`)
    return { actors_error: error.message }
  }
}

// Helper function to determine the expected org.name format based on actor type
function getExpectedOrgNameFormat(actorType: string, context: any): string | null {
  if (!context || !context.domain) {
    return null;
  }
  
  switch (actorType) {
    case 'CONSUMER':
    case 'INTERFACING_NP':
      return context.bap_id ? `${context.bap_id}::${context.domain}` : null;
      
    case 'COUNTERPARTY_NP':
    case 'COUNTERPARTY_NP_GRO':
      return context.bpp_id ? `${context.bpp_id}::${context.domain}` : null;
      
    default:
      return null;
  }
}
