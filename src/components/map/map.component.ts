import {Component, EventEmitter, forwardRef, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';


// 首先注册成为表单控件
const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MapComponent),
  multi: true
};

@Component({
  selector: 'yc-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less'],
  providers: [
    CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR
  ]
})
export class MapComponent  {

  constructor() {}

}
