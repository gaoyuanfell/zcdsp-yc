import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxGroupComponent),
  multi: true
};

export interface Props {
  value?: string;
  label?: string;
  desc?: string;
  disabled?: string;
  checked?: string;
}

@Component({
  selector: 'yc-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class CheckboxGroupComponent implements ControlValueAccessor, OnChanges, OnDestroy {

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
  }

  @Input() disabled = false;
  @Input() object: '=' | '@' = '='; // = 表示按key @表示自身
  @Output('changeEvent') eventChange = new EventEmitter<any>();

  private _list;

  get list() {
    return this._list;
  }

  @Input() set list(value) {
    this._list = value;
  }

  ngOnDestroy(): void {
    this.eventChange.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.changeDetectorRef.markForCheck();
  }

  onChange = (value: any) => {
  };

  change() {
    let l = this._list.filter((data) => {
      if (data[this._props.checked]) {
        return data;
      }
    });
    if (this.object == '=') {
      l = l.map(d => {
        return d[this._props.value];
      });
    }
    if (l instanceof Array && l.length > 0) {
      this.onChange(l);
    } else {
      this.onChange(null);
    }
    this.eventChange.next(l);
  }

  writeValue(obj: any): void {
    if (obj instanceof Array && obj.length && this.list instanceof Array && this.list.length) {
      this.list.forEach(data => {
        if (obj.indexOf(data[this._props.value]) != -1) {
          data[this._props.checked] = true;
        }
      });
      this.changeDetectorRef.markForCheck();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }
}
