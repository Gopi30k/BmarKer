import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { Location } from "@angular/common";
import { MenuItem, TreeDragDropService } from "primeng/api";
import { Router } from "@angular/router";
import { v4 as uuidv4 } from "uuid";
import { Folder } from "../../models";
import { BmarkerService } from "../../services/bmarker.service";
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: "app-folder-structure",
  templateUrl: "./folder-structure.component.html",
  styleUrls: ["./folder-structure.component.scss"],
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
  private urlAddition: boolean = false;
  @Input() newUrl: Folder;

  constructor(
    private bmarkService: BmarkerService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}
  ngOnInit() {
    let userBookmarkReqObj = {
      // token: localStorage.getItem("bmarkerToken"),
      bookmark_key: this.route.snapshot.paramMap.get("folder"),
      b_type: "all",
    };
    this.bmarkService.getFolderOnlyObs(userBookmarkReqObj);
    this.bmarkService.folderOnlyCollection$.subscribe((api_data: Folder[]) => {
      // this.folders = this.getFolderData(api_data);
      this.folders = api_data;
      this.bmarkService.setCurrentBmarkChildren(api_data[0].children);
    });

    console.log(this.folders);

    // this.onFolderClick(this.folders);
    // this.bmarkService
    //   .getAllBookmarks()
    //   .subscribe((api_data) => (this.folders = this.getFolderData(api_data)));

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

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

    // console.log(changes);
    // console.log(this.selectedFolder);

    // if(changes?.newUrl?.currentValue)
    // {

    // }

    if (changes.newUrl.currentValue) {
      this.urlAddition = true;
      this.onConfirmBtnClick(changes.newUrl.currentValue);
      this.urlAddition = false;
      // this.newFolderDialog(changes.newUrl.currentValue);
    }
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
    // if no children return key of leaf Folder Node
    if (folderNode.children === undefined) {
      folderNode.key.toLowerCase() === folderToFind.key.toLowerCase()
        ? folderNode.key
        : "no match";
    } else {
      // Iterate all children perform actions intended
      folderNode.children.forEach((child, index) => {
        if (child.key.toLowerCase() === folderToFind.key.toLowerCase()) {
          if (action === "delete") {
            folderNode.children.splice(index, 1);
            if (folderNode.children.length == 0) {
              folderNode.leaf = true;
            }
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
  onContextMenuSelect(node, contextMenu) {
    if (this.selectedFolder.data === "my_bookmarks") {
      contextMenu.model = contextMenu.model.filter(
        (menu) => menu.label === "New Folder"
      );
    } else {
      contextMenu.model = this.optionMenus;
    }
  }

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
    this.bmarkService
      .deleteBmarkFolder(folderToDelete.key)
      .subscribe((response) => {
        console.log(
          `API responded on Folder Deletion - ${JSON.stringify(response)}`
        );

        if (response["status"] === "deleted") {
          this.nodeRecursiveAction(this.folders[0], folderToDelete, "delete");
          // this.refreshRoute(decodeURI(this.location.path()));
          this.onFolderClick(this.selectedFolder.parent);
        } else {
          // TODO : Throw Popup Error (not deleted)
        }
      });
  }

  // Dialog Success button actions
  onConfirmBtnClick(newUrlNode?: Folder) {
    if (this.footerSuccessBtn.toLowerCase() === "rename") {
      let renameString = this.folderNameInput;
      let renameFolder = {
        _id: { $oid: "" },
        user_id: { $oid: "" },
        label: this.folderNameInput,
        data: this.folderNameInput,
        expandedIcon: "pi pi-folder-open",
        collapsedIcon: "pi pi-folder",
        feature: "folder",
        children: [],
        parent: this.selectedFolder.key,
        leaf: true,
      };

      this.bmarkService
        .renameBmarkFolder(this.selectedFolder.key, renameFolder)
        .subscribe((response) => {
          console.log(
            `API responded on Folder Rename - ${JSON.stringify(response)}`
          );
          if (response["status"] === "renamed") {
            this.nodeRecursiveAction(
              this.folders[0],
              this.selectedFolder,
              "rename",
              renameString
            );

            this.onFolderClick(this.selectedFolder.parent);
          } else {
            // TODO: Throw Popup error (Rename not done)
          }
        });
      // this.refreshRoute(decodeURI(this.location.path()));
    } else if (
      this.footerSuccessBtn.toLowerCase() === "add" ||
      this.urlAddition
    ) {
      // console.log(this.footerSuccessBtn);

      // console.log(this.urlAddition);

      // console.log(newUrlNode);

      let newFolderNode = this.urlAddition
        ? newUrlNode
        : {
            _id: { $oid: "" },
            user_id: localStorage.getItem("user"),
            key: uuidv4(),
            label: this.folderNameInput,
            data: this.folderNameInput,
            expandedIcon: "pi pi-folder-open",
            collapsedIcon: "pi pi-folder",
            feature: "folder",
            children: [],
            parent: this.selectedFolder.key,
            leaf: true,
          };

      // console.log(newFolderNode);

      //TODO: Temp URLnode addition logic need to be Simplified

      if (this.urlAddition) {
        this.bmarkService
          .addNewBmarkURL(newFolderNode)
          .subscribe((response) => {
            console.log(
              `API responded on URL Node addition - ${JSON.stringify(response)}`
            );
            if (response["status"] === "urlAdded") {
              this.folders.forEach((fold, index) => {
                if (
                  fold.key.toLowerCase() ===
                  this.selectedFolder.key.toLowerCase()
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
              // this.refreshRoute(decodeURI(this.location.path()));
              this.selectedFolder.expanded = true;
              this.onFolderClick(this.selectedFolder);
            } else {
              // TODO: Throw Popup Error (folder not added)
            }
          });
      } else {
        this.bmarkService
          .addNewBmarkFolder(newFolderNode)
          .subscribe((response) => {
            console.log(
              `API responded on Folder addition - ${JSON.stringify(response)}`
            );
            if (response["status"] === "added") {
              this.folders.forEach((fold, index) => {
                if (
                  fold.key.toLowerCase() ===
                  this.selectedFolder.key.toLowerCase()
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
              // this.refreshRoute(decodeURI(this.location.path()));
              this.selectedFolder.expanded = true;
              this.onFolderClick(this.selectedFolder);
            } else {
              // TODO: Throw Popup Error (folder not added)
            }
          });
      }
    }
    this.folderActionDialog = false;
  }

  refreshRoute(uri: string) {
    // this.router.navigate([uri], { skipLocationChange: true });
    let currentUrl = this.router.url;
    // console.log(currentUrl);

    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  // Dialog Cancel button action
  onCancelBtnClick() {
    this.folderActionDialog = false;
  }

  onFolderClick(event) {
    // console.log("originalEvent" in event);
    console.log(event);

    if ("originalEvent" in event) {
      this.bmarkService.setCurrentBmarkChildren(event.node.children);
      this.router.navigate(["/bookmarks", "folders", event.node.key]);
    } else {
      this.bmarkService.setCurrentBmarkChildren(event.children);
      this.router.navigate(["/bookmarks", "folders", event.key]);
    }
    // this.getFolderData(event.node.child)

    // const navArray =
    //   "originalEvent" in event ? event.node.children : event.children;
    // this.bmarkService.setCurrentBmarkChildren(navArray);
    // this.router.navigate(["/bookmarks", "folders", navArray]);
    // this.router.navigate(["/bookmarks", event.node.key], {
    //   state: { child: event.node.children },
    // });
    // this.bmarkService.getFolderDependants(event.node.key);
  }
}
