import {ComponentRef, Injectable} from '@angular/core';
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {LoadingComponent} from './loading.component';

@Injectable()
export class Loading {

  _container: LoadingComponent;

  portal: ComponentPortal<LoadingComponent>;
  popup: OverlayRef;
  componentRef: ComponentRef<LoadingComponent>;

  constructor(private overlay: Overlay) {

  }

  config: any = {};

  style

  cache = [];

  open(config = {}) {
    config = {...this.config, config}
    if (!this.portal) {
      this.portal = new ComponentPortal(LoadingComponent);
    }
    if (!this.popup) {
      const overlayConfig = new OverlayConfig({
        positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
        panelClass: 'loading-content-portal',
        hasBackdrop: false,
        scrollStrategy: this.overlay.scrollStrategies.block(),
      });
      this.popup = this.overlay.create(overlayConfig);
    }
    if (!this.popup.hasAttached()) {
      this.componentRef = this.popup.attach(this.portal);
      this._container = this.componentRef.instance;
    }
    this.cache.push(0);
    // this._container.open(config);
  }

  close() {
    this.popup.detach();
    this.cache.shift();
    if (this.cache.length === 0) {
      this._container.close();
    }
  }

  setStyle(style) {
    this.config.style = style;
  }

  closeAll() {
    this.cache.length = 0;
    this.close();
  }
}
