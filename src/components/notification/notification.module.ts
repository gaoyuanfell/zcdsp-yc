import {CommonModule} from '@angular/common';
import {OverlayModule} from '@angular/cdk/overlay';
import {NgModule} from '@angular/core';
import {Notification} from './notification';
import {NotificationComponent} from './notification.component';
import {NotificationContainerComponent} from './notification-container.component';


@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
  ],
  declarations: [
    NotificationComponent,
    NotificationContainerComponent
  ],
  providers: [
    Notification
  ],
  entryComponents: [
    NotificationContainerComponent,
  ]
})
export class NotificationModule {

}
