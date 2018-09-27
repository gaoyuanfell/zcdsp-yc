import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HelpComponent} from './help.component';

const routeList: Routes = [];

const routes: Routes = [
  {
    path: '',
    component: HelpComponent,
    children: routeList,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpRoutingModule {
}
