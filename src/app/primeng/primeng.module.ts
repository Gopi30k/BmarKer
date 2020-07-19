import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { TieredMenuModule } from "primeng/tieredmenu";
import { TreeModule } from "primeng/tree";
import { ContextMenuModule } from "primeng/contextmenu";
import { DialogModule } from "primeng/dialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { InputTextModule } from "primeng/inputtext";

export const primengComponents = [
  ButtonModule,
  TieredMenuModule,
  TreeModule,
  ContextMenuModule,
  DialogModule,
  ConfirmDialogModule,
  InputTextModule,
];

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [primengComponents],
})
export class PrimengModule {}
