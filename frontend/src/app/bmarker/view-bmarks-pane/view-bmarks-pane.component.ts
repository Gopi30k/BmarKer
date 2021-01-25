import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TreeNode } from "primeng/api";
import { Observable, Subject } from "rxjs";
import { BmarkerService } from "../../services/bmarker.service";

@Component({
  selector: "app-view-bmarks-pane",
  templateUrl: "./view-bmarks-pane.component.html",
  styleUrls: ["./view-bmarks-pane.component.scss"],
})
export class ViewBmarksPaneComponent implements OnInit {
  bmarks: any;
  folders: Array<any>;
  links: Array<any>;

  // bkFolderCollection: Subject<any> = new Subject<any>();
  // bkFolderCollection$: Observable<any> = this.bkFolderCollection.asObservable();

  // bkURLLinkCollection: Subject<any> = new Subject<any>();
  // bkURLLinkCollection$: Observable<any> = this.bkURLLinkCollection.asObservable();

  constructor(
    private route: ActivatedRoute,
    private bmarkService: BmarkerService,
    private router: Router
  ) {
    // this.router.routeReuseStrategy.shouldReuseRoute = function () {
    //   return false;
    // };
  }

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

    // this.route.paramMap.subscribe((params) => {
    //   this.bmarkService.getSubCollectionOfFolderObs(params.get("folder"));
    // });

    // this.bmarkService.commonCollection$
    //   // .pipe(tap(({ ...data }) => console.log(data)))
    //   .subscribe((data) => {
    //     // console.log(data["data"][0]);

    //     data["data"][0].children.forEach((d) => {
    //       d.feature === "folder"
    //         ? this.bkFolderCollection.next(d)
    //         : this.bkURLLinkCollection.next(d);
    //     });
    //   });

    // this.bmarkService.commonCollection$.subscribe((d) => console.log(d));
    // this.bmarkService.bkFolderCollection$.subscribe((d) => console.log(d));
    // this.bkURLLinkCollection$.subscribe((d) => console.log(d));
  }
}
