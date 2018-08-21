import {NgModule} from '@angular/core';
import {Module} from '../../module';
import {ReportRoutingModule} from './report-routing.module';
import {ReportComponent} from './report.component';
import {DatetimeComponent} from './datetime/datetime.component';
import {CreativeComponent} from './creative/creative.component';
import {CampaignComponent} from './campaign/campaign.component';
import {AreaComponent} from './area/area.component';
// import {ReportExpandComponent} from './report-expand.component';

@NgModule({
  imports: [
    Module,
    ReportRoutingModule
  ],
  declarations: [
    ReportComponent,
    DatetimeComponent,
    CreativeComponent,
    CampaignComponent,
    AreaComponent,
    // ReportExpandComponent
  ],
})
export class ReportModule {
}
