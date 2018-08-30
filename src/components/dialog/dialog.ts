import {ComponentRef, Inject, Injectable, PLATFORM_ID, TemplateRef} from '@angular/core';
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {DialogComponent} from './dialog.component';
import {fromEvent, Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {isPlatformBrowser} from '@angular/common';

@Injectable()
export class Dialog {
  private dialogPortal: ComponentPortal<DialogComponent>;
  private popupRef: OverlayRef;
  private componentRef: ComponentRef<DialogComponent>;
  private opened;

  _defaultConfig = {
    title: '提示',
    flag: true,
    btn1: '取消',
    btn2: '确定',
    async: false,
    maxWidth: '80vw',
    maxHeight: '80vh',
    fullScreen: false
  }

  constructor(private _overlay: Overlay, @Inject(PLATFORM_ID) private platformId: Object) {

  }

  closeSubject: Subject<any>;

  escEvent

  open(ref: TemplateRef<any> | string, config: any = {...this._defaultConfig}): Subject<any> {
    if (this.opened) return;
    config = {...this._defaultConfig, ...config};
    if (!this.dialogPortal) {
      this.dialogPortal = new ComponentPortal(DialogComponent);
    }

    if (this.popupRef) {
      this.popupRef.dispose();
      this.popupRef = null
    }

    const overlayConfig = new OverlayConfig({
      positionStrategy: this._overlay.position().global().centerHorizontally().centerVertically(),
      scrollStrategy: this._overlay.scrollStrategies.block(),
      panelClass: config.fullScreen ? 'dialog-full-content-portal' : 'dialog-content-portal',
      backdropClass: 'cdk-overlay-dark-backdrop',
      hasBackdrop: true,
      maxWidth: config.maxWidth,
      maxHeight: config.maxHeight
    });
    this.popupRef = this._overlay.create(overlayConfig);
    this.popupRef.backdropClick().subscribe(() => {
      this.closeSubject.next(false);
      this.close();
    });

    this.escEvent = fromEvent(window, 'keyup').pipe(
      filter((event: KeyboardEvent) => event.keyCode === 27)
    ).subscribe((event: KeyboardEvent) => {
      this.closeSubject.next(false);
      this.close();
    })

    this.closeSubject = new Subject();
    if (!this.popupRef.hasAttached()) {
      this.componentRef = this.popupRef.attach(this.dialogPortal);

      this.componentRef.instance.config = config;
      if (ref instanceof TemplateRef) {
        this.componentRef.instance.containerRef.createEmbeddedView(ref);
      } else {
        this.componentRef.instance.description = ref;
      }

      this.componentRef.instance.closeSubject.subscribe((res) => {
        if (config.async && res) {
          this.closeSubject.next(this.close.bind(this));
        } else {
          this.closeSubject.next(res);
          this.close();
        }
      });
    }
    this.opened = true;
    return this.closeSubject;
  }

  close() {
    if (this.popupRef) {
      this.popupRef.detachBackdrop();
      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => {
          this.popupRef.detach();
        }, 400)
      }
    }
    if (this.dialogPortal && this.dialogPortal.isAttached) {
      this.dialogPortal.detach();
    }
    if (this.componentRef) {
      this.componentRef.destroy()
    }
    if (this.closeSubject) {
      this.closeSubject.unsubscribe()
    }
    if (this.escEvent) {
      this.escEvent.unsubscribe()
    }
    this.opened = false;
  }
}
