import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';
import {ScrollService} from './scroll.service';

@Directive({
  selector: '[back-top]',
})
export class BackTopDirective {

  @Input() position = 0;
  @Input() target: Element;

  constructor(private el: ElementRef, private renderer: Renderer2, private scrollService: ScrollService) {
  }

  @HostListener('click', ['$event'])
  scroll(event) {
    // this.scrollService.scrollTo(this.target, this.position);
  }
}
