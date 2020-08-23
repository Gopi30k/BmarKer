import { Component, OnInit } from "@angular/core";
import { MenuItem, TreeDragDropService } from "primeng/api";
import { FolderService } from "../folder.service";
import { Router } from "@angular/router";
import { v4 as uuidv4 } from "uuid";
import { Folder } from "../models";
@Component({
  selector: "app-folder-structure",
  templateUrl: "./folder-structure.component.html",
  styleUrls: ["./folder-structure.component.css"],
  providers: [TreeDragDropService],
})
export class FolderStructureComponent implements OnInit {
  folders: Folder[];
  optionMenus: MenuItem[];
  selectedFolder: Folder;
  dialogTitle: string = "";
  folderNameInput: string = "";
  footerSuccessBtn: string = "";
  folderActionDialog: boolean = false;

  constructor(private folderService: FolderService, private router: Router) {}

  ngOnInit() {
    // this.folderService.getFolderCollectionsJSON().then((api_data) => {
    //   this.folders = this.getFolderData(api_data);      // console.log(api_data);
    // });

    this.folderService
      .getFolderCollections()
      // .subscribe((api_data) => (this.folders = this.getFolderData(api_data)));
      .subscribe((api_data) => (this.folders = api_data));

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
   * Recursive method to filter out folder only records
   * @param treeData - API Data of type @interface Folder[]
   * @returns @interface Folder[]
   */
  getFolderData(treeData: Folder[]): Folder[] {
    const foldersOnly = treeData.filter(
      (folder) => folder.feature.toLowerCase() === "folder"
    );

    foldersOnly.forEach((folder) => {
      if (folder.children) {
        folder.children = this.getFolderData(folder.children);
      }
    });

    return foldersOnly;
  }

  /**
   * A Recursive function to iterate on children array
   * @param folderNode Folder Data received from api
   * @param folderToFind Selected Folder Node
   * @param action task to perform on selected node(add|rename|delete)
   * @param actionString value to be added as part of task performed
   */
  nodeRecursiveAction(
    folderNode: Folder,
    folderToFind: Folder,
    action: string,
    actionString?: Folder | string
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
              ? folderNode.children[index].children.push(<Folder>actionString)
              : (folderNode.children[index].children = [<Folder>actionString]);
          }
        } else {
          // Recursive call
          this.nodeRecursiveAction(child, folderToFind, action, actionString);
        }
      });
    }
  }

  // context Menu Actions
  newFolderDialog(file: Folder) {
    this.dialogTitle = "Add Folder";
    this.footerSuccessBtn = "Add";
    this.folderActionDialog = true;
    this.folderNameInput = "";
  }

  renameFolder(folderToRename: Folder) {
    this.dialogTitle = "Rename Folder";
    this.footerSuccessBtn = "Rename";
    this.folderActionDialog = true;
    this.folderNameInput = folderToRename.label;
  }

  deleteFolder(folderToDelete: Folder) {
    // this.folders.forEach((fold, index) => {
    //   fold.label.toLowerCase() === folderToDelete.label.toLowerCase()
    //     ? this.folders.splice(index, 1)
    //     : this.nodeRecursiveAction(fold, folderToDelete, "delete");
    // });
    this.nodeRecursiveAction(this.folders[0], folderToDelete, "delete");
    console.log(folderToDelete);

    this.folderService.deleteFolder(folderToDelete);
  }

  // Dialog Success button actions
  onSuccessBtnClick() {
    if (this.footerSuccessBtn.toLowerCase() === "rename") {
      let renameString = this.folderNameInput;
      // this.folders.forEach((fold, index) => {
      //   fold.label.toLowerCase() === this.selectedFolder.label.toLowerCase()
      //     ? (this.folders[index].label = renameString)
      //     : this.nodeRecursiveAction(
      //         fold,
      //         this.selectedFolder,
      //         "rename",
      //         renameString
      //       );
      // });
      this.folderService.renameNewFolder(this.selectedFolder, renameString);
      this.nodeRecursiveAction(
        this.folders[0],
        this.selectedFolder,
        "rename",
        renameString
      );
    } else if (this.footerSuccessBtn.toLowerCase() === "add") {
      let newFolderNode = {
        key: uuidv4(),
        label: this.folderNameInput,
        data: this.folderNameInput,
        expandedIcon: "pi pi-folder-open",
        collapsedIcon: "pi pi-folder",
        feature: "folder",
        children: [],
        parent: this.selectedFolder.label,
        leaf: true,
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

      this.folderService.addNewFolder(newFolderNode);
    }
    // this.folderService.setFirebaseData(this.folders);
    this.folderActionDialog = false;
  }

  // Dialog Cancel button action
  onCancelBtnClick() {
    this.folderActionDialog = false;
  }

  onFolderClick(event) {
    console.log(event.node);
    // this.router.navigate(["/bookmarks", event.node.key]);
  }
}