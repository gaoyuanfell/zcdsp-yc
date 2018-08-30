import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../store/model';
import {ActivatedRoute, Router} from '@angular/router';
import * as reducerMenu from '../../store/reducer/menu.reducer';
import {fromEvent, Observable, Subject} from 'rxjs';
import {Loading} from '../../components/loading/loading.service';
import {Global} from '../../service/global';
import * as directionalAction from '../../store/actions/directional.action'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  preserveWhitespaces: true,
})
export class HomeComponent implements OnInit,OnDestroy {

  fixed = false; // 导航栏固定
  hover = false; // 导航悬浮控制

  menuList$: Observable<any[]>;

  mouseenter() {
    this.hover = true;
    this._loading.setStyle({
      'top.px': 66,
      'left.px': 200,
    })
  }

  mouseleave() {
    this.hover = false;
    this._loading.setStyle({
      'top.px': 66,
      'left.px': 60,
    })
  }

  // 滚动条事件监听
  private _scroll
  @ViewChild('containerFull') containerFullRef: ElementRef;

  ngOnInit(): void {
    this._global.overflowSubject = new Subject<{[key: string]: any}>();
    this._global.containerFullRef = this.containerFullRef.nativeElement;
    this._scroll = fromEvent(this._global.containerFullRef, 'scroll').subscribe((event:  Event | any) => {
      this._global.overflowSubject.next({top:event.target.scrollTop, left: event.target.scrollLeft})
    });
  }

  ngOnDestroy(): void {
    this._global.overflowSubject.unsubscribe();
    this._scroll.unsubscribe();
  }

  constructor(private store: Store<AppState>,
              private route: ActivatedRoute,
              private router: Router,
              private _global: Global,
              private _loading: Loading) {
    this.store.dispatch(new directionalAction.DirectionalInit());
    this.store.dispatch(new directionalAction.LbsCityInit());
    this.store.dispatch(new directionalAction.AudiencesActionInit());
    this.menuList$ = store.pipe(select(reducerMenu.MenuList));
  }
}
