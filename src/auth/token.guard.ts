/**
 * Created by moka on 2017/6/19 0019.
 */
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Global} from '../service/global';
import * as Url from 'url';

@Injectable({
  providedIn: 'root'
})
export class TokenGuard implements CanActivate, CanActivateChild, CanLoad {

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  constructor(private router: Router, private _global: Global) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    let token = route.queryParamMap.get('token');
    if (token) {
      this._global.token = token;
    }
    let _token = this._global.token;
    if (_token && !token) {
      this.router.navigate([Url.parse(state.url).pathname], {queryParams: {token: _token, ...route.queryParams}, replaceUrl: false});
      return false;
    }
    return true;
  }

  // 子路由守护
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    return this.canActivate(childRoute, state);
  }
}
