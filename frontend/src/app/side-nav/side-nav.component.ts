import { Component, OnInit } from "@angular/core";
import { DialogService } from "primeng/dynamicdialog";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";

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
    private messageService: MessageService
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
      this.displayURLDialog = false;
      this.bmarkerURL = "";
    } else {
      this.messageService.add({
        key: "tc",
        severity: "error",
        summary: "Invalid URL",
        detail: `${this.bmarkerURL || "Empty"}`,
      });
    }

    console.log(this.bmarkerURL);
  }

  cancelURL() {
    this.displayURLDialog = false;
  }
}
