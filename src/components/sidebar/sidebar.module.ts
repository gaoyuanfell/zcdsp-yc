import {CommonModule} from '@angular/common';
import {OverlayModule} from '@angular/cdk/overlay';
import {NgModule} from '@angular/core';
import {SidebarComponent} from './sidebar.component';
import {Sidebar} from './sidebar';


@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
  ],
  declarations: [
    SidebarComponent
  ],
  exports: [
    SidebarComponent
  ],
  providers: [
    Sidebar
  ],
  entryComponents: [
    SidebarComponent
  ]
})
export class SidebarModule {
}
