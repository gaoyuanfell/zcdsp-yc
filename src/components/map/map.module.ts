import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';
import {MapDirective} from './map.directive';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MapComponent,MapDirective],
  exports: [ MapComponent,MapDirective ]
})
export class MapModule { }
