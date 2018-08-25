import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  flags = false
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
