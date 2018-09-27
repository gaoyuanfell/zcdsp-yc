import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingPageComponent} from './landing-page.component';

const routeList: Routes = [];

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    children: routeList,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingPageRoutingModule {
}
