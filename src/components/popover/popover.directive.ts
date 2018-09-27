import {
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Injector,
  Input,
  Output,
  Renderer2,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {DOCUMENT} from '@angular/common';
import {ComponentPortal} from '@angular/cdk/portal';
import {PopoverComponent} from './popover.component';

export const POSITION_MAP: { [key: string]: any } = {
  'top': {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'bottom'
  },
  'topCenter': {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'bottom'
  },
  'topLeft': {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom'
  },
  'topRight': {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom'
  },
  'right': {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
  },
  'rightTop': { // 右下
    originX: 'end',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'top',
  },
  'rightBottom': {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'bottom',
  },
  'bottom': {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
  },
  'bottomCenter': {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
  },
  'bottomLeft': {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
  },
  'bottomRight': {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top',
  },
  'left': {
    originX: 'start',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'center',
  },
  'leftTop': {
    originX: 'start',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'top',
  },
  'leftBottom': {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'bottom',
  },
};

@Directive({
  selector: '[yc-popover]',
  exportAs: 'ycPopover'
})
export class PopoverDirective {
  constructor(private _overlay: Overlay,
              private _viewContainerRef: ViewContainerRef,
              private _renderer: Renderer2,
              private _ref: ElementRef,
              @Inject(DOCUMENT) private _document,
              private _injector: Injector) {

  }

  @Input() template: TemplateRef<any>;
  @Input() placement: 'topLeft' | 'top' | 'topRight' | 'leftTop' | 'left' | 'leftBottom' | 'rightTop' | 'right' | 'rightBottom' | 'bottomLeft' | 'bottom' | 'bottomRight' = 'top';
  @Output() openEvent = new EventEmitter<any>();

  popoverPortal: ComponentPortal<PopoverComponent>;
  popupRef: OverlayRef;
  componentRef: ComponentRef<PopoverComponent>;
  opened;

  @HostListener('click', ['$event'])
  open() {
    if (this.opened) return;
    if (!this.popoverPortal) {
      this.popoverPortal = new ComponentPortal(PopoverComponent, this._viewContainerRef, this._injector);
    }

    if (!this.popupRef) {
      let positions = Object.values(POSITION_MAP);
      positions.unshift(POSITION_MAP[this.placement]);  // 开头添加
      const overlayConfig = new OverlayConfig({
        panelClass: 'popover-content-portal',
        hasBackdrop: true,
        backdropClass: '',
        scrollStrategy: this._overlay.scrollStrategies.block(),
        positionStrategy: this._overlay.position()
          .flexibleConnectedTo(this._ref)    // 要与某个物件连接的策略
          .withFlexibleDimensions(false)
          .withViewportMargin(8)
          .withPush(false)
          .withPositions([
            ...positions
          ])
      });
      this.popupRef = this._overlay.create(overlayConfig); //
      this.popupRef.backdropClick().subscribe(() => this.close());  // 我們也可以設定當backdrop被點擊後，就自動關閉目前的overlay：
    }

    if (!this.popupRef.hasAttached()) {
      this.componentRef = this.popupRef.attach(this.popoverPortal); // 放进去
      this.componentRef.instance.placement = this.placement;
      if (this.template) {
        this.componentRef.instance.containerRef.createEmbeddedView(this.template);
      }
    }
    this.opened = true;
    this.openEvent.emit();
  }


  close() {
    this.popupRef.detach();
    if (this.popoverPortal && this.popoverPortal.isAttached) {
      this.popoverPortal.detach();
    }
    this.opened = false;
  }
}
