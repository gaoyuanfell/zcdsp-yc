import {Component, NgModule, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {RouterModule} from '@angular/router';
import {Module} from '../module';
import {MenuGuard} from '../../auth/menu.guard';
import {Sidebar} from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-lazy-view',
  styles: [],
  template: `
    <div style="width: 100%;height: 100%;overflow: auto">
      
      
      
    </div>
  `
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

  constructor(private _sidebar: Sidebar) {
    this.concatFUn();
  }

  ngOnInit(): void {

  }


  ngOnDestroy(): void {

  }
}

@NgModule({
  declarations: [LazyComponent],
  imports: [
    Module,
    RouterModule.forChild([
      {path: '', component: LazyComponent, canActivate: [MenuGuard], pathMatch: 'full'},
      {path: ':id', component: LazyComponent, canActivate: [MenuGuard], pathMatch: 'full'},
    ]),
  ],
})
export class LazyModule {
  constructor() {

  }
}
