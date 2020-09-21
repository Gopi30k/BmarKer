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
  folders: Array<any>;
  links: Array<any>;
  constructor(
    private route: ActivatedRoute,
    private folderService: FolderService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.folders = [];
      this.links = [];
      this.folderService
        .getFolderDependants(params.get("folder"))
        .subscribe((data) => {
          data.data[0].children.forEach((d) => {
            d.feature === "folder" ? this.folders.push(d) : this.links.push(d);
          });
        });
    });
  }
}
