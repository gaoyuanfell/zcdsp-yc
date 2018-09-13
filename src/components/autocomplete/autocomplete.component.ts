import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Optional,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {TemplatePortal} from '@angular/cdk/portal';
import {FlexibleConnectedPositionStrategy, Overlay, OverlayConfig, OverlayRef, PositionStrategy} from '@angular/cdk/overlay';
import {Directionality} from '@angular/cdk/bidi';
import {AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator} from '@angular/forms';
import {coerceBooleanProperty} from '@angular/cdk/coercion';

export interface Props {
  value?: string;
  label?: string;
  desc?: string;
  disabled?: string;
  checked?: string;
  hide?: string;
}

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AutocompleteComponent),
  multi: true
};

export function createPatternValidator(pattern) {
  return (control: AbstractControl): ValidationErrors => {
    return pattern.test(control.value) ? null : {'rangeError': {current: control.value, pattern: pattern}};
  };
}

export const EXE_PATTERN_VALIDATOR = {
  provide: NG_VALIDATORS,
  useValue: createPatternValidator,
  multi: true
};

@Component({
  selector: 'yc-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
  providers: [
    CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR,
    EXE_PATTERN_VALIDATOR
  ]
})
export class AutocompleteComponent implements OnInit, ControlValueAccessor, Validator {

  _props: Props = {
    value: 'value',
    label: 'label',
    desc: 'desc',
    disabled: 'disabled',
    checked: 'checked',
    hide: 'hide',
  };

  private value
  _value;
  _selected
  opened = false;

  private _overlayRef: OverlayRef | null;
  private _portal: TemplatePortal;
  private _positionStrategy: FlexibleConnectedPositionStrategy;

  @Input() width = 300;
  @Input() placeholder = '';
  @Input() pattern;
  private _required;

  get required() {
    return this._required;
  }

  @Input() set required(value) {
    this._required = coerceBooleanProperty(value);
  }

  private _list;

  get list() {
    return this._list;
  }

  @Input() set list(value) {
    this._list = value;
    this._setSelectionByValue();
  }

  get listShow() {
    if (this.list) {
      return this.list.filter(item => !item.hide);
    }
    return [];
  }

  @Input('props') set props(val: Props) {
    if (val) {
      Object.assign(this._props, val);
      Object.assign(val, this._props);
      this._props = val;
    }
  }

  @ViewChild(TemplateRef) template: TemplateRef<any>;

  @Output() selectedEvent = new EventEmitter<any>();
  @Output() inputEvent = new EventEmitter<any>();

  open() {
    if(this.opened) return;
    this._onTouched();

    if (!this._overlayRef) {
      this._portal = new TemplatePortal(this.template, this._viewContainerRef);
      this._overlayRef = this._overlay.create(this._getOverlayConfig());
    }

    if (this._overlayRef && !this._overlayRef.hasAttached()) {
      this._overlayRef.attach(this._portal);
      this._overlayRef.backdropClick().subscribe(() => {
        this.close();
      });
    }

    this.opened = true;
  }

  close() {
    if (this._overlayRef && this.opened) {
      if (this._overlayRef && this._overlayRef.hasAttached()) {
        this._overlayRef.detach();
      }
      this._overlayRef.dispose();
      this._overlayRef = null;
      this.opened = false;
    }
  }

  selected(data) {
    if(this._selected === data) return;
    this._selected = data
    this._value = data[this._props.label];
    this._onChange(data[this._props.value]);
    this.selectedEvent.emit(data);
    this.close();
  }

  _valueChange() {
    this._onChange(this._value);
    if (!this.list) return;
    this.list.forEach(item => {
      item[this._props.hide] = true;
      if (!!~item[this._props.label].indexOf(this._value)) item[this._props.hide] = false;
    });
    let length = this.list.filter(item => !item.hide).length
    console.info(length)
    if(length){
      this.open()

    }else{
      this.close()
    }
    this.inputEvent.emit(this._value);
  }

  private _getOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      positionStrategy: this._getOverlayPosition(),
      scrollStrategy: this._overlay.scrollStrategies.block(),
      backdropClass: '',
      hasBackdrop: true,
      width: this.width,
      direction: this._dir
    });
  }

  private _getOverlayPosition(): PositionStrategy {
    this._positionStrategy = this._overlay.position()
      .flexibleConnectedTo(this._ref)
      .withFlexibleDimensions(false)
      .withPush(false)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top'
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
        }
      ]);

    return this._positionStrategy;
  }

  _setSelectionByValue(){
    if(!this.list || !this.value) return;
    this._selected = this.list.find(item => item[this._props.value] == this.value);
    if(this._selected){
      this._value = this._selected[this._props.label]
    }else{
      this._value = this.value;
    }
    this._changeDetectorRef.markForCheck()
  }

  _validator

  constructor(private _viewContainerRef: ViewContainerRef,
              private _changeDetectorRef: ChangeDetectorRef,
              private _overlay: Overlay,
              private _ref: ElementRef,
              @Optional() private _dir: Directionality,) {
  }

  _onChange: (value: any) => void = () => {
  };
  _onTouched: () => void = () => {
  };

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  writeValue(obj: any): void {
    this.value = obj;
    this._setSelectionByValue()
  }

  registerOnValidatorChange(fn: () => void): void {
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return this.pattern ? this._validator(c) : null;
  }


  ngOnInit() {
    this._validator = createPatternValidator(this.pattern)
  }

}
