import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store/model';
import * as reducerMenu from '../store/reducer/menu.reducer';

@Component({
  selector: 'app-board',
  template: ``,
})
export class BoardComponent {

  constructor(private router: Router,
              private route: ActivatedRoute,
              private store: Store<AppState>) {
    store.pipe(select(reducerMenu.getMenuState)).subscribe(menu => {
      if (menu.menuList && menu.menuList.length > 1) {
        router.navigate([menu.menuList[0].route], {queryParams: {...route.snapshot.queryParams}, replaceUrl: true});
      }
    });
  }
}
