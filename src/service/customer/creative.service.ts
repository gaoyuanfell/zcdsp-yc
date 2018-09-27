import {ConfigService} from '../config-service';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Global} from '../global';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class CreativeService extends ConfigService {
  constructor(_http: HttpClient, _global: Global) {
    super(_http, _global);
  }

  creativeUrl(body = {}) {
    return this.getUrl(`/ads/spread/creative/list/export`, body);
  }

  list(body = {}) {
    return this.get(`/ads/spread/creative/list`, body);
  }

  init(body = {}) {
    return this.get(`/ads/spread/creative/list/init`, body);
  }

  /**
   * 修改定向
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  updateDirection(body = {}) {
    return this.postJson(`/ads/spread/creative/update/direction`, body);
  }

  /**
   * 修改创意名称
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  updateName(body = {}) {
    return this.postForm(`/ads/spread/creative/update/name`, body);
  }

  /**
   * 批量修改投放状态
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  updateState(body = {}) {
    return this.postJson(`/ads/spread/creative/update/state`, body);
  }

  /**
   * 创意列表 - 批量修改投放时间
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  updateShowHours(body = {}) {
    return this.postJson(`/ads/spread/creative/update/showHours`, body);
  }

  /**
   * 批量修改价格
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  updatePrice(body = {}) {
    return this.postJson(`/ads/spread/creative/update/price`, body);
  }

  /**
   * 批量提交审核
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  submitAudit(body = {}) {
    return this.postJson(`/ads/spread/creative/submit/audit`, body);
  }

  /**
   * 批量删除
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  creativeDelete(body = {}) {
    return this.postJson(`/ads/spread/creative/delete`, body);
  }

  /**
   * 投放小时的修改
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  batchUpdateHours(body = {}) {
    return this.postJson(`/ads/spread/creative/update/showHours`, body);
  }

  /**
   * 创意复制
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  creativeCopy(body = {}) {
    return this.postJson(`/ads/spread/creative/copy`, body);
  }

  ////////////////////////     add and edit      //////////////////////////////

  /**
   * 自选媒体样式价格推荐
   * @param {{}} body media_material_id
   * @returns {Observable<Result<any>>}
   */
  recommendPrice(body = {}) {
    return this.get(`/ads/spread/creative/recommend/price`, body);
  }

  /**
   * 新建创意 - 页面初始化
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  addInit(body = {}) {
    return this.get(`/ads/spread/creative/add/init`, body);
  }

  /**
   * 新增创意
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  addCreative(body = {}) {
    return this.postJson(`/ads/spread/creative/add`, body);
  }

  /**
   * 获取活动下拉
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  campaignList(body = {}) {
    return this.get(`/ads/spread/creative/campaign/list`, body);
  }

  /**
   * 创意上传
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  creativeUpload(body = {}) {
    return this.postFormData(`/ws-api/v4/creative/upload`, body);
  }

  /**
   * logo上传
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  logoUpload(body = {}) {
    return this.postFormData(`/ws-api/v4/creative/logo/upload`, body);
  }

  /**
   * 列表图标
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  creativeDetail(body = {}) {
    return this.get(`/ads/spread/creative/detail`, body);
  }


  /**
   * 编辑初始化
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  updateInit(body = {}) {
    return this.get(`/ads/spread/creative/update/init`, body);
  }

  /**
   * 创意编辑提交
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  editSave(body = {}) {
    return this.postJson(`/ads/spread/creative/update`, body);
  }

  dynamicWords(body = {}) {
    return this.get(`/ads/spread/creative/dynamicWords`, body);
  }

  /**
   *
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  creativeDetailUpdate(body = {}) {
    return this.postJson(`/ads/spread/creative/detail/update`, body);
  }

}
