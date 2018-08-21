import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TokenGuard} from '../../../auth/token.guard';
import {CurrentResolverService} from '../../../auth/current-resolver-service';
import {UserComponent} from './user.component';
import {LogsComponent} from './logs/logs.component';
import {InfoComponent} from './info/info.component';
import {RemindComponent} from './remind/remind.component';

const routeList: Routes = [
  {
    path: 'logs',
    component: LogsComponent,
    resolve: {auth: CurrentResolverService},
    data: {current: 'ZCMOBI_ADS_USER_LOGS'},
  },
  {
    path: 'info',
    component: InfoComponent,
    resolve: {auth: CurrentResolverService},
    data: {current: 'ZCMOBI_ADS_USER_INFO'},
  },
  {
    path: 'remind',
    component: RemindComponent,
    resolve: {auth: CurrentResolverService},
    data: {current: 'ZCMOBI_ADS_USER_REMIND'},
  },
];

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: routeList,
    canActivateChild: [TokenGuard],
    resolve: {auth: CurrentResolverService},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
