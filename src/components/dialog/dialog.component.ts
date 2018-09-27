import {Component, Inject, OnInit, ViewChild, ViewContainerRef, HostListener, HostBinding, EventEmitter} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Subject} from 'rxjs';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'yc-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.less'],
  preserveWhitespaces: true,
  animations: [
    trigger('slideDialog', [
      state('enter', style({transform: 'none', opacity: 1})),
      state('void', style({transform: 'translate3d(0, 25%, 0) scale(0.9)', opacity: 0})),
      state('exit', style({transform: 'translate3d(0, 25%, 0)', opacity: 0})),
      transition('* => *', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
    ])
  ],
  host: {
    '[@slideDialog]': '_state',
    '(@slideDialog.start)': 'animationStarted($event)',
    '(@slideDialog.done)': 'animationDone($event)',
  }
})
export class DialogComponent implements OnInit {
  ngOnInit(): void {
  }

  _state: 'void' | 'enter' | 'exit' = 'enter';
  closeSubject = new Subject();
  description;
  config;

  constructor(@Inject(DOCUMENT) private document: Document) {
  }

  @ViewChild('container', {read: ViewContainerRef}) containerRef: ViewContainerRef;

  _animationStateChanged = new EventEmitter<AnimationEvent>();

  close() {
    this._state = 'exit';
    this.closeSubject.next(false);
  }

  ok() {
    this.closeSubject.next(true);
  }

  animationStarted(event) {
    this._animationStateChanged.emit(event);

  }

  animationDone(event) {
    this._animationStateChanged.emit(event);
  }

}
