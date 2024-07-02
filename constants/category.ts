import { statutory_reqs } from "../utils/enum"

interface ICategoryJSON {
  [key: string]: {
    [key: string]: boolean | String[]
  }
}

const groceryObj: ICategoryJSON = {
  brand: {
    mandatory: false,
    value: [],
  },
}

export const groceryJSON: { [key: string]: ICategoryJSON } = {
  'Fruits and Vegetables': groceryObj,
  'Masala & Seasoning': groceryObj,
  'Falseil & Ghee': groceryObj,
  'Eggs, Meat & Fish': groceryObj,
  'Cleaning & Household': groceryObj,
  'Bakery, Cakes & Dairy': groceryObj,
  'Pet Care': groceryObj,
  Stationery: groceryObj,
  'Dairy and Cheese': groceryObj,
  'Snacks, Dry Fruits, Nuts': groceryObj,
  'Pasta, Soup and Noodles': groceryObj,
  'Cereals and Breakfast': groceryObj,
  'Sauces, Spreads and Dips': groceryObj,
  'Chocolates and Biscuits': groceryObj,
  'Cooking and Baking Needs': groceryObj,
  'Tinned and Processed Food': groceryObj,
  'Atta, Flours and Sooji': groceryObj,
  'Rice and Rice Products': groceryObj,
  'Dals and Pulses': groceryObj,
  'Salt, Sugar and Jaggery': groceryObj,
  'Energy and Soft Drinks': groceryObj,
  Water: groceryObj,
  'Tea and Coffee': groceryObj,
  'Fruit Juices and Fruit Drinks': groceryObj,
  'Snacks and Namkeen': groceryObj,
  'Ready to Cook and Eat': groceryObj,
  'Pickles and Chutney': groceryObj,
  'Indian Sweets': groceryObj,
  'Frozen Vegetables': groceryObj,
  'Frozen Snacks': groceryObj,
  'Gift Voucher': groceryObj,
}

const healthObj: ICategoryJSON = {
  brand: {
    mandatory: true,
    value: [],
  },
  prescription_required: {
    mandatory: true,
    value: [],
  },
  usage_instruction: {
    mandatory: false,
    value: [],
  },
}

export const healthJSON: { [key: string]: ICategoryJSON } = {
  'Pain Relief': healthObj,
  'Nutrition and Fitness Supplements': healthObj,
  'Speciality Care': healthObj,
  'Covid Essentials': healthObj,
  'Diabetes Control': healthObj,
  'Healthcare & Fitness Devices': healthObj,
  Ayurvedic: healthObj,
  Homeopathy: healthObj,
  'Unani and Siddha': healthObj,
  'Elder Care': healthObj,
  'Baby Care': healthObj,
  'Orthopaedic Care': healthObj,
  'Mobility Aids': healthObj,
  'Medicated Hair Care': healthObj,
  'Medicated Skin Care': healthObj,
  'Speciality Face Cleansers': healthObj,
  'Gastric Care': healthObj,
  'ENT Care': healthObj,
  'Eye Care': healthObj,
  'Cold and Cough': healthObj,
  'Sexual Wellness': healthObj,
  'Feminine Care': healthObj,
  'Maternity Care': healthObj,
  'Nursing and Feeding': healthObj,
  'Hand Wash': healthObj,
  Sanitizers: healthObj,
  'Baby Care - Wipes and Buds': healthObj,
  'Baby Care - Rash Creams': healthObj,
  'Baby Care - Diapers and Accessories': healthObj,
  'Health and Safety': healthObj,
  'Oral Care': healthObj,
  Contraceptives: healthObj,
  'Breathe Easy': healthObj,
  'Health Foods and Drinks': healthObj,
  'Wound Care and Dressings': healthObj,
  Surgicals: healthObj,
  'Mental Wellness': healthObj,
  'Gift Voucher': healthObj,
}

const homeObj = {
  brand: {
    mandatory: true,
    value: [],
  },
  colour: {
    mandatory: true,
    value: [],
  },
  colour_name: {
    mandatory: true,
    value: "/^#([a-fA-F0-9]{6})/",
  },
  material: {
    mandatory: true,
    value: [],
  },
  size: {
    mandatory: false,
    value: [],
  },
  weight: {
    mandatory: false,
    value: "/^[0-9]+(\.[0-9]{1,3})?$/",
  },
  length: {
    mandatory: false,
    value: "/^[0-9]+(\.[0-9]{1,2})?$/",
  },
  breadth: {
    mandatory: false,
    value: "/^[0-9]+(\.[0-9]{1,2})?$/",
  },
  height: {
    mandatory: false,
    value: "/^[0-9]+(\.[0-9]{1,2})?$/",
  },
  model: {
    mandatory: false,
    value: [],
  },
  assembly_required: {
    mandatory: false,
    value: [],
  },
  care_instructions: {
    mandatory: false,
    value: [],
  },
  special_features: {
    mandatory: false,
    value: [],
  },
}

