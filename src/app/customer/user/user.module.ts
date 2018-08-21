import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {Module} from '../../module';
import {UserRoutingModule} from './user-routing.module';
import {UserComponent} from './user.component';
import {LogsComponent} from './logs/logs.component';
import {RemindComponent} from './remind/remind.component';
import {InfoComponent} from './info/info.component';



@NgModule({
  imports: [
    Module,
    UserRoutingModule
  ],
  declarations: [
    UserComponent,
    LogsComponent,
    InfoComponent,
    RemindComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserModule {
}
