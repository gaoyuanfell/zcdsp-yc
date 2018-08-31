/**
 * Created by moka on 2017/6/19 0019.
 */
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Global} from '../service/global';
import {map} from 'rxjs/operators';
import {PublicService} from '../service/public.service';
import {AppState} from '../store/model';
import {select, Store} from '@ngrx/store';
import {MenuState} from '../store/model/menu.state';
import * as MenuAction from '../store/actions/menu.action';

@Injectable({
  providedIn: 'root'
})
export class MenuGuard implements CanActivate, CanActivateChild, CanLoad {

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  menuState$: Observable<MenuState>;
  menuState

  constructor(private router: Router,
              private $store: Store<AppState>,
              private _publicService: PublicService,
              private _global: Global) {
    this.menuState$ = $store.pipe(select('menu'));
    this.menuState$.subscribe(state => {
      this.menuState = state;
    });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    return this._publicService.menus().pipe(
      map(res => {
        if (res.success === 200) {
          const menu = res.result;
          menu.forEach((m, i) => {
            const bo = m.code === 'ZCMOBI_ADS_USER' || m.code === 'ZCMOBI_US_USER';
            if (bo) {
              this._global.userMenu = m;
              menu.splice(i, 1);
            }
          });
          this._global.menus = menu;
          this.$store.dispatch(new MenuAction.AssignMenu(menu));
          return true;
        }
        return false;
      })
    );
  }

  // 子路由守护
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    return this.canActivate(childRoute, state);
  }
}
