import {Injectable} from '@angular/core';
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {PreviewImgComponent} from './preview-img.component';

@Injectable()
export class PreviewImg {

  _container: PreviewImgComponent;
  private overlayRef: OverlayRef;

  constructor(private overlay: Overlay) {

  }

  open(list: string[], config?) {
    if (!this.overlayRef) {
      const overlayConfig = new OverlayConfig({
        positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
        panelClass: 'preview-img-content-portal',
        hasBackdrop: false,
        scrollStrategy: this.overlay.scrollStrategies.block(),
      });
      this.overlayRef = this.overlay.create(overlayConfig)
      this._container = this.overlayRef.attach(new ComponentPortal(PreviewImgComponent)).instance;
    }

    this._container.index = 0;
    this._container.imgList = list;
    this._container.open(config)
  }

  close() {
    this._container.close()
  }

}
