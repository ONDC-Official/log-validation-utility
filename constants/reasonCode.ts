type ReasonCode = {
  Reason: string
  RTO: string
  USED_BY: string
  'Cause of cancellation & hence cost attributed to?': string
  'Applicable for part cancel?': string
}

type ReasonCodes = {
  [reasonId: string]: ReasonCode
}
export const reasonCodes: ReasonCodes = {
  '001': {
    Reason: 'Price of one or more items have changed due to which buyer was asked to make additional payment',
    RTO: 'No',
    USED_BY: 'BNP',
    'Cause of cancellation & hence cost attributed to?': 'Seller NP (SNP)',
    'Applicable for part cancel?': 'No',
  },
  '002': {
    Reason: 'One or more items in the Order not available',
    RTO: 'No',
    USED_BY: 'SNP',
    'Cause of cancellation & hence cost attributed to?': 'SNP',
    'Applicable for part cancel?': 'Yes',
  },
  '003': {
    Reason: 'Product available at lower than order price',
    RTO: 'Yes',
    USED_BY: 'BNP',
    'Cause of cancellation & hence cost attributed to?': 'SNP',
    'Applicable for part cancel?': 'No',
  },
  '005': {
    Reason: 'Merchant rejected the order',
    RTO: 'No',
    USED_BY: 'SNP',
    'Cause of cancellation & hence cost attributed to?': 'SNP',
    'Applicable for part cancel?': 'No',
  },
  '006': {
    Reason: 'Order / fulfillment not received as per buyer app TAT SLA',
    RTO: 'Yes',
    USED_BY: 'BNP',
    'Cause of cancellation & hence cost attributed to?': 'SNP / LSP',
    'Applicable for part cancel?': 'No',
  },
  '007': {
    Reason: 'Order / fulfillment not received as per buyer app TAT SLA',
    RTO: 'Yes',
    USED_BY: 'LBNP',
    'Cause of cancellation & hence cost attributed to?': 'LSP',
    'Applicable for part cancel?': 'No',
  },
  '008': {
    Reason: 'Order / fulfillment not ready for pickup',
    RTO: 'No',
    USED_BY: 'LSP',
    'Cause of cancellation & hence cost attributed to?': 'SNP',
    'Applicable for part cancel?': 'No',
  },
  '009': {
    Reason: 'Wrong product delivered',
    RTO: 'Yes',
    USED_BY: 'BNP',
    'Cause of cancellation & hence cost attributed to?': 'SNP',
    'Applicable for part cancel?': 'No',
  },
  '010': {
    Reason: 'Buyer wants to modify address / other order details',
    RTO: 'Yes',
    USED_BY: 'BNP',
    'Cause of cancellation & hence cost attributed to?': 'BNP',
    'Applicable for part cancel?': 'No',
  },
  '011': {
    Reason: 'Buyer not found or cannot be contacted',
    RTO: 'Yes',
    USED_BY: 'LSP & SNP',
    'Cause of cancellation & hence cost attributed to?': 'BNP',
    'Applicable for part cancel?': 'No',
  },
  '012': {
    Reason: 'Buyer does not want product any more',
    RTO: 'Yes',
    USED_BY: 'LSP & SNP ',
    'Cause of cancellation & hence cost attributed to?': 'BNP',
    'Applicable for part cancel?': 'Yes',
  },
  '013': {
    Reason: 'Buyer refused to accept delivery',
    RTO: 'Yes',
    USED_BY: 'LSP & SNP ',
    'Cause of cancellation & hence cost attributed to?': 'BNP',
    'Applicable for part cancel?': 'No',
  },
  '014': {
    Reason: 'Address not found',
    RTO: 'Yes',
    USED_BY: 'LSP & SNP ',
    'Cause of cancellation & hence cost attributed to?': 'BNP',
    'Applicable for part cancel?': 'No',
  },
  '015': {
    Reason: 'Buyer not available at location',
    RTO: 'Yes',
    USED_BY: 'LSP & SNP ',
    'Cause of cancellation & hence cost attributed to?': 'BNP',
    'Applicable for part cancel?': 'No',
  },
  '016': {
    Reason: 'Accident / rain / strike / vehicle issues',
    RTO: 'No',
    USED_BY: 'LSP',
    'Cause of cancellation & hence cost attributed to?': 'LSP',
    'Applicable for part cancel?': 'No',
  },
  '017': {
    Reason: 'Order delivery delayed or not possible',
    RTO: 'No',
    USED_BY: 'LSP',
    'Cause of cancellation & hence cost attributed to?': 'LSP',
    'Applicable for part cancel?': 'No',
  },
  '018': {
    Reason: 'Delivery pin code not serviceable',
    RTO: 'No',
    USED_BY: 'SNP',
    'Cause of cancellation & hence cost attributed to?': 'SNP',
    'Applicable for part cancel?': 'No',
  },
  '019': {
    Reason: 'Pickup pin code not serviceable',
    RTO: 'No',
    USED_BY: 'SNP',
    'Cause of cancellation & hence cost attributed to?': 'SNP',
    'Applicable for part cancel?': 'No',
  },
  '020': {
    Reason: 'Order lost in transit',
    RTO: 'No',
    USED_BY: 'LSP & SNP',
    'Cause of cancellation & hence cost attributed to?': 'LSP',
    'Applicable for part cancel?': 'No',
  },
  '021': {
    Reason: 'Packed order not complete',
    RTO: 'No',
    USED_BY: 'LSP',
    'Cause of cancellation & hence cost attributed to?': 'SNP',
    'Applicable for part cancel?': 'No',
  },
  '999': {
    Reason: 'Order confirmation failure',
    RTO: 'N/A',
    USED_BY: 'BNP',
    'Cause of cancellation & hence cost attributed to?': 'N/A',
    'Applicable for part cancel?': 'N/A',
  },
  '998': {
    Reason: 'Order confirmation failure',
    RTO: 'N/A',
    USED_BY: 'SNP',
    'Cause of cancellation & hence cost attributed to?': 'N/A',
    'Applicable for part cancel?': 'N/A',
  },
  '997': {
    Reason: 'Order confirmation failure',
    RTO: 'N/A',
    USED_BY: 'LSP',
    'Cause of cancellation & hence cost attributed to?': 'N/A',
    'Applicable for part cancel?': 'N/A',
  },
  '996': {
    Reason: 'Order confirmation / completion failure',
    RTO: 'N/A',
    USED_BY: 'LBNP',
    'Cause of cancellation & hence cost attributed to?': 'N/A',
    'Applicable for part cancel?': 'N/A',
  },
}

export const return_request_reasonCodes =['001', '002', '003', '004', '005'];
export const partcancel_return_reasonCodes =['002','012'];
export const return_rejected_request_reasonCodes =['001', '002', '003', '004', '005','007','008'];
export const condition_id=["001", "002", "003"] // "001" (proper working condition without damages), "002" (proper working condition with damages), "003" (not working);
export const delivery_delay_reasonCodes = ['001', '002', '003', '004', '005','007','008'];