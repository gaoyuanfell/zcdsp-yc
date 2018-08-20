import {Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  preserveWhitespaces: false,
})
export class HomeComponent implements OnInit {

  fixed = false // 导航栏固定

  ngOnInit(): void {
  }

}
