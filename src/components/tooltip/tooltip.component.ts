import {Component, OnInit, Input, ViewChild} from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.less'],
})
export class TooltipComponent implements OnInit {
  @ViewChild('popover') popover;
  constructor() { }
  _result;
  _ycTitle;
  @Input() widthExp;
  @Input() colorExp;
  @Input()
  set result(value) {
    this._result = value;
    this.flag = this._result instanceof Array;
  };
  get result() {
    return this._result;
  };
  @Input()
  set ycTitle(value) {
    this._ycTitle = value;
  }

  get ycTitle() {
    return this._ycTitle;
  }
  flag = false;
  @Input() placement: 'topLeft' | 'top' | 'topRight' | 'leftTop' | 'left' | 'leftBottom' | 'rightTop' | 'right' | 'rightBottom' | 'bottomLeft' | 'bottom' | 'bottomRight';
  ngOnInit() {

  }
  get getClass() {
    if (!this.placement) return {};
    let c: any = {};
    c[`popover-${this.placement}`] = true;
    return c;
  }


}
