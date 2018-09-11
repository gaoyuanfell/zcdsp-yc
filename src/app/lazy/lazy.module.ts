import {
  Component,
  NgModule,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Inject
} from '@angular/core';
import {RouterModule} from '@angular/router';
import {Module} from '../module';
import {MenuGuard} from '../../auth/menu.guard';
import {Sidebar, YC_SIDEBAR_DATA} from '../../components/sidebar/sidebar';
import {Dialog, YC_DIALOG_DATA} from '../../components/dialog/dialog';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/model';
import * as directionalAction from '../../store/actions/directional.action';
import { AutoCookie } from '../../decorator/decorator';
import { CreativeService } from '../../service/customer/creative.service';
import { TableComponent } from '../../components/table/table.component';

@Component({
  selector: 'app-lazy-view',
  styles: [
      `
      
    `
  ],
  template: `
    <div style="width: 100%;height: 100%;overflow: auto;background-color: #ffffff;">
      
      <div class="table-container">

        <div class="query-tool">
          <div class="left-tool">
            <h2 class="table-title">
              定向包
            </h2>
          </div>
          <div class="right-tool">
            <div class="btn" routerLink="0">
              新建定向包
              <i class="btn-icon-add"></i>
            </div>
            <yc-input-search [placeholder]="'请输入定向包名称、ID'"></yc-input-search>
          </div>
        </div>

        <div class="table-wrap" #tableWrapRef>
          <table>
            <thead>
            <tr>
              <th>1</th>
              <th>2</th>
              <th>3</th>
              <th>4</th>
              <th>5</th>
              <th>6</th>
            </tr>
            </thead>
            <tbody>
            <tr *ngFor="let item of list">
              <td>1</td>
              <td>2</td>
              <td>3</td>
              <td>4</td>
              <td>5</td>
              <td>6</td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="overflow" #overflowRef><div style="height: 10px;"></div></div>
        
        <div class="paging">
          <span>1</span>
          <span>1</span>
          <span>1</span>
          <span>1</span>
          <span>1</span>
        </div>
      </div>
      
      
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class LazyComponent implements OnDestroy, OnInit {

  autocomplete = 11;

  list = Array.from({length:100})

  @ViewChild('template', {read: TemplateRef}) template: TemplateRef<any>;

  open() {
    this._sidebar.open(LazyComponent3, {data: 1}).subscribe(da => {
      console.info();
    });
  }

  open2() {
    this._dialog.open(LazyComponent2, {data: 1}).subscribe(da => {
      console.info();
    });
  }

  result;

  concatFUn() {

  }

  constructor(private _sidebar: Sidebar,
              private store: Store<AppState>,
              private _dialog: Dialog) {
    // this.store.dispatch(new directionalAction.DirectionalInit());
    // this.store.dispatch(new directionalAction.LbsCityInit());
    // this.store.dispatch(new directionalAction.AudiencesActionInit());
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
    
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class LazyComponent2 implements OnDestroy, OnInit {


  constructor(private _creativeService: CreativeService,
    private changeDetectorRef: ChangeDetectorRef,) {
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }
}

@Component({
  selector: 'app-lazy-view3',
  styles: [],
  template: `
    <div style="width: 100%;height: 100%;overflow: auto;background-color: #ffffff;">
      <div></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class LazyComponent3 implements OnDestroy, OnInit {

  constructor(@Inject(YC_SIDEBAR_DATA) public data: any) {
    console.info(data);
  }

  ngOnInit(): void {
    console.info('ok');
  }

  ngOnDestroy(): void {

  }
}

@NgModule({
  declarations: [LazyComponent, LazyComponent2, LazyComponent3],
  entryComponents: [LazyComponent3],
  imports: [
    Module,
    RouterModule.forChild([
      {path: '', component: LazyComponent, canActivate: [], pathMatch: 'full'},
      {path: ':id', component: LazyComponent2, canActivate: [], pathMatch: 'full'},
    ]),
  ],
})
export class LazyModule {
  constructor() {

  }
}
