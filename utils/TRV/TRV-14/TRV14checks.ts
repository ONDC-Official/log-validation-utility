import { logger } from "../../../shared/logger"

export const validateQuote = (quote: any, action: string): Record<string, string> => {
  const errorObj: Record<string, string> = {};
  try {
    logger.info(`Checking quote details in /${action}`);
    
    // Validate price details
    if (!quote?.price?.value) errorObj["price.value"] = "price.value is missing in quote";
    if (!quote?.price?.currency) errorObj["price.currency"] = "price.currency is missing in quote";

    const quoteBreakup = quote?.breakup;
    
    // Validate breakup
    if (!quoteBreakup) {
      errorObj["quoteBreakup"] = "Quote.breakup is missing";
    } else {
      const validBreakupItems = ['BASE_FARE', 'TAX', 'ADD_ONS'];

      // Add cancellation charges if action is soft_on_cancel
      if (action === 'soft_on_cancel') {
        validBreakupItems.push('CANCELLATION_CHARGES');
      }

      // Check for missing breakup items
      const requiredBreakupItems = validBreakupItems.filter((item) =>
        quoteBreakup.some((breakupItem: any) => breakupItem.title.toUpperCase() === item),
      );

      const missingBreakupItems = validBreakupItems.filter((item) => !requiredBreakupItems.includes(item));
      if (missingBreakupItems.length > 0) {
        errorObj["missingBreakupItems"] = `Quote breakup is missing the following items: ${missingBreakupItems.join(', ')}`;
      }

      // Check for additional invalid breakup items
      const additionalBreakupItems = quoteBreakup.filter(
        (breakupItem: any) => !validBreakupItems.includes(breakupItem.title.toUpperCase()),
      );

      if (additionalBreakupItems.length > 0) {
        const additionalItemsList = additionalBreakupItems.map((item: any) => item.title).join(', ');
        errorObj["additionalBreakupItems"] = `Quote breakup contains additional invalid items: ${additionalItemsList}`;
      }

      // Validate total breakup value
      const totalBreakupValue = quoteBreakup.reduce((total: any, item: any) => {
        const itemValue = parseFloat(item.price.value);
        return isNaN(itemValue) ? total : total + itemValue;
      }, 0);

      const priceValue = parseFloat(quote.price.value);

      if (isNaN(totalBreakupValue)) {
        errorObj["breakupTotalMismatch"] = "Invalid values in quote breakup";
      } else if (totalBreakupValue !== priceValue) {
        errorObj["breakupTotalMismatch"] = `Total of quote breakup (${totalBreakupValue}) does not match with price.value (${priceValue})`;
      }

      // Check for currency mismatch
      const currencies = quoteBreakup.map((item: any) => item.currency);
      if (new Set(currencies).size !== 1) {
        errorObj["multipleCurrencies"] = "Currency must be the same for all items in the quote breakup";
      }
    }
  } catch (error: any) {
    logger.error(`!!Error while checking quote details in /${action}`, error.stack);
  }

  return errorObj;
};

  export function validateTagsStructure(tags: any[]): Record<string, string> {
    const errorObj: Record<string, string> = {};
  
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
    ];
  
    tags.forEach((tag: any, tagIndex: number) => {
      if (!tag.descriptor) {
        errorObj[`Tag ${tagIndex} descriptor`] = 'descriptor does not exist';
      }
      if (!tag.descriptor.code) {
        errorObj[`Tag ${tagIndex} descriptor code`] = 'descriptor code does not exist';
      }
      if (tag.descriptor.code === "BAP") {
        tag.list.forEach((itm: any, index: number) => {
          if (!expectedListItemsofBap.includes(itm.descriptor.code)) {
            errorObj[`Tag ${tagIndex} List Item ${index} descriptor code`] = `descriptor code is not valid`;
          }
        });
      }
      if (tag.descriptor.code === "BPP") {
        tag.list.forEach((itm: any, index: number) => {
          if (!expectedListItemsofBpp.includes(itm.descriptor.code)) {
            errorObj[`Tag ${tagIndex} List Item ${index} descriptor code`] = `descriptor code is not valid`;
          }
        });
      }
    });
  
    return errorObj;
  }
  
  export function compareReplacementTerms(actual: any, expected: any): Record<string, string> {
    const errors: Record<string, string> = {};
  
    if (actual.length !== expected.length) {
      errors['Replacement terms length mismatch'] = `Replacement terms length mismatch: ${actual.length} vs ${expected.length}`;
      return errors; // Can't compare further if lengths don't match
    }
  
    const unmatched = [...expected];
  
    actual.forEach((aTerm: any) => {
      const matchIndex = unmatched.findIndex(eTerm =>
        eTerm.external_ref.mimetype === aTerm.external_ref.mimetype &&
        eTerm.external_ref.url === aTerm.external_ref.url
      );
  
      if (matchIndex === -1) {
        errors[`No matching replacement_term for mimetype=${aTerm.external_ref.mimetype}, url=${aTerm.external_ref.url}`] =
          `No matching replacement_term found for: mimetype=${aTerm.external_ref.mimetype}, url=${aTerm.external_ref.url}`;
      } else {
        unmatched.splice(matchIndex, 1); // Remove matched entry
      }
    });
  
    if (unmatched.length > 0) {
      unmatched.forEach((eTerm) => {
        errors[`Missing replacement_term for mimetype=${eTerm.external_ref.mimetype}, url=${eTerm.external_ref.url}`] =
          `Missing expected replacement_term: mimetype=${eTerm.external_ref.mimetype}, url=${eTerm.external_ref.url}`;
      });
    }
  
    return errors;
  }
  
  export function compareProviders(provider1: any, provider2: any): Record<string, string> {
    const errors: Record<string, string> = {};
  
    if (provider1.id !== provider2.id) {
      errors['Provider id mismatch'] = `Provider id mismatch: ${provider1.id} vs ${provider2.id}`;
    }
  
    if (provider1.descriptor.name !== provider2.descriptor.name) {
      errors['Provider name mismatch'] = `Provider name mismatch: ${provider1.descriptor.name} vs ${provider2.descriptor.name}`;
    }
  
    if (provider1.descriptor.images.length !== provider2.descriptor.images.length) {
      errors['Provider images length mismatch'] = `Provider images length mismatch`;
    } else {
      provider1.descriptor.images.forEach((img: any, index: any) => {
        const otherImg = provider2.descriptor.images[index];
        if (img.size_type !== otherImg.size_type || img.url !== otherImg.url) {
          errors[`Provider image mismatch at index ${index}`] = `Provider image mismatch at index ${index}`;
        }
      });
    }
  
    if (provider1.locations.length !== provider2.locations.length) {
      errors['Provider locations length mismatch'] = `Provider locations length mismatch`;
    } else {
      provider1.locations.forEach((loc: any, index: any) => {
        const otherLoc = provider2.locations[index];
  
        if (loc.id !== otherLoc.id) {
          errors[`Location id mismatch at index ${index}`] = `Location id mismatch at index ${index}`;
        }
        if (loc.gps !== otherLoc.gps) {
          errors[`Location gps mismatch at index ${index}`] = `Location gps mismatch at index ${index}`;
        }
        if (loc.rating !== otherLoc.rating) {
          errors[`Location rating mismatch at index ${index}`] = `Location rating mismatch at index ${index}`;
        }
        if (loc.descriptor.name !== otherLoc.descriptor.name) {
          errors[`Location name mismatch at index ${index}`] = `Location name mismatch at index ${index}`;
        }
        if (loc.descriptor.short_desc !== otherLoc.descriptor.short_desc) {
          errors[`Location short_desc mismatch at index ${index}`] = `Location short_desc mismatch at index ${index}`;
        }
  
        if (loc.descriptor.additional_desc.content_type !== otherLoc.descriptor.additional_desc.content_type ||
            loc.descriptor.additional_desc.url !== otherLoc.descriptor.additional_desc.url) {
          errors[`Location additional_desc mismatch at index ${index}`] = `Location additional_desc mismatch at index ${index}`;
        }
  
        if (loc.descriptor.images.length !== otherLoc.descriptor.images.length) {
          errors[`Location images length mismatch at index ${index}`] = `Location images length mismatch at index ${index}`;
        } else {
          loc.descriptor.images.forEach((img: any, imgIndex: any) => {
            const otherImg = otherLoc.descriptor.images[imgIndex];
            if (img.size_type !== otherImg.size_type || img.url !== otherImg.url) {
              errors[`Location image mismatch at location ${index}, image ${imgIndex}`] = `Location image mismatch at location ${index}, image ${imgIndex}`;
            }
          });
        }
      });
    }
  
    return errors;
  }
  
  export function comparePayments(payments1: any[], payments2: any[]): Record<string, string> {
    const errors: Record<string, string> = {};
  
    if (payments1.length !== payments2.length) {
      errors['Payments array length mismatch'] = `Payments array length mismatch: ${payments1.length} vs ${payments2.length}`;
      return errors; // can't compare further if lengths don't match
    }
  
    payments1.forEach((p1: any, index: any) => {
      const p2 = payments2[index];
  
      if (p1.id !== p2.id) {
        errors[`Payment id mismatch at index ${index}`] = `Payment id mismatch at index ${index}: ${p1.id} vs ${p2.id}`;
      }
  
      if (p1.collected_by !== p2.collected_by) {
        errors[`Payment collected_by mismatch at index ${index}`] = `Payment collected_by mismatch at index ${index}: ${p1.collected_by} vs ${p2.collected_by}`;
      }
  
      if (p1.status !== p2.status) {
        errors[`Payment status mismatch at index ${index}`] = `Payment status mismatch at index ${index}: ${p1.status} vs ${p2.status}`;
      }
  
      if (p1.type !== p2.type) {
        errors[`Payment type mismatch at index ${index}`] = `Payment type mismatch at index ${index}: ${p1.type} vs ${p2.type}`;
      }
  
      if (p1.params.transaction_id !== p2.params.transaction_id) {
        errors[`Payment transaction_id mismatch at index ${index}`] = `Payment transaction_id mismatch at index ${index}: ${p1.params.transaction_id} vs ${p2.params.transaction_id}`;
      }
  
      if (p1.params.currency !== p2.params.currency) {
        errors[`Payment currency mismatch at index ${index}`] = `Payment currency mismatch at index ${index}: ${p1.params.currency} vs ${p2.params.currency}`;
      }
  
      if (p1.params.amount !== p2.params.amount) {
        errors[`Payment amount mismatch at index ${index}`] = `Payment amount mismatch at index ${index}: ${p1.params.amount} vs ${p2.params.amount}`;
      }
    });
  
    return errors;
  }
  
  export function compareOnFulfillments(f1: any[], f2: any[]): Record<string, string> {
    const errors: Record<string, string> = {};
  
    if (f1.length !== f2.length) {
      errors['Fulfillments array length mismatch'] = `Fulfillments array length mismatch: ${f1.length} vs ${f2.length}`;
      return errors;
    }
  
    f1.forEach((a: any, index: any) => {
      const b = f2[index];
  
      if (a.id !== b.id) {
        errors[`Fulfillment id mismatch at index ${index}`] = `Fulfillment id mismatch at index ${index}: ${a.id} vs ${b.id}`;
      }
      if (a.type !== b.type) {
        errors[`Fulfillment type mismatch at index ${index}`] = `Fulfillment type mismatch at index ${index}: ${a.type} vs ${b.type}`;
      }
      // if (a.state.descriptor.code !== b.state.descriptor.code) {
      //   errors[`Fulfillment state.descriptor.code mismatch at index ${index}`] = `Fulfillment state.descriptor.code mismatch at index ${index}: ${a.state.descriptor.code} vs ${b.state.descriptor.code}`;
      // }
  
      if (a.stops.length !== b.stops.length) {
        errors[`Fulfillment stops length mismatch at index ${index}`] = `Fulfillment stops length mismatch at index ${index}`;
      } else {
        a.stops.forEach((stopA: any, stopIndex: any) => {
          const stopB = b.stops[stopIndex];
  
          if (stopA.type !== stopB.type) {
            errors[`Stop type mismatch at fulfillment ${index}, stop ${stopIndex}`] = `Stop type mismatch at fulfillment ${index}, stop ${stopIndex}: ${stopA.type} vs ${stopB.type}`;
          }
  
          if (stopA.instructions.additional_desc.url !== stopB.instructions.additional_desc.url) {
            errors[`Stop additional_desc.url mismatch at fulfillment ${index}, stop ${stopIndex}`] = `Stop additional_desc.url mismatch at fulfillment ${index}, stop ${stopIndex}`;
          }
  
          if (stopA.instructions.additional_desc.content_type !== stopB.instructions.additional_desc.content_type) {
            errors[`Stop additional_desc.content_type mismatch at fulfillment ${index}, stop ${stopIndex}`] = `Stop additional_desc.content_type mismatch at fulfillment ${index}, stop ${stopIndex}`;
          }
  
          if (stopA.time.timestamp !== stopB.time.timestamp) {
            errors[`Stop timestamp mismatch at fulfillment ${index}, stop ${stopIndex}`] = `Stop timestamp mismatch at fulfillment ${index}, stop ${stopIndex}`;
          }
  
        });
      }
  
      if (a.agent.organization.contact.phone !== b.agent.organization.contact.phone) {
        errors[`Agent contact phone mismatch at fulfillment ${index}`] = `Agent contact phone mismatch at fulfillment ${index}`;
      }
  
      if (a.agent.organization.contact.email !== b.agent.organization.contact.email) {
        errors[`Agent contact email mismatch at fulfillment ${index}`] = `Agent contact email mismatch at fulfillment ${index}`;
      }
  
      if (a.vehicle.category !== b.vehicle.category) {
        errors[`Vehicle category mismatch at fulfillment ${index}`] = `Vehicle category mismatch at fulfillment ${index}`;
      }
    });
  
    return errors;
  }
  
  export function compareFulfillments(actual: any[], expected: any[]): Record<string, string> {
    const errors: Record<string, string> = {};
  
    const sortFulfillments = (list: any[]) =>
      [...list].sort((a, b) => (a.id || '').localeCompare(b.id || ''));
  
    const sortedActual = sortFulfillments(actual);
    const sortedExpected = sortFulfillments(expected);
  
    if (sortedActual.length !== sortedExpected.length) {
      errors['Fulfillment count mismatch'] = `Fulfillment count mismatch: ${sortedActual.length} vs ${sortedExpected.length}`;
      return errors;
    }
  
    sortedActual.forEach((aFulfillment, i) => {
      const eFulfillment = sortedExpected[i];
      const context = `Fulfillment index ${i} [id: ${aFulfillment.id}]`;
  
      if (aFulfillment.id !== eFulfillment.id) {
        errors[`${context}: ID mismatch`] = `${context}: ID mismatch - ${aFulfillment.id} vs ${eFulfillment.id}`;
      }
  
      const aStops = aFulfillment.stops || [];
      const eStops = eFulfillment.stops || [];
  
      if (aStops.length !== eStops.length) {
        errors[`${context}: Stops length mismatch`] = `${context}: Stops length mismatch - ${aStops.length} vs ${eStops.length}`;
      } else {
        aStops.forEach((aStop: any, j: number) => {
          const eStop = eStops[j];
          const stopCtx = `${context}, stop index ${j}`;
  
          if (aStop.type !== eStop.type) {
            errors[`${stopCtx}: Type mismatch`] = `${stopCtx}: Type mismatch - ${aStop.type} vs ${eStop.type}`;
          }
  
          const aTimestamp = aStop.time?.timestamp;
          const eTimestamp = eStop.time?.timestamp;
          if (aTimestamp !== eTimestamp) {
            errors[`${stopCtx}: Timestamp mismatch`] = `${stopCtx}: Timestamp mismatch - ${aTimestamp} vs ${eTimestamp}`;
          }
        });
      }
    });
  
    return errors;
  }

  export function compareonItems(items1: any, items2: any): Record<string, string> {
    const errors: Record<string, string> = {};
  
    if (items1.length !== items2.length) {
      errors['Item array length mismatch'] = `Item array length mismatch: ${items1.length} vs ${items2.length}`;
      return errors;
    }
  
    const sortById = (arr: any) => arr.slice().sort((a: any, b: any) => a.id.localeCompare(b.id));
  
    const sorted1 = sortById(items1);
    const sorted2 = sortById(items2);
  
    sorted1.forEach((a: any, i: any) => {
      const b = sorted2[i];
  
      const path = `Item[${i}] (${a.id})`;
  
      if (a.id !== b.id) errors[`${path} id mismatch`] = `${path} id mismatch: ${a.id} vs ${b.id}`;
      if (a.descriptor.name !== b.descriptor.name) errors[`${path} name mismatch`] = `${path} name mismatch`;
      if (a.descriptor.code !== b.descriptor.code) errors[`${path} code mismatch`] = `${path} code mismatch`;
      if (a.descriptor.short_desc !== b.descriptor.short_desc) errors[`${path} short_desc mismatch`] = `${path} short_desc mismatch`;
      if (a.descriptor.long_desc !== b.descriptor.long_desc) errors[`${path} long_desc mismatch`] = `${path} long_desc mismatch`;
  
      const img1 = a.descriptor.images || [];
      const img2 = b.descriptor.images || [];
      if (img1.length !== img2.length) {
        errors[`${path} images length mismatch`] = `${path} images length mismatch`;
      } else {
        img1.forEach((img: any, idx: any) => {
          if (img.url !== img2[idx].url || img.size_type !== img2[idx].size_type) {
            errors[`${path} image mismatch at index ${idx}`] = `${path} image mismatch at index ${idx}`;
          }
        });
      }
  
      if (a.parent_item_id !== b.parent_item_id) errors[`${path} parent_item_id mismatch`] = `${path} parent_item_id mismatch`;
  
      if (JSON.stringify(a.location_ids) !== JSON.stringify(b.location_ids)) {
        errors[`${path} location_ids mismatch`] = `${path} location_ids mismatch`;
      }
  
      if (JSON.stringify(a.category_ids) !== JSON.stringify(b.category_ids)) {
        errors[`${path} category_ids mismatch`] = `${path} category_ids mismatch`;
      }
  
      if (a.price && b.price) {
        if (a.price.value !== b.price.value || a.price.currency !== b.price.currency) {
          errors[`${path} price mismatch`] = `${path} price mismatch`;
        }
      } else if (a.price || b.price) {
        errors[`${path} price presence mismatch`] = `${path} price presence mismatch`;
      }
  
      if (a.quantity?.selected.count !== b.quantity?.selected.count) {
        errors[`${path} quantity mismatch`] = `${path} quantity mismatch`;
      }
  
      if (a.time && b.time) {
        if (a.time.label !== b.time.label || a.time.duration !== b.time.duration) {
          errors[`${path} time mismatch`] = `${path} time mismatch`;
        }
      } else if (a.time || b.time) {
        errors[`${path} time presence mismatch`] = `${path} time presence mismatch`;
      }
  
      if (JSON.stringify(a.fulfillment_ids) !== JSON.stringify(b.fulfillment_ids)) {
        errors[`${path} fulfillment_ids mismatch`] = `${path} fulfillment_ids mismatch`;
      }
  
      // Add-ons
      const ao1 = a.add_ons || [];
      const ao2 = b.add_ons || [];
      if (ao1.length !== ao2.length) {
        errors[`${path} add_ons length mismatch`] = `${path} add_ons length mismatch`;
      } else {
        ao1.forEach((addon: any, idx: any) => {
          const bAddon = ao2[idx];
          if (addon.id !== bAddon.id) errors[`${path} add_on id mismatch at index ${idx}`] = `${path} add_on id mismatch at index ${idx}`;
          if (addon.descriptor.name !== bAddon.descriptor.name) errors[`${path} add_on name mismatch at index ${idx}`] = `${path} add_on name mismatch at index ${idx}`;
          if (addon.quantity.selected.count !== bAddon.quantity.selected.count) errors[`${path} add_on quantity mismatch at index ${idx}`] = `${path} add_on quantity mismatch at index ${idx}`;
          if (addon.price.value !== bAddon.price.value || addon.price.currency !== bAddon.price.currency) {
            errors[`${path} add_on price mismatch at index ${idx}`] = `${path} add_on price mismatch at index ${idx}`;
          }
        });
      }
  
      // Tags
      const tags1 = a.tags || [];
      const tags2 = b.tags || [];
      if (tags1.length !== tags2.length) {
        errors[`${path} tags length mismatch`] = `${path} tags length mismatch`;
      } else {
        tags1.forEach((tag: any, tIdx: any) => {
          const bTag = tags2[tIdx];
          if (tag.descriptor.code !== bTag.descriptor.code) {
            errors[`${path} tag descriptor.code mismatch at index ${tIdx}`] = `${path} tag descriptor.code mismatch at index ${tIdx}`;
          }
          if (tag.list.length !== bTag.list.length) {
            errors[`${path} tag list length mismatch at index ${tIdx}`] = `${path} tag list length mismatch at index ${tIdx}`;
          } else {
            tag.list.forEach((item: any, li: any) => {
              const bItem = bTag.list[li];
              if (item.value !== bItem.value) {
                errors[`${path} tag list value mismatch at tag ${tIdx}, item ${li}`] = `${path} tag list value mismatch at tag ${tIdx}, item ${li}`;
              }
              if (item.descriptor?.code !== bItem.descriptor?.code) {
                errors[`${path} tag list descriptor.code mismatch at tag ${tIdx}, item ${li}`] = `${path} tag list descriptor.code mismatch at tag ${tIdx}, item ${li}`;
              }
            });
          }
        });
      }
    });
  
    return errors;
  }
  
  export function compareItems(actual: any[], expected: any[]): Record<string, string> {
    const errors: Record<string, string> = {};
  
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
      errors['Items length mismatch'] = `Items length mismatch: ${actualMap.size} vs ${expectedMap.size}`;
    }
  
    for (const [id, eItem] of expectedMap) {
      const aItem = actualMap.get(id);
      const context = `Item [id: ${id}]`;
  
      if (!aItem) {
        errors[`${context}: Missing in actual`] = `${context}: Missing in actual`;
        continue;
      }
  
      if (aItem.parent_item_id !== eItem.parent_item_id) {
        errors[`${context}: Parent item ID mismatch`] = `${context}: Parent item ID mismatch - ${aItem.parent_item_id} vs ${eItem.parent_item_id}`;
      }
  
      const aQty = aItem.quantity?.selected?.count;
      const eQty = eItem.quantity?.selected?.count;
      if (aQty !== eQty) {
        errors[`${context}: Quantity count mismatch`] = `${context}: Quantity count mismatch - ${aQty} vs ${eQty}`;
      }
  
      const aAddOnsMap = toMap(aItem.add_ons || []);
      const eAddOnsMap = toMap(eItem.add_ons || []);
  
      if (aAddOnsMap.size !== eAddOnsMap.size) {
        errors[`${context}: Add-on count mismatch`] = `${context}: Add-on count mismatch - ${aAddOnsMap.size} vs ${eAddOnsMap.size}`;
      }
  
      for (const [addonId, eAddOn] of eAddOnsMap) {
        const aAddOn = aAddOnsMap.get(addonId);
        const addonCtx = `${context}, Add-on [id: ${addonId}]`;
  
        if (!aAddOn) {
          errors[`${addonCtx}: Missing in actual`] = `${addonCtx}: Missing in actual`;
          continue;
        }
  
        const aAddQty = aAddOn.quantity?.selected?.count;
        const eAddQty = eAddOn.quantity?.selected?.count;
        if (aAddQty !== eAddQty) {
          errors[`${addonCtx}: Quantity count mismatch`] = `${addonCtx}: Quantity count mismatch - ${aAddQty} vs ${eAddQty}`;
        }
      }
    }
  
    return errors;
  }
  

  export function compareQuote(actual: any, expected: any): Record<string, string> {
    const errors: Record<string, string> = {};
  
    const actualKeys = Object.keys(actual);
    const expectedKeys = Object.keys(expected);
  
    const extraKeys = actualKeys.filter(k => !expectedKeys.includes(k));
    const missingKeys = expectedKeys.filter(k => !actualKeys.includes(k));
  
    extraKeys.forEach(k => {
      errors[`Unexpected key in actual quote: '${k}'`] = `Unexpected key in actual quote: '${k}'`;
    });
    missingKeys.forEach(k => {
      errors[`Missing key in actual quote: '${k}'`] = `Missing key in actual quote: '${k}'`;
    });
  
    // Step 1: Compare top-level price
    if (
      actual.price?.currency !== expected.price?.currency ||
      actual.price?.value !== expected.price?.value
    ) {
      errors['Quote price mismatch'] = `Quote price mismatch: ${JSON.stringify(actual.price)} vs ${JSON.stringify(expected.price)}`;
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
      errors['Breakup length mismatch'] = `Breakup length mismatch: ${aBreakup.length} vs ${eBreakup.length}`;
      return errors;
    }
  
    aBreakup.forEach((aItem, i) => {
      const eItem = eBreakup[i];
      const context = `at index ${i} [${aItem.item?.id || aItem.title}]`;
  
      if (aItem.title !== eItem.title) {
        errors[`${context}: Title mismatch`] = `Title mismatch ${context}: ${aItem.title} vs ${eItem.title}`;
      }
  
      if (aItem.item?.id !== eItem.item?.id) {
        errors[`${context}: Item ID mismatch`] = `Item ID mismatch ${context}: ${aItem.item?.id} vs ${eItem.item?.id}`;
      }
  
      if (aItem.price?.value !== eItem.price?.value || aItem.price?.currency !== eItem.price?.currency) {
        errors[`${context}: Price mismatch`] = `Price mismatch ${context}: ${JSON.stringify(aItem.price)} vs ${JSON.stringify(eItem.price)}`;
      }
  
      if (aItem.item?.price?.value !== eItem.item?.price?.value || aItem.item?.price?.currency !== eItem.item?.price?.currency) {
        errors[`${context}: Item price mismatch`] = `Item price mismatch ${context}: ${JSON.stringify(aItem.item?.price)} vs ${JSON.stringify(eItem.item?.price)}`;
      }
  
      if (aItem.item?.quantity?.selected?.count !== eItem.item?.quantity?.selected?.count) {
        errors[`${context}: Item quantity mismatch`] = `Item quantity mismatch ${context}: ${aItem.item?.quantity?.selected?.count} vs ${eItem.item?.quantity?.selected?.count}`;
      }
  
      const aAddOns = aItem.item?.add_ons || [];
      const eAddOns = eItem.item?.add_ons || [];
  
      if (aAddOns.length !== eAddOns.length) {
        errors[`${context}: Add-on count mismatch`] = `Add-on count mismatch ${context}: ${aAddOns.length} vs ${eAddOns.length}`;
      } else {
        aAddOns.forEach((addon: any, idx: any) => {
          if (addon.id !== eAddOns[idx].id) {
            errors[`${context}: Add-on ID mismatch, add-on index ${idx}`] = `Add-on ID mismatch ${context}, add-on index ${idx}: ${addon.id} vs ${eAddOns[idx].id}`;
          }
        });
      }
    });
  
    return errors;
  }  
  
  export function compareTags(actual: any[], expected: any[]): Record<string, string> {
    const errors: Record<string, string> = {};
  
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
        errors[`${context}`] = 'Missing in actual';
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
          errors[`${context}: list`] = `Missing list entry for key "${key}"`;
          continue;
        }
        const actualValue = actualList.get(key);
        if (actualValue !== expectedValue) {
          errors[`${context}: list`] = `Value mismatch for "${key}" - ${actualValue} vs ${expectedValue}`;
        }
      }
  
      for (const key of actualList.keys()) {
        if (!expectedList.has(key)) {
          errors[`${context}: list`] = `Unexpected key in list - "${key}"`;
        }
      }
    }
  
    for (const key of actualMap.keys()) {
      if (!expectedMap.has(key)) {
        errors[`Tag [code: ${key}]`] = 'Unexpected tag present in actual';
      }
    }
  
    return errors;
  } 
  
  export function validateXInput(xinput: any): Record<string, string> {
    const errors: Record<string, string> = {};
  
    if (!xinput || typeof xinput !== 'object') {
      errors['xinput'] = 'xinput is not a valid object';
      return errors;
    }
  
    // Validate head
    const head = xinput.head;
    if (!head || typeof head !== 'object') {
      errors['xinput.head'] = "Missing or invalid 'head'";
    } else {
      const name = head.descriptor?.name;
      if (typeof name !== 'string' || !name.trim()) {
        errors['xinput.head.descriptor.name'] = "'head.descriptor.name' must be a non-empty string";
      }
  
      const index = head.index;
      ['min', 'cur', 'max'].forEach(k => {
        if (typeof index?.[k] !== 'number') {
          errors[`xinput.head.index.${k}`] = `'head.index.${k}' must be a number`;
        }
      });
  
      if (!Array.isArray(head.headings) || !head.headings.every((h: any) => typeof h === 'string')) {
        errors['xinput.head.headings'] = "'head.headings' must be an array of strings";
      }
    }
  
    // Validate form
    const form = xinput.form;
    if (!form || typeof form !== 'object') {
      errors['xinput.form'] = "Missing or invalid 'form'";
    } else {
      if (typeof form.id !== 'string' || !form.id.trim()) {
        errors['xinput.form.id'] = "'form.id' must be a non-empty string";
      }
  
      if (form.mime_type !== 'text/html') {
        errors['xinput.form.mime_type'] = "'form.mime_type' must be 'text/html'";
      }
  
      try {
        new URL(form.url);
      } catch {
        errors['xinput.form.url'] = "'form.url' must be a valid URL";
      }
  
      if (typeof form.resubmit !== 'boolean') {
        errors['xinput.form.resubmit'] = "'form.resubmit' must be a boolean";
      }
  
      if (typeof form.multiple_sumbissions !== 'boolean') {
        errors['xinput.form.multiple_sumbissions'] = "'form.multiple_sumbissions' must be a boolean";
      }
    }
  
    // Validate required
    if (typeof xinput.required !== 'boolean') {
      errors['xinput.required'] = "'required' must be a boolean";
    }
  
    return errors;
  }
  

  export function compareProvidersArray(providers1: any[], providers2: any[]): Record<string, string[]> {
    const errorObj: Record<string, string[]> = {};
  
    const addError = (id: string, msg: string) => {
      if (!errorObj[id]) errorObj[id] = [];
      errorObj[id].push(msg);
    };
  
    const mapById = (arr: any[]) => new Map(arr.map(item => [item.id, item]));
    const pMap1 = mapById(providers1 || []);
    const pMap2 = mapById(providers2 || []);
  
    for (const [id, p1] of pMap1) {
      const p2 = pMap2.get(id);
      if (!p2) {
        addError(id, `Provider with id ${id} missing in second set`);
        continue;
      }
  
      const d1 = p1.descriptor || {};
      const d2 = p2.descriptor || {};
      if (d1.name !== d2.name) addError(id, `descriptor.name mismatch: ${d1.name} vs ${d2.name}`);
      if (d1.short_desc !== d2.short_desc) addError(id, `descriptor.short_desc mismatch: ${d1.short_desc} vs ${d2.short_desc}`);
  
      const imgs1 = d1.images || [];
      const imgs2 = d2.images || [];
      if (imgs1.length !== imgs2.length) {
        addError(id, `descriptor.images length mismatch: ${imgs1.length} vs ${imgs2.length}`);
      } else {
        const serializeImg = (img: any) => `${img.url || ''}|${img.size_type || ''}`;
        const set1 = new Set(imgs1.map(serializeImg));
        const set2 = new Set(imgs2.map(serializeImg));
        for (const val of set1) if (!set2.has(val)) addError(id, `missing image in second: ${val}`);
        for (const val of set2) if (!set1.has(val)) addError(id, `extra image in second: ${val}`);
      }
  
      const cMap1 = mapById(p1.categories || []);
      const cMap2 = mapById(p2.categories || []);
      for (const [cid, c1] of cMap1) {
        const c2 = cMap2.get(cid);
        if (!c2) {
          addError(id, `category ${cid} missing in second`);
          continue;
        }
        if ((c1.descriptor?.name || '') !== (c2.descriptor?.name || '')) {
          addError(id, `category ${cid} descriptor.name mismatch: ${c1.descriptor?.name} vs ${c2.descriptor?.name}`);
        }
        if ((c1.descriptor?.code || '') !== (c2.descriptor?.code || '')) {
          addError(id, `category ${cid} descriptor.code mismatch: ${c1.descriptor?.code} vs ${c2.descriptor?.code}`);
        }
      }
      for (const cid of cMap2.keys()) {
        if (!cMap1.has(cid)) addError(id, `extra category ${cid} in second`);
      }
  
      const lMap1 = mapById(p1.locations || []);
      const lMap2 = mapById(p2.locations || []);
      for (const [lid, l1] of lMap1) {
        const l2 = lMap2.get(lid);
        if (!l2) {
          addError(id, `location ${lid} missing in second`);
          continue;
        }
  
        if (l1.gps !== l2.gps) {
          addError(id, `location ${lid} GPS mismatch: ${l1.gps} vs ${l2.gps}`);
        }
  
        const ld1 = l1.descriptor || {};
        const ld2 = l2.descriptor || {};
  
        if ((ld1.name || '') !== (ld2.name || '')) {
          addError(id, `location ${lid} descriptor.name mismatch: ${ld1.name} vs ${ld2.name}`);
        }
        if ((ld1.short_desc || '') !== (ld2.short_desc || '')) {
          addError(id, `location ${lid} descriptor.short_desc mismatch`);
        }
        if ((ld1.additional_desc?.url || '') !== (ld2.additional_desc?.url || '')) {
          addError(id, `location ${lid} additional_desc.url mismatch`);
        }
  
        const li1 = ld1.images || [];
        const li2 = ld2.images || [];
        const serializeImg = (img: any) => `${img.url || ''}|${img.size_type || ''}`;
        const s1 = new Set(li1.map(serializeImg));
        const s2 = new Set(li2.map(serializeImg));
        for (const val of s1) if (!s2.has(val)) addError(id, `location ${lid} missing image in second: ${val}`);
        for (const val of s2) if (!s1.has(val)) addError(id, `location ${lid} extra image in second: ${val}`);
      }
  
      for (const lid of lMap2.keys()) {
        if (!lMap1.has(lid)) addError(id, `extra location ${lid} in second`);
      }
  
      const tr1 = p1.time?.range || {};
      const tr2 = p2.time?.range || {};
      if (tr1.start !== tr2.start) addError(id, `time.range.start mismatch: ${tr1.start} vs ${tr2.start}`);
      if (tr1.end !== tr2.end) addError(id, `time.range.end mismatch: ${tr1.end} vs ${tr2.end}`);
  
      const serializePayment = (p: any) => JSON.stringify(p);
      const ps1 = new Set((p1.payments || []).map(serializePayment));
      const ps2 = new Set((p2.payments || []).map(serializePayment));
      for (const p of ps1) if (!ps2.has(p)) addError(id, `missing payment in second: ${p}`);
      for (const p of ps2) if (!ps1.has(p)) addError(id, `extra payment in second: ${p}`);
    }
  
    for (const id of pMap2.keys()) {
      if (!pMap1.has(id)) addError(id, `Extra provider ${id} found in second`);
    }
  
    return errorObj;
  }
  
  export function onSearchCompareDescriptors(
    desc1: any,
    desc2: any
  ): Record<string, string> {
    const errors: Record<string, string> = {};
  
    if ((desc1?.name || '') !== (desc2?.name || '')) {
      errors.name = `Descriptor name mismatch: ${desc1?.name} vs ${desc2?.name}`;
    }
  
    if ((desc1?.short_desc || '') !== (desc2?.short_desc || '')) {
      errors.short_desc = `Descriptor short_desc mismatch: ${desc1?.short_desc} vs ${desc2?.short_desc}`;
    }
  
    if ((desc1?.long_desc || '') !== (desc2?.long_desc || '')) {
      errors.long_desc = `Descriptor long_desc mismatch: ${desc1?.long_desc} vs ${desc2?.long_desc}`;
    }
  
    const images1 = desc1?.images || [];
    const images2 = desc2?.images || [];
  
    const serializeImage = (img: any) => `${img?.url || ''}|${img?.size_type || ''}`;
  
    const imageSet1 = new Set(images1.map(serializeImage));
    const imageSet2 = new Set(images2.map(serializeImage));
  
    for (const img of imageSet1) {
      if (!imageSet2.has(img)) {
        errors.images = `Image in desc1 not found in desc2: ${img}`;
        break; // Only one error per field
      }
    }
  
    for (const img of imageSet2) {
      if (!imageSet1.has(img)) {
        errors.images = `Image in desc2 not found in desc1: ${img}`;
        break;
      }
    }
  
    return errors;
  }
  
  export function onSearchCompareTags(
    tags1: any[],
    tags2: any[]
  ): Record<string, string> {
    const errors: Record<string, string> = {};
  
    const getTagKey = (tag: any): string => tag?.descriptor?.code || '';
    const map1 = new Map<string, any>(tags1.map(tag => [getTagKey(tag), tag]));
    const map2 = new Map<string, any>(tags2.map(tag => [getTagKey(tag), tag]));
  
    const allKeys = new Set([...map1.keys(), ...map2.keys()]);
  
    allKeys.forEach(code => {
      const tag1 = map1.get(code);
      const tag2 = map2.get(code);
  
      if (!tag1 || !tag2) {
        errors[code] = `Missing tag for descriptor.code: ${code}`;
        return;
      }
  
      if (tag1?.descriptor?.name !== tag2?.descriptor?.name) {
        errors[`${code}.name`] = `Tag name mismatch for code ${code}: ${tag1?.descriptor?.name} vs ${tag2?.descriptor?.name}`;
      }
  
      if (tag1?.display !== tag2?.display) {
        errors[`${code}.display`] = `Tag display mismatch for code ${code}: ${tag1?.display} vs ${tag2?.display}`;
      }
  
      const list1 = Array.isArray(tag1?.list) ? tag1.list : [];
      const list2 = Array.isArray(tag2?.list) ? tag2.list : [];
  
      const listMap1 = new Map<string, any>(list1.map((item: any) => [item?.descriptor?.code, item]));
      const listMap2 = new Map<string, any>(list2.map((item: any) => [item?.descriptor?.code, item]));
  
      const listKeys = new Set([...listMap1.keys(), ...listMap2.keys()]);
  
      listKeys.forEach(itemCode => {
        const item1 = listMap1.get(itemCode);
        const item2 = listMap2.get(itemCode);


        
        if(item2.descriptor.code !== "CURRENT_PAGE_NUMBER" && !item1 || !item2){
          errors[`${code}.${itemCode}`] = `Missing list item for descriptor.code ${itemCode} in tag ${code}`;
          return;
        }
  
        const val1 = item1?.value ?? null;
        const val2 = item2?.value ?? null;
  
        if (item2.descriptor.code !== "CURRENT_PAGE_NUMBER" && val1 !== val2) {
          errors[`${code}.${itemCode}.value`] = `Value mismatch in tag ${code} for descriptor.code ${itemCode}: ${val1} vs ${val2}`;
        }
      });
    });
  
    return errors;
  }
   
  export function compareLocations(locations1: any[], locations2: any[]): Record<string, string> {
    const errors: Record<string, string> = {};
  
    const mapById = (arr: any[]) => new Map(arr.map(loc => [loc.id, loc]));
    const lMap1 = mapById(locations1 || []);
    const lMap2 = mapById(locations2 || []);
  
    for (const [id, l1] of lMap1) {
      const l2 = lMap2.get(id);
      if (!l2) {
        errors[`locations.${id}`] = `Location ${id} missing in second set`;
        continue;
      }
  
      // GPS comparison
      if (l1.gps !== l2.gps) {
        errors[`location.${id}.gps`] = `Location ${id} gps mismatch: ${l1.gps} vs ${l2.gps}`;
      }
  
      // Rating comparison
      if ((l1.rating || '') !== (l2.rating || '')) {
        errors[`location.${id}.rating`] = `Location ${id} rating mismatch: ${l1.rating} vs ${l2.rating}`;
      }
  
      const d1 = l1.descriptor || {};
      const d2 = l2.descriptor || {};
  
      // Descriptor name comparison
      if ((d1.name || '') !== (d2.name || '')) {
        errors[`location.${id}.descriptor.name`] = `Location ${id} descriptor.name mismatch: ${d1.name} vs ${d2.name}`;
      }
  
      // Descriptor short_desc comparison
      if ((d1.short_desc || '') !== (d2.short_desc || '')) {
        errors[`location.${id}.descriptor.short_desc`] = `Location ${id} descriptor.short_desc mismatch`;
      }
  
      // Additional description URL comparison
      if ((d1.additional_desc?.url || '') !== (d2.additional_desc?.url || '')) {
        errors[`location.${id}.descriptor.additional_desc.url`] = `Location ${id} additional_desc.url mismatch`;
      }
  
      // Additional description content_type comparison
      if ((d1.additional_desc?.content_type || '') !== (d2.additional_desc?.content_type || '')) {
        errors[`location.${id}.descriptor.additional_desc.content_type`] = `Location ${id} additional_desc.content_type mismatch`;
      }
  
      // Image comparison
      const imgs1 = d1.images || [];
      const imgs2 = d2.images || [];
      const serializeImg = (img: any) => `${img.url || ''}|${img.size_type || ''}`;
      const set1 = new Set(imgs1.map(serializeImg));
      const set2 = new Set(imgs2.map(serializeImg));
  
      for (const img of set1) {
        if (!set2.has(img)) {
          errors[`location.${id}.descriptor.images.missing`] = `Location ${id} missing image in second: ${img}`;
        }
      }
  
      for (const img of set2) {
        if (!set1.has(img)) {
          errors[`location.${id}.descriptor.images.extra`] = `Location ${id} extra image in second: ${img}`;
        }
      }
    }
  
    // Check for extra locations in the second set
    for (const id of lMap2.keys()) {
      if (!lMap1.has(id)) {
        errors[`location.${id}.extra`] = `Extra location ${id} present in second set`;
      }
    }
  
    return errors;
  } 
  
  export function compareCategories(categories1: any[], categories2: any[]): Record<string, string> {
    const errors: Record<string, string> = {};
  
    const mapById = (arr: any[]) => new Map(arr.map(cat => [cat.id, cat]));
    const cMap1 = mapById(categories1 || []);
    const cMap2 = mapById(categories2 || []);
  
    for (const [id, c1] of cMap1) {
      const c2 = cMap2.get(id);
      if (!c2) {
        errors[`category.${id}.missing`] = `Category ${id} missing in second set`;
        continue;
      }
  
      const d1 = c1.descriptor || {};
      const d2 = c2.descriptor || {};
  
      // Name mismatch
      if ((d1.name || '') !== (d2.name || '')) {
        errors[`category.${id}.name`] = `Category ${id} name mismatch: ${d1.name} vs ${d2.name}`;
      }
  
      // Code mismatch
      if ((d1.code || '') !== (d2.code || '')) {
        errors[`category.${id}.code`] = `Category ${id} code mismatch: ${d1.code} vs ${d2.code}`;
      }
  
      // Parent category ID mismatch
      if ((c1.parent_category_id || '') !== (c2.parent_category_id || '')) {
        errors[`category.${id}.parent_category_id`] = `Category ${id} parent_category_id mismatch: ${c1.parent_category_id} vs ${c2.parent_category_id}`;
      }
    }
  
    // Check for extra categories in second set
    for (const id of cMap2.keys()) {
      if (!cMap1.has(id)) {
        errors[`category.${id}.extra`] = `Extra category ${id} found in second set`;
      }
    }
  
    return errors;
  }
  
  export function checkingPagenumber(Tags:any,count:any):any{
    try {
      const errobj:Record<string, string> = {};
      Tags.forEach((itm:any)=>{
        const list =itm.list
        list.forEach((itm:any)=>{
          if(itm.descriptor.code === "CURRENT_PAGE_NUMBER"){
            if(Number(itm.value) !== Number(count) ){
              errobj[`Pagenumber`] = `${itm.value} does not matches with call`
            }
          }
        })
      })
      return errobj
    } catch (error) {
      logger.error(error)
    }
  }
 
  