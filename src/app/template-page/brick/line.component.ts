import {Component, Input, OnInit} from '@angular/core';
import {Configure} from './interface';

@Component({
  selector: 'line-template',
  template: `
    <div class="line-box" [ngStyle]="boxStyle">
      <div class="separator-line" [ngStyle]="style"></div>
    </div>
  `,
  styles: [
    `
      .separator-line {

      }
    `
  ]
})
export class LineComponent implements OnInit {

  type = 'line';

  get boxStyle() {
    if (this.configure.style) {
      return {

        'padding-right.px': this.configure.style['padding-right.px'],
        'padding-left.px': this.configure.style['padding-left.px'],
      };
    }
    return null;
  }

  get style() {
    if (this.configure.style) {
      return {
        'width.%': this.configure.style['width.%'],
        'margin-top.px': this.configure.style['margin-top.px'] / 2,
        'margin-bottom.px': this.configure.style['margin-bottom.px'] / 2,
        'border-top-width.px': this.configure.style['border-top-width.px'],
        'border-top-color': this.configure.style['border-top-color'],
        'border-top-style': this.configure.style['border-top-style'],
      };
    }
    return null;
  }

  private _configure: Configure = {
    style: {
      'width.%': 100,
      'margin-top.px': 10,
      'padding-right.px': 15,
      'margin-bottom.px': 10,
      'padding-left.px': 15,
      'border-top-width.px': 1,
      'border-top-color': '#2e90ff',
      'border-top-style': 'solid',
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
