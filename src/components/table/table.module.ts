import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TableComponent} from './table.component';
import {TbodyComponent} from './tbody.component';
import {TdComponent} from './td.component';
import {ThComponent} from './th.component';
import {TheadComponent} from './thead.component';
import {TrComponent} from './tr.component';
import {CheckboxModule} from '../checkbox/checkbox.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    CheckboxModule,
    FormsModule,
  ],
  declarations: [
    TableComponent,
    TbodyComponent,
    TdComponent,
    ThComponent,
    TheadComponent,
    TrComponent,
  ],
  exports: [
    TableComponent,
    TbodyComponent,
    TdComponent,
    ThComponent,
    TheadComponent,
    TrComponent,
  ]
})
export class TableModule {
}
