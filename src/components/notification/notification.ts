import {Injectable} from '@angular/core';
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {NotificationContainerComponent} from './notification-container.component';
import {Subject} from 'rxjs';

let globalCounter = 0;

export interface MessageOption {
  duration?: number;
  maxStack?: number;
}

@Injectable()
export class Notification {

  private _container: NotificationContainerComponent;
  private overlayRef: OverlayRef;
  private _idPrefix = 'message';

  constructor(private overlay: Overlay) {

  }

  private _defaultOption: MessageOption = {
    duration: 3000,
    maxStack: 7
  };

  createMessage(message, options: MessageOption = {}) {
    if (!this.overlayRef) {
      const overlayConfig = new OverlayConfig({
        panelClass: 'popover-content-notification',
      });
      this.overlayRef = this.overlay.create(overlayConfig)
      this._container = this.overlayRef.attach(new ComponentPortal(NotificationContainerComponent)).instance;
    }
    let subject = new Subject();
    this._container.createMessage({
      ...message,
      state: 'enter',
      messageId: this._generateMessageId(),
      createdAt: new Date(),
      options: {
        ...this._defaultOption,
        ...options,
      },
      subject
    });
    return subject;
  }

  removeMessage(index) {
    this._container.removeMessage(index);
  }

  protected _generateMessageId(): string {
    return this._idPrefix + globalCounter++;
  }

  // constructor(private _overlay: Overlay) {
  //   super(_overlay, NotificationContainerComponent);
  // }

  success(title: string, content: string, options?: MessageOption) {
    return this.create('success', title, content, options);
  }

  error(title: string, content: string, options?: MessageOption) {
    return this.create('error', title, content, options);
  }

  info(title: string, content: string, options?: MessageOption) {
    return this.create('info', title, content, options);
  }

  warning(title: string, content: string, options?: MessageOption) {
    return this.create('warning', title, content, options);
  }

  blank(title: string, content: string, options?: MessageOption) {
    return this.create('blank', title, content, options);
  }

  create(type: 'success' | 'info' | 'warning' | 'error' | 'blank' | string, title: string, content: string, options?: MessageOption) {
    return this.createMessage({type, title, content}, options);
  }

}
