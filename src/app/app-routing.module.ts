import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {MenuGuard} from '../auth/menu.guard';
import {BoardComponent} from './board.component';
import {HomeComponent} from './home.component';
import {TokenGuard} from '../auth/token.guard';
import {BoardtwoComponent} from './boardtwo.component';

const routes: Routes = [
  {path: 'lazy', loadChildren: './lazy/lazy.module#LazyModule'},
  {path: 'ads', loadChildren: './customer/home.module#HomeModule'},
  {path: 'us', loadChildren: './agent/home.module#HomeModule'},
  {path: 'forget', loadChildren: './login/login.module#LoginModule'},
  {path: 'register', loadChildren: './register/register.module#RegisterModule'},
  {path: 'landing', loadChildren: './landing-page/landing-page.module#LandingPageModule'},
  {path: 'template', loadChildren: './template-page/template-page.module#TemplatePageModule'},
  {path: 'help', loadChildren: './help/help.module#HelpModule'},

  {
    path: 'home',
    canActivate: [TokenGuard, MenuGuard],
    component: HomeComponent,
  },
  // {
  //   path: '',
  //   component: BoardComponent,
  // }
  {
    path: '',
    // canActivate: [TokenGuard, MenuGuard], // 这边要调用接口
    component: BoardtwoComponent
  },
  {
    path: 'aaaa',
    component: BoardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false, preloadingStrategy: PreloadAllModules})], // preloadingStrategy: PreloadAllModules
  exports: [RouterModule]
})
export class AppRoutingModule {
}
