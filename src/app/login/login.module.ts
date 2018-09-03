import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Login2Component, LoginComponent} from './login.component';
import {LoginRoutingModule} from './login-routing.module';
import { Module } from '../module';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    Module,

  ],
  declarations: [LoginComponent,Login2Component],
  entryComponents:[Login2Component]
})
export class LoginModule {

}
