import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ConfigService} from './config-service';
import {Global} from './global';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class TemplateService extends ConfigService {
  constructor(_http: HttpClient, _global: Global) {
    super(_http, _global);
  }

  /**
   * 创意模板 获取
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  getTemplate(body = {}) {
    return this.get(`/ads/spread/material/template/get/template`, body);
  }

  /**
   * 创意模板 保存
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  saveTemplate(body = {}) {
    return this.postJson(`/ads/spread/material/template/save`, body);
  }

  /**
   * 获取用户素材
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  userMaterial(body = {}) {
    return this.get(`/ads/spread/user/material`, body);
  }

  /**
   * 初始化类型
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  initTemplate(body = {}) {
    return this.get(`/ads/spread/material/template/init`, body);
  }

  /**
   * 获取创意素材
   * @returns {Observable<Result<any>>}
   */
  initTemplateMaterial(body = {}) {
    return this.get(`/ads/spread/material/template/get/material`, body);
  }

  /**
   * 获取模板类型
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  templateType(body = {}) {
    return this.get(`/ads/spread/material/template/type/init`, body);
  }

  /**
   * 获取用户历史素材
   * @returns {Observable<Result<any>>}
   */
  materialHistory(body = {}) {
    return this.get(`/ads/spread/user/material/history`, body);
  }

  //////////////////////////////////////////////////////////////////////

  /**
   * 保存修改落地页模板
   * @returns {Observable<Result<any>>}
   */
  // addEditLandingpage(body = {}) {
  //   return this.postJson(`/ads/spread/campaign/landingpage/add_edit`, body);
  // }

  /**
   * 加载系统落地页模板数据接口
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  // getSysTpls(body = {}) {
  //   return this.get(`/ads/spread/campaign/landingpage/get_sys_tpls`, body);
  // }

  /**
   * 加载广告主已保存的落地页模板数据接口
   * @param {{}} body need_limit
   * @returns {Observable<Result<any>>}
   */
  // getUserTpls(body = {}) {
  //   return this.get(`/ads/spread/campaign/landingpage/get_user_tpls`, body);
  // }

  /**
   * 加载所有（包含系统与用户）落地页模板数据接口
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  // getAllTpls(body = {}) {
  //   return this.get(`/ads/spread/campaign/landingpage/get_all_tpls`, body);
  // }

  /////////////////////////////////////////////////////////////////

  /**
   * 预览临时落地页
   * @returns {Observable<Result<any>>}
   */
  // templatePreview(body = {}) {
  //   return this.postJson(`/ads/spread/campaign/landingpage/preview`, body)
  // }

  /**
   * 获取指定地址的二维码
   * @param {{}} body
   * @returns {string}
   */
  // previewTpl(body = {}) {
  //   return this.getUrl(`/ads/spread/campaign/landingpage/preview_tpl`, body)
  // }


  ////////////////////////////////  new ////////////////////////////////////


  /**
   * 用户落地页下拉框
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  landingSelect(body = {}) {
    return this.get(`/ads/spread/landing/page/get/select`, body);
  }

  /**
   * 落地页面模板 id
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  landingGet(body = {}) {
    return this.get(`/ads/spread/landing/page/get`, body);
  }

  /**
   * 临时模板
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  landingPreviewGet(body = {}) {
    return this.get(`/ads/spread/landing/page/preview/get`, body);
  }

  /**
   * 系统模板列表
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  landingSystem(body = {}) {
    return this.get(`/ads/spread/landing/page/get/system`, body);
  }

  /**
   * 用户模板列表
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  landingUser(body = {}) {
    return this.get(`/ads/spread/landing/page/get/user`, body);
  }

  /**
   * 新增
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  landingAdd(body = {}) {
    return this.postJson(`/ads/spread/landing/page/add`, body);
  }

  /**
   * 二维码
   * @param {{}} body
   * @returns {string}
   */
  landingQrcode(body = {}) {
    return this.getUrl(`/ads/spread/landing/page/qrcode`, body);
  }

  /**
   * 落地页预览 获取临时落地页
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  landingPreview(body = {}) {
    return this.postJson(`/ads/spread/landing/page/preview`, body);
  }

}
