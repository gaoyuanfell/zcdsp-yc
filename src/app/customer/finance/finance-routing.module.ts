import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TokenGuard} from '../../../auth/token.guard';
import {CurrentResolverService} from '../../../auth/current-resolver-service';
import {FinanceComponent} from './finance.component';
import {ConsumeComponent} from './consume/consume.component';
import {RechargeComponent} from './recharge/recharge.component';

const routeList: Routes = [
  {
    path: 'consume',
    component: ConsumeComponent,
    resolve: {auth: CurrentResolverService},
    data: {current: 'ZCMOBI_ADS_FINACE_CONSUME'},
  },
  {
    path: 'recharge',
    component: RechargeComponent,
    resolve: {auth: CurrentResolverService},
    data: {current: 'ZCMOBI_ADS_FINACE_RECHARGE'},
  }
];

const routes: Routes = [
  {
    path: '',
    component: FinanceComponent,
    children: routeList,
    canActivateChild: [TokenGuard],
    resolve: {auth: CurrentResolverService},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule {
}
