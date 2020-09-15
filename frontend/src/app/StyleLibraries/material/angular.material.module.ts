import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MatSidenavModule } from "@angular/material/sidenav";

export const materialComponents = [MatSidenavModule];

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [materialComponents],
})
export class MaterialModule {}
