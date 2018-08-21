import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceRoutingModule } from './finance-routing.module';
import { FinanceComponent } from './finance.component';
import { UserchargeComponent } from './usercharge/usercharge.component';
import { RechargeComponent } from './recharge/recharge.component';

@NgModule({
  imports: [
    CommonModule,
    FinanceRoutingModule
  ],
  declarations: [FinanceComponent, UserchargeComponent, RechargeComponent]
})
export class FinanceModule { }
