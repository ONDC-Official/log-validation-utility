import { TreeNode, CustomGroup } from './interface'

function getMinMaxById(groups: CustomGroup[], id: string): { min: string; max: string } | null {
  const group = groups.find((g) => g.id.toLowerCase() === id.toLowerCase())
  return group ? { min: group.config.min, max: group.config.max } : null
}

export function getCustomizationId(node: TreeNode): string {
  if (node.is_base_item && node.base_item) {
    return node.base_item.item_id
  } else if (!node.is_base_item && node.custom_item) {
    return node.custom_item.customization_id
  }
  return ''
}

export function mapItemToTreeNode(items: any): TreeNode[] {
  // Filter items that have a tag of type "item"
  const baseItems = items.filter((item: any) => {
    if (!item.tags || !Array.isArray(item.tags)) return false
    return item.tags.some((tag: any) => {
      if (tag.code !== 'type' || !Array.isArray(tag.list)) return false
      return tag.list.some((sub: any) => sub.code === 'type' && sub.value === 'item')
    })
  })

  // Map each base item to a TreeNode
  const treeNodes: TreeNode[] = baseItems.map((item: any) => {
    let custom_groups: string[] = []
    if (item.tags) {
      const cgTag = item.tags.find((tag: any) => tag.code === 'custom_group')
      if (cgTag && Array.isArray(cgTag.list) && cgTag.list.length > 0) {
        cgTag.list.forEach((item: any) => {
          custom_groups.push(item.value)
        })
      }
    }

    // Extract default_selection and range from the price tags.
    let default_selection: { min: number; max: number } | undefined
    let range = { lower: 0, upper: 0 }
    if (item.price && Array.isArray(item.price.tags)) {
      for (const tag of item.price.tags) {
        if (tag.code === 'default_selection') {
          const minVal = tag.list.find((x: any) => x.code === 'value')?.value
          const maxVal = tag.list.find((x: any) => x.code === 'maximum_value')?.value
          if (minVal && maxVal) {
            default_selection = {
              min: parseFloat(minVal),
              max: parseFloat(maxVal),
            }
          }
        } else if (tag.code === 'range') {
          const lowerVal = tag.list.find((x: any) => x.code === 'lower')?.value
          const upperVal = tag.list.find((x: any) => x.code === 'upper')?.value
          if (lowerVal && upperVal) {
            range = {
              lower: parseFloat(lowerVal),
              upper: parseFloat(upperVal),
            }
          }
        }
      }
    }

    return {
      is_base_item: true,
      base_item: {
        item_id: item.id,
        item_value: parseFloat(item.price.value),
        item_maximum_value: parseFloat(item.price.maximum_value),
        default_selection,
        range,
      },
      custom_groups,
      children: [],
    } as TreeNode
  })

  return treeNodes
}

// Extract Custom Groups
export function extractCustomGroups(categories: any) {
  const result: any = []

  categories.forEach((category: any) => {
    // Find the type tag
    const typeTag = category.tags.find((tag: any) => tag.code === 'type')
    const typeValue = typeTag?.list.find((item: any) => item.code === 'type')?.value

    // Check if the type is "custom_group"
    if (typeValue === 'custom_group') {
      // Find the config tag
      const configTag = category.tags.find((tag: any) => tag.code === 'config')
      const configList = configTag?.list || []

      // Extract min, max, and seq from config
      const min = configList.find((item: any) => item.code === 'min')?.value
      const max = configList.find((item: any) => item.code === 'max')?.value
      const seq = configList.find((item: any) => item.code === 'seq')?.value

      // Create result object
      const extractedData = {
        id: category.id,
        name: category.descriptor.name,
        type: typeValue,
        config: {
          min: min || null,
          max: max || null,
          seq: seq || null,
        },
      }

      result.push(extractedData)
    }
  })

  return result
}

