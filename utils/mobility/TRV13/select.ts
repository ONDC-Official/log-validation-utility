import { logger } from '../../../shared/logger'
import { setValue } from '../../../shared/dao'
import { TRV13ApiSequence } from '../../../constants'
import { validateSchema, isObjectEmpty } from '../../../utils'
import { validateContext } from '../mobilityChecks'

export const checkSelect = (data: any, msgIdSet: any, version: any) => {
  console.log("Version", version)
  if (!data || isObjectEmpty(data)) {
    return { [TRV13ApiSequence.SELECT]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema('TRV13', TRV13ApiSequence.SELECT, data)
  const contextRes: any = validateContext(context, msgIdSet, TRV13ApiSequence.ON_SEARCH_TIME, TRV13ApiSequence.SELECT)
  setValue(`${TRV13ApiSequence.SELECT}_message`, message)
  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  const selectOrder: any = message.order

  try {
    // Provider validation
    if (!selectOrder?.provider) {
      errorObj.provider = 'provider is missing in order'
    } else {
      const provider = selectOrder.provider

      // Provider ID validation
      if (!provider?.id) {
        errorObj.provider_id = 'provider.id is missing'
      }

      // Provider time validation
      if (!provider?.time) {
        errorObj.provider_time = 'provider.time is missing'
      } else {
        if (!provider.time?.label || provider.time?.label !== 'AVAILABLE') {
          errorObj.provider_time_label = 'provider.time.label should be AVAILABLE'
        }

        if (!provider.time?.range) {
          errorObj.provider_time_range = 'provider.time.range is missing'
        } else {
          if (!provider.time.range?.start) {
            errorObj.provider_time_range_start = 'provider.time.range.start is missing'
          } else {
            const startTime = new Date(provider.time.range.start)
            if (isNaN(startTime.getTime())) {
              errorObj.provider_time_range_start = 'provider.time.range.start should be in ISO 8601 format'
            }
          }

          if (!provider.time.range?.end) {
            errorObj.provider_time_range_end = 'provider.time.range.end is missing'
          } else {
            const endTime = new Date(provider.time.range.end)
            if (isNaN(endTime.getTime())) {
              errorObj.provider_time_range_end = 'provider.time.range.end should be in ISO 8601 format'
            }
          }

          // Validate that end time is after start time
          if (provider.time.range?.start && provider.time.range?.end) {
            const startTime = new Date(provider.time.range.start)
            const endTime = new Date(provider.time.range.end)
            if (startTime >= endTime) {
              errorObj.provider_time_range = 'provider.time.range.end should be after provider.time.range.start'
            }
          }
        }
      }
    }

    // Items validation
    if (!selectOrder?.items || !Array.isArray(selectOrder.items) || selectOrder.items.length === 0) {
      errorObj.items = 'items array is missing or empty'
    } else {
      selectOrder.items.forEach((item: any, index: number) => {
        // Item ID validation
        if (!item?.id) {
          errorObj[`item_${index}_id`] = `item.id is missing at index ${index}`
        }

        // Location IDs validation
        if (!item?.location_ids || !Array.isArray(item.location_ids) || item.location_ids.length === 0) {
          errorObj[`item_${index}_location_ids`] = `item.location_ids array is missing or empty at index ${index}`
        }

        // Quantity validation
        if (!item?.quantity) {
          errorObj[`item_${index}_quantity`] = `item.quantity is missing at index ${index}`
        } else {
          if (!item.quantity?.selected) {
            errorObj[`item_${index}_quantity_selected`] = `item.quantity.selected is missing at index ${index}`
          } else {
            if (typeof item.quantity.selected?.count !== 'number') {
              errorObj[`item_${index}_quantity_selected_count`] = `item.quantity.selected.count should be a number at index ${index}`
            } else if (item.quantity.selected.count <= 0) {
              errorObj[`item_${index}_quantity_selected_count`] = `item.quantity.selected.count should be greater than 0 at index ${index}`
            }
          }
        }

        // Add-ons validation (if present)
        if (item?.add_ons) {
          if (!Array.isArray(item.add_ons)) {
            errorObj[`item_${index}_add_ons`] = `item.add_ons should be an array at index ${index}`
          } else {
            item.add_ons.forEach((addon: any, addonIndex: number) => {
              if (!addon?.id) {
                errorObj[`item_${index}_addon_${addonIndex}_id`] = `addon.id is missing at item index ${index}, addon index ${addonIndex}`
              }
            })
          }
        }
      })
    }

    // Fulfillments validation
    if (!selectOrder?.fulfillments || !Array.isArray(selectOrder.fulfillments) || selectOrder.fulfillments.length === 0) {
      errorObj.fulfillments = 'fulfillments array is missing or empty'
    } else {
      selectOrder.fulfillments.forEach((fulfillment: any, index: number) => {
        // Tags validation
        if (!fulfillment?.tags || !Array.isArray(fulfillment.tags) || fulfillment.tags.length === 0) {
          errorObj[`fulfillment_${index}_tags`] = `fulfillment.tags array is missing or empty at index ${index}`
        } else {
          fulfillment.tags.forEach((tag: any, tagIndex: number) => {
            // Tag descriptor validation
            if (!tag?.descriptor) {
              errorObj[`fulfillment_${index}_tag_${tagIndex}_descriptor`] = `tag.descriptor is missing at fulfillment index ${index}, tag index ${tagIndex}`
            } else {
              if (!tag.descriptor?.code) {
                errorObj[`fulfillment_${index}_tag_${tagIndex}_descriptor_code`] = `tag.descriptor.code is missing at fulfillment index ${index}, tag index ${tagIndex}`
              }
            }

            // Tag list validation
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
                  }
                }

                // List item value validation
                if (!listItem?.value) {
                  errorObj[`fulfillment_${index}_tag_${tagIndex}_list_${listIndex}_value`] = `listItem.value is missing at fulfillment index ${index}, tag index ${tagIndex}, list index ${listIndex}`
                } else {
                  // Validate numeric values for ADULTS and CHILDREN
                  if (listItem.descriptor?.code === 'ADULTS' || listItem.descriptor?.code === 'CHILDREN') {
                    const value = parseInt(listItem.value)
                    if (isNaN(value) || value < 0) {
                      errorObj[`fulfillment_${index}_tag_${tagIndex}_list_${listIndex}_value`] = `listItem.value should be a non-negative number for ${listItem.descriptor.code} at fulfillment index ${index}, tag index ${tagIndex}, list index ${listIndex}`
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
    logger.error(`!!Error while checking select info in /${TRV13ApiSequence.SELECT}, ${error.stack}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
