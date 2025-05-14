import { MenuItem, Customization, CustomGroupConfig } from './types';

export class PriceCalculator {
  constructor(
    private readonly menuItem: MenuItem,
    private readonly customizations: Customization[],
    private readonly groups: Map<string, CustomGroupConfig>
  ) {}

  calculatePriceRange(): { lower: number; upper: number } {
    return {
      lower: this.calculateBound('min'),
      upper: this.calculateBound('max')
    };
  }

  private calculateBound(boundType: 'min'|'max'): number {
    let total = this.menuItem.basePrice;
    const processedGroups = new Set<string>();

    const processGroup = (groupId: string): number => {
      if (processedGroups.has(groupId)) return 0;
      processedGroups.add(groupId);

      const groupConfig = this.groups.get(groupId);
      if (!groupConfig) return 0;

      const customizations = this.getGroupCustomizations(groupId);
      const sorted = this.sortCustomizations(customizations, boundType);
      const limit = boundType === 'min' ? groupConfig.min : groupConfig.max;
      const selections = sorted.slice(0, limit);

      return selections.reduce((sum, customization) => {
        // Add customization price
        sum += customization.price;
        
        // Process child groups
        sum += customization.childGroups.reduce((childSum, childGroupId) => {
          return childSum + processGroup(childGroupId);
        }, 0);
        
        return sum;
      }, 0);
    };

    // Process all item's custom groups
    this.menuItem.customGroups.forEach(groupId => {
      total += processGroup(groupId);
    });

    return total;
  }

  private getGroupCustomizations(groupId: string): Customization[] {
    return this.customizations.filter(c => c.parentGroupId === groupId);
  }

  private sortCustomizations(
    customizations: Customization[], 
    boundType: 'min'|'max'
  ): Customization[] {
    return [...customizations].sort((a, b) => 
      boundType === 'min' ? a.price - b.price : b.price - a.price
    );
  }}