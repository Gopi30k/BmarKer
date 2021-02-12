import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PrimengModule } from "../StyleLibraries/primeng/primeng.module";
import { MaterialModule } from "../StyleLibraries/material/angular.material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BmarkerRoutingModule } from "./bmarker.routing.module";
import { BmarkerComponent } from "./bmarker.component";
import { SideNavComponent } from "./side-nav/side-nav.component";
import { FolderStructureComponent } from "./folder-structure/folder-structure.component";
import { ViewBmarksPaneComponent } from "./view-bmarks-pane/view-bmarks-pane.component";
import { NavBarComponent } from "../nav-bar/nav-bar.component";
@NgModule({
  declarations: [
    BmarkerComponent,
    SideNavComponent,
    FolderStructureComponent,
    ViewBmarksPaneComponent,
    NavBarComponent,
  ],
  imports: [
    CommonModule,
    BmarkerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimengModule,
    MaterialModule,
  ],
})
export class BmarkerModule {}
