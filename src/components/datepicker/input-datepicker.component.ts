import {Component, ElementRef, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputDatepickerComponent),
  multi: true
};

@Component({
  selector: 'input-datepicker',
  templateUrl: './input-datepicker.component.html',
  styleUrls: ['./input-datepicker.component.less'],
  providers: [
    CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR
  ]
})
export class InputDatepickerComponent implements ControlValueAccessor, OnInit, OnDestroy {
  ngOnDestroy(): void {

  }

  private onChange: (value: any) => void = () => {
  };

  _onTouched = () => {
  };

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn
  }

  writeValue(obj: any): void {
    this.fieldValue = obj;
    this.showValue()
  }

  fieldValue

  value;

  constructor(private renderer: Renderer2,
              private ref: ElementRef) {

  }

  selectedValue: number[] = [];
  @Input() borderNone = false;
  ngOnInit() {
    if (this.borderNone) {
      this.renderer.addClass(this.ref.nativeElement, 'border-none')
    }
    this.showValue()
  }

  showValue() {
    if(this.fieldValue instanceof Array){
      let value = [];
      this.fieldValue.forEach(f => {
        if (f) {
          value.push(new Date(f).formatDate('yyyy-MM-dd'));
        }
      });
      this.value = value.join(' ~ ');
    }
    if (this.query && this.appendField) {
      let value = [];
      this.appendField.forEach(f => {
        let queryValue = this.query[f];
        if (queryValue) {
          value.push(new Date(queryValue).formatDate('yyyy-MM-dd'));
        }
      });
      this.value = value.join(' ~ ');
      this.selectedValue = value.map(v => {
        let d = new Date(v);
        d.setMilliseconds(0);
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        return d.getTime();
      });
    }
  }

  @Input() isRange = false;
  @Input() isShortcutKey = true;

  @Input('query') query;
  @Input('appendField') appendField;
  @Input('width') width: number = 240;
  @Input() placeholder = '请选择...';
  @Input() allowClear = false;
  @Input() disabledTodayAfter = false;
  @Input() disabledTodayBefore = false;

  @Output('search') searchEvent = new EventEmitter<any>();

  selectedChange(data) {
    if (this.query && this.appendField) {
      this.appendField.forEach((f, i) => {
        this.query[f] = data[i];
      });
    }
    this.searchEvent.emit();
    this.onChange(data);
  }

  showClose(event: Event, active, close) {
    event.stopPropagation();
    event.preventDefault();
    if (!this.value || !this.allowClear) return;
    this.renderer.addClass(active, 'active');
    this.renderer.addClass(close, 'close');
  }

  hideClose(event: Event, active, close) {
    event.stopPropagation();
    event.preventDefault();
    if (!this.value || !this.allowClear) return;
    this.renderer.removeClass(active, 'active');
    this.renderer.removeClass(close, 'close');
  }

  removeValue(event: Event, active, close) {
    if (!this.value || !this.allowClear) return;
    event.stopPropagation();
    event.preventDefault();
    this.value = null;
    this.selectedValue = [];
    if (this.query && this.appendField) {
      this.appendField.forEach(f => {
        Reflect.deleteProperty(this.query, f);
      });
    }
    this.searchEvent.emit();
    this.renderer.removeClass(active, 'active');
    this.renderer.removeClass(close, 'close');
  }
}
