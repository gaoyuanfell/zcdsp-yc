import {ComponentRef, Inject, Injectable, PLATFORM_ID, TemplateRef} from '@angular/core';
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {fromEvent, Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {isPlatformBrowser} from '@angular/common';
import {SidebarComponent} from './sidebar.component';

@Injectable()
export class Sidebar {
  private dialogPortal: ComponentPortal<SidebarComponent>;
  private popupRef: OverlayRef;
  private componentRef: ComponentRef<SidebarComponent>;
  private opened;

  constructor(private _overlay: Overlay, @Inject(PLATFORM_ID) private platformId: Object) {

  }

  closeSubject: Subject<any>;

  escEvent;

  open(ref: TemplateRef<any>): Subject<any> {
    if (this.opened) return;

    if (!this.dialogPortal) {
      this.dialogPortal = new ComponentPortal(SidebarComponent);
    }

    if (this.popupRef) {
      this.popupRef.dispose();
      this.popupRef = null;
    }

    const overlayConfig = new OverlayConfig({
      positionStrategy: this._overlay.position().global().centerHorizontally().centerVertically(),
      scrollStrategy: this._overlay.scrollStrategies.block(),
      panelClass: 'sidebar-content-portal',
      backdropClass: 'cdk-overlay-dark-backdrop',
      hasBackdrop: true,
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
    });

    this.closeSubject = new Subject();
    if (!this.popupRef.hasAttached()) {
      this.componentRef = this.popupRef.attach(this.dialogPortal);

      this.componentRef.instance.containerRef.createEmbeddedView(ref);
      this.componentRef.instance.open()

      this.componentRef.instance.closeSubject.subscribe((data)=> {
        this.close()
      })
    }
    this.opened = true;
    return this.closeSubject;
  }

  close() {
    this.componentRef.instance.close()
    if (this.popupRef) {
      this.popupRef.detachBackdrop();
      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => {
          this.popupRef.detach();
        }, 300);
      }
    }
    if (this.dialogPortal && this.dialogPortal.isAttached) {
      this.dialogPortal.detach();
    }
    if (this.closeSubject) {
      this.closeSubject.unsubscribe();
    }
    if (this.escEvent) {
      this.escEvent.unsubscribe();
    }
    this.opened = false;
  }
}
