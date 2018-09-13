import {NgModule} from '@angular/core';
import {HelpComponent} from './help.component';
import {HelpRoutingModule} from './help-routing.module';
import {Module} from '../module';

@NgModule({
  imports: [
    Module,
    HelpRoutingModule
  ],
  declarations: [
    HelpComponent
  ],
})
export class HelpModule {
}
