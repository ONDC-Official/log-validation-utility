const issueCategories = ['ORDER', 'ITEM', 'FULFILLMENT', 'AGENT', 'PAYMENT', 'TRANSACTION']

const issueItmSubCategories = ['ITM01', 'ITM02', 'ITM03', 'ITM04', 'ITM05']
const issueFlmSubcategories = ['FLM01', 'FLM02', 'FLM03', 'FLM04', 'FLM05', 'FLM06', 'FLM07', 'FLM08']



const issueSubCategories = [
  ...issueItmSubCategories,
  ...issueFlmSubcategories,
  'ORD01',
  'ORD02',
  'ORD03',
  'AGT01',
  'AGT02',
  'PMT01',
  'PMT02',
  'PMT03',
  'PMT04',
]

export default { issueItmSubCategories, issueFlmSubcategories, issueCategories, issueSubCategories }
