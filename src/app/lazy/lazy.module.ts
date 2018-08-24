import {AfterViewChecked, Component, NgModule, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {AppState} from '../../store/model';
import {select, Store} from '@ngrx/store';
import {MenuState} from '../../store/model/menu.state';
import * as reducerMenu from '../../store/reducer/menu.reducer';
import * as menuAction from '../../store/actions/menu.action';
import {Observable, Subscription} from 'rxjs';
import {Module} from '../module';
import {MenuGuard} from '../../auth/menu.guard';
import {map} from 'rxjs/operators';
import {Dialog} from '../../components/dialog/dialog';

@Component({
  selector: 'app-lazy-view',
  styles: [],
  template: `
    <div style="padding: 10px;height: 100%;overflow: auto">
      <p>
        <yc-checkbox [label]="'测试'" [checkState]="2"></yc-checkbox>
      </p>

      <p>
        <yc-radio [label]="'测试'" [(ngModel)]="value" [value]="1"></yc-radio>
        {{value}}
      </p>

      <p>
        <input-datepicker [(ngModel)]="date" [query]="query" [isRange]="true" [appendField]="['a', 'b']"></input-datepicker>
        {{date}}
      </p>

      <p>
        <button class="btn" (click)="openDialog()">openDialog</button>
      </p>

      <p>
        <a class="btn" [yc-drop-menu]="[{value:'1', label: '1'},{value:'2', label: '2'},{value:'3', label: '3'}]">dropMenu</a>
      </p>

      <p>
        <button class="btn" yc-file-upload>fileUpload</button>
      </p>

      <p>
        <yc-input-search [(ngModel)]="search"></yc-input-search>
        {{search}}
      </p>
      
      <p>
        <yc-switch-input [(ngModel)]="value"></yc-switch-input>
      </p>

      <p>
        <yc-select [list]="[{value:'1', label: '1'},{value:'2', label: '2'},{value:'3', label: '3'},{value:'4', label: '4'}]"></yc-select>
      </p>
      
      <p>
        <yc-directional></yc-directional>
      </p>

    </div>
  `
})
export class LazyComponent implements OnDestroy {

  value;

  date = ['2018-02-12'];

  query = {a: '2018-02-13', b: '2018-02-14'};

  search;

  openDialog() {
    this._dialog.open('123').subscribe(data => {
      console.info(data);
    });
  }

  menuState$: Observable<MenuState>;

  getMenu() {
    this.store.dispatch(new menuAction.InitMenu());
  }

  actionsSubscription: Subscription;

  constructor(private store: Store<AppState>,
              private route: ActivatedRoute,
              private router: Router,
              private _dialog: Dialog) {
    this.menuState$ = store.pipe(select(reducerMenu.getMenuState));

    this.actionsSubscription = route.params
      .pipe(map(params => new menuAction.SelectMenu(params.id)))
      .subscribe(store);
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
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
  constructor() {
  }
}
