import {Component, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputColorPaletteComponent),
  multi: true
};

@Component({
  selector: 'input-color-palette',
  template: `
    <div class="input-color-palette-box">
      <div class="input-color-palette" yc-color-palette [(ngModel)]="value" (ngModelChange)="changeEvent($event)" [ngStyle]="{background: value || 'transparent'}"></div>
    </div>
  `,
  styles: [
      `
      .input-color-palette-box {
        border: 1px solid #ccc;
        padding: 3px;
        display: inline-block;
        width: 30px;
        height: 30px;
      }

      .input-color-palette {
        border: 1px solid #ccc;
        display: block;
        width: 100%;
        height: 100%;
      }
    `
  ],
  providers: [
    CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR
  ]
})
export class InputColorPaletteComponent implements ControlValueAccessor {

  changeEvent(data) {
    this.onChange(data)
  }

  value

  constructor() {

  }

  private onChange: (value: any) => void = () => {
  };

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(obj: any): void {
    this.value = obj
  }


}