export const homeJSON = {
  'Home Decor': homeObj,
  Furniture: homeObj,
  'Home Furnishing - Bedding and Linen': homeObj,
  'Cleaning Supplies': homeObj,
  Electricals: homeObj,
  'Bathroom and Kitchen fixtures': homeObj,
  'Garden & Outdoor': homeObj,
  'Sports and Fitness Equipment': homeObj,
  Cookware: homeObj,
  Serveware: homeObj,
  'Kitchen Storage and Containers': homeObj,
  'Kitchen Tools': homeObj,
  'Closet/Laundry/Shoe Organization': homeObj,
  'Toys and Games': homeObj,
  Stationery: homeObj,
  'Gift Voucher': {},
}

const BPCObj: ICategoryJSON = {
  brand: {
    mandatory: true,
    value: [],
  },
  colour: {
    mandatory: false,
    value: [],
  },
  colour_Name: {
    mandatory: false,
    value: [],
  },
  gender: {
    mandatory: false,
    value: [],
  },
  concern: {
    mandatory: false,
    value: [],
  },
  ingredient: {
    mandatory: false,
    value: [],
  },
  conscious: {
    mandatory: false,
    value: [],
  },
  preference: {
    mandatory: false,
    value: [],
  },
  formulation: {
    mandatory: false,
    value: [],
  },
  skin_type: {
    mandatory: false,
    value: [],
  },
}

export const BPCJSON: { [key: string]: ICategoryJSON } = {
  Fragrance: BPCObj,
  'Bath Soaps and Gels': BPCObj,
  'Hair Oils, Care, and Styling': BPCObj,
  'Shampoos and Conditioners': BPCObj,
  'Shaving and Grooming': BPCObj,
  'Beard Care and Tools': BPCObj,
  'Grooming Tools and Accessories': BPCObj,
  'Makeup - Nail Care': BPCObj,
  'Makeup - Eyes': BPCObj,
  'Makeup - Face': BPCObj,
  'Makeup - Lips': BPCObj,
  'Makeup - Body': BPCObj,
  'Makeup - Remover': BPCObj,
  'Makeup - Sets and Kits': BPCObj,
  'Makeup - Tools and Brushes': BPCObj,
  'Makeup - Kits and Combos': BPCObj,
  'Skin Care - Face Cleansers': BPCObj,
  'Skin Care - Hand and Feet': BPCObj,
  'Body Care - Cleansers': BPCObj,
  'Body Care - Moisturizers': BPCObj,
  'Body Care - Loofah and Other Tools': BPCObj,
  'Body Care - Bath Salt and Additives': BPCObj,
  'Hair Care - Shampoo, Oils, Conditioners': BPCObj,
  'Skin Care - Lotions, Moisturisers, and Creams': BPCObj,
  'Skin Care - Oils and Serums': BPCObj,
}

export const groceryCategoryMappingWithStatutory: { [key: string]: statutory_reqs } = {
  "Bakery, Cakes & Dairy": statutory_reqs.PrepackagedFood,
  "Dairy and Cheese": statutory_reqs.PrepackagedFood,
  "Snacks, Dry Fruits, Nuts": statutory_reqs.PrepackagedFood,
  "Cereals and Breakfast": statutory_reqs.PrepackagedFood,
  "Sauces, Spreads and Dips": statutory_reqs.PrepackagedFood,
  "Chocolates and Biscuits": statutory_reqs.PrepackagedFood,
  "Tinned and Processed Food": statutory_reqs.PrepackagedFood,
  "Energy and Soft Drinks": statutory_reqs.PrepackagedFood,
  "Fruit Juices and Fruit Drinks": statutory_reqs.PrepackagedFood,
  "Snacks and Namkeen": statutory_reqs.PrepackagedFood,
  "Ready to Cook and Eat": statutory_reqs.PrepackagedFood,
  "Pickles and Chutney": statutory_reqs.PrepackagedFood,
  "Indian Sweets": statutory_reqs.PrepackagedFood,
  "Frozen Snacks": statutory_reqs.PrepackagedFood,
  "Masala & Seasoning": statutory_reqs.PackagedCommodities,
  "Oil & Ghee": statutory_reqs.PackagedCommodities,
  "Eggs, Meat & Fish": statutory_reqs.PackagedCommodities,
  "Cleaning & Household": statutory_reqs.PackagedCommodities,
  "Pet Care": statutory_reqs.PackagedCommodities,
  "Pasta, Soup and Noodles": statutory_reqs.PackagedCommodities,
  "Cooking and Baking Needs": statutory_reqs.PackagedCommodities,
  "Atta, Flours and Sooji": statutory_reqs.PackagedCommodities,
  "Rice and Rice Products": statutory_reqs.PackagedCommodities,
  "Dals and Pulses": statutory_reqs.PackagedCommodities,
  "Salt, Sugar and Jaggery": statutory_reqs.PackagedCommodities,
  "Tea and Coffee": statutory_reqs.PackagedCommodities,
  "Fruits and Vegetables": statutory_reqs.None,
  "Water": statutory_reqs.None,
  "Frozen Vegetables": statutory_reqs.None,
  "Gift Voucher": statutory_reqs.None
};
