import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report.component';
import { CustomerComponent } from './customer/customer.component';
import {Module} from '../../module';

@NgModule({
  imports: [
    CommonModule,
    ReportRoutingModule,
    Module
  ],
  declarations: [ReportComponent, CustomerComponent]
})
export class ReportModule { }
