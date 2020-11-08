import { TreeNode } from "primeng/api";

export interface Folder {
  _id: { $oid: string };
  user_id: { $oid: string } | string;
  label?: string;
  data?: any;
  icon?: any;
  expandedIcon?: any;
  collapsedIcon?: any;
  leaf?: boolean;
  expanded?: boolean;
  type?: string;
  partialSelected?: boolean;
  styleClass?: string;
  draggable?: boolean;
  droppable?: boolean;
  selectable?: boolean;
  key?: string;
  feature: string;
  parent: string;
  children?: Folder[];
}
