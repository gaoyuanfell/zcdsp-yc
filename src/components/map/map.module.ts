import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MapComponent} from './map.component';
import {MapDirective} from './map.directive';
import {OverlayModule} from '@angular/cdk/overlay';


@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
  ],
  declarations: [MapComponent, MapDirective],
  exports: [MapComponent, MapDirective]
})
export class MapModule {
}
