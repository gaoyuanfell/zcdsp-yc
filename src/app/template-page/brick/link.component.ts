import {Component, Input, OnInit} from '@angular/core';
import {Configure} from './interface';

@Component({
  selector: 'link-template',
  template: `
    <a target="_blank" [href]="configure.link || 'javascript:void (0)'" [ngStyle]="configure.style">{{configure.value}}</a>
  `,
  styles: [
    `
      a{
        display: block;
      }
    `
  ]
})
export class LinkComponent implements OnInit {

  type = 'link';

  private _configure: Configure = {
    style: {
      'margin-top.px': 10,
      'margin-right.px': 15,
      'margin-bottom.px': 10,
      'margin-left.px': 15,
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
