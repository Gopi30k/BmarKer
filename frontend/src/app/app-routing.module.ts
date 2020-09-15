import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { BmarkerComponent } from "./bmarker/bmarker.component";
import { ViewBmarksPaneComponent } from "./view-bmarks-pane/view-bmarks-pane.component";

const routes: Routes = [
  { path: "bookmarks", component: AppComponent },
  {
    path: "bookmarks/:folder",
    component: ViewBmarksPaneComponent,
  },
  { path: "", redirectTo: "/bookmarks", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
