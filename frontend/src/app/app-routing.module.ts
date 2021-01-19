import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { BmarkerComponent } from "./bmarker/bmarker.component";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { ViewBmarksPaneComponent } from "./view-bmarks-pane/view-bmarks-pane.component";

const routes: Routes = [
  {
    path: "signup",
    component: SignupComponent,
  },
  {
    path: "login",
    component: LoginComponent,
  },
  // {
  //   path: "bookmarks/my-bookmarks",
  //   component: BmarkerComponent,
  // },
  // {
  //   path: "bookmarks/folders/:folder",
  //   component: ViewBmarksPaneComponent,
  // },
  {
    path: "bookmarks",
    component: BmarkerComponent,
    children: [
      // {
      //   path: "",
      //   component: ViewBmarksPaneComponent,
      // },
      {
        path: "folders/:folder",
        component: ViewBmarksPaneComponent,
      },
      // {
      //   path: "folders/:folder",
      //   loadChildren: () =>
      //     import("./test-route/test-route.module").then(
      //       (m: any) => m.TestRouteModule
      //     ),
      // },
    ],
  },
  // {
  //   path: "",
  //   redirectTo: "/bookmarks/my_bookmarks",
  //   pathMatch: "full",
  // },
  // { path: "**", redirectTo: "/bookmarks/my_bookmarks", pathMatch: "full" },
];

@NgModule({
  // imports: [
  //   RouterModule.forRoot(routes, {
  //     onSameUrlNavigation: "reload",
  //   }),
  // ],
  imports: [RouterModule.forRoot(routes)],

  exports: [RouterModule],
})
export class AppRoutingModule {}
