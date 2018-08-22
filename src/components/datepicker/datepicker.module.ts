import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DatepickerBaseComponent, DatepickerComponent} from './datepicker.component';
import {OverlayModule} from '@angular/cdk/overlay';
import {InputDatepickerComponent} from './input-datepicker.component';
import {DatepickerDirective} from './datepicker.directive';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OverlayModule,
  ],
  declarations: [
    DatepickerBaseComponent,
    DatepickerComponent,
    DatepickerDirective,
    InputDatepickerComponent,
  ],
  exports: [
    DatepickerBaseComponent,
    DatepickerComponent,
    DatepickerDirective,
    InputDatepickerComponent,
  ],
  entryComponents: [
    DatepickerComponent
  ]
})
export class DatepickerModule {
}
