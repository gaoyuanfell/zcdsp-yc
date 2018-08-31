import {Component} from '@angular/core';
import {Global} from '../service/global';
import {ActivatedRoute, Router} from '@angular/router';
import {Notification} from '../components/notification/notification';
import * as reducerMenu from '../store/reducer/menu.reducer';
import {AppState} from '../store/model';
import {select, Store} from '@ngrx/store';

@Component({
  selector: 'app-home',
  template: ``,
})
export class HomeComponent {
  constructor(private _global: Global,
              private _notification: Notification,
              private store: Store<AppState>,
              private router: Router,
              private route: ActivatedRoute) {
    store.pipe(select(reducerMenu.getMenuState)).subscribe(menu => {
      if (menu.menuList && menu.menuList.length > 1) {
        router.navigate([menu.menuList[0].route], {queryParams: {...route.snapshot.queryParams}, replaceUrl: true});
      }
    });
  }
}
