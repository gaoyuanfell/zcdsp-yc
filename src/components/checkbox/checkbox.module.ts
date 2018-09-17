import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CheckboxComponent} from './checkbox.component';
import {TooltipModule} from '../tooltip/tooltip.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule,
  ],
  declarations: [
    CheckboxComponent
  ],
  exports: [
    CheckboxComponent
  ]
})
export class CheckboxModule {
}
