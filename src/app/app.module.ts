import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { PrimengModule } from "./primeng/primeng.module";
import { AddBookmarkComponent } from "./add-bookmark/add-bookmark.component";
import { HttpClientModule } from "@angular/common/http";
import { FolderEditComponent } from "./folder-edit/folder-edit.component";
import { FormsModule } from "@angular/forms";
import { FolderStructureComponent } from './folder-structure/folder-structure.component';
import { AddURLComponent } from './add-url/add-url.component';
import { LeftPaneComponent } from './left-pane/left-pane.component';

@NgModule({
  declarations: [AppComponent, AddBookmarkComponent, FolderEditComponent, FolderStructureComponent, AddURLComponent, LeftPaneComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    PrimengModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
