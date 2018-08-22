import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ScheduleComponent} from './schedule.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    ScheduleComponent
  ],
  exports: [
    ScheduleComponent
  ]
})
export class ScheduleModule {
}
