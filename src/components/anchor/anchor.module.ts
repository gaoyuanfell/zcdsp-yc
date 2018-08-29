import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AnchorComponent} from './anchor.component';
import {AnchorLinkComponent} from './anchor-link.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    AnchorComponent,
    AnchorLinkComponent
  ],
  exports: [
    AnchorComponent,
    AnchorLinkComponent
  ]
})
export class AnchorModule {
}
