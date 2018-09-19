import {
  Component,
  NgModule,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Inject, Input
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

      <!--<div style="width: 100%;height: 600px;" yc-map>
        
      </div>-->

      <button class="btn" (click)="start()">start</button>
      <button class="btn" (click)="end()">end</button>
      <ul style="overflow: auto;max-height: 300px;">
        <!--<li *ngFor="let i of list; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list1; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list2; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list3; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list4; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list5; let index=index">{{index}}</li>-->
        
        <!--<ng-template [ngForOf]="list6" ngFor let-l>-->
          <!--<ng-template [ngForOf]="l" ngFor let-i let-index="index">-->
            <!--<li>{{index}}</li>-->
          <!--</ng-template>-->
        <!--</ng-template>-->


        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->

        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->

        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->

        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->

        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        <!--<li *ngFor="let i of list7; let index=index">{{index}}</li>-->
        
      </ul>

      <app-lazy-view3 [list]="list">
        1
      </app-lazy-view3>



      <!--<div style="width: 100%;height: 600px;" yc-map>-->
      <!--</div>-->

    </div>
    
    
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class LazyComponent implements OnDestroy, OnInit {

  start() {
    this.list = Array.from({length: 5000});
    this.list1 = Array.from({length: 10000});
    this.list2 = Array.from({length: 10000});
    this.list3 = Array.from({length: 10000});
    this.list4 = Array.from({length: 10000});
    this.list5 = Array.from({length: 10000});
    this.list6 = Array.from({length: 50}).map(() => Array.from({length: 1000}));

    this.list7 = Array.from({length: 1000});
  }

  end(){
    this.list = null
    this.list1 = null
    this.list2 = null
    this.list3 = null
    this.list4 = null
    this.list5 = null
    this.list6 = null
    this.list7 = null
  }

  list;
  list1;
  list2;
  list3;
  list4;
  list5;
  list6;
  list7;

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

    let one = document.getElementById('one')
    let myChart = echarts.init(one);
    let option = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line'
      }]
    };
    myChart.setOption(option);

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
    <ng-template [ngForOf]="list" ngFor let-item>
      <div>a</div>
      <ng-content></ng-content>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class LazyComponent3 implements OnDestroy, OnInit {

  constructor() {

  }

  @Input() list

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
