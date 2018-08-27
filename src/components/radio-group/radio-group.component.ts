import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RadioGroupComponent),
  multi: true
};

export interface Props {
  value?: string
  label?: string
  desc?: string
  disabled?: string
  checked?: string
}

@Component({
  selector: 'yc-radio-group',
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class RadioGroupComponent implements ControlValueAccessor, OnChanges, OnDestroy {

  value;

  _props: Props = {
    value: 'value',
    label: 'label',
    desc: 'desc',
    disabled: 'disabled',
    checked: 'checked',
  };

  @Input('props') set props(val: Props) {
    if (val) {
      Object.assign(this._props, val);
      Object.assign(val, this._props);
      this._props = val;
    }
  };

  name = 'radio' + (+new Date() + Math.floor(Math.random() * 1000000));

  @Input('list') list;
  @Input() disabled = false;
  @Output('changeEvent') eventChange = new EventEmitter<any>();

  ngOnDestroy(): void {
    this.eventChange.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.changeDetectorRef.markForCheck();
  }

  writeValue(obj: any): void {
    this.value = obj;
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

  change() {
    this.onChange(this.value);
    this.eventChange.emit(this.value);
  }
}
