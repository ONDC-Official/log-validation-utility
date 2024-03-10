interface Price {
  currency: string
  value: string
}

interface ItemQuantity {
  count: string
}

interface Item {
  quantity: {
    available: ItemQuantity
    maximum: ItemQuantity
  }
  price: Price
}

interface BreakupItem {
  '@ondc/org/item_id': string
  '@ondc/org/item_quantity'?: { count: number }
  '@ondc/org/title_type'?: string
  title?: string
  price: Price
  item?: Item
}

export interface InputObject {
  price: Price
  breakup: BreakupItem[]
  ttl: string
}
