import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SideNavComponent } from "./side-nav/side-nav.component";
import { ViewBmarksPaneComponent } from "./view-bmarks-pane/view-bmarks-pane.component";
import { BmarkerComponent } from "./bmarker.component";
import { BookmarkPaneComponent } from "./bookmark-pane/bookmark-pane.component";

const routes: Routes = [
  {
    path: "",
    component: BookmarkPaneComponent,
    children: [
      {
        path: "",
        component: SideNavComponent,
        children: [
          {
            path: ":folder",
            component: ViewBmarksPaneComponent,
          },
          {
            path: "",
            redirectTo: "my-bookmarks",
            pathMatch: "full",
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BmarkerRoutingModule {}
