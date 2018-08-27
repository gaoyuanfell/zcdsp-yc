import {ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RadioComponent),
  multi: true
};

@Component({
  selector: 'yc-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class RadioComponent implements ControlValueAccessor, OnChanges {

  _value: any;

  @Input('value') value;
  @Input('desc') desc;
  @Input('label') label;
  @Input() disabled = false;
  @Input('values') values = [true, false];

  @Input('name') name;
  @Input('attrId') attrId: string = 'radio' + (+new Date() + Math.floor(Math.random() * 1000000));

  writeValue(obj: any): void {
    this._value = obj;
    this.changeDetectorRef.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  onChange = (value: any) => {
  };

  ngOnChanges(changes: SimpleChanges): void {
    this.changeDetectorRef.markForCheck();
  }

  change(value) {
    this.onChange(value);
  }
}
