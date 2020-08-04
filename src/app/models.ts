import { TreeNode } from "primeng/api";

export interface Folder extends TreeNode {
  feature: string;
  children?: Folder[];
}
