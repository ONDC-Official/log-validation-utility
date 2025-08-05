// Routing types
export const ROUTING_ENUMS = ['P2P', 'P2H2P']

// P2P (Hyperlocal) fulfillment states
export const P2P_STATES = {
  REQUIRED: [
    'Pending',
    'Packed',
    'Order-picked-up',
    'Order-delivered'
  ],
  OPTIONAL: [
    'Agent-assigned',
    'At-pickup',
    'At-delivery'
  ],
  FORBIDDEN: [
    'Out-for-pickup',
    'Pickup-failed',
    'In-transit',
    'At-destination-hub',
    'Out-for-delivery',
    'Delivery-failed'
  ]
}

// P2H2P (Intercity) fulfillment states
export const P2H2P_STATES = {
  REQUIRED: [
    'Pending',
    'Packed',
    'Order-picked-up',
    'In-transit',
    'At-destination-hub',
    'Out-for-delivery',
    'Order-delivered'
  ],
  OPTIONAL: [
    'Agent-assigned',
    'Out-for-pickup',
    'Pickup-failed',
    'Delivery-failed'
  ],
  FORBIDDEN: [
    'At-pickup',
    'At-delivery'
  ]
}

// All possible fulfillment states
export const ALL_FULFILLMENT_STATES = [
  'Pending',
  'Packed',
  'Agent-assigned',
  'At-pickup',
  'Out-for-pickup',
  'Pickup-failed',
  'Order-picked-up',
  'At-delivery',
  'In-transit',
  'At-destination-hub',
  'Out-for-delivery',
  'Delivery-failed',
  'Order-delivered',
  'Cancelled'
]

// State transitions mapping
export const STATE_TRANSITIONS = {
  'Pending': ['Packed', 'Cancelled'],
  'Packed': ['Agent-assigned', 'At-pickup', 'Out-for-pickup', 'Order-picked-up', 'Cancelled'],
  'Agent-assigned': ['At-pickup', 'Out-for-pickup', 'Order-picked-up', 'Cancelled'],
  'At-pickup': ['Order-picked-up', 'Cancelled'],
  'Out-for-pickup': ['Pickup-failed', 'Order-picked-up', 'Cancelled'],
  'Pickup-failed': ['Out-for-pickup', 'Order-picked-up', 'Cancelled'],
  'Order-picked-up': ['At-delivery', 'In-transit', 'Out-for-delivery', 'Order-delivered', 'Cancelled'],
  'At-delivery': ['Order-delivered', 'Cancelled'],
  'In-transit': ['At-destination-hub', 'Cancelled'],
  'At-destination-hub': ['Out-for-delivery', 'Cancelled'],
  'Out-for-delivery': ['Delivery-failed', 'Order-delivered', 'Cancelled'],
  'Delivery-failed': ['Out-for-delivery', 'Order-delivered', 'Cancelled'],
  'Order-delivered': [],
  'Cancelled': []
}

// Get allowed states for a routing type
export const getAllowedStatesForRouting = (routing: string): string[] => {
  if (routing === 'P2P') {
    if (!P2P_STATES || !P2P_STATES.REQUIRED || !P2P_STATES.OPTIONAL) {
      return ALL_FULFILLMENT_STATES
    }
    return [...P2P_STATES.REQUIRED, ...P2P_STATES.OPTIONAL, 'Cancelled']
  } else if (routing === 'P2H2P') {
    if (!P2H2P_STATES || !P2H2P_STATES.REQUIRED || !P2H2P_STATES.OPTIONAL) {
      return ALL_FULFILLMENT_STATES
    }
    return [...P2H2P_STATES.REQUIRED, ...P2H2P_STATES.OPTIONAL, 'Cancelled']
  }
  return ALL_FULFILLMENT_STATES || []
}

// Get required states for a routing type
export const getRequiredStatesForRouting = (routing: string): string[] => {
  if (routing === 'P2P') {
    return P2P_STATES?.REQUIRED || []
  } else if (routing === 'P2H2P') {
    return P2H2P_STATES?.REQUIRED || []
  }
  return []
}

// Get forbidden states for a routing type
export const getForbiddenStatesForRouting = (routing: string): string[] => {
  if (routing === 'P2P') {
    return P2P_STATES?.FORBIDDEN || []
  } else if (routing === 'P2H2P') {
    return P2H2P_STATES?.FORBIDDEN || []
  }
  return []
}