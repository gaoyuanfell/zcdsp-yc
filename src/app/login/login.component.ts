import {Component, OnInit, Renderer2, TemplateRef, ViewChild} from '@angular/core';
import {PublicService} from '../../service/public.service';
import {Router, ActivatedRoute} from '@angular/router';
import SparkMD5 from 'spark-md5';
import {Dialog} from '../../components/dialog/dialog';
import {Base64} from 'js-base64';
import {Title} from '@angular/platform-browser';
import {AppState} from '../../store/model';
import {Store} from '@ngrx/store';
import * as MenuAction from '../../store/actions/menu.action';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  flags = false;

  constructor(
    private _publicService: PublicService,
    private router: Router,
    private route: ActivatedRoute,
    private _dialog: Dialog,
    private render: Renderer2,
    private title: Title,
    private $store: Store<AppState>,
  ) {
    this.$store.dispatch(new MenuAction.AssignMenu([]));
  }

  form: any = {};
  forget: any = {};
  flag_change() {
    this.flags=!this.flags
    this.form = {};
    this.forget = {};
  }

  ngOnInit() {
    this.title.setTitle(`智橙移动 领先的信息流广告投放平台`);
    this.verifyCode();
    this.route.queryParams.subscribe( res => {
      this.form.userName = res.user_name ? res.user_name : '';
    })
  }


  _valid = false;
  vertCodeUrl;

  verifyCode() {
    let obj = {
      _: Date.now(),
      w: 110,
      h: 45
    };
    this.vertCodeUrl = this._publicService.verifyCode(obj);
  }


  countdown = 60;
  flagCode = false;
  codeText = '获取验证码';
  codeTest() {
    if (localStorage.getItem('countdown') && +localStorage.getItem('countdown') <= 60 && +localStorage.getItem('countdown') > 0) {
      this.countdown = +localStorage.getItem('countdown');
      this.countdown--;
      this.flagCode = true;
      this.codeText = '重新发送';
      localStorage.setItem('countdown', this.countdown + '');
      setTimeout(() => {
        this.codeTest();
      }, 1000);
    } else {  // 不存在 || === 60
      this.countdown = 60;
      this.flagCode = false;
      this.codeText = '获取验证码';
      localStorage.setItem('countdown', this.countdown + '');
    }
  }


  @ViewChild('code_template', {read: TemplateRef}) code_template_ref: TemplateRef<any>;
  @ViewChild('forget_code') forget_code_ref;

  forgetCodeUrl;
  type = 1;
  pwd_show = false; // 是否显示密码框
  _description;
  pwd_vertify_show;
  error;
  errorText;

  verifyPwd() {
    this.forget.forgetCode = undefined;
    this.pwd_vertify_show = undefined;
    this.forget_vertify_Code();
    this._dialog.open(this.code_template_ref, {title: '', flag: true, async: true}).subscribe((data: any) => {
      if (data && this.forget_code_ref.valid && this.error !=='img_code') {
        let obj = {
          type: this.type,
          user_name: this.forget.user_name,
          img_code: this.forget.forgetCode
        };
        this._publicService.send(obj).subscribe(res => {  // 调用成功后，手机上会出现验证码
          if (res.success === 200) {
            data();
            this.pwd_show = false;
            // 发送验证码
            localStorage.setItem('countdown', this.countdown + '');
            this.codeTest();
          }
        }, error => {  // 这边做了处理 前端是抛出异常
          this.error = error.errorList[0]._code;
          this.errorText = error.errorList[0]._description;
          if (error.errorList[0]._code === 'user_name' || error.errorList[0]._code === 'type') {
            data();
          }
          this.pwd_show = false;
        });
      }
    });
  }

  // 忘记密码
  number = 0;
  forget_vertify_Code() {
    ++this.number;
    if (document.getElementById('freshen')) {
      this.render.setStyle(document.getElementById('freshen'), 'transform', `rotate(${this.number * 360}deg)`);
    }
    let obj = {
      _: Date.now(),
      w: 500,
      h: 45
    };
    this.forgetCodeUrl = this._publicService.verifyCode(obj);
  }

  //
  setInvalidClass(form, formControl) {
    let cl;
    if ( formControl && formControl.invalid && (formControl.dirty || formControl.touched || form.submitted) ) {
      cl = 'has-error';
    }
    if (formControl && formControl.valid) {
      cl = 'has-success';
    }
    return cl;
  }

  // 验证
  save1() {
    let obj = {
      user_name: this.forget.user_name,
      code: this.forget.pwd_code
    };
    this._publicService.checkVerifycode(obj).subscribe(res => {
      if (res.success === 200) {
        this.pwd_show = true;
      }
    }, error => {
      this.error = error.errorList[0]._code;
      this.errorText = error.errorList[0]._description;
      this.pwd_show = false;
    });
  }

  // 修改密码
  save2() {
    let obj = {
      pwd: SparkMD5.hash(this.forget.password),
      b_pwd: Base64.encode(this.forget.password)
    };
    this._publicService.resetPassword(obj).subscribe(res => {
      if (res.success === 200) {
        this.flags = false;  // 到登入页面
        this.pwd_show = false;
        this.forget = {};
        this.form = {};
      }
    }, error => {
      this.pwd_show = false;
      this.forget.password = undefined;
      this.forget.old_pwd = undefined;
      this.forget.pwd_code = undefined;
    });
  }


  // 鼠标聚焦后报错不显示
  errorFocus(errorName) {
    if (errorName === this.error) {
      this.error = undefined;
      this.errorText = undefined;
    }
  }

  flag: boolean = false; // 密码不一致的报错关键字
  pwd_comfirm() {
    this.flag = this.form.password === this.form.old_pwd ? false : true;
  }

  login(inform) {
    this._valid = true;
    if (inform.valid) {
      this._publicService.login({
        username: this.form.userName,
        password: SparkMD5.hash(this.form.passWord),
        veritycode: this.form.vertCode
      }).subscribe(res => {
        if (res.success === 200) {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/']);
        }
      });
    }
  }
}

@Component({
  selector: 'app-login2',
  template: ``,
})
export class Login2Component implements OnInit {
  ngOnInit(): void {
  }

}
