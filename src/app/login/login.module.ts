import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login.component';
import {LoginRoutingModule} from './login-routing.module';
import {Module} from '../module';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    Module,

  ],
  declarations: [LoginComponent]
})
export class LoginModule {

}
