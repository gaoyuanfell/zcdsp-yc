import {NgModule} from '@angular/core';
import {SpreadComponent} from './spread.component';
import {Module} from '../../module';
import {SpreadRoutingModule} from './spread-routing.module';
import {CampaignComponent, CampaignDetailComponent} from './campaign/campaign.component';
import {CreativeComponent, CreativeDetailComponent} from './creative/creative.component';
import {AddCampaignComponent} from './campaign/add-campaign/add-campaign.component';
import {AddCreativeComponent} from './creative/add-creative/add-creative.component';
import {DirectionalComponent} from './directional/directional.component';
import {AddDirectionalComponent} from './directional/add-directional/add-directional.component';
import {EditCreativeComponent} from './creative/edit-creative/edit-creative.component';

@NgModule({
  imports: [
    Module,
    SpreadRoutingModule
  ],
  declarations: [
    SpreadComponent,
    CampaignComponent,
    CreativeComponent,
    AddCreativeComponent,
    AddCampaignComponent,
    EditCreativeComponent,
    DirectionalComponent,
    CampaignDetailComponent,
    CreativeDetailComponent,
    AddDirectionalComponent,
  ],
  entryComponents:[
    CampaignDetailComponent,
    CreativeDetailComponent,
  ]
})
export class SpreadModule {
}
