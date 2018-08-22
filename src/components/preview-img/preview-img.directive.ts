import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {PreviewImg} from './preview-img.service';

@Directive({
  selector: '[preview-img]',
  exportAs: 'previewImg'
})
export class PreviewImgDirective {
  constructor(private _previewImg: PreviewImg, private ref: ElementRef) {
    console.dir(ref)
  }

  @Input('list') previewImg;
  @Input('config') config;

  @HostListener('click', ['$event'])
  show(event) {
    let position = {
      x: event.x,
      y: event.y,
    };
    this._previewImg.open(this.previewImg, {...this.config, ...position})
  }
}
