import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TokenGuard} from '../../../auth/token.guard';
import {CurrentResolverService} from '../../../auth/current-resolver-service';
import {SpreadComponent} from './spread.component';
import {CampaignComponent} from './campaign/campaign.component';
import {CreativeComponent} from './creative/creative.component';
import {AddCampaignComponent} from './campaign/add-campaign/add-campaign.component';
import {AddCreativeComponent} from './creative/add-creative/add-creative.component';
import {DirectionalComponent} from './directional/directional.component';
import {AddDirectionalComponent} from './directional/add-directional/add-directional.component';
import {EditCreativeComponent} from './creative/edit-creative/edit-creative.component';

const routeList: Routes = [
  {
    path: 'campaign',
    component: CampaignComponent,
    resolve: {auth: CurrentResolverService},
    data: {current: 'ZCMOBI_ADS_SPREAD_CAMPAIGN'}
  },
  {
    path: 'campaign-add/:id',
    component: AddCampaignComponent,
    resolve: {auth: CurrentResolverService},
    data: {current: 'ZCMOBI_ADS_SPREAD_CAMPAIGN_EDIT'}
  },
  {
    path: 'campaign/edit/:id',
    component: AddCampaignComponent,
    resolve: {auth: CurrentResolverService},
    data: {current: 'ZCMOBI_ADS_SPREAD_CAMPAIGN_EDIT'}
  },
  {
    path: 'creative',
    component: CreativeComponent,
    resolve: {auth: CurrentResolverService},
    data: {current: 'ZCMOBI_ADS_SPREAD_CREATIVE'}
  },
  {
    path: 'creative-add/:id',
    component: AddCreativeComponent,
    resolve: {auth: CurrentResolverService},
    data: {current: 'ZCMOBI_ADS_SPREAD_CREATIVE_UPDATE', quickLink: {creativeAdd: false}}
  },
  {
    path: 'creative/edit/:id',
    component: EditCreativeComponent,
    resolve: {auth: CurrentResolverService},
    data: {current: 'ZCMOBI_ADS_SPREAD_CREATIVE_UPDATE'}
  },
  {
    path: 'directional',
    component: DirectionalComponent,
    resolve: {auth: CurrentResolverService},
    data: {current: 'ZCMOBI_ADS_SPREAD_DIRECTIONAL'}
  },
  {
    path: 'directional/:id',
    component: AddDirectionalComponent,
    resolve: {auth: CurrentResolverService},
    data: {current: 'ZCMOBI_ADS_SPREAD_DIRECTIONAL_EDIT'}
  }
];

const routes: Routes = [
  {
    path: '',
    component: SpreadComponent,
    children: routeList,
    canActivateChild: [TokenGuard],
    resolve: {auth: CurrentResolverService},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpreadRoutingModule {
}
