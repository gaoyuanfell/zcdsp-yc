import {NgModule} from '@angular/core';
import {HomeRoutingModule} from './home-routing.module';
import {Module} from '../module';
import {IndexComponent} from './index/index.component';
import {IndexExpandComponent} from './index/index-expand.component';
import {HomeComponent} from './home.component';

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
