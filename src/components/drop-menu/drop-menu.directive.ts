import {ComponentRef, Directive, ElementRef, EventEmitter, HostListener, Inject, Injector, Input, Output, Renderer2, ViewContainerRef} from '@angular/core';
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {DOCUMENT} from '@angular/common';
import {ComponentPortal} from '@angular/cdk/portal';
import {DropMenuComponent, Props} from './drop-menu.component';

@Directive({
  selector: '[yc-drop-menu]',
  exportAs: 'dropMenu',
})
export class DropMenuDirective {

  componentPortal: ComponentPortal<DropMenuComponent>;
  overlayRef: OverlayRef;
  componentRef: ComponentRef<DropMenuComponent>;

  opened;

  private _props: Props = {
    value: 'value',
    label: 'label',
    desc: 'desc',
    disabled: 'disabled',
    checked: 'checked',
  };

  @Input('yc-drop-menu') list;

  @Input('props') set props(val: Props) {
    if (val) {
      Object.assign(this._props, val);
      Object.assign(val, this._props);
      this._props = val;
    }
  }

  @Output('selectedEvent') selectedChange: EventEmitter<any> = new EventEmitter<any>();

  @HostListener('click', ['$event'])
  open() {
    if (this.opened || !this.list) return;
    if (!this.componentPortal) {
      this.componentPortal = new ComponentPortal<DropMenuComponent>(DropMenuComponent, this._viewContainerRef, this._injector)
    }

    if (!this.overlayRef) {
      const overlayConfig = new OverlayConfig({
        panelClass: 'drop-menu-content-portal',
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
      this.overlayRef = this._overlay.create(overlayConfig);
      this.overlayRef.backdropClick().subscribe(() => this.close());
    }

    if (!this.overlayRef.hasAttached()) {
      this.componentRef = this.overlayRef.attach(this.componentPortal);
      this.componentRef.instance.list = this.list;
      this.componentRef.instance._props = this._props;
      this.componentRef.instance.selectedEvent.subscribe(data => {
        this.selectedChange.emit(data);
        this.close();
      })
    }
    this.opened = true;
  }

  close() {
    this.overlayRef.detach();
    this.overlayRef.detachBackdrop();
    if (this.componentPortal && this.componentPortal.isAttached) {
      this.componentPortal.detach();
      this.componentRef.destroy();
    }
    this.opened = false;
  }

  constructor(private _overlay: Overlay,
              private _viewContainerRef: ViewContainerRef,
              private _renderer: Renderer2,
              private _ref: ElementRef,
              @Inject(DOCUMENT) private _document,
              private _injector: Injector) {

  }


}
