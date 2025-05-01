import { logger } from "../../../shared/logger"

  export const validateQuote = (quote: any, action: string) => {
    const errorObj: any = {}
    try {
      logger.info(`Checking quote details in /${action}`)
      if (!quote?.price?.value) errorObj.price.value = `price.value is missing in quote`
      if (!quote?.price?.currency) errorObj.price.currency = `price.currency is missing in quote`
    //   if (!quote?.ttl) errorObj.ttl = `ttl is missing in quote`
  
      const quoteBreakup = quote?.breakup
      if (!quoteBreakup) {
        errorObj.quoteBreakup = `Quote.breakup is missing`
      } else {
        const validBreakupItems = ['BASE_FARE', 'TAX','ADD_ONS']
  
        if (action == 'soft_on_cancel') {
          validBreakupItems.push('CANCELLATION_CHARGES')
        }
  
        const requiredBreakupItems = validBreakupItems.filter((item) =>
          quoteBreakup.some((breakupItem: any) => breakupItem.title.toUpperCase() === item),
        )
  
        const missingBreakupItems = validBreakupItems.filter((item) => !requiredBreakupItems.includes(item))
  
        if (missingBreakupItems.length > 0) {
          errorObj.missingBreakupItems = `Quote breakup is missing the following items: ${missingBreakupItems.join(', ')}`
        }
  
        const additionalBreakupItems = quoteBreakup.filter(
          (breakupItem: any) => !validBreakupItems.includes(breakupItem.title.toUpperCase()),
        )
  
        if (additionalBreakupItems.length > 0) {
          const additionalItemsList = additionalBreakupItems.map((item: any) => item.title).join(', ')
          errorObj.additionalBreakupItems = `Quote breakup contains additional invalid items: ${additionalItemsList}`
        }
  
        const totalBreakupValue = quoteBreakup.reduce((total: any, item: any) => {
          const itemValue = parseFloat(item.price.value)
          return isNaN(itemValue) ? total : total + itemValue
          return total
        }, 0)
  
        const priceValue = parseFloat(quote.price.value)
  
        if (isNaN(totalBreakupValue)) {
          errorObj.breakupTotalMismatch = 'Invalid values in quote breakup'
        } else if (totalBreakupValue !== priceValue) {
          errorObj.breakupTotalMismatch = `Total of quote breakup (${totalBreakupValue}) does not match with price.value (${priceValue})`
        }
  
        const currencies = quoteBreakup.map((item: any) => item.currency)
        if (new Set(currencies).size !== 1) {
          errorObj.multipleCurrencies = 'Currency must be the same for all items in the quote breakup'
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking quote details in /${action}`, error.stack)
    }
  
    return errorObj
  }

  export function validateTagsStructure(tags: any[]) {

    const errorObj: any = {}

    const expectedListItemsofBap = [
        "BUYER_FINDER_FEES_PERCENTAGE",
        "BUYER_FINDER_FEES_TYPE",
        "STATIC_TERMS",
        "SETTLEMENT_BASIS",
        "SETTLEMENT_WINDOW",
    ];

    const expectedListItemsofBpp = [
        "SETTLEMENT_BANK_ACCOUNT_NUMBER",
        "SETTLEMENT_BANK_CODE",
        "SETTLEMENT_TYPE",
        "SETTLEMENT_AMOUNT",
        "DELAY_INTEREST",
        "COURT_JURISDICTION",
        "MANDATORY_ARBITRATION"
    ]

    tags.forEach((tag: any)=>{
        if(!tag.descriptor){
            errorObj.descriptor = `descriptor does not exist`
        }
        if(!tag.descriptor.code){
            errorObj.descriptor.code = `descriptor code does not exist`
        }
        if(tag.descriptor.code === "BAP"){
            tag.list.forEach((itm: any , index :number)=>{
                if(!expectedListItemsofBap.includes(itm.descriptor.code)){
                    errorObj.list=`tag/list ${index} descriptor code is not valid`
                }
            })
        }
        if(tag.descriptor.code === "BPP"){
            tag.list.forEach((itm: any , index :number)=>{
                if(!expectedListItemsofBpp.includes(itm.descriptor.code)){
                    errorObj.list=`tag/list ${index} descriptor code is not valid`
                }
            })
        }
    })
    
    return errorObj; 
  }

  export function compareReplacementTerms(actual: any, expected: any): string[] {
  const errors: string[] = [];

  if (actual.length !== expected.length) {
    errors.push(`Replacement terms length mismatch: ${actual.length} vs ${expected.length}`);
    return errors;
  }

  const unmatched = [...expected];

  actual.forEach((aTerm:any) => {
    const matchIndex = unmatched.findIndex(eTerm =>
      eTerm.external_ref.mimetype === aTerm.external_ref.mimetype &&
      eTerm.external_ref.url === aTerm.external_ref.url
    );

    if (matchIndex === -1) {
      errors.push(`No matching replacement_term found for: mimetype=${aTerm.external_ref.mimetype}, url=${aTerm.external_ref.url}`);
    } else {
      unmatched.splice(matchIndex, 1); // Remove matched entry
    }
  });

  if (unmatched.length > 0) {
    unmatched.forEach((eTerm) => {
      errors.push(`Missing expected replacement_term: mimetype=${eTerm.external_ref.mimetype}, url=${eTerm.external_ref.url}`);
    });
  }
  return errors;

  } 
  
  export  function compareProviders(provider1: any, provider2: any): string[] {
    const errors: string[] = [];
  
    if (provider1.id !== provider2.id) {
      errors.push(`Provider id mismatch: ${provider1.id} vs ${provider2.id}`);
    }
  
    if (provider1.descriptor.name !== provider2.descriptor.name) {
      errors.push(`Provider name mismatch: ${provider1.descriptor.name} vs ${provider2.descriptor.name}`);
    }
  
    if (provider1.descriptor.images.length !== provider2.descriptor.images.length) {
      errors.push(`Provider images length mismatch`);
    } else {
      provider1.descriptor.images.forEach((img:any, index:any) => {
        const otherImg = provider2.descriptor.images[index];
        if (img.size_type !== otherImg.size_type || img.url !== otherImg.url) {
          errors.push(`Provider image mismatch at index ${index}`);
        }
      });
    }
  
    if (provider1.locations.length !== provider2.locations.length) {
      errors.push(`Provider locations length mismatch`);
    } else {
      provider1.locations.forEach((loc:any, index:any) => {
        const otherLoc = provider2.locations[index];
  
        if (loc.id !== otherLoc.id) {
          errors.push(`Location id mismatch at index ${index}`);
        }
        if (loc.gps !== otherLoc.gps) {
          errors.push(`Location gps mismatch at index ${index}`);
        }
        if (loc.rating !== otherLoc.rating) {
          errors.push(`Location rating mismatch at index ${index}`);
        }
        if (loc.descriptor.name !== otherLoc.descriptor.name) {
          errors.push(`Location name mismatch at index ${index}`);
        }
        if (loc.descriptor.short_desc !== otherLoc.descriptor.short_desc) {
          errors.push(`Location short_desc mismatch at index ${index}`);
        }
  
        if (loc.descriptor.additional_desc.content_type !== otherLoc.descriptor.additional_desc.content_type ||
            loc.descriptor.additional_desc.url !== otherLoc.descriptor.additional_desc.url) {
          errors.push(`Location additional_desc mismatch at index ${index}`);
        }
  
        if (loc.descriptor.images.length !== otherLoc.descriptor.images.length) {
          errors.push(`Location images length mismatch at index ${index}`);
        } else {
          loc.descriptor.images.forEach((img:any, imgIndex:any) => {
            const otherImg = otherLoc.descriptor.images[imgIndex];
            if (img.size_type !== otherImg.size_type || img.url !== otherImg.url) {
              errors.push(`Location image mismatch at location ${index}, image ${imgIndex}`);
            }
          });
        }
      });
    }
  
    return errors;
  }
  
  export function comparePayments(payments1: any, payments2: any): string[] {
    const errors: string[] = [];
  
    if (payments1.length !== payments2.length) {
      errors.push(`Payments array length mismatch: ${payments1.length} vs ${payments2.length}`);
      return errors; // can't compare further if lengths don't match
    }
  
    payments1.forEach((p1: any, index: any) => {
      const p2 = payments2[index];
  
      if (p1.id !== p2.id) {
        errors.push(`Payment id mismatch at index ${index}: ${p1.id} vs ${p2.id}`);
      }
  
      if (p1.collected_by !== p2.collected_by) {
        errors.push(`Payment collected_by mismatch at index ${index}: ${p1.collected_by} vs ${p2.collected_by}`);
      }
  
      if (p1.status !== p2.status) {
        errors.push(`Payment status mismatch at index ${index}: ${p1.status} vs ${p2.status}`);
      }
  
      if (p1.type !== p2.type) {
        errors.push(`Payment type mismatch at index ${index}: ${p1.type} vs ${p2.type}`);
      }
  
      if (p1.params.transaction_id !== p2.params.transaction_id) {
        errors.push(`Payment transaction_id mismatch at index ${index}: ${p1.params.transaction_id} vs ${p2.params.transaction_id}`);
      }
  
      if (p1.params.currency !== p2.params.currency) {
        errors.push(`Payment currency mismatch at index ${index}: ${p1.params.currency} vs ${p2.params.currency}`);
      }
  
      if (p1.params.amount !== p2.params.amount) {
        errors.push(`Payment amount mismatch at index ${index}: ${p1.params.amount} vs ${p2.params.amount}`);
      }
    });
  
    return errors;
  }

  export function compareOnFulfillments(f1: any, f2: any): string[] {
    const errors: string[] = [];
  
    if (f1.length !== f2.length) {
      errors.push(`Fulfillments array length mismatch: ${f1.length} vs ${f2.length}`);
      return errors;
    }
  
    f1.forEach((a:any, index:any) => {
      const b = f2[index];
  
      if (a.id !== b.id) errors.push(`Fulfillment id mismatch at index ${index}: ${a.id} vs ${b.id}`);
      if (a.type !== b.type) errors.push(`Fulfillment type mismatch at index ${index}: ${a.type} vs ${b.type}`);
      // if (a.state.descriptor.code !== b.state.descriptor.code) {
      //   errors.push(`Fulfillment state.descriptor.code mismatch at index ${index}: ${a.state.descriptor.code} vs ${b.state.descriptor.code}`);
      // }
  
      if (a.stops.length !== b.stops.length) {
        errors.push(`Fulfillment stops length mismatch at index ${index}`);
      } else {
        a.stops.forEach((stopA: any, stopIndex: any) => {
          const stopB = b.stops[stopIndex];
  
          if (stopA.type !== stopB.type) {
            errors.push(`Stop type mismatch at fulfillment ${index}, stop ${stopIndex}: ${stopA.type} vs ${stopB.type}`);
          }
  
          if (stopA.instructions.additional_desc.url !== stopB.instructions.additional_desc.url) {
            errors.push(`Stop additional_desc.url mismatch at fulfillment ${index}, stop ${stopIndex}`);
          }
  
          if (stopA.instructions.additional_desc.content_type !== stopB.instructions.additional_desc.content_type) {
            errors.push(`Stop additional_desc.content_type mismatch at fulfillment ${index}, stop ${stopIndex}`);
          }
  
          if (stopA.time.timestamp !== stopB.time.timestamp) {
            errors.push(`Stop timestamp mismatch at fulfillment ${index}, stop ${stopIndex}`);
          }
  
        });
      }
  
      if (a.agent.organization.contact.phone !== b.agent.organization.contact.phone) {
        errors.push(`Agent contact phone mismatch at fulfillment ${index}`);
      }
  
      if (a.agent.organization.contact.email !== b.agent.organization.contact.email) {
        errors.push(`Agent contact email mismatch at fulfillment ${index}`);
      }
  
      if (a.vehicle.category !== b.vehicle.category) {
        errors.push(`Vehicle category mismatch at fulfillment ${index}`);
      }
    });
  
    return errors;
  }

  export function compareFulfillments(actual: any[], expected: any[]): string[] {
    const errors: string[] = [];
  
    const sortFulfillments = (list: any[]) =>
      [...list].sort((a, b) => (a.id || '').localeCompare(b.id || ''));
  
    const sortedActual = sortFulfillments(actual);
    const sortedExpected = sortFulfillments(expected);
  
    if (sortedActual.length !== sortedExpected.length) {
      errors.push(`Fulfillment count mismatch: ${sortedActual.length} vs ${sortedExpected.length}`);
      return errors;
    }
  
    sortedActual.forEach((aFulfillment, i) => {
      const eFulfillment = sortedExpected[i];
      const context = `Fulfillment index ${i} [id: ${aFulfillment.id}]`;
  
      if (aFulfillment.id !== eFulfillment.id) {
        errors.push(`${context}: ID mismatch - ${aFulfillment.id} vs ${eFulfillment.id}`);
      }
  
      const aStops = aFulfillment.stops || [];
      const eStops = eFulfillment.stops || [];
  
      if (aStops.length !== eStops.length) {
        errors.push(`${context}: Stops length mismatch - ${aStops.length} vs ${eStops.length}`);
      } else {
        aStops.forEach((aStop: any, j: number) => {
          const eStop = eStops[j];
          const stopCtx = `${context}, stop index ${j}`;
  
          if (aStop.type !== eStop.type) {
            errors.push(`${stopCtx}: Type mismatch - ${aStop.type} vs ${eStop.type}`);
          }
  
          const aTimestamp = aStop.time?.timestamp;
          const eTimestamp = eStop.time?.timestamp;
          if (aTimestamp !== eTimestamp) {
            errors.push(`${stopCtx}: Timestamp mismatch - ${aTimestamp} vs ${eTimestamp}`);
          }
        });
      }
    });
  
    return errors;
  }

  export function compareonItems(items1: any, items2: any): string[] {
    const errors: string[] = [];
  
    if (items1.length !== items2.length) {
      errors.push(`Item array length mismatch: ${items1.length} vs ${items2.length}`);
      return errors;
    }
  
    const sortById = (arr: any) => arr.slice().sort((a: any, b: any) => a.id.localeCompare(b.id));
  
    const sorted1 = sortById(items1);
    const sorted2 = sortById(items2);
  
    sorted1.forEach((a: any, i: any) => {
      const b = sorted2[i];
  
      const path = `Item[${i}] (${a.id})`;
  
      if (a.id !== b.id) errors.push(`${path} id mismatch: ${a.id} vs ${b.id}`);
      if (a.descriptor.name !== b.descriptor.name) errors.push(`${path} name mismatch`);
      if (a.descriptor.code !== b.descriptor.code) errors.push(`${path} code mismatch`);
      if (a.descriptor.short_desc !== b.descriptor.short_desc) errors.push(`${path} short_desc mismatch`);
      if (a.descriptor.long_desc !== b.descriptor.long_desc) errors.push(`${path} long_desc mismatch`);
  
      const img1 = a.descriptor.images || [];
      const img2 = b.descriptor.images || [];
      if (img1.length !== img2.length) {
        errors.push(`${path} images length mismatch`);
      } else {
        img1.forEach((img: any, idx: any) => {
          if (img.url !== img2[idx].url || img.size_type !== img2[idx].size_type) {
            errors.push(`${path} image mismatch at index ${idx}`);
          }
        });
      }
  
      if (a.parent_item_id !== b.parent_item_id) errors.push(`${path} parent_item_id mismatch`);
  
      if (JSON.stringify(a.location_ids) !== JSON.stringify(b.location_ids)) {
        errors.push(`${path} location_ids mismatch`);
      }
  
      if (JSON.stringify(a.category_ids) !== JSON.stringify(b.category_ids)) {
        errors.push(`${path} category_ids mismatch`);
      }
  
      if (a.price && b.price) {
        if (a.price.value !== b.price.value || a.price.currency !== b.price.currency) {
          errors.push(`${path} price mismatch`);
        }
      } else if (a.price || b.price) {
        errors.push(`${path} price presence mismatch`);
      }
  
      if (a.quantity?.selected.count !== b.quantity?.selected.count) {
        errors.push(`${path} quantity mismatch`);
      }
  
      if (a.time && b.time) {
        if (a.time.label !== b.time.label || a.time.duration !== b.time.duration) {
          errors.push(`${path} time mismatch`);
        }
      } else if (a.time || b.time) {
        errors.push(`${path} time presence mismatch`);
      }
  
      if (JSON.stringify(a.fulfillment_ids) !== JSON.stringify(b.fulfillment_ids)) {
        errors.push(`${path} fulfillment_ids mismatch`);
      }
  
      // Add-ons
      const ao1 = a.add_ons || [];
      const ao2 = b.add_ons || [];
      if (ao1.length !== ao2.length) {
        errors.push(`${path} add_ons length mismatch`);
      } else {
        ao1.forEach((addon: any, idx: any) => {
          const bAddon = ao2[idx];
          if (addon.id !== bAddon.id) errors.push(`${path} add_on id mismatch at index ${idx}`);
          if (addon.descriptor.name !== bAddon.descriptor.name) errors.push(`${path} add_on name mismatch at index ${idx}`);
          if (addon.quantity.selected.count !== bAddon.quantity.selected.count) errors.push(`${path} add_on quantity mismatch at index ${idx}`);
          if (addon.price.value !== bAddon.price.value || addon.price.currency !== bAddon.price.currency) {
            errors.push(`${path} add_on price mismatch at index ${idx}`);
          }
        });
      }
  
      // Tags
      const tags1 = a.tags || [];
      const tags2 = b.tags || [];
      if (tags1.length !== tags2.length) {
        errors.push(`${path} tags length mismatch`);
      } else {
        tags1.forEach((tag: any, tIdx: any) => {
          const bTag = tags2[tIdx];
          if (tag.descriptor.code !== bTag.descriptor.code) {
            errors.push(`${path} tag descriptor.code mismatch at index ${tIdx}`);
          }
          if (tag.list.length !== bTag.list.length) {
            errors.push(`${path} tag list length mismatch at index ${tIdx}`);
          } else {
            tag.list.forEach((item: any, li: any) => {
              const bItem = bTag.list[li];
              if (item.value !== bItem.value) {
                errors.push(`${path} tag list value mismatch at tag ${tIdx}, item ${li}`);
              }
              if (item.descriptor?.code !== bItem.descriptor?.code) {
                errors.push(`${path} tag list descriptor.code mismatch at tag ${tIdx}, item ${li}`);
              }
            });
          }
        });
      }
    });
  
    return errors;
  }

  export function compareItems(actual: any[], expected: any[]): string[] {
    const errors: string[] = [];
  
    const toMap = (arr: any[]) => {
      const map = new Map<string, any>();
      for (const item of arr) {
        if (!item.id) continue;
        map.set(item.id, item);
      }
      return map;
    };
  
    const actualMap = toMap(actual);
    const expectedMap = toMap(expected);
  
    if (actualMap.size !== expectedMap.size) {
      errors.push(`Items length mismatch: ${actualMap.size} vs ${expectedMap.size}`);
    }
  
    for (const [id, eItem] of expectedMap) {
      const aItem = actualMap.get(id);
      const context = `Item [id: ${id}]`;
  
      if (!aItem) {
        errors.push(`${context}: Missing in actual`);
        continue;
      }
  
      if (aItem.parent_item_id !== eItem.parent_item_id) {
        errors.push(`${context}: Parent item ID mismatch - ${aItem.parent_item_id} vs ${eItem.parent_item_id}`);
      }
  
      const aQty = aItem.quantity?.selected?.count;
      const eQty = eItem.quantity?.selected?.count;
      if (aQty !== eQty) {
        errors.push(`${context}: Quantity count mismatch - ${aQty} vs ${eQty}`);
      }
  
      const aAddOnsMap = toMap(aItem.add_ons || []);
      const eAddOnsMap = toMap(eItem.add_ons || []);
  
      if (aAddOnsMap.size !== eAddOnsMap.size) {
        errors.push(`${context}: Add-on count mismatch - ${aAddOnsMap.size} vs ${eAddOnsMap.size}`);
      }
  
      for (const [addonId, eAddOn] of eAddOnsMap) {
        const aAddOn = aAddOnsMap.get(addonId);
        const addonCtx = `${context}, Add-on [id: ${addonId}]`;
  
        if (!aAddOn) {
          errors.push(`${addonCtx}: Missing in actual`);
          continue;
        }
  
        const aAddQty = aAddOn.quantity?.selected?.count;
        const eAddQty = eAddOn.quantity?.selected?.count;
        if (aAddQty !== eAddQty) {
          errors.push(`${addonCtx}: Quantity count mismatch - ${aAddQty} vs ${eAddQty}`);
        }
      }
    }
  
    return errors;
  }

  export function compareQuote(actual: any, expected: any): string[] {
    const errors: string[] = [];
  
    const actualKeys = Object.keys(actual);
    const expectedKeys = Object.keys(expected);
  
    const extraKeys = actualKeys.filter(k => !expectedKeys.includes(k));
    const missingKeys = expectedKeys.filter(k => !actualKeys.includes(k));
  
    extraKeys.forEach(k => errors.push(`Unexpected key in actual quote: '${k}'`));
    missingKeys.forEach(k => errors.push(`Missing key in actual quote: '${k}'`));
  

    // Step 1: Compare top-level price
    if (
      actual.price?.currency !== expected.price?.currency ||
      actual.price?.value !== expected.price?.value
    ) {
      errors.push(`Quote price mismatch: ${JSON.stringify(actual.price)} vs ${JSON.stringify(expected.price)}`);
    }
  
    // Step 2: Normalize and compare breakup
    const normalizeBreakup = (breakup: any[]) =>
      [...(breakup || [])].map(item => ({
        ...item,
        item: {
          ...item.item,
          add_ons: [...(item.item?.add_ons || [])].sort((a, b) => (a.id || "").localeCompare(b.id || ""))
        }
      })).sort((a, b) => {
        const aKey = a.item?.id || a.title || "";
        const bKey = b.item?.id || b.title || "";
        return aKey.localeCompare(bKey);
      });
  
    const aBreakup = normalizeBreakup(actual.breakup);
    const eBreakup = normalizeBreakup(expected.breakup);
  
    if (aBreakup.length !== eBreakup.length) {
      errors.push(`Breakup length mismatch: ${aBreakup.length} vs ${eBreakup.length}`);
      return errors;
    }
  
    aBreakup.forEach((aItem, i) => {
      const eItem = eBreakup[i];
      const context = `at index ${i} [${aItem.item?.id || aItem.title}]`;
  
      if (aItem.title !== eItem.title)
        errors.push(`Title mismatch ${context}: ${aItem.title} vs ${eItem.title}`);
  
      if (aItem.item?.id !== eItem.item?.id)
        errors.push(`Item ID mismatch ${context}: ${aItem.item?.id} vs ${eItem.item?.id}`);
  
      if (aItem.price?.value !== eItem.price?.value || aItem.price?.currency !== eItem.price?.currency)
        errors.push(`Price mismatch ${context}: ${JSON.stringify(aItem.price)} vs ${JSON.stringify(eItem.price)}`);
  
      if (aItem.item?.price?.value !== eItem.item?.price?.value || aItem.item?.price?.currency !== eItem.item?.price?.currency)
        errors.push(`Item price mismatch ${context}: ${JSON.stringify(aItem.item?.price)} vs ${JSON.stringify(eItem.item?.price)}`);
  
      if (aItem.item?.quantity?.selected?.count !== eItem.item?.quantity?.selected?.count)
        errors.push(`Item quantity mismatch ${context}: ${aItem.item?.quantity?.selected?.count} vs ${eItem.item?.quantity?.selected?.count}`);
  
      const aAddOns = aItem.item?.add_ons || [];
      const eAddOns = eItem.item?.add_ons || [];
  
      if (aAddOns.length !== eAddOns.length) {
        errors.push(`Add-on count mismatch ${context}: ${aAddOns.length} vs ${eAddOns.length}`);
      } else {
        aAddOns.forEach((addon:any, idx:any) => {
          if (addon.id !== eAddOns[idx].id) {
            errors.push(`Add-on ID mismatch ${context}, add-on index ${idx}: ${addon.id} vs ${eAddOns[idx].id}`);
          }
        });
      }
    });
  
    return errors;
  }
  
  export function compareTags(actual: any[], expected: any[]): string[] {
    const errors: string[] = [];
  
    const toTagMap = (tags: any[]) => {
      const map = new Map<string, any>();
      for (const tag of tags) {
        const code = tag?.descriptor?.code;
        if (code) map.set(code, tag);
      }
      return map;
    };
  
    const actualMap = toTagMap(actual);
    const expectedMap = toTagMap(expected);
  
    for (const [code, expectedTag] of expectedMap) {
      const context = `Tag [code: ${code}]`;
      const actualTag = actualMap.get(code);
  
      if (!actualTag) {
        errors.push(`${context}: Missing in actual`);
        continue;
      }
  
      const toListMap = (list: any[]) => {
        const map = new Map<string, string>();
        for (const item of list || []) {
          const k = item?.descriptor?.code;
          const v = item?.value;
          if (k) map.set(k, v);
        }
        return map;
      };
  
      const expectedList = toListMap(expectedTag.list);
      const actualList = toListMap(actualTag.list);
  
      for (const [key, expectedValue] of expectedList) {
        if (!actualList.has(key)) {
          errors.push(`${context}: Missing list entry for key "${key}"`);
          continue;
        }
        const actualValue = actualList.get(key);
        if (actualValue !== expectedValue) {
          errors.push(`${context}: Value mismatch for "${key}" - ${actualValue} vs ${expectedValue}`);
        }
      }
  
      for (const key of actualList.keys()) {
        if (!expectedList.has(key)) {
          errors.push(`${context}: Unexpected key in list - "${key}"`);
        }
      }
    }
  
    for (const key of actualMap.keys()) {
      if (!expectedMap.has(key)) {
        errors.push(`Unexpected tag [code: ${key}] present in actual`);
      }
    }
  
    return errors;
  }
  
  export function validateXInput(xinput: any): string[] {
    const errors: string[] = [];
  
    if (!xinput || typeof xinput !== 'object') {
      errors.push(`xinput is not a valid object`);
      return errors;
    }
  
    // Validate head
    const head = xinput.head;
    if (!head || typeof head !== 'object') {
      errors.push(`Missing or invalid 'head'`);
    } else {
      const name = head.descriptor?.name;
      if (typeof name !== 'string' || !name.trim()) {
        errors.push(`'head.descriptor.name' must be a non-empty string`);
      }
  
      const index = head.index;
      ['min', 'cur', 'max'].forEach(k => {
        if (typeof index?.[k] !== 'number') {
          errors.push(`'head.index.${k}' must be a number`);
        }
      });
  
      if (!Array.isArray(head.headings) || !head.headings.every((h:any) => typeof h === 'string')) {
        errors.push(`'head.headings' must be an array of strings`);
      }
    }
  
    // Validate form
    const form = xinput.form;
    if (!form || typeof form !== 'object') {
      errors.push(`Missing or invalid 'form'`);
    } else {
      if (typeof form.id !== 'string' || !form.id.trim()) {
        errors.push(`'form.id' must be a non-empty string`);
      }
  
      if (form.mime_type !== 'text/html') {
        errors.push(`'form.mime_type' must be 'text/html'`);
      }
  
      try {
        new URL(form.url);
      } catch {
        errors.push(`'form.url' must be a valid URL`);
      }
  
      if (typeof form.resubmit !== 'boolean') {
        errors.push(`'form.resubmit' must be a boolean`);
      }
  
      if (typeof form.multiple_sumbissions !== 'boolean') {
        errors.push(`'form.multiple_sumbissions' must be a boolean`);
      }
    }
  
    // Validate required
    if (typeof xinput.required !== 'boolean') {
      errors.push(`'required' must be a boolean`);
    }
  
    return errors;
  }
  