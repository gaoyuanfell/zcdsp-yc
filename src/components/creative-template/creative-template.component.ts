import {Component, ElementRef, Inject, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import {ScrollService} from '../back-top/scroll.service';
import {Dialog} from '../dialog/dialog';
import {fromEvent} from 'rxjs';
import {TemplateService} from '../../service/template.service';

@Component({
  selector: 'yc-creative-template',
  templateUrl: './creative-template.component.html',
  styleUrls: ['./creative-template.component.less']
})
export class CreativeTemplateComponent implements OnInit, OnDestroy {


  imgList = []; // 创意素材
  imgType; // 创意素材类型
  templateList = []; // 创意模板
  templateType; // 创意模板类型

  // canvas 集合
  canvasList: HTMLCanvasElement[] = [];

  // 背景 canvas
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  @ViewChild('canvas') canvasRef: ElementRef;

  // 元素 canvas
  drawingCanvas: HTMLCanvasElement;
  drawingCtx: CanvasRenderingContext2D;
  @ViewChild('drawingCanvas') drawingCanvasRef: ElementRef;

  // 合并 canvas
  compileCanvas: HTMLCanvasElement;
  compileCtx: CanvasRenderingContext2D;

  // canvas盒子
  @ViewChild('canvasBox') canvasBoxRef: ElementRef;

  // 元素
  elementList;
  position = {
    x: 0,
    y: 0,
  }
  moveStatus;

  get elementTextFilter() {
    if (this.elementList instanceof Array) {
      let list = []
      this.elementList.every(ele => {
        if (ele.type === 'text') {
          list.push(ele)
        }
        return true;
      })
      return list
    }
    return null;
  }

  get elementFileFilter() {
    if (this.elementList instanceof Array) {
      let list = []
      this.elementList.every(ele => {
        if (ele.type === 'file') {
          list.push(ele)
        }
        return true;
      })
      return list
    }
    return null;
  }

  scale = 1; // 放大倍数
  positionScale = 1  // 画布倍率
  minScale = 0.1;

  // canvas config
  private _templateConfig;

  private contentType = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
  };

  get templateConfig() {
    return this._templateConfig;
  }

  @Input() set templateConfig(value) {
    this._templateConfig = value;

    if (this._templateConfig) {
      if (this._templateConfig.extensions instanceof Array && this._templateConfig.extensions.length) {
        this._templateConfig.mimeType = this.contentType[this._templateConfig.extensions[0]]
      }
      this.canvasList = [];

      let maxWidth = (this.document.body.clientWidth - 100) / 2;

      let height = this._templateConfig.height;
      let width = this._templateConfig.width;

      if (height > 400) {
        width = 400 * width / height;
        height = 400
      }

      if (height < 200) {
        width = 200 * width / height;
        height = 200
      }

      if (width > maxWidth) {
        height = maxWidth * height / width;
        width = maxWidth
      }

      this.positionScale = width / this._templateConfig.width;

      this.canvas = this.canvasRef.nativeElement;
      this.canvas.width = width;
      this.canvas.height = height;
      this.ctx = this.canvas.getContext('2d');
      this.canvasList.push(this.canvas);

      this.drawingCanvas = this.drawingCanvasRef.nativeElement;
      this.drawingCanvas.width = width;
      this.drawingCanvas.height = height;
      this.drawingCtx = this.drawingCanvas.getContext('2d');
      this.canvasList.push(this.drawingCanvas);

      this.initEvent()
    }
  }

  private _mousedownEvent;
  private _mousemoveEvent;
  private _mouseupEvent;
  private _mouseoutEvent;

  initEvent() {
    let x = 0;
    let y = 0;
    let _x = this.position.x;
    let _y = this.position.y;
    let eventRef = this.canvasBoxRef.nativeElement;

    this._mousedownEvent = fromEvent(eventRef, 'mousedown').subscribe((event: MouseEvent) => {
      this.moveStatus = true;
      eventRef.style.cursor = 'move';
      x = event.x;
      y = event.y;
      _x = this.position.x;
      _y = this.position.y;
    });

    this._mousemoveEvent = fromEvent(eventRef, 'mousemove').subscribe((event: MouseEvent) => {
      if (!this.moveStatus) return;

      if (this.img.naturalWidth * this.scale <= this.drawingCanvas.width && this.img.naturalHeight * this.scale <= this.drawingCanvas.height) {
        return
      }

      event.stopPropagation();
      event.preventDefault();
      let vx = event.x - x;
      let vy = event.y - y;

      this.position.x = vx / this.scale + _x;
      this.position.y = vy / this.scale + _y;

      let _w = (this.img.naturalWidth * this.scale - this.drawingCanvas.width) / 2 / this.scale;
      if (Math.abs(this.position.x) > Math.abs(_w)) {
        if (vx < 0) {
          _w = -_w
        }
        this.position.x = _w
      }

      let _h = (this.img.naturalHeight * this.scale - this.drawingCanvas.height) / 2 / this.scale;
      if (Math.abs(this.position.y) > Math.abs(_h)) {
        if (vy < 0) {
          _h = -_h
        }
        this.position.y = _h
      }

      this.drawBackgroundImg()
    })

    this._mouseupEvent = fromEvent(eventRef, 'mouseup').subscribe((event: MouseEvent) => {
      this.moveStatus = false;
      eventRef.style.cursor = 'default';
    })

    this._mouseoutEvent = fromEvent(eventRef, 'mouseout').subscribe((event: MouseEvent) => {
      this.moveStatus = false;
      eventRef.style.cursor = 'default';
    })
  }

  // 图片实例
  img;

  _templateStyle: any = {
    display: 'none'
  };

  _templateIrStyle;

  // 选择图片
  selectImg(img, imgBox) {
    this.img = img;
    this._templateStyle = {
      'top.px': imgBox.offsetTop + imgBox.offsetHeight - 6
    };
    let bbox = imgBox.getBoundingClientRect();

    let top = bbox.y + bbox.height;
    let left = bbox.x + bbox.width / 2;

    this._templateIrStyle = {
      'margin-left.px': left - Math.sqrt(200)
    };
    this.position = {
      x: 0,
      y: 0,
    };
    this.setScale();
    this.drawBackgroundImg();

    if (this.templateList instanceof Array && this.templateList.length) {
      this.selectTemplate(this.templateList[0])
    }
  }

  // 选择模板
  _elementList

  selectTemplate(temp) {
    if (temp.elements === this._elementList) return;
    this._elementList = temp.elements
    this.elementList = JSON.parse(JSON.stringify(temp.elements))
    this.drawTextAndImg().catch(error => console.error(error))
  }

  /**
   * 加载图片
   * @param url
   * @returns {Promise<HTMLImageElement>}
   */
  loadImg(url) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        resolve(img)
      };
      img.src = url
    })
  }

  /**
   * 设置合理的倍率
   */
  setScale() {
    let naturalWidth = this.img.naturalWidth;
    let naturalHeight = this.img.naturalHeight;
    let cWidth = this.ctx.canvas.width;
    let cHeight = this.ctx.canvas.height;
    this.scale = 1;
    if (naturalWidth > cWidth || naturalHeight > cHeight) {
      this.scale = cWidth / naturalWidth;
      if (naturalHeight * this.scale < cHeight) {
        this.scale = cHeight / naturalHeight
      }
    }
    this.minScale = this.scale
  }

  /**
   * 图片对象已初始化 将图片写入canvas
   */
  drawBackgroundImg() {
    if (!this.img) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let naturalWidth = this.img.naturalWidth;
    let naturalHeight = this.img.naturalHeight;
    let cWidth = this.ctx.canvas.width;
    let cHeight = this.ctx.canvas.height;

    let width = naturalWidth * this.scale;
    let height = naturalHeight * this.scale;

    let dx = cWidth / 2 - width / 2;
    let dy = cHeight / 2 - height / 2;

    // this.ctx.drawImage(this.img, dx, dy, width, height)
    this.ctx.drawImage(this.img, -this.position.x, -this.position.y, naturalWidth, naturalHeight, dx, dy, width, height)
  }

  getPosition(position, width, height, targetW, targetH) {
    switch (position) {
      case 'center': {
        return {
          x: (targetW - width) / 2,
          y: (targetH - height) / 2
        }
      }
      case 'topLeft': {
        return {
          x: 0,
          y: 0
        }
      }
      case 'topRight': {
        return {
          x: targetW - width,
          y: 0
        }
      }
      default: {
        return {
          x: 0,
          y: 0
        }
      }
    }
  }

  // 上传logo
  upload(files, data) {
    data.value = URL.createObjectURL(files[0]);
    this.drawTextAndImg().catch(err => console.error(err));
  }

  _bypassSecurityTrustUrl(url) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  /**
   * 根据元素画文字和图片
   */
  async drawTextAndImg() {
    this.drawingCtx.clearRect(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);

    for (let t = 0; t < this.elementList.length; t++) {
      let ele = this.elementList[t];

      let tx = 0;
      let ty = 0;

      let top = ele.top * this.positionScale;
      let bottom = ele.bottom * this.positionScale;
      let left = ele.left * this.positionScale;
      let right = ele.right * this.positionScale;

      let width = ele.width * this.positionScale;
      let height = ele.height * this.positionScale;
      let fontSize = ele.fontSize * this.positionScale;

      switch (ele.type) {
        case 'file': {
          if (ele.show) {
            let img = await this.loadImg(ele.value);

            if (this.isRealNumber(top) && this.isRealNumber(left)) {
              tx = left;
              ty = top;
            } else if (this.isRealNumber(top) && this.isRealNumber(right)) {
              tx = this.drawingCanvas.width - width - right;
              ty = top
            } else if (this.isRealNumber(bottom) && this.isRealNumber(left)) {
              tx = left;
              ty = this.drawingCanvas.height - bottom
            } else if (this.isRealNumber(bottom) && this.isRealNumber(right)) {
              tx = this.drawingCanvas.width - width - right;
              ty = this.drawingCanvas.height - bottom
            }

            this.drawingCtx.drawImage(img, tx, ty, width, height);
          }

          break
        }
        case 'image': {

          let img = await this.loadImg(ele.value);

          if (this.isRealNumber(top) && this.isRealNumber(left)) {
            tx = left;
            ty = top;
          } else if (this.isRealNumber(top) && this.isRealNumber(right)) {
            tx = this.drawingCanvas.width - width - right;
            ty = top
          } else if (this.isRealNumber(bottom) && this.isRealNumber(left)) {
            tx = left;
            ty = this.drawingCanvas.height - bottom
          } else if (this.isRealNumber(bottom) && this.isRealNumber(right)) {
            tx = this.drawingCanvas.width - width - right;
            ty = this.drawingCanvas.height - bottom
          }

          this.drawingCtx.drawImage(img, tx, ty, width, height);

          break
        }
        case 'text': {
          this.drawingCtx.save();
          this.drawingCtx.font = `${fontSize}px ${ele.fontFamily || 'Microsoft YaHei UI'}`;
          this.drawingCtx.fillStyle = ele.fill;
          this.drawingCtx.textBaseline = 'middle';

          if (this.isRealNumber(top) && this.isRealNumber(left)) {
            tx = left;
            ty = top + fontSize / 2;
          } else if (this.isRealNumber(top) && this.isRealNumber(right)) {
            let measureText = this.drawingCtx.measureText(ele.value);
            tx = this.drawingCanvas.width - measureText.width - right;
            ty = top + fontSize / 2
          } else if (this.isRealNumber(bottom) && this.isRealNumber(left)) {
            tx = left;
            ty = this.drawingCanvas.height - bottom - fontSize / 2
          } else if (this.isRealNumber(bottom) && this.isRealNumber(right)) {
            let measureText = this.drawingCtx.measureText(ele.value);
            tx = this.drawingCanvas.width - measureText.width - right;
            ty = this.drawingCanvas.height - bottom - fontSize / 2
          }

          this.drawingCtx.fillText(ele.value, tx, ty);
          this.drawingCtx.restore();

          break
        }
        case 'canvas': {
          if (this.isRealNumber(top) && this.isRealNumber(left)) {
            tx = left;
            ty = top;
          } else if (this.isRealNumber(top) && this.isRealNumber(right)) {
            tx = this.drawingCanvas.width - width - right;
            ty = top
          } else if (this.isRealNumber(bottom) && this.isRealNumber(left)) {
            tx = left;
            ty = this.drawingCanvas.height - bottom
          } else if (this.isRealNumber(bottom) && this.isRealNumber(right)) {
            tx = this.drawingCanvas.width - width - right;
            ty = this.drawingCanvas.height - bottom
          }

          let borderRadius = ele.borderRadius || 0;
          let lineWidth = ele.lineWidth;
          let strokeStyle = ele.strokeStyle;

          this.drawingCtx.save();

          this.drawingCtx.beginPath();
          this.drawingCtx.moveTo(tx + borderRadius, ty);

          this.drawingCtx.arcTo(tx + width, ty, tx + width, ty + height, borderRadius);
          this.drawingCtx.arcTo(tx + width, ty + height, tx, ty + height, borderRadius);
          this.drawingCtx.arcTo(tx, ty + height, tx, ty, borderRadius);
          this.drawingCtx.arcTo(tx, ty, tx + borderRadius, ty, borderRadius);

          this.drawingCtx.lineWidth = lineWidth;
          this.drawingCtx.strokeStyle = strokeStyle;
          this.drawingCtx.fillStyle = ele.fill;
          this.drawingCtx.globalAlpha = ele.opacity || 1;

          this.drawingCtx.stroke();
          this.drawingCtx.fill();
          this.drawingCtx.closePath();

          this.drawingCtx.restore();
          break
        }
      }
    }
    return true;
  }

  isRealNumber(val) {
    // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
    if (val === '' || val == null) {
      return false;
    }
    if (!isNaN(val)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 文字改变将重新绘制素材canvas
   */
  textAndImgChange() {
    this.drawTextAndImg().catch(error => console.error(error))
  }

  /**
   * 字体大小改变
   */
  fontSizeChange(data, num) {
    data.fontSize += num;
    this.textAndImgChange();
  }

  /**
   *
   */
  closeTemplate() {
    this._templateStyle = {
      display: 'none'
    }
    this.img = null;
    this.elementList = null;
    this.position = {
      x: 0,
      y: 0,
    }
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.drawingCtx.clearRect(0, 0, this.drawingCtx.canvas.width, this.drawingCtx.canvas.height);
    if (this.compileCtx) {
      this.compileCtx.clearRect(0, 0, this.compileCtx.canvas.width, this.compileCtx.canvas.height);
    }
  }

  canvasToBlob(canvas, mimeType = 'image/png', quality = 1) {
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        resolve(blob)
      }, mimeType, quality)
    })
  }

  /**
   * 合并canvas 生成图片流
   */
  _compileLoading = false

  _compileCanvasToImg() {
    this._compileLoading = true
    this.compileCanvasToImg().then(() => this._compileLoading = false).catch(error => console.error(error))
  }

  async compileCanvasToImg() {
    if (!this.compileCanvas) {
      this.compileCanvas = <HTMLCanvasElement>this.document.createElement('canvas');
      this.compileCanvas.width = this._templateConfig.width;
      this.compileCanvas.height = this._templateConfig.height;
      this.compileCtx = this.compileCanvas.getContext('2d');
    }
    this.compileCtx.clearRect(0, 0, this.compileCanvas.width, this.compileCanvas.height);
    this.canvasList.every(canvas => {
      this.compileCtx.drawImage(canvas, 0, 0, this.compileCanvas.width, this.compileCanvas.height);
      return true;
    });

    let quality = 1;
    let blob = await this.canvasToBlob(this.compileCanvas, this._templateConfig.mimeType || 'image/png', quality);

    while (blob.size > this._templateConfig.size) {
      quality -= 0.2;
      blob = await this.canvasToBlob(this.compileCanvas, this._templateConfig.mimeType || 'image/png', quality);
    }

    this._dialog.closeSubject.next(blob);
    this._dialog.close();
  }

  /**
   * 模板类型改变
   */
  selectTemplateList() {
    this._templateService.getTemplate(this.queryTemplate).subscribe(res => {
      if (res.result.template_list instanceof Array) {
        this.templateList = res.result.template_list;
        if (this.templateList instanceof Array && this.templateList.length) {
          this.selectTemplate(this.templateList[0])
        }
      }
    })
  }

  /**
   * 加载更多模板
   * @param next
   */
  loadMoreTemplateList({next}) {
    ++this.queryTemplate.page_index
    this._templateService.getTemplate(this.queryTemplate).subscribe(res => {
      if (res.result.template_list instanceof Array && res.result.template_list.length) {
        this.templateList.push(...res.result.template_list)
        next()
      }
    })
  }

  /**
   * 素材类型改变 编辑模板不能
   */
  imgTypeChange() {
    this.imgList = []
    this.query.page_index = 1
    this.query.page_size = 60
    this.initTemplateMaterial()
    this.query.page_index = 3
    this.query.page_size = 20
  }

  /**
   * 获取素材背景
   */
  initTemplateMaterial() {
    this._templateService.initTemplateMaterial(this.query).subscribe(res => {
      if (res.result instanceof Array) {
        this.imgList.push(...res.result)
      }
    })
  }

  loadMoreTemplateMaterial({next}) {
    ++this.query.page_index
    this._templateService.initTemplateMaterial(this.query).subscribe(res => {
      if (res.result instanceof Array) {
        this.imgList.push(...res.result)
        next()
      }
    })
  }

  /**
   * 获取模板数据
   */
  getTemplate() {
    this._templateService.getTemplate(this.queryTemplate).subscribe(res => {
      if (res.result.template_list instanceof Array) {
        this.templateList.push(...res.result.template_list)
      }
    })
  }

  constructor(private domSanitizer: DomSanitizer,
              private _scrollService: ScrollService,
              private _templateService: TemplateService,
              private _dialog: Dialog,
              @Inject(DOCUMENT) private document: Document) {
    this.imgTypeChange();
  }

  query: any = {
    page_index: 1,
    page_size: 60,
  }

  queryTemplate: any = {
    page_index: 1,
    page_size: 10,
  }

  ngOnInit() {
    this.queryTemplate.width = this._templateConfig.width;
    this.queryTemplate.height = this._templateConfig.height;

    this._templateService.initTemplate().subscribe(res => {
      this.imgType = res.result.img_type_list;
      this.templateType = res.result.template_type_list
    });
    this.getTemplate();
  }

  ngOnDestroy(): void {
    this._mousedownEvent && this._mousedownEvent.unsubscribe();
    this._mousemoveEvent && this._mousemoveEvent.unsubscribe();
    this._mouseupEvent && this._mouseupEvent.unsubscribe();
    this._mouseoutEvent && this._mouseoutEvent.unsubscribe();
  }

  operating(overflowRef, clientWidth) {
    this._scrollService.scrollTo(overflowRef, {top: 0, left: overflowRef.scrollLeft + clientWidth});
  }

}
