/**
 * Created by moka on 2017/6/19 0019.
 */
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PublicService} from '../service/public.service';

@Injectable({
  providedIn: 'root'
})
export class UserResolverService implements Resolve<any> {
  constructor(private router: Router, private _publicService: PublicService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this._publicService.newUser().pipe(
      map((res) => {
        if (res.success == 200) {
          return res.result;
        }
        return true;
      })
    );
  }
}
