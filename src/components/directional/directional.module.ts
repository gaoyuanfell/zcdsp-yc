import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DirectionalComponent} from './directional.component';
import {CheckboxModule} from '../checkbox/checkbox.module';
import {SwitchInputModule} from '../switch-input/switch-input.module';
import {ModulePipe} from '../../app/module-pipe';
import {CheckboxGroupModule} from '../checkbox-group/checkbox-group.module';
import {RadioGroupModule} from '../radio-group/radio-group.module';
import {MapModule} from '../map/map.module';
import {DirectionalAppComponent} from './directional-app.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CheckboxModule,
    SwitchInputModule,
    ModulePipe,
    CheckboxGroupModule,
    RadioGroupModule,
    MapModule,
  ],
  declarations: [
    DirectionalComponent,
    DirectionalAppComponent,
  ],
  exports: [
    DirectionalComponent,
    DirectionalAppComponent,
  ]
})
export class DirectionalModule {
}
