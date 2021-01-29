import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { DialogService } from "primeng/dynamicdialog";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { v4 as uuidv4 } from "uuid";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BmarkerService } from "../../services/bmarker.service";
import { FolderStructureComponent } from "../folder-structure/folder-structure.component";
import { Folder } from "src/app/models";
@Component({
  selector: "app-side-nav",
  templateUrl: "./side-nav.component.html",
  styleUrls: ["./side-nav.component.scss"],
  providers: [DialogService, MessageService],
})
export class SideNavComponent implements OnInit {
  displayURLDialog: boolean = false;
  bmarkerURL: string;
  ref: DynamicDialogRef;
  urlNode: Folder;
  constructor(
    public dialogService: DialogService,
    private messageService: MessageService,
    private router: Router,
    private bmarkService: BmarkerService,
    private location: Location
  ) {}

  ngOnInit() {}

  addBookmark() {
    this.displayURLDialog = true;
  }

  addURL() {
    if (
      this.bmarkerURL !== undefined &&
      this.bmarkerURL &&
      this.bmarkerURL != ""
    ) {
      this.messageService.add({
        key: "tc",
        severity: "success",
        summary: "Bookmark Added",
        detail: `${this.bmarkerURL}`,
      });

      this.saveURLDB(this.bmarkerURL);
      this.bmarkerURL = "";
      this.displayURLDialog = false;
    } else {
      this.messageService.add({
        key: "tc",
        severity: "error",
        summary: "Invalid URL",
        detail: `${this.bmarkerURL || "Empty"}`,
      });
    }
  }

  cancelURL() {
    this.displayURLDialog = false;
  }

  saveURLDB(URLlink: string) {
    let parentKey = this.router.url.split("/").pop();
    let URLNode = {
      _id: { $oid: "" },
      user_id: localStorage.getItem("user"),
      key: uuidv4(),
      label: URLlink,
      data: URLlink,
      icon: "pi pi-globe",
      feature: "URLlink",
      children: [],
      parent: parentKey,
      styleClass: "display-none",
      leaf: true,
    };
    this.urlNode = URLNode;

    // this.bmarkService.addNewBmarkURL(URLNode).subscribe((response) => {
    //   console.log(
    //     `API responded on Folder addition - ${JSON.stringify(response)}`
    //   );
    //   if (response["status"] === "urlAdded") {
    //     // this.router.navigate([decodeURI(this.location.path())]);
    //     // this.bmarkService.setCurrentBmarkChildren(
    //     //   response["siblings"][0]["children"]
    //     // );
    //     this.router.navigate(["bookmarks", "folders", parentKey]);

    //     // this.router.navigate([decodeURI(this.location.path())], {
    //     //   skipLocationChange: true,
    //     // });

    //     // this.router
    //     //   .navigateByUrl("/", { skipLocationChange: true })
    //     //   .then(() => {
    //     //     this.router.navigate([this.router.url]);
    //     //   });
    //   }
    // });
  }
}
