import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CurrentResolverService} from '../../../auth/current-resolver-service';
import {FinanceComponent} from './finance.component';
import {RechargeComponent} from './recharge/recharge.component';
import {UserchargeComponent} from './usercharge/usercharge.component';
import {TokenGuard} from '../../../auth/token.guard';

const routeList: Routes = [
  {
    /*客户流水*/
    path: 'usrecharge',
    component: UserchargeComponent,
    resolve: {auth: CurrentResolverService},
    data: {current: 'ZCMOBI_US_FINACE_USER_RECHARGE'},
  },
  {
    /*用户流水*/
    path: 'recharge',
    component: RechargeComponent,
    resolve: {auth: CurrentResolverService},
    data: {current: 'ZCMOBI_US_FINACE_RECHARGE'},
  }
];

const routes: Routes = [
  {
    path: '',
    component: FinanceComponent,
    children: routeList,
    canActivateChild: [TokenGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule {
}
