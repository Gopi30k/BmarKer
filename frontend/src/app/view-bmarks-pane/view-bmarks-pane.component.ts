import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TreeNode } from "primeng/api";
import { BmarkerService } from "../services/bmarker.service";

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
    private bmarkService: BmarkerService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.folders = [];
      this.links = [];
      this.bmarkService
        .getFolderSubCollections(params.get("folder"))
        .subscribe((data) => {
          data[0].children.forEach((d) => {
            d.feature === "folder" ? this.folders.push(d) : this.links.push(d);
          });
        });
    });
  }
}
