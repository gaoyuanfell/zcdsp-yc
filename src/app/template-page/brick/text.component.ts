import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Configure} from './interface';

@Component({
  selector: 'text-template',
  template: `
    <div class="text-style" [ngStyle]="configure?.style" [innerHTML]="html(configure.value)"></div>
  `,
  styles: [
    `
      .text-style {
        margin: 0;
        padding: 0;
        word-wrap: break-word;
        word-break: break-all;
        overflow: hidden;
      }
    `
  ]
})
export class TextComponent implements OnInit {

  type = 'text';

  private _configure: Configure = {
    style: {
      'margin-top.px': 10,
      'margin-right.px': 10,
      'margin-bottom.px': 10,
      'margin-left.px': 10,

      'border-radius.px': 0,
      'border-width.px': 2,
      'border-color': '#cccccc',
      'border-style': 'none',
      'background-color': 'transparent'
    }
  };

  get configure(): Configure {
    return this._configure;
  }

  @Input() set configure(value: Configure) {
    this._configure = value;
  }

  html(val) {
    return this._domSanitizer.bypassSecurityTrustHtml(val || '');
  }

  constructor(private _domSanitizer: DomSanitizer) {
  }

  ngOnInit() {
  }

}
