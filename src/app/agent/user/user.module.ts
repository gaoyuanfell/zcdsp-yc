import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserRoutingModule} from './user-routing.module';
import { LogsComponent } from './logs/logs.component';
import { InfoComponent } from './info/info.component';
import { CustomerComponent } from './customer/customer.component';
import { UserComponent } from './user.component';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule
  ],
  declarations: [LogsComponent, InfoComponent, CustomerComponent, UserComponent]
})
export class UserModule { }