export function mapCustomItemToTreeNode(items: any[], customGroupCategory: any): TreeNode[] {
  // Filter items that have a tag of type "customization"
  const customItems = items.filter((item) => {
    if (!item.tags || !Array.isArray(item.tags)) return false
    return item.tags.some((tag: any) => {
      if (tag.code !== 'type' || !Array.isArray(tag.list)) return false
      return tag.list.some((sub: any) => sub.code === 'type' && sub.value === 'customization')
    })
  })

  // Store unique parent-child relationships
  const uniqueNodes = new Map<string, TreeNode>()

  customItems.forEach((item) => {
    let parentId: string | undefined
    let customGroups: string[] = []
    let childGroups: string[] = []
    let isDefault = false

    if (Array.isArray(item.tags)) {
      for (const tag of item.tags) {
        if (tag.code === 'custom_group' && Array.isArray(tag.list)) {
          customGroups = tag.list.map((entry: any) => entry.value)
        } else if (tag.code === 'parent' && Array.isArray(tag.list)) {
          const parentEntry = tag.list.find((entry: any) => entry.code === 'id')
          if (parentEntry) parentId = parentEntry.value

          // Check if the customization is default
          const defaultEntry = tag.list.find((entry: any) => entry.code === 'default' && entry.value === 'yes')
          isDefault = !!defaultEntry
        } else if (tag.code === 'child' && Array.isArray(tag.list)) {
          childGroups = tag.list.map((entry: any) => entry.value)
        }
      }
    }

    // Ensure only unique (customization_id, custom_group_id) pairs are stored
    if (parentId) {
      const config = getMinMaxById(customGroupCategory, parentId)
      const key = `${item.id}-${parentId}`

      if (!uniqueNodes.has(key)) {
        uniqueNodes.set(key, {
          is_base_item: false,
          custom_item: {
            custom_group_id: parentId, // Parent ID reference
            customization_id: item.id,
            value: parseFloat(item.price?.value || '0'),
            maximum_value: parseFloat(item.price?.maximum_value || '0'),
            config: {
              min: Number(config?.min) || 0,
              max: Number(config?.max) || 0,
            },
            default_select: isDefault,
          },
          custom_groups: [...new Set([...customGroups, ...childGroups])], // Add parent and child groups
          children: [],
        })
      }
    }
  })

  return Array.from(uniqueNodes.values())
}

export function mapCustomizationsToBaseItems(baseItems: TreeNode[], customItems: TreeNode[]): TreeNode[] {
  const customizationMap = new Map<string, TreeNode[]>()

  // Group customizations by their custom_group_id
  customItems.forEach((cust) => {
    if (cust.custom_item) {
      const parentId = cust.custom_item.custom_group_id
      if (!customizationMap.has(parentId)) {
        customizationMap.set(parentId, [])
      }
      customizationMap.get(parentId)!.push(cust)
    }
  })

  // Recursively attach children to the correct base item
  function attachChildren(node: TreeNode) {
    if (node.custom_groups) {
      node.children = node.children || []

      node.custom_groups.forEach((groupId) => {
        if (customizationMap.has(groupId)) {
          const children = customizationMap.get(groupId)!
          node?.children?.push(...children)
          children.forEach(attachChildren) // Recursive call for nested children
        }
      })
    }
  }

  // Attach children to each base item
  baseItems.forEach(attachChildren)

  return baseItems
}

export function calculateDefaultSelectionPrice(items: any) {
  let totalMin = 0
  let totalMax = 0
  let arr = []

  function traverse(item: any) {
    if (item.is_base_item) {
      if (item.base_item && item.base_item.default_selection) {
        totalMin += item.base_item.item_value
        totalMax += item.base_item.item_maximum_value
      }
      // console.log("base_item", item, totalMin, totalMax);
    } else if (item.custom_item && item.custom_item.default_select === true) {
      totalMin += item.custom_item.value
      totalMax += item.custom_item.maximum_value
      // console.log("custom_item", item, totalMin, totalMax);
    }

    if ((item.is_base_item || item.custom_item.default_select) && item.children && item.children.length > 0) {
      for (const child of item.children) {
        traverse(child)
      }
    }
    return { totalMin, totalMax }
  }

  for (const item of items) {
    totalMin = 0
    totalMax = 0

    const default_select = traverse(item)
    arr.push({
      base_item: item.base_item.item_id,
      default_selection_calculated: {
        min: default_select?.totalMin,
        max: default_select?.totalMax,
      },
      default_selection_actual: item.base_item.default_selection,
    })
  }

  return arr
}
