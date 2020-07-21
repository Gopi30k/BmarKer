import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { TieredMenuModule } from "primeng/tieredmenu";
import { TreeModule } from "primeng/tree";
import { ContextMenuModule } from "primeng/contextmenu";
import { DialogModule } from "primeng/dialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { InputTextModule } from "primeng/inputtext";
import { DynamicDialogModule } from "primeng/dynamicdialog";
import { FolderStructureComponent } from "../folder-structure/folder-structure.component";
import { AddURLComponent } from "../add-url/add-url.component";
import { ToastModule } from "primeng/toast";

export const primengComponents = [
  ButtonModule,
  TieredMenuModule,
  TreeModule,
  ContextMenuModule,
  DialogModule,
  ConfirmDialogModule,
  InputTextModule,
  DynamicDialogModule,
  ToastModule,
];

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [primengComponents],
  entryComponents: [AddURLComponent],
})
export class PrimengModule {}
