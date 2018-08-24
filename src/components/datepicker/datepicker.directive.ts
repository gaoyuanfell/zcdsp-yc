import {ComponentRef, Directive, ElementRef, EventEmitter, forwardRef, HostListener, Inject, Injector, Input, OnDestroy, Output, Renderer2, ViewContainerRef} from '@angular/core';
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {DatepickerComponent} from './datepicker.component';
import {DOCUMENT} from '@angular/common';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatepickerDirective),
  multi: true
};

@Directive({
  selector: 'input[yc-date-picker]',
  exportAs: 'datePicker',
  providers: [
    CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR
  ]
})
export class DatepickerDirective implements ControlValueAccessor, OnDestroy {

  @Input('appendField') appendField;

  private onChange: (value: any) => void = () => {
  };

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(obj: any): void {
    this._ref.nativeElement.value = obj;
  }

  ngOnDestroy(): void {
    this.popupRef && this.popupRef.dispose();
    this.componentRef = null;
  }

  calendarPortal: ComponentPortal<DatepickerComponent>;
  popupRef: OverlayRef;
  componentRef: ComponentRef<DatepickerComponent>;

  constructor(private _overlay: Overlay,
              private _viewContainerRef: ViewContainerRef,
              private _renderer: Renderer2,
              private _ref: ElementRef,
              @Inject(DOCUMENT) private _document,
              private _injector: Injector) {
  }

  opened;
  private _selectedValue: number[] = [];

  get selectedValue(): number[] {
    return this._selectedValue;
  }

  @Input() set selectedValue(value: number[]) {
    this._selectedValue = value;
  }

  @HostListener('click', ['$event'])
  open() {
    if (this.opened) return;
    if (!this.calendarPortal) {
      this.calendarPortal = new ComponentPortal(DatepickerComponent, this._viewContainerRef, this._injector);
    }

    if (!this.popupRef) {
      const overlayConfig = new OverlayConfig({
        panelClass: 'datepicker-content-portal',
        backdropClass: '',
        hasBackdrop: true,
        scrollStrategy: this._overlay.scrollStrategies.block(),
        positionStrategy: this._overlay.position()
          .flexibleConnectedTo(this._ref)
          .withFlexibleDimensions(false)
          .withViewportMargin(8)
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
              overlayY: 'bottom'
            },
            {
              originX: 'end',
              originY: 'bottom',
              overlayX: 'end',
              overlayY: 'top'
            },
            {
              originX: 'end',
              originY: 'top',
              overlayX: 'end',
              overlayY: 'bottom'
            }
          ]).withDefaultOffsetY(1)
      });
      this.popupRef = this._overlay.create(overlayConfig);
      this.popupRef.backdropClick().subscribe(() => this.close());
    }

    if (!this.popupRef.hasAttached()) {
      this.componentRef = this.popupRef.attach(this.calendarPortal);
      this.componentRef.instance.disabledTodayAfter = this.disabledTodayAfter
      this.componentRef.instance.disabledTodayBefore = this.disabledTodayBefore
      this.componentRef.instance.isRange = this.isRange;
      this.componentRef.instance.isShortcutKey = this.isShortcutKey;
    }

    this.componentRef.instance.selectedValue = [...this.selectedValue];

    this.componentRef.instance.selectedChange.subscribe(data => {
      this.selectedValue = data;
      let value = data.map(d => new Date(d).formatDate('yyyy-MM-dd'));
      this._ref.nativeElement.value = value.join(' ~ ');
      this.close();
      this.onChange(value);
      this.selectedChange.emit(value);
    });
    this.opened = true;
    this.openEvent.emit()
  }

  close() {
    this.popupRef.detach();
    this.popupRef.detachBackdrop();
    this.opened = false;
    this.closeEvent.emit()
  }

  @Input() isRange = false;
  @Input() isShortcutKey = true;
  @Input() disabledTodayAfter = false;
  @Input() disabledTodayBefore = false;
  @Output('change') selectedChange: EventEmitter<any> = new EventEmitter<any>();
  @Output('open') openEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output('close') closeEvent: EventEmitter<any> = new EventEmitter<any>();
}
