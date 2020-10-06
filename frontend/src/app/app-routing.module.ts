import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { BmarkerComponent } from "./bmarker/bmarker.component";
import { ViewBmarksPaneComponent } from "./view-bmarks-pane/view-bmarks-pane.component";

const routes: Routes = [
  {
    path: "bookmarks/:folder",
    component: ViewBmarksPaneComponent,
  },
  {
    path: "",
    redirectTo: "/bookmarks/my_bookmarks",
    pathMatch: "full",
  },
  { path: "**", redirectTo: "/bookmarks/my_bookmarks", pathMatch: "full" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: "reload",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
