import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TreeNode } from "primeng/api";

@Component({
  selector: "app-view-bmarks-pane",
  templateUrl: "./view-bmarks-pane.component.html",
  styleUrls: ["./view-bmarks-pane.component.css"],
})
export class ViewBmarksPaneComponent implements OnInit {
  folderName: string;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      console.log(params);
      this.folderName = params.get("folder");
    });
  }
}
