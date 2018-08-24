import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingPageComponent} from './landing-page.component';
import {CurrentResolverService} from '../../auth/current-resolver-service';
import {TokenGuard} from '../../auth/token.guard';

const routeList: Routes = [];

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    canActivate: [TokenGuard],
    resolve: {auth: CurrentResolverService},
    children: routeList,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingPageRoutingModule {
}
