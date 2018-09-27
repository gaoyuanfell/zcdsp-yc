import {ChangeDetectorRef, Component, ElementRef, Inject, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {AgentUserService} from '../../../../service/agent/agent-user.service';
import {DomSanitizer} from '@angular/platform-browser';
import {Dialog} from '../../../../components/dialog/dialog';
import {Notification} from '../../../../components/notification/notification';
import {Base64} from 'js-base64';
import {Global} from '../../../../service/global';
import {ActivatedRoute, Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';
import {ScrollService} from '../../../../components/back-top/scroll.service';
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
    private _agentUserService: AgentUserService,
    private domSanitizer: DomSanitizer,
    private renderer: Renderer2,
    private _dialog: Dialog,
    private _notification: Notification,
    private route: ActivatedRoute,
    private router: Router,
    private _global: Global,
    private _scrollService: ScrollService,
    @Inject(DOCUMENT) private document: Document,
  ) {
  }

  @ViewChild('fixedItem') fixedItem: ElementRef<any>;
  @ViewChild('pwdForm') pwdForm: ElementRef<any>;
  @ViewChild('containerForm') containerForm: ElementRef<any>;
  @ViewChild('pwd_template', {read: TemplateRef}) pwd_template_ref: TemplateRef<any>;
  @ViewChild('pwd_template', {read: ViewContainerRef}) pwd_template_view: ViewContainerRef;
  @ViewChild('info') info;
  @ViewChild('link') link;
  @ViewChild('apititude') apititude;
  @ViewChild('logo') logo;
  @ViewChild('trade') trade;
  anchorList;

  list: Array<any> = [];
  total_count;
  tableList: Array<any>;
  listTitle;
  user: any = {}; // 用户基本信息 联系人模块的数据
  ad_category_list: Array<any> = []; // 行业分类
  main_qualification_list: Array<any> = [];
  optional_ad_category_list: Array<any> = []; // 行业类别
  user_logo_size_list: Array<any> = []; // 品牌logo支持的尺寸
  user_logo_list: Array<any> = [{id: this.uuid()}]; // 标志
  optional_qualification_list: Array<any> = []; // 行业资质
  form: any = {};
  flag_pwd;
  logo_tem: any; // 当尺寸不对的时候，还是显示原来的图片
  type;  // 客户列表的新增和编辑的flag
  user_id;
  self; // 代理账户本身的flag
  _account;

  ngOnInit() {
    // let query = this.route.snapshot.queryParams;
    this.route.params.subscribe((params) => {
      if (params.hasOwnProperty('id')) {
        this.type = params.id === '0' ? false : true; // false====‘新增客户’
        this.user_id = params.id;
      } else {
        this.self = true; // 代理账户本身的
      }
    });
    this.search();
  }

  upload(files, body, key, type) {  // $event x x.name
    // 获取文件流
    body[key] = URL.createObjectURL(files[0]);  // 显示
    const obj = {
      'file': files[0],
    };
    let img = new Image();
    img.src = body[key];
    let files_copy = files[0];
    img.onload = (e) => {
      if (type) {
        obj['logoSize'] = img.width + 'X' + img.height;
        this._agentUserService.userLog(obj).subscribe(res => {
          const len: Array<string> = res.result.imgSize.split('X');
          body['logo_width'] = parseInt(len[0]);
          body['logo_height'] = parseInt(len[1]);
          body['logo_src'] = res.result['filePath'];
        });
        this.logo_tem = URL.createObjectURL(files_copy);
      } else {
        this._agentUserService.imgQualification(obj).subscribe(res => {
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
        // if (!this.pwdForm['dirty']) return;
        const body = {
          // o_pwd: Md5.hashStr(this.form.o_pwd),
          // new_pwd: Md5.hashStr(this.form.new_pwd),
          o_pwd: SparkMD5.hash(this.form.o_pwd),
          new_pwd: SparkMD5.hash(this.form.new_pwd),
          nb: Base64.encode(this.form.new_pwd),
          user_id: this.user.user_id
        };
        this._agentUserService.updatePwd(body).subscribe(res => {
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
      return item.url && item.begin_date;
    });
    if (!mainBool) {
      return;
    }
    // 行业资质，当你资质分类填写后，一定要上传资质图片的
    const optionBool = this.optional_qualification_list.every((item: any) => {
      if (item.item_type_id && !item.url) {
        this._scrollService.scrollTo(this._global.containerFullRef, {top: this.trade.nativeElement.offsetTop - this.trade.nativeElement.clientHeight});
        this._notification.success('请上传行业资质的图片', ' ');
      }
      return ((item.item_type_id && item.url) || (!item.item_type_id));
    });
    if (!optionBool) {
      return;
    }

    let body: any = {
      user: {...this.user},
      main_qualification_list: this.main_qualification_list,
    };
    if (!this.type) {
      if (this.self) {  // 代理客户自身
        this._agentUserService.selfSave(body).subscribe(res => {
          this._notification.success('修改成功', '修改用户成功');
        });
        return;
      }
      body.user.user_id = 0;
      body.user.password = SparkMD5.hash(this.user.password);
      body.user.verify_des_pwd = Base64.encode(this.form.password);
      body.user_logo_list = this.user_logo_list;
      body.optional_qualification_list = this.optional_qualification_list;

      this._agentUserService.addSave(body).subscribe(res => {
          this._notification.success('新增成功', '新增用户成功');
          this.router.navigate(['/us/user/customer']);
        },
        error => {    // http:200   success:500 这个在这里。

        });
    } else {
      body.user_logo_list = this.user_logo_list;
      body.optional_qualification_list = this.optional_qualification_list;
      this._agentUserService.editUpdate(body).subscribe(res => {
        this._notification.success('修改成功', '修改用户成功');
        this.router.navigate(['/us/user/customer']);
      });
    }

  }

  changeSelect(event, x) {
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
    // 新增用户
    if (!this.type) {
      if (this.self) {  // 代理客户自身
        this._agentUserService.selfInit({user_id: this.user_id}).subscribe(res => {
          this.user = res.result.user;
          this.user.email = this.user.email ? this.user.email : this.user.user_name;
          this.ad_category_list = res.result.ad_category_list;
          this._audit_status = this.user.zc_audit_status === 'AUDITED' ? true : false; // AUDITED: 审核通过
          // 通过id找到对应的name
          if (this.user.ad_category_id) {
            this._ad_category_name = this.ad_category_list.find(item => this.user.ad_category_id === item.ad_category_id).ad_category_name;
          }
          this.main_qualification_list = res.result.main_qualification_list;
          // 初始化数据
        });
        return;
      }
      this._agentUserService.addInit().subscribe(res => {
        // 在新增加用户的时候，后台不传递user这个字段
        this.ad_category_list = res.result.ad_category_list;
        this.main_qualification_list = res.result.main_qualification_list;
        this.optional_ad_category_list = res.result.optional_ad_category_list;
        this.user_logo_size_list = res.result.user_logo_size_list;
        this.optional_qualification_list = res.result.optional_qualification_list.length === 0 ? [{id: this.uuid()}] : res.result.optional_qualification_list;
        // 初始化数据
        this.change_select();
      });
    } else {  // 编辑用户
      this._agentUserService.editInit({user_id: this.user_id}).subscribe(res => {
        this.user = res.result.user;
        this.user.email = this.user.email ? this.user.email : this.user.user_name;
        this.user_logo_list = res.result.user_logo_list.length === 0 ? [{id: this.uuid()}] : res.result.user_logo_list;
        this.ad_category_list = res.result.ad_category_list;
        this._audit_status = this.user.zc_audit_status === 'AUDITED' ? true : false; // AUDITED: 审核通过
        // 通过id找到对应的name
        if (this.user.ad_category_id) {
          this._ad_category_name = this.ad_category_list.find(item => this.user.ad_category_id === item.ad_category_id).ad_category_name;
        }
        this.main_qualification_list = res.result.main_qualification_list;
        this.optional_ad_category_list = res.result.optional_ad_category_list;
        this.user_logo_size_list = res.result.user_logo_size_list;
        this.optional_qualification_list = res.result.optional_qualification_list.length === 0 ? [{id: this.uuid()}] : res.result.optional_qualification_list;
        // 初始化数据
        this.change_select();
      });
    }

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

  setInvalidClass(form, formControl) {
    let cl;
    if (formControl && formControl.invalid && (formControl.dirty || formControl.touched || form.submitted)) {
      cl = 'has-error';
    }
    return cl;
  }

  exist_flag;

  // 账户校验
  userNameVaild() {
    this._agentUserService.existUser({userName: this.user.user_name}).subscribe(res => {
      this.exist_flag = res.result;  // false说明账户不存在
    });
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

