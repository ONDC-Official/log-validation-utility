import _ from 'lodash'
import { logger } from '../../../../shared/logger'

export const validateRefs = (refs: any[], flow: any) => {
  const errors: any = {}
  console.log("flow", flow)
  try {
    logger.info('Validating refs array')
    
    if (!Array.isArray(refs)) {
      return { refs: 'refs must be an array' }
    }

    refs.forEach((ref, index) => {

      if (ref.tags) {
        if (!Array.isArray(ref.tags)) {
          errors[`ref_${index}_tags`] = 'tags must be an array'
        } else {
          ref.tags.forEach((tag: any, tagIndex: number) => {
            if (tag.descriptor?.code !== 'message.order.items') {
              errors[`ref_${index}_tag_${tagIndex}`] = 'tag descriptor code must be message.order.items'
            }
            
            // Check list items
            if (tag.list && Array.isArray(tag.list)) {
              tag.list.forEach((listItem: any, listItemIndex: number) => {
                if (listItem.descriptor?.code !== 'quantity.selected.count') {
                  errors[`ref_${index}_tag_${tagIndex}_list_${listItemIndex}`] = 'list item descriptor code must be quantity.selected.count'
                }
              });
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
