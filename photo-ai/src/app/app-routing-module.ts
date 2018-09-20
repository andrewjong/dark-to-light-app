import {NgModule} from "@angular/core";
import {PreloadAllModules, RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {ImageViewComponent} from "./home/imageview/image-view.component";


const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'img', component: ImageViewComponent},
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
