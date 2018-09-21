import {Directive, EventEmitter, HostListener, Input, OnInit, Output, Renderer2} from '@angular/core';

@Directive({
  selector: '[yc-scroll-more]'
})
export class ScrollMoreDirective implements OnInit {

  constructor(private renderer: Renderer2) {
  }

  ngOnInit() {

  }

  @Input() direction: 'x' | 'y' = 'y';
  @Input() offset: number = 50;
  @Output() loadMore = new EventEmitter<any>();

  private status = 0;

  recovery() {
    this.status = 0
  }

  @HostListener('scroll', ['$event'])
  scroll(event) {
    let client = 'clientHeight';
    let scroll = 'scrollTop';
    if (this.direction === 'x') {
      client = 'clientWidth';
      scroll = 'scrollLeft';
    }



    let h = Array.from<HTMLDivElement>(event.target.childNodes).map(cn => cn[client] || 0).reduce((a, b) => a + b)

    if (h - event.target[client] - event.target[scroll] <= this.offset) {
      if (this.status !== 0) return;
      this.status = 1;
      this.loadMore.emit({
        next: this.recovery.bind(this)
      });
    }
  }

}
