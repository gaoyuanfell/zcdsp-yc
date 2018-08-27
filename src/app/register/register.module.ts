import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { LoginRoutingModule } from './register-routing.module'
import { Module } from '../module';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    Module
  ],
  declarations: [RegisterComponent]
})
export class RegisterModule { }
