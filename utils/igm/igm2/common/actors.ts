import _ from 'lodash'
import { logger } from '../../../../shared/logger'

export const validateActors = (actors: any[]) => {
  const errors: any = {}

  try {
    logger.info('Validating actors array')

    if (!Array.isArray(actors)) {
      return { actors: 'actors must be an array' }
    }

    actors.forEach((actor, index) => {
      if (!actor.id) {
        errors[`actor_${index}_id`] = 'actor id is required'
      }

      if (!actor.type) {
        errors[`actor_${index}_type`] = 'actor type is required'
      }

      const validTypes = [
        'CONSUMER',
        'INTERFACING_NP',
        'COUNTERPARTY_NP',
        'PROVIDER',
        'AGENT',
        'INTERFACING_NP_GRO',
        'COUNTERPARTY_NP_GRO',
        'CASCADED_NP_GRO',
        'CASCADED_NP',
      ]
      if (!validTypes.includes(actor.type)) {
        errors[`actor_${index}_type`] = `Invalid actor type. Must be one of: ${validTypes.join(', ')}`
      }

      if (actor.info) {
        if (actor.info.org && !actor.info.org.name) {
          errors[`actor_${index}_org_name`] = 'org name is required'
        }

        if (actor.info.person && !actor.info.person.name) {
          errors[`actor_${index}_person_name`] = 'person name is required'
        }

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
