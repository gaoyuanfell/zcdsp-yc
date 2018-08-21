import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../store/model';
import {ActivatedRoute, Router} from '@angular/router';
import * as reducerMenu from '../../store/reducer/menu.reducer';
import {Observable} from 'rxjs';

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

  ngOnInit(): void {
  }

  constructor(private store: Store<AppState>,
              private route: ActivatedRoute,
              private router: Router) {

    this.menuList$ = store.pipe(select(reducerMenu.MenuList));

  }

}
