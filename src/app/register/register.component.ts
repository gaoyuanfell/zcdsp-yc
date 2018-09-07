import { Component, OnInit } from '@angular/core';
import {Base64} from 'js-base64';
import {PublicService} from '../../service/public.service';
import {Router} from '@angular/router';
import {Notification} from '../../components/notification/notification';
import SparkMD5 from 'spark-md5'
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {

  constructor(
    private _publicService: PublicService,
    private router: Router,
    private _notification: Notification,
  ) { }
  user: any = {};
  _valid = false;
  service_data;
  flag: boolean = false;
  pwd_comfirm() {
    this.flag = this.user.password === this.user.old_pwd ? false : true;
  }

  ngOnInit() {
  }

  countdown =  60;
  flagCode =  false;
  codeText =   '获取验证码';
  codeTest() {
    if (localStorage.getItem('countdown') && +localStorage.getItem('countdown') <=  60 && +localStorage.getItem('countdown') > 0) {
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
  verifyCode(mobile_phone) {
    if (mobile_phone.invalid) {
      this._notification.warning('请输入正确的手机号', '');
      return;
    }
    localStorage.setItem('countdown', this.countdown + '');
    this.codeTest();
    this._publicService.RegisterVerifyCode({mobile_number: this.user.mobile_phone}).subscribe( res => {})
  }
  error; // error信息
  errorText;
  save() {
    this.user.new_pwd = SparkMD5.hash(this.user.password);
    this.user.base64_pwd = Base64.encode(this.user.password);
    const obj = this.user;
    this._publicService.register(obj).subscribe( res => {
      if (res.success) {
        // this._notification.warning('注册成功', '请登录');
        this.router.navigate(['/login'], {
          queryParams: {
            'user_name': this.user.user_name
          }
        })
      }
    }, error => {
      this.error = error.errorList[0]._code;
      this.errorText = error.errorList[0]._description;
    })
  }
  errorFocus(errorName) {
    if (errorName ===  this.error) {
      this.error = undefined;
      this.errorText = undefined;
    }
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

  exist_flag;
  // 账户校验
  userNameVaild() {
    if(this.user.user_name){
      this._publicService.existUser({userName: this.user.user_name}).subscribe( res => {
        this.exist_flag = res.result;  // false说明账户不存在
      })
    }
  }

}
