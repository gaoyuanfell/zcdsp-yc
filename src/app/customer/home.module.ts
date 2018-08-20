import {NgModule} from '@angular/core';
import {HomeRoutingModule} from './home-routing.module';
import {Module} from '../module';
import {HomeComponent} from './home.component';
import {IndexComponent} from './index/index.component';

@NgModule({
  imports: [
    Module,
    HomeRoutingModule,
  ],
  declarations: [
    HomeComponent,
    IndexComponent,
  ],
})
export class HomeModule {
}
