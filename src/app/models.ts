export interface Folder {
  label: string;
  data: string;
  expandedIcon: string;
  collapsedIcon: string;
  children?: Folder[];
}

export interface folderData {
  data: Folder[];
}
