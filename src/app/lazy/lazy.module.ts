import {Component, NgModule, OnDestroy, OnInit, TemplateRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Inject} from '@angular/core';
import {RouterModule} from '@angular/router';
import {Module} from '../module';
import {MenuGuard} from '../../auth/menu.guard';
import {Sidebar, YC_SIDEBAR_DATA} from '../../components/sidebar/sidebar';
import { Dialog, YC_DIALOG_DATA } from '../../components/dialog/dialog';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/model';
import * as directionalAction from '../../store/actions/directional.action';

@Component({
  selector: 'app-lazy-view',
  styles: [
      `
     
    `
  ],
  template: `
    <div style="width: 100%;height: 100%;overflow: auto;background-color: #ffffff;">
    <!--<button class="btn" (click)="open()">open</button>
      <button class="btn" (click)="open2()">open2</button>
      <button class="btn" routerLink="1">lazy</button>
      <yc-map></yc-map>
      <div style="width: 100%;height: 600px;" yc-map></div>-->

      <yc-directional></yc-directional>
      
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class LazyComponent implements OnDestroy, OnInit {

  @ViewChild('template', {read: TemplateRef}) template: TemplateRef<any>;

  open() {
    this._sidebar.open(LazyComponent3, {data:1}).subscribe(da => {
      console.info();
    });
  }

  open2() {
    this._dialog.open(LazyComponent2, {data:1}).subscribe(da => {
      console.info();
    });
  }

  result;

  concatFUn() {

  }

  constructor(private _sidebar: Sidebar,
    private store: Store<AppState>,
    private _dialog: Dialog) {

      this.store.dispatch(new directionalAction.DirectionalInit());
    this.store.dispatch(new directionalAction.LbsCityInit());
    this.store.dispatch(new directionalAction.AudiencesActionInit());
  }

  ngOnInit(): void {

  }


  ngOnDestroy(): void {

  }
}

@Component({
  selector: 'app-lazy-view2',
  styles: [],
  template: `
    <div style="width: 100%;height: 100%;overflow: auto;background-color: #ffffff;">
      123123123
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class LazyComponent2 implements OnDestroy, OnInit {

  constructor(@Inject(YC_DIALOG_DATA)  public data: any) {
    console.info(data)
  }

  ngOnInit(): void {
    console.info('ok')
  }

  ngOnDestroy(): void {

  }
}

@Component({
  selector: 'app-lazy-view3',
  styles: [],
  template: `
    <div style="width: 100%;height: 100%;overflow: auto;background-color: #ffffff;">
      12312312333333333333333333333333333333
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class LazyComponent3 implements OnDestroy, OnInit {

  constructor(@Inject(YC_SIDEBAR_DATA)  public data: any) {
    console.info(data)
  }

  ngOnInit(): void {
    console.info('ok')
  }

  ngOnDestroy(): void {

  }
}

@NgModule({
  declarations: [LazyComponent, LazyComponent2,LazyComponent3],
  entryComponents:[LazyComponent3],
  imports: [
    Module,
    RouterModule.forChild([
      {path: '', component: LazyComponent, canActivate: [MenuGuard], pathMatch: 'full'},
      {path: ':id', component: LazyComponent2, canActivate: [MenuGuard], pathMatch: 'full'},
    ]),
  ],
})
export class LazyModule {
  constructor() {

  }
}
