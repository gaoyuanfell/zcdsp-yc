import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TokenGuard} from '../../../auth/token.guard';
import {CurrentResolverService} from '../../../auth/current-resolver-service';
import {LogsComponent} from './logs/logs.component';
import {UserComponent} from './user.component';
import {InfoComponent} from './info/info.component';
import {CustomerComponent} from './customer/customer.component';

const routeList: Routes = [
  {
    path: 'logs',
    component: LogsComponent,
    resolve: {auth: CurrentResolverService},
    data: {current: 'ZCMOBI_US_USER_LOGS'},
  },
  {
    path: 'info',
    component: InfoComponent,
    resolve: {auth: CurrentResolverService},
    data: {current: 'ZCMOBI_US_USER_INFO'},
  },
  {
    path: 'info/:id',
    component: InfoComponent,
    resolve: {auth: CurrentResolverService},
    data: {current: 'ZCMOBI_US_USER_INFO'},
  },
  {
    path: 'customer',
    component: CustomerComponent,
    resolve: {auth: CurrentResolverService},
    data: {current: 'ZCMOBI_US_CUSTOMER'},
  },
];

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    canActivateChild: [TokenGuard],
    children: routeList,
    resolve: {auth: CurrentResolverService},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
