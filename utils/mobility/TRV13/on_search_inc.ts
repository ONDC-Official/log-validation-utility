import { logger } from '../../../shared/logger'
import { setValue } from '../../../shared/dao'
import { TRV13ApiSequence } from '../../../constants'
import { validateSchema, isObjectEmpty } from '../../../utils'
import { validateContext } from '../mobilityChecks'

export const checkOnSearchInc = (data: any, msgIdSet: any, version: any) => {
  console.log("Version", version)
  if (!data || isObjectEmpty(data)) {
    return { [TRV13ApiSequence.ON_SEARCH_INC]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.catalog || isObjectEmpty(message) || isObjectEmpty(message.catalog)) {
    return { missingFields: '/context, /message, /catalog or /message/catalog is missing or empty' }
  }

  const schemaValidation = validateSchema('TRV13', TRV13ApiSequence.ON_SEARCH_INC, data)
  const contextRes: any = validateContext(context, msgIdSet, TRV13ApiSequence.SEARCH_INC, TRV13ApiSequence.ON_SEARCH_INC)
  setValue(`${TRV13ApiSequence.ON_SEARCH_INC}_message`, message)
  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  const onSearchCatalog: any = message.catalog
  const prvdrsId = new Set()
  const itemsId = new Set()
  const categoriesId = new Set()
  const paymentIds = new Set()

  try {
    let i = 0
    const bppPrvdrs = onSearchCatalog?.providers
    const len = bppPrvdrs?.length

    while (i < len) {
      // Provider ID validation
      const key = `provider[${i}]`
      if (!bppPrvdrs[i]?.id) {
        errorObj[key] = `provider.id is missing for index: ${i}`
      } else if (prvdrsId.has(bppPrvdrs[i].id)) {
        errorObj[key] = `duplicate provider id: ${bppPrvdrs[i].id} in providers[${i}]`
      } else {
        prvdrsId.add(bppPrvdrs[i].id)
      }

      // Categories validation
      const categories = bppPrvdrs[i]?.categories
      if (!categories || categories.length === 0) {
        errorObj[`provider_${i}_categories`] = `categories array is missing or empty for provider ${i}`
      } else {
        categories.forEach((category: any, j: number) => {
          if (!category?.id) {
            errorObj[`provider_${i}_category_${j}_id`] = `category.id is missing at index ${j}`
          } else if (categoriesId.has(category.id)) {
            errorObj[`provider_${i}_category_${j}_id`] = `duplicate category id: ${category.id}`
          } else {
            categoriesId.add(category.id)
          }

          if (!category?.descriptor?.name) {
            errorObj[`provider_${i}_category_${j}_descriptor`] = `category.descriptor.name is missing at index ${j}`
          }
        })
      }

      // Items validation
      const items = bppPrvdrs[i]?.items
      if (!items || items.length === 0) {
        errorObj[`provider_${i}_items`] = `items array is missing or empty for provider ${i}`
      } else {
        items.forEach((item: any, j: number) => {
          if (!item?.id) {
            errorObj[`provider_${i}_item_${j}_id`] = `item.id is missing at index ${j}`
          } else if (itemsId.has(item.id)) {
            errorObj[`provider_${i}_item_${j}_id`] = `duplicate item id: ${item.id}`
          } else {
            itemsId.add(item.id)
          }

          // Item time validation
          if (!item?.time) {
            errorObj[`provider_${i}_item_${j}_time`] = `item.time is missing at index ${j}`
          } else {
            if (!item.time?.label || item.time?.label !== 'ENABLE') {
              errorObj[`provider_${i}_item_${j}_time_label`] = `item.time.label should be 'ENABLE' at index ${j}`
            }
            if (!item.time?.timestamp) {
              errorObj[`provider_${i}_item_${j}_time_timestamp`] = `item.time.timestamp is missing at index ${j}`
            }
          }

          // Item descriptor validation
          if (!item?.descriptor) {
            errorObj[`provider_${i}_item_${j}_descriptor`] = `item.descriptor is missing at index ${j}`
          } else {
            if (!item.descriptor?.name) {
              errorObj[`provider_${i}_item_${j}_descriptor_name`] = `item.descriptor.name is missing at index ${j}`
            }
            if (!item.descriptor?.code) {
              errorObj[`provider_${i}_item_${j}_descriptor_code`] = `item.descriptor.code is missing at index ${j}`
            }
            if (!item.descriptor?.additional_desc?.url) {
              errorObj[`provider_${i}_item_${j}_descriptor_additional_desc`] = `item.descriptor.additional_desc.url is missing at index ${j}`
            }
            if (!item.descriptor?.additional_desc?.content_type) {
              errorObj[`provider_${i}_item_${j}_descriptor_content_type`] = `item.descriptor.additional_desc.content_type is missing at index ${j}`
            }
            if (!item.descriptor?.images || item.descriptor.images.length === 0) {
              errorObj[`provider_${i}_item_${j}_descriptor_images`] = `item.descriptor.images array is missing or empty at index ${j}`
            } else {
              item.descriptor.images.forEach((image: any, k: number) => {
                if (!image?.url) {
                  errorObj[`provider_${i}_item_${j}_descriptor_image_${k}_url`] = `image.url is missing at index ${k}`
                }
              })
            }
          }

          // Item price validation
          if (!item?.price) {
            errorObj[`provider_${i}_item_${j}_price`] = `item.price is missing at index ${j}`
          } else {
            if (!item.price?.currency) {
              errorObj[`provider_${i}_item_${j}_price_currency`] = `item.price.currency is missing at index ${j}`
            }
            if (!item.price?.value) {
              errorObj[`provider_${i}_item_${j}_price_value`] = `item.price.value is missing at index ${j}`
            }
            if (!item.price?.maximum_value) {
              errorObj[`provider_${i}_item_${j}_price_maximum_value`] = `item.price.maximum_value is missing at index ${j}`
            }
          }

          // Item quantity validation
          if (!item?.quantity) {
            errorObj[`provider_${i}_item_${j}_quantity`] = `item.quantity is missing at index ${j}`
          } else {
            if (!item.quantity?.available?.count) {
              errorObj[`provider_${i}_item_${j}_quantity_available`] = `item.quantity.available.count is missing at index ${j}`
            }
            if (!item.quantity?.maximum?.count) {
              errorObj[`provider_${i}_item_${j}_quantity_maximum`] = `item.quantity.maximum.count is missing at index ${j}`
            }
          }

          // Item category_ids validation
          if (!item?.category_ids || item.category_ids.length === 0) {
            errorObj[`provider_${i}_item_${j}_category_ids`] = `item.category_ids array is missing or empty at index ${j}`
          } else {
            item.category_ids.forEach((catId: string) => {
              if (!categoriesId.has(catId)) {
                errorObj[`provider_${i}_item_${j}_category_ids`] = `invalid category_id: ${catId} at index ${j}`
              }
            })
          }

          // Item payment_ids validation
          if (!item?.payment_ids || item.payment_ids.length === 0) {
            errorObj[`provider_${i}_item_${j}_payment_ids`] = `item.payment_ids array is missing or empty at index ${j}`
          } else {
            item.payment_ids.forEach((payId: string) => {
              if (!paymentIds.has(payId)) {
                errorObj[`provider_${i}_item_${j}_payment_ids`] = `invalid payment_id: ${payId} at index ${j}`
              }
            })
          }

          // Item add_ons validation
          if (item?.add_ons) {
            item.add_ons.forEach((addon: any, k: number) => {
              if (!addon?.id) {
                errorObj[`provider_${i}_item_${j}_addon_${k}_id`] = `addon.id is missing at index ${k}`
              }
              if (!addon?.descriptor?.name) {
                errorObj[`provider_${i}_item_${j}_addon_${k}_descriptor_name`] = `addon.descriptor.name is missing at index ${k}`
              }
              if (!addon?.descriptor?.short_desc) {
                errorObj[`provider_${i}_item_${j}_addon_${k}_descriptor_short_desc`] = `addon.descriptor.short_desc is missing at index ${k}`
              }
              if (!addon?.price) {
                errorObj[`provider_${i}_item_${j}_addon_${k}_price`] = `addon.price is missing at index ${k}`
              } else {
                if (!addon.price?.currency) {
                  errorObj[`provider_${i}_item_${j}_addon_${k}_price_currency`] = `addon.price.currency is missing at index ${k}`
                }
                if (!addon.price?.value) {
                  errorObj[`provider_${i}_item_${j}_addon_${k}_price_value`] = `addon.price.value is missing at index ${k}`
                }
                if (!addon.price?.maximum_value) {
                  errorObj[`provider_${i}_item_${j}_addon_${k}_price_maximum_value`] = `addon.price.maximum_value is missing at index ${k}`
                }
              }
            })
          }

          // Item cancellation_terms validation
          if (item?.cancellation_terms) {
            item.cancellation_terms.forEach((term: any, k: number) => {
              if (!term?.external_ref?.url) {
                errorObj[`provider_${i}_item_${j}_cancellation_term_${k}_url`] = `cancellation_term.external_ref.url is missing at index ${k}`
              }
              if (!term?.external_ref?.mimetype) {
                errorObj[`provider_${i}_item_${j}_cancellation_term_${k}_mimetype`] = `cancellation_term.external_ref.mimetype is missing at index ${k}`
              }
            })
          }
        })
      }

      i++
    }
  } catch (error: any) {
    logger.error(`!!Error while checking Providers info in /${TRV13ApiSequence.ON_SEARCH_INC}, ${error.stack}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
