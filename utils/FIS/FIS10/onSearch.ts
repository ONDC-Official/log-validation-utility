/* eslint-disable no-case-declarations */
/* eslint-disable no-prototype-builtins */
import { logger } from '../../../shared/logger'
import { setValue } from '../../../shared/dao'
import constants from '../../../constants'
import { validateSchema, isObjectEmpty } from '../../'
import { checkUniqueCategoryIds, validateContext, validateDescriptor } from './fisChecks'
import { validateItemsTags } from './tags'
import { isEmpty } from 'lodash'

export const checkOnSearch = (data: any, msgIdSet: any, flow: string, action: string) => {
  if (!data || isObjectEmpty(data)) {
    return { [constants.ON_SEARCH]: 'JSON cannot be empty' }
  }

  console.log('flow---------------', flow)

  const { message, context } = data
  if (!message || !context || !message.catalog || isObjectEmpty(message) || isObjectEmpty(message.catalog)) {
    return { missingFields: '/context, /message, /catalog or /message/catalog is missing or empty' }
  }

  const schemaValidation = validateSchema('FIS', constants.ON_SEARCH, data)
  const contextRes: any = validateContext(context, msgIdSet, constants.SEARCH, constants.ON_SEARCH)

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
  const offersId = new Set()
  const addOnIdSet = new Set()
  const categoriesId = new Set()
  const fulfillmentsIds = new Set()
  const fulfillmentTypes = new Set()

  // check descriptor
  try {
    logger.info(`Validating Descriptor for catalog`)
    const descriptor = onSearchCatalog?.descriptor
    // send true as last argument in case if descriptor?.code validation is needed
    const descriptorError = validateDescriptor(descriptor, constants.ON_SEARCH, `catalog.descriptor`, false, [])
    if (descriptorError) Object.assign(errorObj, descriptorError)
  } catch (error: any) {
    logger.info(`Error while validating descriptor for /${constants.ON_SEARCH}, ${error.stack}`)
  }

  // check fulfillments
  try {
    logger.info(`Checking fulfillments`)
    const fulfillments = onSearchCatalog.fulfillments

    if (isEmpty(fulfillments)) {
      errorObj['fulfillments'] = 'fulfillments array is missing or empty'
    } else {
      fulfillments.forEach((fulfillment: any, j: number) => {
        logger.info(`Validating uniqueness for id at fulfillments[${j}]...`)
        const key = `fulfillment${j}`
        if (!fulfillment?.id) {
          errorObj[`${key}.id`] = `fulfillment.id: is missing at index: ${j}`
        } else if (fulfillmentsIds.has(fulfillment.id)) {
          errorObj[`${key}.id`] = `duplicate fulfillment id: ${fulfillment.id}`
        } else {
          fulfillmentsIds.add(fulfillment.id)
        }

        if (!fulfillment?.type) {
          errorObj[`${key}.type`] = `fulfillment.type: is missing at index: ${j}`
        } else fulfillmentTypes.add(fulfillment.type)
      })
    }
  } catch (error: any) {
    logger.error(`!!Errors while checking fulfillments`)
  }

  // check providers
  try {
    logger.info(`Checking providers info in /${constants.ON_SEARCH}`)
    const bppPrvdrs = onSearchCatalog['providers']
    if (isEmpty(bppPrvdrs)) {
      errorObj['providers'] = 'providers array is missing or empty in message.catalog'
      return errorObj
    }

    bppPrvdrs?.forEach((prvdr: any, i: number) => {
      logger.info(`Validating provider object at index: ${i}`)

      // check provider id
      logger.info(`Validating uniqueness for provider id in providers[${i}]...`)
      if (!prvdr?.id) {
        errorObj[`prvdr${i}id`] = `provider.id: is missing at index: ${i}`
      } else if (prvdrsId.has(prvdr.id)) {
        errorObj[`prvdr${i}id`] = `duplicate provider id: ${prvdr.id} in providers`
      } else {
        prvdrsId.add(prvdr.id)
      }

      //check ttl
      if (!prvdr?.ttl) errorObj[`prvdr${i}ttl`] = `provider.ttl: is missing at index: ${i}`

      // Validate time if present
      if (prvdr?.time) {
        const time = prvdr?.time
        if (time?.label !== 'ENABLE')
          errorObj[`prvdr${i}.time.label`] = `label should be equal to 'ENABLE' at providers[${i}]`
      }

      // check provider Descriptor
      try {
        logger.info(`Validating Descriptor at index: ${i}`)
        const descriptor = prvdr?.descriptor
        // send true as last argument in case if descriptor?.code validation is needed
        const descriptorError = validateDescriptor(
          descriptor,
          constants.ON_SEARCH,
          `providers[${i}].descriptor`,
          false,
          [],
        )
        if (descriptorError) Object.assign(errorObj, descriptorError)
      } catch (error: any) {
        logger.info(`Error while validating descriptor for /${constants.ON_SEARCH}, ${error.stack}`)
      }

      // check provider categories
      try {
        logger.info(`Checking categories for provider (${prvdr.id})`)
        const categories = prvdr?.categories

        if (isEmpty(categories)) {
          errorObj[`prvdr${i}categories`] = 'Categories array is missing or empty in providers'
        } else {
          categories.forEach((category: any, j: number) => {
            logger.info(`Validating uniqueness for categories id in category[${j}]...`)
            if (!category?.id) {
              errorObj[`prvdr${i}.category${j}`] = `category.id: is missing at index: ${j}`
            } else if (categoriesId.has(category.id)) {
              errorObj[`prvdr${i}.category${j}`] = `duplicate category id: ${category.id} in providers[${i}]`
            } else {
              categoriesId.add(category.id)
            }

            logger.info(`Validating descriptor in providers[${i}].categories[${j}]...`)
            const descriptorError = validateDescriptor(
              category?.descriptor,
              constants.ON_SEARCH,
              `categories[${j}]`,
              true,
              [],
            )
            if (descriptorError) Object.assign(errorObj, descriptorError)
          })
        }

        setValue('categories', categories)
      } catch (error: any) {
        logger.error(`!!Errors while checking categories in providers[${i}], ${error.stack}`)
      }

      // check provider items
      try {
        logger.info(`Checking items in providers[${i}]`)
        const items = prvdr?.items

        if (isEmpty(items)) {
          errorObj[`prvdr${i}.items`] = 'items array is missing or empty in message.catalog'
        } else {
          let parentItems = 0
          items.forEach((item: any, j: number) => {
            logger.info(`Validating uniqueness for item id in providers[${i}].items[${j}]...`)
            if (!item?.id) {
              errorObj[`prvdr${i}.item${j}`] = `item.id: is missing at index: ${j}`
            } else if (itemsId.has(item.id)) {
              errorObj[`prvdr${i}.item${j}`] = `duplicate item id: ${item.id} in providers[${i}]`
            } else {
              itemsId.add(item.id)
            }

            // Validate descriptor
            const descriptorError = validateDescriptor(
              item?.descriptor,
              constants.ON_SEARCH,
              `items[${j}].descriptor`,
              false,
              [],
            )
            if (descriptorError) Object.assign(errorObj, descriptorError)

            // Validate descriptor code
            const code = item?.descriptor?.code
            if (code && (code !== 'PARENT' || code !== 'ITEM'))
              errorObj[
                `prvdr${i}.item${j}.code`
              ] = `descriptor.code should have either of PARENT or ITEM at index: ${j}`

            // price check
            if (code == 'ITEM' || item?.price) {
              const hasValue = item?.price?.value !== undefined
              const hasOfferedValue = item?.price?.offered_value !== undefined
              const hasMinValue = item?.price?.minimum_value !== undefined
              const hasMaxValue = item?.price?.maximum_value !== undefined

              if (!((hasValue && hasOfferedValue) || (hasMinValue && hasMaxValue))) {
                errorObj[
                  `prvdr${i}.item${j}.value`
                ] = `Either both item.value and item.offered_value or both item.minimum_value and item.maximum_value should be present for item ${item.id}`
              }
            }

            if (code == 'ITEM') {
              // Validate category_ids
              if (item?.category_ids) {
                const areCategoryIdsUnique = checkUniqueCategoryIds(item.category_ids, categoriesId)
                if (!areCategoryIdsUnique) {
                  const key = `prvdr${i}item${j}_category_ids`
                  errorObj[
                    key
                  ] = `category_ids value in /providers[${i}]/items[${j}] should match with id provided in categories`
                }
              }

              // Validate fulfillment_ids
              if (item?.fulfillment_ids) {
                const areFulfillmentIdsUnique = fulfillmentsIds.has(item.fulfillment_ids)
                if (!areFulfillmentIdsUnique) {
                  const key = `prvdr${i}item${j}_fulfillment_ids`
                  errorObj[
                    key
                  ] = `fulfillment_ids value in /providers[${i}]/items[${j}] should match with id provided in fulfillments`
                }
              }

              // BRAND_DETAILS tags check
              if (item?.tags) {
                item?.tags?.forEach((tag: any, l: number) => {
                  if (tag?.descriptor?.code != 'BRAND_DETAILS') {
                    errorObj[`prvdr${i}.item${j}.tags${l}`] = `tag-group name should be BRAND_DETAILS`
                  }

                  const brandNameTag = tag?.list?.find((subTag: any) => subTag?.descriptor?.code == 'BRAND_NAME')
                  if (!brandNameTag) {
                    errorObj[`prvdr${i}.item${j}.tags${l}.tag`] = `BRAND_NAME tag is missing in tag-group BRAND_DETAILS`
                  } else {
                    if (!brandNameTag?.value)
                      errorObj[`prvdr${i}.item${j}.tags${l}.value`] = `value is missing for tag BRAND_NAME`
                  }
                })
              }
            }

            // Validate parent_item_id
            if (item?.parent_item_id) {
              parentItems++

              //parent_item_id check
              if (!itemsId.has(item.parent_item_id)) {
                errorObj[
                  `prvdr${i}.parent_item_id`
                ] = `parent_item_id: ${item.parent_item_id}  doesn't match with previous item.id in providers[${i}]`
              }
            } else {
              // Validate category_ids
              if (isEmpty(item?.category_ids)) {
                errorObj[`prvdr${i}.category_ids`] = `category_ids is missing or empty at providers[${i}].items[${j}]`
              } else {
                const areCategoryIdsUnique = checkUniqueCategoryIds(item.category_ids, categoriesId)
                if (!areCategoryIdsUnique) {
                  const key = `prvdr${i}item${j}_category_ids`
                  errorObj[
                    key
                  ] = `category_ids value in /providers[${i}]/items[${j}] should match with id provided in categories`
                }
              }

              // Validate fulfillment_ids
              if (isEmpty(item?.fulfillment_ids)) {
                errorObj[
                  `prvdr${i}.fulfillment_ids`
                ] = `fulfillment_ids is missing or empty at providers[${i}].items[${j}]`
              } else {
                const areFulfillmentIdsUnique = fulfillmentsIds.has(item.fulfillment_ids)
                if (!areFulfillmentIdsUnique) {
                  const key = `prvdr${i}item${j}_fulfillment_ids`
                  errorObj[
                    key
                  ] = `fulfillment_ids value in /providers[${i}]/items[${j}] should match with id provided in fulfillments`
                }
              }

              // Validate cancellation_terms
              if (isEmpty(item?.cancellation_terms?.cancel_eligible)) {
                errorObj[`prvdr${i}.cancellation_terms`] = `cancel_eligible is missing at providers[${i}].items[${j}]`
              }

              // Validate return_terms
              if (isEmpty(item?.return_terms?.return_eligible)) {
                errorObj[`prvdr${i}.return_terms`] = `return_eligible is missing at providers[${i}].items[${j}]`
              }
            }

            // Validate Item tags
            const tagsValidation = validateItemsTags(item?.tags)
            if (!tagsValidation.isValid) {
              Object.assign(errorObj, { tags: tagsValidation.errors })
            }

            // Validate add_ons
            try {
              logger.info(`Checking add_ons`)
              if (isEmpty(item?.add_ons))
                errorObj[`prvdr${i}.item[${j}]_add_ons`] = `add_ons array is missing or empty in ${action}`
              else {
                item?.add_ons?.forEach((addOn: any, index: number) => {
                  const key = `prvdr${i}.item[${j}]_add_ons[${index}]`

                  console.log(
                    'addOn?.id------------------------------------------',
                    addOn?.id,
                    addOn?.quantity.selected,
                  )

                  if (!addOn?.id) {
                    errorObj[`${key}.id`] = `id is missing in add_ons[${index}]`
                  } else if (addOnIdSet.has(addOn?.id)) {
                    errorObj[`${key}.id`] = `duplicate provider id: ${addOn?.id} in add_ons`
                  } else {
                    addOnIdSet.add(addOn?.id)
                  }

                  if (!addOn?.descriptor?.code || !/^[A-Z_]+$/.test(addOn?.descriptor?.code))
                    errorObj[`${key}.code`] = 'code should be present in a generic enum format'

                  if (
                    !addOn?.quantity.available.count ||
                    !Number.isInteger(addOn?.quantity.available.count) ||
                    addOn?.quantity.available.count <= 0
                  ) {
                    errorObj[`${key}.code`] = 'Invalid quantity.selected count'
                  }
                })
              }

              return errorObj
            } catch (error: any) {
              logger.error(`!!Error while checking add_ons in /${action}, ${error.stack}`)
            }
          })

          if (action?.includes('_offer') && parentItems == 0)
            errorObj.parent_item_id = `sub-items not found in providers[${i}]`
          setValue('items', items)
        }
      } catch (error: any) {
        logger.error(`!!Errors while checking items in providers[${i}], ${error.stack}`)
      }

      // check provider offers
      try {
        logger.info(`Checking items in providers[${i}]`)
        const offers = prvdr?.offers

        if (!isEmpty(offers)) {
          offers.forEach((offer: any, j: number) => {
            logger.info(`Validating uniqueness for offer id in providers[${i}].offers[${j}]...`)
            if (!offer?.id) {
              errorObj[`prvdr${i}.offer${j}`] = `offer.id: is missing at index: ${j}`
            } else if (offersId.has(offer.id)) {
              errorObj[`prvdr${i}.offer${j}`] = `duplicate offer id: ${offer.id} in providers[${i}]`
            } else {
              offersId.add(offer.id)
            }

            // Validate descriptor
            const descriptorError = validateDescriptor(
              offer?.descriptor,
              constants.ON_SEARCH,
              `offers[${j}].descriptor`,
              true,
              ['DISCOUNT', 'FREEBIE', 'BXGX'],
            )
            if (descriptorError) Object.assign(errorObj, descriptorError)

            // Validate item_ids
            if (isEmpty(offer?.item_ids)) {
              errorObj[`prvdr${i}.item_ids`] = `item_ids is missing or empty at providers[${i}].offers[${j}]`
            } else {
              const areItemsIdsUnique = itemsId.has(offer.item_ids)
              if (!areItemsIdsUnique) {
                const key = `prvdr${i}offer${j}_item_ids`
                errorObj[
                  key
                ] = `item_ids value in /providers[${i}]/offers[${j}] should match with id provided in fulfillments`
              }
            }

            // Validate offer tags
            // const tagsValidation = validateOffersTags(offer?.tags)
            // if (!tagsValidation.isValid) {
            //   Object.assign(errorObj, { tags: tagsValidation.errors })
            // }
          })
        }
      } catch (error: any) {
        logger.error(`!!Errors while checking offers in providers[${i}], ${error.stack}`)
      }
    })

    setValue(`${constants.ON_SEARCH}prvdrsId`, prvdrsId)
    // setValue(`${constants.ON_SEARCH}categoryId`, categoriesId)
    setValue(`${constants.ON_SEARCH}_itemsId`, Array.from(itemsId))
    setValue(`${constants.ON_SEARCH}_offerIds`, Array.from(offersId))
    setValue(`${constants.ON_SEARCH}_addOnIdSet`, addOnIdSet)
    console.log('fulfillmentTypes11111111111111111111111111', fulfillmentTypes)
    setValue(`fulfillmentTypes`, fulfillmentTypes)
  } catch (error: any) {
    logger.error(`!!Error while checking Providers info in /${constants.ON_SEARCH}, ${error.stack}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
