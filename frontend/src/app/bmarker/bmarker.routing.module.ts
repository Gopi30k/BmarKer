import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SideNavComponent } from "./side-nav/side-nav.component";
import { ViewBmarksPaneComponent } from "./view-bmarks-pane/view-bmarks-pane.component";
import { BmarkerComponent } from "./bmarker.component";

const routes: Routes = [
  {
    path: "folders",
    component: BmarkerComponent,
    children: [
      {
        path: ":folder",
        component: ViewBmarksPaneComponent,
      },
      {
        path: "",
        redirectTo: "my-bookmarks",
      },
    ],
  },
  {
    path: "",
    redirectTo: "folders",
  },
];

// const routes: Routes = [
//   {
//     path: "folders",
//     component: SideNavComponent,
//     children: [
//       {
//         path: ":folder",
//         component: ViewBmarksPaneComponent,
//       },
//     ],
//   },
//   {
//     path: "",
//     redirectTo: "folders",
//   },
// ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BmarkerRoutingModule {}
