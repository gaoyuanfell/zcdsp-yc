import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceRoutingModule } from './finance-routing.module';
import { FinanceComponent } from './finance.component';
import { UserchargeComponent } from './usercharge/usercharge.component';
import { RechargeComponent } from './recharge/recharge.component';
import {Module} from '../../module';
import { UserchargeExpandComponent } from './usercharge/usercharge-expand.component'
@NgModule({
  imports: [
    CommonModule,
    FinanceRoutingModule,
    Module
  ],
  declarations: [FinanceComponent, UserchargeComponent, RechargeComponent,UserchargeExpandComponent]
})
export class FinanceModule { }
