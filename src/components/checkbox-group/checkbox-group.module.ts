import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CheckboxGroupComponent} from './checkbox-group.component';
import {CheckboxModule} from '../checkbox/checkbox.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CheckboxModule
  ],
  declarations: [
    CheckboxGroupComponent
  ],
  exports: [
    CheckboxGroupComponent
  ]
})
export class CheckboxGroupModule {
}
