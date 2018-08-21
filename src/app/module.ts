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
import {LoadingModule} from '../components/loading/loading.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ModulePipe,

    NotificationModule,
  ],
  declarations: [],
  exports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ModulePipe,

    NotificationModule,
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
