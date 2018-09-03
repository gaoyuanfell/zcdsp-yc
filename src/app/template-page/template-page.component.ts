import {Component, ComponentFactoryResolver, ElementRef, Inject, Injector, OnInit, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {PublicService} from '../../service/public.service';
import * as qs from 'querystring';
import {TemplateService} from '../../service/template.service';
import {Notification} from '../../components/notification/notification';
import {environment} from '../../environments/environment';
import {Dialog} from '../../components/dialog/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {TemplateBoxComponent} from './template-box.component';
import {TextComponent} from './brick/text.component';
import {ImageComponent} from './brick/image.component';
import {SlideComponent} from './brick/slide.component';
import {LinkComponent} from './brick/link.component';
import {ButtonComponent} from './brick/button.component';
import {VideoComponent} from './brick/video.component';
import {FormComponent} from './brick/form.component';
import {LineComponent} from './brick/line.component';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-template-page',
  templateUrl: './template-page.component.html',
  styleUrls: ['./template-page.component.less']
})
export class TemplatePageComponent implements OnInit {

  templateUrl = environment.TEMPLATE;

  @ViewChild('container', {read: ViewContainerRef}) containerRef: ViewContainerRef

  componentInstance;

  componentBoxList: any[] = [];

  get componentList() {
    return this.componentBoxList.map(cl => cl.instance);
  }

  pushBrick(type, value: any = {}) {
    let componentBoxFactory = this.componentFactoryResolver.resolveComponentFactory(TemplateBoxComponent);
    let componentBoxRef = this.containerRef.createComponent<TemplateBoxComponent>(componentBoxFactory);
    componentBoxRef.instance.id = 'template_' + Math.floor(Math.random() * 1000000)

    let configure = value.configure;
    let list = value.list;
    let formList = value.formList;

    switch (type) {
      case 'text': {
        let componentRef = componentBoxRef.instance.createComponent<TextComponent>(TextComponent)
        if (configure) {
          configure.value = decodeURIComponent(window.atob(configure.value));
          componentRef.instance.configure = configure
        } else {
          componentRef.instance.configure.value = `<p>测试文本</p>`;
        }
        break;
      }
      case 'image': {
        let componentRef = componentBoxRef.instance.createComponent<ImageComponent>(ImageComponent)
        componentRef.instance.list = list || []
        break;
      }
      case 'slide': {
        let componentRef = componentBoxRef.instance.createComponent<SlideComponent>(SlideComponent)
        if (configure) {
          componentRef.instance.configure = configure
        }
        componentRef.instance.list = list || []
        break;
      }
      case 'link': {
        let componentRef = componentBoxRef.instance.createComponent<LinkComponent>(LinkComponent)
        if (configure) {
          componentRef.instance.configure = configure
        } else {
          componentRef.instance.configure.value = `链接文本`;
        }
        break;
      }
      case 'button': {
        let componentRef = componentBoxRef.instance.createComponent<ButtonComponent>(ButtonComponent)
        console.info(configure)
        if (configure) {
          componentRef.instance.configure = configure
        } else {
          componentRef.instance.configure.value = `按钮文字`;
        }
        break;
      }
      case 'video': {
        let componentRef = componentBoxRef.instance.createComponent<VideoComponent>(VideoComponent)
        componentRef.instance.configure = configure || {};
        break;
      }
      case 'form': {
        let componentRef = componentBoxRef.instance.createComponent<FormComponent>(FormComponent)
        componentRef.instance.setFormList(formList || this.formList);
        if (configure) {
          componentRef.instance.configure = configure
        }
        break;
      }
      case 'line': {
        let componentRef = componentBoxRef.instance.createComponent<LineComponent>(LineComponent)
        if (configure) {
          componentRef.instance.configure = configure
        }
        break;
      }
    }

    this.componentList.forEach(cl => {
      cl.checked = false;
    })

    componentBoxRef.instance.checked = true;
    this.componentInstance = componentBoxRef.instance;
    this.componentBoxList.push(componentBoxRef);
    componentBoxRef.instance.remove = () => {
      let index = this.componentList.indexOf(componentBoxRef.instance);
      if (!!~index) {
        this.containerRef.remove(this.containerRef.indexOf(componentBoxRef.hostView));
        this.componentBoxList.splice(index, 1);
        this.componentInstance = null;
      }
    }

    componentBoxRef.instance.selectedEvent.subscribe(data => {
      if (this.componentInstance != data) {
        this.componentList.forEach(cl => {
          cl.checked = false;
        })
        this.componentInstance = data
        this.componentInstance.checked = true;
      }
    });

    /**
     * 获取开始拖拽的数据
     */
    componentBoxRef.instance.dragIdEvent.subscribe(({id, y}) => {
      this.dragId = id
      this.dragY = y
    })
  }

