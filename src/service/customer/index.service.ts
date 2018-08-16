import {ConfigService} from '../config-service';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Global} from '../global';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class IndexService extends ConfigService {
  constructor(_http: HttpClient, _global: Global) {
    super(_http, _global);
  }

  /**
   * 页面加载接口
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  init(body = {}) {
    return this.get(`/ads/home/init`, body);
  }

  /**
   * 首页今日在投活动列表数据接口
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  campaignList(body = {}) {
    return this.get(`/ads/home/campaign/list`, body);
  }

  /**
   * 首页今日在投活动投放图表数据接口
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  campaignChart(body = {}) {
    return this.get(`/ads/home/campaign/chart`, body);
  }

  /**
   * 首页今日在投创意投放列表数据接口
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  creativeList(body = {}) {
    return this.get(`/ads/home/creative/list`, body);
  }

  /**
   * 首页今日在投创意投放图表数据接口
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  creativeChart(body = {}) {
    return this.get(`/ads/home/creative/chart`, body);
  }

  /**
   * 历史数据 - 数据趋势
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  dayTotal(body = {}) {
    return this.get(`/ads/home/day/total`, body);
  }

  /**
   * 小时报表拆线（选中一条历史投放数据）
   * @param {{}} body date 开始日期（如：2018-05-22）
   * @returns {Observable<Result<any>>}
   */
  dayHourChart(body = {}) {
    return this.get(`/ads/home/day/hourChart`, body);
  }

  /**
   * 修改日预算 参数：money 数字，精度2位
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  dayMoneyUpdate(body = {}) {
    return this.postForm(`/ads/home/dayMoney/update`, body);
  }
}
