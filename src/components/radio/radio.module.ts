import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RadioComponent} from './radio.component';
import {TooltipModule} from '../tooltip/tooltip.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule
  ],
  declarations: [
    RadioComponent
  ],
  exports: [
    RadioComponent
  ]
})
export class RadioModule {
}
