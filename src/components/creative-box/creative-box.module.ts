import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CheckboxModule} from '../checkbox/checkbox.module';
import {CreativeBoxComponent} from './creative-box.component';
import {FileUploadModule} from '../file-upload/file-upload.module';
import {SelectModule} from '../select/select.module';
import {CreativeTemplateModule} from '../creative-template/creative-template.module';
import {PopoverModule} from '../popover/popover.module';
import {TableModule} from '../table/table.module';
import {CreativeMaterialModule} from '../creative-material/creative-material.module';
import {TooltipModule} from '../tooltip/tooltip.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CheckboxModule,
    FileUploadModule,
    SelectModule,
    CreativeTemplateModule,
    PopoverModule,
    TableModule,
    CreativeMaterialModule,
    TooltipModule
  ],
  declarations: [
    CreativeBoxComponent
  ],
  exports: [
    CreativeBoxComponent
  ]
})
export class CreativeBoxModule {
}
