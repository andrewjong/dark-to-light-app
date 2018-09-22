import {NgModule} from "@angular/core";
import {PreloadAllModules, RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {UploadPhotoComponent} from "./home/uploadphoto/upload-photo.component";


const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'up', component: UploadPhotoComponent},
    // canActivate: [AuthGuard]},
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
