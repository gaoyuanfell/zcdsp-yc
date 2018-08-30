import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PublicService} from '../../service/public.service';
import {Router} from '@angular/router';
import SparkMD5 from 'spark-md5';
import {Dialog} from '../../components/dialog/dialog';
import {Base64} from 'js-base64';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  flags = false

  constructor(
    private _publicService: PublicService,
    private router: Router,
    private _dialog: Dialog,
  ) { }

  ngOnInit() {
    this.verifyCode();
  }
  userName;
  passWord;
  vertCode;
  _valid = false;
  vertCodeUrl;
  verifyCode() {
    this.vertCodeUrl = this._publicService.verifyCode({_: Date.now()})
  }



  countdown =  60;
  flagCode =  false;
  codeText =   '获取验证码';
  codeTest() {
    if (localStorage.getItem('countdown') && +localStorage.getItem('countdown') <  60 && +localStorage.getItem('countdown') > 0) {
      this.countdown = +localStorage.getItem('countdown');
      this.countdown --;
      this.flagCode = true;
      this.codeText = '重新发送';
      localStorage.setItem('countdown', this.countdown + '');
      setTimeout( () => {
        this.codeTest();
      }, 1000)
    } else {  // 不存在 || === 60
      this.countdown = 60;
      this.flagCode = false;
      this.codeText = '获取验证码';
      localStorage.setItem('countdown', this.countdown + '');
    }
  }


  @ViewChild('code_template', {read: TemplateRef}) code_template_ref: TemplateRef<any>;
  @ViewChild('forget_code') forget_code_ref;
  forgetCode;
  pwd_code;
  forgetCodeUrl;
  user_name;
  type = 1;
  pwd_show = false // 是否显示密码框
  _description;
  // 发送验证码前奏
  verifyPwd() {
    this._description = undefined;
    this.forgetCode = undefined;
    this.forget_vertify_Code();
    this._dialog.open(this.code_template_ref, {title: '', flag: true, async: true}).subscribe((data: any) => {
        if (data && this.forget_code_ref.valid) {
          let obj = {
            type: this.type,
            user_name: this.user_name,
            verifycode: this.forgetCode
          }
          this._publicService.send(obj).subscribe( res => {  // 调用成功后，手机上会出现验证码
              if (res.success === 200) {
                data();
                this.pwd_show = false;
                // 发送验证码
                this.countdown --;
                localStorage.setItem('countdown', this.countdown + '');
                this.codeTest()
              }
          }, error => {  // 这边做了处理 前端是抛出异常
            this._description = error.errorList[0]._description
            this.pwd_show = false;
          })
        }
    })
  }

  forget_vertify_Code() {
    this.forgetCodeUrl = this._publicService.verifyCode({_: Date.now()})
  }

  setInvalidClass(form, formControl) {
    let cl;
    if (formControl && formControl.invalid && (formControl.dirty || formControl.touched || form.submitted)) {
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
       user_name: this.user_name,
       code: this.pwd_code
     }
    this._publicService.checkVerifycode(obj).subscribe( res => {
      if (res.success === 200) {
        this.pwd_show = true;
      }
    }, error => {
      this.pwd_show = false;
    })
  }

  // 修改密码
  save2() {
    let obj = {
      pwd : SparkMD5.hash(this.password),
      b_pwd :  Base64.encode(this.password)
    }
    this._publicService.resetPassword(obj).subscribe( res => {
        if (res.success === 200 ) {
          this.router.navigate(['/login'])
        }
    }, error => {
      this.pwd_show = false;
      this.password = undefined;
      this.old_pwd = undefined;
      this.pwd_code = undefined;
    })
  }

  userNameFocus() {
    this._description = undefined;
  }

  password;
  old_pwd;
  flag: boolean = false;
  pwd_comfirm() {
    this.flag = this.password === this.old_pwd ? false : true;
  }

  login(inform) {
   this._valid = true;
   if (inform.valid) {
     this._publicService.login({
       username: this.userName,
       password: SparkMD5.hash(this.passWord),
       veritycode: this.vertCode
     }).subscribe(res => {
       console.log(res)
       if (res.success === 200 ) {
         this.router.navigate(['/home'])
       } else {
         this.router.navigate(['/'])
       }
     })
   }
  }
}
