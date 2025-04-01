export function validatePaymentTags(paymentTags: any) {
  const errorObj: Record<string, string[]> = {}

  if (!Array.isArray(paymentTags) || paymentTags.length === 0) {
    errorObj['general'] = ['Payment tags must be a non-empty array']
    return errorObj
  }

  for (const tag of paymentTags) {
    if (!tag?.descriptor?.code) {
      errorObj['general'] = ['Each tag must have a descriptor with a valid code']
      continue
    }

    const tagCode = tag.descriptor.code
    if (!Array.isArray(tag.list)) {
      errorObj[tagCode] = ["'list' must be an array"]
      continue
    }

    const listCodes = new Set<string>()
    for (const item of tag.list) {
      if (!item?.descriptor?.code || item.value === undefined) {
        if (!errorObj[tagCode]) errorObj[tagCode] = []
        errorObj[tagCode].push('Each list item must have a descriptor with a code and a value')
      }
      listCodes.add(item.descriptor.code)
    }

    if (tagCode === 'BUYER_FINDER_FEES' && !listCodes.has('BUYER_FINDER_FEES_PERCENTAGE')) {
      if (!errorObj[tagCode]) errorObj[tagCode] = []
      errorObj[tagCode].push("Must contain 'BUYER_FINDER_FEES_PERCENTAGE' in the list")
    }

    if (tagCode === 'SETTLEMENT_TERMS') {
      const requiredCodes = ['DELAY_INTEREST', 'STATIC_TERMS']
      const missingCodes = requiredCodes.filter((code) => !listCodes.has(code))
      if (missingCodes.length > 0) {
        if (!errorObj[tagCode]) errorObj[tagCode] = []
        errorObj[tagCode].push(`Must contain: ${missingCodes.join(', ')}`)
      }
    }
  }

  return Object.keys(errorObj).length ? errorObj : null
}
