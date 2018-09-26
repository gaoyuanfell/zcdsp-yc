import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {UserRoutingModule} from './user-routing.module';
import {Module} from '../../module';
import {UserComponent} from './user.component';
import {LogsComponent} from './logs/logs.component';
import {RemindComponent} from './remind/remind.component';
import {InfoComponent} from './info/info.component';
import {RemindPipe} from './remind/remind.pipe';
import {FormsModule} from '@angular/forms';
import { SafeCenterComponent } from './safe-center/safe-center.component';


@NgModule({
  imports: [
    Module,
    UserRoutingModule,
    FormsModule
  ],
  declarations: [
    UserComponent,
    LogsComponent,
    InfoComponent,
    RemindComponent,
    RemindPipe,
    SafeCenterComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserModule {
}
