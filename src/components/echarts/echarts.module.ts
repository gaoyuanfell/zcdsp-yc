import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EchartsComponent } from './echarts.component'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    EchartsComponent
  ],
  exports: [EchartsComponent]
})
export class EchartsModule { }
