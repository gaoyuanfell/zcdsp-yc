import {Directive, ElementRef, HostBinding, HostListener, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {AnchorComponent} from './anchor.component';

@Directive({
  selector: '[anchor-link]',
  exportAs: 'anchorLink',
})
export class AnchorLinkComponent implements OnInit, OnDestroy {

  @HostBinding('class.active') private _active: boolean = false;


  get active(): boolean {
    return this._active;
  }

  @Input() set active(value: boolean) {
    this._active = value;
  }

  @Input('anchor-link') anchorLink = '#'

  ngOnDestroy(): void {
    this.anchor.unregisterLink(this)
  }

  ngOnInit(): void {
    this.renderer.addClass(this.el.nativeElement, 'anchor-item');
    this.anchor.registerLink(this)
  }

  @HostListener('click', ['$event'])
  goToClick(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this.anchor.handleScrollTo(this);
  }

  constructor(public el: ElementRef,
              private anchor: AnchorComponent,
              private renderer: Renderer2) {
  }
}
