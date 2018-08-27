import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {

  constructor() { }
  user: any = {};
  _valid = false;

  flag: boolean = false;
  pwd_comfirm() {
    this.flag = this.user.password === this.user.old_pwd;
  }

  ngOnInit() {
  }

}
