import {Component, NgModule, OnDestroy, OnInit, TemplateRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {RouterModule} from '@angular/router';
import {Module} from '../module';
import {MenuGuard} from '../../auth/menu.guard';
import {Sidebar} from '../../components/sidebar/sidebar';
import { DirectionalDataService } from '../../service/directional-data.service';

@Component({
  selector: 'app-lazy-view',
  styles: [],
  template: `
    <div style="width: 100%;height: 100%;overflow: auto">
      <button routerLink="1">routerLink</button>
      <yc-directional></yc-directional>
      <router-outlet></router-outlet>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class LazyComponent implements OnDestroy, OnInit {

  @ViewChild('template' ,{read: TemplateRef}) template: TemplateRef<any>

  open(){
    this._sidebar.open(this.template).subscribe(da => {
      console.info()
    })
  }

  result;

  concatFUn() {

  }

  constructor(private _sidebar: Sidebar,private _directionalDataService: DirectionalDataService) {
    
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

  constructor(private _directionalDataService: DirectionalDataService,private changeDetectorRef:ChangeDetectorRef) {
    
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }
}

@NgModule({
  declarations: [LazyComponent,LazyComponent2],
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
