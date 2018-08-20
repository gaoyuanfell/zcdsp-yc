import {ConfigService} from '../config-service';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Global} from '../global';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class DirectionalService extends ConfigService {
  constructor(_http: HttpClient, _global: Global) {
    super(_http, _global);
  }

  /**
   * 省市数据接口 一线二线
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  provincesCities(body = {}) {
    return this.get(`/common/orientation/provinces_cities`, body)
  }

  /***
   * 根据lbs城市id查找lbs具体路径信息数据接口
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  lbsLocations(body = {}) {
    return this.get(`/common/orientation/lbs_locations`, body)
  }

  /**
   * App分类(行为分类)数据接口
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  appCategories(body = {}) {
    return this.get(`/common/orientation/app_categories`, body)
  }

  /**
   * App列表(行为指定、行为过滤)数据接口
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  appPageList(body = {}) {
    return this.get(`/common/orientation/app_page_list`, body)
  }

  /**
   * 人群定向接口
   * orientationCrowd
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  orientationCrowd(body = {}) {
    return this.get(`/common/orientation/crowd`, body)
  }

  /**
   * 设备定向数据接口
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  orientationDevice(body = {}) {
    return this.get(`/common/orientation/device`, body)
  }

  /**
   * 提供指定ID的定向包详细数据
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  getOrientationDetail(body = {}) {
    return this.get(`/common/orientation/get_orientation_detail`, body)
  }

  /***
   * 提供定向列表页面中列表数据
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  getOrientationPackages(body = {}) {
    return this.get(`/common/orientation/get_orientation_packages`, body)
  }

  /**
   * lbs区域数据接口
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  lbsTypeSceneCities(body = {}) {
    return this.get(`/common/orientation/lbs_type_scene_cities`, body)
  }

  /**
   * 新增定向包数据接口
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  addOrientation(body = {}) {
    return this.postJson(`/common/orientation/add_orientation_package`, body)
  }

  /**
   * 更新定向包数据接口
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  updateOrientation(body = {}) {
    return this.postJson(`/common/orientation/update_orientation_package`, body)
  }

}
