import {Injectable} from '@angular/core';
import {Overlay, OverlayConfig} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {LoadingComponent} from './loading.component';

@Injectable()
export class Loading {

  _container: LoadingComponent;

  constructor(private overlay: Overlay) {
    const overlayConfig = new OverlayConfig({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      panelClass: 'loading-content-portal',
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });
    this._container = overlay.create(overlayConfig).attach(new ComponentPortal(LoadingComponent)).instance;
  }

  cache = [];

  open(config = {}) {
    this.cache.push(0);
    this._container.open(config)
  }

  close() {
    this.cache.shift();
    if (this.cache.length === 0) {
      this._container.close()
    }
  }

  closeAll() {
    this.cache.length = 0;
    this.close();
  }
}