  /**
   * 元素移除
   * @param instance
   */
  remove(instance) {
    let index = this.componentList.indexOf(instance);
    if (!!~index) {
      this.containerRef.remove(this.containerRef.indexOf(this.componentBoxList[index].hostView));
      this.componentBoxList.splice(index, 1);
      if (instance === this.componentInstance) this.componentInstance = null;
      instance = null;
    }
  }

  //////////////////////////////////////////


  /////////////////////////////////////////

  /**
   * 图片上传
   * @param files
   */
  imgUpload(files) {
    this._publicService.imgUpload({
      file: files[0]
    }).subscribe(res => {
      let filePath = res.result.filePath;
      delete res.result.filePath;
      let url = `${filePath}?${qs.stringify(res.result)}`;
      this.componentInstance.templateInstance.setImg(url);
    })
  }

  /**
   * 视频上传
   * @param files
   */
  videoUpload(uploadData) {
    uploadData.chunkNext.subscribe(data => {
      this._publicService.videoUpload({
        file: data.files[0],
        chunk: data.chunk,
        chunk_size: data.chunk_size,
        chunks: data.chunks,
        guid: data.md5
      }).subscribe(res => {
        if (res.result.is_all_uploaded) {
          this.componentInstance.templateInstance.configure.value = res.result.file_path;
        }
      })
    })
    uploadData.upload();
  }

  //////////////////////////////////////////
  cacheImg

  selectImg(data) {
    this.cacheImg = data
  }

  /**
   * 图片移除
   * @param index
   */
  removeImg(index) {
    this.componentInstance.templateInstance.removeImg(index);
  }

  //////////////////  表单 ///////////////////////

  formType = [
    {label: '文本', value: 'text'},
    {label: '电话', value: 'tel'},
    {label: '邮箱', value: 'email'},
    {label: '日期', value: 'date'},
    {label: '单选', value: 'radio'},
    {label: '多选', value: 'checkbox'},
    {label: '多文本', value: 'textarea'},
    {label: '下拉框', value: 'select'},
  ]

  formList: any[] = [
    {
      type: 'text',
      label: '字段名',
      placeholder: '',
      name: 'value' + Math.floor(Math.random() * 100000),
      _placeholder: true,
    },
    {
      type: 'submit',
      label: '提交',
      style: {
        'background-color': '#20a0ff',
        'color': '#ffffff',
        'border-radius.px': 5,
      }
    }
  ]

  /**
   * 选项改变
   * @param data
   */
  formChange(data) {
    switch (data.type) {
      case 'text': {
        data._placeholder = true;
        data.list = null;
        break;
      }
      case 'tel': {
        data._placeholder = true;
        data.list = null;
        break;
      }
      case 'email': {
        data._placeholder = true;
        data.list = null;
        break;
      }
      case 'date': {
        data._placeholder = false;
        data.list = null;
        break;
      }
      case 'textarea': {
        data._placeholder = true;
        data.list = null;
        break;
      }
      case 'radio': {
        data._placeholder = false;
        data.list = Array.from({length: 2}).map(() => {
          return {value: Math.floor(Math.random() * 100000)}
        })
        break;
      }
      case 'checkbox': {
        data._placeholder = false;
        data.list = Array.from({length: 2}).map(() => {
          return {}
        })
        break;
      }
      case 'select': {
        data._placeholder = false;
        data.list = Array.from({length: 2}).map(() => {
          return {}
        })
        break;
      }
    }
  }

  /**
   * 添加选项
   * @param type
   * @param list
   * @param index
   */
  addFormList(type, list, index?) {
    switch (type) {
      case 'add': {
        list.push({})
        break;
      }
      case 'remove': {
        list.splice(index, 1);
        break;
      }
    }

  }

  /**
   * 添加一项输入框
   */
  addForm() {
    this.formList.splice(this.formList.length - 1, 0, {
      type: 'text',
      label: '字段名',
      placeholder: '',
      name: 'value' + Math.floor(Math.random() * 100000),
      _placeholder: true,
    })
  }

