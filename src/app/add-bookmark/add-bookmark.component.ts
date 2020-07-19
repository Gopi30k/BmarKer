import { Component, OnInit } from "@angular/core";
import { MenuItem, TreeNode } from "primeng/api";
import { FolderService } from "../folder.service";
import { folderData, Folder } from "../models";

@Component({
  selector: "app-add-bookmark",
  templateUrl: "./add-bookmark.component.html",
  styleUrls: ["./add-bookmark.component.css"],
})
export class AddBookmarkComponent implements OnInit {
  folders: TreeNode[];
  optionMenus: MenuItem[];
  selectedFolder: TreeNode;
  dialogTitle: string = "";
  renameFolderName: string = "";
  footerSuccessBtn: string = "";
  displayDialog: boolean = false;
  constructor(private folderService: FolderService) {}

  ngOnInit() {
    this.folderService
      .getFolderCollections()
      .then((data) => (this.folders = data));

    this.optionMenus = [
      {
        label: "New Folder",
        icon: "pi pi-plus",
        command: (event) => this.newFolderDialog(this.selectedFolder),
      },
      {
        label: "Rename Folder",
        icon: "pi pi-pencil",
        command: (event) => this.renameFolder(this.selectedFolder),
      },
      {
        label: "Delete Folder",
        icon: "pi pi-trash",
        command: (event) => this.deleteFolder(this.selectedFolder),
      },
    ];
  }

  newFolderDialog(file: TreeNode) {
    this.dialogTitle = "Add Folder";
    this.footerSuccessBtn = "Add";
    this.displayDialog = true;
  }

  renameFolder(folderToRename: TreeNode) {
    this.dialogTitle = "Rename Folder";
    this.footerSuccessBtn = "Rename";
    this.displayDialog = true;
    this.renameFolderName = folderToRename.label;
  }

  deleteFolder(folderToDelete: TreeNode) {
    this.folders.forEach((fold, index) => {
      fold.label.toLowerCase() === folderToDelete.label.toLowerCase()
        ? this.folders.splice(index, 1)
        : this.nodeRecursiveAction(fold, folderToDelete, "delete");
    });
  }

  nodeRecursiveAction(
    folderNode: TreeNode,
    folderToFind: TreeNode,
    action: string
  ) {
    if (folderNode.children === undefined) {
      folderNode.label.toLowerCase() === folderToFind.label.toLowerCase()
        ? folderNode.label
        : "no match";
    } else {
      folderNode.children.forEach((child, index) => {
        if (child.label.toLowerCase() === folderToFind.label.toLowerCase()) {
          if (action === "delete") {
            folderNode.children.splice(index, 1);
          } else if (action === "edit") {
          }
        } else {
          this.nodeRecursiveAction(child, folderToFind, action);
        }
      });
    }
  }
}
