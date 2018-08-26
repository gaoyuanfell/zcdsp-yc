/**
 * 功能模块 导入公共组件
 * 直接在模块引入。
 */
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {NoopInterceptor} from '../service/noopInterceptor';
import {ModulePipe} from './module-pipe';
import {NotificationModule} from '../components/notification/notification.module';
import {CheckboxModule} from '../components/checkbox/checkbox.module';
import {CheckboxGroupModule} from '../components/checkbox-group/checkbox-group.module';
import {RadioModule} from '../components/radio/radio.module';
import {RadioGroupModule} from '../components/radio-group/radio-group.module';
import {ButtonGroupModule} from '../components/button-group/button-group.module';
import {ColorPaletteModule} from '../components/color-palette/color-palette.module';
import {DatepickerModule} from '../components/datepicker/datepicker.module';
import {DialogModule} from '../components/dialog/dialog.module';
import {DropMenuModule} from '../components/drop-menu/drop-menu.module';
import {FileUploadModule} from '../components/file-upload/file-upload.module';
import {InputSearchModule} from '../components/input-search/input-search.module';
import {PreviewImgModule} from '../components/preview-img/preview-img.module';
import {ScheduleModule} from '../components/schedule/schedule.module';
import {ScrollMoreModule} from '../components/scroll-more/scroll-more.module';
import {SwitchInputModule} from '../components/switch-input/switch-input.module';
import {SelectModule} from '../components/select/select.module';
import {RichEditorModule} from '../components/rich-editor/rich-editor.module';
import {DirectionalModule} from '../components/directional/directional.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TableModule} from '../components/table/table.module';
import {PopoverModule} from '../components/popover/popover.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ModulePipe,

    NotificationModule,
    CheckboxModule,
    CheckboxGroupModule,
    RadioModule,
    RadioGroupModule,
    ButtonGroupModule,
    ColorPaletteModule,
    DatepickerModule,
    DialogModule,
    DropMenuModule,
    FileUploadModule,
    InputSearchModule,
    PreviewImgModule,
    ScheduleModule,
    ScrollMoreModule,
    SwitchInputModule,
    SelectModule,
    RichEditorModule,
    DirectionalModule,
    TableModule,
    PopoverModule,
  ],
  declarations: [],
  exports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ModulePipe,

    NotificationModule,
    CheckboxModule,
    CheckboxGroupModule,
    RadioModule,
    RadioGroupModule,
    ButtonGroupModule,
    ColorPaletteModule,
    DatepickerModule,
    DialogModule,
    DropMenuModule,
    FileUploadModule,
    InputSearchModule,
    PreviewImgModule,
    ScheduleModule,
    ScrollMoreModule,
    SwitchInputModule,
    SelectModule,
    RichEditorModule,
    DirectionalModule,
    TableModule,
    PopoverModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NoopInterceptor,
      multi: true,
    }
  ]
})
export class Module {

}
