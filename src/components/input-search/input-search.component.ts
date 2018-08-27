import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputSearchComponent),
  multi: true
};

@Component({
  selector: 'yc-input-search',
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
  providers: [
    CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR
  ]
})
export class InputSearchComponent implements OnInit, ControlValueAccessor, OnChanges {

  _value;
  @Input() placeholder = '输入搜索名称';
  @Output() changeEvent = new EventEmitter<any>();

// 写出去
  search() {
    this.onChange(this._value);
    this.changeEvent.emit();
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  onChange = (value) => {
  }

  ngOnInit() {
  }

  registerOnChange(fn: any): void {   // 每次控件view层的值发生改变，都要调用该方法通知外部model
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

// 刷新 保留数据 从父亲写进来
  writeValue(obj: any): void {
    this._value = obj;
    this.changeDetectorRef.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }


}
