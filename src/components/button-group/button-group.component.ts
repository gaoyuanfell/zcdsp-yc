import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

export interface Props {
  value?: string;
  label?: string;
  desc?: string;
  disabled?: string;
  checked?: string;
}

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ButtonGroupComponent),
  multi: true
};

@Component({
  selector: 'yc-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  providers: [
    CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR
  ]
})
export class ButtonGroupComponent implements ControlValueAccessor, OnChanges, OnDestroy {
  ngOnDestroy(): void {
    this.eventChange.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.changeDetectorRef.markForCheck();
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  value;
  @Input() list;

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

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(obj: any): void {
    this.value = obj;
    this.changeDetectorRef.markForCheck();
  }

  onChange = (value: any) => {
  };

  select(data) {
    let value = this.value = data[this._props.value];
    this.onChange(value);
    this.eventChange.emit(data);
  }

  @Output('changeEvent') eventChange = new EventEmitter<any>();

}
