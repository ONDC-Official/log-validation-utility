import _ from 'lodash'
import { logger } from '../../../../shared/logger'

export const validateRefs = (refs: any[]) => {
  const errors: any = {}
  
  try {
    logger.info('Validating refs array')
    
    if (!Array.isArray(refs)) {
      return { refs: 'refs must be an array' }
    }

    refs.forEach((ref, index) => {
      if (!ref.ref_id) {
        errors[`ref_${index}_id`] = 'ref_id is required'
      }

      if (!ref.ref_type) {
        errors[`ref_${index}_type`] = 'ref_type is required'
      }

      const validRefTypes = ['ORDER', 'PROVIDER', 'FULFILMENT', 'ITEM']
      if (!validRefTypes.includes(ref.ref_type)) {
        errors[`ref_${index}_type`] = `Invalid ref_type. Must be one of: ${validRefTypes.join(', ')}`
      }

      if (ref.tags) {
        if (!Array.isArray(ref.tags)) {
          errors[`ref_${index}_tags`] = 'tags must be an array'
        } else {
          ref.tags.forEach((tag: any, tagIndex: number) => {
            if (!tag.descriptor?.code) {
              errors[`ref_${index}_tag_${tagIndex}`] = 'tag descriptor code is required'
            }
          })
        }
      }
    })

    return errors
  } catch (error: any) {
    logger.error(`Error while validating refs: ${error.stack}`)
    return { refs_error: error.message }
  }
}
