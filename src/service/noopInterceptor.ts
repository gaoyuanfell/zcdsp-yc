import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Notification} from '../components/notification/notification';
import {Global} from './global';
import {Loading} from '../components/loading/loading.service';

@Injectable()
export class NoopInterceptor implements HttpInterceptor {
  constructor(private _router: Router, private _notification: Notification, private _global: Global, private _loading: Loading) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this._loading.open();
    req = req.clone({headers: req.headers});
    if (this._global.token) {
      req = req.clone({setHeaders: {token: this._global.token}});
    }
    let xhr = next.handle(req);
    return xhr.pipe(
      tap(response => {
        if (response instanceof HttpResponse) {
          if (response.type === 4) {
            this._loading.close();
            if (response.status == 200) {
              // TODO 页面跳转逻辑 接口提示
              if (response.body.success == 500) {
                let message = response.body.errorList ? response.body.errorList[0]._description : response.body.result;
                this._notification.error('提示', message);
                throw response.body;
              }
              if (response.body.success == 401) {
                this._router.navigate(['/']);
                throw response.body;
              }
              if (response.body.success == 403) {
                this._notification.warning('提示', '暂无权限！');
                throw response.body;
              }
              if (response.body.success == 300) {
                throw response.body;
              }
            } else {
              this._notification.error('提示', '系统错误');
            }
          }
        }
      }),
      catchError((err, caught) => {
        this._loading.closeAll();
        throw err;
      })
    );
  }
}
