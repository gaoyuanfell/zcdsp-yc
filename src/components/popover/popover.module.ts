import {CommonModule} from '@angular/common';
import {OverlayModule} from '@angular/cdk/overlay';
import {NgModule} from '@angular/core';
import {PopoverComponent} from './popover.component';
import {PopoverDirective} from './popover.directive';


@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
  ],
  declarations: [
    PopoverComponent,
    PopoverDirective,
  ],
  exports: [
    PopoverComponent,
    PopoverDirective,
  ],
  entryComponents: [
    PopoverComponent
  ]
})
export class PopoverModule {
}
