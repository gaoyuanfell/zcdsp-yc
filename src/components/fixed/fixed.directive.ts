import {Directive, ElementRef, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Global} from '../../service/global';

@Directive({
  selector: '[ycFixed]'
})
export class FixedDirective implements OnInit, OnDestroy {

  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    this._global.overflowSubject.subscribe(data => {
      this.renderer.setStyle(this.ref.nativeElement, 'top', `${data.top}px`);
      this.renderer.setStyle(this.ref.nativeElement, 'left', `${data.left}px`);
    });
  }

  constructor(private _global: Global, private ref: ElementRef, private renderer: Renderer2) {

  }
}
