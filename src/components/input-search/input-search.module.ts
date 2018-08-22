import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {InputSearchComponent} from './input-search.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    InputSearchComponent
  ],
  exports: [
    InputSearchComponent
  ]
})
export class InputSearchModule {
}
