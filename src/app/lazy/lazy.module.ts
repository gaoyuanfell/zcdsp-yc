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
import {AutoCookie} from '../../decorator/decorator';
import {CreativeService} from '../../service/customer/creative.service';
import {TableComponent} from '../../components/table/table.component';
import {CdkTableModule} from '@angular/cdk/table';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];


@Component({
  selector: 'app-lazy-view',
  styles: [
      `

    `
  ],
  template: `
    <div style="width: 100%;height: 100%;overflow: auto;background-color: #ffffff;" #overflow>

      <yc-table [containerOverflow]="overflow" style="display: block;width: 2000px;">
        <div #queryRef query class="query-tool">
          <div class="left-tool">
            <div class="btn" routerLink="/ads/spread/campaign-add/0">
              新建活动
              <i class="btn-icon-add"></i>
            </div>
            <div class="btn">
              复制活动
              <i class="btn-icon-copy"></i>
            </div>
            <div class="btn">
              导出
              <i class="btn-icon-export"></i>
            </div>
            <div class="btn btn-outline">
              批量修改
              <i class="icon-btn-menu m-l-1"></i>
            </div>
          </div>

          <div class="right-tool">
            <input-datepicker [isRange]="true"></input-datepicker>
            <yc-input-search [placeholder]="'请输入活动的名称、ID'"></yc-input-search>
            <i title="刷新" class="zcdsp-icon pointer">&#xe91e;</i>
          </div>
        </div>
        <table #tableRef table>
          <thead>
          <tr sticky>
            <th stickyStart>姓名1</th>
            <th>电话2</th>
            <th>地址3</th>
            <th>爱好4</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let item of list">
            <td stickyStart>姓名</td>
            <td>电话</td>
            <td>地址</td>
            <td>爱好</td>
          </tr>
          </tbody>
          <tfoot>
          <tr sticky>
            <td stickyStart>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
          </tr>
          <tr sticky>
            <td stickyStart>5</td>
            <td>6</td>
            <td>7</td>
            <td>8</td>
          </tr>
          </tfoot>
        </table>
      </yc-table>

      

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class LazyComponent implements OnDestroy, OnInit {

  list = Array.from({length: 50});

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

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
    CdkTableModule,
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
