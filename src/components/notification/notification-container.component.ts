import {Component} from '@angular/core';

@Component({
  selector: 'yc-notification-container',
  template: `
    <ng-template [ngIf]="stackList?.length">
      <yc-notification *ngFor="let s of stackList; let i = index;" [message]="s" [index]="i"></yc-notification>
    </ng-template>
  `,
  styles: [
    `
      :host {
        top: 20px;
        right: 0;
        position: fixed;
        z-index: 1000000;
        width: 335px;
        margin-right: 24px;
      }
    `
  ],
})
export class NotificationContainerComponent {

  stackList = [];

  constructor() {
  }

  createMessage(option) {
    if (this.stackList.length >= 7) {
      this.stackList.splice(0, 1);
    }
    this.stackList.push(option);
  }

  removeMessage(messageId) {
    this.stackList.some((message, index) => {
      if (message.messageId === messageId) {
        this.stackList.splice(index, 1);
        message.subject.next();
        return true;
      }
    });
  }
}
