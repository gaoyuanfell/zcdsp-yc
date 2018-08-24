import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TemplatePageComponent} from './template-page.component';
import {TokenGuard} from '../../auth/token.guard';
import {CurrentResolverService} from '../../auth/current-resolver-service';

const routeList: Routes = [];

const routes: Routes = [
  {
    path: '',
    component: TemplatePageComponent,
    canActivate: [TokenGuard],
    resolve: {auth: CurrentResolverService},
    children: routeList,
    data: {system: 'N'}
  },
  {
    path: 'system',
    component: TemplatePageComponent,
    canActivate: [TokenGuard],
    resolve: {auth: CurrentResolverService},
    children: routeList,
    data: {system: 'Y'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplatePageRoutingModule {
}
