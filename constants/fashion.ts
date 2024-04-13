import {
  BACKPACK_STYLE,
  BASE_METAL,
  BOTTOM_TYPE,
  BUCKLE_MATERIAL,
  BUCKLE_TYPE,
  CLOSURE_TYPE,
  COLLAR,
  COLOUR,
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
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'T Shirts': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Sweatshirts: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Kurtas & Kurta Sets': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Jackets & Coats': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: [
        '0-3 Months',
        '0-6 Months',
        '3-6 Months',
        '6-9 Months',
        '6-12 Months',
        '9-12 Months',
        '12-18 Months',
        '18-24 Months',
        '0-1 Years',
        '1-2 Years',
        '2-3 Years',
        '3-4 Years',
        '4-5 Years',
        '5-6 Years',
        '6-7 Years',
        '7-8 Years',
        '8-9 Years',
        '9-10 Years',
        '10-11 Years',
        '11-12 Years',
        '12-13 Years',
        '13-14 Years',
        '14-15 Years',
        '15-16 Years',
        'Free Size',
      ],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Sweaters: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: [
        '0-3 Months',
        '0-6 Months',
        '3-6 Months',
        '6-9 Months',
        '6-12 Months',
        '9-12 Months',
        '12-18 Months',
        '18-24 Months',
        '0-1 Years',
        '1-2 Years',
        '2-3 Years',
        '3-4 Years',
        '4-5 Years',
        '5-6 Years',
        '6-7 Years',
        '7-8 Years',
        '8-9 Years',
        '9-10 Years',
        '10-11 Years',
        '11-12 Years',
        '12-13 Years',
        '13-14 Years',
        '14-15 Years',
        '15-16 Years',
        'Free Size',
      ],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Suits: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Semi Stitched', 'Un Stitched', 'Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Sherwanis: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Track Shirts': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Track Suits': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: [
        '0-3 Months',
        '0-6 Months',
        '3-6 Months',
        '6-9 Months',
        '6-12 Months',
        '9-12 Months',
        '12-18 Months',
        '18-24 Months',
        '0-1 Years',
        '1-2 Years',
        '2-3 Years',
        '3-4 Years',
        '4-5 Years',
        '5-6 Years',
        '6-7 Years',
        '7-8 Years',
        '8-9 Years',
        '9-10 Years',
        '10-11 Years',
        '11-12 Years',
        '12-13 Years',
        '13-14 Years',
        '14-15 Years',
        '15-16 Years',
        'Free Size',
      ],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Unstitched Fabrics': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: [
        '0-3 Months',
        '0-6 Months',
        '3-6 Months',
        '6-9 Months',
        '6-12 Months',
        '9-12 Months',
        '12-18 Months',
        '18-24 Months',
        '0-1 Years',
        '1-2 Years',
        '2-3 Years',
        '3-4 Years',
        '4-5 Years',
        '5-6 Years',
        '6-7 Years',
        '7-8 Years',
        '8-9 Years',
        '9-10 Years',
        '10-11 Years',
        '11-12 Years',
        '12-13 Years',
        '13-14 Years',
        '14-15 Years',
        '15-16 Years',
        'Free Size',
      ],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Dresses: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Tops: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Trousers: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: [
        '24',
        '26',
        '28',
        '30',
        '32',
        '34',
        '36',
        '38',
        '40',
        '42',
        '44',
        '46',
        '48',
        '50',
        '52',
        'Free Size',
        'XS',
        'S',
        'M',
        'L',
        'XL',
        'XXL',
      ],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Capris: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: [
        '24',
        '26',
        '28',
        '30',
        '32',
        '34',
        '36',
        '38',
        '40',
        '42',
        '44',
        '46',
        '48',
        '50',
        '52',
        'Free Size',
        'XS',
        'S',
        'M',
        'L',
        'XL',
        'XXL',
      ],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Coordinates: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Playsuits: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Jumpsuits: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Shrugs & Blouses': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Blazers & Waistcoats': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Tights, Leggings & Jeggings': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: [
        '0-3 Months',
        '0-6 Months',
        '3-6 Months',
        '6-9 Months',
        '6-12 Months',
        '9-12 Months',
        '12-18 Months',
        '18-24 Months',
        '0-1 Years',
        '1-2 Years',
        '2-3 Years',
        '3-4 Years',
        '4-5 Years',
        '5-6 Years',
        '6-7 Years',
        '7-8 Years',
        '8-9 Years',
        '9-10 Years',
        '10-11 Years',
        '11-12 Years',
        '12-13 Years',
        '13-14 Years',
        '14-15 Years',
        '15-16 Years',
        'Free Size',
      ],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Track Pants': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: [
        '24',
        '26',
        '28',
        '30',
        '32',
        '34',
        '36',
        '38',
        '40',
        '42',
        '44',
        '46',
        '48',
        '50',
        '52',
        'Free Size',
        'XS',
        'S',
        'M',
        'L',
        'XL',
        'XXL',
      ],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Jeans: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: [
        '24',
        '26',
        '28',
        '30',
        '32',
        '34',
        '36',
        '38',
        '40',
        '42',
        '44',
        '46',
        '48',
        '50',
        '52',
        'Free Size',
        'XS',
        'S',
        'M',
        'L',
        'XL',
        'XXL',
      ],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Shorts: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: [
        '24',
        '26',
        '28',
        '30',
        '32',
        '34',
        '36',
        '38',
        '40',
        '42',
        '44',
        '46',
        '48',
        '50',
        '52',
        'Free Size',
        'XS',
        'S',
        'M',
        'L',
        'XL',
        'XXL',
      ],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Joggers: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: [
        '0-3 Months',
        '0-6 Months',
        '3-6 Months',
        '6-9 Months',
        '6-12 Months',
        '9-12 Months',
        '12-18 Months',
        '18-24 Months',
        '0-1 Years',
        '1-2 Years',
        '2-3 Years',
        '3-4 Years',
        '4-5 Years',
        '5-6 Years',
        '6-7 Years',
        '7-8 Years',
        '8-9 Years',
        '9-10 Years',
        '10-11 Years',
        '11-12 Years',
        '12-13 Years',
        '13-14 Years',
        '14-15 Years',
        '15-16 Years',
        'Free Size',
      ],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Dhotis & Dhoti Pants': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: [
        '0-3 Months',
        '0-6 Months',
        '3-6 Months',
        '6-9 Months',
        '6-12 Months',
        '9-12 Months',
        '12-18 Months',
        '18-24 Months',
        '0-1 Years',
        '1-2 Years',
        '2-3 Years',
        '3-4 Years',
        '4-5 Years',
        '5-6 Years',
        '6-7 Years',
        '7-8 Years',
        '8-9 Years',
        '9-10 Years',
        '10-11 Years',
        '11-12 Years',
        '12-13 Years',
        '13-14 Years',
        '14-15 Years',
        '15-16 Years',
        'Free Size',
      ],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Churidars: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: [
        '24',
        '26',
        '28',
        '30',
        '32',
        '34',
        '36',
        '38',
        '40',
        '42',
        '44',
        '46',
        '48',
        '50',
        '52',
        'Free Size',
        'XS',
        'S',
        'M',
        'L',
        'XL',
        'XXL',
      ],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Salwars: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Dungarees & Jumpsuits': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: [
        '0-3 Months',
        '0-6 Months',
        '3-6 Months',
        '6-9 Months',
        '6-12 Months',
        '9-12 Months',
        '12-18 Months',
        '18-24 Months',
        '0-1 Years',
        '1-2 Years',
        '2-3 Years',
        '3-4 Years',
        '4-5 Years',
        '5-6 Years',
        '6-7 Years',
        '7-8 Years',
        '8-9 Years',
        '9-10 Years',
        '10-11 Years',
        '11-12 Years',
        '12-13 Years',
        '13-14 Years',
        '14-15 Years',
        '15-16 Years',
        'Free Size',
      ],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Skirts: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: [
        '24',
        '26',
        '28',
        '30',
        '32',
        '34',
        '36',
        '38',
        '40',
        '42',
        '44',
        '46',
        '48',
        '50',
        '52',
        'Free Size',
        'XS',
        'S',
        'M',
        'L',
        'XL',
        'XXL',
      ],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Clothing Sets': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: [
        '0-3 Months',
        '0-6 Months',
        '3-6 Months',
        '6-9 Months',
        '6-12 Months',
        '9-12 Months',
        '12-18 Months',
        '18-24 Months',
        '0-1 Years',
        '1-2 Years',
        '2-3 Years',
        '3-4 Years',
        '4-5 Years',
        '5-6 Years',
        '6-7 Years',
        '7-8 Years',
        '8-9 Years',
        '9-10 Years',
        '10-11 Years',
        '11-12 Years',
        '12-13 Years',
        '13-14 Years',
        '14-15 Years',
        '15-16 Years',
        'Free Size',
      ],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Belts: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: [
        '24',
        '26',
        '28',
        '30',
        '32',
        '34',
        '36',
        '38',
        '40',
        '42',
        '44',
        '46',
        '48',
        '50',
        '52',
        'Free Size',
        'XS',
        'S',
        'M',
        'L',
        'XL',
        'XXL',
      ],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: true,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: true,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Caps & Hats': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: true,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Kurtis, Tunics': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Sarees: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Ethnic Wear': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: [
        'XXS',
        'XS',
        'S',
        'M',
        'L',
        'XL',
        'XXL',
        'XXXL',
        '4XL',
        '5XL',
        '6XL',
        '7XL',
        '8XL',
        '9XL',
        '10XL',
        '0-3 Months',
        '0-6 Months',
        '3-6 Months',
        '6-9 Months',
        '6-12 Months',
        '9-12 Months',
        '12-18 Months',
        '18-24 Months',
        '0-1 Years',
        '1-2 Years',
        '2-3 Years',
        '3-4 Years',
        '4-5 Years',
        '5-6 Years',
        '6-7 Years',
        '7-8 Years',
        '8-9 Years',
        '9-10 Years',
        '10-11 Years',
        '11-12 Years',
        '12-13 Years',
        '13-14 Years',
        '14-15 Years',
        '15-16 Years',
        'Free Size',
      ],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Palazzos: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: [
        '24',
        '26',
        '28',
        '30',
        '32',
        '34',
        '36',
        '38',
        '40',
        '42',
        '44',
        '46',
        '48',
        '50',
        '52',
        'Free Size',
        'XS',
        'S',
        'M',
        'L',
        'XL',
        'XXL',
      ],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Dress Materials': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Lehenga Cholis': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Semi Stitched', 'Un Stitched', 'Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Dupattas & Shawls': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Burqas & Hijabs': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Blouses: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: [
        '26',
        '26 Alterable',
        '28',
        '28 Alterable',
        '30',
        '30 Alterable',
        '32',
        '32 Alterable',
        '34',
        '34 Alterable',
        '36',
        '36 Alterable',
        '38',
        '38 Alterable',
        '40',
        '40 Alterable',
        '42',
        '42 Alterable',
        '44',
        '44 Alterable',
        '46',
        '46 Alterable',
        '48',
        '48 Alterable',
        '50',
        '50 Alterable',
        '52',
        '52 Alterable',
        '54',
        '54 Alterable',
        '56',
        '56 Alterable',
        '58',
        '58 Alterable',
        '60',
        '60 Alterable',
      ],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Blouse Pieces': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: [
        '1 Mtr',
        '1.75 Mtr',
        '2.5 Mtr',
        '2 Mtr',
        '3 Mtr',
        '4 Mtr',
        '5 Mtr',
        '6 Mtr',
        '7 Mtr',
        '8 Mtr',
        '9 Mtr',
        '10 Mtr',
        '0.8 Mtr',
      ],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Briefs: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: [
        '70cm',
        '75cm',
        '80cm',
        '85cm',
        '90cm',
        '95cm',
        '100cm',
        '105cm',
        '110cm',
        '115cm',
        '120cm',
        'XXS',
        'XS',
        'S',
        'M',
        'L',
        'XL',
        '2XL',
        '3XL',
        '4XL',
        '28in',
        '30in',
        '32in',
        '34in',
        '36in',
        '38in',
        '40in',
        '42in',
        '44in',
        '46in',
        '5XL',
        '6XL',
        '7XL',
        '8XL',
        '9XL',
        '10XL',
        '28',
        '30',
        '32',
        '34',
        '36',
        '38',
        '40',
        '42',
        '44',
        '46',
      ],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Boxers: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: [
        '24',
        '26',
        '28',
        '30',
        '32',
        '34',
        '36',
        '38',
        '40',
        '42',
        '44',
        '46',
        '48',
        '50',
        '52',
        'Free Size',
        'XS',
        'S',
        'M',
        'L',
        'XL',
        'XXL',
      ],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Vests: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: [
        '70cm',
        '75cm',
        '80cm',
        '85cm',
        '90cm',
        '95cm',
        '100cm',
        '105cm',
        '110cm',
        '115cm',
        '120cm',
        'XXS',
        'XS',
        'S',
        'M',
        'L',
        'XL',
        '2XL',
        '3XL',
        '4XL',
        '28in',
        '30in',
        '32in',
        '34in',
        '36in',
        '38in',
        '40in',
        '42in',
        '44in',
        '46in',
        '5XL',
        '6XL',
        '7XL',
        '8XL',
        '9XL',
        '10XL',
        '28',
        '30',
        '32',
        '34',
        '36',
        '38',
        '40',
        '42',
        '44',
        '46',
      ],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Robes: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Night Suits': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Thermal Wear': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Swim Bottoms': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: [
        '24',
        '26',
        '28',
        '30',
        '32',
        '34',
        '36',
        '38',
        '40',
        '42',
        '44',
        '46',
        '48',
        '50',
        '52',
        'Free Size',
        'XS',
        'S',
        'M',
        'L',
        'XL',
        'XXL',
      ],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Swimwear: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Bra: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: [
        '28A',
        '30A',
        '32A',
        '34A',
        '36A',
        '38A',
        '40A',
        '28B',
        '30B',
        '32B',
        '34B',
        '36B',
        '38B',
        '40B',
        '42B',
        '28C',
        '30C',
        '32C',
        '34C',
        '36C',
        '38C',
        '40C',
        '28D',
        '30D',
        '32D',
        '34D',
        '36D',
        '38D',
        '40D',
        '28E',
        '30E',
        '32E',
        '34E',
        '36E',
        '38E',
        '40E',
        'S',
        'M',
        'L',
        'XL',
        'XXL',
        'XXXL',
        'Free Size',
        '42A',
        '42C',
        '42D',
        '42E',
        '44A',
        '44B',
        '44C',
        '44D',
        '44E',
        '46A',
        '46B',
        '46C',
        '46D',
        '46E',
        '48A',
        '48B',
        '48C',
        '48D',
        '48E',
        '30DD',
        '30F',
        '30FF',
        '32DD',
        '32F',
        '32FF',
        '34DD',
        '34F',
        '34FF',
        '40AA',
        '40DD',
        '40DDD',
        '40EE',
        '40F',
        '40FF',
        '40G',
        '40GG',
        '40H',
        '40I',
        '40J',
        '40K',
        '42EE',
        '42F',
        '42FF',
        '42G',
        '42GG',
        '42H',
        '42I',
        '42J',
        '42K',
        '44AA',
        '44DD',
        '44DDD',
        '44EE',
        '44F',
        '44FF',
        '44G',
        '44GG',
        '44H',
        '44I',
        '44J',
        '44K',
        '46AA',
        '46DD',
        '46DDD',
        '46EE',
        '46F',
        '46FF',
        '46G',
        '46GG',
        '46H',
        '46I',
        '46J',
        '46K',
        '48AA',
        '48DD',
        '48DDD',
        '48EE',
        '48F',
        '48FF',
        '48G',
        '48GG',
        '48H',
        '48I',
        '48J',
        '48K',
        '50A',
        '50AA',
        '50B',
        '50C',
        '50D',
        '50DD',
        '50DDD',
        '50E',
        '50EE',
        '50F',
        '50FF',
        '50G',
        '50GG',
        '50H',
        '50I',
        '50J',
        '50K',
        '52A',
        '52AA',
        '52B',
        '52C',
        '52D',
        '52DD',
        '52DDD',
        '52E',
        '52EE',
        '52F',
        '52FF',
        '52G',
        '52GG',
        '52H',
        '52I',
        '52J',
        '52K',
        '54A',
        '54AA',
        '54B',
        '54C',
        '54D',
        '54DD',
        '54DDD',
        '54E',
        '54EE',
        '54F',
        '54FF',
        '54G',
        '54GG',
        '54H',
        '54I',
        '54J',
        '54K',
        'XS',
      ],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Shapewear: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Sleepwear & Loungewear': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: [
        '24',
        '26',
        '28',
        '30',
        '32',
        '34',
        '36',
        '38',
        '40',
        '42',
        '44',
        '46',
        '48',
        '50',
        '52',
        'Free Size',
        'XS',
        'S',
        'M',
        'L',
        'XL',
        'XXL',
      ],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Camisoles: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Lingerie Sets & Accessories': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: [
        '28A',
        '30A',
        '32A',
        '34A',
        '36A',
        '38A',
        '40A',
        '28B',
        '30B',
        '32B',
        '34B',
        '36B',
        '38B',
        '40B',
        '42B',
        '28C',
        '30C',
        '32C',
        '34C',
        '36C',
        '38C',
        '40C',
        '28D',
        '30D',
        '32D',
        '34D',
        '36D',
        '38D',
        '40D',
        '28E',
        '30E',
        '32E',
        '34E',
        '36E',
        '38E',
        '40E',
        'S',
        'M',
        'L',
        'XL',
        'XXL',
        'XXXL',
        'Free Size',
        '42A',
        '42C',
        '42D',
        '42E',
        '44A',
        '44B',
        '44C',
        '44D',
        '44E',
        '46A',
        '46B',
        '46C',
        '46D',
        '46E',
        '48A',
        '48B',
        '48C',
        '48D',
        '48E',
        '30DD',
        '30F',
        '30FF',
        '32DD',
        '32F',
        '32FF',
        '34DD',
        '34F',
        '34FF',
        '40AA',
        '40DD',
        '40DDD',
        '40EE',
        '40F',
        '40FF',
        '40G',
        '40GG',
        '40H',
        '40I',
        '40J',
        '40K',
        '42EE',
        '42F',
        '42FF',
        '42G',
        '42GG',
        '42H',
        '42I',
        '42J',
        '42K',
        '44AA',
        '44DD',
        '44DDD',
        '44EE',
        '44F',
        '44FF',
        '44G',
        '44GG',
        '44H',
        '44I',
        '44J',
        '44K',
        '46AA',
        '46DD',
        '46DDD',
        '46EE',
        '46F',
        '46FF',
        '46G',
        '46GG',
        '46H',
        '46I',
        '46J',
        '46K',
        '48AA',
        '48DD',
        '48DDD',
        '48EE',
        '48F',
        '48FF',
        '48G',
        '48GG',
        '48H',
        '48I',
        '48J',
        '48K',
        '50A',
        '50AA',
        '50B',
        '50C',
        '50D',
        '50DD',
        '50DDD',
        '50E',
        '50EE',
        '50F',
        '50FF',
        '50G',
        '50GG',
        '50H',
        '50I',
        '50J',
        '50K',
        '52A',
        '52AA',
        '52B',
        '52C',
        '52D',
        '52DD',
        '52DDD',
        '52E',
        '52EE',
        '52F',
        '52FF',
        '52G',
        '52GG',
        '52H',
        '52I',
        '52J',
        '52K',
        '54A',
        '54AA',
        '54B',
        '54C',
        '54D',
        '54DD',
        '54DDD',
        '54E',
        '54EE',
        '54F',
        '54FF',
        '54G',
        '54GG',
        '54H',
        '54I',
        '54J',
        '54K',
        'XS',
        'Free Size',
      ],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Bath Robes': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Towels: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Pyjamas: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Party Wear': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Innerwear & Sleepwear': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: [
        '0-3 Months',
        '0-6 Months',
        '3-6 Months',
        '6-9 Months',
        '6-12 Months',
        '9-12 Months',
        '12-18 Months',
        '18-24 Months',
        '0-1 Years',
        '1-2 Years',
        '2-3 Years',
        '3-4 Years',
        '4-5 Years',
        '5-6 Years',
        '6-7 Years',
        '7-8 Years',
        '8-9 Years',
        '9-10 Years',
        '10-11 Years',
        '11-12 Years',
        '12-13 Years',
        '13-14 Years',
        '14-15 Years',
        '15-16 Years',
        'Free Size',
      ],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Nightwear & Loungewear': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Watches: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: true,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: true,
      value: [],
    },
    Display: {
      mandatory: true,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: true,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Gloves: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Socks: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Stockings: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Laces: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Free Size'],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Soles & Charms': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Shoe Racks & Organisers': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Shoe Care - Accessories': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Flip-Flops & Flats': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['IND-2', 'IND-3', 'IND-4', 'IND-5', 'IND-6', 'IND-7', 'IND-8', 'IND-9', 'IND-10'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Sandals & Floaters': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['IND-2', 'IND-3', 'IND-4', 'IND-5', 'IND-6', 'IND-7', 'IND-8', 'IND-9', 'IND-10'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Backpacks: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Handbags: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Trolley, Luggage & Suitcases': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Formal Shoes': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['IND-5', 'IND-6', 'IND-7', 'IND-8', 'IND-9', 'IND-10', 'IND-11', 'IND-12', 'IND-13'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Casual Shoes': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['IND-5', 'IND-6', 'IND-7', 'IND-8', 'IND-9', 'IND-10', 'IND-11', 'IND-12', 'IND-13'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Sports Shoes': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['IND-5', 'IND-6', 'IND-7', 'IND-8', 'IND-9', 'IND-10', 'IND-11', 'IND-12', 'IND-13'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: true,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Outdoor Shoes': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['IND-5', 'IND-6', 'IND-7', 'IND-8', 'IND-9', 'IND-10', 'IND-11', 'IND-12', 'IND-13'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Work & Safety Shoes': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['IND-5', 'IND-6', 'IND-7', 'IND-8', 'IND-9', 'IND-10', 'IND-11', 'IND-12', 'IND-13'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Ethnic Shoes': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['IND-5', 'IND-6', 'IND-7', 'IND-8', 'IND-9', 'IND-10', 'IND-11', 'IND-12', 'IND-13'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Boots: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['IND-5', 'IND-6', 'IND-7', 'IND-8', 'IND-9', 'IND-10', 'IND-11', 'IND-12', 'IND-13'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Heels: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['IND-2', 'IND-3', 'IND-4', 'IND-5', 'IND-6', 'IND-7', 'IND-8', 'IND-9', 'IND-10'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: true,
      value: [],
    },
    Fabric: {
      mandatory: true,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Contact Lenses': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Eye Glasses': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Eye Glass Frames': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Sunglasses: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Contact Lens Cases': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Contact Lens Solutions': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Contact Lens Tweezers': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Eyeglasses Pouches & Cases': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Microfiber Wipes': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Eyewear Slings': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: SIZE,
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Bracelets: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: true,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: true,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Chains: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: true,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: true,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Mangalsutra: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: true,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: true,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Anklets: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: true,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: true,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Bangles & Bracelets': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['2.2', '2.3', '2.4', '2.5', '2.6', '2.8', '2.10', 'Free Size', '2.12', '2.14', '3'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: false,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: false,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Necklaces: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: true,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: true,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Earrings: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: true,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: true,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Jewellery Sets': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: true,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: true,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Nosepins & Noserings': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: true,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: true,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Pendants: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: true,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: true,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Rings: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: [
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
        '24',
        '25',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        'Free Size',
      ],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: true,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: true,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Toe Rings': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: true,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: true,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  'Gold Coins': {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: true,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: true,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
  Brooch: {
    Gender: {
      mandatory: true,
      value: GENDER,
    },
    Colour: {
      mandatory: true,
      value: COLOUR,
    },
    Size: {
      mandatory: true,
      value: ['Free Size'],
    },
    Brand: {
      mandatory: true,
      value: [],
    },
    size_chart: {
      mandatory: false,
      value: [],
    },
    Fabric: {
      mandatory: false,
      value: FABRIC,
    },
    Strap_Material: {
      mandatory: false,
      value: STRAP_MATERIAL,
    },
    Water_Resistant: {
      mandatory: false,
      value: [],
    },
    Display: {
      mandatory: false,
      value: DISPLAY,
    },
    Glass_Material: {
      mandatory: false,
      value: [],
    },
    Colour_Name: {
      mandatory: false,
      value: [],
    },
    Sport_Type: {
      mandatory: false,
      value: SPORT_TYPE,
    },
    Base_Metal: {
      mandatory: true,
      value: BASE_METAL,
    },
    Plating: {
      mandatory: true,
      value: PLATING,
    },
    Care_Instructions: {
      mandatory: false,
      value: [],
    },
    Wash_Type: {
      mandatory: false,
      value: WASH_TYPE,
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
    Features: {
      mandatory: false,
      value: FEATURES,
    },
    Fabric_Finish: {
      mandatory: false,
      value: FABRIC_FINISH,
    },
    Material: {
      mandatory: false,
      value: MATERIAL,
    },
    Material_Finish: {
      mandatory: false,
      value: MATERIAL_FINISH,
    },
    Pattern: {
      mandatory: false,
      value: PATTERN,
    },
    Occasion: {
      mandatory: false,
      value: OCCASION,
    },
    Season: {
      mandatory: false,
      value: SEASON,
    },
    Trend: {
      mandatory: false,
      value: TREND,
    },
    Fit: {
      mandatory: false,
      value: FIT,
    },
    Collar: {
      mandatory: false,
      value: COLLAR,
    },
    Neck: {
      mandatory: false,
      value: NECK,
    },
    Bundles: {
      mandatory: false,
      value: [],
    },
    Max_Sale_Quantity: {
      mandatory: false,
      value: [],
    },
    Hemline: {
      mandatory: false,
      value: HEMLINE,
    },
    Lining: {
      mandatory: false,
      value: [],
    },
    Num_Pockets: {
      mandatory: false,
      value: [],
    },
    Reversible: {
      mandatory: false,
      value: [],
    },
    Bottom_Type: {
      mandatory: false,
      value: BOTTOM_TYPE,
    },
    Top_Type: {
      mandatory: false,
      value: TOP_TYPE,
    },
    Front_Styling: {
      mandatory: false,
      value: FRONT_STYLING,
    },
    Sleeve_Length: {
      mandatory: false,
      value: SLEEVE_LENGTH,
    },
    Sweatshirt_Type: {
      mandatory: false,
      value: SWEATSHIRT_TYPE,
    },
    Fragile: {
      mandatory: false,
      value: [],
    },
    Liquid: {
      mandatory: false,
      value: [],
    },
    Hazardous: {
      mandatory: false,
      value: [],
    },
    Power_Type: {
      mandatory: false,
      value: POWER_TYPE,
    },
    Battery_Life: {
      mandatory: false,
      value: [],
    },
    Bluetooth: {
      mandatory: false,
      value: [],
    },
    Call_Function: {
      mandatory: false,
      value: [],
    },
    Heart_Rate_Monitor: {
      mandatory: false,
      value: [],
    },
    Pedometer: {
      mandatory: false,
      value: [],
    },
    Sleep_Monitor: {
      mandatory: false,
      value: [],
    },
    SPO2_Monitor: {
      mandatory: false,
      value: [],
    },
    Warranty: {
      mandatory: false,
      value: [],
    },
    Buckle_Material: {
      mandatory: false,
      value: BUCKLE_MATERIAL,
    },
    Buckle_Type: {
      mandatory: false,
      value: BUCKLE_TYPE,
    },
    Waist_Rise: {
      mandatory: false,
      value: WAIST_RISE,
    },
    Socks_Length: {
      mandatory: false,
      value: SOCKS_LENGTH,
    },
    Footwear_Type: {
      mandatory: false,
      value: FOOTWEAR_TYPE,
    },
    Insole: {
      mandatory: false,
      value: INSOLE,
    },
    Sole_Material: {
      mandatory: false,
      value: SOLE_MATERIAL,
    },
    Toe_Shape: {
      mandatory: false,
      value: TOE_SHAPE,
    },
    Outsole: {
      mandatory: false,
      value: OUTSOLE,
    },
    Fasten_Type: {
      mandatory: false,
      value: FASTEN_TYPE,
    },
    Midsole: {
      mandatory: false,
      value: MIDSOLE,
    },
    Backpack_Style: {
      mandatory: false,
      value: BACKPACK_STYLE,
    },
    Closure_Type: {
      mandatory: false,
      value: CLOSURE_TYPE,
    },
    Stone_Type: {
      mandatory: false,
      value: STONE_TYPE,
    },
    Gem_Type: {
      mandatory: false,
      value: GEM_TYPE,
    },
    Dial_Shape: {
      mandatory: false,
      value: DIAL_SHAPE,
    },
    Frame_Type: {
      mandatory: false,
      value: FRAME_TYPE,
    },
    Frame_Shape: {
      mandatory: false,
      value: FRAME_SHAPE,
    },
    Frame_Colour: {
      mandatory: false,
      value: [],
    },
    Frame_Size: {
      mandatory: false,
      value: FRAME_SIZE,
    },
    Frame_Material: {
      mandatory: false,
      value: FRAME_MATERIAL,
    },
    Frame_Style: {
      mandatory: false,
      value: FRAME_STYLE,
    },
    Face_Shape: {
      mandatory: false,
      value: FACE_SHAPE,
    },
    Lens_Material: {
      mandatory: false,
      value: LENS_MATERIAL,
    },
    Lens_Colour: {
      mandatory: false,
      value: [],
    },
    Laptop_Compartment: {
      mandatory: false,
      value: [],
    },
    Strap_Type: {
      mandatory: false,
      value: [],
    },
    Volume: {
      mandatory: false,
      value: [],
    },
    Lock_Type: {
      mandatory: false,
      value: LOCK_TYPE,
    },
    Ornamentation: {
      mandatory: false,
      value: ORNAMENTATION,
    },
    Coverage: {
      mandatory: false,
      value: COVERAGE,
    },
    Padding: {
      mandatory: false,
      value: PADDING,
    },
    Seam: {
      mandatory: false,
      value: SEAM,
    },
    Waist_Band: {
      mandatory: false,
      value: WAIST_BAND,
    },
    Sustainability: {
      mandatory: false,
      value: [],
    },
    Handcrafted: {
      mandatory: false,
      value: [],
    },
    Craftmark: {
      mandatory: false,
      value: [],
    },
  },
}
