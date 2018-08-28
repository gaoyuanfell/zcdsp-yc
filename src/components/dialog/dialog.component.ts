import {Component, Inject, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
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
  }
})
export class DialogComponent implements OnInit {
  ngOnInit(): void {
    this._fullMaxHeight = this.document.body.clientHeight - 60 + 'px';
  }

  _fullMaxHeight;
  _state: 'void' | 'enter' | 'exit' = 'enter';
  closeSubject = new Subject();
  description;
  config;

  get fullMaxHeight() {
    if (!this.config) return null;
    if (this.config.fullScreen) return {'max-height': this.document.body.clientHeight - 60 + 'px', 'height': this.document.body.clientHeight - 60 + 'px'}
    return {
      'max-height': this.config.maxHeight || '80vh'
    };
  }

  constructor(@Inject(DOCUMENT) private document: Document) {
  }

  @ViewChild('container', {read: ViewContainerRef}) containerRef: ViewContainerRef;

  close() {
    this.closeSubject.next(false);
  }

  ok() {
    this.closeSubject.next(true);
  }

}
