import {Component, NgModule, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {AppState} from '../../store/model';
import {select, Store} from '@ngrx/store';
import {MenuState} from '../../store/model/menu.state';
import * as reducerMenu from '../../store/reducer/menu.reducer';
import * as reducerAction from '../../store/actions/menu.action';
import {Observable, Subscription} from 'rxjs';
import {Module} from '../module';
import {MenuGuard} from '../../auth/menu.guard';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-lazy-view',
  styles: [],
  template: `
    <div>
      <button (click)="getMenu()">获取</button>
    </div>
  `
})
export class LazyComponent implements OnDestroy{

  menuState$: Observable<MenuState>;

  getMenu() {
    this.store.dispatch(new reducerAction.InitMenu());
  }

  actionsSubscription: Subscription;

  constructor(private store: Store<AppState>,
              private route: ActivatedRoute,
              private router: Router) {
    this.menuState$ = store.pipe(select(reducerMenu.getMenuState));

    this.actionsSubscription = route.params
      .pipe(map(params => new reducerAction.SelectMenu(params.id)))
      .subscribe(store);
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe()
  }



}

@NgModule({
  declarations: [LazyComponent],
  imports: [
    Module,
    RouterModule.forChild([
      {path: '', component: LazyComponent, canActivate: [MenuGuard], pathMatch: 'full'},
      {path: ':id', component: LazyComponent, canActivate: [MenuGuard], pathMatch: 'full'},
    ]),
  ],
})
export class LazyModule {

}
