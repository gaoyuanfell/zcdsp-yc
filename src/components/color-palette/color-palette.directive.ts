import {ComponentRef, Directive, ElementRef, EventEmitter, forwardRef, HostListener, Inject, Injector, Output, Renderer2, ViewContainerRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {DOCUMENT} from '@angular/common';
import {ComponentPortal} from '@angular/cdk/portal';
import {ColorPaletteComponent} from './color-palette.component';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ColorPaletteDirective),
  multi: true
};

@Directive({
  selector: '[yc-color-palette]',
  exportAs: 'colorPalette',
  providers: [
    CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR
  ]
})
export class ColorPaletteDirective implements ControlValueAccessor {

  @Output() changeEvent = new EventEmitter<any>();

  opened;

  value

  portal: ComponentPortal<ColorPaletteComponent>;
  popup: OverlayRef;
  componentRef: ComponentRef<ColorPaletteComponent>;

  @HostListener('click', ['$event'])
  open() {
    if (this.opened) return;

    if (!this.portal) {
      this.portal = new ComponentPortal(ColorPaletteComponent, this._viewContainerRef, this._injector);
    }

    if (!this.popup) {
      const overlayConfig = new OverlayConfig({
        panelClass: 'color-palette-content-portal',
        backdropClass: '',
        hasBackdrop: true,
        scrollStrategy: this._overlay.scrollStrategies.block(),
        positionStrategy: this._overlay.position()
          .flexibleConnectedTo(this._ref)
          // .withFlexibleDimensions(false)
          .withViewportMargin(0)
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
      this.popup = this._overlay.create(overlayConfig);
      this.popup.backdropClick().subscribe(() => this.close());
    }

    if (!this.popup.hasAttached()) {
      this.componentRef = this.popup.attach(this.portal);
      this.componentRef.instance.changeEvent.subscribe(data => {
        this.value = data
        this.changeEvent.emit(data)
        this.onChange(data);
      })
      this.componentRef.instance.value = this.rgbaHexBy(this.value);
    }
    this.opened = true;
  }

  close() {
    this.popup.detach();
    this.popup.detachBackdrop();
    this.opened = false;
  }

  rgbaHexBy(value) {
    if (!value) return {r: 0, g: 0, b: 0, a: 0};
    if (value.indexOf('#') === 0) {
      value = value.substr(1)
      let arr = value.split('');
      if (value.length === 3) {
        let r16 = arr[0] + arr[0];
        let g16 = arr[1] + arr[1];
        let b16 = arr[2] + arr[2];
        return {r: parseInt(r16, 16), g: parseInt(g16, 16), b: parseInt(b16, 16), a: 1};
      }
      let r16 = arr[0] + arr[1];
      let g16 = arr[2] + arr[3];
      let b16 = arr[4] + arr[5];
      let a16 = arr[6] + arr[7];
      return {r: parseInt(r16, 16), g: parseInt(g16, 16), b: parseInt(b16, 16), a: Math.round(parseInt(a16, 16) / 255)};
    }

    if (/^rgba?/.test(value)) {
      let vs = value.match(/(\d(\.\d+)?)+/g)
      return {r: +vs[0], g: +vs[1], b: +vs[2], a: +vs[3] || 1};
    }
  }

  constructor(private _overlay: Overlay,
              private _viewContainerRef: ViewContainerRef,
              private _renderer: Renderer2,
              private _ref: ElementRef,
              @Inject(DOCUMENT) private _document,
              private _injector: Injector) {

  }

  private onChange: (value: any) => void = () => {
  };

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(obj: any): void {
    this.value = obj;
  }


}
