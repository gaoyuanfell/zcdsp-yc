import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, Renderer2} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'yc-preview-img',
  templateUrl: './preview-img.component.html',
  styleUrls: ['./preview-img.component.less'],
  animations: [
    trigger('fadeIn', [
      transition('void => *', [
        style({opacity: 0}),
        animate(150, style({opacity: 1}))
      ]),
      transition('* => void', [
        animate(150, style({opacity: 0}))
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewImgComponent implements OnInit {

  private _imgList;

  get imgList() {
    return this._imgList;
  }

  set imgList(value) {
    this._imgList = value;
    if (this._imgList instanceof Array && this._imgList.length) {
      this._img = this._imgList[this.index];
    }
  }

  config;

  index = 0;

  style;
  styleBox;

  isOpen = false;
  isAnimation = false;

  private _img;

  get img() {
    return this._img;
  }

  set img(value) {
    this._img = value;
  }

  imgLoad(imgRef: HTMLImageElement) {
    let width = imgRef.width;
    let height = imgRef.height;
    let clientHeight = this.document.body.clientHeight;
    let clientWidth = this.document.body.clientWidth;

    if (width > height) {
      this.style = {
        transform: `translate3d(${(clientWidth - width) / 2}px, ${(clientHeight - height) / 2}px, 0px)`,
        'transform-origin': 'left top'
      };
    } else {
      this.style = {
        transform: `translate3d(${(clientWidth - width) / 2}px, ${(clientHeight - height) / 2}px, 0px)`,
        'transform-origin': 'left top'
      };
    }


    // this.style = {
    //   transform: `translate3d(${(clientWidth - width) / 2}px, ${(clientHeight - height) / 2}px, 0px) scale3d(${clientWidth / 0.9 / width }, ${clientHeight / 0.9 / height }, 1)`,
    // };
    // this.styleBox = {
    //   overflow: 'auto'
    // };
    this.cdr.markForCheck();
  }

  open(config?) {
    this.config = config;
    this.setStyle();
    this.isOpen = true;
    this.cdr.markForCheck();
  }

  close() {
    if (this.isAnimation) return;
    this.isAnimation = true;
    this.setStyle();
    setTimeout(() => {
      this.isOpen = false;
      this.isAnimation = false;
      // this.styleBox = null;
      this.cdr.markForCheck();
    }, 300);
  }

  setStyle() {
    let x;
    let y;
    if (this.config) {
      x = this.config.x || this.document.body.clientWidth / 2;
      y = this.config.y || this.document.body.clientHeight / 2;
    }
    this.style = {
      transform: `translate3d(${x}px, ${y}px, 0px) scale(0.1,0.1)`,
      'transform-origin': 'left top',
      'opacity': 0,
    };
  }

  constructor(private cdr: ChangeDetectorRef,
              @Inject(DOCUMENT) private document: Document,
              private renderer: Renderer2) {
  }

  ngOnInit() {

  }

}
