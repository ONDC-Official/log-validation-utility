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
  Brand: {
    mandatory: true,
    value: [],
  },
  Prescription_Required: {
    mandatory: true,
    value: [],
  },
  Usage_Instruction: {
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

const homeObj: ICategoryJSON = {
  Brand: {
    mandatory: true,
    value: [],
  },
  Colour: {
    mandatory: true,
    value: [],
  },
  Colour_Name: {
    mandatory: false,
    value: [],
  },
  Material: {
    mandatory: true,
    value: [],
  },
  Size: {
    mandatory: false,
    value: [],
  },
  Weight: {
    mandatory: false,
    value: [],
  },
  Length: {
    mandatory: false,
    value: [],
  },
  Breadth: {
    mandatory: false,
    value: [],
  },
  Height: {
    mandatory: false,
    value: [],
  },
  Model: {
    mandatory: false,
    value: [],
  },
  Assembly_Required: {
    mandatory: false,
    value: [],
  },
  Care_Instructions: {
    mandatory: false,
    value: [],
  },
  Special_Features: {
    mandatory: false,
    value: [],
  },
}

export const homeJSON: { [key: string]: ICategoryJSON } = {
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
  Brand: {
    mandatory: true,
    value: [],
  },
  Colour: {
    mandatory: false,
    value: [],
  },
  Colour_Name: {
    mandatory: false,
    value: [],
  },
  Gender: {
    mandatory: false,
    value: [],
  },
  Concern: {
    mandatory: false,
    value: [],
  },
  Ingredient: {
    mandatory: false,
    value: [],
  },
  Conscious: {
    mandatory: false,
    value: [],
  },
  Preference: {
    mandatory: false,
    value: [],
  },
  Formulation: {
    mandatory: false,
    value: [],
  },
  Skin_Type: {
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
