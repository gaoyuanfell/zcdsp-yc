import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ConfigService} from './config-service';
import {Global} from './global';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class PublicService extends ConfigService {
  constructor(_http: HttpClient, _global: Global) {
    super(_http, _global);
  }

  /**
   *
   * @param {{}} body {username,password,veritycode}
   * @returns {Observable<Result<any>>}
   */
  login(body = {}) {
    return this.postForm('/jurisdiction/login', body);
  }

  /**
   *  发送短信或邮件验证码，用于执行找回密码的更新密码步骤前
   * @param {{}} body {username,password,veritycode}
   * @returns {Observable<Result<any>>}
   */
  send(body = {}) {
    return this.postForm('/jurisdiction/send/verifycode', body);
  }

  customer(body = {}) {
    return this.postJson('/jurisdiction/customer', body);
  }

  /**
   *  验证用户填写的验证码是否和邮箱或者短信发的验证码一致
   * @param {{}} body {username,password,veritycode}
   * @returns {Observable<Result<any>>}
   */
  checkVerifycode(body = {}) {
    return this.postForm('/jurisdiction/check/verifycode', body);
  }

  /**
   *  验证用户填写的验证码是否和邮箱或者短信发的验证码一致
   * @param {{}} body {username,password,veritycode}
   * @returns {Observable<Result<any>>}
   */
  resetPassword(body = {}) {
    return this.postForm('/jurisdiction/reset/password', body);
  }

  /**
   * 用户权限接口
   * @param {{}} body {pcode}
   * @returns {Observable<Result<any>>}
   */
  current(body = {}) {
    return this.get(`/jurisdiction/current`, body);
  }

  /**
   * 用户权限接口(菜单接口扩展)
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  menus(body = {}) {
    return this.get(`/jurisdiction/menus`, body);
  }

  /**
   * sublogin
   * @param {{}} body {user_id}
   * @returns {Observable<Result<any>>}
   */
  sublogin(body = {}) {
    return this.get(`/jurisdiction/sublogin`, body);
  }

  /**
   * 验证码接口
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  verifyCode(body = {}) {
    return this.getUrl(`/verifyCode`, body);
  }

  /**
   * 注册验证码接口
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  RegisterVerifyCode(body = {}) {
    return this.get(`/jurisdiction/sms/verifycode`, body);
  }

  /**
   * 注册接口
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  register(body = {}) {
    return this.postJson('/jurisdiction/register', body, {});
  }

  /**
   * 判断账户是否存在
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */

  existUser(body = {}) {
    return this.get(`/jurisdiction/exist/user`, body);
  }

  /**
   * 退出
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  quit(body = {}) {
    return this.get(`/jurisdiction/quit`, body);
  }

  /**
   * 全网折线图数据
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  // 今日全网数据接口
  allNetWork(body = {}) {
    return this.get(`/common/flowstat/allNetWork`, body);
  }

  /**
   *
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  // 媒体流量top5，性别占比，年龄比例，兴趣爱好，地域流量top10，地域流量分布图数据
  otherData(body = {}) {
    return this.get(`/common/flowstat/otherData`, body);
  }

  /**
   * 可覆盖人数数据接口
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  getAudienceCount(body = {}) {
    return this.postJson(`/common/directional/audience/count`, body);
  }

  /**
   * img文件上传
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  imgUpload(body = {}) {
    return this.postFormData(`/ws-api/v4/common/img`, body);
  }

  /**
   * 非图片文件上传
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   */
  fileUpload(body = {}) {
    return this.postFormData(`/ws-api/v4/common/file`, body);
  }

  /**
   * 视频文件上传
   * @param {{}} body file chunk chunk_size guid chunks
   * @returns {Observable<Result<any>>}
   */
  videoUpload(body = {}) {
    return this.postFormData(`/ws-api/v4/common/video`, body);
  }


  /**
   * 进入对应直客账户
   * @param {{}} body
   * @returns {string}
   */
  goHome(body = {}) {
    return this.getUrl('/ads/home', body);
  }

  /**
   * 直客新增活动
   * @param {{}} body
   * @returns {string}
   */
  goAct(body = {}) {
    return this.getUrl('/ads/spread/campaign-add/0', body);
  }

  /**
   *
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   * {key:'not_recharge'}
   */
  newUser(body = {}) {
    return this.get(`/financeinfo/user_status`, body);
  }

  /**
   *活動 点击查看动态词
   * @param {{}} body
   * @returns {Observable<Result<any>>}
   * key: 'not_childs'
   */
  dynamicWords(body = {}) {

    return this.get(`/ads/spread/creative/dynamicWords`, body);
  }


}
