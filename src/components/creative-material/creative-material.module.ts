import {NgModule, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreativeMaterialComponent} from './creative-material.component';
import {PreviewImgModule} from '../preview-img/preview-img.module';

// 历史创意图库

@NgModule({
  imports: [
    CommonModule,
    PreviewImgModule,
  ],
  declarations: [
    CreativeMaterialComponent
  ],
  exports: [
    CreativeMaterialComponent
  ]
})
export class CreativeMaterialModule {

  constructor() {
  }

}
