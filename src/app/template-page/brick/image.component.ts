import {Component, OnInit} from '@angular/core';
import {Configure} from './interface';

@Component({
  selector: 'image-template',
  template: `
    <div class="img-list flex-wrap-center">
      <div class="img-none" style="height: 200px;" *ngIf="!list.length">

      </div>
      <ng-template [ngForOf]="list" ngFor let-img>
        <div [ngStyle]="img.style" class="image-item">
          <img [src]="img.value">
          <a class="img-link" *ngIf="img.link" target="_blank" [href]="img.link"></a>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .img-list { 
        width: 100%;
      }

      .image-item{
        position: relative;
        margin: auto;
      }
      
      .image-item .img-link{
        z-index: 2;
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
      
      img {
        max-width: 100%;
        max-height: 100%;
        display: block;
      }
    `
  ]
})
export class ImageComponent implements OnInit {

  type = 'image';

  private _list: Configure[] = [];

  get list(): Configure[] {
    return this._list;
  }

  set list(value: Configure[]) {
    this._list = value;
  }

  setImg(url) {
    let bo: Configure = {
      value: url,
      style: {
        'margin-top.px': 0,
        'margin-right.px': 'auto',
        'margin-bottom.px': 0,
        'margin-left.px': 'auto',
      }
    };
    this._list.push(bo);
  }

  removeImg(index) {
    this._list.splice(index, 1);
  }

  constructor() {
  }

  ngOnInit() {
  }

}
