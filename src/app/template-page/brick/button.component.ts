import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {Configure} from './interface';

@Component({
  selector: 'button-template',
  template: `
    <div style="text-align: center;" [ngStyle]="boxStyle">
      <a target="_blank" [href]="configure.link || 'javascript:void (0)'" [ngStyle]="configure.style">{{configure.value}}</a>
    </div>
  `,
  styles: [
      `
      a {
        cursor: pointer;
        width: 50%;
        height: 45px;
        border: 0;
        padding: 0;
        position: relative;
        z-index: 0;
        text-align: center;
        margin: 0 auto !important;
        display: inline-block;
        text-decoration: none;
        color: #fff;
      }
    `
  ]
})
export class ButtonComponent implements OnInit {

  type = 'button';

  get boxStyle() {
    if (this.configure.style) {
      return {
        'margin-top.px': this.configure.style['margin-top.px'],
        'margin-right.px': this.configure.style['margin-right.px'],
        'margin-bottom.px': this.configure.style['margin-bottom.px'],
        'margin-left.px': this.configure.style['margin-left.px'],
      }
    }
    return null;
  }

  private _configure: Configure = {
    style: {
      'margin-top.px': 0,
      'margin-right.px': 0,
      'margin-bottom.px': 0,
      'margin-left.px': 0,
      'background-color': '#20a0ff',
      'line-height.px': 45,
      'height.px': 45,
      'border-radius.px': 4,
      'font-size.px': 14,
      'color': '#ffffff',
      'width.%': 90,
    }
  };

  get configure(): Configure {
    return this._configure;
  }

  @Input() set configure(value: Configure) {
    this._configure = value;
  }

  constructor() {
  }

  ngOnInit() {
  }
}
