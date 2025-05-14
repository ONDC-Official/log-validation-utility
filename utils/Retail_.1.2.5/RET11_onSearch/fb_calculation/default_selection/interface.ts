interface TreeNode {
  id?: string;
  is_base_item: boolean;
  base_item?: {
    item_id: string;
    item_value: number;
    item_maximum_value: number;
    default_selection?: {
      min: number;
      max: number;
    };
    range: {
      lower: number;
      upper: number;
    };
  };

  custom_item?: {
    custom_group_id: string;
    customization_id: string;
    value: number;
    maximum_value: number;
    config: {
      min: number;
      max: number;
    };
    default_select: boolean;
  };

  custom_groups?: Array<string>;

  children?: TreeNode[];
}

type CustomGroup = {
  id: string;
  name: string;
  type: string;
  config: {
    min: string;
    max: string;
    seq: string;
  };
};

interface CustomItem {
  custom_group_id: string;
  customization_id: string;
}

interface ItemNode {
  is_base_item: boolean;
  custom_item?: CustomItem;
  custom_groups: string[];
  children: ItemNode[];
}

export { CustomGroup, TreeNode, CustomItem, ItemNode };
