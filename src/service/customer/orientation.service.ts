import {ConfigService} from '../config-service';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Global} from '../global';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class OrientationService extends ConfigService {
  constructor(_http: HttpClient, _global: Global) {
    super(_http, _global);
  }

  /**
   * 定向包列表数据接口
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  list(body = {}) {
    return this.get(`/ads/spread/directional/package/list`, body);
  }

  /**
   * 详情   入参 package_id
   * @param body
   * @returns {Observable<Result<any>>}
   */
  detail(body = {}) {
    return this.get(`/ads/spread/directional/package/get`, body);
  }

  /**
   * 删除   入参 package_ids
   * @param body
   * @returns {Observable<Result<any>>}
   */
  deleteOrientation(body = {}) {
    return this.get(`/ads/spread/directional/package/delete`, body);
  }

  /**
   * 新增
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  add(body = {}) {
    return this.postJson(`/ads/spread/directional/package/add`, body);
  }

  /**
   * 编辑
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  update(body = {}) {
    return this.postForm(`/ads/spread/directional/package/update`, body);
  }

}
