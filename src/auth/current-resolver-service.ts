/**
 * Created by moka on 2017/6/19 0019.
 */
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PublicService} from '../service/public.service';

export interface AuthData {
  user?;
  jurisdiction?;
}

@Injectable({
  providedIn: 'root'
})
export class CurrentResolverService implements Resolve<any> {
  constructor(private router: Router, private _publicService: PublicService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AuthData> {
    let current = route.data.current;
    return this._publicService.current({pcode: current}).pipe(
      map((res) => {
        if (res.success == 200) {
          return res.result;
        }
        return {jurisdictionList: [], user: {}};
      })
    );
  }
}
