import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Global} from './global';

@Injectable()
export class NoopInterceptor implements HttpInterceptor {
  constructor(private _router: Router, private _global: Global) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    req = req.clone({headers: req.headers});
    if (this._global.token) {
      req = req.clone({setHeaders: {token: this._global.token}});
    }
    let xhr = next.handle(req);
    return xhr.pipe(
      tap(response => {
        if (response instanceof HttpResponse) {
          if (response.type === 4) {
            if (response.status == 200) {
              // TODO 页面跳转逻辑 接口提示
              if (response.body.success == 500) {
                let message = response.body.errorList ? response.body.errorList[0]._description : response.body.result;
                throw response.body;
              }
              if (response.body.success == 401) {
                this._router.navigate(['/login']);
                throw response.body;
              }
              if (response.body.success == 403) {
                throw response.body;
              }
            }
          }
        }
      }),
      catchError((err, caught) => {
        throw err;
      })
    );
  }
}
