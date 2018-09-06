import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'yc-color-palette',
  templateUrl: './color-palette.component.html',
  styleUrls: ['./color-palette.component.less'],
  preserveWhitespaces: true,
})
export class ColorPaletteComponent implements OnInit, OnDestroy {

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  canvasBar: HTMLCanvasElement;
  ctxBar: CanvasRenderingContext2D;

  @Output('changeEvent') changeEvent = new EventEmitter<any>();

  mouse = false;

  @ViewChild('canvas') set canvasRef(val: ElementRef) {
    if (!val) return;
    this.canvas = val.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    this.canvas.addEventListener('mousedown', (event) => {
      let {layerX, layerY} = event;
      this.layerX = layerX;
      this.layerY = layerY;
      this.getRgbaByXY(layerX, layerY);
      this.mouse = true;
    });

    this.canvas.addEventListener('mousemove', (event) => {
      if (!this.mouse) return;
      let {layerX, layerY} = event;
      this.layerX = layerX;
      this.layerY = layerY;
      this.getRgbaByXY(layerX, layerY)
    });
  }

  @ViewChild('paletteSelector') set paletteSelectorRef(val: ElementRef) {
    if (!val) return;

    val.nativeElement.addEventListener('mousedown', (event) => {
      this.mouse = true;
    });

    val.nativeElement.addEventListener('mouseup', (event) => {
      this.mouse = false;
    })
  }

  getRgbaByXY(layerX, layerY) {
    let imageData = this.ctx.getImageData(layerX, layerY, 1, 1);
    let [r, g, b] = Array.from(imageData.data);
    this.value = {
      r: r,
      g: g,
      b: b,
      a: this.opacity,
    };
    console.info(this.color)
    this.changeEvent.emit(this.color)
  }

  mouseBar = false;

  @ViewChild('canvasBar') set canvasBarRef(val: ElementRef) {
    if (!val) return;
    this.canvasBar = val.nativeElement;
    this.ctxBar = this.canvasBar.getContext('2d');

    this.canvasBar.addEventListener('mousedown', (event) => {
      this.mouseBar = true;
      let {layerX, layerY} = event;
      this.setRgbaByXY(layerX, layerY)
    });

    this.canvasBar.addEventListener('mousemove', (event) => {
      if (!this.mouseBar) return;
      let {layerX, layerY} = event;
      this.setRgbaByXY(layerX, layerY)
    });

    this.canvasBar.addEventListener('mouseout', (event) => {
      this.mouseBar = false;
    });

    this.canvasBar.addEventListener('mouseup', (event) => {
      this.mouseBar = false;
    })
  }

  setRgbaByXY(layerX, layerY) {
    let imageData = this.ctxBar.getImageData(layerX, layerY, 1, 1);
    let [r, g, b] = Array.from(imageData.data);
    this.rgba = {
      r: r,
      g: g,
      b: b,
      a: this.opacity,
    };
    this.drawPalette();
    this.getRgbaByXY(this.layerX, this.layerY)
  }

