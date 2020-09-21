import { Component, OnInit } from "@angular/core";
import { DialogService } from "primeng/dynamicdialog";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { FolderService } from "../folder.service";
import { v4 as uuidv4 } from "uuid";
import { HttpClient, HttpHeaders } from "@angular/common/http";

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
  constructor(
    public dialogService: DialogService,
    private messageService: MessageService,
    private router: Router,
    private folderService: FolderService,
    private httpClient: HttpClient
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
      key: uuidv4(),
      label: URLlink,
      data: URLlink,
      icon: "pi pi-globe",
      feature: "URLlink",
      children: [],
      parent: parentKey,
      leaf: true,
    };

    this.folderService.addNewURL(URLNode);
  }
}
