import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { PrimengModule } from "./primeng/primeng.module";
import { AddBookmarkComponent } from "./add-bookmark/add-bookmark.component";
import { HttpClientModule } from "@angular/common/http";
import { FolderEditComponent } from './folder-edit/folder-edit.component';

@NgModule({
  declarations: [AppComponent, AddBookmarkComponent, FolderEditComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    PrimengModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
