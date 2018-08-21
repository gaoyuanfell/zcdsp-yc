import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../store/model';
import {ActivatedRoute, Router} from '@angular/router';
import * as reducerMenu from '../../store/reducer/menu.reducer';
import {Observable} from 'rxjs';
import {Loading} from '../../components/loading/loading.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  preserveWhitespaces: false,
})
export class HomeComponent implements OnInit {

  fixed = false; // 导航栏固定
  hover = false; // 导航悬浮控制

  menuList$: Observable<any[]>;

  mouseenter(){
    this.hover = true;
    this._loading.setStyle({
      'top.px': 66,
      'left.px': 200,
    })
  }

  mouseleave(){
    this.hover = false;
    this._loading.setStyle({
      'top.px': 66,
      'left.px': 60,
    })
  }

  ngOnInit(): void {
  }

  constructor(private store: Store<AppState>,
              private route: ActivatedRoute,
              private router: Router,
              private _loading: Loading) {

    this.menuList$ = store.pipe(select(reducerMenu.MenuList));

  }

}
