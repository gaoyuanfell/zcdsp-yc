import {
  Component,
  NgModule,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Inject, Input, NgZone
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

@Component({
  selector: 'app-lazy-view',
  styles: [
      `
      
    `
  ],
  template: `
    <div style="width: 100%;height: 100%;overflow: auto;background-color: #ffffff;" #overflow>
      请输入<input type="text" id="searchMap">
      <div style="width: 100%;height: 600px;" yc-map [searchMap]="'searchMap'" (pushCoordinate)="pushCoordinate($event)" [marker]='arrList' (removeCoordinate)="removeCoordinate($event)" [echo]="echo">


      </div>
      
      
      <div *ngFor="let x of arrList" > <span (click)="toChild(x)">{{x.name}}</span></div>

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

      


    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class LazyComponent implements OnDestroy, OnInit {


  echo;
  arrList = [
    {coords:{
      'longitude': '120.995425', 'latitude': '31.175912', 'radius': '1159'
    },name:'江苏省苏州市昆山市淀山湖镇富园路',id: 23, id_random: `80${Math.round(Math.random() * 1000000)}`},
    // {coords:{'longitude': '121.410159', 'latitude': '31.462168', 'radius': '2159'},name:'上海市宝山区月浦镇盛石路298号', id: `80${Math.round(Math.random() * 1000000)}`},
    {coords:{'longitude': '120.94736', 'latitude': '31.287467', 'radius': '3159'},name:'江苏省苏州市昆山市张浦镇茶风街106号张浦镇人民政府', id: 25, id_random: `80${Math.round(Math.random() * 1000000)}`}
  ]
  toChild(x) {
    this.echo  = x;
  }

  pushCoordinate(event) {
    console.log(event)
    let flag = this.arrList.some ( (item, index) => {
      if ( item.id_random === event.id_random) {
        this.arrList[index] = event
        // item = event;  // 说明存在，覆盖
      }
      return item.id_random === event.id_random;
    })

    if (!flag) { // 说明不存在 重新添加
      this.arrList.push(event)
    }
    console.log(this.arrList)
    this.changeDetectorRef.markForCheck();
  }

  removeCoordinate(event) {
    this.arrList.filter((item,index) => {
      if(event.id_random === item.id_random) {
        this.arrList.splice(index,1)
      }
    })
  }

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



  constructor(private _sidebar: Sidebar,
              protected changeDetectorRef: ChangeDetectorRef,
              private store: Store<AppState>,
              private _dialog: Dialog) {
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
    <div style="width: 100%;height: 100%;overflow: auto;background-color: #ffffff;" #overflow>
      <h2>Demo: NgZone</h2>

      <p>Progress: {{progress}}%</p>
      <p *ngIf="progress >= 100">Done processing {{label}} of Angular zone!</p>

      <button (click)="processWithinAngularZone()">Process within Angular zone</button>
      <button (click)="processOutsideOfAngularZone()">Process outside of Angular zone</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class LazyComponent2 implements OnDestroy, OnInit {

  progress: number = 0;
  label: string;

  constructor(private _ngZone: NgZone, private changeDetectorRef:ChangeDetectorRef) {}

  // Loop inside the Angular zone
  // so the UI DOES refresh after each setTimeout cycle
  processWithinAngularZone() {
    this.label = 'inside';
    this.progress = 0;
    this._increaseProgress(() => console.log('Inside Done!'));
  }

  // Loop outside of the Angular zone
  // so the UI DOES NOT refresh after each setTimeout cycle
  processOutsideOfAngularZone() {
    this.label = 'outside';
    this.progress = 0;
    this._ngZone.runOutsideAngular(() => {
      this._increaseProgress(() => {
        // reenter the Angular zone and display done
        this._ngZone.run(() => { console.log('Outside Done!'); });
      });
    });
  }

  _increaseProgress(doneCallback: () => void) {
    this.progress += 1;
    console.log(`Current progress: ${this.progress}%`);
    this.changeDetectorRef.markForCheck()
    if (this.progress < 100) {
      window.setTimeout(() => this._increaseProgress(doneCallback), 10);
    } else {
      doneCallback();
    }
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }
}


@NgModule({
  declarations: [LazyComponent, LazyComponent2],
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
