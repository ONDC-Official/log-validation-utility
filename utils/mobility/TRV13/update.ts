import { logger } from '../../../shared/logger'
import { setValue } from '../../../shared/dao'
import { TRV13ApiSequence } from '../../../constants'
import { validateSchema, isObjectEmpty } from '../../../utils'
import { validateContext } from '../mobilityChecks'

export const checkUpdate = (data: any, msgIdSet: any, version: any) => {
    console.log("Version", version)
  if (!data || isObjectEmpty(data)) {
    return { [TRV13ApiSequence.UPDATE]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema('TRV13', TRV13ApiSequence.UPDATE, data)
  const contextRes: any = validateContext(context, msgIdSet, TRV13ApiSequence.UPDATE, TRV13ApiSequence.UPDATE)
  setValue(`${TRV13ApiSequence.UPDATE}_message`, message)
  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  const updateOrder: any = message.order

  try {
    // Update target validation
    if (!message?.update_target) {
      errorObj.update_target = 'update_target is missing'
    } else {
      const validTargets = ['fulfillment', 'payment', 'item']
      if (!validTargets.includes(message.update_target)) {
        errorObj.update_target = `update_target should be one of ${validTargets.join(', ')}`
      }
    }

    // Order ID validation
    if (!updateOrder?.id) {
      errorObj.order_id = 'order.id is missing'
    }

    // Fulfillments validation
    if (!updateOrder?.fulfillments || !Array.isArray(updateOrder.fulfillments) || updateOrder.fulfillments.length === 0) {
      errorObj.fulfillments = 'fulfillments array is missing or empty'
    } else {
      updateOrder.fulfillments.forEach((fulfillment: any, index: number) => {
        // Fulfillment ID validation
        if (!fulfillment?.id) {
          errorObj[`fulfillment_${index}_id`] = `fulfillment.id is missing at index ${index}`
        }

        // Tags validation
        if (!fulfillment?.tags || !Array.isArray(fulfillment.tags) || fulfillment.tags.length === 0) {
          errorObj[`fulfillment_${index}_tags`] = `fulfillment.tags array is missing or empty at index ${index}`
        } else {
          fulfillment.tags.forEach((tag: any, tagIndex: number) => {
            // Descriptor validation
            if (!tag?.descriptor) {
              errorObj[`fulfillment_${index}_tag_${tagIndex}_descriptor`] = `tag.descriptor is missing at fulfillment index ${index}, tag index ${tagIndex}`
            } else {
              if (!tag.descriptor?.code) {
                errorObj[`fulfillment_${index}_tag_${tagIndex}_descriptor_code`] = `tag.descriptor.code is missing at fulfillment index ${index}, tag index ${tagIndex}`
              } else {
                const validCodes = ['UPDATE_REQUEST']
                if (!validCodes.includes(tag.descriptor.code)) {
                  errorObj[`fulfillment_${index}_tag_${tagIndex}_descriptor_code`] = `tag.descriptor.code should be one of ${validCodes.join(', ')} at fulfillment index ${index}, tag index ${tagIndex}`
                }
              }
            }

            // List validation
            if (!tag?.list || !Array.isArray(tag.list) || tag.list.length === 0) {
              errorObj[`fulfillment_${index}_tag_${tagIndex}_list`] = `tag.list array is missing or empty at fulfillment index ${index}, tag index ${tagIndex}`
            } else {
              tag.list.forEach((listItem: any, listIndex: number) => {
                // List item descriptor validation
                if (!listItem?.descriptor) {
                  errorObj[`fulfillment_${index}_tag_${tagIndex}_list_${listIndex}_descriptor`] = `listItem.descriptor is missing at fulfillment index ${index}, tag index ${tagIndex}, list index ${listIndex}`
                } else {
                  if (!listItem.descriptor?.code) {
                    errorObj[`fulfillment_${index}_tag_${tagIndex}_list_${listIndex}_descriptor_code`] = `listItem.descriptor.code is missing at fulfillment index ${index}, tag index ${tagIndex}, list index ${listIndex}`
                  } else {
                    const validCodes = ['contact.email', 'contact.phone', 'person.name', 'person.age', 'person.gender', 'person.dob']
                    if (!validCodes.includes(listItem.descriptor.code)) {
                      errorObj[`fulfillment_${index}_tag_${tagIndex}_list_${listIndex}_descriptor_code`] = `listItem.descriptor.code should be one of ${validCodes.join(', ')} at fulfillment index ${index}, tag index ${tagIndex}, list index ${listIndex}`
                    }
                  }
                }

                // List item value validation
                if (!listItem?.value) {
                  errorObj[`fulfillment_${index}_tag_${tagIndex}_list_${listIndex}_value`] = `listItem.value is missing at fulfillment index ${index}, tag index ${tagIndex}, list index ${listIndex}`
                } else {
                  // Validate value based on descriptor code
                  const code = listItem.descriptor.code
                  if (code === 'contact.email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    if (!emailRegex.test(listItem.value)) {
                      errorObj[`fulfillment_${index}_tag_${tagIndex}_list_${listIndex}_value`] = `contact.email should be a valid email address at fulfillment index ${index}, tag index ${tagIndex}, list index ${listIndex}`
                    }
                  } else if (code === 'contact.phone') {
                    const phoneRegex = /^[0-9]{10}$/
                    if (!phoneRegex.test(listItem.value)) {
                      errorObj[`fulfillment_${index}_tag_${tagIndex}_list_${listIndex}_value`] = `contact.phone should be a valid 10-digit phone number at fulfillment index ${index}, tag index ${tagIndex}, list index ${listIndex}`
                    }
                  } else if (code === 'person.age') {
                    const age = parseInt(listItem.value)
                    if (isNaN(age) || age < 0 || age > 120) {
                      errorObj[`fulfillment_${index}_tag_${tagIndex}_list_${listIndex}_value`] = `person.age should be a valid number between 0 and 120 at fulfillment index ${index}, tag index ${tagIndex}, list index ${listIndex}`
                    }
                  } else if (code === 'person.gender') {
                    const validGenders = ['M', 'F', 'O']
                    if (!validGenders.includes(listItem.value)) {
                      errorObj[`fulfillment_${index}_tag_${tagIndex}_list_${listIndex}_value`] = `person.gender should be one of ${validGenders.join(', ')} at fulfillment index ${index}, tag index ${tagIndex}, list index ${listIndex}`
                    }
                  } else if (code === 'person.dob') {
                    const dob = new Date(listItem.value)
                    if (isNaN(dob.getTime())) {
                      errorObj[`fulfillment_${index}_tag_${tagIndex}_list_${listIndex}_value`] = `person.dob should be a valid date at fulfillment index ${index}, tag index ${tagIndex}, list index ${listIndex}`
                    }
                  }
                }
              })
            }
          })
        }
      })
    }

  } catch (error: any) {
    logger.error(`!!Error while checking update info in /${TRV13ApiSequence.UPDATE}, ${error.stack}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
