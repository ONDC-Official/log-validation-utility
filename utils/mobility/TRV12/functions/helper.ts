export function validateFulfillmentStops(stops: any) {
    const errorObj: Record<string, string[]> = {}
  
    const stopTypes = new Set<string>()
  
    for (const stop of stops) {
      if (!stop?.type) {
        if (!errorObj['stops']) errorObj['stops'] = []
        errorObj['stops'].push("Each stop must have a 'type' (START or END)")
      } else {
        stopTypes.add(stop.type)
      }
    }
  
    if (!stopTypes.has('START') && !stopTypes.has('END')) {
      return { stops: ["Stops must include both 'START' and 'END' types"] }
    }
  
    if (!stopTypes.has('START')) {
      errorObj['stops'] = ["Stops must include a 'START' type"]
    } else if (!stopTypes.has('END')) {
      errorObj['stops'] = ["Stops must include an 'END' type"]
    }
  
    return Object.keys(errorObj).length ? errorObj : null
  }
  