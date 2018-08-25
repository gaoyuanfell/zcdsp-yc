import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  flags = false

  userTrue
  codeTrue
  passTrue

  loginUser: any = {}
  userData() {
    this.userTrue = !this.loginUser.userName
  }
  passData(){
    this.passTrue = !this.loginUser.passWord
  }
  codeData(){
    this.codeTrue = !this.loginUser.vertCode
  }
  submitData(){
    this.userTrue = !this.loginUser.userName
    this.passTrue = !this.loginUser.passWord
    this.codeTrue = !this.loginUser.vertCode

    if (this.userTrue || this.passTrue || this.codeTrue) return;

  }
  constructor() { }

  ngOnInit() {
  }

  radionum = 0
  tableRadio(event, index){
    event.stopPropagation();
    event.preventDefault();
    this.radionum = index
  }

}
