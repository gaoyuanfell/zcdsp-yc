import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ScrollMoreDirective} from './scroll-more.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ScrollMoreDirective
  ],
  exports: [
    ScrollMoreDirective
  ]
})
export class ScrollMoreModule {
}
