import {Component, Input, ViewChild, ViewContainerRef, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'yc-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.less'],
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
})
export class PopoverComponent {

  constructor() {
  }

  @Input() placement: 'topLeft' | 'top' | 'topRight' | 'leftTop' | 'left' | 'leftBottom' | 'rightTop' | 'right' | 'rightBottom' | 'bottomLeft' | 'bottom' | 'bottomRight';

  get getClass() {
    if (!this.placement) return {};
    let c: any = {};
    c[`popover-${this.placement}`] = true;
    return c;
  }

  @ViewChild('container', {read: ViewContainerRef}) containerRef: ViewContainerRef;
}
