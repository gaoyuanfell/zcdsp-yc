import {NgModule} from '@angular/core';
import {Module} from '../module';
import {LandingPageComponent} from './landing-page.component';
import {LandingPageRoutingModule} from './landing-page-routing.module';

@NgModule({
  imports: [
    Module,
    LandingPageRoutingModule
  ],
  declarations: [
    LandingPageComponent,
  ],
  entryComponents: [
  ],
  providers: [
  ],
})
export class LandingPageModule {
}
