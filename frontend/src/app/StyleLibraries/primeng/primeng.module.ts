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
import { ToastModule } from "primeng/toast";
import { CardModule } from "primeng/card";
import { PasswordModule } from "primeng/password";
import { TooltipModule } from "primeng/tooltip";
import { OverlayPanelModule } from "primeng/overlaypanel";

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
  CardModule,
  PasswordModule,
  TooltipModule,
  OverlayPanelModule,
];

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [primengComponents],
})
export class PrimengModule {}
