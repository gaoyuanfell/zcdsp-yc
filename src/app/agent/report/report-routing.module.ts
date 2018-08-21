import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CurrentResolverService} from '../../../auth/current-resolver-service';
import {ReportComponent} from './report.component';
import {CustomerComponent} from './customer/customer.component';
import {TokenGuard} from '../../../auth/token.guard';

const routeList: Routes = [
  {
    path: 'customer',
    component: CustomerComponent,
    resolve: {auth: CurrentResolverService},
    data: {current: 'ZCMOBI_US_REPORT_CUSTOMER'},
  },
];

const routes: Routes = [
  {
    path: '',
    component: ReportComponent,
    children: routeList,
    resolve: {auth: CurrentResolverService},
    canActivateChild: [TokenGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule {
}
