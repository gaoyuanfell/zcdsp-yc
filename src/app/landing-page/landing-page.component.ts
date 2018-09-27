import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {PublicService} from '../../service/public.service';
import * as qs from 'querystring';
import {TemplateService} from '../../service/template.service';
import {Notification} from '../../components/notification/notification';
import {Dialog} from '../../components/dialog/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.less']
})
export class LandingPageComponent implements OnInit {


  @ViewChild('brickCanvas', {read: ViewContainerRef}) brickVcr: ViewContainerRef;

  canvasBox: any = {
    width: 600,
    height: 300
  };

  settingCache;

  get canvasBoxStyle() {
    if (!this.canvasBox) return null;
    return {
      'width.px': this.canvasBox.width,
      'height.px': this.canvasBox.height,
    };
  }

  brick = {
    square: {
      type: 'square',
      style: {
        'position': 'absolute',
        'top.px': 0,
        'left.px': 0,
        'width.px': 100,
        'height.px': 100,
        'background-color': '#000',
        'opacity': 1,
        'border-style': 'solid',
        'border-width.px': 0,
        'border-radius.px': 0,
      },
    },
    paragraph: {
      type: 'paragraph',
      style: {
        'position': 'absolute',
        'top.px': 0,
        'left.px': 0,
        'font-size.px': 12,
        'line-height': 1,
        'opacity': 1,
      },
      value: '测试文本'
    },
    image: {
      type: 'image',
      style: {
        'position': 'absolute',
        'overflow': 'hidden',
        'top.px': 0,
        'left.px': 0,
        'width.px': 0,
        'height.px': 0,
        'opacity': 1,
      },
      imgStyle: {
        'position': 'absolute',
        'opacity': 1,
        'top.px': 0,
        'left.px': 0,
      }
    }
  };


  query: any;

  private _brickList = [];

  get brickList() {
    return this._brickList;
  }

  set brickList(val) {
    this._brickList = val;
  }

  _zIndex = 0;

  /**
   * 添加元素
   * @param type
   */
  pushBrick(type) {
    let data = this.copy(this.brick[type]);
    data.style['z-index'] = ++this._zIndex;
    this.brickList.push(data);
    this.settingCache = data;
  }

  /**
   * 复制对象
   * @param target
   * @returns {any}
   */
  copy(target) {
    return JSON.parse(JSON.stringify(target));
  }

  /**
   * 全部清空
   */
  remove() {
    this._zIndex = 0;
    this.brickList = [];
    this.settingCache = null;
  }

  /**
   * 移除元素
   */
  removeBrick(settingCache = this.settingCache) {
    let index = this.brickList.indexOf(settingCache);
    if (index != -1) {
      this.brickList.splice(index, 1);
      if (settingCache === this.settingCache) this.settingCache = null;
      settingCache = null;
    }
  }

  /**
   * 加载图片
   * @param files
   * @param data
   * @param key
   */
  imageLoad(files, data, key) {
    this._publicService.imgUpload({
      file: files[0]
    }).subscribe(res => {
      let filePath = res.result.filePath;
      delete res.result.filePath;
      data[key] = `${filePath}?${qs.stringify(res.result)}`;
    });

    let fileReader = new FileReader();
    fileReader.readAsDataURL(files[0]);
    fileReader.onload = () => {
      data[`$${key}`] = fileReader.result;
      let img = new Image();
      img.onload = () => {
        this.settingCache.img = {
          width: img.width,
          height: img.height
        };
        this.isBackgroundChange();
      };
      img.src = fileReader.result;
    };
  }

  /**
   * 上下居中
   * @param checked
   */
  upDownMiddle() {
    this.settingCache.style['top.px'] = this.settingCache.style['top.px'] || 0;
    if (this.settingCache.upDownMiddle) {
      let height = 0;
      switch (this.settingCache.type) {
        case 'paragraph': {
          height = this.settingCache.style['font-size.px'];
          break;
        }
        case 'square':
        case 'image': {
          height = this.settingCache.style['height.px'];
          break;
        }
      }
      this.settingCache.style['top.px'] = (this.canvasBox.height - height) / 2;
    } else {
      delete this.settingCache.upDownMiddle;
    }
  }