  /**
   * 选项动作 remove up down
   * @param type
   * @param number
   */
  actionForm(type, number) {
    switch (type) {
      case 'remove': {
        if (this.formList.length == 2) break;
        this.formList.splice(number, 1)
        break;
      }
      case 'up': {
        if (number == 0) break;
        let bo = this.formList[number];
        this.formList.splice(number, 1)
        this.formList.splice(number - 1, 0, bo)
        break;
      }
      case 'down': {
        if (number == this.formList.length - 2) break;
        let bo = this.formList[number];
        this.formList.splice(number, 1)
        this.formList.splice(number + 1, 0, bo)
        break;
      }
    }
  }

  /**
   * 设置表单
   */
  setFormList() {
    this.componentInstance.templateInstance.setFormList(this.formList)
  }

  /////////////////////////////////////////

  templateName; // 模板名称
  templateType; // 模板类型
  templateCover; // 模板预览图
  _previewCodeUrl

  templateCoverChange(files) {
    this._publicService.imgUpload({
      file: files[0]
    }).subscribe(res => {
      let filePath = res.result.filePath;
      delete res.result.filePath;
      this.templateCover = `${filePath}?${qs.stringify(res.result)}`;
    })
  }

  /**
   * 预览
   */
  preview() {
    let body = this.getData();
    if (!body.name) {
      this._notification.warning('提示', '请填写落地页名称');
      return
    }
    if (this.system === 'Y') {
      if (!body.type) {
        this._notification.warning('提示', '请选择落地页类型');
        return
      }
    }
    let w = window.open();
    this._templateService.landingPreview(body).subscribe(res => {
      w.location.href = `${this.templateUrl}/template/preview/${res.result.id}`
    }, () => {
      w.close()
    })
  }

  /**
   * 二维码预览
   */
  privateCode() {
    let body = this.getData();
    if (!body.name) {
      this._notification.warning('提示', '请填写落地页名称');
      return
    }
    this._templateService.landingPreview(body).subscribe(res => {
      this._previewCodeUrl = this._templateService.landingQrcode({tmp_id: res.result.id, render_url: `${this.templateUrl}/template/preview`, _: Date.now()})
    })
  }

  /**
   * 提交
   */
  submit() {
    let body = this.getData();
    if (!body.name) {
      this._notification.warning('提示', '请填写落地页名称');
      return
    }
    if (this.system === 'Y') {
      if (!body.type) {
        this._notification.warning('提示', '请选择落地页类型');
        return
      }
      if (!body.cover) {
        this._notification.warning('提示', '请上传落地页预览图');
        return
      }
    }
    body.is_system = this.system;
    this._templateService.landingAdd(body).subscribe(res => {
      this._notification.success('落地页模板', '提交成功')
    })
  }

  getData() {
    let body: any = {
      elements: [],
      name: this.templateName,
      type: this.templateType,
      cover: this.templateCover,
    };
    this.componentList.forEach(template => {
      let cl = template.templateInstance;
      switch (cl.type) {
        case 'text': {
          let configure = {...cl.configure};
          configure.value = window.btoa(encodeURIComponent(configure.value)) // decodeURIComponent(window.atob(''))
          body.elements.push({
            type: cl.type,
            configure: configure,
          });
          break;
        }
        case 'image': {
          body.elements.push({
            type: cl.type,
            list: cl.list,
          });
          break;
        }
        case 'slide': {
          body.elements.push({
            type: cl.type,
            list: cl.list,
            configure: cl.configure,
          });
          break;
        }
        case 'video': {
          body.elements.push({
            type: cl.type,
            configure: cl.configure,
          });
          break;
        }
        case 'link': {
          body.elements.push({
            type: cl.type,
            configure: cl.configure,
          });
          break;
        }
        case 'button': {
          body.elements.push({
            type: cl.type,
            configure: cl.configure,
          });
          break;
        }
        case 'form': {
          body.elements.push({
            type: cl.type,
            formList: cl.formList,
            configure: cl.configure,
          });
          break;
        }
        case 'line': {
          body.elements.push({
            type: cl.type,
            configure: cl.configure,
          });
          break;
        }
      }
    });
    return body;
  }

  ///////////////////  系统落地页操作  ////////////////////

