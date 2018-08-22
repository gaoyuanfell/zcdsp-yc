import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ButtonGroupComponent} from './button-group.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    ButtonGroupComponent
  ],
  exports: [
    ButtonGroupComponent
  ]
})
export class ButtonGroupModule {
}
