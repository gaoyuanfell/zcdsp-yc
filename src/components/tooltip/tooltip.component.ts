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
  @Input()
  set result(value) {
    console.log(value)
    console.log('#################################################')
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
    console.log('要执行到这里才会有用')
    console.log(this.result)
  }
  get getClass() {
    if (!this.placement) return {};
    let c: any = {};
    c[`popover-${this.placement}`] = true;
    return c;
  }


}