  private _value;

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    this.opacity = 1;
    if(value){
      this.opacity = value.a || 1;
    }
  }

  get hex() {
    let {r, g, b, a} = this.value;

    let _r = r.toString(16)
    if (_r.length === 1) {
      _r = '0' + _r
    }

    let _g = g.toString(16)
    if (_g.length === 1) {
      _g = '0' + _g
    }

    let _b = b.toString(16)
    if (_b.length === 1) {
      _b = '0' + _b
    }

    let _a = Math.round(a * 255).toString(16)
    if (_a.length === 1) {
      _a = '0' + _a
    }

    return `#${_r}${_g}${_b}${_a}`
  }

  rgba = {
    r: 255,
    g: 0,
    b: 0,
    a: 1,
  };

  layerX = 0;

  layerY = 0;

  get color() {
    let {r, g, b, a} = this.value;
    return `rgba(${r},${g},${b},${a})`;
  }

  opacity = 1;

  opacityChange() {
    this.value.a = this.opacity
    this.getRgbaByXY(this.layerX, this.layerY)
  }

  /**
   * 画画板
   */
  drawPalette() {
    let {r, g, b, a} = this.rgba;
    let width = this.canvas.width;
    let height = this.canvas.height;
    let xScale = 255 / width;
    let yScale = 255 / height;

    for (let x = 0; x <= width; x++) {
      let _r = r + x * xScale;
      let _g = g + x * xScale;
      let _b = b + x * xScale;
      if (_r > 255) _r = 255;
      if (_g > 255) _g = 255;
      if (_b > 255) _b = 255;
      for (let y = 0; y <= height; y++) {
        let __r = _r - _r / 255 * y * yScale;
        let __g = _g - _g / 255 * y * yScale;
        let __b = _b - _b / 255 * y * yScale;
        if (__r < 0) __r = 0;
        if (__g < 0) __g = 0;
        if (__b < 0) __b = 0;
        this.ctx.save();
        this.ctx.fillStyle = `rgb(${__r},${__g},${__b})`;
        this.ctx.fillRect(x, y, 1, 1);
        this.ctx.restore();
      }
    }
  }

  /**
   * 画画板工具条
   */
  drawBar() {

    let rgba = {
      r: 255,
      g: 0,
      b: 0,
    };
    let {r, g, b} = rgba;
    let height = this.canvasBar.height;
    let width = this.canvasBar.width;

    let xScale = width / (255 * 6);

    let arr = ['r', 'g', 'b'];
    let i = 2;
    let bo = true;

    for (let x = 0; x <= 255 * 6; ++x) {
      if (bo) {
        ++rgba[arr[i]];
        if (rgba[arr[i]] >= 255) {
          rgba[arr[i]] = 255;
          ++i;
          bo = !bo;
          if (i > arr.length - 1) {
            i = 0;
          }
        }
      } else {
        --rgba[arr[i]];
        if (rgba[arr[i]] <= 0) {
          rgba[arr[i]] = 0;
          ++i;
          bo = !bo;
          if (i > arr.length - 1) {
            i = 0;
          }
        }
      }

      let {r, g, b} = rgba;

      this.ctxBar.save();
      this.ctxBar.fillStyle = `rgb(${r},${g},${b})`;
      this.ctxBar.fillRect(x * xScale, 0, 1, height);
      this.ctxBar.restore();
    }


    /*let rgba = {
      r: 255,
      g: 0,
      b: 0,
    };
    let {r, g, b} = rgba;

    let width = this.canvasBar.width;
    let height = this.canvasBar.height;
    let xScale = 255 / width;

    let arr = ['r', 'g', 'b'];

    let i = 2;
    let bo = true;
    for (let x = 0; x <= width; x++) {

      if (bo) {
        rgba[arr[i]] += xScale * x;
        if (rgba[arr[i]] >= 255) {
          rgba[arr[i]] = 255;
          ++i;
          bo = !bo;
          if (i > arr.length - 1) {
            i = 0;
          }
        }
      } else {
        rgba[arr[i]] -= xScale * x;
        if (rgba[arr[i]] <= 0) {
          rgba[arr[i]] = 0;
          ++i;
          bo = !bo;
          if (i > arr.length - 1) {
            i = 0;
          }
        }
      }

      let {r, g, b} = rgba;

      this.ctxBar.save();
      this.ctxBar.fillStyle = `rgb(${r},${g},${b})`;
      this.ctxBar.fillRect(x, 0, 1, height);
      this.ctxBar.restore();

    }*/

  }

  copyColor() {
    this.copy(this.hex)
  }

  constructor(@Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit() {
    this.drawPalette();
    this.drawBar();
    if (!this.value) {
      this.value = {r: 255, g: 255, b: 255, a: 0}
      this.opacity = this.value.a;
    }
  }

  ngOnDestroy(): void {
    this.changeEvent.unsubscribe()
  }

  copy(text: string) {
    const textarea = this.document.createElement('textarea');
    textarea.style.fontSize = '12pt';
    textarea.style.border = '0';
    textarea.style.padding = '0';
    textarea.style.margin = '0';
    textarea.style.position = 'absolute';
    textarea.style.right = '-9999px';
    textarea.value = text;
    this.document.body.appendChild(textarea);
    textarea.select();
    this.document.execCommand('copy');
    this.document.body.removeChild(textarea);
  }

}
