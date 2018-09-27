import {Component, ElementRef, HostListener, Inject, Input, OnInit, PLATFORM_ID, Renderer2, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Configure} from './interface';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'slide-template',
  template: `
    <div class="img-list">

      <div class="img-list-roll flex-center" [ngStyle]="slideStyle" #imgList>
        <div class="img-item" *ngFor="let a of list;let index = index" [ngStyle]="{'width.px': width}">
          <div [ngStyle]="configure.style" class="image-item">
            <img [src]="a.value">
            <a class="img-link" *ngIf="a.link" target="_blank" [href]="a.link"></a>
          </div>
        </div>
      </div>
      <div class="slide-buttons">
        <span class="slide-button" [ngClass]="{'active': index === _index}" *ngFor="let a of list;let index = index" (click)="handChange(index)"></span>
      </div>
      <div style="min-height: 150px;width: 100%" *ngIf="list.length == 0"></div>
    </div>
  `,
  styles: [
    `
      .img-list {
        width: 100%;
        height: auto;
        overflow: hidden;
        position: relative;
      }

      .img-list-roll {
        transform: translate3d(0px, 0px, 0px);
        transition-duration: 250ms;
        overflow: hidden;
      }

      .img-item {
        display: inline-block;
        vertical-align: middle;
        height: auto;
        text-align: center;
      }

      .img-item img {
        max-width: 100%;
        margin: 0 auto;
        vertical-align: middle;
      }

      .image-item {
        position: relative;
      }

      .image-item .img-link {
        z-index: 2;
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }

      .slide-buttons {
        bottom: 10px;
        left: 0;
        width: 100%;
        position: absolute;
        text-align: center;
      }

      .slide-button {
        width: 8px;
        height: 8px;
        display: inline-block;
        border-radius: 100%;
        background: #000;
        opacity: .2;
        margin: 0 5px;
        cursor: pointer;
      }

      .slide-button.active {
        opacity: 1;
        background: #007aff;
      }
    `
  ]
})
export class SlideComponent implements OnInit {

  type = 'slide';

  @Input() time = 2500;

  private _width = 375;

  get width(): number {
    return this._width;
  }

  @Input() set width(value: number) {
    this._width = value;
  }

  private _list: Configure[] = [];


  get list(): Configure[] {
    return this._list;
  }

  private _configure: Configure = {
    style: {
      'margin-top.px': 0,
      'margin-right.px': 0,
      'margin-bottom.px': 0,
      'margin-left.px': 0,
    },
    speed: 2.5
  };

  get configure(): Configure {
    return this._configure;
  }

  @Input() set configure(value: Configure) {
    this._configure = value;
  }

  @Input() set list(value: Configure[]) {
    this._list = value;
    if (value instanceof Array) {
      let width = this._list.length * this._width;
      this.renderer.setStyle(this.imgListRef.nativeElement, 'width', `${width}px`);
      this.autoChange();
    }
  }

  @ViewChild('imgList') imgListRef: ElementRef;

  slideStyle: any = {};

  _index = 0;

  change(index) {
    this._index = index;
    this.slideStyle.transform = `translate3d(-${index * this._width}px, 0px, 0px)`;
  }

  changeMove(distance) {
    this.slideStyle.transform = `translate3d(${distance}px, 0px, 0px)`;
  }

  speedChange() {
    this.sleepStop();
    this.autoChange(this._index).catch(err => console.error(err));
  }

  handChange(index) {
    this.sleepStop();
    this.change(index);
    this.autoChange(index).catch(err => console.error(err));
  }

  _auto = true;
  _autoNumber = 0;

  async autoChange(index = 1) {
    if (isPlatformBrowser(this.platformId)) {
      while (this._auto) {
        ++this._autoNumber;
        let i = this._autoNumber;
        await this.sleep(this._configure.speed * 1000);
        if (i != this._autoNumber) break;
        if (index >= this._list.length) {
          index = 0;
        }
        this.change(index);
        ++index;
      }
    }
  }

  sleepStop() {
    ++this._autoNumber;
  }

  sleep(time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }

  setImg(url) {
    this.sleepStop();
    let width = (this._list.length + 1) * this._width;
    this.renderer.setStyle(this.imgListRef.nativeElement, 'width', `${width}px`);
    this._list.push({
      value: url
    });
    this.autoChange().catch(err => console.error(err));

  }

  removeImg(index) {
    this._list.splice(index, 1);
    let width = this._list.length * this._width;
    this.renderer.setStyle(this.imgListRef.nativeElement, 'width', `${width}px`);
  }

  spot = {
    x: 0,
    y: 0,
    w: 0,
    _x: 0,
    _y: 0
  };

  @HostListener('touchstart', ['$event']) touchstart(event: TouchEvent) {
    this.sleepStop();
    this.slideStyle['transition-duration'] = `0ms`;
    this.spot.w = this._index * this._width;
    this.spot.x = event.touches[0].clientX;
    this.spot.y = event.touches[0].clientY;
  }

  @HostListener('touchmove', ['$event']) touchmove(event: TouchEvent) {
    this.spot._x = event.touches[0].clientX;
    this.spot._y = event.touches[0].clientY;

    this.changeMove(-(this.spot.w + this.spot.x - this.spot._x));
  }

  @HostListener('touchend', ['$event']) touchend(event: TouchEvent) {
    this.slideStyle['transition-duration'] = `250ms`;
    let b = (this.spot.x - this.spot._x) / this._width;
    if (Math.abs(b) > 0.5) {
      let index = this._index;
      if (b > 0) {
        ++index;
      } else {
        --index;
      }
      if (index >= this._list.length) {
        index = 0;
      }
      if (index < 0) {
        index = this._list.length - 1;
      }
      this.change(index);
    } else {
      this.change(this._index);
    }
    this.autoChange(this._index + 1).catch(err => console.error(err));
  }

  constructor(private _domSanitizer: DomSanitizer,
              private renderer: Renderer2,
              @Inject(PLATFORM_ID) private platformId: Object,) {
  }

  ngOnInit() {

  }

}
