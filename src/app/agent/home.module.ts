import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {HomeRoutingModule} from './home-routing.module';
import {Module} from '../module';
import {HomeComponent} from '../customer/home.component';
import {IndexComponent} from './index/index.component';
import {IndexExpandComponent} from './index/index-expand.component';

@NgModule({
  imports: [
    Module,
    HomeRoutingModule,
  ],
  declarations: [
    HomeComponent,
    IndexComponent,
    IndexExpandComponent,
  ],
})
export class HomeModule {
}
