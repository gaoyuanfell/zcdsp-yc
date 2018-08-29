import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CurrentResolverService} from '../../auth/current-resolver-service';
import {IndexComponent} from './index/index.component';
import {TokenGuard} from '../../auth/token.guard';
import {MenuGuard} from '../../auth/menu.guard';
import {UserResolverService} from '../../auth/user-resolver-service';
import {HomeComponent} from './home.component';



const routeList: Routes = [
  {
    path: 'home',
    component: IndexComponent,
    canActivate: [TokenGuard],
    resolve: {auth: CurrentResolverService, user: UserResolverService},
    data: {current: 'ZCMOBI_US_HOME'},
  },
  {
    path: 'report',
    loadChildren: '../agent/report/report.module#ReportModule',
  },
  {
    path: 'finance',
    loadChildren: '../agent/finance/finance.module#FinanceModule',
  },
  {
    path: 'user',
    loadChildren: '../agent/user/user.module#UserModule',
  },
];

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [TokenGuard, MenuGuard],
    children: routeList,
    resolve: {auth: CurrentResolverService},
    data: {current: 'index'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
