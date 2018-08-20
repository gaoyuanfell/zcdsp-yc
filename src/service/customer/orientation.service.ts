import {ConfigService} from '../config-service';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Global} from "../global";

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
    return this.get(`/common/orientation/get_orientation_packages`, body)
  }

  /**
   * 批量删除定向包接口
   * @param {{}} body package_ids
   * @returns {Observable<Result<any>>}
   */
  deleteOrientation(body = {}) {
    return this.postForm(`/common/orientation/batch_delete_orientation_package`, body)
  }
}