  /**
   * 左右居中
   * @param checked
   */
  leftRightMiddle() {
    this.settingCache.style['left.px'] = this.settingCache.style['left.px'] || 0;
    if (this.settingCache.leftRightMiddle) {
      let width = 0;
      switch (this.settingCache.type) {
        case 'paragraph': {
          width = this.settingCache.style['font-size.px'] * this.settingCache.value.length;
          break;
        }
        case 'square':
        case 'image': {
          width = this.settingCache.style['width.px'];
          break;
        }
      }
      this.settingCache.style['left.px'] = (this.canvasBox.width - width) / 2;
    } else {
      delete this.settingCache.leftRightMiddle;
    }
  }

  /**
   * 如果是背景图
   */
  isBackgroundChange() {
    let width = this.canvasBox.width;
    let height = this.canvasBox.height;

    let _width = this.settingCache.img['width'];
    let _height = this.settingCache.img['height'];

    if (this.settingCache.is_background) {

      if (width > _width || height > _height) {
        this._notification.warning('背景', '背景图片太小，不能作为背景图');
        return;
      }

      this.settingCache.style['width.px'] = width;
      this.settingCache.style['height.px'] = height;

      if (width > height) {
        if (width / height < _width / _height) {
          this.settingCache.imgStyle['height.px'] = height;
          this.imgStyleHeightChange();
        } else {
          this.settingCache.imgStyle['width.px'] = width;
          this.imgStyleWidthChange();
        }
      } else {
        if (width / height > _width / _height) {
          this.settingCache.imgStyle['width.px'] = width;
          this.imgStyleWidthChange();
        } else {
          this.settingCache.imgStyle['height.px'] = height;
          this.imgStyleHeightChange();
        }
      }
    } else {
      this.settingCache.style['width.px'] = this.settingCache.img['width'];
      this.settingCache.style['height.px'] = this.settingCache.img['height'];

      delete this.settingCache.imgStyle['width.px'];
      delete this.settingCache.imgStyle['height.px'];
    }
  }

  /**
   * 底图宽改变
   */
  imgStyleWidthChange() {
    let _w = this.settingCache.imgStyle['width.px'];
    let _h = this.settingCache.imgStyle['height.px'];

    let w = this.settingCache.img['width'];
    let h = this.settingCache.img['height'];

    let __h = h / w * _w;
    if (__h) {
      this.settingCache.imgStyle['height.px'] = __h;
    } else {
      delete this.settingCache.imgStyle['width.px'];
      delete this.settingCache.imgStyle['height.px'];
    }
  }

  /**
   * 底图高改变
   */
  imgStyleHeightChange() {
    let _w = this.settingCache.imgStyle['width.px'];
    let _h = this.settingCache.imgStyle['height.px'];

    let w = this.settingCache.img['width'];
    let h = this.settingCache.img['height'];

    let __w = w / h * _h;
    if (__w) {
      this.settingCache.imgStyle['width.px'] = __w;
    } else {
      delete this.settingCache.imgStyle['width.px'];
      delete this.settingCache.imgStyle['height.px'];
    }
  }

