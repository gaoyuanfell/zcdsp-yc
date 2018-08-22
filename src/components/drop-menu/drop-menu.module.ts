import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {OverlayModule} from '@angular/cdk/overlay';
import {DropMenuComponent} from './drop-menu.component';
import {DropMenuDirective} from './drop-menu.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OverlayModule,
  ],
  declarations: [
    DropMenuComponent,
    DropMenuDirective,
  ],
  exports: [
    DropMenuComponent,
    DropMenuDirective,
  ],
  entryComponents: [
    DropMenuComponent
  ]
})
export class DropMenuModule {
}
