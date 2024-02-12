interface ICategoryJSON {
  [key: string]: boolean
}

const groceryObj: ICategoryJSON = {
  brand: false,
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

const fashionObj: ICategoryJSON = {
  Gender: true,
  Colour: true,
  Size: true,
  Brand: true,
  size_chart: true,
  Fabric: true,
}

export const fashionJSON: { [key: string]: ICategoryJSON } = {
  Shirts: fashionObj,
  'T Shirts': fashionObj,
  Sweatshirts: fashionObj,
  'Kurtas & Kurta Sets': fashionObj,
  'Jackets & Coats': fashionObj,
  Sweaters: fashionObj,
  Suits: fashionObj,
  Sherwanis: fashionObj,
  'Track Shirts': fashionObj,
  'Track Suits': fashionObj,
  'Unstitched Fabrics': {
    Gender: true,
    Colour: true,
    Size: true,
    Brand: true,
    size_chart: false,
    Fabric: true,
  },
  Dresses: fashionObj,
  Tops: fashionObj,
  Trousers: fashionObj,
  Capris: fashionObj,
  Coordinates: fashionObj,
  Playsuits: fashionObj,
  Jumpsuits: fashionObj,
  'Shrugs & Blouses': fashionObj,
  'Blazers & Waistcoats': fashionObj,
  'Tights, Leggings & Jeggings': fashionObj,
  'Track Pants': fashionObj,
  Jeans: fashionObj,
  Shorts: fashionObj,
  Joggers: fashionObj,
  'Dhotis & Dhoti Pants': fashionObj,
  Churidars: fashionObj,
  Salwars: fashionObj,
  'Dungarees & Jumpsuits': fashionObj,
  Skirts: fashionObj,
  'Clothing Sets': fashionObj,
  Belts: fashionObj,
  'Caps & Hats': fashionObj,
  'Kurtis, Tunics': fashionObj,
  Sarees: fashionObj,
  'Ethnic Wear': fashionObj,
  Palazzos: fashionObj,
  'Dress Materials': fashionObj,
  'Lehenga Cholis': fashionObj,
  'Dupattas & Shawls': fashionObj,
  'Burqas & Hijabs': fashionObj,
  Blouses: fashionObj,
  'Blouse Pieces': fashionObj,
  Briefs: fashionObj,
  Boxers: fashionObj,
  Vests: fashionObj,
  Robes: fashionObj,
  'Night Suits': fashionObj,
  'Thermal Wear': fashionObj,
  'Swim Bottoms': fashionObj,
  Swimwear: fashionObj,
  Bra: fashionObj,
  Shapewear: fashionObj,
  'Sleepwear & Loungewear': fashionObj,
  Camisoles: fashionObj,
  'Lingerie Sets & Accessories': fashionObj,
  'Bath Robes': fashionObj,
  Towels: fashionObj,
  Pyjamas: fashionObj,
  'Party Wear': fashionObj,
  'Innerwear & Sleepwear': fashionObj,
  'Nightwear & Loungewear': fashionObj,
  Watches: fashionObj,
  Gloves: fashionObj,
  Socks: fashionObj,
  Stockings: fashionObj,
  Laces: fashionObj,
  'Soles & Charms': fashionObj,
  'Shoe Racks & Organisers': fashionObj,
  'Shoe Care - Accessories': fashionObj,
  'Flip-Flops & Flats': fashionObj,
  'Sandals & Floaters': fashionObj,
  Backpacks: fashionObj,
  Handbags: fashionObj,
  'Trolley, Luggage & Suitcases': fashionObj,
  'Formal Shoes': fashionObj,
  'Casual Shoes': fashionObj,
  'Sports Shoes': fashionObj,
  'Outdoor Shoes': fashionObj,
  'Work & Safety Shoes': fashionObj,
  'Ethnic Shoes': fashionObj,
  Boots: fashionObj,
  Heels: fashionObj,
  'Contact Lenses': fashionObj,
  'Eye Glasses': fashionObj,
  'Eye Glass Frames': fashionObj,
  Sunglasses: fashionObj,
  'Contact Lens Cases': fashionObj,
  'Contact Lens Solutions': fashionObj,
  'Contact Lens Tweezers': fashionObj,
  'Eyeglasses Pouches & Cases': fashionObj,
  'Microfiber Wipes': fashionObj,
  'Eyewear Slings': fashionObj,
  Bracelets: fashionObj,
  Chains: fashionObj,
  Mangalsutra: fashionObj,
  Anklets: fashionObj,
  'Bangles & Bracelets': fashionObj,
  Necklaces: fashionObj,
  Earrings: fashionObj,
  'Jewellery Sets': fashionObj,
  'Nosepins & Noserings': fashionObj,
  Pendants: fashionObj,
  Rings: fashionObj,
  'Toe Rings': fashionObj,
  'Gold Coins': fashionObj,
  Brooch: fashionObj,
}

const healthObj: ICategoryJSON = {
  Brand: true,
  'Prescription Required': true,
  'Usage Instruction': false,
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
  Brand: true,
  Colour: true,
  'Colour Name': false,
  Material: true,
  Size: false,
  Weight: false,
  Length: false,
  Breadth: false,
  Height: false,
  Model: false,
  'Assembly Required': false,
  'Care Instructions': false,
  'Special Features': false,
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
  Brand: true,
  Colour: false,
  'Colour Name': false,
  Gender: true,
  Concern: true,
  Ingredient: true,
  Conscious: true,
  Preference: true,
  Formulation: true,
  'Skin Type': true,
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
