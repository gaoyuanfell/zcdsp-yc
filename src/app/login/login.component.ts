import { Component, OnInit } from '@angular/core';
import {PublicService} from '../../service/public.service';
import {Router} from '@angular/router';
import SparkMD5 from 'spark-md5';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  flags = false
  constructor(
    private _publicService: PublicService,
    private router: Router
  ) { }

  ngOnInit() {
    this.verifyCode();
  }
  userName;
  passWord;
  vertCode;
  _valid = false;



  radionum = 0
  tableRadio(event, index){
    event.stopPropagation();
    event.preventDefault();
    this.radionum = index
  }

  vertCodeUrl;
  verifyCode() {
    this.vertCodeUrl = this._publicService.verifyCode({_: Date.now()})
  }
  login(inform) {
   this._valid = true;
   if (inform.valid) {
     this._publicService.login({
       username: this.userName,
       password: SparkMD5.hash(this.passWord),
       veritycode: this.vertCode
     }).subscribe(res => {
       this.router.navigate(['/'])
     })
   }
  }
}
