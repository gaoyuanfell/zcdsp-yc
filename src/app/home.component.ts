import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as reducerMenu from '../store/reducer/menu.reducer';
import {AppState} from '../store/model';
import {select, Store} from '@ngrx/store';

@Component({
  selector: 'app-home',
  template: ``,
})
export class HomeComponent {
  constructor(private store: Store<AppState>,
              private router: Router,
              private route: ActivatedRoute) {
    store.pipe(select(reducerMenu.MenuList)).subscribe(menuList => {
      if (menuList && menuList.length > 1) {
        router.navigate([menuList[0].route], {queryParams: {...route.snapshot.queryParams}, replaceUrl: true});
      }
    });
  }
}
