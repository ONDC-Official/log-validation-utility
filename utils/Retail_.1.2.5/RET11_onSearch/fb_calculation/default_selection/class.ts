import { TreeNode } from './interface'
import { getCustomizationId } from './utils'
export default class Tree {
  root: TreeNode

  constructor(rootData: TreeNode) {
    this.root = rootData
  }

  addNode(parentId: string, nodeData: TreeNode, currentNode: TreeNode = this.root): boolean {
    if (getCustomizationId(currentNode) === parentId) {
      if (!currentNode.children) currentNode.children = []
      currentNode.children.push(nodeData)
      return true
    }
    if (currentNode.children) {
      for (const child of currentNode.children) {
        if (this.addNode(parentId, nodeData, child)) {
          return true
        }
      }
    }
    return false
  }

  findNode(customization_id: string, currentNode: TreeNode = this.root): TreeNode | null {
    if (getCustomizationId(currentNode) === customization_id) {
      return currentNode
    }
    if (currentNode.children) {
      for (const child of currentNode.children) {
        const found = this.findNode(customization_id, child)
        if (found) return found
      }
    }
    return null
  }

  traverse(callback: (node: TreeNode) => void, currentNode: TreeNode = this.root): void {
    callback(currentNode)
    if (currentNode.children) {
      for (const child of currentNode.children) {
        this.traverse(callback, child)
      }
    }
  }
}
