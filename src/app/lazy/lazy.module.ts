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
    <div style="width: 100%;height: 100%;overflow: auto;background-color: #ffffff;">

      <!--<div class="table-wrap" #tableWrapRef>
        <table role="grid">
          <thead>
          <tr>
            <th>1</th>
            <th>2</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let item of list">
            <td>1</td>
            <td>2</td>
          </tr>
          </tbody>
          <tfoot>
          <tr>
            <td style="bottom: 108px;position: sticky;z-index: 1;">11</td>
            <td style="bottom: 108px;position: sticky;z-index: 1;">22</td>
          </tr>
          <tr>
            <td style="bottom: 72px;position: sticky;z-index: 1;">33</td>
            <td style="bottom: 72px;position: sticky;z-index: 1;">44</td>
          </tr>
          <tr>
            <td class="none" style="bottom: 36px;position: sticky;z-index: 1;padding: 20px 0;background-color: #ffffff;" colspan="100%">
              <div class="overflow" #overflowRef><div style="height: 10px;"></div></div>
            </td>
          </tr>
          <tr>
            <td class="none" style="bottom: 0px;position: sticky;z-index: 1;height: 36px;padding-bottom: 20px;background-color: #ffffff;" colspan="100%">
              <div class="paging">
                <span>1</span>
                <span>1</span>
                <span>1</span>
                <span>1</span>
                <span>1</span>
              </div>
            </td>
          </tr>
          </tfoot>
        </table>
      </div>-->

      <div class="table-wrap">
        <table cdk-table [dataSource]="dataSource">
          <!-- User name Definition -->
          <ng-container cdkColumnDef="position">
            <th cdk-header-cell *cdkHeaderCellDef>  position </th>
            <td cdk-cell *cdkCellDef="let row"> {{row.position}} </td>
          </ng-container>

          <!-- Age Definition -->
          <ng-container cdkColumnDef="name">
            <th cdk-header-cell *cdkHeaderCellDef> name </th>
            <td cdk-cell *cdkCellDef="let row"> {{row.name}} </td>
          </ng-container>

          <!-- Title Definition -->
          <ng-container cdkColumnDef="weight">
            <th cdk-header-cell *cdkHeaderCellDef> weight </th>
            <td cdk-cell *cdkCellDef="let row"> {{row.weight}} </td>
          </ng-container>

          <!-- Title Definition -->
          <ng-container cdkColumnDef="symbol">
            <th cdk-header-cell *cdkHeaderCellDef> symbol </th>
            <td cdk-cell *cdkCellDef="let row"> {{row.symbol}} </td>
          </ng-container>

          <!-- Header and Row Declarations -->
          <tr cdk-header-row *cdkHeaderRowDef="displayedColumns"></tr>
          <tr cdk-row *cdkRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </div>
      
      
      <!--<div class="table-container">

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

        

        <div class="overflow" #overflowRef><div style="height: 10px;"></div></div>
        
        <div class="paging">
          <span>1</span>
          <span>1</span>
          <span>1</span>
          <span>1</span>
          <span>1</span>
        </div>
      </div>-->
      
      
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class LazyComponent implements OnDestroy, OnInit {

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
