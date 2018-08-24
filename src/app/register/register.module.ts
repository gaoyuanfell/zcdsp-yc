import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { LoginRoutingModule } from './register-routing.module'


@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule
  ],
  declarations: [RegisterComponent]
})
export class RegisterModule { }
