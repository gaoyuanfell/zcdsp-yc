import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MenuGuard} from '../auth/menu.guard';
import {BoardComponent} from './board.component';
import {HomeComponent} from './home.component'

const routes: Routes = [
  {path: 'lazy', loadChildren: './lazy/lazy.module#LazyModule'},
  {path: 'ads', loadChildren: './customer/home.module#HomeModule'},
  {path: 'us', loadChildren: './agent/home.module#HomeModule'},
  {path: 'login', loadChildren: './login/login.module#LoginModule'},
  {path: 'register', loadChildren: './register/register.module#RegisterModule'},
  {path: 'landing', loadChildren: './landing-page/landing-page.module#LandingPageModule'},
  {path: 'template', loadChildren: './template-page/template-page.module#TemplatePageModule'},
  {
    path: '/home',
    component: HomeComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
