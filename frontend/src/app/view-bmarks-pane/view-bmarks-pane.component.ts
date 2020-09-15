import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TreeNode } from "primeng/api";
import { FolderService } from "../folder.service";

@Component({
  selector: "app-view-bmarks-pane",
  templateUrl: "./view-bmarks-pane.component.html",
  styleUrls: ["./view-bmarks-pane.component.scss"],
})
export class ViewBmarksPaneComponent implements OnInit {
  bmarks: any;
  constructor(
    private route: ActivatedRoute,
    private folderService: FolderService
  ) {}

  ngOnInit() {
    console.log("asda");
    this.route.paramMap.subscribe((params) => {
      this.folderService
        .getFolderDependants(params.get("folder"))
        .subscribe((data) => (this.bmarks = data));
    });
  }
}
