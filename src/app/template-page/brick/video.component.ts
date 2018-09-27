import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Configure} from './interface';

@Component({
  selector: 'video-template',
  template: `
    <div class="video-box flex-center-between">
      <video autoplay loop controls *ngIf="configure.value" [src]="configure.value"></video>
    </div>
  `,
  styles: [
    `
      .video-box{
        width: 100%;
        min-height: 200px;
      }
      .video-box video{
        width: 100%;
        height: 100%;
      }
    `
  ]
})
export class VideoComponent implements OnInit {

  type = 'video';

  private _configure: Configure = {};

  get configure(): Configure {
    return this._configure;
  }

  @Input() set configure(value: Configure) {
    this._configure = value;
  }

  constructor(private _domSanitizer: DomSanitizer) {
  }

  ngOnInit() {

  }

}
