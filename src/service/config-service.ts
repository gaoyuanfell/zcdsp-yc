import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as qs from 'querystring';
import {Observable} from 'rxjs';
import {Result} from '../app/model';
import {environment} from '../environments/environment';
import {Global} from './global';

export class ConfigService {
  static baseUrl = environment.BASE_API;
  static upload = environment.UPLOAD;

  constructor(private _http: HttpClient, private _global: Global) {

  }

  configForm() {
    return new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
  }

  configJson() {
    return new HttpHeaders().set('Content-Type', 'application/json');
  }

  postForm<T>(url, body = {}, config = {}): Observable<Result<T>> {
    return this._http.post<T>(ConfigService.baseUrl + url, qs.stringify(body), {headers: this.configForm(), ...config});
  }

  postFormData<T>(url, body = {}, config = {}): Observable<Result<T>> {
    const f = new FormData();
    Object.keys(body).every(i => {
      f.append(i, body[i]);
      return true;
    });
    return this._http.post<T>(ConfigService.upload + url, f, {...config});
  }

  postJson<T>(url, body = {}, config = {}): Observable<Result<T>> {
    return this._http.post<T>(ConfigService.baseUrl + url, body, {headers: this.configJson(), ...config});
  }

  get<T>(url, body: any = {}, config = {}): Observable<Result<T>> {
    body._ = Date.now();
    return this._http.get<T>(`${ConfigService.baseUrl + url}?${qs.stringify(body)}`, config);
  }

  get2<T>(url, body: any = {}, config = {}): Observable<Result<T>> {
    body._ = Date.now();
    return this._http.get<T>(`${ConfigService.upload + url}?${qs.stringify(body)}`, config);
  }

  getUrl(url, body: any = {}): string {
    let token = this._global.token;
    if (token && !body.token) {
      body.token = token;
    }
    let search = qs.stringify(body);
    if (search) {
      return ConfigService.baseUrl + url + '?' + search;
    }
    return ConfigService.baseUrl + url;
  }
}
