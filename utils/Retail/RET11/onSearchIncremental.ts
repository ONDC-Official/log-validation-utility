/* eslint-disable no-case-declarations */
/* eslint-disable no-prototype-builtins */
import { logger } from '../../../shared/logger'
import { setValue, getValue } from '../../../shared/dao'
import constants, { ApiSequence } from '../../../constants'
import { validateSchema, isObjectEmpty, checkContext, checkGpsPrecision, emailRegex } from '../../../utils'
import _, { isEmpty } from 'lodash'

export const checkOnsearchIncremental = (data: any, msgIdSet: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [ApiSequence.INC_ONSEARCH]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.catalog || isObjectEmpty(message) || isObjectEmpty(message.catalog)) {
    return { missingFields: '/context, /message, /catalog or /message/catalog is missing or empty' }
  }

  const schemaValidation = validateSchema('RET11', 'on_search_inc', data)

  const contextRes: any = checkContext(context, constants.RET_ONSEARCH)
  setValue(`${ApiSequence.INC_ONSEARCH}_context`, context)
  msgIdSet.add(context.message_id)

  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  setValue(`${ApiSequence.INC_ONSEARCH}`, data)

  const incSearchContext: any = getValue(`${ApiSequence.INC_SEARCH}_context`)
  const onSearchMessage: any = getValue(`${ApiSequence.ON_SEARCH}_message`)

  try {
    logger.info(`Storing BAP_ID and BPP_ID in /${constants.RET_ONSEARCH}`)
    setValue('bapId', context.bap_id)
    setValue('bppId', context.bpp_id)
  } catch (error: any) {
    logger.error(`!!Error while storing BAP and BPP Ids in /${constants.RET_ONSEARCH}, ${error.stack}`)
  }

  try {
    logger.info(`Comparing transaction Ids of /${ApiSequence.INC_SEARCH} and /${ApiSequence.INC_ONSEARCH}`)
    if (!_.isEqual(incSearchContext.transaction_id, context.transaction_id)) {
      errorObj.transaction_id = `Transaction Id for /${ApiSequence.INC_SEARCH} and /${ApiSequence.INC_ONSEARCH} api should be same`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing transaction ids for /${ApiSequence.INC_SEARCH} and /${ApiSequence.INC_ONSEARCH} api, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing Message Ids of /${ApiSequence.INC_SEARCH} and /${ApiSequence.INC_ONSEARCH}`)
    if (!_.isEqual(incSearchContext.message_id, context.message_id)) {
      errorObj.message_id = `Message Id for /${ApiSequence.INC_SEARCH} and /${ApiSequence.INC_ONSEARCH} api should be same`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing message ids for /${ApiSequence.INC_SEARCH} and /${ApiSequence.INC_ONSEARCH} api, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing message for /${ApiSequence.ON_SEARCH} & /${ApiSequence.INC_ONSEARCH}`)
    if (JSON.stringify(message) === JSON.stringify(onSearchMessage)) {
      // return if message is same as on_search_full_catalog_refresh
      errorObj.message = `Message object is same for /${ApiSequence.ON_SEARCH} & /${ApiSequence.INC_ONSEARCH} api `
      return
    }
  } catch (error: any) {
    logger.info(`Error while comparing message object for /${ApiSequence.ON_SEARCH} &
 /${ApiSequence.INC_ONSEARCH}, ${error.stack}`)
  }

  const onSearchCatalog: any = message.catalog
  const onSearchFFIds: any = getValue('onSearchFFIds')

  const prvdrsId = new Set()

  try {
    logger.info(`Checking Providers info (bpp/providers) in /${constants.RET_ONSEARCH}`)
    let i = 0
    if (!_.isEmpty(onSearchCatalog['bpp/fulfillments'])) {
      errorObj.bppFulfillments = `bpp/fulfillments sent in payload shoulnd't be part of /${ApiSequence.INC_ONSEARCH} api`
    }

    if (!_.isEmpty(onSearchCatalog['bpp/descriptor'])) {
      errorObj.bppDescriptor = `bpp/descriptor sent in payload shoulnd't be part of /${ApiSequence.INC_ONSEARCH} api`
    }

    const bppPrvdrs = onSearchCatalog['bpp/providers']
    const len = bppPrvdrs.length
    const tmpstmp = context.timestamp
    const onSearchPrvdrIDS: any = getValue(`${ApiSequence.ON_SEARCH}prvdrsId`)
    while (i < len) {
      const itemsId = new Set()
      const prvdrLocId = new Set()
      const categoriesId = new Set()
      const customGrpId = new Set()
      const seqSet = new Set()
      const itemCategory_id = new Set()

      logger.info(`Validating uniqueness for provider id in bpp/providers[${i}]...`)
      const prvdr = bppPrvdrs[i]

      if (onSearchPrvdrIDS && !onSearchPrvdrIDS.includes(prvdr.id)) {
        const key = `prvdr${i}id`
        errorObj[
          key
        ] = `provider id: ${prvdr.id} in bpp/providers didn't matched for providers id of /${ApiSequence.ON_SEARCH}`
      } else {
        if (prvdrsId.has(prvdr.id)) {
          const key = `prvdr${i}id`
          errorObj[key] = `duplicate provider id: ${prvdr.id} in bpp/providers`
        } else {
          prvdrsId.add(prvdr.id)
        }

        const prvdrFullRefresh = onSearchMessage.catalog['bpp/providers'].find((obj: any) => obj.id === prvdr.id)
        if (!_.isEmpty(prvdr.time)) {
          logger.info(`Checking store enable/disable timestamp in bpp/providers[${i}]`)
          const providerTime = new Date(prvdr.time.timestamp).getTime()
          const contextTimestamp = new Date(tmpstmp).getTime()

          if (prvdr.time.label !== 'close' && providerTime > contextTimestamp) {
            errorObj.StoreEnableDisable = `store enable/disable timestamp (/bpp/providers/time/timestamp) should be less then or equal to context.timestamp`
          }

          //time label shouldn't be same as on on_search_full_catalog_refresh
          if (prvdr.time.lable === prvdrFullRefresh.time.label) {
            errorObj.StoreTimeLabel = `store enable/disable timestamp (/bpp/providers/time/timestamp) for /${ApiSequence.INC_ONSEARCH} should not be equal to /${ApiSequence.ON_SEARCH}.timestamp`
          }

          //items shouldn't be present if store is dissable
          if (prvdr.time.lable === 'disable' && _.isEmpty(prvdr.items)) {
            errorObj.Items = `For /${ApiSequence.INC_ONSEARCH} if store is disabled then now items should be sent`
          }
        }

        if (!isEmpty(prvdr.locations)) {
          const onSearchPrvdrLocIDS: any = getValue(`${ApiSequence.ON_SEARCH}prvdrLocId`)
          prvdr.locations.forEach((loc: any, iter: any) => {
            if (onSearchPrvdrLocIDS.includes(loc?.id)) {
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
                  errorObj[
                    key
                  ] = `store days (bpp/providers[${i}]/locations[${iter}]/time/days) should be in the format ("1,2,3,4,5,6,7") where 1- Monday and 7- Sunday`
                }
              })

              logger.info('Checking fixed or split timings')
              //scenario 1: range =1 freq/times =1
              if (loc.time.range && (loc.time.schedule.frequency || loc.time.schedule.times)) {
                const key = `prvdr${i}loctime${iter}`
                errorObj[
                  key
                ] = `Either one of fixed (range) or split (frequency and times) timings should be provided in /bpp/providers[${i}]/locations[${iter}]/time`
              }

              // scenario 2: range=0 freq || times =1
              if (!loc.time.range && (!loc.time.schedule.frequency || !loc.time.schedule.times)) {
                const key = `prvdr${i}loctime${iter}`
                errorObj[
                  key
                ] = `Either one of fixed timings (range) or split timings (both frequency and times) should be provided in /bpp/providers[${i}]/locations[${iter}]/time`
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

              // provider object from on_search_full_catalog_refresh
              const onSearchWithLocDetails = prvdrFullRefresh.locations.find((obj: any) => obj.id === loc.id)
              if (onSearchWithLocDetails.time.label === loc.time.label) {
                errorObj.locationTimeLabel = `location label (/bpp/providers/locations/time/label) for /${ApiSequence.INC_ONSEARCH} should not be equal to /${ApiSequence.ON_SEARCH}.label`
              }
            } else {
              errorObj.locationObject = `Location id sent in payload was not present in /${ApiSequence.ON_SEARCH} api `
            }
          })
        }

        if (!_.isEmpty(prvdr.items)) {
          try {
            logger.info(`Checking items for provider (${prvdr.id}) in bpp/providers[${i}]`)
            let j = 0
            const items = onSearchCatalog['bpp/providers'][i]['items']
            const iLen = items.length
            const itemsFullRefresh: any = getValue(`${ApiSequence.ON_SEARCH}itemsId`)
            while (j < iLen) {
              logger.info(`Validating uniqueness for item id in bpp/providers[${i}].items[${j}]...`)
              const item = items[j]

              if (itemsFullRefresh.includes(item?.id)) {
                const itemFullRefresh = prvdrFullRefresh.items.find((obj: any) => obj.id === item.id)
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

                if ('price' in item) {
                  const sPrice = parseFloat(item.price.value)
                  const maxPrice = parseFloat(item.price.maximum_value)

                  if (sPrice > maxPrice) {
                    const key = `prvdr${i}item${j}Price`
                    errorObj[
                      key
                    ] = `selling price of item /price/value with id: (${item.id}) can't be greater than the maximum price /price/maximum_value in /bpp/providers[${i}]/items[${j}]/`
                  }
                }

                logger.info(`Checking fulfillment_id for item id: ${item.id}`)

                if (item.fulfillment_id && !onSearchFFIds.includes(item.fulfillment_id)) {
                  const key = `prvdr${i}item${j}ff`
                  errorObj[
                    key
                  ] = `fulfillment_id in /bpp/providers[${i}]/items[${j}] should map to one of the fulfillments id in bpp/fulfillments`
                }

                logger.info(`Comparing fulfillment_id of /${constants.RET_SEARCH} and /${constants.RET_ONSEARCH} api`)

                if (item.fulfillment_id !== itemFullRefresh.fulfillment_id) {
                  const key = `prvdr${i}item${j}ff`
                  errorObj[
                    key
                  ] = `fulfillment_id in /bpp/providers[${i}]/items[${j}] should be same as fulfillment_id sent in /${constants.RET_SEARCH} api call`
                }

                logger.info(`Comparing location_id of /${constants.RET_SEARCH} and /${constants.RET_ONSEARCH} api`)

                if (item.location_id !== itemFullRefresh.location_id) {
                  const key = `prvdr${i}item${j}ff`
                  errorObj[
                    key
                  ] = `location_id in /bpp/providers[${i}]/items[${j}] should be same as location_id sent in /${constants.RET_SEARCH} api call`
                }

                logger.info(`Checking consumer care details for item id: ${item.id}`)
                if ('@ondc/org/contact_details_consumer_care' in item) {
                  let consCare = item['@ondc/org/contact_details_consumer_care']
                  consCare = consCare.split(',')
                  if (consCare.length < 3) {
                    const key = `prvdr${i}consCare`
                    errorObj[
                      key
                    ] = `@ondc/org/contact_details_consumer_care should be in the format "name,email,contactno" in /bpp/providers[${i}]/items`
                  } else {
                    const checkEmail: boolean = emailRegex(consCare[1].trim())
                    if (isNaN(consCare[2].trim()) || !checkEmail) {
                      const key = `prvdr${i}consCare`
                      errorObj[
                        key
                      ] = `@ondc/org/contact_details_consumer_care should be in the format "name,email,contactno" in /bpp/providers[${i}]/items`
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
                          errorObj[
                            key
                          ] = `item_id: ${item.id} should have custom_group_id one of the ids passed in categories bpp/providers[${i}]`
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
                        errorObj[
                          key
                        ] = `value in catalog/items${j}/tags${index}/config/list/ should be one of the catalog/category/ids`
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
                            if (
                              isNaN(dayValue) ||
                              dayValue < 1 ||
                              dayValue > 7 ||
                              !/^-?\d+(\.\d+)?$/.test(item.value)
                            ) {
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
                          errorObj[
                            key
                          ] = `item_id: ${item.id} should have veg_nonveg one of the 'veg', 'non_veg', 'egg' in bpp/providers[${i}]`
                        }
                      }

                      break
                  }
                })

                const itemFullRefreshWithoutTime = JSON.stringify(itemFullRefresh, replaceTimestamp)
                const itemWithoutTime = JSON.stringify(item, replaceTimestamp)
                if (itemFullRefreshWithoutTime === itemWithoutTime)
                  errorObj.item = `Similar Item as in /${ApiSequence.ON_SEARCH} api call, item id- ${item?.id}`
              }

              j++
            }
          } catch (error: any) {
            logger.error(`!!Errors while checking items in bpp/providers[${i}], ${error.stack}`)
          }
        }
      }

      i++
    }
  } catch (error: any) {
    logger.error(`!!Error while checking Providers info in /${constants.RET_ONSEARCH}, ${error.stack}`)
  }

  return Object.keys(errorObj).length > 0 && errorObj
}

const replaceTimestamp = (key: any, value: any): number | undefined => {
  if (key !== 'timestamp') return value
  else return undefined
}
