import { Component, OnInit } from "@angular/core";
import { MenuItem, TreeNode, TreeDragDropService } from "primeng/api";
import { FolderService } from "../folder.service";

@Component({
  selector: "app-folder-structure",
  templateUrl: "./folder-structure.component.html",
  styleUrls: ["./folder-structure.component.css"],
  providers: [TreeDragDropService],
})
export class FolderStructureComponent implements OnInit {
  folders: TreeNode[];
  optionMenus: MenuItem[];
  selectedFolder: TreeNode;
  dialogTitle: string = "";
  folderNameInput: string = "";
  footerSuccessBtn: string = "";
  folderActionDialog: boolean = false;

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

  /**
   * A Recursive function to iterate on children array
   * @param folderNode Folder Data received from api
   * @param folderToFind Selected Folder Node
   * @param action task to perform on selected node(add|rename|delete)
   * @param actionString value to be added as part of task performed
   */
  nodeRecursiveAction(
    folderNode: TreeNode,
    folderToFind: TreeNode,
    action: string,
    actionString?: TreeNode | string
  ) {
    // if no children return label of leaf Folder Node
    if (folderNode.children === undefined) {
      folderNode.label.toLowerCase() === folderToFind.label.toLowerCase()
        ? folderNode.label
        : "no match";
    } else {
      // Iterate all children perform actions intended
      folderNode.children.forEach((child, index) => {
        if (child.label.toLowerCase() === folderToFind.label.toLowerCase()) {
          if (action === "delete") {
            folderNode.children.splice(index, 1);
          } else if (action === "rename") {
            folderNode.children[index].label = <string>actionString;
          } else if (action === "add") {
            folderNode.children[index].children !== undefined
              ? folderNode.children[index].children.push(<TreeNode>actionString)
              : (folderNode.children[index].children = [
                  <TreeNode>actionString,
                ]);
          }
        } else {
          // Recursive call
          this.nodeRecursiveAction(child, folderToFind, action, actionString);
        }
      });
    }
  }

  // context Menu Actions
  newFolderDialog(file: TreeNode) {
    this.dialogTitle = "Add Folder";
    this.footerSuccessBtn = "Add";
    this.folderActionDialog = true;
    this.folderNameInput = "";
  }

  renameFolder(folderToRename: TreeNode) {
    this.dialogTitle = "Rename Folder";
    this.footerSuccessBtn = "Rename";
    this.folderActionDialog = true;
    this.folderNameInput = folderToRename.label;
  }

  deleteFolder(folderToDelete: TreeNode) {
    this.folders.forEach((fold, index) => {
      fold.label.toLowerCase() === folderToDelete.label.toLowerCase()
        ? this.folders.splice(index, 1)
        : this.nodeRecursiveAction(fold, folderToDelete, "delete");
    });
  }

  // Dialog Success button actions
  onSuccessBtnClick() {
    if (this.footerSuccessBtn.toLowerCase() === "rename") {
      let renameString = this.folderNameInput;
      this.folders.forEach((fold, index) => {
        fold.label.toLowerCase() === this.selectedFolder.label.toLowerCase()
          ? (this.folders[index].label = renameString)
          : this.nodeRecursiveAction(
              fold,
              this.selectedFolder,
              "rename",
              renameString
            );
      });
    } else if (this.footerSuccessBtn.toLowerCase() === "add") {
      let newFolderNode = {
        label: this.folderNameInput,
        data: this.folderNameInput,
        expandedIcon: "pi pi-folder-open",
        collapsedIcon: "pi pi-folder",
      };
      this.folders.forEach((fold, index) => {
        if (
          fold.label.toLowerCase() === this.selectedFolder.label.toLowerCase()
        ) {
          this.folders[index].children !== undefined
            ? this.folders[index].children.push(newFolderNode)
            : (this.folders[index].children = [newFolderNode]);
        } else {
          this.nodeRecursiveAction(
            fold,
            this.selectedFolder,
            "add",
            newFolderNode
          );
        }
      });
    }
    this.folderActionDialog = false;
  }

  // Dialog Cancel button action
  onCancelBtnClick() {
    this.folderActionDialog = false;
  }
}
