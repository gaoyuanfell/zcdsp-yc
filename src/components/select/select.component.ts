import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, HostListener, Inject, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {TemplatePortal} from '@angular/cdk/portal';
import {fromEvent} from 'rxjs';
import {filter} from 'rxjs/operators';
import {DOCUMENT} from '@angular/common';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectComponent),
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
  selector: 'yc-select',
  exportAs: 'ycSelect',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.less'],
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class SelectComponent implements ControlValueAccessor, OnDestroy, OnInit, OnChanges {

  _props: Props = {
    value: 'value',
    label: 'label',
    desc: 'desc',
    disabled: 'disabled',
    checked: 'checked'
  };

  @Input('props') set props(val: Props) {
    if (val) {
      Object.assign(this._props, val);
      Object.assign(val, this._props);
      this._props = val;
    }
  }

  private keyupObservable;
  private clickObservable;

  private overlayRef: OverlayRef | null;
  private portal: TemplatePortal<{}>;
  private _value = '';
  _opened;
  _list: Array<any>;
  _selectValue;
  _autoValue;
  _searchValue;

  @Input() width = 160;
  @Input() placeholder = '请选择...';
  @Input() searchCtrl = false;
  @Input() whole;
  @Output() selectedEvent = new EventEmitter<any>();
  @Input() borderNone = false;
  @Input() allowClear = false;
  @Input() disabled = false;

  @ViewChild('template') template: TemplateRef<any>;
  @ViewChild('input') inputRef: ElementRef;

  get list(): Array<any> {
    if (!this._searchValue) return this._list;
    return this.filterList();
  }

  @Input() set list(value: Array<any>) {
    this._list = value;
    this.fillValue();
  }

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
  }

  get textValue() {
    return this._selectValue ? this._selectValue[this._props.label] : '';
  }

  select(data = {[this._props.label]: this.whole}) {
    if (data[this._props.disabled]) return
    this._selectValue = data;
    this._value = data[this._props.value];
    this.onChange(data[this._props.value]);
    this.selectedEvent.emit(data);
    this.close();
  }

  showClose(event: Event, active, close) {
    if (!this._value || this._opened || this.disabled) return;
    event.stopPropagation();
    event.preventDefault();
    this.renderer.addClass(active, 'active');
    this.renderer.addClass(close, 'close');
  }

  hideClose(event: Event, active, close) {
    if (!this._value || this._opened) return;
    event.stopPropagation();
    event.preventDefault();
    this.renderer.removeClass(active, 'active');
    this.renderer.removeClass(close, 'close');
  }

  removeValue(event: Event, active, close) {
    if (!this._value) return;
    if (this.disabled) return;
    event.stopPropagation();
    event.preventDefault();
    this._value = null;
    this._selectValue = null;
    this.renderer.removeClass(active, 'active');
    this.renderer.removeClass(close, 'close');
    this.onChange(null);
    this.selectedEvent.emit(null);
  }

  @HostListener('click', ['$event'])
  open(event) {
    event.stopPropagation();
    if (this._opened) return;
    if (this.disabled) return;
    if (!this._list || !this._list.length) return;
    this._opened = true;
    this._onTouched()
    if (!this.overlayRef) {
      this.portal = new TemplatePortal(this.template, this.viewContainerRef);
    }
    if (!this.overlayRef) {
      const overlayConfig = new OverlayConfig({
        panelClass: 'select-content-portal',
        backdropClass: '',
        hasBackdrop: true,
        scrollStrategy: this.overlay.scrollStrategies.block(),
        positionStrategy: this.overlay.position()
          .flexibleConnectedTo(this.ref)
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
          ]).withDefaultOffsetY(2)
      });
      this.overlayRef = this.overlay.create(overlayConfig);
      this.overlayRef.backdropClick().subscribe(() => this.close());
    }
    if (this.overlayRef && !this.overlayRef.hasAttached()) {
      this.overlayRef.attach(this.portal);
    }

    if (this.searchCtrl) {
      this.inputRef.nativeElement.focus();
    }

    this.changeDetectorRef.markForCheck();
  }

  close() {
    if (!this._opened) return;
    this._opened = false;
    this._searchValue = null;
    this._autoValue = null;
    this.overlayRef.detach();
    if (this.portal && this.portal.isAttached) {
      this.portal.detach();
    }
    this.inputRef.nativeElement.blur();
    this.changeDetectorRef.markForCheck();
  }

  fillValue() {
    if (this._list && this._list.length) {
      this._selectValue = this._list.find(l => l[this._props.value] == this._value);
    }
  }

  filterList() {
    let list = this._list.filter(f => !!~f[this._props.label].indexOf(this._searchValue));
    if (list.length === 1) this._autoValue = list[0];
    if (list.length === 0) this._autoValue = null;
    return list;
  }

  onChange = (value) => {
  };

  _onTouched = () => {
  };

  ngOnChanges(changes: SimpleChanges): void {
    this.changeDetectorRef.markForCheck();
  }

  ngOnInit(): void {
    if (this.borderNone) {
      this.renderer.addClass(this.ref.nativeElement, 'border-none')
    }
    if (this.searchCtrl) {
      this.keyupObservable = fromEvent(window, 'keyup')
        .pipe(
          filter((event: any) => !!~[13, 38, 40].indexOf(event.keyCode))
        )
        .subscribe((event: any) => {
          if (!this._opened) return;
          switch (event.keyCode) {
            case 13: {
              if (this._autoValue) {
                this.select(this._autoValue);
              } else {
                this.close();
              }
              break;
            }
            case 38: {
              let index = this._list.indexOf(this._autoValue || this._selectValue);
              if (index - 1 >= 0) {
                this._autoValue = this._list[index - 1];
              } else {
                this._autoValue = this._list[this._list.length - 1];
              }
              this.changeDetectorRef.markForCheck();
              break;
            }
            case 40: {
              let index = this._list.indexOf(this._autoValue || this._selectValue);
              if (index + 1 > this._list.length - 1) {
                this._autoValue = this._list[0];
              } else {
                this._autoValue = this._list[index + 1];
              }
              this.changeDetectorRef.markForCheck();
              break;
            }
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.keyupObservable && this.keyupObservable.unsubscribe();
    this.clickObservable && this.clickObservable.unsubscribe();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  writeValue(obj: any): void {
    this._value = obj;
    this.fillValue();
    this.changeDetectorRef.markForCheck();
  }

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private renderer: Renderer2,
              private viewContainerRef: ViewContainerRef,
              private ref: ElementRef,
              @Inject(DOCUMENT) private document: Document,
              private overlay: Overlay) {

  }
}
