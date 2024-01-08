/* eslint-disable no-case-declarations */
/* eslint-disable no-prototype-builtins */
import { logger } from '../../../shared/logger'
import { setValue, getValue } from '../../../shared/dao'
import constants, { FisApiSequence, fisFlows } from '../../../constants'
import { validateSchema, isObjectEmpty } from '../../'
import { checkUniqueCategoryIds, validateContext, validateXInput } from './fisChecks'
import { validateProviderTags, validatePaymentTags, validateItemsTags } from './tags'

export const checkOnSearch = (data: any, msgIdSet: any, flow: string) => {
  if (!data || isObjectEmpty(data)) {
    return { [FisApiSequence.ON_SEARCH]: 'Json cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.catalog || isObjectEmpty(message) || isObjectEmpty(message.catalog)) {
    return { missingFields: '/context, /message, /catalog or /message/catalog is missing or empty' }
  }

  const schemaValidation = validateSchema(data?.context?.domain.split(':')[1], constants.ON_SEARCH, data)
  const contextRes: any = validateContext(context, msgIdSet, constants.SEARCH, constants.ON_SEARCH)

  setValue(`${FisApiSequence.ON_SEARCH}_message`, message)
  setValue(`${FisApiSequence.ON_SEARCH}`, data)
  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  const onSearchCatalog: any = message.catalog
  const prvdrsId = new Set()
  const prvdrLocId = new Set()
  const itemsId = new Set()
  const loanCode = getValue(`LoanType`)

  try {
    logger.info(`Checking Providers info (providers) in /${constants.ON_SEARCH}`)
    const bppPrvdrs = onSearchCatalog['providers']
    const len = bppPrvdrs.length
    if (len === 0 || len === undefined) {
      errorObj['providers'] = 'Providers array is missing or empty in /message/catalog'
      return errorObj
    }

    let i = 0
    while (i < len) {
      logger.info(`Validating uniqueness for provider id in providers[${i}]...`)
      const categoriesId = new Set()
      const prvdr = bppPrvdrs[i]

      if (prvdrsId.has(prvdr.id)) {
        const key = `prvdr${i}id`
        errorObj[key] = `duplicate provider id: ${prvdr.id} in providers`
      } else {
        prvdrsId.add(prvdr.id)
      }

      try {
        logger.info(`Validating Descriptor for /${constants.ON_SEARCH}`)
        const descriptor = onSearchCatalog['providers'][i]['descriptor']

        if (!descriptor) {
          errorObj.descriptor = 'Provider descriptor is missing or invalid.'
        }

        if (descriptor.images) {
          descriptor.images.forEach((image: any, index: number) => {
            const { url, size_type } = image
            if (typeof url !== 'string' || !url.trim()) {
              errorObj[`image_url_[${index}]`] = `Invalid URL for image in descriptor.`
            }

            const validSizes = ['md', 'sm', 'lg']
            if (!validSizes.includes(size_type)) {
              errorObj[
                `image_size_[${index}]`
              ] = `Invalid image size in descriptor. It should be one of: ${validSizes.join(', ')}`
            }
          })
        }

        if (!descriptor.name || !descriptor.name.trim()) {
          errorObj.name = `Provider name cannot be empty.`
        } else {
          if (descriptor.name !== onSearchCatalog['descriptor']['name'])
            errorObj.name = `Provider name should be same as sent in catalog/descriptor.`
        }

        if (descriptor.short_desc && !descriptor.short_desc.trim()) {
          errorObj.short_desc = `Short description cannot be empty.`
        }

        if (descriptor.long_desc && !descriptor.long_desc.trim()) {
          errorObj.long_desc = `Long description cannot be empty.`
        }
      } catch (error: any) {
        logger.info(`Error while validating descriptor for /${constants.ON_SEARCH}, ${error.stack}`)
      }

      try {
        logger.info(`Checking categories for provider (${prvdr.id}) in providers[${i}]`)
        let j = 0
        const categories = onSearchCatalog['providers'][i]['categories']
        const iLen = categories.length

        if (iLen === 0 || iLen === undefined) {
          errorObj['categories'] = 'Categories array is missing or empty in /message/catalog/providers/categories'
        }

        while (j < iLen) {
          logger.info(`Validating uniqueness for categories id in providers[${i}].items[${j}]...`)
          const category = categories[j]

          if (categoriesId.has(category.id)) {
            const key = `prvdr${i}category${j}`
            errorObj[key] = `duplicate category id: ${category.id} in providers[${i}]`
          } else {
            categoriesId.add(category.id)
          }

          logger.info(`Validating descriptor code in providers[${i}].categories[${j}]...`)

          if (category?.descriptor?.code !== loanCode)
            errorObj[`prvdr[${i}].category[${j}].code`] = `category code: ${
              category?.descriptor?.code
            } in providers[${i}] must be the same as ${fisFlows[flow as keyof typeof fisFlows]}`
          j++
        }
      } catch (error: any) {
        logger.error(`!!Errors while checking categories in providers[${i}], ${error.stack}`)
      }

      try {
        logger.info(`Checking payments for provider (${prvdr.id}) in providers[${i}]`)
        prvdr?.payments?.forEach((arr: any, i: number) => {
          if (!arr?.collected_by) {
            errorObj[
              `payemnts[${i}]_collected_by`
            ] = `payments.collected_by must be present in ${FisApiSequence.ON_SEARCH}`
          } else {
            const srchCollectBy = getValue(`collected_by`)
            if (srchCollectBy != arr?.collected_by)
              errorObj[
                `payemnts[${i}]_collected_by`
              ] = `payments.collected_by value sent in ${FisApiSequence.ON_SEARCH} should be ${srchCollectBy} as sent in ${FisApiSequence.SEARCH}`
          }

          // Validate payment tags
          const tagsValidation = validatePaymentTags(arr.tags)
          if (!tagsValidation.isValid) {
            Object.assign(errorObj, { tags: tagsValidation.errors })
          }
        })
      } catch (error: any) {
        logger.error(`!!Errors while checking payments in providers[${i}], ${error.stack}`)
      }

      try {
        logger.info(`Checking items for provider (${prvdr.id}) in providers[${i}]`)
        let j = 0
        const items = onSearchCatalog['providers'][i]['items']
        const iLen = items.length

        if (iLen === 0 || iLen === undefined) {
          errorObj['items'] = 'Items array is missing or empty in /message/catalog/providers/items'
        }

        while (j < iLen) {
          logger.info(`Validating uniqueness for item id in providers[${i}].items[${j}]...`)
          const item = items[j]

          if (itemsId.has(item.id)) {
            const key = `prvdr${i}item${j}`
            errorObj[key] = `duplicate item id: ${item.id} in providers[${i}]`
          } else {
            itemsId.add(item.id)
          }

          if ('category_ids' in item) {
            const areCategoryIdsUnique = checkUniqueCategoryIds(item.category_ids, categoriesId)

            if (!areCategoryIdsUnique) {
              const key = `prvdr${i}item${j}uniqueCategoryIds`
              errorObj[
                key
              ] = `category_ids value in /providers[${i}]/items[${j}] should match with id provided in categories`
            }
          }

          if (item?.descriptor?.code !== loanCode)
            errorObj[
              `prvdr[${i}].item[${j}].code`
            ] = `Descriptor code: ${item?.descriptor?.code} in item[${j}] must be the same as ${loanCode}`

          const xinput = item.xinput
          const xinputValidationErrors = validateXInput(xinput, i, j, constants.ON_SEARCH)
          if (xinputValidationErrors) {
            Object.assign(errorObj, xinputValidationErrors)
          }

          // Validate Item tags
          const tagsValidation = validateItemsTags(item?.tags)
          if (!tagsValidation.isValid) {
            Object.assign(errorObj, { tags: tagsValidation.errors })
          }

          j++
        }
      } catch (error: any) {
        logger.error(`!!Errors while checking items in providers[${i}], ${error.stack}`)
      }

      try {
        logger.info(`Checking tags construct for providers[${i}]`)

        const tags = onSearchCatalog['providers'][i]['tags']

        // Validate tags
        const tagsValidation = validateProviderTags(tags)
        if (!tagsValidation.isValid) {
          Object.assign(errorObj, { tags: tagsValidation.errors })
        }
      } catch (error: any) {
        logger.error(`!!Error while checking tags construct for providers[${i}], ${error.stack}`)
      }

      i++
    }

    setValue(`${FisApiSequence.ON_SEARCH}prvdrsId`, prvdrsId)
    setValue(`${FisApiSequence.ON_SEARCH}prvdrLocId`, prvdrLocId)
    setValue(`${FisApiSequence.ON_SEARCH}_itemsId`, Array.from(itemsId))
  } catch (error: any) {
    logger.error(`!!Error while checking Providers info in /${constants.ON_SEARCH}, ${error.stack}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
