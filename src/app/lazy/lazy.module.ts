import {Component, NgModule, OnDestroy} from '@angular/core';
import {RouterModule} from '@angular/router';
import {Module} from '../module';
import {MenuGuard} from '../../auth/menu.guard';
import {DirectionalDataService} from '../../service/directional-data.service';

@Component({
  selector: 'app-lazy-view',
  styles: [],
  template: `
    <div style="width: 100%;height: 100%;overflow: auto">
      <yc-directional></yc-directional>
    </div>
  `
})
export class LazyComponent implements OnDestroy {

  concatFUn(){

  }

  constructor() {
    this.concatFUn();
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
  constructor(
    private _directionalDataService: DirectionalDataService) {
    _directionalDataService.initDirectional$().subscribe(data => {
    });
  }
}
