export interface PriceRange {
    lower: number;
    upper: number;
  }
  
  export interface CustomGroupConfig {
    min: number;
    max: number;
    seq: number;
    input: string;
  }
  
  export interface Customization {
    id: string;
    parentGroupId: string;
    price: number;
    childGroups: string[];
    isDefault: boolean;
  }
  
  export interface MenuItem {
    id: string;
    basePrice: number;
    customGroups: string[];
    priceRange?: PriceRange;
  }
  
  export interface CatalogData {
    categories: Category[];
    items: any[];
  }
  
  export interface Category {
    id: string;
    type: 'custom_group' | 'menu';
    config?: CustomGroupConfig;
    name: string;
  }