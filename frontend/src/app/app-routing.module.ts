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
    redirectTo: "bookmarks/5e9a7e56-858b-4cc8-be8b-14ad6d1801a8",
    pathMatch: "full",
  },
  { path: "**", redirectTo: "/", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
