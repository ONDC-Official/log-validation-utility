import {
  MenuItem,
  Customization,
  Category,
  CustomGroupConfig,
  PriceRange,
} from "./types";

export class MenuTreeBuilder {
  private readonly customGroups: Map<string, CustomGroupConfig>;
  private readonly customizations: Map<string, Customization>;
  private debugEnabled = true; // Set to false to disable logs
  private logs: string[] = [];

  constructor(
    private readonly menuItems: MenuItem[],
    categories: Category[],
    customizations: Customization[]
  ) {
    this.customGroups = new Map(
      categories
        .filter((c) => c.type === "custom_group")
        .map((c) => [c.id, c.config!])
    );

    this.customizations = new Map(customizations.map((c) => [c.id, c]));
  }

  private debugLog(message: string) {
    if (this.debugEnabled) {
      const logMessage = `[DEBUG] ${message}`;
      this.logs.push(logMessage);
      console.log(logMessage);
    }
  }

  public getLogs(): string[] {
    return this.logs;
  }

  buildTrees(): { items: MenuItem[]; logs: string[] } {
    const items = this.menuItems.map((item) => {
      this.debugLog(`\n=== Processing item ${item.id} ===`);
      const result = {
        ...item,
        priceRangeGiven: {
          ...item.priceRange,
        },
        priceRange: this.calculatePriceRange(item),
      };
      this.debugLog(
        `Final range for ${item.id}: ₹${result.priceRange.lower} - ₹${result.priceRange.upper}`
      );
      return result;
    });
    return { items, logs: this.logs };
  }

  private calculatePriceRange(item: MenuItem): PriceRange {
    return {
      lower: this.calculateBound(item, "min"),
      upper: this.calculateBound(item, "max"),
    };
  }

  private calculateBound(item: MenuItem, boundType: "min" | "max"): number {
    let total = item.basePrice;
    const processedGroups = new Set<string>();

    this.debugLog(
      `\nCalculating ${boundType.toUpperCase()} bound for ${item.id}`
    );
    this.debugLog(`Base price: ₹${total}`);

    const processGroup = (groupId: string, depth = 0): number => {
      const indent = "  ".repeat(depth);
      if (processedGroups.has(groupId)) {
        this.debugLog(`${indent}Group ${groupId} already processed, skipping`);
        return 0;
      }
      processedGroups.add(groupId);

      const groupConfig = this.customGroups.get(groupId);
      if (!groupConfig) {
        this.debugLog(`${indent}No config found for group ${groupId}`);
        return 0;
      }

      this.debugLog(
        `${indent}Processing group ${groupId} (${groupConfig.min}-${groupConfig.max})`
      );

      const customizations = this.getGroupCustomizations(groupId);
      const sorted = this.sortCustomizations(customizations, boundType);

      this.debugLog(`${indent}Available customizations (${sorted.length}):`);
      sorted.forEach((c) =>
        this.debugLog(
          `${indent}- ${c.id}: ₹${c.price} ${
            c.childGroups.length > 0 ? `→ [${c.childGroups.join(", ")}]` : ""
          }`
        )
      );

      const limit = boundType === "min" ? groupConfig.min : groupConfig.max;
      const selections = sorted.slice(0, limit);

      this.debugLog(
        `${indent}Selecting ${selections.length} customization(s):`
      );
      selections.forEach((c) =>
        this.debugLog(`${indent}+ ${c.id} (₹${c.price})`)
      );

      return selections.reduce((sum, customization) => {
        const customizationTotal =
          customization.price +
          customization.childGroups.reduce(
            (childSum, childGroupId) =>
              childSum + processGroup(childGroupId, depth + 1),
            0
          );

        this.debugLog(
          `${indent}Customization ${customization.id} total: ₹${customizationTotal}`
        );
        return sum + customizationTotal;
      }, 0);
    };

    item.customGroups.forEach((groupId) => {
      const groupTotal = processGroup(groupId, 1);
      this.debugLog(`Group ${groupId} contribution: ₹${groupTotal}`);
      total += groupTotal;
    });

    this.debugLog(`Current total after all groups: ₹${total}`);
    return total;
  }

  private getGroupCustomizations(groupId: string): Customization[] {
    return Array.from(this.customizations.values()).filter(
      (c) => c.parentGroupId === groupId
    );
  }

  private sortCustomizations(
    customizations: Customization[],
    boundType: "min" | "max"
  ): Customization[] {
    // Pure price-based sorting without default consideration
    return [...customizations].sort((a, b) =>
      boundType === "min" ? a.price - b.price : b.price - a.price
    );
  }
}
