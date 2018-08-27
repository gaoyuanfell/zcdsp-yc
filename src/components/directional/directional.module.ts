import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DirectionalComponent} from './directional.component';
import {CheckboxModule} from '../checkbox/checkbox.module';
import {SwitchInputModule} from '../switch-input/switch-input.module';
import {ModulePipe} from '../../app/module-pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CheckboxModule,
    SwitchInputModule,
    ModulePipe,
  ],
  declarations: [
    DirectionalComponent,
  ],
  exports: [
    DirectionalComponent
  ]
})
export class DirectionalModule {
}
