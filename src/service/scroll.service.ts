import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {Subject} from 'rxjs';
import {Observable} from 'rxjs/src/internal/Observable';

///////////////////////////////////////////////

const availablePrefixs = ['moz', 'ms', 'webkit'];

function requestAnimationFramePolyfill(): typeof requestAnimationFrame {
  let lastTime = 0;
  return function (callback: FrameRequestCallback): number {
    const currTime = new Date().getTime();
    const timeToCall = Math.max(0, 16 - (currTime - lastTime));
    const id = window.setTimeout(() => {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
}

function getRequestAnimationFrame(): typeof requestAnimationFrame {
  if (typeof window === 'undefined') {
    return () => null;
  }
  if (window.requestAnimationFrame) {
    // https://github.com/vuejs/vue/issues/4465
    return window.requestAnimationFrame.bind(window);
  }

  const prefix = availablePrefixs.filter(key => `${key}RequestAnimationFrame` in window)[0];

  return prefix
    ? window[`${prefix}RequestAnimationFrame`]
    : requestAnimationFramePolyfill();
}

export function cancelRequestAnimationFrame(id: number): any {
  if (typeof window === 'undefined') {
    return null;
  }
  if (window.cancelAnimationFrame) {
    return window.cancelAnimationFrame(id);
  }
  const prefix = availablePrefixs.filter(key =>
    `${key}CancelAnimationFrame` in window || `${key}CancelRequestAnimationFrame` in window,
  )[0];

  return prefix ?
    (
      (window as any)[`${prefix}CancelAnimationFrame`] ||
      (window as any)[`${prefix}CancelRequestAnimationFrame`]
    ).call(this, id) : clearTimeout(id);
}

const reqAnimFrame = getRequestAnimationFrame();

//////////////////////////////////////////////////////

export type EasyingFn = (t: number, b: number, c: number, d: number) => number;

function easeInOutCubic(t: number, b: number, c: number, d: number): number {
  const cc = c - b;
  let tt = t / (d / 2);
  if (tt < 1) {
    return cc / 2 * tt * tt * tt + b;
  } else {
    return cc / 2 * ((tt -= 2) * tt * tt + 2) + b;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private doc: Document;

  constructor(@Inject(DOCUMENT) doc: any) {
    this.doc = doc;
  }

  /** 设置 `el` 滚动条位置 */
  setScrollTop(el: Element | Window, options: ScrollToOptions = {left: 0, top: 0}): void {
    if (el === window) {
      this.doc.body.scrollTo(options);
      this.doc.documentElement.scrollTo(options);
    } else {
      (el as Element).scrollTo(options);
    }
  }

  /**
   *
   * @param {Element | Window} el
   * @param {HTMLElement} element
   */
  setScrollTopByElement(el: Element | Window, element: HTMLElement): void {
    this.scrollTo(el, {
      left: element.offsetLeft,
      top: element.offsetTop
    });
  }

  /** 获取 `el` 相对于视窗距离 */
  getOffset(el: Element): { top: number, left: number } {
    const ret = {
      top: 0,
      left: 0
    };
    if (!el || !el.getClientRects().length) return ret;

    const rect = el.getBoundingClientRect();
    if (rect.width || rect.height) {
      const doc = el.ownerDocument.documentElement;
      ret.top = rect.top - doc.clientTop;
      ret.left = rect.left - doc.clientLeft;
    } else {
      ret.top = rect.top;
      ret.left = rect.left;
    }

    return ret;
  }

  /** 获取 `el` 滚动条位置 */
  // TODO: remove '| Window' as the fallback already happens here
  getScroll(el?: Element | Window, top: boolean = true): number {
    const target = el ? el : window;
    const prop = top ? 'pageYOffset' : 'pageXOffset';
    const method = top ? 'scrollTop' : 'scrollLeft';
    const isWindow = target === window;
    let ret = isWindow ? target[prop] : target[method];
    if (isWindow && typeof ret !== 'number') {
      ret = this.doc.documentElement[method];
    }
    return ret;
  }

  /**
   * 使用动画形式将 `el` 滚动至某位置
   *
   * @param containerEl 容器，默认 `window`
   * @param targetTopValue 滚动至目标 `top` 值，默认：0，相当于顶部
   * @param easing 动作算法，默认：`easeInOutCubic`
   * @param callback 动画结束后回调
   */
  scrollTo(containerEl: Element | Window,
           options: ScrollToOptions = {left: 0, top: 0},
           easing?: EasyingFn,
           callback?: () => void): Observable<any> {
    const target = containerEl ? containerEl : window;
    const scrollTop = this.getScroll(target);
    const scrollLeft = this.getScroll(target, false);
    const startTime = Date.now();
    const subject = new Subject<any>();
    const frameFunc = () => {
      const timestamp = Date.now();
      const time = timestamp - startTime;
      this.setScrollTop(target, {
        left: (easing || easeInOutCubic)(time, scrollLeft, options.left, 300),
        top: (easing || easeInOutCubic)(time, scrollTop, options.top, 300)
      });
      if (time < 300) {
        reqAnimFrame(frameFunc);
      } else {
        if (callback) callback();
        subject.next();
      }
    };
    reqAnimFrame(frameFunc);
    return <any>subject;
  }
}
