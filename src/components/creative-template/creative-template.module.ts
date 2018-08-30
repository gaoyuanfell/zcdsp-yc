import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CreativeTemplateComponent} from './creative-template.component';
import {FileUploadModule} from '../file-upload/file-upload.module';
import {CheckboxModule} from '../checkbox/checkbox.module';
import {SelectModule} from '../select/select.module';
import {ScrollMoreModule} from '../scroll-more/scroll-more.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    CheckboxModule,
    SelectModule,
    ScrollMoreModule,
  ],
  declarations: [
    CreativeTemplateComponent
  ],
  exports: [
    CreativeTemplateComponent
  ]
})
export class CreativeTemplateModule {
}
