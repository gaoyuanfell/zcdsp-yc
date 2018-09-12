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
import {TfootComponent} from './tfoot.component';
import {TablePaginatorComponent} from './table-paginator.component';
import {TableOverflowComponent} from './table-overflow.component';

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
    TfootComponent,
    TrComponent,
    TablePaginatorComponent,
    TableOverflowComponent,
  ],
  exports: [
    TableComponent,
    TbodyComponent,
    TdComponent,
    ThComponent,
    TheadComponent,
    TfootComponent,
    TrComponent,
    TablePaginatorComponent,
    TableOverflowComponent,
  ]
})
export class TableModule {
}
