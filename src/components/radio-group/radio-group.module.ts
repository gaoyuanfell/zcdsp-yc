import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RadioGroupComponent} from './radio-group.component';
import {RadioModule} from '../radio/radio.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RadioModule
  ],
  declarations: [
    RadioGroupComponent
  ],
  exports: [
    RadioGroupComponent
  ]
})
export class RadioGroupModule {
}
