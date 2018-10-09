import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';

@Component({
  selector: 'cut-cards-item',
  template: `
    <ng-content></ng-content>
  `,
  styles: [
      `
      :host{
        position: absolute;
      }
    `
  ]
})
export class CutCardsItemComponent implements OnInit {
  constructor(private renderer:Renderer2, private elementRef:ElementRef) {
  }

  ngOnInit() {
  }

  private _left;
  private _right;
  private _top;
  private _bottom;
  private _width;
  private _height;
  private _zIndex;

  get left() {
    return this._left;
  }

  set left(value) {
    this._left = value;
    this.renderer.setStyle(this.elementRef.nativeElement, 'left', `${value}px`)
  }

  get right() {
    return this._right;
  }

  set right(value) {
    this._right = value;
    this.renderer.setStyle(this.elementRef.nativeElement, 'right', `${value}px`)
  }

  get top() {
    return this._top;
  }

  set top(value) {
    this._top = value;
    this.renderer.setStyle(this.elementRef.nativeElement, 'top', `${value}px`)
  }

  get bottom() {
    return this._bottom;
  }

  set bottom(value) {
    this._bottom = value;
    this.renderer.setStyle(this.elementRef.nativeElement, 'bottom', `${value}px`)
  }

  get width() {
    return this._width;
  }

  set width(value) {
    this._width = value;
    this.renderer.setStyle(this.elementRef.nativeElement, 'width', `${value}px`)
  }

  get height() {
    return this._height;
  }

  set height(value) {
    this._height = value;
    this.renderer.setStyle(this.elementRef.nativeElement, 'height', `${value}px`)
  }

  get zIndex() {
    return this._zIndex;
  }

  set zIndex(value) {
    this._zIndex = value;
    this.renderer.setStyle(this.elementRef.nativeElement, 'z-index', `${value}`)
  }
}
