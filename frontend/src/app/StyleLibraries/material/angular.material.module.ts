import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";

export const materialComponents = [
  MatSidenavModule,
  MatCardModule,
  MatToolbarModule,
];

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [materialComponents],
})
export class MaterialModule {}
