import {
  BACKPACK_STYLE,
  BASE_METAL,
  BOTTOM_TYPE,
  BUCKLE_MATERIAL,
  BUCKLE_TYPE,
  CLOSURE_TYPE,
  COLLAR,
  COVERAGE,
  DIAL_SHAPE,
  DISPLAY,
  FABRIC,
  FABRIC_FINISH,
  FACE_SHAPE,
  FASTEN_TYPE,
  FEATURES,
  FIT,
  FOOTWEAR_TYPE,
  FRAME_MATERIAL,
  FRAME_SHAPE,
  FRAME_SIZE,
  FRAME_STYLE,
  FRAME_TYPE,
  FRONT_STYLING,
  GEM_TYPE,
  GENDER,
  HEMLINE,
  INSOLE,
  LENS_MATERIAL,
  LOCK_TYPE,
  MATERIAL,
  MATERIAL_FINISH,
  MIDSOLE,
  NECK,
  OCCASION,
  ORNAMENTATION,
  OUTSOLE,
  PADDING,
  PATTERN,
  PLATING,
  POWER_TYPE,
  SEAM,
  SEASON,
  SIZE,
  SLEEVE_LENGTH,
  SOCKS_LENGTH,
  SOLE_MATERIAL,
  SPORT_TYPE,
  STONE_TYPE,
  STRAP_MATERIAL,
  SWEATSHIRT_TYPE,
  TOE_SHAPE,
  TOP_TYPE,
  TREND,
  WAIST_BAND,
  WAIST_RISE,
  WASH_TYPE,
} from './fashionEnum'

