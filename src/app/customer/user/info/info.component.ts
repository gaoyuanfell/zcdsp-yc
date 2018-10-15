import {ChangeDetectorRef, Component, ElementRef, Inject, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {CustomerUserService} from '../../../../service/customer/customer-user.service';
import {DomSanitizer} from '@angular/platform-browser';
import {Dialog} from '../../../../components/dialog/dialog';
import {Notification} from '../../../../components/notification/notification';
import {Base64} from 'js-base64';
import {Global} from '../../../../service/global';
import {fromEvent} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {ScrollService} from '../../../../components/back-top/scroll.service';
import {DOCUMENT} from '@angular/common';
import SparkMD5 from 'spark-md5';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.less'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoComponent implements OnInit {
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private _customerUserService: CustomerUserService,
    private domSanitizer: DomSanitizer,
    private renderer: Renderer2,
    private router: Router,
    private route: ActivatedRoute,
    private _dialog: Dialog,
    private _global: Global,
    private _scrollService: ScrollService,
    @Inject(DOCUMENT) private document: Document,
    private _notification: Notification,
  ) {

  }

  @ViewChild('bigImg') bigImg: ElementRef<any>;
  @ViewChild('pwdForm') pwdForm: ElementRef<any>;
  @ViewChild('fixedItem') fixedItem: ElementRef<any>;
  @ViewChild('containerForm') containerForm: ElementRef<any>;
  @ViewChild('pwd_template', {read: TemplateRef}) pwd_template_ref: TemplateRef<any>;
  @ViewChild('pwd_template', {read: ViewContainerRef}) pwd_template_view: ViewContainerRef;
  @ViewChild('apititude') apititude;
  @ViewChild('logo') logo;
  @ViewChild('trade') trade;
  list: Array<any> = [];
  total_count;
  tableList: Array<any>;
  listTitle;
  user: any = {}; // 用户基本信息 联系人模块的数据
  ad_category_list: Array<any> = []; // 行业分类
  main_qualification_list: Array<any> = [];
  optional_ad_category_list: Array<any> = []; // 行业类别
  user_logo_size_list: Array<any> = []; // 品牌logo支持的尺寸
  user_logo_list: Array<any> = []; // 标志
  optional_qualification_list: Array<any> = []; // 行业资质
  form: any = {};
  flag_pwd;
  authList;
  authUser;

  ngOnInit() {
    const obj = this.route.snapshot.data['auth'];
    this.authList = Object.keys(obj['jurisdiction_list']);
    this.authUser = obj['user'];
    this.search();
  }

  // 上传图片要转化
  upload(files, body, type) {  // $event x x.name
    let key = type ? 'logo_src' : 'url';
    const obj = {
      'file': files[0],
    };
    let img = new Image();  // 创建一个Image对象，实现图片的预下载
    img.src = URL.createObjectURL(files[0]);
    let files_copy = files[0];  // 封装组件的时候 在onload中把fiels置空了
    img.onload = (e) => {   // 图片下载完毕时异步调用  尺寸信息加载完图片后才能拿到
      if (type) {
        // 新增加的  改变的的不是一样的尺寸  提示  重复
        // 改变时一样的尺寸  不提示 替换
        let flag = true;
       if(body[key] && body['logo_height'] === img.height && body['logo_width'] === img.width) { // 已经存在的图片并且当前选中的就是重复的
         } else {
         this.user_logo_list.forEach( item => {
           if (   (item.logo_height === img.height) && (item.logo_width === img.width) ) {
             flag = false;
             this._notification.error('图片问题', 'LOGO尺寸已存在！');
           }
         })
       }
        if (flag) {
          body[key] = URL.createObjectURL(files_copy);  // 显示
          obj['logoSize'] = img.width + 'X' + img.height;
          this._customerUserService.userLog(obj).subscribe(res => {
            const len: Array<string> = res.result.imgSize.split('X');
            body['logo_width'] = parseInt(len[0]);
            body['logo_height'] = parseInt(len[1]);
            body['logo_src'] = res.result['filePath'];
          });
        }

      } else {
        this._customerUserService.imgQualification(obj).subscribe(res => {
          body['url'] = res.result.filePath;
        });
      }
    };
  }

  getDomSanitizerUrl(url) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  addLogo() {
    this.user_logo_list.push({id: this.uuid()});
  }

  addQualification() {
    this.optional_qualification_list.push({id: this.uuid()});
  }

  // 唯一tagid
  uuid() {
    const s = [];
    const hexDigits = '0123456789abcdef';
    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4';
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-';

    const uuid = s.join('');
    return uuid;
  }

  pwd_comform() {
    this.flag_pwd = this.form.new_pwd === this.form.firm_pwd ? false : true;
  }

  valid = false;
  ori_pwd = false;

  changePwd() {
    this.flag_pwd = false;
    this.form = {};
    this.valid = false;
    this.ori_pwd = false;
    this._dialog.open(this.pwd_template_ref, {title: '修改密码', flag: true, async: true}).subscribe((data: any) => {
      if (data) {
        if (!this.pwdForm['valid'] || this.form.new_pwd !== this.form.firm_pwd) {
          this.valid = true;
          return;
        }
        const body = {
          // o_pwd: Md5.hashStr(this.form.o_pwd),
          // new_pwd: Md5.hashStr(this.form.new_pwd),
          o_pwd: SparkMD5.hash(this.form.o_pwd),
          new_pwd: SparkMD5.hash(this.form.new_pwd),
          nb: Base64.encode(this.form.new_pwd),
          user_id: this.user.user_id
        };
        this._customerUserService.updatePwd(body).subscribe(res => {
            data();
            this._notification.success('密码修改', '密码修改成功！');
          },
          error => {
            this.ori_pwd = true;
          });
      } else {
        this.valid = false;
      }
    });
  }

  everyCheck(obj, title, type = '') {
    if (!type) {
      return obj.every((item) => {
        if (!item.url || !item.begin_date) {
          this._notification.success(title, ' ');
        }
        return (item.url && item.begin_date) ? true : false;
      });
    }
  }

  asd(target, value) {
    let offsetTop = target.offsetTop;
    target = target.offsetParent;
    while (target != value) {
      offsetTop += target.offsetTop;
      target = target.offsetParent;
    }
    return offsetTop;
  }

  save(infoForm) {
    // 整体表单的控制
    for (let item in  infoForm.controls) {
      if (item) {
        const el = <Element>this.document.getElementsByName(item)[0] ? this.document.getElementsByName(item)[0] : this.document.getElementById(item);
        if (infoForm.controls[item].invalid) {
          let top = this.asd(el, this._global.containerFullRef);
          this._scrollService.scrollTo(this._global.containerFullRef, {top: top - el.clientHeight});
          break;
        }
      }
    }
    if (!infoForm.valid) {
      this._notification.success('请完善表单内容', ' ');
      return;
    }
    // 主体资质信息
    const mainBool = this.main_qualification_list.every((item) => {
      if (!item.url || !item.begin_date) {
        this._scrollService.scrollTo(this._global.containerFullRef, {top: this.apititude.nativeElement.offsetTop - this.apititude.nativeElement.clientHeight});
        this._notification.success('请完善主体资质信息', ' ');
      }
      return item.url && item.begin_date;  // 不能写在if里面
    });
    if (!mainBool) {
      return;
    }
    // 行业资质，当你资质分类填写后，一定要上传资质图片的
    const optionBool = this.optional_qualification_list.every((item: any) => {
      let quaFlag = true;
      if (item.url && (!item.begin_date || !item.item_type_id || !item.quatification_name || !item.quatification_number)) {
        this._scrollService.scrollTo(this._global.containerFullRef, {top: this.trade.nativeElement.offsetTop - this.trade.nativeElement.clientHeight});
        this._notification.success('请完善行业资质信息', ' ');
        quaFlag = false

      }
      return quaFlag;
    });
    if (!optionBool) {
      return;
    }

    // logo品牌
    const logoBool = this.user_logo_list.every((item: any) => {
      let logoFlag = true;
      if (item.logo_src && !item.brand_name ) {
        this._scrollService.scrollTo(this._global.containerFullRef, {top: this.logo.nativeElement.offsetTop - this.logo.nativeElement.clientHeight});
        this._notification.success('请完善品牌商标信息', ' ');
        logoFlag = false
      }
      return logoFlag;
    });
    if (!logoBool) {
      return;
    }

    const obj = {
      user: this.user,
      main_qualification_list: this.main_qualification_list,
      user_logo_list: this.user_logo_list,
      optional_qualification_list: this.optional_qualification_list
    };
    this._customerUserService.editUpdate(obj).subscribe(res => {
      if (res.success === 200) {
        this._notification.success('保存成功', '修改用户成功');
        this.search();
      } else {
        this._notification.error('保存失败', res.errorList[0]._description);
      }
    });
  }

  changeSelect(event, x) {
    // 根据id找名字
    this.optional_ad_category_list.forEach((item1) => {
      if (item1.item_type_id === event) {
        x['item_type_name'] = item1.item_type_name;
      }
    });
    this.change_select();
  }

  change_select() {
    this.optional_ad_category_list.forEach((item1) => {
      item1.disabled = false;
    });
    this.optional_qualification_list.forEach((item) => {
      this.optional_ad_category_list.some((item1) => {
        if (item1.item_type_id === item.item_type_id) {
          item1.disabled = true;
          return true;
        }
      });
    });
  }

  _audit_status;
  _ad_category_name;

  search() {
    this._customerUserService.editList().subscribe(res => {
      this.user = res.result.user;
      this.user.email = this.user.email ? this.user.email : this.user.user_name;
      this._audit_status = this.user.zc_audit_status === 'AUDITED' ? true : false; // AUDITED: 审核通过
      this.ad_category_list = res.result.ad_category_list;
      // 通过id找到对应的name
      if (this.user.ad_category_id) {
        this._ad_category_name = this.ad_category_list.find(item => this.user.ad_category_id === item.ad_category_id).ad_category_name;
      }
      this.main_qualification_list = res.result.main_qualification_list;
      this.optional_ad_category_list = res.result.optional_ad_category_list;
      this.user_logo_size_list = res.result.user_logo_size_list;
      this.user_logo_list = res.result.user_logo_list.length === 0 ? [{id: this.uuid()}] : res.result.user_logo_list;
      this.optional_qualification_list = res.result.optional_qualification_list.length === 0 ? [{id: this.uuid()}] : res.result.optional_qualification_list;
      // 初始化数据
      this.change_select();
    });
  }

  get containerFullRef() {
    return this._global.containerFullRef;
  }

  _remove(list, index, type = '') {
    list.splice(index, 1);
    if (list.length === 0) {
      type ? this.addLogo() : this.addQualification();
    }
  }

  myMoveTo(type, dom) {
    this._global.containerFullRef.scrollTop = this.document.getElementById(dom).offsetTop;
  }

  test() {
    let itemChild = this.fixedItem.nativeElement.children;
    let contain = this.containerForm.nativeElement.children;
    itemChild[0].className = 'item cur';
    fromEvent(this._global.containerFullRef, 'scroll').subscribe((event) => {
      let scrollTop = this._global.scrollTop;  // 滚动的距离
      let clientHeight = document.documentElement.clientHeight;  // 可是区域 不包括网址那块
      let scrollHeight = this._global.scrollHeight;  // 可是区域中  从滚动条的位置开始算起
      // this.fixedItem.nativeElement.style.top = scrollTop + 'px';
      for (let i = 0; i < itemChild.length; i++) {
        if (scrollTop + 100 >= contain[i].offsetTop) {  // 临界点
          for (let j = 0; j < itemChild.length; j++) {
            itemChild[j].className = 'item';
          }
          itemChild[i].className = 'item cur';
        }
        if (scrollTop + clientHeight >= scrollHeight + 65 + 60) { // 底部 scrollHeight 是从滚动哪一点开始计算的
          for (let k = 0; k < itemChild.length; k++) {
            itemChild[k].className = 'item';
          }
          itemChild[itemChild.length - 1].className = 'item cur';
        }
      }
    });
  }


  setInvalidClass(form, formControl) {
    let cl;
    if (formControl && formControl.invalid && (formControl.dirty || formControl.touched || form.submitted)) {
      cl = 'has-error';
    }
    return cl;
  }

  extensions: any = {
    extensions: ['jpg', 'jpeg', 'bmp', 'png'],
    // mimeTypes: 'image/*',
    maxSize: 5
  };
  extensions1: any = {
    extensions: ['jpg'],
    mimeTypes: 'image/*',
    maxSize: 30
  };

  _imgError(error) {
    this._notification.error('上传', error.message);
  }


}

