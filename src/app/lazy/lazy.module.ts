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
      .creative-info-box {
        border: 1px solid #e7ecf3;
      }
      
      .creative-info-material{
        flex: 1;
        border-right: 2px solid #dbdde2;
      }
      
      .creative-info-photo{
        width: 200px;
        height: 420px;
      }

      table.creative-info-table {
        width: 100%;
        margin-top: 0;
        padding: 0;
        border: none;
        border-collapse: separate;
        border-spacing: 0;
        overflow: hidden;
      }

      thead th {
        color: #616366;
        font-size: 14px;
        font-weight: 700;
        background-color: #f6f7fa;
        text-align: left;
        height: 36px;

      }

      th:first-child {
        padding-left: 100px;
      }

      tbody td {
        border-bottom: 2px solid #dbdde2;
        background-color: #fefefe;
        color: #979899;
        font-size: 14px;
        font-weight: 400;
        text-align: left;
        height: 36px;
      }

      td:first-child {
        padding-left: 100px;
      }
    `
  ],
  template: `
    <div style="width: 100%;height: 100%;overflow: auto">

      <yc-directional></yc-directional>
      
      <div class="creative-info-box">
        <div class="flex">
          <div class="creative-info-material">
            <table class="creative-info-table">
              <thead>
              <tr>
                <th>媒体平台</th>
                <th>展现形式</th>
                <th>尺寸</th>
                <th>样式</th>
                <th>说明</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>百万竞答</td>
                <td>Banner广告</td>
                <td>320*50px</td>
                <td>信息流 3图1文</td>
                <td>支持格式：JPG/PNG，小于100kb</td>
              </tr>
              </tbody>
            </table>
            <div>

            </div>
          </div>
          <div class="creative-info-photo">
            <img src="" alt="">
          </div>
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
