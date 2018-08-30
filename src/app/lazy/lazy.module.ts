import {Component, NgModule, OnDestroy, OnInit, TemplateRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {RouterModule} from '@angular/router';
import {Module} from '../module';
import {MenuGuard} from '../../auth/menu.guard';
import {Sidebar} from '../../components/sidebar/sidebar';
import {DirectionalDataService} from '../../service/directional-data.service';

@Component({
  selector: 'app-lazy-view',
  styles: [
      `
      .word-data-box{
        position: relative;
      }
      .word-data-box > span{
        color: #979899;
        font-size: 14px;
        font-weight: 400;
        position: absolute;
        border-left: 3px solid #2e90ff;
        padding: 3px 10px;
      }
      .word-data-box > p{
        color: #616366;
        font-size: 14px;
        font-weight: 400;
        margin-left: 85px;
        padding: 3px 0;
      }
    `
  ],
  template: `
    <div style="width: 100%;height: 100%;overflow: auto">

      <div style="width: 200px">
        
        <div class="word-data-box">
          <span>定向定向：</span>
          <p>性别：男性</p>
          <p>年龄：18至25岁</p>
          <p>学历：大学生 高中生</p>
          <p>地理位置：上海市</p>
          <p>设备类型：平板 手机</p>
        </div>
        
      </div>

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class LazyComponent implements OnDestroy, OnInit {

  @ViewChild('template', {read: TemplateRef}) template: TemplateRef<any>;

  open() {
    this._sidebar.open(this.template).subscribe(da => {
      console.info();
    });
  }

  result;

  concatFUn() {

  }

  constructor(private _sidebar: Sidebar, private _directionalDataService: DirectionalDataService) {

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
    <div style="width: 100%;height: 100%;overflow: auto">
      <yc-directional></yc-directional>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class LazyComponent2 implements OnDestroy, OnInit {

  constructor(private _directionalDataService: DirectionalDataService, private changeDetectorRef: ChangeDetectorRef) {

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
