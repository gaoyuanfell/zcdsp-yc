import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../store/model';
import {ActivatedRoute, NavigationEnd, NavigationStart, Router} from '@angular/router';
import * as reducerMenu from '../../store/reducer/menu.reducer';
import * as reducerAction from '../../store/actions/menu.action';
import {fromEvent, Observable, Subject} from 'rxjs';
import {Loading} from '../../components/loading/loading.service';
import {Global} from '../../service/global';
import * as directionalAction from '../../store/actions/directional.action';
import {PublicService} from '../../service/public.service';
import {fadeIn} from '../animations/fadeIn';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  preserveWhitespaces: true,
  animations: [
    fadeIn
  ]
})
export class HomeComponent implements OnInit, OnDestroy {

  fixed = false; // 导航栏固定
  hover = false; // 导航悬浮控制
  userToolBox;
  auth;

  menuList$: Observable<any[]>;

  mouseenter() {
    this.hover = true;
    this._loading.setStyle({
      'top.px': 66,
      'left.px': 200,
    });
  }

  mouseleave() {
    this.hover = false;
    this._loading.setStyle({
      'top.px': 66,
      'left.px': 60,
    });
  }

  // 滚动条事件监听
  private _scroll;
  @ViewChild('containerFull') containerFullRef: ElementRef;

  logout(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this._publicService.quit().subscribe(res => {
      this._global.token = null;
      this.userToolBox = false;
      this.router.navigate(['/']);
    });
  }

  ngOnInit(): void {
    this._global.overflowSubject = new Subject<{ [key: string]: any }>();
    this._global.containerFullRef = this.containerFullRef.nativeElement;
    this._scroll = fromEvent(this._global.containerFullRef, 'scroll').subscribe((event: Event | any) => {
      this._global.overflowSubject.next({top: event.target.scrollTop, left: event.target.scrollLeft});
    });
  }

  ngOnDestroy(): void {
    this._global.overflowSubject.unsubscribe();
    this._scroll.unsubscribe();
  }

  constructor(private store: Store<AppState>,
              private route: ActivatedRoute,
              private router: Router,
              private title: Title,
              private _global: Global,
              private _publicService: PublicService,
              private _loading: Loading) {
    this.store.dispatch(new directionalAction.DirectionalInit());
    this.store.dispatch(new directionalAction.LbsCityInit());
    this.store.dispatch(new directionalAction.AudiencesActionInit());
    this.menuList$ = store.pipe(select(reducerMenu.MenuList));

    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        _global.containerFullRef.scrollTop = 0;
      }
      if (event instanceof NavigationEnd) {
        this.store.dispatch(new reducerAction.SelectActiveMenu(event.url));
      }
    });
    this.auth = route.snapshot.data.auth;
    if (this.auth && this.auth.user) {
      this.title.setTitle(`智橙移动-${this.auth.user.user_name}`);
    }
  }

  navigate(menu) {
    if (!menu.child) {
      menu.active = true;
      this.router.navigate([menu.route], {queryParamsHandling: 'merge'});
    } else {
      menu.active = !menu.active;
    }
  }

  get token() {
    let token = this._global.token;
    if (token) return {
      token: this._global.token
    };
    return {};
  }

}
