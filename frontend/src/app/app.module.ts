import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { PrimengModule } from "./StyleLibraries/primeng/primeng.module";
import { MaterialModule } from "./StyleLibraries/material/angular.material.module";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { FolderStructureComponent } from "./folder-structure/folder-structure.component";
// import { ViewBmarksPaneComponent } from "./view-bmarks-pane/view-bmarks-pane.component";
// import { SideNavComponent } from "./side-nav/side-nav.component";
import { AngularFireModule } from "@angular/fire";
import { environment } from "../environments/environment";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireDatabaseModule } from "@angular/fire/database";
// import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { AngularFontAwesomeModule } from "angular-font-awesome";
// import { BmarkerComponent } from "./bmarker/bmarker.component";
import { SignupComponent } from "./signup/signup.component";
import { LoginComponent } from "./login/login.component";
import { BmarkerAuthGuard } from "./guards/bmarker-auth.guard";
import { HttpCallInterceptorService } from "./services/http-call-interceptor.service";

@NgModule({
  declarations: [
    AppComponent,
    // FolderStructureComponent,
    // ViewBmarksPaneComponent,
    // SideNavComponent,
    // NavBarComponent,
    // BmarkerComponent,
    SignupComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    PrimengModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    // AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFontAwesomeModule,
  ],
  providers: [
    BmarkerAuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCallInterceptorService,
      multi: true,
    },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