  getData() {
    let data = {...this.canvasBox};
    let elements = [];
    for (let i = 0; i < this.brickList.length; i++) {
      let bl = this.brickList[i];
      if (bl.is_background) continue;
      let e: any = {};
      if (this.isRealNumber(bl.style['left.px'])) {
        e.left = bl.style['left.px'];
      }
      if (this.isRealNumber(bl.style['right.px'])) {
        e.right = bl.style['right.px'];
      }
      if (this.isRealNumber(bl.style['top.px'])) {
        e.top = bl.style['top.px'];
      }
      if (this.isRealNumber(bl.style['bottom.px'])) {
        e.bottom = bl.style['bottom.px'];
      }
      e.opacity = bl.style.opacity;
      e.sort = bl.style['z-index'];
      switch (bl.type) {
        case 'square': {
          e.type = 'canvas';
          e.width = bl.style['width.px'];
          e.height = bl.style['height.px'];
          e.fill = bl.style['background-color'];
          e.strokeStyle = bl.style['border-color'];
          e.lineWidth = bl.style['border-width.px'];
          e.borderRadius = bl.style['border-radius.px'];
          break;
        }
        case 'paragraph': {
          e.type = 'text';
          e.value = bl.value;
          e.fontSize = bl.style['font-size.px'];
          e.fill = bl.style.color;
          break;
        }
        case 'image': {
          e.type = 'image';
          if (bl.has_logo) {
            e.type = 'file';
            e.show = true;
          }
          e.value = bl.value;
          e.width = bl.style['width.px'];
          e.height = bl.style['height.px'];
          e.imgStyle = {};
          if (this.isRealNumber(bl.imgStyle['left.px'])) {
            e.imgStyle.left = bl.imgStyle['left.px'];
          }
          if (this.isRealNumber(bl.imgStyle['right.px'])) {
            e.imgStyle.right = bl.imgStyle['right.px'];
          }
          if (this.isRealNumber(bl.imgStyle['top.px'])) {
            e.imgStyle.top = bl.imgStyle['top.px'];
          }
          if (this.isRealNumber(bl.imgStyle['bottom.px'])) {
            e.imgStyle.bottom = bl.imgStyle['bottom.px'];
          }
          e.imgStyle.opacity = bl.imgStyle.opacity;
          break;
        }
      }
      elements.push(e);
    }

    data.elements = elements.sort((a, b) => a.sort - b.sort);

    if (!data.template_type) {
      this._notification.warning('提示', '请选择类型');
      return;
    }

    if (!data.preview_url) {
      this.saveDomToFile().then(preview_url => {
        data.preview_url = preview_url;
        this._templateService.saveTemplate({template: data}).subscribe(res => {
          this._notification.success('创意模板', '提交成功');
        });
      });
    } else {
      this._templateService.saveTemplate({template: data}).subscribe(res => {
        this._notification.success('创意模板', '提交成功');
      });
    }
  }

  /**
   * 将dom转图片 并且上传返回图片地址
   * @returns {Promise<string>}
   */
  async saveDomToFile() {
    let ref = document.querySelector('#brick-canvas');
    let canvasRef = await html2canvas(ref);
    let dataUrl = canvasRef.toDataURL();
    let blob = this.dataURLtoBlob(dataUrl);
    let file = new File([blob], `${Date.now()}.png`, {type: blob.type});
    let imgUpload = await this.toPromise(this._publicService.imgUpload({file: file}));
    let filePath = imgUpload.result.filePath;
    delete imgUpload.result.filePath;
    return `${filePath}?${qs.stringify(imgUpload.result)}`;
  }

  toPromise(observable) {
    return new Promise<any>((resolve, reject) => {
      observable.subscribe(res => {
        resolve(res);
      });
    });
  }

  dataURLtoBlob(dataurl) {
    let arr = dataurl.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
      type: mime
    });
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

  //////////////////////////

  templateTypeList;

  constructor(private _publicService: PublicService,
              private _templateService: TemplateService,
              private _notification: Notification,
              private _dialog: Dialog,
              private router: Router,
              private route: ActivatedRoute) {

    _templateService.templateType().subscribe(res => {
      this.templateTypeList = res.result;
    });

    this.auth = route.snapshot.data.auth;
  }

  auth;

  ngOnInit() {
  }

  imgLink;
  @ViewChild('imgBoxRef') imgBoxRef;

  toImage() {
    let ref = document.querySelector('#brick-canvas');
    let canvasRef = html2canvas(ref).then(canvasRef => {
      this.imgLink = canvasRef.toDataURL();
      this._dialog.open(this.imgBoxRef, {flag: false, title: '创意模板预览'});
    });
  }
}
