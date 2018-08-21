import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home.component';
import {TokenGuard} from '../../auth/token.guard';
import {CurrentResolverService} from '../../auth/current-resolver-service';
import {IndexComponent} from './index/index.component';
import {MenuGuard} from '../../auth/menu.guard';
import {UserResolverService} from '../../auth/user-resolver-service';

const routeList: Routes = [
  {
    path: 'home',
    component: IndexComponent,
    canActivate: [TokenGuard],
    resolve: {auth: CurrentResolverService, user: UserResolverService},
    data: {current: 'ZCMOBI_ADS_HOME'},
  },
  {
    path: 'report',
    loadChildren: './report/report.module#ReportModule',
  },
  {
    path: 'finance',
    loadChildren: './finance/finance.module#FinanceModule',
  },
  {
    path: 'spread',
    loadChildren: './spread/spread.module#SpreadModule',
  },
  {
    path: 'user',
    loadChildren: './user/user.module#UserModule'
  },
];

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [TokenGuard, MenuGuard],
    children: routeList,
    resolve: {auth: CurrentResolverService},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
