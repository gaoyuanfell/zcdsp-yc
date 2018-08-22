import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SwitchInputComponent} from './switch-input.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    SwitchInputComponent
  ],
  exports: [
    SwitchInputComponent
  ]
})
export class SwitchInputModule {
}
