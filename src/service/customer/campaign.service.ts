import {ConfigService} from '../config-service';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Global} from '../global';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class CampaignService extends ConfigService {
  constructor(_http: HttpClient, _global: Global) {
    super(_http, _global);
  }

  /**
   * 活动 导出
   * @param {{}} body
   * @returns {string}
   */
  campaignUrl(body = {}) {
    Reflect.deleteProperty(body, 'page_index');
    Reflect.deleteProperty(body, 'page_size');
    return this.getUrl(`/ads/spread/campaign/list/export`, body);
  }

  init(body = {}) {
    return this.get(`/ads/spread/campaign/init`, body);
  }

  list(body = {}) {
    return this.get(`/ads/spread/campaign/list`, body);
  }

  /**
   * 批量复制活动接口
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  batchCopy(body = {}) {
    return this.postJson(`/ads/spread/campaign/batch_copy`, body);
  }

  /**
   * 批量修改活动投放小时接口
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  batchUpdateHours(body = {}) {
    return this.postJson(`/ads/spread/campaign/batch_update_show_hours`, body);
  }

  /**
   * 批量修改活动投放日期接口
   * @param {{}} body
   */
  batchUpdateBeginEndDate(body = {}) {
    return this.postForm(`/ads/spread/campaign/batch_update_begin_end_date`, body);
  }

  batchAddUpdate(body = {}) {
    return this.postJson(`/common/orientation/campaign/batch_add_update`, body);
  }

  /**
   * 批量修改活动投放速度接口
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  batchUpdateSpeed(body = {}) {
    return this.postForm(`/ads/spread/campaign/batch_update_speed`, body);
  }

  /**
   * 批量删除活动接口
   * @param {{}} body
   */
  batchDelete(body = {}) {
    return this.postForm(`/ads/spread/campaign/batch_delete`, body);
  }

  /**
   * 批量修改活动出价接口
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  batchUpdatePrice(body = {}) {
    return this.postForm(`/ads/spread/campaign/batch_update_price`, body);
  }

  /**
   * 批量修改活动投放状态接口
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  batchUpdateState(body = {}) {
    return this.postForm(`/ads/spread/campaign/batch_update_show_state`, body);
  }

  /**
   * 批量修改活动预算接口
   * @returns {Observable<Result<any>>}
   */
  batchUpdateBudget(body = {}) {
    return this.postForm(`/ads/spread/campaign/batch_update_budget`, body);
  }

  /**
   * 修改活动名称接口
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  updateName(body = {}) {
    return this.postJson(`/ads/spread/campaign/update_name`, body);
  }

  /**
   * 活动详情信息
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  campaignDetail(body = {}) {
    return this.get(`/ads/spread/campaign/campaign_detail`, body);
  }

  /**
   * adpush_char_data
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  charData(body = {}) {
    return this.get(`/ads/spread/campaign/adpush_char_data`, body);
  }

  ///////////////  add   ////////////////
  /**
   * 新增/编辑 初始化数据接口
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  addEditInit(body = {}) {
    return this.get(`/ads/spread/campaign/add_edit/init`, body);
  }

  /**
   * 执行新增或更新活动接口
   * @returns {Observable<Result<any>>}
   */
  save(body = {}) {
    return this.postJson(`/ads/spread/campaign/add_edit/execute`, body);
  }

  /**
   * 解析IOS参数接口
   * @param {{}} body appid
   * @returns {Observable<Result<any>>}
   */
  parseIos(body = {}) {
    return this.get(`/ads/spread/campaign/add_edit/parse_ios`, body);
  }

  /**
   * 安卓apk 重复验证
   * @returns {Observable<Result<any>>}
   */
  apkExisted(body = {}) {
    return this.get2(`/ws-api/v4/apk/is_apk_existed`, body);
  }

  /**
   * 上传并解析安卓apk文件接口
   * @param {{}} body
   * @returns {Observable<Result<any>>}  /ws-api/v4/apk/upload
   */
  uploadParseApk(body = {}) {
    return this.postFormData(`/ws-api/v4/apk/upload_apk`, body);
  }

  /** campaign_ids
   * 每一个活动的今日消耗
   */
  get_day_consume(body = {}) {
    return this.get(`/ads/spread/campaign/get_day_consume`, body);
  }

}
