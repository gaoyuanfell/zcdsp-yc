import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RichEditorComponent} from './rich-editor.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    RichEditorComponent
  ],
  exports: [
    RichEditorComponent
  ]
})
export class RichEditorModule {
}
