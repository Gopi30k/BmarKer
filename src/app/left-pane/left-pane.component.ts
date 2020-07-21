import { Component, OnInit } from "@angular/core";
import { DialogService } from "primeng/dynamicdialog";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { AddURLComponent } from "../add-url/add-url.component";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-left-pane",
  templateUrl: "./left-pane.component.html",
  styleUrls: ["./left-pane.component.css"],
  providers: [DialogService, MessageService],
})
export class LeftPaneComponent implements OnInit {
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
    if (this.bmarkerURL !== undefined) {
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
  // addBookmark() {
  //   // this.displayURLDialog = true;
  //   this.ref = this.dialogService.open(AddURLComponent, {
  //     header: "Add Bookmark",
  //     width: "70%",
  //     contentStyle: {
  //       height: "350px",
  //       display: "flex",
  //       "justify-content": "center",
  //     },
  //   });
  // }
}