export const fashion = {
  Shirts: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/',
    },
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'T Shirts': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Sweatshirts: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Kurtas & Kurta Sets': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Jackets & Coats': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '0-3 Months',
        '1': '0-6 Months',
        '2': '3-6 Months',
        '3': '6-9 Months',
        '4': '6-12 Months',
        '5': '9-12 Months',
        '6': '12-18 Months',
        '7': '18-24 Months',
        '8': '0-1 Years',
        '9': '1-2 Years',
        '10': '2-3 Years',
        '11': '3-4 Years',
        '12': '4-5 Years',
        '13': '5-6 Years',
        '14': '6-7 Years',
        '15': '7-8 Years',
        '16': '8-9 Years',
        '17': '9-10 Years',
        '18': '10-11 Years',
        '19': '11-12 Years',
        '20': '12-13 Years',
        '21': '13-14 Years',
        '22': '14-15 Years',
        '23': '15-16 Years',
        '24': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Sweaters: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '0-3 Months',
        '1': '0-6 Months',
        '2': '3-6 Months',
        '3': '6-9 Months',
        '4': '6-12 Months',
        '5': '9-12 Months',
        '6': '12-18 Months',
        '7': '18-24 Months',
        '8': '0-1 Years',
        '9': '1-2 Years',
        '10': '2-3 Years',
        '11': '3-4 Years',
        '12': '4-5 Years',
        '13': '5-6 Years',
        '14': '6-7 Years',
        '15': '7-8 Years',
        '16': '8-9 Years',
        '17': '9-10 Years',
        '18': '10-11 Years',
        '19': '11-12 Years',
        '20': '12-13 Years',
        '21': '13-14 Years',
        '22': '14-15 Years',
        '23': '15-16 Years',
        '24': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Stoles and Scarves': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '0-3 Months',
        '1': '0-6 Months',
        '2': '3-6 Months',
        '3': '6-9 Months',
        '4': '6-12 Months',
        '5': '9-12 Months',
        '6': '12-18 Months',
        '7': '18-24 Months',
        '8': '0-1 Years',
        '9': '1-2 Years',
        '10': '2-3 Years',
        '11': '3-4 Years',
        '12': '4-5 Years',
        '13': '5-6 Years',
        '14': '6-7 Years',
        '15': '7-8 Years',
        '16': '8-9 Years',
        '17': '9-10 Years',
        '18': '10-11 Years',
        '19': '11-12 Years',
        '20': '12-13 Years',
        '21': '13-14 Years',
        '22': '14-15 Years',
        '23': '15-16 Years',
        '24': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Mufflers: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Semi Stitched',
        '1': 'Un Stitched',
        '2': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Suits: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Semi Stitched',
        '1': 'Un Stitched',
        '2': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Sherwanis: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Track Shirts': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Track Suits': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '0-3 Months',
        '1': '0-6 Months',
        '2': '3-6 Months',
        '3': '6-9 Months',
        '4': '6-12 Months',
        '5': '9-12 Months',
        '6': '12-18 Months',
        '7': '18-24 Months',
        '8': '0-1 Years',
        '9': '1-2 Years',
        '10': '2-3 Years',
        '11': '3-4 Years',
        '12': '4-5 Years',
        '13': '5-6 Years',
        '14': '6-7 Years',
        '15': '7-8 Years',
        '16': '8-9 Years',
        '17': '9-10 Years',
        '18': '10-11 Years',
        '19': '11-12 Years',
        '20': '12-13 Years',
        '21': '13-14 Years',
        '22': '14-15 Years',
        '23': '15-16 Years',
        '24': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Unstitched Fabrics': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '0-3 Months',
        '1': '0-6 Months',
        '2': '3-6 Months',
        '3': '6-9 Months',
        '4': '6-12 Months',
        '5': '9-12 Months',
        '6': '12-18 Months',
        '7': '18-24 Months',
        '8': '0-1 Years',
        '9': '1-2 Years',
        '10': '2-3 Years',
        '11': '3-4 Years',
        '12': '4-5 Years',
        '13': '5-6 Years',
        '14': '6-7 Years',
        '15': '7-8 Years',
        '16': '8-9 Years',
        '17': '9-10 Years',
        '18': '10-11 Years',
        '19': '11-12 Years',
        '20': '12-13 Years',
        '21': '13-14 Years',
        '22': '14-15 Years',
        '23': '15-16 Years',
        '24': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Dresses: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Tops: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Trousers: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '24',
        '1': '26',
        '2': '28',
        '3': '30',
        '4': '32',
        '5': '34',
        '6': '36',
        '7': '38',
        '8': '40',
        '9': '42',
        '10': '44',
        '11': '46',
        '12': '48',
        '13': '50',
        '14': '52',
        '15': 'Free Size',
        '16': 'XS',
        '17': 'S',
        '18': 'M',
        '19': 'L',
        '20': 'XL',
        '21': 'XXL',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Capris: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '24',
        '1': '26',
        '2': '28',
        '3': '30',
        '4': '32',
        '5': '34',
        '6': '36',
        '7': '38',
        '8': '40',
        '9': '42',
        '10': '44',
        '11': '46',
        '12': '48',
        '13': '50',
        '14': '52',
        '15': 'Free Size',
        '16': 'XS',
        '17': 'S',
        '18': 'M',
        '19': 'L',
        '20': 'XL',
        '21': 'XXL',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Coordinates: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Playsuits: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Jumpsuits: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Shrugs & Blouses': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Blazers & Waistcoats': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Tights, Leggings & Jeggings': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '0-3 Months',
        '1': '0-6 Months',
        '2': '3-6 Months',
        '3': '6-9 Months',
        '4': '6-12 Months',
        '5': '9-12 Months',
        '6': '12-18 Months',
        '7': '18-24 Months',
        '8': '0-1 Years',
        '9': '1-2 Years',
        '10': '2-3 Years',
        '11': '3-4 Years',
        '12': '4-5 Years',
        '13': '5-6 Years',
        '14': '6-7 Years',
        '15': '7-8 Years',
        '16': '8-9 Years',
        '17': '9-10 Years',
        '18': '10-11 Years',
        '19': '11-12 Years',
        '20': '12-13 Years',
        '21': '13-14 Years',
        '22': '14-15 Years',
        '23': '15-16 Years',
        '24': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Track Pants': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '24',
        '1': '26',
        '2': '28',
        '3': '30',
        '4': '32',
        '5': '34',
        '6': '36',
        '7': '38',
        '8': '40',
        '9': '42',
        '10': '44',
        '11': '46',
        '12': '48',
        '13': '50',
        '14': '52',
        '15': 'Free Size',
        '16': 'XS',
        '17': 'S',
        '18': 'M',
        '19': 'L',
        '20': 'XL',
        '21': 'XXL',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Jeans: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '24',
        '1': '26',
        '2': '28',
        '3': '30',
        '4': '32',
        '5': '34',
        '6': '36',
        '7': '38',
        '8': '40',
        '9': '42',
        '10': '44',
        '11': '46',
        '12': '48',
        '13': '50',
        '14': '52',
        '15': 'Free Size',
        '16': 'XS',
        '17': 'S',
        '18': 'M',
        '19': 'L',
        '20': 'XL',
        '21': 'XXL',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Shorts: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '24',
        '1': '26',
        '2': '28',
        '3': '30',
        '4': '32',
        '5': '34',
        '6': '36',
        '7': '38',
        '8': '40',
        '9': '42',
        '10': '44',
        '11': '46',
        '12': '48',
        '13': '50',
        '14': '52',
        '15': 'Free Size',
        '16': 'XS',
        '17': 'S',
        '18': 'M',
        '19': 'L',
        '20': 'XL',
        '21': 'XXL',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Joggers: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '0-3 Months',
        '1': '0-6 Months',
        '2': '3-6 Months',
        '3': '6-9 Months',
        '4': '6-12 Months',
        '5': '9-12 Months',
        '6': '12-18 Months',
        '7': '18-24 Months',
        '8': '0-1 Years',
        '9': '1-2 Years',
        '10': '2-3 Years',
        '11': '3-4 Years',
        '12': '4-5 Years',
        '13': '5-6 Years',
        '14': '6-7 Years',
        '15': '7-8 Years',
        '16': '8-9 Years',
        '17': '9-10 Years',
        '18': '10-11 Years',
        '19': '11-12 Years',
        '20': '12-13 Years',
        '21': '13-14 Years',
        '22': '14-15 Years',
        '23': '15-16 Years',
        '24': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Dhotis & Dhoti Pants': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '0-3 Months',
        '1': '0-6 Months',
        '2': '3-6 Months',
        '3': '6-9 Months',
        '4': '6-12 Months',
        '5': '9-12 Months',
        '6': '12-18 Months',
        '7': '18-24 Months',
        '8': '0-1 Years',
        '9': '1-2 Years',
        '10': '2-3 Years',
        '11': '3-4 Years',
        '12': '4-5 Years',
        '13': '5-6 Years',
        '14': '6-7 Years',
        '15': '7-8 Years',
        '16': '8-9 Years',
        '17': '9-10 Years',
        '18': '10-11 Years',
        '19': '11-12 Years',
        '20': '12-13 Years',
        '21': '13-14 Years',
        '22': '14-15 Years',
        '23': '15-16 Years',
        '24': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Churidars: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '24',
        '1': '26',
        '2': '28',
        '3': '30',
        '4': '32',
        '5': '34',
        '6': '36',
        '7': '38',
        '8': '40',
        '9': '42',
        '10': '44',
        '11': '46',
        '12': '48',
        '13': '50',
        '14': '52',
        '15': 'Free Size',
        '16': 'XS',
        '17': 'S',
        '18': 'M',
        '19': 'L',
        '20': 'XL',
        '21': 'XXL',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Salwars: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Dungarees & Jumpsuits': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '0-3 Months',
        '1': '0-6 Months',
        '2': '3-6 Months',
        '3': '6-9 Months',
        '4': '6-12 Months',
        '5': '9-12 Months',
        '6': '12-18 Months',
        '7': '18-24 Months',
        '8': '0-1 Years',
        '9': '1-2 Years',
        '10': '2-3 Years',
        '11': '3-4 Years',
        '12': '4-5 Years',
        '13': '5-6 Years',
        '14': '6-7 Years',
        '15': '7-8 Years',
        '16': '8-9 Years',
        '17': '9-10 Years',
        '18': '10-11 Years',
        '19': '11-12 Years',
        '20': '12-13 Years',
        '21': '13-14 Years',
        '22': '14-15 Years',
        '23': '15-16 Years',
        '24': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Skirts: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '24',
        '1': '26',
        '2': '28',
        '3': '30',
        '4': '32',
        '5': '34',
        '6': '36',
        '7': '38',
        '8': '40',
        '9': '42',
        '10': '44',
        '11': '46',
        '12': '48',
        '13': '50',
        '14': '52',
        '15': 'Free Size',
        '16': 'XS',
        '17': 'S',
        '18': 'M',
        '19': 'L',
        '20': 'XL',
        '21': 'XXL',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Clothing Sets': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '0-3 Months',
        '1': '0-6 Months',
        '2': '3-6 Months',
        '3': '6-9 Months',
        '4': '6-12 Months',
        '5': '9-12 Months',
        '6': '12-18 Months',
        '7': '18-24 Months',
        '8': '0-1 Years',
        '9': '1-2 Years',
        '10': '2-3 Years',
        '11': '3-4 Years',
        '12': '4-5 Years',
        '13': '5-6 Years',
        '14': '6-7 Years',
        '15': '7-8 Years',
        '16': '8-9 Years',
        '17': '9-10 Years',
        '18': '10-11 Years',
        '19': '11-12 Years',
        '20': '12-13 Years',
        '21': '13-14 Years',
        '22': '14-15 Years',
        '23': '15-16 Years',
        '24': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Belts: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '24',
        '1': '26',
        '2': '28',
        '3': '30',
        '4': '32',
        '5': '34',
        '6': '36',
        '7': '38',
        '8': '40',
        '9': '42',
        '10': '44',
        '11': '46',
        '12': '48',
        '13': '50',
        '14': '52',
        '15': 'Free Size',
        '16': 'XS',
        '17': 'S',
        '18': 'M',
        '19': 'L',
        '20': 'XL',
        '21': 'XXL',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: true,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: true,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Caps & Hats': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: true,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Kurtis, Tunics': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Sarees: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Ethnic Wear': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'XXS',
        '1': 'XS',
        '2': 'S',
        '3': 'M',
        '4': 'L',
        '5': 'XL',
        '6': 'XXL',
        '7': 'XXXL',
        '8': '4XL',
        '9': '5XL',
        '10': '6XL',
        '11': '7XL',
        '12': '8XL',
        '13': '9XL',
        '14': '10XL',
        '15': '0-3 Months',
        '16': '0-6 Months',
        '17': '3-6 Months',
        '18': '6-9 Months',
        '19': '6-12 Months',
        '20': '9-12 Months',
        '21': '12-18 Months',
        '22': '18-24 Months',
        '23': '0-1 Years',
        '24': '1-2 Years',
        '25': '2-3 Years',
        '26': '3-4 Years',
        '27': '4-5 Years',
        '28': '5-6 Years',
        '29': '6-7 Years',
        '30': '7-8 Years',
        '31': '8-9 Years',
        '32': '9-10 Years',
        '33': '10-11 Years',
        '34': '11-12 Years',
        '35': '12-13 Years',
        '36': '13-14 Years',
        '37': '14-15 Years',
        '38': '15-16 Years',
        '39': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Palazzos: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '24',
        '1': '26',
        '2': '28',
        '3': '30',
        '4': '32',
        '5': '34',
        '6': '36',
        '7': '38',
        '8': '40',
        '9': '42',
        '10': '44',
        '11': '46',
        '12': '48',
        '13': '50',
        '14': '52',
        '15': 'Free Size',
        '16': 'XS',
        '17': 'S',
        '18': 'M',
        '19': 'L',
        '20': 'XL',
        '21': 'XXL',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Dress Materials': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Lehenga Cholis': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Semi Stitched',
        '1': 'Un Stitched',
        '2': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Dupattas & Shawls': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Burqas & Hijabs': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Blouses: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '26',
        '1': '26 Alterable',
        '2': '28',
        '3': '28 Alterable',
        '4': '30',
        '5': '30 Alterable',
        '6': '32',
        '7': '32 Alterable',
        '8': '34',
        '9': '34 Alterable',
        '10': '36',
        '11': '36 Alterable',
        '12': '38',
        '13': '38 Alterable',
        '14': '40',
        '15': '40 Alterable',
        '16': '42',
        '17': '42 Alterable',
        '18': '44',
        '19': '44 Alterable',
        '20': '46',
        '21': '46 Alterable',
        '22': '48',
        '23': '48 Alterable',
        '24': '50',
        '25': '50 Alterable',
        '26': '52',
        '27': '52 Alterable',
        '28': '54',
        '29': '54 Alterable',
        '30': '56',
        '31': '56 Alterable',
        '32': '58',
        '33': '58 Alterable',
        '34': '60',
        '35': '60 Alterable',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Blouse Pieces': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '1 Mtr',
        '1': '1.75 Mtr',
        '2': '2.5 Mtr',
        '3': '2 Mtr',
        '4': '3 Mtr',
        '5': '4 Mtr',
        '6': '5 Mtr',
        '7': '6 Mtr',
        '8': '7 Mtr',
        '9': '8 Mtr',
        '10': '9 Mtr',
        '11': '10 Mtr',
        '12': '0.8 Mtr',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Briefs: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '70cm',
        '1': '75cm',
        '2': '80cm',
        '3': '85cm',
        '4': '90cm',
        '5': '95cm',
        '6': '100cm',
        '7': '105cm',
        '8': '110cm',
        '9': '115cm',
        '10': '120cm',
        '11': 'XXS',
        '12': 'XS',
        '13': 'S',
        '14': 'M',
        '15': 'L',
        '16': 'XL',
        '17': '2XL',
        '18': '3XL',
        '19': '4XL',
        '20': '28in',
        '21': '30in',
        '22': '32in',
        '23': '34in',
        '24': '36in',
        '25': '38in',
        '26': '40in',
        '27': '42in',
        '28': '44in',
        '29': '46in',
        '30': '5XL',
        '31': '6XL',
        '32': '7XL',
        '33': '8XL',
        '34': '9XL',
        '35': '10XL',
        '36': '28',
        '37': '30',
        '38': '32',
        '39': '34',
        '40': '36',
        '41': '38',
        '42': '40',
        '43': '42',
        '44': '44',
        '45': '46',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Boxers: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '24',
        '1': '26',
        '2': '28',
        '3': '30',
        '4': '32',
        '5': '34',
        '6': '36',
        '7': '38',
        '8': '40',
        '9': '42',
        '10': '44',
        '11': '46',
        '12': '48',
        '13': '50',
        '14': '52',
        '15': 'Free Size',
        '16': 'XS',
        '17': 'S',
        '18': 'M',
        '19': 'L',
        '20': 'XL',
        '21': 'XXL',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Vests: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '70cm',
        '1': '75cm',
        '2': '80cm',
        '3': '85cm',
        '4': '90cm',
        '5': '95cm',
        '6': '100cm',
        '7': '105cm',
        '8': '110cm',
        '9': '115cm',
        '10': '120cm',
        '11': 'XXS',
        '12': 'XS',
        '13': 'S',
        '14': 'M',
        '15': 'L',
        '16': 'XL',
        '17': '2XL',
        '18': '3XL',
        '19': '4XL',
        '20': '28in',
        '21': '30in',
        '22': '32in',
        '23': '34in',
        '24': '36in',
        '25': '38in',
        '26': '40in',
        '27': '42in',
        '28': '44in',
        '29': '46in',
        '30': '5XL',
        '31': '6XL',
        '32': '7XL',
        '33': '8XL',
        '34': '9XL',
        '35': '10XL',
        '36': '28',
        '37': '30',
        '38': '32',
        '39': '34',
        '40': '36',
        '41': '38',
        '42': '40',
        '43': '42',
        '44': '44',
        '45': '46',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Robes: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Night Suits': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Thermal Wear': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Swim Bottoms': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '24',
        '1': '26',
        '2': '28',
        '3': '30',
        '4': '32',
        '5': '34',
        '6': '36',
        '7': '38',
        '8': '40',
        '9': '42',
        '10': '44',
        '11': '46',
        '12': '48',
        '13': '50',
        '14': '52',
        '15': 'Free Size',
        '16': 'XS',
        '17': 'S',
        '18': 'M',
        '19': 'L',
        '20': 'XL',
        '21': 'XXL',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Swimwear: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Bra: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '28A',
        '1': '30A',
        '2': '32A',
        '3': '34A',
        '4': '36A',
        '5': '38A',
        '6': '40A',
        '7': '28B',
        '8': '30B',
        '9': '32B',
        '10': '34B',
        '11': '36B',
        '12': '38B',
        '13': '40B',
        '14': '42B',
        '15': '28C',
        '16': '30C',
        '17': '32C',
        '18': '34C',
        '19': '36C',
        '20': '38C',
        '21': '40C',
        '22': '28D',
        '23': '30D',
        '24': '32D',
        '25': '34D',
        '26': '36D',
        '27': '38D',
        '28': '40D',
        '29': '28E',
        '30': '30E',
        '31': '32E',
        '32': '34E',
        '33': '36E',
        '34': '38E',
        '35': '40E',
        '36': 'S',
        '37': 'M',
        '38': 'L',
        '39': 'XL',
        '40': 'XXL',
        '41': 'XXXL',
        '42': 'Free Size',
        '43': '42A',
        '44': '42C',
        '45': '42D',
        '46': '42E',
        '47': '44A',
        '48': '44B',
        '49': '44C',
        '50': '44D',
        '51': '44E',
        '52': '46A',
        '53': '46B',
        '54': '46C',
        '55': '46D',
        '56': '46E',
        '57': '48A',
        '58': '48B',
        '59': '48C',
        '60': '48D',
        '61': '48E',
        '62': '30DD',
        '63': '30F',
        '64': '30FF',
        '65': '32DD',
        '66': '32F',
        '67': '32FF',
        '68': '34DD',
        '69': '34F',
        '70': '34FF',
        '71': '40AA',
        '72': '40DD',
        '73': '40DDD',
        '74': '40EE',
        '75': '40F',
        '76': '40FF',
        '77': '40G',
        '78': '40GG',
        '79': '40H',
        '80': '40I',
        '81': '40J',
        '82': '40K',
        '83': '42EE',
        '84': '42F',
        '85': '42FF',
        '86': '42G',
        '87': '42GG',
        '88': '42H',
        '89': '42I',
        '90': '42J',
        '91': '42K',
        '92': '44AA',
        '93': '44DD',
        '94': '44DDD',
        '95': '44EE',
        '96': '44F',
        '97': '44FF',
        '98': '44G',
        '99': '44GG',
        '100': '44H',
        '101': '44I',
        '102': '44J',
        '103': '44K',
        '104': '46AA',
        '105': '46DD',
        '106': '46DDD',
        '107': '46EE',
        '108': '46F',
        '109': '46FF',
        '110': '46G',
        '111': '46GG',
        '112': '46H',
        '113': '46I',
        '114': '46J',
        '115': '46K',
        '116': '48AA',
        '117': '48DD',
        '118': '48DDD',
        '119': '48EE',
        '120': '48F',
        '121': '48FF',
        '122': '48G',
        '123': '48GG',
        '124': '48H',
        '125': '48I',
        '126': '48J',
        '127': '48K',
        '128': '50A',
        '129': '50AA',
        '130': '50B',
        '131': '50C',
        '132': '50D',
        '133': '50DD',
        '134': '50DDD',
        '135': '50E',
        '136': '50EE',
        '137': '50F',
        '138': '50FF',
        '139': '50G',
        '140': '50GG',
        '141': '50H',
        '142': '50I',
        '143': '50J',
        '144': '50K',
        '145': '52A',
        '146': '52AA',
        '147': '52B',
        '148': '52C',
        '149': '52D',
        '150': '52DD',
        '151': '52DDD',
        '152': '52E',
        '153': '52EE',
        '154': '52F',
        '155': '52FF',
        '156': '52G',
        '157': '52GG',
        '158': '52H',
        '159': '52I',
        '160': '52J',
        '161': '52K',
        '162': '54A',
        '163': '54AA',
        '164': '54B',
        '165': '54C',
        '166': '54D',
        '167': '54DD',
        '168': '54DDD',
        '169': '54E',
        '170': '54EE',
        '171': '54F',
        '172': '54FF',
        '173': '54G',
        '174': '54GG',
        '175': '54H',
        '176': '54I',
        '177': '54J',
        '178': '54K',
        '179': 'XS',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Shapewear: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Sleepwear & Loungewear': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '24',
        '1': '26',
        '2': '28',
        '3': '30',
        '4': '32',
        '5': '34',
        '6': '36',
        '7': '38',
        '8': '40',
        '9': '42',
        '10': '44',
        '11': '46',
        '12': '48',
        '13': '50',
        '14': '52',
        '15': 'Free Size',
        '16': 'XS',
        '17': 'S',
        '18': 'M',
        '19': 'L',
        '20': 'XL',
        '21': 'XXL',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Camisoles: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Lingerie Sets & Accessories': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '28A',
        '1': '30A',
        '2': '32A',
        '3': '34A',
        '4': '36A',
        '5': '38A',
        '6': '40A',
        '7': '28B',
        '8': '30B',
        '9': '32B',
        '10': '34B',
        '11': '36B',
        '12': '38B',
        '13': '40B',
        '14': '42B',
        '15': '28C',
        '16': '30C',
        '17': '32C',
        '18': '34C',
        '19': '36C',
        '20': '38C',
        '21': '40C',
        '22': '28D',
        '23': '30D',
        '24': '32D',
        '25': '34D',
        '26': '36D',
        '27': '38D',
        '28': '40D',
        '29': '28E',
        '30': '30E',
        '31': '32E',
        '32': '34E',
        '33': '36E',
        '34': '38E',
        '35': '40E',
        '36': 'S',
        '37': 'M',
        '38': 'L',
        '39': 'XL',
        '40': 'XXL',
        '41': 'XXXL',
        '42': 'Free Size',
        '43': '42A',
        '44': '42C',
        '45': '42D',
        '46': '42E',
        '47': '44A',
        '48': '44B',
        '49': '44C',
        '50': '44D',
        '51': '44E',
        '52': '46A',
        '53': '46B',
        '54': '46C',
        '55': '46D',
        '56': '46E',
        '57': '48A',
        '58': '48B',
        '59': '48C',
        '60': '48D',
        '61': '48E',
        '62': '30DD',
        '63': '30F',
        '64': '30FF',
        '65': '32DD',
        '66': '32F',
        '67': '32FF',
        '68': '34DD',
        '69': '34F',
        '70': '34FF',
        '71': '40AA',
        '72': '40DD',
        '73': '40DDD',
        '74': '40EE',
        '75': '40F',
        '76': '40FF',
        '77': '40G',
        '78': '40GG',
        '79': '40H',
        '80': '40I',
        '81': '40J',
        '82': '40K',
        '83': '42EE',
        '84': '42F',
        '85': '42FF',
        '86': '42G',
        '87': '42GG',
        '88': '42H',
        '89': '42I',
        '90': '42J',
        '91': '42K',
        '92': '44AA',
        '93': '44DD',
        '94': '44DDD',
        '95': '44EE',
        '96': '44F',
        '97': '44FF',
        '98': '44G',
        '99': '44GG',
        '100': '44H',
        '101': '44I',
        '102': '44J',
        '103': '44K',
        '104': '46AA',
        '105': '46DD',
        '106': '46DDD',
        '107': '46EE',
        '108': '46F',
        '109': '46FF',
        '110': '46G',
        '111': '46GG',
        '112': '46H',
        '113': '46I',
        '114': '46J',
        '115': '46K',
        '116': '48AA',
        '117': '48DD',
        '118': '48DDD',
        '119': '48EE',
        '120': '48F',
        '121': '48FF',
        '122': '48G',
        '123': '48GG',
        '124': '48H',
        '125': '48I',
        '126': '48J',
        '127': '48K',
        '128': '50A',
        '129': '50AA',
        '130': '50B',
        '131': '50C',
        '132': '50D',
        '133': '50DD',
        '134': '50DDD',
        '135': '50E',
        '136': '50EE',
        '137': '50F',
        '138': '50FF',
        '139': '50G',
        '140': '50GG',
        '141': '50H',
        '142': '50I',
        '143': '50J',
        '144': '50K',
        '145': '52A',
        '146': '52AA',
        '147': '52B',
        '148': '52C',
        '149': '52D',
        '150': '52DD',
        '151': '52DDD',
        '152': '52E',
        '153': '52EE',
        '154': '52F',
        '155': '52FF',
        '156': '52G',
        '157': '52GG',
        '158': '52H',
        '159': '52I',
        '160': '52J',
        '161': '52K',
        '162': '54A',
        '163': '54AA',
        '164': '54B',
        '165': '54C',
        '166': '54D',
        '167': '54DD',
        '168': '54DDD',
        '169': '54E',
        '170': '54EE',
        '171': '54F',
        '172': '54FF',
        '173': '54G',
        '174': '54GG',
        '175': '54H',
        '176': '54I',
        '177': '54J',
        '178': '54K',
        '179': 'XS',
        '180': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Bath Robes': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Towels: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Pyjamas: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Party Wear': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Innerwear & Sleepwear': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '0-3 Months',
        '1': '0-6 Months',
        '2': '3-6 Months',
        '3': '6-9 Months',
        '4': '6-12 Months',
        '5': '9-12 Months',
        '6': '12-18 Months',
        '7': '18-24 Months',
        '8': '0-1 Years',
        '9': '1-2 Years',
        '10': '2-3 Years',
        '11': '3-4 Years',
        '12': '4-5 Years',
        '13': '5-6 Years',
        '14': '6-7 Years',
        '15': '7-8 Years',
        '16': '8-9 Years',
        '17': '9-10 Years',
        '18': '10-11 Years',
        '19': '11-12 Years',
        '20': '12-13 Years',
        '21': '13-14 Years',
        '22': '14-15 Years',
        '23': '15-16 Years',
        '24': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Nightwear & Loungewear': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Watches: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: true,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: true,
      value: [],
    },
    display: {
      mandatory: true,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: true,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Gloves: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Socks: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Stockings: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Laces: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Free Size',
      },
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Soles & Charms': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Shoe Racks & Organisers': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Shoe Care - Accessories': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Flip-Flops & Flats': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'IND-2',
        '1': 'IND-3',
        '2': 'IND-4',
        '3': 'IND-5',
        '4': 'IND-6',
        '5': 'IND-7',
        '6': 'IND-8',
        '7': 'IND-9',
        '8': 'IND-10',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Sandals & Floaters': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'IND-2',
        '1': 'IND-3',
        '2': 'IND-4',
        '3': 'IND-5',
        '4': 'IND-6',
        '5': 'IND-7',
        '6': 'IND-8',
        '7': 'IND-9',
        '8': 'IND-10',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Backpacks: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Handbags: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Trolley, Luggage & Suitcases': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Formal Shoes': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'IND-5',
        '1': 'IND-6',
        '2': 'IND-7',
        '3': 'IND-8',
        '4': 'IND-9',
        '5': 'IND-10',
        '6': 'IND-11',
        '7': 'IND-12',
        '8': 'IND-13',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Casual Shoes': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'IND-5',
        '1': 'IND-6',
        '2': 'IND-7',
        '3': 'IND-8',
        '4': 'IND-9',
        '5': 'IND-10',
        '6': 'IND-11',
        '7': 'IND-12',
        '8': 'IND-13',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Sports Shoes': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'IND-5',
        '1': 'IND-6',
        '2': 'IND-7',
        '3': 'IND-8',
        '4': 'IND-9',
        '5': 'IND-10',
        '6': 'IND-11',
        '7': 'IND-12',
        '8': 'IND-13',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: true,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Outdoor Shoes': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'IND-5',
        '1': 'IND-6',
        '2': 'IND-7',
        '3': 'IND-8',
        '4': 'IND-9',
        '5': 'IND-10',
        '6': 'IND-11',
        '7': 'IND-12',
        '8': 'IND-13',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Work & Safety Shoes': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'IND-5',
        '1': 'IND-6',
        '2': 'IND-7',
        '3': 'IND-8',
        '4': 'IND-9',
        '5': 'IND-10',
        '6': 'IND-11',
        '7': 'IND-12',
        '8': 'IND-13',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Ethnic Shoes': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'IND-5',
        '1': 'IND-6',
        '2': 'IND-7',
        '3': 'IND-8',
        '4': 'IND-9',
        '5': 'IND-10',
        '6': 'IND-11',
        '7': 'IND-12',
        '8': 'IND-13',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Boots: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'IND-5',
        '1': 'IND-6',
        '2': 'IND-7',
        '3': 'IND-8',
        '4': 'IND-9',
        '5': 'IND-10',
        '6': 'IND-11',
        '7': 'IND-12',
        '8': 'IND-13',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Heels: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'IND-2',
        '1': 'IND-3',
        '2': 'IND-4',
        '3': 'IND-5',
        '4': 'IND-6',
        '5': 'IND-7',
        '6': 'IND-8',
        '7': 'IND-9',
        '8': 'IND-10',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: '/^https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]$/'},
    fabric: {
      mandatory: true,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Contact Lenses': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Eye Glasses': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Eye Glass Frames': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Sunglasses: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Contact Lens Cases': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Contact Lens Solutions': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Contact Lens Tweezers': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Eyeglasses Pouches & Cases': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Microfiber Wipes': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Eyewear Slings': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: SIZE,
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Bracelets: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: true,
      value: BASE_METAL,
    },
    plating: {
      mandatory: true,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Chains: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: true,
      value: BASE_METAL,
    },
    plating: {
      mandatory: true,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Mangalsutra: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: true,
      value: BASE_METAL,
    },
    plating: {
      mandatory: true,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Anklets: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: true,
      value: BASE_METAL,
    },
    plating: {
      mandatory: true,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Bangles & Bracelets': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '2.2',
        '1': '2.3',
        '2': '2.4',
        '3': '2.5',
        '4': '2.6',
        '5': '2.8',
        '6': '2.10',
        '7': 'Free Size',
        '8': '2.12',
        '9': '2.14',
        '10': '3',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    plating: {
      mandatory: false,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Necklaces: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: true,
      value: BASE_METAL,
    },
    plating: {
      mandatory: true,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Earrings: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: true,
      value: BASE_METAL,
    },
    plating: {
      mandatory: true,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Jewellery Sets': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: true,
      value: BASE_METAL,
    },
    plating: {
      mandatory: true,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Nosepins & Noserings': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: true,
      value: BASE_METAL,
    },
    plating: {
      mandatory: true,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Pendants: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: true,
      value: BASE_METAL,
    },
    plating: {
      mandatory: true,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Rings: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': '16',
        '1': '17',
        '2': '18',
        '3': '19',
        '4': '20',
        '5': '21',
        '6': '22',
        '7': '23',
        '8': '24',
        '9': '25',
        '10': '7',
        '11': '8',
        '12': '9',
        '13': '10',
        '14': '11',
        '15': '12',
        '16': '13',
        '17': '14',
        '18': '15',
        '19': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: true,
      value: BASE_METAL,
    },
    plating: {
      mandatory: true,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Toe Rings': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: true,
      value: BASE_METAL,
    },
    plating: {
      mandatory: true,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Gold Coins': {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: true,
      value: BASE_METAL,
    },
    plating: {
      mandatory: true,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Brooch: {
    gender: {
      mandatory: true,
      value: GENDER,
    },
    colour: {
      mandatory: true,
      value: '/^#([a-fA-F0-9]{6})/',
    },
    size: {
      mandatory: true,
      value: {
        '0': 'Free Size',
      },
    },
    brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    fabric: {
      mandatory: false,
      value: FABRIC,
    },
    strap_material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    water_resistant: {
      mandatory: false,
      value: [],
    },
    display: {
      mandatory: false,
      value: DISPLAY,
    },
    glass_material: {
      mandatory: false,
      value: [],
    },
    colour_name: {
      mandatory: true,
      value: '/^[a-z ]+$/',
},
    sport_type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    base_metal: {
      mandatory: true,
      value: BASE_METAL,
    },
    plating: {
      mandatory: true,
      value: PLATING,
    },
    care_instructions: {
      mandatory: false,
      value: [],
    },
    wash_type: {
      mandatory: false,
      value: WASH_TYPE,
    },
    weight: {
      mandatory: false,
      value: [],
    },
    length: {
      mandatory: false,
      value: [],
    },
    breadth: {
      mandatory: false,
      value: [],
    },
    height: {
      mandatory: false,
      value: [],
    },
    features: {
      mandatory: false,
      value: FEATURES,
    },
    fabric_finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    material: {
      mandatory: false,
      value: MATERIAL,
    },
    material_finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    pattern: {
      mandatory: false,
      value: PATTERN,
    },
    occasion: {
      mandatory: false,
      value: OCCASION,
    },
    season: {
      mandatory: false,
      value: SEASON,
    },
    trend: {
      mandatory: false,
      value: TREND,
    },
    fit: {
      mandatory: false,
      value: FIT,
    },
    collar: {
      mandatory: false,
      value: COLLAR,
    },
    neck: {
      mandatory: false,
      value: NECK,
    },
    bundles: {
      mandatory: false,
      value: [],
    },
    max_sale_quantity: {
      mandatory: false,
      value: [],
    },
    hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    lining: {
      mandatory: false,
      value: [],
    },
    num_pockets: {
      mandatory: false,
      value: [],
    },
    reversible: {
      mandatory: false,
      value: [],
    },
    bottom_type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    top_type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    front_styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    sleeve_length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    sweatshirt_type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    fragile: {
      mandatory: false,
      value: [],
    },
    liquid: {
      mandatory: false,
      value: [],
    },
    hazardous: {
      mandatory: false,
      value: [],
    },
    power_type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    battery_life: {
      mandatory: false,
      value: [],
    },
    bluetooth: {
      mandatory: false,
      value: [],
    },
    call_function: {
      mandatory: false,
      value: [],
    },
    heart_rate_monitor: {
      mandatory: false,
      value: [],
    },
    pedometer: {
      mandatory: false,
      value: [],
    },
    sleep_monitor: {
      mandatory: false,
      value: [],
    },
    spo2_monitor: {
      mandatory: false,
      value: [],
    },
    warranty: {
      mandatory: false,
      value: [],
    },
    buckle_material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    buckle_type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    waist_rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    socks_length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    footwear_type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    insole: {
      mandatory: false,
      value: INSOLE,
    },
    sole_material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    toe_shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    fasten_type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    backpack_style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    closure_type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    stone_type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    gem_type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    dial_shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    frame_type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    frame_shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    frame_colour: {
      mandatory: false,
      value: [],
    },
    frame_size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    frame_material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    frame_style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    face_shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    lens_material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    lens_colour: {
      mandatory: false,
      value: [],
    },
    laptop_compartment: {
      mandatory: false,
      value: [],
    },
    strap_type: {
      mandatory: false,
      value: [],
    },
    volume: {
      mandatory: false,
      value: [],
    },
    lock_type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    padding: {
      mandatory: false,
      value: PADDING,
    },
    seam: {
      mandatory: false,
      value: SEAM,
    },
    waist_band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    sustainability: {
      mandatory: false,
      value: [],
    },
    handcrafted: {
      mandatory: false,
      value: [],
    },
    craftmark: {
      mandatory: false,
      value: [],
    },
  },
}
