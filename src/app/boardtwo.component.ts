import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-boardtwo',
  templateUrl: './boardtwo.component.html',
  styleUrls: ['./boardtwo.component.less']
})
export class BoardtwoComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }

  hash = 'home';

  scrollTop(name) {
    this.hash = name;

  }

  banngerList:Array<any> = [
    {
      icon:"",
      name:"9.5亿+",
      desc:"移动终端"
    },
    {
      icon:"",
      name:"30亿+",
      desc:"日均流量"
    },
    {
      icon:"",
      name:"20000+",
      desc:"主流APP资源"
    },
    {
      icon:"",
      name:"精准",
      desc:"人群定向"
    },
    {
      icon:"",
      name:"智能推荐",
      desc:"投放策略"
    }
  ]

}
