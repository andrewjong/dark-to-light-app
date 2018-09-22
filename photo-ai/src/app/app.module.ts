import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from "@angular/router";
import {AppRoutingModule} from "./app-routing-module";
import {HomeComponent} from './home/home.component';
import {FormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import {HttpClientModule} from "@angular/common/http";
import {ButtonModule, DialogModule, InputTextModule} from "primeng/primeng";
import {UploadPhotoComponent} from './home/uploadphoto/upload-photo.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UploadPhotoComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    TableModule,
    HttpClientModule,
    InputTextModule,
    DialogModule,
    ButtonModule,
    AppRoutingModule
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
