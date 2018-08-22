import {CommonModule} from '@angular/common';
import {OverlayModule} from '@angular/cdk/overlay';
import {NgModule} from '@angular/core';
import {DialogComponent} from './dialog.component';
import {Dialog} from './dialog';


@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
  ],
  declarations: [
    DialogComponent
  ],
  exports: [
    DialogComponent
  ],
  providers: [
    Dialog
  ],
  entryComponents: [
    DialogComponent
  ]
})
export class DialogModule {
}
