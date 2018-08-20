import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NotificationContainerComponent} from './notification-container.component';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'yc-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.less'],
  preserveWhitespaces: false,
  animations: [
    trigger('enterLeave', [
      state('enterRight', style({opacity: 1, transform: 'translateX(0)'})),
      transition('* => enterRight', [
        style({opacity: 0, transform: 'translateX(5%)'}),
        animate('100ms linear')
      ]),
      state('enterLeft', style({opacity: 1, transform: 'translateX(0)'})),
      transition('* => enterLeft', [
        style({opacity: 0, transform: 'translateX(-5%)'}),
        animate('100ms linear')
      ]),
      state('leave', style({
        opacity: 0,
        transform: 'scaleY(0.8)',
        transformOrigin: '0% 0%'
      })),
      transition('* => leave', [
        style({
          opacity: 1,
          transform: 'scaleY(1)',
          transformOrigin: '0% 0%'
        }),
        animate('100ms linear')
      ])
    ])
  ],
})
export class NotificationComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    if (this._autoErase) {
      this._clearEraseTimeout();
    }
  }

  private _eraseTimer: number = null;
  private _autoErase: boolean = false;

  constructor(private _notificationContainer: NotificationContainerComponent) {
  }

  ngOnInit() {
    this._autoErase = this.message.options.duration > 0;
    if (this._autoErase) {
      this._startEraseTimeout();
    }
  }

  @Input() message;
  @Input() index;

  close() {
    this.message.state = 'leave';
    window.setTimeout(() => {
      this._notificationContainer.removeMessage(this.message.messageId);
    }, 200);
    if (this._autoErase) {
      this._clearEraseTimeout();
    }
  }

  get state() {
    if (this.message.state === 'enter') {
      return 'enterRight';
    }
    return this.message.state;
  }

  onEnter() {
    if (this._autoErase) {
      this._clearEraseTimeout();
    }
  }

  onLeave() {
    if (this._autoErase) {
      this._startEraseTimeout();
    }
  }

  private _startEraseTimeout(): void {
    this._clearEraseTimeout();
    this._eraseTimer = window.setTimeout(() => this.close(), this.message.options.duration || 4500);
  }

  private _clearEraseTimeout(): void {
    if (this._eraseTimer !== null) {
      window.clearTimeout(this._eraseTimer);
      this._eraseTimer = null;
    }
  }
}
