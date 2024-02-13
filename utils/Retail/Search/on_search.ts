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
  checkMandatoryTags,
  areTimestampsLessThanOrEqualTo,
  isValidPhoneNumber,
} from '../../../utils'
import _ from 'lodash'
import { compareSTDwithArea } from '../../index'
import { BPCJSON, groceryJSON, healthJSON, homeJSON } from '../../../constants/category'
import electronicsData from '../../../constants/electronics.json'
import applianceData from '../../../constants/appliance.json'
import fashionJSON from '../../../constants/fashion.json'
import { DOMAIN } from '../../../utils/enum'
export const checkOnsearch = (data: any, msgIdSet: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [ApiSequence.ON_SEARCH]: 'JSON cannot be empty' }
  }

  const { message, context } = data

  if (!message || !context || !message.catalog || isObjectEmpty(message) || isObjectEmpty(message.catalog)) {
    return { missingFields: '/context, /message, /catalog or /message/catalog is missing or empty' }
  }

  const schemaValidation = validateSchema(context.domain.split(':')[1], constants.ON_SEARCH, data)

  const contextRes: any = checkContext(context, constants.ON_SEARCH)
  setValue(`${ApiSequence.ON_SEARCH}_context`, context)
  setValue(`${ApiSequence.ON_SEARCH}_message`, message)
  msgIdSet.add(context.message_id)
  let errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  const checkBap = checkBppIdOrBapId(context.bap_id)
  const checkBpp = checkBppIdOrBapId(context.bpp_id)

  if (checkBap) Object.assign(errorObj, { bap_id: 'context/bap_id should not be a url' })
  if (checkBpp) Object.assign(errorObj, { bpp_id: 'context/bpp_id should not be a url' })
  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
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
    const address = providers[0].locations[0].address

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
  } catch (error: any) {
    logger.error(
      `Error while matching area_code and std code for /${constants.SEARCH} and /${constants.ON_SEARCH} api, ${error.stack}`,
    )
  }

  const onSearchCatalog: any = message.catalog
  const onSearchFFIds = new Set()
  const prvdrsId = new Set()
  const prvdrLocId = new Set()
  const itemsId = new Set()

  try {
    logger.info(`Saving static fulfillment ids in /${constants.ON_SEARCH}`)

    let i = 0
    const bppFF = onSearchCatalog['bpp/fulfillments']
    const len = bppFF.length
    while (i < len) {
      onSearchFFIds.add(bppFF[i].id)
      i++
    }
  } catch (error: any) {
    logger.info(`Error while saving static fulfillment ids in /${constants.ON_SEARCH}, ${error.stack}`)
  }

  setValue('onSearchFFIds', onSearchFFIds)

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

      logger.info(`Validating uniqueness for provider id in bpp/providers[${i}]...`)
      const prvdr = bppPrvdrs[i]

      if (prvdrsId.has(prvdr.id)) {
        const key = `prvdr${i}id`
        errorObj[key] = `duplicate provider id: ${prvdr.id} in bpp/providers`
      } else {
        prvdrsId.add(prvdr.id)
      }

      logger.info(`Checking store enable/disable timestamp in bpp/providers[${i}]`)
      const providerTime = new Date(prvdr.time.timestamp).getTime()
      const contextTimestamp = new Date(tmpstmp).getTime()

      if (providerTime > contextTimestamp) {
        errorObj.StoreEnableDisable = `store enable/disable timestamp (/bpp/providers/time/timestamp) should be less then or equal to context.timestamp`
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
          if (prvdrLocId.has(loc.id)) {
            const key = `prvdr${i}${loc.id}${iter}`
            errorObj[key] = `duplicate location id: ${loc.id} in /bpp/providers[${i}]/locations[${iter}]`
          } else {
            prvdrLocId.add(loc.id)
          }

          logger.info('Checking store days...')
          const days = loc.time.days.split(',')
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
          if (loc.time.range && (loc.time.schedule?.frequency || loc.time.schedule?.times)) {
            const key = `prvdr${i}loctime${iter}`
            errorObj[key] =
              `Either one of fixed (range) or split (frequency and times) timings should be provided in /bpp/providers[${i}]/locations[${iter}]/time`
          }

          // scenario 2: range=0 freq || times =1
          if (!loc.time.range && (!loc.time.schedule?.frequency || !loc.time.schedule?.times)) {
            const key = `prvdr${i}loctime${iter}`
            errorObj[key] =
              `Either one of fixed timings (range) or split timings (both frequency and times) should be provided in /bpp/providers[${i}]/locations[${iter}]/time`
          }

          //scenario 3: range=1 (start and end not compliant) frequency=0;
          if ('range' in loc.time) {
            logger.info('checking range (fixed timings) start and end')
            const startTime: any = 'start' in loc.time.range ? parseInt(loc.time.range.start) : ''
            const endTime: any = 'end' in loc.time.range ? parseInt(loc.time.range.end) : ''
            if (isNaN(startTime) || isNaN(endTime) || startTime > endTime || endTime > 2359) {
              errorObj.startEndTime = `end time must be greater than start time in fixed timings /locations/time/range (fixed store timings)`
            }
          }
        } catch (error: any) {
          logger.error(`Validation error for frequency: ${error.stack}`)
        }
      })

      try {
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
          if (dateObj.getTime() > currentDateObj.getTime()) {
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
        const iLen = categories?.length
        while (j < iLen) {
          logger.info(`Validating uniqueness for categories id in bpp/providers[${i}].items[${j}]...`)
          const category = categories[j]

          const fulfillments = onSearchCatalog['bpp/providers'][i]['fulfillments']
          const phoneNumber = fulfillments[i].contact.phone

          if (!isValidPhoneNumber(phoneNumber)) {
            const key = `bpp/providers${i}fulfillments${i}`
            errorObj[key] = `Please enter a valid phone number consisting of  10 or  11 digits without any spaces or special characters. `
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

          logger.info(`Checking selling price and maximum price for item id: ${item.id}`)

          const statutory_reqs_prepackaged_food = onSearchCatalog['bpp/providers'][i]['items'][j]['@ondc/org/statutory_reqs_prepackaged_food'];
          console.log("checking statutary", statutory_reqs_prepackaged_food);
          
          if (context.domain === 'ONDC:RET18') {

            if (!statutory_reqs_prepackaged_food.ingredients_info) {
              const key = `prvdr${i}items${j}@ondc/org/statutory_reqs_prepackaged_food`
              errorObj[key] =
                `In ONDC:RET18 is valid key ingredients_info `
            }
          } else if (context.domain === 'ONDC:RET10') {
            const mandatoryFields = ['nutritional_info', 'additives_info', 'brand_owner_FSSAI_license_no', 'imported_product_country_of_origin', 'net_quantity'];
            mandatoryFields.forEach(field => {
              if (!statutory_reqs_prepackaged_food[field]) {
                const key = `prvdr${i}items${j}@ondc/org/statutory_reqs_prepackaged_food`
                errorObj[key] =
                  `In ONDC:RET10 @ondc/org/statutory_reqs_prepackaged_food is not according to api contract`
              }
            });
          } 
          //check availabe and max quantity
          if (item.quantity && item.quantity.available && typeof item.quantity.available.count === 'string') {
            const availCount = parseInt(item.quantity.available.count, 10)
            if (availCount !== 99 && availCount !== 0) {
              const key = `prvdr${i}item${j}availCount`
              errorObj[key] =
                `item.quantity.available.count should be either 99 (inventory available) or 0 (out-of-stock) in /bpp/providers[${i}]/items[${j}]`
            }
          }

          if (item.quantity && item.quantity.maximum && typeof item.quantity.maximum.count === 'string') {
            const maxCount = parseInt(item.quantity.maximum.count, 10)
            if (maxCount !== 99 && maxCount <= 0) {
              const key = `prvdr${i}item${j}maxCount`
              errorObj[key] =
                `item.quantity.maximum.count should be either default value 99 (no cap per order) or any other positive value (cap per order) in /bpp/providers[${i}]/items[${j}]`
            }
          }

          if ('price' in item) {
            const sPrice = parseFloat(item.price.value)
            const maxPrice = parseFloat(item.price.maximum_value)

            if (sPrice > maxPrice) {
              const key = `prvdr${i}item${j}Price`
              errorObj[key] =
                `selling price of item /price/value with id: (${item.id}) can't be greater than the maximum price /price/maximum_value in /bpp/providers[${i}]/items[${j}]/`
            }
          }

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

          if (item.fulfillment_id && !onSearchFFIds.has(item.fulfillment_id)) {
            const key = `prvdr${i}item${j}ff`
            errorObj[key] =
              `fulfillment_id in /bpp/providers[${i}]/items[${j}] should map to one of the fulfillments id in bpp/fulfillments`
          }

          logger.info(`Checking location_id for item id: ${item.id}`)

          if (item.location_id && !prvdrLocId.has(item.location_id)) {
            const key = `prvdr${i}item${j}loc`
            errorObj[key] =
              `location_id in /bpp/providers[${i}]/items[${j}] should be one of the locations id in /bpp/providers[${i}]/locations`
          }

          logger.info(`Checking consumer care details for item id: ${item.id}`)
          if ('@ondc/org/contact_details_consumer_care' in item) {
            let consCare = item['@ondc/org/contact_details_consumer_care']
            consCare = consCare.split(',')
            if (consCare.length < 3) {
              const key = `prvdr${i}consCare`
              errorObj[key] =
                `@ondc/org/contact_details_consumer_care should be in the format "name,email,contactno" in /bpp/providers[${i}]/items`
            } else {
              const checkEmail: boolean = emailRegex(consCare[1].trim())
              if (isNaN(consCare[2].trim()) || !checkEmail) {
                const key = `prvdr${i}consCare`
                errorObj[key] =
                  `@ondc/org/contact_details_consumer_care should be in the format "name,email,contactno" in /bpp/providers[${i}]/items`
              }
            }
          }

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

                  if (!item.category_ids) {
                    const key = `prvdr${i}item${j}ctgry_ids`
                    errorObj[key] = `item_id: ${item.id} should contain category_ids in bpp/providers[${i}]`
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
                const allowedCodes = ['veg', 'non_veg']

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

          j++
        }
      } catch (error: any) {
        logger.error(`!!Errors while checking items in bpp/providers[${i}], ${error.stack}`)
      }

      // Checking for mandatory Items in provider IDs
      try {
        logger.info(`Checking for item tags in bpp/providers[0].items.tags `)
        const domain = context.domain.split(':')[1]
        logger.info(`Checking for item tags in bpp/providers[0].items.tags in ${domain}`)
        for(let i in onSearchCatalog['bpp/providers']){
          const items = onSearchCatalog['bpp/providers'][i].items
          let errors: any
          switch (domain) {
            case DOMAIN.RET10:
              errors = checkMandatoryTags(items, errorObj, groceryJSON, 'Grocery')
              break
            case DOMAIN.RET12:
              errors = checkMandatoryTags(items, errorObj, fashionJSON, 'Fashion')
              break
            case DOMAIN.RET13:
              errors = checkMandatoryTags(items, errorObj, BPCJSON, 'BPC')
              break
            case DOMAIN.RET14:
              errors = checkMandatoryTags(items, errorObj, electronicsData, 'Electronics')
              break
            case DOMAIN.RET15:
              errors = checkMandatoryTags(items, errorObj, applianceData, 'Appliances')
              break
            case DOMAIN.RET16:
              errors = checkMandatoryTags(items, errorObj, homeJSON, 'Home & Kitchen')
              break
            case DOMAIN.RET18:
              errors = checkMandatoryTags(items, errorObj, healthJSON, 'Health & Wellness')
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
              const key = `bpp/providers/items/time/timestamp[${index}]`
              errorObj[key] = `Timestamp for item[${index}] can't be grater than context.timestamp`
              logger.error(`Timestamp for item[${index}] can't be grater than context.timestamp`)
            }
          })
        }
      } catch (error: any) {
        logger.error(
          `!!Errors while checking timestamp in context.timestamp and bpp/providers/items/time/timestamp, ${error.stack}`,
        )
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
        if (tags) {
          const circleRequired = checkServiceabilityType(tags)
          if (circleRequired) {
            const errors = validateLocations(message.catalog['bpp/providers'][i].locations, tags)
            errorObj = { ...errorObj, ...errors }
          }
        }

        //checking for each serviceability construct
        tags.forEach((sc: any, t: any) => {
          if (sc.code === 'serviceability') {
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
        })
      } catch (error: any) {
        logger.error(`!!Error while checking serviceability construct for bpp/providers[${i}], ${error.stack}`)
      }

      i++
    }

    setValue(`${ApiSequence.ON_SEARCH}prvdrsId`, prvdrsId)
    setValue(`${ApiSequence.ON_SEARCH}prvdrLocId`, prvdrLocId)
    setValue(`${ApiSequence.ON_SEARCH}itemsId`, itemsId)
  } catch (error: any) {
    logger.error(`!!Error while checking Providers info in /${constants.ON_SEARCH}, ${error.stack}`)
  }

  return Object.keys(errorObj).length > 0 && errorObj
}
