import _ from 'lodash'
import { logger } from '../../../../shared/logger'

// Define mandatory ref types for each flow
const MANDATORY_REF_TYPES = {
  FLOW_1: ['ORDER', 'PROVIDER', 'FULFILMENT', 'ITEM'], // ITEM flow
  FLOW_2: ['TRANSACTION', 'PROVIDER'], // SELLER flow
  FLOW_3: ['ORDER', 'PROVIDER', 'FULFILMENT'] // FULFILLMENT flow
}

export const validateRefs = (refs: any[], flow: any) => {
  const errors: any = {}
  console.log("flow", flow)
  try {
    logger.info('Validating refs array')
    
    if (!Array.isArray(refs)) {
      return { refs: 'refs must be an array' }
    }

    // Check for mandatory ref types based on flow
    if (flow) {
      const flowKey = `${flow}` as keyof typeof MANDATORY_REF_TYPES;
      if (MANDATORY_REF_TYPES[flowKey]) {
        const mandatoryTypes = MANDATORY_REF_TYPES[flowKey];
        // Check both 'type' and 'ref_type' properties
        const existingTypes = refs.map(ref => ref.type || ref.ref_type);
        
        // Check if all mandatory types exist
        const missingTypes = mandatoryTypes.filter(type => !existingTypes.includes(type));
        if (missingTypes.length > 0) {
          // Create specific error messages for each missing type
          missingTypes.forEach(missingType => {
            errors[`missing_ref_${missingType.toLowerCase()}`] = 
              `Reference type '${missingType}' is mandatory for ${flowKey} but is missing`;
          });
        }
      }
    }

    refs.forEach((ref, index) => {
      // Validate ref type (check both 'type' and 'ref_type')
      if (!ref.type && !ref.ref_type) {
        errors[`ref_${index}_type`] = 'ref type is required';
      }

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
