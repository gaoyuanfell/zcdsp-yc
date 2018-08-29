import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {AnchorLinkComponent} from './anchor-link.component';
import {ScrollService} from '../back-top/scroll.service';
import {DOCUMENT} from '@angular/common';
import {fromEvent, Subscription} from 'rxjs';
import {distinctUntilChanged, throttleTime} from 'rxjs/operators';

@Component({
  selector: 'yc-anchor',
  templateUrl: './anchor.component.html',
  styleUrls: ['./anchor.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
})
export class AnchorComponent implements OnInit, OnDestroy, AfterViewInit {
  links: AnchorLinkComponent[] = [];
  animating
  scroll$: Subscription = null;

  private _overflow;

  private _bounds = 5;
  private _offsetTop = 180;

  get offsetTop() {
    return this._offsetTop;
  }

  @Input() set offsetTop(value) {
    this._offsetTop = +value;
  }

  get bounds() {
    return this._bounds;
  }

  @Input() set bounds(value) {
    this._bounds = value;
  }

  get overflow() {
    return this._overflow;
  }

  @Input() set overflow(value) {
    this._overflow = value;
  }

  private getTarget(): Element | Window {
    return this._overflow || window;
  }

  registerLink(link: AnchorLinkComponent): void {
    this.links.push(link);
  }

  unregisterLink(link: AnchorLinkComponent): void {
    this.links.splice(this.links.indexOf(link), 1);
  }

  private clearActive(): void {
    this.links.forEach(i => i.active = false);
  }

  private removeListen(): void {
    if (this.scroll$) {
      this.scroll$.unsubscribe();
    }
  }

  handleScrollTo(link: AnchorLinkComponent) {
    const el = <HTMLElement>this.document.querySelector(link.anchorLink);
    if (!el) {
      return;
    }
    this.clearActive();
    link.active = true;
    this.animating = true;
    // console.log(el)
    // console.log(el.offsetTop)
    // console.log(el.offsetLeft)
    this._scrollService.scrollTo(this.getTarget(), {top: el.offsetTop, left: el.offsetLeft}, null, () => {
      this.animating = false;
    })
  }

  private getOffsetTop(element: HTMLElement): number {
    if (!element || !element.getClientRects().length) {
      return 0;
    }
    const rect = element.getBoundingClientRect();
    if (!rect.width && !rect.height) {
      return rect.top;
    }
    return rect.top - element.ownerDocument.documentElement.clientTop;
  }

  handleScroll(): void {
    if (this.animating || !this.links.length) {
      return;
    }

    const sections = [];
    this.links.forEach(link => {
      const el = <HTMLElement>this.document.querySelector(link.anchorLink);
      if (!el) {
        return;
      }
      const scope = (this.offsetTop || 0) + this.bounds;

      if (el && this.getOffsetTop(el) < scope) {
        const top = this.getOffsetTop(el);
        sections.push({
          top,
          link
        });
      }
    });
    let visible = !!sections.length;
    if (!visible) {
      this.clearActive();
    } else {
      const maxSection = sections.reduce((prev, curr) => curr.top > prev.top ? curr : prev);
      this.clearActive();
      maxSection.link.active = true
      this.cdr.markForCheck()
    }
  }

  ngOnDestroy(): void {
    this.removeListen()
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    // console.log(this.yy)
    this.scroll$ = fromEvent(this.getTarget(), 'scroll').pipe(throttleTime(50), distinctUntilChanged())
      .subscribe(e => this.handleScroll());
  }


  constructor(private _scrollService: ScrollService,
              private cdr: ChangeDetectorRef,
              // private yy: AnchorLinkComponent,
              @Inject(DOCUMENT) private document: Document) {
  }
}