  /**
   * 设置系统模板
   */
  selectedTemplate(template) {
    this.containerRef.clear();
    this.componentBoxList.length = 0;
    let elements = JSON.parse(JSON.stringify(template.elements));
    elements.forEach(value => {
      let configure = value.configure;
      let list = value.list
      let formList = value.formList;
      this.pushBrick(value.type, {configure, list, formList})
    })
  }

  /////////////////////////////////////////

  templateTypeList
  templateSysList = []

  showType: 'assembly' | 'template' = 'assembly'

  auth;
  system // 是否是系统模板

  query = {
    page_index: 1,
    page_size: 30,
  }

  getTemplateSysList() {
    this._templateService.landingSystem(this.query).subscribe(res => {
      this.templateSysList.push(...res.result.items);
    });
  }

  /**
   * 加载更多的系统模板
   * @param {any} next
   */
  loadMoreTemplateSysList({next}) {
    if (this.showType !== 'template') return;
    ++this.query.page_index
    this._templateService.landingSystem(this.query).subscribe(res => {
      this.templateSysList.push(...res.result.items);
      next();
    });
  }

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private injector: Injector,
              private router: Router,
              private route: ActivatedRoute,
              private renderer: Renderer2,
              @Inject(DOCUMENT) private document: Document,
              private _dialog: Dialog,
              private _notification: Notification,
              private _publicService: PublicService,
              private _templateService: TemplateService) {
    _templateService.templateType().subscribe(res => {
      this.templateTypeList = res.result;
    });

    this.auth = route.snapshot.data.auth;
    this.getTemplateSysList();
    this.query.page_index = 3;
    this.query.page_size = 10;

    this.system = route.snapshot.data.system
  }


  ngOnInit() {
    this.dropEventInit();
  }

  dragId // 拖动id
  dragY // 拖动坐标
  @ViewChild('emulatedDevices') emulatedDevicesRef: ElementRef

  /**
   * 初始化模板拖拽
   */
  dropEventInit() {
    this.renderer.listen(this.emulatedDevicesRef.nativeElement, 'dragover', (event: DragEvent) => {
      event.preventDefault();
      if (event.y - this.dragY === 0) return;
      let node = this.document.getElementById(this.dragId);
      let targetNode = this.findTemplateNode(event.target);
      if (node === targetNode) return;
      if (targetNode) {
        let bcr = targetNode.getBoundingClientRect();
        let tryDrag = (bcr.height / 2 + bcr.top) < event.y && event.y - (bcr.height / 2 + bcr.top) <= 20;
        if (event.y - this.dragY < 0) {
          tryDrag = (bcr.height / 2 + bcr.top) > event.y && (bcr.height / 2 + bcr.top) - event.y <= 20;
          [node, targetNode] = [targetNode, node];
        }
        if (tryDrag) {
          this.swapElements(node, targetNode);
          console.dir(targetNode)
          let index1 = this.componentBoxList.findIndex(cb => cb.location.nativeElement === targetNode);
          let index2 = this.componentBoxList.findIndex(cb => cb.location.nativeElement === node);
          [this.componentBoxList[index2], this.componentBoxList[index1]] = [this.componentBoxList[index1], this.componentBoxList[index2]]
        }
      }
      this.dragY = event.y
    });

    this.renderer.listen(this.emulatedDevicesRef.nativeElement, 'dragend', (event: DragEvent) => {
      event.preventDefault();
    });

    this.renderer.listen(this.emulatedDevicesRef.nativeElement, 'drop', (event) => {
      event.preventDefault();
    })
  }

  /**
   * 找到 TEMPLATE-BOX 父级
   * @param node
   * @returns {any}
   */
  findTemplateNode(node) {
    if (!node) return;
    if (node.nodeName === 'TEMPLATE-BOX') return node;
    return this.findTemplateNode(node.parentNode)
  }

  /**
   * 元素交换位置
   * @param a
   * @param b
   * @returns {any}
   */
  swapElements(a, b) {
    if (a == b) return;
    // 记录父元素
    let bp = b.parentNode, ap = a.parentNode;
    // 记录下一个同级元素
    let an = a.nextElementSibling, bn = b.nextElementSibling;
    // 如果参照物是邻近元素则直接调整位置
    if (an == b) return bp.insertBefore(b, a);
    if (bn == a) return ap.insertBefore(a, b);
    if (a.contains(b)) // 如果a包含了b
      return ap.insertBefore(b, a), bp.insertBefore(a, bn);
    else
      return bp.insertBefore(a, b), ap.insertBefore(b, an);
  };
}
