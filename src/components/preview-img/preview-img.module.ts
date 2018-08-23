import {CommonModule} from '@angular/common';
import {OverlayModule} from '@angular/cdk/overlay';
import {NgModule} from '@angular/core';
import {PreviewImgComponent} from './preview-img.component';
import {PreviewImg} from './preview-img.service';
import {PreviewImgDirective} from './preview-img.directive';


@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
  ],
  declarations: [
    PreviewImgComponent,
    PreviewImgDirective,
  ],
  exports: [
    PreviewImgDirective
  ],
  entryComponents: [
    PreviewImgComponent
  ],
  providers: [
    PreviewImg
  ]
})
export class PreviewImgModule {
}
