import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TokenGuard} from '../../../auth/token.guard';
import {CurrentResolverService} from '../../../auth/current-resolver-service';
import {ReportComponent} from './report.component';
import {CreativeComponent} from './creative/creative.component';
import {DatetimeComponent} from './datetime/datetime.component';
import {AreaComponent} from './area/area.component';
import {CampaignComponent} from './campaign/campaign.component';

const routeList: Routes = [
  {
    resolve: {auth: CurrentResolverService},
    data: {current: 'ZCMOBI_ADS_REPORT_CREATIVE'},
    path: 'creative',
    component: CreativeComponent
  },
  {
    resolve: {auth: CurrentResolverService},
    data: {current: 'ZCMOBI_ADS_REPORT_DATETIME'},
    path: 'datetime',
    component: DatetimeComponent
  },
  {
    resolve: {auth: CurrentResolverService},
    data: {current: 'ZCMOBI_ADS_REPORT_AREA'},
    path: 'area',
    component: AreaComponent,
  },
  {
    resolve: {auth: CurrentResolverService},
    data: {current: 'ZCMOBI_ADS_REPORT_CAMPAIGN'},
    path: 'campaign',
    component: CampaignComponent
  },
];

const routes: Routes = [
  {
    path: '',
    component: ReportComponent,
    children: routeList,
    canActivateChild: [TokenGuard],
    resolve: {auth: CurrentResolverService},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule {
}
