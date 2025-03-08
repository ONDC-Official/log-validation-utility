import _ from 'lodash'
import { logger } from '../../../../shared/logger'

export const validateActors = (actors: any[], flow: any) => {
  const errors: any = {}
  console.log("flow", flow)
  try {
    logger.info('Validating actors array')

    if (!Array.isArray(actors)) {
      return { actors: 'actors must be an array' }
    }

    actors.forEach((actor, index) => {
      

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
