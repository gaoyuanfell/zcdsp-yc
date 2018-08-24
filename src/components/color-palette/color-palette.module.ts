import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ColorPaletteComponent} from './color-palette.component';
import {FormsModule} from '@angular/forms';
import {ColorPaletteDirective} from './color-palette.directive';
import {InputColorPaletteComponent} from './input-color-palette.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    ColorPaletteComponent,
    ColorPaletteDirective,
    InputColorPaletteComponent
  ],
  exports: [
    ColorPaletteComponent,
    ColorPaletteDirective,
    InputColorPaletteComponent
  ],
  entryComponents: [
    ColorPaletteComponent
  ]
})
export class ColorPaletteModule {
}
