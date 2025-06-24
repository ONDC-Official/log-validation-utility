import { Category, CustomGroupConfig, Customization, MenuItem, PriceRange } from './types'

export class CatalogParser {
  static parseCategories(rawCategories: any[]): Category[] {
    return rawCategories.map((category) => ({
      id: category.id,
      name: category.descriptor.name,
      type: this.determineCategoryType(category),
      config: this.extractCustomGroupConfig(category),
    }))
  }

  static parseMenuItems(rawItems: any[]): MenuItem[] {
    return rawItems
      .filter((item) => item.tags?.some((t: any) => t.list?.some((l: any) => l.code === 'type' && l.value === 'item')))
      .map((item) => ({
        id: item.id,
        basePrice: parseFloat(item.price.value),
        customGroups: this.extractCustomGroups(item),
        priceRange: this.parsePriceRange(item),
      }))
  }

  static parseCustomizations(rawItems: any[]): Customization[] {
    return rawItems
      .filter((item) =>
        item.tags?.some((t: any) => t.list?.some((l: any) => l.code === 'type' && l.value === 'customization')),
      )
      .map((item) => ({
        id: item.id,
        parentGroupId: this.extractParentGroupId(item),
        price: parseFloat(item.price.value),
        childGroups: this.extractChildGroups(item),
        isDefault: this.isDefaultSelection(item),
      }))
  }

  private static determineCategoryType(category: any): 'custom_group' | 'menu' {
    const typeTag = category.tags.find((t: any) => t.code === 'type')
    return typeTag?.list?.some((l: any) => l.value === 'custom_group') ? 'custom_group' : 'menu'
  }

  private static extractCustomGroupConfig(category: any): CustomGroupConfig | undefined {
    if (!category.tags) return undefined

    const configTag = category.tags.find((t: any) => t.code === 'config')
    if (!configTag) return undefined

    return {
      min: parseInt(configTag.list.find((l: any) => l.code === 'min')?.value || '0'),
      max: parseInt(configTag.list.find((l: any) => l.code === 'max')?.value || '0'),
      seq: parseInt(configTag.list.find((l: any) => l.code === 'seq')?.value || '0'),
      input: configTag.list.find((l: any) => l.code === 'input')?.value || 'select',
    }
  }

  private static extractCustomGroups(item: any): string[] {
    const groupTag = item.tags?.find((t: any) => t.code === 'custom_group')
    return groupTag?.list?.map((l: any) => l.value) || []
  }

  private static parsePriceRange(item: any): PriceRange | undefined {
    const rangeTag = item.price.tags?.find((t: any) => t.code === 'range')
    if (!rangeTag) return undefined

    return {
      lower: parseFloat(rangeTag.list.find((l: any) => l.code === 'lower')?.value),
      upper: parseFloat(rangeTag.list.find((l: any) => l.code === 'upper')?.value),
    }
  }

  public static extractLogsForItem(logs: string[], itemId: string): string[] {
    const extractedLogs: string[] = [];
    let capturing = false;
  
    logs.forEach((log) => {
      if (log.includes(`Processing item ${itemId}`)) {
        capturing = true;  // Start capturing logs for the item
      }
  
      if (capturing) {
        extractedLogs.push(log);  // Capture all logs related to the item
        
        // Stop capturing and exit if we encounter the "Final range" log for the item
        if (log.includes(`Final range for ${itemId}`)) {
          capturing = false;  // Stop capturing logs when "Final range" is reached
        }
      }
    });
  
    return extractedLogs;
  }

  private static extractParentGroupId(item: any): string {
    const parentTag = item.tags?.find((t: any) => t.code === 'parent')
    return parentTag?.list?.find((l: any) => l.code === 'id')?.value || ''
  }

  private static extractChildGroups(item: any): string[] {
    const childTag = item.tags?.find((t: any) => t.code === 'child')
    return childTag?.list?.map((l: any) => l.value) || []
  }

  private static isDefaultSelection(item: any): boolean {
    const parentTag = item.tags?.find((t: any) => t.code === 'parent')
    return parentTag?.list?.some((l: any) => l.code === 'default' && l.value === 'yes') || false
  }
}
