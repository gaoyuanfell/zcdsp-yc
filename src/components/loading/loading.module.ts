import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {LoadingComponent} from './loading.component';
import {Loading} from './loading.service';
import {OverlayModule} from '@angular/cdk/overlay';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
  ],
  declarations: [
    LoadingComponent
  ],
  exports: [
    LoadingComponent
  ],
  entryComponents: [
    LoadingComponent
  ],
  providers: [
    Loading
  ]
})
export class LoadingModule {
}
