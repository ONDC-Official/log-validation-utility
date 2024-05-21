/* eslint-disable no-case-declarations */
/* eslint-disable no-prototype-builtins */
import { logger } from '../../../shared/logger'
import { setValue, getValue } from '../../../shared/dao'
import constants, { ApiSequence } from '../../../constants'
import {
  validateSchema,
  isObjectEmpty,
  checkContext,
  checkGpsPrecision,
  emailRegex,
  checkBppIdOrBapId,
  checkServiceabilityType,
  validateLocations,
  isSequenceValid,
  isValidPhoneNumber,
  checkMandatoryTags,
  areTimestampsLessThanOrEqualTo,
  checkDuplicateParentIdItems,
  findVariantPath,
  findValueAtPath,
  checkForDuplicates,
} from '../../../utils'
import _, { isEmpty } from 'lodash'
import { compareSTDwithArea } from '../../index'
import { BPCJSON, groceryJSON, healthJSON, homeJSON } from '../../../constants/category'
import { electronicsData } from '../../../constants/electronics'
import { applianceData } from '../../../constants/appliance'
import { fashion } from '../../../constants/fashion'
import { DOMAIN } from '../../../utils/enum'
export const checkOnsearch = (data: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [ApiSequence.ON_SEARCH]: 'JSON cannot be empty' }
  }

  const { message, context } = data

  if (!message || !context || !message.catalog || isObjectEmpty(message) || isObjectEmpty(message.catalog)) {
    return { missingFields: '/context, /message, /catalog or /message/catalog is missing or empty' }
  }
  const schemaValidation = validateSchema(context.domain.split(':')[1], constants.ON_SEARCH, data)

  setValue(`${ApiSequence.ON_SEARCH}_context`, context)
  setValue(`${ApiSequence.ON_SEARCH}_message`, message)
  let errorObj: any = {}


  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  try {
    logger.info(`Comparing Message Ids of /${constants.SEARCH} and /${constants.ON_SEARCH}`)
    if (!_.isEqual(getValue(`${ApiSequence.SEARCH}_msgId`), context.message_id)) {
      errorObj[`${ApiSequence.ON_SEARCH}_msgId`] = `Message Ids for /${constants.SEARCH} and /${constants.ON_SEARCH} api should be same`
    }
  } catch (error: any) {
    logger.error(`!!Error while checking message id for /${constants.ON_SEARCH}, ${error.stack}`)
  }

  if (!_.isEqual(data.context.domain.split(':')[1], getValue(`domain`))) {
    errorObj[`Domain[${data.context.action}]`] = `Domain should be same in each action`
  }

  const checkBap = checkBppIdOrBapId(context.bap_id)
  const checkBpp = checkBppIdOrBapId(context.bpp_id)

  if (checkBap) Object.assign(errorObj, { bap_id: 'context/bap_id should not be a url' })
  if (checkBpp) Object.assign(errorObj, { bpp_id: 'context/bpp_id should not be a url' })

  try {
    logger.info(`Checking for context in /${constants.ON_SEARCH}`)
    const contextRes: any = checkContext(context, constants.ON_SEARCH)
    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }
  } catch (error: any) {
    logger.error(`Error while checking for context in /${constants.ON_SEARCH}, ${error.stack}`)
  }

  setValue(`${ApiSequence.ON_SEARCH}`, data)

  const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)

  try {
    logger.info(`Storing BAP_ID and BPP_ID in /${constants.ON_SEARCH}`)
    setValue('bapId', context.bap_id)
    setValue('bppId', context.bpp_id)
  } catch (error: any) {
    logger.error(`!!Error while storing BAP and BPP Ids in /${constants.ON_SEARCH}, ${error.stack}`)
  }

  try {
    logger.info(`Comparing transaction Ids of /${constants.SEARCH} and /${constants.ON_SEARCH}`)
    if (!_.isEqual(searchContext.transaction_id, context.transaction_id)) {
      errorObj.transaction_id = `Transaction Id for /${constants.SEARCH} and /${constants.ON_SEARCH} api should be same`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing transaction ids for /${constants.SEARCH} and /${constants.ON_SEARCH} api, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing Message Ids of /${constants.SEARCH} and /${constants.ON_SEARCH}`)
    if (!_.isEqual(searchContext.message_id, context.message_id)) {
      errorObj.message_id = `Message Id for /${constants.SEARCH} and /${constants.ON_SEARCH} api should be same`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing message ids for /${constants.SEARCH} and /${constants.ON_SEARCH} api, ${error.stack}`,
    )
  }

  try {
    const providers = data.message.catalog['bpp/providers']
    providers.forEach((provider: any) => {
      const address = provider.locations[0].address

      if (address) {
        const area_code = Number.parseInt(address.area_code)
        const std = context.city.split(':')[1]

        logger.info(`Comparing area_code and STD Code for /${constants.ON_SEARCH}`)
        const areaWithSTD = compareSTDwithArea(area_code, std)
        if (!areaWithSTD) {
          logger.error(`STD code does not match with correct area_code on /${constants.ON_SEARCH}`)
          errorObj.invldAreaCode = `STD code does not match with correct area_code on /${constants.ON_SEARCH}`
        }
      }
    })
  } catch (error: any) {
    logger.error(
      `Error while matching area_code and std code for /${constants.SEARCH} and /${constants.ON_SEARCH} api, ${error.stack}`,
    )
  }

  const onSearchCatalog: any = message.catalog
  const onSearchFFIdsArray: any = []
  const prvdrsId = new Set()
  const prvdrLocId = new Set()
  const itemsId = new Set()
  const parentItemIdSet = new Set()
  const itemsArray: any = []
  let itemIdList: any = []
  setValue('tmpstmp', context.timestamp)

  // Storing static fulfillment ids in onSearchFFIdsArray
  try {
    logger.info(`Saving static fulfillment ids in /${constants.ON_SEARCH}`)

    onSearchCatalog['bpp/providers'].forEach((provider: any) => {
      const onSearchFFIds = new Set()
      const bppFF = provider.fulfillments
      const len = bppFF.length

      let i = 0
      while (i < len) {
        onSearchFFIds.add(bppFF[i].id)
        i++
      }
      onSearchFFIdsArray.push(onSearchFFIds)
    })

    setValue('onSearchFFIdsArray', onSearchFFIdsArray)
  } catch (error: any) {
    logger.info(`Error while saving static fulfillment ids in /${constants.ON_SEARCH}, ${error.stack}`)
  }

  // Storing items of bpp/providers in itemsArray and itemIdList
  try {
    logger.info(`Storing items of bpp/providers in itemsArray for  /${constants.ON_SEARCH}`)
    const providers = onSearchCatalog['bpp/providers']
    providers.forEach((provider: any) => {
      const items = provider.items
      itemsArray.push(items)
      items.forEach((item: any) => {
        itemIdList.push(item.id)
      })
    })
    setValue('ItemList', itemIdList)
    setValue('onSearchItems', itemsArray)
  } catch (error: any) {
    logger.error(
      `Error while storing items of bpp/providers in itemsArray for  /${constants.ON_SEARCH}, ${error.stack}`,
    )
  }

  // Checking for mandatory Items in provider IDs
  try {
    const domain = context.domain.split(':')[1]
    logger.info(`Checking for item tags in bpp/providers[0].items.tags in ${domain}`)
    for (let i in onSearchCatalog['bpp/providers']) {
      const items = onSearchCatalog['bpp/providers'][i].items
      let errors: any
      switch (domain) {
        case DOMAIN.RET10:
          errors = checkMandatoryTags(i, items, errorObj, groceryJSON, 'Grocery')
          break
        case DOMAIN.RET12:
          errors = checkMandatoryTags(i, items, errorObj, fashion, 'Fashion')
          break
        case DOMAIN.RET13:
          errors = checkMandatoryTags(i, items, errorObj, BPCJSON, 'BPC')
          break
        case DOMAIN.RET14:
          errors = checkMandatoryTags(i, items, errorObj, electronicsData, 'Electronics')
          break
        case DOMAIN.RET15:
          errors = checkMandatoryTags(i, items, errorObj, applianceData, 'Appliances')
          break
        case DOMAIN.RET16:
          errors = checkMandatoryTags(i, items, errorObj, homeJSON, 'Home & Kitchen')
          break
        case DOMAIN.RET18:
          errors = checkMandatoryTags(i, items, errorObj, healthJSON, 'Health & Wellness')
          break
      }
      Object.assign(errorObj, errors)
    }
  } catch (error: any) {
    logger.error(`!!Errors while checking for items in bpp/providers/items, ${error.stack}`)
  }

  // Compairing valid timestamp in context.timestamp and bpp/providers/items/time/timestamp
  try {
    logger.info(`Compairing valid timestamp in context.timestamp and bpp/providers/items/time/timestamp`)
    const timestamp = context.timestamp
    for (let i in onSearchCatalog['bpp/providers']) {
      const items = onSearchCatalog['bpp/providers'][i].items
      items.forEach((item: any, index: number) => {
        const itemTimeStamp = item.time.timestamp
        const op = areTimestampsLessThanOrEqualTo(itemTimeStamp, timestamp)
        if (!op) {
          const key = `bpp/providers[${i}]/items/time/timestamp[${index}]`
          errorObj[key] = `Timestamp for item[${index}] can't be greater than context.timestamp`
          logger.error(`Timestamp for item[${index}] can't be greater than context.timestamp`)
        }
      })
    }
  } catch (error: any) {
    logger.error(
      `!!Errors while checking timestamp in context.timestamp and bpp/providers/items/time/timestamp, ${error.stack}`,
    )
  }

  // Checking for duplicate providerID in bpp/providers
  try {
    for (let i in onSearchCatalog['bpp/providers']) {
      logger.info(`Validating uniqueness for provider id in bpp/providers[${i}]...`)
      const prvdr = onSearchCatalog['bpp/providers'][i]
      if (prvdrsId.has(prvdr.id)) {
        const key = `prvdr${i}id`
        errorObj[key] = `duplicate provider id: ${prvdr.id} in bpp/providers`
      } else {
        prvdrsId.add(prvdr.id)
      }
    }
    setValue(`${ApiSequence.ON_SEARCH}prvdrsId`, prvdrsId)
  } catch (error: any) {
    logger.error(`!!Errors while checking provider id in bpp/providers, ${error.stack}`)
  }

  // Checking for long_desc and short_desc in bpp/providers/items/descriptor/
  try {
    logger.info(`Checking for long_desc and short_desc in bpp/providers/items/descriptor/`)
    for (let i in onSearchCatalog['bpp/providers']) {
      const items = onSearchCatalog['bpp/providers'][i].items
      items.forEach((item: any, index: number) => {
        if (!item.descriptor.short_desc || !item.descriptor.long_desc) {
          logger.error(
            `short_desc and long_desc should not be provided as empty string "" in /message/catalog/bpp/providers[${i}]/items[${index}]/descriptor`,
          )
          const key = `bpp/providers[${i}]/items[${index}]/descriptor`
          errorObj[key] =
            `short_desc and long_desc should not be provided as empty string "" in /message/catalog/bpp/providers[${i}]/items[${index}]/descriptor`
        }
      })
    }
  } catch (error: any) {
    logger.error(
      `!!Errors while checking timestamp in context.timestamp and bpp/providers/items/time/timestamp, ${error.stack}`,
    )
  }
  // Checking for code in bpp/providers/items/descriptor/
  try {
    logger.info(`Checking for code in bpp/providers/items/descriptor/`)
    for (let i in onSearchCatalog['bpp/providers']) {
      const items = onSearchCatalog['bpp/providers'][i].items
      items.forEach((item: any, index: number) => {
        if (!item.descriptor.code) {
          logger.error(
            `code should be provided in /message/catalog/bpp/providers[${i}]/items[${index}]/descriptor`,
          )
          const key = `bpp/providers[${i}]/items[${index}]/descriptor`
          errorObj[key] =
            `code should provided in /message/catalog/bpp/providers[${i}]/items[${index}]/descriptor`
        }
        else {
          const itemCodeArr = item.descriptor.code.split(":")
          const itemDescType = itemCodeArr[0]
          const itemDescCode = itemCodeArr[1]
          const domain = getValue('domain')?.substring(3)
          if (domain == "10" || domain == "13") {
            if (itemDescType != "1") {
              const key = `bpp/providers[${i}]/items[${index}]/descriptor/code`
              errorObj[key] =
                `code should have 1:EAN as a value in /message/catalog/bpp/providers[${i}]/items[${index}]/descriptor/code`
            }
            else {
              const regex = /^\d{8,13}$/
              if (!regex.test(itemDescCode)) {
                const key = `bpp/providers[${i}]/items[${index}]/descriptor/code`
                errorObj[key] =
                  `code should provided in /message/catalog/bpp/providers[${i}]/items[${index}]/descriptor/code should be number and have a between length 8 to 13`
              }
            }
          }
          else if (domain == "12") {
            if (itemDescType == "4") {
              const regex = /^\d{4}$|^\d{6}$|^\d{8}$|^\d{10}$/
              if (!regex.test(itemDescCode)) {
                const key = `bpp/providers[${i}]/items[${index}]/descriptor/code`
                errorObj[key] =
                  `code should provided in /message/catalog/bpp/providers[${i}]/items[${index}]/descriptor/code should be number and have a length 4, 6, 8 or 10.`
              }
            }
            else {
              const key = `bpp/providers[${i}]/items[${index}]/descriptor/code`
              errorObj[key] =
                `code should have 4:HSN as a value in /message/catalog/bpp/providers[${i}]/items[${index}]/descriptor/code`
            }
          }
          else if (domain != "17") {
            if (itemDescType == "3") {
              const regex = /^\d{8}$|^\d{12}$|^\d{13}$|^\d{14}$/
              if (!regex.test(itemDescCode)) {
                const key = `bpp/providers[${i}]/items[${index}]/descriptor/code`
                errorObj[key] =
                  `code should provided in /message/catalog/bpp/providers[${i}]/items[${index}]/descriptor/code should be number and have a length 8, 12, 13 or 14}.`
              }
            }
            else {
              const key = `bpp/providers[${i}]/items[${index}]/descriptor/code`
              errorObj[key] =
                `code should have 3:GTIN as a value in /message/catalog/bpp/providers[${i}]/items[${index}]/descriptor/code`
            }
          }
          else {
            const key = `bpp/providers[${i}]/items[${index}]/descriptor/code`
            errorObj[key] =
              `code should have a valid value in /message/catalog/bpp/providers[${i}]/items[${index}]/descriptor/code`
          }
        }
      })
    }
  } catch (error: any) {
    logger.error(
      `!!Errors while checking timestamp in context.timestamp and bpp/providers/items/time/timestamp, ${error.stack}`,
    )
  }

  // Adding parent_item_id in a set
  try {
    logger.info(`Adding parent_item_id in a set on /${constants.ON_SEARCH}`)
    const providers = onSearchCatalog['bpp/providers']
    providers.forEach((provider: any) => {
      provider.items.forEach((item: any) => {
        if (!parentItemIdSet.has(item.parent_item_id)) {
          parentItemIdSet.add(item.parent_item_id)
        }
      })
    })

    setValue('parentItemIdSet', parentItemIdSet)
  } catch (error: any) {
    logger.error(`Error while adding parent_item_id in a set on /${constants.ON_SEARCH}, ${error.stack}`)
  }

  // Checking image array for bpp/providers/[]/categories/[]/descriptor/images[]
  try {
    logger.info(`Checking image array for bpp/provider/categories/descriptor/images[]`)
    for (let i in onSearchCatalog['bpp/providers']) {
      const categories = onSearchCatalog['bpp/providers'][i].categories
      if (categories) {
        categories.forEach((item: any, index: number) => {
          if (item.descriptor.images && item.descriptor.images.length < 1) {
            const key = `bpp/providers[${i}]/categories[${index}]/descriptor`
            errorObj[key] = `Images should not be provided as empty array for categories[${index}]/descriptor`
            logger.error(`Images should not be provided as empty array for categories[${index}]/descriptor`)
          }
        })
      }
    }
  } catch (error: any) {
    logger.error(
      `!!Errors while checking image array for bpp/providers/[]/categories/[]/descriptor/images[], ${error.stack}`,
    )
  }

  // Checking price of items in bpp/providers
  try {
    const providers = onSearchCatalog['bpp/providers']
    providers.forEach((provider: any, i: number) => {
      const items = provider.items
      items.forEach((item: any, j: number) => {
        if (item.price && item.price.value) {
          const priceValue = parseFloat(item.price.value)
          if (priceValue < 1) {
            const key = `prvdr${i}item${j}price`
            errorObj[key] = `item.price.value should be greater than 0`
          }
        }
      })
    })
  } catch (error: any) {
    logger.error(`Error while checking price of items in bpp/providers for /${constants.ON_SEARCH}, ${error.stack}`)
  }

  // Mapping items with thier respective providers
  try {
    const itemProviderMap: any = {}
    const providers = onSearchCatalog['bpp/providers']
    providers.forEach((provider: any) => {
      const items = provider.items
      const itemArray: any = []
      items.forEach((item: any) => {
        itemArray.push(item.id)
      })
      itemProviderMap[provider.id] = itemArray
    })

    setValue('itemProviderMap', itemProviderMap)
  } catch (e: any) {
    logger.error(`Error while mapping items with thier respective providers ${e.stack}`)
  }

  // Checking for quantity of items in bpp/providers
  try {
    logger.info(`Checking for quantity of items in bpp/providers for /${constants.ON_SEARCH}`)
    const providers = onSearchCatalog['bpp/providers']
    providers.forEach((provider: any, i: number) => {
      const items = provider.items
      items.forEach((item: any, j: number) => {
        if (item.quantity && item.quantity.available && typeof item.quantity.available.count === 'string') {
          const availCount = parseInt(item.quantity.available.count, 10)
          const maxCount = parseInt(item.quantity.maximum.count, 10)
          if (item.quantity.unitized.measure.value < 1) {
            const key = `prvdr${i}item${j}unitized`
            errorObj[key] = `item.quantity.unitized.measure.value should be greater than 0`
          }
          if (availCount < 0 || maxCount < 0) {
            const key = `prvdr${i}item${j}invldCount`
            errorObj[key] =
              `item.quantity.available.count and item.quantity.maximum.count should be greater than or equal to 0`
          }
        }
      })
    })
  } catch (error: any) {
    logger.error(`Error while checking quantity of items in bpp/providers for /${constants.ON_SEARCH}, ${error.stack}`)
  }

  // Checking for duplicate varient in bpp/providers/items for on_search
  try {
    logger.info(`Checking for duplicate varient in bpp/providers/items for on_search`)
    for (let i in onSearchCatalog['bpp/providers']) {
      const varientPath: any = findVariantPath(onSearchCatalog['bpp/providers'][i].categories)
      const items = onSearchCatalog['bpp/providers'][i].items
      const map = checkDuplicateParentIdItems(items)
      for (let key in map) {
        if (map[key].length > 1) {
          const item = varientPath.find((item: any) => {
            return item.item_id === key
          })
          const pathForVarient = item.paths
          let valueArray = []
          if (pathForVarient.length) {
            for (let j = 0; j < map[key].length; j++) {
              let itemValues: any = {}
              for (let path of pathForVarient) {
                if (path === 'item.quantity.unitized.measure') {
                  const unit = map[key][j].quantity.unitized.measure.unit
                  const value = map[key][j].quantity.unitized.measure.value
                  itemValues['unit'] = unit
                  itemValues['value'] = value
                } else {
                  const val = findValueAtPath(path, map[key][j])
                  itemValues[path.split('.').pop()] = val
                }
              }
              valueArray.push(itemValues)
            }
            checkForDuplicates(valueArray, errorObj)
          }
        }
      }
    }
  } catch (error: any) {
    logger.error(`!!Errors while checking parent_item_id in bpp/providers/[]/items/[]/parent_item_id/, ${error.stack}`)
  }
  try {
    logger.info(`Checking for np_type in bpp/descriptor`)
    const descriptor = onSearchCatalog['bpp/descriptor']
    descriptor?.tags.map((tag: { code: any; list: any[] },) => {
      if (tag.code === 'bpp_terms') {
        const npType = tag.list.find((item) => item.code === 'np_type')
        if (!npType) {
          errorObj['bpp/descriptor'] = `Missing np_type in bpp/descriptor`
          setValue(`${ApiSequence.ON_SEARCH}np_type`, "")
        }
        else {
          setValue(`${ApiSequence.ON_SEARCH}np_type`, npType.value)
        }
        const accept_bap_terms = tag.list.find((item) => item.code === 'accept_bap_terms')
        if (accept_bap_terms) {
          errorObj['bpp/descriptor/accept_bap_terms'] = `accept_bap_terms is not required in bpp/descriptor/tags for now `
        }
        const collect_payment = tag.list.find((item) => item.code === 'collect_payment')
        if (collect_payment) {
          errorObj['bpp/descriptor/collect_payment'] = `collect_payment is not required in bpp/descriptor/tags for now `
        }
      }
    })
  } catch (error: any) {
    logger.error(`Error while checking np_type in bpp/descriptor for /${constants.ON_SEARCH}, ${error.stack}`)
  }

  try {
    logger.info(`Checking Providers info (bpp/providers) in /${constants.ON_SEARCH}`)
    let i = 0
    const bppPrvdrs = onSearchCatalog['bpp/providers']
    const len = bppPrvdrs.length
    const tmpstmp = context.timestamp

    while (i < len) {
      const categoriesId = new Set()
      const customGrpId = new Set()
      const seqSet = new Set()
      const itemCategory_id = new Set()
      const categoryRankSet = new Set()

      const prvdr = bppPrvdrs[i]

      logger.info(`Checking store enable/disable timestamp in bpp/providers[${i}]`)
      try {
        if (prvdr.time) {
          const providerTime = new Date(prvdr.time.timestamp).getTime()
          const contextTimestamp = new Date(tmpstmp).getTime()
          if (providerTime > contextTimestamp) {
            errorObj.StoreEnableDisable = `store enable/disable timestamp (/bpp/providers/time/timestamp) should be less then or equal to context.timestamp`
          }
        }
      } catch (error: any) {
        logger.error(`Error while checking store enable/disable timestamp in bpp/providers[${i}]`, error)
      }

      logger.info(`Checking store timings in bpp/providers[${i}]`)

      prvdr.locations.forEach((loc: any, iter: any) => {
        try {
          logger.info(`Checking gps precision of store location in /bpp/providers[${i}]/locations[${iter}]`)
          const has = Object.prototype.hasOwnProperty
          if (has.call(loc, 'gps')) {
            if (!checkGpsPrecision(loc.gps)) {
              errorObj.gpsPrecision = `/bpp/providers[${i}]/locations[${iter}]/gps coordinates must be specified with at least six decimal places of precision.`
            }
          }
        } catch (error) {
          logger.error(
            `!!Error while checking gps precision of store location in /bpp/providers[${i}]/locations[${iter}]`,
            error,
          )
        }

        try {
          if (prvdrLocId.has(loc?.id)) {
            const key = `prvdr${i}${loc.id}${iter}`
            errorObj[key] = `duplicate location id: ${loc.id} in /bpp/providers[${i}]/locations[${iter}]`
          } else {
            prvdrLocId.add(loc.id)
          }

          logger.info('Checking store days...')
          const days = loc?.time?.days?.split(',')
          days.forEach((day: any) => {
            day = parseInt(day)
            if (isNaN(day) || day < 1 || day > 7) {
              const key = `prvdr${i}locdays${iter}`
              errorObj[key] =
                `store days (bpp/providers[${i}]/locations[${iter}]/time/days) should be in the format ("1,2,3,4,5,6,7") where 1- Monday and 7- Sunday`
            }
          })

          logger.info('Checking fixed or split timings')

          //scenario 1: range =1 freq/times =1
          if (loc?.time?.range && (loc.time?.schedule?.frequency || loc.time?.schedule?.times)) {
            const key = `prvdr${i}loctime${iter}`
            errorObj[key] =
              `Either one of fixed (range) or split (frequency and times) timings should be provided in /bpp/providers[${i}]/locations[${iter}]/time`
          }

          // scenario 2: range=0 freq || times =1
          if (!loc?.time?.range && (!loc?.time?.schedule?.frequency || !loc?.time?.schedule?.times)) {
            const key = `prvdr${i}loctime${iter}`
            errorObj[key] =
              `Either one of fixed timings (range) or split timings (both frequency and times) should be provided in /bpp/providers[${i}]/locations[${iter}]/time`
          }

          //scenario 3: range=1 (start and end not compliant) frequency=0;
          if ('range' in loc.time) {
            logger.info('checking range (fixed timings) start and end')
            const startTime: any = 'start' in loc?.time?.range ? parseInt(loc?.time?.range?.start) : ''
            const endTime: any = 'end' in loc?.time?.range ? parseInt(loc?.time?.range?.end) : ''
            if (isNaN(startTime) || isNaN(endTime) || startTime > endTime || endTime > 2359) {
              errorObj.startEndTime = `end time must be greater than start time in fixed timings /locations/time/range (fixed store timings)`
            }
          }
        } catch (error: any) {
          logger.error(`Validation error for frequency: ${error.stack}`)
        }
      })

      try {
        logger.info(`Checking for upcoming holidays`)
        const location = onSearchCatalog['bpp/providers'][i]['locations']
        if (!location) {
          logger.error('No location detected ')
        }

        const scheduleObject = location[i].time.schedule.holidays
        const timestamp = context.timestamp
        const [currentDate] = timestamp.split('T')

        scheduleObject.map((date: string) => {
          const dateObj = new Date(date)
          const currentDateObj = new Date(currentDate)
          if (dateObj.getTime() < currentDateObj.getTime()) {
            const key = `/message/catalog/bpp/providers/loc${i}/time/schedule/holidays`
            errorObj[key] = `Holidays cannot be past ${currentDate}`
          }
        })
      } catch (e) {
        logger.error('No Holiday', e)
      }

      try {
        logger.info(`Checking categories for provider (${prvdr.id}) in bpp/providers[${i}]`)
        let j = 0
        const categories = onSearchCatalog['bpp/providers'][i]['categories']
        if (!categories || !categories.length) {
          const key = `prvdr${i}categories`
          errorObj[key] = `categories must be present in bpp/providers[${i}]`
        }
        const iLen = categories?.length
        while (j < iLen) {
          logger.info(`Validating uniqueness for categories id in bpp/providers[${i}].items[${j}]...`)
          const category = categories[j]

          const fulfillments = onSearchCatalog['bpp/providers'][i]['fulfillments']
          const phoneNumber = fulfillments[i].contact.phone

          if (!isValidPhoneNumber(phoneNumber)) {
            const key = `bpp/providers${i}fulfillments${i}`
            errorObj[key] =
              `Please enter a valid phone number consisting of  10 or  11 digits without any spaces or special characters. `
          }

          if (categoriesId.has(category.id)) {
            const key = `prvdr${i}category${j}`
            errorObj[key] = `duplicate category id: ${category.id} in bpp/providers[${i}]`
          } else {
            categoriesId.add(category.id)
          }

          try {
            category.tags.map((tag: { code: any; list: any[] }, index: number) => {
              switch (tag.code) {
                case 'type':
                  const codeList = tag.list.find((item) => item.code === 'type')
                  if (
                    !(
                      codeList.value === 'custom_menu' ||
                      codeList.value === 'custom_group' ||
                      codeList.value === 'variant_group'
                    )
                  ) {
                    const key = `prvdr${i}category${j}tags${index}`
                    errorObj[key] =
                      `list.code == type then value should be one of 'custom_menu','custom_group' and 'variant_group' in bpp/providers[${i}]`
                  }

                  if (codeList.value === 'custom_group') {
                    customGrpId.add(category.id)
                  }

                  break
                case 'timing':
                  for (const item of tag.list) {
                    switch (item.code) {
                      case 'day_from':
                      case 'day_to':
                        const dayValue = parseInt(item.value)
                        if (isNaN(dayValue) || dayValue < 1 || dayValue > 7 || !/^-?\d+(\.\d+)?$/.test(item.value)) {
                          errorObj.custom_menu_timing_tag = `Invalid value for '${item.code}': ${item.value}`
                        }

                        break
                      case 'time_from':
                      case 'time_to':
                        if (!/^([01]\d|2[0-3])[0-5]\d$/.test(item.value)) {
                          errorObj.time_to = `Invalid time format for '${item.code}': ${item.value}`
                        }

                        break
                      default:
                        errorObj.Tagtiming = `Invalid list.code for 'timing': ${item.code}`
                    }
                  }

                  const dayFromItem = tag.list.find((item: any) => item.code === 'day_from')
                  const dayToItem = tag.list.find((item: any) => item.code === 'day_to')
                  const timeFromItem = tag.list.find((item: any) => item.code === 'time_from')
                  const timeToItem = tag.list.find((item: any) => item.code === 'time_to')

                  if (dayFromItem && dayToItem && timeFromItem && timeToItem) {
                    const dayFrom = parseInt(dayFromItem.value, 10)
                    const dayTo = parseInt(dayToItem.value, 10)
                    const timeFrom = parseInt(timeFromItem.value, 10)
                    const timeTo = parseInt(timeToItem.value, 10)

                    if (dayTo < dayFrom) {
                      errorObj.day_from = "'day_to' must be greater than or equal to 'day_from'"
                    }

                    if (timeTo <= timeFrom) {
                      errorObj.time_from = "'time_to' must be greater than 'time_from'"
                    }
                  }

                  break
                case 'display':
                  for (const item of tag.list) {
                    if (item.code !== 'rank' || !/^-?\d+(\.\d+)?$/.test(item.value)) {
                      errorObj.rank = `Invalid value for 'display': ${item.value}`
                    } else {
                      if (categoryRankSet.has(category.id)) {
                        const key = `prvdr${i}category${j}rank`
                        errorObj[key] = `duplicate rank in category id: ${category.id} in bpp/providers[${i}]`
                      } else {
                        categoryRankSet.add(category.id)
                      }
                    }
                  }

                  break
                case 'config':
                  const minItem: any = tag.list.find((item: { code: string }) => item.code === 'min')
                  const maxItem: any = tag.list.find((item: { code: string }) => item.code === 'max')
                  const inputItem: any = tag.list.find((item: { code: string }) => item.code === 'input')
                  const seqItem: any = tag.list.find((item: { code: string }) => item.code === 'seq')

                  if (!minItem || !maxItem) {
                    errorObj[`customization_config_${j}`] =
                      `Both 'min' and 'max' values are required in 'config' at index: ${j}`
                  }

                  if (!/^-?\d+(\.\d+)?$/.test(minItem.value)) {
                    errorObj[`customization_config_min_${j}`] =
                      `Invalid value for ${minItem.code}: ${minItem.value} at index: ${j}`
                  }

                  if (!/^-?\d+(\.\d+)?$/.test(maxItem.value)) {
                    errorObj[`customization_config_max_${j}`] =
                      `Invalid value for ${maxItem.code}: ${maxItem.value}at index: ${j}`
                  }

                  if (!/^-?\d+(\.\d+)?$/.test(seqItem.value)) {
                    errorObj[`config_seq_${j}`] = `Invalid value for ${seqItem.code}: ${seqItem.value} at index: ${j}`
                  }

                  const inputEnum = ['select', 'text']
                  if (!inputEnum.includes(inputItem.value)) {
                    errorObj[`config_input_${j}`] =
                      `Invalid value for 'input': ${inputItem.value}, it should be one of ${inputEnum} at index: ${j}`
                  }

                  break
              }
            })
            logger.info(`Category '${category.descriptor.name}' is valid.`)
          } catch (error: any) {
            logger.error(`Validation error for category '${category.descriptor.name}': ${error.message}`)
          }

          j++
        }
      } catch (error: any) {
        logger.error(`!!Errors while checking categories in bpp/providers[${i}], ${error.stack}`)
      }

      try {
        logger.info(`Checking items for provider (${prvdr.id}) in bpp/providers[${i}]`)
        let j = 0
        const items = onSearchCatalog['bpp/providers'][i]['items']

        const iLen = items.length
        while (j < iLen) {
          logger.info(`Validating uniqueness for item id in bpp/providers[${i}].items[${j}]...`)
          const item = items[j]

          if (itemsId.has(item.id)) {
            const key = `prvdr${i}item${j}`
            errorObj[key] = `duplicate item id: ${item.id} in bpp/providers[${i}]`
          } else {
            itemsId.add(item.id)
          }

          if ('category_id' in item) {
            itemCategory_id.add(item.category_id)
          }

          try {
            if ('category_ids' in item) {
              item[`category_ids`].map((category: string, index: number) => {
                const categoryId = category.split(':')[0]
                const seq = category.split(':')[1]

                if (seqSet.has(seq)) {
                  const key = `prvdr${i}item${j}ctgryseq${index}`
                  errorObj[key] = `duplicate seq : ${seq} in category_ids in prvdr${i}item${j}`
                } else {
                  seqSet.add(seq)
                }

                if (!categoriesId.has(categoryId)) {
                  const key = `prvdr${i}item${j}ctgryId${index}`
                  errorObj[key] = `item${j} should have category_ids one of the Catalog/categories/id`
                }
              })
            }
          } catch (error: any) {
            logger.error(`Error while checking category_ids for item id: ${item.id}, ${error.stack}`)
          }

          try {
            logger.info(`Checking selling price and maximum price for item id: ${item.id}`)

            const statutory_reqs_prepackaged_food =
              onSearchCatalog['bpp/providers'][i]['items'][j]['@ondc/org/statutory_reqs_prepackaged_food']

            if (context.domain === 'ONDC:RET18') {
              if (!statutory_reqs_prepackaged_food.ingredients_info) {
                const key = `prvdr${i}items${j}@ondc/org/statutory_reqs_prepackaged_food`
                errorObj[key] =
                  `In ONDC:RET18 for @ondc/org/statutory_reqs_prepackaged_food  ingredients_info is a valid field `
              }
            } else if (context.domain === 'ONDC:RET10') {
              const mandatoryFields = [
                'nutritional_info',
                'additives_info',
                'brand_owner_FSSAI_license_no',
                'other_FSSAI_license_no',
                'importer_FSSAI_license_no',
              ]
              mandatoryFields.forEach((field) => {
                if (statutory_reqs_prepackaged_food && !statutory_reqs_prepackaged_food[field]) {
                  const key = `prvdr${i}items${j}@ondc/org/statutory_reqs_prepackaged_food`
                  errorObj[key] =
                    `In ONDC:RET10 @ondc/org/statutory_reqs_prepackaged_food following fields are valid and required 'nutritional_info', 'additives_info','other_FSSAI_license_no',
                    'brand_owner_FSSAI_license_no','importer_FSSAI_license_no'`
                }
              })
            }
          } catch (error: any) {
            logger.error(`Error while checking selling price and maximum price for item id: ${item.id}, ${error.stack}`)
          }

          try {
            if (item.quantity && item.quantity.maximum && typeof item.quantity.maximum.count === 'string') {
              const maxCount = parseInt(item.quantity.maximum.count, 10)
              const availCount = parseInt(item.quantity.available.count, 10)
              if (availCount == 99 && maxCount <= 0) {
                const key = `prvdr${i}item${j}maxCount`
                errorObj[key] =
                  `item.quantity.maximum.count should be either default value 99 (no cap per order) or any other positive value (cap per order) in /bpp/providers[${i}]/items[${j}]`
              }
            }
          } catch (error: any) {
            logger.error(`Error while checking available and max quantity for item id: ${item.id}, ${error.stack}`)
          }

          try {
            if (item.quantity && item.quantity.maximum && typeof item.quantity.maximum.count === 'string') {
              const maxCount = parseInt(item.quantity.maximum.count, 10)
              const availCount = parseInt(item.quantity.available.count, 10)
              if (availCount == 99 && maxCount == 0) {
                const key = `prvdr${i}item${j}maxCount`
                errorObj[key] = `item.quantity.maximum.count cant be 0 if item is in stock `
              }
            }
          } catch (error: any) {
            logger.error(`Error while checking available and max quantity for item id: ${item.id}, ${error.stack}`)
          }

          try {
            if ('price' in item) {
              const sPrice = parseFloat(item.price.value)
              const maxPrice = parseFloat(item.price.maximum_value)

              if (sPrice > maxPrice) {
                const key = `prvdr${i}item${j}Price`
                errorObj[key] =
                  `selling price of item /price/value with id: (${item.id}) can't be greater than the maximum price /price/maximum_value in /bpp/providers[${i}]/items[${j}]/`
              }
            }
          } catch (error: any) {
            logger.error(`Error while checking selling price and maximum price for item id: ${item.id}, ${error.stack}`)
          }

          try {
            logger.info(`Checking fulfillment_id for item id: ${item.id}`)

            if ('price' in item) {
              const upper = parseFloat(item.price?.tags?.[0].list[1].value)
              const lower = parseFloat(item.price?.tags?.[0].list[0].value)

              if (upper > lower) {
                const key = `prvdr${i}item${j}Price/tags/list`
                errorObj[key] =
                  `selling lower range of item /price/range/value with id: (${item.id}) can't be greater than the upper in /bpp/providers[${i}]/items[${j}]/`
              }
            }
          } catch (error: any) {
            logger.error(`Error while checking price range for item id: ${item.id}, error: ${error.stack}`)
          }

          try {
            if (item.fulfillment_id && !onSearchFFIdsArray[i].has(item.fulfillment_id)) {
              const key = `prvdr${i}item${j}ff`
              errorObj[key] =
                `fulfillment_id in /bpp/providers[${i}]/items[${j}] should map to one of the fulfillments id in bpp/prvdr${i}/fulfillments`
            }
          } catch (error: any) {
            logger.error(`Error while checking fulfillment_id for item id: ${item.id}, error: ${error.stack}`)
          }

          try {
            logger.info(`Checking location_id for item id: ${item.id}`)

            if (item.location_id && !prvdrLocId.has(item.location_id)) {
              const key = `prvdr${i}item${j}loc`
              errorObj[key] =
                `location_id in /bpp/providers[${i}]/items[${j}] should be one of the locations id in /bpp/providers[${i}]/locations`
            }
          } catch (error: any) {
            logger.error(`Error while checking location_id for item id: ${item.id}, error: ${error.stack}`)
          }

          try {
            logger.info(`Checking consumer care details for item id: ${item.id}`)
            if ('@ondc/org/contact_details_consumer_care' in item) {
              let consCare = item['@ondc/org/contact_details_consumer_care']

              consCare = consCare.split(',')

              if (!isValidPhoneNumber(consCare[2])) {
                const key = `prvdr${i}consCare`
                errorObj[key] =
                  `@ondc/org/contact_details_consumer_care contactno should consist of  10 or  11 digits without any spaces or special characters in /bpp/providers[${i}]/items`
              }

              if (consCare.length < 3) {
                const key = `prvdr${i}consCare`
                errorObj[key] =
                  `@ondc/org/contact_details_consumer_care should be in the format "name,email,contactno" in /bpp/providers[${i}]/items`
              } else {
                const checkEmail: boolean = emailRegex(consCare[1].trim())
                if (isNaN(consCare[2].trim()) || !checkEmail) {
                  const key = `prvdr${i}consCare`
                  errorObj[key] =
                    `@ondc/org/contact_details_consumer_care email should be in /bpp/providers[${i}]/items`
                }
              }
            }
          } catch (error: any) {
            logger.error(`Error while checking consumer care details for item id: ${item.id}, ${error.stack}`)
          }

          try {
            item.tags.map((tag: { code: any; list: any[] }, index: number) => {
              switch (tag.code) {
                case 'type':
                  if (
                    tag.list &&
                    Array.isArray(tag.list) &&
                    tag.list.some(
                      (listItem: { code: string; value: string }) =>
                        listItem.code === 'type' && listItem.value === 'item',
                    )
                  ) {
                    if (!item.time) {
                      const key = `prvdr${i}item${j}time`
                      errorObj[key] = `item_id: ${item.id} should contain time object in bpp/providers[${i}]`
                    }

                  }

                  break

                case 'custom_group':
                  tag.list.map((it: { code: string; value: string }, index: number) => {
                    if (!customGrpId.has(it.value)) {
                      const key = `prvdr${i}item${j}tag${index}cstmgrp_id`
                      errorObj[key] =
                        `item_id: ${item.id} should have custom_group_id one of the ids passed in categories bpp/providers[${i}]`
                    }
                  })

                  break

                case 'config':
                  const idList: any = tag.list.find((item: { code: string }) => item.code === 'id')
                  const minList: any = tag.list.find((item: { code: string }) => item.code === 'min')
                  const maxList: any = tag.list.find((item: { code: string }) => item.code === 'max')
                  const seqList: any = tag.list.find((item: { code: string }) => item.code === 'seq')

                  if (!categoriesId.has(idList.value)) {
                    const key = `prvdr${i}item${j}tags${index}config_list`
                    errorObj[key] =
                      `value in catalog/items${j}/tags${index}/config/list/ should be one of the catalog/category/ids`
                  }

                  if (!/^-?\d+(\.\d+)?$/.test(minList.value)) {
                    const key = `prvdr${i}item${j}tags${index}config_min`
                    errorObj[key] = `Invalid value for ${minList.code}: ${minList.value}`
                  }

                  if (!/^-?\d+(\.\d+)?$/.test(maxList.value)) {
                    const key = `prvdr${i}item${j}tags${index}config_max`
                    errorObj[key] = `Invalid value for ${maxList.code}: ${maxList.value}`
                  }

                  if (!/^-?\d+(\.\d+)?$/.test(seqList.value)) {
                    const key = `prvdr${i}item${j}tags${index}config_seq`
                    errorObj[key] = `Invalid value for ${seqList.code}: ${seqList.value}`
                  }

                  break

                case 'timing':
                  for (const item of tag.list) {
                    switch (item.code) {
                      case 'day_from':
                      case 'day_to':
                        const dayValue = parseInt(item.value)
                        if (isNaN(dayValue) || dayValue < 1 || dayValue > 5 || !/^-?\d+(\.\d+)?$/.test(item.value)) {
                          const key = `prvdr${i}item${j}tags${index}timing_day`
                          errorObj[key] = `Invalid value for '${item.code}': ${item.value}`
                        }

                        break
                      case 'time_from':
                      case 'time_to':
                        if (!/^([01]\d|2[0-3])[0-5]\d$/.test(item.value)) {
                          const key = `prvdr${i}item${j}tags${index}timing_time`
                          errorObj[key] = `Invalid time format for '${item.code}': ${item.value}`
                        }

                        break
                      default:
                        errorObj.Tagtiming = `Invalid list.code for 'timing': ${item.code}`
                    }
                  }

                  const dayFromItem = tag.list.find((item: any) => item.code === 'day_from')
                  const dayToItem = tag.list.find((item: any) => item.code === 'day_to')
                  const timeFromItem = tag.list.find((item: any) => item.code === 'time_from')
                  const timeToItem = tag.list.find((item: any) => item.code === 'time_to')

                  if (dayFromItem && dayToItem && timeFromItem && timeToItem) {
                    const dayFrom = parseInt(dayFromItem.value, 10)
                    const dayTo = parseInt(dayToItem.value, 10)
                    const timeFrom = parseInt(timeFromItem.value, 10)
                    const timeTo = parseInt(timeToItem.value, 10)

                    if (dayTo < dayFrom) {
                      const key = `prvdr${i}item${j}tags${index}timing_dayfrom`
                      errorObj[key] = "'day_to' must be greater than or equal to 'day_from'"
                    }

                    if (timeTo <= timeFrom) {
                      const key = `prvdr${i}item${j}tags${index}timing_timefrom`
                      errorObj[key] = "'time_to' must be greater than 'time_from'"
                    }
                  }

                  break

                case 'veg_nonveg':
                  const allowedCodes = ['veg', 'non_veg', 'egg']

                  for (const it of tag.list) {
                    if (it.code && !allowedCodes.includes(it.code)) {
                      const key = `prvdr${i}item${j}tag${index}veg_nonveg`
                      errorObj[key] =
                        `item_id: ${item.id} should have veg_nonveg one of the 'veg', 'non_veg' in bpp/providers[${i}]`
                    }
                  }

                  break
              }
            })
          } catch (error: any) {
            logger.error(`Error while checking tags for item id: ${item.id}`, error)
          }

          j++
        }
      } catch (error: any) {
        logger.error(`!!Errors while checking items in bpp/providers[${i}], ${error.stack}`)
      }

      try {
        logger.info(`checking rank in bpp/providers[${i}].category.tags`)
        const rankSeq = isSequenceValid(seqSet)
        if (rankSeq === false) {
          const key = `prvdr${i}ctgry_tags`
          errorObj[key] = `rank should be in sequence provided in bpp/providers[${i}]/categories/tags/display`
        }
      } catch (error: any) {
        logger.error(`!!Errors while checking rank in bpp/providers[${i}].category.tags, ${error.stack}`)
      }

      // servicability Construct
      try {
        logger.info(`Checking serviceability construct for bpp/providers[${i}]`)
        const tags = onSearchCatalog['bpp/providers'][i]['tags']
        if (!tags || !tags.length) {
          const key = `prvdr${i}tags`
          errorObj[key] = `tags must be present in bpp/providers[${i}]`
        }

        if (tags) {
          const circleRequired = checkServiceabilityType(tags)
          if (circleRequired) {
            const errors = validateLocations(message.catalog['bpp/providers'][i].locations, tags)
            errorObj = { ...errorObj, ...errors }
          }
        }

        //checking for each serviceability construct and matching serviceability constructs with the previous ones
        const serviceabilitySet = new Set()
        const timingSet = new Set()
        tags.forEach((sc: any, t: any) => {
          if (sc.code === 'serviceability') {
            if (serviceabilitySet.has(JSON.stringify(sc))) {
              const key = `prvdr${i}tags${t}`
              errorObj[key] =
                `serviceability construct /bpp/providers[${i}]/tags[${t}] should not be same with the previous serviceability constructs`
            }

            serviceabilitySet.add(JSON.stringify(sc))
            if ('list' in sc) {
              if (sc.list.length != 5) {
                const key = `prvdr${i}tags${t}`
                errorObj[key] =
                  `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract`
              }

              //checking location
              const loc = sc.list.find((elem: any) => elem.code === 'location') || ''
              if (!loc) {
                const key = `prvdr${i}tags${t}loc`
                errorObj[key] =
                  `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (location is missing)`
              } else {
                if ('value' in loc) {
                  if (!prvdrLocId.has(loc.value)) {
                    const key = `prvdr${i}tags${t}loc`
                    errorObj[key] =
                      `location in serviceability construct should be one of the location ids bpp/providers[${i}]/locations`
                  }
                } else {
                  const key = `prvdr${i}tags${t}loc`
                  errorObj[key] =
                    `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (location is missing)`
                }
              }

              //checking category
              const ctgry = sc.list.find((elem: any) => elem.code === 'category') || ''
              if (!ctgry) {
                const key = `prvdr${i}tags${t}ctgry`
                errorObj[key] =
                  `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (category is missing)`
              } else {
                if ('value' in ctgry) {
                  if (!itemCategory_id.has(ctgry.value)) {
                    const key = `prvdr${i}tags${t}ctgry`
                    errorObj[key] =
                      `category in serviceability construct should be one of the category ids bpp/providers[${i}]/items/category_id`
                  }
                } else {
                  const key = `prvdr${i}tags${t}ctgry`
                  errorObj[key] =
                    `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (category is missing)`
                }
              }

              //checking type (hyperlocal, intercity or PAN India)
              const type = sc.list.find((elem: any) => elem.code === 'type') || ''
              if (!type) {
                const key = `prvdr${i}tags${t}type`
                errorObj[key] =
                  `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (type is missing)`
              } else {
                if ('value' in type) {
                  switch (type.value) {
                    case '10':
                      {
                        //For hyperlocal

                        //checking value
                        const val = sc.list.find((elem: any) => elem.code === 'val') || ''
                        if ('value' in val) {
                          if (isNaN(val.value)) {
                            const key = `prvdr${i}tags${t}valvalue`
                            errorObj[key] =
                              `value should be a number (code:"val") for type 10 (hyperlocal) in /bpp/providers[${i}]/tags[${t}]`
                          }
                        } else {
                          const key = `prvdr${i}tags${t}val`
                          errorObj[key] =
                            `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (value is missing for code "val")`
                        }

                        //checking unit
                        const unit = sc.list.find((elem: any) => elem.code === 'unit') || ''
                        if ('value' in unit) {
                          if (unit.value != 'km') {
                            const key = `prvdr${i}tags${t}unitvalue`
                            errorObj[key] =
                              `value should be "km" (code:"unit") for type 10 (hyperlocal) in /bpp/providers[${i}]/tags[${t}]`
                          }
                        } else {
                          const key = `prvdr${i}tags${t}unit`
                          errorObj[key] =
                            `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (value is missing for code "unit")`
                        }
                      }

                      break
                    case '11':
                      {
                        //intercity

                        //checking value
                        const val = sc.list.find((elem: any) => elem.code === 'val') || ''
                        if ('value' in val) {
                          const pincodes = val.value.split(/,|-/)
                          pincodes.forEach((pincode: any) => {
                            if (isNaN(pincode) || pincode.length != 6) {
                              const key = `prvdr${i}tags${t}valvalue`
                              errorObj[key] =
                                `value should be a valid range of pincodes (code:"val") for type 11 (intercity) in /bpp/providers[${i}]/tags[${t}]`
                            }
                          })
                        } else {
                          const key = `prvdr${i}tags${t}val`
                          errorObj[key] =
                            `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (value is missing for code "val")`
                        }

                        //checking unit
                        const unit = sc.list.find((elem: any) => elem.code === 'unit') || ''
                        if ('value' in unit) {
                          if (unit.value != 'pincode') {
                            const key = `prvdr${i}tags${t}unitvalue`
                            errorObj[key] =
                              `value should be "pincode" (code:"unit") for type 11 (intercity) in /bpp/providers[${i}]/tags[${t}]`
                          }
                        } else {
                          const key = `prvdr${i}tags${t}unit`
                          errorObj[key] =
                            `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (value is missing for code "unit")`
                        }
                      }

                      break
                    case '12':
                      {
                        //PAN India

                        //checking value
                        const val = sc.list.find((elem: any) => elem.code === 'val') || ''
                        if ('value' in val) {
                          if (val.value != 'IND') {
                            const key = `prvdr${i}tags${t}valvalue`
                            errorObj[key] =
                              `value should be "IND" (code:"val") for type 12 (PAN India) in /bpp/providers[${i}]tags[${t}]`
                          }
                        } else {
                          const key = `prvdr${i}tags${t}val`
                          errorObj[key] =
                            `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (value is missing for code "val")`
                        }

                        //checking unit
                        const unit = sc.list.find((elem: any) => elem.code === 'unit') || ''
                        if ('value' in unit) {
                          if (unit.value != 'country') {
                            const key = `prvdr${i}tags${t}unitvalue`
                            errorObj[key] =
                              `value should be "country" (code:"unit") for type 12 (PAN India) in /bpp/providers[${i}]tags[${t}]`
                          }
                        } else {
                          const key = `prvdr${i}tags${t}unit`
                          errorObj[key] =
                            `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (value is missing for code "unit")`
                        }
                      }

                      break
                    default: {
                      const key = `prvdr${i}tags${t}type`
                      errorObj[key] =
                        `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (invalid type "${type.value}")`
                    }
                  }
                } else {
                  const key = `prvdr${i}tags${t}type`
                  errorObj[key] =
                    `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (type is missing)`
                }
              }
            }
          }
          if (sc.code === 'timing') {
            if (timingSet.has(JSON.stringify(sc))) {
              const key = `prvdr${i}tags${t}`
              errorObj[key] =
                `timing construct /bpp/providers[${i}]/tags[${t}] should not be same with the previous timing constructs`
            }

            timingSet.add(JSON.stringify(sc))
            const fulfillments = prvdr['fulfillments']
            const fulfillmentTypes = fulfillments.map((fulfillment: any) => fulfillment.type)

            let isOrderPresent = false
            const typeCode = sc?.list.find((item: any) => item.code === 'type')
            if (typeCode) {
              const timingType = typeCode.value
              if (
                timingType === 'Order' ||
                timingType === 'Delivery' ||
                timingType === 'Self-Pickup' ||
                timingType === 'All'
              ) {
                isOrderPresent = true
              } else if (!fulfillmentTypes.includes(timingType)) {
                errorObj[`provider[${i}].timing`] =
                  `The type '${timingType}' in timing tags should match with types in fulfillments array, along with 'Order'`
              }
            }

            if (!isOrderPresent) {
              errorObj[`provider[${i}].tags.timing`] = `'Order' type must be present in timing tags`
            }
          }
        })
        if (isEmpty(serviceabilitySet)) {
          const key = `prvdr${i}tags/serviceability`
          errorObj[key] =
            `serviceability construct is mandatory in /bpp/providers[${i}]/tags`
        }
        if (isEmpty(timingSet)) {
          const key = `prvdr${i}tags/timing`
          errorObj[key] =
            `timing construct is mandatory in /bpp/providers[${i}]/tags`
        }
      } catch (error: any) {
        logger.error(`!!Error while checking serviceability construct for bpp/providers[${i}], ${error.stack}`)
      }

      try {
        logger.info(
          `Checking if catalog_link type in message/catalog/bpp/providers[${i}]/tags[1]/list[0] is link or inline`,
        )
        const tags = bppPrvdrs[i].tags

        let list: any = []
        tags.map((data: any) => {
          if (data.code == 'catalog_link') {
            list = data.list
          }
        })

        list.map((data: any) => {
          if (data.code === 'type') {
            if (data.value === 'link') {
              if (bppPrvdrs[0].items) {
                errorObj[`message/catalog/bpp/providers[0]`] =
                  `Items arrays should not be present in message/catalog/bpp/providers[${i}]`
              }
            }
          }
        })
      } catch (error: any) {
        logger.error(`Error while checking the type of catalog_link`)
      }

      i++
    }

    setValue(`${ApiSequence.ON_SEARCH}prvdrLocId`, prvdrLocId)
    setValue(`${ApiSequence.ON_SEARCH}itemsId`, itemsId)
  } catch (error: any) {
    logger.error(`!!Error while checking Providers info in /${constants.ON_SEARCH}, ${error.stack}`)
  }

  return Object.keys(errorObj).length > 0 && errorObj
}