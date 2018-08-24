import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxComponent),
  multi: true
};

@Component({
  selector: 'yc-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class CheckboxComponent implements ControlValueAccessor, OnChanges, OnDestroy {
  ngOnDestroy(): void {
    this.eventChange.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.changeDetectorRef.markForCheck();
  }

  @Input('checkState') checkState: number = 0; // 默认0 全选1 未全选2
  @Input('values') values = [true, false];
  @Input('attrId') attrId: string = 'checkbox' + (+new Date() + Math.floor(Math.random() * 1000000));
  @Input('label') label = '';
  @Input('desc') desc: string;
  @Input('disabled') disabled = false;
  @Output('changeEvent') eventChange = new EventEmitter<any>();

  checked: boolean;

  writeValue(obj: any): void {
    this.checked = obj;
    // this.checkState = 0;
    if (this.values instanceof Array && this.values.length == 2) {
      if (this.values[0] == obj) {
        this.checked = true;
      }
      if (this.values[1] == obj) {
        this.checked = false;
      }
    }
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

  click(event){
    event.stopPropagation();
  }

  change(event) {
    event.stopPropagation();
    let value = this.checked;
    if (this.values instanceof Array && this.values.length == 2) {
      if (this.checked) {
        value = this.values[0]
      } else {
        value = this.values[1]
      }
    }
    this.onChange(value);
    this.eventChange.emit(value);
  }
}
