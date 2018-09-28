import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SwitchInputComponent),
  multi: true
};

@Component({
  selector: 'yc-switch-input',
  exportAs: 'switchInput',
  templateUrl: './switch-input.component.html',
  styleUrls: ['./switch-input.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
  providers: [
    CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR,
  ]
})
export class SwitchInputComponent implements OnInit, ControlValueAccessor, OnChanges {

  @Input() size;
  @Input('values') values = [true, false];
  @Input('disabled') disabled = false;
  @Output() eventChange = new EventEmitter<any>();

  @HostListener('click', ['$event']) click(event) {
    event.stopPropagation();
  }

  trigger() {
    this._value = !this._value;
    let value = this._value;
    if (this.values instanceof Array && this.values.length == 2) {
      if (value) {
        value = this.values[0];
      } else {
        value = this.values[1];
      }
    }
    this.onChange(value);
  }

  onChange = (value) => {
  };

  writeValue(obj: any): void {
    this._value = obj;
    if (this.values instanceof Array && this.values.length == 2) {
      if (this.values[0] == obj) {
        this._value = true;
      } else {
        this._value = false;
      }
    }
    this.changeDetectorRef.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  _onTouched = () => {
  };

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  _value: boolean;

  change() {
    let value = this._value;
    if (this.values instanceof Array && this.values.length == 2) {
      if (value) {
        value = this.values[0];
      } else {
        value = this.values[1];
      }
    }
    this._onTouched();
    this.onChange(value);
    this.eventChange.emit(value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.changeDetectorRef.markForCheck();
  }

}
