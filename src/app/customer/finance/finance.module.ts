import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {Module} from '../../module';
import {FinanceComponent} from './finance.component';
import {ConsumeComponent} from './consume/consume.component';
import {FinanceRoutingModule} from './finance-routing.module';
import {RechargeComponent} from './recharge/recharge.component';
import {ConsumeExpandComponent} from './consume/consume-expand.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    Module,
    FinanceRoutingModule,
    FormsModule
  ],
  declarations: [
    FinanceComponent,
    ConsumeComponent,
    RechargeComponent,
    ConsumeExpandComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FinanceModule {
}
