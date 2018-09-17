import { ComponentRef, Inject, Injectable, PLATFORM_ID, TemplateRef, Component, InjectionToken, ComponentFactoryResolver, Type, Injector } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType, PortalInjector } from '@angular/cdk/portal';
import { DialogComponent } from './dialog.component';
import { fromEvent, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

export const YC_DIALOG_DATA = new InjectionToken<any>('YcDialogData');

export interface DialogData {
  title?: string
  flag?: boolean
  btn1?: string
  btn2?: string
  async?: boolean
  maxWidth?: string
  maxHeight?: string
  fullScreen?: boolean
  data?:any
}

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
    fullScreen: false,
  }

  constructor(private _overlay: Overlay,
    private cfr: ComponentFactoryResolver,
    private injector: Injector,
    @Inject(PLATFORM_ID) private platformId: Object) {

  }

  closeSubject: Subject<any>;

  escEvent

  open(ref: TemplateRef<any> | ComponentType<any> | string, config: any = { ...this._defaultConfig }): Subject<any> {
    if (this.opened) return;
    config = { ...this._defaultConfig, ...config };
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
      hasBackdrop: !config.fullScreen,
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

      this.componentRef.instance._animationStateChanged.subscribe(event => {
          if(event.toState === 'void' && this.popupRef){
            if(event.phaseName === 'start'){
              this.popupRef.detachBackdrop();
            }
            if(event.phaseName === 'done'){
              this.popupRef.detach();
            }
          }
      })

      this.componentRef.instance.config = config;
      if (ref instanceof TemplateRef) {
        this.componentRef.instance.containerRef.createEmbeddedView(ref);
      } else if (ref instanceof Type) {
        const injectionTokens = new WeakMap<any, any>([
          [YC_DIALOG_DATA, config.data]
        ]);
        let containerRef = this.componentRef.instance.containerRef
        let componentFactory = this.cfr.resolveComponentFactory(ref)
        containerRef.createComponent(componentFactory, containerRef.length, new PortalInjector(this.injector, injectionTokens))
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
