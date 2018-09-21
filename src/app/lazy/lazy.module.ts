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
      .creative-box {
        padding: 9px;
        position: relative;
      }

      .element-box {

      }

      .element-box:hover .close {
        display: block;
      }

      .ele-box {
        border: 1px solid #e7ecf3;
        background-color: #ffffff;
        width: 200px;
        height: 180px;
      }

      .close {
        position: absolute;
        right: 0;
        top: 0;
        display: none;
      }

      .close svg {
        fill: #d2d2d2;
      }

      .ele-title {
        height: 35px;
        border: 1px solid #e7ecf3;
        width: 100%;
        border-bottom: none;
      }

      .ele-title input {
        width: 100%;
        height: 100%;
        line-height: 1;
        padding: 0 10px;
      }

      .ele-text {
        height: 35px;
        border: 1px solid #e7ecf3;
        position: relative;
        width: 100%;
      }

      .ele-text input {
        width: 100%;
        height: 100%;
        line-height: 1;
        padding-right: 45px;
        padding-left: 10px;
      }

      .ele-text span {
        color: #999999;
        font-size: 12px;
        font-weight: 400;
        cursor: pointer;
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translate(0, -50%);
      }
      
      p{
        text-align: center;
      }

      p:nth-child(1) {
        margin-top: 40px;
        color: #333333;
        font-size: 18px;
        font-weight: 400;
        line-height: 2.5;
      }

      p:nth-child(2), p:nth-child(3) {
        color: #999999;
        font-size: 12px;
        font-weight: 400;
        line-height: 1.5;
      }
      
      p:nth-child(4){
        padding-top: 20px;
      }

      .ele-box + .ele-box {
        border-left: none;
      }

      .ele-box + .ele-text {
        border-top: none;
      }

      .ele-text + .ele-text {
        border-top: none;
      }
    `
  ],
  template: `
    <div style="width: 100%;height: 100%;overflow: auto;background-color: #ffffff;">

      <div class="flex" style="margin: 20px;">

        <div class="creative-box">
          <div class="ele-title">
            <input type="text">
          </div>
          <div class="element-box flex" style="width: 600px;">
            <div class="flex-wrap">
              <div class="ele-box">
                <div>
                  <p>120X50</p>
                  <p>点击或拖拽上传</p>
                  <p>JPG/PNG，小于100kb</p>
                  <p>
                    <a class="fast-drawing m-r-1" data-link>快速制图</a>
                    <a class="fast-drawing m-r-1" data-link>创意库</a>
                  </p>
                </div>
              </div>

              <div class="ele-text">
                <input type="text">
                <span>0 / 20</span>
              </div>

              <div class="ele-text">
                <input type="text">
                <span>0 / 20</span>
              </div>

            </div>
            <div class="flex-wrap">
              <div class="ele-box">
                <div>
                  <p>120X50</p>
                  <p>点击或拖拽上传</p>
                  <p>JPG/PNG，小于100kb</p>
                  <p>
                    <a class="fast-drawing m-r-1" data-link>快速制图</a>
                    <a class="fast-drawing m-r-1" data-link>创意库</a>
                  </p>
                </div>
              </div>
            </div>
            <div class="flex-wrap">
              <div class="ele-box">
                <div>
                  <p>120X50</p>
                  <p>点击或拖拽上传</p>
                  <p>JPG/PNG，小于100kb</p>
                  <p>
                    <a class="fast-drawing m-r-1" data-link>快速制图</a>
                    <a class="fast-drawing m-r-1" data-link>创意库</a>
                  </p>
                </div>
              </div>

              <div class="ele-text">
                <input type="text">
                <span>0 / 20</span>
              </div>

              <div class="ele-text">
                <input type="text">
                <span>0 / 20</span>
              </div>

            </div>
          </div>
          <i class="close">
            <svg viewBox="0 0 1024 1024" width="18" height="18">
              <path d="M512.001 15.678C237.414 15.678 14.82 238.273 14.82 512.86S237.414 1010.04 512 1010.04s497.18-222.593 497.18-497.18S786.589 15.678 512.002 15.678z m213.211 645.937c17.798 17.803 17.798 46.657 0 64.456-17.798 17.797-46.658 17.797-64.456 0L512.001 577.315 363.241 726.07c-17.799 17.797-46.652 17.797-64.45 0-17.804-17.799-17.804-46.653 0-64.456L447.545 512.86 298.79 364.104c-17.803-17.798-17.803-46.657 0-64.455 17.799-17.798 46.652-17.798 64.45 0l148.761 148.755 148.755-148.755c17.798-17.798 46.658-17.798 64.456 0 17.798 17.798 17.798 46.657 0 64.455L576.456 512.86l148.756 148.755z m0 0"></path>
            </svg>
          </i>
        </div>


      </div>


    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class LazyComponent implements OnDestroy, OnInit {

  constructor(private _sidebar: Sidebar,
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

  @Input() list;

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
